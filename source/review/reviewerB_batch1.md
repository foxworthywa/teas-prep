# Reviewer B: A&P Batch 1 content review

Files reviewed:
- `/home/claude/teas/bank/sci_ap_batch1.json`: the version on disk at 15:54:08 on 2026-11-17 (md5 `bcac99dc…`). The file was rewritten while I was reviewing it. This review covers the current version, in which S.1.1-002 has a new stem and S.1.4-002 has dropped "(Type one word.)" and now accepts three spellings.
- `/home/claude/teas/pages/S.1.1_body-orientation.md` (md5 `227f21bc…`)
- `/home/claude/teas/pages/S.1.3_cardiovascular-system.md` (md5 `e7dd60b0…`)

**Bottom line:** every keyed answer in the batch is correct, and each item has exactly one defensible answer, answer set or sequence. No item is publish-blocking on accuracy. The problems are:
- five explanation or distractor notes that state something false or misleading
- three items with clues that give away the answer
- batch-level patterns in where the correct answer sits, which test-wise students will exploit

---

## Batch-level problems (fix before publication)

| # | Problem | Evidence | Fix |
|---|---|---|---|
| B1 | **The answer key leans heavily to B.** | Of the 21 multiple-choice items, 15 are keyed B, 4 are keyed C, 2 are keyed A and **none are keyed D**. A student who always guesses B scores 71% on the multiple-choice items. | Rebalance to about 5 per letter. Reorder options, then remap the letter references in each `distractors` note ("A: …", "B and D: …"), which are tied to positions. If the delivery platform shuffles options, the print/PDF version still will not. |
| B2 | **All three select-all items are keyed "A, B, D".** | S.1.1-003, S.1.5-003 and S.1.11-002 | Reorder the options so the correct positions differ. Also vary how many options are correct: give at least one item 2 correct and one item 4 correct. Otherwise "pick 3" becomes a learnable rule. |
| B3 | **The longest option is the correct one too often.** | The correct option is the single longest in 9 of 21 multiple-choice items (43%; chance is about 25%): S.1.1-002, S.1.2-002, S.1.3-001, S.1.4-003, S.1.6-002, S.1.7-001, S.1.7-002, S.1.9-002, S.1.10-002. In several, the extra length comes from a parenthetical synonym that only the key has, e.g. "Mitral (bicuspid)", "Uterine (fallopian)", "Frontal (coronal)". | Keep the synonyms, because students need both names, but even out the lengths. Item-level fixes for the worst cases (S.1.2-002, S.1.7-002) are below. |
| B4 | **Difficulty is skewed easy (FLAG).** | Difficulty ratings: 17 items at 1, 10 at 2, **0 at 3**. Almost every item is recall of a single fact. The real TEAS includes scenario and application items, for example: trace a red blood cell from the right atrium to the aorta; predict the effect of a blocked valve; read a clinical description and name the plane or cavity. | Faculty decision: add difficulty-3 application items in the next batch, at least one per objective. |
| B5 | **S.1.3 items do not cover what the page teaches (FLAG).** | Both S.1.3 items test heart structure and blood flow. Nothing tests conduction (SA node, AV node), vessel types or capillaries, or blood composition, even though the page teaches all three. | Add items for those topics in a later batch. |

---

## Item table

