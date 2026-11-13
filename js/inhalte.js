// Feste Inhalte und Texte.
// Fachliche Texte sind mit ENTWURF markiert – Uli prüft und gibt sie frei.

export const WERKZEUGE = [
  { id: 'verstehen', name: 'Verstehen (Teufelskreis)', link: '#/kreis' },
  { id: 'beobachten', name: 'Beobachten (Akut)', link: '#/akut' },
  { id: 'sorgenzeit', name: 'Sorgenzeit', link: '#/sorgen' },
  { id: 'zuEndeDenken', name: 'Zu-Ende-Denken', link: '#/sorgen' },
  { id: 'benennen', name: 'Benennen (Defusion)', link: '#/sorgen' },
  { id: 'befuerchtungsCheck', name: 'Befürchtungs-Check', link: '#/befuerchtungen' },
  { id: 'angstleiter', name: 'Angstleiter', link: '#/leiter' },
  { id: 'koerperuebung', name: 'Körperübung', link: '#/koerper' },
  { id: 'sicherheitsverhalten', name: 'Sicherheitsverhalten weglassen', link: '#/sicherheitsverhalten' },
];

export const EMPFOHLENE_REIHENFOLGE = [
  'verstehen', 'beobachten', 'sorgenzeit', 'benennen', 'befuerchtungsCheck',
  'angstleiter', 'sicherheitsverhalten', 'koerperuebung', 'zuEndeDenken',
];

// ENTWURF – Erklärkarten pro Werkzeug: was es ist, warum es wirkt, wie man es übt.
export const ERKLAERKARTEN = {
  verstehen: [
    'Angst läuft oft als Kreis ab: Ein Auslöser führt zu einem Gedanken, der Körper reagiert, das Gefühl wird stärker, und du tust etwas, um es zu beenden.',
    'Vermeiden und Absichern bringen kurzfristig Erleichterung. Dadurch lernt das Gehirn aber nie, ob die Befürchtung stimmt, und der Kreis bleibt bestehen.',
    'Üben heißt: Situationen im Teufelskreis-Tagebuch festhalten, sobald es geht, und schauen, an welcher Stelle du etwas anders machen könntest.',
  ],
  beobachten: [
    'Beobachten heißt, die Angst wahrzunehmen, ohne sie wegzumachen: Wo sitzt sie, wie stark ist sie, wie verändert sie sich?',
    'Wer versucht, Körpersymptome wegzudrücken, richtet noch mehr Aufmerksamkeit auf sie. Beim Beobachten erlebst du, wie sich die Angst verhält, wenn du nichts gegen sie tust.',
    'Üben heißt: Beim nächsten Anflug den Akut-Modus öffnen und die Fragen durchgehen, ohne dass etwas dabei herauskommen muss.',
  ],
  sorgenzeit: [
    'Die Sorgenzeit ist ein fester Termin am Tag, an dem du dich bewusst mit deinen Sorgen beschäftigst.',
    'Sorgen, die tagsüber auftauchen, parkst du bis dahin. So lernst du, dass du einen Sorgengedanken aufschieben kannst, statt ihm sofort nachzugehen.',
    'Üben heißt: Sorgen kurz notieren und parken, und in der Sorgenzeit jede einzeln durchgehen.',
  ],
  zuEndeDenken: [
    'Beim Zu-Ende-Denken schreibst du eine Befürchtung bewusst bis zum schlimmsten Punkt durch, ohne sie abzuschwächen oder zu widerlegen.',
    'Sorgen springen meist kurz vor dem schlimmsten Bild weg zum nächsten Gedanken. Dadurch bleibt das Bild bedrohlich. Wer bewusst dabei bleibt, gewöhnt sich an die Vorstellung.',
    'Üben heißt: In der Sorgenzeit eine Sorge wählen und mit „Und dann?“ so lange weiterschreiben, bis es nicht weitergeht.',
  ],
  benennen: [
    'Beim Benennen markierst du einen Angstgedanken als Gedanken: „Ich bemerke den Gedanken, dass …“.',
    'Der Gedanke wird dabei nicht widerlegt. Er bleibt stehen, bekommt aber Abstand. Du musst nicht mit ihm diskutieren, um weiterzumachen.',
    'Üben heißt: Wiederkehrende Gedanken benennen und ihnen gern einen Namen geben, z. B. „die Was-wäre-wenn-Schleife“.',
  ],
  befuerchtungsCheck: [
    'Beim Befürchtungs-Check schreibst du eine Befürchtung konkret auf, schätzt ihre Wahrscheinlichkeit und prüfst später, ob sie eingetreten ist.',
    'Angst überschätzt oft, wie wahrscheinlich etwas ist. Der Abgleich mit dem tatsächlichen Ergebnis gibt dem Gehirn neue Erfahrungen statt neuer Argumente.',
    'Üben heißt: Befürchtungen mit Prüfdatum notieren und den Abgleich ehrlich eintragen, auch wenn etwas eingetreten ist.',
  ],
  angstleiter: [
    'Die Angstleiter ist eine Liste von Situationen, die du meidest, sortiert nach der erwarteten Angst.',
    'In der Übung prüfst du eine konkrete Befürchtung in der echten Situation. Das Lernen entsteht aus dem Unterschied zwischen Erwartung und Ergebnis, nicht daraus, dass die Angst sinkt.',
    'Üben heißt: Eine Stufe wählen, die Befürchtung vorher aufschreiben, in der Situation bleiben, bis sie überprüft ist, und hinterher festhalten, was du gelernt hast.',
  ],
  koerperuebung: [
    'Bei Körperübungen führst du gefürchtete Körperempfindungen absichtlich herbei, z. B. Herzklopfen oder Schwindel.',
    'Wer Angst vor der Angst hat, reagiert auf harmlose Körpersignale mit Alarm. Durch das absichtliche Herbeiführen erlebst du, was mit den Empfindungen tatsächlich passiert.',
    'Üben heißt: Eine selbst eingetragene Übung wählen, die Befürchtung vorher notieren, die Zeit durchziehen und hinterher abgleichen. Vorher ärztlich abklären.',
  ],
  sicherheitsverhalten: [
    'Sicherheitsverhalten sind kleine Dinge, die du tust, damit die Angst erträglich bleibt, z. B. eine Wasserflasche dabeihaben oder den Ausgang im Blick behalten.',
    'Sie verhindern, dass du erlebst, wie es ohne sie ausgeht. Das Gehirn schreibt das Ergebnis dann dem Sicherheitsverhalten zu, nicht dir.',
    'Üben heißt: Eins nach dem anderen bei Übungen bewusst weglassen, nicht alles auf einmal.',
  ],
};

