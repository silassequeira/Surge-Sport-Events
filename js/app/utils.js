const Utils = (function () {
    // Date formatting functions
    function formatEventDate(dateString, timeString = null, format = 'medium') {
        if (!dateString) return 'Date TBD';

        const date = new Date(dateString);
        let options;

        switch (format) {
            case 'short':
                options = { month: 'short', day: 'numeric' };
                break;
            case 'medium':
                options = { month: 'short', day: 'numeric', year: 'numeric' };
                break;
            case 'long':
                options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
                break;
            default:
                options = { month: 'short', day: 'numeric', year: 'numeric' };
        }

        const formattedDate = date.toLocaleDateString('en-US', options);
        return timeString ? `${formattedDate} at ${timeString}` : formattedDate;
    }

    // Time calculations
    function calculateTimeUntil(dateString, timeString = '00:00') {
        const now = new Date();
        const eventDate = new Date(dateString + 'T' + timeString);
        const timeDiff = eventDate - now;

        if (timeDiff < 0) return 'Past event';

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Tomorrow';
        if (days < 7) return `In ${days} days`;
        if (days < 30) return `In ${Math.floor(days / 7)} weeks`;
        return `In ${Math.floor(days / 30)} months`;
    }

    // Image handling functions
    function getEventImagePath(event) {
        if (event.imageData) {
            return event.imageData; // Direct base64 data has highest priority
        } else if (event.imageId) {
            return `images/uploads/${event.imageId}.webp`;
        } else {
            return 'SVG_PLACEHOLDER';
        }
    }

    // Convert file to base64
    async function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('No file provided'));
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // DOM helpers
    function createElement(tag, className, content = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (content) element.textContent = content;
        return element;
    }

    function hideElement(element) {
        if (element) element.style.display = 'none';
    }

    function showElement(element, displayType = 'block') {
        if (element) element.style.display = displayType;
    }


    // Add to Utils module
    function createEventCard(event, options = {}) {
        const {
            containerClass = 'event-card',
            isSlider = false,
            onClick = null
        } = options;

        const card = createElement('div', containerClass);
        card.setAttribute('data-event-id', event.id);

        const imagePath = getEventImagePath(event);
        let imageHtml;

        if (imagePath === 'SVG_PLACEHOLDER') {
            // Use the SVG symbol for placeholder
            imageHtml = `
            <div class="${isSlider ? 'slider-card-img ' : ''}event-card-img placeholder-container">
                <span class="svg-placeholder" aria-hidden="true"></span>
                <span class="${isSlider ? 'slider-card-category ' : ''}event-card-category">
                    ${event.category}
                </span>
            </div>`;
        } else {
            // Use background image for actual images
            imageHtml = `
            <div class="${isSlider ? 'slider-card-img ' : ''}event-card-img" 
                style="background-image: url('${imagePath}')" 
                aria-label="Image for ${event.title}">
                <span class="${isSlider ? 'slider-card-category ' : ''}event-card-category">
                    ${event.category}
                </span>
            </div>`;
        }

        card.innerHTML = `
        <div class="${isSlider ? 'slider-card-content' : ''}">
            <div class="${isSlider ? 'slider-card-img ' : ''}event-card-img" 
                style="background-image: url('${imagePath}')" 
                aria-label="Image for ${event.title}">
                <span class="${isSlider ? 'slider-card-category ' : ''}event-card-category">
                    ${event.category}
                </span>
            </div>
            <div class="${isSlider ? 'slider-card-body ' : ''}event-card-body">
                <h3 class="${isSlider ? 'slider-card-title' : 'event-card-title'}">${event.title}</h3>
                <div class="${isSlider ? 'slider-card-info' : 'event-card-info'}">
                    <span class="svg-calendar icon" aria-hidden="true"></span>
                    <span>${formatEventDate(event.date)}</span>
                </div>
                <div class="${isSlider ? 'slider-card-info' : 'event-card-info'}">
                    <span class="svg-location icon" aria-hidden="true"></span>
                    <span>${event.location}</span>
                </div>
                <div class="${isSlider ? 'slider-card-info event-card-footer' : 'event-card-footer'}">
                    <span class="event-participation"><span class="svg-participants icon"></span>
                        ${event.participants}/${event.maxParticipants} registered
                    </span>
                    <span class="event-more">View details <span class="svg-arrow icon-small ml-03"></span></span>
                </div>
            </div>
        </div>
    `;

        // Store event data for easy access
        card.eventData = event;

        // Add click handler if provided
        if (onClick) {
            card.addEventListener('click', (e) => onClick(e, card, event));
        } else {
            // Default click handler to open event modal
            card.addEventListener('click', function () {
                if (typeof EventModal !== 'undefined' && EventModal.openEventModal) {
                    EventModal.openEventModal(event);
                }
            });
        }

        return card;
    }

    return {
        formatEventDate,
        calculateTimeUntil,
        getEventImagePath,
        createEventCard,
        fileToBase64,
        createElement,
        hideElement,
        showElement
    };
})();