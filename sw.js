// sw.js - two jobs:
//  1. The app opens without internet after the first visit (page + AI engine kept in a cache;
//     the big model files are cached separately by index.html).
//  2. Adds the two headers that make the page "cross-origin isolated", which lets the AI use
//     several CPU cores (GitHub Pages cannot send these headers itself).
const CACHE = "svai-app-v1";
const SHELL = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png",
  "ort/ort.wasm.min.js", "ort/ort-wasm-simd-threaded.mjs", "ort/ort-wasm-simd-threaded.wasm"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

function isolate(res) {
  if (!res || res.status === 0) return res;
  const h = new Headers(res.headers);
  h.set("Cross-Origin-Opener-Policy", "same-origin");
  h.set("Cross-Origin-Embedder-Policy", "require-corp");
  h.set("Cross-Origin-Resource-Policy", "same-origin");
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.includes("/models/")) return;              // models: cached by the page itself
  e.respondWith(
    fetch(e.request).then(res => {                             // network first: always the newest app
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return isolate(res);
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(isolate))
  );
});
