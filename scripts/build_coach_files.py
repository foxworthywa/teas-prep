#!/usr/bin/env python3
"""Build the TEAS Coach (Gemini Gem) knowledge files: one Markdown file per TEAS section.

Each file holds that section's study pages, figure-free (the "notebook" versions from
source/build/build_pages.py), in objective order, each headed by its link on the site.

  cd source/build && python3 build_pages.py && cd ../.. && python3 scripts/build_coach_files.py

Output: coach/knowledge/ESCC_TEAS_<Section>.md  (attach all four to the Gem)
"""
import json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = "https://foxworthywa.github.io/teas-prep/"
NOTEBOOK = ROOT / "source" / "build" / "out" / "notebook"
OUT = ROOT / "coach" / "knowledge"


def main():
    bank = json.loads((ROOT / "docs" / "data" / "bank.json").read_text(encoding="utf-8"))
    pages = {p.name.split("_")[0]: p for p in NOTEBOOK.glob("*.md")}
    OUT.mkdir(parents=True, exist_ok=True)
    for sec in bank["sections"]:
        parts = [
            f"# ESCC TEAS Prep study pages: {sec['name']}",
            "",
            f"These are Eastern Shore Community College's study pages for the {sec['name']} section of the "
            f"ATI TEAS 7, one per TEAS objective. Students read the same pages, with figures, on the practice "
            f"site ({SITE}). Each page starts with its link on the site. Figures are left out of this file.",
        ]
        for sub in sec["subareas"]:
            for code in sub["objectives"]:
                p = pages.get(code)
                if not p:
                    raise SystemExit(f"missing notebook page for {code}; run source/build/build_pages.py first")
                text = p.read_text(encoding="utf-8").strip()
                # demote headings one level so each page sits under the file title
                text = re.sub(r"(?m)^(#{1,5}) ", r"#\1 ", text)
                parts += ["", "---", "", f"Study page on the site: {SITE}study/{code}.html", "", text]
        f = OUT / f"ESCC_TEAS_{sec['name']}.md"
        f.write_text("\n".join(parts) + "\n", encoding="utf-8")
        print(f"{f.relative_to(ROOT)}: {f.stat().st_size // 1024} KB, {sum(len(s['objectives']) for s in sec['subareas'])} pages")


if __name__ == "__main__":
    main()
