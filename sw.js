// Service Worker: macht die App offline nutzbar.
// Bei jeder Änderung an den Dateien VERSION erhöhen.
const VERSION = 'durch-v2';
const DATEIEN = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/style.css',
  './js/main.js',
  './js/store.js',
  './js/ui.js',
  './js/inhalte.js',
  './js/hilfe.js',
  './js/einstellungen.js',
  './js/start.js',
  './js/schritte.js',
  './js/akut.js',
  './js/chart.js',
  './js/uebung.js',
  './js/leiter.js',
  './js/koerper.js',
  './js/mutbuch.js',
  './js/wofuer.js',
  './js/sorgen.js',
  './js/kreis.js',
  './js/werkzeug.js',
  './js/verlauf.js',
  './js/wellen.js',
  './js/sicherheit.js',
  './js/daten.js',
  './js/pin.js',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];
const FONT_CACHE = 'durch-fonts';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(DATEIEN)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== FONT_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts: einmal laden, dann aus dem Cache
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.open(FONT_CACHE).then(async (c) => {
        const treffer = await c.match(req);
        if (treffer) return treffer;
        try {
          const antwort = await fetch(req);
          if (antwort.ok || antwort.type === 'opaque') c.put(req, antwort.clone());
          return antwort;
        } catch {
          return new Response('', { status: 503 });
        }
      }),
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Eigene Dateien: Cache zuerst, sonst Netz; Seitenaufrufe fallen auf index.html zurück
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((treffer) => {
      if (treffer) return treffer;
      return fetch(req).catch(() => (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()));
    }),
  );
});
