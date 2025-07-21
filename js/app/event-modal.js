const EventModal = (function () {
    // Current event being displayed
    let currentEvent = null;

    // Initialize module
    function init() {
        // No initialization needed for now
    }

    // Open event modal with event details
    function openEventModal(event) {
        if (!event) {
            console.error('No event data provided');
            return;
        }

        currentEvent = event;

        // Set modal title and date
        document.getElementById('modalTitle').textContent = event.title;
        document.getElementById('modalDate').textContent = Utils.formatEventDate(event.date, event.time, 'long');

        // Set modal content
        populateModalContent(event);

        // Configure buttons
        setupModalButtons(event);

        // Show modal
        ModalManager.openModal('eventModal');

        if (typeof window.refreshSVGs === 'function') {
            window.refreshSVGs();
        }
    }

    // Populate the modal content with event details
    function populateModalContent(event) {
        const modalDetails = document.getElementById('modalDetails');
        if (!modalDetails) return;

        // Get event image
        const imagePath = Utils.getEventImagePath(event);

        // Create event details HTML
        modalDetails.innerHTML = `
            <div class="p-relative">
            <div class="event-modal-img" style="background-image: url('${imagePath}')"></div>
            <div class="btn edit-btn" id="editEventBtn">Edit Event</div>
            </div>
            <p class="mb-1 pb-1" style="border-bottom: 3px solid var(--color-dark-600);"> ${event.description}</p>
            <div class="flex-col items-flex-start gap-2">
                <div>
                    <span class="svg-calendar icon" aria-hidden="true"></span>
                    <strong>Date:</strong> ${Utils.formatEventDate(event.date)}
                </div>
                <div>
                    <span class="svg-clock icon" aria-hidden="true"></span>
                    <strong>Time:</strong> ${event.time}
                </div>
                <div>
                    <span class="svg-location icon" aria-hidden="true"></span>
                    <strong>Location:</strong> ${event.location}
                </div>
                <div>
                    <span class="svg-category icon" aria-hidden="true"></span>
                    <strong>Category:</strong> ${event.category}
                </div>
                <div>
                    <span class="svg-participants icon" aria-hidden="true"></span>
                    <strong>Participants:</strong> <span class="modal-participants">${event.participants}/${event.maxParticipants} registered</span>
                </div>
            </div>
        `;
    }

    // Set up the action buttons in the modal
    function setupModalButtons(event) {
        const joinBtn = document.getElementById('joinEventBtn');

        // Handle Join button visibility
        if (event.participants >= event.maxParticipants) {
            joinBtn.textContent = 'Event is full';
            joinBtn.disabled = true;
        } else {
            joinBtn.textContent = 'Join Event';
            joinBtn.disabled = false;

            // Set up join button click handler
            joinBtn.onclick = function () {
                if (typeof EventRegistration !== 'undefined' && EventRegistration.openRegistrationModal) {
                    EventRegistration.openRegistrationModal(event.id);
                }
            };
        }

        // Check if SurgeDatePicker is working properly
        const datePickerAvailable = typeof DatePicker !== 'undefined';

        // Find the edit button (added in the HTML template)
        let editBtn = document.getElementById('editEventBtn');

        if (editBtn) {
            // Show or hide based on datepicker availability
            if (!datePickerAvailable) {
                editBtn.style.display = 'none'; // Hide the button
            } else {
                editBtn.style.display = 'block'; // Show the button
            }

            // Set edit button handler
            editBtn.onclick = function () {
                // Close this modal
                closeEventModal();

                // Open edit form
                if (typeof EventForm !== 'undefined' && EventForm.openEditEventForm) {
                    EventForm.openEditEventForm(event.id);
                }
            };
        }
    }

    // Close the event modal
    function closeEventModal() {
        ModalManager.closeModal('eventModal');
        currentEvent = null;
    }

    // Update modal if event data has changed
    function updateEventDetails() {
        // If modal is open and we have current event, refresh the display
        if (currentEvent && document.getElementById('eventModal').style.display === 'block') {
            const freshEvent = EventsData.getEventById(currentEvent.id);
            if (freshEvent) {
                openEventModal(freshEvent);
            }
        }
    }

    // Public API
    return {
        init,
        openEventModal,
        closeEventModal,
        updateEventDetails,
        getCurrentEvent: () => currentEvent
    };
})();