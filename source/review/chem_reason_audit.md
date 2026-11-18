# Audit: sci_chem_batch1.json (S.3.1–S.3.6) and sci_reason_batch1.json (S.4.1–S.4.4)

Auditor pass, 2026-11-17. No bank files were edited.

## Summary

- **Keys:** All 30 keys are correct. 29 of them are the only defensible answer. In S.4.3-001, a strong student can argue that distractor D is also testable.
- **Letter references:** Every letter in every explanation and distractor note points to the correct option text. This includes the multi-letter notes (S.3.2-003 "B and D", S.3.6-001 "A and B", S.4.1-001 "A and B", S.4.3-002 "A, B and D", S.4.4-001 "C and D"). I also checked the select-all key for S.3.2-003 (A, C, E) and the ordered-response key for S.4.4-003 (C, B, D, A, E).
- **Chemistry accuracy:** Nothing is factually wrong at intro level. These were all checked and are correct: the neutralization products (salt + water, with "usual" hedging NH₃-type cases), how a catalyst works (lowers activation energy, is not consumed, does not change yield), conservation of mass (the note handles the E = mc² quibble), the pH log math (4 vs 6 gives 100×), hypertonic crenation, Boyle's law with the kinetic explanation, the 5% w/v calculation, and the equation balancing.
- **Clueing:** No key is the unique longest option in any MC item (I checked character counts for all 28 MC items). The key letters are spread A 6, B 6, C 7, D 9 (MC only). There is no harmful word repetition from stem to key.
- **Main problem:** The Scientific Reasoning objective labels do not match the official TEAS 7 outline. S.4.2 and S.4.3 are swapped, and one hypothesis item belongs in S.4.4. Details are in item 1 below.

Official TEAS 7 wording (ATI content outline): S.4.1 *Use basic scientific measurements and measurement tools*; S.4.2 *Apply logic and evidence to a scientific explanation*; S.4.3 *Predict relationships among events, objects, and processes*; S.4.4 *Apply the scientific method to interpret a scientific investigation*. The Chemistry labels S.3.1–S.3.6 match the outline (atomic structure, physical properties and changes, chemical reactions, conditions affecting reactions, solutions, acids and bases).

---

## Must-fix

