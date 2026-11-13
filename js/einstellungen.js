import { Store } from './store.js';
import { el, kopf, entwurf, feld, neuZeichnen } from './ui.js';
import { exportiere, importiere, kalenderTermin } from './daten.js';
import { pinErstellen, pinMoeglich } from './pin.js';
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
      el('h2', {}, 'Übungen'),
      schalter('abfrageAktiv', 'Während Übungen nach dem Angstwert fragen'),
      feld('Abstand der Abfrage (Minuten)', zahl('abfrageIntervall', 1, 60)),
    ),
    el('section', { class: 'abschnitt' },
      el('h2', {}, 'Sorgenzeit'),
      feld('Uhrzeit', zeit('sorgenzeit')),
      feld('Dauer (Minuten)', zahl('sorgenzeitDauer', 5, 90)),
    ),
    el('section', { class: 'abschnitt' },
      el('h2', {}, 'Verlauf'),
      schalter('gad7Aktiv', 'Monats-Check (GAD-7) anbieten'),
      schalter('profiHinweisAktiv', 'Hinweis auf professionelle Unterstützung bei dauerhaft hohen GAD-7-Werten'),
    ),
    el('section', { class: 'abschnitt' },
      el('h2', {}, 'Erinnerungen'),
      el('p', { class: 'leise' }, 'Als täglicher Termin für deinen Kalender. Push-Mitteilungen bietet die App nicht an: Dafür bräuchte sie einen eigenen Server.'),
      el('button', {
        type: 'button', class: 'btn btn-breit',
        onclick: async () => {
          const c = await ladeEinstellungen();
          kalenderTermin({ titel: 'Sorgenzeit', uhrzeit: c.sorgenzeit, dauerMin: c.sorgenzeitDauer, beschreibung: 'Geparkte Sorgen in Durch durchgehen.', dateiname: 'sorgenzeit.ics' });
        },
      }, 'Sorgenzeit in den Kalender'),
      feld('Uhrzeit für den Tagesschritt', zeit('tagesschrittZeit')),
      el('button', {
        type: 'button', class: 'btn btn-breit',
        onclick: async () => {
          const c = await ladeEinstellungen();
          kalenderTermin({ titel: 'Tagesschritt', uhrzeit: c.tagesschrittZeit, dauerMin: 15, beschreibung: 'Tagesschritt in Durch (normal oder Mini).', dateiname: 'tagesschritt.ics' });
        },
      }, 'Tagesschritt in den Kalender'),
    ),
    el('section', { class: 'abschnitt' },
      el('h2', {}, 'App-Sperre (PIN)'),
      el('p', { class: 'leise' }, 'Sichtschutz beim Öffnen, damit nicht jeder sofort hineinschaut. Das ist keine Verschlüsselung: Die Daten selbst sind nicht geschützt.'),
      pinBereich(),
    ),
    el('section', { class: 'abschnitt' },
      el('h2', {}, 'Daten'),
      el('p', { class: 'leise' }, 'Alle Einträge liegen nur in diesem Browser auf diesem Gerät. Mit dem Export kannst du sie sichern oder auf ein anderes Gerät übertragen.'),
      el('button', { type: 'button', class: 'btn btn-breit', onclick: exportiere }, 'Alle Daten exportieren (JSON)'),
      el('label', { class: 'btn btn-breit datei-btn' }, 'Daten importieren',
        el('input', {
          type: 'file', accept: 'application/json,.json', class: 'unsichtbar',
          onchange: async (e) => {
            const datei = e.target.files[0];
            if (!datei) return;
            if (!confirm('Import ersetzt alle Daten auf diesem Gerät. Fortfahren?')) { e.target.value = ''; return; }
            try { await importiere(datei); location.reload(); } catch (err) { alert(err.message || 'Import fehlgeschlagen.'); }
          },
        })),
      el('a', { class: 'text-btn', href: '#/sicherheitsverhalten' }, 'Sicherheitsverhalten verwalten'),
    ),
  );

  function schalter(key, label) {
    return el('label', { class: 'schalter' },
      el('input', { type: 'checkbox', checked: cfg[key], onchange: (e) => speichereEinstellungen({ [key]: e.target.checked }) }),
      el('span', {}, label));
  }
  function zahl(key, min, max) {
    return el('input', {
      type: 'number', inputmode: 'numeric', min: String(min), max: String(max), value: String(cfg[key]), class: 'zahl',
      onchange: (e) => { const v = Math.min(max, Math.max(min, Number(e.target.value) || cfg[key])); e.target.value = v; speichereEinstellungen({ [key]: v }); },
    });
  }
  function zeit(key) {
    return el('input', { type: 'time', value: cfg[key], class: 'zahl', onchange: (e) => { if (e.target.value) speichereEinstellungen({ [key]: e.target.value }); } });
  }
  function pinBereich() {
    if (!pinMoeglich()) return el('p', { class: 'leise' }, 'In diesem Browser nicht verfügbar (nur über https).');
    if (cfg.pin) {
      return el('button', {
        type: 'button', class: 'btn btn-breit',
        onclick: async () => { if (confirm('PIN entfernen?')) { await speichereEinstellungen({ pin: null }); neuZeichnen(); } },
      }, 'PIN entfernen');
    }
    const a = el('input', { type: 'password', inputmode: 'numeric', autocomplete: 'new-password', maxlength: '8', class: 'zahl', 'aria-label': 'Neue PIN' });
    const b = el('input', { type: 'password', inputmode: 'numeric', autocomplete: 'new-password', maxlength: '8', class: 'zahl', 'aria-label': 'PIN wiederholen' });
    const meldung = el('p', { class: 'hinweis', role: 'status' });
    return el('div', {},
      feld('Neue PIN (4–8 Ziffern)', a), feld('PIN wiederholen', b), meldung,
      el('button', {
        type: 'button', class: 'btn btn-breit',
        onclick: async () => {
          if (!/^\d{4,8}$/.test(a.value)) { meldung.textContent = 'Die PIN muss aus 4 bis 8 Ziffern bestehen.'; return; }
          if (a.value !== b.value) { meldung.textContent = 'Die beiden Eingaben stimmen nicht überein.'; return; }
          await speichereEinstellungen({ pin: await pinErstellen(a.value) });
          neuZeichnen();
        },
      }, 'PIN festlegen'),
      el('p', { class: 'leise klein' }, 'Wer die PIN vergisst, kann sie nur entfernen, indem alle Daten gelöscht werden. Vorher exportieren.'));
  }
}
