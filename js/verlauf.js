// Modul 6: Verlauf – Erwartung vs. Ergebnis, Kurven, Übersicht, GAD-7, Hinweise.
import { Store } from './store.js';
import { el, kopf, leer, datumKurz, tageSeit, entwurf, heute, plusTage, neuZeichnen } from './ui.js';
import { GAD7, RUECKSCHLAG_HINWEIS, PROFI_HINWEIS } from './inhalte.js';
import { ladeEinstellungen, speichereEinstellungen } from './einstellungen.js';
import { linien } from './chart.js';

// ---------- Hinweise ----------

// Werte aus optionalen Angstwerten (Startscreen) und Akut-Momenten, Skala 0–10.
async function tageswerte() {
  const aw = await Store.list('angstwerte');
  const akut = (await Store.list('akut')).filter((a) => a.wertVorher != null).map((a) => ({ wert: a.wertVorher, datum: a.datum }));
  return [...aw, ...akut].map((w) => ({ wert: w.wert, tag: heute(new Date(w.datum)) }));
}

// Höher als sonst: Schnitt der letzten 3 Tage mindestens 2 Punkte über dem Schnitt der 14 Tage davor.
export async function rueckschlagErkannt() {
  const werte = await tageswerte();
  const grenze3 = plusTage(-2);
  const grenze17 = plusTage(-16);
  const neu = werte.filter((w) => w.tag >= grenze3);
  const alt = werte.filter((w) => w.tag < grenze3 && w.tag >= grenze17);
  const tageNeu = new Set(neu.map((w) => w.tag)).size;
  if (neu.length < 3 || tageNeu < 2 || alt.length < 5) return false;
  const schnitt = (l) => l.reduce((s, w) => s + w.wert, 0) / l.length;
  return schnitt(neu) - schnitt(alt) >= 2;
}

export async function rueckschlagHinweisFaellig() {
  const cfg = await ladeEinstellungen();
  if (cfg.rueckschlagGezeigtAm && tageSeit(cfg.rueckschlagGezeigtAm) < 30) return false;
  return rueckschlagErkannt();
}

export function rueckschlagKarte(beiOk) {
  return el('section', { class: 'karte karte-leise' },
    el('p', {}, RUECKSCHLAG_HINWEIS, ' ', entwurf()),
    el('div', { class: 'zeile' },
      el('a', { class: 'btn', href: '#/wellen' }, 'Plan für Wellen'),
      el('button', { type: 'button', class: 'text-btn', onclick: async () => { await speichereEinstellungen({ rueckschlagGezeigtAm: new Date().toISOString() }); beiOk(); } }, 'Ok')));
}

async function gad7Faellig(cfg) {
  if (!cfg.gad7Aktiv) return false;
  const alle = (await Store.list('gad7')).sort((a, b) => (a.datum < b.datum ? 1 : -1));
  if (alle.length && tageSeit(alle[0].datum) < 28) return false;
  if (cfg.gad7UebersprungenAm && tageSeit(cfg.gad7UebersprungenAm) < 28) return false;
  return true;
}

async function profiHinweisFaellig(cfg) {
  if (!cfg.profiHinweisAktiv || cfg.profiHinweisGezeigt) return false;
  const alle = (await Store.list('gad7')).sort((a, b) => (a.datum < b.datum ? 1 : -1));
  return alle.length >= 2 && alle[0].summe >= 15 && alle[1].summe >= 15;
}

// ---------- Verlauf ----------

