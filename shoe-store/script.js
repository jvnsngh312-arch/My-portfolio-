document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis for smooth scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Initial Load Animations (Staggered Reveal)
    const tl = gsap.timeline();

    tl.from('.logo', { y: -30, opacity: 0, duration: 1, ease: "power4.out" })
        .from('.nav-links li', { y: -30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power4.out" }, "-=0.8")
        .from('.nav-icons i, .hamburger', { scale: 0, opacity: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.7)" }, "-=0.8");

    // Hero Text Reveal (Letter by letter effect simulated with lines)
    tl.from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        skewY: 7
    }, "-=0.5")
        .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.8")
        .from('.btn-primary', { scale: 0.8, opacity: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.6");

    // Organic Hero Shoe Float (Multi-axis)
    const heroShoe = document.querySelector('.floating-shoe');

    // Entrance with a bit more drama but NO rotation
    tl.from(heroShoe, {
        y: 150,
        opacity: 0,
        scale: 0.6,
        duration: 1.8,
        ease: "power3.out"
    }, "-=1.2");

    // Continuous Subtle Float (Breathing Effect)
    gsap.to(heroShoe, {
        y: -15,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // Gentle Mouse Parallax
    document.querySelector('.hero').addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 15; // Reduced 15px range
        const y = (e.clientY / window.innerHeight - 0.5) * 8; // Reduced 8px range

        gsap.to(heroShoe, {
            x: x,
            y: y,
            duration: 2.5, // Heavy luxury float
            ease: "power2.out"
        });
    });

    // Scroll-based Cinematic Scale (Very Subtle)
    // No rotation, just pure vertical scale
    gsap.to(heroShoe, {
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 3, // extremely smooth/heavy feel
        },
        scale: 1.1, // Barely noticeable zoom
        y: 50,
        ease: "power2.inOut"
    });

    // ---------------------------------------------
    // 3D Tilt Effect for Product Cards
    // ---------------------------------------------
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation values based on mouse position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
            const rotateY = ((x - centerX) / centerX) * 10;

            gsap.to(card, {
                rotationX: rotateX,
                rotationY: rotateY,
                duration: 0.4,
                ease: "power2.out",
                transformPerspective: 1000,
                transformOrigin: "center"
            });

            // Parallax the image inside
            const img = card.querySelector('img');
            gsap.to(img, {
                x: (x - centerX) * 0.1,
                y: (y - centerY) * 0.1,
                duration: 0.4,
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.7,
                ease: "elastic.out(1, 0.5)"
            });

            const img = card.querySelector('img');
            gsap.to(img, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: "elastic.out(1, 0.5)"
            });
        });
    });

    // ---------------------------------------------
    // Magnetic Button Effect (Apply to both types)
    // ---------------------------------------------
    const btns = document.querySelectorAll('.btn-primary, .btn-secondary');
    btns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    // ---------------------------------------------
    // Enhanced Scroll Reveals
    // ---------------------------------------------

    // Featured Header
    gsap.from('.section-header h2', {
        scrollTrigger: {
            trigger: '.featured',
            start: 'top 80%',
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out" // Cinematic ease
    });

    gsap.from('.line-break', {
        scrollTrigger: {
            trigger: '.featured',
            start: 'top 80%',
        },
        scaleX: 0,
        duration: 1,
        ease: "power3.out"
    });

    // Product Grid Stagger
    gsap.from('.product-card', {
        scrollTrigger: {
            trigger: '.product-grid',
            start: 'top 85%', // Start slightly earlier for smoother feel
        },
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.15,
        ease: "power3.out"
    });

    // Showcase Parallax
    gsap.to('.showcase-image img', {
        scrollTrigger: {
            trigger: '.showcase',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5
        },
        y: 50, // Gentle parallax
        scale: 1.1, // Gentle zoom on scroll
        ease: 'none'
    });

    // Showcase Text Reveal
    gsap.from('.showcase-text > *', {
        scrollTrigger: {
            trigger: '.showcase',
            start: 'top 70%',
        },
        x: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out"
    });

    // Newsletter Entrance
    gsap.from('.newsletter-content', {
        scrollTrigger: {
            trigger: '.newsletter',
            start: 'top 75%',
        },
        scale: 0.9,
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.5)"
    });
});
