// IdeaStash service worker — caches the app so it opens offline
const CACHE = 'gemstash-beta-105';   // BETA: its own offline cache
const SHELL = ['./', 'index.html', 'sources.js', 'manifest.json', 'icon-chest-bt-192.png', 'icon-chest-bt-512.png', 'logo-chest-128.png', 'logo-chest-320.webp', 'focus-loupe-320.webp', 'gemminer-cart-160.webp', 'circle-family-128.webp', 'auto-cart-96.webp', 'lantern-low-72.webp', 'lantern-mid-72.webp', 'lantern-high-72.webp', 'bell-72.webp', 'add-pickaxe-96.webp', 'miner-finds-gem.webm', 'miner-finds-gem.mp4', 'miner-finds-gem-sound.m4a', 'icon-book-192.png', 'icon-book-512.png', 'banners/bible-desk.webp', 'banners/bible-verse.webp', 'banners/family.webp', 'banners/archives.webp'];
// (v25) always ask GitHub for the newest copy ('no-cache' = check first, reuse only if unchanged). Before, the browser could
// reuse GitHub's copy for up to 10 minutes, so a new version didn't show up right away.
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, {cache: 'reload'})))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin || e.request.method !== 'GET') return;   // books / jw.org always go to the network
  e.respondWith(fetch(e.request.url, {cache: 'no-cache'}).then(r => {         // network first (fresh), cache fallback
    if (r.ok){ const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return r;
  }).catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match('index.html'))));   // (v16) sources.js?v=N offline
});
