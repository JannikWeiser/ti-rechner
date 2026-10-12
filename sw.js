// Service Worker: macht den TI-Rechner offline nutzbar.
// Strategie "network first" mit Zeitlimit: mit gutem Internet immer die neueste Version,
// bei schlechtem Hallen-WLAN nach spätestens 3 s die gespeicherte Version, ohne Internet sofort.
const CACHE = 'ti-rechner-v23';
const TIMEOUT_MS = 3000;
const FILES = ['./', 'index.html', 'impressum.html', 'datenschutz.html', 'manifest.webmanifest', 'manifest-en.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const fromCache = () => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('index.html'));
  const network = fetch(req).then(res => {
    // Nur vollständige eigene Antworten speichern
    if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  });
  e.respondWith(new Promise(resolve => {
    let done = false;
    const finish = r => { if (!done && r) { done = true; resolve(r); } };
    // Nach Ablauf des Zeitlimits die gespeicherte Version liefern (falls vorhanden)
    const timer = setTimeout(() => fromCache().then(finish), TIMEOUT_MS);
    network.then(r => { clearTimeout(timer); finish(r); })
      .catch(() => { clearTimeout(timer); fromCache().then(r => finish(r || Response.error())); });
  }));
});
