const initialEvents = [
    {
        id: 1,
        title: "Mondego River Run",
        date: "2025-07-15",
        time: "08:00",
        location: "Parque Verde do Mondego",
        category: "running",
        description: "Join us for a scenic 10K run along the beautiful Mondego River. Perfect for runners of all levels with stunning views of historic Coimbra.",
        participants: 45,
        maxParticipants: 100,
        imageId: "running-event-1",
    },
    {
        id: 2,
        title: "FC Coimbra Tournament",
        date: "2025-07-20",
        time: "14:00",
        location: "Complexo Desportivo Municipal",
        category: "soccer",
        description: "Annual amateur soccer tournament featuring local teams. Come support your favorite squad or join as a player!",
        participants: 128,
        maxParticipants: 160,
        imageId: "soccer-event-2",
    },
    {
        id: 3,
        title: "Cycling Through History",
        date: "2025-07-25",
        time: "09:30",
        location: "Universidade de Coimbra",
        category: "cycling",
        description: "Explore Coimbra's historic sites on two wheels! A guided cycling tour through the university and old town.",
        participants: 22,
        maxParticipants: 30,
        imageId: "cycling-event-3",
    },
    {
        id: 4,
        title: "Beach Volleyball Championship",
        date: "2025-08-01",
        time: "16:00",
        location: "Praia Fluvial de Palheiros",
        category: "volleyball",
        description: "Summer beach volleyball tournament by the river. Teams of 4, prizes for winners, and fun for everyone!",
        participants: 32,
        maxParticipants: 48,
        imageId: "volleyball-event-4",
    },
    {
        id: 5,
        title: "Morning Yoga in the Park",
        date: "2025-07-28",
        time: "07:00",
        location: "Jardim Botânico",
        category: "Yoga",
        description: "Start your day with peaceful yoga session in the beautiful Botanical Garden. All levels welcome.",
        participants: 18,
        maxParticipants: 25,
        imageId: "yoga-event-5",
    },
    {
        id: 6,
        title: "University Sports Day",
        date: "2025-08-05",
        time: "10:00",
        location: "Campus da UC",
        category: "Multi-Sport",
        description: "Multi-sport event for students and faculty. Athletics, swimming, tennis, and more!",
        participants: 156,
        maxParticipants: 200,
        imageId: "multi-sport-event-6",
    }
];

