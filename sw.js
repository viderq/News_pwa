const CACHE_VERSION = 'v1.3';
const CACHE_NAME = `${CACHE_VERSION}-static-assets`;
const OFFLINE_URL = '/offline.html';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Установка
self.addEventListener('install', (event) => {
  console.log('[SW] Установка сервис-воркера');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Кэширование основных ресурсов');
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Активация
self.addEventListener('activate', (event) => {
  console.log('[SW] Активация сервис-воркера');

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

// Обработка запросов
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Стратегия: Network First, Fallback to Cache
  event.respondWith(
    fetch(request)
      .then(networkResponse => {
        // Обновляем кэш
        caches.open(CACHE_NAME)
          .then(cache => cache.put(request, networkResponse));
        return networkResponse.clone();
      })
      .catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        return cachedResponse || caches.match(OFFLINE_URL);
      })
  );
});