var CACHE_NAME = 'cache-v1';

this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll([
        '/serviceworker/',
        '/serviceworker/index.html',
        '/serviceworkerm/app.js'
      ]);
    })
  );
});

this.addEventListener('fetch', function(event) {
  var response;
  event.respondWith(caches.match(event.request).catch(function() {
    return fetch(event.request);
  }).then(function(r) {
    response = r;
    caches.open(CACHE_NAME).then(function(cache) {
      cache.put(event.request, response);
    });
    return response.clone();
  });
});
