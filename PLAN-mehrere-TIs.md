# Plan: Mehrere TIs in einer Boulder-Runde (Intervall-Format)

Stand: 10.10.2026 · Status: **umgesetzt** – Entscheidungen siehe Abschnitt 7

## 1. Ziel

Der JP soll mehrere TIs einer Runde eintragen können. Der Rechner prüft dabei, wie sich die Slots gegenseitig beeinflussen, und zeigt für jeden TI das korrekte Ergebnis. Bei **einem** TI soll die Seite genauso aussehen und funktionieren wie heute.

Grundlage ist Judge Guide §5.2 mit dem Beispiel §5.2.3 (zwei Slots in einer Runde mit 5 Bouldern). Der Judge Guide sagt ausdrücklich: Entscheidend ist, dass der JP eine **Startliste führt, in der die eingefügten Slots dokumentiert sind**.

## 2. Kernidee: gemeinsame Zeitachse

Heute rechnet jeder TI nur relativ zu seinem eigenen Intervall („+8 Intervalle“). Damit sich mehrere TIs vergleichen lassen, brauchen sie eine **gemeinsame Achse**. Als Achse dienen die Intervalle an Boulder 1, gezählt ab Rundenbeginn:

- Ohne Slots startet Startposition P im Intervall P−1 an B1 und klettert Boulder B im Intervall `(P−1) + 2·(B−1)`.
- Jeder Slot **reserviert ein Intervall an Boulder 1** (die Lücke). Reguläre Athleten belegen die übrigen B1-Intervalle der Reihe nach. Wer hinter einer Lücke startet, verschiebt sich dadurch um ein Intervall.
- Die Lage auf der Achse ergibt sich daher aus **Startposition + Boulder**. Die Startposition wird ab dem 2. TI zur Pflichtangabe, weil die Reihenfolge der Athleten sonst unbekannt ist.

**Warum Startposition statt Uhrzeit?** Die Startliste hat der JP in der Hand. Uhrzeiten verschieben sich durch Verzögerungen und Pausen. Die Uhrzeit bleibt optional und dient nur zur Anzeige der Zeiten und für den Countdown.

### Algorithmus (pro TI, in der Reihenfolge der Eingabe)

```
s0 = B1-Startintervall des Athleten (P-tes freies B1-Intervall, reservierte Lücken übersprungen)
t  = TI-Intervall = s0 + 2·(B−1)              (bei TI im eigenen Slot: das Slot-Intervall)
L  = letztes belegtes Intervall des Athleten   (letzter regulärer Boulder oder ein früherer eigener Slot)
R  = max( L + 2 ,  t + g + 2·(B−1) )          g = 2 (Standard) oder 1 (JP-Wahl „B1 frei lassen“)
G  = R − 2·(B−1)                               Lücke an Boulder 1
solange G schon reserviert ist:  G+1, R+1      (Kollision → 1 Intervall später)
„vor Startposition“ = G − (Anzahl reservierter Lücken vor G) + 1
```

**Geprüft per Prototyp gegen das Judge-Guide-Beispiel §5.2.3:**

| TI | Rechner | Judge Guide |
|---|---|---|
| JENFT (Pos. 1), B2 | Lücke vor Pos. 9, Slot +8 | Slot vor PRIHED (Pos. 9) ✓ |
| PEINADO (Pos. 7), B3 | Lücke vor Pos. 12, Slot +6 | Slot vor POSCH (Pos. 12) ✓, „counting the additional slot for JENFT“ |

Bei einem einzelnen TI liefert der Algorithmus exakt die heutigen Werte (k = max(2(N−B)+2, 2B)).

## 3. Sonderfälle

