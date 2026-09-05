'use strict';

/* =========================================================
   PORTFOLIO - SCRIPT.JS
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    initializeAOS();
    initializeLucide();
    initializeNavbar();
    initializeMobileMenu();
    initializeSmoothScroll();
    initializeCounters();
    initializeCollectionsSlider();
    initializeTestimonials();
    initializeFancybox();
    initializeContactForm();
    initializeScrollToTop();
    initializeCurrentYear();
});


/* =========================================================
   AOS ANIMATION
   ========================================================= */

function initializeAOS() {
    if (typeof AOS === 'undefined') {
        console.warn('AOS library not loaded.');

        document.querySelectorAll('[data-aos]').forEach((element) => {
            element.style.opacity = '1';
            element.style.transform = 'none';
        });

        return;
    }

    AOS.init({
        duration: 1000,
        once: true,
        offset: 50
    });

    window.addEventListener('load', () => {
        AOS.refreshHard();
    });
}


/* =========================================================
   LUCIDE ICONS
   ========================================================= */

function initializeLucide() {
    if (typeof lucide === 'undefined') {
        return;
    }

    lucide.createIcons();
}


/* =========================================================
   NAVBAR
   ========================================================= */

function initializeNavbar() {
    const navbar = document.getElementById('navbar');

    if (!navbar) {
        return;
    }

    const initialClasses = [
        'top-4',
        'left-1/2',
        '-translate-x-1/2',
        'w-[95%]',
        'max-w-6xl',
        'rounded-full'
    ];

    let ticking = false;

    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
            navbar.classList.remove(...initialClasses);
        } else {
            navbar.classList.remove('navbar-scrolled');
            navbar.classList.add(...initialClasses);
        }

        ticking = false;
    }

    window.addEventListener(
        'scroll',
        () => {
            if (!ticking) {
                window.requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        },
        { passive: true }
    );

    updateNavbar();
}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function initializeMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuOverlay = document.getElementById('menu-overlay');

    if (!menuToggle || !menuOverlay) {
        return;
    }

    const mobileDropdownToggle =
        document.getElementById('mobile-dropdown-toggle');

    const mobileDropdown =
        document.getElementById('mobile-dropdown');


    /* -------------------------------------------------------
       Menu state
       ------------------------------------------------------- */

    function setMenuState(isOpen) {
        menuToggle.classList.toggle('is-active', isOpen);
        menuOverlay.classList.toggle('is-open', isOpen);

        menuToggle.setAttribute(
            'aria-expanded',
            String(isOpen)
        );

        menuOverlay.setAttribute(
            'aria-hidden',
            String(!isOpen)
        );

        document.body.classList.toggle(
            'overflow-hidden',
            isOpen
        );
    }


    /* -------------------------------------------------------
       Toggle menu
       ------------------------------------------------------- */

    menuToggle.addEventListener('click', () => {
        const isOpen =
            menuOverlay.classList.contains('is-open');

        setMenuState(!isOpen);
    });


    /* -------------------------------------------------------
       Escape key
       ------------------------------------------------------- */

    document.addEventListener('keydown', (event) => {
        if (
            event.key === 'Escape' &&
            menuOverlay.classList.contains('is-open')
        ) {
            setMenuState(false);
        }
    });


    /* -------------------------------------------------------
       Close after clicking menu link
       ------------------------------------------------------- */

    menuOverlay
        .querySelectorAll('a')
        .forEach((link) => {
            link.addEventListener('click', () => {
                setMenuState(false);
            });
        });


    /* -------------------------------------------------------
       Mobile dropdown
       ------------------------------------------------------- */

    if (mobileDropdownToggle && mobileDropdown) {

        mobileDropdownToggle.setAttribute(
            'aria-expanded',
            'false'
        );

        mobileDropdownToggle.addEventListener(
            'click',
            () => {

                const isOpen =
                    mobileDropdownToggle.classList.toggle(
                        'is-open'
                    );

                mobileDropdownToggle.setAttribute(
                    'aria-expanded',
                    String(isOpen)
                );

                mobileDropdown.style.display =
                    isOpen ? 'flex' : 'none';
            }
        );
    }


    /* -------------------------------------------------------
       Reset menu on desktop
       ------------------------------------------------------- */

    window.addEventListener(
        'resize',
        () => {
            if (window.innerWidth > 768) {
                setMenuState(false);

                if (mobileDropdown) {
                    mobileDropdown.style.display = '';
                }

                if (mobileDropdownToggle) {
                    mobileDropdownToggle.classList.remove(
                        'is-open'
                    );

                    mobileDropdownToggle.setAttribute(
                        'aria-expanded',
                        'false'
                    );
                }
            }
        },
        { passive: true }
    );
}


