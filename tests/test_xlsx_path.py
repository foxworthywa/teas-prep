#!/usr/bin/env python3
"""Check that building from a downloaded .xlsx gives the same bank as building from the tab dumps.

  python3 tests/test_xlsx_path.py      (needs data/raw/ and openpyxl)

Numbers are written as real numeric cells where they look numeric, as Google Sheets
would export them if a cell were not text-typed, to check the loader keeps their text.
"""
import json, pathlib, re, subprocess, sys, tempfile
import openpyxl

ROOT = pathlib.Path(__file__).resolve().parent.parent
raw = ROOT / "data" / "raw"
if not (raw / "items.json").exists():
    sys.exit("skip: data/raw/ not present")
with tempfile.TemporaryDirectory() as d:
    wb = openpyxl.Workbook()
    wb.remove(wb.active)
    for tab in ["Items", "Passages", "Objectives", "Blueprint"]:
        ws = wb.create_sheet(tab)
        for r in json.load(open(raw / f"{tab.lower()}.json")):
            ws.append([int(c) if re.fullmatch(r"[1-9]\d{0,5}", c or "") else c for c in r])
    x = pathlib.Path(d) / "bank.xlsx"
    wb.save(x)
    a, b = pathlib.Path(d) / "a.json", pathlib.Path(d) / "b.json"
    subprocess.run([sys.executable, ROOT / "scripts/build_data.py", "--out", a], check=True, capture_output=True)
    subprocess.run([sys.executable, ROOT / "scripts/build_data.py", "--xlsx", x, "--out", b], check=True, capture_output=True)
    ja, jb = json.load(open(a)), json.load(open(b))
    ja.pop("built"); jb.pop("built")
    if ja != jb:
        for i, j in zip(ja["items"], jb["items"]):
            if i != j:
                print("first difference:", i["id"], {k: (i.get(k), j.get(k)) for k in i if i.get(k) != j.get(k)})
                break
        sys.exit("FAIL: xlsx build differs from raw build")
    print("xlsx path OK")
