document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navContainer = document.querySelector('.nav-container');
    const menuOverlay = document.createElement('div');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Create menu overlay
    menuOverlay.className = 'menu-overlay';
    document.body.appendChild(menuOverlay);
    
    // Add animation delay to nav links
    navLinks.forEach((link, index) => {
        link.style.transitionDelay = `${index * 0.05}s`;
    });
    
    // Toggle mobile menu with animation
    const toggleMenu = (open) => {
        const isOpening = open === undefined ? !menuToggle.classList.contains('active') : open;
        
        if (isOpening) {
            // Opening animation
            document.body.style.overflow = 'hidden';
            menuOverlay.style.display = 'block';
            navContainer.style.display = 'flex';
            
            // Trigger reflow
            void navContainer.offsetHeight;
            
            menuToggle.classList.add('active');
            menuOverlay.classList.add('active');
            
            // Small delay before showing nav items
            setTimeout(() => {
                navContainer.classList.add('active');
                
                // Animate in each nav link
                navLinks.forEach((link, index) => {
                    setTimeout(() => {
                        link.style.opacity = '1';
                        link.style.transform = 'translateX(0)';
                    }, index * 50);
                });
            }, 20);
        } else {
            // Closing animation
            navLinks.forEach(link => {
                link.style.opacity = '0';
                link.style.transform = 'translateX(20px)';
            });
            
            navContainer.classList.remove('active');
            menuToggle.classList.remove('active');
            menuOverlay.classList.remove('active');
            
            // Wait for animation to complete before hiding elements
            setTimeout(() => {
                if (!menuToggle.classList.contains('active')) {
                    document.body.style.overflow = '';
                    navContainer.style.display = 'none';
                    menuOverlay.style.display = 'none';
                }
            }, 400);
        }
    };
    
    // Toggle menu on button click
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Close menu when clicking on overlay
    menuOverlay.addEventListener('click', function() {
        toggleMenu(false);
    });
    
    // Close menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                const target = this.getAttribute('href');
                toggleMenu(false);
                
                // Scroll to section after menu closes
                setTimeout(() => {
                    if (target !== '#') {
                        const section = document.querySelector(target);
                        if (section) {
                            window.scrollTo({
                                top: section.offsetTop - 80,
                                behavior: 'smooth'
                            });
                        }
                    }
                }, 450);
            }
        });
    });
    
    // Close menu on window resize if it becomes desktop view
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 992 && menuToggle.classList.contains('active')) {
                toggleMenu(false);
            }
        }, 250);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992 && 
            !navContainer.contains(e.target) && 
            !menuToggle.contains(e.target) &&
            menuToggle.classList.contains('active')) {
            toggleMenu(false);
        }
    });
    
    // Prevent body scroll when menu is open
    document.addEventListener('touchmove', function(e) {
        if (menuToggle.classList.contains('active')) {
            e.preventDefault();
        }
    }, { passive: false });
});