| # | Fall | Verhalten |
|---|---|---|
| S1 | **Zwei TIs, unabhängige Lücken** | Beide Ergebnisse unverändert. Nur „vor Startposition“ zählt die frühere Lücke mit (wie im Judge Guide). |
| S2 | **Zwei Lücken im gleichen B1-Intervall**, z. B. TI an B4 und B5 im selben Intervall: beide wollen B1 bei +2 | Ein TI behält das Intervall, der andere rückt 1 Intervall später: Lücke, Slot und Isolation +1. Hinweis im Ergebnis: „1 Intervall später wegen TI 1 (gleiche Lücke an B1)“. Wer Vorrang hat → **Frage 1**. Bei 3 oder mehr TIs kaskadiert das. |
| S3 | **Athlet startet hinter einer bereits eingefügten Lücke** | Sein ganzer Ablauf liegt 1 Intervall später. Das wird über die Startposition automatisch berücksichtigt. |
| S4 | **Gleicher Athlet, zweiter TI an einem anderen Boulder** | Der zweite Slot kommt nach allem, was der Athlet schon geplant hat (reguläre Boulder **und** erster Slot), mit 1 Intervall Call Zone dazwischen. Kein Athlet ist zweimal gleichzeitig eingeplant. |
| S5 | **TI im eigenen Nachhol-Slot** (zweimal gleicher Athlet und gleicher Boulder) | Wird automatisch erkannt. Das TI-Intervall ist dann das Slot-Intervall, und es gibt einen neuen Slot (frühestens Lücke +2). Keine Extra-Eingabe. |
| S6 | **B1, Szenario 1** (behoben vor Intervallende) | Reserviert B1 im nächsten Intervall, der ganze Ablauf des Athleten verschiebt sich um 1. **Ist dieses Intervall schon reserviert**, ist Szenario 1 nicht möglich. Dann gilt automatisch Szenario 2 mit Hinweis. |
| S7 | **Wahl +1 / +2 pro TI** | Bleibt pro TI wie heute (Standard +2). Ist +1 schon durch eine andere Lücke belegt, wird automatisch +2 genommen, mit Hinweis. |
| S8 | **Späte Entscheidung** (TI oder Einspruch wird erst Intervalle später bestätigt) | Mit eingegebener Uhrzeit erkennt der Rechner, ob die berechnete Lücke **schon vorbei** ist oder gerade läuft. Dann rückt er sie auf das nächste mögliche Intervall (+2 ab jetzt) und zeigt einen Hinweis. *Das verbessert auch den Einzel-TI.* |
| S9 | **TI löschen oder ändern** (falsche Eingabe, TI nicht bestätigt, Athlet verlässt Transitbereich) | Alle späteren TIs werden neu berechnet. Ändert sich dadurch ein bereits angezeigtes Ergebnis, wird es markiert: „geändert – Call Zone informieren“. Ob das passieren darf → **Frage 4**. |
| S10 | **Lücke liegt hinter dem letzten Athleten** | Kein Sonderfall: Die Runde läuft einfach weiter. Anzeige „hinten anhängen“ statt „vor Pos. X“, wenn die Teilnehmerzahl bekannt ist (optionales Feld). |
| S11 | **Rundenverlängerung** | Jeder Slot verlängert die Runde um 1 Intervall. Der Rechner zeigt bei 2 oder mehr TIs: „Runde verlängert sich um X Intervalle (ca. Y min)“. Das ist wichtig für den Zeitplan. |
| S12 | **2 Kurse** | Nur TIs auf demselben Kurs beeinflussen sich. → **Frage 3** |
| S13 | **Boulder wird gestrichen / Runde ausgesetzt** (§8.3, TI nicht rechtzeitig behebbar) | Kein Slot-Fall, außerhalb des Rechners. Ein TI kann über „Kein Slot (gestrichen)“ ohne Auswirkung bleiben, sonst nicht abbilden. |
| S14 | **Pausen in der Runde** (z. B. Reinigungs- oder Gruppenpause) | Für die Achse egal, da sie in Intervallen zählt. Die Uhrzeit wird über „Zeitplan verschieben“ im Countdown korrigiert. |
| S15 | **Einstellungen ändern** (Anzahl Boulder, Intervall, Ruhe-Intervall) nach Eingabe von TIs | Gilt für alle TIs, alles wird neu berechnet. |
| S16 | **Neuladen / Handy gesperrt** | Die TI-Liste wird lokal gespeichert (localStorage). Button „Runde zurücksetzen“ mit Rückfrage. |
| S17 | **Eingabe nicht chronologisch** (TI 2 ist eigentlich früher passiert) | Der Rechner arbeitet in Eingabereihenfolge, das ist im Normalfall chronologisch. Hinweis in der Doku. Optional: Pfeile zum Umsortieren (nicht im ersten Schritt). |

## 4. Bedienung & Optik – so einfach wie möglich

**Grundsatz:** Mit 1 TI sieht alles aus wie heute. Neu ist dann nur ein kleiner Button.

