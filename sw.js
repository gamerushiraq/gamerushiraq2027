"use strict";

const CACHE_NAME = "gamerush-v29";
const OFFLINE_FALLBACK = "./index.html";
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./shop.html",
  "./game.html",
  "./track.html",
  "./styles.css",
  "./lightweight.css",
  "./store-ui.css",
  "./payment-redesign.css",
  "./payment-result.css",
  "./game-art-motion.css",
  "./home-minimal-2026.css",
  "./home-reference.css",
  "./support-2026.css",
  "./auth-modal.css",
  "./performance-2026.css",
  "./performance-hotfix-2026.css",
  "./theme-2026.css",
  "./responsive-2026.css",
  "./app.js",
  "./home.js",
  "./store.js",
  "./site-shell.js",
  "./page-motion.js",
  "./lang.js",
  "./game.js",
  "./media-guard-2026.js",
  "./favicon.svg",
  "./assets/hero-abstract.svg",
  "./manifest.webmanifest"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // A missing optional asset must not prevent the entire worker from installing.
    await Promise.all(PRECACHE_URLS.map(async path => {
      try {
        const request = new Request(new URL(path, self.registration.scope), { cache: "reload" });
        const response = await fetch(request);
        if (response.ok && response.type === "basic") {
          await cache.put(request, response);
        }
      } catch {
        // Keep installation resilient; missing assets will still be fetched online.
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith("gamerush-") && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never cache cross-origin requests (including Supabase REST/functions, payment
  // providers, identity endpoints, fonts, and third-party content).
  if (url.origin !== self.location.origin) return;

  const scopeUrl = new URL(self.registration.scope);
  if (!url.pathname.startsWith(scopeUrl.pathname)) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok && response.type === "basic") {
          const cache = await caches.open(CACHE_NAME);
          const key = new Request(url.href, { method: "GET" });
          await cache.put(key, response.clone());
        }
        return response;
      } catch {
        const cache = await caches.open(CACHE_NAME);
        return await cache.match(request, { ignoreSearch: true })
          || await cache.match(new URL(OFFLINE_FALLBACK, self.registration.scope).href)
          || new Response("أنت غير متصل بالإنترنت. أعد المحاولة عند عودة الاتصال.", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" }
          });
      }
    })());
    return;
  }

  // Cache only successful same-origin static assets. Network requests to APIs are
  // cross-origin and bypass this handler entirely, so prices/order states stay fresh.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok && response.type === "basic" && !url.search) {
        await cache.put(request, response.clone());
      }
      return response;
    } catch {
      return new Response("", { status: 504, statusText: "Gateway Timeout" });
    }
  })());
});
