# Site UX review: ESCC TEAS Prep (docs/)

Reviewed 2026-11-18, from the point of view of applicants to LPN, RN and dental hygiene programs (many on phones, some weak readers). Read-only review: no site files were changed.

**How I checked**

- Served `docs/` locally and drove it with Playwright and Chrome at phone size (390x844, 2x pixel density, touch) and desktop size (1280x900).
- Ran a full Reading diagnostic and a full Math diagnostic on the phone. I also checked the results page and the review of my answers.
- Opened all 482 practice items on the phone through the Practice screens, answered each one wrong, and saved the feedback text, the option letters the student saw, and any layout overflow. I read the text of about 60 feedback panels closely, across all four sections, all four question formats, the 68 items with options in number order (`sorted`) and all 24 select-all items. I searched the rest by script for letter references that don't match what the student saw.
- Tested supply answers two ways: about 140 realistic typed answers against `core.gradeSupply`, then 4 of them again in the browser.
- Opened all 64 study pages on the phone and checked them by script: leftover Markdown in the visible text, broken or missing images, captions outside their figure, tables wider than the screen, and each "Check" question against the answers at the bottom of the page. I looked at 6 pages by eye, on the phone and on the desktop.
- Tested My progress: download, clear, load the file (once and twice), and load a bad file.
- Screenshots are in `/tmp/ux-shots/` (137 files). The ones cited below are named in each issue.

---

## Must fix

### M1. Supply answers: some wrong answers are marked Correct, including the "common error" the feedback warns about
**Where:** every numeric supply item (`core.js` `gradeSupply` / `normalizeText`).
**What the student sees:** For "250 mg in 5 mL; how many mL contain 400 mg?" (M.1.8-002), typing **80** shows **Correct**. The same feedback panel then says *"Common errors: … 80 (misplacing the decimal)."* (screenshot `mob-supply-M.1.8-002-fb.png`). For "Write 0.045 as a percent" (M.1.1-002), **45%** is marked Correct, though the feedback calls it a common error.
**Cause:** `gradeSupply` first compares text after `normalizeText`, which deletes `.` and `,`. So "80" matches the accepted "8.0", "45%" matches "4.5%", and "125" matches "12.5". The numeric check runs after that and is never reached.
**Confirmed wrong answers that are graded Correct:** 125, 1.25 (key 12.5; S.3.5-003, M.1.6-004); 45, 45% (4.5; M.1.1-002); 80 (8; M.1.8-002); 1.2 (12; M.1.2-004); 1.8 (18; M.1.4-004); 2826, 28.26, 2.826 (282.6; M.2.4-004); 3.9 (39 °C; S.4.1-006); 2.7 (27; M.2.1-007); 1.000, 10.00 (1000; M.2.4-007); 2.40, 24.0 (240; M.2.5-002); 25.00, 250.0 (2500; S.4.1-002); 3.00, 30.0 (300 mg; M.1.8-004). That is 13 of the 16 supply items. Decimal placement is the main skill these items test, and several are dosage questions.
**Fix:** In `normalizeText`, stop removing `.` and `,`. Collapse spaces and lowercase only. If an item has `numeric`, parse the answer as a number and grade on the value alone; fall back to text matching only for word answers (S.1.4-002). Add the 13 cases above to `tests/core.test.mjs` as answers that must be graded wrong.

### M2. Explanations name option letters from the Sheet, but the options are shuffled on screen, so they point at the wrong answer
**Where:** E.1.2-004, E.2.1-004, E.1.2-012, E.2.3-009. All are `shuffle` items, and `relabelLetters` only rewrites "Option C" / "Choice C".
**What the student sees:**
- E.1.2-004: The key is shown as **D. Bring your ID, two pencils, and a water bottle.** The explanation then says *"Only **C** places every comma correctly."* On screen, C is the wrong sentence "…and, a water bottle." The feedback contradicts itself (`fb_mob_wrong.json`).
- E.2.1-004: The key is **B. Dana was upset when she called Kim.** The explanation says *"In **D**, 'she' must be Dana."* On screen, D is "Dana told Kim that her test was canceled.", which is the unclear sentence.
- E.1.2-012 (select all): *"**A** joins two complete sentences with a comma + 'and.' **C** joins them with a semicolon. **D** has one subject…"* On screen, A is "We checked the chart and, called the doctor." (wrong).
- E.2.3-009 (select all): *"**A, C, and E** each connect sleep to learning."* On screen, A is "Many dorms have bunk beds."