```
┌ Wo war der TI? ─────────────────────────┐
│ [TI 1 · B4 · Pos 17] [TI 2 · B2 · Pos 9] [+]  ← Chips, nur ab 2 TIs sichtbar
│                                         │     (bei 1 TI nur „+ weiterer TI“)
│ Boulder      B1 B2 B3 [B4] B5           │
│ Startposition  − 17 +    ← ab 2 TIs Pflicht und nicht mehr eingeklappt
│ Restzeit       − 2:45 +                 │
│ (Boulder 1 frei lassen +1/+2, falls relevant)
│                         [TI löschen]    │
└─────────────────────────────────────────┘
┌ Orangener Kasten: Ergebnis des gewählten TI (wie heute)
│  + ggf. 1 Zeile Hinweis: „1 Intervall später wegen TI 1“
└
┌ Lücken an Boulder 1  ← neu, nur ab 2 TIs
│  +2  10:10  frei  vor Pos. 25   TI 1
│  +6  10:31  frei  vor Pos. 29   TI 2
│  Runde verlängert sich um 2 Intervalle (ca. 10:30 min)
└
┌ Live-Countdown: alle TIs zusammen, jeder Schritt mit „TI 1“ / „TI 2“ markiert
┌ Ablauf des Athleten: für den gewählten TI (wie heute), Lücken anderer TIs grau
```

- Ein Chip ist der „Reiter“ für einen TI. Antippen wählt ihn aus, das Formular darunter bearbeitet genau diesen TI.
- Die Karte **„Lücken an Boulder 1“** ist der Zettel für die Call Zone: alle freizuhaltenden Intervalle sortiert in einer Liste.
- Keine neuen Tabellen, keine Startliste mit Namen (kommt später über ein anderes Tool).

## 5. Lead und World Series

- **Lead:** Mehrere TIs sind dort voneinander unabhängig, jeder hat seine eigene Erholungszeit. Möglich wäre eine einfache Liste mit mehreren Countdowns. → **Frage 5**
- **World Series (Finals):** Bleibt ein reiner Hinweis. Bei mehreren TIs: nacheinander nach Ende der Rotation, in TI-Reihenfolge. → **Frage 6**

## 6. Umsetzung in Schritten

1. **Rechenkern** als eigene Funktion `solveRound(settings, tis)`. Der heutige Einzel-TI läuft dann auch darüber. Testfälle: alle Zeilen der Judge-Guide-Tabellen 2 und 3, Beispiel §5.2.3, S2, S4, S5, S6, S7.
2. **Datenmodell + Speicherung:** TI-Liste in localStorage, „Runde zurücksetzen“.
3. **UI:** Chips, „+ weiterer TI“, „TI löschen“, Pflicht-Startposition ab 2 TIs.
4. **Karte „Lücken an Boulder 1“** und Hinweiszeilen bei Verschiebungen.
5. **Countdown** über alle TIs, Grafik mit fremden Lücken in grau.
6. **Späte Entscheidung (S8)**, auch für den Einzel-TI.
7. Doku: TI-Ablauf.md und AGENTS.md. Test im Browser auf Handygröße mit allen Sonderfällen.

## 7. Entscheidungen (vom Projektinhaber, 10.10.2026)

1. Vorrang bei Kollision: **der zuerst eingetragene TI**
2. Startposition = Platz in der Startliste (Spalte „Order“), ab dem 2. TI Pflicht
3. 2 Kurse: **ja**, Schalter Kurs A/B pro TI (nur bei der Vorlage „DJC Flash“)
4. Ändern/Löschen: **bereits berechnete Slots der anderen TIs bleiben fix**
5. Lead: **ja**, mehrere parallele Countdowns
6. World Series: **ja**, nacheinander in TI-Reihenfolge nach Rotationsende
7. Nebenbefund: **umgesetzt** („CZ B2“ statt „Pause“)

Zusätzlich bei der Umsetzung: Die Erkennung „späte Entscheidung“ gilt bis 3 h nach Beginn des TI-Intervalls (vom Projektinhaber festgelegt). Maßgeblich ist der Moment, in dem die Startzeit eingegeben wird.

## 8. Nebenbefund

In der Tabelle §5.2.3 heißt das Intervall zwischen zwei Bouldern nicht „Pause“, sondern **„Call Zone“ des nächsten Boulders**. Der Athlet sitzt dort bereits vor seinem nächsten Boulder. Die Grafik „Ablauf des Athleten“ zeigt heute „Pause“. Vorschlag: In „CZ B2“ usw. umbenennen. Rechnerisch ändert sich nichts.
