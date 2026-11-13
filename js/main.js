import { renderStart } from './start.js';
import { renderAkut } from './akut.js';
import { renderPool, renderSchrittForm } from './schritte.js';
import { renderEinstellungen, ladeEinstellungen, speichereEinstellungen, wendeThemeAn } from './einstellungen.js';
import { zeigeHilfe, zeigeErststartHinweis } from './hilfe.js';
import { renderLeiter, renderStufe, renderStufeForm } from './leiter.js';
import { renderUebung } from './uebung.js';
import { renderKoerper, renderKoerperForm } from './koerper.js';
import { renderMutbuch } from './mutbuch.js';
import { renderWofuer } from './wofuer.js';
import { renderSorgen, renderSorgenzeit, renderBefuerchtungen } from './sorgen.js';
import { renderKreisListe, renderKreisNeu, renderKreis } from './kreis.js';
import { renderWerkzeug } from './werkzeug.js';
import { renderVerlauf, renderGad7 } from './verlauf.js';
import { renderWellen } from './wellen.js';
import { renderSicherheit } from './sicherheit.js';
import { sperre } from './pin.js';

const ROUTEN = [
  { muster: /^\/$/, render: renderStart, titel: 'Durch' },
  { muster: /^\/akut$/, render: renderAkut, titel: 'Akut-Modus', vollbild: true },
  { muster: /^\/schritte$/, render: renderPool, titel: 'Schritte-Pool' },
  { muster: /^\/schritte\/([\w-]+)$/, render: renderSchrittForm, titel: 'Schritt' },
  { muster: /^\/leiter$/, render: renderLeiter, titel: 'Angstleiter' },
  { muster: /^\/leiter\/neu$/, render: (m) => renderStufeForm(m, 'neu'), titel: 'Neue Stufe' },
  { muster: /^\/leiter\/([\w-]+)\/bearbeiten$/, render: renderStufeForm, titel: 'Stufe bearbeiten' },
  { muster: /^\/leiter\/([\w-]+)$/, render: renderStufe, titel: 'Stufe' },
  { muster: /^\/uebung\/(exposition|kombiniert|koerper)\/([\w-]+)$/, render: renderUebung, titel: 'Übung', vollbild: true },
  { muster: /^\/koerper$/, render: renderKoerper, titel: 'Körperübungen' },
  { muster: /^\/koerper\/([\w-]+)$/, render: renderKoerperForm, titel: 'Körperübung' },
  { muster: /^\/mutbuch$/, render: renderMutbuch, titel: 'Mut-Buch' },
  { muster: /^\/wofuer$/, render: renderWofuer, titel: 'Wofür' },
  { muster: /^\/sorgen$/, render: renderSorgen, titel: 'Sorgen' },
  { muster: /^\/sorgenzeit$/, render: renderSorgenzeit, titel: 'Sorgenzeit', vollbild: true },
  { muster: /^\/befuerchtungen$/, render: renderBefuerchtungen, titel: 'Befürchtungs-Check' },
  { muster: /^\/kreis$/, render: renderKreisListe, titel: 'Teufelskreis' },
  { muster: /^\/kreis\/neu$/, render: renderKreisNeu, titel: 'Teufelskreis' },
  { muster: /^\/kreis\/([\w-]+)$/, render: renderKreis, titel: 'Teufelskreis' },
  { muster: /^\/werkzeug$/, render: renderWerkzeug, titel: 'Wochenwerkzeug' },
  { muster: /^\/verlauf$/, render: renderVerlauf, titel: 'Verlauf' },
  { muster: /^\/gad7$/, render: renderGad7, titel: 'Monats-Check' },
  { muster: /^\/wellen$/, render: renderWellen, titel: 'Plan für Wellen' },
  { muster: /^\/sicherheitsverhalten$/, render: renderSicherheit, titel: 'Sicherheitsverhalten' },
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
  // Wie el(): null/false überspringen, Arrays auflösen
  frisch.append = (...k) => Element.prototype.append.apply(frisch, k.flat(Infinity).filter((x) => x != null && x !== false));
  let ergebnis;
  try {
    ergebnis = await route.render(frisch, ...treffer.slice(1));
  } catch (e) {
    console.error(e);
    frisch.replaceChildren();
    const p = document.createElement('p');
    p.textContent = 'Hier ist etwas schiefgelaufen. ' + (e.message || '');
    const a = document.createElement('a');
    a.href = '#/'; a.textContent = 'Zum Start';
    frisch.append(p, a);
  }
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

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => { /* offline-Funktion dann nicht verfügbar */ });
  }

  if (cfg.pin) await sperre(cfg.pin);

  window.addEventListener('hashchange', navigiere);
  await navigiere();
  if (!cfg.hinweisGesehen) zeigeErststartHinweis(() => speichereEinstellungen({ hinweisGesehen: true }));
}

start();
