/**
 * DatePicker Module
 * Handles all date selection functionality with FlatPickr integration
 * Supports both single date inputs and date range filtering
 */
const DatePicker = (function () {
    // Store all flatpickr instances
    const instances = {};

    // Common configuration for all date pickers
    const commonConfig = {
        dateFormat: 'Y-m-d',
        disableMobile: true,
        allowInput: true,
        nextArrow: '<span class="svg-arrow right"></span>',
        prevArrow: '<span class="svg-arrow left"></span>',
        // KEY ADDITION: Add custom class when calendar is ready
        onReady: function (selectedDates, dateStr, instance) {
            instance.calendarContainer.classList.add('surge-calendar');
        },
        // KEY ADDITION: Also add it when calendar opens (in case it gets removed)
        onOpen: function (selectedDates, dateStr, instance) {
            instance.calendarContainer.classList.add('surge-calendar');
        }
    };

    /**
     * Helper function to merge configs while preserving callbacks
     */
    function mergeConfigs(baseConfig, customConfig) {
        const merged = { ...baseConfig, ...customConfig };

        // Handle onReady callback merging
        if (baseConfig.onReady && customConfig.onReady) {
            const baseOnReady = baseConfig.onReady;
            const customOnReady = customConfig.onReady;
            merged.onReady = function (selectedDates, dateStr, instance) {
                baseOnReady.call(this, selectedDates, dateStr, instance);
                customOnReady.call(this, selectedDates, dateStr, instance);
            };
        }

        // Handle onOpen callback merging
        if (baseConfig.onOpen && customConfig.onOpen) {
            const baseOnOpen = baseConfig.onOpen;
            const customOnOpen = customConfig.onOpen;
            merged.onOpen = function (selectedDates, dateStr, instance) {
                baseOnOpen.call(this, selectedDates, dateStr, instance);
                customOnOpen.call(this, selectedDates, dateStr, instance);
            };
        }

        return merged;
    }

    /**
     * Initialize the date picker module
     */
    function init() {
        // Initialize date range filter
        initDateRangeFilter();

        // Initialize all standalone date inputs with class .surge-date-input
        initStandaloneDateInputs();
    }

    /**
     * Initialize the date range filter component
     */
    function initDateRangeFilter() {
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        const applyButton = document.getElementById('applyDateFilter');
        const resetButton = document.getElementById('resetDateFilter');

        // Skip if elements don't exist
        if (!startDateInput || !endDateInput || !applyButton || !resetButton) return;

        // Set min dates to today
        const today = new Date();
        const todayISO = today.toISOString().split('T')[0];

        // Initialize start date picker
        const startDateConfig = mergeConfigs(commonConfig, {
            minDate: todayISO,
            onChange: function (selectedDates, dateStr) {
                if (selectedDates[0] && instances.endDate) {
                    // Update end date min date when start date changes
                    instances.endDate.set('minDate', dateStr);
                }
            }
        });

        instances.startDate = flatpickr(startDateInput, startDateConfig);

        // Initialize end date picker
        const endDateConfig = mergeConfigs(commonConfig, {
            minDate: todayISO,
            onChange: function (selectedDates, dateStr) {
                // Optional callback for end date changes
            }
        });

        instances.endDate = flatpickr(endDateInput, endDateConfig);

        // Apply date filter
        applyButton.addEventListener('click', function () {
            const startDate = startDateInput.value;
            const endDate = endDateInput.value;

            if (startDate || endDate) {
                // Add loading state
                this.classList.add('loading');

                // Apply filter if EventsData module exists
                if (typeof EventsData !== 'undefined') {
                    EventsData.filterByDate(startDate, endDate);

                    // Render events if EventDisplay module exists
                    if (typeof EventDisplay !== 'undefined') {
                        EventDisplay.renderEvents();
                    }
                }

                // Add visual indication
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.classList.add('active');
                    resetButton.classList.add('visible');
                }, 300);
            }
        });

        // Reset date filter
        resetButton.addEventListener('click', function () {
            // Reset inputs
            instances.startDate.clear();
            instances.endDate.clear();

            // Add loading state
            this.classList.add('loading');

            // Reset filter if EventsData module exists
            if (typeof EventsData !== 'undefined') {
                EventsData.resetDateFilter();

                // Render events if EventDisplay module exists
                if (typeof EventDisplay !== 'undefined') {
                    EventDisplay.renderEvents();
                }
            }

            // Remove visual indication
            setTimeout(() => {
                this.classList.remove('loading');
                applyButton.classList.remove('active');
                this.classList.remove('visible');
            }, 300);
        });
    }

    /**
     * Initialize all standalone date inputs with surge-date-input class
     */
    function initStandaloneDateInputs() {
        const dateInputs = document.querySelectorAll('.surge-date-input');

        dateInputs.forEach(input => {
            // Skip if already initialized
            if (input._flatpickr) return;

            // Generate a unique ID for the instance
            const id = input.id || `date-input-${Math.random().toString(36).substr(2, 9)}`;

            // Create config based on input's purpose
            let config = { ...commonConfig };

            // For event form date (future dates only)
            if (input.id === 'eventDate') {
                const today = new Date();
                const todayISO = today.toISOString().split('T')[0];
                config = mergeConfigs(config, { minDate: todayISO });
            }

            // Initialize flatpickr on this input
            instances[id] = flatpickr(input, config);
        });
    }

    /**
     * Get a specific date picker instance by ID
     */
    function getInstance(id) {
        return instances[id] || null;
    }

    /**
     * Create a new date picker on any element
     */
    function create(element, options = {}) {
        if (!element) return null;

        const id = element.id || `date-${Math.random().toString(36).substr(2, 9)}`;
        const config = mergeConfigs(commonConfig, options);

        instances[id] = flatpickr(element, config);
        return instances[id];
    }

    /**
     * Get the current date range values from filter
     */
    function getFilterDateRange() {
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');

        return {
            startDate: startDateInput ? startDateInput.value : null,
            endDate: endDateInput ? endDateInput.value : null
        };
    }

    /**
     * Set the date range filter values programmatically
     */
    function setFilterDateRange(startDate, endDate) {
        if (instances.startDate && startDate) {
            instances.startDate.setDate(startDate);
        }

        if (instances.endDate && endDate) {
            instances.endDate.setDate(endDate);
        }

        // Optional: auto-apply the filter
        const applyButton = document.getElementById('applyDateFilter');
        if (applyButton && (startDate || endDate)) {
            applyButton.click();
        }
    }

    /**
     * Reset the date range filter
     */
    function resetFilterDateRange() {
        const resetButton = document.getElementById('resetDateFilter');
        if (resetButton) {
            resetButton.click();
        }
    }

    /**
     * Refresh all instances (useful after DOM changes)
     */
    function refresh() {
        // Refresh existing instances
        Object.values(instances).forEach(instance => {
            if (instance && typeof instance.destroy === 'function') {
                instance.destroy();
            }
        });

        // Clear instances and reinitialize
        Object.keys(instances).forEach(key => delete instances[key]);
        init();
    }

    /**
     * Clean up before page unload
     */
    function destroy() {
        Object.values(instances).forEach(instance => {
            if (instance && typeof instance.destroy === 'function') {
                instance.destroy();
            }
        });
    }

    /**
     * Apply surge-calendar class to existing flatpickr instances
     * Useful if you have calendars that were created outside this module
     */
    function applySurgeThemeToExisting() {
        document.querySelectorAll('.flatpickr-calendar').forEach(cal => {
            cal.classList.add('surge-calendar');
        });
    }

    // Public API
    return {
        init,
        getInstance,
        create,
        getFilterDateRange,
        setFilterDateRange,
        resetFilterDateRange,
        refresh,
        destroy,
        applySurgeThemeToExisting
    };
})();

// Auto-initialize when included directly on a page
if (typeof EventsData !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
        DatePicker.init();

        // Apply theme to any existing flatpickr instances
        setTimeout(() => {
            DatePicker.applySurgeThemeToExisting();
        }, 100);
    });
}