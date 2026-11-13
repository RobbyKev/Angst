// Modul 3: Sorgen – Parkplatz, Sorgenzeit mit vier Wegen, Befürchtungs-Check.
import { Store } from './store.js';
import { el, kopf, leer, regler, chips, knopfwahl, datumKurz, plusTage, heute, erklaerung, feld, EINGETRETEN, eingetretenText, neuZeichnen } from './ui.js';
import { WIDERLEGEN_KARTE, ERKLAERKARTEN } from './inhalte.js';
import { ladeEinstellungen } from './einstellungen.js';

const bereinige = (t) => t.trim().replace(/^dass\s+/i, '').replace(/[.!?…\s]+$/, '');

export async function renderSorgen(main) {
  const cfg = await ladeEinstellungen();
  const sorgen = await Store.list('sorgen');
  const geparkt = sorgen.filter((s) => s.status === 'geparkt');
  const bearbeitet = sorgen.filter((s) => s.status !== 'geparkt').sort((a, b) => (a.datum < b.datum ? 1 : -1)).slice(0, 15);
  const namen = (await Store.list('gedankenNamen')).sort((a, b) => b.anzahl - a.anzahl);

  const eingabe = el('input', { type: 'text', placeholder: 'Sorge kurz notieren', 'aria-label': 'Sorge notieren', autocomplete: 'off', enterkeyhint: 'done' });
  const meldung = el('p', { class: 'leise klein', role: 'status' });
  const parken = async () => {
    const t = eingabe.value.trim();
    if (!t) return;
    await Store.add('sorgen', { text: t, status: 'geparkt', datum: new Date().toISOString() });
    eingabe.value = '';
    meldung.textContent = 'Geparkt bis zur Sorgenzeit.';
    zaehler.textContent = String(Number(zaehler.textContent) + 1);
  };
  eingabe.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); parken(); } });
  const zaehler = el('span', {}, String(geparkt.length));

  const statusText = { schritt: 'nächster Schritt', abgelegt: 'abgelegt', zuEndeGedacht: 'zu Ende gedacht', benannt: 'benannt' };

  main.append(
    kopf('Sorgen'),
    el('section', { class: 'karte' },
      el('p', { class: 'eyebrow' }, 'Sorgen-Parkplatz'),
      eingabe,
      el('button', { type: 'button', class: 'btn btn-breit', onclick: parken }, 'Parken'),
      meldung),
    el('section', { class: 'karte' },
      el('p', { class: 'eyebrow' }, 'Sorgenzeit'),
      el('p', {}, 'Geparkt: ', zaehler, ` · täglich um ${cfg.sorgenzeit} Uhr, ${cfg.sorgenzeitDauer} Minuten`),
      el('a', { class: 'btn btn-primaer btn-breit', href: '#/sorgenzeit' }, 'Sorgenzeit starten'),
      el('p', { class: 'leise klein' }, 'Uhrzeit und Dauer kannst du in den Einstellungen ändern.')),
    el('a', { class: 'btn btn-breit', href: '#/befuerchtungen' }, 'Befürchtungs-Check'),
    geparkt.length ? el('details', { class: 'erklaerkarte' }, el('summary', {}, 'Geparkte Sorgen'),
      el('ul', { class: 'einfach' }, geparkt.map((s) => el('li', {}, s.text)))) : null,
    namen.length ? el('section', { class: 'abschnitt' }, el('h2', {}, 'Deine Gedanken-Namen'),
      el('ul', { class: 'einfach' }, namen.map((n) => el('li', {}, n.name, el('span', { class: 'leise klein' }, ` · ${n.anzahl}-mal`))))) : null,
    bearbeitet.length ? el('details', { class: 'erklaerkarte' }, el('summary', {}, 'Zuletzt bearbeitet'),
      el('ul', { class: 'liste' }, bearbeitet.map((s) => el('li', { class: 'liste-eintrag' },
        el('span', { class: 'leise klein' }, datumKurz(s.datum), ' · ', statusText[s.status] || s.status),
        el('span', {}, s.text),
        s.naechsterSchritt ? el('span', { class: 'leise' }, 'Schritt: ', s.naechsterSchritt) : null,
        s.gedankenName ? el('span', { class: 'leise' }, 'Name: ', s.gedankenName) : null,
        s.wertDanach != null ? el('span', { class: 'leise' }, `Stärke danach: ${s.wertDanach}`) : null)))) : null,
    erklaerung('Warum Widerlegen nicht funktioniert', WIDERLEGEN_KARTE),
    erklaerung('Sorgenzeit', ERKLAERKARTEN.sorgenzeit),
    erklaerung('Zu-Ende-Denken', ERKLAERKARTEN.zuEndeDenken),
    erklaerung('Benennen', ERKLAERKARTEN.benennen),
  );
}

