# Campus Koller

Ein eigenstaendiges Premium-Mini-Game ohne externe Abhaengigkeiten. Du steuerst Byte-Basti, einen ueberforderten Informatik-Studenten, durch White-Wire-Dosen, Deadline-Stapel und Modulhandbuecher.

## Starten

```sh
python3 -m http.server 8000
```

Dann im Browser oeffnen:

```text
http://localhost:8000
```

## Steuerung

- Leertaste, Pfeil nach oben oder `W`: springen
- Maus oder Trackpad: springen/starten
- `P` oder `Esc`: Pause
- `H`: How to Play

## Features

- Startscreen, How-to-Ansicht, Pause und schneller Neustart
- Humorvolle Crash-Kommentare
- Lokaler Highscore
- Freischaltbare Skins bei Score 8 und 18
- Tagesziel
- Partikeleffekte und Soundeffekte ueber AudioManager
- Modulare Struktur fuer Spiellogik, Rendering, Input, UI, Audio und Storage

## Checks

Falls Node installiert ist:

```sh
node --check src/main.js
node tests/smoke.mjs
```
