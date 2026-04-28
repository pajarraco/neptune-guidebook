const CACHE_NAME = "neptune-guidebook-v2";
const urlsToCache = ["/", "/index.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle same-origin GET requests over http(s). This skips:
  //   - chrome-extension:// (Grammarly etc. — Cache API rejects these schemes)
  //   - cross-origin requests (Google APIs, GIS, fonts, etc.)
  //   - non-GET methods (POST, PUT — never cacheable here)
  const url = new URL(req.url);
  if (req.method !== "GET") return;
  if (url.protocol !== "http:" && url.protocol !== "https:") return;
  if (url.origin !== self.location.origin) return;

  // Never cache the admin app or the API — they must always be fresh.
  if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api/"))
    return;
  // Never cache locale JSON — it changes when the admin saves edits.
  if (url.pathname.startsWith("/locales/")) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        const responseToCache = response.clone();
        caches
          .open(CACHE_NAME)
          .then((cache) => cache.put(req, responseToCache))
          .catch(() => {
            // Some requests (opaque, certain CORS) cannot be cached. Ignore.
          });
        return response;
      });
    }),
  );
});