| # | Item(s) | Problem | Suggested fix |
|---|---|---|---|
| 1 | S.4.2-001, S.4.2-002, S.4.3-001, S.4.3-002, S.4.3-003 | **Objective mislabels.** S.4.2-001 (extrapolating the enzyme curve) and S.4.2-002 (Boyle's law, inverse relationship) are *predict relationships* items, which is S.4.3. S.4.3-002 (inference vs observation) and S.4.3-003 (strongest evidence for a claim) are *logic and evidence* items, which is S.4.2. S.4.3-001 (identify a testable hypothesis) is a *scientific method* item, which is S.4.4. These items are flagged diagnostic, so a wrong label sends students to the wrong study objective. S.4.2-003 (correlation vs causation) fits S.4.2 and can stay. | Relabel S.4.2-001 → S.4.3, S.4.2-002 → S.4.3, S.4.3-002 → S.4.2, S.4.3-003 → S.4.2, S.4.3-001 → S.4.4. Then renumber the IDs. Collision-free option: S.4.3-001/002 become the enzyme and Boyle items, S.4.2-001/002 become inference and evidence, and the hypothesis item becomes S.4.4-004. The counts would then be S.4.2: 3, S.4.3: 2, S.4.4: 4. Consider writing one more S.4.3 item, such as a direct vs inverse relationship read from a small table or graph. |

## Should-fix

| # | Item | Problem | Suggested fix |
|---|---|---|---|
| 2 | S.4.3-001 (hypothesis) | **Second defensible answer.** D, "Plants are green because their leaves contain the pigment chlorophyll," is a causal explanation that can be tested (extract the pigment, compare leaves without chlorophyll). The note's reason ("a known fact or explanation, not a prediction to test") does not make D untestable, and strong students will notice. | Replace D with a statement that is clearly not a testable hypothesis, e.g. "Gardeners should water their plants every morning." (a recommendation; the note becomes "D: a recommendation or value judgment, not a prediction that can be tested"). Alternatively, tighten the stem: "Which statement is written as a hypothesis that an experiment could test?" Replacing D is the cleaner fix. |
| 3 | S.4.4-002 | **Depends on another item.** "In the same fertilizer experiment…" only works if S.4.4-001 is shown just before it. Diagnostic and adaptive delivery will show it alone. | Make it self-contained: "A student gives four groups of plants 0, 5, 10 and 15 grams of fertilizer and measures their height after three weeks. What is the purpose of the group that receives 0 grams?" |
| 4 | S.3.5-003 (supply) | **Accepted answers are incomplete.** The list is `12.5|12.5 g|12.50`. I found no answer-normalization code in /home/claude/teas/build, so I assume exact matching. Reasonable inputs that would be marked wrong: `12.5g`, `12.5 grams`, `12.5grams`, `12.50 g`, `12.5 gram`. | Add `12.5g|12.5 grams|12.5grams|12.50 g|12.50g|12.5 gram`, or make the grader strip spaces and commas, drop a trailing unit (g/gram/grams), and compare numerically. The grader route also fixes item 5 and future items. |
| 5 | S.4.1-002 (supply) | Same problem. The list is `2500|2,500|2500 g|2,500 g`. Missing: `2500g`, `2,500g`, `2500 grams`, `2,500 grams`, `2500.0`, `2500.0 g`. | Add those values, or use the normalized-grader fix above. Also note the delimiter style differs from sci_ap_batch1 S.1.4-002, which uses ` | ` with spaces. Pick one convention, or make sure the parser trims whitespace. |

## Optional

| # | Item | Problem | Suggested fix |
|---|---|---|---|
| 6 | S.3.2-003 | The explanation says burning and baking form substances "that cannot be turned back." Irreversibility is a clue, not the defining test, and students often over-apply it. The defining test is a new substance with new properties. Calling dissolved salt a physical change is the standard intro/TEAS convention and is acceptable. | "B and D are chemical changes: burning and baking form new substances (ash, gases, new compounds in the cake) with different properties." Drop "that cannot be turned back," or soften it to "which usually cannot be easily reversed." |
| 7 | S.3.3-003 | The key "Exactly 10 grams" (16 characters) is the short outlier. The other three options are 46–52 characters and each gives a reason, which is a mild reverse cue. A pedant could also object to "exactly," though the note on A handles that well. | Lengthen the key in parallel, e.g. "10 grams, because atoms are only rearranged." Keep the note on A as written. |
| 8 | S.3.4-003 | The note on A says cold air "has about the same proportion of oxygen." That is true, but cold air actually holds slightly *more* oxygen per liter because it is denser. | "A: cold air has the same proportion of oxygen (slightly more per liter, since it is denser), and oxidation does not stop." |
| 9 | S.3.5-003 | The distractor rationale "50 (treating 5% as per 25 mL)" is contrived. The likely error that produces 50 is 250 ÷ 5. | "50 (dividing 250 by 5)." Another common error to list: 1.25 (using 0.5% or misplacing the decimal). |
| 10 | S.3.6-003 | The note on D explains where CO₂ comes from but not oxygen. Neither combustion nor neutralization produces O₂. | "D: neutralization produces neither gas; CO₂ comes from combustion or from an acid reacting with a carbonate, and oxygen is a reactant in combustion, not a product." |
| 11 | S.3.6-001 | Options are not parallel. The key "Acidic" is the only unmodified option, and there is no acidic distractor, so the item reduces to "below 7 or not." It is fine for difficulty 1. | Optional: use "Strongly basic / Weakly basic / Neutral / Acidic" as is, or use "Acidic / Neutral / Basic / Amphoteric." Do not add "weakly acidic," because that would create ambiguity. |
| 12 | S.3.5-002 | The stem defines hypertonic, which removes most of the difficulty. A difficulty-3 rating is then too high. TEAS expects students to know the term. | Either remove the parenthetical definition and keep difficulty 3, or keep it and lower the difficulty to 2. |
| 13 | S.4.1-001 | "Measure **exactly** 37 mL" overstates what any of these tools can do. The nurse framing is also odd, because nurses measure liquids with oral syringes and medicine cups, not lab glassware. | "A student needs to measure 37 mL of a liquid as precisely as possible. Which tool should she use?" |
| 14 | S.4.1-003 | The key is the only option that uses the technical term "meniscus." That is a mild term-of-art cue. | Move the term into the stem: "Water in a graduated cylinder forms a curved surface called a meniscus. How should you read the volume?" Then remove "(meniscus)" from B. |
| 15 | S.4.2-002 | The note on D, "pressure would drop only if the gas were removed," is loose: removing some gas lowers pressure but does not make it zero. | "D: pressure would reach zero only if all the gas were removed." |
| 16 | Coverage (both files) | These TEAS 7 topics have no items yet: chemical bonding (ionic, covalent, hydrogen bonds), isotopes and ions as a computation, solution concentration/dilution beyond % w/v, buffers, reading a graph or table (S.4.3), and metric prefixes other than kilo- (S.4.1). | Consider these for batch 2. |

## Items with no issues

S.3.1-001, S.3.1-002, S.3.1-003, S.3.2-001, S.3.2-002, S.3.3-001, S.3.3-002, S.3.4-001, S.3.4-002, S.3.5-001, S.3.6-002, S.4.2-001 (content; label issue above), S.4.2-003, S.4.3-002 (content; label issue above), S.4.3-003 (content; label issue above), S.4.4-001, S.4.4-003.