/* =========================================================
   SMOOTH SCROLL
   ========================================================= */

function initializeSmoothScroll() {
    const links =
        document.querySelectorAll('a[data-scroll]');

    if (!links.length) {
        return;
    }

    links.forEach((link) => {

        link.addEventListener('click', (event) => {

            const selector =
                link.getAttribute('href');

            if (
                !selector ||
                !selector.startsWith('#')
            ) {
                return;
            }

            const target =
                document.querySelector(selector);

            if (!target) {
                return;
            }

            event.preventDefault();

            const navbar =
                document.getElementById('navbar');

            const navbarHeight =
                navbar ? navbar.offsetHeight : 0;

            const offset =
                Math.max(80, navbarHeight);

            const targetPosition =
                selector === '#hero'
                    ? 0
                    : target.getBoundingClientRect().top +
                      window.scrollY -
                      offset;

            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
            });
        });

    });
}


/* =========================================================
   COUNTERS
   ========================================================= */

function initializeCounters() {
    const container =
        document.getElementById('counters');

    if (!container) {
        return;
    }

    const counters =
        container.querySelectorAll('.counter-value');

    if (!counters.length) {
        return;
    }

    let started = false;

    function animateCounter(element) {

        const target =
            Number(element.dataset.target);

        if (!Number.isFinite(target)) {
            return;
        }

        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(elapsed / duration, 1);

            /* Ease-out */
            const eased =
                1 - Math.pow(1 - progress, 3);

            const value =
                Math.floor(target * eased);

            element.textContent =
                value.toString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent =
                    target.toString();
            }
        }

        requestAnimationFrame(update);
    }


    function checkCounters() {

        if (started) {
            return;
        }

        const rect =
            container.getBoundingClientRect();

        if (
            rect.top <=
            window.innerHeight - 100
        ) {

            counters.forEach(animateCounter);

            started = true;

            window.removeEventListener(
                'scroll',
                checkCounters
            );
        }
    }


    window.addEventListener(
        'scroll',
        checkCounters,
        { passive: true }
    );

    checkCounters();
}


/* =========================================================
   PROJECT / COLLECTION SLIDER
   =========================================================

   IMPORTANT:
   There is NO new Swiper() here.

   This project slider uses native horizontal scrolling.
   ========================================================= */

function initializeCollectionsSlider() {
    const track = document.getElementById('projectsTrack');

    const leftButton = document.getElementById('scrollLeft');
    const rightButton = document.getElementById('scrollRight');

    if (!track) {
        console.warn('projectsTrack not found');
        return;
    }

    /* =====================================================
       GET SCROLL AMOUNT
       ===================================================== */

    function getScrollAmount() {
        const slide = track.querySelector('.swiper-slide');

        if (!slide) {
            return 300;
        }

        const slideWidth = slide.getBoundingClientRect().width;

        const styles = window.getComputedStyle(track);

        const gap =
            parseFloat(styles.columnGap) ||
            parseFloat(styles.gap) ||
            24;

        return slideWidth + gap;
    }


    /* =====================================================
       LEFT BUTTON
       ===================================================== */

    if (leftButton) {
        leftButton.addEventListener('click', function () {
            track.scrollBy({
                left: -getScrollAmount(),
                behavior: 'smooth'
            });
        });
    }


    /* =====================================================
       RIGHT BUTTON
       ===================================================== */

    if (rightButton) {
        rightButton.addEventListener('click', function () {
            track.scrollBy({
                left: getScrollAmount(),
                behavior: 'smooth'
            });
        });
    }


    /* =====================================================
       UPDATE BUTTONS
       ===================================================== */

    function updateButtons() {
        const maxScroll =
            track.scrollWidth - track.clientWidth;

        if (leftButton) {
            leftButton.disabled =
                track.scrollLeft <= 1;
        }

        if (rightButton) {
            rightButton.disabled =
                track.scrollLeft >= maxScroll - 1;
        }
    }


    /* =====================================================
       TRACK SCROLL
       ===================================================== */

    track.addEventListener(
        'scroll',
        updateButtons,
        { passive: true }
    );


    /* =====================================================
       RESIZE
       ===================================================== */

    window.addEventListener(
        'resize',
        updateButtons,
        { passive: true }
    );


    /* =====================================================
       INITIAL STATE
       ===================================================== */

    updateButtons();
}


/* =========================================================
   TESTIMONIALS
   ========================================================= */

