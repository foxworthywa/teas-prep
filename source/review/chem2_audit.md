# Audit: sci_chem_batch2.json (S.3.1–S.3.6, 22 items)

Auditor pass, 2026-11-18. No bank files were edited. I compared my findings with the blind solve in chem2_blind.md and checked for overlap with sci_chem_batch1.json.

## Summary

- **Keys:** All 22 keys are correct, and each is the only defensible answer at intro level. That includes the select-all key for S.3.1-007 (A, C, E). My answers matched the blind solver's on every item.
- **Numbers recomputed:**
  - S.3.1-004: 15 − 7 = 8.
  - S.3.2-006: 25 ÷ 20 = 1.25 g/mL, so it sinks.
  - S.3.3-004: 4Al + 3O₂ → 2Al₂O₃ gives 4 Al and 6 O on each side. A, B and C each fail exactly as their notes say: O is 6 vs 3, 12 vs 6, and 2 vs 3.
  - S.3.3-006: the ratio is 1:1, so the answer is 6.
  - S.3.5-004: 20 × V₁ = 4 × 500, so V₁ = 100 mL.
  - S.3.5-007: 0.9 g/100 mL × 1,000 mL = 9 g.
  - Every stated error path produces the value its note gives: 22 = 15 + 7; 0.8 = 20/25; 3 = 6/2; 12 = 6 × 2; 125 = 500/4; 400 = 500 − 100; 2,500 = 20 × 500/4; 90 = 0.9 × 100; 0.09 = 0.9/10.
- **Letter references:** Every letter in the explanations and distractor notes points to the correct option, including the multi-letter notes (S.3.1-006 "A, B and D", S.3.2-006 "A and D", S.3.2-007 "B, C and D", S.3.4-005 "A and C", S.3.5-006 "A and B").
- **Length cues:** No key is the unique longest option in a way that matters. S.3.2-004 is technically longest by 1 character ("Condensation"), which is harmless. MC key spread is A 6, B 4, C 6, D 5.
- **Main problems:**
  - S.3.4-004 tests a physical process (dissolving) under a chemical-reactions objective, and students can find the key by elimination.
  - S.3.6-006 has three distractors that do not hold up on their own terms.
  - S.3.3-006 prints the balanced H₂/O₂ equation, which is the answer to batch 1's S.3.3-001.

---

## Must-fix

| # | Item | Problem | Suggested fix |
|---|---|---|---|
| 1 | S.3.4-004 (sugar cube) | **(a) Objective fit.** S.3.4 is *how conditions affect chemical reactions*. Dissolving sugar is a physical change, and batch 1's S.3.2 items teach that dissolving is physical, so this item contradicts the bank's own framing. **(b) Answerable by elimination.** D is the only option that combines two factors and the only one that speeds things up. A, B and C all slow dissolving or do nothing, so a student who knows no rate factors can still pick "fastest." B ("leaving the cup completely still") is also not a change from any stated baseline. The item is flagged diagnostic, so it would route students on a signal it does not measure. | Use a real reaction and mixed-direction distractors. Example: "An antacid tablet fizzes as it reacts with water. Which change would make it finish reacting fastest?" A "Using a whole tablet in cold water", B "Using a whole tablet in warm water", C "Crushing the tablet and using cold water", D "Crushing the tablet and using warm water" (key D). This 2×2 design forces the student to know both factors. Notes: A slows on both factors; B and C each use only one of the two speed-ups. If you would rather keep the sugar cube, retag the item to S.3.5 (properties of solutions / rate of dissolving) and still apply the 2×2 option fix. |

## Should-fix

