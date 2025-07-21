const EventDisplay = (function () {
    // Track active filters
    let activeCategory = 'all';

    // Initialize module
    function init() {
        setupFilters();
        setupCalendarFilter();
        renderEvents();
    }

    // Set up category filter buttons
    function setupFilters() {
        const filterButtons = document.querySelectorAll('.filters [data-category]');

        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                const category = this.getAttribute('data-category');

                // Update UI
                filterButtons.forEach(btn => btn.classList.remove('btn-white', 'active'));
                this.classList.add('btn-white', 'active');

                // Apply filter
                activeCategory = category;
                EventsData.filterByCategory(category);
                renderEvents();
            });
        });

        // Handle "Other Categories" dropdown
        setupOtherCategoriesDropdown();
    }

    // Set up the dropdown for additional categories
    function setupOtherCategoriesDropdown() {
        const dropdown = document.getElementById('otherCategoriesDropdown');
        const dropdownBtn = document.getElementById('otherCategoriesBtn');
        if (!dropdown || !dropdownBtn) return;

        // Clear existing items
        dropdown.innerHTML = '';

        // Get other categories from EventsData
        const otherCategories = EventsData.getOtherCategories();

        // If no other categories, hide the dropdown button
        if (otherCategories.length === 0) {
            dropdownBtn.style.display = 'none';
            return;
        }

        // Show the dropdown button
        dropdownBtn.style.display = 'inline-flex';

        // Add categories to dropdown
        otherCategories.forEach(category => {
            const displayName = category.charAt(0).toUpperCase() + category.slice(1);
            const item = document.createElement('a');
            item.href = '#';
            item.textContent = displayName;

            item.addEventListener('click', function (e) {
                e.preventDefault();

                // Update active category
                activeCategory = category;

                // Update UI
                document.querySelectorAll('.filters [data-category]').forEach(btn => {
                    btn.classList.remove('active');
                });
                dropdownBtn.classList.add('active');

                // Apply filter
                EventsData.filterByCategory(category);
                renderEvents();
            });

            dropdown.appendChild(item);
        });

        // Add dropdown toggle behavior
        dropdownBtn.addEventListener('click', function (e) {
            dropdown.classList.toggle('show');
            e.stopPropagation();

            document.querySelectorAll('.filters [data-category]').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');

            // Update active category
            activeCategory = 'other-all';

            // Use existing filter mechanism with special value
            EventsData.filterByCategory('other-all');
            renderEvents();
        });

        // Close dropdown when clicking elsewhere
        document.addEventListener('click', function () {
            dropdown.classList.remove('show');
        });
    }

    // Set up calendar date filter
    function setupCalendarFilter() {
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        const applyButton = document.getElementById('applyDateFilter');
        const resetButton = document.getElementById('resetDateFilter');

        // Skip if elements don't exist
        if (!startDateInput || !endDateInput || !applyButton || !resetButton) return;

        // Set min dates to today
        const today = new Date();
        const todayISO = today.toISOString().split('T')[0];

        // Calculate last day of the current month for endDate placeholder
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const lastDayISO = lastDayOfMonth.toISOString().split('T')[0];

        // Format dates for display in placeholders
        const formatDate = (date) => {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return date.toLocaleDateString(undefined, options);
        };

        // Set placeholders
        startDateInput.placeholder = formatDate(today);
        endDateInput.placeholder = formatDate(lastDayOfMonth);

        // Set min dates
        startDateInput.min = todayISO;
        endDateInput.min = todayISO;

        // Rest of the function remains the same...
        // Apply date filter
        applyButton.addEventListener('click', function () {
            const startDate = startDateInput.value;
            const endDate = endDateInput.value;

            if (startDate || endDate) {
                EventsData.filterByDate(startDate, endDate);
                renderEvents();

                // Add visual indication
                this.classList.add('active');
                resetButton.classList.add('visible');
            }
        });

        // Reset date filter
        resetButton.addEventListener('click', function () {
            startDateInput.value = '';
            endDateInput.value = '';

            EventsData.resetDateFilter();
            renderEvents();

            // Remove visual indication
            applyButton.classList.remove('active');
            this.classList.remove('visible');
        });
    }

    // Render events based on current filters
    function renderEvents() {
        const eventsGrid = document.getElementById('eventsGrid');
        if (!eventsGrid) return;

        const events = EventsData.getFilteredEvents();

        // Clear existing content
        eventsGrid.innerHTML = '';

        if (events.length === 0) {
            const noEvents = Utils.createElement('p', 'no-events-message',
                'No events found. Try adjusting your filters or check back later.');
            eventsGrid.appendChild(noEvents);
            return;
        }

        // Create event cards using the shared utility function
        events.forEach(event => {
            const eventCard = Utils.createEventCard(event, {
                onClick: (e, card, event) => {
                    if (typeof EventModal !== 'undefined' && EventModal.openEventModal) {
                        EventModal.openEventModal(event);
                    }
                }
            });
            eventsGrid.appendChild(eventCard);
        });

        if (typeof window.refreshSVGs === 'function') {
            window.refreshSVGs();
        }
    }

    // Update displayed participant count for an event
    function updateEventParticipantCount(eventId) {
        const event = EventsData.getEventById(eventId);
        if (!event) return;

        // Update in event grid
        const eventCards = document.querySelectorAll(`[data-event-id="${eventId}"] .event-participation`);
        eventCards.forEach(participationEl => {
            participationEl.textContent = `${event.participants}/${event.maxParticipants} registered`;
        });

        // Also update in event modal if it's open
        const modalParticipantsEl = document.querySelector('#eventModal .modal-participants');
        if (modalParticipantsEl && document.getElementById('eventModal').style.display === 'block') {
            modalParticipantsEl.textContent = `${event.participants}/${event.maxParticipants} registered`;
        }
    }

    function refreshCategoriesDropdown() {
        // Only proceed if we're on a page with the dropdown
        const dropdown = document.getElementById('otherCategoriesDropdown');
        if (!dropdown) return;

        // Force clear and rebuild the dropdown
        dropdown.innerHTML = '';

        // Get updated categories
        const otherCategories = EventsData.getOtherCategories();

        // Debug - check what categories are being found
        console.log('Refreshing other categories dropdown with:', otherCategories);

        // Rebuild the dropdown
        otherCategories.forEach(category => {
            const item = document.createElement('a');
            item.href = '#';
            item.textContent = category.charAt(0).toUpperCase() + category.slice(1);

            item.addEventListener('click', function (e) {
                e.preventDefault();

                // Update active category
                activeCategory = category;

                // Update UI
                document.querySelectorAll('.filters [data-category]').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.getElementById('otherCategoriesBtn').classList.add('active');

                // Apply filter
                EventsData.filterByCategory(category);
                renderEvents();
            });

            dropdown.appendChild(item);
        });

        // Update dropdown button visibility
        const dropdownBtn = document.getElementById('otherCategoriesBtn');
        if (dropdownBtn) {
            dropdownBtn.style.display = otherCategories.length > 0 ? 'block' : 'none';
        }
    }

    // Public API
    return {
        init,
        renderEvents,
        updateEventParticipantCount,
        refreshCategoriesDropdown
    };
})();