**Fix:** In the Sheet, rewrite these four explanations to quote the sentence instead of a letter (for example *"Only 'Bring your ID, two pencils, and a water bottle' places every comma correctly"*). Or extend `relabelLetters` to handle bare letters. Quoting is safer: bare "A" also appears as an ordinary word ("A summary covers…"). Add a check to `build_data.py` that flags any bare A–F in the explanation of a `shuffle` item.

### M3. Wide tables in Reading passages hide the columns students need, with no sign that more is there
**Where:** RP-03 "Shore Health Clinic: Weekly Service Hours", used by R.3.4-003, R.1.5-001, R.1.5-005 and R.3.4-006 (with RP-19). RP-19, the shuttle schedule, also clips a little.
**What the student sees:** On a phone only Service, Monday, Tuesday and a sliver of "We…" show (`mob-R.3.4-003-table-crop.png`). R.3.4-003 can only be answered from the **Thursday** column, which is off-screen. Phone browsers hide scrollbars, so nothing says the table scrolls sideways. On the desktop the passage column is also too narrow (518 of 580 px), and the panel scrolls up and down too, so the student has to scroll in two directions inside a box (`desk-prac-R.3.4-003-q.png`).
**Fix:** On screens under about 600 px, show each table row as a stacked card ("Lab (blood draws): Mon 7–11 a.m., Tue 7–11 a.m., Wed Closed, Thu …"). Or transpose RP-03 so the days run down the side and the 4 services run across. As a minimum, add a visible "Swipe the table sideways to see more →" line and a fade on the right edge of any `.table-wrap` that overflows.

---

## Should fix

### S1. The "Skip to content" link opens "Page not found"
**Where:** `index.html`, `<a class="skip" href="#main">`.
**What happens:** The app routes on the `#` part of the address, so `#main` is treated as a page. Keyboard and screen-reader users who press Skip get "Page not found" (confirmed in the browser). The study pages are not affected.
**Fix:** Point the skip link at a handler that focuses `#main` without changing the address, or make `route()` ignore `#main`.

### S2. The band disagrees with the percentage printed next to it
**Where:** Results page and My progress (`core.bandFor`, Beta posterior).
**What the student sees:** "R.2 Craft and Structure: **Build the basics**, 9 of 15 correct." The legend underneath says *Getting there* is 60–80%, and 9/15 is exactly 60% (`mob-results-Reading-top.png`). The same thing happened in my Math run. Other mismatches: 6/10 and 5/8 and 8/13 show Build the basics; 9/11 (82%) shows Getting there.
**Fix:** Choose the band from the observed percentage (`correct/n`) against the cut points. Use the posterior only to decide "Clear result" vs "Tentative". Or reword the legend so it doesn't promise exact cut-offs. Students will check the arithmetic.

### S3. On phones, the "How sure" column of the results table is off-screen, and so is the "All answers" column on My progress
**Where:** `#/results/N` and `#/progress` at 390 px.
**What the student sees:** The results table shows Part, Band and Score; "Clear result / Tentative" is cut off (`mob-results-Reading-top.png`). On My progress, before any diagnostic, the only column with data ("All answers: 1/3 overall (33%)") is hidden. Every visible cell says "Not yet" (`mob-progress-empty-ish.png`).
**Fix:** Below about 600 px, show each part as a small card: "R.2 Craft and Structure · Build the basics · 9 of 15 right · Tentative: practice more to firm this up". On My progress, rename "Since then" to "Practice since your last diagnostic".

