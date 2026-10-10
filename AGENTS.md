# AGENTS.md — TI-Rechner

Referenz, um das Projekt ohne Vorwissen weiterzuführen. Hier stehen alle Entscheidungen, die mit dem Projektinhaber (Jannik Weiser, Official bei Kletterwettkämpfen) getroffen wurden. Bitte nichts davon ändern, ohne vorher nachzufragen.

## Was ist das?

Eine mobile Web-App für Schiedsrichter (JU/JP). Nach einem **Technischen Zwischenfall (TI)** gibt man ein, wo der TI passiert ist. Die App berechnet dann, wann der Athlet wieder einsteigt.
- **Lead:** Erholungszeit und Zeitpunkt des Neustarts
- **Boulder:** Rotation-Slot, Lücke an Boulder 1, sekundäre Isolation, Gutschrift

Dazu gehört [TI-Ablauf.md](TI-Ablauf.md): eine Doku, wie ein TI abläuft und wann er greift. Die Doku ist auf der Seite verlinkt.

## Repo / Deployment

- GitHub: `JannikWeiser/ti-rechner`, Branch `main`. GitHub Pages veröffentlicht aus dem Root von `main` (klassischer Pages-Build).
- Live: https://jannikweiser.github.io/ti-rechner/
- Kein Build-Schritt. Alles ist reines HTML/CSS/JS ohne externe Bibliotheken, Schriften oder Tracking.
- Lokale Vorschau: `.claude/launch.json` startet `python3 -m http.server 8765`.
- `.gitignore` schließt `Grundlagen Regelwerk/` aus. Die Regelwerk-PDFs sind urheberrechtlich geschützt, und das nationale Regelwerk ist ein Entwurf. **Sie werden nicht veröffentlicht.**

## Dateien

| Datei | Inhalt |
|---|---|
| `index.html` | Die komplette App: Tabs Lead und Boulder, Berechnungen, Countdown, localStorage (`ti.*`) |
| `TI-Ablauf.md` | Regeln und Ablauf, mit Abschnitt „Geklärte Auslegungsfragen“ |
| `TI-Procedure.md` | Englische Fassung von `TI-Ablauf.md`. **Beide Dateien immer gemeinsam pflegen** |
| `impressum.html`, `datenschutz.html` | Rechtliche Seiten, im Footer verlinkt |
| `manifest.webmanifest`, `sw.js`, `icons/` | PWA: App auf dem Homescreen und offline nutzbar |
| `Grundlagen Regelwerk/` | Quell-PDFs, nur lokal |

## Quellen (in `Grundlagen Regelwerk/`)

- World Climbing **Competition Rules** 2026: §6, §11, Definition „Technical Incident“
- **Event Regulations** 2026: Annex A (Lead) §8, Annex C (Boulder) §8
- **Judge Guide** 2026 (V0.1): §2.16 (Lead TI), §5.2 (Boulder Slot Insertion, Tabellen 2/3)
- **Amendments & Errata** (1. April 2026): nichts zum TI
- **Nationales Regelwerk Klettern**, Entwurf 27.1 (09.09.2026): §11, Anhang A §4.4 und §8, Anhang C §2, §4.7 C und §8

## Berechnungslogik

### Lead
- Erholungszeit = `min(gewertete Griffe vor dem TI, 20)` Minuten (Annex A §8.2 B). Bei „23+“ zählt 23.
- **Die Erholungszeit läuft ab dem Moment, in dem der Athlet rausfällt.** Das Eingabefeld heißt deshalb „Uhrzeit des Sturzes“ und ist beim Laden mit der aktuellen Uhrzeit vorbelegt.
- Frühester Neustart = Uhrzeit des Sturzes + Erholungszeit
- Einsetzen nach ca. `⌈Erholungszeit / Starttakt⌉` nachfolgenden Athleten (optional mit Startposition)
- **Countdown:** Startet nur per Button. Er überschreibt die Uhrzeit des Sturzes **nicht**. Beim Start zieht er die seit dem Sturz vergangene Zeit ab. **Beim Stoppen bleibt die aktuelle Zeit stehen** und springt nicht auf die volle Erholungszeit zurück. Erst wenn eine Eingabe geändert wird, zeigt er wieder die volle Erholungszeit.

