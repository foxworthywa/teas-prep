# Audit: sci_reason_batch2.json (27 items, S.4.1–S.4.4)

Auditor pass, 2026-11-18. No bank files were edited.

## Summary

- **Keys:** All 27 keys are correct, and each is the only defensible answer. S.4.1-009 has a key that is correct but can be reached without the skill being tested (see must-fix 1).
- **Arithmetic recomputed:** 450 mg = 0.45 g. 102.2 °F → (70.2)(5/9) = 39.0 °C. 42.5 − 35.0 = 7.5 mL = 7.5 cm³. 600,000 mm = 600 m, 0.5 km = 500 m, 5,000 cm = 50 m. 0.25 mg = 250 mcg. Boyle's law: 2 × 6 = 4 × V, so V = 3 L. Interpolation: (130 + 165)/2 = 147.5, about 148 (the 3–7 mph segment is exactly linear at 17.5 bpm/mph). Doubling: 500 × 2⁴ = 8,000. Student means in S.4.1-007: 50.0, 47.23, 50.17, 50.73.
- **Error paths:** Most produce the stated values. Two do not: S.4.1-006 (88.8) and S.4.3-010 (option A "adds 500 per period"). See should-fix 2 and 3.
- **Letter references:** Every letter in every note points to the right option text. This includes both select-all keys (A, B, D) and the ordered key (B, C, A, D).
- **Science:** The sugar solubility values match real sucrose data (203.9 / 238.1 / 287.3 / 362.1 g per 100 g water; about 487 g at 100 °C), so "more than 362 g" is correct. The predator–prey lag is correct. The chip bag at altitude is correct. The dehydration sequence is defensible, but its explanation leaves out the main ADH trigger (osmolality) and calls the brain the gland that releases ADH. See should-fix 4.
- **Objective fit:** All codes fit the official outline. S.4.2-008 (improving a design) arguably belongs in S.4.4 (optional).
- **Clueing:** The key is the unique longest option in only two MC items: S.4.1-009 (digit count, tied to must-fix 1) and S.4.2-007 (hedged wording). MC key spread is A 7, B 4, C 5, D 7. Three A keys in a row: S.4.3-004/005/006.

---

## Must-fix

| # | Item | Problem | Suggested fix |
|---|---|---|---|
| 1 | S.4.1-009 | **The tested error gives the right answer.** The item tests unit conversion, and the note says "comparing the raw numbers without converting units leads students astray." But the key, 600,000 mm, is also the largest raw number. A student who ignores units entirely picks the key. The item can't tell a student who converts from one who doesn't, and its diagnostic signal is backwards. | Make the key a value with a small raw number. For example, use options **60,000 mm** (60 m), **0.5 km** (500 m, key), **450 m**, **5,000 cm** (50 m). The largest raw number (60,000) is now wrong, and the key has the smallest raw number. Update the explanation and note: "A: 60 m. C: 450 m. D: 50 m. Picking the biggest number without converting gives A." Re-letter as needed. |

## Should-fix

| # | Item | Problem | Suggested fix |
|---|---|---|---|
| 2 | S.4.1-006 (supply) | **The note's error path doesn't match its value.** It lists "88.8 (forgetting to subtract 32 first: 102.2 × 5/9 ≈ 56.8 …)". 102.2 × 5/9 = 56.8, not 88.8. The value 88.8 comes from a different error: multiplying by 5/9 first and then *adding* 32 (56.8 + 32 = 88.8). The 126.4 path (70.2 × 9/5 = 126.36) is correct. | Rewrite: "Common errors: 56.8 (multiplies by 5/9 without subtracting 32); 88.8 (multiplies by 5/9, then adds 32, i.e., runs the formula backward); 126.4 (subtracts 32 but uses 9/5 instead of 5/9)." |
| 3 | S.4.3-010 | **Option A's first error path is wrong.** Adding 500 per period for 4 periods gives 500 → 1,000 → 1,500 → 2,000 → **2,500**, not 2,000. The more likely routes to 2,000 are multiplying by the number of periods (500 × 4) or doubling once per hour (2 doublings). | Rewrite the A note: "A: multiplies 500 by the 4 periods (500 × 4) instead of doubling, or doubles only twice (once per hour)." C and D are fine. |
| 4 | S.4.3-009 (ordered) | **The physiology in the explanation is incomplete or imprecise.** (a) The main trigger for ADH release in dehydration is rising plasma osmolality, sensed by hypothalamic osmoreceptors. A drop in blood volume (sensed by baroreceptors) is a second, weaker trigger. The item presents volume loss as the only trigger. (b) "The brain … releasing ADH": the hypothalamus makes ADH, and the posterior pituitary releases it. A&P-bound students will be taught exactly this distinction. The order itself is defensible and the key is right. | Change event B to "Blood volume falls and the blood becomes more concentrated." Rewrite the explanation: "Water loss lowers blood volume and raises the blood's solute concentration. The hypothalamus detects this, and the posterior pituitary releases ADH. ADH makes the kidney's collecting ducts reabsorb more water, so less water is lost and the urine becomes more concentrated." The key stays B, C, A, D. |
| 5 | S.4.1-006 (supply) | **Accepted-answer list is narrow.** The list is `39|39 °C|39°C|39.0`. Batch 1's supply items were widened after the last audit, and this one should match. Reasonable inputs that would be marked wrong: `39.0 °C`, `39.0°C`, `39 C`, `39C`, `39 degrees`, `39.00`. | Add those values, or rely on a numeric-normalizing grader if one is adopted. |

