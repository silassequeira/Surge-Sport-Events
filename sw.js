const CACHE_NAME = 'surge-cache-v1';
const urlsToCache = [
    '/Surge-Sport-Events/',
    '/Surge-Sport-Events/index.html',
    '/Surge-Sport-Events/events.html',
    '/Surge-Sport-Events/css/minified/styles.css',
    '/Surge-Sport-Events/css/minified/components.css',
    '/Surge-Sport-Events/images/sprites.svg',
    '/Surge-Sport-Events/images/coimbra-sports-events-illustration.png',
    '/Surge-Sport-Events/images/favicon/site.webmanifest',
    '/Surge-Sport-Events/images/favicon/favicon.ico',
    '/Surge-Sport-Events/images/favicon/android-chrome-192x192.png',
    '/Surge-Sport-Events/images/favicon/android-chrome-512x512.png',
    '/Surge-Sport-Events/images/uploads/cycling-event-3.webp',
    '/Surge-Sport-Events/images/uploads/multi-sport-event-6.webp',
    '/Surge-Sport-Events/images/uploads/running-event-1.webp',
    '/Surge-Sport-Events/images/uploads/soccer-event-2.webp',
    '/Surge-Sport-Events/images/uploads/volleyball-event-4.webp',
    '/Surge-Sport-Events/images/uploads/yoga-event-5.webp',
    '/Surge-Sport-Events/js/svg-loader.js',
    '/Surge-Sport-Events/js/script.js',
    '/Surge-Sport-Events/js/app/app.js',
    '/Surge-Sport-Events/js/app/date-picker.js',
    '/Surge-Sport-Events/js/app/event-display.js',
    '/Surge-Sport-Events/js/app/event-form.js',
    '/Surge-Sport-Events/js/app/event-modal.js',
    '/Surge-Sport-Events/js/app/event-registration.js',
    '/Surge-Sport-Events/js/app/event-slider.js',
    '/Surge-Sport-Events/js/app/events-data.js',
    '/Surge-Sport-Events/js/app/modal-manager.js',
    '/Surge-Sport-Events/js/app/notifications.js',
    '/Surge-Sport-Events/js/app/ui.js',
    '/Surge-Sport-Events/js/app/utils.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
