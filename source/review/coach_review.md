# Review: "Ask the TEAS Coach" (independent review, 2026-11-18)

Scope: `coachHandoff` (docs/assets/core.js:502-546); `coachBlock`, `copySync`, `coachPanel` and the click handler (docs/assets/app.js:305-379); About page text (app.js:890, 892); `coach` config (docs/assets/config.js); Gem instructions (coach/TEAS_COACH_INSTRUCTIONS.md); knowledge files (coach/knowledge/*.md).

How I checked it:
- Node script over all 482 items in docs/data/bank.json. Each item got up to three seeded display orders, with a wrong response and with the correct response ("guessed"). That made 2,408 handoffs. The script checked that every letter in "My answer" and "Correct answer" is in the displayed list, and that the "Correct answer" letters map back to the key, in order for ordered items. It also confirmed that the key or `accepted[0]` grades as correct, and looked for undefined values, empty parentheses, HTML and leftover markup.
- Read 27 handoffs in full: 6 Reading, 7 Math, 7 Science, 7 English. They cover every format (mc, multi, order, supply), shuffled, sorted and fixed option orders, one- and two-passage Reading items, all five items whose explanation letters are relabelled (each in several orders), and both kinds (wrong and guessed).
- `node --test tests/core.test.mjs`: 16/16 pass. `python3 tests/coach_test.py`: all checks pass.
- Extra headless-Chrome checks (/tmp/coachrev/extra.py): iPhone viewport and user agent with touch taps, plus simulated failure cases. Results are given under each finding. WebKit isn't available here, so anything specific to iOS Safari is reasoned, not observed.

---

## Blocker

**No code blockers.** The handoff text was accurate for all 2,408 cases. The copy-then-open path works in Chrome, including with a phone viewport.

**One item gates launch. It is a real-device test, not a code change.** Emulation can't show WebKit's clipboard behavior, iOS universal links or Android app links, or which Google account Gemini picks. Before setting `coach.url`, test on real devices:
1. iPhone Safari without the Gemini app.
2. iPhone Safari with the Gemini app installed and signed in to a *personal* account.
3. Android Chrome with the Gemini/Google app signed in to a personal account.
4. A browser where the default Google account (authuser=0) is personal and the VCCS account is second.

In each case, check three things:
- Does the TEAS Coach Gem open, rather than plain Gemini or an access error?
- Is the handoff still on the clipboard after any sign-in?
- Does a long-press Paste work?

Google says a shared link "doesn't grant access by itself", that work and school sharing follows the admin's Drive sharing settings, and that sharing steps are documented only for the web. One user report says a shared Gem link opened in the *sending* account, not the account intended. Memory notes that Alex already shares a TEAS Gem with students, so basic access likely works. App interception and multiple signed-in accounts are still untested. The fixes for whatever the test turns up are wording and fallbacks, listed under S6 and S7.

---

## Should fix

### S1. "Copied" can be shown when nothing was copied (copy result isn't checked)
- **Where:** app.js:326-342 (`copySync`), 369.
- **Scenario:** `document.execCommand("copy")` returns `true` whether or not a selection exists. In Chrome I confirmed that it returns `true` with an empty selection (extra check 6). I then made `select()` and `setSelectionRange()` no-ops to stand in for a WebKit selection quirk. The panel said **"Copied. The TEAS Coach opened…"**, but the clipboard still held the student's *previous* contents ("OLD CLIPBOARD"; extra check 5). The student would paste whatever they last copied into Gemini. That is confusing, and it could be private.
- **On iOS specifically:** readonly textarea + `select()` + `setSelectionRange(0, len)` is the clipboard.js recipe, and it's known to work on iOS 10 and later. No `contentEditable` is needed. So this is hardening, not a known iOS failure.
- **Fix:** Add a one-time `copy` listener before `execCommand`: `document.addEventListener("copy", e => { e.clipboardData.setData("text/plain", text); e.preventDefault(); }, { once: true, capture: true })`. That writes the text without depending on a selection, in Chrome, Firefox and Safari (desktop and iOS). Keep the textarea selection as a second path. Remove the listener in a `finally` in case the event never fires.

### S2. If the new tab doesn't open, the page still says it opened
- **Where:** app.js:370-371, 350-351.
- **Scenario:** `window.open(url, "_blank", "noopener")` always returns `null`, so the code can't tell whether it was blocked. In-app browsers ignore it: iOS WKWebView in Gmail, Instagram, Facebook or some LMS apps, where the student tapped a link to the site. With `window.open` stubbed out, the panel said "The TEAS Coach opened in a new tab" (extra check 4). The "Didn't open?" link uses `target="_blank"` too, so in those webviews it also does nothing. The student then has copied text and no route to Gemini. Google sign-in is also refused inside embedded webviews.
- **Fix:**
  - Use `const w = window.open(url, "_blank"); if (w) { try { w.opener = null; } catch {} }`, and choose the "opened" or "copied — tap Open" panel based on `w`.
  - Reword the opened state to hedge: "The TEAS Coach should open in a new tab."
  - Add one line: "If nothing opens, or Google won't let you sign in, open this site in Safari or Chrome and try again."

### S3. Ordered-response handoffs use letters the student never saw
- **Where:** core.js:528-532; instructions line 72 ("with the letters the student saw") and line 147.
- **Scenario:** Ordered items are shown as a numbered list (1., 2., …) with ↑/↓ buttons and no letters (app.js:185-192). The handoff labels them A–E in the *initial* shuffled order and gives "My answer: A, B, C, D, E / Correct answer: E, D, B, A, C" (S.1.2-001). That is internally unambiguous, so it isn't wrong. But the Coach will say things like "you put A first", and the student has to map letters to positions they never saw. An LLM mapping five-letter sequences is also a known place for slips.
- **Fix:** For `order`, write the sequences out as text:
  ```
  My order:
  1. Bronchi
  2. Trachea …
  Correct order:
  1. Pharynx
  2. Larynx …
  ```
  You can drop the lettered "Items to put in order" list, or keep it. Update PART 2 line 147 to match, and PART 1 line 72 ("options with the letters the student saw, or for ordered questions, the student's order and the correct order").

### S4. The site's per-choice feedback ("Why not D: …") isn't in the handoff
- **Where:** core.js:540 (only `item.explanation` is sent). app.js:272-299 shows `feedbackNotes` on screen.
- **Scenario:** 453 of 482 items have option notes. The student has just read "Why not D: the article never recommends supplements." The Coach never sees that line, so it may give a different reason for the same distractor. That's needless conflict for weak readers. The "Common mistakes" general notes (29 items) are missing too.
- **Fix:** In `coachHandoff`, append `core.feedbackNotes(item, response, order)` as "About my answer (from the practice site): …". It already relabels letters (`render` at core.js:174-175). Label non-lead notes the way the UI does ("Why not D:", "You chose B:", "You left out E:").

### S5. The Coach is told to treat the key as the reference, but isn't told which keys are unreviewed
- **Where:** instructions lines 73-74; core.js:506-546.
- **Scenario:** 240 items (all of English and Reading) have `reviewPending`. Line 73 ("Teach toward that answer, not one you worked out differently") pushes Gemini to justify a wrong key on exactly those items. Line 74 gives no procedure for disagreeing, so on "most likely" Reading inferences Gemini may contradict a correct key on loose grounds. Either way the student gets a confident wrong lesson.
- **Fix:**
  - Add to the handoff, when `item.reviewPending`: "Note: this is a new question that ESCC faculty are still checking."
  - Add to PART 1 Mode A: "If the message says the question is still being checked, solve it yourself before teaching. Before you disagree with any site answer, solve it yourself and quote the exact words or step that decide it. Say plainly that you read it differently and that the student should give the question ID to their instructor. Never present your answer as the confirmed one."

### S6. No help when Gemini opens the wrong account, the wrong app, or plain Gemini, and no one-tap re-copy
- **Where:** app.js:349-356 (panel text); config.js `signInNote`.
- **Scenarios:**
  - (a) The link opens in the browser's default Google account (often personal), or in the Gemini app signed in to a personal account. The student sees "no access" or ordinary Gemini, not the Coach.
  - (b) VCCS sign-in or MFA in the middle (copying a code, switching to an authenticator app) overwrites the clipboard. When the student comes back, the panel offers only "Show the copied text", which on a phone means long-press, Select All, Copy.
- **Fix:**
  - Add one plain sentence to the opened and copied panels: "Check that the Gemini page says **TEAS Coach** at the top. If it doesn't, tap your picture, switch to your @email.vccs.edu account, then come back and tap Open the TEAS Coach again."
  - Add a **"Copy again"** button that reruns the synchronous copy. One tap restores the clipboard after a sign-in.
  - The handoff's last line already asks Gemini to ask how the student was thinking before it explains. That partly protects a paste into plain Gemini; keep it.

### S7. The setup steps leave out the Gem's general-access setting
- **Where:** instructions line 8; config.js comment above `coach`.
- **Scenario:** Google says a shared link "doesn't grant access by itself". The recipient must have access, either named or through General access ("Your organization" or "Anyone with the link"). Work and school accounts may not see "Anyone with the link", and the admin's Drive sharing settings apply. Copying the link without setting access gives students an access error.
- **Fix:** Make step 3 read: "Share › set General access to the widest option your account allows (Your organization if the Gem is in the VCCS student domain; otherwise Anyone with the link) › Copy link. Then open the link in a private window signed in as a *student* account before putting it in config.js."
- **Also:** Students who can use the Gem can see its instructions and knowledge files. Nothing in PART 1 or the knowledge files is sensitive. Keep it that way, for example by never adding an answer key.

### S8. Clicking the button moves keyboard and screen-reader focus to the top of the page
- **Where:** app.js:334-340.
- **Scenario:** `copySync` focuses the hidden textarea, then removes it. Focus falls to `<body>`, which I confirmed for both tap and Enter (extra checks 1-2). A keyboard or VoiceOver user is sent back to the top of a long practice page. Page scroll position doesn't move.
- **Fix:** Record `document.activeElement` before copying and call `.focus({ preventScroll: true })` on it afterwards, or focus the button. The panel's `aria-live` then announces the result.

---

## Nice to have

- **N1. Double tap opens two Gemini tabs** (extra check 3; app.js:362-372). Ignore a second click on the same button within about 1.5 s.
- **N2. The sticky "Next question" bar covers the panel's last line** (screenshot coach-normal.png: the "Didn't open? Open the TEAS Coach" button sits under the action bar). After filling the panel, call `panel.scrollIntoView({ block: "nearest" })` and give `.coach-panel` a `scroll-margin-bottom` equal to the bar's height.
- **N3. Manual fallback on iOS** (app.js:355-358). `ta.select()` on focus may not select a readonly textarea in iOS Safari. Use `ta.setSelectionRange(0, ta.value.length)` as well. For weak readers, change the wording to "Press and hold in the box, tap **Select All**, then **Copy**." The panel textareas use `font-size: 0.85rem` (style.css:268). Use 16px on small screens to rule out iOS focus-zoom.
- **N4. The pre-click note says the question "is copied"** before anything has been copied (app.js:323). Use "Tapping copies the question so you can paste it there."
- **N5. Guessed handoff has no "Correct answer" line** (core.js:539). Gemini has to infer the key from "(correct, but I guessed)". Adding `Correct answer: C` costs nothing and lets the Coach check its own working against the key.
- **N6. Relabelled bare-letter lists come out unsorted.** E.2.3-009 reads "B, A, and C each connect sleep…", and E.1.2-012 reads "E joins…. A joins…. D has…". This is correct but odd. Either sort letter runs after `relabelLetters(…, "bare")` (core.js:72), or rewrite those two explanations to use option text.
- **N7. Supply items with two accepted numbers** (M.2.4-004: 282.6 or 282.7) send only `accepted[0]` (core.js:535). The explanation does mention 282.7. "Correct answer: 282.6 (282.7 also accepted)" would be clearer.
- **N8. Mode A trigger** (instructions line 72): "starts with `[From ESCC TEAS Practice]`". Students often type "help" before pasting, so "contains" is safer.
- **N9. PART 2 doesn't match the code:**
  - Line 112 says "it copies on a second tap". Actually the async copy runs in the same tap, and it's the *opening* that takes a second tap.
  - The line-122 example shows R.3.4-007 with one passage, but the real handoff has two: the cereal label and the letter to the editor.
- **N10. Silent no-op when a stored context has been evicted** (app.js:318, 366). Only reachable after more than 200 feedback renders in one page session. Show the manual panel instead of returning.
- **N11. About page** (app.js:890): "After any practice question" should be "After any practice or diagnostic-review question". The site is aimed at "students and applicants", and some applicants may not have an @email.vccs.edu account yet. One clause covers them: "If you don't have one yet, you can still use everything else on this site."
- **N12. Content issues outside the Coach code, noticed while reading:**
  - M.1.10-004's explanation says "Subtract 85:" (should be "Subtract 85 from both sides") and lists "10, 16 and 15" (should be "10, 15 and 16").
  - R.1.3-004's "Step A says" refers to the PASS "A:" line, next to an options list that also has an "A". It's clear in context, but "The A (Aim) step says" would remove any chance of confusion.

---

## Verified

- **Letters:** across 2,408 handoffs, every letter in "My answer" and "Correct answer" is in the displayed options list, and "Correct answer" maps back to the key, in order for ordered items. Sorted (83) and fixed (2) option orders are respected. The key or `accepted[0]` grades as correct for every item.
- **Select-all:** answers are listed in display order, and "(Select all that apply.)" follows the options. Unambiguous.
- **Supply:** the typed answer is sent verbatim, and the accepted answer reads sensibly (for example "gallbladder", "300", "27"; the stems give the units).
- **Reading passages:** every passage ID resolves (24 passages, 120 Reading items, 12 with two passages). Passage text is sent in full, with title and type. Pipe tables come through as readable text.
- **Relabelled explanations:** all 5 relabelled items (4 bare, 1 "Option X") come out right in every order tested. A scan for unrelabelled option letters found no leaks. Every bare capital A–F left in other explanations is an article, "B cell", "°C", "Passage A/B", "Store A/B" or a PASS step.
- **Clean text:** no HTML, entities, `**` or `undefined` in any handoff. Largest is 3.1 KB, median 0.7 KB.
- **Privacy:** the handoff has no name, email, program, device ID or timestamp. It contains only bank content, the question ID and the student's own answer. The Coach's URL doesn't change with the student. The Referer is the site origin only; hash routes aren't sent. The About page's privacy line is accurate.
- **Mobile behavior:** with an iPhone viewport and user agent, a tap doesn't change scroll position, page zoom stays 1, the temporary textarea is removed, and the clipboard holds the full handoff. The readonly textarea at 16px, `position:fixed` and `preventScroll` avoid the keyboard flash, zoom and scroll jump.
- **Popups:** the copy happens before `window.open` in the same click handler, which doesn't consume user activation, so no desktop or mobile browser should block the open.
- **Fallbacks:** the async-clipboard and manual fallbacks both work, and their panels show an Open link (tests/coach_test.py). With no URL configured, there's no button.
- **Instructions:**
  - The PART 1 TEAS facts are internally consistent: section totals 45/39, 38/34, 50/44, 37/33 match the subarea sums.
  - The only placeholder left is [ADVISING_CONTACT] (lines 6, 103), and the setup steps flag it.
  - The site URL matches the knowledge files. All 67 study-page links in the knowledge files exist under docs/study/.
  - The handoff's closing lines match Mode A ("ask how they were thinking"; "quiz them first" for guessed).

Sources consulted for Gem sharing behaviour: Google Help, "Share a Gem from Gemini Apps" (support.google.com/gemini/answer/16504957); a user report on shared-Gem account mix-ups (lilting.ch/en/articles/gemini-gem-sharing-trouble).