### Boulder, Intervall-Format
Die Tabellen 2 und 3 im Judge Guide §5.2 lassen sich auf eine Formel bringen (geprüft an allen Zeilen für 4 und 5 Boulder):

```
k = max( p·(N−B) + p ,  2 + p·(B−1) )    p = 2 (Kletter- und Pause-Intervall wechseln sich ab)
```

- `k` = Zahl der Intervalle nach dem TI-Intervall bis zum Slot an Boulder B. Gleichzeitig ist der Slot vor dem k-ten nachfolgenden Athleten der Startliste einzufügen.
- **Lücke an Boulder 1** im Intervall `L = k − p·(B−1)`. Dort ruft die Call Zone B1 niemanden auf, und der k-te Folgende und alle nach ihm rücken ein Intervall nach.
- **Lücke an B1 wählbar (+1 oder +2):** Der JP entscheidet in der Call Zone, ob B1 schon im nächsten Intervall (+1) frei bleibt oder erst im übernächsten (+2). **Standard ist +2** wie im Judge Guide, weil der nächste Athlet meist schon aufgerufen ist. Die Auswahl wird nicht gespeichert und steht bei jedem Laden wieder auf +2. Allgemein: `k = max(p·(N−B)+p, g + p·(B−1))` mit g = 1 oder 2. Die Auswahl erscheint nur, wenn sie das Ergebnis ändert, also wenn `2 + p·(B−1) > p·(N−B)+p`; sonst liegt die Lücke ohnehin später.
- Sekundäre Isolation = `k − p·(N−B) − 2` Intervalle (das letzte Wartintervall ist die Call Zone)
- Uhrzeit: 1 Intervall = Kletterzeit + 15 s Wechselpause. Start an der Wand = Slotbeginn + (Intervall − Gutschrift).
- **B1, Szenario 1** (TI vor Intervallende behoben): Der Athlet bekommt im **nächsten** Intervall die restliche Kletterzeit an B1, hat dann **1 Intervall Pause** und geht danach an B2. Sein ganzer weiterer Ablauf verschiebt sich um ein Intervall, der Slot kommt vor den nächsten Athleten.
- **Gutschrift** = Restzeit bei Beginn des betroffenen Versuchs, angezeigt als **ca.-Wert** (§8.5).
- Grafik „Ablauf des Athleten“: Alle Kacheln sind gleich groß (54×44 px). Die obere Reihe zeigt den TI-Athleten. In der unteren Reihe erscheint **nur die Lücke** („Lücke / B1 frei“, rot gestrichelt), kein „B1 belegt“. Bei Szenario 1 gibt es keine untere Reihe. Über jeder Spalte stehen Intervall und Uhrzeit.