// ---------- Sorgenzeit ----------

export async function renderSorgenzeit(main) {
  const cfg = await ladeEinstellungen();
  const start = Date.now();
  const dauerMs = (cfg.sorgenzeitDauer || 20) * 60000;
  const warteschlange = (await Store.list('sorgen')).filter((s) => s.status === 'geparkt').sort((a, b) => (a.datum < b.datum ? -1 : 1));
  let index = 0;
  let aufraeumen = null;

  const restAnzeige = el('span', { class: 'leise klein' });
  const takt = () => {
    const rest = dauerMs - (Date.now() - start);
    restAnzeige.textContent = rest > 0 ? `noch ${Math.ceil(rest / 60000)} Min` : 'Die Sorgenzeit ist um.';
  };
  takt();
  const iv = setInterval(takt, 15000);

  const buehne = el('div', { class: 'uebung-buehne' });
  main.append(el('div', { class: 'akut-leiste zwischen' }, restAnzeige, el('a', { class: 'text-btn', href: '#/sorgen' }, 'Beenden')), buehne);
  const titel = (t) => el('h1', { class: 'akut-frage', tabindex: '-1' }, t);
  const btn = (label, onclick, primaer) => el('button', { type: 'button', class: 'btn btn-breit' + (primaer ? ' btn-primaer' : ''), onclick }, label);

  const zeige = (...inhalt) => {
    if (aufraeumen) { aufraeumen(); aufraeumen = null; }
    buehne.replaceChildren(...inhalt.flat(Infinity).filter(Boolean));
    window.scrollTo(0, 0);
    const f = buehne.querySelector('[tabindex="-1"]');
    if (f) f.focus({ preventScroll: true });
  };
  const weiter = () => { index++; zeigeSorge(); };
  const sorge = () => warteschlange[index];
  const sichere = async (aenderung) => { await Store.update('sorgen', sorge().id, { ...aenderung, datum: new Date().toISOString() }); weiter(); };

  function zeigeSorge() {
    if (!warteschlange.length) {
      return zeige(titel('Keine geparkten Sorgen.'), el('p', { class: 'leise' }, 'Du kannst die Sorgenzeit auch für eine Sorge nutzen, die gerade da ist.'),
        neueSorgeFeld(), el('a', { class: 'text-btn', href: '#/sorgen' }, 'Zurück'));
    }
    if (index >= warteschlange.length) {
      return zeige(titel('Alle geparkten Sorgen sind durchgegangen.'), el('a', { class: 'btn btn-primaer btn-breit', href: '#/sorgen' }, 'Fertig'));
    }
    const s = sorge();
    zeige(
      el('p', { class: 'eyebrow' }, `Sorge ${index + 1} von ${warteschlange.length}`),
      el('p', { class: 'akut-satz', tabindex: '-1' }, s.text),
      el('p', { class: 'leise' }, 'Welcher Weg passt?'),
      el('div', { class: 'stapel' },
        btn('Lösbar: nächster Schritt', wegSchritt),
        btn('Nicht lösbar: bewusst ablegen', wegAblegen),
        btn('Zu Ende denken', wegZuEnde),
        btn('Benennen', wegBenennen),
        el('button', { type: 'button', class: 'text-btn', onclick: weiter }, 'Geparkt lassen')),
    );
  }

  function neueSorgeFeld() {
    const t = el('input', { type: 'text', 'aria-label': 'Sorge', placeholder: 'Sorge notieren', autocomplete: 'off' });
    return [t, btn('Durchgehen', async () => {
      const text = t.value.trim();
      if (!text) return;
      const d = await Store.add('sorgen', { text, status: 'geparkt', datum: new Date().toISOString() });
      warteschlange.push(d);
      zeigeSorge();
    }, true)];
  }

  function wegSchritt() {
    const t = el('input', { type: 'text', 'aria-labelledby': 'ws', autocomplete: 'off' });
    zeige(el('p', { class: 'leise' }, sorge().text), el('h1', { class: 'akut-frage', id: 'ws', tabindex: '-1' }, 'Was ist der nächste konkrete Schritt?'), t,
      btn('Speichern', () => { const v = t.value.trim(); if (v) sichere({ status: 'schritt', naechsterSchritt: v }); }, true),
      el('button', { type: 'button', class: 'text-btn', onclick: zeigeSorge }, 'Zurück'));
  }

  function wegAblegen() {
    zeige(el('p', { class: 'akut-satz', tabindex: '-1' }, sorge().text),
      el('p', {}, 'Diese Sorge ist im Moment nicht lösbar. Du legst sie bewusst ab.'),
      btn('Ablegen', () => sichere({ status: 'abgelegt' }), true),
      el('button', { type: 'button', class: 'text-btn', onclick: zeigeSorge }, 'Zurück'));
  }

  function wegZuEnde() {
    const felder = [el('textarea', { rows: '3', 'aria-label': 'Was befürchtest du?' }, sorge().text)];
    const box = el('div', { class: 'zu-ende' }, felder[0]);
    const undDann = () => {
      const t = el('textarea', { rows: '3', 'aria-label': 'Und dann?' });
      felder.push(t);
      box.append(el('p', { class: 'feld-label' }, 'Und dann?'), t);
      t.focus();
    };
    zeige(titel('Zu Ende denken'),
      el('p', { class: 'leise' }, 'Schreib die Befürchtung bis zum schlimmsten Punkt durch. Nicht abschwächen, nicht widerlegen.'),
      box,
      btn('Und dann?', undDann),
      btn('Am schlimmsten Punkt angekommen', () => {
        const text = felder.map((f) => f.value.trim()).filter(Boolean).join('\n→ ');
        const r = regler(0, 100, 5, 50, 'Stärke jetzt');
        zeige(titel('Wie stark ist sie jetzt? (0–100)'), r,
          btn('Speichern', () => sichere({ status: 'zuEndeGedacht', zuEndeText: text, wertDanach: r.wert() }), true));
      }, true),
      el('button', { type: 'button', class: 'text-btn', onclick: zeigeSorge }, 'Zurück'));
  }

  async function wegBenennen() {
    const vorhandene = await Store.list('gedankenNamen');
    const t = el('input', { type: 'text', value: bereinige(sorge().text), 'aria-labelledby': 'bn', autocomplete: 'off' });
    const vorschau = el('p', { class: 'akut-satz' });
    const aktualisiere = () => { const g = bereinige(t.value); vorschau.textContent = g ? `Ich bemerke den Gedanken, dass ${g}.` : ''; };
    t.addEventListener('input', aktualisiere);
    aktualisiere();
    const nameChips = vorhandene.length ? chips(vorhandene.map((n) => n.name), { label: 'Bekannte Namen' }) : null;
    const neuerName = el('input', { type: 'text', placeholder: 'z. B. die Was-wäre-wenn-Schleife', 'aria-label': 'Neuer Name', autocomplete: 'off' });
    zeige(titel('Benennen'),
      el('p', { class: 'leise', id: 'bn' }, 'Ich bemerke den Gedanken, dass …'), t,
      vorschau,
      el('p', { class: 'feld-label' }, 'Kennst du diesen Gedanken? (optional)'),
      nameChips, neuerName,
      btn('Speichern', async () => {
        const name = neuerName.value.trim() || (nameChips && nameChips.werte()[0]) || null;
        if (name) {
          const vorhanden = vorhandene.find((n) => n.name.toLowerCase() === name.toLowerCase());
          if (vorhanden) await Store.update('gedankenNamen', vorhanden.id, { anzahl: (vorhanden.anzahl || 0) + 1 });
          else await Store.add('gedankenNamen', { name, beispiel: sorge().text, anzahl: 1 });
        }
        sichere({ status: 'benannt', gedankenName: name, benannt: bereinige(t.value) });
      }, true),
      el('button', { type: 'button', class: 'text-btn', onclick: zeigeSorge }, 'Zurück'));
  }

  zeigeSorge();
  return () => { clearInterval(iv); if (aufraeumen) aufraeumen(); };
}

