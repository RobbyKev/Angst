// Modul 4: Körperübungen (interozeptiv). Keine Übungen im Code vorgegeben.
import { Store } from './store.js';
import { el, kopf, feld, leer, erklaerung, datumKurz, eingetretenText, entwurf } from './ui.js';
import { ERKLAERKARTEN, KOERPER_HINWEIS } from './inhalte.js';
import { laufendeUebung } from './uebung.js';

export async function renderKoerper(main) {
  const liste = await Store.list('koerperUebungen');
  const uebungen = (await Store.list('uebungen')).filter((u) => u.typ === 'koerper').sort((a, b) => (a.start < b.start ? 1 : -1));
  const lauf = await laufendeUebung();
  main.append(
    kopf('Körperübungen'),
    lauf ? el('a', { class: 'btn btn-breit', href: lauf.route }, 'Laufende Übung fortsetzen') : null,
    el('p', { class: 'leise' }, 'Du trägst die Übungen selbst ein. Die App gibt den Rahmen: Erwartung vorher, Timer, Abgleich hinterher.'),
    el('a', { class: 'btn btn-primaer btn-breit', href: '#/koerper/neu' }, 'Neue Körperübung'),
    liste.length ? el('ul', { class: 'liste' }, liste.map((k) => el('li', { class: 'liste-eintrag' },
      el('strong', {}, k.titel),
      k.beschreibung ? el('span', { class: 'leise' }, k.beschreibung) : null,
      el('span', { class: 'leise klein' }, `Dauer: ${Math.round((k.dauerSek || 60) / 60 * 10) / 10} Min`),
      el('div', { class: 'zeile' },
        el('a', { class: 'btn btn-primaer', href: `#/uebung/koerper/${k.id}` }, 'Starten'),
        el('a', { class: 'text-btn', href: `#/koerper/${k.id}` }, 'Bearbeiten'))))) : leer('Noch keine Körperübungen eingetragen.'),
    el('details', { class: 'erklaerkarte' }, el('summary', {}, 'Ärztlich abklären ', entwurf()), el('p', {}, KOERPER_HINWEIS)),
    erklaerung('Was sind Körperübungen?', ERKLAERKARTEN.koerperuebung),
    uebungen.length ? el('section', { class: 'abschnitt' }, el('h2', {}, 'Bisherige Durchgänge'),
      el('ul', { class: 'liste' }, uebungen.map((u) => {
        const k = liste.find((x) => x.id === u.koerperId);
        return el('li', { class: 'liste-eintrag' },
          el('strong', {}, datumKurz(u.start), ' · ', k ? k.titel : 'gelöschte Übung'),
          el('span', {}, 'Befürchtung: ', u.befuerchtung, ' – ', eingetretenText(u.eingetreten || 'offen')),
          u.gelernt ? el('span', { class: 'leise' }, 'Gelernt: ', u.gelernt) : null);
      }))) : null,
  );
}

export async function renderKoerperForm(main, id) {
  const neu = id === 'neu';
  const k = neu ? { titel: '', beschreibung: '', dauerSek: 60 } : await Store.get('koerperUebungen', id);
  if (!k) { location.hash = '#/koerper'; return; }
  const titel = el('input', { type: 'text', value: k.titel, required: true, autocomplete: 'off' });
  const beschreibung = el('textarea', { rows: '3' }, k.beschreibung || '');
  const dauer = el('input', { type: 'number', inputmode: 'numeric', min: '10', max: '3600', step: '5', value: String(k.dauerSek || 60), class: 'zahl' });
  const form = el('form', { class: 'formular' },
    feld('Name der Übung', titel),
    feld('Beschreibung (optional)', beschreibung, 'Was genau machst du?'),
    feld('Dauer in Sekunden', dauer),
    el('button', { type: 'submit', class: 'btn btn-primaer btn-breit' }, 'Speichern'),
    neu ? null : el('button', {
      type: 'button', class: 'text-btn',
      onclick: async () => { if (confirm('Übung löschen?')) { await Store.remove('koerperUebungen', id); location.hash = '#/koerper'; } },
    }, 'Löschen'),
  );
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const daten = { titel: titel.value.trim(), beschreibung: beschreibung.value.trim(), dauerSek: Math.max(10, Number(dauer.value) || 60) };
    if (!daten.titel) return;
    if (neu) await Store.add('koerperUebungen', { ...daten, erstellt: new Date().toISOString() });
    else await Store.update('koerperUebungen', id, daten);
    location.hash = '#/koerper';
  });
  main.append(kopf(neu ? 'Neue Körperübung' : 'Körperübung bearbeiten', '#/koerper'), form);
}