### Mehrere TIs (Lead & Boulder)
- Button **„+ weiterer TI“**. Ab 2 TIs erscheinen Chips („TI 2 · B3 · Pos 7“) zum Umschalten. **„Diesen TI löschen“ ist immer sichtbar.** Beim letzten TI wird das Formular geleert und ein neuer, leerer TI 1 begonnen. Ein laufender Countdown stoppt dabei, Lead setzt die Sturzzeit auf „jetzt“.
- Die TI-Nummern sind stabil. Nach dem Löschen wird nicht neu nummeriert.
- **Boulder, Rechenkern** (`computeTI`): gemeinsame Achse = Intervalle an B1 ab Rundenbeginn (0 = Startposition 1). Jeder Slot reserviert ein B1-Intervall G. Reguläre Athleten füllen die übrigen der Reihe nach (`b1Start`). Details und Formeln in [PLAN-mehrere-TIs.md](PLAN-mehrere-TIs.md). Geprüft gegen Judge Guide §5.2.3 (JENFT → vor Pos. 9, PEINADO → vor Pos. 12).
- **Startposition** = Platz in der Startliste (Spalte „Order“), **nicht** die Startnummer. Ab 2 TIs ist sie Pflicht und rutscht aus „Uhrzeit & Startliste“ nach oben ins Formular. Ohne Startposition wird ein TI ohne Wechselwirkung gerechnet, mit Hinweis.
- **Vorrang bei gleicher Lücke: wer zuerst eingetragen wurde.** Der spätere TI rückt 1 Intervall nach, mit Hinweis.
- **Ergebnisse sind fix.** Ändern oder Löschen eines TI rechnet nur diesen TI neu, die Slots der anderen bleiben. Nur geänderte Rundeneinstellungen (Boulder, Intervall, Ruhe-Intervall, Wechselpause, Vorlage) rechnen alle in Eingabereihenfolge neu. „vor Startposition X“ wird immer live aus allen Lücken berechnet.
- Automatisch erkannt: gleicher Athlet mit zweitem TI (der Slot kommt nach allem Geplanten), TI im eigenen Nachhol-Slot, Szenario 1 nicht möglich, weil das nächste B1-Intervall reserviert ist.
- **Späte Entscheidung:** Maßgeblich ist der Moment, in dem die Startzeit des TI-Intervalls eingegeben wird (`decidedAt`, pro TI gespeichert). Liegt er bis zu **3 h** nach dieser Startzeit und ist das TI-Intervall schon vorbei, zählt die Lücke ab dem dann laufenden Intervall (+1/+2), mit Hinweis. Bei mehr als 3 h gilt es als nachträgliche Eingabe und wird ignoriert. Späteres Neuberechnen, z. B. bei geänderten Rundeneinstellungen, nutzt den gespeicherten `decidedAt` und verschiebt nichts nachträglich.
- **2 Kurse:** Bei der Vorlage „DJC Flash 2×3“ gibt es pro TI den Schalter Kurs A/B. Nur TIs auf demselben Kurs beeinflussen sich. Die Lücken-Karte ist nach Kurs gruppiert.
- Karte **„Lücken an Boulder 1“** (ab 2 TIs): alle Lücken sortiert mit Uhrzeit, „vor Pos. X“, TI, Rundenverlängerung („+n Intervalle, ca. m:ss min“) und dem Link „Alle TIs der Runde zurücksetzen“.
- Grafik: **Grüner Rand um das Intervall, das gerade läuft.** Es wird live aus der Startzeit des TI-Intervalls, der Intervalldauer inkl. Wechselpause und der Countdown-Verschiebung berechnet. Zwischen den Bouldern steht **„CZ B(nächster)“** statt „Pause“. Laut Judge Guide §5.2.3 ist das die Call Zone des nächsten Boulders. Fremde Lücken erscheinen grau gestrichelt („TI 2“). Eigene weitere Slots stehen als grüne Kachel „TI n“.
- Countdown Boulder: alle TIs zusammen, mit „TI n:“ markiert, sobald es mehr als einen gibt. Uhrzeiten von TIs ohne eigene Startzeit leitet er von einem anderen TI auf derselben Achse ab.
- **Lead:** Jeder TI hat eigene Griffe, eigene Sturzzeit, eigene Startposition und einen eigenen Countdown (Start und Stopp je TI). Ab 2 TIs zeigt die Countdown-Karte eine Liste aller TIs (läuft / gestoppt / nicht gestartet). Der Starttakt gilt für alle.
- **World Series:** Bei mehreren TIs gilt nur der Hinweis „nacheinander in der Reihenfolge, in der sie passiert sind“.
- Speicherung: `ti.boulderTIs`, `ti.boulderSel`, `ti.leadTIs`, `ti.leadSel`, `ti.leadGap` in localStorage. Bei einem einzelnen Lead-TI ohne Countdown wird die Sturzzeit beim Laden wie früher auf „jetzt“ gesetzt.

