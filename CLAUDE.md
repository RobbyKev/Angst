# Durch – persönliche Web-App gegen Angst

Arbeitstitel „Durch“ (Prinzip: nicht um die Angst herum, sondern durch sie hindurch). Name kann sich noch ändern.

## Zweck
Eine persönliche Web-App für Uli, um Angst über Wochen strukturiert anzugehen: verstehen, sich ihr stellen, Fortschritt sichtbar machen. Grundlage sind Prinzipien der kognitiven Verhaltenstherapie (Psychoedukation, Exposition nach dem Inhibitionslernen-Modell von Craske et al. 2014, Sorgenkonfrontation, interozeptive Exposition) sowie Elemente aus ACT (Akzeptanz, kognitive Defusion, Werte).

Abgrenzung: Uli hat bereits die App „Pause“ (Akut-Skills zum Runterkommen, Ablenkung, Einschlafen, Meditation). „Durch“ ist eigenständig und kein Skills-Baukasten, sondern ein Trainingsweg mit Verlauf. Keine Features aus Pause duplizieren (keine Meditationen, kein Schlafbereich, keine Ablenkungsspiele).

Die App ersetzt keine Therapie und stellt keine Diagnosen.

## Grundhaltung (gilt für alle Texte und Funktionen)
- Angst wird nicht bekämpft oder weggedrückt, sondern angenommen und durchlaufen. Ziel ist nicht „keine Angst mehr“, sondern: Angst darf da sein und bestimmt trotzdem nicht, was ich tue.
- Keine Wörter wie „besiegen“, „bekämpfen“, „Kampf“ in der Oberfläche.
- Die App darf selbst kein Sicherheitsverhalten werden. Sie hilft beim Durchgehen, nicht beim Wegmachen der Angst. Keine Funktion soll so gebaut sein, dass man sie braucht, um sich sicher zu fühlen.
- Keine Beruhigung, keine Entwarnung, keine Rückversicherung. Nie Sätze wie „Es passiert schon nichts“ oder „Alles wird gut“. Stattdessen Fakten und Beobachtungsfragen.
- Angstgedanken werden nicht widerlegt oder wegdiskutiert. Sie werden getestet (Befürchtung vs. Ergebnis) oder als Gedanken benannt (Defusion). Diskutieren mit der Angst führt in den nächsten Grübelkreis.
- Erfolg heißt: durchgezogen und hingeschaut. Nicht: Angst gesunken.
- Einsteigen ohne Nachholen: Verpasste Tage oder Wochen erscheinen nirgends als Lücke, Rückstand oder rote Markierung. Die App zeigt immer nur, was heute dran ist.
- Kleine Schritte zählen voll. Die Mini-Version eines Schritts ist genauso viel wert wie die normale.
- Rückschläge und Wellen sind normal und werden sachlich eingeordnet (Modul 6 und 11).

## Startscreen
1. Tagesschritt (normal / Mini, Modul 7) – steht an erster Stelle.
2. Aktuelles Wochenwerkzeug (Modul 8), mit direktem Sprung ins Modul.
3. Kleiner, unaufdringlicher Zugang zum Akut-Modus. Der Angstwert wird NICHT bei jedem Öffnen abgefragt; Eingabe nur optional per Tipp. Ständiges Messen lenkt die Aufmerksamkeit auf Symptome.
4. Navigation zu den übrigen Modulen, Mut-Buch, Wofür und Plan für Wellen.
5. Dezenter Hilfe-Button (siehe Sicherheit).
Wenig Text, viel Luft. Keine Alarmfarben.

## Abgedeckte Seiten der Angst → Module
| Seite der Angst | Modul |
|---|---|
| Panik / Körpersymptome | 1. Akut-Modus |
| Bestimmte Situationen / Vermeidung | 2. Angstleiter & Übungen |
| Grübeln & Sorgen | 3. Sorgen |
| Angst vor der Angst | 4. Körperübungen (interozeptiv) |
| verbindet alles | 5. Teufelskreis-Tagebuch, 6. Verlauf |
| Struktur & Alltag | 7. Tagesschritt, 8. Wochenwerkzeug, 9. Mut-Buch |
| Motivation & Dranbleiben | 10. Wofür, 11. Plan für Wellen |

