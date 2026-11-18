#!/usr/bin/env python3
"""Browser smoke test: serves docs/ locally and clicks through the site with headless Chrome.

  python3 tests/smoke.py [--shots DIR]

Fails on any console error or page error. Needs: pip install playwright (uses installed Chrome).
"""
import argparse, functools, http.server, pathlib, random, sys, threading

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent / "docs"


def serve():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    handler = functools.partial(Quiet, directory=str(ROOT))
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, f"http://127.0.0.1:{srv.server_address[1]}/"


def answer_current(page, rnd, right=None):
    """Answer whatever question is on screen. right=True answers from the key via bank."""
    if page.locator("#supply-in").count():
        page.fill("#supply-in", rnd.choice(["12", "2,500 g", "x = 5", "gallbladder"]))
    elif page.locator(".order-list").count():
        btns = page.locator('.order-list button[data-move="1"]:not([disabled])')
        if btns.count():
            btns.first.click()
    elif page.locator('input[type="checkbox"][name="opt"]').count():
        boxes = page.locator('input[type="checkbox"][name="opt"]')
        boxes.nth(rnd.randrange(boxes.count())).check()
    else:
        radios = page.locator('input[type="radio"][name="opt"]')
        radios.nth(rnd.randrange(radios.count())).check()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--shots", default="")
    a = ap.parse_args()
    shots = pathlib.Path(a.shots) if a.shots else None
    if shots:
        shots.mkdir(parents=True, exist_ok=True)
    srv, base = serve()
    errors = []
    rnd = random.Random(7)
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        for vw in ({"width": 1280, "height": 900}, {"width": 390, "height": 844}):
            ctx = browser.new_context(viewport=vw)
            page = ctx.new_page()
            page.on("console", lambda m: m.type == "error" and errors.append(f"console: {m.text} {m.location.get('url','')}"))
            page.on("response", lambda r: r.status >= 400 and errors.append(f"{r.status} {r.url}"))
            page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
            tag = "desk" if vw["width"] > 800 else "mob"

            def shot(name):
                if shots:
                    page.screenshot(path=str(shots / f"{tag}-{name}.png"), full_page=True)

            page.goto(base)
            page.wait_for_selector("h1")
            shot("home")
            # diagnostics: run every section to the end with random answers
            for sec in (["Science", "Reading", "Math", "English"] if tag == "desk" else ["Reading"]):
                page.goto(base + f"#/diagnostic/{sec}")
                page.click("#start")
                n = 0
                while page.locator("#qform").count() and n < 80:
                    if n == 1:
                        shot(f"diag-{sec}")
                    answer_current(page, rnd)
                    before = page.inner_text(".q-head")
                    page.click("#submit")
                    n += 1
                    page.wait_for_function(
                        "b => document.querySelector('table.results') || (document.querySelector('.q-head') && document.querySelector('.q-head').innerText !== b)",
                        arg=before)
                page.wait_for_selector("table.results")
                assert "results" in page.url, page.url
                print(f"{tag} {sec} diagnostic finished after {n} questions")
                subs = {"Science": 4, "Reading": 3, "Math": 2, "English": 3}[sec]
                if n > subs * 15 or n < subs * 6:
                    errors.append(f"{sec} diagnostic length {n} looks wrong")
                page.locator("details.review-item summary").first.click()
                page.wait_for_selector(".review-body .feedback")
                shot(f"results-{sec}")
            # resume: start one, answer two, reload, should resume
            page.goto(base + "#/diagnostic/Math")
            page.click("#start")
            for _ in range(2):
                answer_current(page, rnd)
                page.click("#submit")
            page.reload()
            page.goto(base + "#/diagnostic/Math")
            page.wait_for_selector("#qform")
            assert "Question 3" in page.inner_text(".q-head"), page.inner_text(".q-head")
            # practice: one objective per format
            for obj in ["S.1.2", "S.1.1", "M.1.4", "R.3.4", "E.1.1"]:
                page.goto(base + f"#/practice/{obj}")
                page.wait_for_selector("#qform")
                for k in range(3):
                    answer_current(page, rnd)
                    page.click("#submit")
                    page.wait_for_selector(".feedback")
                    if k == 0:
                        shot(f"practice-{obj}")
                    fb = page.inner_text(".feedback")
                    assert "Explanation" in fb and "Study page" in fb, fb
                    page.click("#submit")
                    page.wait_for_selector("h1")
            page.goto(base + "#/practice")
            page.wait_for_selector(".obj-list")
            shot("practice-menu")
            page.goto(base + "#/practice/weak/Science")
            page.wait_for_selector("h1")
            shot("weak")
            page.goto(base + "#/progress")
            page.wait_for_selector("h1")
            shot("progress")
            page.goto(base + "study/S.1.2.html")
            page.wait_for_selector("figure img")
            shot("study")
            imgs = page.eval_on_selector_all("img", "els => els.map(e => [e.src, e.naturalWidth])")
            page.wait_for_timeout(300)
            page.goto(base + "study/index.html")
            shot("study-index")
            ctx.close()
        # every study page loads with its images
        ctx = browser.new_context()
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
        bad = []
        page.on("response", lambda r: r.status >= 400 and bad.append(f"{r.status} {r.url}"))
        for f in sorted(ROOT.glob("study/*.html")):
            page.goto(base + f"study/{f.name}")
            page.evaluate("Promise.all([...document.images].map(i => (i.loading='eager', i.decode().catch(()=>{}))))")
        errors += bad
        browser.close()
    srv.shutdown()
    if errors:
        print("\n".join(sorted(set(errors))))
        sys.exit(1)
    print("smoke test passed")


if __name__ == "__main__":
    main()
