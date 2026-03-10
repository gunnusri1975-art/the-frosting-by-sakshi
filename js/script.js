document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Lightbox Functionality (Gallery) ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.getElementById('close-lightbox');
    const galleryGrid = document.getElementById('gallery-grid');

    if (galleryGrid && lightbox && lightboxImg) {
        galleryGrid.addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() === 'img') {
                lightbox.style.display = 'block';
                lightboxImg.src = e.target.src;
            }
        });
    }

    if (closeLightbox && lightbox) {
        closeLightbox.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }

    // --- 2. Menu Search Filter ---
    const menuSearch = document.getElementById('menu-search');
    const menuItems = document.querySelectorAll('.menu-item');
    const menuSections = document.querySelectorAll('.menu-section');
    const noResults = document.getElementById('no-results');

    if (menuSearch) {
        menuSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            let totalMatch = 0;

            menuSections.forEach(section => {
                const itemsInSection = section.querySelectorAll('.menu-item');
                let sectionMatch = 0;

                itemsInSection.forEach(item => {
                    const itemName = item.querySelector('.menu-name').textContent.toLowerCase();
                    if (itemName.includes(query)) {
                        item.style.display = 'flex';
                        sectionMatch++;
                        totalMatch++;
                    } else {
                        item.style.display = 'none';
                    }
                });

                // Show/Hide section based on visibility of its items
                if (sectionMatch > 0) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });

            // Show/Hide "No Results" message
            if (noResults) {
                if (totalMatch === 0) {
                    noResults.style.display = 'block';
                } else {
                    noResults.style.display = 'none';
                }
            }
        });
    }

    // --- 3. Hamburger Menu Toggle ---
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    const navOverlay = document.getElementById('nav-overlay');

    if (navToggle && navLinks) {
        const toggleMenu = () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
            if (navOverlay) navOverlay.classList.toggle('active');
            document.body.classList.toggle('nav-open');

            // Change icon between burger and close
            const icon = navToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        };

        navToggle.addEventListener('click', toggleMenu);

        if (navOverlay) {
            navOverlay.addEventListener('click', toggleMenu);
        }

        // Close menu when a link is clicked
        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                if (navOverlay) navOverlay.classList.remove('active');
                document.body.classList.remove('nav-open');

                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

});