## Optional

| # | Item | Problem | Suggested fix |
|---|---|---|---|
| 6 | S.4.2-007 | The key is the unique longest option (49 vs 35–44 characters), and it is the only hedged one ("can't show cause"). Test-wise students learn to pick hedged answers. | Lengthen A or B with a plausible qualifier, e.g. B: "Headaches lead people to drink more coffee to cope." Or shorten D: "They are linked; cause is unknown." |
| 7 | S.4.2-005 | The distractors (smell, cost, liking it) are all plainly unrelated to infections, so the item is easier than its difficulty 3 rating. The key also leaves out "comparable units," which the explanation relies on. | Add a distractor that tests the *direction* of evidence, e.g. "Units using it had fewer infections than similar units without it" (this strengthens the claim). Edit A to "Infection rates were the same in similar units with or without it." Or lower the difficulty to 2. |
| 8 | S.4.2-006 | The note says A, B and D each "generalize to a broad rule." D ("the sun will rise tomorrow") is an inductive *prediction* about one case, not a rule. | "A, B and D: each draws a conclusion from past observations (inductive reasoning); the conclusion could be overturned by a new observation." |
| 9 | S.4.4-006 | Option C ("The sample size is too large") is not plausible. The stem gives no sample size, and nobody believes a study can be too big. | Replace it with a plausible but wrong flaw, e.g. "The drug group should also have received a placebo." Note: "C: giving the drug group a placebo as well adds nothing; the placebo group already serves as the comparison." |
| 10 | S.4.3-004 | Solubility tables report grams per 100 **g** of water, not per 100 mL. The difference is small, but the source data is per 100 g. | Change "100 mL of water" to "100 g of water." |
| 11 | S.4.3-007 | Only one option falls between 130 and 165, so bracketing alone finds the key without interpolating. This is acceptable at difficulty 2. | If more rigor is wanted, change A to "About 140 bpm" (the answer you get if you assume no change from 5 to 6 mph plus a little) and keep the key at 148. Note that 140 is still "between," so the item becomes harder. Otherwise leave as is. |
| 12 | S.4.2-008 | This item is about improving an experimental design (sample size, random assignment, controls). It fits S.4.4 (apply the scientific method) a little better than S.4.2. | Consider relabeling as S.4.4. If you relabel, renumber to avoid collisions. |
| 13 | S.4.1-007 | The options are in the order Student 2, 1, 3, 4, which looks odd next to the table. | Put the options in order (Student 1–4) and re-key to A, or keep the shuffle on purpose to balance key letters. |
| 14 | Batch level | Key letters: B is under-used (4 of 23 MC) and there are three A keys in a row (S.4.3-004/005/006). Some concepts overlap with batch 1: Boyle's law (batch 1 S.4.3-002 is qualitative, S.4.3-006 is quantitative), observation vs inference (S.4.2-001 / S.4.2-009), and correlation vs causation (S.4.2-003 / S.4.2-007). The overlaps are acceptable for a practice bank. | Re-letter 2–3 items to B (e.g. S.4.3-005 or S.4.3-006). Make sure adaptive delivery doesn't serve the overlapping pairs back to back. |

## No issues found

S.4.1-004, S.4.1-005, S.4.1-008, S.4.1-010, S.4.2-004, S.4.2-009, S.4.2-010, S.4.3-005, S.4.3-006, S.4.3-008, S.4.4-005, S.4.4-007, S.4.4-008, S.4.4-009, S.4.4-010. For all of these, the key is correct and unique, the notes match the letters, and the objective fits. In S.4.4-010, "makes a prediction" is standard intro-level framing. Strictly speaking, a prediction is derived from a hypothesis, but that is fine at this level.
