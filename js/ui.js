// Gemeinsame UI-Helfer. Nutzertext wird immer als Text eingefügt, nie als HTML.

export function el(tag, props = {}, ...kinder) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') n.className = v;
    else if (k === 'value') n.value = v;
    else if (k === 'checked') n.checked = !!v;
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v === true) n.setAttribute(k, '');
    else n.setAttribute(k, v);
  }
  for (const c of kinder.flat(Infinity)) {
    if (c == null || c === false) continue;
    n.append(c instanceof Node ? c : String(c));
  }
  return n;
}

const ICONS = {
  zurueck: 'M15 5l-7 7 7 7',
  einstellungen: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  schliessen: 'M6 6l12 12M18 6L6 18',
};

export function icon(name) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', 'icon');
  const p = document.createElementNS(ns, 'path');
  p.setAttribute('d', ICONS[name]);
  svg.append(p);
  return svg;
}

export function heute(d = new Date()) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const t = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${t}`;
}

export function datumLang(d = new Date()) {
  return d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
}

// Kopfzeile für Unterseiten
export function kopf(titel, zurueck = '#/') {
  return el('header', { class: 'seiten-kopf' },
    el('a', { href: zurueck, class: 'icon-btn', 'aria-label': 'Zurück' }, icon('zurueck')),
    el('h1', { tabindex: '-1' }, titel),
  );
}

export function entwurf() {
  return el('span', { class: 'badge', title: 'Text noch nicht freigegeben' }, 'Entwurf');
}

// Skala als Tastenreihe, z. B. 0–10
export function skala(min, max, beiWahl, { gewaehlt = null, label = 'Wert' } = {}) {
  const box = el('div', { class: 'skala', role: 'group', 'aria-label': label });
  for (let i = min; i <= max; i++) {
    box.append(el('button', {
      type: 'button',
      class: 'skala-btn',
      'aria-pressed': String(gewaehlt === i),
      onclick: () => beiWahl(i),
    }, String(i)));
  }
  return box;
}

// Auswahl-Chips (einfach oder mehrfach)
export function chips(optionen, { mehrfach = false, gewaehlt = [], label = 'Auswahl' } = {}) {
  const auswahl = new Set(gewaehlt);
  const box = el('div', { class: 'chips', role: 'group', 'aria-label': label });
  const knoepfe = optionen.map((o) => {
    const b = el('button', { type: 'button', class: 'chip', 'aria-pressed': String(auswahl.has(o)) }, o);
    b.addEventListener('click', () => {
      if (auswahl.has(o)) auswahl.delete(o);
      else {
        if (!mehrfach) auswahl.clear();
        auswahl.add(o);
      }
      knoepfe.forEach((k, i) => k.setAttribute('aria-pressed', String(auswahl.has(optionen[i]))));
    });
    return b;
  });
  box.append(...knoepfe);
  box.werte = () => optionen.filter((o) => auswahl.has(o));
  return box;
}

// Overlay (Dialog). Gibt eine Schließen-Funktion zurück.
export function overlay(inhalt, { label = 'Dialog', schliessbar = true } = {}) {
  const vorher = document.activeElement;
  const karte = el('div', { class: 'overlay-karte', role: 'dialog', 'aria-modal': 'true', 'aria-label': label });
  const huelle = el('div', { class: 'overlay' }, karte);
  const schliessen = () => {
    huelle.remove();
    document.removeEventListener('keydown', taste);
    window.removeEventListener('hashchange', schliessen);
    if (vorher && vorher.focus) vorher.focus();
  };
  const taste = (e) => { if (e.key === 'Escape' && schliessbar) schliessen(); };
  if (schliessbar) {
    karte.append(el('button', { type: 'button', class: 'icon-btn overlay-zu', 'aria-label': 'Schließen', onclick: schliessen }, icon('schliessen')));
    huelle.addEventListener('click', (e) => { if (e.target === huelle) schliessen(); });
    window.addEventListener('hashchange', schliessen);
  }
  karte.append(...[inhalt].flat(Infinity).filter(Boolean));
  document.addEventListener('keydown', taste);
  document.body.append(huelle);
  const fokus = karte.querySelector('h2, button:not(.overlay-zu), a');
  if (fokus) {
    if (fokus.tagName === 'H2') fokus.setAttribute('tabindex', '-1');
    fokus.focus();
  }
  return schliessen;
}

export function datumKurz(iso) {
  const d = new Date(iso.length === 10 ? iso + 'T12:00:00' : iso);
  return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'numeric', year: 'numeric' });
}

export function datumUhrzeit(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'numeric', year: 'numeric' })
    + ', ' + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

// Montag der Woche als YYYY-MM-DD
export function wochenStart(d = new Date()) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const tag = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - tag);
  return heute(x);
}

export function plusTage(n, d = new Date()) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() + n);
  return heute(x);
}

export function tageSeit(iso) {
  return (Date.now() - new Date(iso).getTime()) / 86400000;
}

// Schieberegler mit großer Zahl
export function regler(min, max, schritt, wert, label, einheit = '') {
  const aus = el('output', { class: 'regler-wert' }, `${wert}${einheit}`);
  const input = el('input', { type: 'range', min: String(min), max: String(max), step: String(schritt), value: String(wert), 'aria-label': label });
  input.addEventListener('input', () => { aus.textContent = `${input.value}${einheit}`; });
  const box = el('div', { class: 'regler' }, aus, input,
    el('div', { class: 'regler-skala leise klein', 'aria-hidden': 'true' }, el('span', {}, `${min}${einheit}`), el('span', {}, `${max}${einheit}`)));
  box.wert = () => Number(input.value);
  return box;
}

export function feld(label, eingabe, hilfe) {
  return el('label', { class: 'feld' },
    el('span', { class: 'feld-label' }, label),
    hilfe ? el('span', { class: 'leise klein' }, hilfe) : null,
    eingabe);
}

export function textfeld(name, wert = '', { mehrzeilig = false, placeholder = '', required = false, rows = 3 } = {}) {
  return mehrzeilig
    ? el('textarea', { name, rows: String(rows), placeholder, required }, wert || '')
    : el('input', { type: 'text', name, value: wert || '', placeholder, required, autocomplete: 'off' });
}

export function karte(...kinder) {
  return el('section', { class: 'karte' }, ...kinder);
}

export function erklaerung(titel, saetze, istEntwurf = true) {
  return el('details', { class: 'erklaerkarte' },
    el('summary', {}, titel, istEntwurf ? [' ', entwurf()] : null),
    [].concat(saetze).map((s) => el('p', {}, s)));
}

export function leer(text) {
  return el('p', { class: 'leise' }, text);
}

export const EINGETRETEN = [['ja', 'Ja'], ['nein', 'Nein'], ['teilweise', 'Teilweise']];
export const eingetretenText = (w) => ({ ja: 'eingetreten', nein: 'nicht eingetreten', teilweise: 'teilweise eingetreten', offen: 'offen' }[w] || w);

// Einfache Einzelauswahl als Knopfreihe
export function knopfwahl(optionen, beiWahl, { gewaehlt = null, label = 'Auswahl' } = {}) {
  const box = el('div', { class: 'knopfwahl', role: 'group', 'aria-label': label });
  let aktuell = gewaehlt;
  const knoepfe = optionen.map(([wert, name]) => el('button', {
    type: 'button', class: 'chip', 'aria-pressed': String(gewaehlt === wert),
    onclick: () => {
      aktuell = wert;
      knoepfe.forEach((k, i) => k.setAttribute('aria-pressed', String(optionen[i][0] === wert)));
      if (beiWahl) beiWahl(wert);
    },
  }, name));
  box.append(...knoepfe);
  box.wert = () => aktuell;
  return box;
}

export function download(dateiname, inhalt, typ) {
  const blob = new Blob([inhalt], { type: typ });
  const url = URL.createObjectURL(blob);
  const a = el('a', { href: url, download: dateiname });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// Aktuelle Seite neu zeichnen (ohne Neuladen)
export function neuZeichnen() {
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}
