# Math Batch 3 Audit (math_batch3.json, 20 items)

What I did: I recomputed every key and every distractor value in Python, following the error path each note describes. I also checked objective fit, clueing, cross-item dependencies and the accepted forms for Supply-answer items. I did not edit the file.

## Bottom line

- **Keys:** All 20 keys are correct, and each has only one defensible answer. Recomputed keys: 100; April to May; 27 (12/44 = 27.27%); 30; 16.5; 82; A,C,D; 2.9; 3; B (loses 125 mL/h); 8; cigarettes/day; 15 cm; 30 in²; 1,000 mL; 55°; 40 oz; 167.6 cm (167.64); 2 tablets; 6 tsp.
- **Must-fix:** none.
- **Should-fix:** 5 items: M.2.5-007, M.2.2-006, M.2.3-007, M.2.4-008, and the M.2.3-006/M.2.3-007 pair (cross-item answer leak).
- **Distractor notes:** 15 of 20 items have notes whose error paths produce exactly the stated values with matching letters. The exceptions: one false note (M.2.5-007 C), one mislabeled note (M.2.5-007 B), one note with no computable path (M.2.2-006 B), one artificial path (M.2.2-006 D), and two vague notes (M.2.3-007 A, M.2.4-008 C).
- **Key balance (MC, 16 items):** A=5, B=3, C=4, D=4. No position cue.

## Item findings

| ID | Problem | Suggested fix | Severity |
|---|---|---|---|
| M.2.5-007 | The key is correct: 0.5 g = 500 mg, and 500 ÷ 250 = 2. A (20) checks out: 5,000 mg ÷ 250 = 20. **The note for C is false.** The other decimal slip, 0.5 g → 50 mg, gives 50 ÷ 250 = **0.2**, not 5. No decimal misplacement yields 5, because 5 tablets would need 1,250 mg. **The note for B is mislabeled.** "Uses the order without converting units" gives 0.5 ÷ 250 = 0.002. The real path to 0.5 is the inverted ratio, 250 ÷ 500 = 0.5, which is a common dosage error. | Change C to **0.2** with the note "C: converts 0.5 g to 50 mg (moves the decimal one place too few), then 50 ÷ 250." Leave A's note covering only 20. Rewrite B: "B: divides the tablet strength by the order (250 ÷ 500) instead of the order by the tablet strength." | should-fix |
| M.2.2-006 | The key is correct: (400 + 92) ÷ 6 = 82. A (86 = (80 + 92) ÷ 2) checks out. **B (84) has no computable path.** "Adds 4 points without recalculating" does not say where the 4 comes from. (12 ÷ 3 = 4 is not a recognizable error.) **D (81) is artificial.** "80 + 12 ÷ 12" divides by 12 for no reason a student would have. | Replace with nameable errors. **B: 98.4.** The student divides the new total by 5, forgetting that there are now 6 scores (492 ÷ 5). **D: 82.4.** The student spreads the 12-point excess over 5 scores instead of 6 (80 + 12 ÷ 5). Update the notes. | should-fix |
| M.2.3-007 | The key is correct: 1,000 ÷ 125 = 8. B (875) and D (125) check out. **The note for A ("an arithmetic slip") gives no error path for 7.** | Replace A with **0.125**, with the note "divides the rate by the starting volume (125 ÷ 1,000)." Another option is **9**: the student adds 125 to 1,000 instead of subtracting, (1,000 + 125) ÷ 125 = 9. | should-fix |
| M.2.3-006 / M.2.3-007 | **Cross-item answer leak.** The two items share the stimulus V = 1,000 − 125t. M.2.3-006's note C says "the bag empties after 8 hours," which is M.2.3-007's key. Its note D says "875 mL is left," which is M.2.3-007's distractor B. If notes are shown as feedback, or both items land on the same form or adaptive path, a student who sees M.2.3-006 first is handed M.2.3-007. | Rewrite M.2.3-006's notes so they don't solve the sibling item. C: "125 is the hourly rate, not a number of hours." D: "125 is the amount lost each hour, not the amount left." Mark the pair as enemy items (never on the same form or path), or present them as one shared-stimulus set. | should-fix |
| M.2.4-008 | The key is correct: 180 − 35 − 90 = 55. A (145) and D (235 = 360 − 125) check out. **The note for C ("subtraction error") is vague.** The batch 1/2 standard says every note should name the operation that yields the value. | Rewrite: "C: adds 35 + 90 as 115, then 180 − 115 = 65." | should-fix |
| M.2.5-006 | The key is correct: 66 × 2.54 = 167.64 ≈ 167.6. All notes check out: B = 152.4, C = 66 ÷ 2.54 = 25.98 ≈ 26.0, D = 5.5 × 2.54 = 13.97 ≈ 14.0. **Weak distractors:** 26 cm and 14 cm are not plausible adult heights, so a student can eliminate C and D by sense alone. | Replace D with **170.7**: the student reads 5 ft 6 in as 5.6 ft, so 5.6 × 12 × 2.54 = 170.69. Optionally replace C with **165.0**: the student rounds 2.54 to 2.5 (66 × 2.5). | optional |
| M.2.3-007 | **Objective fit:** setting V = 0 and solving is mostly linear-equation work (M.1). The M.2.3 content, what the zero means in context, is only implicit. | Optional: add an interpretive layer, or accept it as is. Fit is borderline, not wrong. | optional |
| M.2.4-007 | The key 1,000 and both error paths check out: 35 (sum) and 200 (20 × 10). The accepted forms are enumerated and inconsistent. They accept "1000mL" but not "1,000mL", "1000 ml" (lowercase) or "1000 cm3". | Grader-level normalization (see the global note). | optional |
| M.2.1-007 | The key and accepted forms (27, 27%, 27 %) are fine. Both error values check out: 12, and 20 = 100 ÷ 5. "27.0" would be marked wrong. | Grader-level normalization. | optional |
| M.2.5-008 | The key 6 and the error 2 ÷ 3 check out. "6.0" and "6tsp" are not accepted. | Grader-level normalization. | optional |
| M.2.4-005 | The key and all notes check out: 21, 225 and 10.5. Difficulty is tagged 3, but this is a single-step Pythagorean item on a scaled 3-4-5 triple. | Consider retagging it as difficulty 2. | optional |
| All others (M.2.1-005, M.2.1-006, M.2.1-008, M.2.2-005, M.2.2-007, M.2.2-008, M.2.3-005, M.2.3-006 key/options, M.2.3-008, M.2.4-006, M.2.5-005) | The keys are correct, every distractor value is reproduced by its stated error path, and the letters match. The items fit their objectives. Values checked: 50/70/35; −3/−4/+1/−5; 90/1.5/60; 15 (mode)/17 (mean)/18; mean 9, median 8, mode 8, range 11; 3/9.7/29; 6/(1/3)/5.5; 60/16/32; 25/32/35. M.2.2-008 (a weighted mean from a frequency table) is a good M.2.2 item. | — | — |

## Global notes

1. **Accepted forms:** This repeats the batch 1/2 recommendation. Normalize in the grader: strip whitespace, case, commas, a trailing unit or %, then compare numerically. That covers all three Supply items here (M.2.1-007, M.2.4-007, M.2.5-008).
2. **Shared stimuli:** M.2.3-006/007 is the first shared-stimulus pair in the math bank. The bank needs an enemy-item or set field so the delivery engine keeps such pairs apart, or deliberately groups them.
