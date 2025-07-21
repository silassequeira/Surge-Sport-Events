const ModalManager = (function () {
    // Keep track of open modals
    const openModals = new Set();

    // Open a modal
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`Modal with ID "${modalId}" not found`);
            return false;
        }

        // Show the modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        openModals.add(modalId);

        // Ensure event listeners are set up
        setupModalEvents(modal);

        return true;
    }

    // Close a specific modal
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`Modal with ID "${modalId}" not found`);
            return false;
        }

        // Hide the modal
        modal.style.display = 'none';
        openModals.delete(modalId);

        // Only restore body scroll if no modals are open
        if (openModals.size === 0) {
            document.body.style.overflow = 'auto';
        }

        return true;
    }

    // Close the topmost modal
    function closeTopmostModal() {
        if (openModals.size === 0) return false;

        // Get the last opened modal
        const modalId = Array.from(openModals).pop();
        return closeModal(modalId);
    }

    // Set up event listeners for a modal
    function setupModalEvents(modal) {
        // Find close buttons within this modal
        const closeButtons = modal.querySelectorAll('.close-modal, .modal-close');

        // Add click event to close buttons
        closeButtons.forEach(button => {
            // Remove existing handlers to prevent duplicates
            const newButton = button.cloneNode(true);
            if (button.parentNode) {
                button.parentNode.replaceChild(newButton, button);
            }

            // Add fresh click handler
            newButton.addEventListener('click', () => {
                closeModal(modal.id);
            });
        });

        // Handle click outside modal content
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    }

    // Setup global modal events (escape key)
    function init() {
        // Handle escape key for all modals
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && openModals.size > 0) {
                closeTopmostModal();
            }
        });

        // Initialize existing modals
        document.querySelectorAll('.modal').forEach(setupModalEvents);
    }

    return {
        init,
        openModal,
        closeModal,
        closeTopmostModal
    };
})();