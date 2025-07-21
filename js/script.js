document.addEventListener('DOMContentLoaded', () => {
    // --- 4. SERVICE WORKER: Registration (Stub) ---
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/Surge-Sport-Events/sw.js')
                .then(registration => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        }
    }

    registerServiceWorker();
});
