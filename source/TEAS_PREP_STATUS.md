# ESCC TEAS Prep: status and decisions

Last updated: 2026-11-18 (late evening: practice site built)

## Where things live
- GitHub repo: foxworthywa/teas-prep (public) — https://github.com/foxworthywa/teas-prep. The content-phase working files (page sources, figures, build scripts, item batches, review reports) are under `source/`.
- Practice site: `docs/` in the repo, published with GitHub Pages from main /docs. How to update, settings, Google Form setup: `SITE.md`; data format and QTI mapping: `SCHEMA.md`.
- Master workbook (single source of truth): ESCC TEAS Prep: Master Bank — https://docs.google.com/spreadsheets/d/14RULVFb58M78c_BUmQu5az1T0fKTlX32nW4beebqhf8/edit
  - Tabs: Read me, Blueprint, Objectives (64 ATI objectives, all codes confirmed against the ATI TEAS 7 content outline; columns I–J hold study-page status and links), Items (columns A–V), Passages (Reading passages RP-01 to RP-24; items point to them in Items column R, "Image or asset"), Programs (cutoffs blank)
- Drive folder: ESCC TEAS Prep — https://drive.google.com/drive/folders/1lhyZ1D6LPp9pd-ssDrH8L8jfLT6NrU3-
  - Study pages subfolder: one Google Doc per objective, figures embedded. The Objectives tab column J is the authoritative link list.
  - "Superseded study pages (safe to delete)" subfolder: 33 older copies replaced on 2026-11-18 (see below).
