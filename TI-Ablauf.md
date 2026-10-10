# Technischer Zwischenfall (TI) – Ablauf & Regeln

Zusammenfassung für Lead und Boulder, auf Basis von:

- **World Climbing Rules 2026** (Competition Rules §6, §11, Definitionen)
- **Event Regulations 2026**: Annex A (Lead) §8, Annex C (Boulder) §8
- **Judge Guide 2026** (V0.1): §1.2.11, §2.16, §3.6, §4.10, §5.2
- **Nationales Regelwerk Klettern**, Entwurf 27.1 (09.09.2026): §11, Anhang A §8, Anhang C §8
- **Amendments & Errata** (1. April 2026): enthält keine TI-relevanten Änderungen

> Der Rechner ist ein Hilfsmittel. Ob ein TI vorliegt und wann der Athlet wieder einsteigt, entscheidet der Jury-Präsident bzw. DAV-Schiedsrichter (JU/JP).

---

## 1. Was ist ein Technischer Zwischenfall?

Ein TI ist laut Definition:

| | Ursache |
|---|---|
| A | gebrochener oder loser Griff |
| B | falsch positionierte Expressschlinge / Karabiner |
| C | Straffseil durch Handlung oder Versäumnis des Sichernden (hilft **oder** behindert) |
| D | kritisches Versagen eines offiziellen Zeitmesssystems |
| E | jeder ungewöhnliche/unvorhergesehene Umstand, der den Athleten in eine andere Lage als seine Konkurrenten bringt |

**Für jeden Fall müssen beide Bedingungen erfüllt sein:**

1. Er führt zu einem **wesentlichen Nach- oder Vorteil** für den Versuch, und
2. er ist **nicht das Ergebnis des eigenen Handelns oder Nichthandelns** des Athleten.

**Kritischer Ausfall der Zeitmessung:**
- *Lead:* Die Zeit wird zu Beginn jedes Versuchs angezeigt **und** die Anzeige fällt aus, wenn weniger als 1 Minute übrig ist.
- *Boulder:* Beginn oder Ende der Kletterzeit kann nicht gemessen werden. Eine kurze Unterbrechung der Anzeige, bei der Start-/Stopp-Signal funktionieren, ist **kein** TI.

**Kein TI:**
- Blutende Verletzungen (außer sie sind selbst Folge eines TI)
- Ein Athlet ohne eigenes Tape/Erste-Hilfe-Material
- Ein Griff, der sich dreht, ist nicht automatisch ein TI

## 2. Allgemeiner Ablauf (alle Disziplinen)

1. **Melden:** Wer einen möglichen TI bemerkt (Athlet, Teamoffizieller, Sichernder, Routenbauer, Official), meldet ihn **sofort** dem DAV-Schiedsrichter / International Judge.
2. **Entscheiden:** Die On-field Officials entscheiden, falls nötig zusammen mit dem Chefroutenbauer, ob ein TI vorliegt. Die Entscheidung kann während oder nach dem Versuch fallen.
3. **Annehmen oder nicht:** Klettert der Athlet nach einem TI, der ihm geschadet hat, weiter, gilt der TI als **akzeptiert und abgeschlossen**. Ein TI, der einen **Vorteil** verschafft hat, kann nicht durch Akzeptieren abgeschlossen werden.
4. **Bei bestätigtem TI** (§11.4):
   - A) Der Versuch kann an Stelle und Zeitpunkt des TI als nicht erfolgreich gewertet werden.
   - B) Der Athlet darf neu starten, sobald die Ursache behoben ist. Die Kletterzeit wird zurückgesetzt oder angepasst.
   - C) Gewertet wird das **bessere** Ergebnis aus dem Versuch vor dem TI und dem Versuch nach dem Neustart.
5. **Isolation:** Bis zum Neustart bleibt der Athlet in einem separaten Bereich. Er sieht die Route nicht und spricht nur mit Officials. **Verlässt er den Bereich ohne Erlaubnis, ist der TI abgeschlossen.**

---

## 3. Lead

### Frist
Ein TI kann nur reklamiert werden, **bis der planmäßig nächste Athlet in der betroffenen Route gestartet ist** (Annex A §8.1).

