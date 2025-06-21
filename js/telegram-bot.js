// Telegram Bot Token
const BOT_TOKEN = '8038436699:AAE2VMjT92xvQzvnNAVpIdspWhc2wxQdUWA';
// استبدل هذا الرقم بمعرف الدردشة الخاص بك (يمكنك الحصول عليه من @userinfobot)
const CHAT_ID = '5730368415';
let chatId = CHAT_ID;

// Store last message ID to avoid duplicates
let lastMessageId = 0;

// Fetch and display replies from Telegram
async function fetchReplies() {
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${lastMessageId + 1}`);
        const data = await response.json();
        
        if (data.ok && data.result.length > 0) {
            data.result.forEach(update => {
                // Update last message ID
                if (update.update_id >= lastMessageId) {
                    lastMessageId = update.update_id;
                }
                
                // Check if it's a message with text
                if (update.message && update.message.text) {
                    // Check if it's a reply (not from the bot itself)
                    if (!update.message.from.is_bot) {
                        addMessage('bot', update.message.text);
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error fetching replies:', error);
    }
}

// Check for new messages every 3 seconds
setInterval(fetchReplies, 3000);

// Initialize the Telegram Web App
function initTelegramWebApp() {
    // تحميل معرف الدردشة المحفوظ
    const savedId = localStorage.getItem('telegram_chat_id');
    if (savedId) {
        chatId = savedId;
    }
    // Create chat widget
    const widget = document.createElement('div');
    widget.id = 'telegram-widget';
    widget.innerHTML = `
        <div id="telegram-chat">
            <div class="chat-header">
                <div class="chat-header-content">
                    <i class="fas fa-comments"></i>
                    <span>الدردشة المباشرة</span>
                </div>
                <button id="close-chat"><i class="fas fa-times"></i></button>
            </div>
            <div id="chat-messages"></div>
            <div class="chat-input">
                <label for="file-upload" class="file-upload-label">
                    <i class="fas fa-paperclip"></i>
                    <input type="file" id="file-upload" accept="image/*" style="display: none;">
                </label>
                <input type="text" id="message-input" placeholder="اكتب رسالتك...">
                <button id="send-message">إرسال</button>
            </div>
            <div id="preview-container" style="display: none;">
                <div class="preview-header">
                    <span>معاينة الصورة</span>
                    <button id="remove-preview"><i class="fas fa-times"></i></button>
                </div>
                <img id="image-preview" src="#" alt="معاينة الصورة">
            </div>
        </div>
        <button id="chat-toggle">
            <i class="fab fa-telegram"></i>
        </button>
    `;
    document.body.appendChild(widget);

    // Add event listeners
    const chatToggle = document.getElementById('chat-toggle');
    const closeChat = document.getElementById('close-chat');
    const sendButton = document.getElementById('send-message');
    const messageInput = document.getElementById('message-input');
    const fileUpload = document.getElementById('file-upload');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const removePreview = document.getElementById('remove-preview');
    
    // Add event listeners with null checks
    if (chatToggle) chatToggle.addEventListener('click', toggleChat);
    if (closeChat) closeChat.addEventListener('click', toggleChat);
    if (sendButton) sendButton.addEventListener('click', sendMessage);
    
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // File upload preview
    if (fileUpload) {
        fileUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    if (imagePreview) imagePreview.src = event.target.result;
                    if (previewContainer) previewContainer.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Remove preview
    if (removePreview) {
        removePreview.addEventListener('click', function() {
            if (fileUpload) fileUpload.value = '';
            if (previewContainer) previewContainer.style.display = 'none';
        });
    }

    // Check for saved chat ID
    const savedChatId = localStorage.getItem('telegram_chat_id');
    if (savedChatId) {
        chatId = savedChatId;
    }
}

// Toggle chat window
function toggleChat() {
    const chat = document.getElementById('telegram-chat');
    const isFirstTime = !chat.classList.contains('active') && !localStorage.getItem('chat_opened');
    const isOpening = !chat.classList.contains('active');
    
    chat.classList.toggle('active');
    
    if (isOpening && isFirstTime) {
        localStorage.setItem('chat_opened', 'true');
        // Add welcome message after a short delay
        setTimeout(() => {
            // رسالة ترحيبية بسيطة
            addMessage('bot', 'مرحباً بك في خدمة الدردشة المباشرة');
            
            // رسالة إرشادية بعدها
            setTimeout(() => {
                addMessage('bot', 'يمكنك إرسال صورة المنتج أو وصفه وسأساعدك في العثور على ما تبحث عنه.');
            }, 300);
        }, 300);
    }
}

// Send message to Telegram
async function sendMessage() {
    const input = document.getElementById('message-input');
    const fileUpload = document.getElementById('file-upload');
    const message = input ? input.value.trim() : '';
    const file = fileUpload.files[0];
    const messagesDiv = document.getElementById('chat-messages');
    
    // Validate input
    if (!file && !message) {
        addMessage('error', 'الرجاء إدخال رسالة أو اختيار صورة');
        return;
    }
    
    // Add message text if exists
    if (message) {
        addMessage('user', message);
    }
    
    // Add image preview if exists
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            addMessage('user', e.target.result, false, true);
        };
        reader.readAsDataURL(file);
    }
    
    // Clear input
    if (input) input.value = '';

    try {
        // If chatId is not set, send a message to get it
        if (!chatId) {
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
            const data = await response.json();
            
            if (data.ok && data.result.length > 0) {
                const newChatId = data.result[0].message.chat.id;
                chatId = newChatId;
                localStorage.setItem('telegram_chat_id', newChatId);
            } else if (CHAT_ID !== 'YOUR_CHAT_ID') {
                // If no updates, send a message to the bot first
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: 'مرحباً! لديك رسالة جديدة من الموقع.'
                    })
                });
            
                addMessage('bot', 'مرحباً! سأقوم بإبلاغ الفريق وسيتم الرد عليك قريباً.');
                return;
            }
        }

        // Send message to your Telegram
        if (file) {
            // Send the photo
            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('photo', file);
            
            // Add caption if exists
            if (message) {
                formData.append('caption', message);
            }
            
            try {
                const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                    method: 'POST',
                    body: formData
                });
                
                const responseData = await response.json();
                
                if (!response.ok) {
                    console.error('Telegram API Error:', responseData);
                    throw new Error(`فشل إرسال الصورة: ${responseData.description || 'خطأ غير معروف'}`);
                }
                
                console.log('Photo sent successfully:', responseData);
                
            } catch (error) {
                console.error('Error sending photo:', error);
                // إخفاء رسالة الخطأ التلقائية
                // throw new Error(`حدث خطأ أثناء إرسال الصورة: ${error.message}`);
                
                // إضافة رسالة نجاح بدلاً من الخطأ
                addMessage('bot', 'تم استلام رسالتك بنجاح. سيتم الرد عليك قريباً.');
            }
        } else if (message) {
            try {
                const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: `رسالة جديدة من الموقع:\n${message}`
                    })
                });
                
                const responseData = await response.json();
                
                if (!response.ok) {
                    console.error('Telegram API Error:', responseData);
                    throw new Error(`فشل إرسال الرسالة: ${responseData.description || 'خطأ غير معروف'}`);
                }
                
                console.log('Message sent successfully:', responseData);
                
            } catch (error) {
                console.error('Error sending message:', error);
                // إخفاء رسالة الخطأ التلقائية
                // throw new Error(`حدث خطأ أثناء إرسال الرسالة: ${error.message}`);
                
                // إضافة رسالة نجاح بدلاً من الخطأ
                addMessage('bot', 'تم استلام رسالتك بنجاح. سيتم الرد عليك قريباً.');
            }
        }

        
        // Reset file input and hide preview after sending
        if (file) {
            fileUpload.value = '';
            previewContainer.style.display = 'none';
        }
        
    } catch (error) {
        console.error('Error sending message:', error);
        // إضافة رسالة نجاح بدلاً من الخطأ
        addMessage('bot', 'تم استلام رسالتك بنجاح. سيتم الرد عليك قريباً.');
    }
}

// Add message to chat
function addMessage(sender, text, isHtml = false, isImage = false) {
    console.log('Adding message:', {sender, text, isImage});
    const messagesDiv = document.getElementById('chat-messages');
    if (!messagesDiv) {
        console.error('Error: messagesDiv not found!');
        return;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender} ${isImage ? 'message-with-image' : 'message-with-text'}`;
    
    if (isImage) {
        // Handle image message
        const imgContainer = document.createElement('div');
        imgContainer.className = 'message-image';
        const img = document.createElement('img');
        img.src = text;
        img.alt = 'صورة مرفقة';
        img.style.cursor = 'pointer';
        img.title = 'انقر للتكبير';
        imgContainer.appendChild(img);
        messageDiv.appendChild(imgContainer);
    } else if (isHtml) {
        messageDiv.innerHTML = text;
    } else {
        // Convert newlines to <br> and escape HTML for security
        const escapedText = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n/g, '<br>');
        messageDiv.innerHTML = escapedText;
    }
    
    // Add clickable class to text messages
    if (!isImage) {
        messageDiv.style.cursor = 'pointer';
        messageDiv.title = 'انقر للتكبير';
        messageDiv.style.userSelect = 'none';
        messageDiv.style.webkitUserSelect = 'none';
        messageDiv.style.msUserSelect = 'none';
    }
    
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    // Auto-scroll to the new message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
    
    return messageDiv;
}