- Tutor instructions (Gem now, Gemini skill later): claude/TEAS_TUTOR_INSTRUCTIONS.md. Alex is holding off on updating the Gem until the materials exist.
- Build pipeline (in the working environment; to move into the GitHub repo): pages/*.md sources with {{FIG id}} markers; build/figures.json manifest (OpenStax figures carry their book); build_pages.py makes web, docs and notebook versions (the notebook version strips all figures and checks none remain); build_docs_html.py makes Docs-ready HTML with embedded images (transparent images flattened onto white). It now also inserts the blank lines Python-Markdown needs before lists and before "---" dividers. Small corrections to published Docs are made in place (replaceAllText or paragraph-style edits) so links don't change.

## Decisions (Alex, 2026-11-17)
- Public web app on GitHub Pages, no login; content portable for later Canvas import via QTI. No dependence on Canvas admins.
- Master content in a Google Sheet.
- Diagnostic: more items per subsection than the real test (max 15), reported as bands, adaptive stopping; the practice layer keeps adding evidence. No cutoff predictions until calibrated against real TEAS scores.
- Compressed study pages per objective with embedded checks and deep links to specific OpenStax sections: A&P 2e for S.1; Concepts of Biology for S.2, with Biology 2e for viruses; Chemistry 2e for S.3, S.4.1 and unit conversions; Concepts of Biology for the scientific method; Prealgebra 2e, Elementary Algebra 2e and Introductory Statistics 2e for Math; Writing Guide with Handbook for English (handbook landing page; its section slugs aren't predictable), plus A&P 2e 1.6 for word parts.
- Figures wherever they help: OpenStax figures where best (CC BY 4.0, credited per figure; skip third-party credits and micrographs), original diagrams for flows, scales and graphs. Alt text and a teaching caption for every figure. Notebook/Gem versions are figure-free.
- AI tutoring via one Gem (later a skill) plus four NotebookLM notebooks; the app works fully without AI.
- Progress tracking: in-browser history plus an optional prefilled Google Form into a sheet in Alex's Drive.
- Audience: LPN, RN, dental hygiene, and future programs.
- Order: Science, then Math, then English and Reading (English and Reading faculty review after).
- QC: Claude drafts; two independent reviewer agents (blind solve from a key-free file; content audit); fixes applied; changed items re-reviewed; passing items Approved; uncertain items "Flagged for Alex". Study pages get a content audit plus a weak-student-perspective review, then a re-review after fixes.
- English pages use the serial (Oxford) comma throughout and say so.

## Progress
- **Bank complete: 482 items Approved.** S.1 42 · S.2 40 · S.3 40 · S.4 40 · M.1 40 · M.2 40 · E.1 40 · E.2 40 · E.3 40 · R.1 40 · R.2 40 · R.3 40. English and Reading items carry "faculty review pending" in Review notes. Reading uses 24 original passages (RP-01 to RP-24) in the Passages tab, with the items that use each one listed.
- Item-writing safeguards added 2026-11-18: answer positions are shuffled with balance (no A-B-C-D cycling, no three identical keys in a row); a script flags keys that are noticeably the longest option (Reading batch 1 went from 46% to 22% "key is longest"); numeric options were meant to stay in natural order (many were not; the site now sorts them at display time). About 25 Reading item pairs give each other away (same table, same keyed idea) and are marked "Do not place on the same form as …" in Review notes; the diagnostic builder must honor these. RP-21 (phones) carries 12 items, so spread them across forms.
- Loading method: rows go into the workbook through a temporary .xlsx (text-typed cells) copied in as a sheet, then pasted as values; this avoids number/date conversion. Temporary files "zz import temp (delete)", "zz import temp 2 (delete)" and "zz import temp 3 (delete)" are in the ESCC TEAS Prep folder.
- **All 64 study pages published** and linked in Objectives (27 Science, 15 Math, 8 English, 14 Reading). Reading pages link OpenStax College Success (5.2, 7.3, 7.4) and Introductory Statistics 2e (2.1).
- 2026-11-18 rendering fix: the Docs converter was merging any list that directly followed a line of text into that paragraph (bullets showed as "- item - item" run-on text). 27 Science/Math Docs were affected and were re-uploaded with new links (Objectives column J updated); the old copies are in the Superseded subfolder. The Math pages' calculator tip, which had imported as a large heading, was fixed in place. M.1.2's PEMDAS list was also repaired (an exponent note had split it).
- Content corrections after review (2026-11-18): antibiotics "take exactly as prescribed" (S.2.5); ADH trigger and posterior pituitary (S.4.3); plant lysosomes (S.2.1); enzyme denaturation caveat (S.3.4); micro- prefix (S.4.1, M.2.5); "is more than" vs "more than" (M.1.10). English pages: added definitions (clause, FANBOYS, antecedent, linking verb, modifier), however/therefore semicolon rule, capitalization, "although" removed from the transitions table, doubling rule with stress, an arguable thesis example, an expanded medical word-parts table.
- Objective codes confirmed (2026-11-17) from the ATI TEAS 7 content outline.

## Practice site (built 2026-11-18)
- `scripts/build_data.py` exports Items, Passages, Objectives and Blueprint (Approved only) to `docs/data/bank.json`, from a downloaded .xlsx or from tab dumps pulled through the Sheets connector. `data/build_report.txt` lists anything odd.
- Diagnostic per section: up to 15 items per subarea, 8 minimum. A part stops early only when finishing it would very probably leave its band unchanged (90%). Bands come from the share correct: under 60% *Build the basics*, 60–79% *Getting there*, 80%+ *Strong*. Practice bands, not TEAS predictions. All 34 do-not-pair notes are honored, at most 3 items per passage per form (RP-21 rotates), and unseen items are preferred.
- Options are shuffled per student. Options that differ only in their numbers are sorted ascending. `data/overrides.json` keeps 3 items in Sheet order and relabels bare option letters in 4 English explanations.
- Practice by objective: explanation, the note for the chosen option, and a study-page link. Supply answers are graded by value (spaces, commas and units ignored).
- Study pages are hosted on the site, built from `source/pages/*.md`, which matched all 64 Docs on 2026-11-18. **Edit the .md sources from now on, not the Docs.**
- Progress stays in the browser (download/load/clear). An optional prefilled Google Form is not configured yet.
- Reviews: code audit, student-perspective UX review and re-review in `source/review/site_*.md`.

## Open items for Alex
- Turn on GitHub Pages (Settings › Pages › Deploy from a branch › main, /docs) after merging the site PR.
- Optional: create the results Google Form and fill `docs/assets/config.js` (steps in SITE.md).
- The Docs converter mangles "___" blanks (M.2.3 Doc shows `say " depends on ."`) and nested bold/italic (E.2.1 §5). The website is fine; fix the two Docs if they are still shared anywhere.
- Delete the "Superseded study pages (safe to delete)" folder, the three "zz import temp" sheets, plus these in the Study pages folder: "OLD S.1.1 (no figures, replaced - delete)", "OLD S.1.3 (no figures, replaced - delete)", "zz image import test (delete)", "zz html image test (delete)".
- Fill Programs tab cutoffs (LPN, RN, dental hygiene).
- TEAS Gem link. Choose a license (suggested: CC BY 4.0 for content, MIT for code).
- Unconfirmed: whether the TEAS on-screen calculator has a square-root key (pages tell students to know perfect squares either way).
- For Reading faculty: R.3.2-003, R.3.2-004 and R.3.3-005 explanations say "A"/"B" for Passage A/B, which can be confused with option letters; the four English explanations that name options by letter (E.1.2-004, E.1.2-012, E.2.1-004, E.2.3-009) would read better quoting the option.
- For English faculty: E.2.1 presents singular "they" as acceptable and advises plural rewrites as the safe test choice; check against current ATI materials.

## Next
- Faculty review: English and Reading items and pages (filter Review notes for "faculty review pending").
- QTI export script (mapping in SCHEMA.md), NotebookLM source docs (figure-free, no OpenStax text).
- Calibrate bands against real TEAS scores when available.
- Reviewer suggestion to weigh for Reading pages: TEAS prep materials commonly also cover parts of a book and dictionary guide words, text structures, and figurative language. These aren't separate TEAS 7 objectives; check ATI's current outline before adding them.
- OpenStax pages state their books may not be ingested into generative AI offerings without permission. OpenStax text and figures stay out of the Gem and NotebookLM sources.
