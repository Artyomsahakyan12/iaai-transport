const CACHE_NAME = "pulse-autoimport-v6";

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  // Արտաքին կայքերը չպահել Service Worker-ի cache-ում
  if (url.origin !== self.location.origin) {
    return;
  }

  // HTML էջերը միշտ վերցնել ցանցից
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request, { cache: "no-store" })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Սեփական ֆայլերի համար network-first
  event.respondWith(
    fetch(request)
      .then(response => {
        const copy = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, copy);
        });

        return response;
      })
      .catch(() => caches.match(request))
  );
});