### 1. Akut-Modus
- Ziel ist Zulassen und Beobachten, nicht Wegmachen.
- Muss offline funktionieren (siehe Technik: PWA).
- Vollbild, ruhig, wenig Text. Standardablauf „Beobachten“: Die App stellt nacheinander kurze Fragen, z. B. „Wo im Körper spürst du es?“, „Wie stark, 0–10?“, „Welches Wort passt zum Gefühl?“ (Gefühl benennen, Auswahl + Freitext), „Was macht es jetzt, im Vergleich zu vorhin?“. Nichts ist Pflicht.
- Defusions-Satz als Option: Den aktuellen Angstgedanken eintippen, die App zeigt ihn umformuliert als „Ich bemerke den Gedanken, dass …“.
- Sachliche Sätze zum Durchklicken (Beispiel-Ton: „Das ist Adrenalin. Es ist unangenehm, nicht gefährlich.“). Keine Entwarnung, keine Versprechen. Uli kann eigene Sätze ergänzen/bearbeiten.
- Atemführung nur als Option, nicht als Standard und nicht als „Rettung“ formuliert. Inhaltlich: langsam und eher flach atmen, Ausatmen länger als Einatmen. NICHT „tief durchatmen“ – tiefes Atmen kann Hyperventilation und damit Symptome verstärken. Animation respektiert prefers-reduced-motion.
- Am Ende kurze Frage: „Was ist passiert?“ Eintrag speichern. Landet im Mut-Buch als „durchgestanden“, unabhängig vom Endwert.

### 2. Angstleiter & Übungen
Aufgebaut nach den Strategien des Inhibitionslernens (Craske et al. 2014).
- Situationen anlegen: Titel, erwarteter Angstwert 0–100, Status (offen / versucht / geschafft), optional Verknüpfung zu einem Eintrag aus Modul 10.
- Liste nach Angstwert sortiert, als Leiter dargestellt. Die Reihenfolge ist eine Orientierung, kein Zwang; auch mal eine Stufe überspringen oder variieren ist erlaubt.
- Vor der Übung (Erwartung erfassen – der wichtigste Teil):
  - „Was befürchtest du konkret?“ (möglichst überprüfbar formuliert; die App gibt einen Hinweis, wenn der Text sehr vage ist, z. B. nur „schlimm“)
  - „Wie wahrscheinlich ist das? (0–100 %)“
  - Angstwert vorher.
  - Optional: „Welches Sicherheitsverhalten lässt du dieses Mal weg?“ (Auswahl aus eigener Liste, siehe Sicherheitsverhalten-Übersicht)
  - Abrufhilfe: Gab es bei dieser oder einer ähnlichen Stufe schon eine Übung, zeigt die App kurz „Was du letztes Mal gelernt hast: …“.
- Während der Übung:
  - Hinweis: Aufmerksamkeit bei der Situation lassen, nicht ablenken (kein Handy-Spiel, keine Musik zum Wegdrücken, nicht in Pause wechseln).
  - Optionale Abfrage im Intervall (Standard 5 Minuten, einstellbar, abschaltbar): Angstwert plus optional ein Wort für das Gefühl. Die Kurve wird nur gezeichnet, nicht bewertet.
  - Die Übung endet, wenn die Befürchtung überprüft ist oder die geplante Zeit um ist – nicht, wenn die Angst gesunken ist.
- Nach der Übung:
  - „Ist das Befürchtete passiert?“ (Ja / Nein / teilweise)
  - „Wie überrascht bist du? (0–10)“
  - „Was hast du gelernt?“ (kurzer Text, wird später als Abrufhilfe genutzt)
