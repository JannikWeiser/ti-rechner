# Technical Incident (TI) – Procedure & Rules

*English version of [TI-Ablauf.md](TI-Ablauf.md).*

This is a summary for Lead and Boulder, based on:

- **World Climbing Rules 2026** (Competition Rules §6, §11, definitions)
- **Event Regulations 2026**: Annex A (Lead) §8, Annex C (Boulder) §8
- **Judge Guide 2026** (V0.1): §1.2.11, §2.16, §3.6, §4.10, §5.2
- **German national rules** (Nationales Regelwerk Klettern), draft 27.1 (09.09.2026): §11, Annex A §8, Annex C §8
- **Amendments & Errata** (1 April 2026): no changes relevant to TIs

> The calculator is an aid. Whether a TI has occurred and when the athlete returns is decided by the Jury President or the DAV/International Judge (JU/JP).

---

## 1. What is a Technical Incident?

By definition, a TI is:

| | Cause |
|---|---|
| A | a broken or loose hold |
| B | an improperly positioned quickdraw or karabiner |
| C | a tight rope caused by the action or inaction of the belayer (assisting **or** hindering) |
| D | a critical failure of an official timing system |
| E | any unusual or unforeseen circumstance that places the athlete in a situation different from their peers |

**In every case both conditions must be met:**

1. It results in a **material disadvantage or advantage** to the attempt, and
2. it is **not the result of the athlete's own action or inaction**.

**Critical timing failure:**
- *Lead:* the time is displayed at the start of every attempt **and** the display fails while less than 1 minute remains.
- *Boulder:* the start or end of the climbing time cannot be measured. A brief interruption of the display while the start/stop signals still work is **not** a TI.

**Not a TI:**
- Blood injuries (unless they are themselves the result of a TI)
- An athlete without their own tape or first-aid material
- A spinning hold is not automatically a TI

## 2. General procedure (all disciplines)

1. **Report:** Anyone who notices a potential TI (athlete, team official, belayer, routesetter, official) reports it **immediately** to the DAV judge / International Judge.
2. **Decide:** The on-field officials decide, consulting the Chief Routesetter if needed, whether a TI has occurred. The decision can be made during or after the attempt.
3. **Waive or not:** If the athlete continues climbing after a TI that disadvantaged them, the TI is considered **waived and closed**. A TI that gave an **advantage** cannot be waived.
4. **If the TI is confirmed** (§11.4):
   - A) The attempt may be ruled unsuccessful at the point and time of the TI.
   - B) The athlete may restart once the cause has been fixed. The climbing time is reset or adjusted.
   - C) The result is the **better** of the attempt before the TI and the attempt after the restart.
5. **Isolation:** Until the restart the athlete stays in a separate area. They cannot see the route and may only talk to officials. **If they leave the area without permission, the TI is closed.**

---

## 3. Lead

### Deadline
A TI can only be claimed **until the next scheduled athlete has started the affected route** (Annex A §8.1).

### Recovery period (Annex A §8.2 B)

> **1 minute for each scoring hold used before the TI, max. 20 minutes.**

| Scoring holds before the TI | Recovery period |
|---|---|
| 5 | 5 min |
| 12 | 12 min |
| 23 / 23+ | 20 min (maximum) |

The recovery period starts **the moment the athlete falls**. After that, the restart is scheduled **as soon as practical**. The affected athlete and **all athletes still to climb** must be informed.

### Procedure
1. Report the TI and lower the athlete.
2. Take the athlete to the separate area with warm-up facilities. Contact with officials only.
3. Check and fix the cause. Two test climbers are on standby and climb the route under the JU's supervision (Judge Guide §3.6).
4. If no TI is confirmed, the athlete is released and the original result stands.
5. If the TI is confirmed, the JP sets the recovery period and inserts the athlete into the start order.
6. **The restart is cancelled** if it can no longer affect the athlete's ranking at the end of the round (§8.3).
7. The result is the better of the two attempts (§8.4).
8. **Qualification with 2 routes, TI on route 1:** there must be at least **50 minutes** between the end of the restarted attempt on route 1 and the start on route 2 (Annex A §4.4). Check the start time on route 2 and move it if necessary.

This applies to on-sight and flash rounds alike (Judge Guide §2.16).

### Special case: the belayer pulls the athlete up
This is a TI. The result is set to the last controlled hold before the advantage. The athlete may get another attempt under the TI rules (Judge Guide §2.15).

