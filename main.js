// =========================================
// ELEMENTE
// =========================================

const navbar = document.querySelector('#navbar');

const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');

const serviceItems = document.querySelectorAll('.service-accordion-item');

const faqItems = document.querySelectorAll('.faq-item');

const revealElements = document.querySelectorAll('.reveal');


// =========================================
// NAVBAR
// SCROLL DOWN = VERSTECKEN
// SCROLL UP = ANZEIGEN
// =========================================

let lastScrollY = window.scrollY;
let navbarScrollTicking = false;

function updateNavbar() {

    if (!navbar) {
        return;
    }

    const currentScrollY = window.scrollY;


    // Na vrhu stranice navbar je uvijek vidljiv
    if (currentScrollY <= 20) {

        navbar.classList.remove('navbar-scrolled');
        navbar.classList.remove('navbar-hidden');

        lastScrollY = currentScrollY;

        return;
    }


    // Nakon malog scrolla dobija pozadinu
    if (currentScrollY > 40) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }


    /*
       Ako je mobilni menu otvoren,
       navbar ostaje vidljiv.
    */

    if (
        nav &&
        nav.classList.contains('active')
    ) {

        navbar.classList.remove('navbar-hidden');

        lastScrollY = currentScrollY;

        return;
    }


    const scrollDifference =
        currentScrollY - lastScrollY;


    /*
       Koristimo malu toleranciju od 5px
       da navbar ne treperi kod sitnih
       pomjeranja touchpada/mobitela.
    */

    if (scrollDifference > 5) {

        // Scroll prema dole
        navbar.classList.add('navbar-hidden');

    } else if (scrollDifference < -5) {

        // Scroll prema gore
        navbar.classList.remove('navbar-hidden');

    }


    lastScrollY = currentScrollY;

}


function handleNavbarScroll() {

    if (navbarScrollTicking) {
        return;
    }

    navbarScrollTicking = true;

    window.requestAnimationFrame(() => {

        updateNavbar();

        navbarScrollTicking = false;

    });

}


updateNavbar();

window.addEventListener(
    'scroll',
    handleNavbarScroll,
    {
        passive: true
    }
);


// =========================================
// MOBILE MENU
// =========================================

function openMobileMenu() {

    if (!nav || !burger) {
        return;
    }

    nav.classList.add('active');

    burger.classList.add('active');

    burger.setAttribute(
        'aria-expanded',
        'true'
    );

    burger.setAttribute(
        'aria-label',
        'Navigation schließen'
    );

    document.body.classList.add(
        'menu-open'
    );


    // Navbar mora biti vidljiv dok je menu otvoren
    if (navbar) {
        navbar.classList.remove('navbar-hidden');
    }

}


function closeMobileMenu() {

    if (!nav || !burger) {
        return;
    }

    nav.classList.remove('active');

    burger.classList.remove('active');

    burger.setAttribute(
        'aria-expanded',
        'false'
    );

    burger.setAttribute(
        'aria-label',
        'Navigation öffnen'
    );

    document.body.classList.remove(
        'menu-open'
    );

}


if (burger && nav) {

    burger.addEventListener(
        'click',
        () => {

            const menuIsOpen =
                nav.classList.contains('active');

            if (menuIsOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }

        }
    );

}


navAnchors.forEach(link => {

    link.addEventListener(
        'click',
        () => {
            closeMobileMenu();
        }
    );

});


window.addEventListener(
    'resize',
    () => {

        if (window.innerWidth > 900) {
            closeMobileMenu();
        }

    }
);


document.addEventListener(
    'keydown',
    event => {

        if (
            event.key === 'Escape' &&
            nav &&
            nav.classList.contains('active')
        ) {
            closeMobileMenu();
        }

    }
);


document.addEventListener(
    'click',
    event => {

        if (
            window.innerWidth <= 900 &&
            nav &&
            burger &&
            nav.classList.contains('active') &&
            !nav.contains(event.target) &&
            !burger.contains(event.target)
        ) {
            closeMobileMenu();
        }

    }
);


// =========================================
// LEISTUNGEN ACCORDION
// =========================================

serviceItems.forEach(item => {

    const button =
        item.querySelector(
            '.service-accordion-header'
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        'click',
        () => {

            const isAlreadyOpen =
                item.classList.contains('active');

            serviceItems.forEach(
                otherItem => {

                    otherItem.classList.remove(
                        'active'
                    );

                }
            );

            if (!isAlreadyOpen) {

                item.classList.add(
                    'active'
                );

            }

        }
    );

});


// =========================================
// FAQ
// NUR EIN FAQ GLEICHZEITIG
// =========================================

faqItems.forEach(item => {

    item.addEventListener(
        'toggle',
        () => {

            if (!item.open) {
                return;
            }

            faqItems.forEach(
                otherItem => {

                    if (otherItem !== item) {

                        otherItem.removeAttribute(
                            'open'
                        );

                    }

                }
            );

        }
    );

});


// =========================================
// SCROLL REVEAL
// SIGURNA VERZIJA
// =========================================

const prefersReducedMotion =
    window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;


if (
    !prefersReducedMotion &&
    'IntersectionObserver' in window
) {

    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                'reveal-visible'
                            );

                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.08,
                rootMargin:
                    '0px 0px -30px 0px'
            }
        );


    revealElements.forEach(
        (element, index) => {

            element.classList.add(
                'reveal-ready'
            );

            element.style.transitionDelay =
                `${Math.min(index % 3, 2) * 60}ms`;

            revealObserver.observe(
                element
            );

        }
    );

} else {

    revealElements.forEach(
        element => {

            element.classList.remove(
                'reveal-ready'
            );

            element.classList.add(
                'reveal-visible'
            );

        }
    );

}