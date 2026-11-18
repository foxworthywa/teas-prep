# Content audit: TEAS 7 Reading, batch 1 (60 items, 16 passages)

Files audited (not edited): `bank/reading_passages.json`, `bank/read_batch1.json`.
Cross-checked against the independent blind solve in `review/read1_blind.md`. The blind solve matched all 60 keys. It flagged R.3.1-005 and R.2.4-001, and I agree with both flags.

Summary: **2 MUST-FIX items**, **19 SHOULD-FIX items**, and **39 PASS** items. Two passages need a fix before release: RP-09 (a factual issue) and RP-06 (vague, unattributed sugar guidance). The rest of the passage notes are optional polish.

Key distribution: MC A=15, B=15, C=15, D=14, plus one ordered-response item. Difficulty: 22 items at 1, 33 at 2, and 5 at 3, which is reasonable. Every objective has 3 to 5 items.

---

## MUST-FIX

### R.3.1-005 (RP-10): ambiguous key
- Stem: "Based on the survey, which group should a vaccination campaign most likely focus on first to reach the health department's goal?" The key is B (18–29).
- Problem: The goal is at least 70% in *every* group, so all three groups below 70% have to be raised. "Focus on first" can mean the largest gap (18–29, key B). It can also mean the quickest win (50–64, which is only 18 points short, option C). The passage does not settle which reading is meant, so C can be defended. The blind solver reached the same conclusion.
- Replacement (keeps R.3.1 by asking students to apply a stated rule to the data):
  - Stem: "The health department will send extra outreach to every age group that did not meet its goal. Based on the survey, which groups will receive outreach?"
  - A. Adults 18–29 only
  - B. Adults 18–29 and 30–49
  - C. Adults 18–29, 30–49, and 50–64
  - D. All four age groups
  - Key C. Explanation: "Only the 65+ group (71%) met the 70% goal, so the other three groups get outreach." Distractor notes: A: "30–49 (35%) and 50–64 (52%) are also below 70%." B: "50–64 is also below 70%, at 52%." D: "the 65+ group already met the goal."
  - The key-letter balance becomes A15/B14/C16/D14, which is acceptable.
- Simpler alternative: change the stem to "Which age group would need the largest increase to reach the health department's goal?" List the options in age order (18–29, 30–49, 50–64, 65 and older) so the key becomes A. This version reads more like R.1.5 than R.3.1.

### R.1.1-003 (RP-08): keyed option misstates the passage
- Keyed C: "Nightingale's records and statistics showed that disease killed most soldiers and led to reforms."
- Problem: The passage says "most of the *deaths* had been caused by preventable disease." It does not say that disease killed most *soldiers*. As worded, C makes a false claim (that most soldiers died), and a careful reader may reject the key for that reason. C is also the longest option (97 characters against 81–86).
- Replacement for C: "Nightingale's statistics showed most deaths were preventable and helped bring about reforms." (90 characters)
- Explanation (optional tightening): "The passage's main point is that Nightingale used careful records and statistics to show that most deaths came from preventable disease, which helped change policy."

---

## SHOULD-FIX

### R.1.1-002 (RP-09): explanation does not match the key; key overstated
- The explanation says: "The best summary includes the oysters' role, their decline, and the restoration effort." Keyed A ("Oysters keep the bay clean and healthy, and people are now working to restore them.") never mentions the decline. "Keep the bay clean and healthy" also overstates the passage, which says the water became cloudier as oysters declined.
- Replace A with "Oysters help clean the bay's water, and people are working to restore them."
- Replace the explanation with "The best summary covers the oysters' main role (filtering water) and the effort to restore them; the other options are single details or misstatements."

### R.1.4-002 (RP-08): numeric options not in order
- The options are "1854 / 1859 / 1860 / 1858." Put them in ascending order: A 1854, B 1858, C 1859, D 1860. The key becomes **C**.
- Rewrite the distractor notes to match: "A: the year she arrived at Scutari. B: a year the passage doesn't mention. D: the year she opened the nursing school."