- Erfolg = Übung durchgezogen. Es gibt keine Meldung, die von einer sinkenden Kurve abhängt.
- Variation: Die App schlägt bei wiederholten Stufen vor, Kontext zu ändern (Ort, Uhrzeit, allein / begleitet, Tagesform).
- Vertiefte Übung (erst für Stufen mit Status „geschafft“): Kombination zweier Auslöser anbieten, z. B. Situation + vorher eine Körperübung aus Modul 4.
- Jede abgeschlossene Übung landet automatisch im Mut-Buch.

### 3. Sorgen
- Sorgen-Parkplatz: Gedanke schnell notieren und wegparken.
- Sorgenzeit: feste tägliche Zeit (einstellbar, Standard 20 Minuten). Geparkte Sorgen werden nacheinander durchgegangen. Vier Wege:
  - lösbar → nächster konkreter Schritt
  - nicht lösbar → bewusst ablegen
  - zu Ende denken (Sorgenkonfrontation) → die Befürchtung einmal bewusst bis zum schlimmsten Punkt durchschreiben („Und dann? Und dann?“), ohne sie abzuschwächen oder zu widerlegen. Danach: „Wie stark ist sie jetzt?“
  - benennen (Defusion) → „Ich bemerke den Gedanken, dass …“ – der Gedanke bleibt stehen, wird aber als Gedanke markiert. Optional wiederkehrenden Gedanken einen Namen geben („Ah, die Was-wäre-wenn-Schleife wieder“). Die App merkt sich diese Namen.
- Befürchtungs-Check: Befürchtung mit Datum und Wahrscheinlichkeit speichern, später Abgleich „Ist es eingetreten?“ (Ja / Nein / teilweise). Auswertung: Quote eingetroffener Befürchtungen, nüchtern dargestellt.
- Erklärkarte „Warum Widerlegen nicht funktioniert“: kurz, sachlich.

### 4. Körperübungen (interozeptiv)
- Ziel: Körpersymptome bewusst herbeiführen und erleben, dass sie ungefährlich sind.
- WICHTIG: Keine Übungen im Code vorgeben. Uli trägt die Übungen selbst ein. Die App liefert nur den Rahmen: Übung, Dauer-Timer, Erwartung vorher (wie Modul 2), Angstwert optional, Abgleich hinterher.
- Einmaliger, sachlicher Hinweis vor der ersten Körperübung: Interozeptive Übungen (z. B. absichtliches schnelles Atmen, Drehen, Treppensteigen) vorher ärztlich abklären, besonders bei Herz- oder Lungenerkrankungen, Epilepsie, Schwangerschaft oder anderen körperlichen Erkrankungen. Danach nicht mehr wiederholen.

### 5. Teufelskreis-Tagebuch
- Schneller Eintrag: Auslöser → Gedanke → Körper → Gefühl (0–100, plus Gefühlswort) → Verhalten.
- Verhalten mit Auswahl: Vermeiden, Flucht, Absichern/Kontrollieren, Rückversicherung (z. B. googeln, Puls messen, nachfragen), Aushalten, Anderes.
- Darstellung des eigenen Eintrags als Kreis-Grafik.
- Optional Defusion beim Gedanken (wie in Modul 3).
- Einträge aus anderen Modulen können verknüpft werden.

### 6. Verlauf
- Schwerpunkt auf Erwartung vs. Ergebnis: Wie oft ist das Befürchtete eingetreten? Wie hoch war die geschätzte Wahrscheinlichkeit im Vergleich?
- Kurven derselben Situation/Übung übereinandergelegt, nur als Beobachtung.
- Einfache Übersicht: Anzahl Übungen, geschaffte Stufen, wie oft Sicherheitsverhalten weggelassen wurde.
- Optionaler Monats-Check mit dem GAD-7 (7 Fragen, Werte 0–21, deutsche Version nach Löwe et al.): höchstens alle 4 Wochen anbieten, jederzeit überspringbar, Verlauf als einfache Linie. Bewertungsstufen nur sachlich anzeigen (0–4 minimal, 5–9 leicht, 10–14 mäßig, 15–21 schwer).
- Rückschläge: Wenn Werte über einige Tage höher liegen, zeigt die App einmalig einen Hinweis (Beispiel-Ton: „Schwankungen gehören dazu. Eine schlechte Phase löscht nicht, was du schon geübt hast.“) und verlinkt den Plan für Wellen. Kein Alarm, keine Wiederholung.
- Wenn der GAD-7 über zwei Monats-Checks bei 15 oder höher liegt, einmalig ein sachlicher Hinweis, dass professionelle Unterstützung (Hausarzt, Psychotherapie) eine Option ist. In den Einstellungen abschaltbar.
- Keine Gamification, keine Punkte, keine Streaks, keine Darstellung von Lücken.

