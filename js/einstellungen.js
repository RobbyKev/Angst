import { Store } from './store.js';
import { el, kopf, entwurf } from './ui.js';
import { EINSTELLUNGEN_STANDARD, STANDARD_AKUT_SAETZE } from './inhalte.js';

export function ladeEinstellungen() {
  return Store.getDoc('einstellungen', EINSTELLUNGEN_STANDARD);
}

export function speichereEinstellungen(aenderung) {
  return Store.setDoc('einstellungen', aenderung);
}

export function wendeThemeAn(theme) {
  document.documentElement.dataset.theme = theme || 'hell';
}

export function akutSaetze(cfg) {
  if (Array.isArray(cfg.eigeneAkutSaetze)) return cfg.eigeneAkutSaetze;
  return STANDARD_AKUT_SAETZE.map((text, i) => ({ id: 'std' + i, text, entwurf: true }));
}

export async function renderEinstellungen(main) {
  const cfg = await ladeEinstellungen();

  // Darstellung
  const themes = [['hell', 'Hell'], ['dunkel', 'Dunkel'], ['system', 'Wie das Gerät']];
  const themeBox = el('fieldset', { class: 'feld' },
    el('legend', {}, 'Darstellung'),
    themes.map(([wert, name]) => el('label', { class: 'radio' },
      el('input', {
        type: 'radio', name: 'theme', value: wert, checked: cfg.theme === wert,
        onchange: async () => { await speichereEinstellungen({ theme: wert }); wendeThemeAn(wert); },
      }),
      name,
    )),
  );

  // Atemführung
  const atem = el('label', { class: 'schalter' },
    el('input', {
      type: 'checkbox', checked: cfg.atemOption,
      onchange: (e) => speichereEinstellungen({ atemOption: e.target.checked }),
    }),
    el('span', {}, 'Atemführung im Akut-Modus als Option anbieten'),
  );

  // Eigene Sätze
  const satzListe = el('div', { class: 'satz-liste' });
  let saetze = akutSaetze(cfg).map((s) => ({ ...s }));

  const sichern = () => speichereEinstellungen({ eigeneAkutSaetze: saetze });

  function zeichne() {
    satzListe.replaceChildren(
      ...saetze.map((s) => {
        const ta = el('textarea', { rows: '2', 'aria-label': 'Satz bearbeiten' }, s.text);
        ta.addEventListener('change', () => {
          const t = ta.value.trim();
          if (!t) return;
          s.text = t;
          s.entwurf = false;
          sichern();
          zeichne();
        });
        return el('div', { class: 'satz-zeile' },
          ta,
          el('div', { class: 'zeile' },
            s.entwurf ? entwurf() : null,
            el('button', {
              type: 'button', class: 'text-btn',
              onclick: () => { saetze = saetze.filter((x) => x !== s); sichern(); zeichne(); },
            }, 'Entfernen'),
          ),
        );
      }),
    );
    if (!saetze.length) satzListe.append(el('p', { class: 'leise' }, 'Keine Sätze hinterlegt.'));
  }
  zeichne();

  const neuText = el('textarea', { rows: '2', placeholder: 'Neuer Satz', 'aria-label': 'Neuer Satz' });
  const neu = el('div', { class: 'satz-neu' },
    neuText,
    el('button', {
      type: 'button', class: 'btn',
      onclick: () => {
        const t = neuText.value.trim();
        if (!t) return;
        saetze.push({ id: 'e' + Date.now().toString(36), text: t, entwurf: false });
        neuText.value = '';
        sichern();
        zeichne();
      },
    }, 'Satz hinzufügen'),
    el('button', {
      type: 'button', class: 'text-btn',
      onclick: async () => {
        if (!confirm('Eigene Sätze verwerfen und Standardsätze wiederherstellen?')) return;
        await speichereEinstellungen({ eigeneAkutSaetze: null });
        saetze = akutSaetze({ eigeneAkutSaetze: null });
        zeichne();
      },
    }, 'Standardsätze wiederherstellen'),
  );

  main.append(
    kopf('Einstellungen'),
    el('section', { class: 'abschnitt' }, themeBox),
    el('section', { class: 'abschnitt' },
      el('h2', {}, 'Akut-Modus'),
      atem,
      el('h3', {}, 'Sätze zum Durchklicken'),
      el('p', { class: 'leise' }, 'Sachlich, ohne Entwarnung. Mit „Entwurf“ markierte Sätze sind Vorschläge und noch nicht freigegeben.'),
      satzListe,
      neu,
    ),
    el('section', { class: 'abschnitt' },
      el('h2', {}, 'Daten'),
      el('p', { class: 'leise' }, 'Alle Einträge liegen im Moment nur in diesem Browser auf diesem Gerät. Sync zwischen Geräten und Export folgen später.'),
    ),
  );
}
