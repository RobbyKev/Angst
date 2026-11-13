// Startscreen
import { Store } from './store.js';
import { el, icon, datumLang, skala } from './ui.js';
import { tagesschrittHeute, andererSchritt, waehleVariante, erledige, rueckgaengig } from './schritte.js';
import { MODUL_LINKS } from './inhalte.js';
import { wofuerText, wofuerAnzeige } from './wofuer.js';
import { aktuellesWochenwerkzeug, werkzeugInfo } from './werkzeug.js';
import { rueckschlagHinweisFaellig, rueckschlagKarte } from './verlauf.js';
import { laufendeUebung } from './uebung.js';

const NAVIGATION = [
  ['#/leiter', 'Angstleiter'],
  ['#/sorgen', 'Sorgen'],
  ['#/kreis', 'Teufelskreis'],
  ['#/koerper', 'Körperübungen'],
  ['#/verlauf', 'Verlauf'],
  ['#/mutbuch', 'Mut-Buch'],
  ['#/wofuer', 'Wofür'],
  ['#/wellen', 'Plan für Wellen'],
  ['#/schritte', 'Schritte-Pool'],
];
const modulName = (link) => MODUL_LINKS.find(([l]) => l === link)?.[1];

export async function renderStart(main) {
  const karte = el('section', { class: 'karte tagesschritt', 'aria-labelledby': 'ts-titel' });

  async function zeichneSchritt() {
    const { rec, schritt, poolGroesse } = await tagesschrittHeute();
    karte.replaceChildren();
    karte.append = (...k) => Element.prototype.append.apply(karte, k.flat(Infinity).filter((x) => x != null && x !== false));

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

    const wofuer = wofuerAnzeige(await wofuerText(schritt.wofuerId));
    const modul = schritt.modulLink ? el('a', { class: 'text-btn', href: schritt.modulLink }, `Zu: ${modulName(schritt.modulLink) || 'Modul'}`) : null;

    const variante = (art, label, text) => el('button', {
      type: 'button',
      class: 'variante',
      'aria-pressed': String(rec.variante === art),
      onclick: async () => { await waehleVariante(rec, art); zeichneSchritt(); },
    }, el('span', { class: 'variante-label' }, label), el('span', {}, text));

    karte.append(
      el('p', { class: 'eyebrow' }, 'Heute'),
      el('h2', { id: 'ts-titel' }, schritt.titel),
      wofuer,
      el('div', { class: 'varianten' },
        variante('normal', 'Normal', schritt.normal),
        variante('mini', 'Mini', schritt.mini),
      ),
      el('button', {
        type: 'button', class: 'btn btn-primaer btn-breit',
        disabled: !rec.variante,
        onclick: async () => { await erledige(rec, schritt); zeichneSchritt(); },
      }, rec.variante ? 'Gemacht' : 'Version wählen'),
      modul,
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

  const ww = await aktuellesWochenwerkzeug();
  const wwInfo = ww ? werkzeugInfo(ww.werkzeug) : null;
  const werkzeugKarte = el('section', { class: 'karte karte-leise' },
    el('p', { class: 'eyebrow' }, 'Wochenwerkzeug'),
    wwInfo
      ? [el('h2', {}, wwInfo.name),
        el('div', { class: 'zeile' },
          el('a', { class: 'btn', href: wwInfo.link }, 'Öffnen'),
          el('a', { class: 'text-btn', href: '#/werkzeug' }, ww.dieseWoche ? 'Erklärung · wechseln' : 'Neue Woche: behalten oder wechseln'))]
      : [el('p', { class: 'leise' }, 'Noch keins gewählt.'), el('a', { class: 'btn', href: '#/werkzeug' }, 'Werkzeug wählen')]);

  const hinweisBox = el('div');
  if (await rueckschlagHinweisFaellig()) hinweisBox.append(rueckschlagKarte(() => hinweisBox.replaceChildren()));
  const lauf = await laufendeUebung();

  main.append(
    el('header', { class: 'start-kopf' },
      el('div', {},
        el('h1', { class: 'marke', tabindex: '-1' }, 'Durch'),
        el('p', { class: 'leise' }, datumLang()),
      ),
      el('a', { href: '#/einstellungen', class: 'icon-btn', 'aria-label': 'Einstellungen' }, icon('einstellungen')),
    ),
    lauf ? el('a', { class: 'btn btn-breit', href: lauf.route }, 'Laufende Übung fortsetzen') : null,
    karte,
    werkzeugKarte,
    hinweisBox,
    el('div', { class: 'akut-zeile' },
      el('a', { href: '#/akut', class: 'btn akut-zugang' }, 'Akut-Modus'),
      angst,
    ),
    el('nav', { class: 'navigation', 'aria-label': 'Bereiche' },
      el('ul', { class: 'nav-liste' },
        NAVIGATION.map(([href, name]) => el('li', {}, el('a', { href }, name))),
      ),
    ),
  );
}
