// نظام النشر التلقائي
const posts = [
    {
        title: 'أحدث تشكيلة من الإكسسوارات الذهبية',
        date: '2025-06-21',
        image: 'image/post1.jpg',
        content: 'اكتشفوا أحدث تشكيلتنا من الإكسسوارات الذهبية العصرية والأنيقة',
        category: 'إكسسوارات'
    },
    // يمكن إضافة المزيد من المنشورات هنا
];

function displayPosts() {
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;

    // ترتيب المنشورات من الأحدث إلى الأقدم
    const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

    // عرض المنشورات
    sortedPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div class="post-image">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="post-content">
                <span class="post-category">${post.category}</span>
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <span class="post-date">${formatDate(post.date)}</span>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
}

// تشغيل العرض عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', displayPosts);