### S4. "Correct answer · your choice" breaks the layout on phones
**Where:** Any option the student got right, in practice feedback and in the diagnostic review, at 390 px.
**What the student sees:** The label is set to `white-space: nowrap`, so the option text squeezes to one word per line ("Third / person, / by a / narrator…"). The option boxes run past the right edge, and the page scrolls sideways a little (`mob-results-Reading-review1.png`). It happened on 13 of the 482 feedback screens, mostly select-all.
**Fix:** On narrow screens, put the label on its own line under the option text (`flex-wrap: wrap`, label `flex-basis: 100%`), or shorten it to "✓ Correct, your pick".

### S5. Feedback for paired passages uses "A" and "B" for passages next to options also lettered A and B
**Where:** R.3.2-003, R.3.2-004 (explanations "A discusses… B discusses…", "A argues… B worries…"), and R.3.3-005 (note "supports Passage A, not B.").
**What the student sees:** "Correct answer: **D**. Passage A focuses on…" / "Explanation: **A** discusses body clocks…; **B** discusses buses" / "Why not **B**: this reverses the passages." (`mob-prac-R.3.2-003-fb-crop.png`). "B" means an option in one line and a passage in the next.
**Fix:** Always write "Passage A" / "Passage B" or "Story A" in explanations and notes, never a bare letter.

### S6. Paired passages show two labeling systems, and the inner labels are hard to spot
**Where:** RP-05, RP-14, RP-21 (inner "Passage A / Passage B", "Story A / Story B"), RP-13 ("Source 1 / Source 2"). Two-passage items show outer "Text 1 / Text 2" headings.
**What the student sees:** R.3.4-010 shows "Text 1: Two Views on Phones…", which holds Passage A and Passage B, then "Text 2: Screens and Sleep", which holds Source 1 and Source 2. The inner labels sit on the first line of the paragraph in plain text, so it's easy to miss where Passage B begins (`crop-RP05.png`).
**Fix:** Make the inner labels bold sub-headings (in `renderRich`, treat a line like `Passage A (…)`, `Story B: …` or `Source 1: …` as a heading). For items that use two passages, write the stem with the passage titles rather than "Text 1/Text 2". Better still, drop "Text 1:" when the stem already names the passages by title.

### S7. Feedback notes shared by several options read as plural fragments
**Where:** 27 items with notes that are `shared` but have no `lead` letters: E.1.2-001, E.1.3-001, E.1.3-002, E.2.1-001, E.2.1-003, E.2.2-001, E.2.2-003, E.2.2-004, E.2.3-001, E.2.3-003, E.3.1-004, M.1.2-002, M.1.5-001, M.1.7-004, M.2.5-003, S.3.1-006, S.3.2-006, S.4.1-005, S.4.1-010, S.4.2-001, S.4.2-003, S.4.2-006, S.4.2-007, S.4.2-009, S.4.3-005, S.4.4-001, S.4.4-005.
**What the student sees:** "Why not D: statements of fact that don't make an arguable claim." "Why not B: misplace the decimal point." "Why not C: each is an observation…" Students picked one option, so these read as broken sentences.
**Fix:** Give these notes `lead` letters the way S.1.5-003 has them, so they render as "B and D misplace the decimal point." Or rewrite each note in the singular.

### S8. Notes with lead letters repeat the letter and list options the student didn't pick
**Where:** S.1.5-003, S.1.11-002, S.2.1-004, S.3.2-003 (select all).
**What the student sees:** "You chose E: **E and C** are parasympathetic…"; "You chose A: **A, D, and E** belong to adaptive immunity…" (the student picked only A). The letters aren't sorted ("E and C").
**Fix:** When a note has `lead`, drop the "You chose X:" label (or show the label without repeating the letter), and sort the letters.

### S9. "at most N more" counts the question on screen
**Where:** Diagnostic header.
**What the student sees:** Question 1 says "at most 45 more" in a 45-question diagnostic. The final question says "**at most 1 more**", and then the diagnostic ends. A careful reader expects one more question.
**Fix:** Use `remainingMax - 1`, or say "Question 12 · up to 33 left after this one". Clearer still, for weak readers: "Question 12 of up to 45 (it may end sooner)".

