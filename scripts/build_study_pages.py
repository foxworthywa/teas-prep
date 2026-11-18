#!/usr/bin/env python3
"""Build the study pages for the website from source/pages/*.md.

Output:
  docs/study/<objective>.html   one page per objective (e.g. docs/study/S.1.2.html)
  docs/study/index.html         list of all study pages
  docs/study/figures/*.webp     web-sized figures (flattened onto white)

Needs: pip install markdown pillow
Run from the repo root after build_data.py:  python3 scripts/build_study_pages.py
"""
import html, json, pathlib, re, sys

import markdown
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "source"
OUT = ROOT / "docs" / "study"
sys.path.insert(0, str(SRC / "build"))
from build_pages import render  # noqa: E402  (same figure captions and credits as the Docs)

BANK = json.loads((ROOT / "docs" / "data" / "bank.json").read_text(encoding="utf-8"))
_cfg = (ROOT / "docs" / "assets" / "config.js").read_text(encoding="utf-8")
REVIEW_PENDING = re.findall(r'"([A-Za-z]+)"', re.search(r"reviewPendingSections:\s*\[([^\]]*)\]", _cfg).group(1))
MAX_W = 1400
LIST_RE = re.compile(r"^(\s*)([-*]|\d+\.)\s")


def fix_lists(text):
    """Python-Markdown needs a blank line before a list and 4-space nesting (same as build_docs_html.py)."""
    out = []
    for line in text.split("\n"):
        q, body = "", line
        if body.startswith(">"):
            q = ">"
            body = body[1:].lstrip(" ") if body[1:2] == " " else body[1:]
        m = LIST_RE.match(body)
        if m:
            ind = len(m.group(1))
            if 0 < ind < 4:
                body = "    " + body.lstrip(" ")
            prev = out[-1] if out else ""
            pb = prev[1:].lstrip(" ") if (q and prev.startswith(">")) else prev
            if pb.strip() and not LIST_RE.match(pb) and (not q or prev.startswith(">")):
                out.append(q)
            line = (q + " " + body) if q else body
        out.append(line)
    text = "\n".join(out)
    return re.sub(r"(?m)^(?!\s*$)(?!\s*\|)(.+)\n(-{3,})\s*$", r"\1\n\n\2", text)


def web_figure(rel):
    """Copy a figure as a web-sized WebP, flattened onto white. Returns (file name, w, h)."""
    src_path = SRC / rel
    name = src_path.stem + ".webp"
    dst = OUT / "figures" / name
    im = Image.open(src_path).convert("RGBA")
    flat = Image.new("RGB", im.size, "white")
    flat.paste(im, mask=im.split()[3])
    if flat.width > MAX_W:
        flat = flat.resize((MAX_W, round(flat.height * MAX_W / flat.width)), Image.LANCZOS)
    dst.parent.mkdir(parents=True, exist_ok=True)
    if not dst.exists() or dst.stat().st_mtime < src_path.stat().st_mtime:
        flat.save(dst, "WEBP", quality=86, method=6)
    return name, flat.width, flat.height


def link_label(url):
    host = re.sub(r"^https?://(www\.)?", "", url).split("/")[0]
    return {"openstax.org": "OpenStax"}.get(host, host)


def page_html(code, md_text):
    figs = {}

    def stash(m):
        alt, rel = m.group(1), m.group(2)
        name, w, h = web_figure(pathlib.Path("figures") / pathlib.Path(rel).name)
        k = f"FIGTOKEN{len(figs)}X"
        figs[k] = (f'<a href="figures/{name}" title="Open the full-size figure">'
                   f'<img src="figures/{name}" alt="{html.escape(alt, quote=True)}" '
                   f'width="{w}" height="{h}" loading="lazy"></a>')
        return f"\n\n{k}\n\n"

    text = re.sub(r"!\[([^\]]*)\]\((figures/[^)]+)\)", stash, md_text)
    text = fix_lists(text)
    # fill-in blanks like ___ must not become bold/italic markers
    text = re.sub(r"_{2,}", lambda m: "\\_" * len(m.group(0)), text)
    body = markdown.markdown(text, extensions=["tables", "sane_lists"])
    for k, v in figs.items():
        body = body.replace(f"<p>{k}</p>", f'<figure class="study-fig">{v}<p class="fig-tip">Tap or click the figure to open it full size.</p></figure>')
    # caption + credit paragraphs follow the image: fold them into the figure
    body = re.sub(r'</figure>\s*<p>(<strong>Figure \d+\..*?)</p>',
                  lambda m: f'<figcaption>{m.group(1)}</figcaption></figure>', body, flags=re.S)
    body = body.replace("</figure></figcaption></figure>", "</figcaption></figure>")
    body = re.sub(r'(<figure class="study-fig">.*?)</figure>\s*<figcaption>', r"\1<figcaption>", body, flags=re.S)
    # bare URLs -> short labelled links that open in a new tab
    body = re.sub(r'(?<!["=>])(https?://[^\s<)"]+[^\s<)".,;:])',
                  lambda m: f'<a href="{m.group(1)}" target="_blank" rel="noopener">{link_label(m.group(1))}'
                            f'<span class="ext" aria-hidden="true"> ↗</span><span class="sr-only"> (opens in a new tab)</span></a>',
                  body)
    def wrap(m):
        cols = len(re.findall(r"<th\b", m.group(0).split("</tr>")[0]))
        hint = ('<p class="scroll-hint narrow-only">Swipe the table sideways to see every column. →</p>'
                if cols >= 3 else "")
        return f'{hint}<div class="table-wrap"><table>{m.group(1)}</table></div>'
    body = re.sub(r"<table>(.*?)</table>", wrap, body, flags=re.S)
    return body


