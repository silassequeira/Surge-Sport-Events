const Notifications = (function () {
    // Toast timeout tracking
    const toastTimeouts = new Map();
    let toastCounter = 0;

    // Show a success toast notification
    function showSuccess(message) {
        return showToast(message, 'success');
    }

    // Show an error toast notification
    function showError(message) {
        return showToast(message, 'error');
    }

    // Show a toast notification
    function showToast(message, type = 'success') {
        const toastId = `toast-${toastCounter++}`;
        const toastContainer = document.getElementById('toastContainer');

        if (!toastContainer) {
            console.error('Toast container not found');
            return;
        }

        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `toast ${type}-toast`;

        // Set the icon based on type
        const iconClass = type === 'success' ? 'svg-correct icon' : 'svg-error icon';

        toast.innerHTML = `
            <div class="${type} icon-small">
                <span class="${iconClass}" aria-hidden="true"></span>
            </div>
            <div class="toast-content">
                <p class="toast-message">${message}</p>
            </div>
        `;

        // Add to DOM
        toastContainer.appendChild(toast);

        // Force a reflow to ensure animation starts correctly
        void toast.offsetWidth;

        // Set timeout to remove toast
        const timeout = setTimeout(() => {
            removeToast(toastId);
        }, 3000);

        // Store the timeout to clear it if needed
        toastTimeouts.set(toastId, timeout);

        return toastId;
    }

    // Remove a toast notification
    function removeToast(toastId) {
        const toast = document.getElementById(toastId);
        if (!toast) return;

        // Clear the timeout if it exists
        if (toastTimeouts.has(toastId)) {
            clearTimeout(toastTimeouts.get(toastId));
            toastTimeouts.delete(toastId);
        }

        // Add fade-out class for animation
        toast.classList.add('fade-out');

        // Remove from DOM after animation completes
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    // Public API
    return {
        showSuccess,
        showError,
        removeToast
    };
})();