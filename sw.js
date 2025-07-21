const CACHE_NAME = 'surge-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/events.html',
    '/css/minified/styles.css',
    '/css/minified/components.css',
    '/images/sprites.svg',
    '/images/coimbra-sports-events-illustration.png',
    '/images/uploads/cycling-event-3.webp',
    '/images/uploads/multi-sport-event-6.webp',
    '/images/uploads/running-event-1.webp',
    '/images/uploads/soccer-event-2.webp',
    '/images/uploads/volleyball-event-4.webp',
    '/images/uploads/yoga-event-5.webp',
    '/js/svg-loader.js',
    '/js/script.js'
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
