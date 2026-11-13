// Optionale App-Sperre per PIN. Sichtschutz, keine Verschlüsselung.
import { el } from './ui.js';
import { allesLoeschen } from './daten.js';

async function sha256(text) {
  const daten = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', daten);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function pinErstellen(pin) {
  const salz = [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, '0')).join('');
  return { salz, hash: await sha256(salz + pin) };
}

export async function pinPruefen(pin, gespeichert) {
  return (await sha256(gespeichert.salz + pin)) === gespeichert.hash;
}

export const pinMoeglich = () => !!(window.crypto && crypto.subtle);

// Zeigt die Sperre und wartet, bis die richtige PIN eingegeben wurde.
export function sperre(gespeichert) {
  return new Promise((entsperrt) => {
    const eingabe = el('input', { type: 'password', inputmode: 'numeric', autocomplete: 'off', 'aria-label': 'PIN', class: 'pin-feld', maxlength: '8' });
    const fehler = el('p', { class: 'hinweis', role: 'status' });
    const form = el('form', { class: 'formular' }, eingabe, fehler,
      el('button', { type: 'submit', class: 'btn btn-primaer btn-breit' }, 'Entsperren'));
    const vergessen = el('button', {
      type: 'button', class: 'text-btn',
      onclick: () => {
        if (!confirm('PIN vergessen? Die PIN lässt sich nur entfernen, indem alle Daten in dieser App gelöscht werden. Wirklich alles löschen?')) return;
        allesLoeschen();
        location.reload();
      },
    }, 'PIN vergessen');
    const huelle = el('div', { class: 'sperre' },
      el('div', { class: 'sperre-inhalt' },
        el('h1', {}, 'Durch'),
        el('p', { class: 'leise' }, 'PIN eingeben'),
        form, vergessen,
        el('p', { class: 'leise klein' }, 'Sichtschutz, keine Verschlüsselung.')));
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (await pinPruefen(eingabe.value, gespeichert)) { huelle.remove(); entsperrt(); return; }
      fehler.textContent = 'Die PIN stimmt nicht.';
      eingabe.value = '';
      eingabe.focus();
    });
    document.body.append(huelle);
    eingabe.focus();
  });
}
