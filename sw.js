const CACHE_NAME = 'pwa-v28-eula';
const SHELL = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './legal.html',
  './manifest.json',
  './favicon.ico',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './icon-180.png'
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

// ===== Recordatorio diario: push silencioso del Worker + contenido por fetch =====
const WORKER_MENSAJE = 'https://pausa-breve-recordatorio.carlangatrex.workers.dev';

self.addEventListener('push', (event) => {
  event.waitUntil((async () => {
    let datos = { title: 'Pausa Breve', body: '¿Cómo te sientes hoy?', url: './?from=notification' };
    try {
      const sub = await self.registration.pushManager.getSubscription();
      if (sub) {
        const res = await fetch(WORKER_MENSAJE + '/message?k=' + encodeURIComponent(sub.endpoint));
        if (res.ok) datos = Object.assign(datos, await res.json());
      }
    } catch (e) {
      // Sin red: se muestra el mensaje por defecto
    }
    await self.registration.showNotification(datos.title, {
      body: datos.body,
      icon: './icon-192.png',
      badge: './icon-192.png',
      data: { url: datos.url || './?from=notification' },
      tag: 'pausa-breve-recordatorio'
    });
  })());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || './?from=notification';
  event.waitUntil((async () => {
    const ventanas = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of ventanas) {
      if ('focus' in c) {
        await c.focus();
        if ('navigate' in c) {
          try { await c.navigate(url); } catch (e) { /* Safari puede rechazar navigate */ }
        }
        return;
      }
    }
    await clients.openWindow(url);
  })());
});
