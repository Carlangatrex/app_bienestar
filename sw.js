const CACHE_NAME = 'pwa-somatica-v10';
const SHELL = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './favicon.ico',
  './icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

function isShell(request) {
  if (request.mode === 'navigate') return true;
  const url = new URL(request.url);
  return url.pathname.endsWith('/') ||
    url.pathname.endsWith('/index.html') ||
    url.pathname.endsWith('/style.css') ||
    url.pathname.endsWith('/app.js');
}

// Solo cachea respuestas completas 200: nunca 206 (parciales, peticiones Range),
// nunca audio (Range incompatible con Cache API) y solo del mismo origen.
function puedeCachear(request, response) {
  if (!response || response.status !== 200) return false;
  if (response.status === 206) return false;
  if (request.headers && request.headers.has('Range')) return false;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;
  if (/\.(mp3|m4a|ogg|wav|aac|webm|mp4|flac)$/i.test(url.pathname)) return false;
  return true;
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Shell (pantallas/HTML): network-first para que siempre se vea la última versión.
  // Solo cae a la caché si no hay conexión.
  if (isShell(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (puedeCachear(event.request, response)) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() =>
          caches.match(event.request, { ignoreSearch: true })
            .then((cached) => cached || caches.match('./index.html'))
        )
    );
    return;
  }

  // Resto de assets (música, íconos, manifest): cache-first.
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (puedeCachear(event.request, response)) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});
