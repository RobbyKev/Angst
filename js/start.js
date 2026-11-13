// Startscreen
import { Store } from './store.js';
import { el, icon, datumLang, skala } from './ui.js';
import { tagesschrittHeute, andererSchritt, waehleVariante, erledige, rueckgaengig } from './schritte.js';

const SPAETER = [
  ['Angstleiter', 2], ['Mut-Buch', 2], ['Wofür', 2],
  ['Sorgen', 3], ['Teufelskreis', 3],
  ['Körperübungen', 4], ['Verlauf', 4], ['Plan für Wellen', 4],
];

export async function renderStart(main) {
  const karte = el('section', { class: 'karte tagesschritt', 'aria-labelledby': 'ts-titel' });

  async function zeichneSchritt() {
    const { rec, schritt, poolGroesse } = await tagesschrittHeute();
    karte.replaceChildren();

    if (!rec) {
      karte.append(
        el('p', { class: 'eyebrow' }, 'Heute'),
        el('h2', { id: 'ts-titel' }, 'Noch keine Schritte'),
        el('p', { class: 'leise' }, 'Lege ein paar Schritte an. Dann steht hier jeden Tag einer.'),
        el('a', { href: '#/schritte/neu', class: 'btn btn-primaer btn-breit' }, 'Schritt anlegen'),
      );
      return;
    }

    if (rec.erledigt) {
      const titel = schritt?.titel || rec.titel;
      karte.append(
        el('p', { class: 'eyebrow' }, 'Heute · gemacht', rec.variante === 'mini' ? ' (Mini)' : ''),
        el('h2', { id: 'ts-titel' }, titel),
        el('p', {}, rec.text),
        el('p', { class: 'leise' }, 'Steht im Mut-Buch.'),
        el('button', { type: 'button', class: 'text-btn', onclick: async () => { await rueckgaengig(rec); zeichneSchritt(); } }, 'Rückgängig'),
      );
      return;
    }

    const variante = (art, label, text) => el('button', {
      type: 'button',
      class: 'variante',
      'aria-pressed': String(rec.variante === art),
      onclick: async () => { await waehleVariante(rec, art); zeichneSchritt(); },
    }, el('span', { class: 'variante-label' }, label), el('span', {}, text));

    karte.append(
      el('p', { class: 'eyebrow' }, 'Heute'),
      el('h2', { id: 'ts-titel' }, schritt.titel),
      el('div', { class: 'varianten' },
        variante('normal', 'Normal', schritt.normal),
        variante('mini', 'Mini', schritt.mini),
      ),
      el('button', {
        type: 'button', class: 'btn btn-primaer btn-breit',
        disabled: !rec.variante,
        onclick: async () => { await erledige(rec, schritt); zeichneSchritt(); },
      }, rec.variante ? 'Gemacht' : 'Version wählen'),
      poolGroesse > 1
        ? el('button', { type: 'button', class: 'text-btn', onclick: async () => { await andererSchritt(rec); zeichneSchritt(); } }, 'Anderer Schritt')
        : null,
    );
  }

  // Optionaler Angstwert – nur auf Tipp
  const angst = el('div', { class: 'angstwert' });
  function zeichneAngst(zustand = 'zu', wert = null) {
    angst.replaceChildren();
    if (zustand === 'zu') {
      angst.append(el('button', { type: 'button', class: 'text-btn', 'aria-expanded': 'false', onclick: () => zeichneAngst('offen') }, 'Angstwert notieren'));
    } else if (zustand === 'offen') {
      angst.append(
        el('p', { class: 'leise klein', id: 'aw-label' }, 'Wie stark gerade, 0–10?'),
        skala(0, 10, async (v) => {
          await Store.add('angstwerte', { wert: v, datum: new Date().toISOString() });
          zeichneAngst('notiert', v);
        }, { label: 'Angstwert 0 bis 10' }),
        el('button', { type: 'button', class: 'text-btn', onclick: () => zeichneAngst('zu') }, 'Abbrechen'),
      );
    } else {
      angst.append(el('p', { class: 'leise klein', role: 'status' }, `Notiert: ${wert}`));
      setTimeout(() => angst.isConnected && zeichneAngst('zu'), 2500);
    }
  }

  await zeichneSchritt();
  zeichneAngst();

  main.append(
    el('header', { class: 'start-kopf' },
      el('div', {},
        el('h1', { class: 'marke', tabindex: '-1' }, 'Durch'),
        el('p', { class: 'leise' }, datumLang()),
      ),
      el('a', { href: '#/einstellungen', class: 'icon-btn', 'aria-label': 'Einstellungen' }, icon('einstellungen')),
    ),
    karte,
    el('section', { class: 'karte karte-leise' },
      el('p', { class: 'eyebrow' }, 'Wochenwerkzeug'),
      el('p', { class: 'leise' }, 'Folgt in Phase 4.'),
    ),
    el('div', { class: 'akut-zeile' },
      el('a', { href: '#/akut', class: 'btn akut-zugang' }, 'Akut-Modus'),
      angst,
    ),
    el('nav', { class: 'navigation', 'aria-label': 'Bereiche' },
      el('ul', { class: 'nav-liste' },
        el('li', {}, el('a', { href: '#/schritte' }, 'Schritte-Pool')),
        SPAETER.map(([name, phase]) => el('li', {},
          el('span', { class: 'nav-spaeter', 'aria-disabled': 'true' }, name, el('span', { class: 'klein' }, `Phase ${phase}`)),
        )),
      ),
    ),
  );
}
