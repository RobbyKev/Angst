// Übungsablauf für Exposition (Modul 2), Körperübung (Modul 4) und vertiefte Übung (kombiniert).
// Erfolg = durchgezogen. Keine Meldung hängt von einer sinkenden Kurve ab.
import { Store } from './store.js';
import { el, chips, skala, regler, knopfwahl, entwurf, overlay, EINGETRETEN } from './ui.js';
import { GEFUEHLSWOERTER, KONTEXTE, UEBUNG_HINWEIS, VAGE_WOERTER, KOERPER_HINWEIS } from './inhalte.js';
import { ladeEinstellungen, speichereEinstellungen } from './einstellungen.js';
import { linien } from './chart.js';

const LAUFEND = 'laufendeUebung';

export async function laufendeUebung() {
  const d = await Store.getDoc(LAUFEND, { route: null, z: null });
  return d.route ? d : null;
}

async function sichereLauf(z) { await Store.setDoc(LAUFEND, { route: location.hash, z }); }
async function beendeLauf() { await Store.setDoc(LAUFEND, { route: null, z: null }); }

// Einmaliger Hinweis vor der ersten Körperübung
export async function koerperHinweisFallsNoetig() {
  const cfg = await ladeEinstellungen();
  if (cfg.koerperHinweisGesehen) return true;
  return new Promise((ok) => {
    let zu;
    zu = overlay([
      el('h2', {}, 'Vor der ersten Körperübung ', entwurf()),
      el('p', {}, KOERPER_HINWEIS),
      el('p', { class: 'leise' }, 'Dieser Hinweis erscheint nur einmal.'),
      el('button', { type: 'button', class: 'btn btn-primaer btn-breit', onclick: async () => { await speichereEinstellungen({ koerperHinweisGesehen: true }); zu(); ok(true); } }, 'Verstanden'),
      el('button', { type: 'button', class: 'text-btn', onclick: () => { zu(); ok(false); } }, 'Jetzt nicht'),
    ], { label: 'Hinweis Körperübungen', schliessbar: false });
  });
}

function istVage(text) {
  const t = text.trim().replace(/[.!?]+$/, '');
  return t.split(/\s+/).filter(Boolean).length < 3 || VAGE_WOERTER.test(t);
}

async function abrufhilfe(typ, situation, koerperId) {
  const alle = (await Store.list('uebungen')).filter((u) => u.gelernt);
  alle.sort((a, b) => (a.ende < b.ende ? 1 : -1));
  if (typ === 'koerper') {
    const u = alle.find((x) => x.koerperId === koerperId);
    return u ? { text: u.gelernt } : null;
  }
  const gleich = alle.find((x) => x.situationId === situation.id);
  if (gleich) return { text: gleich.gelernt };
  const situationen = await Store.list('situationen');
  const aehnlich = alle.find((x) => {
    const s = situationen.find((y) => y.id === x.situationId);
    return s && Math.abs((s.angstwertErwartet ?? 0) - (situation.angstwertErwartet ?? 0)) <= 15;
  });
  if (aehnlich) {
    const s = situationen.find((y) => y.id === aehnlich.situationId);
    return { text: aehnlich.gelernt, bei: s.titel };
  }
  return null;
}

