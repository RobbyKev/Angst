// Modul 2: Angstleiter
import { Store } from './store.js';
import { el, kopf, regler, knopfwahl, feld, leer, datumKurz, eingetretenText, erklaerung } from './ui.js';
import { ERKLAERKARTEN } from './inhalte.js';
import { wofuerAuswahl, wofuerText, wofuerAnzeige } from './wofuer.js';
import { laufendeUebung } from './uebung.js';
import { linien } from './chart.js';

const STATUS = [['offen', 'offen'], ['versucht', 'versucht'], ['geschafft', 'geschafft']];

export async function renderLeiter(main) {
  const liste = (await Store.list('situationen')).sort((a, b) => b.angstwertErwartet - a.angstwertErwartet);
  const lauf = await laufendeUebung();

  main.append(
    kopf('Angstleiter'),
    lauf ? el('a', { class: 'btn btn-breit', href: lauf.route }, 'Laufende Übung fortsetzen') : null,
    el('p', { class: 'leise' }, 'Oben die schwersten Stufen, unten die leichtesten. Die Reihenfolge ist eine Orientierung, kein Zwang.'),
    el('a', { class: 'btn btn-primaer btn-breit', href: '#/leiter/neu' }, 'Neue Stufe'),
    liste.length
      ? el('ol', { class: 'leiter' }, liste.map((s) => el('li', {},
        el('a', { class: 'stufe status-' + s.status, href: `#/leiter/${s.id}` },
          el('span', { class: 'stufe-wert' }, String(s.angstwertErwartet)),
          el('span', { class: 'stufe-titel' }, s.titel),
          el('span', { class: 'stufe-status leise klein' }, s.status)))))
      : leer('Noch keine Stufen. Lege Situationen an, die du meidest oder die dir Angst machen.'),
    erklaerung('Was ist die Angstleiter?', ERKLAERKARTEN.angstleiter),
  );
}

export async function renderStufeForm(main, id) {
  const neu = id === 'neu';
  const s = neu ? { titel: '', angstwertErwartet: 50, status: 'offen', wofuerId: null } : await Store.get('situationen', id);
  if (!s) { location.hash = '#/leiter'; return; }
  const titel = el('input', { type: 'text', name: 'titel', value: s.titel, required: true, autocomplete: 'off' });
  const wert = regler(0, 100, 5, s.angstwertErwartet, 'Erwarteter Angstwert');
  const status = knopfwahl(STATUS, null, { gewaehlt: s.status, label: 'Status' });
  const wofuer = await wofuerAuswahl('wofuer', s.wofuerId);

  const form = el('form', { class: 'formular' },
    feld('Situation', titel),
    el('div', { class: 'feld' }, el('span', { class: 'feld-label' }, 'Erwarteter Angstwert (0–100)'), wert),
    el('div', { class: 'feld' }, el('span', { class: 'feld-label' }, 'Status'), status),
    feld('Wofür (optional)', wofuer),
    el('button', { type: 'submit', class: 'btn btn-primaer btn-breit' }, 'Speichern'),
    neu ? null : el('button', {
      type: 'button', class: 'text-btn',
      onclick: async () => {
        if (!confirm('Diese Stufe löschen? Die Übungen bleiben im Mut-Buch.')) return;
        await Store.remove('situationen', id);
        location.hash = '#/leiter';
      },
    }, 'Löschen'),
  );
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const daten = { titel: titel.value.trim(), angstwertErwartet: wert.wert(), status: status.wert() || 'offen', wofuerId: wofuer.value || null };
    if (!daten.titel) return;
    if (neu) {
      const d = await Store.add('situationen', { ...daten, erstellt: new Date().toISOString() });
      location.hash = `#/leiter/${d.id}`;
    } else {
      await Store.update('situationen', id, daten);
      location.hash = `#/leiter/${id}`;
    }
  });
  main.append(kopf(neu ? 'Neue Stufe' : 'Stufe bearbeiten', neu ? '#/leiter' : `#/leiter/${id}`), form);
}

export async function renderStufe(main, id) {
  const s = await Store.get('situationen', id);
  if (!s) { location.hash = '#/leiter'; return; }
  const uebungen = (await Store.list('uebungen')).filter((u) => u.situationId === id).sort((a, b) => (a.start < b.start ? 1 : -1));
  const koerper = await Store.list('koerperUebungen');
  const wofuer = await wofuerText(s.wofuerId);
  const lauf = await laufendeUebung();

  const kurven = uebungen.filter((u) => u.kurve && u.kurve.length > 1);

  main.append(
    kopf(s.titel, '#/leiter'),
    el('p', { class: 'leise' }, `Erwarteter Angstwert ${s.angstwertErwartet} · ${s.status}`),
    wofuerAnzeige(wofuer),
    lauf && lauf.route.includes(id) ? el('a', { class: 'btn btn-breit', href: lauf.route }, 'Laufende Übung fortsetzen') : null,
    el('a', { class: 'btn btn-primaer btn-breit', href: `#/uebung/exposition/${id}` }, 'Übung starten'),
    s.status === 'geschafft'
      ? el('div', { class: 'karte karte-leise' },
        el('p', { class: 'eyebrow' }, 'Vertiefte Übung'),
        el('p', {}, 'Kombiniere die Situation mit einer Körperübung direkt davor.'),
        koerper.length
          ? el('a', { class: 'btn btn-breit', href: `#/uebung/kombiniert/${id}` }, 'Vertiefte Übung starten')
          : el('a', { class: 'text-btn', href: '#/koerper/neu' }, 'Erst eine Körperübung anlegen'))
      : null,
    el('a', { class: 'text-btn', href: `#/leiter/${id}/bearbeiten` }, 'Bearbeiten'),
    kurven.length ? el('section', { class: 'abschnitt' },
      el('h2', {}, 'Kurven'),
      el('p', { class: 'leise klein' }, 'Nur zur Beobachtung. Die neueste Übung ist kräftiger gezeichnet.'),
      linien(kurven.map((u, i) => ({ punkte: u.kurve.map((p) => ({ x: p.minute, y: p.wert })), hervorheben: i === 0 })), { beschreibung: 'Angstkurven der Übungen zu dieser Stufe' })) : null,
    el('section', { class: 'abschnitt' },
      el('h2', {}, 'Bisherige Übungen'),
      uebungen.length ? el('ul', { class: 'liste' }, uebungen.map((u) => el('li', { class: 'liste-eintrag' },
        el('strong', {}, datumKurz(u.start), u.typ === 'kombiniert' ? ' · vertieft' : ''),
        el('span', {}, 'Befürchtung: ', u.befuerchtung, ` (${u.wahrscheinlichkeit} %) – `, eingetretenText(u.eingetreten || 'offen')),
        u.kontext ? el('span', { class: 'leise' }, 'Kontext: ', u.kontext) : null,
        u.gelernt ? el('span', { class: 'leise' }, 'Gelernt: ', u.gelernt) : null))) : leer('Noch keine Übungen.'),
    ),
  );
}
