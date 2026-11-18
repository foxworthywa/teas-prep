#!/usr/bin/env python3
"""Export the Master Bank (Google Sheet) to the JSON the practice site reads.

Input  (one of):
  --xlsx FILE   the workbook downloaded from Google Sheets (File > Download > .xlsx)
  --raw DIR     a folder of tab dumps (items.json, passages.json, objectives.json,
                blueprint.json), each a JSON array of rows (row 1 = headers).
                Default: data/raw
Output:
  docs/data/bank.json   items (Approved only), passages, objectives, blueprint
  data/build_report.txt counts and anything that needs a look

The Sheet is the single source of truth. Re-run this after editing the Sheet,
then commit docs/data/bank.json.

Run from the repo root:  python3 scripts/build_data.py [--xlsx FILE]
"""
import argparse, datetime, json, pathlib, re, sys
from collections import Counter
from fractions import Fraction

ROOT = pathlib.Path(__file__).resolve().parent.parent
LETTERS = "ABCDEF"
FORMATS = {
    "Multiple choice": "mc",
    "Select all": "multi",
    "Ordered response": "order",
    "Supply answer": "supply",
}
TABS = ["Items", "Passages", "Objectives", "Blueprint"]
OVERRIDES = ROOT / "data" / "overrides.json"
BARE_LETTER = re.compile(r"(?:^|[.;:]\s+|\b(?:Only|only|In|in|and|or|unlike|Unlike)\s+|,\s+)([A-F])(?=(?:,|\s+and|\s+(?:is|are|has|have|joins|places|uses|each|does|do|can|gives|keeps|makes|shows|says)\b))")
SECTION_ORDER = ["Reading", "Math", "Science", "English"]

report = []


def warn(msg):
    report.append(msg)


# ---------------------------------------------------------------- loading
def load_xlsx(path):
    try:
        import openpyxl
    except ImportError:
        sys.exit("openpyxl is needed for --xlsx:  pip install openpyxl")
    wb = openpyxl.load_workbook(path, data_only=True)
    out = {}

    def text(cell):
        v = cell.value
        if v is None:
            return ""
        if isinstance(v, bool):
            return "TRUE" if v else "FALSE"
        if isinstance(v, (int, float)):
            fmt = cell.number_format or ""
            if "%" in fmt:
                digits = len(fmt.split(".")[1].rstrip("%")) if "." in fmt else 0
                s = f"{v * 100:.{digits}f}%"
            elif float(v).is_integer():
                s = str(int(v))
            else:
                s = repr(float(v))
            if tab == "Items" and cell.column > 5:  # text columns stored as numbers: worth a look
                warn(f"Items {cell.coordinate}: number cell read as {s!r}; format the column as plain text in the Sheet")
            return s
        return str(v)

    for tab in TABS:
        rows = [[text(c) for c in r] for r in wb[tab].iter_rows()]
        while rows and not any(rows[-1]):
            rows.pop()
        out[tab] = rows
    return out


def load_raw(d):
    d = pathlib.Path(d)
    return {tab: json.load(open(d / f"{tab.lower()}.json", encoding="utf-8")) for tab in TABS}


def as_dicts(rows):
    head = [str(h).strip() for h in rows[0]]
    out = []
    for r in rows[1:]:
        if not any(str(c).strip() for c in r):
            continue
        cells = [str(c) for c in r] + [""] * (len(head) - len(r))
        out.append(dict(zip(head, cells)))
    return out


# ---------------------------------------------------------------- parsing helpers
ID_RE = re.compile(r"\b[SMER]\.\d+\.\d+-\d{3}\b")
SEP = r"(?:,\s*and\s+|,\s*or\s+|,\s*|\s+and\s+|\s+or\s+|/)"
LETTER_LIST = r"[A-F](?:" + SEP + r"[A-F])*"
MULTI_LETTER_LIST = r"[A-F](?:" + SEP + r"[A-F])+"
COLON_START = re.compile(r"^(" + LETTER_LIST + r")\s*(?:\(([^)]*)\)\s*)?:\s*(.*)$", re.S)
VERB_START = re.compile(r"^(" + MULTI_LETTER_LIST + r")\s+([a-z].*)$", re.S)


def parse_key(s):
    return re.findall(r"\b[A-F]\b", s.upper())