### 7. Tagesschritt
- Jeden Tag ein kleiner Schritt auf dem Startscreen.
- Jeder Schritt hat zwei Varianten: normal und Mini (für Tage ohne Kraft). Uli wählt, welche er macht. Beide zählen gleich und landen im Mut-Buch.
- Schritte kommen aus einem Pool, den Uli selbst pflegt (anlegen, bearbeiten, löschen). Optional mit Modul, Werkzeug oder Wofür-Eintrag verknüpft (z. B. „nächste Stufe der Angstleiter versuchen“ / Mini: „die Stufe nur durchdenken und Befürchtung notieren“).
- Claude Code darf einen kleinen Startsatz (ca. 15 allgemeine Schritte) vorschlagen, aber erst nach Ulis Bestätigung einbauen.
- Auswahl pro Tag: passend zum aktuellen Wochenwerkzeug bevorzugt, sonst zufällig. „Anderen Schritt“ ist jederzeit möglich, ohne Kommentar.
- Nicht erledigte Schritte verfallen einfach. Kein Übertrag, kein Hinweis.

### 8. Wochenwerkzeug
- Eine Woche lang steht ein Werkzeug im Fokus: Verstehen (Teufelskreis), Beobachten (Akut), Sorgenzeit, Zu-Ende-Denken, Benennen (Defusion), Befürchtungs-Check, Angstleiter, Körperübung, Sicherheitsverhalten weglassen.
- Uli wählt das Werkzeug zu Wochenbeginn selbst (oder behält das bisherige). Keine automatische Rotation, kein Druck.
- Optional „Empfohlene Reihenfolge“ für Wochen, in denen er nicht entscheiden will: Verstehen → Beobachten → Sorgenzeit → Benennen → Befürchtungs-Check → Angstleiter → Sicherheitsverhalten weglassen → Körperübung → Zu-Ende-Denken. Die App schlägt dann das nächste Werkzeug vor; Uli kann jederzeit abweichen. Kein Fortschrittsbalken über die Reihenfolge.
- Pro Werkzeug eine kurze Erklärkarte: was es ist, warum es wirkt, wie man es übt (3–5 Sätze, nüchtern, fachlich korrekt). Uli prüft die Texte fachlich, bevor sie final sind.

### 9. Mut-Buch
- Chronologische Liste von allem, was Uli trotz Angst gemacht hat.
- Automatisch befüllt aus: erledigten Tagesschritten, abgeschlossenen Übungen (Modul 2 und 4), durchgestandenen Akut-Momenten, weggelassenem Sicherheitsverhalten.
- Zusätzlich freie Einträge („Heute habe ich trotzdem …“).
- Nüchterne Darstellung als Liste mit Datum. Kein Glückstagebuch, keine Emojis, keine Bewertung.

### 10. Wofür
- Kurze Liste: Was verbaut mir die Angst gerade? Was ist mir wichtig, was will ich (wieder) können?
- Uli formuliert alles selbst; die App gibt nur die Fragen vor.
- Stufen der Angstleiter und Tagesschritte können mit einem Eintrag verknüpft werden und zeigen ihn dann klein an („Wofür: …“).
- Bewusst schlicht, eine Seite, jederzeit bearbeitbar.