export async function renderVerlauf(main) {
  const cfg = await ladeEinstellungen();
  const [uebungen, befs, situationen, akut, tage, gad, mut, koerper] = await Promise.all([
    Store.list('uebungen'), Store.list('befuerchtungen'), Store.list('situationen'), Store.list('akut'),
    Store.list('tagesschritte'), Store.list('gad7'), Store.list('mutbuch'), Store.list('koerperUebungen')]);

  // Erwartung vs. Ergebnis
  const geprueft = [
    ...uebungen.filter((u) => u.eingetreten).map((u) => ({ w: u.wahrscheinlichkeit, e: u.eingetreten })),
    ...befs.filter((b) => b.eingetreten && b.eingetreten !== 'offen').map((b) => ({ w: b.wahrscheinlichkeit, e: b.eingetreten })),
  ];
  const n = geprueft.length;
  const ja = geprueft.filter((g) => g.e === 'ja').length;
  const teil = geprueft.filter((g) => g.e === 'teilweise').length;
  const schaetzung = n ? Math.round(geprueft.reduce((s, g) => s + (g.w || 0), 0) / n) : 0;
  const eingetretenQuote = n ? Math.round((ja + teil / 2) / n * 100) : 0;
  const balken = (label, wert) => el('div', { class: 'balken-zeile' },
    el('span', { class: 'klein' }, label),
    el('div', { class: 'balken' }, el('div', { class: 'balken-fuellung', style: `width:${wert}%` })),
    el('span', { class: 'klein' }, `${wert} %`));

  const erwartung = el('section', { class: 'abschnitt' }, el('h2', {}, 'Erwartung und Ergebnis'),
    n ? [
      el('p', {}, `${n} Befürchtungen geprüft (Übungen und Befürchtungs-Check). Eingetreten: ${ja}, teilweise: ${teil}, nicht eingetreten: ${n - ja - teil}.`),
      balken('Geschätzt', schaetzung),
      balken('Eingetreten', eingetretenQuote),
      el('p', { class: 'leise klein' }, '„Eingetreten“ zählt teilweise Eingetretenes zur Hälfte.'),
    ] : leer('Noch keine geprüften Befürchtungen.'));

  // Kurven pro Situation / Körperübung
  const gruppen = new Map();
  uebungen.filter((u) => u.kurve && u.kurve.length > 1).forEach((u) => {
    const key = u.situationId ? 's:' + u.situationId : 'k:' + u.koerperId;
    if (!gruppen.has(key)) gruppen.set(key, []);
    gruppen.get(key).push(u);
  });
  const nameVon = (key) => key.startsWith('s:')
    ? situationen.find((s) => s.id === key.slice(2))?.titel || 'Situation'
    : koerper.find((k) => k.id === key.slice(2))?.titel || 'Körperübung';
  const kurvenBox = el('div');
  const zeigeKurve = (key) => {
    const l = gruppen.get(key).sort((a, b) => (a.start < b.start ? 1 : -1));
    kurvenBox.replaceChildren(linien(l.map((u, i) => ({ punkte: u.kurve.map((p) => ({ x: p.minute, y: p.wert })), hervorheben: i === 0 })), { beschreibung: `Angstkurven: ${nameVon(key)}` }),
      el('p', { class: 'leise klein' }, l.length === 1 ? 'Eine Übung. Nur zur Beobachtung.' : `${l.length} Übungen übereinander. Die neueste ist kräftiger gezeichnet. Nur zur Beobachtung.`));
  };
  let kurven = null;
  if (gruppen.size) {
    const auswahl = el('select', { 'aria-label': 'Situation wählen', onchange: (e) => zeigeKurve(e.target.value) },
      [...gruppen.keys()].map((k) => el('option', { value: k }, nameVon(k))));
    kurven = el('section', { class: 'abschnitt' }, el('h2', {}, 'Kurven'), auswahl, kurvenBox);
    zeigeKurve([...gruppen.keys()][0]);
  }

  // Übersicht
  const weggelassen = uebungen.reduce((s, u) => s + (u.weggelasseneSicherheitsverhalten || []).length, 0);
  const uebersicht = el('section', { class: 'abschnitt' }, el('h2', {}, 'Übersicht'),
    el('dl', { class: 'zahlen' },
      [['Übungen', uebungen.length],
        ['Geschaffte Stufen', situationen.filter((s) => s.status === 'geschafft').length],
        ['Sicherheitsverhalten weggelassen', weggelassen],
        ['Akut-Momente durchgestanden', akut.length],
        ['Tagesschritte gemacht', tage.filter((t) => t.erledigt).length],
        ['Einträge im Mut-Buch', mut.length]].map(([k, v]) => el('div', {}, el('dt', {}, k), el('dd', {}, String(v))))));

  // GAD-7
  const gadSortiert = [...gad].sort((a, b) => (a.datum < b.datum ? -1 : 1));
  const faellig = await gad7Faellig(cfg);
  const gadBox = el('section', { class: 'abschnitt' }, el('h2', {}, 'Monats-Check (GAD-7)'),
    !cfg.gad7Aktiv ? leer('In den Einstellungen ausgeschaltet.') : null,
    faellig ? el('div', { class: 'karte' },
      el('p', {}, 'Der Monats-Check ist wieder möglich. Er ist freiwillig.'),
      el('a', { class: 'btn btn-primaer btn-breit', href: '#/gad7' }, 'Monats-Check machen'),
      el('button', { type: 'button', class: 'text-btn', onclick: async () => { await speichereEinstellungen({ gad7UebersprungenAm: new Date().toISOString() }); neuZeichnen(); } }, 'Diesmal überspringen')) : null,
    gadSortiert.length ? [
      gadSortiert.length > 1 ? linien([{ punkte: gadSortiert.map((g, i) => ({ x: i + 1, y: g.summe })), hervorheben: true }], { yMax: 21, xLabel: 'Check', beschreibung: 'GAD-7-Verlauf' }) : null,
      el('ul', { class: 'einfach' }, [...gadSortiert].reverse().map((g) => el('li', {}, `${datumKurz(g.datum)}: ${g.summe} (${GAD7.stufe(g.summe)})`))),
    ] : (cfg.gad7Aktiv ? leer('Noch kein Monats-Check.') : null));

  const profi = await profiHinweisFaellig(cfg);

  main.append(
    kopf('Verlauf'),
    profi ? el('section', { class: 'karte karte-leise' }, el('p', {}, PROFI_HINWEIS, ' ', entwurf()),
      el('button', { type: 'button', class: 'text-btn', onclick: async () => { await speichereEinstellungen({ profiHinweisGezeigt: true }); neuZeichnen(); } }, 'Ok')) : null,
    (await rueckschlagHinweisFaellig()) ? rueckschlagKarte(neuZeichnen) : null,
    erwartung, kurven, uebersicht, gadBox,
  );
}

