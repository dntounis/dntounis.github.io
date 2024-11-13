// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Add specific animation classes based on data attributes
            if (entry.target.dataset.animation) {
                entry.target.classList.add(entry.target.dataset.animation);
            }
        }
    });
}, observerOptions);

// Initialize animations
function initializeAnimations() {
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
    
    document.querySelectorAll('.stagger-animation').forEach(container => {
        container.children.forEach((child, index) => {
            child.style.animationDelay = `${index * 0.1}s`;
        });
    });
}

document.addEventListener('DOMContentLoaded', initializeAnimations);
