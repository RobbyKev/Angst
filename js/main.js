import { renderStart } from './start.js';
import { renderAkut } from './akut.js';
import { renderPool, renderSchrittForm } from './schritte.js';
import { renderEinstellungen, ladeEinstellungen, speichereEinstellungen, wendeThemeAn } from './einstellungen.js';
import { zeigeHilfe, zeigeErststartHinweis } from './hilfe.js';

const ROUTEN = [
  { muster: /^\/$/, render: renderStart, titel: 'Durch' },
  { muster: /^\/akut$/, render: renderAkut, titel: 'Akut-Modus', vollbild: true },
  { muster: /^\/schritte$/, render: renderPool, titel: 'Schritte-Pool' },
  { muster: /^\/schritte\/([\w-]+)$/, render: renderSchrittForm, titel: 'Schritt' },
  { muster: /^\/einstellungen$/, render: renderEinstellungen, titel: 'Einstellungen' },
];

const main = document.getElementById('inhalt');
let aufraeumen = null;
let zaehler = 0;

async function navigiere() {
  const pfad = location.hash.replace(/^#/, '') || '/';
  let route = null;
  let treffer = null;
  for (const r of ROUTEN) {
    treffer = pfad.match(r.muster);
    if (treffer) { route = r; break; }
  }
  if (!route) { location.replace('#/'); return; }

  const nr = ++zaehler;
  if (aufraeumen) { aufraeumen(); aufraeumen = null; }
  const frisch = document.createElement('div');
  frisch.className = 'seite';
  const ergebnis = await route.render(frisch, ...treffer.slice(1));
  if (nr !== zaehler) { if (typeof ergebnis === 'function') ergebnis(); return; }
  if (typeof ergebnis === 'function') aufraeumen = ergebnis;

  document.body.classList.toggle('vollbild', !!route.vollbild);
  document.title = route.titel === 'Durch' ? 'Durch' : `${route.titel} · Durch`;
  main.replaceChildren(frisch);
  window.scrollTo(0, 0);
  const h = main.querySelector('h1');
  if (h && !route.vollbild) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  else if (route.vollbild) { const f = main.querySelector('[tabindex="-1"]'); if (f) f.focus({ preventScroll: true }); }
}

async function start() {
  const cfg = await ladeEinstellungen();
  wendeThemeAn(cfg.theme);
  document.getElementById('hilfe-btn').addEventListener('click', zeigeHilfe);
  window.addEventListener('hashchange', navigiere);
  await navigiere();
  if (!cfg.hinweisGesehen) zeigeErststartHinweis(() => speichereEinstellungen({ hinweisGesehen: true }));

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => { /* offline-Funktion dann nicht verfügbar */ });
  }
}

start();