### How the calculator works
- Recovery period = `min(holds, 20)` minutes
- Earliest restart = time of the fall + recovery period
- Insert after approx. `⌈recovery period / start interval⌉` following athletes

---

## 4. Boulder

### Deadline
A TI can only be claimed **until the start of the next scheduled rotation** (Annex C §8.1).

### The athlete's choice
**The TI is fixed before the next rotation** (§8.2). The athlete chooses either:
- **A)** to continue in the current rotation, **without** extra time or attempts, or
- **B)** to suspend their attempts until a time set by the JP.

**The TI cannot be fixed in time** (§8.3): the round is suspended for the affected athlete and for everyone who has not yet tried the boulder. If the boulder cannot be repaired, it is cancelled.

**Transit area** (§8.4): anyone who leaves it before the matter is resolved may not resume their attempts.

### Time credit (§8.5)
> Only the **time lost or not used** is compensated, at most the **time remaining in the interrupted rotation at the moment the affected attempt started**.

As an approximate credit, the calculator uses the **time left when the affected attempt started**. Example: the attempt starts with 2:40 left and the hold breaks at 2:10. The credit is approx. 2:40.

**Does the TI attempt count as an attempt?** That depends on the individual case, and the JP decides. It makes no difference to when the athlete returns, so the calculator does not ask for the attempt number.

### When does the athlete return? Rotation format (Judge Guide §5.2)
An additional **rotation slot** is inserted into the start list for the athlete. The slot moves through all boulders like a "ghost athlete". The TI athlete uses it when the slot reaches the affected boulder. Until then the athlete climbs their remaining boulders as normal.

**4 boulders** (e.g. semi-final)

| TI on | Slot before following athlete no. … | Secondary isolation |
|---|---|---|
| B1 | Scenario 1: fixed before the end of the rotation → **next** rotation on B1<br>Scenario 2: otherwise **8** | no |
| B2 | **6** | no |
| B3 | **6** (immediately) | 2 rotations after B4, then call zone |
| B4 | **8** (immediately) | 6 rotations, then call zone |

**5 boulders** (e.g. qualification)

| TI on | Slot before following athlete no. … | Secondary isolation |
|---|---|---|
| B1 | Scenario 1: **next** rotation<br>Scenario 2: **10** | no |
| B2 | **8** | no |
| B3 | **6** (immediately) | no |
| B4 | **8** (immediately) | 4 rotations after B5, then call zone |
| B5 | **10** (immediately) | 8 rotations, then call zone |

**Boulder 1, scenario 1 in detail:** the athlete has the TI in their scheduled start rotation on B1. In the **next rotation** they get the remaining climbing time on B1. After that they have **one rotation of rest** and then go to B2. The slot is inserted before the next athlete. This moves their remaining schedule and all following athletes back by 1 rotation.

In the slot, the athlete starts when the rotation clock shows the **credited time**. Example: with a credit of 1:30, they start when 1:30 is left.

**General formula** (all table values follow from it; N = number of boulders, B = TI boulder):

```
k = max( 2·(N − B) + 2 ,  2·B )
```

`k` is the number of rotations after the TI rotation until the athlete climbs boulder B again. It is also the position of the following athlete in front of whom the slot is inserted.
- The first term means: the athlete has finished their remaining boulders and had one rotation of rest.
- The second term means: the slot can start on boulder 1 two rotations later at the earliest, because the next athlete is already in the call zone. After that it needs 2·(B−1) rotations to reach boulder B.
- Secondary isolation = waiting time after the last boulder − 1 rotation in the call zone.

**Gap at boulder 1:** the slot starts on boulder 1. So in rotation

```
L = k − 2·(B − 1)
```

after the TI rotation, one place at B1 is left free. For this, the B1 call zone does not call anyone before the k-th following athlete. That athlete and everyone after them move back by one rotation. This way boulder B is free when the TI athlete gets there. Example: with 5 boulders and a TI on B4, k = 8 and L = 2, so the gap at B1 is in the rotation after next.

**+1 or +2:** According to the Judge Guide, B1 is left free in the **rotation after next** at the earliest, because the next athlete has usually already been called to the call zone. The JP can, however, decide in the call zone to leave B1 free in the **next** rotation. Then the 2 in the formula becomes a 1 (`k = max(2·(N−B)+2, 2·B − 1)`), and the athlete returns one rotation earlier. This only makes a difference for TIs on the last boulders.

Time of day: one rotation lasts the climbing time + 15 s changeover. Example: 5:00 + 0:15 = 5:15.

