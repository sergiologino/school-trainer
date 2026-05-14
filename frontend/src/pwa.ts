export function registerPwa() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // PWA support is best-effort; app must stay usable without SW.
    });
  });
}