### R.1.4-003 (RP-04): numeric options not in order; note slightly inaccurate
- Put the options in order: A 32–50 °F, B 60–68 °F, C 68–77 °F, D 77–86 °F. The key becomes **C**.
- The note "A: a refrigerator range" is imprecise, because refrigerator storage is about 36–46 °F. New notes: "A: much colder than the label's range. B: cooler than the label's range. D: warmer than the label's range."

### R.1.5-003 (RP-13): distractor note inaccurate; options not in order
- Note D reads: "41 − 30 = 11; this uses a number that isn't in the table." This is wrong, because 30 does appear in the table, in the row labels "Less than 30 minutes" and "30–60 minutes."
- Replacement: "D: 41 − 30 = 11; this subtracts a screen-time category boundary (30 minutes) instead of the no-screen group's 15 minutes."
- Put the options in order: A 11, B 15, C 26, D 41. The key stays **C**. Reletter the notes: A = the old D note, B = the old B note, D = the old A note.

### R.2.1-002 (RP-12): option D is not in the ad; C is borderline
- The stem asks for a "statement in the advertisement." Option D, "You will wake up feeling like a new person.", is a paraphrase that the ad never states. The ad says customers *say* they "wake up feeling like a new person."
- Replace D with the testimonial quote: "\"I haven't slept this well in years!\"" New note: "D: one customer's personal opinion, which can't be checked."
- Option C ("completely safe for everyone") can be argued to be a checkable (and false) claim, as the blind solver also noted. Its note, "no product is safe for everyone," relies on outside knowledge. Replace C with "Ordinary sleeping pills are harsh." New note: "C: 'harsh' is a judgment word, not a measurable fact."

### R.2.1-004 (RP-06): depends on the RP-06 fix; mild clueing
- If the RP-06 sugar sentence is revised (see Passage issues), option C has to be updated to quote the new sentence: "The American Heart Association recommends that most women limit added sugar to about 6 teaspoons a day and most men to about 9."
- This change also reduces clueing. At present the key B is the longest option (105 characters against 71–94).

### R.2.2-002 (RP-09): note depends on the RP-09 fix
- Note D reads: "restoration has gone on since the 2010s." Once RP-09 is corrected, change it to "D: the passage says restoration takes time and has gone on for years; \"promising\" isn't about newness."

### R.2.2-004 (RP-16): clueing
- Keyed B, "something nice to have but not necessary," is 40 characters. The other options are 16–28 characters, and B is the only one that defines the word in two parts.
- Lengthen the distractors: A "a requirement that every student must meet before graduating," C "a costly mistake that a college later regrets making," D "a special reward given to students for high grades."

### R.2.2-005 (RP-04): clueing
- Keyed C, "for a limited time," is the only multi-word option. The others are single words: "permanently," "completely," and "slowly."
- Make the options parallel phrases: A "for all time," B "in every way," C "for a limited time," D "at a slow pace." The notes can stay as they are.

### R.2.3-002 (RP-12): serial comma
- The explanation reads: "Superlatives, testimonials and \"Order today\" show..." Change it to "Superlatives, testimonials, and \"Order today\" show that the goal is to sell."

### R.2.3-004 (RP-09): clueing; note inaccurate
- Keyed D (67 characters) is the longest option. The others are 28–55 characters.
- Shorten D to "To show how oysters help other living things" (44 characters). Alternatively, lengthen C to "To describe what oysters eat as they filter the water."
- Note C reads: "oysters eat algae and sediment, not grass." The passage says oysters *trap* algae and sediment, and oysters do not actually eat sediment. Replace it with "C: the passage says oysters trap algae and sediment; the grasses are mentioned as shelter, not food."

### R.2.3-005 (RP-06): weak note; depends on the RP-06 fix
- Note C, "irrelevant to the letter," should become "C: the letter never describes how the machine works."
- If the RP-06 fix is made, change the explanation to "Comparing 16 teaspoons with the recommended daily limit backs up the argument with evidence."

