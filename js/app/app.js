const App = (function () {
    // Initialize the application
    function init() {

        checkUrlParams();

        // Initialize core modules
        EventsData.init();
        UI.init();

        if (typeof DatePicker !== 'undefined') {
            DatePicker.init();
        }

        // Initialize feature modules if they exist
        if (typeof EventDisplay !== 'undefined') {
            EventDisplay.init();
        }

        if (typeof EventModal !== 'undefined') {
            EventModal.init();
        }

        // Initialize optional modules if they exist
        if (typeof EventForm !== 'undefined') {
            EventForm.init();
        }

        if (typeof EventRegistration !== 'undefined') {
            EventRegistration.init();
        }

        if (typeof EventSlider !== 'undefined') {
            EventSlider.init();
        }

        // Check URL parameters for direct event access
        checkUrlForEvent();
    }

    function highlightActiveFilterButton(category) {
        // Default to 'all' if no category is specified
        category = category || 'all';

        // First, remove highlight from all filter buttons
        document.querySelectorAll('.filters .btn-white').forEach(btn => {
            btn.classList.remove('btn-white');
            btn.classList.add('btn');
        });

        // Then highlight the active one
        const activeButton = document.querySelector(`.filters [data-category="${category}"]`);
        if (activeButton) {
            activeButton.classList.remove('btn');
            activeButton.classList.add('btn-white');
        }
    }

    function checkUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const category = params.get('category');

        if (category && window.location.pathname.includes('events.html')) {
            console.log('Applying category filter:', category);

            setTimeout(() => {
                if (typeof EventsData !== 'undefined') {
                    EventsData.filterByCategory(category);

                    if (typeof EventDisplay !== 'undefined') {
                        EventDisplay.renderEvents();

                        // Highlight the active filter button
                        highlightActiveFilterButton(category);

                        // Optional: scroll to events section
                        const eventsSection = document.getElementById('eventsSection');
                        if (eventsSection) {
                            eventsSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                }
            }, 100);
        } else {
            // Default to 'all' when no category specified
            highlightActiveFilterButton('all');
        }
    }

    // Check if URL contains event parameter
    function checkUrlForEvent() {
        const params = new URLSearchParams(window.location.search);
        const eventId = params.get('event');

        if (eventId && typeof EventModal !== 'undefined') {
            const event = EventsData.getEventById(eventId);
            if (event) {
                EventModal.openEventModal(event);
            }
        }
    }

    // Public API
    return {
        init
    };
})();

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    App.init();
});