# Durch

Persönliche Web-App, um Angst über Wochen strukturiert anzugehen. Vollständige Beschreibung: [CLAUDE.md](CLAUDE.md).

## Lokal starten

Kein Build-Schritt. Einen beliebigen statischen Server im Projektordner starten, z. B.:

```
python3 -m http.server 8000
```

und http://localhost:8000 öffnen. (Service Worker und ES-Module funktionieren nicht über `file://`.)

## GitHub Pages

Settings → Pages → „Deploy from a branch“ → Branch wählen, Ordner `/ (root)`.

## Aufbau

- `index.html`, `css/style.css` – Basis und Design
- `js/store.js` – Speicher-Schicht (localStorage, später Firestore)
- `js/main.js` – Start, Navigation (Hash-Routing), PIN-Sperre
- `js/start.js` – Startscreen
- `js/akut.js` – Modul 1 Akut-Modus
- `js/leiter.js`, `js/uebung.js` – Modul 2 Angstleiter und Übungsablauf (auch Körper- und vertiefte Übung)
- `js/sorgen.js` – Modul 3 Sorgen, Sorgenzeit, Befürchtungs-Check
- `js/koerper.js` – Modul 4 Körperübungen
- `js/kreis.js` – Modul 5 Teufelskreis
- `js/verlauf.js` – Modul 6 Verlauf, GAD-7, Rückschlag- und Profi-Hinweis
- `js/schritte.js` – Modul 7 Tagesschritt und Schritte-Pool
- `js/werkzeug.js` – Modul 8 Wochenwerkzeug
- `js/mutbuch.js`, `js/wofuer.js`, `js/wellen.js` – Module 9–11
- `js/sicherheit.js` – Sicherheitsverhalten-Übersicht
- `js/daten.js`, `js/pin.js` – Export/Import, Kalender (.ics), PIN
- `js/inhalte.js` – feste Texte (Entwürfe markiert), `js/chart.js` – SVG-Grafiken
- `sw.js`, `manifest.webmanifest`, `icons/` – PWA / offline

Bei Änderungen an Dateien in `sw.js` die `VERSION` erhöhen.

## Noch offen

- Firebase-Sync (braucht die Firebase-Config)
- Startsatz für den Schritte-Pool (wartet auf Freigabe)