// ---------- GAD-7 ----------

export async function renderGad7(main) {
  const antworten = Array(7).fill(null);
  const fehler = el('p', { class: 'hinweis', role: 'status' });
  const fragen = GAD7.fragen.map((f, i) => el('fieldset', { class: 'feld gad-frage' },
    el('legend', {}, `${i + 1}. ${f}`),
    GAD7.antworten.map((a, wert) => el('label', { class: 'radio' },
      el('input', { type: 'radio', name: `g${i}`, value: String(wert), onchange: () => { antworten[i] = wert; } }),
      `${a} (${wert})`))));
  const form = el('form', { class: 'formular' }, fragen,
    fehler,
    el('button', { type: 'submit', class: 'btn btn-primaer btn-breit' }, 'Auswerten'),
    el('a', { class: 'text-btn', href: '#/verlauf' }, 'Abbrechen'));
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (antworten.some((a) => a == null)) { fehler.textContent = 'Bitte alle 7 Fragen beantworten oder abbrechen.'; return; }
    const summe = antworten.reduce((s, a) => s + a, 0);
    await Store.add('gad7', { antworten, summe, datum: new Date().toISOString() });
    main.replaceChildren(kopf('Monats-Check', '#/verlauf'),
      el('p', { class: 'akut-satz' }, `Summe: ${summe} von 21`),
      el('p', {}, `Einordnung nach GAD-7: ${GAD7.stufe(summe)} (0–4 minimal, 5–9 leicht, 10–14 mäßig, 15–21 schwer).`),
      el('p', { class: 'leise' }, 'Der GAD-7 ist ein Fragebogen, keine Diagnose.'),
      el('a', { class: 'btn btn-primaer btn-breit', href: '#/verlauf' }, 'Zum Verlauf'));
    main.querySelector('h1').focus();
  });
  main.append(kopf('Monats-Check', '#/verlauf'),
    el('p', {}, GAD7.einleitung),
    el('p', { class: 'leise klein' }, 'GAD-7, deutsche Version nach Löwe et al. Freiwillig, jederzeit abbrechbar.'),
    form);
}
