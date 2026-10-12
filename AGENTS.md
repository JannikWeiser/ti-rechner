# AGENTS.md — TI-Rechner

Referenz, um das Projekt ohne Vorwissen weiterzuführen. Hier stehen alle Entscheidungen, die mit dem Projektinhaber (Jannik Weiser, Official bei Kletterwettkämpfen) getroffen wurden. Bitte nichts davon ändern, ohne vorher nachzufragen.

## Was ist das?

Eine mobile Web-App für Schiedsrichter (JU/JP). Nach einem **Technischen Zwischenfall (TI)** gibt man ein, wo der TI passiert ist. Die App berechnet dann, wann der Athlet wieder einsteigt.
- **Lead:** Erholungszeit und Zeitpunkt des Neustarts
- **Boulder:** Rotation-Slot, Lücke an Boulder 1, sekundäre Isolation, Gutschrift

Dazu gehört [TI-Ablauf.md](TI-Ablauf.md): eine Doku, wie ein TI abläuft und wann er greift. Die Doku ist **nicht** auf der Seite verlinkt (Link auf Wunsch entfernt).

## Repo / Deployment

- GitHub: `JannikWeiser/ti-rechner`, Branch `main`. GitHub Pages veröffentlicht aus dem Root von `main` (klassischer Pages-Build).
- Live: **https://ti.comptools.cloud/** (eigene Domain; DNS: CNAME `ti` → `jannikweiser.github.io`, Datei `CNAME` im Repo). Die alte Adresse https://jannikweiser.github.io/ti-rechner/ leitet automatisch weiter.
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
| `manifest.webmanifest`, `manifest-en.webmanifest`, `sw.js`, `icons/` | PWA: App auf dem Homescreen (Name DE/EN) und offline nutzbar |
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
- **Die Erholungszeit läuft ab dem Moment, in dem der Athlet rausfällt.** Das Eingabefeld heißt deshalb „Uhrzeit des Sturzes“ und ist bei einem neuen TI leer; der Button „Jetzt“ setzt die aktuelle Uhrzeit.
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
- Button **„+ weiterer TI“**. Ab 2 TIs erscheinen Chips („TI 2 · B3 · Pos 7“) zum Umschalten. **„Diesen TI löschen“ ist immer sichtbar.** Beim letzten TI wird das Formular geleert und ein neuer, leerer TI 1 begonnen. Ein laufender Countdown stoppt dabei, alle Felder sind leer.
- Die TI-Nummern sind stabil. Nach dem Löschen wird nicht neu nummeriert.
- **Boulder, Rechenkern** (`computeTI`): gemeinsame Achse = Intervalle an B1 ab Rundenbeginn (0 = Startposition 1). Jeder Slot reserviert ein B1-Intervall G. Reguläre Athleten füllen die übrigen der Reihe nach (`b1Start`). Details und Formeln in [PLAN-mehrere-TIs.md](PLAN-mehrere-TIs.md). Geprüft gegen Judge Guide §5.2.3 (JENFT → vor Pos. 9, PEINADO → vor Pos. 12).
- **Startposition** = Platz in der Startliste (Spalte „Order“), **nicht** die Startnummer. Sie ist bei Boulder **immer Pflicht, auch beim ersten TI** (Wunsch des Projektinhabers, gegen Chaos). Ohne Startposition zeigt der orange Kasten nur „Startposition eingeben“, die Grafik ist ausgeblendet, und der TI fehlt in Countdown und Lücken-Karte. Im Reiter steht „Pos ?“. Bei Lead bleibt die Startposition optional, sie wird dort nur für „vor Startposition X“ gebraucht.
- **Startnummer (Bib)** ist optional, bei Lead und Boulder. Sie dient **nur zur Benennung**: `tiName()` ergibt „Bib 104“, ohne Bib „TI n“. In den schmalen Kacheln steht `tiShort()` („#104“). Die Bib erscheint in Reitern, Ergebnis, Hinweisen, Countdown, Grafik, Lücken-Karte und Löschabfragen. Hinweise speichern die TI-Nummer und lösen den Namen erst beim Anzeigen auf (`nameNo`). Geister behalten die Bib ihres TI. Erlaubt sind Ziffern, Buchstaben und Bindestrich, höchstens 8 Zeichen (`bibStr`). An der Berechnung ändert die Bib nichts.
- **Vorrang bei gleicher Lücke: wer zuerst eingetragen wurde.** Der spätere TI rückt 1 Intervall nach, mit Hinweis.
- **Ergebnisse sind fix.** Ändern oder Löschen eines TI rechnet nur diesen TI neu, die Slots der anderen bleiben. Nur geänderte Rundeneinstellungen (Boulder, Intervall, Ruhe-Intervall, Wechselpause, Vorlage) rechnen alle in Eingabereihenfolge neu. „vor Startposition X“ wird immer live aus allen Lücken berechnet.
- **Freien Slot mitnutzen** (Wunsch des Projektinhabers, Grundsatz „so schnell wie möglich“): Ein Slot mit Lücke G erreicht Boulder B im Intervall `G + p·(B−1)`. Belegt ist er nur am Boulder seines eigenen TI (und an Bouldern, an denen ihn schon ein anderer TI mitnutzt). In `computeTI` wird der früheste nutzbare Durchlauf X gesucht. Bedingungen: X ≥ max(TI-Intervall, aktuelles Intervall) + 2 (mindestens 1 Intervall Pause), der Athlet klettert nicht in X−1, X oder X+1, keine Szenario-1- und keine selbst mitgenutzten Slots. Ist X ≤ neuer Slot R, gilt `res.reuse=true`, `G=null`, `reuseSid`/`reuseNo`. Es gibt keine neue Lücke und keine Rundenverlängerung, dafür den Hinweis `{k:'reuse'}`.
- **Slot-Kennung `sid`** für jeden Slot mit eigener Lücke. Sie bleibt erhalten, solange sich der Slot nicht ändert (`sameRes`).
- **Geister-Slots (`bGhosts`, gespeichert in `ti.boulderGhosts`):** Wird ein TI geändert oder gelöscht, bleibt seine alte Lücke als Geist bestehen, **solange sie gebraucht wird** (`needsGap`, Entscheidung des Projektinhabers 12.10.2026: „Lücke bleibt automatisch“): (a) ein TI nutzt den Slot mit (auch der geänderte TI selbst), (b) ein anderer Slot wurde berechnet, als die Lücke schon eingeplant war (`res.seq` = Reihenfolge der Berechnung, `bSeq`), oder (c) ein TI-Athlet startet erst nach der Lücke (`res.s0 > G`). Ein sofort korrigierter Tippfehler (noch keine späteren TIs) hinterlässt keinen Geist. Geister, die nicht mehr gebraucht werden, entfernt `pruneGhosts`. Geister zählen bei Lücken, „vor Pos.“ und Rundenverlängerung mit und erscheinen in der Lücken-Karte als „Slot TI n (geändert/gelöscht)“. `recomputeAll` (geänderte Rundeneinstellungen) löscht alle Geister und rechnet in Eingabereihenfolge neu.
- **Keine Lücke in der Vergangenheit (`minG`):** Eine neue Lücke liegt immer nach dem B1-Start aller schon eingeplanten TI-Athleten auf derselben Achse (`G > res.s0`). Sonst würden sich deren fixe Slots verschieben. Greift nur bei nachträglich geänderten älteren TIs oder TIs außer der Reihe; Szenario 1 fällt dann auf den normalen Slot zurück (Hinweis „Szenario 1 nicht mehr möglich“).
- **Neu berechnen mit Geist:** Ändert sich ein mitgenutzter Slot, wird der alte Slot zuerst als Geist eingetragen und der TI danach noch einmal berechnet. Sonst konnte der neue Slot dieselbe Lücke an B1 wie sein eigener Geist bekommen (doppelte Lücke, behoben 12.10.2026).
- **Zufallstest (12.10.2026):** Rund 42.000 Bedienschritte mit unabhängigem Prüfer (kein Boulder doppelt belegt, kein Athlet ohne Pause zwischen zwei Einsätzen, Slot nie vor TI bzw. aktuellem Intervall, gespeichertes TI-Intervall passt zur Startliste). (1) TIs in der Reihenfolge, in der sie passieren, inkl. sofortiger Korrektur: 4/5 Boulder, 2 Kurse, mit/ohne Athletenzahl, späte Entscheidungen – fehlerfrei. (2) Ältere TIs nachträglich ändern/löschen: fehlerfrei bis auf einen Sonderfall (Startposition eines Szenario-1-TI korrigieren, wenn derselbe Athlet danach einen zweiten TI hat). Runden ohne Ruhe-Intervall planen bewusst ohne Pause (Format).
- Geprüft: Ein TI 2 an B5 (Pos. 3) nutzt den Slot von TI 1 an B2 (Pos. 1) und kommt nach +6 statt +10 Intervallen dran. Ein dritter TI kann denselben Durchlauf nicht doppelt belegen. Das Judge-Guide-Beispiel §5.2.3 und die Tabellen sind unverändert.
- Automatisch erkannt: gleicher Athlet mit zweitem TI (der Slot kommt nach allem Geplanten), TI im eigenen Nachhol-Slot, Szenario 1 nicht möglich, weil das nächste B1-Intervall reserviert ist.
- **Späte Entscheidung (manuell, Wunsch des Projektinhabers):** Wird **nicht mehr automatisch** angewendet. Liegt die eingegebene Startzeit des TI-Intervalls beim Eingeben (`decidedAt`) mindestens 1 Intervall und höchstens **3 h** zurück, fragt beim Verlassen des Felds ein Popup (`<dialog id="bLateDlg">`): „Ja – Lücke ab jetzt“ oder „Nein – wie im TI-Intervall geplant“. Die Wahl steht in `ti.late` (gespeichert) und lässt sich danach mit dem Schalter „Späte Entscheidung“ unter „Uhrzeit“ ändern. Nur mit `late=true` zählt die Lücke ab dem dann laufenden Intervall (+1/+2), mit Hinweis. Jede neue Eingabe der Startzeit setzt `late=false` und fragt erneut. Alte Einträge ohne `late` gelten als `true` (früheres Verhalten). Späteres Neuberechnen nutzt den gespeicherten `decidedAt`.
- **Leere Felder (Wunsch des Projektinhabers):** Ein neuer TI (Start ohne gespeicherte Daten, „+ weiterer TI“, Löschen des letzten TI, „Alle TIs löschen“) hat **alle Felder leer**: Lead ohne Griffe (`holds:null`, zeigt „Griffe eingeben“, Countdown „--:--“ und startet nicht) und ohne Sturzzeit; Boulder ohne Boulder (`B:null`, zeigt „Boulder wählen“), ohne Restzeit (Gutschrift „Restzeit eingeben“), ohne Startposition, Bib und Startzeit. Erhalten bleiben nur die Rundeneinstellungen (Boulder) und der Lead-Starttakt; bei „+ weiterer TI“ wird der Kurs übernommen. **Beim Neuladen bleibt alles unverändert** (kein Überschreiben mit „jetzt“), weil iOS die App oft selbst neu lädt. Der Bereich „Uhrzeit“ mit der Startzeit des TI-Intervalls ist **standardmäßig aufgeklappt**. Ohne Boulder rechnet `computeTI` mit `P=null` (wie ohne Startposition).
- **Ende der Startliste** (Wunsch des Projektinhabers): optionales Feld „Athleten in der Startliste“ (`bAth`, `S.A`, je Kurs bei 2 Kursen; gespeichert in `boulderInputs.a`). Ist es gesetzt, sucht `computeTI` nach dem regulären Slot einen früheren: frühestens `max(L+p, max(t,cur)+2)` (mindestens 1 Intervall Pause), Lücke `G' = R'−p(B−1)` hinter dem B1-Intervall des letzten Athleten (`b1Start(max(A, Positionen), reserved)`) und nicht reserviert. Dann ist keine Lücke an B1 nötig. `isEnd()` prüft das live: Solche Slots fehlen in Lücken-Karte, Rundenverlängerung, Zeile „B1 frei“ und Meilenstein „B1 bleibt frei“; das Ergebnis zeigt „keine nötig – Ende der Startliste“. Ohne Athletenzahl ändert sich nichts. Das Regelwerk regelt den Fall nicht eigens; 1 Intervall Pause entspricht den Judge-Guide-Tabellen. Beispiel 5 Boulder, 40 Athleten: Pos 40 an B5 → +2, Pos 36 an B5 → +5.
- **2 Kurse:** Bei der Vorlage „DJC Flash 2×3“ gibt es pro TI den Schalter Kurs A/B. Nur TIs auf demselben Kurs beeinflussen sich. Die Lücken-Karte ist nach Kurs gruppiert.
- Karte **„Lücken an Boulder 1“** (ab 2 TIs): alle Lücken sortiert mit Uhrzeit, „vor Pos. X“, TI, Rundenverlängerung („+n Intervalle, ca. m:ss min“) und dem Link „Alle TIs der Runde zurücksetzen“.
- **Grafik bei mehreren TIs („Ablauf aller TIs“):** Pro TI gibt es eine Zeile, sortiert nach TI-Nummer. Der gewählte TI ist orange beschriftet. Die letzte Zeile heißt „B1 frei“ und zeigt alle Lücken an Boulder 1 (rot mit „TI n“ bzw. „Slot n“ für Geister). Gezeigt werden alle TIs auf derselben Achse (Startposition bekannt, gleicher Kurs). Die Zeitachse läuft vom frühesten TI-Intervall bis zum letzten Slot. Die Spaltenköpfe zählen relativ zum gewählten TI (±0, +n, −n). Die Beschriftung links ist fest, die Grafik scrollt waagerecht nur innerhalb der Karte und springt automatisch zur Spalte ±0 des gewählten TI. Bei nur einem TI bleibt die bisherige Ansicht (umbrechende Kacheln).
- Grafik: **Grüner Rand um das Intervall, das gerade läuft.** Es wird live aus der Startzeit des TI-Intervalls, der Intervalldauer inkl. Wechselpause und der Countdown-Verschiebung berechnet. Zwischen den Bouldern steht **„CZ B(nächster)“** statt „Pause“. Laut Judge Guide §5.2.3 ist das die Call Zone des nächsten Boulders. Fremde Lücken erscheinen grau gestrichelt („TI 2“). Eigene weitere Slots stehen als grüne Kachel „TI n“.
- Countdown Boulder: alle TIs zusammen, mit „TI n:“ markiert, sobald es mehr als einen gibt. Uhrzeiten von TIs ohne eigene Startzeit leitet er von einem anderen TI auf derselben Achse ab.
- **Lead:** Jeder TI hat eigene Griffe, eigene Sturzzeit, eigene Startposition und einen eigenen Countdown (Start und Stopp je TI). Ab 2 TIs zeigt die Countdown-Karte eine Liste aller TIs (läuft / gestoppt / nicht gestartet). Der Starttakt gilt für alle.
- **World Series:** Bei mehreren TIs gilt nur der Hinweis „nacheinander in der Reihenfolge, in der sie passiert sind“.
- Speicherung: `ti.boulderTIs`, `ti.boulderSel`, `ti.leadTIs`, `ti.leadSel`, `ti.leadGap` in localStorage. Beim Laden wird nichts überschrieben.

### Boulder, Live-Countdown
- Erscheint nur im Intervall-Format und nur, wenn die **Startzeit des TI-Intervalls** eingegeben ist. Sonst zeigt die Karte einen Button „Startzeit eingeben“.
- Meilensteine: „Boulder 1 bleibt frei (Lücke)“, „Athlet in die Call Zone für Boulder B“ (nur wenn er dazwischen wartet), „Slot-Intervall beginnt“ und „Athlet an Boulder B (Restzeit)“. Bei Szenario 1: „Intervall mit Restzeit an B1 beginnt“ und „Athlet an Boulder 1“.
- Der nächste Schritt steht groß oben, erledigte werden durchgestrichen. Der Countdown läuft automatisch.
- „Zeitplan verschieben“ in ±15-s-Schritten, wenn die Runde hinterherläuft. Das gilt nur für den Countdown und wird bei einer neuen Startzeit zurückgesetzt.
- **Kein Ton und keine Vibration** (ausdrücklich so entschieden). Der Bildschirm bleibt an (Wake Lock).

### Boulder, World Series (Finals)
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
| World Series (Finals) | Immer nach Ende der laufenden Rotation, nur als Hinweis |

## Zweisprachigkeit (DE/EN)

- **Standard:** Gerätesprache Deutsch (`de`, `de-DE`, `de-AT` …) ergibt Deutsch, **jede andere Sprache Englisch**. Maßgeblich ist der erste Eintrag in `navigator.languages`.
- Der Umschalter oben rechts („EN“/„DE“) überschreibt das. Die Wahl wird in `ti.lang` gespeichert.
- Texte stehen im Wörterbuch `I18N` (index.html) mit den Teilen `de` und `en`. Texte mit Zahlen sind Funktionen (`t('plusK', 8)`). Statische Elemente werden über `data-i18n`, `data-i18n-html` (nur feste Texte), `data-i18n-ph` und `data-i18n-aria` übersetzt.
- **Hinweise im Boulder-Ergebnis werden als Code gespeichert** (`{k:'pushed', n, l}`, `{k:'late', g}`, `{k:'sc1Blocked', no}`, `{k:'sc1Late'}`, `{k:'inSlot', no}`) und erst bei der Anzeige übersetzt. So bleiben fixe Ergebnisse in beiden Sprachen lesbar. Ältere Hinweise als deutscher Text werden unverändert angezeigt.
- Der gestoppte Lead-Countdown wird als Sekunden gespeichert (`cdFrozen`), nicht als Text. Alte Text-Werte („6:58“, „Bereit ✓“) werden beim Laden umgerechnet.
- Englische Begriffe: Intervall → **rotation**, Erholungszeit → **recovery period**, Gutschrift → **time credit**, Lücke → **gap**, Sek. Isolation → **secondary isolation**, Startposition → **start position** (Spalte „Order“, nicht Bib), Jury-Präsident → **Jury President**.
- **Impressum und Datenschutz gibt es nur auf Deutsch** (auf Wunsch). Auch in der englischen Ansicht heißen die Footer-Links „Impressum“ und „Datenschutz“.
- **App-Name je Sprache:** Deutsch „TI-Rechner“ (`manifest.webmanifest`), Englisch „TI Calculator“ (`manifest-en.webmanifest`). `applyStatic()` setzt den Manifest-Link und `apple-mobile-web-app-title` passend zur Sprache. Der Name wird **beim Hinzufügen zum Homescreen** übernommen. Ein späterer Sprachwechsel ändert den Namen einer schon installierten App nicht.

## UI-Entscheidungen

- **„Weitere Einstellungen“ (Ruhe-Intervall, Wechselpause) stehen immer offen in der Karte „Runde“**, nicht mehr als eigener Klappbereich, damit man nicht zweimal aufklappen muss.
- **Karte „Runde“ ist aufklappbar** (`<details id="bRoundCard">`). Im Kopf steht immer eine Zusammenfassung, z. B. „Qualifikation · 5 Boulder · 5 min“ oder „World Series (Finals)“. **Standardmäßig zugeklappt** (auch nach jedem Neuladen), aufgeklappt wird nur zum Bearbeiten. Der Klappzustand wird nicht gespeichert.
- **Buttons im TI-Formular:** „+ weiterer TI“ groß und orange über die ganze Breite, darunter nebeneinander „Diesen TI löschen“ und „Alle TIs löschen“. Letzteres erscheint nur ab 2 TIs und hat eine Rückfrage. Das gilt für Lead und Boulder. Der frühere Link „Alle TIs der Runde zurücksetzen“ in der Lücken-Karte ist entfallen.
- **Keine feste Ergebnisleiste.** Sie wurde getestet und auf Wunsch wieder entfernt, weil sie verwirrend war.
- **Lead: Route** ist ein freies Eingabefeld neben der Startnummer (keine Auswahl-Buttons). Es dient **nur zur Benennung**: `leadName()` ergibt „Bib 106 an Route 1“. Ein vorangestelltes „Route“ wird weggelassen (`routeStr`, höchstens 12 Zeichen: Buchstaben, Ziffern, Leerzeichen, Bindestrich). Die Route steht in Ergebnis, Reiter („R1“), über dem großen Countdown, in der Countdown-Liste und in der Löschabfrage.
- **Für stressige Momente vereinfacht:** Hinweistexte sind kurz gehalten (eine Zeile, wo möglich). Der 2-Kurs-Hinweis erscheint nur bei der Vorlage „Qualifikation B (Flash)“, die Auswahl +1/+2 nur, wenn sie etwas ändert. „Alle TIs löschen“ ist bei einem TI ausgeblendet. Header-Untertitel nur „Technischer Zwischenfall“ / „Technical Incident“.
- **Farben (Variante 3, vom Projektinhaber gewählt):** Bedienelemente (Reiter, Buttons, Auswahl, Chips, Fokus) in Dunkelgrau `--accent:#374151` (dunkles Theme: helles Grau `#e5e7eb` mit dunkler Schrift). Orange nur noch als Markenfarbe `--brand:#ea7a35` (Logo „TI“, gewählter TI in der Grafik, nächster Schritt im Countdown) und als Rand des Ergebniskastens `--result-line:#f0a66e` mit Hintergrund `--accent-soft:#fff6ee`. Boulder-Kacheln in der Grafik (`--climb`) und App-Icon bleiben orange. `theme-color` = Hintergrundfarbe (hell/dunkel).
- Mobile first (375 px), helles und dunkles Theme (Button oben rechts, gespeichert in `ti.theme`)
- **Orange Ergebniskästen zeigen nur berechnete Werte.** Keine To-Do-Listen, keine Angaben zur Wertung, keine Paragraphen-Verweise. Der Schiedsrichter kennt die Regeln und soll nicht verwirrt werden.
- Formatnamen: **„Intervall“** (nicht „Intervall fix“) und **„World Series (Finals)“** (früher „World Series / Classic“, davor „Max-Rotation“)
- **±-Stepper einheitlich** an allen Zahlenfeldern: Griffe, Starttakt, Startpositionen, Anzahl Boulder, Intervall (0,5er-Schritte), Restzeit (15-s-Schritte). Uhrzeitfelder haben keine Stepper.
- Vorlagen (nur im Intervall-Format), **benannt wie die World-Climbing-Formate** (Event Regulations Annex C, Tab. 1/3): „Qualifikation – 5 Boulder, 5 min fix“ (bisher DM Quali), „Qualifikation B (Flash) – 2 Kurse à 3 Boulder, 4 min fix“ (bisher DJC Quali; bei World Climbing „Qualification B“, Flash, 4/5 min fix), „Halbfinale – 4 Boulder, 5 min fix“ (bisher DM Semi), „Finale im Intervall – 4 Boulder, 4 min fix“ (bisher DJC Finale; kein World-Climbing-Pendant, dort ist das Finale 4 min max), „Eigene Einstellung“. Interne Schlüssel bleiben `q`, `jq`, `s`, `jf`, `c` (`jq` = 2 Kurse). Für World Series gibt es keine Vorlage, weil immer dasselbe herauskommt.
- Footer: nur der Hinweis „Der Rechner ist eine Hilfe – die Entscheidung trifft der Jury-Präsident“, Impressum und Datenschutz. **Kein Link zur TI-Doku** (auf Wunsch entfernt). **Keine Quellenliste.**
- **Die Funktion „Zusammenfassung kopieren“ wurde auf Wunsch entfernt.**
- Keine Erklär-Hinweise mit Regelbezug an den Eingabefeldern, z. B. „Szenario 1 im Judge Guide“ oder „daraus ergibt sich die Gutschrift (§8.5)“

## PWA / Offline

- `manifest.webmanifest`: Name „TI-Rechner“, standalone, `theme_color` #f4f5f7 (Icon orange #f97316), Icons 192/512 (maskable) und `apple-touch-icon.png` (180). Die Icons sind mit ImageMagick erzeugt (orange Fläche, weißes „TI“ in Arial Bold).
- `sw.js`: **Network first.** Mit Internet kommt immer die neueste Version, ohne Internet die Version aus dem Cache. Bei neuen Dateien die Liste `FILES` ergänzen. Den Cache-Namen (`ti-rechner-vN`) erhöhen, wenn alte Caches entfernt werden sollen.
- Registriert in `index.html`, `impressum.html` und `datenschutz.html`.

## Uhrzeit-Eingabe

- **Kein `<input type="time">`.** iOS-Safari bietet dort keine Sekunden an (`step` wird ignoriert), das wäre für die Startzeit zu ungenau. Stattdessen gibt es Textfelder `.timefield` mit Ziffernblock (`inputmode="numeric"`, Platzhalter `hh:mm:ss`).
- Beim Tippen setzt der Rechner die Doppelpunkte automatisch (102330 → 10:23:30). „10:23“ wird beim Verlassen des Felds zu „10:23:00“. Ungültige Zeiten wie 25:61:00 werden rot umrandet und nicht verwendet (`timeStr` prüft 0–23 / 0–59 / 0–59).
- Der Formatierungs-Listener wird vor den Berechnungs-Listenern registriert.
- Betroffen sind die Felder „Uhrzeit des Sturzes“ (Lead) und „Startzeit des TI-Intervalls“ (Boulder).

## Sicherheit & Robustheit

- **Eingaben normalisieren:** Startposition nur als ganze Zahl von 1 bis 9999 (`posInt`/`posStr`). Uhrzeiten nur im Format `hh:mm(:ss)` (`timeStr`). Negative Restzeiten sind ungültig (`parseMS` → NaN, es erscheint ein Hinweis).
- **localStorage wird beim Laden geprüft:** Alle TI-Felder werden validiert. Gespeicherte Boulder-Ergebnisse werden **übernommen, nicht neu berechnet** (sonst wären die fixen Slots nach einem Neuladen anders), aber nur, wenn sie strukturell gültig sind. Fehlende Ergebnisse werden einzeln berechnet, nie per `recomputeAll`.
- Lead-Countdowns vom Vortag laufen nicht weiter (`cdDay`), weil die Zeiten als Sekunden seit Mitternacht gespeichert sind.
- **Ausgabe escapen:** Alle Texte aus Speicher oder Eingaben gehen durch `esc()`, bevor sie in `innerHTML` landen (Hinweise, Chips, Countdown-Labels).
- **CSP** per Meta-Tag in allen drei Seiten: nur eigene Quellen, keine externen Skripte, `object-src 'none'`, `base-uri 'none'`, `form-action 'none'`. Dazu `referrer: no-referrer`.
- `b1Start` läuft ohne feste Obergrenze und endet nach spätestens P + (Anzahl Lücken) Schritten. Früher brach die Schleife nach 5000 Schritten ab und lieferte falsch 0.
- **Takt:** Der 500-ms-Takt aktualisiert nur den sichtbaren Reiter und pausiert bei verstecktem Browser-Tab. Eingaben aktualisieren die Anzeige **immer sofort** (`tickLead()`/`bTick()` direkt, ohne Sichtbarkeitsprüfung).
- **Service Worker:** network first mit **3 s Zeitlimit**. Bei schlechtem Hallen-WLAN kommt dann die gespeicherte Version. Gespeichert werden nur eigene, vollständige Antworten (`res.type === 'basic'`). Cache-Name derzeit `ti-rechner-v20`.

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
