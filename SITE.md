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

- `diagnostic.maxPerSubarea` (15), `minPerSubarea` (6), `stopConfidence` (0.85): a subarea stops once the most likely band has at least 85% probability, but never before 6 items.
- `diagnostic.passageCapPerForm` (3): at most 3 items from one Reading passage per diagnostic. This spreads RP-21's 12 items across several attempts. Repeat diagnostics prefer items the student hasn't seen yet.
- `diagnostic.bands`: cut points at 60% and 80% correct, labelled *Build the basics*, *Getting there* and *Strong*. These are practice bands, not TEAS predictions. Change them once real TEAS scores are available to calibrate against.

## Optional: results to a Google Form

1. Create a Google Form (in your VCCS Drive) with these short-answer or paragraph questions: Name, Email, Program, Type, Section, Summary (paragraph), Details (paragraph). Leave them all optional.
2. Responses tab › Link to Sheets, so responses go to a Sheet in your Drive.
3. ⋮ › Get pre-filled link. Type something in every field, click Get link, then copy it. Each field appears as `entry.123456789=...`.
4. In `config.js`, set `resultsForm.url` to the form's `.../viewform` address. Then copy each `entry.NNN` into `resultsForm.fields` (name, email, program, kind, section, summary, details).
5. A "Send my results to ESCC (optional)" button then appears on diagnostic results and on My progress. It opens the form already filled in. Nothing is sent until the student presses Submit. If your form only accepts VCCS accounts, students must be signed in to one, so set the form to accept anyone if you want applicants to use it.

## Tests

- `node --test tests/core.test.mjs`: grading, supply-answer normalizing, option order, do-not-pair and passage limits across 200 random forms per section, banding, the stopping rule, and a check that the export copies the Sheet text exactly.
- `python3 tests/smoke.py --shots /tmp/shots`: opens the site in headless Chrome. It runs every diagnostic and some practice, loads all 64 study pages, and fails on any script error or missing file.