export const VERHALTEN = ['Vermeiden', 'Flucht', 'Absichern/Kontrollieren', 'Rückversicherung', 'Aushalten', 'Anderes'];

export const KONTEXTE = ['anderer Ort', 'andere Uhrzeit', 'allein', 'begleitet', 'andere Tagesform'];

// ENTWURF
export const WIDERLEGEN_KARTE = [
  'Wenn du versuchst, einen Angstgedanken mit Argumenten zu widerlegen, findet die Angst meist ein neues „Aber was, wenn …“.',
  'Das Diskutieren hält den Gedanken im Mittelpunkt und wird selbst zum Grübeln. Beruhigung wirkt dabei nur kurz und muss immer wieder neu geholt werden.',
  'Hilfreicher ist, den Gedanken zu prüfen (Befürchtungs-Check) oder ihn als Gedanken zu benennen und stehen zu lassen.',
];

// ENTWURF
export const KOERPER_HINWEIS = 'Interozeptive Übungen (z. B. absichtliches schnelles Atmen, Drehen, Treppensteigen) bitte vorher ärztlich abklären, besonders bei Herz- oder Lungenerkrankungen, Epilepsie, Schwangerschaft oder anderen körperlichen Erkrankungen.';

// ENTWURF
export const RUECKSCHLAG_HINWEIS = 'Deine Werte liegen seit ein paar Tagen höher. Schwankungen gehören dazu. Eine schlechte Phase löscht nicht, was du schon geübt hast.';

// ENTWURF
export const PROFI_HINWEIS = 'Dein GAD-7-Wert lag in den letzten zwei Monats-Checks bei 15 oder höher. Professionelle Unterstützung, z. B. über die Hausarztpraxis oder eine Psychotherapie, ist eine Option.';

// ENTWURF
export const UEBUNG_HINWEIS = 'Lass die Aufmerksamkeit bei der Situation. Nicht ablenken: kein Handy-Spiel, keine Musik zum Wegdrücken, nicht in Pause wechseln.';

export const VAGE_WOERTER = /^(schlimm|sehr schlimm|furchtbar|schrecklich|katastrophe|katastrophal|irgendwas|irgendetwas|etwas schlimmes|was schlimmes|alles|keine ahnung|panik|angst)$/i;

// GAD-7, deutsche Version nach Löwe et al. (2008). Itemwortlaut bitte gegen die Vorlage prüfen.
export const GAD7 = {
  einleitung: 'Wie oft fühlten Sie sich im Verlauf der letzten 2 Wochen durch die folgenden Beschwerden beeinträchtigt?',
  fragen: [
    'Nervosität, Ängstlichkeit oder Anspannung',
    'Nicht in der Lage sein, Sorgen zu stoppen oder zu kontrollieren',
    'Übermäßige Sorgen bezüglich verschiedener Angelegenheiten',
    'Schwierigkeiten zu entspannen',
    'Rastlosigkeit, so dass Stillsitzen schwerfällt',
    'Schnelle Verärgerung oder Gereiztheit',
    'Gefühl der Angst, so als würde etwas Schlimmes passieren',
  ],
  antworten: ['Überhaupt nicht', 'An einzelnen Tagen', 'An mehr als der Hälfte der Tage', 'Beinahe jeden Tag'],
  stufe(summe) {
    if (summe <= 4) return 'minimal';
    if (summe <= 9) return 'leicht';
    if (summe <= 14) return 'mäßig';
    return 'schwer';
  },
};

export const MODUL_LINKS = [
  ['#/leiter', 'Angstleiter'],
  ['#/sorgen', 'Sorgen'],
  ['#/befuerchtungen', 'Befürchtungs-Check'],
  ['#/kreis', 'Teufelskreis'],
  ['#/koerper', 'Körperübungen'],
  ['#/akut', 'Akut-Modus'],
  ['#/sicherheitsverhalten', 'Sicherheitsverhalten'],
  ['#/wofuer', 'Wofür'],
  ['#/wellen', 'Plan für Wellen'],
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
  abfrageAktiv: true,       // Angstwert-Abfrage während Übungen
  abfrageIntervall: 5,      // Minuten
  sorgenzeit: '18:00',
  sorgenzeitDauer: 20,      // Minuten
  tagesschrittZeit: '09:00',
  empfohleneReihenfolge: false,
  gad7Aktiv: true,
  profiHinweisAktiv: true,
  profiHinweisGezeigt: false,
  gad7UebersprungenAm: null,
  rueckschlagGezeigtAm: null,
  koerperHinweisGesehen: false,
  pin: null,                // { salz, hash }
};
