var cacheFile = 'CacheTest1';

/**
 * Install Event Handler
 * @param {object} event) {
 */
self.addEventListener('install', function (event) {
    console.log('ServiceWorkerCache Install Event');
    event.waitUntil(
        caches.open(cacheFile)
            .then(function () {
                console.log('ServiceWorkerCache Install Complete');
                return self.skipWaiting();
            })
            .catch(function (response) {
                console.log('ServiceWorkerCache Install Cache Error: ', response);
            })
    );
});

/**
 * Fetch Event Handler
 * @param {object} event) {
 */
self.addEventListener('fetch', function (event) {
    //console.log('ServiceWorkerCache Fetch event for', event.request.url);
    event.respondWith(caches.match(event.request).then(function (response) {
        // caches.match() always resolves but in case of success response will have value
        if (response !== undefined) {
            console.log('ServiceWorkerCache Fetch from cache: ', response.url);
            return response;
        } else {
            var requestClone = event.request.clone();
            return fetch(requestClone).then(function (response) {
                // response may be used only once we need to save clone to put one copy in cache and serve second one
                let responseClone = response.clone();
                if (requestClone.method.toUpperCase() == "GET" && responseClone.status == 200) {
                    console.log('ServiceWorkerCache  Caching the response to', requestClone.url);
                    caches.open(cacheFile).then(function (cache) {
                        cache.put(event.request, responseClone);
                    }).catch(function (error) {
                        console.error('ServiceWorkerCache Error in cache open:', error);
                    });
                }
                return response;
            }).catch(function (error) {
                console.error('ServiceWorkerCache Error in fetch:', error);
            })
        }
    }).catch(function (error) {
        console.error('ServiceWorkerCache Error in match:', error);
    }));
});

/**
 * Activate Event Handler
 * @param {object} event) {
 */
self.addEventListener('activate', function (event) {
    console.log('ServiceWorkerCache Activate Event');
    event.waitUntil(
        clients.claim().then(function () {
            console.log('ServiceWorkerCache Claimed ' + (new Date()).toString('yyyy-MM-dd'));
        })
    );
});