### S10. The length promise ("Most people finish in fewer") is false for the students who most need the site
**Where:** Diagnostic intro, diagnostic menu, About page.
**What happens:** The stopping rule only settles a part when the score is far from the 60%/80% cut points. I simulated 4,000 students per accuracy level with `subareaSettled`. At 60–85% correct, 60–81% of parts run the full 15 questions and still end "Tentative". In both of my runs, mid-range answers produced the maximum length (45 for Reading, 30 for Math). Science can run to 60 questions with no time estimate given.
**Fix:** State the length honestly: "18 to 45 questions. If your score is in the middle range, expect close to 45, about 40–60 minutes." Show a minutes estimate on each section card. Say up front that "Tentative" is common and normal.

### S11. On phones, the passage repeats above every question
**Where:** Reading diagnostic and practice at 390 px.
**What the student sees:** Each Submit scrolls back to the top. For the next question on the same passage, the student scrolls past 1–3 screens of passage to find the question, often several times in a row (RP-21 + RP-13 for R.3.4-010 is about 3,100 CSS px before the question). The intro only says "On a wide screen, the passage stays beside the question," and says nothing about phones.
**Fix:** On narrow screens, when the passage is the same as on the last question, collapse it behind a "Show the passage again" button and start at the question. Otherwise add a "Jump to the question ↓" link under the passage title, and a "↑ Back to the passage" link next to the options.

### S12. Ordered-response feedback doesn't show which steps were in the wrong place
**Where:** All 13 order items (for example S.1.2-001, R.1.6-003) in practice and in the diagnostic review.
**What the student sees:** Their list, unmarked, still under "Use the Move up and Move down buttons…" (the buttons are gone by then). Below it, the correct order is run together on one line: "1. Pharynx · 2. Larynx · 3. Trachea · …" (`crop-order-fb.png`). The feedback box has no "Correct answer" line.
**Fix:** After checking, mark each step ✓ or ✗ in place, show the correct order as a numbered list inside the feedback box under "Correct order", and hide the instruction line. Also change the help text to match the buttons: "Use the ↑ and ↓ buttons…".

### S13. Select-all feedback doesn't say which correct answers were missed, or how close the student came
**Where:** All 24 select-all items.
**What the student sees:** Notes exist only for wrong options, so a missed correct option is never mentioned under "About your answer". There is no "You left out" line in any item, though the code supports one. Every result is a flat "Not quite", whether the student got 2 of 3 or 0 of 3.
**Fix:** Add a summary line: "You picked 2 of the 3 correct answers and 1 wrong one. You left out: B (Fever)." Say once, in the instructions, that the TEAS gives credit only when all choices are right.

### S14. Supply answers with "the", common misspellings or "cm^3" are marked wrong
**Where:** S.1.4-002, M.2.4-004, M.2.4-007.
**What the student sees:** "the gallbladder", "galbladder" and "gallblader" are marked wrong ("Correct answer: gallbladder / You entered: the gallbladder"). "282.6 cm^3" and "282.6 cubic centimeters" are wrong, but "282.6 cm³" is right. "1000 cm3" is wrong for the mL item. "= 12" and "x is 5" are wrong. (Units, commas, "x = 5", fractions, mixed numbers, trailing periods and extra spaces all grade correctly.)
**Fix:** Strip a leading "the/a/an" and a leading "=". Allow any trailing unit text that has no digits other than an exponent (`cm^3`, `cm3`), up to about 20 characters. For one-word answers, accept spelling within one edit (gallbladder). Also consider rejecting a clearly wrong unit: "39 °F", "300 g" and "300 kg" are now accepted for °C and mg. That is lenient, but it teaches the wrong habit on dosage items.

### S15. No way to report a problem with a question, and no visible question ID
**Where:** Every question, including the 240 English and Reading drafts.
**What happens:** The required line "Draft question: awaiting ESCC faculty review." appears in small grey 0.82 rem text above the stem. It doesn't say what the student should do if a draft looks wrong, and there's no ID they could quote. The M2 contradictions above are exactly what a student would want to report.
**Fix:** Keep the required text, but show it as a small labelled chip ("Draft question") with the full sentence beside it. Add "Something wrong with this question? Tell us" under every feedback panel. It can open the existing Google Form, or a mailto link, prefilled with the item ID (for example R.3.4-003).

