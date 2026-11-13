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
- `js/main.js` – Start und Navigation (Hash-Routing)
- `js/start.js` – Startscreen
- `js/schritte.js` – Tagesschritt und Schritte-Pool (Modul 7)
- `js/akut.js` – Akut-Modus (Modul 1)
- `js/einstellungen.js`, `js/hilfe.js`, `js/inhalte.js` – Einstellungen, Hilfe, feste Texte
- `sw.js`, `manifest.webmanifest`, `icons/` – PWA / offline

Bei Änderungen an Dateien in `sw.js` die `VERSION` erhöhen.