| Item ID | Verdict | Problem | Exact fix |
|---|---|---|---|
| S.1.1-001 | PASS | The key is correct. "Superior", also true, is rightly left out of the options, so only one answer is defensible. The distractor notes are correct. It is consistent with study-page check #2. | None. |
| S.1.1-002 | FIX (minor) | The key is correct, but the stem's words "front … portion" give away "**Front**al", so the item tests word-matching rather than the plane concept. "Midsagittal" is a subset of "Sagittal": both are wrong, so the key is unaffected, but the item has effectively only 2–3 real distractors. | Stem: "A plane divides the body into anterior and posterior portions. Which plane is it?" Optionally, replace option D "Midsagittal plane" with "Oblique plane" so all four options are distinct planes. If you do, change the distractor note to "D: an oblique plane cuts at an angle." |
| S.1.1-003 | PASS (but see B2) | The key (stomach, bladder, liver) is correct. The liver is a good distractor-in-reverse, because many students wrongly place it in the thorax since it sits under the ribs. | Reorder the options per B2. |
| S.1.2-001 | PASS | The sequence pharynx → larynx → trachea → bronchi → alveoli = E, B, D, A, C is correct. The explanation correctly mentions bronchioles even though they are not an option. | None. |
| S.1.2-002 | FIX (minor) | The key is correct and all statements are accurate. B is much the longest option (79 characters against 51–55) and is the only one with technical vocabulary, so a test-wise student picks it. | Rewrite the options to similar lengths. A: "alveolar cells use energy to actively pump oxygen into the blood." B: "oxygen's partial pressure is higher in the alveoli than in the blood." C: "hemoglobin leaves the red blood cells and enters the alveoli to collect oxygen." D: "carbon dioxide leaving the blood creates pressure that pushes oxygen in." Keep "partial pressure" rather than "concentration": comparing a concentration in a gas with one in a liquid is not a valid driving-force comparison. |
| S.1.3-001 | PASS | The key and all four location statements are correct. | None (see B3 on the parenthetical length). |
| S.1.3-002 | PASS | The key is correct. Each distractor maps to a real vessel (pulmonary arteries, venae cavae, aorta). It targets the most common misconception, that veins carry oxygen-poor blood. | None. |
| S.1.4-001 | PASS | The key and all statements are correct. | None. |
| S.1.4-002 | PASS | The current version is correct and accepts three spellings. | Optional: also accept the common misspelling "galbladder", since this tests anatomy, not spelling. Faculty choice. |
| S.1.4-003 | PASS | The key is correct. "Bile itself contains no digestive enzymes" is correct. "Breaks large fat globules into small droplets" is the standard simplification (strictly, bile salts stabilize droplets that churning creates) and is not false at this level. Distractor note C is accurate: fats go mostly to lymph via chylomicrons. | None. |
| S.1.5-001 | PASS | The key is correct. The cell body also receives synapses, but it is not an option, so there is no ambiguity. | None. |
| S.1.5-002 | FIX | The key (spinal cord) is correct. The explanation says the muscle responds "**before the signal reaches the brain** and pain is perceived." That is not accurate: the sensory signal travels up to the brain at the same time as the reflex runs, and fast pain fibers reach the brain within roughly the same timeframe as the reflex response. What is true is that the reflex does not *wait* for the brain, so the movement starts before the pain is consciously felt. A strong student who knows ascending tracts will spot the error. | Explanation: "A withdrawal reflex is processed in the spinal cord: sensory neurons connect through spinal interneurons to motor neurons. The muscle responds without waiting for the brain. The pain signal also travels up to the brain, but conscious pain is felt a moment after the hand has already moved." |
| S.1.5-003 | PASS (but see B2) | The key is correct. Note that B and E are opposites, so exactly one must be right; this is an acceptable pairing. Strictly, bronchodilation is driven largely by circulating epinephrine from the adrenal medulla, which the sympathetic system activates, so "caused by the sympathetic nervous system" is defensible. | Reorder the options per B2. |
| S.1.6-001 | PASS | The key and statements are correct. | None. |
| S.1.6-002 | PASS | The key is correct. Distractor note C ("calcium binds troponin … exposing binding sites on actin") skips the step in between but is not false. | Optional, for precision: "C: calcium binds troponin, which shifts tropomyosin and exposes the myosin-binding sites on actin; calcium does not bind myosin." |
| S.1.7-001 | PASS | The key is correct. "The ovary releases the egg" is fine at this level (strictly, a secondary oocyte). | None (see B3). |
| S.1.7-002 | FIX (minor) | The key is correct, but option B, "Seminiferous tubules **of the testes**", is the longest option and the only one that names the testes, which every student knows make sperm. That is a giveaway. | Options: ["Epididymis", "Seminiferous tubules", "Prostate gland", "Ductus (vas) deferens"]. Keep "inside the testes" in the explanation. |
| S.1.8-001 | PASS | The key is correct. Option D, "Papillary layer of the dermis", is a subset of B; both are wrong, so the key is unaffected. | None required. Do **not** replace D with any epidermal layer, such as stratum basale: those are also avascular and would create a second correct answer. |
| S.1.8-002 | PASS | The key and statements are correct. | None. |
| S.1.9-001 | PASS | The key and statements are correct. The stem's "the pancreas" lets students eliminate the two adrenal hormones, which is acceptable for difficulty 1. | None. |
| S.1.9-002 | FIX | The key is correct. **Distractor note C is false or misleading:** "an enlarged thyroid would tend to make more hormone." An enlarged thyroid (goiter) is often *under*active, as in iodine deficiency, so enlargement does not reliably mean more hormone. In addition, TRH and TSH are never spelled out, and many TEAS candidates will not know the abbreviations. | Options A and B: "The hypothalamus increases its release of thyrotropin-releasing hormone (TRH)." / "The anterior pituitary decreases its release of thyroid-stimulating hormone (TSH)." Distractor C note: "C: thyroid enlargement is not a feedback response that lowers hormone levels. TSH stimulates thyroid growth, and TSH falls in this situation." |
| S.1.10-001 | PASS | The sequence renal pelvis → ureter → bladder → urethra = D, B, C, A is correct. | Optional: explanation "Urine drains from the collecting ducts through the calyces into the renal pelvis, …" |
| S.1.10-002 | FIX (minor) | The key is correct. Distractor note C, "healthy kidneys **do not filter proteins** into urine", is false as stated: the glomerulus filters small proteins and traces of albumin, which the proximal tubule then reabsorbs. | Distractor C note: "C: healthy kidneys keep almost all protein out of the urine (very little is filtered, and that little is reabsorbed). ADH does not change this." |
| S.1.11-001 | PASS | The key is correct. "B cells", which would arguably be defensible, is rightly left out of the options. | None. |
| S.1.11-002 | FIX (and B2) | The key is correct. **Distractor note is misleading:** "antibodies and memory T cells … depend on **earlier** exposure." Antibodies are made during a *first* infection too; they need exposure to *that* antigen, not a previous one. Only memory cells depend on earlier exposure. The note invites the misconception that adaptive immunity cannot act on a first infection. | Distractor note: "C and E belong to adaptive (specific) immunity. They target one particular antigen and develop only after the body meets that antigen, which takes days on first exposure. Memory T cells are left behind afterward to respond faster the next time." Reorder the options per B2. |
| S.1.12-001 | FIX (minor) | The key and science are correct. The memory aid "osteo-CLASTS 'clast' (break) bone" is garbled: it uses "clast" as a verb and will confuse a high-school-level reader. | "Memory aid: osteo**C**lasts **C**ut bone down; osteo**B**lasts **B**uild it up." |
| S.1.12-002 | PASS | The key and statements are correct (adult red marrow; yellow marrow stores fat). | None. |

