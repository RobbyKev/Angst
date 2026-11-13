// Modul 10: Wofür
import { Store } from './store.js';
import { el, kopf } from './ui.js';

export async function wofuerListe() {
  return Store.list('wofuer');
}

export async function wofuerText(id) {
  if (!id) return null;
  const w = await Store.get('wofuer', id);
  return w ? w.text : null;
}

export function wofuerAnzeige(text) {
  return text ? el('p', { class: 'wofuer-klein' }, 'Wofür: ', text) : null;
}

export async function wofuerAuswahl(name, gewaehlt) {
  const liste = await wofuerListe();
  return el('select', { name },
    el('option', { value: '' }, '–'),
    liste.map((w) => el('option', { value: w.id, selected: w.id === gewaehlt }, w.text)));
}

export async function renderWofuer(main) {
  const bereich = (typ, frage) => {
    const box = el('div', { class: 'wofuer-liste' });
    const zeichne = async () => {
      const liste = (await Store.list('wofuer')).filter((w) => w.typ === typ);
      box.replaceChildren(...liste.map((w) => {
        const ta = el('textarea', { rows: '2', 'aria-label': 'Eintrag bearbeiten' }, w.text);
        ta.addEventListener('change', async () => { const t = ta.value.trim(); if (t) await Store.update('wofuer', w.id, { text: t }); });
        return el('div', { class: 'satz-zeile' }, ta,
          el('div', { class: 'zeile' }, el('span'), el('button', {
            type: 'button', class: 'text-btn',
            onclick: async () => { if (confirm('Eintrag löschen?')) { await Store.remove('wofuer', w.id); zeichne(); } },
          }, 'Löschen')));
      }));
    };
    const neu = el('textarea', { rows: '2', 'aria-label': frage, placeholder: 'Neuer Eintrag' });
    zeichne();
    return el('section', { class: 'abschnitt' },
      el('h2', {}, frage),
      box,
      neu,
      el('button', {
        type: 'button', class: 'btn',
        onclick: async () => {
          const t = neu.value.trim();
          if (!t) return;
          await Store.add('wofuer', { text: t, typ, erstellt: new Date().toISOString() });
          neu.value = '';
          zeichne();
        },
      }, 'Hinzufügen'));
  };

  main.append(
    kopf('Wofür'),
    bereich('verbaut', 'Was verbaut mir die Angst gerade?'),
    bereich('wichtig', 'Was ist mir wichtig, was will ich (wieder) können?'),
  );
}
