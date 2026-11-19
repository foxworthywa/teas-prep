# Review: "Phase 1: add to home screen"

Reviewer: independent review of the uncommitted work (`git diff` plus `docs/manifest.webmanifest`, `docs/icons/*`, `scripts/make_icons.py`, `tests/install_test.py`). Date: 2026-11-19. Nothing in the repo was changed. Scratch files are in `/tmp/rv`.

**Bottom line:** the work is careful, and it does not break anything that works today. All four test suites pass, and rebuilding the study pages reproduces the committed HTML byte for byte. There is one thing to fix before publishing: the manifest `id` resolves to the shared origin root, not to `/teas-prep/`, and Chrome treats `id` as permanent once someone installs the app. Two assumptions behind the design are now out of date, and both change how Phase 1 behaves on real phones:

- Chrome no longer needs a service worker before it offers install. On Android Chrome, the native install prompt is already live.
- On iPhone, a few in-scope pages (a bare figure image, a download preview) have no app chrome. Students need a way back from them.

---

## Blocker

### B1. Manifest `id` resolves to `https://foxworthywa.github.io/`, the shared origin root
- **Where:** `docs/manifest.webmanifest:2` (`"id": "./"`)
- **Why:** the spec resolves `id` against the *origin* of `start_url`, not against the manifest URL the way `scope`, `start_url` and `shortcuts` are resolved. I served the site under `/teas-prep/` exactly as GitHub Pages does (`/tmp/rv/appid.py`) and asked Chrome 153 directly. `Page.getAppId` returned `appId: "http://localhost:…/"` and `recommendedId: "/teas-prep/"`, for both `index.html` and the study pages.
- **Scenario:** a student installs on Android, and Chrome records the app's identity as the whole `foxworthywa.github.io` origin. If any other Pages project on this origin ever ships a manifest whose id also resolves to the root, Chrome treats the two as one app. Fixing it later is costly: once the `id` changes, Chrome treats the new manifest as a different app. Existing installs stop getting manifest updates and the site shows as installable again, so students end up with duplicate icons.
- **Fix:** `"id": "/teas-prep/"`. I checked this in a copy of the repo, and Chrome then reports `appId …/teas-prep/`. Add an assertion to `tests/install_test.py` that serves `docs/` under `/teas-prep/` (the current test serves it at `/`, which is why it couldn't catch this) and checks `Page.getAppId().appId.endswith("/teas-prep/")`. The test harness pattern is in `/tmp/rv/appid.py`.

---

## Should fix

### S1. The Android install prompt is already live. The code comment says it won't fire until Phase 2
- **Where:** `docs/assets/app.js:415-430` (comment and `beforeinstallprompt` listener), `:476-482` (`showInstallDialog` prompt branch), `:430` (`appinstalled`).
- **Facts:** Chrome dropped the service-worker (fetch handler) requirement for install: [Chrome 108 on mobile, 112 on desktop](https://developer.chrome.com/blog/update-install-criteria). Current [install criteria](https://web.dev/articles/install-criteria) are a manifest, icons, HTTPS and engagement (one tap plus 30 seconds on the site), after which Chrome fires `beforeinstallprompt`. I confirmed this in the sandbox. With the site served under `/teas-prep/`, Chrome reported **no** installability errors and fired `beforeinstallprompt` with no service worker (`/tmp/rv/bip.py`). Tapping "Show me how" called `prompt()`, and no steps dialog opened. Chrome then **re-fired** `beforeinstallprompt` after the prompt closed. So every later tap also goes to the native prompt, and an Android Chrome user who has been on the site 30 seconds never sees the written steps.
- **Scenario:** this is mostly fine, because a native "Install" sheet is the best experience. But it is untested on a real phone, and three rough edges follow from it:
  - (a) If the user accepts, the nudge stays on screen in the browser tab, because only state is saved. Tapping it again later shows manual steps for an app that is already installed.
  - (b) `appinstalled` doesn't set `installNudgeDismissed`.
  - (c) `p.prompt()` has no `.catch`, so an unhandled rejection is possible.
- **Fix:** correct the comment. On `userChoice` accepted **and** on `appinstalled`, set dismissed and replace `.install-nudge`/`.install-quiet` with `installSlot()`. Add `p.prompt()?.catch?.(() => {})`. Optionally keep the written steps reachable, for example by showing the dialog when `userChoice` is `dismissed`, so a student who backs out by mistake can see what to do. Test on a real Android phone (see the checklist).

### S2. On an installed iPhone app, tapping a study-page figure opens a bare image with no way back
- **Where:** `scripts/build_study_pages.py:83` (`<a href="figures/{name}" title="Open the full-size figure">`). This affects 19 study pages, and each one tells the student to "Tap or click the figure to open it full size."
- **Scenario:** the `.webp` file is inside the app's scope, so in an installed iOS app it opens in the app window: just the image, with no header, no Back button and no address bar. Reports differ on whether an edge swipe gets the student back. [XenForo's iOS PWA thread](https://xenforo.com/community/threads/ios-pwa-no-way-to-go-back-when-viewing-image-alone-like-avatar.215535) says a swipe from the very left edge works. [WebKit bug 236943](https://bugs.webkit.org/show_bug.cgi?id=236943) reports that "even the swipe back gesture doesn't work" on a similar non-HTML screen. A weak reader is unlikely to find an edge gesture either way, and closing and reopening the app is the fallback. Android has a system Back, so it is fine there.
- **Fix:** add `target="_blank" rel="noopener"` to the figure links in `build_study_pages.py` and rebuild. iOS home-screen apps open new-window links in an in-app browser that has a Done button ([WebKit bug 247270](https://bugs.webkit.org/show_bug.cgi?id=247270) describes that in-app view). In a normal browser the only change is that the figure opens in a new tab. An alternative is a tiny HTML wrapper page for each figure with a "Back to the study page" link. Check on an iPhone first: if the edge swipe works reliably, this drops to Nice to have.

### S3. iPhone progress transfer: wrong order, missing location, and no safety net in the app
- **Where:** `docs/assets/app.js:457-467` (iOS steps and the "Keep your progress" box). Also `viewProgress` import (`:898-915`).
- **Facts:** the separate storage is real and intentional. WebKit says "Home Screen apps are created as isolated entities without shared state with the browser" ([bug 181849](https://bugs.webkit.org/show_bug.cgi?id=181849)). [firt.dev](https://firt.dev/notes/pwa-ios/) lists storage as not shared, with only login cookies copied since iOS 17.2. This app uses `localStorage`, so its data does not carry over.
- **Scenario:**
  - (a) The box says "Before you add it", but it comes **after** steps 1–3. A student who reads top to bottom adds the app first and finds the box afterwards. On an iPhone SE-size screen (375×667) the box is mostly below the fold, and the Done button is out of view too (dialog scrollHeight 811 vs clientHeight 627). The Safari copy is still there, so nothing is lost, but this is exactly the "where did my progress go?" moment the feature is meant to prevent.
  - (b) It doesn't say where the file goes, so a student loading it in the app may not find it.
  - (c) A student who installed without moving their progress opens the app to empty progress with no hint about why.
- **Fix:**
  - (a) When `hasProgress`, make the download **step 1**: "1. Save your progress: [Download my progress]. 2. In Safari, tap •••…"
  - (b) Add: "It's saved in the **Files** app, in **Downloads**."
  - (c) In the installed iOS app (`isIOS() && isStandalone()`), when there are no attempts and no diagnostics, show a one-line notice on Practice and My progress: "Used TEAS Prep in Safari before? Your progress there didn't come with you. In Safari, open My progress → Download my progress, then come back here and tap Load progress from a file."

### S4. "Download my progress" inside the installed iPhone app may show a preview or trap the student
- **Where:** `docs/assets/app.js:432-439` (`downloadProgress`, used by My progress at `:898`).
- **Facts:** [WebKit bug 275288](https://bugs.webkit.org/show_bug.cgi?id=275288) (iOS 17): a blob download that works in Safari "no longer works at all" once the site is on the Home Screen. A file preview opens instead, and the student has to tap inside it to save. [WebKit bug 236943](https://bugs.webkit.org/show_bug.cgi?id=236943) (iOS 15): a download screen in a home-screen app had no way back. Apple closed both as being outside WebKit.
- **Scenario:** this code is not new, but Phase 1 makes it newly reachable. A student in the installed app taps Download my progress (for example, to move to a new phone) and gets a JSON preview, or a screen they can't leave.
- **Fix:** check it on an iPhone running iOS 26 (see the checklist). If it's bad, then in iOS standalone mode use `navigator.share({ files: [new File([json], name, { type: "application/json" })] })` when `navigator.canShare?.({files})` is true. That opens the share sheet, which includes "Save to Files". Fall back to the current download.

### S5. iPhone students reading inside another app's mini-Safari will see steps that don't match
- **Where:** `docs/assets/app.js:427` (`isInApp`) and `:453-455`.
- **Scenario:** apps that open links in Apple's in-app Safari view send the same user agent as Safari, so `isInApp()` can't detect them. Mail and course apps often do this, and I haven't verified how the Canvas app opens links. That view has no ••• menu and no "Add to Home Screen". The student follows step 1 and is stuck.
- **Fix:** one line under the iOS steps: "Don't see these buttons? You may be inside another app. Tap the **Safari** (compass) button or **Open in Safari** first." This is cheap, and it covers a likely way students arrive from course links.

---

## Nice to have

- **N1. Android wording** (`app.js:468-473`). Chrome Android can now put the address bar at the bottom, which moves ⋮ to the bottom right. Chrome's own path is **More → Add to home screen → Install app**, and that menu also offers **Create shortcut** ([Chrome blog](https://developer.chrome.com/blog/how_chrome_helps_users_install_the_apps_they_value)). A shortcut opens in a browser tab, not as an app. Suggested text: "1. Tap ⋮ (top right or bottom right). 2. Tap **Add to home screen**. 3. If it asks, choose **Install** (not Create shortcut), then tap **Install**." The Samsung Internet line hasn't been checked against a current Samsung phone (see the checklist).
- **N2. iOS wording** (`app.js:459`). Step 1 mixes Safari and Chrome in one long sentence. Detect `/CriOS/` and show only the Chrome steps: "Tap the Share button in the address bar (at the top, or the bottom if you moved it)". Describe the Share icon in words ("a square with an arrow pointing up"); the `⬆︎` glyph doesn't look like it. "At the bottom of the screen" is wrong on iPad, which `isIOS()` includes, because the buttons are at the top there. The ••• → Share → scroll → Add to Home Screen → Open as Web App → Add sequence matches published iOS 26 guides ([MacRumors](https://www.macrumors.com/how-to/save-safari-bookmark-web-app-iphone-home-screen/), [iThinkDifferent](https://www.ithinkdiff.com/add-web-app-bookmark-iphone-home-screen-ios-26/)). The Bottom and Top tab layouts show Share directly ([Glide community](https://community.glideapps.com/t/ios-26-add-to-home-screen-workflow-change/84599)), which the "(or the Share button, if you see it)" clause covers.
- **N3. Long dialog on small phones.** Done is below the fold on a 375×667 screen. Either add a close button at the top or make the `.btn-row` sticky inside the dialog.
- **N4. Focus.** "Not now" (`app.js:508-512`) and the dialog's close (`:494-500`) both remove the element that had focus, so keyboard and screen-reader focus drops to `<body>`. Move focus to the new quiet button.
- **N5. Opening on Practice hides an unfinished diagnostic.** The app now opens at `#/practice`, but only Home shows "You have a diagnostic in progress". The Diagnostic tab does show "Resume". Add the same one-line notice to `viewPracticeMenu`.
- **N6. `isStandalone`** (`app.js:423-425`). Also match `(display-mode: fullscreen)` and `(display-mode: minimal-ui)`, so no browser that falls back to those modes shows the nudge inside the installed app.
- **N7. Shortcut icons** (`manifest:20-23`). These use the "any" icon, and Android puts non-maskable shortcut icons inside a white circle. Use `icons/icon-maskable-192.png` with `"purpose": "maskable"`.
- **N8. Coach in the installed app** (`app.js:366`, `:400`). The copy text "should be open in a new tab" is slightly off: in an installed iOS app it opens in an in-app browser sheet, and on Android in a Chrome Custom Tab. More important is whether students stay signed in to Gemini there. iOS's in-app view may not share Safari's Google sign-in. Check on a phone before relying on the Coach from the installed app.
- **N9. Landscape notch** (pre-existing). `index.html` already used `viewport-fit=cover`, but only top and bottom insets are padded. In landscape on notched iPhones, content can sit under the camera housing. Use `.wrap { padding-left: max(18px, env(safe-area-inset-left)); padding-right: max(18px, env(safe-area-inset-right)); }`.
- **N10. Import keeps less than the download contains.** Import merges only attempts and diagnostics. During the iPhone transfer, also take `lastPractice` ("Keep going") and an unfinished `current` diagnostic when the destination has none. Otherwise the dialog could say "Finish any diagnostic you've started before you move."
- **N11. Tests.** Serve under `/teas-prep/` (see B1). Add a persistent-context check that the `beforeinstallprompt` path runs without errors and that the nudge is replaced afterwards (S1). Add a shortcut-route check for `#/practice/mix/Science`.
- **N12. Small items.** "Clear all my progress" also resets the nudge dismissal, which is harmless. The `theme-color` meta now turns Android Chrome's address bar navy for every Android visitor, installed or not; this is intended and looks right. iOS 26 Safari [no longer uses `theme-color`](https://benfrain.com/ios26-safari-theme-color-tab-tinting-with-fixed-position-elements/) to tint its bars, which is harmless.

---

## For Phase 2 (network-first service worker with an off switch)

1. **Fix the `id` now (B1).** It is the one Phase 1 decision that can't be changed cheaply later.
2. **Scope the worker to `/teas-prep/`.** Put it at `docs/sw.js` and register it with `navigator.serviceWorker.register("sw.js")` so its scope is `/teas-prep/`. GitHub Pages can't send `Service-Worker-Allowed`, so no project site can claim a root scope. But if a `foxworthywa.github.io` user-site repo is ever created and registers `/sw.js`, its worker would control `/teas-prep/` too. Root currently returns 404, so this is not a risk today.
3. **Remember the shared origin.** Cache Storage and `localStorage` are shared with every Pages site on `foxworthywa.github.io`. Prefix cache names (`teas-prep-…`), and have `activate` delete only caches with that prefix. If another site there calls `localStorage.clear()`, it would wipe TEAS progress. That is a pre-existing risk; the key is already namespaced.
4. **Build the off switch with two parts.** (a) A `config.js` flag. When it is off, the page unregisters only registrations whose `scope === new URL("./", location).href`, never other sites' registrations. (b) Keep the `sw.js` URL fixed forever, so a "kill" version can be shipped that deletes its own caches, calls `self.registration.unregister()`, and reloads its clients. GitHub Pages sends `max-age=600`, but browsers check the worker script itself against the network by default, so a kill version takes effect on the next visit.
5. **Cache both `./` and `./index.html`.** Study pages link to `../index.html#/…`, and `start_url` is `./#/practice`, so treat them as one page. `data/bank.json` is already fetched with `cache: "no-cache"`, which fits network-first.
6. **Nothing in Phase 1 makes Phase 2 harder.** The nudge copy promises no offline use, which is correct. Since Chrome already treats the site as installable (S1), adding the worker won't change how install works on Android.
7. **On iPhone, the installed app gets its own worker and caches,** separate from Safari's, just as it has its own `localStorage`.

---

## Verified

- **Tests.** `node --test tests/core.test.mjs` passes 16 of 16. `python3 tests/install_test.py`, `python3 tests/smoke.py` and `python3 tests/coach_test.py` all pass (headless Chrome 153).
- **Study pages.** Running `scripts/build_study_pages.py` in a copy of the repo reproduces every committed `docs/study/*.html` exactly, so the four added head lines come from the build script and won't be lost on rebuild.
- **Manifest parsing and URLs.** Chrome parses the manifest with no errors. Served under `/teas-prep/`: `scope` and `start_url` resolve to `/teas-prep/` and `/teas-prep/#/practice`, the shortcuts resolve inside the scope, and the study pages' `../manifest.webmanifest` link resolves. iOS uses the manifest `start_url` even when the student adds the site from a deeper page (as in [this GitLab report](https://gitlab.com/gitlab-org/gitlab/-/issues/427560)), so the icon opens Practice. iOS ignores shortcuts and maskable icons, and a present `apple-touch-icon` overrides the manifest icons there ([firt.dev](https://firt.dev/notes/pwa-ios/)). That's fine.
- **MIME type.** GitHub Pages serves `.webmanifest` as `application/manifest+json; charset=utf-8`, with `cache-control: max-age=600` (checked live on `mdn.github.io`). The TEAS manifest isn't deployed yet.
- **Icons.** All PNGs are opaque RGB at their declared sizes. On the maskable icons, the farthest non-background pixel is 0.364 of the side from centre, inside the 0.40 safe circle. On the regular icons it is 0.476, which is fine for "any" icons and for iOS's rounded-corner mask (the text margin is about 8%). Background navy `#0b4f6c` matches `theme_color`, and `background_color` is white.
- **State handling.** `state.ui` is always an object: `blank()` includes it, and `sanitize()` (run on every start and every import) rebuilds it. Old saves and old exported files without `ui` load fine. `#/practice/continue` uses `location.replace`, so it leaves no extra history entry, and it falls back to the Practice menu when there's no history. The shortcut section names (`Science`, `Math`, `Reading`) match the bank.
- **Getting around without a Back button.** All app views and study pages carry the full header nav (Home, Diagnostic, Practice, Study, Progress, Coach), and About is in the footer, so every route has a way out without a Back button. The figure images (S2) and the download preview (S4) are the exceptions.
- **External links.** Links to OpenStax and the Coach open in a new window. In an installed iOS app these open in an in-app browser with a Done button, and on Android in a Custom Tab. The Coach copy runs inside the tap through `execCommand` before `window.open`, which is the same path the existing tests cover. Whether the copy and sign-in survive in the installed app needs a phone (see the checklist).
- **Safe area at the top.** The new `padding-top: env(safe-area-inset-top)` on `.site-header` is harmless. With the default status-bar style the inset is 0. If iOS ever draws the app under the status bar, the navy header simply extends behind it. Study pages don't set `viewport-fit=cover`, so their inset is always 0 and there's no change. The sticky answer bar already pads with `env(safe-area-inset-bottom)` on `index.html`, which keeps it above the iPhone home indicator in the installed app.
- **Who sees the nudge.** It appears only on phones in a normal browser tab. It does not appear on desktop or inside the installed app (tested by faking standalone mode). "Not now" and Done are remembered after a reload.
- **The iPhone storage claims in the dialog are accurate.** The installed app has separate storage ([WebKit bug 181849](https://bugs.webkit.org/show_bug.cgi?id=181849)). Safari can delete script-written storage after 7 days of Safari use without visiting the site, while home-screen apps "have their own counter of days of use" ([WebKit blog](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/)). In iOS 26, every site added to the Home Screen opens as a web app by default, and **Open as Web App** can be switched off ([heise](https://heise.de/-10749652), [firt.dev](https://firt.dev/notes/pwa-ios/)).

---

## Real-phone test checklist

Do this after deploying (or on a test branch). Start on a phone that has some practice history: answer a few questions first.

**iPhone (iOS 26, Safari)**
1. Open the site in Safari and check that the nudge appears on Home and Practice. Tap **Show me how**, then follow the steps exactly as written. Do the button names match what's on the screen? Try the default (Compact) tab layout and one other (Settings → Apps → Safari → Tabs).
2. With history: tap **Download my progress** in the dialog. Where did the file go (Files → Downloads)? What is it named?
3. Add to the Home Screen. Is **Open as Web App** on? Is the icon the navy TEAS PREP tile with the name "TEAS Prep"?
4. Open the icon. Does it open on **Practice**, with no Safari bars and no nudge? Is the header clear of the status bar and Dynamic Island?
5. In the app, go to My progress, tap **Load progress from a file**, and pick the file. Does progress appear?
6. In the app, tap **Download my progress**. Is there a preview, a save sheet, or a screen with no way out? (This is S4.)
7. Open a study page that has a figure (for example S.1.2) and tap the figure. Can you get back? Try a swipe from the very left edge. (This is S2.)
8. Answer a question wrong, then tap **Ask the TEAS Coach**. Does Gemini open in a sheet? Are you signed in? Does paste work? Tap Done: are you back on the question?
9. Tap an OpenStax link on a study page, then Done. Are you back where you were?
10. Start a diagnostic, swipe the app away, and reopen it. Can you find **Resume**?
11. Rotate to landscape on a question with the pinned answer bar. Is any text under the notch?
12. Repeat steps 1–4 in **Chrome on iPhone**.
13. Open the site from a link inside Gmail or Canvas on the iPhone. What do the steps say, and can you follow them? (This is S5.)

**Android (Chrome)**
1. Visit the site, tap once, and wait about 30 seconds. Then tap **Show me how**. Does Chrome's own **Install** sheet appear, rather than the written steps? Cancel it, then tap again. (This is S1.)
2. Install. Does the icon use the round or squircle navy tile with the text fully visible? Does it open on Practice with a navy status bar?
3. Long-press the icon. Are the 4 shortcuts there (Keep going, Science 10, Math 10, Reading 10), and does each open the right place?
4. Back in the browser tab: is the nudge still showing after you installed?
5. In the app: use system Back on study pages and figure images, open the Coach (signed in? paste works?), use Download my progress (it should save to Downloads) and Load progress from a file.
6. Uninstall, then add it through the menu: ⋮ → **Add to home screen**. Do the words match the written steps? Is there an Install/Create shortcut choice?
7. **Samsung Internet:** check that ☰ → **Add page to** → **Home screen** matches.
8. Open the site from inside Instagram or Facebook. Does the "open in Chrome" message show?
