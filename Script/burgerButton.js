document.addEventListener('DOMContentLoaded', function() {
    // Create overlay if it doesn't exist
    if (!document.querySelector('.burger-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'burger-overlay';
        document.body.appendChild(overlay);
    }
    
    const burgerIcon = document.querySelector('.burger-icon');
    const burgerMenu = document.querySelector('.burger-menu');
    const overlay = document.querySelector('.burger-overlay');
    
    if (!burgerIcon || !burgerMenu) {
        console.error('Burger menu elements not found');
        return;
    }
    
    // Function to toggle menu
    function toggleMenu() {
        burgerIcon.classList.toggle('active');
        burgerMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Prevent scrolling when menu is open
        if (burgerIcon.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Toggle menu when clicking burger icon
    burgerIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', function() {
        toggleMenu();
    });
    
    // Close menu when clicking links
    const menuLinks = document.querySelectorAll('.list-header-burger a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            toggleMenu();
        });
    });
    
    // Make sure menu is closed when window is resized to desktop view
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1023 && burgerIcon.classList.contains('active')) {
            toggleMenu();
        }
    });
});