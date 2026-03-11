// DOM ready
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ===== MOBILE NAVIGATION =====
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksAnchors = document.querySelectorAll('.nav-links a');

    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            // toggle icon
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // close mobile menu on link click
    navLinksAnchors.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuToggle?.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // close when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks?.contains(e.target) && !menuToggle?.contains(e.target)) {
            navLinks?.classList.remove('active');
            const icon = menuToggle?.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });

    // ===== SMOOTH SCROLL + ACTIVE NAV =====
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.scrollY + 100; // offset

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinksAnchors.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // initial

    // smooth scroll for anchor links (prevent default jump)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const offsetTop = targetEl.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // ===== CV DOWNLOAD FUNCTION =====
    const CV_URL = 'https://drive.google.com/uc?export=download&id=1HHsR6-Shfxz9fWQsM3oA72YOHaUJYBDj'; // direct download link (replace if needed)
    const pdfNotice = document.getElementById('pdfNotice');

    function showNotice() {
        if (!pdfNotice) return;
        pdfNotice.classList.add('show');
        setTimeout(() => {
            pdfNotice.classList.remove('show');
        }, 4000);
    }

    function downloadCV() {
        // Create invisible anchor
        const link = document.createElement('a');
        link.href = CV_URL;
        link.target = '_blank';      // try open first (often downloads pdf)
        link.rel = 'noopener noreferrer';
        link.download = 'Ian_Jefa_CV.pdf'; // filename hint
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showNotice();
    }

    // Attach to all CV buttons
    const cvButtons = ['cvBtn', 'heroCvBtn', 'contactCvBtn'];
    cvButtons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                downloadCV();
            });
        }
    });

    // ===== SKILL TAGS MICRO-INTERACTION (already in css, but ensure hover effect works fine) =====
    // No extra needed, but we keep fallback for older browsers

    // ===== FOOTER YEAR AUTO-UPDATE =====
    const copyright = document.querySelector('.copyright');
    if (copyright) {
        const year = new Date().getFullYear();
        copyright.innerHTML = `© ${year} Ian Jefa — built with <i class="fas fa-heart" style="color: #ef4444;"></i> in Kenya`;
    }

    // ===== INTERSECTION OBSERVER FOR FADE-IN (extra polish) =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.project-card, .skill-group, .about-card, .contact-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});