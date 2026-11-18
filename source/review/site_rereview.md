# ESCC TEAS Prep site: independent re-review of the fixes (commit 86b1743)

Reviewer: independent; did not write the site or the fixes. Date: 2026-11-18. Nothing in the repo was changed except this file. (`source/TEAS_PREP_STATUS.md` shows as modified in the working tree; that edit is not mine.)

## What I ran

- `node --test tests/core.test.mjs`: 15/15 pass.
- `python3 tests/test_xlsx_path.py`: "xlsx path OK".
- `python3 tests/smoke.py`, four times: **passed once, failed three times**, always with `ValueError: empty range for randrange()` (see code S3). I made a copy of the test with one extra wait after each submit. That copy passed 3 of 3, so the failure is in the test, not the app.
- Supply grading: each item's accepted answers, every number in its own "Common errors" note, sign and decimal-shift variants, and about 70 hand-picked inputs, against `core.gradeSupply` (`/tmp/rereview/probe_supply.mjs`).
- Stopping rule: 20,000 simulated students for each true share from 0.20 to 0.95, plus a table of the (correct, n) pairs where a part stops.
- Option order: every `sorted` and `fixed` item listed with its displayed order; shuffled items searched for numbers, months, days and ordinal words; before/after modes compared with HEAD~1.
- Bare-letter relabelling: every capital A–F in the 4 overridden explanations, plus a scan of all explanations, notes and option texts for standalone A–F.
- Headless Chrome at 390x844 (2x, touch), plus a few checks at 1280x900, 360 and 320 wide:
  - skip link, both mid-diagnostic and by direct URL;
  - corrupt and wrongly shaped storage;
  - a full Reading diagnostic with two `requestSubmit()` calls on every question and a reload after question 4;
  - review radios;
  - all 482 items opened in results review, checking for horizontal overflow and "undefined"/NaN;
  - an old-style record (with `settled`, without the new fields);
  - import of a crafted file (script in `code`, bad types, a diagnostic without `results`) and an export/import round trip;
  - the Google Form dialog in a **copy** of `docs/` under `/tmp` (valid URL, malformed URL, Escape, Close);
  - live region, passage collapse, ordered-response and select-all feedback;
  - the wide-table hint;
  - overflow on all 64 study pages and on the main app routes.
- Screenshots are in `/tmp/rereview/`. The ones cited are `mob-results-top.png`, `mob-old-record-results.png`, `mob-diag-passage-collapsed.png`, `desk-diag-repeat.png`, `mob-table-hint.png`, `crop-order-fb.png`, `crop-multi-fb.png`, `mob-form-dialog.png`, `mob-study-S.2.4-table.png` and `mob-progress-history.png`.

---

## Status of every earlier Blocker / Must-fix / Should-fix item

### Code review (`site_code_review.md`)