const minuten = (ms) => Math.round(ms / 6000) / 10;
const uhr = (sek) => {
  const s = Math.max(0, Math.floor(sek));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

export async function renderUebung(main, typ, refId) {
  const cfg = await ladeEinstellungen();
  const situation = typ === 'koerper' ? null : await Store.get('situationen', refId);
  let koerper = typ === 'koerper' ? await Store.get('koerperUebungen', refId) : null;
  if ((typ !== 'koerper' && !situation) || (typ === 'koerper' && !koerper)) { location.hash = '#/'; return; }

  const svListe = (await Store.list('sicherheitsverhalten')).filter((s) => s.aktiv !== false);
  const koerperListe = await Store.list('koerperUebungen');
  const frueher = (await Store.list('uebungen')).filter((u) => (typ === 'koerper' ? u.koerperId === refId : u.situationId === refId));

  // Laufende Übung wiederaufnehmen
  const lauf = await laufendeUebung();
  let z;
  if (lauf && lauf.route === location.hash && lauf.z) {
    z = lauf.z;
  } else {
    z = {
      typ, situationId: situation?.id || null, koerperId: koerper?.id || null,
      kontext: [], kontextText: '', befuerchtung: '', wahrscheinlichkeit: 50, angstVorher: null,
      weggelassen: [], geplantMin: koerper ? Math.max(1, Math.round((koerper.dauerSek || 60) / 60)) : 20,
      abfrage: cfg.abfrageAktiv, intervall: cfg.abfrageIntervall || 5,
      start: null, ende: null, koerperStart: null, kurve: [], naechsteAbfrage: null,
      eingetreten: null, ueberraschung: null, gelernt: '', status: null, schritt: null,
    };
  }
  if (z.koerperId && !koerper) koerper = await Store.get('koerperUebungen', z.koerperId);

  const name = typ === 'koerper' ? koerper.titel : situation.titel;
  let aufraeumen = null;
  const buehne = el('div', { class: 'uebung-buehne' });
  const abbrechen = el('button', {
    type: 'button', class: 'text-btn',
    onclick: async () => {
      if (!confirm('Übung abbrechen? Die Eingaben dieser Übung werden verworfen.')) return;
      await beendeLauf();
      location.hash = typ === 'koerper' ? '#/koerper' : `#/leiter/${refId}`;
    },
  }, 'Abbrechen');
  main.append(el('div', { class: 'akut-leiste zwischen' }, el('span', { class: 'leise klein' }, name), abbrechen), buehne);

  const titel = (t) => el('h1', { class: 'akut-frage', tabindex: '-1' }, t);
  const weiter = (onclick, label = 'Weiter') => el('button', { type: 'button', class: 'btn btn-primaer btn-breit', onclick }, label);

  const ablauf = [];
  if (typ === 'kombiniert' && !z.koerperId) ablauf.push('koerperWahl');
  if (typ !== 'koerper') ablauf.push('vorbereitung');
  ablauf.push('befuerchtung', 'wahrscheinlichkeit', 'angstVorher');
  if (svListe.length) ablauf.push('sicherheit');
  ablauf.push('plan');
  if (typ === 'kombiniert') ablauf.push('koerperPhase');
  ablauf.push('laeuft', 'abgleich');

  const naechster = (aktuell) => ablauf[ablauf.indexOf(aktuell) + 1];

  const schritte = {
    koerperWahl() {
      if (!koerperListe.length) {
        return [titel('Vertiefte Übung'), el('p', {}, 'Lege zuerst eine Körperübung an. Sie wird dann vor der Situation gemacht.'),
          el('a', { class: 'btn btn-primaer btn-breit', href: '#/koerper/neu' }, 'Körperübung anlegen')];
      }
      return [titel('Welche Körperübung machst du vorher?'),
        el('p', { class: 'leise' }, 'Vertiefte Übung: Erst die Körperübung, direkt danach die Situation.'),
        el('div', { class: 'stapel' }, koerperListe.map((k) => el('button', {
          type: 'button', class: 'btn btn-breit',
          onclick: async () => {
            if (!(await koerperHinweisFallsNoetig())) return;
            z.koerperId = k.id; koerper = k; zeige('vorbereitung');
          },
        }, k.titel)))];
    },

    async vorbereitung() {
      const hilfe = await abrufhilfe(typ, situation, z.koerperId);
      const kontext = chips(KONTEXTE, { mehrfach: true, gewaehlt: z.kontext, label: 'Kontext' });
      const kText = el('input', { type: 'text', value: z.kontextText, placeholder: 'Was ist diesmal anders? (optional)', 'aria-label': 'Kontext in eigenen Worten', autocomplete: 'off' });
      return [
        titel(name),
        hilfe ? el('div', { class: 'karte karte-leise' },
          el('p', { class: 'eyebrow' }, hilfe.bei ? `Bei „${hilfe.bei}“ hast du gelernt:` : 'Was du letztes Mal gelernt hast:'),
          el('p', {}, hilfe.text)) : null,
        frueher.length
          ? el('p', {}, `Du hast diese Stufe schon ${frueher.length === 1 ? 'einmal' : frueher.length + '-mal'} geübt. Vorschlag: Ändere diesmal den Kontext, z. B. Ort, Uhrzeit, allein oder begleitet, Tagesform.`)
          : null,
        el('p', { class: 'feld-label' }, 'Kontext (optional)'),
        kontext, kText,
        weiter(() => { z.kontext = kontext.werte(); z.kontextText = kText.value.trim(); zeige(naechster('vorbereitung')); }),
      ];
    },

    befuerchtung() {
      const t = el('textarea', { rows: '3', 'aria-labelledby': 'bf-frage', placeholder: 'z. B. Ich werde ohnmächtig und muss die Kasse verlassen.' }, z.befuerchtung);
      const hinweis = el('p', { class: 'hinweis', role: 'status' });
      let gewarnt = false;
      return [
        el('h1', { class: 'akut-frage', id: 'bf-frage', tabindex: '-1' }, 'Was befürchtest du konkret?'),
        el('p', { class: 'leise' }, 'Möglichst so, dass man hinterher prüfen kann, ob es passiert ist.'),
        t, hinweis,
        weiter(() => {
          const text = t.value.trim();
          if (!text) { hinweis.textContent = 'Schreib die Befürchtung auf. Sie ist der wichtigste Teil der Übung.'; return; }
          if (istVage(text) && !gewarnt) {
            gewarnt = true;
            hinweis.textContent = 'Das ist noch recht allgemein. Was genau würde passieren, und woran würdest du es merken? Du kannst auch so weitermachen.';
            return;
          }
          z.befuerchtung = text;
          zeige(naechster('befuerchtung'));
        }),
      ];
    },

    wahrscheinlichkeit() {
      const r = regler(0, 100, 5, z.wahrscheinlichkeit, 'Wahrscheinlichkeit in Prozent', ' %');
      return [titel('Wie wahrscheinlich ist das?'), el('p', { class: 'leise' }, z.befuerchtung), r,
        weiter(() => { z.wahrscheinlichkeit = r.wert(); zeige(naechster('wahrscheinlichkeit')); })];
    },

    angstVorher() {
      const r = regler(0, 100, 5, z.angstVorher ?? 50, 'Angstwert vorher');
      return [titel('Angstwert vorher (0–100)'), r,
        weiter(() => { z.angstVorher = r.wert(); zeige(naechster('angstVorher')); }),
        typ === 'koerper' ? el('button', { type: 'button', class: 'text-btn', onclick: () => { z.angstVorher = null; zeige(naechster('angstVorher')); } }, 'Überspringen') : null];
    },

    sicherheit() {
      const c = chips(svListe.map((s) => s.titel), { mehrfach: true, gewaehlt: svListe.filter((s) => z.weggelassen.includes(s.id)).map((s) => s.titel), label: 'Sicherheitsverhalten' });
      return [titel('Welches Sicherheitsverhalten lässt du dieses Mal weg?'),
        el('p', { class: 'leise' }, 'Optional. Eins reicht.'),
        c,
        weiter(() => {
          const namen = c.werte();
          z.weggelassen = svListe.filter((s) => namen.includes(s.titel)).map((s) => s.id);
          zeige(naechster('sicherheit'));
        })];
    },

    plan() {
      const dauer = el('input', { type: 'number', inputmode: 'numeric', min: '1', max: '240', value: String(z.geplantMin), 'aria-label': 'Geplante Dauer in Minuten', class: 'zahl' });
      const abfrage = el('input', { type: 'checkbox', checked: z.abfrage });
      return [
        titel('Bereit?'),
        el('label', { class: 'feld' }, el('span', { class: 'feld-label' }, typ === 'koerper' ? 'Dauer der Körperübung (Minuten)' : 'Geplante Zeit (Minuten)'), dauer),
        el('label', { class: 'schalter' }, abfrage, el('span', {}, `Alle ${z.intervall} Minuten nach dem Angstwert fragen`)),
        el('p', { class: 'leise' }, typ === 'koerper'
          ? 'Die Übung endet, wenn die Zeit um ist.'
          : 'Die Übung endet, wenn die Befürchtung überprüft ist oder die geplante Zeit um ist. Nicht, wenn die Angst gesunken ist.'),
        weiter(() => {
          z.geplantMin = Math.max(1, Number(dauer.value) || z.geplantMin);
          z.abfrage = abfrage.checked;
          if (typ === 'kombiniert') { z.koerperStart = Date.now(); zeige('koerperPhase'); return; }
          z.start = Date.now();
          z.naechsteAbfrage = z.intervall;
          if (z.angstVorher != null) z.kurve = [{ minute: 0, wert: z.angstVorher, gefuehlswort: null }];
          zeige('laeuft');
        }, 'Starten'),
      ];
    },

    koerperPhase() {
      const sek = (koerper.dauerSek || 60);
      const anzeige = el('p', { class: 'timer' }, uhr(sek));
      const status = el('p', { class: 'leise' }, koerper.beschreibung || '');
      const iv = setInterval(() => {
        const rest = sek - (Date.now() - z.koerperStart) / 1000;
        anzeige.textContent = rest > 0 ? uhr(rest) : 'Zeit um.';
      }, 500);
      aufraeumen = () => clearInterval(iv);
      return [titel(`Zuerst: ${koerper.titel}`), status, anzeige,
        weiter(() => {
          z.start = Date.now();
          z.naechsteAbfrage = z.intervall;
          if (z.angstVorher != null) z.kurve = [{ minute: 0, wert: z.angstVorher, gefuehlswort: null }];
          zeige('laeuft');
        }, `Weiter zur Situation: ${situation.titel}`)];
    },

    laeuft() {
      const anzeige = el('p', { class: 'timer' });
      const unter = el('p', { class: 'leise klein' });
      const abfrageBox = el('div', { class: 'abfrage' });
      let offen = false;

      const zeigeAbfrage = () => {
        offen = true;
        const r = regler(0, 100, 5, z.kurve.length ? z.kurve[z.kurve.length - 1].wert : 50, 'Angstwert jetzt');
        const c = chips(GEFUEHLSWOERTER, { label: 'Gefühlswort (optional)' });
        const schliesse = () => { offen = false; z.naechsteAbfrage = minuten(Date.now() - z.start) + z.intervall; sichereLauf(z); abfrageBox.replaceChildren(); };
        abfrageBox.replaceChildren(el('div', { class: 'karte' },
          el('p', { class: 'feld-label' }, 'Angstwert jetzt?'), r,
          el('p', { class: 'leise klein' }, 'Optional ein Wort:'), c,
          el('button', { type: 'button', class: 'btn btn-primaer btn-breit', onclick: () => {
            z.kurve.push({ minute: minuten(Date.now() - z.start), wert: r.wert(), gefuehlswort: c.werte()[0] || null });
            schliesse();
          } }, 'Notieren'),
          el('button', { type: 'button', class: 'text-btn', onclick: schliesse }, 'Überspringen')));
      };

      const takt = () => {
        const sek = (Date.now() - z.start) / 1000;
        const plan = z.geplantMin * 60;
        if (typ === 'koerper') {
          anzeige.textContent = sek < plan ? uhr(plan - sek) : 'Zeit um.';
          unter.textContent = sek < plan ? 'verbleibend' : '';
        } else {
          anzeige.textContent = uhr(sek);
          unter.textContent = sek < plan ? `geplant: ${z.geplantMin} Min` : 'Die geplante Zeit ist um.';
        }
        if (z.abfrage && !offen && z.naechsteAbfrage != null && sek / 60 >= z.naechsteAbfrage) zeigeAbfrage();
      };
      takt();
      const iv = setInterval(takt, 1000);
      aufraeumen = () => clearInterval(iv);

      return [
        titel(typ === 'koerper' ? koerper.titel : situation.titel),
        typ === 'koerper' && koerper.beschreibung ? el('p', {}, koerper.beschreibung) : null,
        el('p', { class: 'leise' }, typ === 'koerper' ? 'Lass die Empfindungen da sein und beobachte, was passiert.' : [UEBUNG_HINWEIS, ' ', entwurf()]),
        el('div', { class: 'timer-box' }, anzeige, unter),
        abfrageBox,
        el('p', { class: 'leise klein' }, 'Deine Befürchtung: ', z.befuerchtung),
        weiter(() => { z.ende = Date.now(); zeige('abgleich'); }, typ === 'koerper' ? 'Übung beenden' : 'Befürchtung überprüft / Zeit um'),
      ];
    },

    abgleich() {
      abbrechen.hidden = true;
      const eingetreten = knopfwahl(EINGETRETEN, null, { gewaehlt: z.eingetreten, label: 'Ist das Befürchtete passiert?' });
      const ueber = { wert: z.ueberraschung };
      const ueberBox = el('div', {});
      const zeichneUeber = () => ueberBox.replaceChildren(skala(0, 10, (v) => { ueber.wert = v; zeichneUeber(); }, { gewaehlt: ueber.wert, label: 'Überraschung 0 bis 10' }));
      zeichneUeber();
      const gelernt = el('textarea', { rows: '3', 'aria-label': 'Was hast du gelernt?' }, z.gelernt);
      const statusWahl = typ !== 'koerper'
        ? knopfwahl([['offen', 'offen'], ['versucht', 'versucht'], ['geschafft', 'geschafft']], null,
          { gewaehlt: situation.status === 'geschafft' ? 'geschafft' : 'versucht', label: 'Status der Stufe' })
        : null;
      return [
        titel('Abgleich'),
        el('p', { class: 'leise' }, 'Deine Befürchtung: ', z.befuerchtung, ` (${z.wahrscheinlichkeit} %)`),
        el('p', { class: 'feld-label' }, 'Ist das Befürchtete passiert?'), eingetreten,
        el('p', { class: 'feld-label' }, 'Wie überrascht bist du? (0–10)'), ueberBox,
        el('p', { class: 'feld-label' }, 'Was hast du gelernt?'), gelernt,
        statusWahl ? [el('p', { class: 'feld-label' }, 'Status der Stufe'), statusWahl] : null,
        weiter(async () => {
          z.eingetreten = eingetreten.wert();
          z.ueberraschung = ueber.wert;
          z.gelernt = gelernt.value.trim();
          z.status = statusWahl ? statusWahl.wert() : null;
          await speichern();
        }, 'Speichern'),
      ];
    },
  };

  async function speichern() {
    const doc = await Store.add('uebungen', {
      typ, situationId: z.situationId, koerperId: z.koerperId,
      kontext: [...z.kontext, z.kontextText].filter(Boolean).join(', ') || null,
      befuerchtung: z.befuerchtung, wahrscheinlichkeit: z.wahrscheinlichkeit, angstVorher: z.angstVorher,
      eingetreten: z.eingetreten, ueberraschung: z.ueberraschung, gelernt: z.gelernt || null,
      weggelasseneSicherheitsverhalten: z.weggelassen, kurve: z.kurve, geplantMin: z.geplantMin,
      start: new Date(z.start).toISOString(), ende: new Date(z.ende || Date.now()).toISOString(),
    });
    const datum = doc.ende;
    const text = typ === 'koerper' ? `Körperübung: ${koerper.titel}`
      : typ === 'kombiniert' ? `Vertiefte Übung: ${koerper.titel}, dann ${situation.titel}`
        : `Übung: ${situation.titel}`;
    await Store.add('mutbuch', { datum, text, quelle: 'uebung', refId: doc.id });
    for (const id of z.weggelassen) {
      const sv = svListe.find((s) => s.id === id);
      if (sv) await Store.add('mutbuch', { datum, text: `Weggelassen: ${sv.titel} (bei ${name})`, quelle: 'sicherheitsverhalten', refId: doc.id });
    }
    if (situation && z.status) await Store.update('situationen', situation.id, { status: z.status });
    await beendeLauf();
    zeigeFertig(doc);
  }

  function zeigeFertig(doc) {
    if (aufraeumen) { aufraeumen(); aufraeumen = null; }
    abbrechen.hidden = true;
    buehne.replaceChildren(
      titel('Gespeichert.'),
      el('p', { class: 'leise' }, 'Die Übung steht im Mut-Buch.'),
      doc.kurve.length > 1 ? linien([{ punkte: doc.kurve.map((p) => ({ x: p.minute, y: p.wert })), hervorheben: true }], { beschreibung: 'Angstwerte während der Übung' }) : null,
      el('a', { class: 'btn btn-primaer btn-breit', href: typ === 'koerper' ? '#/koerper' : `#/leiter/${refId}` }, 'Fertig'),
    );
    buehne.querySelector('h1').focus({ preventScroll: true });
  }

  async function zeige(name) {
    if (aufraeumen) { aufraeumen(); aufraeumen = null; }
    z.schritt = name;
    if (name !== 'koerperWahl') sichereLauf(z);
    const inhalt = await schritte[name]();
    buehne.replaceChildren(...[inhalt].flat(Infinity).filter(Boolean));
    window.scrollTo(0, 0);
    const f = buehne.querySelector('[tabindex="-1"]');
    if (f) f.focus({ preventScroll: true });
  }

  if (typ === 'koerper' && !z.schritt) {
    if (!(await koerperHinweisFallsNoetig())) { location.hash = '#/koerper'; return; }
  }
  await zeige(z.schritt && schritte[z.schritt] ? z.schritt : ablauf[0]);
  return () => { if (aufraeumen) aufraeumen(); };
}
