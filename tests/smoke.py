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
                page.goto(base + f"#/diagnostic/{sec}/all")
                page.click("#start")
                page.wait_for_selector("#qform")
                n = 0
                breaks = 0
                while (page.locator("#qform").count() or page.locator("#go-on").count()) and n < 80:
                    if page.locator("#go-on").count():
                        breaks += 1
                        if breaks == 1:
                            shot(f"break-{sec}")
                        page.click("#go-on")
                        page.wait_for_selector("#qform")
                        continue
                    if n == 1:
                        shot(f"diag-{sec}")
                    answer_current(page, rnd)
                    before = page.inner_text(".q-head")
                    page.click("#submit")
                    n += 1
                    page.wait_for_function(
                        "b => document.querySelector('table.results') || document.querySelector('#go-on') || (document.querySelector('.q-head') && document.querySelector('.q-head').innerText !== b)",
                        arg=before)
                page.wait_for_selector("table.results")
                assert "results" in page.url, page.url
                print(f"{tag} {sec} diagnostic finished after {n} questions")
                subs = {"Science": 4, "Reading": 3, "Math": 2, "English": 3}[sec]
                if n > subs * 15 or n < subs * 6:
                    errors.append(f"{sec} diagnostic length {n} looks wrong")
                if breaks != subs - 1:
                    errors.append(f"{sec}: {breaks} break screens, expected {subs - 1}")
                page.locator("details.review-item summary").first.click()
                page.wait_for_selector(".review-body .feedback")
                shot(f"results-{sec}")
            # one part only: results show that part, the others offer "Take this part"
            page.goto(base + "#/diagnostic/Science/S.2")
            page.click("#start")
            page.wait_for_selector("#qform")
            assert "S.2" in page.inner_text(".q-head"), page.inner_text(".q-head")
            m = 0
            while page.locator("#qform").count() and m < 20:
                answer_current(page, rnd)
                before = page.inner_text(".q-head")
                page.click("#submit")
                m += 1
                page.wait_for_function("b => document.querySelector('table.results') || (document.querySelector('.q-head') && document.querySelector('.q-head').innerText !== b)", arg=before)
            page.wait_for_selector("table.results")
            assert 8 <= m <= 15, m
            assert page.locator('a[href="#/diagnostic/Science/S.1"]').count() == 1, "untaken part offers to take it"
            shot("results-one-part")
            # whole section: stop at the break, come back to the break, results kept for part 1
            page.goto(base + "#/diagnostic/Math/all")
            page.click("#start")
            page.wait_for_selector("#qform")
            while not page.locator("#go-on").count():
                answer_current(page, rnd)
                before = page.inner_text(".q-head")
                page.click("#submit")
                page.wait_for_function("b => document.querySelector('#go-on') || (document.querySelector('.q-head') && document.querySelector('.q-head').innerText !== b)", arg=before)
            assert "Part 1 of 2 done" in page.inner_text("h1"), page.inner_text("h1")
            page.click("#pause")
            page.wait_for_selector(".notice a[href='#/diagnostic/Math']")
            page.goto(base + "#/progress")
            page.wait_for_selector("table.results")
            assert "(1 of 2 parts)" in page.inner_text("main"), "partial run listed with its finished part"
            page.goto(base + "#/diagnostic/Math")
            page.wait_for_selector("#go-on")
            page.click("#go-on")
            page.wait_for_selector("#qform")
            assert "Part 2 of 2" in page.inner_text(".q-head"), page.inner_text(".q-head")
            # resume: answer two, reload, should resume
            for _ in range(2):
                answer_current(page, rnd)
                before = page.inner_text(".q-head")
                page.click("#submit")
                page.wait_for_function("b => document.querySelector('.q-head') && document.querySelector('.q-head').innerText !== b", arg=before)
            page.reload()
            page.goto(base + "#/diagnostic/Math")
            page.wait_for_selector("#qform")
            assert "Question 3" in page.inner_text(".q-head"), page.inner_text(".q-head")
            # stopping keeps part 1
            page.click("#quit")
            page.click("#confirm-box [data-yes]")
            page.wait_for_selector(".part-list")
            assert page.locator('.part-list a[href="#/diagnostic/Math/M.1"] .band:not(.band-none)').count() == 1, "part 1 kept after stopping"
            page.goto(base + "#/progress")
            page.wait_for_selector("table.results")
            assert "(1 of 2 parts)" in page.inner_text("main"), "stopped run keeps only its finished part"
            # a run saved by the previous version (no parts, no record yet): stopping keeps its finished part
            page.goto(base + "#/diagnostic/Math/all")
            page.click("#start")
            page.wait_for_selector("#qform")
            while not page.locator("#go-on").count():
                answer_current(page, rnd)
                before = page.inner_text(".q-head")
                page.click("#submit")
                page.wait_for_function("b => document.querySelector('#go-on') || (document.querySelector('.q-head') && document.querySelector('.q-head').innerText !== b)", arg=before)
            page.evaluate("""() => { const k = 'escc-teas-prep:v1'; const st = JSON.parse(localStorage.getItem(k));
              const c = st.current; delete c.parts; delete c.breakAfter;
              st.diagnostics = st.diagnostics.filter((d) => d.seed !== c.seed); localStorage.setItem(k, JSON.stringify(st)); }""")
            before_n = page.evaluate("() => JSON.parse(localStorage.getItem('escc-teas-prep:v1')).diagnostics.length")
            page.reload()
            page.goto(base + "#/diagnostic/Math")
            page.wait_for_selector("#qform")
            assert "Part 2 of 2" in page.inner_text(".q-head"), page.inner_text(".q-head")
            page.click("#quit")
            page.click("#confirm-box [data-yes]")
            page.wait_for_selector(".part-list")
            after = page.evaluate("() => JSON.parse(localStorage.getItem('escc-teas-prep:v1')).diagnostics.slice(-1)[0]")
            n_after = page.evaluate("() => JSON.parse(localStorage.getItem('escc-teas-prep:v1')).diagnostics.length")
            assert n_after == before_n + 1 and [r["code"] for r in after["results"]] == ["M.1"], after["results"]
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
            page.wait_for_selector(".section-list")
            assert page.locator(".keep-going").count(), "keep going link after practice"
            shot("practice-menu")
            page.click('.section-btn[href="#/practice/Math"]')
            page.wait_for_selector("details.subarea")
            page.locator("details.subarea summary").first.click()
            shot("practice-section")
            page.locator("details.subarea .obj-link").first.click()
            page.wait_for_selector("#qform")
            page.goto(base + "#/practice/mix/Science")
            page.wait_for_selector("#qform")
            assert "of 10" in page.inner_text(".q-count"), page.inner_text(".q-count")
            for k in range(10):
                answer_current(page, rnd)
                page.click("#submit")
                page.wait_for_selector(".feedback")
                if k == 0:
                    shot("practice-mix")
                page.click("#submit")
                page.wait_for_selector("h1")
            assert page.locator("#again").count(), "end of Quick 10"
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
