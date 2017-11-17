navigator.serviceWorker.register('serviceWorkerCache.js', {
    scope: '.'
})
    .then(function (registration) {
        console.log('ServiceWorkerRegister registered: ', registration.active);
        return navigator.serviceWorker.ready;
    }).catch(function (error) {
        console.error('ServiceWorkerRegister Error in registration:', error);
    });

window.clearCaches = function () {
    caches.delete('CacheTest1').then(function (cache) {
        console.info('Cache successfully deleted!');
    });
}

