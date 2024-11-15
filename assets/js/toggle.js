function toggleProject(element) {
    const details = element.parentNode.querySelector('.project-details');
    const icon = element.querySelector('.expand-icon');
    
    if (!details || !icon) return;
    
    const isVisible = details.style.display !== 'none';
    
    // Toggle visibility
    details.style.display = isVisible ? 'none' : 'block';
    
    // Rotate arrow
    icon.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
    
    // Add smooth height transition
    if (!isVisible) {
        const height = details.scrollHeight;
        details.style.maxHeight = `${height}px`;
    } else {
        details.style.maxHeight = '0';
    }
}

// Initialize all project cards
document.addEventListener('DOMContentLoaded', function() {
    const projectTitles = document.querySelectorAll('.project-title');
    projectTitles.forEach(title => {
        const details = title.parentNode.querySelector('.project-details');
        if (details) {
            details.style.display = 'none';
        }
    });
});