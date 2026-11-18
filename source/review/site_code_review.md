# ESCC TEAS Prep practice site: independent code review

Reviewer: independent (did not write the site). Date: 2026-11-18. Scope: `docs/`, `scripts/build_data.py`, `scripts/build_study_pages.py`, `tests/`, `SITE.md`, `SCHEMA.md`. Nothing was edited except this file.

## What I ran

- `node --test tests/core.test.mjs`: 14/14 pass.
- `python3 tests/smoke.py`, three times: **failed once, passed twice**. The failure is a race between the test and the app (see S3).
- I rebuilt `bank.json` from `data/raw/` into a temp file. Apart from the timestamp it is identical to the committed `docs/data/bank.json`. (The script writes `data/build_report.txt` even when `--out` is given. I restored that file with `git checkout`.)
- I ran my own probes:
  - every supply item against a list of wrong answers;
  - every non-supply item's raw distractor notes compared with the parsed notes;
  - all explanations scanned for option letters;
  - 3,000 simulated forms per section;
  - a simulation of the stopping rule;
  - headless-Chrome checks of the skip link, corrupt storage, malformed import, injected HTML, double submit, review radios and the feedback live region;
  - WCAG contrast calculations;
  - a link check across all 66 HTML pages.

---

## Blocker

### B1. Supply-answer grading marks many wrong numbers correct, including the items' own listed "common errors"

`docs/assets/core.js:76-82` (`normalizeText`) and `:121-131` (`gradeSupply`).

**What goes wrong.** `normalizeText` deletes `.`, `,`, `-`, spaces and quotes. `gradeSupply` tries that text match against `accepted[]` *before* it compares numbers. So a wrong answer is marked right whenever its digits, read without the decimal point and the minus sign, are the same as an accepted answer's digits. This affects all 15 numeric supply items. Results from `gradeSupply` on the current bank:

