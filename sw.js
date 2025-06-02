self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("weather-app-v1").then((cache) => {
      return cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./script.js",
        "./manifest.json",
        "./icon-192.png",
        "./icon-512.png",
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
