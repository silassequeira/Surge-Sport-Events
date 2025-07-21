const CACHE_NAME = 'surge-cache-v1';
const urlsToCache = [
    './',
    'index.html',
    'events.html',
    'css/minified/styles.css',
    'css/minified/components.css',
    'images/sprites.svg',
    'images/coimbra-sports-events-illustration.png',
    'images/favicon/site.webmanifest',
    'images/favicon/favicon.ico',
    'images/favicon/android-chrome-192x192.png',
    'images/favicon/android-chrome-512x512.png',
    'images/uploads/cycling-event-3.webp',
    'images/uploads/multi-sport-event-6.webp',
    'images/uploads/running-event-1.webp',
    'images/uploads/soccer-event-2.webp',
    'images/uploads/volleyball-event-4.webp',
    'images/uploads/yoga-event-5.webp',
    'js/svg-loader.js',
    'js/script.js',
    'js/app/app.js',
    'js/app/date-picker.js',
    'js/app/event-display.js',
    'js/app/event-form.js',
    'js/app/event-modal.js',
    'js/app/event-registration.js',
    'js/app/event-slider.js',
    'js/app/events-data.js',
    'js/app/modal-manager.js',
    'js/app/notifications.js',
    'js/app/ui.js',
    'js/app/utils.js'
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