### R.2.4-001 (RP-05): clueing by label matching
- Every option starts with a role ("As a doctor," "As a teacher," "As a parent and bus owner," "As a student"), and only C matches the heading of Passage B. A student can answer by matching labels without reading the passage.
- Replacement options (same stem, key C):
  - A. "The author focuses on how teenagers' bodies respond to sleep loss."
  - B. "The author focuses on how later start times affect lesson plans."
  - C. "The author focuses on buses, costs, and family schedules."
  - D. "The author focuses on students' wish to sleep later in the morning."
- Notes: "A: this is Passage A's focus. B: Passage B never mentions lessons or teaching. D: Passage B doesn't discuss what students want."

### R.2.4-004 (RP-07): serial comma
- Note A reads: "the story says \"Dana,\" \"she\" and \"her,\" not \"I.\"" Change it to "the story says \"Dana,\" \"she,\" and \"her,\" not \"I.\""

### R.3.1-004 (RP-02): stem/option mismatch; mild clueing
- The stem asks "Which *sentence*...", but options A, C, and D each contain two sentences.
- New stem: "Which lines from the directions best support the conclusion that what a patient does before the test can change the results?"
- The key repeats the stem's words ("change your results"). That is acceptable for a locate-the-evidence item, but the stem could be reworded to avoid the echo: "...the conclusion that a patient's activities before the test can affect its accuracy?"

### R.3.2-002 (RP-14): clueing
- Keyed B is 77 characters. The others are 48–65, and B is the only option with a qualifier ("at first").
- Lengthen the distractors:
  - A. "Marisol gives up on contests, while Mr. Lyle keeps planting in the same spot."
  - C. "Mr. Lyle studies the problem on his own, while Marisol waits for advice."
  - D. "Both characters succeed on the first try without changing anything."
- Keep the existing notes.

### R.3.2-004 (RP-05): note does not refute the option
- Note C reads: "Passage A argues teens need more sleep than they get." This does not address the claim in option C ("Teenagers need less sleep than younger children").
- Replace it with "C: neither passage compares how much sleep teens and younger children need."

### R.3.4-002 (RP-13): objective fit
- The stem asks what can be concluded "from the survey alone." The item uses only one source, so it does not test R.3.4 (integrating sources).
- Option 1: retag it as R.3.1.
- Option 2: keep it as R.3.4 and rewrite it to integrate the two sources:
  - Stem: "Source 1 says screens delay the release of melatonin. Why can't the survey in Source 2, by itself, show that screen use causes students to sleep less?"
  - A. "It shows a pattern, but other factors could affect both screen use and sleep."
  - B. "It shows that students who used no screens slept the least of any group."
  - C. "It found no clear pattern between screen use and average hours of sleep."
  - D. "It does not report any averages for the students who took part in it."
  - Key A.

### R.3.4-004 (RP-10): objective fit
- This is a single-table reading item. It duplicates R.1.5-002 (same table, same skill) and does not integrate multiple sources.
- Retag it as R.1.5, which brings R.1.5 to 4 items. Then write a new R.3.4 item, for example one combining RP-12 and RP-02/RP-03, or RP-11 with a calendar.

---

## Passage issues

### RP-09 "The Bay's Living Filters": factual precision (fix before release)
- "Since the 2010s, government agencies, watermen, and volunteer groups have worked to restore oyster reefs..." This implies that restoration began in the 2010s. Chesapeake oyster restoration goes back to at least the 1990s. The large-scale tributary reef projects (Harris Creek, and the 2014 Watershed Agreement goal of 10 tributaries) are what began in the 2010s.
- Replacement: "For decades, and on a much larger scale since the 2010s, government agencies, watermen, and volunteer groups have worked to restore oyster reefs by planting young oysters on new reef sites in several rivers."
- Then update the R.2.2-002 note as described above.
- The other facts check out: "as much as 50 gallons of water in a day," market size in 2 to 3 years, and the causes of decline (overharvesting, disease, and pollution).

