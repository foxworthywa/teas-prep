# Reading Batch 2 Audit (read_batch2.json, 59 items, plus R.3.1-005 from read_batch1.json)

Scope: key correctness and uniqueness, passage-only answerability, explanation and distractor-note accuracy and letter-matching, objective fit, clueing, serial commas, overlap with read_batch1.json, and passages RP-17 to RP-24. No files were edited.

Summary: 60 items reviewed. 19 FIX and 41 PASS in the per-item verdicts. Of the 19 FIX items, 5 are MUST-FIX and 14 are SHOULD-FIX (2 of those are overlap replacements). The SHOULD-FIX section has 17 entries. The other 3 are form-separation notes on items that pass. Answer key balance: A 15, B 15, C 14, D 14 (plus 1 ordered response). No length clueing found. Serial (Oxford) commas: no missing commas in items or in RP-17 to RP-24 (regex scan plus manual read).

---

## MUST-FIX

### R.1.6-005 (RP-20): two defensible answers
Passage: "She asked Marcus to bring flashlights from the supply closet **while** she checked that the backup generator had started ... **Then** she asked him to sit with the patients."
Checking the generator happened at the same time as the request, not "right after" it. The next action in sequence is C (asked him to sit with patients), so a careful reader can defend C. The note for C ("she asked this after checking the generator") makes the same timing assumption.
Fix (re-key to the "Then" action):
- Stem: "What did Ms. Reyes ask Marcus to do after she sent him for flashlights?"
- Options: A "Lock up the clinic for the night." / B "Check that the backup generator had started." / C "Sit with the waiting patients and explain what was happening." / D "Call the doctor to cancel the evening appointments."
- Answer: C.
- Explanation: "She sent Marcus for flashlights while she checked the generator herself. Then she asked him to sit with the patients and explain what was happening."
- Distractors: "A: they locked up at the end of the story. B: Ms. Reyes checked the generator herself while Marcus got the flashlights. D: the story says every patient was seen."

### R.3.4-006 (RP-19 + RP-11): does not need RP-11; adds a fact not in the sources; weekday problem
- The date in the stem plays no part in the answer. 7:35 a.m. is just Run 1's Student Center time, so this is an R.1.5 table lookup and not an R.3.4 integration item. The explanation's "permits are available starting January 10" is not needed to get the answer, and it gives away R.1.3-007.
- "which is next to the Student Center" is invented. RP-11 says only "Room 104, Workforce Building." The stem also never says where the student is arriving ("earliest time the student can arrive").
- RP-19 says the shuttle runs Monday through Friday only. January 10 is a Saturday in 2026 and a Sunday in 2027, so a careful student could answer that there is no shuttle that day.
- Arithmetic check: Run 1 Park-and-Ride 7:00, Library 7:15, Health Sciences 7:25, Student Center 7:35. The keyed time of 7:35 is correct as written.
Fix (make the date from RP-11 and the run from RP-19 both necessary):
- Stem: "A student submitted the online permit form on January 8 and wants to pick up the permit as early as possible. The Workforce Building is a short walk from the Student Center stop. Assume January 8 through January 12 are all weekdays. Which date and shuttle run from the Main Street Park-and-Ride should the student choose?"
- Options: A "January 9, Run 1 (arrives at the Student Center at 7:35 a.m.)" / B "January 10, Run 1 (arrives at the Student Center at 7:35 a.m.)" / C "January 10, Run 2 (arrives at the Student Center at 10:05 a.m.)" / D "January 12, Run 1 (arrives at the Student Center at 7:35 a.m.)"
- Answer: B.
- Explanation: "The memo says permits are ready starting January 10, and Run 1 is the earliest shuttle to reach the Student Center that day."
- Distractors: "A: January 9 is the form deadline; permits aren't ready until January 10. C: Run 2 is later than Run 1 on the same day. D: January 12 is when permits become required, not the first pickup day."
- Do not serve this item in the same form as R.1.3-007, which asks for the same January 10 date.