### S16. Study-page tables overflow on phones on 16 pages (see the list below)
Same problem as M3, with lower stakes. The macromolecule table on S.2.4 shows 2 of its columns, with "Ma…" cut off (`study-mob-S.2.4-table0.png`). The digestion table on S.1.4 hides most of the "Where digestion starts" column (`study-mob-S.1.4-table0.png`). Same fix: stacked rows under 600 px, or a "swipe" cue and a fade on the edge.

### S17. Figure labels are too small to read on a phone, and figures can't be enlarged
**Where:** All 35 study figures, worst on the OpenStax drawings (for example S.1.3 Figure 2).
**What the student sees:** Figures are 1400 px wide, scaled to about 320 CSS px. In the original diagrams, labels come out around 6–7 CSS px tall (`crop-S.1.3-fig1.png`), and the OpenStax labels are smaller still. The image isn't a link, so the student has to pinch-zoom the whole page.
**Fix:** Wrap each `<img>` in a link to the full-size file and add "Tap to enlarge" to the caption. For the original diagrams, increase the label font in the source SVG/PNG.

### S18. Practice screens show the official ATI objective wording to weak readers
**Where:** The subtitle on every practice question (for example "Evaluate and integrate data from multiple sources across various formats, including media."), "Describe the anatomy and physiology of the respiratory system.", and the study index.
**Fix:** In practice, show only the study-page title (already plain: "Integrating Multiple Sources"). Optionally add a one-line plain gloss ("Using two texts together, like directions plus a schedule"). Keep the ATI wording on the study page, where it is labelled "What the TEAS expects".

### S19. The home page doesn't explain "diagnostic" or say how long one takes
**Where:** `#/`.
**What the student sees:** "1. Take a diagnostic. One section at a time. It stops early once it has a clear picture…" The word is never defined, and no time is given. "No login… saved in this browser only" is there, but not what that means in practice.
**Fix:** "1. Take a practice test (diagnostic) for one section, about 20–60 minutes. It shows which parts of that section you're strong in and which need work. No score is sent anywhere." Add one plain line: "Your progress stays on this phone or computer, in this browser. If you clear your browser or switch devices, use My progress → Download to keep it."

---

## Nice to have

- **N1. "What to work on" is an unranked list.** After my Reading run it listed 11 objectives, each with equal weight. Sort by number missed and show "missed 2 of 3". Optionally show only the top 3–5, with "show all".
- **N2. "Correct answer: B. The mean is 9.; C. The mean is…"**: the ".;" join in select-all keys reads oddly. Show the correct answers as a short bulleted list.
- **N3. Supply key shown without its unit.** "Correct answer: 4.5" for "Write 0.045 as a percent"; "Correct answer: 8" for mL. Display the accepted form with its unit (4.5%, 8 mL).
- **N4. "Common mistakes" heading followed by "Common errors: …"** (29 general notes). Drop the "Common errors:" prefix when the text is shown under that heading.
- **N5. Leaving practice for the study page restarts the round.** "Study page" links in feedback open in the same tab. Pressing Back starts a new queue, and "Question 5 of 10 · 4 of 4 right" is lost. Open study pages in a new tab from practice, or keep the session in `sessionStorage`.
- **N6. Phone keyboard on number items.** `inputmode="decimal"` on iOS shows no "/", "%" or letters, though the hint says "Units are optional" and the grader accepts fractions. That's fine for most answers, but either use `inputmode="text"` or change the hint to "Type a number."
- **N7. Check-question answers sit at the bottom of long pages.** S.1.3 is about 9,000 CSS px tall on a phone. Use a "Show answer" toggle (`<details>`) right under each Check, or a link that jumps to the answer and back.
- **N8. 168 links on study pages all read "OpenStax ↗".** Use the section name as the link text ("Section 19.1 Heart Anatomy ↗"). The figure-credit links go to the book's introduction page, not to the figure's section.
- **N9. The study index is one long page (about 7,000 CSS px) with no jump links.** Add "Reading · Math · Science · English" links at the top. The `id`s already exist.
- **N10. About page:** "draws up to 15 questions from each part… That's more than the real test uses". That's false for R.1 (15 on the real test), M.1 (18), M.2 (16) and S.1 (18). Say "about as many as the real test".
- **N11. Diagnostic intro:** "Each answer helps decide what comes next" overstates the adaptivity. The form is fixed, and answers only decide when a part stops. Say "Each answer helps decide when that part can stop."
- **N12. The heading gets a black focus box on first page load and after keyboard navigation** (`mob-home.png`, `desk-home.png`). It doesn't appear after a tap or click. Add `h1[tabindex="-1"]:focus { outline: none; }`, or a subtle style.
- **N13. "Stop and discard this diagnostic" sits right under Submit.** It asks to confirm, which is good. Moving it further away, or styling it in muted text, would cut down on panicked taps.
- **N14. Terminology** is mostly consistent: the app says "part" throughout, and I found no "subsection" or "subarea" in the student-facing text. Study pages say "Human Anatomy & Physiology" while the app says "and". Codes like "R.3" and "S.1.12" are everywhere. Consider tucking them into smaller text after the plain name. Tone is respectful throughout; I found nothing condescending. Estimated reading level of the study pages: median about grade 6.7, Science pages up to about grade 10 (technical vocabulary).

