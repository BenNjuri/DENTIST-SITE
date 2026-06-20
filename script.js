document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 2. Mobile Resilient Autoplay
    const heroVid = document.getElementById('hero-vid');
    if (heroVid) {
        const attemptPlay = () => {
            heroVid.play().catch(() => {
                // If autoplay is blocked, try again on first interaction
                const onFirstInteraction = () => {
                    heroVid.play();
                    document.removeEventListener('touchstart', onFirstInteraction);
                    document.removeEventListener('mousedown', onFirstInteraction);
                };
                document.addEventListener('touchstart', onFirstInteraction);
                document.addEventListener('mousedown', onFirstInteraction);
            });
        };

        // Try immediately
        attemptPlay();
        // Also try on window load for slow connections
        window.addEventListener('load', attemptPlay);
    }

    // 3. Navbar Scroll Logic
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    window.openLightbox = function (src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop scroll
    };

    window.closeLightbox = function () {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Resume scroll
        setTimeout(() => { lightboxImg.src = ''; }, 400); // Clear src after fade
    };

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // 4. Interaction Observer for Scrolling Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply reveal to sections/cards
    document.querySelectorAll('.comparison-card, .pricing-item, .tech-item, .restored-section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        revealObserver.observe(el);
    });

    // Custom CSS for observer since we are using inject style
    const style = document.createElement('style');
    style.textContent = `
        .reveal-active {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // 5. Video Performance: Pause videos when not in view
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (!entry.isIntersecting) {
                video.pause();
            } else if (video.hasAttribute('autoplay')) {
                video.play().catch(() => { /* Autoplay block */ });
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('video').forEach(vid => videoObserver.observe(vid));
});