**Tallies:** 19 PASS, including S.1.1-003 and S.1.5-003, which need only the B2 reordering. 8 FIX: S.1.1-002, S.1.2-002, S.1.5-002, S.1.7-002, S.1.9-002, S.1.10-002, S.1.11-002 and S.1.12-001. Batch-level: three FIX (B1–B3) and two FLAG (B4, B5).

---

## Study page: S.1.1 Body Orientation

### Factual errors and misleading statements

1. **Line 11, "…palms facing forward, feet together."** The linked OpenStax section defines anatomical position as "feet at shoulder width and parallel, toes forward." Some texts say "feet slightly apart"; none of the major ones says "together". The page contradicts its own linked source.
   **Fix:** "standing upright, facing forward, feet flat and slightly apart with toes forward, arms at the sides, palms facing forward."

2. **The page gives contradictory rules on superior/inferior for limbs.**
   - Line 32 says to use proximal/distal "**only** for limbs" and superior/inferior for the trunk and head.
   - Common Traps (line 83) lists "Using superior/inferior for limbs" as a *trap*.
   - Check answer #2 (line 99) says the knee is correctly described as "superior" to the ankle.

   A careful student cannot tell whether "superior" is right or wrong for limbs. (It is correct, just less specific.) "Only for limbs" is also too absolute: proximal/distal is routinely used in the trunk for tubes (proximal convoluted tubule, distal colon).
   **Fix, line 32:** "Proximal/distal describe position along a limb (or along a tube or branch, measured from where it starts). Superior/inferior is not wrong for limbs (the knee *is* superior to the ankle), but when a question asks about position along a limb, proximal/distal is the precise answer the TEAS expects."
   **Fix, line 83:** "Picking superior/inferior when proximal/distal is offered for a limb. Both may be true, but proximal/distal is the more precise answer."

