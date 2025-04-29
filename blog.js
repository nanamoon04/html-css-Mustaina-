// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Add scroll animations
    const animateOnScroll = function() {
        // Sections to animate when scrolled into view
        const animateSections = [
            { 
                selector: '.blog-header h2', 
                animation: 'animate__fadeInLeft'
            },
            { 
                selector: '.blog-header p', 
                animation: 'animate__fadeInRight'
            },
            { 
                selector: '.digital-marketing-topics', 
                animation: 'animate__fadeIn'
            },
            { 
                selector: '.topic-item', 
                animation: 'animate__zoomIn',
                staggered: true,
                staggerDelay: 0.2
            },
            { 
                selector: '.latest-articles h3', 
                animation: 'animate__fadeInUp'
            },
            { 
                selector: '.article-item', 
                animation: 'animate__fadeIn',
                staggered: true,
                staggerDelay: 0.2
            },
            {
                selector: 'footer .footer-logo',
                animation: 'animate__bounceIn'
            },
            {
                selector: 'footer .footer-nav',
                animation: 'animate__fadeInUp'
            },
            {
                selector: 'footer .social-icons',
                animation: 'animate__fadeInUp'
            }
        ];
        
        // Apply animations to elements when they come into view
        animateSections.forEach(section => {
            const elements = document.querySelectorAll(section.selector);
            
            elements.forEach((element, index) => {
                if (element.classList.contains('has-animated')) {
                    return; // Skip if already animated
                }
                
                const elementPosition = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementPosition < windowHeight - 100) {
                    // Set delay if staggered
                    if (section.staggered && section.staggerDelay) {
                        element.style.animationDelay = `${index * section.staggerDelay}s`;
                    }
                    
                    // Add animation classes
                    element.classList.add('animate__animated', section.animation);
                    element.classList.add('has-animated');
                }
            });
        });
    };
    
    // Run once on initial load
    setTimeout(animateOnScroll, 100);
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
});