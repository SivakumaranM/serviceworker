var CACHE = 'cache-v1';

this.addEventListener('install', function(event) {
  console.log('The service worker is being installed');
  event.waitUntil(
    caches.open(CACHE).then(function(cache) {
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
  event.respondWith(fromCache(event.request).catch(function() {
    console.log('Asset is not available in cache. Fetching from network');
    return fetch(event.request);
  }).then(function(r) {
    response = r;
    caches.open(CACHE).then(function(cache) {
      cache.put(event.request, response);
      console.log('Adding asset to cache');
    });
    return response.clone();
  }));
});

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}
