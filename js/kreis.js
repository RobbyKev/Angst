// Modul 5: Teufelskreis-Tagebuch
import { Store } from './store.js';
import { el, kopf, leer, regler, chips, feld, datumUhrzeit, datumKurz, erklaerung } from './ui.js';
import { GEFUEHLSWOERTER, VERHALTEN, ERKLAERKARTEN } from './inhalte.js';

const bereinige = (t) => t.trim().replace(/^dass\s+/i, '').replace(/[.!?…\s]+$/, '');

async function verknuepfungsOptionen() {
  const [akut, uebungen, sorgen, situationen] = await Promise.all([
    Store.list('akut'), Store.list('uebungen'), Store.list('sorgen'), Store.list('situationen')]);
  const opt = [
    ...akut.map((a) => ({ wert: `akut:${a.id}`, text: `Akut ${datumKurz(a.datum)}${a.gefuehlswort ? ' · ' + a.gefuehlswort : ''}`, datum: a.datum })),
    ...uebungen.map((u) => ({ wert: `uebung:${u.id}`, text: `Übung ${datumKurz(u.start)}${u.situationId ? ' · ' + (situationen.find((s) => s.id === u.situationId)?.titel || '') : ''}`, datum: u.start })),
    ...sorgen.map((s) => ({ wert: `sorge:${s.id}`, text: `Sorge · ${s.text.slice(0, 40)}`, datum: s.datum })),
  ];
  return opt.sort((a, b) => (a.datum < b.datum ? 1 : -1)).slice(0, 30);
}

async function verknuepfungsText(v) {
  if (!v) return null;
  const opt = await verknuepfungsOptionen();
  return opt.find((o) => o.wert === v)?.text || null;
}

export function kreisGrafik(k) {
  const knoten = [
    ['Auslöser', k.ausloeser],
    ['Gedanke', k.gedanke],
    ['Körper', k.koerper],
    ['Gefühl', [k.gefuehlswort, k.gefuehl != null ? `(${k.gefuehl})` : null].filter(Boolean).join(' ')],
    ['Verhalten', (k.verhalten || []).join(', ')],
  ];
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('class', 'kreis-ring');
  svg.setAttribute('aria-hidden', 'true');
  const c = document.createElementNS(ns, 'circle');
  Object.entries({ cx: 50, cy: 50, r: 36 }).forEach(([a, b]) => c.setAttribute(a, b));
  svg.append(c);
  // Pfeilspitzen zwischen den Knoten (im Uhrzeigersinn)
  for (let i = 0; i < 5; i++) {
    const w = (-90 + 36 + i * 72) * Math.PI / 180;
    const x = 50 + 36 * Math.cos(w), y = 50 + 36 * Math.sin(w);
    const p = document.createElementNS(ns, 'path');
    p.setAttribute('d', 'M-2.5,-2.5 L2.5,0 L-2.5,2.5');
    p.setAttribute('transform', `translate(${x.toFixed(2)},${y.toFixed(2)}) rotate(${(w * 180 / Math.PI + 90).toFixed(1)})`);
    svg.append(p);
  }
  const box = el('div', { class: 'kreis', role: 'list', 'aria-label': 'Teufelskreis' }, svg);
  knoten.forEach(([label, text], i) => {
    const w = (-90 + i * 72) * Math.PI / 180;
    const knotenEl = el('div', { class: 'kreis-knoten', role: 'listitem', style: `left:${50 + 36 * Math.cos(w)}%;top:${50 + 36 * Math.sin(w)}%` },
      el('span', { class: 'kreis-label' }, label), el('span', { class: 'kreis-text' }, text || '–'));
    box.append(knotenEl);
  });
  return box;
}

export async function renderKreisListe(main) {
  const liste = (await Store.list('kreis')).sort((a, b) => (a.datum < b.datum ? 1 : -1));
  main.append(
    kopf('Teufelskreis'),
    el('p', { class: 'leise' }, 'Auslöser → Gedanke → Körper → Gefühl → Verhalten.'),
    el('a', { class: 'btn btn-primaer btn-breit', href: '#/kreis/neu' }, 'Neuer Eintrag'),
    liste.length ? el('ul', { class: 'liste' }, liste.map((k) => el('li', {},
      el('a', { class: 'liste-eintrag', href: `#/kreis/${k.id}` },
        el('span', { class: 'leise klein' }, datumUhrzeit(k.datum)),
        el('strong', {}, k.ausloeser || '–'),
        k.gedanke ? el('span', { class: 'leise' }, k.gedanke) : null)))) : leer('Noch keine Einträge.'),
    erklaerung('Was ist der Teufelskreis?', ERKLAERKARTEN.verstehen),
  );
}