### RP-06 "Get Sugary Drinks Out of Our Hospital": vague and unattributed guideline (fix recommended)
- "Health agencies recommend that most adults limit added sugar to well under 12 teaspoons a day."
- "12 teaspoons" is the old Dietary Guidelines cap (10% of 2,000 calories, about 50 g). The AHA limits are about 6 tsp a day for women and 9 tsp for men. The 2025–2030 Dietary Guidelines (January 2026) say no amount of added sugar is recommended and suggest no more than about 10 g per meal. No agency's wording is "well under 12," so the sentence is defensible but anchored to a superseded number.
- Replacement: "The American Heart Association recommends that most women limit added sugar to about 6 teaspoons a day and most men to about 9."
- This also makes the 16-teaspoon comparison sharper. Update R.2.1-004 option C and the R.2.3-005 explanation to match.
- "A 20-ounce bottle of regular soda contains about 16 teaspoons of sugar" is accurate (about 65 g at about 4 g per teaspoon).
- Optional: "Bayside General Hospital" could be a real hospital name. Consider adding "(fictional)" to the type field for consistency with RP-04, RP-10, RP-12, and RP-13.

### RP-12 "DreamDeep Sleep Gummies": fictional marking (should fix)
- "(fictional product)" appears only in the `type` field. Unlike RP-04, the text a student sees does not mark the product as fictional, and this matters most for a supplement ad that makes safety claims.
- Add "(fictional product for practice only)" after the first mention of the name, or as a first line in the style of RP-04.

### RP-03 "Shore Health Clinic": optional
- "Shore Health" is close to real Eastern Shore provider names (for example, UM Shore Regional Health). Consider a type of "Table (fictional clinic)" and keep the 555 number. The internal logic is consistent: the lab is closed Wednesday, dental runs Tuesday and Thursday, and everything is closed on weekends. It supports R.1.5-001 and R.3.4-003 correctly.

### RP-08 "The Nurse Who Used Numbers": accurate; optional nuance
- The facts check out: arrival at Scutari in 1854 (present-day Turkey), deaths from disease far outnumbering deaths from wounds, post-war analysis with statisticians (Farr), circular (polar-area) charts, Notes on Nursing in 1859, and the St Thomas' school in 1860.
- "she opened a nursing school" slightly overstates her role, because the school was established through the Nightingale Fund. "she founded" or "she helped establish" would be more precise. This is optional, and if it changes, the matching item notes (R.1.1-003 A, R.1.6-001 C, R.2.2-003 D) should be adjusted.

### RP-05 "Two Views on Later School Start Times": accurate
- The claims are accurate: melatonin release shifts later during puberty, many teens cannot fall asleep before about 11 p.m. (AAP), the AAP recommends 8:30 a.m. or later, and studies report better attendance and fewer teen crashes. Passage B is internally consistent.

### RP-16: optional
- The title asks about *free* tutoring, but the essay never mentions price to students. Either drop "Free" from the title or add a clause such as "free to students" in paragraph 1.

### Other passages
- RP-01: The science is accurate and appropriately hedged: the oxygen hypothesis was rejected, the brain-cooling idea is presented as unproven, and contagion is linked to familiarity.
- RP-02: The fasting directions are internally consistent: a 12-hour fast, with 8:00 p.m. to 8:00 a.m. as the example.
- RP-04: Clearly marked as fictional; 68–77 °F is standard room-temperature storage.
- RP-07, RP-10, RP-11, RP-13, RP-14, RP-15: Consistent and clear. In RP-11 the date logic is sound (permits Jan 10, warnings Jan 12–26, tickets after Jan 26). RP-13's data rise and fall steadily. RP-15's 1/2 tsp of salt per 8 oz and its "longer than a week" advice are standard.
- Serial commas: every list in all 16 passages uses the serial comma. No lapses.
- Readability: The passages run at about a grade 7–10 level, which suits nursing and dental hygiene applicants. Terms such as "melatonin," "statisticians," "sediment," and "overgeneralization" are either explained in context or not needed to answer.

---