### Boulder, Live-Countdown
- Erscheint nur im Intervall-Format und nur, wenn die **Startzeit des TI-Intervalls** eingegeben ist. Sonst zeigt die Karte einen Button „Startzeit eingeben“.
- Meilensteine: „Boulder 1 bleibt frei (Lücke)“, „Athlet in die Call Zone für Boulder B“ (nur wenn er dazwischen wartet), „Slot-Intervall beginnt“ und „Athlet an Boulder B (Restzeit)“. Bei Szenario 1: „Intervall mit Restzeit an B1 beginnt“ und „Athlet an Boulder 1“.
- Der nächste Schritt steht groß oben, erledigte werden durchgestrichen. Der Countdown läuft automatisch.
- „Zeitplan verschieben“ in ±15-s-Schritten, wenn die Runde hinterherläuft. Das gilt nur für den Countdown und wird bei einer neuen Startzeit zurückgesetzt.
- **Kein Ton und keine Vibration** (ausdrücklich so entschieden). Der Bildschirm bleibt an (Wake Lock).

### Boulder, World Series / Classic
- **Hier wird nichts berechnet, die App zeigt nur einen Hinweis:** Wiedereinstieg **immer nach Ende der laufenden Rotation**, als einziger Athlet, die Gruppe wartet. Gutschrift ca. Restzeit bei Versuchsbeginn.
- In diesem Format sind die Eingaben (Vorlage, Anzahl Boulder, Intervall, „Wo war der TI?“) und die Grafik ausgeblendet.

## Geklärte Regelauslegungen (vom Projektinhaber entschieden)

| Frage | Entscheidung |
|---|---|
| Lead: Ab wann läuft die Erholungszeit? | Ab dem Moment, in dem der Athlet rausfällt bzw. am Boden ist |
| Boulder: Zählt der TI-Versuch? | Einzelfall, der JP entscheidet. **Für die Berechnung irrelevant, deshalb fragt die App die Versuchsnummer nicht ab** |
| Boulder: Höhe der Gutschrift | Restzeit bei Versuchsbeginn, als ca.-Wert |
| Boulder 1, Szenario 1 | Nächstes Intervall Restzeit an B1 → 1 Intervall Pause → B2 |
| Runden mit 2 Kursen (z. B. DJC Flash 2×3) | Die Verschiebung betrifft nur den betroffenen Kurs. Kein eigener Schalter, nur ein Hinweis: „Anzahl Boulder = Boulder des betroffenen Kurses“ |
| Lead-Quali mit 2 Routen | Kein Einfluss auf die Berechnung. In der Doku steht der Hinweis auf 50 min bis Route 2 (Anhang A §4.4). **Die Routen-Buttons wurden auf Wunsch wieder entfernt** |
| World Series / Classic | Immer nach Ende der laufenden Rotation, nur als Hinweis |

## Zweisprachigkeit (DE/EN)

