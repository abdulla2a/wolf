// تهيئة سلة التسوق
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartItemsList = document.getElementById('cartItemsList');
const productsTotalElement = document.getElementById('productsTotal');
const shippingCostElement = document.getElementById('shippingCost');
const totalAmountElement = document.getElementById('totalAmount');
const checkoutForm = document.getElementById('checkoutForm');
const submitButton = document.querySelector('.submit-order');
const modal = document.getElementById('successModal');
const closeModal = document.querySelector('.close');

// رسوم التوصيل حسب المدينة
const shippingRates = {
    'دهوك': 2000,
    'ضواحي دهوك': 3000,
    'زاخو': 4000,
    'أربيل': 5000,
    'السليمانية': 5000,
    'بغداد': 5000,
    'باقي المحافظات': 5000
};

// تحديث عداد السلة
function updateCartCount() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const count = cart.reduce((total, item) => total + (item.quantity || 0), 0);
        
        // تحديث عداد شريط التنقل
        document.querySelectorAll('.cart-count').forEach(element => {
            element.textContent = count;
        });
        
        // تحديث العداد العائم للجوال
        const floatingCount = document.querySelector('.floating-cart-count');
        if (floatingCount) {
            floatingCount.textContent = count;
            floatingCount.style.display = count > 0 ? 'flex' : 'none';
        }
        
        // تحديث زر التأكيد
        if (submitButton) {
            submitButton.disabled = count === 0;
        }
        
        // إرسال حدث لتحديث الصفحات الأخرى المفتوحة
        const updateEvent = new Event('cartUpdated');
        window.dispatchEvent(updateEvent);
        
        return count;
    } catch (error) {
        console.error('خطأ في تحديث عداد السلة:', error);
        return 0;
    }
}

// تحديث سعر التوصيل
function updateShippingCost() {
    const citySelect = document.getElementById('city');
    const city = citySelect.value;
    const shippingCost = city ? shippingRates[city] : 0;
    shippingCostElement.textContent = shippingCost.toLocaleString() + ' د.ع';
    return shippingCost;
}

// تحديث الإجمالي
function updateTotals() {
    const productsTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shippingCost = updateShippingCost();
    const total = productsTotal + shippingCost;

    productsTotalElement.textContent = productsTotal.toLocaleString() + ' د.ع';
    totalAmountElement.textContent = total.toLocaleString() + ' د.ع';
}

// عرض المنتجات في السلة
function displayCartItems() {
    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>  سلكا كرينى يا خاليه</p>
                <a href="index.html" class="continue-shopping">هه لبزيره به رهه ما</a>
            </div>
        `;
        return;
    }

    cartItemsList.innerHTML = '';
    
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-price">${item.price.toLocaleString()} د.ع</p>
                <div class="item-quantity">
                    <button class="quantity-btn decrease" data-index="${index}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-index="${index}">
                    <button class="quantity-btn increase" data-index="${index}">+</button>
                </div>
            </div>
            <button class="remove-item" data-index="${index}">&times;</button>
        `;
        cartItemsList.appendChild(itemElement);
    });

    // إضافة مستمعي الأحداث
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            updateQuantity(index, -1);
        });
    });

    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            updateQuantity(index, 1);
        });
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const index = e.target.dataset.index;
            const newQuantity = parseInt(e.target.value) || 1;
            updateQuantity(index, 0, newQuantity);
        });
    });

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            removeItem(index);
        });
    });
}

// تحديث كمية المنتج
function updateQuantity(index, change, newQuantity = null) {
    if (newQuantity !== null) {
        cart[index].quantity = Math.max(1, newQuantity);
    } else {
        cart[index].quantity = Math.max(1, cart[index].quantity + change);
    }
    
    saveCart();
    displayCartItems();
    updateTotals();
}

// إزالة منتج من السلة
function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    displayCartItems();
    updateTotals();
    updateCartCount();
}

// حفظ السلة في التخزين المحلي
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// إرسال الطلب إلى بوت التلجرام
async function sendOrderToTelegram(orderData) {
    const botToken = '8038436699:AAE2VMjT92xvQzvnNAVpIdspWhc2wxQdUWA';
    const chatId = '5730368415';
    
    // تنسيق رسالة الطلب
    let message = `🛒 *طلب جديد من المتجر:*\n\n`;
    message += `👤 *الاسم:* ${orderData.fullName}\n`;
    message += `📞 *الهاتف:* ${orderData.phone}\n`;
    message += `📍 *العنوان:* ${orderData.address}\n`;
    message += `🏙️ *المدينة:* ${orderData.city}\n`;
    message += `🚚 *رسوم التوصيل:* ${orderData.shippingCost.toLocaleString()} د.ع\n\n`;
    
    message += `📋 *المنتجات:*\n`;
    orderData.items.forEach(item => {
        message += `- ${item.name} ×${item.quantity} (${(item.price * item.quantity).toLocaleString()} د.ع)\n`;
    });
    
    message += `\n💵 *طريقة الدفع:* نقداً عند التوصيل\n`;
    message += `💰 *المجموع الكلي:* ${orderData.totalAmount.toLocaleString()} د.ع\n`;
    message += `🕒 *تاريخ الطلب:* ${new Date().toLocaleString('ar-IQ')}`;
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        const data = await response.json();
        return data.ok;
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
        return false;
    }
}

// معالجة إرسال النموذج
checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
        alert('  سلكا كرينى خاليه');
        return;
    }
    
    const formData = new FormData(checkoutForm);
    const orderData = {
        fullName: formData.get('fullName'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        shippingCost: shippingRates[formData.get('city')] || 0,
        items: cart,
        totalAmount: cart.reduce((total, item) => total + (item.price * item.quantity), 0) + (shippingRates[formData.get('city')] || 0)
    };
    
    // إظهار مؤشر التحميل
    submitButton.disabled = true;
    submitButton.textContent = 'جاري إرسال الطلب...';
    
    try {
        const success = await sendOrderToTelegram(orderData);
        
        if (success) {
            // إظهار رسالة النجاح
            modal.style.display = 'flex';
            
            // تفريغ السلة
            cart = [];
            saveCart();
            checkoutForm.reset();
            displayCartItems();
            updateTotals();
        } else {
            alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقاً.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'تأكيد الطلب';
    }
});

// إغلاق النافذة المنبثقة
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// إغلاق النافذة المنبثقة عند النقر خارجها
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// تحديث سعر التوصيل عند تغيير المدينة
document.getElementById('city').addEventListener('change', updateTotals);

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();
    updateTotals();
    updateCartCount();
});