const EventsData = (function () {
    // Module state variables
    let events = [];
    let filteredEvents = [];
    let filters = {
        category: 'all',
        startDate: null,
        endDate: null
    };

    // Initialize the module
    function init() {
        loadEvents();
        applyFilters();
    }

    // Load events from localStorage or use initial data
    function loadEvents() {
        try {
            // Try to load events from localStorage
            const storedEvents = localStorage.getItem('sportCoimbra_events');

            if (storedEvents) {
                events = JSON.parse(storedEvents);
                console.log(`Loaded ${events.length} events from localStorage`);

                // Ensure proper data structure for each event
                events.forEach(normalizeEventData);
            } else {
                // First time - use initial data
                events = [...initialEvents];
                events.forEach(normalizeEventData);
            }
        } catch (e) {
            console.error('Error loading events:', e);
            // Fallback to initial data
            events = [...initialEvents];
            events.forEach(normalizeEventData);
        }
    }

    // Ensure event has all required properties
    function normalizeEventData(event) {
        if (!event.registeredParticipants) {
            event.registeredParticipants = [];
        }

        // If initialParticipants is not set, store current participants count as initial
        if (typeof event.initialParticipants === 'undefined') {
            event.initialParticipants = event.participants;
        }

        // Calculate total participants correctly
        event.participants = (event.initialParticipants || 0) + event.registeredParticipants.length;
    }

    // Apply all current filters to the events array
    function applyFilters() {
        filteredEvents = [...events];

        // Apply category filter
        if (filters.category === 'other-all') {
            // Special case: show all events from "other" categories
            const mainCategories = ['running', 'soccer', 'cycling', 'volleyball'];
            filteredEvents = filteredEvents.filter(event =>
                !mainCategories.includes(event.category.toLowerCase())
            );
        } else if (filters.category !== 'all') {
            // Normal case: filter for specific category
            filteredEvents = filteredEvents.filter(event =>
                event.category.toLowerCase() === filters.category.toLowerCase()
            );
        }

        // Apply date filters if any are active
        if (filters.startDate || filters.endDate) {
            filteredEvents = filteredEvents.filter(event => {
                const eventDate = normalizeDate(event.date);

                if (filters.startDate && filters.endDate) {
                    return eventDate >= filters.startDate && eventDate <= filters.endDate;
                } else if (filters.startDate) {
                    return eventDate >= filters.startDate;
                } else if (filters.endDate) {
                    return eventDate <= filters.endDate;
                }
                return true;
            });
        }

        return filteredEvents;
    }

    // Helper to normalize date for comparison
    function normalizeDate(dateString) {
        const date = new Date(dateString);
        date.setHours(0, 0, 0, 0);
        return date;
    }

    // Filter events by category
    function filterByCategory(category) {
        filters.category = category;
        return applyFilters();
    }

    // Filter events by date range
    function filterByDate(startDate, endDate) {
        // Convert to Date objects for comparison
        filters.startDate = startDate ? normalizeDate(startDate) : null;
        filters.endDate = endDate ? normalizeDate(endDate) : null;

        return applyFilters();
    }

    // Reset date filter
    function resetDateFilter() {
        filters.startDate = null;
        filters.endDate = null;

        return applyFilters();
    }

    // Get upcoming events sorted by date
    function getUpcomingEvents(limit = null) {
        const today = new Date();
        const upcoming = events
            .filter(event => new Date(event.date + 'T' + event.time) > today)
            .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));

        return limit ? upcoming.slice(0, limit) : upcoming;
    }

    // Get event by ID
    function getEventById(id) {
        return events.find(event => event.id === parseInt(id));
    }

    // Add new event
    function addEvent(eventData) {
        // Generate a new ID
        const newId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;

        const newEvent = {
            ...eventData,
            id: newId,
            participants: 0,
            initialParticipants: 0,
            registeredParticipants: []
        };

        // Add to events array
        events.push(newEvent);

        // Save and reapply filters
        saveToLocalStorage();
        applyFilters();

        return newEvent;
    }

    // Update existing event
    function updateEvent(eventData) {
        const index = events.findIndex(e => e.id === eventData.id);
        if (index === -1) return false;

        // Preserve registration data
        const registeredParticipants = events[index].registeredParticipants || [];
        const initialParticipants = events[index].initialParticipants || events[index].participants;

        // Image handling: If no new image was uploaded, preserve the existing imageId
        if (!eventData.imageData && events[index].imageId && !eventData.imageId) {
            eventData.imageId = events[index].imageId;
        }

        // If new image data is uploaded, remove any old imageId
        if (eventData.imageData && eventData.imageId) {
            delete eventData.imageId;
        }

        // Update the event, preserving registration data
        events[index] = {
            ...eventData,
            registeredParticipants,
            initialParticipants,
            participants: initialParticipants + registeredParticipants.length
        };

        // Save and reapply filters
        saveToLocalStorage();
        applyFilters();

        // If category has been changed, explicitly refresh the "Other Categories" dropdown
        if (typeof EventDisplay !== 'undefined' &&
            typeof EventDisplay.refreshCategoriesDropdown === 'function') {
            EventDisplay.refreshCategoriesDropdown();
        }

        return true;
    }

    // Delete event
    function deleteEvent(id) {
        events = events.filter(e => e.id !== parseInt(id));

        // Save and reapply filters
        saveToLocalStorage();
        applyFilters();

        return true;
    }

    function getOtherCategories() {
        // Define main categories that have dedicated filter buttons
        const mainCategories = ['running', 'soccer', 'cycling', 'volleyball'];

        // Get all unique categories from events
        const allCategories = [...new Set(events.map(event => event.category.toLowerCase()))];

        // Filter out main categories to get "other" categories
        return allCategories
            .filter(cat => !mainCategories.includes(cat))
            .sort(); // Sort alphabetically
    }

    // Register participant for an event
    function registerParticipant(eventId, participant) {
        const eventIndex = events.findIndex(e => e.id === parseInt(eventId));

        if (eventIndex === -1) {
            console.error(`Event with ID ${eventId} not found`);
            return false;
        }

        const event = events[eventIndex];

        // Initialize collections if needed
        if (!event.registeredParticipants) {
            event.registeredParticipants = [];
        }

        if (typeof event.initialParticipants === 'undefined') {
            event.initialParticipants = event.participants;
        }

        // Check if there's room for more participants
        const currentParticipants = event.initialParticipants + event.registeredParticipants.length;

        if (currentParticipants < event.maxParticipants) {
            // Add the participant
            event.registeredParticipants.push({
                ...participant,
                registrationDate: new Date().toISOString()
            });

            // Update count and save
            event.participants = event.initialParticipants + event.registeredParticipants.length;
            saveToLocalStorage();
            applyFilters();

            console.log(`Registration successful for event ${eventId}. New count: ${event.participants}/${event.maxParticipants}`);
            return true;
        } else {
            console.warn(`Event ${eventId} is full. Cannot register more participants.`);
            return false;
        }
    }

    // Get participants for an event
    function getEventParticipants(eventId) {
        const event = getEventById(eventId);
        return event ? (event.registeredParticipants || []) : [];
    }

    // Save to localStorage with better error handling
    function saveToLocalStorage() {
        try {
            localStorage.setItem('sportCoimbra_events', JSON.stringify(events));
            console.log('Events saved to localStorage');
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);

            // If quota exceeded, try to clear some space
            if (e.name === 'QuotaExceededError') {
                try {
                    // Remove any old data keys that might be taking up space
                    localStorage.removeItem('oldData');
                    localStorage.removeItem('tempData');

                    // Try saving again
                    localStorage.setItem('sportCoimbra_events', JSON.stringify(events));
                    console.log('Successfully saved after cleaning storage');
                    return true;
                } catch (retryError) {
                    console.error('Failed to save even after cleanup:', retryError);
                    return false;
                }
            }
            return false;
        }
    }

    // Public API
    return {
        init,
        getAllEvents: () => events,
        getFilteredEvents: () => filteredEvents,
        filterByCategory,
        getOtherCategories,
        filterByDate,
        resetDateFilter,
        getUpcomingEvents,
        getEventById,
        addEvent,
        updateEvent,
        deleteEvent,
        registerParticipant,
        getEventParticipants,
        isDateFilterActive: () => !!(filters.startDate || filters.endDate),
        getDateFilter: () => ({ start: filters.startDate, end: filters.endDate }),
        getCurrentCategory: () => filters.category
    };
})();