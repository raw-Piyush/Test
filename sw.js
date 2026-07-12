const CACHE_NAME = 'cute-corner-v1.3';
const ASSETS = [
    'index.html',
    'style.css',
    'script.js',
    'icon.png',
    'manifest.json'
];

// Install Event
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate Event (Cache cleanup)
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event (Offline capabilities)
self.addEventListener('fetch', (e) => {
    // Only cache local get requests
    if (e.request.method === 'GET' && e.request.url.startsWith(self.location.origin)) {
        e.respondWith(
            caches.match(e.request).then((cachedResponse) => {
                // Return cached version or fetch from network
                return cachedResponse || fetch(e.request).then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(e.request, networkResponse.clone());
                        return networkResponse;
                    });
                }).catch(() => {
                    // Fail gracefully offline if resource is not in cache
                    return caches.match('index.html');
                });
            })
        );
    }
});
