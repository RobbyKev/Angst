// Sicherheitsverhalten-Übersicht
import { Store } from './store.js';
import { el, kopf, leer, erklaerung, neuZeichnen } from './ui.js';
import { ERKLAERKARTEN } from './inhalte.js';

export async function renderSicherheit(main) {
  const liste = await Store.list('sicherheitsverhalten');
  const uebungen = await Store.list('uebungen');
  const zaehle = (id) => uebungen.filter((u) => (u.weggelasseneSicherheitsverhalten || []).includes(id)).length;

  const neu = el('input', { type: 'text', placeholder: 'z. B. Wasserflasche dabei', 'aria-label': 'Neues Sicherheitsverhalten', autocomplete: 'off' });

  main.append(
    kopf('Sicherheitsverhalten'),
    el('p', { class: 'leise' }, 'Was tust du, damit die Angst erträglich bleibt? Bei Übungen kannst du eins davon bewusst weglassen. Schrittweise, nicht alles auf einmal.'),
    el('div', { class: 'karte' }, neu, el('button', {
      type: 'button', class: 'btn btn-breit',
      onclick: async () => {
        const t = neu.value.trim();
        if (!t) return;
        await Store.add('sicherheitsverhalten', { titel: t, aktiv: true, erstellt: new Date().toISOString() });
        neuZeichnen();
      },
    }, 'Hinzufügen')),
    liste.length ? el('ul', { class: 'liste' }, liste.map((s) => {
      const n = zaehle(s.id);
      return el('li', { class: 'liste-eintrag' + (s.aktiv === false ? ' inaktiv' : '') },
        el('strong', {}, s.titel),
        el('span', { class: 'leise' }, n ? `Bei ${n} ${n === 1 ? 'Übung' : 'Übungen'} weggelassen` : 'Noch nicht weggelassen'),
        el('div', { class: 'zeile' },
          el('button', {
            type: 'button', class: 'text-btn',
            onclick: async () => { await Store.update('sicherheitsverhalten', s.id, { aktiv: s.aktiv === false }); neuZeichnen(); },
          }, s.aktiv === false ? 'Wieder aufnehmen' : 'Abgebaut / ausblenden'),
          el('button', {
            type: 'button', class: 'text-btn',
            onclick: async () => { if (confirm('Löschen?')) { await Store.remove('sicherheitsverhalten', s.id); neuZeichnen(); } },
          }, 'Löschen')));
    })) : leer('Noch nichts eingetragen.'),
    erklaerung('Warum weglassen?', ERKLAERKARTEN.sicherheitsverhalten),
  );
}
