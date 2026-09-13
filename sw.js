const CACHE_NAME = "pulse-autoimport-v5";

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

  // HTML էջերը միշտ վերցնել ցանցից՝ հին էջ չցուցադրելու համար
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request, { cache: "no-store" })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Մնացած ֆայլերի համար սովորական network-first
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