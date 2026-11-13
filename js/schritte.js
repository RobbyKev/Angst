// Modul 7: Tagesschritt – Pool-Verwaltung und Tageslogik.
import { Store } from './store.js';
import { el, kopf, heute } from './ui.js';
import { WERKZEUGE, MODUL_LINKS } from './inhalte.js';
import { wofuerAuswahl } from './wofuer.js';

const zufall = (liste) => liste[Math.floor(Math.random() * liste.length)];

async function aktuellesWerkzeug() {
  // Wochenwerkzeug kommt in Phase 4. Ist schon eins gesetzt, wird es bevorzugt.
  const wochen = await Store.list('wochenwerkzeug');
  if (!wochen.length) return null;
  const neueste = [...wochen].sort((a, b) => (a.wocheStart < b.wocheStart ? 1 : -1))[0];
  return neueste.werkzeug || null;
}

async function waehle(pool, ausserId = null) {
  let kandidaten = pool.filter((s) => s.id !== ausserId);
  if (!kandidaten.length) kandidaten = pool;
  if (!kandidaten.length) return null;
  const werkzeug = await aktuellesWerkzeug();
  if (werkzeug) {
    const passend = kandidaten.filter((s) => s.werkzeug === werkzeug);
    if (passend.length) return zufall(passend);
  }
  return zufall(kandidaten);
}

// Liefert den Tagesschritt für heute. Verpasste Tage spielen keine Rolle.
export async function tagesschrittHeute() {
  const alle = await Store.list('schrittPool');
  const pool = alle.filter((s) => s.aktiv !== false);
  const datum = heute();
  let rec = (await Store.list('tagesschritte')).find((t) => t.datum === datum) || null;
  let schritt = rec ? alle.find((s) => s.id === rec.schrittId) || null : null;

  if (rec && !rec.erledigt && (!schritt || schritt.aktiv === false)) {
    schritt = await waehle(pool);
    if (schritt) rec = await Store.update('tagesschritte', rec.id, { schrittId: schritt.id, variante: null });
    else { await Store.remove('tagesschritte', rec.id); rec = null; }
  }
  if (!rec && pool.length) {
    schritt = await waehle(pool);
    rec = await Store.add('tagesschritte', { datum, schrittId: schritt.id, variante: null, erledigt: false });
  }
  return { rec, schritt, poolGroesse: pool.length };
}

export async function andererSchritt(rec) {
  const pool = (await Store.list('schrittPool')).filter((s) => s.aktiv !== false);
  const schritt = await waehle(pool, rec.schrittId);
  if (schritt) await Store.update('tagesschritte', rec.id, { schrittId: schritt.id, variante: null });
}

export async function waehleVariante(rec, variante) {
  await Store.update('tagesschritte', rec.id, { variante });
}

export async function erledige(rec, schritt) {
  const variante = rec.variante || 'normal';
  const beschreibung = variante === 'mini' ? schritt.mini : schritt.normal;
  await Store.update('tagesschritte', rec.id, {
    variante, erledigt: true, titel: schritt.titel, text: beschreibung,
  });
  await Store.add('mutbuch', {
    datum: new Date().toISOString(),
    text: `${schritt.titel}${variante === 'mini' ? ' (Mini)' : ''}: ${beschreibung}`,
    quelle: 'tagesschritt',
    refId: rec.id,
  });
}

export async function rueckgaengig(rec) {
  await Store.update('tagesschritte', rec.id, { erledigt: false });
  await Store.removeWhere('mutbuch', (m) => m.quelle === 'tagesschritt' && m.refId === rec.id);
}

// ---------- Pool-Liste ----------

