const EventSlider = (function () {
    // DOM Elements
    let sliderTrack;
    let sliderPrev;
    let sliderNext;
    let sliderPagination;

    // Slider state
    const state = {
        cards: [],
        currentIndex: 0,
        cardWidth: 0,
        cardCount: 0,
        cardPerView: 3,
        selectedCardId: null,
        dragging: {
            active: false,
            startPos: 0,
            currentTranslate: 0,
            prevTranslate: 0,
            animationID: 0,
            lastTouchX: 0
        }
    };

    // Initialize slider
    function init() {
        // Get DOM elements
        sliderTrack = document.getElementById('sliderTrack');
        sliderPrev = document.getElementById('sliderPrev');
        sliderNext = document.getElementById('sliderNext');
        sliderPagination = document.getElementById('sliderPagination');

        if (!sliderTrack) return;

        // Get upcoming events from EventsData module
        const events = EventsData.getUpcomingEvents(6);

        if (!events || events.length === 0) {
            sliderTrack.innerHTML = '<p class="no-events-message">No upcoming events found.</p>';
            return;
        }

        // Create event cards
        createEventCards(events);

        // Set card dimensions and update state
        updateDimensions();

        // Add navigation event listeners
        setupEventListeners();

        // Set active card (which also selects it initially)
        setActiveCard();

        // Update arrow button states
        updateArrowButtons();

        // Add resize listener
        window.addEventListener('resize', handleResize);
    }

    // Create event cards HTML
    function createEventCards(events) {
        sliderTrack.innerHTML = '';

        events.forEach((event, index) => {
            // Use the shared card creation function
            const card = Utils.createEventCard(event, {
                containerClass: 'slider-card',
                isSlider: true,
                onClick: (e, card, eventData) => {
                    // Prevent handling click if we were dragging
                    if (state.dragging.active) {
                        e.preventDefault();
                        return;
                    }

                    // Get data from the card element
                    const cardId = card.getAttribute('data-event-id');

                    // If this card is already selected, open the modal
                    if (state.selectedCardId === cardId) {
                        if (typeof EventModal !== 'undefined' && typeof EventModal.openEventModal === 'function') {
                            EventModal.openEventModal(eventData);
                        } else {
                            window.location.href = `events.html?event=${cardId}`;
                        }
                    } else {
                        // Otherwise, select this card
                        selectCard(card);
                    }
                }
            });

            // Add slider-specific attributes
            card.setAttribute('data-index', index);

            // Add to slider track
            sliderTrack.appendChild(card);
        });

        state.cards = Array.from(sliderTrack.querySelectorAll('.slider-card'));
        state.cardCount = state.cards.length;
    }

    // Select a card and show "View details" message
    function selectCard(card) {
        // Deselect all cards first
        state.cards.forEach(c => {
            c.classList.remove('active');
        });

        // Select this card
        card.classList.add('active');
        state.selectedCardId = card.getAttribute('data-event-id');

        // Update the current index to this card's index
        const cardIndex = parseInt(card.getAttribute('data-index'));
        state.currentIndex = cardIndex;

        // Update the slider position to center this card
        setSliderPosition();
    }

    // Update dimensions based on viewport size
    function updateDimensions() {
        const viewportWidth = window.innerWidth;

        // Calculate card width including margins
        const cardMargin = 30; // 15px on each side

        // Set fixed card width (content only, excluding margins)
        if (viewportWidth < 576) {
            state.cardWidth = 280; // Mobile card width
        } else if (viewportWidth < 992) {
            state.cardWidth = 300; // Tablet card width
        } else {
            state.cardWidth = 320; // Desktop card width
        }

        // Total card width including margins
        const totalCardWidth = state.cardWidth + cardMargin;

        // Store this for calculations
        state.totalCardWidth = totalCardWidth;

        // Keep track of cards per view for reference
        state.cardPerView = Math.floor(sliderTrack.parentElement.offsetWidth / totalCardWidth);

        // Apply width to cards (content only)
        state.cards.forEach(card => {
            card.style.minWidth = `${state.cardWidth}px`;
            card.style.width = `${state.cardWidth}px`;
            card.style.maxWidth = `${state.cardWidth}px`;
        });

        // Update slider position
        setSliderPosition();
    }

    // Set up all event listeners
    function setupEventListeners() {
        // Navigation buttons
        sliderPrev.addEventListener('click', function () {
            goToPrevSlide();
            // After sliding, select the now-active card
            selectActiveCard();
        });

        sliderNext.addEventListener('click', function () {
            goToNextSlide();
            // After sliding, select the now-active card
            selectActiveCard();
        });

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyDown);

        // Touch and mouse events for dragging
        state.cards.forEach(card => {
            // Touch events
            card.addEventListener('touchstart', touchStart);
            card.addEventListener('touchmove', touchMove);
            card.addEventListener('touchend', touchEnd);

            // Mouse events
            card.addEventListener('mousedown', dragStart);
            card.addEventListener('mousemove', drag);
            card.addEventListener('mouseup', dragEnd);
            card.addEventListener('mouseleave', dragEnd);

            // Prevent context menu on right click during drag
            card.addEventListener('contextmenu', e => state.dragging.active && e.preventDefault());
        });
    }

    // Set active card (center card)
    function setActiveCard() {
        state.cards.forEach((card, index) => {
            if (index === state.currentIndex) {
                card.classList.add('active');
                card.setAttribute('aria-current', 'true');
            } else {
                card.classList.remove('active');
                card.removeAttribute('aria-current');
            }
        });

        // Initially select the active card when first loaded
        if (state.selectedCardId === null && state.cards.length > 0) {
            selectActiveCard();
        }
    }

    // Helper function to select the current active card
    function selectActiveCard() {
        const activeCard = state.cards.find((card, index) => index === state.currentIndex);
        if (activeCard) {
            selectCard(activeCard);
        }
    }

    // Update arrow button disabled states
    function updateArrowButtons() {
        sliderPrev.classList.remove('disabled');
        sliderPrev.removeAttribute('disabled');
        sliderPrev.setAttribute('aria-disabled', 'false');

        sliderNext.classList.remove('disabled');
        sliderNext.removeAttribute('disabled');
        sliderNext.setAttribute('aria-disabled', 'false');
    }

    // Go to previous slide
    function goToPrevSlide() {
        if (state.currentIndex > 0) {
            state.currentIndex--;
            setSliderPosition();
            setActiveCard();
            updateArrowButtons();
            return true;
        } else if (state.cardCount > 0) {
            // Optional: Loop back to the end when at the beginning
            state.currentIndex = state.cardCount - 1;
            setSliderPosition();
            setActiveCard();
            updateArrowButtons();
            return true;
        }
        return false;
    }

    // Go to next slide
    function goToNextSlide() {
        if (state.currentIndex < state.cardCount - 1) {
            state.currentIndex++;
            setSliderPosition();
            setActiveCard();
            updateArrowButtons();
            return true;
        } else if (state.cardCount > 0) {
            // Optional: Loop back to the beginning when at the end
            state.currentIndex = 0;
            setSliderPosition();
            setActiveCard();
            updateArrowButtons();
            return true;
        }
        return false;
    }


    // Go to specific slide
    function goToSlide(index) {
        if (index >= 0 && index <= state.cardCount - state.cardPerView) {
            state.currentIndex = index;
            setSliderPosition();
            setActiveCard();
            updateArrowButtons();
            return true;
        }
        return false;
    }

    // Set slider position based on current index
    // Set slider position based on current index - FIXED to properly show last card
    function setSliderPosition() {
        const viewportWidth = sliderTrack.parentElement.offsetWidth;
        const cardMargin = 30; // 15px on each side
        const totalCardWidth = state.totalCardWidth || (state.cardWidth + cardMargin);

        // First position calculation - center current card
        let position;

        // Special handling for last card
        if (state.currentIndex === state.cardCount - 1) {
            // Position to fully show the last card
            // We ensure it's at least half a viewport from the right edge
            position = -(totalCardWidth * (state.cardCount - 1));

            // Check if this position would show the last card fully
            const lastCardRightEdge = position + (state.cardCount * totalCardWidth);
            const viewportRightEdge = viewportWidth;

            if (lastCardRightEdge < viewportRightEdge) {
                // Adjust to ensure last card is visible and positioned correctly
                position = viewportWidth - (state.cardCount * totalCardWidth);
            }
        } else {
            // Normal centered positioning for other cards
            position = -(state.currentIndex * totalCardWidth) +
                ((viewportWidth - totalCardWidth) / 2);
        }

        // Apply constraints
        const maxPosition = 0; // Don't allow sliding past first card
        const minPosition = viewportWidth - (state.cardCount * totalCardWidth) - cardMargin;

        // Constrain position but prioritize showing last card fully
        position = Math.max(Math.min(position, maxPosition), minPosition);

        // Apply the position
        state.dragging.currentTranslate = position;
        state.dragging.prevTranslate = position;
        sliderTrack.style.transform = `translateX(${position}px)`;

    }

    // Handle window resize
    function handleResize() {
        // Update dimensions
        updateDimensions();

        // Make sure current index is valid after resize
        if (state.currentIndex > state.cardCount - state.cardPerView) {
            state.currentIndex = state.cardCount - state.cardPerView;
        }

        // Update slider
        setSliderPosition();
        setActiveCard();
        updateArrowButtons();
    }

    // Handle keyboard navigation
    function handleKeyDown(e) {
        // Only handle keys when slider is in viewport
        const sliderRect = sliderTrack.getBoundingClientRect();
        const isInViewport = sliderRect.top < window.innerHeight && sliderRect.bottom > 0;

        if (!isInViewport) return;

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (goToPrevSlide()) {
                selectActiveCard();
            }
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            if (goToNextSlide()) {
                selectActiveCard();
            }
        }
    }

    // Touch event handlers
    function touchStart(e) {
        state.dragging.startPos = e.touches[0].clientX;
        state.dragging.lastTouchX = state.dragging.startPos;
        state.dragging.active = true;

        // Add dragging class
        sliderTrack.classList.add('dragging');
        Array.from(sliderTrack.querySelectorAll('.slider-card-content')).forEach(content => {
            content.classList.add('dragging');
        });

        // Stop animation if any
        cancelAnimationFrame(state.dragging.animationID);

        // Capture the animation frame
        state.dragging.animationID = requestAnimationFrame(animation);
    }

    function touchMove(e) {
        if (!state.dragging.active) return;

        const currentPosition = e.touches[0].clientX;
        const diff = currentPosition - state.dragging.lastTouchX;
        state.dragging.lastTouchX = currentPosition;

        state.dragging.currentTranslate = state.dragging.prevTranslate + diff;
    }

    function touchEnd() {
        finalizeDrag();
    }

    // Mouse drag event handlers
    function dragStart(e) {
        e.preventDefault();
        state.dragging.startPos = e.clientX;
        state.dragging.active = true;

        // Add dragging class
        sliderTrack.classList.add('dragging');
        Array.from(sliderTrack.querySelectorAll('.slider-card-content')).forEach(content => {
            content.classList.add('dragging');
        });

        // Stop animation if any
        cancelAnimationFrame(state.dragging.animationID);

        // Capture the animation frame
        state.dragging.animationID = requestAnimationFrame(animation);
    }

    function drag(e) {
        if (!state.dragging.active) return;

        const currentPosition = e.clientX;
        state.dragging.currentTranslate = state.dragging.prevTranslate + (currentPosition - state.dragging.startPos);
    }

    function dragEnd() {
        if (!state.dragging.active) return;
        finalizeDrag();
    }

    // Common functionality for ending a drag (both touch and mouse)
    function finalizeDrag() {
        state.dragging.active = false;
        cancelAnimationFrame(state.dragging.animationID);

        // Remove dragging class
        sliderTrack.classList.remove('dragging');
        Array.from(sliderTrack.querySelectorAll('.slider-card-content')).forEach(content => {
            content.classList.remove('dragging');
        });

        // Calculate how much was dragged
        const movedBy = state.dragging.currentTranslate - state.dragging.prevTranslate;

        // Should we change slides?
        let slideChanged = false;

        if (Math.abs(movedBy) > state.cardWidth / 3) {
            if (movedBy < 0) {
                // Dragged left - go to next
                if (state.currentIndex < state.cardCount - state.cardPerView) {
                    state.currentIndex++;
                    slideChanged = true;
                }
            } else {
                // Dragged right - go to previous
                if (state.currentIndex > 0) {
                    state.currentIndex--;
                    slideChanged = true;
                }
            }
        }

        // Snap back to current slide
        setSliderPosition();
        setActiveCard();
        updateArrowButtons();

        // If the slide changed through dragging, update selection
        if (slideChanged) {
            selectActiveCard();
        }

        // After dragging ends, wait a bit before allowing clicks
        setTimeout(() => {
            state.dragging.active = false;
        }, 100);
    }

    // Animation loop for smooth dragging
    function animation() {
        setSliderTransform();
        if (state.dragging.active) requestAnimationFrame(animation);
    }

    // Set slider transform during animation
    function setSliderTransform() {
        // Apply constraints
        if (state.dragging.currentTranslate > 0) {
            state.dragging.currentTranslate = 0;
        } else if (state.dragging.currentTranslate < -(state.cardWidth * (state.cardCount - state.cardPerView))) {
            state.dragging.currentTranslate = -(state.cardWidth * (state.cardCount - state.cardPerView));
        }

        sliderTrack.style.transform = `translateX(${state.dragging.currentTranslate}px)`;
    }

    // Public API
    return {
        init
    };
})();