| # | Item | Status | Evidence / comment |
|---|---|---|---|
| B1 | Supply grading accepts wrong numbers | **Fixed** | Numeric items now grade on value only (`core.js:129-138`). All 16 items: every accepted form is right, and every number in each item's own Common errors note is wrong (45%, 0.45%, 80, 3.125, 1,250, 50, 250, 0.0025, −6, 660, 1,452, 94.2, 188.4, 56.8, 88.8, 126.4, …). ×10, ÷10, ×100 and sign flips are all wrong. Tests now include must-fail cases. Residue: see new items N-S2 and N-N1 below. |
| S1 | Bare option letters in 4 explanations | **Fixed** | `data/overrides.json` marks E.1.2-004, E.2.1-004, E.1.2-012 and E.2.3-009 as `bare`. Every standalone capital A–F in those four explanations is an option reference ("Only C", "In D", "A joins… C joins… D has", "A, C, and E"). No other explanation, note or option uses a bare letter as an option reference; the rest are articles, "B cells", "Passage A", "Store A", "Step A", °C/°F or chemical placeholders. A build warning now catches new cases. Small leftover: relabelled lists aren't re-sorted ("D, A, and B each connect…"). R.3.2-003/004 and R.3.3-005 are **deliberately left** for faculty; that's reasonable, because it's a content fix. |
| S2 | Skip link opens "Page not found" | **Fixed** | Mid-diagnostic, the skip link keeps the URL, focuses `#main`, and keeps the chosen answer. Typing `/#main` by hand still gives "Page not found" (harmless). |
| S3 | Double submit corrupts the result; `smoke.py` flaky | **Partly fixed** | App: fixed. The `busy` flag plus the `nextIndex` guard (`core.js:386`) worked: 24 questions with two submits each gave 24 answers, 24 unique and 24 attempts. **`smoke.py` is not fixed:** its loop (`tests/smoke.py:73-79`) still races the async `hashchange` after the last question, and it failed 3 of 4 runs. Adding `page.wait_for_function("!document.querySelector('#qform') \|\| !document.querySelector('#qform').dataset.busy")` after `page.click("#submit")` made it pass 3/3. |
| S4 | Corrupt saved data disables saving | **Fixed** | With `{bad json` stored: no banner, the bad string is copied to `…:unreadable`, and the next answer saves valid JSON. Wrongly shaped data (`attempts:"x"`) also loads cleanly. |
| S5 | Crafted progress file locks up the app / injects HTML | **Fixed** | `sanitize()` drops unknown ids, bad codes, non-numeric n/correct, unknown bands and diagnostics without `results`. A file with `<img onerror>` in `id` and `code` ran no script on Progress, Home or Results. The round trip of a real export is identical. Small leftover: `current` is kept as long as its `order` ids exist, so see N-N4. |
| S6 | Stopping rule never settles "Getting there"; label contradicts legend | **Fixed** (About text partly) | The band now comes from the observed share (`bandFor`). The stop rule is "finishing the part would leave the band unchanged" with probability ≥ 0.9 and at least 8 answers; the beta-binomial math checks out. Simulation, per part of 15: average items 8.2 (share 0.2), 11.0 (0.5), 12.3 (0.65), 11.8 (0.8), 9.0 (0.95). Early and full-length bands agree 93.6–100% of the time, which matches the config comment. "Getting there" now settles (for example 8/12 and 9/13). The results legend matches. **The About page still says** "stops early once your answers make your band clear", "about 60% or less / about 60–80% / above 80%", and "more than the real test uses" (`app.js:761-762`). See N-S4. |
| S7 | Practiced items reappear in the diagnostic | **Fixed** | `seen` now includes all attempt ids and all earlier diagnostic items (`app.js:368`). |
| S8 | Option order: natural orders shuffled; unordered sets fixed | **Partly fixed** | All 10 items listed earlier are now sorted or kept in order. M.1.3-002, S.4.1-009, M.2.3-005 and M.1.1-004 are now shuffled. S.2.3-007 shows 1/4, 1/2, 3/4, All of them. I checked all 79 `sorted` displays and they read sensibly. **Leftovers:** (a) M.2.1-006 (Jan→Feb, Feb→Mar, Mar→Apr, Apr→May), M.2.1-002, R.1.5-006 (April/February/March/May) and R.1.5-001 (day pairs) are still shuffled, though they have an obvious calendar order. (b) M.1.9-001 ratios (2:3, 2:5, 3:2, 12:30) changed from shuffle to sorted. The sort goes by the first number, not by value, and puts the key first for every student. (c) S.2.1-003 is `fixed` in the Sheet order 23 / 92 / 46 / "46 and 0", which isn't ascending; the key is always C. Sort it instead, or add a `sorted` override. |
| S9 | Practice feedback not announced | **Fixed** | A persistent `#live` region sits outside `main`. After "Check answer" it read "Not quite. The correct answer and an explanation are below." |
| S10 | Review notice depends on a hard-coded section list | **Partly fixed** | Each question's notice now comes from `item.reviewPending` alone. The section notices still come from `config.reviewPendingSections`, and `build_study_pages.py:142` still hard-codes English/Reading, so approving English still needs edits in two code places. That's acceptable if it's written in SITE.md; better to work it out from the flags. |
| S11 | Focus ring contrast | **Fixed** | `#1b2430` with a white halo (about 15:1 on white); white on the header. |
| S12 | xlsx path untested, may change cell text | **Partly fixed** | The test is added (integers only), and `core.test.mjs` now skips visibly. `load_xlsx` is unchanged and still uses `str(value)`. When I simulated Sheets typing the 38 percent cells as numbers, 5 items changed silently with no warning: M.1.3-001 "58%"→"0.58", M.1.3-002 "11%"→"0.11", M.1.6-002, M.1.1-003, M.1.1-004 (two options of M.1.1-004 become identical "0.75"). The 24 fraction cells ("1/4", "3/7"…) would become dates. Add the non-string-cell warning the review suggested. |