### R.3.4-007 (RP-23 + RP-06): RP-06 is not needed
The arithmetic is correct: 8 g of added sugars ÷ 4 g per teaspoon = 2 teaspoons. However, the conversion factor is given in the stem and the 8 g comes from RP-23, so RP-06 is never used. It appears only as framing and in distractor D.
Fix (use RP-06's daily limit):
- Stem: "The letter in 'Get Sugary Drinks Out of Our Hospital' gives the American Heart Association's daily limit on added sugar for most women. Using the cereal label and that limit, how many servings of the cereal would reach the limit? (1 teaspoon of sugar ≈ 4 grams)"
- Options: A "Less than 1 serving" / B "2 servings" / C "3 servings" / D "About 4½ servings"
- Answer: C.
- Explanation: "One serving has 8 g of added sugars, which is about 2 teaspoons (8 ÷ 4). The letter gives a limit of about 6 teaspoons for most women, and 6 ÷ 2 = 3 servings."
- Distractors: "A: compares 8 grams directly with 6 teaspoons without converting units. B: uses 4 teaspoons per serving, treating the 4 in the conversion as teaspoons. D: uses the limit for most men (9 ÷ 2), not for women."
- Check: 6 ÷ 2 = 3; 9 ÷ 2 = 4.5; 8 ÷ 4 = 2. Each distractor matches a real error.

### R.3.1-005 (batch 1, RP-10): note C is false
Note C says: "55% would still be below the 50–64 and 65+ groups." The 50–64 group is at 52%, so 55% would be above it.
Replacement note: "C: 55% would be higher than the 50–64 group's 52% but still below the 65+ group's 71%. In any case, the goal is 70%, not beating other groups."
The key (B; 35 + 20 = 55, which is below 70) is correct. Overlap check: the stem and options do not reveal the answer to R.1.5-002 (only 65+ met the goal) or R.1.5-004 (rates rise with each older group). The only mention of other groups is in the feedback notes. With the note fixed, this item does not duplicate or give away either item.

### R.3.1-008 (RP-24): misquoted passage sentence
Option C is shown in quotation marks: "Today, doctors warn that bacteria can become resistant to antibiotics when **they** are overused." The passage says "when **these drugs** are overused." The change makes the sentence ambiguous: "they" can now refer to the bacteria.
Replacement option C: "Today, doctors warn that bacteria can become resistant to antibiotics when these drugs are overused."
Also (SHOULD-FIX, same item): D is the only fragment that starts with an ellipsis, which makes it stand out. Use the full sentence: "Fleming published his findings in 1929, but he could not produce enough pure penicillin to treat patients."

---

## SHOULD-FIX

1. **R.1.2-006**: The explanation says "Marcus's calm reassurance of patients is what she praises." Ms. Reyes never praises Marcus directly.
   Replace with: "The plan (flashlights, the generator) helped, but the story shows that calm people looking after the patients got everyone through the night."

2. **R.1.2-008**: Objective fit. "Why does the author most likely mention ..." is an author's-purpose stem (R.2.3), not an inference.
   Either retag to R.2.3, or reword as an inference: "What can the reader infer from the fact that Fleming warned about this problem in his Nobel lecture?" Keep key C, reworded as "Concern about antibiotic resistance is not new."

3. **R.2.1-006**: The stem says "Which statement from Passage A," but B and D are paraphrases.
   Use exact wording. B: "Our school began requiring students to keep phones in their lockers during class." D: "I have seen ... fewer missing assignments." Or change the stem to "Which statement based on Passage A is an opinion?"

4. **R.2.1-007**: The stem says "Which statement from the passage is a fact," but A, C, and D are not in the passage (the notes say so).
   Stem: "Which statement is a fact rather than an opinion?" The explanation can then keep "The other options are opinions that the passage doesn't state."

5. **R.2.1-009**: Two problems.
   - The label has no ingredient list, so "Based on the Nutrition Facts label" is a stretch.
   - The explanation treats 8 g of added sugars as unhealthy. That judgment needs outside knowledge.

   Stem: "A cereal box's front says 'Made with whole grains, so it's healthy!' Which misconception does this slogan encourage?"
   Explanation: "The slogan points to one ingredient, but the label shows that a serving also has 8 g of added sugars and 190 mg of sodium. One ingredient doesn't describe the whole food."
   Difficulty 3 → 2, because the distractors are weak.

6. **R.2.4-006**: The stem is ungrammatical: "How does the author of Passage B's work as an emergency medical technician..."
   Replace with: "The author of Passage B works as an emergency medical technician. How does this most likely shape the author's view?"

7. **R.3.1-009**: Key A says "reassure patients, as Ms. Reyes did." Marcus, not Ms. Reyes, reassured the patients; Ms. Reyes stayed calm and gave directions.
   Replace with: "He will try to stay calm and reassure patients, as he did that night."

8. **R.3.1-010**: Objective fit. The answer is stated word for word ("Watch the area afterward, because a fire can start again"), so this is a locate item (R.1.4), not a conclusion.
   Replacement:
   - Stem: "A worker uses an extinguisher on a small wastebasket fire, and the fire appears to be out. Based on the directions, what should the worker do next?"
   - Options: A "Return to work, since the fire is out." / B "Watch the area and report the fire to the fire department." / C "Put the pin back in and store the extinguisher." / D "Open the windows and wait for the smoke to clear."
   - Answer: B.
   - Explanation: "The directions say to watch the area because a fire can start again, and to report the fire even if you put it out."
   - Distractors: "A: the directions say a fire can start again. C: the directions don't mention this. D: the directions don't mention this."

9. **R.3.2-006**: Two inaccuracies.
   - Note B says "Marcus's training helped." The story says only that the class had not covered everything.
     Replace with: "B: neither story calls training useless; Marcus's class simply didn't cover everything."
   - The explanation says "a supervisor recognizes it." Ms. Reyes makes a general remark rather than praising Marcus.
     Replace with: "Both new workers succeed by paying close attention to the people in their care, and each supervisor's closing words stress the importance of people."

10. **R.3.2-007**: Key D shortens the passage names to "A focuses ... B focuses," while every other option says "Passage A" and "Passage B."
    Replace with: "Passage A focuses on attention and learning; Passage B focuses on safety and health."

11. **R.3.4-008** (RP-22 + RP-17): Objective fit is weak. This is a genre and topic comparison (closer to R.3.2), not integrating information from two sources. The key is also loose: RP-22 reports results; it does not "explain a way" to improve health.
    Either retag, or replace with a true integration item, e.g., "Using both passages, which statement is supported?" with key "Both describe ways people can stay healthier: a vaccine prevents disease, and the challenge raised daily steps."

12. **R.3.3-009** (RP-12): Overlap FIX. The key ("completely safe for everyone") is the same claim already tested in batch 1 by R.2.1-003 (natural means safe for everyone) and R.3.4-004 (the ad claims it is safe for everyone). Seeing either batch-1 item gives this one away.
    Replace with an R.3.3 item on a lightly used passage, e.g., RP-22:
    - Stem: "Suppose the company announces that the walking challenge made its employees healthier. What is the main weakness of this conclusion based on the passage?"
    - Options: A "The passage reports step counts, not any measure of health." / B "The average never reached the company's goal." / C "The challenge lasted only one week." / D "Steps were counted by the wellness coordinator by hand."
    - Answer: A.
    - Distractors: "B: April and May both met the 7,000-step goal. C: the challenge lasted four months. D: employees wore step counters."

13. **R.3.2-010** (RP-14 + RP-20): Overlap FIX. Key D ("Mr. Lyle is slow to accept help") mirrors batch-1 R.3.2-002's key ("Mr. Lyle at first resists advice") and R.1.2-004.
    Replace with a comparison that does not reuse Mr. Lyle's trait:
    - Stem: "How is Marcus's situation in 'The Storm Shift' different from Marisol's in Story A?"
    - Options: A "Marcus must act right away with a supervisor's guidance, while Marisol studies her problem on her own over time." / B "Marcus fails and never recovers, while Marisol succeeds on her first try." / C "Marisol works under a supervisor, while Marcus works completely alone." / D "Both characters ignore advice and succeed by luck."
    - Answer: A.
    - Distractors: "B: Marcus handles the night well, and Marisol fails first. C: this reverses the characters. D: neither succeeds by luck, and Marcus follows Ms. Reyes's directions."

14. **R.2.3-009 / R.1.2-007** (RP-22): R.2.3-009's stem names "the wellness coordinator's note about vacations," and its key gives the reason for May's drop. That is exactly R.1.2-007's question. Do not serve them in the same form; or reword R.2.3-009's stem to "Why does the author include the last sentence of the passage?"

15. **R.2.3-008 / R.1.2-005** (RP-20): R.2.3-008's key ("Marcus felt more stress than his class had prepared him for") states R.1.2-005's answer. Do not serve them in the same form.

16. **R.3.3-006 / R.3.3-007** (RP-21): R.3.3-006's key ("the teacher's own observations after the school's policy began") sets up R.3.3-007's key ("one teacher's observations at one school"). Do not serve them in the same form. Also, R.3.3-007 distractor D ("It agrees completely with Passage B") is very weak; consider "It relies only on statistics from other schools."

17. **R.2.4-010 / batch-1 R.2.3-002** (RP-12): "Whose interests does the ad mainly represent? The company selling the product" is close to a mirror of "purpose: to persuade readers to buy." Do not serve them in the same form (PASS otherwise).

---

## Passage issues (RP-17 to RP-24)

- **RP-17 (vaccines)**: Accurate for this level. "Instructions that let your own cells make a harmless piece" correctly covers mRNA and viral-vector vaccines. Common side effects and yearly flu updates are accurate. No changes.
- **RP-18 (fire extinguisher)**: PASS and the 6–8 ft distance are standard. **Safety-accuracy gap:** fire-safety guidance (NFPA/OSHA) says to sound the alarm or call 911 *before* fighting even a small fire. The passage only says to report the fire afterward.
  Revise sentence 2 to: "Before you use one, make sure the fire is small, someone has pulled the fire alarm or called 911, everyone else is leaving the building, and you have a clear exit behind you."
  This keeps the serial comma and does not change any key (R.1.3-004/005, R.1.6-006, R.2.3-007, R.3.1-010 all still work).
- **RP-19 (shuttle)**: Times are internally consistent (+15, +10, +10 minutes on every run). The Monday–Friday rule creates the January 10 weekend problem in R.3.4-006 (see MUST-FIX).
- **RP-20 (storm shift)**: Consistent. No issues.
- **RP-21 (phones)**: Consistent. However, it carries 12 items, and many keys and notes overlap. For example, R.3.2-007's key ("B focuses on safety and health") answers R.2.4-006, and R.1.1-007's key previews R.2.4-007. Spread RP-21 items across forms.
- **RP-22 (walking)**:
  - The title says "A Survey of One Workplace," but the data are step-counter records, not a survey. Retitle: "Walking for Health: One Workplace's Challenge."
  - The link between lower participation and a lower *average* is only implied. R.1.2-007 and R.3.1-007 depend on it.
    Clarify the last sentence: "The wellness coordinator noted that many employees took vacations in May and wore their step counters less often."
- **RP-23 (cereal label)**:
  - The nutrient values are consistent. 2.5 g fat, 30 g carbohydrate (4 g fiber), and 4 g protein come to about 150 kcal. The 8 g of added sugars is within the 9 g of total sugars.
  - **Orphan sentence:** "The % Daily Value tells you how much a nutrient in one serving contributes to a daily diet." No %DV figures appear on the label. Either add a %DV column or replace with: "All amounts are for one serving."
- **RP-24 (penicillin)**: Dates are correct: 1928 discovery, 1929 paper, Oxford work in 1939–41 (mice 1940, first patients 1941, so "around 1940" is acceptable), U.S. mass production in WWII, and the 1945 Nobel Prize shared by Fleming, Florey, and Chain.
  - "The same warning": Fleming's Nobel lecture warned specifically about *underdosing* and casual misuse, not overuse as such.
    Revise the last two sentences to: "Today, doctors warn that bacteria can become resistant to antibiotics when these drugs are overused or misused. Fleming himself warned about misuse of penicillin in his Nobel lecture."
    Then update R.3.1-008 option C so it quotes the new wording. R.1.2-008 and R.3.4-009 still work.
  - Minor: "a team ... led by Howard Florey and Ernst Chain." Florey led the team, and Chain was its key chemist. This is common shorthand and acceptable. R.1.4-004 depends on it, so leave it unless you want strict accuracy ("led by Howard Florey, with Ernst Chain").

---

## Overlap warnings (vs read_batch1.json, plus serious within-batch pairs)

| Batch 2 item | Overlaps with | Severity | Action |
|---|---|---|---|
| R.3.3-009 | B1 R.2.1-003, R.3.4-004 (same "safe for everyone" claim) | High | Replace (SHOULD-FIX 12) |
| R.3.2-010 | B1 R.3.2-002, R.1.2-004 (Mr. Lyle resists advice) | High | Replace (SHOULD-FIX 13) |
| R.2.4-010 | B1 R.2.3-002 (ad aims to sell) | Medium | Separate forms |
| R.3.4-006 | B2 R.1.3-007 (Jan 10 pickup); B1 R.1.4-001 (pickup place) | Medium | Separate forms after rewrite |
| R.3.2-006 | B1 R.3.2-005, R.1.2-001 (paying attention to people/details) | Low | Separate forms |
| R.3.2-009 | B1 R.3.1-003, R.3.2-001 (Marisol studies failure) | Low | Separate forms |
| R.3.3-010 | B1 R.3.3-001 (identifies the one-college pass-rate evidence) | Low | Separate forms |
| R.1.3-006 | B1 R.1.3-002 (same label dosing lines, different age) | Low | OK |
| R.2.3-009 / R.1.2-007 | within B2 | Medium | SHOULD-FIX 14 |
| R.2.3-008 / R.1.2-005 | within B2 | Medium | SHOULD-FIX 15 |
| R.3.3-006 / R.3.3-007 | within B2 | Medium | SHOULD-FIX 16 |
| R.3.1-005 (B1) | B1 R.1.5-002, R.1.5-004 | None in stem/options | PASS after note fix |

---

## Per-item verdicts

- R.1.1-005: PASS
- R.1.1-006: PASS
- R.1.1-007: PASS
- R.1.2-005: PASS (overlap with R.2.3-008; separate forms)
- R.1.2-006: FIX (explanation says Ms. Reyes "praises" Marcus)
- R.1.2-007: PASS (overlap with R.2.3-009; relies on RP-22 clarification)
- R.1.2-008: FIX (author's-purpose stem tagged R.1.2)
- R.1.3-004: PASS
- R.1.3-005: PASS
- R.1.3-006: PASS
- R.1.3-007: PASS (overlap with R.3.4-006)
- R.1.4-004: PASS
- R.1.4-005: PASS
- R.1.4-006: PASS
- R.1.5-005: PASS
- R.1.5-006: PASS
- R.1.6-004: PASS
- R.1.6-005: FIX (MUST: "while" makes B and C both defensible)
- R.1.6-006: PASS
- R.2.1-006: FIX (options B and D paraphrased under a "from Passage A" stem)
- R.2.1-007: FIX (stem says "from the passage"; 3 options are not in it)
- R.2.1-008: PASS
- R.2.1-009: FIX (outside-knowledge explanation; label framing; difficulty)
- R.2.1-010: PASS
- R.2.2-006: PASS
- R.2.2-007: PASS
- R.2.2-008: PASS
- R.2.2-009: PASS
- R.2.2-010: PASS
- R.2.3-006: PASS
- R.2.3-007: PASS
- R.2.3-008: PASS (overlap with R.1.2-005)
- R.2.3-009: FIX (stem gives away R.1.2-007)
- R.2.3-010: PASS
- R.2.4-006: FIX (ungrammatical stem)
- R.2.4-007: PASS
- R.2.4-008: PASS
- R.2.4-009: PASS
- R.2.4-010: PASS (overlap with B1 R.2.3-002; separate forms)
- R.3.1-005 (B1): FIX (MUST: note C is false about the 50–64 group; no giveaway of R.1.5-002/004)
- R.3.1-006: PASS
- R.3.1-007: PASS
- R.3.1-008: FIX (MUST: misquoted option C; fragment D)
- R.3.1-009: FIX (key credits Ms. Reyes with reassuring patients)
- R.3.1-010: FIX (literal lookup tagged R.3.1)
- R.3.2-006: FIX (note B and explanation inaccurate)
- R.3.2-007: FIX (key D uses "A"/"B" shorthand)
- R.3.2-008: PASS
- R.3.2-009: PASS
- R.3.2-010: FIX (mirrors B1 R.3.2-002)
- R.3.3-006: PASS (overlap with R.3.3-007)
- R.3.3-007: PASS (overlap with R.3.3-006; weak distractor D)
- R.3.3-008: PASS
- R.3.3-009: FIX (same claim as B1 R.2.1-003 and R.3.4-004)
- R.3.3-010: PASS
- R.3.4-006: FIX (MUST: RP-11 not needed; invented location; weekday conflict)
- R.3.4-007: FIX (MUST: RP-06 not needed; arithmetic itself correct)
- R.3.4-008: FIX (comparison, not integration; loose key)
- R.3.4-009: PASS
- R.3.4-010: PASS