### Erholungszeit (Annex A §8.2 B)

> **1 Minute pro gewertetem Griff, der vor dem TI benutzt wurde, höchstens 20 Minuten.**

| Gewertete Griffe vor dem TI | Erholungszeit |
|---|---|
| 5 | 5 min |
| 12 | 12 min |
| 23 / 23+ | 20 min (Maximum) |

Danach wird der Neustart **so bald wie möglich** angesetzt. Der betroffene Athlet und **alle noch startenden Athleten** müssen informiert werden.

### Ablauf
1. TI melden, Athlet ablassen.
2. Athlet in den separaten Bereich mit Aufwärmmöglichkeit. Kontakt nur mit Officials.
3. Ursache prüfen und beheben. Zwei Kontrollkletterer stehen bereit und klettern die Route unter Aufsicht des JU (Judge Guide §3.6).
4. Ist kein TI bestätigt, wird der Athlet freigelassen und das ursprüngliche Ergebnis gilt.
5. Ist der TI bestätigt, legt der JP die Erholungszeit fest und fügt den Athleten in die Startfolge ein.
6. **Neustart entfällt**, wenn er die Platzierung am Ende der Runde nicht mehr beeinflussen kann (§8.3).
7. Gewertet wird das bessere Ergebnis aus beiden Versuchen (§8.4).

Das gilt sowohl für On-sight- als auch für Flash-Runden (Judge Guide §2.16).

### Sonderfall: Sichernder zieht den Athleten hoch
Das ist ein TI. Das Ergebnis wird auf den letzten kontrollierten Griff vor dem Vorteil gesetzt. Der Athlet kann einen weiteren Versuch nach den TI-Regeln erhalten (Judge Guide §2.15).

### So rechnet der Rechner
- Erholungszeit = `min(Griffe, 20)` Minuten
- Frühester Neustart = Uhrzeit Beginn der Erholung + Erholungszeit
- Einsetzen nach ca. `⌈Erholungszeit / Starttakt⌉` nachfolgenden Athleten

---

## 4. Boulder

### Frist
Ein TI kann nur reklamiert werden **bis zum Beginn des nächsten planmäßigen Intervalls** (Annex C §8.1).

### Entscheidung des Athleten
**TI ist vor dem nächsten Intervall behoben** (§8.2). Der Athlet wählt:
- **A)** im laufenden Intervall weiterklettern, **ohne** zusätzliche Zeit oder Versuche, oder
- **B)** seine Versuche bis zu einem vom JP festgelegten Zeitpunkt aussetzen.

**TI ist nicht rechtzeitig behebbar** (§8.3): Die Runde wird für den betroffenen Athleten und für alle, die den Boulder noch nicht versucht haben, ausgesetzt. Ist der Boulder nicht reparierbar, wird er gestrichen.

**Transitbereich** (§8.4): Wer ihn vor der Klärung verlässt, darf seine Versuche nicht wieder aufnehmen.

### Gutschrift (§8.5)
> Ausgeglichen wird **nur die verlorene bzw. nicht genutzte Zeit**, höchstens die **Restzeit im unterbrochenen Intervall zu dem Moment, als der betroffene Versuch begonnen hat**.

Beispiel: Der Versuch beginnt bei 2:40 Restzeit, der Griff bricht bei 2:10. Die Gutschrift beträgt höchstens 2:40.

### Wann steigt der Athlet wieder ein? Fixe Intervalle (Judge Guide §5.2)
Für den Athleten wird ein zusätzlicher **Rotation-Slot** in die Startliste eingefügt. Der Slot läuft wie ein „Geister-Athlet“ durch alle Boulder. Der TI-Athlet nutzt ihn, wenn der Slot am betroffenen Boulder ankommt. Bis dahin klettert der Athlet seine restlichen Boulder ganz normal.

**4 Boulder** (z. B. Semifinale)

| TI an | Slot vor dem … nachfolgenden Athleten | Sekundäre Isolation |
|---|---|---|
| B1 | Szenario 1: behoben vor Intervallende → **nächstes** Intervall an B1<br>Szenario 2: sonst **8.** | nein |
| B2 | **6.** | nein |
| B3 | **6.** (sofort) | 2 Intervalle nach B4, dann Call Zone |
| B4 | **8.** (sofort) | 6 Intervalle, dann Call Zone |