// ---------- Befürchtungs-Check ----------

export async function renderBefuerchtungen(main) {
  const alle = (await Store.list('befuerchtungen')).sort((a, b) => (a.pruefDatum < b.pruefDatum ? -1 : 1));
  const h = heute();
  const faellig = alle.filter((b) => b.eingetreten === 'offen' && b.pruefDatum <= h);
  const spaeter = alle.filter((b) => b.eingetreten === 'offen' && b.pruefDatum > h);
  const geprueft = alle.filter((b) => b.eingetreten !== 'offen').sort((a, b) => (a.pruefDatum < b.pruefDatum ? 1 : -1));

  const text = el('textarea', { rows: '2', placeholder: 'z. B. Ich bekomme bei der Präsentation keinen Ton heraus.' });
  const wahr = regler(0, 100, 5, 50, 'Wahrscheinlichkeit', ' %');
  const datum = el('input', { type: 'date', value: plusTage(7), class: 'zahl' });
  const neu = el('form', { class: 'formular karte' },
    feld('Befürchtung', text, 'Konkret und überprüfbar.'),
    el('div', { class: 'feld' }, el('span', { class: 'feld-label' }, 'Wie wahrscheinlich?'), wahr),
    feld('Prüfen am', datum),
    el('button', { type: 'submit', class: 'btn btn-primaer btn-breit' }, 'Speichern'));
  neu.addEventListener('submit', async (e) => {
    e.preventDefault();
    const t = text.value.trim();
    if (!t) return;
    await Store.add('befuerchtungen', { text: t, wahrscheinlichkeit: wahr.wert(), datum: new Date().toISOString(), pruefDatum: datum.value || plusTage(7), eingetreten: 'offen' });
    neuZeichnen();
  });

  const pruefKarte = (b) => el('li', { class: 'liste-eintrag' },
    el('span', {}, b.text),
    el('span', { class: 'leise klein' }, `Geschätzt: ${b.wahrscheinlichkeit} % · prüfen am ${datumKurz(b.pruefDatum)}`),
    el('p', { class: 'feld-label' }, 'Ist es eingetreten?'),
    knopfwahl(EINGETRETEN, async (w) => { await Store.update('befuerchtungen', b.id, { eingetreten: w, geprueftAm: new Date().toISOString() }); neuZeichnen(); }, { label: 'Ist es eingetreten?' }));

  // Auswertung
  const n = geprueft.length;
  const ja = geprueft.filter((b) => b.eingetreten === 'ja').length;
  const teil = geprueft.filter((b) => b.eingetreten === 'teilweise').length;
  const schnitt = n ? Math.round(geprueft.reduce((s, b) => s + b.wahrscheinlichkeit, 0) / n) : 0;

  main.append(
    kopf('Befürchtungs-Check', '#/sorgen'),
    faellig.length ? el('section', { class: 'abschnitt' }, el('h2', {}, 'Heute prüfen'), el('ul', { class: 'liste' }, faellig.map(pruefKarte))) : null,
    el('section', { class: 'abschnitt' }, el('h2', {}, 'Neue Befürchtung'), neu),
    n ? el('section', { class: 'abschnitt' }, el('h2', {}, 'Auswertung'),
      el('p', {}, `${n} geprüft. Eingetreten: ${ja} (${Math.round(ja / n * 100)} %), teilweise: ${teil}, nicht eingetreten: ${n - ja - teil}.`),
      el('p', { class: 'leise' }, `Geschätzte Wahrscheinlichkeit im Schnitt: ${schnitt} %.`)) : null,
    spaeter.length ? el('section', { class: 'abschnitt' }, el('h2', {}, 'Offen'),
      el('ul', { class: 'liste' }, spaeter.map((b) => el('li', { class: 'liste-eintrag' },
        el('span', {}, b.text),
        el('span', { class: 'leise klein' }, `Geschätzt: ${b.wahrscheinlichkeit} % · prüfen am ${datumKurz(b.pruefDatum)}`),
        el('details', {}, el('summary', { class: 'leise klein' }, 'Schon jetzt prüfen'), pruefKarte(b)))))) : null,
    geprueft.length ? el('details', { class: 'erklaerkarte' }, el('summary', {}, 'Geprüfte Befürchtungen'),
      el('ul', { class: 'liste' }, geprueft.map((b) => el('li', { class: 'liste-eintrag' },
        el('span', {}, b.text),
        el('span', { class: 'leise klein' }, `${b.wahrscheinlichkeit} % geschätzt · ${eingetretenText(b.eingetreten)}`))))) : null,
    erklaerung('Was ist der Befürchtungs-Check?', ERKLAERKARTEN.befuerchtungsCheck),
  );
}
