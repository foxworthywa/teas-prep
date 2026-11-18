"""Make Google-Docs-ready HTML (images embedded as data URIs, sized to fit a page) from build/out/web/*.md."""
import base64, io, pathlib, re, markdown
from PIL import Image
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "build" / "out" / "docs_html"; OUT.mkdir(parents=True, exist_ok=True)
MAXW_PT, MAXH_PT = 432, 560
def img_tag(alt, rel):
    src = Image.open(ROOT / rel).convert("RGBA")
    im = Image.new("RGB", src.size, "white")
    im.paste(src, mask=src.split()[3])
    w, h = im.size
    wpt = MAXW_PT; hpt = wpt * h / w
    if hpt > MAXH_PT: wpt = MAXH_PT * w / h; hpt = MAXH_PT
    im.thumbnail((1200, 1200)); b = io.BytesIO(); im.save(b, "JPEG", quality=88)
    data = base64.b64encode(b.getvalue()).decode()
    alt = alt.replace('"', "&quot;")
    return f'<p><img src="data:image/jpeg;base64,{data}" alt="{alt}" style="width:{wpt:.0f}pt;height:{hpt:.0f}pt"></p>'
LIST_RE = re.compile(r"^(\s*)([-*]|\d+\.)\s")
def fix_lists(text):
    """Python-Markdown needs a blank line before a list and 4-space nesting."""
    out = []
    for line in text.split("\n"):
        q = ""
        body = line
        if body.startswith(">"):
            q = ">"; body = body[1:].lstrip(" ") if body[1:2] == " " else body[1:]
        m = LIST_RE.match(body)
        if m:
            ind = len(m.group(1))
            if 0 < ind < 4:
                body = "    " + body.lstrip(" ")
            prev = out[-1] if out else ""
            pb = prev[1:].lstrip(" ") if (q and prev.startswith(">")) else prev
            prev_is_list = bool(LIST_RE.match(pb))
            if pb.strip() and not prev_is_list and (not q or prev.startswith(">")):
                out.append(q)
            line = (q + " " + body) if q else body
        out.append(line)
    text = "\n".join(out)
    # a text line directly above --- would become a setext heading
    return re.sub(r"(?m)^(?!\s*$)(?!\s*\|)(.+)\n(-{3,})\s*$", r"\1\n\n\2", text)
for md in sorted((ROOT / "build" / "out" / "web").glob("*.md")):
    text = md.read_text()
    imgs = {}
    def stash(m):
        k = f"IMGTOKEN{len(imgs)}X"; imgs[k] = img_tag(m.group(1), m.group(2)); return f"\n\n{k}\n\n"
    text = re.sub(r"!\[([^\]]*)\]\((figures/[^)]+)\)", stash, text)
    text = fix_lists(text)
    html = markdown.markdown(text, extensions=["tables"])
    for k, v in imgs.items():
        html = html.replace(f"<p>{k}</p>", v)
    html = ('<html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;font-size:11pt}'
            'table{border-collapse:collapse}td,th{border:1px solid #999;padding:4px}blockquote{background:#F3F6FA}</style></head><body>'
            + html + "</body></html>")
    (OUT / md.name.replace(".md", ".html")).write_text(html)
    print(md.name, len(html)//1024, "KB", len(imgs), "images")