def parse_notes(text, option_letters):
    """Split 'Distractor notes' into per-option notes and general notes.

    Recognised segment starts: 'A: ...', 'B and D: ...', 'A (pancreas): ...', and
    'A, C and E belong ...' (two or more letters, then a lowercase word).
    Anything else (e.g. 'Common error: ...') is a general note.
    Letters are the Sheet's letters; the site swaps in the letters the student saw.
    """
    by_opt, general = {}, []
    text = text.strip()
    if not text:
        return by_opt, general
    cuts = {0}
    for pat in (r"(?<=[.!?)\"\u201d\u2019'])\s+(?=" + LETTER_LIST + r"\s*(?:\([^)]*\)\s*)?:)",
                r"(?<=[.!?)\"\u201d\u2019'])\s+(?=" + MULTI_LETTER_LIST + r"\s+[a-z])"):
        for m in re.finditer(pat, text):
            cuts.add(m.end())
    cuts = sorted(cuts)
    segs = [text[a:b].strip() for a, b in zip(cuts, cuts[1:] + [len(text)])]
    for seg in segs:
        m, m2 = COLON_START.match(seg), VERB_START.match(seg)
        if m:
            letters, body = re.findall(r"[A-F]", m.group(1)), m.group(3).strip()
            if m.group(2):
                body = f"({m.group(2)}) {body}"
            note = {"text": body}
            if len(letters) > 1:
                note["shared"] = letters
        elif m2:
            letters = re.findall(r"[A-F]", m2.group(1))
            note = {"text": m2.group(2).strip(), "lead": letters}  # site writes 'C and E' + text
        else:
            general.append(seg)
            continue
        for L in letters:
            if L not in option_letters:
                warn(f"note refers to missing option {L}: {seg[:80]}")
            by_opt.setdefault(L, []).append(note)
    return by_opt, general


NUM_TOKEN = re.compile(
    r"^(?P<neg>[−\-–])?(?P<money>\$)?\s*"
    r"(?P<num>\d+\s+\d+/\d+|\d+/\d+|\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?)\s*(?P<unit>.*)$"
)


def numeric_value(opt):
    """(value, notation, unit) if the option is one quantity, else None."""
    m = NUM_TOKEN.match(opt.strip())
    if not m:
        return None
    unit = m.group("unit").strip()
    if re.search(r"[\d;:,+=≤≥<>]", unit) or len(unit) > 20:
        return None  # '2, 1, 2', '0.8 g/mL; it floats', '46 in one cell and 0 ...'
    raw = m.group("num").replace(",", "")
    if " " in raw:
        whole, frac = raw.split()
        val, notation = int(whole) + Fraction(frac), "fraction"
    elif "/" in raw:
        val, notation = Fraction(raw), "fraction"
    else:
        val, notation = Fraction(raw), ("decimal" if "." in raw else "integer")
    if m.group("neg"):
        val = -val
    if m.group("money"):
        notation = "money"
    if unit == "%":
        notation = "percent"
    return val, notation, unit


RANGE_RE = re.compile(r"^(\d+)\s*[–-]\s*\d+\b|^(\d+)\s+and\s+(?:older|over|up)\b|^(?:under|younger than)\s+(\d+)\b", re.I)


QUALIFIER = {"less than": 0, "fewer than": 0, "under": 0, "about": 1, "approximately": 1, "exactly": 1,
             "more than": 2, "over": 2, "greater than": 2}
UNICODE_FRACTIONS = {"½": ".5", "¼": ".25", "¾": ".75", "⅓": ".333", "⅔": ".667"}
NUM_IN_TEXT = re.compile(r"\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?")


MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september",
          "october", "november", "december"]
WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
CAL_RE = re.compile(r"\b(" + "|".join(MONTHS + WEEKDAYS) + r")\b", re.I)


def calendar_numbers(text):
    """'January to April' -> 'Mon#1 to Mon#4' style placeholders, so month/day options sort."""
    def sub(m):
        w = m.group(1).lower()
        return f" CAL{(MONTHS.index(w) + 1) if w in MONTHS else (WEEKDAYS.index(w) + 1)} "
    return CAL_RE.sub(sub, text)


def template_key(text):
    """('template', (numbers...), qualifier rank) for options like 'About 115 bpm',
    'January 9, Run 1 (...)', 'Less than 1 serving', 'Student 3'. None if no number."""
    t = text.strip()
    if re.search(r"\d\s*:\s*\d", t) and not re.search(r"\d:\d\d\s*[ap]\.?m", t):
        return None  # ratios (2:3) have no natural order
    t = calendar_numbers(t)
    for k, v in UNICODE_FRACTIONS.items():
        t = re.sub(r"(\d)" + k, lambda m: m.group(1) + v, t).replace(k, "0" + v)
    q = 1
    low = t.lower()
    for word, rank in QUALIFIER.items():
        if low.startswith(word + " "):
            q, t = rank, t[len(word) + 1:]
            break
    nums = [float(n.replace(",", "")) for n in NUM_IN_TEXT.findall(t)]
    if not nums:
        return None
    tmpl = NUM_IN_TEXT.sub("#", t).lower().replace("cal#", "#")
    tmpl = re.sub(r"\b(\w+?)s\b", r"\1", tmpl)  # serving / servings
    tmpl = re.sub(r"\s+", " ", tmpl).strip(" .")
    return tmpl, tuple(nums), q


