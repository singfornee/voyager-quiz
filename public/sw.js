// Service Worker for offline support
const CACHE_NAME = "voyabear-cache-v1"
const urlsToCache = [
  "/",
  "/offline",
  "/voyabear-mascot.png",
  "/travel-illustrations/airplane.png",
  "/travel-illustrations/backpack.png",
  "/travel-illustrations/camera.png",
  "/travel-illustrations/compass.png",
  "/travel-illustrations/map.png",
  "/travel-illustrations/passport.png",
  "/travel-illustrations/suitcase.png",
  "/travel-illustrations/world.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

self.addEventListener("fetch", (event) => {
  // Skip chrome-extension URLs to avoid errors
  if (event.request.url.startsWith("chrome-extension://")) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return the response
      if (response) {
        return response
      }

      // Clone the request because it's a one-time use stream
      const fetchRequest = event.request.clone()

      return fetch(fetchRequest)
        .then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clone the response because it's a one-time use stream
          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            // Don't cache API requests
            if (!event.request.url.includes("/api/")) {
              cache.put(event.request, responseToCache)
            }
          })

          return response
        })
        .catch(() => {
          // If the network is unavailable, try to return the offline page
          if (event.request.mode === "navigate") {
            return caches.match("/offline")
          }
        })
    }),
  )
})

// Clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})
