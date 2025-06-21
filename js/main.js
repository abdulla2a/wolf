// Mobile menu toggle
const mobileMenuBtn = document.createElement('button');
mobileMenuBtn.classList.add('mobile-menu-btn');
mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
document.querySelector('.main-nav .container').prepend(mobileMenuBtn);

const navLinks = document.querySelector('.nav-links');
const navActions = document.querySelector('.nav-actions');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navActions.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Add to cart functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartCount = document.querySelector('.cart-count');
let cartItems = 0;

addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        cartItems++;
        cartCount.textContent = cartItems;
        
        // Add animation
        button.textContent = 'تمت الإضافة';
        button.style.backgroundColor = '#4CAF50';
        
        setTimeout(() => {
            button.innerHTML = 'أضف للسلة';
            button.style.backgroundColor = '';
        }, 2000);
    });
});

// Function to zoom post
function zoomPost(postElement) {
    // Get post content
    const postTitle = postElement.querySelector('.post-title');
    const postContent = postElement.querySelector('.post-content');
    const postImage = postElement.querySelector('.post-image img');
    
    if (!postContent) return;
    
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
    
    // Create content
    const content = document.createElement('div');
    content.className = 'post-zoom-text';
    
    // Add title if exists
    if (postTitle) {
        const title = document.createElement('h2');
        title.textContent = postTitle.textContent;
        title.style.marginBottom = '20px';
        title.style.color = '#007bff';
        content.appendChild(title);
    }
    
    // Add image if exists
    if (postImage) {
        const img = document.createElement('img');
        img.src = postImage.src;
        img.style.maxWidth = '100%';
        img.style.borderRadius = '8px';
        img.style.margin = '15px 0';
        content.appendChild(img);
    }
    
    // Add post content
    const text = document.createElement('div');
    text.innerHTML = postContent.innerHTML;
    content.appendChild(text);
    
    // Assemble elements
    contentDiv.appendChild(closeBtn);
    contentDiv.appendChild(content);
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

// Add click event to all posts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add click handler to all posts
    const posts = document.querySelectorAll('.post');
    posts.forEach(post => {
        post.style.cursor = 'pointer';
        post.addEventListener('click', function() {
            zoomPost(this);
        });
    });
});

// Form submission
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('شكراً لتواصلك معنا! سنقوم بالرد عليك في أقرب وقت ممكن.');
        contactForm.reset();
    });
}

// Sticky header
const header = document.querySelector('header');
const mainNav = document.querySelector('.main-nav');
const headerHeight = header.offsetHeight;

window.addEventListener('scroll', () => {
    if (window.scrollY > headerHeight) {
        mainNav.classList.add('sticky');
    } else {
        mainNav.classList.remove('sticky');
    }
});

// Product search functionality
const searchBtn = document.querySelector('.search-btn');
const searchBar = document.createElement('div');
searchBar.classList.add('search-bar');
searchBar.innerHTML = `
    <div class="search-container">
        <input type="text" id="searchInput" name="search" placeholder="ابحث عن منتج..." autocomplete="on">
        <button type="button" class="search-close" aria-label="إغلاق البحث"><i class="fas fa-times"></i></button>
    </div>
`;
document.body.appendChild(searchBar);

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    searchBar.classList.add('active');
    searchBar.querySelector('input').focus();
});

searchBar.querySelector('.search-close').addEventListener('click', () => {
    searchBar.classList.remove('active');
});

// Close search when clicking outside
searchBar.addEventListener('click', (e) => {
    if (e.target === searchBar) {
        searchBar.classList.remove('active');
    }
});
