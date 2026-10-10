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
| `impressum.html`, `datenschutz.html` | Rechtliche Seiten, im Footer verlinkt |
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
- **Countdown:** Startet nur per Button. Er überschreibt die Uhrzeit des Sturzes **nicht**. Beim Start zieht er die seit dem Sturz vergangene Zeit ab. Er lässt sich stoppen.

### Boulder, Intervall-Format
Die Tabellen 2 und 3 im Judge Guide §5.2 lassen sich auf eine Formel bringen (geprüft an allen Zeilen für 4 und 5 Boulder):

```
k = max( p·(N−B) + p ,  2 + p·(B−1) )    p = 2 (Kletter- und Pause-Intervall wechseln sich ab)
```

- `k` = Zahl der Intervalle nach dem TI-Intervall bis zum Slot an Boulder B. Gleichzeitig ist der Slot vor dem k-ten nachfolgenden Athleten der Startliste einzufügen.
- **Lücke an Boulder 1** im Intervall `L = k − p·(B−1)`. Dort ruft die Call Zone B1 niemanden auf, und der k-te Folgende und alle nach ihm rücken ein Intervall nach.
- Sekundäre Isolation = `k − p·(N−B) − 2` Intervalle (das letzte Wartintervall ist die Call Zone)
- Uhrzeit: 1 Intervall = Kletterzeit + 15 s Wechselpause. Start an der Wand = Slotbeginn + (Intervall − Gutschrift).
- **B1, Szenario 1** (TI vor Intervallende behoben): Der Athlet bekommt im **nächsten** Intervall die restliche Kletterzeit an B1, hat dann **1 Intervall Pause** und geht danach an B2. Sein ganzer weiterer Ablauf verschiebt sich um ein Intervall, der Slot kommt vor den nächsten Athleten.
- **Gutschrift** = Restzeit bei Beginn des betroffenen Versuchs, angezeigt als **ca.-Wert** (§8.5).
- Grafik „Ablauf des Athleten“: Die obere Reihe zeigt den TI-Athleten, die untere Boulder 1 mit der rot gestrichelten Lücke. Über jeder Spalte stehen Intervall und Uhrzeit.

### Boulder, World Series / Classic
- **Hier wird nichts berechnet, die App zeigt nur einen Hinweis:** Wiedereinstieg **immer nach Ende der laufenden Rotation**, als einziger Athlet, die Gruppe wartet. Gutschrift ca. Restzeit bei Versuchsbeginn.
- In diesem Format sind die Eingaben (Anzahl Boulder, Intervall, „Wo war der TI?“) und die Grafik ausgeblendet.

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

## UI-Entscheidungen

- Mobile first (375 px), helles und dunkles Theme (Button oben rechts, gespeichert in `ti.theme`)
- **Orange Ergebniskästen zeigen nur berechnete Werte.** Keine To-Do-Listen, keine Angaben zur Wertung, keine Paragraphen-Verweise. Der Schiedsrichter kennt die Regeln und soll nicht verwirrt werden.
- Formatnamen wie im Regelwerk: **„Intervall“** (nicht „Intervall fix“) und **„World Series / Classic“** (nicht „Max-Rotation“)
- **±-Stepper einheitlich** an allen Zahlenfeldern: Griffe, Starttakt, Startpositionen, Anzahl Boulder, Intervall (0,5er-Schritte), Restzeit (15-s-Schritte). Uhrzeitfelder haben keine Stepper.
- Vorlagen: DM Quali 5×5 min, DM Semi 4×5 min, DJC Finale 4×4 min, DJC Quali Flash 2×3 4 min (je Kurs), DM Finale 4 min max (World Series), Eigene
- Footer: nur der Hinweis „Der Rechner ist eine Hilfe – die Entscheidung trifft der Jury-Präsident“, der Link zur TI-Doku (GitHub-Ansicht der `TI-Ablauf.md`), Impressum und Datenschutz. **Keine Quellenliste.**
- Button „Zusammenfassung kopieren“ für Messenger oder JP

## Impressum / Datenschutz

- Daten wie in den anderen Projekten (EYCH-Plakatgenerator): Jannik Weiser, Ilsungstraße 15b, 86161 Augsburg, info@comptools.cloud. Rechtsgrundlagen: § 5 DDG und § 18 Abs. 2 MStV.
- Datenschutz nach dem Aufbau von comptools.cloud: Hosting über GitHub Pages, keine Cookies und kein Tracking, localStorage nur lokal auf dem Gerät.

## Arbeitsweise

- Unklare oder widersprüchliche Regelstellen **nachfragen**, nicht raten. Der Projektinhaber klärt die Auslegung.
- Nach jeder Änderung `TI-Ablauf.md` (Abschnitt 5) und diese Datei aktualisieren.
- Änderungen im Browser auf Handygröße prüfen, danach committen und auf `main` pushen.