### UX review (`site_ux_review.md`)

| # | Item | Status | Evidence / comment |
|---|---|---|---|
| M1 | Wrong supply answers marked Correct | **Fixed** | Same as code B1. "80" for M.1.8-002 and "45%" for M.1.1-002 are now wrong. |
| M2 | Explanation letters point at the wrong option | **Fixed** | Same as code S1. |
| M3 | Wide reading tables hide columns | **Fixed (deliberate: hint)** | RP-03 on a phone shows "The table is wider than your screen. Swipe or scroll it sideways…" above the table (`mob-table-hint.png`). The cells now wrap, so Mon–Wed show and Thu is one swipe away. Reasonable. |
| S1 | Skip link | **Fixed** | See code S2. |
| S2 | Band disagrees with the printed percentage | **Fixed** for new results | Band = observed share, and the percentage is printed beside it ("9 of 15 correct (60%)" → Getting there). Records saved before this commit keep their old Beta band (see N-N3). |
| S3 | Results / Progress columns off-screen on phones | **Fixed** | `table.stack` turns rows into labelled cards; results and Progress fit at 390 px (`mob-results-top.png`). "Since then" wasn't renamed, but it now shows with its label. (A different overflow on Progress: N-S1.) |
| S4 | "Correct answer · your choice" breaks layout | **Fixed** | Opened all 482 items in results review at 390 px: no element past the right edge, and the page width stayed 390 in every section. |
| S5 | Bare "A"/"B" for passages | **Deliberately left** (content) | Reasonable, as agreed. |
| S6 | Paired-passage labels | **Fixed** | Inner "Passage A (…)", "Story B: …" and "Source 1: …" lines are bold in all 4 passages (RP-05, RP-13, RP-14, RP-21). The outer heading is now "Text 1 of 2: …". |
| S7 | Shared notes read as plural fragments | **Partly fixed** | They now render as "Why not A (same reason for A and D): misplace the decimal point." The fragment is still plural, and the label repeats the option's own letter. Acceptable. |
| S8 | Lead notes repeat the letter / unsorted | **Fixed** | No "You chose X:" label on lead notes; the letters are sorted. |
| S9 | "at most N more" counts the current question | **Fixed** | "at most 43 more after this"; the final question says "last question". |
| S10 | Length promise false | **Mostly fixed** | The intro gives "8 to 15 … 24 to 45 in all … about a minute per question", and Home says "Allow 20 to 60 minutes". The About page is unchanged (N-S4). The intro now says "students in the middle usually answer every question", but by my simulation a mid-range part averages about 12 of 15 and stops before 15 about 80% of the time. That understates, which is harmless. |
| S11 | Passage repeats above every question on phones | **Fixed** | A repeat passage collapses behind "Show the passage again (title)" on phones and stays open on wide screens (`mob-diag-passage-collapsed.png`, `desk-diag-repeat.png`). Leftover: N-N2. |
| S12 | Ordered-response feedback | **Fixed** | Each step shows "In the right place" or "Belongs at N" in green or red, and the instruction line is hidden (`crop-order-fb.png`). "Correct order" is still one run-on line outside the feedback box. Fine. |
| S13 | Select-all feedback doesn't say how close | **Partly fixed** | Adds "You chose 1 of the 3 correct answers and 1 that doesn't belong. All the correct answers must be chosen…" The missed answers aren't named one by one, but the "Correct answer" line lists them. Acceptable. |
| S14 | Supply leniency | **Partly fixed** (wrong units **deliberately** accepted) | Now right: "the gallbladder", "282.6 cm^3", "282.6cm3", "1000 cm3". Still wrong: "= 6", "282.6 cubic centimeters" (unit text over 15 characters), misspellings, "gallbladders". Wrong units accepted is the owner's rule; reasonable. |
| S15 | No way to report a problem / no question ID | **Partly fixed** | Every question shows "Question ID …", and the draft notice says to tell the instructor that ID. There's no report link. Reasonable for now. |
| S16 | Study-page tables overflow on phones | **Partly fixed** | Smaller font and wrapping cut it from 16 pages to 6. **But study pages get no scroll hint:** the hint is added by `app.js` only, and study pages don't load it. S.2.4 still hides its 4th column, "Examples" (99 px cut off, slivers of text; `mob-study-S.2.4-table.png`). Also S.1.4 (32 px), S.3.1 (24), S.2.5 (21), S.1.5 (8), S.3.5 (8). The deliberate "visible hint" choice isn't carried out on study pages. |
| S17 | Figures unreadable / can't enlarge | **Fixed** | Each figure links to its full-size file, with "Tap or click the figure to open it full size." The label sizes inside the original images are unchanged. |
| S18 | ATI objective wording on practice screens | **Fixed** | The practice subtitle is now "Study page for X"; weak-spot mixes show plain titles. |
| S19 | Home doesn't explain "diagnostic" or its length | **Fixed** | "A practice test for one section … Allow 20 to 60 minutes", plus the clearing-your-browser line. |

