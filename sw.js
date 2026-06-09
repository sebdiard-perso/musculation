const CACHE_NAME = 'muscu-v36';
const ASSETS = [
  './index.html', './style.css', './data.js', './animations.js',
  './timer.js', './calendar.js', './planner.js', './app.js',
  './manifest.json',
  './freesound_community-short-beep-tone-47916.mp3',
  './magiaz-bip-457700.mp3'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  // ⚠️ On ne fait PAS skipWaiting() automatiquement : on attend que l'utilisateur
  // confirme via le bandeau "Mise à jour disponible" (avec option backup avant).
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
