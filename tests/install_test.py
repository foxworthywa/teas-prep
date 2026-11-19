#!/usr/bin/env python3
"""Browser test for "Add to home screen" (Phase 1: manifest + icons + guide, no caching).

  python3 tests/install_test.py [--shots DIR]
"""
import argparse, functools, http.server, json, os, pathlib, sys, tempfile, threading

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent / "docs"
IPHONE_UA = ("Mozilla/5.0 (iPhone; CPU iPhone OS 26_1 like Mac OS X) AppleWebKit/605.1.15 "
             "(KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1")
ANDROID_UA = ("Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) "
              "Chrome/142.0.0.0 Mobile Safari/537.36")
INSTAGRAM_UA = IPHONE_UA + " Instagram 350.0.0.0"
STANDALONE = """(() => { const mm = window.matchMedia.bind(window);
  window.matchMedia = (q) => q.includes('display-mode: standalone') ? { matches: true, media: q, addEventListener(){}, removeEventListener(){} } : mm(q); })();"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--shots", default="")
    a = ap.parse_args()
    shots = pathlib.Path(a.shots) if a.shots else None
    if shots:
        shots.mkdir(parents=True, exist_ok=True)

    class Q(http.server.SimpleHTTPRequestHandler):
        extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, ".webmanifest": "application/manifest+json"}

        def log_message(self, *x):
            pass

    # serve the site under /teas-prep/, as GitHub Pages does
    webroot = pathlib.Path(tempfile.mkdtemp())
    os.symlink(ROOT, webroot / "teas-prep")
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Q, directory=str(webroot)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    origin = f"http://127.0.0.1:{srv.server_address[1]}"
    base = origin + "/teas-prep/"
    fails, errors = [], []

    def check(cond, msg):
        if not cond:
            fails.append(msg)
        print(("ok   " if cond else "FAIL ") + msg)

    man = json.loads((ROOT / "manifest.webmanifest").read_text())
    for ic in man["icons"]:
        f = ROOT / ic["src"]
        check(f.exists(), f"icon file {ic['src']} exists")
        if f.exists():
            from PIL import Image
            w, h = Image.open(f).size
            check(f"{w}x{h}" == ic["sizes"], f"icon {ic['src']} is {ic['sizes']}")
    check(man["start_url"] == "./#/practice", "start_url opens Practice")

    with sync_playwright() as p:
        b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])

        # Chrome's own view of the manifest
        ctx = b.new_context()
        pg = ctx.new_page()
        pg.goto(base)
        pg.wait_for_selector("h1")
        cdp = ctx.new_cdp_session(pg)
        m = cdp.send("Page.getAppManifest")
        check(not m.get("errors"), f"Chrome parses the manifest without errors {m.get('errors')}")
        try:
            app = cdp.send("Page.getAppId")
            check(app.get("appId") == origin + "/teas-prep/", f"app id is the /teas-prep/ path, not the shared origin root ({app.get('appId')})")
        except Exception as e:
            print("     (app id check unavailable)", e)
        for path in ["study/S.1.2.html", "study/index.html"]:
            pg.goto(base + path)
            check(pg.locator('link[rel="manifest"]').count() == 1, f"{path} links the manifest")
            r = pg.request.get(base + "study/" + pg.get_attribute('link[rel="manifest"]', "href"))
            check(r.ok, f"{path} manifest link resolves")
        ctx.close()

        def phone(ua, init=None, viewport=(390, 844)):
            c = b.new_context(user_agent=ua, viewport={"width": viewport[0], "height": viewport[1]}, is_mobile=True, has_touch=True)
            if init:
                c.add_init_script(init)
            pg = c.new_page()
            pg.on("pageerror", lambda e: errors.append(str(e)))
            return c, pg

        # iPhone: nudge on home and practice; dialog; dismissal persists
        c, pg = phone(IPHONE_UA)
        pg.goto(base)
        pg.wait_for_selector("h1")
        check(pg.locator(".install-nudge").count() == 1, "iPhone: nudge on home")
        if shots:
            pg.screenshot(path=str(shots / "iphone-home.png"))
        pg.goto(base + "#/practice")
        pg.wait_for_selector(".section-list")
        check(pg.locator(".install-nudge").count() == 1, "iPhone: nudge on Practice")
        pg.click('[data-install="how"]')
        pg.wait_for_selector("dialog.install-dialog[open]")
        txt = pg.inner_text("dialog.install-dialog")
        check("Add to Home Screen" in txt and "Open as Web App" in txt, "iPhone: Safari steps shown")
        check("Copy your progress first" not in txt, "iPhone, no progress yet: no transfer step")
        if shots:
            pg.screenshot(path=str(shots / "iphone-dialog.png"))
        pg.click("dialog [data-close]")
        pg.wait_for_selector(".install-quiet")
        check(pg.locator(".install-nudge").count() == 0, "iPhone: nudge replaced by quiet button after Done")
        pg.reload()
        pg.wait_for_selector(".section-list")
        check(pg.locator(".install-nudge").count() == 0 and pg.locator(".install-quiet").count() == 1, "iPhone: dismissal remembered after reload")
        # with progress, the dialog offers a download first
        pg.goto(base + "#/practice/S.1.3")
        pg.wait_for_selector("#qform")
        if pg.locator('input[name="opt"]').count():
            pg.locator('input[name="opt"]').first.check()
        elif pg.locator("#supply-in").count():
            pg.fill("#supply-in", "1")
        pg.click("#submit")
        pg.wait_for_selector(".feedback")
        pg.goto(base + "#/practice")
        pg.wait_for_selector(".install-quiet")
        pg.click('[data-install="how"]')
        pg.wait_for_selector("dialog.install-dialog[open]")
        t = pg.inner_text("dialog.install-dialog")
        check("Copy your progress first" in t and "Paste my progress" in t, "iPhone with progress: copy is step 1 and paste is the last step")
        c.grant_permissions(["clipboard-read", "clipboard-write"], origin=origin)
        pg.click('dialog [data-install="copy"]')
        check("Copied" in pg.inner_text("dialog .copy-ok"), "iPhone: 'Copy my progress' in the dialog says Copied")
        copied = pg.evaluate("navigator.clipboard.readText()")
        n_attempts = len(json.loads(copied)["attempts"])
        check(n_attempts >= 1, f"clipboard holds the progress ({n_attempts} answers)")
        pg.click("dialog .dlg-foot [data-close]")
        # the installed app has its own empty storage: paste the copied progress there
        c2, app = phone(IPHONE_UA, init=STANDALONE)
        app.goto(base + "#/progress#move")
        app.wait_for_selector("#paste-progress")
        c2.grant_permissions(["clipboard-read", "clipboard-write"], origin=origin)
        app.evaluate("t => navigator.clipboard.writeText(t)", copied)
        app.click("#paste-direct")
        app.wait_for_selector("#io-msg .notice")
        check("Progress loaded" in app.inner_text("#io-msg"), "installed app: one-tap 'Paste my progress' loads")
        app.goto(base + "#/progress#move")
        app.wait_for_selector("#paste-progress")
        app.fill("#paste-progress", copied)
        app.click("#paste-load")
        app.wait_for_selector("#io-msg .notice")
        check("Progress loaded" in app.inner_text("#io-msg"), "installed app: pasted progress loads")
        check(app.evaluate("JSON.parse(localStorage.getItem('escc-teas-prep:v1')).attempts.length") == n_attempts, "installed app: all answers arrived")
        app.fill("#paste-progress", "hello")
        app.click("#paste-load")
        check("doesn't look like TEAS Prep progress" in app.inner_text("#io-msg"), "bad paste gives a clear message")
        # file path still works, with no file-type filter
        check(app.get_attribute("#import", "accept") is None, "file picker has no type filter")
        tmpf = pathlib.Path(tempfile.mkdtemp()) / "progress.json"
        tmpf.write_text(copied)
        app.set_input_files("#import", str(tmpf))
        app.wait_for_selector("#io-msg .notice")
        check("Progress loaded" in app.inner_text("#io-msg"), "installed app: loading from a file still works")
        c2.close()
        # Keep going shortcut
        pg.goto(base + "#/practice/continue")
        pg.wait_for_selector("#qform")
        check(pg.url.endswith("#/practice/S.1.3"), f"shortcut 'Keep going' resumes last practice ({pg.url})")
        c.close()

        # Android
        c, pg = phone(ANDROID_UA)
        pg.goto(base + "#/practice")
        pg.wait_for_selector(".install-nudge")
        pg.click('[data-install="how"]')
        pg.wait_for_selector("dialog.install-dialog[open]")
        t = pg.inner_text("dialog.install-dialog")
        check("⋮" in t and "Add to home screen" in t, "Android: Chrome steps shown")
        if shots:
            pg.screenshot(path=str(shots / "android-dialog.png"))
        pg.goto(base + "#/practice/continue")
        pg.wait_for_selector(".section-list")
        check(pg.url.endswith("#/practice/continue") or "#/practice" in pg.url, "shortcut with no history shows Practice")
        c.close()

        # in-app browser
        c, pg = phone(INSTAGRAM_UA)
        pg.goto(base)
        pg.wait_for_selector(".install-nudge")
        pg.click('[data-install="how"]')
        check("inside another app" in pg.inner_text("dialog.install-dialog"), "in-app browser: open-in-Safari message")
        c.close()

        # already installed (standalone): no install nudge; iPhone app with no progress gets a one-time transfer note
        c, pg = phone(IPHONE_UA, init=STANDALONE)
        pg.goto(base + "#/practice")
        pg.wait_for_selector(".section-list")
        check(pg.locator('[data-install="how"]').count() == 0, "installed app: no install nudge or button")
        check(pg.locator('[data-install="dismiss-transfer"]').count() == 1, "installed iPhone app, empty: 'bring your progress' note")
        pg.click('[data-install="dismiss-transfer"]')
        pg.reload()
        pg.wait_for_selector(".section-list")
        check(pg.locator("[data-install]").count() == 0, "installed iPhone app: note stays dismissed")
        c.close()
        c, pg = phone(ANDROID_UA, init=STANDALONE)
        pg.goto(base + "#/practice")
        pg.wait_for_selector(".section-list")
        check(pg.locator("[data-install]").count() == 0, "installed Android app: nothing shown")
        pg.goto(base + "#/practice/mix/Science")
        pg.wait_for_selector("#qform")
        check("of 10" in pg.inner_text(".q-count"), "shortcut 'Quick 10: Science' works")
        c.close()

        # Android with Chrome's own install prompt: the button uses it, and errors fall back to the steps
        c, pg = phone(ANDROID_UA, init="""window.__prompted = 0;
          window.addEventListener('load', () => setTimeout(() => {
            const e = new Event('beforeinstallprompt', { cancelable: true });
            e.prompt = () => { window.__prompted++; return Promise.resolve(); };
            e.userChoice = Promise.resolve({ outcome: 'accepted' });
            window.dispatchEvent(e);
          }, 50));""")
        pg.goto(base + "#/practice")
        pg.wait_for_selector(".install-nudge")
        pg.wait_for_timeout(200)
        pg.click('[data-install="how"]')
        pg.wait_for_timeout(300)
        check(pg.evaluate("window.__prompted") == 1, "Android: 'Show me how' opens Chrome's own install prompt")
        check(pg.locator("dialog.install-dialog").count() == 0 and pg.locator(".install-nudge").count() == 0, "Android: accepted install hides the nudge")
        c.close()
        c, pg = phone(ANDROID_UA, init="""window.addEventListener('load', () => setTimeout(() => {
            const e = new Event('beforeinstallprompt', { cancelable: true });
            e.prompt = () => Promise.reject(new Error('already used'));
            e.userChoice = new Promise(() => {});
            window.dispatchEvent(e);
          }, 50));""")
        pg.goto(base + "#/practice")
        pg.wait_for_selector(".install-nudge")
        pg.wait_for_timeout(200)
        pg.click('[data-install="how"]')
        pg.wait_for_selector("dialog.install-dialog[open]")
        check(True, "Android: a failed native prompt falls back to the written steps")
        c.close()

        # desktop: nothing shown, and the 'Not now' path on a phone
        c = b.new_context(viewport={"width": 1280, "height": 900})
        pg = c.new_page()
        pg.goto(base)
        pg.wait_for_selector("h1")
        check(pg.locator("[data-install]").count() == 0, "desktop: no nudge or button")
        c.close()
        c, pg = phone(ANDROID_UA)
        pg.goto(base)
        pg.wait_for_selector(".install-nudge")
        pg.click('[data-install="dismiss"]')
        check(pg.locator(".install-nudge").count() == 0 and pg.locator(".install-quiet").count() == 1, "'Not now' leaves a quiet button")
        c.close()
        b.close()
    srv.shutdown()
    if errors:
        print("page errors:", errors)
    if fails or errors:
        sys.exit(1)
    print("install test passed")


if __name__ == "__main__":
    main()