ALL_OPTION = re.compile(r"^(all|none|both|neither) of (the above|them|these)\.?$|^all of the above\.?$", re.I)


def natural_order(options):
    """How the site may order the options of a multiple-choice or select-all item.

    sorted:  options that differ only in their numbers ('About 95 bpm', 'January 9',
             'Run 1, leaving at 7:00 a.m.', '$1,152.00', '18-29'), shown ascending
             (ties: 'less than' < 'about' < 'more than'); an 'All of them' option goes last
    fixed:   set by the overrides file only
    shuffle: everything else, shuffled per student
    """
    letters = [L for L, _ in options]
    texts = [t for _, t in options]
    tail = [i for i, t in enumerate(texts) if ALL_OPTION.match(t.strip())]
    body = [i for i in range(len(texts)) if i not in tail]
    if len(tail) > 1 or len(body) < 2:
        return "shuffle", None
    # one quantity per option, same notation and unit
    vals = [numeric_value(texts[i]) for i in body]
    if all(vals):
        notations = {v[1] for v in vals}
        if len(notations - {"integer"}) <= 1 and len({v[2] for v in vals}) == 1:
            order = sorted(body, key=lambda i: vals[body.index(i)][0])
            return "sorted", [letters[i] for i in order + tail]
        return "shuffle", None  # mixed notations (0.09, 1/9, 11%): sorting would hint
    keys = [template_key(texts[i]) for i in body]
    if all(keys) and len({k[0] for k in keys}) == 1 and len({len(k[1]) for k in keys}) == 1:
        order = sorted(body, key=lambda i: (keys[body.index(i)][1], keys[body.index(i)][2]))
        return "sorted", [letters[i] for i in order + tail]
    starts = []
    for i in body:
        m = RANGE_RE.match(texts[i].strip())
        if not m:
            starts = None
            break
        starts.append(int(m.group(1) or m.group(2)) if (m.group(1) or m.group(2)) else int(m.group(3)) - 0.5)
    if starts:
        order = sorted(body, key=lambda i: starts[body.index(i)])
        return "sorted", [letters[i] for i in order + tail]
    if tail:
        return "fixed", None  # keep 'All of them' last; leave the rest as written
    return "shuffle", None


def supply_spec(accepted):
    """Accepted answers come as 'a|b|c'. Keep the list and pull out the numbers."""
    answers = [a.strip() for a in accepted.split("|") if a.strip()]
    nums = []
    if any(re.search(r"\d\s*:\s*\d", a) for a in answers):
        return answers, []  # ratios: grade as text
    for a in answers:
        s = a.replace("−", "-").replace("–", "-")
        s = re.sub(r"^[a-z]\s*=\s*", "", s, flags=re.I)
        fr = re.match(r"^(-?)(?:(\d+)\s+)?(\d+)\s*/\s*(\d+)", s)
        if fr and int(fr.group(4)):
            v = (int(fr.group(2) or 0) + int(fr.group(3)) / int(fr.group(4))) * (-1 if fr.group(1) else 1)
            if v not in nums:
                nums.append(v)
            continue
        m = re.match(r"-?\d{1,3}(?:,\d{3})+(?:\.\d+)?|-?\d+(?:\.\d+)?|-?\.\d+", s)
        if m:
            v = float(m.group(0).replace(",", ""))
            if v not in nums:
                nums.append(v)
    return answers, nums


def parse_blueprint(rows):
    maxper, subareas, sections, mode = 15, [], {}, None
    for r in rows:
        r = [str(c).strip() for c in r] + [""] * 10
        if r[0].startswith("Diagnostic items per subsection"):
            maxper = int(float(r[1] or 15))
        elif r[0] == "Section" and r[1] == "Subarea code":
            mode = "sub"
        elif r[0] == "Section" and r[1] == "Total questions":
            mode = "sec"
        elif mode == "sub" and re.match(r"^[RMSE]\.\d$", r[1]):
            subareas.append({"section": r[0], "code": r[1], "name": r[2], "teasItems": int(float(r[3] or 0))})
        elif mode == "sec" and r[0] in SECTION_ORDER:
            sections[r[0]] = {"questions": int(float(r[1])), "scored": int(float(r[2])), "minutes": int(float(r[4]))}
    return {"maxPerSub": maxper, "subareas": subareas, "sections": sections}