**5 Boulder** (z. B. Qualifikation)

| TI an | Slot vor dem … nachfolgenden Athleten | Sekundäre Isolation |
|---|---|---|
| B1 | Szenario 1: **nächstes** Intervall<br>Szenario 2: **10.** | nein |
| B2 | **8.** | nein |
| B3 | **6.** (sofort) | nein |
| B4 | **8.** (sofort) | 4 Intervalle nach B5, dann Call Zone |
| B5 | **10.** (sofort) | 8 Intervalle, dann Call Zone |

Im Slot startet der Athlet, wenn auf der Intervalluhr noch die **gutgeschriebene Zeit** steht. Beispiel: Bei 1:30 Gutschrift startet er, wenn noch 1:30 übrig sind.

**Allgemeine Formel** (daraus ergeben sich alle Tabellenwerte; N = Anzahl Boulder, B = TI-Boulder):

```
k = max( 2·(N − B) + 2 ,  2·B )
```

`k` ist die Zahl der Intervalle nach dem TI-Intervall, bis der Athlet wieder an Boulder B klettert. Gleichzeitig ist der Slot vor dem k-ten nachfolgenden Athleten einzufügen.
- Der erste Term bedeutet: Der Athlet hat seine restlichen Boulder beendet und ein Intervall Pause gehabt.
- Der zweite Term bedeutet: Der Slot kann frühestens 2 Intervalle später an Boulder 1 starten, weil der nächste Athlet schon in der Call Zone steht. Danach braucht er 2·(B−1) Intervalle bis Boulder B.
- Sekundäre Isolation = Wartezeit nach dem letzten Boulder − 1 Intervall Call Zone.

Uhrzeit: Ein Intervall dauert Kletterzeit + 15 s Wechselpause. Beispiel: 5:00 + 0:15 = 5:15.

### Max-Rotation-Format (z. B. Finale 4 min max)
Der Athlet bekommt seine zusätzlichen Versuche **so bald wie möglich**. Er klettert dann als **einziger Athlet**, während die Gruppe wartet (Judge Guide §5.2).

### 2-Kurs-Runden (z. B. 2×2, 2×3 Flash)
Empfehlung im Judge Guide: Den ganzen Kurs der betroffenen Kategorie stoppen, den TI bzw. Einspruch behandeln und danach mit den aktuellen Athleten weitermachen. Das entspricht dem Vorgehen im Max-Rotation-Format.

### Blut am Griff (Judge Guide §4.10)
- Ziehen sich die Reinigungsarbeiten bis ins nächste Intervall (nach den 15 s Wechselpause), können der folgende Athlet oder der JU einen TI ausrufen. Auch der Athlet oder sein Teamoffizieller kann einen TI verlangen.
- Ist der verletzte Athlet bereit, bevor die Reinigung fertig ist, kann er einen TI verlangen. Der JU entscheidet, z. B. abhängig davon, ob schlechtes Tapen die Ursache war.

---

## 5. Offene Auslegungsfragen

Die folgenden Punkte stehen nicht eindeutig im Regelwerk. Der Rechner nutzt bis zur Klärung den genannten Standard:

1. **Lead: Ab wann läuft die Erholungszeit?** Ab dem TI, ab dem Moment am Boden oder ab der Bestätigung? *Standard: ab dem Moment am Boden (frei einstellbar).*
2. **Boulder: Zählt der Versuch mit dem TI als Versuch?** §11.4 A sagt „als nicht erfolgreich gewertet“. *Standard: Er zählt, der nächste Versuch ist n+1 (Schalter in den Einstellungen).*
3. **Boulder: Wie hoch ist die Gutschrift genau?** Die Restzeit bei Versuchsbeginn ist die Obergrenze. Ist sie auch der Normalwert? *Standard: ja.*
4. **Formate mit 2 Sets (DJC Flash 2×3) und Formate ohne Pause-Intervall:** Die Tabellen im Judge Guide gelten nur für 4 oder 5 Boulder mit abwechselnden Kletter- und Pause-Intervallen.
