// Modul 9: Mut-Buch – nüchterne Liste mit Datum.
import { Store } from './store.js';
import { el, kopf, leer, datumKurz } from './ui.js';

const QUELLE = { tagesschritt: 'Tagesschritt', uebung: 'Übung', akut: 'Akut', sicherheitsverhalten: 'Sicherheitsverhalten', frei: 'Eigener Eintrag' };

export async function renderMutbuch(main) {
  const liste = el('div');
  const zeichne = async () => {
    const eintraege = (await Store.list('mutbuch')).sort((a, b) => (a.datum < b.datum ? 1 : -1));
    if (!eintraege.length) { liste.replaceChildren(leer('Noch keine Einträge. Erledigte Tagesschritte, Übungen und Akut-Momente landen automatisch hier.')); return; }
    liste.replaceChildren(el('ul', { class: 'mutbuch' }, eintraege.map((m) => el('li', {},
      el('span', { class: 'mut-datum leise klein' }, datumKurz(m.datum), ' · ', QUELLE[m.quelle] || ''),
      el('span', {}, m.text),
      m.quelle === 'frei' ? el('button', {
        type: 'button', class: 'text-btn klein',
        onclick: async () => { if (confirm('Eintrag löschen?')) { await Store.remove('mutbuch', m.id); zeichne(); } },
      }, 'Löschen') : null))));
  };
  const text = el('textarea', { rows: '2', 'aria-labelledby': 'mut-frei' });
  main.append(
    kopf('Mut-Buch'),
    el('section', { class: 'karte' },
      el('p', { class: 'feld-label', id: 'mut-frei' }, 'Heute habe ich trotzdem …'),
      text,
      el('button', {
        type: 'button', class: 'btn btn-breit',
        onclick: async () => {
          const t = text.value.trim();
          if (!t) return;
          await Store.add('mutbuch', { datum: new Date().toISOString(), text: `Heute habe ich trotzdem ${t}`, quelle: 'frei', refId: null });
          text.value = '';
          zeichne();
        },
      }, 'Eintragen')),
    liste,
  );
  await zeichne();
}
