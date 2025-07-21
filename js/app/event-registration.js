const EventRegistration = (function () {
    // Current event being registered for
    let currentEventId = null;

    // Initialize the module
    function init() {
        setupRegistrationFormHandler();
    }

    // Set up the registration form submit handler
    function setupRegistrationFormHandler() {
        const form = document.getElementById('registrationForm');

        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            submitRegistration();
        });

        // Add handler for success modal finish button
        const finishBtn = document.getElementById('finishRegistrationBtn');
        if (finishBtn) {
            finishBtn.addEventListener('click', function () {
                ModalManager.closeModal('registrationSuccessModal');
                currentEventId = null;
            });
        }
    }

    // Open the registration modal for an event
    function openRegistrationModal(eventId) {
        const event = EventsData.getEventById(eventId);

        if (!event) {
            console.error(`Event with ID ${eventId} not found`);
            return;
        }

        // Check if event is full
        if (event.participants >= event.maxParticipants) {
            Notifications.showError('Sorry, this event is already at full capacity.');
            return;
        }

        // Set current event ID
        currentEventId = eventId;

        // Set event title in modal
        document.getElementById('registrationEventTitle').textContent = event.title;

        // Store event ID in hidden field
        document.getElementById('registrationEventId').value = eventId;

        // Reset form
        document.getElementById('registrationForm').reset();

        // Open modal
        ModalManager.openModal('registrationModal');
    }

    // Submit registration form
    function submitRegistration() {
        if (!currentEventId) {
            console.error('No event selected for registration');
            return;
        }

        // Gather form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            age: document.getElementById('age').value,
            experience: document.getElementById('experience').value,
            comments: document.getElementById('comments').value,
            registrationDate: new Date().toISOString()
        };

        // Register the participant
        const success = EventsData.registerParticipant(currentEventId, formData);

        if (success) {
            // Close registration modal
            ModalManager.closeModal('registrationModal');

            // Show success modal
            ModalManager.openModal('registrationSuccessModal');

            // Update UI to reflect new registration
            if (typeof EventDisplay !== 'undefined') {
                EventDisplay.updateEventParticipantCount(currentEventId);
            }

            if (typeof EventModal !== 'undefined') {
                EventModal.updateEventDetails();
            }
        } else {
            // Show error message
            Notifications.showError('Registration failed. The event may be full or no longer available.');
        }
    }

    // Close registration modal
    function closeRegistrationModal() {
        ModalManager.closeModal('registrationModal');
    }

    // Public API
    return {
        init,
        openRegistrationModal,
        closeRegistrationModal,
        getCurrentEventId: () => currentEventId
    };
})();