| Item | Accepted | Wrong answers graded **CORRECT** |
|---|---|---|
| M.1.1-002 (0.045 as a percent) | 4.5 | **45, 45%** (the item's own listed common error), .45, -4.5 |
| M.1.8-002 (mL for 400 mg) | 8, 8.0 | **80** (listed common error), -8 |
| S.3.5-003 (g glucose) | 12.5, 12.50 | **1250, 1,250** (listed common error), 125, 1.25 |
| S.4.1-002 (2.5 kg to g) | 2500 | 250.0, 25.00, 2.500 |
| S.4.1-006 (°F to °C) | 39, 39.0 | 390, 3.9, -39 |
| M.1.6-004 (percent increase) | 12.5 | 125, 1.25 |
| M.2.4-004 (cylinder) | 282.6 | 2826, 28.26 |
| M.2.4-007 (container) | 1000 | 10.00, 1.000 |
| M.1.8-004 (mg dose) | 300 | 3.00, 30.0 |
| M.2.5-002 (fl oz to mL) | 240 | 2.40, 24.0 |
| M.1.2-004 (order of operations) | 12 | -12, 1.2, 1,2 |
| M.1.4-002 / M.1.4-004 | 5 / 18 | -5, x=-5, .5 / -18, 1.8 |
| M.2.1-007 | 27 | 2.7, -27 |
| M.2.5-008 | 6 | -6, .6 |

The numeric path is fine on its own: "250" is correctly marked wrong for S.4.1-002. The bug is in the text path. The tests missed it because they check accepted forms but never check wrong answers that collapse to the same digits.

**Fix.**
1. When `item.numeric.length > 0`, grade only with `parseNumberAnswer` + `numbersMatch`, and skip the text list.
2. If you keep a text comparison for numbers, normalize without deleting `.` or `-`. Strip only spaces, and commas between digit groups, e.g. `/(?<=\d),(?=\d{3}(\D|$))/`.
3. Add must-fail tests built from each item's "Common errors" note (45, 80, 1250, -6, …).

---

## Should fix

### S1. Four explanations name options by bare letter; after shuffling, the letters point at the wrong options

The explanation is relabelled only where it says "Option X" or "Choice X" (`core.js:69-71`). These four items are all `shuffle`, so most students see the wrong letters:

| Item | Explanation text | Sheet key |
|---|---|---|
| E.1.2-004 | "Only **C** places every comma correctly" | C |
| E.2.1-004 | "In **D**, 'she' must be Dana" | D |
| E.1.2-012 (select all) | "**A** joins … **C** joins … **D** has one subject" | A, C, D |
| E.2.3-009 (select all) | "**A, C, and E** each connect sleep to learning" | A, C, E |

Two more items are ambiguous in the same way. In R.3.2-003 and R.3.2-004, "A discusses…" and "B worries…" mean Passage A and Passage B. A student sees them right next to shuffled option letters A and B.

The letter references *inside distractor-note bodies* are all safe. They are "Passage A/B", "Story A/B", DNA bases (S.2.2-002) or chemical placeholders (S.3.3-002). None refers to an option.

**Fix.** In the Sheet, write "Option C", "Options A, C and D" and so on. Also extend `relabelLetters` to handle lists such as "Options A, C and E". Write "Passage A/B" in full in the two R.3.2 items. Add a build warning for bare letters in explanations, e.g. `(?:^|[.;]\s+|\b(?:In|Only)\s)[A-F](?:,? (?:and )?[A-F])*\b(?! (?:cell|vitamin))`, so this is caught at build time.

### S2. The "Skip to content" link goes to "Page not found"

`docs/index.html:13` (`href="#main"`) and `app.js:663-676`.

The router treats any hash as a route, so `#main` becomes `parts = ["main"]` and calls `viewNotFound()`. Verified in Chrome: after activating the skip link, the URL is `/#main` and the h1 reads "Page not found". In the middle of a question, this throws away the on-screen answer.

**Fix.** In `route()`, ignore hashes that don't start with `#/`, or give the skip link a click handler that calls `preventDefault()` and focuses `#main`. The study pages' skip link is fine, because those pages have no router.

### S3. Double-submitting the last diagnostic question corrupts the saved result and throws an error. This is also why `smoke.py` is flaky.

`app.js:311-318` and `343-358`.

**What goes wrong.** `finishDiagnostic` sets `location.hash`, but `hashchange` fires asynchronously. Until it does, the old form is still on the page. A second submit (double-click, or Enter twice) runs the handler again with the closed-over session `s`:
- it pushes a duplicate answer into `s.answers`, which is the same array as `rec.answers`;
- it logs a duplicate attempt;
- `runDiagnostic()` then calls `core.nextIndex(null)` and throws "Cannot read properties of null (reading 'pos')".

Verified: the result page showed 13 answers (12 unique), 13 attempts were logged, and the bands were computed from n = 12.

`tests/smoke.py:73-79` loops while `#qform` exists, so it hits the same stale form at random. That was the `randrange` failure I saw in one of three runs.

**Fix.** Disable the submit button on the first submit, and return early if `state.current !== s`. Copy `s.answers` into `rec`. In `smoke.py`, wait for the hash to change, or for `#qform` to be detached, after each submit.

### S4. Corrupt saved data disables saving for good and shows the wrong message

`app.js:18-28`.

**What goes wrong.** If the saved JSON doesn't parse, the `catch` sets `storageOk = false`. That shows the "private browsing or storage turned off" banner, and `save()` then never writes again. The bad string stays in storage, so this repeats on every visit. Verified: with `{bad json` saved, the banner showed, and after a practice answer the stored value was still `{bad json`.

**Fix.** Treat "can't parse" separately from "can't write". Copy the bad string to `KEY+":corrupt"`, reset to `blank()` and keep saving. Also check the shape of the parsed data (that `attempts` and `diagnostics` are arrays, that `current.order` is an array), because `start()` (`app.js:700`) runs outside the router's try/catch.

### S5. A malformed or crafted progress file can lock up the app (no way back without dev tools) and inject HTML

`app.js:548-566` (import), `229`, `367-368`, `527` (rendering).

**What goes wrong.**
- **Lock-up.** Import checks only that `attempts` and `diagnostics` are arrays. A diagnostic without `results` crashes both Home and My progress ("Something went wrong"). The "Clear all my progress" button is on My progress, so the student can't reach it. Verified.
- **Injection.** `r.code`, `r.correct` and `r.n` from saved data are placed into `innerHTML` without escaping. Verified: an imported `code` of `<img src=x onerror=…>` ran script on My progress. The risk is low but real ("load this file I sent you"). Profile name and email live in the same origin.

**Fix.** Check every imported (and loaded) record before keeping it:
- section is one of the bank's section names;
- `code` matches `^[RMSE]\.\d$`;
- `band` is a configured band id;
- `n` and `correct` are integers;
- answer ids exist in the bank.

Drop anything that fails, and escape every value that comes from `state`.

### S6. The stopping rule never settles "Getting there", and it stops early on "Build the basics" too easily

`core.js:206-227`, `config.js:10-15`, `app.js:368`, `382`.

1. **"Getting there" can never be settled.** It is only 0.2 wide, and with at most 15 items its posterior probability peaks at 0.63, below the 0.85 cutoff. So every student in the middle takes all 15 items in that part and is told "Tentative". The About page and the diagnostic intro both promise that "a part stops once your answers make your band clear".
2. **"Build the basics" settles too easily.** With a uniform prior it settles at 0–2 correct out of 6. "Strong" needs 8/8, 9/9 … 14/15. In 40,000 simulated students per ability level, the share stopped early and shown "Build the basics, Clear result":

   | True share correct | 0.60 | 0.65 | 0.70 | 0.75 | 0.80 |
   |---|---|---|---|---|---|
   | Stopped early as "Build the basics" | 30% | 19% | 10% | 5% | 3% |

   Average items per part was still 13–14, so early stopping saves little except for very weak or very strong students.
3. **The band shown can contradict the legend.** The band is the most probable band, not the observed share. So 9/15 (60%), 5/8 (63%) and 8/13 (62%) are shown as "Build the basics", and 9/11 (82%) as "Getting there". The legend under the table (`app.js:382`) says Getting there is 60–80% and Strong is over 80%.

The `betaCdf` formula itself is correct (the binomial-sum identity for integer parameters), and the probabilities sum to 1.

**Fix (pick one).**
- Label by the observed share, or the posterior median, so the label matches the legend.
- Raise `minPerSubarea` to 8–10, and/or require 0.9 or more before stopping on "Build the basics".
- Stop on "the band is unlikely to change in the remaining items" rather than a posterior probability.
- Reword "Clear result" to something weaker.

At the least, keep the About text honest about this.

### S7. Items already practiced can reappear in the diagnostic and inflate its bands

`app.js:283`.

`seen` holds only items answered in earlier diagnostics. All 482 items are "Diagnostic pool = yes", so a student who practiced S.1.2 (and read its explanations) will get those same items on the Science diagnostic.

**Fix.** Add the ids of practice attempts to `seen`: `state.attempts.filter(a => a.m === "p")`. Or use the Sheet's Diagnostic pool column to hold some items back for the diagnostic only.

### S8. Option order: some shuffled items have a natural order, and some never-shuffled items don't

`build_data.py:160-194`.

**Shuffled, but the options have a natural order** (they should be sorted or kept in Sheet order):
- **S.4.3-007**: "About 115 / 175 / 148 / 95 bpm". The "About" prefix stops number detection.
- **S.4.3-004**: "More than 362 g / Less than 204 g / About 362 g / About 287 g".
- **M.2.3-002**: "It increases by 8 / 2 / 11 / 4."
- **R.1.3-007**: "January 10 / 8 / 9 / 12".
- **R.3.4-006**: four dates and runs, chronological in the Sheet.
- **R.3.4-007**: "Less than 1 / 2 / 3 / About 4½ servings". Already ascending in the Sheet.
- **R.1.5-005**: "Run 1…Run 4, leaving at 7:00…4:00".
- **S.4.1-007**: "Student 1…4".
- **S.2.1-003**: "23 / 92 / 46 / 46 in one cell and 0 in the other".
- **S.3.3-003**: "Less than / Exactly / More than 10 grams / Cannot be predicted".

**`fixed` items with no natural order, so they are never shuffled** and every student sees the key in the same place:
- M.1.3-002 (key always B);
- S.4.1-009 (always B);
- M.2.3-005 (always C);
- M.1.1-004 (A, B, E).

The requirement says shuffle everything except natural orders. The code comment's reason (sorting would hint at "which is greatest?") argues for shuffling these, not fixing them.

**S.2.3-007** is `fixed` because of "All of them", but the Sheet order shown is 1/2, 1/4, 3/4. That is not ascending.

The 68 `sorted` items all look right. I checked each displayed order, including negatives, money, years and the R.1.4-003 temperature ranges.

**Fix.**
- Add an optional "Option order" override column in the Sheet (sorted / fixed / shuffle), and have the build respect it.
- Teach `numeric_value` to strip "About", "Less than" and "More than", and to read "January N" and "Student/Run N".
- Shuffle mixed-notation items instead of fixing them.
- For "All/None of them", sort or shuffle the other options and keep that one last.

### S9. Screen readers likely won't announce practice feedback

`app.js:484-488`.

After "Check answer", the whole `.q-layout` (which contains the `aria-live` `.fb-slot`) is replaced, and the feedback is written into the *new* region straight away. Live regions inserted already filled are generally not announced. Verified that the node is replaced. Focus then moves to the Next button, so "Correct" / "Not quite" is never heard.

**Fix.** Keep one persistent live region outside the replaced node, or move focus to the feedback's verdict (with `tabindex=-1`).

### S10. The "faculty review pending" notice depends on a hard-coded list of sections, not only on the item flag

- `app.js:93`: an item's notice needs **both** `item.reviewPending` **and** its section to be in `config.reviewPendingSections`.
- `app.js:279` and `:416`: the section-level notices come only from config.
- `build_study_pages.py:139` hard-codes English and Reading.

Today it works: all 240 English and Reading items carry the flag. But a Science item marked "faculty review pending" would silently show no notice. And when English is approved and the flag removed from the Sheet, the section notices and study-page notices stay until someone edits code in two places.

**Fix.** Show the item notice whenever `item.reviewPending` is set. Work out the section and study-page notices from the data: "any item in this section/objective is pending".

### S11. Focus ring fails non-text contrast

`style.css:14`, `:22`.

`--focus: #f2a900` is 2.0:1 against the white page. WCAG 1.4.11 asks for 3:1 for focus indicators. It is 4.45:1 against the blue header.

**Fix.** Use a darker ring (e.g. `#8a5a00`, or the brand blue), or a two-tone outline (dark outline plus light offset ring).

The band chips are fine:
- Build 6.5:1, Getting there 6.6:1, Strong 5.8:1, Not yet 5.5:1;
- muted text on white 5.9:1.

### S12. The xlsx build path is untested and may change cell text

`build_data.py:41-53`.

`load_xlsx` uses `str(value)` on typed cells. If anyone edits a cell by hand in Sheets, Sheets may store "1/4" as a date, "4.5%" as 0.045, or "12.50" as 12.5. The xlsx export then carries the typed value, so options or accepted answers change silently. I could only check the raw-dump path (it matches exactly). The test that would catch drift (`tests/core.test.mjs:215-217`) silently passes when `data/raw/` is missing, which it is after a fresh clone because the folder is gitignored.

**Fix.** In `load_xlsx`, warn in the build report about any non-string cell in the stem, option, answer or notes columns, or rebuild the displayed text from `number_format`. Make the export test call `t.skip()` visibly when there is no raw dump. Add a test that compares an xlsx build with a raw-dump build.

---

## Nice to have

1. **`supply_spec` handles fractions wrongly** (`build_data.py:197-209`). An accepted answer of "1/2" would store `numeric = [1]`, so a student typing "1" would be marked correct. No current item is affected. Parse fractions and mixed numbers the way `parseNumberAnswer` does.
2. **Small supply leniencies.** M.2.4-004: calculator π gives 282.74 and rounding gives 283; both are marked wrong (282.7 is accepted). S.1.4-002: "the gallbladder" and "gallbladders" are marked wrong. Consider a tolerance for M.2.4-004 and stripping leading articles or a trailing "s".
3. **Uneven item exposure** (`core.js:272-280`). The difficulty term (2 per level) swamps the 0.9 random term. E.3.2-019, the only difficulty-3 item in E.3, is in the first 6 E.3 items on **100%** of first-time English forms. S.1.10-003 is there on 56% and R.1.2-004 on 53%. Others are there only 2–6% of the time. No item is never selectable. Lower the weight (e.g. 0.7 per level) or draw targets at random.
4. **Review radios uncheck each other** (`app.js:116`). All review items use `name="opt"`. Outside a form they form one radio group, so opening a second review item unchecks the first item's chosen radio. Verified: of three open items, only the last kept its check. Use `name="opt-${k}"`.
5. **Double-clicking "Check answer" in practice skips the feedback** (`app.js:475`). The second click acts as "Next question". Ignore clicks for about 300 ms after checking.
6. **Two tabs overwrite each other.** Each tab holds its own `state` and the last save wins, so attempts from the other tab are lost. Re-read storage before saving, or listen for the `storage` event.
7. **"Load progress from a file" has no visible keyboard focus** (`app.js:537`). The file input is `sr-only` and sits outside its label, so `label:focus-within` never applies.
8. **The ordered-response control works by keyboard** (buttons with good `aria-label`s, focus kept after a move) **but doesn't announce the new position**. Add a polite live message such as "Larynx moved to position 2".
9. **`build_data.py` tidy-ups:**
   - the do-not-pair regex is case-sensitive and reads only the first matching sentence (`:341`): use `re.I` and `findall`, and warn on any note containing "same form" that doesn't parse;
   - passages are not filtered by their own Status column;
   - `--out` doesn't redirect `build_report.txt`;
   - add report checks for bare-letter explanations (S1) and natural-order candidates (S8).
10. **Tests.** `core.test.mjs:13` hard-codes 482 items (it will fail on the next Sheet change). Add must-fail supply cases (B1). Fix the smoke-test race (S3).
11. **Stale reference.** `config.js:31` refers to `docs/README-site.md`; the file is `SITE.md`.
12. **Google Form link.** A malformed `resultsForm.url` throws inside the dialog's close handler, so the button silently does nothing. `window.open` runs in the dialog's async `close` event, so check iOS Safari's popup blocker; opening from the click handler, or using a real `<a target=_blank>`, is safer. Everything else is sound: URL building, encoding, the 1,200-character cap on details, nothing sent until the student submits.
13. **Lead notes list letters in Sheet order**, e.g. "D and A are parasympathetic". Sort by displayed letter.
14. **The diagnostic results page for English and Reading doesn't mention** that those questions are awaiting faculty review.
15. **Add a version query** (e.g. `bank.json?v=<built>`) so app.js and bank.json don't come from different builds during the roughly 10-minute GitHub Pages cache.
16. **Comment mismatch.** `config.js:25` says weak spots need "first tries", but `weakObjectives` counts all attempts, including diagnostic ones.

---

## Verified OK, by requirement

**1. Export / Approved only / passages**
- The build reads Items, Passages, Objectives and Blueprint by header name.
- 482 of 483 rows are included. The one excluded is the "Example" row.
- Rebuilding from `data/raw` reproduces the committed `bank.json` exactly (apart from `built`).
- All 24 passages exist and every "Used by items" list matches.
- The 12 two-passage items list both passages in the Sheet's order and show "Text 1 / Text 2" headings. Their stems refer to the texts by title.
- On wide screens the passage stays beside the question (sticky); on narrow screens it sits above.

**2. Diagnostic**
- **Size.** Exactly 15 items per subarea on every one of 3,000 forms per section.
- **Do-not-pair.** All 34 "Do not place on the same form as …" notes in column T were parsed, and every ID in them is in `notWith`, made two-way. S.4.4-004's "Was S.4.3-001" is correctly *not* treated as a pair. **Zero** conflicts in 12,000 simulated forms.
- **RP-21.** At most 3 items per form; the relaxed cap was never needed; items rotate across repeat attempts through `seen`.
- **Passage grouping.** Each passage's items appear together.
- **No infinite loops.** All loops are bounded.
- **Resume after reload** works: the same seed gives the same option order and the stats are restored. Checked in Chrome.
- **Shuffle.** Stable per seed, different across students.
- **Ordered-response items** never start in the correct order.

**3. Practice**
- Shows the explanation, the note for the chosen option ("Why not X" / "You chose X / You left out X"), the general notes and the study-page link.
- **Distractor notes, all 466 non-supply items compared with raw column O:** no text lost; no note on the wrong option; no unparsed letter labels; every multiple-choice distractor has a note. The 4 "lead" notes (S.1.5-003, S.1.11-002, S.2.1-004, S.3.2-003) get displayed letters. Only the 13 ordered-response items have general notes, as intended.
- **Grading:**
  - multiple choice, select-all (as a set) and ordered response are correct;
  - the number parser handles units, commas, `x =`, `$`, fractions and mixed numbers;
  - it rejects expressions ("12 + 3", "2.5 kg x 1000").

  The bug is only the text path (B1).

**4. Storage and Google Form**
- Saves after each answer.
- Trims to the last 5,000 attempts when there are more than 6,000.
- Quota or private-mode failure shows a banner.
- Export and import work and merge without duplicates (but see S4 and S5).
- The form button stays hidden until configured; the link is URL-encoded; nothing is sent automatically.

**5. Canvas QTI portability**
- `bank.json` keeps the Sheet's text, Sheet-letter option ids, keys, `accepted` and `numeric`, notes by option id, and passages. The SCHEMA.md mapping is sound.
- Caveats: the S1 explanations, and "lead" notes need their letters rebuilt for Canvas's own shuffling.

**6. Faculty review pending**
- 240 items flagged (all 120 English, all 120 Reading); all 24 passages flagged.
- Shown on each question, on the diagnostic start page, on the practice menu and on the English/Reading study pages. (See S10 for how fragile this is.)

**HTML injection**
- All bank text goes through `renderRich` / `escapeHtml`. Checked: `renderRich("<b>x</b>")` comes out escaped.
- No bank field reaches `innerHTML` unescaped except section names and objective codes, which come from the build.
- The only real holes are values from saved or imported progress (S5).

**GitHub Pages**
- `docs/.nojekyll` is present.
- All paths are relative; zero broken internal links or images across 66 pages.
- File names with dots (`S.1.10.html`) are fine.
- Letter case of codes and figure names matches. Checked on a case-sensitive file system, which matches GitHub Pages.
- `study/titles.json` exists.