### Earlier nice-to-haves (brief)

**Code review.**
- **Fixed:** #10 (tests; the smoke race excepted), #11, #12 (Google Form: link built at click time; a bad URL shows an error), #13, #14, #16.
- **Partly fixed:**
  - #2: articles and cm³ are handled; 282.74 and 283 are still wrong for M.2.4-004.
  - #9: bare-letter warning added; do-not-pair regex still case-sensitive and first-match only; `--out` still rewrites `data/build_report.txt`.
  - #15: `bank.json` is now fetched no-cache, but app.js and core.js can still come from a different build.
- **Not fixed:**
  - #1: fractions in `supply_spec`. This is now worse; see N-S2.
  - #3: uneven exposure.
  - #4: review radios. Verified: 3 open items left 0, 0 and 1 radios checked; the highlight and "Your choice" tag still show.
  - #5: double-click on Check answer still skips the feedback in about half of my trials.
  - #6: two tabs.
  - #7: no focus ring on "Load progress".
  - #8: no live message for order moves.

**UX review.**
- **Not fixed:** N1, N2 (".;" join), N3, N4 ("Common mistakes" followed by "Common error:"), N5, N6, N7, N8, N9, N10, N11, N12 (the black h1 focus box still shows after a reload; see `mob-old-record-results.png`), N13.

---

## New problems

No new Blockers.

### Should fix

**N-S1. My progress scrolls sideways on phones once there is a diagnostic in the history.** `docs/assets/style.css:132` (`.obj-list .obj-stats { white-space: nowrap }`), rendered at `app.js:622`.
- With one Reading diagnostic, the page is 506 px wide at 390 (also at 360 and 320). With a Science diagnostic it is 594 px, and the S.3/S.4 bands are off-screen (`mob-progress-history.png`).
- This is not a regression: HEAD~1 is the same (532 px). Both earlier reviews missed it.
- Fix: allow wrapping (`white-space: normal` on `.obj-stats` under 640 px), or put each "code band" pair in a nowrap span.

**N-S2. Numeric-only grading makes any future fraction or ratio answer grade backwards.** `scripts/build_data.py:234-246` (`supply_spec`) with `core.js:132-135`.
- `supply_spec("1/2")` stores `numeric=[1]`; `"0.75|3/4"` stores `[0.75, 3]`; `"3:2"` stores `[3]`.
- Before this commit, the text match rescued the exact form. Now numeric items skip the text list. For an accepted "1/2": typing "1/2" or "0.5" is **wrong**, and typing "1" is **right**. For "3:2": "3:2" is wrong and "3" is right.
- No current item is affected. But "Write 0.75 as a fraction" or "Give the ratio" is a likely next Math supply item, and nothing would warn.
- Fix: parse fractions and mixed numbers in `supply_spec` the way `parseNumberAnswer` does; mark ratio answers as text (no `numeric`); add a build warning when an accepted answer has text after its number other than a unit.

**N-S3. Study-page tables have no "wider than your screen" hint** (UX S16 leftover). `scripts/build_study_pages.py:101` wraps tables in `.table-wrap`, but the hint lives in `app.js:108-116`, which study pages don't load.
- Scenario: on S.2.4 a student sees three columns and a strip of cut-off letters, with nothing saying more is there.
- Fix: add a small inline script to the study-page template that runs the same check, or emit a CSS-only cue (right-edge shadow on `.table-wrap` with `overflow-x:auto`).