export async function renderKreisNeu(main) {
  const ausloeser = el('input', { type: 'text', autocomplete: 'off' });
  const gedanke = el('input', { type: 'text', autocomplete: 'off' });
  const defusion = el('p', { class: 'defusion-vorschau', hidden: true });
  const defusionAn = el('input', { type: 'checkbox' });
  const zeigeDefusion = () => {
    const g = bereinige(gedanke.value);
    defusion.hidden = !(defusionAn.checked && g);
    defusion.textContent = g ? `Ich bemerke den Gedanken, dass ${g}.` : '';
  };
  gedanke.addEventListener('input', zeigeDefusion);
  defusionAn.addEventListener('change', zeigeDefusion);
  const koerper = el('input', { type: 'text', autocomplete: 'off' });
  const gefuehl = regler(0, 100, 5, 50, 'Stärke des Gefühls');
  const wortChips = chips(GEFUEHLSWOERTER, { label: 'Gefühlswort' });
  const wortText = el('input', { type: 'text', placeholder: 'oder eigenes Wort', 'aria-label': 'Eigenes Gefühlswort', autocomplete: 'off' });
  const verhalten = chips(VERHALTEN, { mehrfach: true, label: 'Verhalten' });
  const verhaltenText = el('input', { type: 'text', placeholder: 'Was genau? (optional, z. B. Puls gemessen)', 'aria-label': 'Verhalten genauer', autocomplete: 'off' });
  const optionen = await verknuepfungsOptionen();
  const verkn = el('select', {}, el('option', { value: '' }, '–'), optionen.map((o) => el('option', { value: o.wert }, o.text)));

  const form = el('form', { class: 'formular' },
    feld('Auslöser', ausloeser, 'Was war los? Wo warst du?'),
    feld('Gedanke', gedanke, 'Was ging dir durch den Kopf?'),
    el('label', { class: 'schalter' }, defusionAn, el('span', {}, 'Als Gedanken benennen')),
    defusion,
    feld('Körper', koerper, 'Was hast du im Körper gespürt?'),
    el('div', { class: 'feld' }, el('span', { class: 'feld-label' }, 'Gefühl (0–100)'), gefuehl, wortChips, wortText),
    el('div', { class: 'feld' }, el('span', { class: 'feld-label' }, 'Verhalten'), verhalten, verhaltenText),
    optionen.length ? feld('Verknüpfen mit (optional)', verkn) : null,
    el('button', { type: 'submit', class: 'btn btn-primaer btn-breit' }, 'Speichern'));
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const v = verhalten.werte();
    if (verhaltenText.value.trim()) v.push(verhaltenText.value.trim());
    const d = await Store.add('kreis', {
      ausloeser: ausloeser.value.trim(), gedanke: gedanke.value.trim(),
      gedankeBenannt: defusionAn.checked && gedanke.value.trim() ? `Ich bemerke den Gedanken, dass ${bereinige(gedanke.value)}.` : null,
      koerper: koerper.value.trim(), gefuehl: gefuehl.wert(),
      gefuehlswort: wortText.value.trim() || wortChips.werte()[0] || null,
      verhalten: v, datum: new Date().toISOString(), verknuepfung: verkn.value || null,
    });
    location.hash = `#/kreis/${d.id}`;
  });
  main.append(kopf('Neuer Eintrag', '#/kreis'), form);
}

export async function renderKreis(main, id) {
  const k = await Store.get('kreis', id);
  if (!k) { location.hash = '#/kreis'; return; }
  const verkn = await verknuepfungsText(k.verknuepfung);
  main.append(
    kopf('Teufelskreis', '#/kreis'),
    el('p', { class: 'leise' }, datumUhrzeit(k.datum)),
    kreisGrafik(k),
    k.gedankeBenannt ? el('p', { class: 'defusion-vorschau' }, k.gedankeBenannt) : null,
    verkn ? el('p', { class: 'leise' }, 'Verknüpft mit: ', verkn) : null,
    el('button', {
      type: 'button', class: 'text-btn',
      onclick: async () => { if (confirm('Eintrag löschen?')) { await Store.remove('kreis', id); location.hash = '#/kreis'; } },
    }, 'Löschen'),
  );
}
