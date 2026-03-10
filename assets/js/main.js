function filterPublications(category) {
    document.querySelectorAll('.publication, .publication-item').forEach((publication) => {
        const itemCategory = publication.dataset.category;
        const shouldShow = category === 'all' || !itemCategory || itemCategory === category;
        publication.style.display = shouldShow ? '' : 'none';
    });
}

window.filterPublications = filterPublications;

function getHeaderOffset() {
    const header = document.querySelector('.site-header');
    return header ? header.offsetHeight + 18 : 80;
}

function highlightTarget(target) {
    if (!target) return;

    target.classList.remove('highlight');
    void target.offsetWidth;
    target.classList.add('highlight');

    window.setTimeout(() => {
        target.classList.remove('highlight');
    }, 1800);
}

function smoothScrollToTarget(target, shouldHighlight = true) {
    if (!target) return;

    const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });

    if (shouldHighlight) {
        window.setTimeout(() => highlightTarget(target), 180);
    }
}

function setupSmoothAnchorScrolling() {
    document.querySelectorAll('a[href*="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            if (anchor.closest('.project-dialog') || anchor.closest('.dialog-toc')) return;

            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;

            const url = new URL(href, window.location.href);
            if (url.pathname !== window.location.pathname || !url.hash) return;

            const target = document.querySelector(url.hash);
            if (!target) return;

            event.preventDefault();
            history.replaceState(null, '', url.hash);
            smoothScrollToTarget(target);

            const navLinks = document.querySelector('.nav-links');
            const menuToggle = document.querySelector('.menu-toggle');
            if (navLinks && menuToggle && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });

    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            window.setTimeout(() => highlightTarget(target), 250);
        }
    }
}

function setupScrollReveals() {
    const staggerContainers = document.querySelectorAll(
        '.projects-grid, .news-coverage, .blog-posts-grid, .contact-grid, .scholar-metrics'
    );

    staggerContainers.forEach((container) => {
        Array.from(container.children).forEach((child, index) => {
            child.style.setProperty('--reveal-delay', `${Math.min(index, 5) * 60}ms`);
        });
    });

    const revealTargets = document.querySelectorAll(
        '.affiliation-logos, .home-section, .latest-news, .scholar-profile, .atlas-note, ' +
        '.projects-section-title, .project-card, .publication-item, .metric-card, ' +
        '.news-item-featured, .blog-post-card, .contact-card, .talk-item'
    );

    if (!revealTargets.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    revealTargets.forEach((target) => target.classList.add('scroll-reveal'));

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
        revealTargets.forEach((target) => target.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, scrollObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            scrollObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.16,
        rootMargin: '0px 0px -12% 0px'
    });

    revealTargets.forEach((target) => observer.observe(target));
}

function setupHomeSectionCue() {
    if (!document.body.classList.contains('page-home')) return;

    const sections = Array.from(document.querySelectorAll('.home-section[data-section-label]'));
    const indicator = document.getElementById('sectionIndicator');
    const progressBar = document.getElementById('headerProgressBar');
    const header = document.querySelector('.site-header');

    if (!sections.length || !indicator || !progressBar || !header) return;

    const updateCue = () => {
        const headerOffset = getHeaderOffset();
        const marker = window.scrollY + headerOffset + Math.min(window.innerHeight * 0.18, 120);

        let activeSection = sections[0];
        sections.forEach((section) => {
            if (section.offsetTop <= marker) {
                activeSection = section;
            }
        });

        const firstSection = sections[0];
        const lastSection = sections[sections.length - 1];
        const start = Math.max(firstSection.offsetTop - headerOffset - 24, 0);
        const end = Math.max(
            lastSection.offsetTop + lastSection.offsetHeight - window.innerHeight * 0.45,
            start + 1
        );
        const progress = Math.max(0, Math.min((window.scrollY - start) / (end - start), 1));

        indicator.textContent = activeSection.dataset.sectionLabel;
        indicator.classList.add('is-visible');
        progressBar.style.transform = `scaleX(${progress})`;
        document.body.dataset.homeSection = activeSection.id || activeSection.dataset.sectionLabel.toLowerCase();
    };

    let ticking = false;
    const requestTick = () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
            updateCue();
            ticking = false;
        });
    };

    updateCue();
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
}

document.addEventListener('DOMContentLoaded', () => {
    setupSmoothAnchorScrolling();
    setupScrollReveals();
    setupHomeSectionCue();
});