3. **Line 50, memory aid: "a coronal plane runs where a crown sits, from ear to ear."** A crown encircles the head *horizontally*, which is closer to a transverse plane. This aid can teach the wrong plane.
   **Fix:** "A *coronal* plane runs like a headband (or the band of headphones): over the top of the head from ear to ear, splitting front from back."

4. **Line 52, check question: "…viewed as if from above, with no head or legs."**
   - By radiology convention, transverse (axial) CT images are viewed *from the patient's feet*, so "from above" is inaccurate for real scans. Students in health programs will meet that convention.
   - A transverse section can be viewed from either side, so the viewing direction is not what identifies the plane.
   - "With no head or legs" is unclear.
   - Liver and stomach also appear together in a coronal slice.

   **Fix:** "A CT slice cuts straight across the upper abdomen like a belt line. It shows the liver and stomach but nothing of the chest above or the pelvis below. Which plane is it?"

5. **Line 66: "…heart (in the pericardial cavity), plus the trachea and esophagus in the mediastinum between the lungs."** The wording implies the heart is *not* in the mediastinum; it is the main thing in it.
   **Fix:** "Thoracic cavity (above the diaphragm): each lung sits in its own pleural cavity. Between the lungs is the **mediastinum**, which holds the heart (inside the pericardial cavity), the great vessels, the trachea and the esophagus."

### Missing content important for S.1.1

- **Abdominopelvic quadrants (RUQ, LUQ, RLQ, LLQ) and the nine regions.** The linked OpenStax section covers both (its Figure 1.16), they are standard TEAS-prep content, and nursing applicants will use the quadrants immediately. This is the biggest gap. At minimum, add the four quadrants with one organ example each, e.g. liver/gallbladder RUQ, appendix RLQ.
- **Supine / prone.** The page tells students to ignore a patient "lying down" but never names these positions, which are common in nursing-oriented questions.
- **Serous membranes (parietal vs. visceral layers; pleura, pericardium, peritoneum).** They are covered in OpenStax 1.6 and give meaning to "pleural" and "pericardial" cavity, which the page uses without explanation.
- **A warning about organs under the ribs.** The liver, stomach and spleen lie under the lower ribs but *below* the diaphragm. Students often call them thoracic, and item S.1.1-003 tests exactly this. Add one sentence to section 4.
- Lower priority: cranial/caudal and ipsilateral/contralateral; oblique plane; a few regional terms (brachial, femoral, cervical, thoracic, lumbar).

### OpenStax link

- Section 1.6 Anatomical Terminology resolves (HTTP 200) and the page title matches. It is the right section: it covers anatomical position, directional and regional terms, planes, cavities, serous membranes and quadrants/regions.
- Optional: also link Section 1.7 Medical Imaging (`…/pages/1-7-medical-imaging`, verified) because the page refers to CT and MRI.

### Originality

The page reads as original writing: short declarative teaching prose, its own examples and its own check questions. A 7-word-sequence overlap check against the OpenStax section text found **no shared prose**. The only matches were the URL and the section title in the link line.

---

## Study page: S.1.3 The Cardiovascular System

### Factual errors and misleading statements

