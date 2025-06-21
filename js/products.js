// بيانات المنتجات
const products = [
    {
        id: 3,
        name: 'سوفاج',
        price: '30,000', // 900 ريال ≈ 360,000 دينار عراقي
        image: 'image/wa4.webp',
        category: 'perfume',
        description: 'كولافه كا هه را خوش و راقى'
    },
    {
        id: 9,
        name: 'به رچافك',
        price: '30,000', // 950 ريال ≈ 380,000 دينار عراقي
        image: 'image/wa5.webp',
        category: 'sunglasses',
        description: 'راقيترين به رجافك'
    },
    {
        id: 10,
        name: 'به رچافك',
        price: '20,000', // 1,200 ريال ≈ 480,000 دينار عراقي
        image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        category: 'sunglasses',
        description: 'جانتر نينه '
    },
    
    
    {
        id: 3,
        name: 'بازنك',
        price: '10,000', // 850 ريال ≈ 340,000 دينار عراقي
        image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        category: 'walls'
    },
    {
        id: 4,
        name: 'بازنك',
        price: '10,000', // 3,200 ريال ≈ 1,280,000 دينار عراقي
        image: 'image/wa6.webp',
        category: 'walls'
    },
    
    
    {
        id: 7,
        name: 'كونكان بو جانيئ',
        price: '10,000', // 350 ريال ≈ 140,000 دينار عراقي
        image: 'image/a1.jpg',
        category: 'strange'
    },
    {
        id: 8,
        name: 'كونكان جانيئ',
        price: '10,000', // 400 ريال ≈ 160,000 دينار عراقي
        image: 'image/a2.jpg',
        category: 'strange'
    },
    // ساعات
    {
        id: 11,
        name: 'ده مژمير',
        price: '20,000', // 800 ريال ≈ 320,000 دينار عراقي
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        category: 'watches',
        description: 'ساعة ذكية بتصميم عصري مع شاشة لمس عالية الدقة'
    },
    {
        id: 12,
        name: 'ده مژمير',
        price: '20,000', // 1,000 ريال ≈ 400,000 دينار عراقي
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        category: 'watches',
        description: 'ساعة يد أنيقة مناسبة للمناسبات الرسمية'
    },
    {
        id: 13,
        name: 'ده مژمير',
        price: '20,000', // 700 ريال ≈ 280,000 دينار عراقي
        image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        category: 'watches',
        description: 'ده مژمير دژى ئاڤى'
    }
];

// دالة لعرض المنتجات
function displayProducts(category = 'all') {
    const productsContainer = document.getElementById('productsContainer');
    
    // تصفية المنتجات حسب الفئة
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    // إنشاء عناصر المنتجات
    const productsHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}" data-id="${product.id}">
            <div class="product-image" style="background-image: url('${product.image}')" data-image="${product.image}"></div>
            <div class="product-details">
                <h4 class="product-name">${product.name}</h4>
                <p class="product-price">${product.price} د.ع</p>
            </div>
        </div>
    `).join('');
    
    // إضافة المنتجات إلى الصفحة
    productsContainer.innerHTML = productsHTML;
    
    // إضافة مستمعي الأحداث للمنتجات
    setupProductZoom();
}

// دالة مساعدة لإغلاق النافذة المنبثقة
function closeZoom(overlay) {
    if (overlay && overlay.parentNode) {
        document.body.style.overflow = '';
        document.body.removeChild(overlay);
    }
}

// دالة تكبير المنتج
function zoomProduct(productCard, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // إغلاق أي نافذة مفتوحة حالياً
    const existingOverlay = document.querySelector('.product-zoom-overlay');
    if (existingOverlay) {
        closeZoom(existingOverlay);
        return;
    }
    
    const productId = productCard.getAttribute('data-id');
    const product = products.find(p => p.id == productId);
    if (!product) return;
    
    // إنشاء نافذة التكبير
    const overlay = document.createElement('div');
    overlay.className = 'product-zoom-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    
    // إنشاء محتوى النافذة
    overlay.innerHTML = `
        <div class="product-zoom-content">
            <button class="product-zoom-close" aria-label="إغلاق">&times;</button>
            <div class="product-zoom-image" style="background-image: url('${product.image}')">
                <img src="${product.image}" alt="${product.name}" style="display: none;">
            </div>
            <div class="product-zoom-details">
                <h3 class="product-zoom-name">${product.name}</h3>
                <p class="product-zoom-price">${product.price} د.ع</p>
                <p class="product-zoom-description">${product.description || 'لا يوجد وصف متوفر'}</p>
            </div>
        </div>
    `;
    
    // إضافة النافذة إلى الصفحة
    document.body.appendChild(overlay);
    
    // منع التمرير خلف النافذة
    document.body.style.overflow = 'hidden';
    
    // إعداد مستمعي الأحداث
    const closeBtn = overlay.querySelector('.product-zoom-close');
    
    // دالة معالجة النقر على زر الإغلاق
    function handleCloseClick(e) {
        e.stopPropagation();
        closeZoom(overlay);
        removeEventListeners();
    }
    
    // دالة معالجة النقر خارج المحتوى
    function handleOverlayClick(e) {
        if (e.target === overlay) {
            closeZoom(overlay);
            removeEventListeners();
        }
    }
    
    // دالة معالجة زر ESC
    function handleEscKey(e) {
        if (e.key === 'Escape') {
            closeZoom(overlay);
            removeEventListeners();
        }
    }
    
    // دالة لإزالة مستمعي الأحداث
    function removeEventListeners() {
        closeBtn.removeEventListener('click', handleCloseClick);
        overlay.removeEventListener('click', handleOverlayClick);
        document.removeEventListener('keydown', handleEscKey);
    }
    
    // إضافة مستمعي الأحداث
    closeBtn.addEventListener('click', handleCloseClick);
    overlay.addEventListener('click', handleOverlayClick);
    document.addEventListener('keydown', handleEscKey);
}

// إعداد أحداث التكبير للمنتجات
function setupProductZoom() {
    const productCards = document.querySelectorAll('.product-card');
    
    // دالة معالجة النقر على البطاقة
    function handleCardClick(e) {
        e.preventDefault();
        e.stopPropagation();
        zoomProduct(this, e);
    }
    
    // إضافة مستمع حدث واحد لكل بطاقة
    productCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', handleCardClick, { once: false });
    });
}

// تهيئة الأحداث
function init() {
    // عرض جميع المنتجات عند تحميل الصفحة
    displayProducts();
    
    // إضافة مستمعي الأحداث لأزرار التصنيفات
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // إزالة الصنف النشط من جميع الأزرار
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // إضافة الصنف النشط للزر المحدد
            button.classList.add('active');
            
            // عرض المنتجات حسب الفئة المحددة
            const category = button.getAttribute('data-category');
            displayProducts(category);
        });
    });
}

// دالة لتصفية المنتجات حسب الفئة
function filterProducts(category) {
    // إزالة الفئة النشطة من جميع الأزرار
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // إضافة الفئة النشطة للزر المضغوط
    document.querySelector(`.category-btn[data-category="${category}"]`).classList.add('active');
    
    // تصفية وعرض المنتجات
    displayProducts(category);
    
    // التمرير إلى قسم المنتجات
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// تشغيل التطبيق عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', init);
