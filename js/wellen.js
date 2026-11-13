// Modul 11: Plan für Wellen
import { Store } from './store.js';
import { el, kopf, datumKurz } from './ui.js';

const FRAGEN = [
  ['anzeichen', 'Woran merke ich, dass es wieder mehr wird?'],
  ['tun', 'Was mache ich dann?'],
  ['nichtTun', 'Was mache ich dann bewusst nicht?'],
  ['ansprechpartner', 'Wer weiß Bescheid / wen kann ich ansprechen?'],
];

export async function renderWellen(main) {
  const plan = await Store.getDoc('wellenPlan', {});
  const stand = el('p', { class: 'leise klein', role: 'status' }, plan.aktualisiert ? `Zuletzt geändert: ${datumKurz(plan.aktualisiert)}` : '');
  const felder = FRAGEN.map(([key, frage]) => {
    const ta = el('textarea', { rows: '4', 'aria-label': frage }, plan[key] || '');
    return { key, frage, ta };
  });
  const form = el('form', { class: 'formular' },
    felder.map(({ frage, ta }) => el('label', { class: 'feld' }, el('span', { class: 'feld-label' }, frage), ta)),
    el('button', { type: 'submit', class: 'btn btn-primaer btn-breit' }, 'Speichern'),
    stand);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const daten = Object.fromEntries(felder.map(({ key, ta }) => [key, ta.value.trim()]));
    daten.aktualisiert = new Date().toISOString();
    await Store.setDoc('wellenPlan', daten);
    stand.textContent = `Gespeichert: ${datumKurz(daten.aktualisiert)}`;
  });
  main.append(
    kopf('Plan für Wellen'),
    el('p', { class: 'leise' }, 'Füll den Plan aus, solange es dir gut genug geht.'),
    form,
  );
}
