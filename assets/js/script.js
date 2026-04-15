
document.addEventListener("DOMContentLoaded", () => {
    // Ensure ScrollTrigger is registered safely
    if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    /* =========================================
       1. PAGE LOAD INTRO ANIMATIONS (HERO)
       - Made durations longer and eases smoother
    ========================================= */
    gsap.set(".visibility-hidden-on-load", { autoAlpha: 1 });

    const introTl = gsap.timeline({ delay: 0.5 });
    introTl
        .from("#logoBlock", { y: -30, opacity: 0, duration: 1.5, ease: "power2.out" })
        .from(".hero-text-anim", { y: 40, opacity: 0, duration: 1.5, stagger: 0.2, ease: "power2.out" }, "-=1.0")
        .from("#heroImageHoverArea", { y: -50, opacity: 0, duration: 1.5, ease: "power2.out" }, "-=1.0")
        .from(".social-icon-anim", { x: 30, opacity: 0, duration: 1.2, stagger: 0.15, ease: "power2.out" }, "-=1.0")
        .from(".bottom-block-anim", { y: 20, opacity: 0, duration: 1.2, stagger: 0.2, ease: "power2.out" }, "-=0.8");

    /* =========================================
       2. MENU INTERACTIONS
    ========================================= */
    const desktopBtn = document.getElementById('desktopMenuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');
    let isMenuOpen = false;

    if (desktopBtn && sideMenu && overlay) {
        const menuTl = gsap.timeline({ paused: true });
        menuTl
            .to(overlay, { opacity: 1, duration: 0.3, onStart: () => overlay.classList.remove('hidden') }, 0)
            .to(".line1", { y: 6, rotation: 45, duration: 0.3, ease: "power2.inOut" }, 0)
            .to(".line2", { opacity: 0, duration: 0.3 }, 0)
            .to(".line3", { y: -6, rotation: -45, duration: 0.3, ease: "power2.inOut" }, 0)
            .to(sideMenu, { x: 0, duration: 0.5, ease: "power4.out" }, ">")
            .fromTo(".nav-item",
                { x: 50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
                "-=0.2"
            );

        const openMenu = () => { isMenuOpen = true; menuTl.play(); };
        const closeMenu = () => {
            isMenuOpen = false;
            menuTl.reverse().then(() => {
                if (!isMenuOpen) overlay.classList.add('hidden');
            });
        };

        desktopBtn.addEventListener('click', () => isMenuOpen ? closeMenu() : openMenu());
        if (closeBtn) closeBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);
    }

    /* =========================================
       3. CUSTOM CURSOR & IMAGE FLASH LOGIC
       - Cursor follow speed reduced for extreme smoothness
       - Flash duration extended for a softer glow fade
    ========================================= */
    const logoBlock = document.getElementById('logoBlock');
    const heroImageHoverArea = document.getElementById('heroImageHoverArea');

    if (logoBlock && heroImageHoverArea) {
        const cursorClone = logoBlock.cloneNode(true);
        cursorClone.id = 'logoCursorClone';

        Object.assign(cursorClone.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            pointerEvents: 'none',
            zIndex: '9999',
            opacity: '0',
            display: 'none',
            transformOrigin: 'center center'
        });

        cursorClone.querySelectorAll('*').forEach(child => child.style.pointerEvents = 'none');
        cursorClone.classList.add('shadow-xl', 'rounded-lg');
        document.body.appendChild(cursorClone);

        // Changed duration from 0.15 to 0.6 for lazy and buttery smooth follow
        let xTo = gsap.quickTo(cursorClone, "x", { duration: 0.6, ease: "power2.out" }),
            yTo = gsap.quickTo(cursorClone, "y", { duration: 0.6, ease: "power2.out" });

        window.addEventListener("mousemove", (e) => {
            if (cursorClone.style.display !== 'none') {
                xTo(e.clientX);
                yTo(e.clientY);
            }
        });

        heroImageHoverArea.addEventListener("mouseenter", (e) => {
            // Soft, slow fade for the flash brightness
            gsap.fromTo(heroImageHoverArea,
                { filter: "brightness(1.3) contrast(1.05)" },
                { filter: "brightness(1) contrast(1)", duration: 1.5, ease: "power2.out" }
            );

            // Cursor Show
            cursorClone.style.display = 'flex';
            gsap.set(cursorClone, { x: e.clientX, y: e.clientY, xPercent: -50, yPercent: -50 });
            gsap.to(cursorClone, { opacity: 1, scale: 1, duration: 0.5 });
        });

        heroImageHoverArea.addEventListener("mouseleave", () => {
            // Cursor Hide
            gsap.to(cursorClone, {
                opacity: 0,
                scale: 0.9,
                duration: 0.5,
                onComplete: () => { cursorClone.style.display = 'none'; }
            });
        });
    }

    /* ==============================================================
       4. ABOUT SECTION SCROLL ANIMATIONS
    ============================================================== */
    const scrubTextElement = document.querySelector('.scrub-text');

    if (scrubTextElement) {
        const words = scrubTextElement.innerText.split(' ');
        scrubTextElement.innerHTML = '';

        words.forEach(word => {
            const span = document.createElement('span');
            span.innerText = word + ' ';
            span.style.color = '#D1D5DB';
            scrubTextElement.appendChild(span);
        });

        const spans = scrubTextElement.querySelectorAll('span');

        gsap.to(spans, {
            color: '#111827',
            stagger: 0.1,
            scrollTrigger: {
                trigger: '.about-content-col',
                start: "top 70%",
                end: "bottom 70%",
                scrub: 1.5, // Increased from 1 to 1.5 for smoother color fill catch-up
            }
        });
    }

    // about section animation & DYNAMIC COUNTER LOGIC
    const aboutSection = document.querySelector(".about-section");
    if (aboutSection) {
        const sectionTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".about-section",
                start: "top 70%",
            }
        });

        sectionTl
            .from(".about-image-col", { x: -50, opacity: 0, duration: 1.5, ease: "power2.out" })
            .from([".about-content-col h3", ".about-desc", ".about-btn"], {
                y: 40,
                opacity: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: "power2.out"
            }, "-=1.0")
            .from(".stat-card", {
                y: 60,
                opacity: 0,
                duration: 1.2,
                ease: "power2.out",
                stagger: {
                    each: 0.2,
                    onStart: function () {
                        const card = this.targets()[0];
                        const h3 = card.querySelector('h3');

                        // ডাইনামিক কাউন্টার লজিক (এইচটিএমএল পরিবর্তন ছাড়াই)
                        if (h3 && !h3.dataset.counted) {
                            h3.dataset.counted = "true";
                            const originalHTML = h3.innerHTML;

                            // রেগুলার এক্সপ্রেশন দিয়ে সংখ্যা এবং বাকি টেক্সট আলাদা করা হচ্ছে
                            const numMatch = originalHTML.match(/^(\s*)(\d+)([\s\S]*)/);

                            if (numMatch) {
                                const prefix = numMatch[1];
                                const targetVal = parseInt(numMatch[2]);
                                const suffix = numMatch[3];

                                const obj = { val: 0 };
                                gsap.to(obj, {
                                    val: targetVal,
                                    duration: 2.5,
                                    ease: "power2.out",
                                    onUpdate: () => {
                                        h3.innerHTML = prefix + Math.floor(obj.val) + suffix;
                                    }
                                });
                            }
                        }
                    }
                }
            }, "-=0.8");
    }

    // weapon section animation 
    const weaponsSection = document.querySelector(".design-weapons-section");

    if (weaponsSection) {
        const weaponsTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".design-weapons-section",
                start: "top 75%",
            }
        });

        weaponsTl
            .from(".weapon-content-anim", {
                y: 40,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: "power2.out"
            })
            .from(".weapon-card-anim", {
                y: 50,
                opacity: 0,
                duration: 1.0,
                stagger: 0.15,
                ease: "power2.out"
            }, "-=1.0");
    }

    // service section animation 
    const servicesSection = document.querySelector(".design-services-section");

    if (servicesSection) {
        const servicesTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".design-services-section",
                start: "top 75%",
            }
        });

        servicesTl
            .from(".service-text-anim", {
                y: 40,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: "power2.out"
            })
            .from(".service-image-anim", {
                scale: 0.95,
                y: 30,
                opacity: 0,
                duration: 1.5,
                ease: "power2.out"
            }, "-=0.8")
            .from(".service-card-anim", {
                y: 50,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: "power2.out"
            }, "-=1.0");
    }

    // workflow section animation 
    const workflowSection = document.querySelector(".design-workflow-section");

    if (workflowSection) {
        const workflowTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".design-workflow-section",
                start: "top 75%",
            }
        });

        workflowTl
            .from(".workflow-text-anim", {
                y: 40,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: "power2.out"
            })
            .from(".workflow-card-anim", {
                y: 50,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: "power2.out"
            }, "-=0.8");
    }

    // testimonial section animation
    const testimonialsSection = document.querySelector(".testimonials-section");

    if (testimonialsSection) {
        const testiTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".testimonials-section",
                start: "top 75%",
            }
        });

        testiTl
            .from(".testimonial-text-anim", {
                y: 40,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: "power2.out"
            })
            .from(".animate-marquee", {
                y: 40,
                opacity: 0,
                duration: 1.2,
                ease: "power2.out"
            }, "-=0.8");
    }

    // footer section animation 
    const footerSection = document.querySelector("footer");

    if (footerSection) {
        const footerTl = gsap.timeline({
            scrollTrigger: {
                trigger: "footer",
                start: "top 85%",
            }
        });

        footerTl
            .from(".footer-anim", {
                y: 30,
                opacity: 0,
                duration: 1.0,
                stagger: 0.15,
                ease: "power2.out"
            });
    }

    // tab animation 
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. Remove active styling from all buttons and reset to default border state
            filterBtns.forEach(b => {
                b.classList.remove('bg-[#FF6200]', 'text-white', 'border-transparent', 'shadow-[8px_8px_32px_0_rgba(255,98,0,0.25)]', 'active');
                // Re-add the gray border, text color, and hover effects for inactive tabs
                b.classList.add('bg-transparent', 'text-gray-500', 'border-[#929292]', 'hover:text-black', 'hover:border-black');
            });

            // 2. Add active styling to clicked button
            // Remove the default styling classes first
            btn.classList.remove('bg-transparent', 'text-gray-500', 'border-[#929292]', 'hover:text-black', 'hover:border-black');
            // Apply active state (Orange bg, white text, transparent border to maintain sizing, shadow)
            btn.classList.add('bg-[#FF6200]', 'text-white', 'border-transparent', 'shadow-[8px_8px_32px_0_rgba(255,98,0,0.25)]', 'active');

            // 3. Get filter keyword
            const filterValue = btn.getAttribute('data-filter');

            // 4. Filter and Animate Cards
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || category.includes(filterValue)) {
                    card.style.display = 'flex';
                    // Smooth fade-in animation using GSAP
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(card, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" });
                    }
                } else {
                    card.style.display = 'none';
                }
            });

            // 5. Refresh ScrollTrigger to recalculate page height and avoid animation bugs
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        });
    });

}); // <-- End of DOMContentLoaded

// Lenis Smooth Scroll
if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.3,
        infinite: false,
    });

    if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
    }

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
}
