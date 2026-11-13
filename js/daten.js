// Export/Import aller Daten und Kalender-Erinnerungen (.ics)
import { download } from './ui.js';

const PREFIX = 'durch:';

export function exportiere() {
  const daten = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k.startsWith(PREFIX)) {
      try { daten[k.slice(PREFIX.length)] = JSON.parse(localStorage.getItem(k)); } catch { /* überspringen */ }
    }
  }
  const datei = { app: 'durch', version: 1, exportiert: new Date().toISOString(), daten };
  const tag = new Date().toISOString().slice(0, 10);
  download(`durch-export-${tag}.json`, JSON.stringify(datei, null, 2), 'application/json');
}

export async function importiere(datei) {
  const text = await datei.text();
  const inhalt = JSON.parse(text);
  if (!inhalt || inhalt.app !== 'durch' || typeof inhalt.daten !== 'object') throw new Error('Das ist keine Export-Datei von Durch.');
  const alt = [];
  for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith(PREFIX)) alt.push(k); }
  alt.forEach((k) => localStorage.removeItem(k));
  for (const [k, v] of Object.entries(inhalt.daten)) localStorage.setItem(PREFIX + k, JSON.stringify(v));
}

export function allesLoeschen() {
  const alt = [];
  for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith(PREFIX)) alt.push(k); }
  alt.forEach((k) => localStorage.removeItem(k));
}

const zweistellig = (n) => String(n).padStart(2, '0');
function icsZeit(d) {
  return `${d.getFullYear()}${zweistellig(d.getMonth() + 1)}${zweistellig(d.getDate())}T${zweistellig(d.getHours())}${zweistellig(d.getMinutes())}00`;
}

// Täglicher Termin (lokale Uhrzeit) als .ics
export function kalenderTermin({ titel, uhrzeit, dauerMin, beschreibung, dateiname }) {
  const [h, m] = uhrzeit.split(':').map(Number);
  const start = new Date();
  start.setHours(h, m, 0, 0);
  if (start < new Date()) start.setDate(start.getDate() + 1);
  const ende = new Date(start.getTime() + dauerMin * 60000);
  const jetzt = new Date();
  const utc = `${jetzt.getUTCFullYear()}${zweistellig(jetzt.getUTCMonth() + 1)}${zweistellig(jetzt.getUTCDate())}T${zweistellig(jetzt.getUTCHours())}${zweistellig(jetzt.getUTCMinutes())}00Z`;
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Durch//DE', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}@durch`,
    `DTSTAMP:${utc}`,
    `DTSTART:${icsZeit(start)}`,
    `DTEND:${icsZeit(ende)}`,
    'RRULE:FREQ=DAILY',
    `SUMMARY:${titel}`,
    `DESCRIPTION:${beschreibung}`,
    'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${titel}`, 'TRIGGER:PT0M', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR', '',
  ].join('\r\n');
  download(dateiname, ics, 'text/calendar');
}