**N-S4. The About page contradicts the new results page** (code S6 and UX N10 leftover). `app.js:761-762`.
- It says "about 60% correct or less / about 60–80% / above 80%". The results legend (correctly) says under 60%, 60–79%, and 80% or more. A student who got exactly 80% reads "above 80%" for Strong.
- It still says "That's more than the real test uses". That's false for R.1, M.1, M.2 and S.1.
- It says a part "stops early once your answers make your band clear". Reword it to match the diagnostic intro.

**N-S5. Natural-order leftovers** (code S8). Add `sorted`/`fixed` overrides in `data/overrides.json`, or teach `template_key` month names:
- M.2.1-006 and M.2.1-002 (month ranges) and R.1.5-006 (month names) are shuffled.
- M.1.9-001 ratio options are now sorted by first term, with the key in position A for every student. Ratios were deliberately shuffled before; put it back to shuffle.

**N-S6. `smoke.py` still races** (code S3 leftover). `tests/smoke.py:76-79`. It failed 3 of 4 runs. The one-line wait above fixes it.

### Nice to have

- **N-N1. Number parsing leniencies.**
  - **Regression:** the new cm³ rule (`core.js:114`, `/([a-zA-Z])\^?[23](?![0-9])/`) strips any 2 or 3 after any letter. So expressions are accepted as their first number: "12 x 3" → 12 (right for M.1.2-004), "5 x 2" → 5 (right for M.1.4-002), "8 mL x 2" → 8 (right for M.1.8-002). Before this commit they were rejected. Limit the strip to unit letters (`cm|m|in|ft|mm` followed by 2 or 3).
  - **Not new:** `core.js:104` deletes every comma, so "1,2" and "1 2" → 12, and "10,00" → 1000. Strip only thousands commas.
  - **Not new:** "12²" → 122 (NFKC turns ² into 2). It's graded wrong, which is harmless.
- **N-N2. The passage collapses when it shouldn't.** `lastPassageKey` (`app.js:209-215`) is never reset when the view changes. Scenarios:
  - A student on question 1 of a Reading diagnostic taps Home, then "Pick up where you left off". The same question comes back with its passage hidden behind "Show the passage again". Verified for R.2.3-009.
  - After practice on RP-03, the first diagnostic question on RP-03 also starts collapsed.

  Fix: reset the key in `route()`.

  Also, on wide screens the open `<details>` still shows "▼ Show the passage again" above a passage that is already visible (`desk-diag-repeat.png`). Hide the summary on wide screens.
- **N-N3. Records saved before this commit show contradictory bands.** "Build the basics · 9 of 15 correct (60%)" sits above "Getting there, 60% to 79%" (`mob-old-record-results.png`). Only testers' browsers have such records (Pages isn't on yet). `sanitize()` (`app.js:57-58`) could recompute `band` from `correct/n`.
- **N-N4. A malformed in-progress diagnostic crashes that section.** `sanitize()` keeps `current` whenever its `order` ids exist (`app.js:66`). With `current` missing `stats`, `#/diagnostic/Math` shows "Something went wrong" every time, and Home still offers "Pick up where you left off". Starting another section recovers. Only reachable by hand-edited localStorage. Check `stats`, `pos`, `answers` and `bySub` too.
- **N-N5. `sanitize()` permanently deletes history for unknown item ids** (`app.js:46-61`). It runs on load, and the next `save()` writes the result. If an item id is ever renumbered in the Sheet (as S.4.4-004 "Was S.4.3-001" shows has happened), every student loses those attempts and review entries on their next visit. Consider skipping unknown ids in views rather than deleting them from storage.
- **N-N6. The Google Form dialog saves name and email even when cancelled.** `update()` writes `state.profile` on every keystroke, and the `close` handler saves (`app.js:740-750`). Verified: typed "Changed Mind", pressed Escape, and it was stored. It stays local, but "Close" reads as cancel. Save only on "Open the form".
- **N-N7. `tests/test_xlsx_path.py` leaves the working tree dirty.** The builds it runs rewrite `data/build_report.txt` (timestamp line), because `--out` doesn't redirect the report. I restored my copy with `git checkout`.
- **N-N8. Small display details.**
  - The diagnostic progress bar reads 100% while the last question is still on screen (`app.js:384`, because `remainingMax` is now "after this").
  - Relabelled lists in bare-mode explanations aren't sorted ("D, A, and B each…").
  - Shared-note labels include the option's own letter ("Why not A (same reason for A and D)").