export async function renderPool(main) {
  const pool = await Store.list('schrittPool');
  const werkzeugName = (id) => WERKZEUGE.find((w) => w.id === id)?.name;

  const liste = pool.length
    ? el('ul', { class: 'liste' }, pool.map((s) => el('li', {},
        el('a', { href: `#/schritte/${s.id}`, class: 'liste-eintrag' + (s.aktiv === false ? ' inaktiv' : '') },
          el('strong', {}, s.titel),
          el('span', { class: 'leise' }, 'Normal: ', s.normal),
          el('span', { class: 'leise' }, 'Mini: ', s.mini),
          s.werkzeug ? el('span', { class: 'leise klein' }, 'Werkzeug: ', werkzeugName(s.werkzeug)) : null,
          s.aktiv === false ? el('span', { class: 'leise klein' }, 'pausiert') : null,
        ),
      )))
    : el('p', { class: 'leise' }, 'Noch keine Schritte angelegt.');

  main.append(
    kopf('Schritte-Pool'),
    el('p', { class: 'leise' }, 'Aus diesem Pool kommt jeden Tag ein Schritt. Jeder hat eine normale und eine Mini-Version. Beide zählen gleich.'),
    el('a', { href: '#/schritte/neu', class: 'btn btn-primaer btn-breit' }, 'Neuer Schritt'),
    liste,
  );
}

// ---------- Formular ----------

export async function renderSchrittForm(main, id) {
  const neu = id === 'neu';
  const s = neu ? { titel: '', normal: '', mini: '', werkzeug: '', aktiv: true } : await Store.get('schrittPool', id);
  if (!s) { location.hash = '#/schritte'; return; }
  const wofuer = await wofuerAuswahl('wofuerId', s.wofuerId);

  const feld = (label, name, wert, mehrzeilig, hilfe) => el('label', { class: 'feld' },
    el('span', { class: 'feld-label' }, label),
    hilfe ? el('span', { class: 'leise klein' }, hilfe) : null,
    mehrzeilig
      ? el('textarea', { name, rows: '2', required: true }, wert)
      : el('input', { name, type: 'text', value: wert, required: true, autocomplete: 'off' }),
  );

  const form = el('form', { class: 'formular' },
    feld('Titel', 'titel', s.titel, false),
    feld('Normale Version', 'normal', s.normal, true),
    feld('Mini-Version', 'mini', s.mini, true, 'Für Tage ohne Kraft. Zählt genauso.'),
    el('label', { class: 'feld' },
      el('span', { class: 'feld-label' }, 'Werkzeug (optional)'),
      el('span', { class: 'leise klein' }, 'Passt der Schritt zum Wochenwerkzeug, wird er in dieser Woche bevorzugt.'),
      el('select', { name: 'werkzeug' },
        el('option', { value: '' }, '–'),
        WERKZEUGE.map((w) => el('option', { value: w.id, selected: s.werkzeug === w.id }, w.name)),
      ),
    ),
    el('label', { class: 'feld' },
      el('span', { class: 'feld-label' }, 'Modul (optional)'),
      el('span', { class: 'leise klein' }, 'Auf dem Startscreen erscheint dann ein Link dorthin.'),
      el('select', { name: 'modulLink' },
        el('option', { value: '' }, '–'),
        MODUL_LINKS.map(([link, name]) => el('option', { value: link, selected: s.modulLink === link }, name)),
      ),
    ),
    el('label', { class: 'feld' }, el('span', { class: 'feld-label' }, 'Wofür (optional)'), wofuer),
    el('label', { class: 'schalter' },
      el('input', { type: 'checkbox', name: 'aktiv', checked: s.aktiv !== false }),
      el('span', {}, 'Aktiv (wird für Tagesschritte verwendet)'),
    ),
    el('button', { type: 'submit', class: 'btn btn-primaer btn-breit' }, 'Speichern'),
    neu ? null : el('button', {
      type: 'button', class: 'text-btn',
      onclick: async () => {
        if (!confirm('Diesen Schritt löschen?')) return;
        await Store.remove('schrittPool', id);
        location.hash = '#/schritte';
      },
    }, 'Löschen'),
  );

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const daten = {
      titel: f.get('titel').trim(),
      normal: f.get('normal').trim(),
      mini: f.get('mini').trim(),
      werkzeug: f.get('werkzeug') || null,
      modulLink: f.get('modulLink') || null,
      wofuerId: f.get('wofuerId') || null,
      aktiv: f.get('aktiv') === 'on',
    };
    if (!daten.titel || !daten.normal || !daten.mini) return;
    if (neu) await Store.add('schrittPool', { ...daten, erstellt: new Date().toISOString() });
    else await Store.update('schrittPool', id, daten);
    location.hash = '#/schritte';
  });

  main.append(kopf(neu ? 'Neuer Schritt' : 'Schritt bearbeiten', '#/schritte'), form);
}
