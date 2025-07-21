document.addEventListener('DOMContentLoaded', function () {
    // Get today's date to use as min date
    const today = new Date();
    const todayISO = today.toISOString().split('T')[0];

    // Common config for both date pickers with custom styling
    const dateConfig = {
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "F j, Y",
        disableMobile: true,
        animate: true,
        monthSelectorType: "dropdown",
        position: "auto center",
        minDate: todayISO,
        nextArrow: '<span class="svg-arrow"></span>',
        prevArrow: '<span class="svg-arrow"></span>',

        // Custom theme class
        theme: "surge-theme",

        // Add custom class to calendar container for more specific CSS targeting
        onReady: function (selectedDates, dateStr, instance) {
            instance.calendarContainer.classList.add('surge-calendar');

            // Custom styling for month dropdown
            const monthSelect = instance.calendarContainer.querySelector('.flatpickr-monthDropdown-months');
            if (monthSelect) {
                monthSelect.style.width = 'auto';
                monthSelect.style.padding = '0.3em 0.6em';
            }

            // Process any SVG icons in the calendar
            if (typeof window.refreshSVGs === 'function') {
                setTimeout(window.refreshSVGs, 50);
            }
        },

        // Process SVGs when month changes too
        onMonthChange: function (selectedDates, dateStr, instance) {
            // Add custom classes to dropdown items for better styling
            setTimeout(() => {
                const monthItems = instance.calendarContainer.querySelectorAll('.flatpickr-monthDropdown-month');
                monthItems.forEach(item => {
                    item.classList.add('custom-month-item');
                });
            }, 10);

            if (typeof window.refreshSVGs === 'function') {
                setTimeout(window.refreshSVGs, 50);
            }
        }

    };

    // Start date picker
    const startDatePicker = flatpickr("#startDate", {
        ...dateConfig,
        placeholder: "Select start date",
        onChange: function (selectedDates, dateStr) {
            // Update the min date of end date picker
            if (selectedDates[0]) {
                endDatePicker.set('minDate', selectedDates[0]);

                // Auto-open end date picker if it doesn't have a date yet
                if (!endDatePicker.selectedDates[0]) {
                    setTimeout(() => endDatePicker.open(), 100);
                } else {
                    // Both dates selected - highlight apply button
                    const applyBtn = document.getElementById('applyDateFilter');
                    if (applyBtn) {
                        applyBtn.classList.add('active');
                    }
                }
            }
        }
    });

    // End date picker
    const endDatePicker = flatpickr("#endDate", {
        ...dateConfig,
        placeholder: "Select end date",
        onChange: function (selectedDates, dateStr) {
            // Update the max date of start date picker
            if (selectedDates[0]) {
                startDatePicker.set('maxDate', selectedDates[0]);

                // If start date is also selected, highlight apply button
                if (startDatePicker.selectedDates[0]) {
                    const applyBtn = document.getElementById('applyDateFilter');
                    if (applyBtn) {
                        applyBtn.classList.add('active');
                    }
                }
            }
        }
    });

    // Apply button functionality - enhance with visual feedback
    const applyButton = document.getElementById('applyDateFilter');
    if (applyButton) {
        applyButton.addEventListener('click', function () {
            const startDate = startDatePicker.input.value;
            const endDate = endDatePicker.input.value;

            if (startDate || endDate) {
                // Add loading state
                this.classList.add('loading');

                // Apply filter with a small delay for visual feedback
                setTimeout(() => {
                    if (typeof EventsData !== 'undefined' &&
                        typeof EventsData.filterByDate === 'function') {
                        EventsData.filterByDate(startDate, endDate);
                    }

                    if (typeof EventDisplay !== 'undefined' &&
                        typeof EventDisplay.renderEvents === 'function') {
                        EventDisplay.renderEvents();
                    }

                    // Remove loading and add active state
                    this.classList.remove('loading');
                    this.classList.add('active');

                    // Show reset button
                    const resetButton = document.getElementById('resetDateFilter');
                    if (resetButton) {
                        resetButton.classList.add('visible');
                    }
                }, 300);
            }
        });
    }

    // Reset button functionality
    const resetButton = document.getElementById('resetDateFilter');
    if (resetButton) {
        resetButton.addEventListener('click', function () {
            startDatePicker.clear();
            endDatePicker.clear();

            // Remove min/max constraints
            startDatePicker.set('maxDate', null);
            endDatePicker.set('minDate', null);

            // Add loading state for visual feedback
            this.classList.add('loading');

            setTimeout(() => {
                if (typeof EventsData !== 'undefined' &&
                    typeof EventsData.resetDateFilter === 'function') {
                    EventsData.resetDateFilter();
                }

                if (typeof EventDisplay !== 'undefined' &&
                    typeof EventDisplay.renderEvents === 'function') {
                    EventDisplay.renderEvents();
                }

                // Remove states from buttons
                this.classList.remove('loading', 'visible');

                const applyButton = document.getElementById('applyDateFilter');
                if (applyButton) {
                    applyButton.classList.remove('active');
                }
            }, 300);
        });
    }
});