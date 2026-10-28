// Service worker: deixa o jogo disponível offline depois da primeira visita
const CACHE = 'alvorada-v25';
const FILES = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css',
  'js/i18n.js', 'i18n/keys.js', 'i18n/en.js', 'i18n/es.js', 'i18n/de.js', 'i18n/fr.js', 'i18n/it.js', 'i18n/ko.js',
  'js/audio.js', 'js/data.js', 'js/dialogues.js', 'js/world.js', 'js/npcs_city.js', 'js/eco.js', 'js/city.js', 'js/shops.js', 'js/cases.js', 'js/engine.js', 'js/props.js', 'js/ui.js', 'js/intro.js', 'js/main.js', 'js/sector7.js', 'js/paulista.js', 'js/bixiga.js',
  'fonts/inter.woff2', 'fonts/chakra-500.woff2', 'fonts/chakra-700.woff2', 'icons/icon-192.png', 'icons/icon-512.png', 'audio/cat.wav', 'audio/water.flac',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// rede primeiro (pega atualizações), cache como reserva
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