function initializeTestimonials() {

    const slides =
        document.querySelectorAll(
            '.testimonial-item'
        );

    if (!slides.length) {
        return;
    }

    if (slides.length === 1) {
        slides[0].classList.remove('opacity-0');
        slides[0].classList.add('opacity-100');
        return;
    }

    let currentSlide = 0;


    function showSlide(index) {

        slides.forEach(
            (slide, slideIndex) => {

                const active =
                    slideIndex === index;

                slide.classList.toggle(
                    'opacity-100',
                    active
                );

                slide.classList.toggle(
                    'opacity-0',
                    !active
                );

                slide.setAttribute(
                    'aria-hidden',
                    String(!active)
                );
            }
        );
    }


    showSlide(currentSlide);


    setInterval(() => {

        currentSlide =
            (currentSlide + 1) %
            slides.length;

        showSlide(currentSlide);

    }, 6000);
}


/* =========================================================
   FANCYBOX
   ========================================================= */

function initializeFancybox() {

    /*
     * Only initialize Fancybox if both jQuery
     * and Fancybox are actually available.
     */

    if (
        typeof jQuery === 'undefined' ||
        typeof jQuery.fn.fancybox !== 'function'
    ) {
        return;
    }


    const items =
        document.querySelectorAll(
            '[data-fancybox]'
        );


    if (!items.length) {
        return;
    }


    jQuery('[data-fancybox]').fancybox({

        buttons: [
            'zoom',
            'slideShow',
            'thumbs',
            'close'
        ],

        loop: true,

        infobar: true,

        caption: function () {
            return (
                jQuery(this).data('caption') ||
                ''
            );
        }
    });
}


/* =========================================================
   CONTACT FORM
   ========================================================= */

function initializeContactForm() {

    const form =
        document.getElementById('form');

    if (!form) {
        return;
    }


    const submitButton =
        form.querySelector(
            'button[type="submit"]'
        );


    if (!submitButton) {
        return;
    }


    const originalText =
        submitButton.textContent.trim();


    form.addEventListener(
        'submit',
        async (event) => {

            event.preventDefault();


            /* Prevent double submission */

            if (submitButton.disabled) {
                return;
            }


            const formData =
                new FormData(form);


            submitButton.disabled = true;

            submitButton.textContent =
                'Sending...';


            try {

                const response =
                    await fetch(
                        'https://api.web3forms.com/submit',
                        {
                            method: 'POST',
                            body: formData,

                            headers: {
                                Accept:
                                    'application/json'
                            }
                        }
                    );


                const data =
                    await response.json();


                if (
                    response.ok &&
                    data.success
                ) {

                    submitButton.textContent =
                        'Message Sent ✓';

                    form.reset();


                    setTimeout(() => {

                        submitButton.textContent =
                            originalText;

                        submitButton.disabled =
                            false;

                    }, 3000);


                    return;
                }


                throw new Error(
                    data.message ||
                    'Message could not be sent.'
                );

            } catch (error) {

                console.error(
                    'Contact form error:',
                    error
                );


                submitButton.textContent =
                    'Try Again';


                setTimeout(() => {

                    submitButton.textContent =
                        originalText;

                    submitButton.disabled =
                        false;

                }, 3000);
            }
        }
    );
}


/* =========================================================
   SCROLL TO TOP
   ========================================================= */

function initializeScrollToTop() {

    const button =
        document.getElementById(
            'scrollTopBtn'
        );


    if (!button) {
        return;
    }


    let ticking = false;


    function updateButton() {

        const visible =
            window.scrollY > 300;


        button.classList.toggle(
            'opacity-0',
            !visible
        );

        button.classList.toggle(
            'invisible',
            !visible
        );

        button.classList.toggle(
            'opacity-100',
            visible
        );

        button.classList.toggle(
            'visible',
            visible
        );


        ticking = false;
    }


    window.addEventListener(
        'scroll',
        () => {

            if (!ticking) {

                window.requestAnimationFrame(
                    updateButton
                );

                ticking = true;
            }

        },
        {
            passive: true
        }
    );


    button.addEventListener(
        'click',
        () => {

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        }
    );


    updateButton();
}


/* =========================================================
   CURRENT YEAR
   ========================================================= */

function initializeCurrentYear() {

    const yearElement =
        document.getElementById(
            'current-year'
        );


    if (!yearElement) {
        return;
    }


    yearElement.textContent =
        new Date().getFullYear();
}


/* =========================================================
   UTILITY
   ========================================================= */

function prefersReducedMotion() {

    return window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;
}