## Optional polish (does not change PASS status)
- R.1.1-004: Key B says the aide "solves his problem," but Ms. Okafor is the one who calls the kitchen. Consider "...gets his problem fixed, and earns praise." "Aide" is inferred and never stated in the passage.
- R.2.4-003 vs R.2.4-005: single-word options are capitalized in one ("Neutral") and lowercase in the other ("amused"). Choose one convention.
- R.2.1-004 and R.3.3-003 use the same keyed sentence (the "every hospital administrator..." overgeneralization). Do not put both on the same form.
- Mild key-longest cases (12–22% longer than the next option): R.1.2-004, R.2.1-003, R.2.4-002, R.3.1-001, R.3.2-005, R.3.3-003. Across the batch, the key is the longest option in 27 of 59 MC items (46%, where 25% would be expected). Consider lengthening one distractor in each of these items.

---

## Per-item verdicts

| id | verdict | note |
|---|---|---|
| R.1.1-001 | PASS | |
| R.1.1-002 | FIX | explanation does not match the key; key overstated |
| R.1.1-003 | FIX (MUST) | key says disease "killed most soldiers" |
| R.1.1-004 | PASS | optional wording |
| R.1.2-001 | PASS | |
| R.1.2-002 | PASS | |
| R.1.2-003 | PASS | |
| R.1.2-004 | PASS | mild key-longest |
| R.1.3-001 | PASS | |
| R.1.3-002 | PASS | |
| R.1.3-003 | PASS | |
| R.1.4-001 | PASS | |
| R.1.4-002 | FIX | put years in order; key becomes C |
| R.1.4-003 | FIX | put temperatures in order; key becomes C; note A |
| R.1.5-001 | PASS | |
| R.1.5-002 | PASS | |
| R.1.5-003 | FIX | note D is false ("isn't in the table"); put options in order |
| R.1.6-001 | PASS | |
| R.1.6-002 | PASS | |
| R.1.6-003 | PASS | |
| R.2.1-001 | PASS | |
| R.2.1-002 | FIX | D is not in the ad; C is borderline checkable |
| R.2.1-003 | PASS | mild key-longest |
| R.2.1-004 | FIX | option C must follow the RP-06 fix |
| R.2.1-005 | PASS | |
| R.2.2-001 | PASS | |
| R.2.2-002 | FIX | note D must follow the RP-09 fix |
| R.2.2-003 | PASS | |
| R.2.2-004 | FIX | key clueing |
| R.2.2-005 | FIX | key is the only multi-word option |
| R.2.3-001 | PASS | |
| R.2.3-002 | FIX | serial comma in explanation |
| R.2.3-003 | PASS | |
| R.2.3-004 | FIX | key longest; note C says oysters "eat" sediment |
| R.2.3-005 | FIX | note C; explanation follows the RP-06 fix |
| R.2.4-001 | FIX | role-label matching gives away the key |
| R.2.4-002 | PASS | |
| R.2.4-003 | PASS | capitalization (optional) |
| R.2.4-004 | FIX | serial comma in note A |
| R.2.4-005 | PASS | |
| R.3.1-001 | PASS | |
| R.3.1-002 | PASS | |
| R.3.1-003 | PASS | |
| R.3.1-004 | FIX | "sentence" stem with two-sentence options |
| R.3.1-005 | FIX (MUST) | ambiguous key (B vs C) |
| R.3.2-001 | PASS | |
| R.3.2-002 | FIX | key clueing |
| R.3.2-003 | PASS | |
| R.3.2-004 | FIX | note C does not refute the option |
| R.3.2-005 | PASS | |
| R.3.3-001 | PASS | |
| R.3.3-002 | PASS | |
| R.3.3-003 | PASS | same key sentence as R.2.1-004 |
| R.3.3-004 | PASS | |
| R.3.3-005 | PASS | |
| R.3.4-001 | PASS | |
| R.3.4-002 | FIX | single source; retag to R.3.1 or rewrite |
| R.3.4-003 | PASS | well-built integration item |
| R.3.4-004 | FIX | single source; retag to R.1.5 |
| R.3.4-005 | PASS | |

Totals: 39 PASS, 21 FIX (2 MUST-FIX, 19 SHOULD-FIX).
