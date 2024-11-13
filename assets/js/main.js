// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Publication filters
function filterPublications(category) {
    document.querySelectorAll('.publication').forEach(pub => {
        if (category === 'all' || pub.dataset.category === category) {
            pub.style.display = 'block';
        } else {
            pub.style.display = 'none';
        }
    });
}

// Project card hover effects
document.querySelectorAll('.research-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.querySelector('.project-details').style.opacity = '1';
    });
    item.addEventListener('mouseleave', function() {
        this.querySelector('.project-details').style.opacity = '0';
    });
});

// Citation count animation
function animateNumbers() {
    document.querySelectorAll('.animate-number').forEach(number => {
        const target = parseInt(number.dataset.target);
        let current = 0;
        const increment = target / 50;
        const updateCount = () => {
            if (current < target) {
                current += increment;
                number.textContent = Math.ceil(current);
                requestAnimationFrame(updateCount);
            } else {
                number.textContent = target;
            }
        };
        updateCount();
    });
}

// Intersection Observer for animations
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
});

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
