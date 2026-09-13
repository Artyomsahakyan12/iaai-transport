self.addEventListener("install", event => {
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames =>
                Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                )
            )
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    const request = event.request;

    // Մի միջամտել POST և այլ ոչ-GET հարցումներին
    if (request.method !== "GET") {
        return;
    }

    // Բոլոր GET հարցումները միշտ վերցնել ցանցից՝ առանց cache-ի
    event.respondWith(
        fetch(request, {
            cache: "no-store"
        })
    );
});