// Feste Inhalte und Texte.
// Fachliche Texte sind mit ENTWURF markiert – Uli prüft und gibt sie frei.

export const WERKZEUGE = [
  { id: 'verstehen', name: 'Verstehen (Teufelskreis)' },
  { id: 'beobachten', name: 'Beobachten (Akut)' },
  { id: 'sorgenzeit', name: 'Sorgenzeit' },
  { id: 'zuEndeDenken', name: 'Zu-Ende-Denken' },
  { id: 'benennen', name: 'Benennen (Defusion)' },
  { id: 'befuerchtungsCheck', name: 'Befürchtungs-Check' },
  { id: 'angstleiter', name: 'Angstleiter' },
  { id: 'koerperuebung', name: 'Körperübung' },
  { id: 'sicherheitsverhalten', name: 'Sicherheitsverhalten weglassen' },
];

export const GEFUEHLSWOERTER = [
  'Angst', 'Unruhe', 'Anspannung', 'Panik', 'Beklemmung', 'Unsicherheit',
  'Überforderung', 'Scham', 'Ärger', 'Traurigkeit', 'Leere',
];

export const KOERPERSTELLEN = [
  'Brust', 'Herz', 'Hals', 'Bauch', 'Kopf', 'Atmung', 'Hände', 'Beine', 'ganzer Körper',
];

export const VERGLEICH = ['stärker', 'gleich', 'schwächer', 'anders'];

// ENTWURF – sachliche Sätze für den Akut-Modus. Keine Entwarnung, keine Versprechen.
export const STANDARD_AKUT_SAETZE = [
  'Das ist Adrenalin. Es ist unangenehm, nicht gefährlich.',
  'Herzrasen, Schwindel, Kribbeln, Enge in der Brust: typische Körperreaktionen bei Angst.',
  'Du musst die Angst nicht wegmachen. Du kannst beobachten, was sie tut.',
  'Ein Gedanke ist ein Gedanke, auch wenn er sich dringend anfühlt.',
  'Das Gefühl darf da sein. Du entscheidest trotzdem, was du tust.',
];

// Atemführung: Inhalt laut Vorgabe (langsam, eher flach, Ausatmen länger als Einatmen).
export const ATEM = {
  hinweis: 'Langsam und eher flach atmen. Ausatmen länger als Einatmen.',
  einSek: 4,
  ausSek: 6,
};

export const HILFE = {
  telefonseelsorge: ['0800 111 0 111', '0800 111 0 222'],
  notruf: '112',
};

// ENTWURF – einmaliger Hinweis beim ersten Start.
export const ERSTSTART_HINWEIS = [
  'Durch ist ein Übungsweg für den Umgang mit Angst.',
  'Die App ersetzt keine Therapie und stellt keine Diagnosen. Hausarzt oder Psychotherapie sind Ansprechpartner, wenn du Unterstützung brauchst.',
  'Den Hilfe-Button mit Notrufnummern findest du auf jeder Seite unten rechts.',
];

export const EINSTELLUNGEN_STANDARD = {
  theme: 'hell',            // hell | dunkel | system
  atemOption: true,         // Atemführung im Akut-Modus als Option anbieten
  eigeneAkutSaetze: null,   // null = Standardsätze; sonst [{ id, text, entwurf }]
  hinweisGesehen: false,
};