1. **Line 65, table, Arteries → Valves: "No (except at the heart's exits)."** The aortic and pulmonary (semilunar) valves are *heart* valves, not valves in the arteries. The entry suggests arteries have valves and contradicts section 2, which correctly places those valves in the heart.
   **Fix:** Arteries: "No (the semilunar valves are part of the heart)". Veins: "Yes, especially in the limbs; they keep blood moving toward the heart". The current "Many, in the limbs, to stop backflow" also reads as "valves are only in the limbs".

2. **Line 58: "Capillary walls are one cell thick, which is why they are the only place where gas and nutrient exchange with tissues happens."** "Only" is overstated: post-capillary venules also exchange fluid and solutes, and they are where white blood cells leave the blood.
   **Fix:** "…which is why capillaries are the **main** site where gases, nutrients and wastes are exchanged with tissues."

3. **Line 52: "The pulmonary vessels are the exception."** They are the exception after birth, but the umbilical vessels are the reverse case before birth: the umbilical vein carries oxygen-rich blood and the umbilical arteries carry oxygen-poor blood. Nursing students will meet this in maternity courses.
   **Fix:** "The **pulmonary vessels** are the main exception (the umbilical vessels before birth are another):"

4. **Line 94: "Platelets: cell fragments that start clotting."** Clotting is initiated mainly by tissue factor from damaged tissue. Platelets form the plug and support the clotting cascade. "Start" is not accurate.
   **Fix:** "Platelets (thrombocytes): cell fragments that plug breaks in vessels and help blood clot."

5. **Line 96: "All three formed elements are made in red bone marrow."** This is acceptable for adults, but some lymphocytes finish developing elsewhere (T cells mature in the thymus).
   **Fix:** "In adults, all three formed elements start in red bone marrow."

6. **Check answer #3 (line 122) leaves out the main mechanism.** Venous return from the legs depends on the **skeletal muscle pump**: contracting leg muscles squeeze the veins, and the valves make that squeeze one-way. As written, the answer suggests valves alone move the blood.
   **Fix:** add "Squeezing leg muscles push blood up the veins, and the valves make sure it can only go one way: toward the heart."

The rest of the page checked out as accurate:
- the two circuits and the reason the left ventricle is thicker
- the eight-step blood path
- LAB RAT
- AV vs. semilunar valves
- direction-based naming of arteries and veins
- the conduction sequence (SA node → atria → AV node delay → bundle of His → bundle branches → Purkinje fibers; apex-to-base contraction)
- systole and diastole
- 55% plasma / 45% formed elements
- red blood cells having no nucleus
- all four check answers apart from the omission in #3

### Missing content important for S.1.3

- **Heart wall layers and pericardium** (endocardium, myocardium, epicardium; fibrous and serous pericardium). This is standard TEAS-prep content and is not mentioned.
- **Coronary circulation:** the heart's own blood supply comes from the coronary arteries, and a blockage causes a heart attack (myocardial infarction). This is high-yield and clinically relevant for this audience.
- **Heart sounds linked to the valves:** "lub" is the AV valves closing and "dub" is the semilunar valves closing. This ties the valve section to the cardiac cycle.
- **Blood pressure as systolic/diastolic** (e.g., 120/80). The page defines systole and diastole but never connects them to the reading every nursing applicant knows.
- Lower priority: cardiac output = heart rate × stroke volume; the interventricular septum; the five white blood cell types (could be left to S.1.11); hemoglobin also carrying some CO₂.

### Memory aids

"LAB RAT" is correct and standard. No other memory aids on the page.

### OpenStax links

All four links resolve (HTTP 200) and their page titles match the labels: 19.1 Heart Anatomy, 19.2 Cardiac Muscle and Electrical Activity, 20.1 Structure and Function of Blood Vessels, 18.1 An Overview of Blood. Each is the sensible section for its topic.

Suggested addition: **19.3 Cardiac Cycle** (`https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle`, verified), which covers systole, diastole and the heart sounds the page refers to.

### Originality

The page reads as original writing. A 7-word-sequence overlap check against the text of all four linked OpenStax sections found **no shared prose** apart from one generic phrase ("blood from the lungs to the heart") and the URLs and section titles in the link list.