| # | Item | Problem | Suggested fix |
|---|---|---|---|
| 2 | S.3.6-006 (antacid) | **Weak distractors, so it tests reading more than chemistry.** B (an acid that strengthens stomach acid) and C (a buffer that *raises* the amount of stomach acid) contradict "relieve heartburn" on their face. D (an enzyme that digests acid) is chemically meaningless. Only A holds up. The explanation is also slightly wrong for the example it names: "Acid + base → salt + water" leaves out the CO₂ that calcium carbonate produces. | Build the distractors on the pH-direction misconception. A "a base that neutralizes stomach acid, raising the pH" (key); B "a base that neutralizes stomach acid, lowering the pH"; C "an acid that dilutes stomach acid"; D "a substance that adds hydrogen ions, raising the pH." Avoid "blocks acid production" (PPIs/H2 blockers), because that is a real heartburn mechanism and could be argued as correct. Explanation: "Acid + base → salt + water (carbonates also release CO₂), so the stomach contents become less acidic and the pH rises." |
| 3 | S.3.3-006 (H₂ → H₂O) | **Cross-item cue.** The stem prints "2H₂ + O₂ → 2H₂O", which answers batch 1's S.3.3-001 (balance __H₂ + __O₂ → __H₂O; key 2, 1, 2). Both are S.3.3 and could appear in the same session or diagnostic. | Use a different reaction. Example: "In the reaction CH₄ + 2O₂ → CO₂ + 2H₂O, how many molecules of O₂ are needed to react with 5 molecules of CH₄?" Options 10 / 5 / 2 / 20 (key 10). Notes: 5 assumes 1:1; 2 copies the coefficient; 20 counts O atoms (10 × 2). Avoid N₂ + 3H₂ → 2NH₃, which S.3.4-006 already uses. Also present numeric options in ascending order (2, 5, 10, 20). |

## Optional

| # | Item | Problem | Suggested fix |
|---|---|---|---|
| 4 | S.3.2-005 | The blind solver flagged that "0 °C" in the stem is echoed in key B. The cue is weak because C and D also mention 0 °C. The item is fine as is. | If you want to remove it anyway, change the key to "It stays the same until the ice is gone." |
| 5 | S.3.2-006 | The note for D lumps it with A ("divide volume by mass"). D is actually a double error: inverted density *and* a wrong float rule, since 0.8 < 1 would float. | "A: divides volume by mass (0.8). D: divides volume by mass and then also misapplies the float rule; 0.8 g/mL would float." |
| 6 | S.3.2-007 | The note says density, boiling point and color "can be observed without changing the substance." Measuring a boiling point does change the state. | "…can be measured without changing the substance into a different substance." |
| 7 | S.3.3-006 | If the item is kept: the note "B: uses the O₂ ratio (6 ÷ 2)" is vague. | "B: gives the number of O₂ molecules used (6 ÷ 2 = 3), not the water formed." |
| 8 | S.3.3-007 | The note on A says endothermic reactions "feel cold." That is true only of ones that draw heat from the surroundings, such as a cold pack. D ("no net energy change") is a weak distractor given that the stem says "gives off heat and light." | "A: endothermic reactions absorb energy from their surroundings (a cold pack feels cold)." D could become "Endothermic, because heat must be added to light the wood," which targets a real misconception about activation energy. |
| 9 | S.3.4-005 | This covers nearly the same ground as batch 1's S.3.4-002 (how a catalyst works / activation energy). It is not an error, just redundant bank coverage. | Keep it, or refocus it on "a catalyst is not used up" or "does not change the amount of product." |
| 10 | S.3.4-006 | B ("Stop reacting until the N₂ is used") is weak. | Use "Shift right until all the added N₂ is used up," which tests the "complete consumption" misconception. Note: "the system uses up only part of the added N₂; a new equilibrium forms." |
| 11 | S.3.5-005 | The stem asks about rate ("faster"), but the explanation covers only solubility. | Add: "…and the faster-moving gas molecules escape more readily." |
| 12 | S.3.6-005 | Strictly, a blood pH of 7.30 is *acidemia*, and *acidosis* is the process. "Acidosis" is the standard TEAS/nursing-prep usage. | No change needed. Optionally add "(strictly, acidemia)" to the explanation. |

## Items with no issues

S.3.1-004, S.3.1-005, S.3.1-006, S.3.1-007, S.3.2-004, S.3.3-004, S.3.3-005, S.3.5-004, S.3.5-006, S.3.5-007, S.3.6-004.

All of these fit their objectives. The pH 7.35–7.45 range and the 0.9% saline content in S.3.5-007 and S.3.6-005 are correct.
