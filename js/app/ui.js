const UI = (function () {
    // Initialize UI components
    function init() {
        // Set up event handlers for navigation
        setupNavigation();

        // Set up mobile menu toggle
        setupMobileMenu();

        // Initialize modal management
        ModalManager.init();

        const addEventBtn = document.getElementById('addEventBtn');
        if (addEventBtn && typeof EventForm !== 'undefined') {
            addEventBtn.addEventListener('click', function () {
                EventForm.openNewEventForm();
            });
        }
    }

    // Show selected section and hide others
    function showSection(section) {
        // Get all sections
        const sections = document.querySelectorAll('main > section');

        // Hide all sections
        sections.forEach(s => {
            Utils.hideElement(s);
        });

        // Show the requested section
        const targetSection = document.getElementById(`${section}Section`);
        if (targetSection) {
            Utils.showElement(targetSection);

            // Update active nav link
            updateActiveNavLink(section);
        }

        // Close mobile menu if open
        document.getElementById('navLinks').classList.remove('active');

        // Scroll to top of section
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active nav link
    function updateActiveNavLink(section) {
        // Remove active class from all links
        document.querySelectorAll('[data-section]').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current link
        const currentLink = document.querySelector(`[data-section="${section}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        }
    }

    // Set up navigation links
    function setupNavigation() {
        const navLinks = document.querySelectorAll('[data-section]');

        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const section = this.getAttribute('data-section');
                showSection(section);
            });
        });
    }

    // Toggle mobile menu visibility
    function toggleMobileMenu() {
        document.getElementById('navLinks').classList.toggle('active');
    }

    // Set up mobile menu toggle
    function setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');

        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }
    }

    // Public API
    return {
        init,
        showSection,
        toggleMobileMenu
    };
})();