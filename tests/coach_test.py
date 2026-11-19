#!/usr/bin/env python3
"""Browser test for "Ask the TEAS Coach": copy + open, and both fallbacks.

  python3 tests/coach_test.py [--shots DIR]

Serves a temporary copy of docs/ whose config points the Coach at a local stand-in page.
"""
import argparse, functools, http.server, json, pathlib, re, shutil, sys, tempfile, threading

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent / "docs"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--shots", default="")
    a = ap.parse_args()
    shots = pathlib.Path(a.shots) if a.shots else None
    if shots:
        shots.mkdir(parents=True, exist_ok=True)
    tmp = pathlib.Path(tempfile.mkdtemp())
    site = tmp / "docs"
    shutil.copytree(ROOT, site)
    (site / "coach-standin.html").write_text("<!doctype html><title>Coach stand-in</title><h1>Coach</h1>")
    cfg = site / "assets" / "config.js"
    cfg.write_text(re.sub(r'(coach: \{\s*url: )""', r'\1"COACH_URL"', cfg.read_text()))

    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *x):
            pass

    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Q, directory=str(site)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{srv.server_address[1]}/"
    cfg.write_text(cfg.read_text().replace("COACH_URL", base + "coach-standin.html"))
    bank = json.loads((site / "data" / "bank.json").read_text())
    fails, errors = [], []

    def check(cond, msg):
        if not cond:
            fails.append(msg)
        print(("ok   " if cond else "FAIL ") + msg)

    with sync_playwright() as p:
        b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        for mode in ("normal", "async-fallback", "manual-fallback"):
            ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
            ctx.grant_permissions(["clipboard-read", "clipboard-write"], origin=base.rstrip("/"))
            pg = ctx.new_page()
            pg.on("pageerror", lambda e: errors.append(str(e)))
            if mode != "normal":
                pg.add_init_script("document.execCommand = () => false;")
            if mode == "manual-fallback":
                pg.add_init_script("navigator.clipboard.writeText = () => Promise.reject(new Error('blocked'));")
            # practice a Reading objective so passages are included; answer wrong on purpose
            pg.goto(base + "#/practice/R.3.4")
            pg.wait_for_selector("#qform")
            qid = pg.inner_text(".qid").replace("Question ID ", "").strip()
            item = next(i for i in bank["items"] if i["id"] == qid)
            # answer wrong on purpose, using the key
            if item["format"] in ("mc", "multi"):
                wrong = next(o["id"] for o in item["options"] if o["id"] not in item["key"])
                pg.locator(f'input[name="opt"][value="{wrong}"]').check()
            elif item["format"] == "supply":
                pg.fill("#supply-in", "zzz")
            pg.click("#submit")
            pg.wait_for_selector(".feedback")
            if item["format"] == "order" and "Correct" == pg.inner_text(".verdict").strip():
                print("skip: ordered item happened to start correct")
            btn = pg.locator("button[data-coach]")
            check(btn.count() == 1, f"[{mode}] one coach button on {qid}")
            if mode == "normal":
                with ctx.expect_page(timeout=5000) as newp:
                    btn.click()
                opened = newp.value
                opened.wait_for_load_state()
                check("coach-standin" in opened.url, f"[{mode}] Coach opened in a new tab")
                pg.bring_to_front()
            else:
                btn.click()
            pg.wait_for_selector(".coach-panel:not(:empty)")
            panel = pg.inner_text(".coach-panel")
            if mode == "manual-fallback":
                check("didn't let the site copy" in panel, f"[{mode}] manual instructions shown")
                txt = pg.input_value(".coach-manual")
            else:
                check(panel.startswith("Copied."), f"[{mode}] panel says Copied")
                txt = pg.evaluate("navigator.clipboard.readText()")
            check(txt.startswith("[From ESCC TEAS Practice]") and f"Question ID: {qid}" in txt,
                  f"[{mode}] clipboard/text holds the handoff for {qid}")
            for pid in item.get("passages", []):
                check(bank["passages"][pid]["text"][:80] in txt, f"[{mode}] passage {pid} included")
            check("Correct answer:" in txt and "My answer:" in txt, f"[{mode}] answers included")
            if mode != "manual-fallback":
                check(pg.locator(".coach-panel .coach-again").count() == 1, f"[{mode}] Copy again button")
                check(pg.locator(".coach-panel .coach-help").count() == 1, f"[{mode}] Trouble? help")
            check(pg.evaluate("document.activeElement && document.activeElement.matches('button[data-coach]')"), f"[{mode}] focus stays on the Coach button")
            if mode != "normal":
                check(pg.locator(".coach-panel a.btn").count() == 1, f"[{mode}] Open the Coach link shown")
            if shots:
                pg.locator(".coach").scroll_into_view_if_needed()
                pg.screenshot(path=str(shots / f"coach-{mode}.png"))
            ctx.close()

        # correct answer -> 'I guessed' link; diagnostic review also offers the Coach
        ctx = b.new_context(viewport={"width": 1280, "height": 900})
        ctx.grant_permissions(["clipboard-read", "clipboard-write"], origin=base.rstrip("/"))
        pg = ctx.new_page()
        pg.on("pageerror", lambda e: errors.append(str(e)))
        pg.goto(base + "#/practice/S.1.3")
        for _ in range(6):
            pg.wait_for_selector("#qform")
            qid = pg.inner_text(".qid").replace("Question ID ", "").strip()
            item = next(i for i in bank["items"] if i["id"] == qid)
            if item["format"] == "mc":
                break
            pg.locator('input[name="opt"]').first.check() if pg.locator('input[name="opt"]').count() else None
            pg.click("#submit"); pg.wait_for_selector(".feedback"); pg.click("#submit")
        check(item["format"] == "mc", "found a multiple-choice item for the guessed test")
        pg.locator(f'input[value="{item["key"][0]}"]').check()
        pg.click("#submit")
        pg.wait_for_selector(".feedback")
        g = pg.locator('button[data-kind="guessed"]')
        check(g.count() == 1, "correct answer offers 'I guessed' Coach link")
        with ctx.expect_page():
            g.click()
        txt = pg.evaluate("navigator.clipboard.readText()")
        check("(correct, but I guessed)" in txt and "Correct answer:" in txt and "About " not in txt, "guessed handoff text")
        pg.goto(base + "#/diagnostic/Math")
        pg.click("#start")
        while pg.locator("#qform").count():
            before = pg.inner_text(".q-head")
            if pg.locator("#supply-in").count():
                pg.fill("#supply-in", "7")
            elif pg.locator('input[name="opt"]').count():
                pg.locator('input[name="opt"]').first.check()
            pg.click("#submit")
            pg.wait_for_function("b => document.querySelector('table.results') || (document.querySelector('.q-head') && document.querySelector('.q-head').innerText !== b)", arg=before)
        pg.locator("details.review-item summary").first.click()
        pg.wait_for_selector(".review-body .feedback")
        check(pg.locator(".review-body button[data-coach]").count() == 1, "diagnostic review offers the Coach")
        ctx.close()

        # with no Coach URL configured, no buttons appear
        cfg.write_text(re.sub(r'(coach: \{\s*url: )"[^"]*"', r'\1""', cfg.read_text()))
        ctx = b.new_context()
        pg = ctx.new_page()
        pg.goto(base + "#/practice/S.1.2")
        pg.wait_for_selector("#qform")
        if pg.locator('input[name="opt"]').count():
            pg.locator('input[name="opt"]').first.check()
        pg.click("#submit")
        pg.wait_for_selector(".feedback")
        check(pg.locator("button[data-coach]").count() == 0, "no Coach button when url is empty")
        b.close()
    srv.shutdown()
    shutil.rmtree(tmp, ignore_errors=True)
    if errors:
        print("page errors:", errors)
    if fails or errors:
        sys.exit(1)
    print("coach test passed")


if __name__ == "__main__":
    main()
