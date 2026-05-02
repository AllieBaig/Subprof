const VERSION = 'subliminal-v18'; // Increment for update
const CACHE_NAME = `subliminal-player-${VERSION}`;

// Core shell assets for instant startup
const STATIC_ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'favicon.ico',
];

const EXTERNAL_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
];

const PRECACHE_ASSETS = [...STATIC_ASSETS, ...EXTERNAL_ASSETS];

// Self-Healing: Deep verification of critical assets
async function validateCacheIntegrity() {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  
  // Find critical JS/CSS bundles in cache keys
  const jsBundles = keys.filter(k => k.url.includes('.js') && !k.url.includes('sw.js'));
  const cssBundles = keys.filter(k => k.url.includes('.css'));
  
  const criticalFiles = [
    ...STATIC_ASSETS,
    ...jsBundles.map(k => k.url),
    ...cssBundles.map(k => k.url)
  ];

  for (const file of criticalFiles) {
    try {
      const response = await cache.match(file);
      // iOS Check: Detect 0-byte or failed downloads that sometimes get cached
      if (!response || !response.ok || response.status === 206) {
        throw new Error('Corrupted or partial response');
      }
      
      const blob = await response.clone().blob();
      if (blob.size === 0) {
        throw new Error('Empty file detected');
      }
    } catch (e) {
      console.warn(`[SW] Healing required for: ${file} - ${e.message}`);
      try {
        const networkResponse = await fetch(file, { cache: 'reload' });
        if (networkResponse.ok && networkResponse.status === 200) {
          await cache.put(file, networkResponse);
          console.log(`[SW] Successfully repaired: ${file}`);
        }
      } catch (fetchErr) {
        console.error(`[SW] Secondary repair failed for ${file}:`, fetchErr);
      }
    }
  }
}

// Install: Immediate activation and pre-caching
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        PRECACHE_ASSETS.map(asset => 
          fetch(asset, { cache: 'reload', mode: 'no-cors' }).then(response => {
            if (response.ok || response.type === 'opaque') return cache.put(asset, response);
          }).catch(() => {})
        )
      );
    })
  );
});

// Activate: Purge old versions and run self-repair
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key.startsWith('subliminal-player-') && key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    }).then(() => {
      self.clients.claim();
      // Start background repair
      validateCacheIntegrity();
    })
  );
});

// Sync event for background healing (if supported)
self.addEventListener('sync', (event) => {
  if (event.tag === 'heal-cache') {
    event.waitUntil(validateCacheIntegrity());
  }
});

// Message listener for manual healing trigger
self.addEventListener('message', (event) => {
  if (event.data === 'HEAL_CACHE') {
    event.waitUntil(validateCacheIntegrity());
  }
});

// Fetch Logic: 
// 1. Navigation -> Network with rapid fallback to Cache (Shell)
// 2. Static Assets -> Cache-First
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET or internal vite/hot-update
  if (event.request.method !== 'GET') return;
  if (url.protocol === 'blob:') return;
  if (url.pathname.startsWith('/@vite') || url.pathname.includes('hot-update')) return;

  // CRITICAL: NEVER intercept audio fetch requests for iOS 16 stability
  const isAudio = 
    event.request.destination === 'audio' || 
    url.pathname.match(/\.(mp3|m4a|wav|ogg|flac|aac)$/i) ||
    event.request.headers.get('Accept')?.includes('audio/');
  
  if (isAudio) return;

  // NAVIGATION: Optimized for iOS 16 and Subfolder SPA routing
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          // Try to match exact request, then fallback to index shell
          const exactMatch = await cache.match(event.request);
          if (exactMatch) return exactMatch;

          const shell = await cache.match('./index.html') || 
                        await cache.match('index.html') || 
                        await cache.match('./') ||
                        await cache.match('/');
          
          if (shell) return shell;

          // Ultimate fallback (Safe Fail-Open for Safari)
          return new Response(
            `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>location.reload()</script></body></html>`, 
            { status: 200, headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // ASSETS: Cache-First with Background Revalidation
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse.ok && networkResponse.status === 200) {
          const isAsset = url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|webp|woff2|json)$/);
          if (isAsset) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
        }
        return networkResponse;
      }).catch(() => null);

      return cachedResponse || fetchPromise || new Response('', { status: 404 });
    })
  );
});


