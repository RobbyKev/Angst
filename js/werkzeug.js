// Modul 8: Wochenwerkzeug
import { Store } from './store.js';
import { el, kopf, wochenStart, entwurf, neuZeichnen } from './ui.js';
import { WERKZEUGE, ERKLAERKARTEN, EMPFOHLENE_REIHENFOLGE } from './inhalte.js';
import { ladeEinstellungen, speichereEinstellungen } from './einstellungen.js';

export const werkzeugInfo = (id) => WERKZEUGE.find((w) => w.id === id) || null;

// Aktuelles Werkzeug: Eintrag dieser Woche, sonst das zuletzt gewählte (wird einfach behalten).
export async function aktuellesWochenwerkzeug() {
  const alle = (await Store.list('wochenwerkzeug')).sort((a, b) => (a.wocheStart < b.wocheStart ? 1 : -1));
  if (!alle.length) return null;
  return { ...alle[0], dieseWoche: alle[0].wocheStart === wochenStart() };
}

export function vorschlag(aktuellId) {
  if (!aktuellId) return EMPFOHLENE_REIHENFOLGE[0];
  const i = EMPFOHLENE_REIHENFOLGE.indexOf(aktuellId);
  return EMPFOHLENE_REIHENFOLGE[(i + 1) % EMPFOHLENE_REIHENFOLGE.length];
}

async function setze(werkzeug, ausEmpfehlung) {
  const ws = wochenStart();
  const vorhanden = (await Store.list('wochenwerkzeug')).find((w) => w.wocheStart === ws);
  if (vorhanden) await Store.update('wochenwerkzeug', vorhanden.id, { werkzeug, ausEmpfehlung });
  else await Store.add('wochenwerkzeug', { wocheStart: ws, werkzeug, ausEmpfehlung });
}

export async function renderWerkzeug(main) {
  const cfg = await ladeEinstellungen();
  const aktuell = await aktuellesWochenwerkzeug();
  const info = aktuell ? werkzeugInfo(aktuell.werkzeug) : null;
  const vor = cfg.empfohleneReihenfolge ? vorschlag(aktuell?.werkzeug) : null;

  const karteFuer = (w) => el('details', { class: 'erklaerkarte', open: aktuell?.werkzeug === w.id },
    el('summary', {}, w.name, aktuell?.werkzeug === w.id ? el('span', { class: 'leise klein' }, ' · aktuell') : null),
    ERKLAERKARTEN[w.id].map((t) => el('p', {}, t)),
    el('p', {}, entwurf()),
    el('div', { class: 'zeile' },
      aktuell?.werkzeug === w.id
        ? el('a', { class: 'btn', href: w.link }, 'Zum Modul')
        : el('button', { type: 'button', class: 'btn', onclick: async () => { await setze(w.id, w.id === vor); location.hash = '#/'; } }, 'Für diese Woche wählen')));

  const reihenfolge = el('label', { class: 'schalter' },
    el('input', {
      type: 'checkbox', checked: cfg.empfohleneReihenfolge,
      onchange: async (e) => { await speichereEinstellungen({ empfohleneReihenfolge: e.target.checked }); neuZeichnen(); },
    }),
    el('span', {}, 'Empfohlene Reihenfolge nutzen (die App schlägt das nächste Werkzeug vor)'));

  main.append(
    kopf('Wochenwerkzeug'),
    info ? el('section', { class: 'karte' },
      el('p', { class: 'eyebrow' }, aktuell.dieseWoche ? 'Diese Woche' : 'Bisheriges Werkzeug'),
      el('h2', {}, info.name),
      el('a', { class: 'btn btn-primaer btn-breit', href: info.link }, 'Zum Modul'),
      !aktuell.dieseWoche ? el('button', { type: 'button', class: 'btn btn-breit', onclick: async () => { await setze(aktuell.werkzeug, false); location.hash = '#/'; } }, 'Behalten') : null)
      : el('p', { class: 'leise' }, 'Wähle ein Werkzeug, das eine Woche lang im Fokus steht.'),
    reihenfolge,
    vor ? el('section', { class: 'karte karte-leise' },
      el('p', { class: 'eyebrow' }, 'Vorschlag'),
      el('p', {}, werkzeugInfo(vor).name),
      el('button', { type: 'button', class: 'btn btn-breit', onclick: async () => { await setze(vor, true); location.hash = '#/'; } }, 'Übernehmen')) : null,
    el('h2', {}, 'Alle Werkzeuge'),
    WERKZEUGE.map(karteFuer),
  );
}