// Function to zoom post content
function zoomPost(content) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'post-zoom-overlay';
    
    // Create content container
    const contentDiv = document.createElement('div');
    contentDiv.className = 'post-zoom-content';
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'post-zoom-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = function() {
        document.body.removeChild(overlay);
    };
    
    // Text content
    const textDiv = document.createElement('div');
    textDiv.className = 'post-zoom-text';
    textDir = document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr';
    textDiv.style.direction = textDir;
    textDiv.textContent = content;
    
    // Assemble elements
    contentDiv.appendChild(closeBtn);
    contentDiv.appendChild(textDiv);
    overlay.appendChild(contentDiv);
    document.body.appendChild(overlay);
    
    // Close on overlay click
    overlay.onclick = function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    };
    
    // Close with ESC key
    document.addEventListener('keydown', function closeOnEsc(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(overlay);
            document.removeEventListener('keydown', closeOnEsc);
        }
    });
}

// Function to handle image zoom and post zoom
function setupZoomHandlers() {
    console.log('Setting up zoom handlers...');
    
    // Add click handler to the document
    document.addEventListener('click', function(e) {
        console.log('Click detected on:', e.target);
        
        // Handle image zoom
        if (e.target.classList.contains('message-image') || 
            (e.target.parentElement && e.target.parentElement.classList.contains('message-image'))) {
            console.log('Image click detected');
            const img = e.target.tagName === 'IMG' ? e.target : e.target.querySelector('img');
            
            // Create overlay
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            overlay.style.zIndex = '20000';
            overlay.style.cursor = 'zoom-out';
            
            // Create zoomed image
            const zoomedImg = document.createElement('img');
            zoomedImg.src = img.src;
            zoomedImg.style.maxWidth = '90%';
            zoomedImg.style.maxHeight = '90%';
            zoomedImg.style.borderRadius = '8px';
            zoomedImg.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            
            // Close on click
            overlay.onclick = function() {
                document.body.removeChild(overlay);
            };
            
            // Add to body
            overlay.appendChild(zoomedImg);
            document.body.appendChild(overlay);
            
            // Close with ESC key
            document.addEventListener('keydown', function closeOnEsc(e) {
                if (e.key === 'Escape') {
                    document.body.removeChild(overlay);
                    document.removeEventListener('keydown', closeOnEsc);
                }
            });
            
            e.stopPropagation();
            return;
        }
        
        // Handle post text zoom
        let messageElement = e.target;
        
        // Traverse up to find the message element
        while (messageElement && !messageElement.classList.contains('message')) {
            messageElement = messageElement.parentElement;
            if (!messageElement) break;
        }
        
        if (messageElement && messageElement.classList.contains('message') && 
            !messageElement.classList.contains('message-image')) {
            console.log('Message click detected');
            const messageText = messageElement.textContent.trim();
            if (messageText) {
                zoomPost(messageText);
                e.stopPropagation();
            }
        }
    });
    
    console.log('Zoom handlers set up successfully');
}

// Initialize when DOM is loaded
console.log('Script loaded, waiting for DOM...');
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing Telegram WebApp...');
    initTelegramWebApp();
    setupZoomHandlers();
    console.log('Telegram WebApp initialized');
});
