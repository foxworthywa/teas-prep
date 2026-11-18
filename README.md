# ESCC TEAS Prep

Free, open TEAS 7 preparation for Eastern Shore Community College students and applicants (LPN, RN, dental hygiene, and future programs). No login; works whether or not a student is enrolled.

## Where the content lives

- **Master bank (single source of truth):** Google Sheet "ESCC TEAS Prep: Master Bank." Tabs: Read me, Blueprint, Objectives, Items, Passages, Programs. 482 approved items, 40+ per TEAS 7 subsection; 24 original Reading passages.
- **Study pages:** one Google Doc per TEAS 7 objective (64), linked from the Objectives tab, column J.
- **Status and decisions:** `source/TEAS_PREP_STATUS.md` (also kept as a doc in the Claude project).

## The practice site

The public site lives in `docs/` and is served by GitHub Pages: a diagnostic per section, practice by objective, the 64 study pages, and progress saved in the student's browser. No login.

- **How to update it, settings, and the optional Google Form:** `SITE.md`
- **Item data format and the Canvas QTI mapping:** `SCHEMA.md`
- **Build:** `python3 scripts/build_data.py --xlsx <downloaded Sheet>` then `python3 scripts/build_study_pages.py`
- **Tests:** `node --test tests/core.test.mjs` and `python3 tests/smoke.py`

## What's in `source/`

Working files from the content-building phase (November 2026):

| Folder | Contents |
|---|---|
| `pages/` | Markdown sources for the 64 study pages; `{{FIG id}}` markers place figures |
| `figures/` | Original diagrams (SVG/PNG) and OpenStax figures used on the pages |
| `build/` | `build_pages.py` (web, Docs and figure-free notebook versions) and `build_docs_html.py` (Docs-ready HTML with embedded images); `figures.json` is the figure manifest with credits |
| `bank/` | Item batches as JSON plus the scripts that built them (`build_*.py`, `make_rows.py`); `reading_passages.json` |
| `review/` | Reviewer reports for every batch and page set (blind solves, content audits, re-reviews) |
| `tutor/` | Instructions for the TEAS tutor Gem |
| `sheetfmt/` | Sheet formatting helpers |

Run the page build from `source/build/`: `python3 build_pages.py && python3 build_docs_html.py` (output goes to `source/build/out/`, which is not committed). The .md files in `source/pages/` are now the source for the website's study pages too, so edit them rather than the Google Docs.

The Google Sheet, not these JSON files, is authoritative for items: some items were corrected after loading.

## Licensing

Original content: Eastern Shore Community College (license to be chosen). Figures from OpenStax are CC BY 4.0 and credited per figure; OpenStax text and figures are not used in AI tutor or notebook materials.
