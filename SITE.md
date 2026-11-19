# Running the practice site (`docs/`)

The site is the `docs/` folder: plain HTML, CSS and JavaScript, served by GitHub Pages. There's no server, login or database. Each student's progress is kept in their own browser (localStorage).

```
docs/
  index.html            the app (diagnostic, practice, progress)
  assets/app.js         screens and storage
  assets/core.js        grading, option order, form assembly, bands (tested)
  assets/config.js      settings you can change (bands, stopping rule, Google Form)
  assets/style.css
  data/bank.json        made by scripts/build_data.py from the Sheet
  study/                64 study pages + index, made by scripts/build_study_pages.py
```

## Updating the questions after editing the Sheet

The Sheet is the source of truth. After changes:

1. In the Sheet: File › Download › Microsoft Excel (.xlsx).
2. From the repo folder:
   ```
   pip install openpyxl markdown pillow
   python3 scripts/build_data.py --xlsx "ESCC TEAS Prep_ Master Bank.xlsx"
   python3 scripts/build_study_pages.py
   node --test tests/core.test.mjs
   ```
3. Read `data/build_report.txt`. Its "Check these" section lists anything odd: a key that doesn't match the options, a passage that's missing, a do-not-pair note pointing at an item that isn't Approved.
4. Commit and push. GitHub Pages republishes in a minute or two.

(Claude can do steps 1–2 through the Google Sheets connector instead. The tab dumps go in `data/raw/`, which isn't committed.)

Only rows with Status = Approved are published. "Faculty review pending" in Review notes shows students a short "awaiting ESCC faculty review" line on that question.

Study pages are built from `source/pages/*.md`. Edit the .md file, not the Google Doc, then rerun `build_study_pages.py`.

## Settings (`docs/assets/config.js`)

- `diagnostic.maxPerSubarea` (15), `minPerSubarea` (8), `stopConfidence` (0.9): a part (subarea) stops early only after at least 8 questions, and only when it's at least 90% likely that answering all of its questions would leave its band unchanged. In simulation the early band matched the full-length band 93–99% of the time, with 9–12 questions per part on average. Students near a cut point usually answer all 15.
- `diagnostic.passageCapPerForm` (3): at most 3 items from one Reading passage per diagnostic. This spreads RP-21's 12 items across several attempts. Repeat diagnostics prefer items the student hasn't seen yet.
- `diagnostic.bands`: cut points at 60% and 80% correct, labelled *Build the basics*, *Getting there* and *Strong*. The band comes from the share answered correctly, so it always matches the legend. These are practice bands, not TEAS predictions. Change them once real TEAS scores are available to calibrate against.
- Repeat diagnostics prefer questions the student hasn't seen yet, in earlier diagnostics or in practice.

## Display overrides (`data/overrides.json`)

The Sheet holds all content. This file holds two display settings the Sheet has no column for:

- `optionOrder`: per item, `fixed` keeps the Sheet's option order instead of shuffling. Number options are already sorted automatically ("About 95 bpm", "January 9", "$1,152.00", age ranges).
- `explanationLetters`: items whose Explanation names options by bare letter ("Only C places every comma correctly"). The site rewrites those letters to match the shuffled order. The build report flags new explanations that look like this, so you can add them here. Rewriting them in the Sheet to quote the option text would be better still.

## Optional: results to a Google Form

1. Create a Google Form (in your VCCS Drive) with these short-answer or paragraph questions: Name, Email, Program, Type, Section, Summary (paragraph), Details (paragraph). Leave them all optional.
2. Responses tab › Link to Sheets, so responses go to a Sheet in your Drive.
3. ⋮ › Get pre-filled link. Type something in every field, click Get link, then copy it. Each field appears as `entry.123456789=...`.
4. In `config.js`, set `resultsForm.url` to the form's `.../viewform` address. Then copy each `entry.NNN` into `resultsForm.fields` (name, email, program, kind, section, summary, details).
5. A "Send my results to ESCC (optional)" button then appears on diagnostic results and on My progress. It opens the form already filled in. Nothing is sent until the student presses Submit. If your form only accepts VCCS accounts, students must be signed in to one, so set the form to accept anyone if you want applicants to use it.

## TEAS Coach (Gemini Gem)

The Coach's instructions and setup steps are in `coach/TEAS_COACH_INSTRUCTIONS.md`. Its knowledge files are `coach/knowledge/*.md`; rebuild them with `scripts/build_coach_files.py` after changing study pages, then re-upload them to the Gem.

Set `coach.url` in `docs/assets/config.js` to the Gem's share link. After that, every practice answer and every diagnostic review question shows a Coach button:
- After a wrong answer: **Ask the TEAS Coach about this**.
- After a right answer: **I guessed. Ask the TEAS Coach why it's right**.

One tap copies the question, the student's answer, the correct answer and the explanation (plus the passage, for Reading), then opens the Coach in a new tab for the student to paste. If a browser blocks that, the site copies on a second tap; if that's blocked too, it shows the text to copy by hand. With `coach.url` empty, no buttons appear.

## Tests

- `node --test tests/core.test.mjs`: grading, supply-answer normalizing, option order, do-not-pair and passage limits across 200 random forms per section, banding, the stopping rule, and a check that the export copies the Sheet text exactly.
- `python3 tests/test_xlsx_path.py`: building from a downloaded .xlsx gives the same result as building from the tab dumps.
- `python3 tests/coach_test.py`: the Coach button copies the right text and opens the Coach, including both fallbacks.
- `python3 tests/smoke.py --shots /tmp/shots`: opens the site in headless Chrome. It runs every diagnostic and some practice, loads all 64 study pages, and fails on any script error or missing file.
