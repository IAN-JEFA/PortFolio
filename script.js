
'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // ─── UTILITIES ─────────────────────────────────────────────────
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    // ─── FOOTER YEAR ───────────────────────────────────────────────
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ─── CUSTOM CURSOR ─────────────────────────────────────────────
    const dot  = $('#cursorDot');
    const ring = $('#cursorRing');

    if (dot && ring && window.matchMedia('(hover: hover)').matches) {
        let mx = 0, my = 0;    // mouse target
        let rx = 0, ry = 0;    // ring current position
        let rafId;

        document.addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
            dot.style.left  = mx + 'px';
            dot.style.top   = my + 'px';
        });

        // Smooth ring follow with lerp
        function lerpRing() {
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            ring.style.left = rx + 'px';
            ring.style.top  = ry + 'px';
            rafId = requestAnimationFrame(lerpRing);
        }
        lerpRing();

        // Expand ring on hover over interactive elements
        const hoverTargets = 'a, button, .skill-block, .project-item, .tag';
        document.querySelectorAll(hoverTargets).forEach(() => {}); // preload

        document.addEventListener('mouseover', e => {
            if (e.target.closest(hoverTargets)) ring.classList.add('hovered');
        });
        document.addEventListener('mouseout', e => {
            if (e.target.closest(hoverTargets)) ring.classList.remove('hovered');
        });

        // Hide when leaving window
        document.addEventListener('mouseleave', () => {
            dot.style.opacity  = '0';
            ring.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            dot.style.opacity  = '1';
            ring.style.opacity = '1';
        });
    }

    // ─── NAVBAR SCROLL BEHAVIOUR ───────────────────────────────────
    const navbar = $('#navbar');
    const navLinks = $$('.nav-link');

    function onScroll() {
        // Scrolled state for background blur
        navbar.classList.toggle('scrolled', window.scrollY > 40);

        // Active link highlight based on section in view
        const scrollMid = window.scrollY + window.innerHeight / 2.5;

        $$('section[id]').forEach(section => {
            const top    = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id     = section.getAttribute('id');

            if (scrollMid >= top && scrollMid < bottom) {
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    link.classList.toggle('active', href === `#${id}`);
                });
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load

    // ─── MOBILE NAVIGATION ─────────────────────────────────────────
    const menuToggle  = $('#menuToggle');
    const mobileMenu  = $('#navLinks');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', e => {
            e.stopPropagation();
            const isOpen = mobileMenu.classList.toggle('open');
            menuToggle.classList.toggle('open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close on link click
        $$('.nav-link, .nav-cta', mobileMenu).forEach(el => {
            el.addEventListener('click', closeMobileMenu);
        });

        // Close on outside click
        document.addEventListener('click', e => {
            if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    function closeMobileMenu() {
        mobileMenu?.classList.remove('open');
        menuToggle?.classList.remove('open');
        document.body.style.overflow = '';
    }

    // ─── SMOOTH SCROLL ─────────────────────────────────────────────
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = $(href);
            if (!target) return;
            e.preventDefault();

            const navHeight = navbar?.offsetHeight || 80;
            const targetY   = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

            window.scrollTo({ top: targetY, behavior: 'smooth' });
            closeMobileMenu();
        });
    });

    // ─── INTERSECTION OBSERVER — REVEAL ────────────────────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    $$('.reveal-up, .reveal-scale').forEach(el => revealObserver.observe(el));

    // ─── TERMINAL TYPING EFFECT ────────────────────────────────────
    const typedCmd    = $('#typedCmd');
    const termOutput  = $('#terminalOutput');
    const termBody    = $('#terminalBody');

    if (typedCmd && termOutput) {
        // Sequence of commands to cycle through
        const sequences = [
            {
                cmd: 'whoami',
                output: `<span class="t-val">ian_jefa</span> — <span class="t-str">Software Engineer, Nairobi KE</span>`
            },
            {
                cmd: 'cat skills.json',
                output: `{<br>
&nbsp;&nbsp;<span class="t-key">"primary"</span>: [<span class="t-str">"React"</span>, <span class="t-str">"Node.js"</span>, <span class="t-str">"TypeScript"</span>],<br>
&nbsp;&nbsp;<span class="t-key">"database"</span>: [<span class="t-str">"PostgreSQL"</span>, <span class="t-str">"MongoDB"</span>],<br>
&nbsp;&nbsp;<span class="t-key">"yoe"</span>: <span class="t-num">3</span><br>
}`
            },
            {
                cmd: 'git log --oneline',
                output: `<span class="t-num">f3c9a12</span> <span class="t-str">feat: task manager standalone (vercel)</span><br>
<span class="t-num">a1b2c3d</span> <span class="t-str">feat: password entropy analyzer</span><br>
<span class="t-num">d4e5f6a</span> <span class="t-str">feat: shoe haven e-commerce</span><br>
<span class="t-num">7g8h9i0</span> <span class="t-str">feat: advocate portfolio site</span>`
            },
            {
                cmd: 'echo $STATUS',
                output: `<span class="t-val">OPEN_TO_WORK</span>=<span class="t-num">true</span> · remote-ready`
            }
        ];

        let seqIndex  = 0;
        let charIndex = 0;
        let phase     = 'typing'; // 'typing' | 'showing' | 'clearing'
        let timer;
        const TYPING_SPEED = 60;
        const SHOW_DELAY   = 2200;
        const CLEAR_DELAY  = 500;

        function typeChar() {
            const seq = sequences[seqIndex];
            if (charIndex < seq.cmd.length) {
                typedCmd.textContent += seq.cmd[charIndex];
                charIndex++;
                timer = setTimeout(typeChar, TYPING_SPEED + Math.random() * 40);
            } else {
                // Command done — show output
                phase = 'showing';
                timer = setTimeout(showOutput, 300);
            }
        }

        function showOutput() {
            const seq = sequences[seqIndex];
            termOutput.innerHTML = seq.output;
            termOutput.style.opacity = '0';
            termOutput.style.transition = 'opacity 0.35s';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    termOutput.style.opacity = '1';
                });
            });
            timer = setTimeout(clearSequence, SHOW_DELAY);
        }

        function clearSequence() {
            termOutput.style.opacity = '0';
            timer = setTimeout(() => {
                termOutput.innerHTML = '';
                typedCmd.textContent = '';
                charIndex  = 0;
                seqIndex   = (seqIndex + 1) % sequences.length;
                phase      = 'typing';
                timer = setTimeout(typeChar, CLEAR_DELAY);
            }, 350);
        }

        // Start after a short delay to let hero animate in
        timer = setTimeout(typeChar, 1200);
    }

    // ─── CV DOWNLOAD ───────────────────────────────────────────────
    const CV_URL   = 'https://drive.google.com/uc?export=download&id=1HHsR6-Shfxz9fWQsM3oA72YOHaUJYBDj';
    const pdfNote  = $('#pdfNotice');

    function downloadCV() {
        const a = document.createElement('a');
        a.href     = CV_URL;
        a.target   = '_blank';
        a.rel      = 'noopener noreferrer';
        a.download = 'Ian_Jefa_CV.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Show toast notification
        if (pdfNote) {
            pdfNote.classList.add('show');
            setTimeout(() => pdfNote.classList.remove('show'), 4000);
        }
    }

    ['cvBtn', 'heroCvBtn', 'contactCvBtn'].forEach(id => {
        const btn = $('#' + id);
        if (btn) btn.addEventListener('click', e => { e.preventDefault(); downloadCV(); });
    });

    // ─── SKILL-BAR ANIMATION (triggered by observer) ───────────────
    // The CSS handles the animation via `.revealed .sb-bar::after`,
    // which transitions from scaleX(0) to scaleX(1).
    // The reveal observer above will add `.revealed` to `.skill-block`,
    // triggering the CSS bar fill automatically.

    // ─── PROJECT CARD TILT (subtle parallax on hover) ──────────────
    $$('.project-item').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect   = card.getBoundingClientRect();
            const x      = (e.clientX - rect.left) / rect.width  - 0.5;
            const y      = (e.clientY - rect.top)  / rect.height - 0.5;
            const rotX   = (-y * 3).toFixed(2);
            const rotY   = ( x * 3).toFixed(2);
            card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s var(--ease-out), background 0.3s';
            card.style.transform  = 'none';
            setTimeout(() => card.style.transition = '', 500);
        });
    });

    // ─── STAGGER HERO REVEALS ON LOAD ──────────────────────────────
    // Hero elements use reveal-up but are in viewport immediately.
    // We trigger them after a tiny frame to ensure transition fires.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            $$('.hero .reveal-up, .hero .reveal-scale').forEach(el => {
                el.classList.add('revealed');
            });
        });
    });

}); // end DOMContentLoaded
