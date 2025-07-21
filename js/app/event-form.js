const EventForm = (function () {
    // Current event being edited (null for new events)
    let currentEventId = null;

    // Current image data
    let currentImageData = null;

    // Initialize the module
    function init() {
        setupEventFormHandler();
        setupImageUpload();
        setupCategoryChange();
    }

    // Set up the event form submit handler
    function setupEventFormHandler() {
        const form = document.getElementById('eventForm');

        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            saveEvent();
        });
    }

    // Set up the image upload functionality
    function setupImageUpload() {
        const dropZone = document.getElementById('imageDropZone');
        const imageUpload = document.getElementById('eventImageUpload');
        const imagePreview = document.getElementById('imagePreview');

        if (!dropZone || !imageUpload || !imagePreview) return;

        // Handle file selection
        imageUpload.addEventListener('change', function () {
            handleImageSelection(this.files[0]);
        });

        // Handle drop zone click
        dropZone.addEventListener('click', function () {
            imageUpload.click();
        });

        // Handle drag and drop
        dropZone.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.classList.add('active');
        });

        dropZone.addEventListener('dragleave', function () {
            this.classList.remove('active');
        });

        dropZone.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('active');

            if (e.dataTransfer.files.length) {
                handleImageSelection(e.dataTransfer.files[0]);
            }
        });
    }

    // Handle image file selection
    async function handleImageSelection(file) {
        if (!file) return;

        const imagePreview = document.getElementById('imagePreview');
        const imageData = document.getElementById('eventImageData');

        // Check file size (2MB limit)
        if (file.size > 2 * 1024 * 1024) {
            Notifications.showError('Image is too large. Please select an image under 2MB.');
            return;
        }

        try {
            // Convert to base64
            const base64Data = await Utils.fileToBase64(file);

            // Set preview
            imagePreview.innerHTML = `<img src="${base64Data}" alt="Event image preview">`;
            imagePreview.style.display = 'block';

            // Store data
            imageData.value = base64Data;
            currentImageData = base64Data;

            // Hide the drop zone prompt
            document.querySelector('.drop-zone-prompt').style.display = 'none';
        } catch (error) {
            console.error('Error processing image:', error);
            Notifications.showError('Failed to process the image. Please try again.');
        }
    }

    // Set up category change handler
    function setupCategoryChange() {
        const categorySelect = document.getElementById('eventCategory');
        const customCategoryGroup = document.getElementById('customCategoryGroup');

        if (!categorySelect || !customCategoryGroup) return;

        categorySelect.addEventListener('change', function () {
            if (this.value === 'other') {
                customCategoryGroup.style.display = 'block';
            } else {
                customCategoryGroup.style.display = 'none';
            }
        });
    }

    // Open form for creating a new event
    function openNewEventForm() {
        // Reset current event ID
        currentEventId = null;

        // Set form title
        document.getElementById('formTitle').textContent = 'Add New Event';

        // Reset form fields
        resetFormFields();

        // Open modal
        ModalManager.openModal('eventFormModal');
    }

    // Open form for editing an existing event
    function openEditEventForm(eventId) {
        const event = EventsData.getEventById(eventId);

        if (!event) {
            console.error(`Event with ID ${eventId} not found`);
            return;
        }

        // Set current event ID
        currentEventId = eventId;

        // Set form title
        document.getElementById('formTitle').textContent = 'Edit Event';

        // Populate form with event data
        populateFormFields(event);

        // Open modal
        ModalManager.openModal('eventFormModal');

    }

    // Reset all form fields
    function resetFormFields() {
        const form = document.getElementById('eventForm');
        if (!form) return;

        // Reset form
        form.reset();

        // Clear image preview
        const imagePreview = document.getElementById('imagePreview');
        if (imagePreview) {
            imagePreview.innerHTML = '';
            imagePreview.style.display = 'none';
        }

        // Show drop zone prompt
        const dropZonePrompt = document.querySelector('.drop-zone-prompt');
        if (dropZonePrompt) {
            dropZonePrompt.style.display = 'block';
        }

        // Clear image data
        document.getElementById('eventImageData').value = '';
        currentImageData = null;

        // Clear hidden ID field
        document.getElementById('eventId').value = '';

        // Hide custom category field
        document.getElementById('customCategoryGroup').style.display = 'none';
    }

    // Populate form with event data
    function populateFormFields(event) {
        // Set basic fields
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventTime').value = event.time;
        document.getElementById('eventLocation').value = event.location;
        document.getElementById('eventDescription').value = event.description;
        document.getElementById('maxParticipants').value = event.maxParticipants;
        document.getElementById('eventId').value = event.id;

        // Set category
        const categorySelect = document.getElementById('eventCategory');
        const customCategoryGroup = document.getElementById('customCategoryGroup');
        const customCategory = document.getElementById('customCategory');

        // Check if the category is in the predefined options
        const standardCategories = Array.from(categorySelect.options).map(opt => opt.value);

        if (standardCategories.includes(event.category.toLowerCase())) {
            categorySelect.value = event.category.toLowerCase();
            customCategoryGroup.style.display = 'none';
        } else {
            categorySelect.value = 'other';
            customCategoryGroup.style.display = 'block';
            customCategory.value = event.category;
        }

        // Set image preview
        const imagePreview = document.getElementById('imagePreview');
        const dropZonePrompt = document.querySelector('.drop-zone-prompt');

        if (event.imageData) {
            // Use direct image data
            imagePreview.innerHTML = `<img src="${event.imageData}" alt="Event image preview">`;
            imagePreview.style.display = 'block';
            document.getElementById('eventImageData').value = event.imageData;
            currentImageData = event.imageData;
            dropZonePrompt.style.display = 'none';
        } else if (event.imageId) {
            // Use image ID to construct path
            const imagePath = `images/uploads/${event.imageId}.webp`;
            imagePreview.innerHTML = `<img src="${imagePath}" alt="Event image preview">`;
            imagePreview.style.display = 'block';
            dropZonePrompt.style.display = 'none';
        } else {
            // No image
            imagePreview.innerHTML = '';
            imagePreview.style.display = 'none';
            document.getElementById('eventImageData').value = '';
            currentImageData = null;
            dropZonePrompt.style.display = 'block';
        }
    }

    // Save event (create new or update existing)
    function saveEvent() {
        // Gather form data
        const eventData = {
            title: document.getElementById('eventTitle').value,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            location: document.getElementById('eventLocation').value,
            description: document.getElementById('eventDescription').value,
            maxParticipants: parseInt(document.getElementById('maxParticipants').value),
            imageData: currentImageData
        };

        // Get category (handle custom category)
        const categorySelect = document.getElementById('eventCategory');
        if (categorySelect.value === 'other') {
            eventData.category = document.getElementById('customCategory').value;
        } else {
            eventData.category = categorySelect.value;
        }

        // Add ID if editing
        if (currentEventId) {
            eventData.id = parseInt(currentEventId);
        }

        let success, message;

        // Save to EventsData
        if (currentEventId) {
            // Update existing event
            success = EventsData.updateEvent(eventData);
            message = 'Event updated successfully';
        } else {
            // Create new event
            const newEvent = EventsData.addEvent(eventData);
            success = !!newEvent;
            message = 'Event created successfully';
        }

        if (success) {
            // Show success message
            Notifications.showSuccess(message);

            // Close modal
            ModalManager.closeModal('eventFormModal');

            // Update UI
            if (typeof EventDisplay !== 'undefined') {
                EventDisplay.renderEvents();
            }

            // Reset form for next use
            resetFormFields();
        } else {
            // Show error message
            Notifications.showError('Failed to save event. Please try again.');
        }

        if (isNewEvent) {
            const newEvent = EventsData.addEvent(eventData);
            if (newEvent) {
                // Close form and show success message
                closeEventForm();
                Notifications.show('Event added successfully!', 'success');

                // Refresh event display and categories dropdown
                if (typeof EventDisplay !== 'undefined') {
                    EventDisplay.renderEvents();
                    EventDisplay.refreshCategoriesDropdown(); // New method to call
                }
            } else {
                Notifications.show('Failed to add event', 'error');
            }
        } else {
            // Update existing event
            const updated = EventsData.updateEvent(eventData);
            if (updated) {
                closeEventForm();
                Notifications.show('Event updated successfully!', 'success');

                // Refresh event display and categories dropdown
                if (typeof EventDisplay !== 'undefined') {
                    EventDisplay.renderEvents();
                    EventDisplay.refreshCategoriesDropdown(); // New method to call
                }
            } else {
                Notifications.show('Failed to update event', 'error');
            }
        }
    }

    // Close event form
    function closeEventForm() {
        ModalManager.closeModal('eventFormModal');
    }

    // Public API
    return {
        init,
        openNewEventForm,
        openEditEventForm,
        closeEventForm
    };
})();