### End of the start list
The tables assume that enough athletes still follow the TI athlete. Near the end of the round, the TI boulder is often free earlier, because nobody comes after. The rules do not cover this case specifically. The principle is "as soon as practical" with minimal impact on the others (Annex C §8.2 B).
- If the **number of athletes in the start list** is entered, the calculator checks whether boulder B is free earlier than the table says. It is free as soon as the last athlete has passed it. **No gap at B1** is needed then.
- The athlete still gets **at least 1 rotation of rest** after the TI and after their last boulder (call zone).
- Example (5 boulders, 40 athletes): a TI of the last athlete on B5 gives **+2** instead of +10. A TI on B5 at start position 36 gives +5.
- If the TI is fixed before the next rotation, the athlete can continue in the current rotation anyway, without extra time (Annex C §8.2 A).

### Several TIs in one round
Each slot keeps exactly one rotation free at boulder 1. The athletes behind it each move back by one rotation. This matches the example in Judge Guide §5.2.3, where "before the sixth following competitor" counts the slot that has already been inserted.
- If two TIs need the same gap at B1, it goes to **the TI that was entered first**. The other moves back by 1 rotation.
- Slots that have already been communicated stay **fixed**, even if another TI is changed or deleted.
- To place the athletes, the calculator needs the **start position** for every boulder TI (position in the start list, not the bib number). You can also enter the **bib number**; the TI is then called e.g. “Bib 104” instead of “TI 1” everywhere.
- With 2 courses, only TIs on the same course affect each other.
- **Sharing a free slot:** an inserted slot moves on by one boulder every two rotations after its gap at B1. It is only occupied at the boulder of its own TI and is free at all other boulders. Another TI athlete can use that free place when the slot reaches their TI boulder, provided they had at least 1 rotation of rest after their TI and do not climb directly before or after. Principle: **the athlete climbs their TI boulder as soon as possible.** If the free slot comes earlier than (or at the same time as) a new slot, the calculator uses it. No new gap at B1 is needed and the round does not get longer.
  Example (5 boulders): TI 1 on B2 (pos. 1) gets the gap at B1 before pos. 9. Two rotations later the slot is at B2 (TI 1 climbs there), then free at B3, B4 and B5. A TI 2 on B5 (pos. 3) uses it and returns after **+6** instead of +10 rotations.
- If a TI whose slot is shared by another TI is changed or deleted, the gap at B1 remains. It is shown in the gaps card as “Slot TI n (changed/deleted)” until no TI uses it any more.

### World Series (Finals) format (e.g. final, 4 min max)
The athlete gets their additional attempts **as soon as practical** (Judge Guide §5.2). In practice this means **always after the end of the current rotation**. They then climb as the **only athlete** while the group waits. Several TIs are dealt with one after another, in the order they happened.

### Rounds with 2 courses (e.g. Qualification B (flash), 2 courses of 3 boulders)
The shift only happens **on the affected course**. The slot is inserted into that course's start list, and the other course continues unchanged. For the calculation, N is the number of boulders on the affected course.

In flash rounds with 2 sets, there must be at least **3 attempt periods** between the end of the first set and the start of the second set (Annex C §4.7 C). Check whether the TI slot shortens this gap.

The Judge Guide (§5.2) mentions stopping the whole course as an alternative.

### Blood on a hold (Judge Guide §4.10)
- If cleaning runs into the next rotation (after the 15 s changeover), the following athlete or the JU can call a TI. The athlete or their team official can also ask for a TI.
- If the injured athlete is ready before the cleaning is finished, they can ask for a TI. The JU decides, e.g. depending on whether poor taping was the cause.

---

## 5. Clarified interpretations

| Question | Decision |
|---|---|
| Lead: when does the recovery period start? | The moment the athlete falls or is on the ground |
| Boulder: does the TI attempt count as an attempt? | Depends on the individual case, the JP decides. Irrelevant for the calculation |
| Boulder: amount of the time credit | Time left when the affected attempt started, as an approximate value |
| Boulder 1, scenario 1 | Next rotation: remaining time on B1, then 1 rotation of rest, then B2 |
| Rounds with 2 courses | Shift only on the affected course |
| Lead qualification with 2 routes | No effect on the calculation. At least 50 min between the end of the restart on route 1 and route 2 (Annex A §4.4) |
| End of the start list | Earlier slot as soon as the TI boulder is free after the last athlete; at least 1 rotation of rest, no gap at B1 |
| World Series (Finals) | Return always after the end of the current rotation, as the only athlete |