---

## Study pages with rendering problems

**Checked:** all 64 pages in `docs/study/`, by a script in Chrome at 390 px, plus eye checks of S.1.3 (phone and desktop), S.1.4, S.2.4, S.3.1, R.3.2 and the index.

| Check | Result |
|---|---|
| Leftover Markdown in visible text (`**`, `##`, `\|---\|`, `[x](url)`, backticks, `*em*`, lines starting "- ", " - x - y" run-on lists, pipes in paragraphs) | **None found.** The only hits were intentional fill-in blanks `___` on E.1.1, E.2.3 and M.2.3. The same scan on all 482 questions, 24 passages, options and notes, after `renderRich`, also found none. |
| Images that fail to load or are under 200 px wide | **None** (35 figures; no 4xx responses on any page). |
| Captions outside their `<figure>` | **None.** Every image has its `figcaption` inside the figure. |
| "Check N" questions without an answer at the bottom | **None.** Every page's "Check answers" list has at least as many items as it has Checks. |
| Tables wider than the phone screen (hidden columns, no scroll cue) | **16 pages:** S.1.4, S.1.5, S.1.6, S.1.7, S.1.9, S.2.1 (3 tables), S.2.3, S.2.4 (worst: 580 px of content in 354 px), S.2.5, S.3.1 (2 tables), S.3.2, S.3.4, S.3.5, S.4.2, S.4.3, S.4.4. On S.2.1, S.2.3, S.4.2 and S.4.4 the cut-off is slight (20–60 px). |
| Figure labels readable on a phone | **Too small on all figure pages** (see S17). |
| Unclear links | Repeated "OpenStax ↗" link text (see N8). |

---

## Other things that worked well

- Progress Download, Clear (with an on-page confirm), Load, loading the same file twice (no duplicates) and loading a bad file (clear error message) all behave correctly.
- An unfinished diagnostic resumes correctly, and the home page offers "Pick up where you left off". Starting a different section warns that the unfinished one will be discarded.
- Options in number order really are ascending on all 68 `sorted` items, and no feedback on them refers to a letter.
- "Option C"/"Choice C" relabeling works (E.3.1-004 showed "Option B" correctly).
- The no-login and saved-in-this-browser message is on the home page, the footer, My progress and About.
- The "not a predicted TEAS score" disclaimer appears on the diagnostic menu, the results page and About. It is clear and is not oversold, apart from the band and percentage mismatch in S2.
- Phone tap targets are adequate. The order buttons are 44x36 px. Practice feedback scrolls into view after Check.