- **Standard:** Gerätesprache Deutsch (`de`, `de-DE`, `de-AT` …) ergibt Deutsch, **jede andere Sprache Englisch**. Maßgeblich ist der erste Eintrag in `navigator.languages`.
- Der Umschalter oben rechts („EN“/„DE“) überschreibt das. Die Wahl wird in `ti.lang` gespeichert und gilt auch für Impressum und Datenschutz.
- Texte stehen im Wörterbuch `I18N` (index.html) mit den Teilen `de` und `en`. Texte mit Zahlen sind Funktionen (`t('plusK', 8)`). Statische Elemente werden über `data-i18n`, `data-i18n-html` (nur feste Texte), `data-i18n-ph` und `data-i18n-aria` übersetzt.
- **Hinweise im Boulder-Ergebnis werden als Code gespeichert** (`{k:'pushed', n, l}`, `{k:'late', g}`, `{k:'sc1Blocked', no}`, `{k:'sc1Late'}`, `{k:'inSlot', no}`) und erst bei der Anzeige übersetzt. So bleiben fixe Ergebnisse in beiden Sprachen lesbar. Ältere Hinweise als deutscher Text werden unverändert angezeigt.
- Der gestoppte Lead-Countdown wird als Sekunden gespeichert (`cdFrozen`), nicht als Text. Alte Text-Werte („6:58“, „Bereit ✓“) werden beim Laden umgerechnet.
- Englische Begriffe: Intervall → **rotation**, Erholungszeit → **recovery period**, Gutschrift → **time credit**, Lücke → **gap**, Sek. Isolation → **secondary isolation**, Startposition → **start position** (Spalte „Order“, nicht Bib), Jury-Präsident → **Jury President**.
- Impressum/Datenschutz: deutscher und englischer Text in einer Datei (`data-lang`). Die englische Fassung hat den Hinweis „German version is legally binding“.
- Das Manifest (App-Name auf dem Homescreen) bleibt „TI-Rechner“.

## UI-Entscheidungen

- Mobile first (375 px), helles und dunkles Theme (Button oben rechts, gespeichert in `ti.theme`)
- **Orange Ergebniskästen zeigen nur berechnete Werte.** Keine To-Do-Listen, keine Angaben zur Wertung, keine Paragraphen-Verweise. Der Schiedsrichter kennt die Regeln und soll nicht verwirrt werden.
- Formatnamen wie im Regelwerk: **„Intervall“** (nicht „Intervall fix“) und **„World Series / Classic“** (nicht „Max-Rotation“)
- **±-Stepper einheitlich** an allen Zahlenfeldern: Griffe, Starttakt, Startpositionen, Anzahl Boulder, Intervall (0,5er-Schritte), Restzeit (15-s-Schritte). Uhrzeitfelder haben keine Stepper.
- Vorlagen (nur im Intervall-Format): DM Quali 5×5 min, DM Semi 4×5 min, DJC Finale 4×4 min, DJC Quali Flash 2×3 4 min (je Kurs), Eigene. Für World Series gibt es keine Vorlage, weil immer dasselbe herauskommt.
- Footer: nur der Hinweis „Der Rechner ist eine Hilfe – die Entscheidung trifft der Jury-Präsident“, der Link zur TI-Doku (GitHub-Ansicht der `TI-Ablauf.md`), Impressum und Datenschutz. **Keine Quellenliste.**
- **Die Funktion „Zusammenfassung kopieren“ wurde auf Wunsch entfernt.**
- Keine Erklär-Hinweise mit Regelbezug an den Eingabefeldern, z. B. „Szenario 1 im Judge Guide“ oder „daraus ergibt sich die Gutschrift (§8.5)“

## PWA / Offline

- `manifest.webmanifest`: Name „TI-Rechner“, standalone, Farbe #f97316, Icons 192/512 (maskable) und `apple-touch-icon.png` (180). Die Icons sind mit ImageMagick erzeugt (orange Fläche, weißes „TI“ in Arial Bold).
- `sw.js`: **Network first.** Mit Internet kommt immer die neueste Version, ohne Internet die Version aus dem Cache. Bei neuen Dateien die Liste `FILES` ergänzen. Den Cache-Namen (`ti-rechner-vN`) erhöhen, wenn alte Caches entfernt werden sollen.
- Registriert in `index.html`, `impressum.html` und `datenschutz.html`.

## Sicherheit & Robustheit

