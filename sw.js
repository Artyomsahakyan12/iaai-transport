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
    const url = new URL(request.url);

    // Մի միջամտել POST և այլ ոչ-GET հարցումներին
    if (request.method !== "GET") {
        return;
    }

    // Արտաքին կայքերը թողնել browser-ի սովորական cache-ի կառավարմանը
    if (url.origin !== self.location.origin) {
        return;
    }

    // Քո app-ի սեփական ֆայլերը միշտ վերցնել ցանցից
    event.respondWith(
        fetch(request, {
            cache: "no-store"
        })
    );
});