### 11. Plan für Wellen (Rückfallprophylaxe)
- Eine Seite, die Uli selbst ausfüllt, während es ihm gut genug geht:
  - Woran merke ich, dass es wieder mehr wird?
  - Was mache ich dann? (z. B. welche Werkzeuge, welche Stufe wieder üben)
  - Was mache ich dann bewusst nicht? (z. B. anfangen zu vermeiden)
  - Wer weiß Bescheid / wen kann ich ansprechen?
- Wird verlinkt aus dem Rückschlag-Hinweis (Modul 6) und ist über die Navigation erreichbar.
- Keine Vorgaben im Code außer den Fragen.

### Sicherheitsverhalten-Übersicht (Phase 5)
- Eigene Liste von Sicherheitsverhalten anlegen (z. B. Wasserflasche, nur mit Begleitung, Ausgang im Blick, Puls messen, googeln, nachfragen).
- Pro Eintrag: wie oft bei Übungen weggelassen.
- Ziel: schrittweise abbauen, nicht alles auf einmal.

## Technik
- Web-App, mobile first, auf GitHub Pages.
- Vanilla HTML/CSS/JS, gern in mehrere Dateien aufgeteilt (eine Datei pro Modul + gemeinsame Basis). Kein Build-Schritt.
- PWA: Manifest + Service Worker, installierbar auf dem Homescreen, offline nutzbar. Mindestens Akut-Modus und Plan für Wellen müssen ohne Netz funktionieren.
- Speicher: zuerst localStorage über eine gekapselte Speicher-Schicht. Später Firebase Firestore für Sync zwischen Handy und PC, mit Offline-Persistenz. Firebase-Config fragt Claude Code bei Uli ab, nicht erfinden.
- Datenschutz (wichtig, da sehr persönliche Daten):
  - Firebase nur mit Anmeldung (Firebase Auth, z. B. Google-Login).
  - Firestore Security Rules so, dass jeder Nutzer nur unter seiner eigenen uid lesen/schreiben kann. Keine offenen Test-Rules.
  - Keine Analytics, kein Tracking, keine externen Dienste außer Firebase, Google Fonts und Chart.js-CDN.
  - Optionale App-Sperre per PIN beim Öffnen (Sichtschutz, ehrlich als solcher bezeichnet, keine echte Verschlüsselung).
- Erinnerungen (Sorgenzeit, optional Tagesschritt): Web-Push auf dem iPhone funktioniert nur, wenn die App als PWA auf dem Homescreen installiert ist. Deshalb optional und erst in Phase 5; alternativ bietet die App an, einen Termin in den Kalender zu exportieren (.ics).
- Charts mit Chart.js (CDN, fest gepinnte Version) oder eigenem SVG.
- Export/Import aller Daten als JSON.
- Barrierearm: prefers-reduced-motion beachten, ausreichende Kontraste, große Touch-Ziele.

### Datenmodell (Firestore, Vorschlag)
- `situationen`: titel, angstwertErwartet, status, wofuerId, erstellt
- `uebungen`: typ (exposition | koerper | kombiniert), situationId, kontext, befuerchtung, wahrscheinlichkeit, eingetreten (ja | nein | teilweise), ueberraschung, gelernt, weggelassenesSicherheitsverhalten [ids], kurve [{minute, wert, gefuehlswort}], start, ende
- `akut`: beobachtungen [{frage, antwort}], gefuehlswort, gedanke, wertVorher, wertNachher, dauer, notiz, datum
- `sorgen`: text, status (geparkt | schritt | abgelegt | zuEndeGedacht | benannt), naechsterSchritt, zuEndeText, gedankenName, wertDanach, datum
- `gedankenNamen`: name, beispiel, anzahl
- `befuerchtungen`: text, wahrscheinlichkeit, datum, pruefDatum, eingetreten (ja | nein | teilweise | offen)
- `kreis`: ausloeser, gedanke, koerper, gefuehl, gefuehlswort, verhalten, datum, verknuepfung
- `schrittPool`: titel, normal, mini, werkzeug (optional), modulLink (optional), wofuerId (optional), aktiv
- `tagesschritte`: datum, schrittId, variante (normal | mini), erledigt
- `wochenwerkzeug`: wocheStart, werkzeug, ausEmpfehlung (bool)
- `mutbuch`: datum, text, quelle (tagesschritt | uebung | akut | sicherheitsverhalten | frei), refId
- `wofuer`: text, typ (verbaut | wichtig), erstellt
- `wellenPlan`: anzeichen, tun, nichtTun, ansprechpartner, aktualisiert
- `sicherheitsverhalten`: titel, aktiv, erstellt
- `gad7`: antworten [7], summe, datum
- `angstwerte`: wert, datum (nur optionale Eingaben vom Startscreen)
- `einstellungen`: abfrageIntervall, abfrageAktiv, sorgenzeit, sorgenzeitDauer, eigeneAkutSaetze, atemOption, gad7Aktiv, profiHinweisAktiv, pin (gehasht), empfohleneReihenfolge

