import json, sys, re
# usage: make_rows.py batch.json out.json "review note" [revised_ids_comma]
src, out, note = sys.argv[1], sys.argv[2], sys.argv[3]
revised = set(sys.argv[4].split(',')) if len(sys.argv) > 4 and sys.argv[4] else set()
def cell(v):
    v = str(v)
    if re.match(r'^[-+=0-9./]', v) or re.match(r'^\d', v): return "'" + v
    return v
rows = []
for it in json.load(open(src)):
    opts = it['options'] + [""] * (6 - len(it['options']))
    asset = ""
    if it.get('passage'):
        ids = [x.strip() for x in it['passage'].replace(' and ', ',').split(',')]
        asset = "Passage " + ", ".join(ids)
    rn = note + (" Revised after review; revised version passed re-review." if it['id'] in revised else "")
    if it['section'] in ("English", "Reading"): rn += f" {it['section']} faculty review pending."
    rows.append([it['id'], it['section'], it['subarea'], it['objective'], it['format'], it['stem']] +
                [cell(o) if o else "" for o in opts] +
                [it['answer'], it['explanation'], it['distractors'], it['difficulty'], it['diagnostic'], asset,
                 "Approved", rn, "Claude (draft); reviewed by two independent Claude reviewers", "2026-11-18"])
json.dump(rows, open(out, 'w'), ensure_ascii=False)
print(len(rows), "rows")
