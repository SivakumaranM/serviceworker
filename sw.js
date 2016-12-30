var CACHE_NAME = 'cache-v1';

this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll([
        '/serviceworker/',
        '/serviceworker/index.html',
        '/serviceworker/app.js'
      ]);
    })
  );
});

this.addEventListener('fetch', function(event) {
  console.log('The service worker is serving the asset.');
  var response;
  event.respondWith(caches.match(event.request).catch(function() {
    console.log('Asset is not available in cache. Fetching from network');
    return fetch(event.request);
  }).then(function(r) {
    response = r;
    caches.open(CACHE_NAME).then(function(cache) {
      cache.put(event.request, response);
      console.log('Adding asset to cache');
    });
    return response.clone();
  }));
});