## Design
- Bewusst anders als Pause: hell und warm statt dunkel.
- Farben (Vorschlag): Hintergrund Sand #F6F2EA, Text #2B2A28, Akzent Tannengrün #2F5D50, gedämpftes Rost #B5543C nur sparsam für Hervorhebungen (nicht als Alarmfarbe). Dark Mode als Option.
- Schrift: Fraunces (Überschriften), Source Sans 3 (Text), mit Fallbacks.
- Große Touch-Ziele, viel Luft, wenig gleichzeitig auf dem Screen. Im Akut-Modus fast nichts außer einer Frage oder einem Satz.

## Ton der Texte
- Du-Form, kurz, sachlich, ehrlich.
- Keine Motivationssprüche, keine Therapie-Floskeln, nichts Belehrendes.
- Keine Beruhigung oder Entwarnung, kein Widerlegen von Angstgedanken (siehe Grundhaltung). Fakten und Fragen statt Trost.
- Keine Versprechen, dass die Angst sinkt oder verschwindet.

## Sicherheit
- Dezenter, immer erreichbarer Hilfe-Button: Telefonseelsorge 0800 111 0 111 und 0800 111 0 222, Notruf 112.
- Einmaliger Hinweis beim ersten Start: Die App ersetzt keine Therapie.
- Hinweis zu Körperübungen siehe Modul 4.

## Phasen
1. Grundgerüst (Navigation, Design, Speicher-Schicht mit localStorage, PWA/offline) + Startscreen (Tagesschritt mit Pool-Verwaltung, optionaler Angstwert, Hilfe-Button) + Akut-Modus (Beobachten, Gefühl benennen, Defusions-Satz, Atmung optional)
2. Angstleiter + Übung mit Erwartung/Abgleich, Abrufhilfe, Variation und optionaler Kurve + Mut-Buch + Wofür
3. Sorgen-Modul (vier Wege inkl. Zu-Ende-Denken und Benennen, Befürchtungs-Check) + Teufelskreis-Tagebuch
4. Körperübungen + vertiefte Übungen + Wochenwerkzeug mit Erklärkarten und empfohlener Reihenfolge + Verlauf inkl. Rückschlag-Hinweis + Plan für Wellen
5. Firebase-Sync mit Auth und Security Rules, Export/Import, Sicherheitsverhalten-Übersicht, GAD-7, Erinnerungen, PIN, Feinschliff

## Arbeitsweise für Claude Code
- Immer nur eine Phase bzw. einen Schritt umsetzen, dann stoppen und kurz zusammenfassen, was zum Testen bereit ist.
- Keine Features ergänzen, die hier nicht stehen, ohne vorher zu fragen.
- Bei Unklarheiten nachfragen statt raten.
- Alle Texte in der App gegen die Grundhaltung prüfen (keine Beruhigung, kein Widerlegen, kein Kampf-Vokabular, Erfolg = durchgezogen).
- Fachliche Texte (Erklärkarten, Hinweise) als Entwurf markieren; Uli gibt sie frei.
- Auf iOS-Safari achten (z. B. einen geteilten AudioContext nutzen, Touch-Events, PWA-Eigenheiten).