# ---------------------------------------------------------------- build
def build(tabs):
    ov = json.loads(OVERRIDES.read_text(encoding="utf-8")) if OVERRIDES.exists() else {}
    order_ov = ov.get("optionOrder", {})
    letter_ov = set(ov.get("explanationLetters", {}).get("items", []))
    items_raw = as_dicts(tabs["Items"])
    passages_raw = as_dicts(tabs["Passages"])
    objectives_raw = as_dicts(tabs["Objectives"])
    skipped = Counter(r.get("Status", "").strip() or "(blank)" for r in items_raw
                      if r.get("Status", "").strip() != "Approved")

    passages = {}
    for p in passages_raw:
        pid = p["Passage ID"].strip()
        if pid:
            passages[pid] = {
                "id": pid,
                "title": p["Title"].strip(),
                "type": p["Type"].strip(),
                "text": p["Passage text"].replace("\r\n", "\n").strip(),
                "reviewPending": "faculty review pending" in p.get("Notes", "").lower(),
            }

    objectives = {}
    for o in objectives_raw:
        code = o["Objective code"].strip()
        if code:
            objectives[code] = {
                "code": code,
                "section": o["Section"].strip(),
                "subarea": o["Subarea code"].strip(),
                "subareaName": o["Subarea"].strip(),
                "text": o["Objective (wording from the ATI TEAS 7 content outline)"].strip(),
                "studyDoc": o["Study page or OpenStax link"].strip(),
            }

    items, ids = [], set()
    for r in items_raw:
        if r.get("Status", "").strip() != "Approved":
            continue
        iid = r["Item ID"].strip()
        if iid in ids:
            warn(f"duplicate item ID {iid}")
        ids.add(iid)
        fmt = FORMATS.get(r["Format"].strip())
        if not fmt:
            warn(f"{iid}: unknown format {r['Format']!r}; skipped")
            continue
        item = {
            "id": iid,
            "section": r["Section"].strip(),
            "subarea": r["Subarea code"].strip(),
            "objective": r["Objective code"].strip(),
            "format": fmt,
            "stem": r["Question stem"].replace("\r\n", "\n").strip(),
            "difficulty": int(float(r["Difficulty (1-3)"] or 2)),
            "diagnostic": r["Diagnostic pool"].strip().lower() == "yes",
            "explanation": r["Explanation"].strip(),
        }
        asset = r.get("Image or asset", "").strip()
        pids = re.findall(r"\bRP-\d{2}\b", asset)
        if pids:
            item["passages"] = pids  # in the order the item refers to them
            for pid in pids:
                if pid not in passages:
                    warn(f"{iid}: passage {pid} not in Passages tab")
        elif asset:
            item["asset"] = asset
            warn(f"{iid}: non-passage asset {asset!r} (the site does not show other assets yet)")
        if item["objective"] not in objectives:
            warn(f"{iid}: objective {item['objective']} not in Objectives tab")
        if not item["objective"].startswith(item["subarea"] + "."):
            warn(f"{iid}: objective {item['objective']} is not in subarea {item['subarea']}")

        dn = r["Distractor notes"].strip()
        if fmt == "supply":
            answers, nums = supply_spec(r["Correct answer"])
            item["accepted"] = answers
            item["numeric"] = nums
            item["inputMode"] = "number" if nums else "text"
            item["generalNotes"] = [dn] if dn else []
            if not answers:
                warn(f"{iid}: supply item with no accepted answers")
        else:
            opts = [(L, r.get(f"Option {L}", "").strip()) for L in LETTERS if r.get(f"Option {L}", "").strip()]
            letters = [L for L, _ in opts]
            key = parse_key(r["Correct answer"])
            if not key or any(k not in letters for k in key):
                warn(f"{iid}: key {r['Correct answer']!r} does not match options {letters}")
            if fmt == "mc" and len(key) != 1:
                warn(f"{iid}: multiple-choice key should be one letter: {r['Correct answer']!r}")
            if fmt == "order" and sorted(key) != sorted(letters):
                warn(f"{iid}: ordered key must use every option once: {r['Correct answer']!r}")
            item["options"] = [{"id": L, "text": t} for L, t in opts]
            item["key"] = key
            if fmt in ("mc", "multi"):
                mode, order = natural_order(opts)
                if iid in order_ov:
                    mode, order = order_ov[iid], None
                item["optionOrder"] = mode
                if order:
                    item["sortedOrder"] = order
            else:
                item["optionOrder"] = "shuffle"
            by_opt, general = parse_notes(dn, letters)
            item["optionNotes"] = by_opt
            item["generalNotes"] = general
            for g in general:
                if re.match(r"^[A-F][:,)]|^[A-F] (and|or) [A-F]\b", g):
                    warn(f"{iid}: note segment starts with a letter but was not matched: {g[:70]}")
            missing = [L for L in letters if L not in key and L not in by_opt]
            if fmt == "mc" and missing and not general:
                warn(f"{iid}: no distractor note for option(s) {missing}")
        if fmt != "supply":
            if iid in letter_ov:
                item["explanationLetters"] = "bare"  # every standalone A-F is an option letter
            elif re.search(r"\b(?:[Oo]ption|[Cc]hoice)s? [A-F]\b", item["explanation"]):
                item["explanationLetters"] = "option"
            elif BARE_LETTER.search(item["explanation"]) and not item.get("passages"):
                warn(f"{iid}: explanation may name options by bare letter; add it to data/overrides.json "
                     f"explanationLetters if so: {item['explanation'][:80]}")

        notes = r.get("Review notes", "")
        np = re.search(r"Do not place on the same form as (.*?)(?:\.(?:\s|$)|$)", notes)
        if np:
            item["notWith"] = ID_RE.findall(np.group(1))
        if "faculty review pending" in notes.lower():
            item["reviewPending"] = True
        items.append(item)

    by_id = {i["id"]: i for i in items}
    for i in items:
        for other in list(i.get("notWith", [])):
            if other not in by_id:
                warn(f"{i['id']}: do-not-pair target {other} is not an approved item")
                continue
            o = by_id[other]
            if i["id"] not in o.setdefault("notWith", []):
                o["notWith"].append(i["id"])

    listed = {p["Passage ID"].strip(): sorted(x.strip() for x in p.get("Used by items", "").split(",") if x.strip())
              for p in passages_raw}
    for pid, p in passages.items():
        p["items"] = sorted(i["id"] for i in items if pid in i.get("passages", []))
        if listed.get(pid) and listed[pid] != p["items"]:
            warn(f"{pid}: 'Used by items' differs from items that point to it "
                 f"(sheet list only: {sorted(set(listed[pid]) - set(p['items']))}; "
                 f"items only: {sorted(set(p['items']) - set(listed[pid]))})")

    bp = parse_blueprint(tabs["Blueprint"])
    sections = []
    for name in SECTION_ORDER:
        subs = []
        for b in bp["subareas"]:
            if b["section"] != name:
                continue
            subs.append({
                "code": b["code"], "name": b["name"], "teasItems": b["teasItems"],
                "objectives": [c for c, o in objectives.items() if o["subarea"] == b["code"]],
                "itemCount": sum(1 for i in items if i["subarea"] == b["code"]),
            })
        sections.append({"name": name, "subareas": subs, "teas": bp["sections"].get(name)})

    return {
        "version": 1,
        "built": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%MZ"),
        "source": "Google Sheet: ESCC TEAS Prep: Master Bank",
        "diagnosticMaxPerSubarea": bp["maxPerSub"],
        "sections": sections,
        "objectives": objectives,
        "passages": passages,
        "items": items,
    }, skipped


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--xlsx", help="workbook downloaded from Google Sheets")
    ap.add_argument("--raw", default=str(ROOT / "data" / "raw"), help="folder of tab dumps")
    ap.add_argument("--out", default=str(ROOT / "docs" / "data" / "bank.json"))
    a = ap.parse_args()
    tabs = load_xlsx(a.xlsx) if a.xlsx else load_raw(a.raw)
    bank, skipped = build(tabs)
    out = pathlib.Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(bank, ensure_ascii=False, indent=1), encoding="utf-8")

    its = bank["items"]
    lines = [
        f"Built {bank['built']}: {len(its)} approved items, {len(bank['passages'])} passages, "
        f"{len(bank['objectives'])} objectives",
        f"Not included (status): {dict(skipped)}",
        "Items per subarea: " + ", ".join(f"{k} {v}" for k, v in sorted(Counter(i['subarea'] for i in its).items())),
        "Formats: " + str(dict(Counter(i['format'] for i in its))),
        "Option order: " + str(dict(Counter(i.get('optionOrder', 'n/a (supply)') for i in its))),
        f"Items with do-not-pair notes: {sum(1 for i in its if i.get('notWith'))}",
        f"Faculty review pending: {sum(1 for i in its if i.get('reviewPending'))}",
        "", "Check these:",
    ] + (report or ["(nothing)"])
    rp = ROOT / "data" / "build_report.txt"
    rp.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("\n".join(lines))


if __name__ == "__main__":
    main()