def shell(title, inner, depth_prefix="../"):
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)} · ESCC TEAS Prep</title>
<link rel="icon" href="{depth_prefix}favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="{depth_prefix}assets/style.css">
</head>
<body class="study">
<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="wrap">
  <a class="brand" href="{depth_prefix}index.html">ESCC TEAS Prep</a>
  <nav aria-label="Main"><a href="{depth_prefix}index.html#/diagnostic">Diagnostic</a><a href="{depth_prefix}index.html#/practice">Practice</a><a href="{depth_prefix}study/index.html" aria-current="page">Study pages</a><a href="{depth_prefix}index.html#/progress">My progress</a></nav>
</div></header>
<main id="main" class="wrap">
{inner}
</main>
<footer class="site-footer"><div class="wrap">Free TEAS 7 practice from Eastern Shore Community College. Not affiliated with ATI. Figures from OpenStax are CC BY 4.0 and credited where used.</div></footer>
</body>
</html>
"""


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    pages = {p.name.split("_")[0]: p for p in sorted((SRC / "pages").glob("[A-Z].*.md"))}
    built = []
    for code, obj in BANK["objectives"].items():
        p = pages.get(code)
        if not p:
            print(f"WARNING: no study page source for {code}")
            continue
        md_text = render(p.read_text(encoding="utf-8"), "web")
        title = re.search(r"^#\s+(.+)$", md_text, re.M).group(1).strip()
        n = sum(1 for i in BANK["items"] if i["objective"] == code)
        pending = obj["section"] in REVIEW_PENDING
        top = (f'<p class="crumbs"><a href="index.html">Study pages</a> › {html.escape(obj["section"])} › '
               f'{html.escape(obj["subarea"])} {html.escape(obj["subareaName"])}</p>'
               f'<div class="study-actions"><a class="btn" href="../index.html#/practice/{code}">Practice {code} ({n} questions)</a></div>')
        note = ('<p class="notice">This page is awaiting review by ESCC English and Reading faculty.</p>'
                if pending else "")
        body = page_html(code, md_text)
        bottom = (f'<div class="study-actions bottom"><a class="btn" href="../index.html#/practice/{code}">Practice {code} now</a> '
                  f'<a class="btn secondary" href="index.html">All study pages</a></div>')
        (OUT / f"{code}.html").write_text(shell(f"{code} {title}", top + note + f'<article class="study-page">{body}</article>' + bottom),
                                          encoding="utf-8")
        built.append((code, title))

    titles = dict(built)
    parts = ['<h1>Study pages</h1><p class="lead">One short page for each TEAS 7 objective, with figures and quick checks. '
             'Each page ends with links to free OpenStax textbook sections if you want more.</p>']
    for sec in BANK["sections"]:
        parts.append(f'<h2 id="{sec["name"].lower()}">{sec["name"]}</h2>')
        for sub in sec["subareas"]:
            parts.append(f'<h3>{sub["code"]} {html.escape(sub["name"])}</h3><ul class="study-list">')
            for code in sub["objectives"]:
                t = titles.get(code, BANK["objectives"][code]["text"])
                parts.append(f'<li><a href="{code}.html"><span class="code">{code}</span> {html.escape(t)}</a>'
                             f'<span class="obj-text">{html.escape(BANK["objectives"][code]["text"])}</span></li>')
            parts.append("</ul>")
    (OUT / "index.html").write_text(shell("Study pages", "\n".join(parts)), encoding="utf-8")
    json.dump(titles, open(OUT / "titles.json", "w"), ensure_ascii=False, indent=0)
    print(f"built {len(built)} study pages + index; figures in {OUT / 'figures'}")


if __name__ == "__main__":
    main()