- **Eingaben normalisieren:** Startposition nur als ganze Zahl von 1 bis 9999 (`posInt`/`posStr`). Uhrzeiten nur im Format `hh:mm(:ss)` (`timeStr`). Negative Restzeiten sind ungültig (`parseMS` → NaN, es erscheint ein Hinweis).
- **localStorage wird beim Laden geprüft:** Alle TI-Felder werden validiert. Gespeicherte Boulder-Ergebnisse werden **übernommen, nicht neu berechnet** (sonst wären die fixen Slots nach einem Neuladen anders), aber nur, wenn sie strukturell gültig sind. Fehlende Ergebnisse werden einzeln berechnet, nie per `recomputeAll`.
- Lead-Countdowns vom Vortag laufen nicht weiter (`cdDay`), weil die Zeiten als Sekunden seit Mitternacht gespeichert sind.
- **Ausgabe escapen:** Alle Texte aus Speicher oder Eingaben gehen durch `esc()`, bevor sie in `innerHTML` landen (Hinweise, Chips, Countdown-Labels).
- **CSP** per Meta-Tag in allen drei Seiten: nur eigene Quellen, keine externen Skripte, `object-src 'none'`, `base-uri 'none'`, `form-action 'none'`. Dazu `referrer: no-referrer`.
- `b1Start` läuft ohne feste Obergrenze und endet nach spätestens P + (Anzahl Lücken) Schritten. Früher brach die Schleife nach 5000 Schritten ab und lieferte falsch 0.
- **Takt:** Der 500-ms-Takt aktualisiert nur den sichtbaren Reiter und pausiert bei verstecktem Browser-Tab. Eingaben aktualisieren die Anzeige **immer sofort** (`tickLead()`/`bTick()` direkt, ohne Sichtbarkeitsprüfung).
- **Service Worker:** network first mit **3 s Zeitlimit**. Bei schlechtem Hallen-WLAN kommt dann die gespeicherte Version. Gespeichert werden nur eigene, vollständige Antworten (`res.type === 'basic'`). Cache-Name derzeit `ti-rechner-v3`.

## Impressum / Datenschutz

- Daten wie in den anderen Projekten (EYCH-Plakatgenerator): Jannik Weiser, Ilsungstraße 15b, 86161 Augsburg, info@comptools.cloud. Rechtsgrundlagen: § 5 DDG und § 18 Abs. 2 MStV.
- Datenschutz nach dem Aufbau von comptools.cloud: Hosting über GitHub Pages, keine Cookies und kein Tracking, localStorage nur lokal auf dem Gerät.

## Arbeitsweise

- Unklare oder widersprüchliche Regelstellen **nachfragen**, nicht raten. Der Projektinhaber klärt die Auslegung.
- Nach jeder Änderung `TI-Ablauf.md` (Abschnitt 5) und diese Datei aktualisieren.
- Änderungen im Browser auf Handygröße prüfen, danach committen und auf `main` pushen.

## Ideen / Roadmap (Stand 10.10.2026)

| # | Idee | Status |
|---|---|---|
| 1 | Lead-Neustart mit Startliste (Namen statt „nach ca. X Athleten“) | Erst wenn es in einem anderen Tool eingebaut ist |
| 2 | Boulder-Startliste mit Namen („Lücke vor MÜLLER“) | Erst wenn es in einem anderen Tool eingebaut ist |
| 3 | **Mehrere TIs gleichzeitig** (Slots verschieben sich gegenseitig, Judge Guide §5.2.3) | **Umgesetzt** nach [PLAN-mehrere-TIs.md](PLAN-mehrere-TIs.md) |
| 4 | Einsprüche wie TI behandeln | **Abgelehnt**, bleibt so (rechnerisch identisch) |
| 5 | Offline-Nutzung als App (PWA) | **Umgesetzt** |
| 6 | Live-Countdown für Boulder | **Umgesetzt**, ohne Ton und Vibration |
| 7 | Verbindung zu Callzone-Management / Lead-Uhr | Eventuell später |
| 8 | TI-Protokoll | **Abgelehnt** |
