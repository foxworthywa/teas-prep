"""Build three versions of each study page from one source.

Source pages contain lines like {{FIG S.1.2-1}}; figure details live in figures.json.
Outputs (in build/out/):
  web/<page>.md      image + caption + credit (images under figures/)
  docs/<page>.md     a [[FIGURE S.x.y-n]] placeholder paragraph + caption + credit
                     (images are inserted by the Docs API afterwards)
  notebook/<page>.md no figures, captions or figure credits (for NotebookLM and the Gem)
"""
import json, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
FIGS = {f["id"]: f for f in json.load(open(ROOT / "build" / "figures.json"))}
BOOKS = {
    "ap": ("Anatomy and Physiology 2e", "https://openstax.org/books/anatomy-and-physiology-2e/pages/1-introduction"),
    "cob": ("Concepts of Biology", "https://openstax.org/books/concepts-biology/pages/1-introduction"),
}


def credit(f):
    if f["type"] == "openstax":
        name, url = BOOKS[f.get("book", "ap")]
        return (f"*Source: OpenStax, {name}, Figure {f['fig']} "
                f"({f.get('osx_title', f['title'])}), CC BY 4.0. Access for free at {url}*")
    return "*Original diagram, ESCC TEAS Prep.*"


def fig_number(page_text, fid):
    order = re.findall(r"\{\{FIG ([^}]+)\}\}", page_text)
    return order.index(fid) + 1


def render(text, mode):
    def sub(m):
        fid = m.group(1)
        f = FIGS[fid]
        n = fig_number(text, fid)
        cap = f"**Figure {n}. {f['title']}.** {f['caption']}"
        if mode == "notebook":
            return ""
        if mode == "web":
            fname = f"{fid}.png" if f["type"] == "openstax" else f"{f['file']}.png"
            return f"![{f['alt']}](figures/{fname})\n\n{cap}\n{credit(f)}"
        return f"[[FIGURE {fid}]]\n\n{cap}\n{credit(f)}"
    out = re.sub(r"\{\{FIG ([^}]+)\}\}", sub, text)
    if mode == "notebook":
        out = re.sub(r"\n{3,}", "\n\n", out)
        out = re.sub(r" Figures (?:and linked textbook: |from )OpenStax, ([^,]+), licensed CC BY 4\.0\.\*",
                     r" Linked textbook: OpenStax, \1.*", out)
    return out


def main():
    pages = sorted((ROOT / "pages").glob("[A-Z].*.md"))
    for mode in ("web", "docs", "notebook"):
        d = ROOT / "build" / "out" / mode
        d.mkdir(parents=True, exist_ok=True)
        for p in pages:
            (d / p.name).write_text(render(p.read_text(), mode))
    # sanity: notebook versions must contain no figure text or OpenStax figure credits
    for p in (ROOT / "build" / "out" / "notebook").glob("*.md"):
        t = p.read_text()
        assert "{{FIG" not in t and "Figure " not in t and "[[FIGURE" not in t, p
    print(f"built {len(pages)} pages x 3 versions")


if __name__ == "__main__":
    main()
