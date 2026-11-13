// Modul 1: Akut-Modus – Zulassen und Beobachten, nicht Wegmachen.
import { Store } from './store.js';
import { el, skala, chips } from './ui.js';
import { GEFUEHLSWOERTER, KOERPERSTELLEN, VERGLEICH, ATEM } from './inhalte.js';
import { ladeEinstellungen, akutSaetze } from './einstellungen.js';

const F = {
  koerper: 'Wo im Körper spürst du es?',
  staerke: 'Wie stark, 0–10?',
  gefuehl: 'Welches Wort passt zum Gefühl?',
  vergleich: 'Was macht es jetzt, im Vergleich zu vorhin?',
  staerkeJetzt: 'Wie stark jetzt, 0–10?',
  ende: 'Was ist passiert?',
};

const bereinige = (t) => t.trim().replace(/^dass\s+/i, '').replace(/[.!?…\s]+$/, '');

export async function renderAkut(main) {
  const cfg = await ladeEinstellungen();
  const saetze = akutSaetze(cfg);
  const z = {
    start: Date.now(), beobachtungen: [], gefuehlswort: null, gedanken: [],
    wertVorher: null, wertNachher: null, satz: 0,
  };
  let aufraeumen = null;

  const buehne = el('div', { class: 'akut-buehne', 'aria-live': 'polite' });
  const beenden = el('button', { type: 'button', class: 'text-btn', onclick: () => zeige('ende') }, 'Beenden');
  main.append(el('div', { class: 'akut-leiste' }, beenden), buehne);

  const notiere = (frage, antwort) => {
    if (antwort != null && String(antwort).trim() !== '') z.beobachtungen.push({ frage, antwort: String(antwort) });
  };
  const frage = (text) => el('h1', { class: 'akut-frage', tabindex: '-1' }, text);
  const weiter = (onclick, label = 'Weiter') => el('button', { type: 'button', class: 'btn btn-primaer btn-breit', onclick }, label);
  const zurAuswahl = () => el('button', { type: 'button', class: 'text-btn', onclick: () => zeige('auswahl') }, 'Zurück');

  const schritte = {
    koerper() {
      const c = chips(KOERPERSTELLEN, { mehrfach: true, label: 'Körperstellen' });
      const t = el('input', { type: 'text', placeholder: 'oder eigene Worte', 'aria-label': 'Eigene Worte', autocomplete: 'off' });
      return [frage(F.koerper), c, t, weiter(() => {
        notiere(F.koerper, [...c.werte(), t.value.trim()].filter(Boolean).join(', '));
        zeige('staerke');
      })];
    },

    staerke() {
      return [frage(F.staerke),
        skala(0, 10, (v) => { z.wertVorher = v; notiere(F.staerke, v); zeige('gefuehl'); }, { label: 'Stärke 0 bis 10' }),
        el('button', { type: 'button', class: 'text-btn', onclick: () => zeige('gefuehl') }, 'Überspringen')];
    },

    gefuehl() {
      const c = chips(GEFUEHLSWOERTER, { label: 'Gefühlswörter' });
      const t = el('input', { type: 'text', placeholder: 'oder eigenes Wort', 'aria-label': 'Eigenes Wort', autocomplete: 'off' });
      return [frage(F.gefuehl), c, t, weiter(() => {
        const wort = t.value.trim() || c.werte()[0] || null;
        if (wort) { z.gefuehlswort = wort; notiere(F.gefuehl, wort); }
        zeige('auswahl');
      })];
    },

    auswahl() {
      const opt = (label, ziel) => el('button', { type: 'button', class: 'btn btn-breit', onclick: () => zeige(ziel) }, label);
      return [
        frage('Bleib beim Beobachten.'),
        el('p', { class: 'leise' }, 'Oder wähle:'),
        el('div', { class: 'stapel' },
          opt('Weiter beobachten', 'vergleich'),
          opt('Gedanken benennen', 'defusion'),
          opt('Sätze', 'saetze'),
          cfg.atemOption ? opt('Atmung', 'atem') : null,
          el('button', { type: 'button', class: 'btn btn-primaer btn-breit', onclick: () => zeige('ende') }, 'Abschließen'),
        ),
      ];
    },

    vergleich() {
      const c = chips(VERGLEICH, { label: 'Vergleich' });
      const t = el('input', { type: 'text', placeholder: 'oder eigene Worte', 'aria-label': 'Eigene Worte', autocomplete: 'off' });
      return [frage(F.vergleich), c, t, weiter(() => {
        notiere(F.vergleich, [...c.werte(), t.value.trim()].filter(Boolean).join(', '));
        zeige('staerkeJetzt');
      })];
    },

    staerkeJetzt() {
      return [frage(F.staerkeJetzt),
        skala(0, 10, (v) => { z.wertNachher = v; notiere(F.staerkeJetzt, v); zeige('auswahl'); }, { label: 'Stärke 0 bis 10' }),
        el('button', { type: 'button', class: 'text-btn', onclick: () => zeige('auswahl') }, 'Überspringen')];
    },

    defusion() {
      const t = el('input', { type: 'text', autocomplete: 'off', 'aria-labelledby': 'def-label', enterkeyhint: 'done' });
      const umformen = () => {
        const g = bereinige(t.value);
        if (!g) return;
        z.gedanken.push(g);
        zeige('defusionErgebnis', g);
      };
      t.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); umformen(); } });
      return [
        frage('Welcher Gedanke ist gerade da?'),
        el('p', { id: 'def-label', class: 'leise' }, 'Ich habe den Gedanken, dass …'),
        t,
        weiter(umformen, 'Umformulieren'),
        zurAuswahl(),
      ];
    },

    defusionErgebnis(g) {
      return [
        el('p', { class: 'akut-satz', tabindex: '-1' }, `Ich bemerke den Gedanken, dass ${g}.`),
        el('div', { class: 'stapel' },
          el('button', { type: 'button', class: 'btn btn-breit', onclick: () => zeige('defusion') }, 'Anderer Gedanke'),
          zurAuswahl(),
        ),
      ];
    },

    saetze() {
      if (!saetze.length) {
        return [el('p', { class: 'akut-satz' }, 'Keine Sätze hinterlegt.'),
          el('p', { class: 'leise' }, 'Eigene Sätze kannst du in den Einstellungen anlegen.'), zurAuswahl()];
      }
      const s = saetze[z.satz % saetze.length];
      return [
        el('p', { class: 'akut-satz', tabindex: '-1' }, s.text),
        el('div', { class: 'stapel' },
          saetze.length > 1
            ? el('button', { type: 'button', class: 'btn btn-breit', onclick: () => { z.satz++; zeige('saetze'); } }, 'Nächster Satz')
            : null,
          zurAuswahl(),
        ),
      ];
    },

    atem() {
      const phase = el('p', { class: 'atem-phase', 'aria-live': 'off' }, 'ein');
      const kreis = el('div', { class: 'atem-kreis', 'aria-hidden': 'true' });
      kreis.style.setProperty('--ein', ATEM.einSek + 's');
      kreis.style.setProperty('--zyklus', (ATEM.einSek + ATEM.ausSek) + 's');
      let ein = true;
      let timer;
      const takt = () => {
        phase.textContent = ein ? 'ein' : 'aus';
        timer = setTimeout(() => { ein = !ein; takt(); }, (ein ? ATEM.einSek : ATEM.ausSek) * 1000);
      };
      takt();
      aufraeumen = () => clearTimeout(timer);
      return [
        el('p', { class: 'leise atem-hinweis', tabindex: '-1' }, ATEM.hinweis),
        el('div', { class: 'atem-buehne' }, kreis, phase),
        zurAuswahl(),
      ];
    },

    ende() {
      beenden.hidden = true;
      const t = el('textarea', { rows: '4', 'aria-labelledby': 'ende-frage' });
      return [
        el('h1', { class: 'akut-frage', id: 'ende-frage', tabindex: '-1' }, F.ende),
        t,
        weiter(() => speichern(t.value.trim()), 'Speichern'),
        el('div', { class: 'stapel' },
          el('button', { type: 'button', class: 'text-btn', onclick: () => { beenden.hidden = false; zeige('auswahl'); } }, 'Noch nicht fertig'),
          el('button', { type: 'button', class: 'text-btn', onclick: () => { location.hash = '#/'; } }, 'Ohne Speichern schließen'),
        ),
      ];
    },

    fertig() {
      beenden.hidden = true;
      return [
        el('h1', { class: 'akut-frage', tabindex: '-1' }, 'Gespeichert.'),
        el('p', { class: 'leise' }, 'Im Mut-Buch steht: Akut-Moment durchgestanden.'),
        el('a', { href: '#/', class: 'btn btn-primaer btn-breit' }, 'Fertig'),
      ];
    },
  };

  async function speichern(notiz) {
    const datum = new Date().toISOString();
    const doc = await Store.add('akut', {
      beobachtungen: z.beobachtungen,
      gefuehlswort: z.gefuehlswort,
      gedanke: z.gedanken.length ? z.gedanken.join(' / ') : null,
      wertVorher: z.wertVorher,
      wertNachher: z.wertNachher,
      dauer: Math.round((Date.now() - z.start) / 1000),
      notiz: notiz || null,
      datum,
    });
    await Store.add('mutbuch', { datum, text: 'Akut-Moment durchgestanden', quelle: 'akut', refId: doc.id });
    zeige('fertig');
  }

  function zeige(name, arg) {
    if (aufraeumen) { aufraeumen(); aufraeumen = null; }
    buehne.replaceChildren(...schritte[name](arg).flat().filter(Boolean));
    const fokus = buehne.querySelector('[tabindex="-1"]');
    if (fokus) fokus.focus({ preventScroll: true });
  }

  zeige('koerper');
  return () => { if (aufraeumen) aufraeumen(); };
}
