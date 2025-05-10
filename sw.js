const CACHE_NAME = 'fototeca-v3';
const ASSETS = [
  '/FototecaHEC/',
  '/FototecaHEC/index.html',
  '/FototecaHEC/styles.css',
  '/FototecaHEC/app.js',
  '/FototecaHEC/icon-192.png',
  '/FototecaHEC/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
});
