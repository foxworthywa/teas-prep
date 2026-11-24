// ESCC TEAS Prep: single-page app (hash routes). Logic lives in core.js.
import * as core from "./core.js?v=20261124";
import config from "./config.js";

const { escapeHtml: esc, renderRich } = core;
const $main = document.getElementById("main");
const DCFG = config.diagnostic;
let bank = null;
let byId = {};
let studyTitles = {};

// ------------------------------------------------------------------ storage
const KEY = "escc-teas-prep:v1";
const blank = () => ({ v: 1, attempts: [], diagnostics: [], current: null, profile: {}, ui: {} });
let storageOk = true;
let state = blank();

function load() {
  let raw = null;
  try {
    raw = localStorage.getItem(KEY);
    localStorage.setItem(KEY + ":test", "1");
    localStorage.removeItem(KEY + ":test");
  } catch {
    storageOk = false;
    state = blank();
    return;
  }
  try {
    const data = raw ? JSON.parse(raw) : null;
    state = data && typeof data === "object" ? { ...blank(), ...data } : blank();
    if (!Array.isArray(state.attempts) || !Array.isArray(state.diagnostics)) throw new Error("bad shape");
  } catch {
    // unreadable saved data: keep a copy, start fresh, keep saving
    try { localStorage.setItem(KEY + ":unreadable", raw); } catch { /* ignore */ }
    state = blank();
  }
}

// Keep only well-formed records for items and sections that exist (used on load and import).
function sanitize(data) {
  const out = blank();
  const okSection = new Set(bank.sections.map((x) => x.name));
  const bandIds = new Set(DCFG.bands.map((b) => b.id));
  const num = (x) => typeof x === "number" && Number.isFinite(x);
  out.attempts = (Array.isArray(data.attempts) ? data.attempts : [])
    .filter((a) => a && byId[a.id] && typeof a.ok === "boolean" && num(a.t))
    .map((a) => ({ id: a.id, ok: a.ok, m: a.m === "d" ? "d" : "p", t: a.t }));
  out.diagnostics = (Array.isArray(data.diagnostics) ? data.diagnostics : [])
    .filter((d) => d && okSection.has(d.section) && num(d.date) && Array.isArray(d.results))
    .map((d) => {
      const codes = new Set(sectionOf(d.section).subareas.map((x) => x.code));
      return {
        section: d.section,
        date: d.date,
        seed: String(d.seed || ""),
        parts: (Array.isArray(d.parts) ? d.parts : []).filter((c) => codes.has(c)),
        results: d.results.filter((r) => r && codes.has(r.code) && num(r.n) && num(r.correct) && bandIds.has(r.band))
          .map((r) => ({ code: r.code, n: r.n, correct: r.correct, band: r.band, stoppedEarly: !!r.stoppedEarly, nearCutoff: !!r.nearCutoff, ...(num(r.date) ? { date: r.date } : {}) })),
        items: (Array.isArray(d.items) ? d.items : []).filter((id) => byId[id]),
        answers: (Array.isArray(d.answers) ? d.answers : []).filter((a) => a && byId[a.id] && typeof a.correct === "boolean")
          .map((a) => ({ id: a.id, correct: a.correct, response: Array.isArray(a.response) ? a.response.filter((x) => typeof x === "string") : typeof a.response === "string" ? a.response : null })),
      };
    });
  const p = data.profile && typeof data.profile === "object" ? data.profile : {};
  out.profile = { name: String(p.name || "").slice(0, 100), email: String(p.email || "").slice(0, 100), program: String(p.program || "").slice(0, 60) };
  const lp = data.lastPractice;
  out.ui = { installNudgeDismissed: !!(data.ui && data.ui.installNudgeDismissed), transferHintDismissed: !!(data.ui && data.ui.transferHintDismissed), coachIntroSeen: !!(data.ui && data.ui.coachIntroSeen) };
  out.lastPractice = lp && ["obj", "mix", "weak"].includes(lp.kind) && typeof lp.arg === "string" ? { kind: lp.kind, arg: lp.arg } : null;
  out.current = data.current && typeof data.current === "object" && Array.isArray(data.current.order) && data.current.order.every((id) => byId[id]) && okSection.has(data.current.section) ? data.current : null;
  if (out.current && !Array.isArray(out.current.parts)) {
    // a diagnostic started before parts existed: give the rest of it part by part
    const c = out.current;
    const codes = sectionOf(c.section).subareas.map((x) => x.code);
    const rest = c.order.slice(c.pos).map((id, k) => ({ id, k }))
      .sort((a, b) => codes.indexOf(byId[a.id].subarea) - codes.indexOf(byId[b.id].subarea) || a.k - b.k).map((x) => x.id);
    c.order = c.order.slice(0, c.pos).concat(rest);
    c.parts = codes;
    c.breakAfter = null;
  }
  return out;
}
function save() {
  if (!storageOk) return;
  try {
    if (state.attempts.length > 6000) state.attempts = state.attempts.slice(-5000);
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    storageOk = false;
    document.getElementById("storage-warning").hidden = false;
  }
}
function newSeed() {
  try {
    const a = new Uint32Array(2);
    crypto.getRandomValues(a);
    return a[0].toString(36) + a[1].toString(36);
  } catch {
    return Math.random().toString(36).slice(2);
  }
}
function logAttempt(item, ok, mode) {
  state.attempts.push({ id: item.id, ok, m: mode, t: Date.now() });
}

// ------------------------------------------------------------------ helpers
const studyUrl = (code) => `study/${code}.html`;
const objTitle = (code) => studyTitles[code] || bank.objectives[code]?.text || code;
const sectionOf = (name) => bank.sections.find((s) => s.name === name);
const fmtDate = (t) => new Date(t).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
const bandChip = (band) => (band ? `<span class="band band-${band.id}">${esc(band.label)}</span>` : `<span class="band band-none">Not yet</span>`);
const bandById = (id) => DCFG.bands.find((b) => b.id === id);

function announce(text) {
  const live = document.getElementById("live");
  if (!live) return;
  live.textContent = "";
  setTimeout(() => (live.textContent = text), 50);
}

// tables wider than the screen get a visible hint that they scroll sideways
function markWideTables() {
  $main.querySelectorAll(".table-wrap").forEach((w) => {
    const wideNow = w.scrollWidth > w.clientWidth + 2;
    const hint = w.previousElementSibling?.classList.contains("scroll-hint") ? w.previousElementSibling : null;
    if (wideNow && !hint) w.insertAdjacentHTML("beforebegin", '<p class="scroll-hint">The table is wider than your screen. Swipe or scroll it sideways to see every column. →</p>');
    if (!wideNow && hint) hint.remove();
  });
}
window.addEventListener("resize", () => markWideTables());

function setView(html, title) {
  $main.innerHTML = html;
  markWideTables();
  $main.querySelectorAll("details").forEach((d) => d.addEventListener("toggle", markWideTables));
  document.title = title ? `${title} · ESCC TEAS Prep` : "ESCC TEAS Prep · Free TEAS 7 practice";
  const h1 = $main.querySelector("h1");
  (h1 || $main).setAttribute("tabindex", "-1");
  (h1 || $main).focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

function navHighlight(route) {
  document.querySelectorAll("[data-nav]").forEach((a) => {
    if (a.dataset.nav === route) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

function stats(ids) {
  // all attempts on these items: n, correct
  const set = new Set(ids);
  let n = 0, c = 0;
  for (const a of state.attempts) if (set.has(a.id)) { n++; if (a.ok) c++; }
  return { n, c };
}
function objectiveStats(code) {
  return stats(bank.items.filter((i) => i.objective === code).map((i) => i.id));
}
const pct = (c, n) => (n ? Math.round((100 * c) / n) : 0);

// ------------------------------------------------------------------ item rendering
// One component for diagnostic, practice and review.
// opts: { order, response, locked, onChange, showKey, mode }
function itemHtml(item, opts) {
  const { order, response, locked, showKey } = opts;
  const pending = !!item.reviewPending;
  const passages = (item.passages || []).map((pid) => bank.passages[pid]).filter(Boolean);
  const passageBody = (p) => renderRich(p.text.replace(/^((?:Passage|Story|Source|Text) [A-Z0-9]\b[^\n]{0,70})$/gm, "**$1**"));
  let passageHtml = passages
    .map((p, i) => `<section class="passage" aria-labelledby="ph-${esc(p.id)}">
      <h2 id="ph-${esc(p.id)}">${passages.length > 1 ? `Text ${i + 1} of ${passages.length}: ` : ""}${esc(p.title)}</h2>
      <p class="ptype">${esc(p.type)}</p>${passageBody(p)}</section>`)
    .join("");
  if (passages.length && opts.passageRepeat) {
    passageHtml = `<details class="passage-repeat" ${wide() ? "open" : ""}><summary>Show the passage again (${esc(passages.map((p) => p.title).join(" and "))})</summary>${passageHtml}</details>`;
  }
  const map = order ? core.letterMap(order) : {};
  const optById = Object.fromEntries((item.options || []).map((o) => [o.id, o]));
  let answer = "";

  if (item.format === "mc" || item.format === "multi") {
    const type = item.format === "mc" ? "radio" : "checkbox";
    const chosen = new Set(item.format === "mc" ? (response ? [response] : []) : response || []);
    answer = `<fieldset class="options ${locked ? "locked" : ""}"><legend>${item.format === "mc" ? "Choose one answer." : "Choose every answer that applies."}</legend>` +
      order.map((id) => {
        const isKey = item.key.includes(id);
        const sel = chosen.has(id);
        let cls = sel ? "selected" : "", tag = "";
        if (showKey) {
          if (isKey) { cls += " is-key"; tag = sel ? "Correct answer · your choice" : "Correct answer"; }
          else if (sel) { cls += " is-wrong"; tag = "Your choice"; }
        }
        return `<label class="option ${cls}"><input type="${type}" name="opt" value="${id}" ${sel ? "checked" : ""} ${locked ? "disabled" : ""}>
          <span class="letter">${map[id]}.</span><span class="otext">${renderInline(optById[id].text)}</span>${tag ? `<span class="tag">${tag}</span>` : ""}</label>`;
      }).join("") + `</fieldset>`;
  } else if (item.format === "order") {
    const cur = response && response.length ? response : order;
    answer = (locked ? "" : `<p class="small muted" id="ord-help">Use the ↑ and ↓ buttons to put these in order. Number 1 comes first.</p>`) +
      `<ol class="order-list" ${locked ? "" : 'aria-describedby="ord-help"'}>` +
      cur.map((id, i) => `<li data-id="${id}" class="${showKey ? (item.key[i] === id ? "pos-ok" : "pos-bad") : ""}"><span class="pos">${i + 1}.</span><span class="txt">${renderInline(optById[id].text)}</span>${showKey ? `<span class="tag">${item.key[i] === id ? "In the right place" : `Belongs at ${item.key.indexOf(id) + 1}`}</span>` : ""}
        ${locked ? "" : `<button type="button" data-move="-1" data-id="${id}" ${i === 0 ? "disabled" : ""} aria-label="Move ${esc(optById[id].text)} up">↑</button>
        <button type="button" data-move="1" data-id="${id}" ${i === cur.length - 1 ? "disabled" : ""} aria-label="Move ${esc(optById[id].text)} down">↓</button>`}</li>`).join("") +
      `</ol>`;
    if (showKey) {
      answer += `<p class="small"><strong>Correct order:</strong> ${item.key.map((k, i) => `${i + 1}. ${esc(optById[k].text)}`).join(" · ")}</p>`;
    }
  } else if (item.format === "supply") {
    const num = item.inputMode === "number";
    answer = `<div class="supply"><label for="supply-in">Your answer</label>
      <input id="supply-in" type="text" autocomplete="off" spellcheck="false" ${num ? 'inputmode="decimal"' : ""} value="${esc(response || "")}" ${locked ? "disabled" : ""}>
      <div class="hint">${num ? "Type a number. Units are optional." : "Type a word or short phrase."}</div></div>`;
  }

  const q = `<div class="q-col">${pending ? `<p class="review-note">New question, still being checked by ESCC faculty. If something looks wrong, tell your instructor the question ID below.</p>` : ""}
    <div class="stem">${renderRich(item.stem)}</div>${answer}<div class="fb-slot"></div><p class="qid">Question ID ${esc(item.id)}</p></div>`;
  return passages.length
    ? `<div class="q-layout with-passage"><div class="passage-col">${passageHtml}</div>${q}</div>`
    : `<div class="q-layout">${q}</div>`;
}

const wide = () => window.matchMedia("(min-width: 920px)").matches;
let lastPassageKey = "";
function passageRepeat(item) {
  const key = (item.passages || []).join("+");
  const repeat = !!key && key === lastPassageKey;
  lastPassageKey = key;
  return repeat;
}

function renderInline(text) {
  // option text: rich inline only, no paragraphs
  return renderRich(text).replace(/^<p>/, "").replace(/<\/p>$/, "");
}

// wire inputs; calls onChange(response)
function bindItem(root, item, opts) {
  const { order, onChange } = opts;
  let response = opts.response;
  if (item.format === "mc" || item.format === "multi") {
    root.querySelectorAll('input[name="opt"]').forEach((inp) =>
      inp.addEventListener("change", () => {
        if (item.format === "mc") response = root.querySelector('input[name="opt"]:checked')?.value || null;
        else response = order.filter((id) => root.querySelector(`input[value="${id}"]`).checked);
        root.querySelectorAll(".option").forEach((l) => l.classList.toggle("selected", l.querySelector("input").checked));
        onChange(response);
      })
    );
  } else if (item.format === "order") {
    response = response && response.length ? response.slice() : order.slice();
    onChange(response);
    root.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-move]");
      if (!b) return;
      const id = b.dataset.id, d = Number(b.dataset.move);
      const i = response.indexOf(id), j = i + d;
      if (j < 0 || j >= response.length) return;
      [response[i], response[j]] = [response[j], response[i]];
      onChange(response);
      const holder = root.querySelector(".order-list");
      const tmp = document.createElement("div");
      tmp.innerHTML = itemHtml(item, { ...opts, response });
      holder.replaceWith(tmp.querySelector(".order-list"));
      const again = root.querySelector(`button[data-id="${id}"][data-move="${d}"]`) || root.querySelector(`button[data-id="${id}"]:not([disabled])`);
      again?.focus();
    });
  } else if (item.format === "supply") {
    const inp = root.querySelector("#supply-in");
    inp.addEventListener("input", () => onChange(inp.value));
  }
}

function feedbackHtml(item, response, order) {
  const ok = core.grade(item, response);
  const map = core.letterMap(order || []);
  const optById = Object.fromEntries((item.options || []).map((o) => [o.id, o]));
  let keyLine = "";
  if (item.format === "mc" || item.format === "multi") {
    keyLine = item.key.slice().sort((a, b) => order.indexOf(a) - order.indexOf(b))
      .map((k) => `${map[k]}. ${esc(optById[k].text)}`).join("; ");
  } else if (item.format === "supply") {
    keyLine = esc(item.accepted[0]);
  }
  const notes = core.feedbackNotes(item, response, order || []);
  const choiceNotes = notes.filter((n) => n.optionId);
  const general = notes.filter((n) => !n.optionId);
  const yourNotes = choiceNotes.map((n) => {
    // notes that start with their own letters ('C and E are ...') need no label
    if (n.lead) return `<p>${renderInline(n.text)}</p>`;
    let label = item.format === "multi"
      ? (response || []).includes(n.optionId) ? `You chose ${map[n.optionId]}` : `You left out ${map[n.optionId]}`
      : `Why not ${map[n.optionId]}`;
    if (n.shared) label = `${label} (same reason for ${core.joinLetters(n.shared.map((L) => map[L]).sort())})`;
    return `<p><strong>${label}:</strong> ${renderInline(n.text)}</p>`;
  }).join("");
  let multiLine = "";
  if (item.format === "multi" && !ok) {
    const r = new Set(response || []);
    const hit = item.key.filter((k) => r.has(k)).length;
    const extra = (response || []).filter((k) => !item.key.includes(k)).length;
    multiLine = `<p>You chose ${hit} of the ${item.key.length} correct answers${extra ? ` and ${extra} that ${extra === 1 ? "doesn't" : "don't"} belong` : ""}. All the correct answers must be chosen, and nothing else.</p>`;
  }
  const generalHtml = general.length ? `<h3>${item.format === "supply" || item.format === "order" ? "Common mistakes" : "Also worth knowing"}</h3>${general.map((n) => `<p>${renderInline(n.text)}</p>`).join("")}` : "";
  const expl = core.relabelLetters(item.explanation, map, item.explanationLetters === "bare" ? "bare" : "option");
  return `<div class="feedback ${ok ? "ok" : "bad"}">
    <p class="verdict">${ok ? "Correct" : "Not quite"}</p>
    ${!ok && keyLine ? `<p><strong>Correct answer:</strong> ${keyLine}</p>` : ""}${multiLine}
    ${!ok && item.format === "supply" ? `<p class="small muted">You entered: ${esc(response || "")}</p>` : ""}
    <h3>Explanation</h3><p>${renderInline(expl)}</p>
    ${yourNotes ? `<h3>About your answer</h3>${yourNotes}` : ""}
    ${generalHtml}
    <p class="study-link">Study page: <a href="${studyUrl(item.objective)}">${item.objective} ${esc(objTitle(item.objective))}</a></p>
    ${coachBlock(item, response, order, ok)}
  </div>`;
}

// ------------------------------------------------------------------ TEAS Coach
// The site copies the question, the student's answer and the explanation, then opens
// the Coach (a Gemini Gem) for the student to paste into. Copying happens inside the tap
// itself (works in every browser we know of), with two fallbacks: the async clipboard API
// with a second tap to open the Coach, and finally the text shown for manual copying.
const coachOn = () => !!(config.coach && config.coach.url);
const coachContexts = new Map();
let coachSeq = 0;

function coachBlock(item, response, order, ok) {
  if (!coachOn()) return "";
  const id = `c${++coachSeq}`;
  coachContexts.set(id, { item, response: Array.isArray(response) ? response.slice() : response, order: (order || []).slice() });
  if (coachContexts.size > 200) coachContexts.delete(coachContexts.keys().next().value);
  const name = esc(config.coach.name || "TEAS Coach");
  const btn = ok
    ? `<button type="button" class="btn link coach-btn" data-coach="${id}" data-kind="guessed">I guessed. Ask the ${name} why it's right</button>`
    : `<button type="button" class="btn coach-btn" data-coach="${id}" data-kind="wrong">Ask the ${name} about this</button>`;
  return `<div class="coach">${btn}<p class="small muted coach-note">${esc(config.coach.signInNote || "")} Tapping copies this question so you can paste it there.</p><div class="coach-panel" aria-live="polite"></div></div>`;
}

// Copy inside the tap. The copy event handler sets the text directly, so we know the
// clipboard really got it (execCommand alone can report success without copying).
function copySync(text) {
  let wrote = false;
  const onCopy = (e) => {
    if (!e.clipboardData) return;
    e.clipboardData.setData("text/plain", text);
    e.preventDefault();
    wrote = true;
  };
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px;";
  document.body.appendChild(ta);
  const active = document.activeElement;
  document.addEventListener("copy", onCopy, true);
  ta.focus({ preventScroll: true });
  ta.select();
  ta.setSelectionRange(0, text.length);
  let ok = false;
  try { ok = document.execCommand("copy"); } catch { ok = false; }
  document.removeEventListener("copy", onCopy, true);
  ta.remove();
  if (active && active.focus) active.focus({ preventScroll: true });
  return ok && wrote;
}

const IN_APP_TIP = "If you're reading this inside another app (like Gmail, Facebook or Canvas), open this site in Safari or Chrome instead.";
const ACCOUNT_TIP = "If the top of the chat just says Gemini (not TEAS Coach), or Gemini says you need access, you're not in the Coach. Sign in, or tap your profile picture and switch, to your VCCS account (@email.vccs.edu), then tap Open the TEAS Coach again.";

function coachPanel(panel, text, state) {
  const url = esc(config.coach.url);
  const name = esc(config.coach.name || "TEAS Coach");
  const open = (cls) => `<a class="btn ${cls}" href="${url}" target="_blank" rel="noopener">Open the ${name}</a>`;
  const again = `<button type="button" class="btn secondary coach-again">Copy again</button>`;
  const help = `<details class="coach-help"><summary>Trouble?</summary><p>${ACCOUNT_TIP}</p><p>If signing in replaced what you copied, tap Copy again, then paste.</p><p>${IN_APP_TIP}</p></details>`;
  const show = `<details class="coach-text"><summary>Show the copied text</summary><textarea readonly rows="8">${esc(text)}</textarea></details>`;
  if (state === "opened") {
    panel.innerHTML = `<p class="coach-ok"><strong>Copied.</strong> The ${name} should be open now. Tap its message box and paste (on a phone: press and hold, then Paste), then send.</p>
      <p class="coach-check"><strong>Check the top of the chat says ${name}.</strong> If it just says Gemini, you're not signed in with your VCCS account, so you're talking to plain Gemini, not the Coach. Sign in, then tap Open the ${name} again.</p>
      <div class="btn-row tight-row">${open("secondary")}${again}</div>${help}${show}`;
  } else if (state === "copied") {
    panel.innerHTML = `<p class="coach-ok"><strong>Copied.</strong> Now open the ${name}, paste into its message box, and send. Check the top of the chat says ${name}; if it just says Gemini, sign in with your VCCS account first.</p>
      <div class="btn-row tight-row">${open("")}${again}</div>${help}${show}`;
  } else if (state === "stale") {
    panel.innerHTML = `<p>This question is no longer loaded. Go back to it and tap the button again.</p>`;
  } else {
    panel.innerHTML = `<p><strong>Your browser didn't let the site copy automatically.</strong> Press and hold in the box below, tap <strong>Select All</strong>, then <strong>Copy</strong>. Then open the ${name} and paste.</p>
      <textarea class="coach-manual" readonly rows="8">${esc(text)}</textarea><div class="btn-row tight-row">${open("")}</div>${help}`;
    const ta = panel.querySelector("textarea");
    ta.addEventListener("focus", () => { ta.select(); ta.setSelectionRange(0, ta.value.length); });
  }
  const copyAgain = panel.querySelector(".coach-again");
  if (copyAgain) copyAgain.addEventListener("click", () => {
    if (copySync(text)) { copyAgain.textContent = "Copied again"; return; }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(() => (copyAgain.textContent = "Copied again"), () => coachPanel(panel, text, "manual"));
    else coachPanel(panel, text, "manual");
  });
  // keep the panel clear of the pinned answer bar on phones
  requestAnimationFrame(() => panel.scrollIntoView({ block: "nearest" }));
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-coach]");
  if (!btn || !coachOn()) return;
  const now = Date.now();
  if (now - Number(btn.dataset.last || 0) < 1500) return; // ignore a double tap
  btn.dataset.last = String(now);
  const panel = btn.closest(".coach").querySelector(".coach-panel");
  const ctx = coachContexts.get(btn.dataset.coach);
  if (!ctx) return coachPanel(panel, "", "stale");
  const text = core.coachHandoff(bank, ctx.item, ctx.response, ctx.order, btn.dataset.kind);
  if (copySync(text)) {
    const w = window.open(config.coach.url, "_blank");
    if (w) { try { w.opener = null; } catch { /* ignore */ } }
    coachPanel(panel, text, w ? "opened" : "copied");
    btn.focus({ preventScroll: true });
    return;
  }
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => coachPanel(panel, text, "copied"), () => coachPanel(panel, text, "manual"));
  } else {
    coachPanel(panel, text, "manual");
  }
  btn.focus({ preventScroll: true });
});

// The header's Coach link goes to a short intro page until the student has seen it once
// (the site can't tell whether they're signed in to Google), then straight to Gemini.
function updateCoachNav() {
  const a = document.querySelector(".site-header .nav-coach");
  if (!a) return;
  const direct = !!state.ui.coachIntroSeen;
  a.href = direct ? config.coach.url : "#/coach";
  if (direct) { a.target = "_blank"; a.rel = "noopener"; } else { a.removeAttribute("target"); a.removeAttribute("rel"); }
  a.querySelectorAll(".nav-ext, .nav-ext-sr").forEach((x) => (x.hidden = !direct));
}

function viewCoach() {
  navHighlight("coach");
  if (!coachOn()) return viewNotFound();
  const name = esc(config.coach.name);
  setView(`<h1>The ${name}</h1>
    <p class="lead">An AI tutor in Google Gemini, set up for the TEAS. It uses ESCC's study pages and makes you think first instead of just giving answers.</p>
    <div class="notice"><p><strong>Sign in with your VCCS student account</strong> (the one ending in @email.vccs.edu). If you're not signed in, Gemini still opens, but without the Coach.</p>
      <p>Check the top of the chat: it should say <strong>${name}</strong>. If it just says Gemini, sign in (or tap your profile picture and switch to your VCCS account), then come back and tap the button again.</p></div>
    <p>Ask it for practice questions on a topic, help with something you don't get, or a study plan. To get help with a question you missed on this site, use the <strong>Ask the ${name}</strong> button under that question instead; it sends the question along for you.</p>
    <p class="coach-remember"><label><input type="checkbox" id="coach-remember" checked> Next time, open the ${name} directly</label></p>
    <div class="btn-row"><a class="btn coach-open" id="coach-open" href="${esc(config.coach.url)}" target="_blank" rel="noopener">Open the ${name}</a><a class="btn secondary" href="#/practice">Back to practice</a></div>`, config.coach.name);
  document.getElementById("coach-open").addEventListener("click", () => {
    state.ui.coachIntroSeen = document.getElementById("coach-remember").checked;
    save();
    updateCoachNav();
  });
}

// ------------------------------------------------------------------ add to home screen
// The site can be installed as a home-screen app (manifest + icons; no offline caching
// yet). A page can't add an icon by itself. Where the browser offers its own install
// prompt (Chrome on Android fires beforeinstallprompt even without a service worker),
// "Show me how" opens that prompt; otherwise it shows the steps for that phone.
const UA = navigator.userAgent || "";
const isIOS = () => /iPhone|iPad|iPod/.test(UA) || (/Macintosh/.test(UA) && navigator.maxTouchPoints > 1);
const isAndroid = () => /Android/.test(UA);
const isPhone = () => isIOS() || isAndroid();
const isStandalone = () => {
  try {
    return ["standalone", "fullscreen", "minimal-ui"].some((m) => window.matchMedia(`(display-mode: ${m})`).matches) || navigator.standalone === true;
  } catch { return false; }
};
// in-app browsers that usually can't add to the home screen (Apple's in-app Safari
// view looks exactly like Safari, so the iPhone steps also mention it)
const isInApp = () => /FBAN|FBAV|FB_IAB|Instagram|LinkedInApp|Snapchat|GSA\/|Line\/|; wv\)/.test(UA);
let installPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); installPrompt = e; });
window.addEventListener("appinstalled", () => { installPrompt = null; markInstalled(); });

function markInstalled() {
  state.ui.installNudgeDismissed = true;
  save();
  refreshInstallSlots();
}

function refreshInstallSlots(focusQuiet) {
  document.querySelectorAll(".install-nudge, .install-quiet").forEach((n) => (n.outerHTML = installSlot()));
  if (focusQuiet) document.querySelector(".install-quiet button")?.focus({ preventScroll: true });
}

function progressFile() {
  const name = `teas-prep-progress-${new Date().toISOString().slice(0, 10)}.json`;
  return { name, blob: new Blob([JSON.stringify(state)], { type: "application/json" }) };
}

// In an installed iPhone app a plain download can strand the student on a preview
// screen, so there we use the share sheet ("Save to Files").
function downloadProgress() {
  const { name, blob } = progressFile();
  if (isIOS() && isStandalone() && navigator.canShare && typeof File !== "undefined") {
    const file = new File([blob], name, { type: "application/json" });
    if (navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: "TEAS Prep progress" }).catch(() => {});
      return;
    }
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

const hasProgress = () => state.attempts.length > 0 || state.diagnostics.length > 0;

// Copy all progress as text. The clipboard is shared between Safari and the
// home-screen app (and between browsers), so this is the easy way to move it.
function copyProgress() {
  const text = JSON.stringify(state);
  if (copySync(text)) return true;
  const msg = document.getElementById("copy-msg");
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(
      () => { if (msg) msg.textContent = "Copied. Now open the other browser or the app, go to My progress, and paste."; },
      () => { if (msg) msg.textContent = "Your browser didn't allow copying. Use a file instead (below)."; });
    return "pending";
  }
  if (msg) msg.textContent = "Your browser didn't allow copying. Use a file instead (below).";
  return false;
}

// Merge progress from pasted text or a file into this device's progress.
function mergeProgress(text) {
  let parsed;
  try {
    const t = String(text || "");
    parsed = JSON.parse(t.slice(t.indexOf("{"), t.lastIndexOf("}") + 1));
  } catch { return false; }
  if (!parsed || !Array.isArray(parsed.attempts) || !Array.isArray(parsed.diagnostics)) return false;
  const data = sanitize(parsed);
  const key = (a) => `${a.id}|${a.t}`;
  const have = new Set(state.attempts.map(key));
  state.attempts = state.attempts.concat(data.attempts.filter((a) => !have.has(key(a)))).sort((a, b) => a.t - b.t);
  const dkey = (d) => (d.seed ? `seed|${d.seed}` : `${d.section}|${d.date}`);
  const byKey = new Map(state.diagnostics.map((d) => [dkey(d), d]));
  for (const d of data.diagnostics) {
    const mine = byKey.get(dkey(d));
    if (!mine || d.results.length > mine.results.length || (d.results.length === mine.results.length && d.date > mine.date)) byKey.set(dkey(d), d);
  }
  state.diagnostics = [...byKey.values()].sort((a, b) => a.date - b.date);
  // bring "Keep going", an unfinished diagnostic and contact details along if this device has none
  if (!state.lastPractice && data.lastPractice) state.lastPractice = data.lastPractice;
  if (!state.current && data.current && !data.current.finished) state.current = data.current;
  if (!state.profile.name && !state.profile.email && (data.profile.name || data.profile.email)) state.profile = data.profile;
  save();
  return true;
}

// HTML for the home and Practice pages: a one-time nudge, then a quiet button.
// In the installed iPhone app with no progress yet: a one-time "bring your progress" note.
function installSlot() {
  if (isStandalone()) {
    if (isIOS() && !hasProgress() && !state.ui.transferHintDismissed) {
      return `<div class="install-nudge" role="region" aria-label="Bring your progress">
        <p><strong>Practiced in Safari before?</strong> This app keeps its own records. To bring your progress over: in Safari, open this site, go to My progress and tap <strong>Copy my progress</strong>. Then come back here, open <a href="#/progress#move">My progress</a>, and tap <strong>Paste my progress</strong>.</p>
        <div class="btn-row tight-row"><button type="button" class="btn link" data-install="dismiss-transfer">Got it</button></div></div>`;
    }
    return "";
  }
  if (!isPhone()) return "";
  if (!state.ui.installNudgeDismissed) {
    return `<div class="install-nudge" role="region" aria-label="Add to home screen">
      <p><strong>Practice in seconds.</strong> Put TEAS Prep on your home screen and it opens like an app, straight to practice.</p>
      <div class="btn-row tight-row"><button type="button" class="btn" data-install="how">Show me how</button><button type="button" class="btn link" data-install="dismiss">Not now</button></div></div>`;
  }
  return `<p class="install-quiet"><button type="button" class="btn link" data-install="how">Add TEAS Prep to your home screen</button></p>`;
}

function installSteps() {
  if (isInApp()) {
    return `<p>You're reading this inside another app, which can't add icons. Open this page in ${isIOS() ? "Safari" : "Chrome"} first: look for a menu (••• or ⋮) with <strong>Open in ${isIOS() ? "Safari" : "browser"}</strong>. Then tap the button again.</p>`;
  }
  if (isIOS()) {
    const transfer = hasProgress()
      ? `<li><strong>Copy your progress first.</strong> The home-screen app keeps its own records, separate from this browser. <button type="button" class="btn secondary inline-btn" data-install="copy">Copy my progress</button> <span class="small copy-ok" aria-live="polite"></span></li>`
      : "";
    const share = /CriOS/.test(UA)
      ? `<li>Tap the <strong>Share</strong> button (a square with an arrow pointing up) in the address bar.</li>`
      : `<li>Tap <strong>•••</strong> next to the address bar, then <strong>Share</strong>. (If you see the <strong>Share</strong> button, a square with an arrow pointing up, tap that instead.)</li>`;
    return `<ol class="install-steps">${transfer}${share}
        <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
        <li>Leave <strong>Open as Web App</strong> on, and tap <strong>Add</strong>.</li>
        ${hasProgress() ? `<li>Open the new TEAS Prep icon and go to <strong>My progress</strong>. Tap <strong>Paste my progress</strong>, then <strong>Paste</strong> when your phone asks.</li>` : ""}
      </ol>
      <p class="small muted">Don't see ••• or Share? You may be inside another app's browser (from email or a course app). Tap the compass or <strong>Open in Safari</strong> first.</p>
      <p class="small muted">On an iPhone, the home-screen app also keeps your progress safer: Safari can clear saved data for sites you haven't visited in a while.</p>`;
  }
  return `<ol class="install-steps">
      <li>In Chrome, tap <strong>⋮</strong> (top right, or bottom right if your address bar is at the bottom).</li>
      <li>Tap <strong>Add to home screen</strong>, then <strong>Install</strong> (it may say <strong>Install app</strong>).</li>
      <li>Tap <strong>Install</strong> again to confirm.</li>
    </ol>
    <p class="small muted">Using Samsung Internet? Tap ☰, then <strong>Add page to</strong>, then <strong>Home screen</strong>.</p>`;
}

function showStepsDialog() {
  const dlg = document.createElement("dialog");
  dlg.className = "install-dialog";
  dlg.setAttribute("aria-labelledby", "install-h");
  dlg.innerHTML = `<div class="dlg-head"><h2 id="install-h">Add TEAS Prep to your home screen</h2><button type="button" class="dlg-x" data-close aria-label="Close">✕</button></div>
    ${installSteps()}
    <p class="small">The icon opens straight to Practice. It's free and doesn't use the app store.</p>
    <div class="btn-row dlg-foot"><button type="button" class="btn" data-close>Done</button></div>`;
  document.body.appendChild(dlg);
  dlg.querySelectorAll("[data-close]").forEach((x) => x.addEventListener("click", () => dlg.close()));
  dlg.querySelector('[data-install="copy"]')?.addEventListener("click", () => {
    const r = copyProgress();
    const ok = dlg.querySelector(".copy-ok");
    if (ok) ok.textContent = r === false ? "Copying didn't work here. Use My progress › Use a file instead." : "Copied.";
  });
  dlg.addEventListener("close", () => {
    state.ui.installNudgeDismissed = true;
    save();
    dlg.remove();
    refreshInstallSlots(true);
  });
  dlg.showModal();
}

function showInstallDialog() {
  if (installPrompt) {
    const p = installPrompt;
    installPrompt = null;
    Promise.resolve()
      .then(() => p.prompt())
      .then(() => p.userChoice)
      .then((c) => { if (c && c.outcome === "accepted") markInstalled(); })
      .catch(() => showStepsDialog());
    return;
  }
  showStepsDialog();
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-install]");
  if (!b || b.closest("dialog")) return;
  if (b.dataset.install === "how") showInstallDialog();
  if (b.dataset.install === "dismiss") {
    state.ui.installNudgeDismissed = true;
    save();
    refreshInstallSlots(true);
  }
  if (b.dataset.install === "dismiss-transfer") {
    state.ui.transferHintDismissed = true;
    save();
    refreshInstallSlots();
  }
});

// ------------------------------------------------------------------ home
// Latest diagnostic result for each part, whichever run it came from.
function latestByPart() {
  const out = {};
  state.diagnostics.forEach((d, idx) => {
    for (const r of d.results || []) {
      const date = r.date || d.date;
      if (!out[r.code] || date >= out[r.code].date) out[r.code] = { r, date, idx };
    }
  });
  return out;
}
const maxPer = () => Math.min(DCFG.maxPerSubarea, bank.diagnosticMaxPerSubarea || DCFG.maxPerSubarea);
const perPartText = () => `${DCFG.minPerSubarea} to ${maxPer()} questions, about 10 to 15 minutes`;
const partLabel = (code) => {
  for (const sec of bank.sections) { const x = sec.subareas.find((y) => y.code === code); if (x) return `${code} ${x.name}`; }
  return code;
};

function viewHome() {
  navHighlight("");
  const cur = state.current;
  const latest = latestByPart();
  const sectionCards = bank.sections.map((s) => {
    const have = s.subareas.filter((x) => latest[x.code]);
    return `<div class="card"><h3>${s.name}</h3>
      <p class="small muted">${s.subareas.map((x) => esc(x.name)).join(" · ")}</p>
      ${have.length ? `<p class="small">Latest diagnostic: ${s.subareas.map((x) => `${esc(x.code)} ${bandChip(latest[x.code] ? bandById(latest[x.code].r.band) : null)}`).join(" ")}</p>` : `<p class="small muted">No diagnostic yet.</p>`}
      <div class="spacer"></div>
      <div class="btn-row" style="margin:6px 0 0"><a class="btn" href="#/diagnostic/${s.name}">Diagnostic</a><a class="btn secondary" href="#/practice/${s.name}">Practice</a></div></div>`;
  }).join("");
  setView(`
    <h1>Free TEAS 7 practice</h1>
    <p class="lead">From Eastern Shore Community College, for anyone preparing for the ATI TEAS: LPN, RN, dental hygiene and other programs. No login, and nothing to buy.</p>
    <p class="small muted">Your progress is saved in this browser on this device only. Clearing your browser data erases it; <a href="#/progress">My progress</a> lets you download a copy.</p>
    ${cur && !cur.finished ? `<p class="notice">You have a ${esc(cur.section)} diagnostic in progress. <a href="#/diagnostic/${cur.section}">Pick up where you left off</a>.</p>` : ""}
    ${(() => { const l = lastPracticeLink(); return l ? `<a class="keep-going" href="${l.href}"><span class="kg-label">Keep practicing</span><span class="kg-what">${esc(l.label)}</span></a>` : ""; })()}
    ${installSlot()}
    <div class="cards">
      <div class="card"><h2>1. Take a diagnostic</h2><p>A practice test that shows where you stand in each part of a section, so you know what to study. Do one part at a time (about 10 to 15 minutes each) or a whole section with breaks.</p><div class="spacer"></div><a class="btn" href="#/diagnostic">Start a diagnostic</a></div>
      <div class="card"><h2>2. Practice by objective</h2><p>Questions for each of the 64 TEAS objectives, with an explanation for every answer you pick.</p><div class="spacer"></div><a class="btn" href="#/practice">Practice</a></div>
      <div class="card"><h2>3. Study pages</h2><p>A short page for each objective with figures, quick checks and links to free textbooks.</p><div class="spacer"></div><a class="btn" href="study/index.html">Study pages</a></div>
    </div>
    <h2>Sections</h2>
    <div class="cards">${sectionCards}</div>`);
}

// ------------------------------------------------------------------ diagnostic
function partListHtml(s, latest) {
  return `<ul class="obj-list part-list">${s.subareas.map((x) => {
    const l = latest[x.code];
    return `<li><a class="obj-link" href="#/diagnostic/${s.name}/${x.code}"><span class="obj-main"><span class="code">${x.code}</span>${esc(x.name)}</span>
      <span class="obj-stats">${l ? `${bandChip(bandById(l.r.band))} ${fmtDate(l.date)}` : "Not taken yet"}</span></a></li>`;
  }).join("")}</ul>`;
}

function viewDiagnosticMenu() {
  navHighlight("diagnostic");
  const latest = latestByPart();
  const cur = state.current && !state.current.finished ? state.current : null;
  const cards = bank.sections.map((s) => {
    const n = s.subareas.length;
    const t = s.teas;
    const resumeHere = cur && cur.section === s.name;
    return `<div class="card"><h2>${s.name}</h2>
      ${resumeHere ? `<p><a class="btn" href="#/diagnostic/${s.name}">Resume your ${esc(s.name)} diagnostic</a></p>` : ""}
      <p class="small">Take one part at a time (${perPartText()}):</p>
      ${partListHtml(s, latest)}
      <p class="small">Or take all ${n} parts in a row, with a break after each: usually about ${n * 9} to ${n * 13} questions, never more than ${n * maxPer()}.</p>
      <div class="spacer"></div><a class="btn secondary" href="#/diagnostic/${s.name}/all">All ${n} parts of ${s.name}</a>
      ${t ? `<p class="small muted">The real TEAS ${s.name} section has ${t.questions} questions in ${t.minutes} minutes.</p>` : ""}</div>`;
  }).join("");
  setView(`<h1>Diagnostic</h1>
    <p class="lead">Find out where you stand in each part of a section. As on the real test, you won't see whether you got a question right until you finish the part.</p>
    <p class="small muted">Each part has ${DCFG.minPerSubarea} to ${maxPer()} questions. A part stops early when more questions would be very unlikely to change your result. Results come as practice bands (<em>Build the basics</em>, <em>Getting there</em>, <em>Strong</em>), not a predicted TEAS score.</p>
    <div class="cards">${cards}</div>`, "Diagnostic");
}

// #/diagnostic/<Section>            resume a run in progress, or choose
// #/diagnostic/<Section>/all        start page for all parts in a row
// #/diagnostic/<Section>/<S.2>      start page for one part
function viewDiagnostic(sectionName, which) {
  navHighlight("diagnostic");
  const section = sectionOf(sectionName);
  if (!section) return viewNotFound();
  const cur = state.current && !state.current.finished ? state.current : null;
  if (!which) {
    if (cur && cur.section === sectionName) return runDiagnostic();
    return setView(`<h1>${esc(sectionName)} diagnostic</h1>
      <p class="lead">Take one part at a time (${perPartText()}), or all ${section.subareas.length} parts in a row with a break after each.</p>
      ${partListHtml(section, latestByPart())}
      <div class="btn-row"><a class="btn" href="#/diagnostic/${sectionName}/all">All ${section.subareas.length} parts of ${esc(sectionName)}</a><a class="btn secondary" href="#/diagnostic">Back</a></div>`, `${sectionName} diagnostic`);
  }
  const all = which === "all";
  const part = all ? null : section.subareas.find((x) => x.code === which);
  if (!all && !part) return viewNotFound();
  const n = all ? section.subareas.length : 1;
  const title = all ? `${sectionName} diagnostic: all ${n} parts` : `${sectionName} diagnostic: ${part.code} ${part.name}`;
  setView(`<h1>${esc(title)}</h1>
    <p class="lead">${all
      ? `${n} parts, one after another, each ${perPartText()}. Usually about ${n * 9} to ${n * 13} questions in all (never more than ${n * maxPer()}), about ${n * 10} to ${n * 15} minutes. After each part you'll see how you did and can take a break; your place is saved.`
      : `${perPartText()}. You'll see how you did as soon as you finish.`}</p>
    <ul>
      <li>A part stops early when more questions would be very unlikely to change your result. If your results land near the line between two bands, expect all ${maxPer()}.</li>
      <li>Work at your own pace. There's no timer. You can leave and come back; your place is saved in this browser.</li>
      <li>You can't go back to change an answer.</li>
      <li>Use scratch paper. For Math you may use a basic calculator, as on the real TEAS.</li>
      ${sectionName === "Reading" ? "<li>Some questions come with a passage. On a wide screen, the passage stays beside the question.</li>" : ""}
    </ul>
    ${config.reviewPendingSections.includes(sectionName) ? `<p class="notice">${esc(sectionName)} questions are new and still being reviewed by ESCC faculty.</p>` : ""}
    ${cur ? `<p class="notice">You have an unfinished ${esc(cur.section)} diagnostic. Starting this one ends it; any parts you already finished stay saved.</p>` : ""}
    <div class="btn-row"><button class="btn" id="start">Start</button><a class="btn secondary" href="#/diagnostic">Back</a></div>`, title);
  document.getElementById("start").addEventListener("click", () => {
    // prefer questions this student hasn't met yet, in earlier diagnostics or in practice
    if (state.current && !state.current.finished) saveRunRecord(state.current); // keep any finished parts
    const seen = new Set([...state.diagnostics.flatMap((d) => d.items || []), ...state.attempts.map((a) => a.id)]);
    state.current = core.newDiagnostic(bank, sectionName, DCFG, { seed: newSeed(), seen, parts: all ? null : [part.code] });
    save();
    location.hash = `#/diagnostic/${sectionName}`;
  });
}

// Save the finished parts of a run as a diagnostic record (updated as each part ends).
function saveRunRecord(s) {
  const results = core.diagnosticResults(s, bank, DCFG, { all: false });
  let idx = state.diagnostics.findIndex((d) => d.seed === s.seed);
  if (!results.length && idx === -1) return -1;
  const old = idx === -1 ? null : state.diagnostics[idx];
  const now = Date.now();
  const rec = {
    section: s.section,
    date: now,
    seed: s.seed,
    parts: (s.parts || []).slice(),
    results: results.map((r) => ({
      code: r.code, n: r.n, correct: r.correct, band: r.band.id, stoppedEarly: r.stoppedEarly, nearCutoff: r.nearCutoff,
      date: old?.results.find((x) => x.code === r.code)?.date || now, // when this part finished
    })),
    items: s.answers.map((a) => a.id),
    answers: s.answers.slice(),
  };
  if (idx === -1) { state.diagnostics.push(rec); idx = state.diagnostics.length - 1; } else state.diagnostics[idx] = rec;
  return idx;
}

function runDiagnostic() {
  const s = state.current;
  if (s.breakAfter) return showPartBreak();
  const idx = core.nextIndex(s, bank);
  if (idx === -1) return finishDiagnostic();
  const item = byId[s.order[idx]];
  const order = core.displayOrder(item, s.seed);
  const parts = core.sessionParts(s, bank);
  const cur = parts.find((p) => p.current);
  const doneShare = (parts.filter((p) => p.done).length + Math.min(cur.n / Math.max(cur.total, 1), 0.95)) / parts.length;
  let response = null;
  const partText = parts.length > 1 ? `Part ${cur.number} of ${parts.length}: ${esc(cur.name)}` : `${esc(cur.code)} ${esc(cur.name)}`;
  setView(`<h1 class="sr-only">${esc(s.section)} diagnostic, ${partText}, question ${cur.n + 1}</h1>
    <div class="q-head"><span><strong>${esc(s.section)}</strong> · ${partText}</span><span>Question ${cur.n + 1} of ${Math.min(DCFG.minPerSubarea, cur.total) < cur.total ? `up to ${cur.total}` : cur.total}</span></div>
    <div class="progressbar" role="progressbar" aria-label="Diagnostic progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(doneShare * 100)}"><span style="width:${(doneShare * 100).toFixed(1)}%"></span></div>
    <form id="qform">${itemHtml(item, { order, response, passageRepeat: passageRepeat(item) })}
      <div class="btn-row action-bar"><button class="btn" type="submit" id="submit" disabled>Submit answer</button>
      <button class="btn link" type="button" id="quit">Stop this diagnostic</button></div></form>
    <p class="small muted">Your place is saved. You can close this page and come back later.</p>`, `${s.section} diagnostic`);
  const form = document.getElementById("qform");
  const submit = document.getElementById("submit");
  bindItem(form, item, { order, response, onChange: (r) => { response = r; submit.disabled = !core.isAnswered(item, r); } });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!core.isAnswered(item, response) || form.dataset.busy) return;
    form.dataset.busy = "1";
    submit.disabled = true;
    const ok = core.recordDiagnosticAnswer(s, bank, DCFG, idx, Array.isArray(response) ? response.slice() : response);
    if (ok === null) return runDiagnostic();
    logAttempt(item, ok, "d");
    if (s.breakAfter || s.finished) saveRunRecord(s);
    save();
    runDiagnostic();
  });
  document.getElementById("quit").addEventListener("click", () => {
    const anyDone = parts.some((p) => p.done);
    confirmInline(form, anyDone
      ? "Stop this diagnostic? The parts you finished stay saved; the part you're in now won't count."
      : "Stop this diagnostic? Your answers in this part won't be kept as a result.");
  });
}

// Between parts: show how the part went and offer a break.
function showPartBreak() {
  const s = state.current;
  const parts = core.sessionParts(s, bank);
  const done = parts.find((p) => p.code === s.breakAfter);
  const next = parts.find((p) => p.current);
  const r = core.diagnosticResults(s, bank, DCFG).find((x) => x.code === s.breakAfter);
  setView(`<h1>Part ${done.number} of ${parts.length} done</h1>
    <p class="lead">${esc(done.code)} ${esc(done.name)}: ${bandChip(r.band)} ${r.correct} of ${r.n} correct.</p>
    <p>This is a good place to take a break. This part's result is saved, and when you come back you'll pick up at Part ${next.number}.</p>
    <div class="btn-row"><button class="btn" id="go-on">Continue to Part ${next.number}: ${esc(next.name)}</button><a class="btn secondary" href="#/" id="pause">Stop for now</a></div>
    <p class="small muted">Part ${next.number} has ${Math.min(DCFG.minPerSubarea, next.total) < next.total ? `${DCFG.minPerSubarea} to ${next.total}` : next.total} questions, about 10 to 15 minutes.</p>`, `${s.section} diagnostic`);
  document.getElementById("go-on").addEventListener("click", () => {
    s.breakAfter = null;
    save();
    runDiagnostic();
  });
}

// small inline confirm (avoids window.confirm dialogs)
function confirmInline(anchor, text) {
  let box = document.getElementById("confirm-box");
  if (box) box.remove();
  box = document.createElement("div");
  box.id = "confirm-box";
  box.className = "notice";
  box.innerHTML = `<p>${esc(text)}</p><div class="btn-row" style="margin:8px 0 0"><button class="btn" type="button" data-yes>Yes, stop</button><button class="btn secondary" type="button" data-no>Keep going</button></div>`;
  anchor.after(box);
  box.querySelector("[data-no]").addEventListener("click", () => box.remove());
  box.querySelector("[data-yes]").addEventListener("click", () => {
    if (state.current) saveRunRecord(state.current); // keep any finished parts
    state.current = null;
    save();
    location.hash = "#/diagnostic";
  });
  box.querySelector("[data-no]").focus();
  return false;
}

function finishDiagnostic() {
  const s = state.current;
  const idx = saveRunRecord(s);
  state.current = null;
  save();
  location.hash = idx === -1 ? "#/diagnostic" : `#/results/${idx}`;
}

function viewResults(i) {
  navHighlight("progress");
  const rec = state.diagnostics[Number(i)];
  if (!rec) return viewNotFound();
  const section = sectionOf(rec.section);
  const cur = state.current && !state.current.finished && state.current.seed === rec.seed ? state.current : null;
  const planned = rec.parts && rec.parts.length ? rec.parts : section.subareas.map((x) => x.code);
  const rows = section.subareas.map((sub) => {
    const r = rec.results.find((x) => x.code === sub.code);
    if (!r) {
      const action = planned.includes(sub.code) && cur
        ? `<a href="#/diagnostic/${rec.section}">Continue this diagnostic</a>`
        : `<a href="#/diagnostic/${rec.section}/${sub.code}">Take this part</a>`;
      return `<tr><th scope="row">${esc(sub.code)} ${esc(sub.name)}</th><td data-label="Band">${bandChip(null)}</td><td data-label="Score">—</td><td data-label="Note" class="small">${action}</td></tr>`;
    }
    const note = r.nearCutoff ? "Close to the line between two bands" : r.stoppedEarly ? "Stopped early: more questions were very unlikely to change the band" : "";
    return `<tr><th scope="row">${esc(r.code)} ${esc(sub.name)}</th><td data-label="Band">${bandChip(bandById(r.band))}</td>
      <td data-label="Score">${r.correct} of ${r.n} correct (${pct(r.correct, r.n)}%)</td><td data-label="Note" class="small muted">${note}</td></tr>`;
  }).join("");
  const doneCodes = new Set(rec.results.map((r) => r.code));
  const answers = rec.answers.filter((a) => byId[a.id] && doneCodes.has(byId[a.id].subarea));
  const missed = {};
  for (const a of answers) if (!a.correct) { const o = byId[a.id].objective; missed[o] = (missed[o] || 0) + 1; }
  const missedList = Object.keys(missed).sort();
  const review = answers.map((a) => {
    const it = byId[a.id];
    const k = rec.answers.indexOf(a);
    return `<details class="review-item" data-k="${k}"><summary>${a.correct ? '<span class="ok-mark">✓</span>' : '<span class="bad-mark">✗</span>'} ${esc(it.subarea)} · ${it.objective} ${esc(objTitle(it.objective))}</summary><div class="review-body"></div></details>`;
  }).join("");
  const what = rec.results.length === 1 && planned.length === 1 ? partLabel(rec.results[0].code) : `${rec.results.length} of ${planned.length} part${planned.length > 1 ? "s" : ""}`;
  setView(`<h1>${esc(rec.section)} diagnostic results</h1>
    <p class="muted">${fmtDate(rec.date)} · ${esc(what)} · ${answers.length} questions</p>
    ${cur ? `<p class="notice">This diagnostic isn't finished. <a href="#/diagnostic/${rec.section}">Continue where you left off</a>.</p>` : ""}
    <div class="table-wrap"><table class="results stack"><thead><tr><th scope="col">Part</th><th scope="col">Band</th><th scope="col">Score</th><th scope="col">Note</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="small muted">Bands: <em>Build the basics</em> means under 60% correct; <em>Getting there</em>, 60% to 79%; <em>Strong</em>, 80% or more. These are practice bands for this site's questions, not a predicted TEAS score.</p>
    ${config.reviewPendingSections.includes(rec.section) ? `<p class="notice">${esc(rec.section)} questions are new and still being checked by ESCC faculty, so treat these bands as a rough guide.</p>` : ""}
    <h2>What to work on</h2>
    ${missedList.length ? `<ul class="obj-list">${missedList.map((o) => `<li><span class="obj-main"><span class="code">${o}</span>${esc(objTitle(o))}</span>
      <span><a href="${studyUrl(o)}">Study page</a> · <a href="#/practice/${o}">Practice</a></span></li>`).join("")}</ul>` : "<p>You didn't miss anything. Try another part, or practice the objectives you want to keep fresh.</p>"}
    <div class="btn-row">${sendButton()}<a class="btn secondary" href="#/practice/${rec.section}">Practice ${esc(rec.section)}</a><a class="btn secondary" href="#/diagnostic">Another diagnostic</a></div>
    <h2>Review your answers</h2><p class="small muted">Open a question to see the explanation.</p>${review}`, `${rec.section} results`);
  $main.querySelectorAll("details.review-item").forEach((d) =>
    d.addEventListener("toggle", () => {
      const body = d.querySelector(".review-body");
      if (!d.open || body.dataset.done) return;
      const a = rec.answers[Number(d.dataset.k)];
      const it = byId[a.id];
      const order = core.displayOrder(it, rec.seed);
      body.innerHTML = itemHtml(it, { order, response: a.response, locked: true, showKey: true });
      body.querySelector(".fb-slot").innerHTML = feedbackHtml(it, a.response, order);
      body.dataset.done = "1";
    })
  );
  bindSend(() => resultsPayload("Diagnostic", rec.section, rec));
}

// ------------------------------------------------------------------ practice
const sectionStats = (name) => stats(bank.items.filter((i) => i.section === name).map((i) => i.id));
const meter = (c, n) => `<span class="meter" aria-hidden="true"><span style="width:${pct(c, n)}%"></span></span>`;

function lastPracticeLink() {
  const lp = state.lastPractice;
  if (!lp) return "";
  if (lp.kind === "obj" && bank.objectives[lp.arg]) return { href: `#/practice/${lp.arg}`, label: `${lp.arg} ${objTitle(lp.arg)}` };
  if (lp.kind === "mix" && sectionOf(lp.arg)) return { href: `#/practice/mix/${lp.arg}`, label: `Quick 10: ${lp.arg}` };
  if (lp.kind === "weak" && sectionOf(lp.arg)) return { href: `#/practice/weak/${lp.arg}`, label: `Weak spots: ${lp.arg}` };
  return "";
}

function viewPracticeMenu() {
  navHighlight("practice");
  const last = lastPracticeLink();
  const sections = bank.sections.map((s) => {
    const st = sectionStats(s.name);
    const n = bank.items.filter((i) => i.section === s.name).length;
    return `<li><a class="section-btn" href="#/practice/${s.name}"><span class="sb-name">${s.name}</span>
      <span class="sb-stats">${st.n ? `${meter(st.c, st.n)}${st.c}/${st.n} right` : `${n} questions`}</span></a></li>`;
  }).join("");
  const quick = bank.sections.map((s) => `<a class="btn secondary" href="#/practice/mix/${s.name}">${s.name}</a>`).join("");
  const cur = state.current && !state.current.finished ? state.current : null;
  setView(`<h1>Practice</h1>
    ${cur ? `<p class="notice small">You have a ${esc(cur.section)} diagnostic in progress. <a href="#/diagnostic/${cur.section}">Pick up where you left off</a>.</p>` : ""}
    ${last ? `<a class="keep-going" href="${last.href}"><span class="kg-label">Keep going</span><span class="kg-what">${esc(last.label)}</span></a>` : ""}
    ${installSlot()}
    <h2 class="tight">Quick 10</h2>
    <p class="small muted">Ten mixed questions from one section. Good for a few spare minutes.</p>
    <div class="quick-row">${quick}</div>
    <h2 class="tight">By section and objective</h2>
    <ul class="section-list">${sections}</ul>
    <p class="small muted">After every answer you'll see why it's right or wrong, plus a link to that objective's study page. New questions come first, then ones you missed.</p>`, "Practice");
}

function viewPracticeSection(name) {
  navHighlight("practice");
  const sec = sectionOf(name);
  const tabs = bank.sections.map((s) => `<a href="#/practice/${s.name}" ${s.name === name ? 'aria-current="page"' : ""}>${s.name}</a>`).join("");
  const subs = sec.subareas.map((sub, k) => {
    const st = stats(bank.items.filter((i) => i.subarea === sub.code).map((i) => i.id));
    const lis = sub.objectives.map((o) => {
      const os = objectiveStats(o);
      const n = bank.items.filter((i) => i.objective === o).length;
      return `<li><a class="obj-link" href="#/practice/${o}"><span class="obj-main"><span class="code">${o}</span>${esc(objTitle(o))}</span>
        <span class="obj-stats">${os.n ? `${meter(os.c, os.n)}${os.c}/${os.n} right` : `${n} questions`}</span></a></li>`;
    }).join("");
    return `<details class="subarea" ${sec.subareas.length === 1 ? "open" : ""}><summary><span class="sa-name"><span class="code">${sub.code}</span>${esc(sub.name)}</span>
      <span class="obj-stats">${sub.objectives.length} objectives${st.n ? ` · ${st.c}/${st.n} right` : ""}</span></summary><ul class="obj-list">${lis}</ul></details>`;
  }).join("");
  setView(`<nav class="section-tabs" aria-label="Sections">${tabs}</nav>
    <h1>${esc(name)} practice</h1>
    ${config.reviewPendingSections.includes(name) ? `<p class="small muted">${esc(name)} questions are still being checked by ESCC faculty.</p>` : ""}
    <div class="quick-row"><a class="btn" href="#/practice/mix/${name}">Quick 10</a><a class="btn secondary" href="#/practice/weak/${name}">My weak spots</a></div>
    <p class="small muted">Or tap a part to see its objectives.</p>
    ${subs}`, `${name} practice`);
}

function weakObjectives(sectionName) {
  const sec = sectionOf(sectionName);
  const objs = sec.subareas.flatMap((s) => s.objectives);
  const scored = objs.map((o) => ({ o, ...objectiveStats(o) }));
  const enough = scored.filter((x) => x.n >= config.practice.minAttemptsForWeakSpot);
  enough.sort((a, b) => a.c / a.n - b.c / b.n);
  return enough.filter((x) => x.c / x.n < 0.8).slice(0, 3).map((x) => x.o);
}

function viewPractice(arg, weakSection, mixSection) {
  navHighlight("practice");
  let items, title, back, objs;
  if (mixSection) {
    if (!sectionOf(mixSection)) return viewNotFound();
    items = bank.items.filter((i) => i.section === mixSection);
    objs = [];
    title = `Quick 10: ${mixSection}`;
    back = `#/practice/${mixSection}`;
    state.lastPractice = { kind: "mix", arg: mixSection };
  } else if (weakSection) {
    if (!sectionOf(weakSection)) return viewNotFound();
    objs = weakObjectives(weakSection);
    if (!objs.length) {
      return setView(`<h1>Weak spots: ${esc(weakSection)}</h1><p>There isn't enough history yet to find weak spots. You need at least ${config.practice.minAttemptsForWeakSpot} answers in an objective, and your score there has to be under 80%. Take the ${esc(weakSection)} diagnostic or practice a few objectives first.</p>
        <div class="btn-row"><a class="btn" href="#/diagnostic/${weakSection}">${esc(weakSection)} diagnostic</a><a class="btn secondary" href="#/practice">Back to practice</a></div>`, "Weak spots");
    }
    items = bank.items.filter((i) => objs.includes(i.objective));
    title = `Weak spots: ${weakSection}`;
    back = `#/practice/${weakSection}`;
    state.lastPractice = { kind: "weak", arg: weakSection };
  } else {
    const obj = bank.objectives[arg];
    if (!obj) return viewNotFound();
    objs = [arg];
    items = bank.items.filter((i) => i.objective === arg);
    title = `${arg} ${objTitle(arg)}`;
    back = `#/practice/${obj.section}`;
    state.lastPractice = { kind: "obj", arg };
  }
  save();
  const seed = newSeed();
  let queue = core.practiceQueue(items, state.attempts, seed);
  if (weakSection || mixSection) queue = queue.slice(0, config.practice.weakSpotSessionLength);
  const session = { pos: 0, right: 0, done: 0 };

  const showNext = () => {
    if (session.pos >= queue.length) return showEnd();
    const item = byId[queue[session.pos]];
    const order = core.displayOrder(item, seed);
    let response = null;
    const sub = objs.length === 1
      ? `<a href="${studyUrl(objs[0])}">Study page</a>`
      : objs.length ? `Mixing ${objs.map((o) => `<a href="${studyUrl(o)}">${o}</a>`).join(", ")}` : `${item.objective} ${esc(objTitle(item.objective))} · <a href="${studyUrl(item.objective)}">Study page</a>`;
    setView(`<div class="practice-top"><a class="back" href="${back}" aria-label="Back to ${esc(item.section)} practice">‹ ${esc(item.section)}</a>
        <span class="q-count">${session.pos + 1} of ${queue.length}${session.done ? ` · ${session.right} right` : ""}</span></div>
      <h1 class="practice-h">${esc(title)}</h1>
      <p class="small muted practice-sub">${sub}</p>
      <form id="qform">${itemHtml(item, { order, response, passageRepeat: passageRepeat(item) })}
        <div class="btn-row action-bar"><button class="btn" type="submit" id="submit" disabled>Check answer</button><a class="btn link" href="${back}">Finish</a></div></form>`, title);
    const form = document.getElementById("qform");
    const submit = document.getElementById("submit");
    bindItem(form, item, { order, response, onChange: (r) => { response = r; submit.disabled = !core.isAnswered(item, r); } });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (form.dataset.checked) { session.pos++; return showNext(); }
      if (!core.isAnswered(item, response)) return;
      const ok = core.grade(item, response);
      logAttempt(item, ok, "p");
      save();
      session.done++;
      if (ok) session.right++;
      form.dataset.checked = "1";
      // lock the item and show the key
      const holder = form.querySelector(".q-layout");
      const tmp = document.createElement("div");
      const wasOpen = !!form.querySelector("details.passage-repeat[open]");
      tmp.innerHTML = itemHtml(item, { order, response, locked: true, showKey: true, passageRepeat: !!form.querySelector("details.passage-repeat") });
      if (wasOpen) tmp.querySelector("details.passage-repeat")?.setAttribute("open", "");
      holder.replaceWith(tmp.firstElementChild);
      form.querySelector(".fb-slot").innerHTML = feedbackHtml(item, response, order);
      announce(ok ? "Correct." : "Not quite. The correct answer and an explanation are below.");
      markWideTables();
      submit.textContent = session.pos + 1 < queue.length ? "Next question" : "See summary";
      submit.focus();
      form.querySelector(".feedback").scrollIntoView({ block: "nearest" });
    });
  };

  const showEnd = () => {
    setView(`<h1>${esc(title)}</h1>
      <p class="lead">You got ${session.right} of ${session.done} right this round.</p>
      <div class="btn-row"><a class="btn" href="${location.hash}" id="again">${mixSection ? "Another Quick 10" : "Practice again"}</a>
      ${objs.length === 1 ? `<a class="btn secondary" href="${studyUrl(objs[0])}">Study page</a>` : ""}
      <a class="btn secondary" href="${back}">Back to ${esc(sectionOf(mixSection || weakSection || bank.objectives[objs[0]]?.section)?.name || "practice")}</a></div>`, title);
    document.getElementById("again").addEventListener("click", (e) => { e.preventDefault(); route(); });
  };
  showNext();
}

// ------------------------------------------------------------------ progress
function viewProgress() {
  navHighlight("progress");
  const diag = state.diagnostics.map((d, i) => ({ d, i })).reverse();
  const latest = latestByPart();
  const sections = bank.sections.map((s) => {
    const dates = s.subareas.map((x) => latest[x.code]?.date).filter(Boolean);
    const lastDate = dates.length ? Math.max(...dates) : null;
    const rows = s.subareas.map((sub) => {
      const l = latest[sub.code];
      const r = l?.r;
      const since = l ? state.attempts.filter((a) => a.m === "p" && a.t > l.date && byId[a.id]?.subarea === sub.code) : [];
      const sc = since.filter((a) => a.ok).length;
      const all = stats(bank.items.filter((i) => i.subarea === sub.code).map((i) => i.id));
      return `<tr><th scope="row">${sub.code} ${esc(sub.name)}</th><td data-label="Diagnostic band">${r ? bandChip(bandById(r.band)) : `${bandChip(null)} <a class="small" href="#/diagnostic/${s.name}/${sub.code}">Take this part</a>`}</td>
        <td data-label="Since then" class="small">${since.length ? `${sc}/${since.length} right in practice since then` : l ? "No practice since" : "—"}</td>
        <td data-label="All answers" class="small">${all.n ? `${all.c}/${all.n} overall (${pct(all.c, all.n)}%)` : "—"}</td></tr>`;
    }).join("");
    return `<h3>${s.name}${lastDate ? ` <span class="small muted">· last diagnostic ${fmtDate(lastDate)}</span>` : ""}</h3>
      <div class="table-wrap"><table class="results stack"><thead><tr><th scope="col">Part</th><th scope="col">Diagnostic band</th><th scope="col">Since then</th><th scope="col">All answers</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }).join("");
  const history = diag.length
    ? `<ul class="obj-list">${diag.map(({ d, i }) => `<li><span class="obj-main"><a href="#/results/${i}">${esc(d.section)} diagnostic</a> · ${fmtDate(d.date)}${d.results.length < (d.parts && d.parts.length ? d.parts.length : sectionOf(d.section).subareas.length) ? ` <span class="small muted">(${d.results.length} of ${d.parts && d.parts.length ? d.parts.length : sectionOf(d.section).subareas.length} parts)</span>` : ""}</span><span class="obj-stats">${d.results.map((r) => `${esc(r.code)} ${bandChip(bandById(r.band))}`).join(" ")}</span></li>`).join("")}</ul>`
    : "<p>No diagnostics yet.</p>";
  setView(`<h1>My progress</h1>
    <p class="lead">${state.attempts.length} questions answered on this device. Nothing is sent anywhere unless you choose to send it.</p>
    ${sections}
    <h2>Diagnostic history</h2>${history}
    <div class="btn-row">${sendButton()}</div>
    <h2 id="move">Move your progress</h2>
    <p class="small muted">Progress lives in this browser only. To move it to another phone, another browser, or the home-screen app, copy it here and paste it there.</p>
    <div class="btn-row"><button class="btn secondary" id="copy-progress">Copy my progress</button><span id="copy-msg" class="small" aria-live="polite"></span></div>
    <div class="btn-row"><button class="btn" id="paste-direct" hidden>Paste my progress</button></div>
    <label class="paste-label" for="paste-progress">Or paste it here</label>
    <textarea id="paste-progress" class="paste-box" rows="3" placeholder="Press and hold here, then tap Paste" autocomplete="off" spellcheck="false"></textarea>
    <div class="btn-row"><button class="btn secondary" id="paste-load">Load pasted progress</button></div>
    <details class="small"><summary>Use a file instead</summary>
      <div class="btn-row"><button class="btn secondary" id="export">Download my progress</button>
      <label class="btn secondary" for="import">Load progress from a file</label><input id="import" type="file" class="sr-only"></div>
      <p class="muted">On an iPhone, downloads go to the Files app, in Downloads.</p></details>
    <div id="io-msg" aria-live="polite"></div>
    <h2>Clear your progress</h2>
    <div class="btn-row"><button class="btn link" id="clear">Clear all my progress</button></div>`, "My progress");
  if (location.hash.endsWith("#move")) document.getElementById("move")?.scrollIntoView();
  document.getElementById("export").addEventListener("click", downloadProgress);
  document.getElementById("copy-progress").addEventListener("click", () => {
    const ok = copyProgress();
    document.getElementById("copy-msg").textContent = ok === true
      ? "Copied. Now open the other browser or the app, go to My progress, and paste."
      : "";
  });
  const merged = (text, how) => {
    const msg = document.getElementById("io-msg");
    if (mergeProgress(text)) {
      viewProgress();
      document.getElementById("io-msg").innerHTML = `<p class="notice">Progress loaded and combined with what was already here.</p>`;
    } else {
      msg.innerHTML = `<p class="notice">That ${how} doesn't look like TEAS Prep progress. ${how === "text" ? "Copy it again with Copy my progress, then paste the whole thing." : ""}</p>`;
    }
  };
  document.getElementById("paste-load").addEventListener("click", () => merged(document.getElementById("paste-progress").value, "text"));
  // one tap: read the clipboard (the phone asks to confirm with its own Paste button)
  const direct = document.getElementById("paste-direct");
  if (navigator.clipboard && navigator.clipboard.readText && window.isSecureContext) {
    direct.hidden = false;
    direct.addEventListener("click", () => {
      navigator.clipboard.readText().then((t) => merged(t, "text"), () => {
        document.getElementById("io-msg").innerHTML = `<p class="notice">Your phone didn't share the clipboard. Press and hold in the box below, tap Paste, then Load pasted progress.</p>`;
      });
    });
  }
  document.getElementById("import").addEventListener("change", async (e) => {
    const f = e.target.files[0];
    if (f) merged(await f.text(), "file");
  });
  document.getElementById("clear").addEventListener("click", (e) => {
    const box = document.getElementById("io-msg");
    box.innerHTML = `<div class="notice"><p>Delete all progress saved in this browser? This can't be undone. Download it first if you might want it later.</p>
      <div class="btn-row" style="margin:8px 0 0"><button class="btn" id="clear-yes">Delete everything</button><button class="btn secondary" id="clear-no">Cancel</button></div></div>`;
    document.getElementById("clear-no").onclick = () => (box.innerHTML = "");
    document.getElementById("clear-yes").onclick = () => { state = blank(); save(); viewProgress(); };
    document.getElementById("clear-no").focus();
  });
  bindSend(() => resultsPayload("Progress summary", "All", null));
}

// ------------------------------------------------------------------ Google Form
const formOn = () => !!(config.resultsForm.url && config.resultsForm.fields.summary);
function sendButton() {
  return formOn() ? `<button class="btn" type="button" id="send">Send my results to ESCC (optional)</button>` : "";
}

function resultsPayload(kind, section, rec) {
  const lines = [];
  if (rec) {
    lines.push(`${rec.section} diagnostic ${new Date(rec.date).toISOString().slice(0, 10)}: ` +
      rec.results.map((r) => `${r.code} ${bandById(r.band)?.label} (${r.correct}/${r.n})`).join("; "));
  } else {
    const latest = latestByPart();
    for (const sec of bank.sections) {
      const have = sec.subareas.filter((x) => latest[x.code]);
      if (have.length)
        lines.push(`${sec.name}: ` + have.map((x) => { const { r, date } = latest[x.code]; return `${r.code} ${bandById(r.band)?.label} (${r.correct}/${r.n}, ${new Date(date).toISOString().slice(0, 10)})`; }).join("; "));
    }
    lines.push(`Questions answered: ${state.attempts.length}`);
  }
  const details = [];
  const doneParts = rec ? new Set(rec.results.map((r) => r.code)) : null;
  const objs = rec ? [...new Set(rec.answers.filter((a) => !a.correct && byId[a.id] && doneParts.has(byId[a.id].subarea)).map((a) => byId[a.id].objective))] : null;
  if (objs) details.push(`Missed objectives: ${objs.join(", ") || "none"}`);
  else {
    const per = Object.keys(bank.objectives).map((o) => ({ o, ...objectiveStats(o) })).filter((x) => x.n);
    details.push(per.map((x) => `${x.o} ${x.c}/${x.n}`).join("; "));
  }
  return { kind, section, summary: lines.join("\n"), details: details.join("\n").slice(0, 1200) };
}

function formUrl(payload, profile) {
  try {
    const f = config.resultsForm.fields;
    const u = new URL(config.resultsForm.url);
    u.searchParams.set("usp", "pp_url");
    const put = (field, val) => { if (field && val) u.searchParams.set(field, val); };
    put(f.name, profile.name);
    put(f.email, profile.email);
    put(f.program, profile.program);
    put(f.kind, payload.kind);
    put(f.section, payload.section);
    put(f.summary, payload.summary);
    put(f.details, payload.details);
    return u.toString();
  } catch {
    return null;
  }
}

function bindSend(payloadFn) {
  const btn = document.getElementById("send");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const p = state.profile || {};
    const payload = payloadFn();
    const dlg = document.createElement("dialog");
    dlg.setAttribute("aria-labelledby", "send-h");
    dlg.innerHTML = `<h2 id="send-h" style="margin-top:0">Send results to ESCC</h2>
      <p class="small">This opens a Google Form with your results filled in. Check it, then press Submit there. Nothing is sent until you do. Name and email are optional; add them if you'd like someone from ESCC to follow up.</p>
      <div class="form-row"><label for="f-name">Name (optional)</label><input id="f-name" autocomplete="name" value="${esc(p.name || "")}"></div>
      <div class="form-row"><label for="f-email">Email (optional)</label><input id="f-email" type="email" autocomplete="email" value="${esc(p.email || "")}"></div>
      <div class="form-row"><label for="f-prog">Program you're aiming for</label><select id="f-prog"><option value="">Choose…</option>${config.programs.map((x) => `<option ${p.program === x ? "selected" : ""}>${esc(x)}</option>`).join("")}</select></div>
      <details class="small"><summary>What will be sent</summary><pre class="payload">${esc(payload.summary)}\n${esc(payload.details)}</pre></details>
      <div class="btn-row"><a class="btn" id="f-go" target="_blank" rel="noopener">Open the form (new tab)</a><button class="btn secondary" type="button" id="f-cancel">Close</button></div>
      <p class="small" id="f-err" hidden>The form link isn't set up correctly. Please tell your instructor.</p>`;
    document.body.appendChild(dlg);
    const go = dlg.querySelector("#f-go");
    const update = () => {
      state.profile = { name: dlg.querySelector("#f-name").value.trim(), email: dlg.querySelector("#f-email").value.trim(), program: dlg.querySelector("#f-prog").value };
      const url = formUrl(payload, state.profile);
      if (url) go.href = url;
      else { go.removeAttribute("href"); dlg.querySelector("#f-err").hidden = false; }
    };
    dlg.querySelectorAll("input, select").forEach((el) => el.addEventListener("input", update));
    update();
    go.addEventListener("click", () => { save(); setTimeout(() => dlg.close(), 100); });
    dlg.querySelector("#f-cancel").addEventListener("click", () => dlg.close());
    dlg.addEventListener("close", () => { save(); dlg.remove(); btn.focus(); });
    dlg.showModal();
  });
}

// ------------------------------------------------------------------ about / 404
function viewAbout() {
  navHighlight("");
  setView(`<h1>About this site</h1>
    <p>ESCC TEAS Prep is free practice for the ATI TEAS 7, written for Eastern Shore Community College students and applicants. It covers all four TEAS sections: Reading, Math, Science and English and Language Usage. There are ${bank.items.length} practice questions, ${Object.keys(bank.passages).length} original reading passages, and a study page for each of the ${Object.keys(bank.objectives).length} TEAS objectives.</p>
    <h2>How the diagnostic works</h2>
    <p>Each section's diagnostic is split into parts (for example, Science has four). You can take one part at a time or a whole section with a break after each part. Each part asks ${DCFG.minPerSubarea} to ${Math.min(DCFG.maxPerSubarea, bank.diagnosticMaxPerSubarea)} questions. A part stops early only when more questions would be very unlikely to change your band; students near the line between two bands usually answer all of them. If you take a diagnostic again, you get mostly questions you haven't seen.</p>
    <p>Results are given as bands, not scores: <em>Build the basics</em> (under 60% correct), <em>Getting there</em> (60% to 79%) and <em>Strong</em> (80% or more). The bands describe how you did on this site's questions. They aren't a prediction of your TEAS score; that will come only after these results are checked against real TEAS scores.</p>
    ${coachOn() ? `<h2>The TEAS Coach</h2><p>After any practice question, or any question when you review a diagnostic, you can ask the ${esc(config.coach.name)}, an AI tutor in Google Gemini, to help you with it. The site copies the question and your answer, and you paste it into the Coach. The Coach uses ESCC's study pages and is set up to make you think first rather than hand over answers. It can still make mistakes; if it disagrees with the site's answer, tell your instructor the question ID. You need to be signed in with your VCCS student Google account; if you're not, Gemini opens without the Coach (the top of the chat will just say Gemini). If you don't have one yet, everything else on this site still works.</p>` : ""}
    <h2>Your privacy</h2>
    <p>There's no login. Your answers are stored only in this browser, on this device. If you clear your browser data, your progress is erased, so use <a href="#/progress">My progress</a> to download a copy. Results are sent to ESCC only if you choose to, through a Google Form you submit yourself.${coachOn() ? " If you use the TEAS Coach, what you paste and type there goes to Google Gemini under your VCCS account, not to this site." : ""}</p>
    <h2>Credits</h2>
    <p>Questions, passages and study pages were written for ESCC. Some study-page figures come from OpenStax textbooks (CC BY 4.0) and are credited where used. TEAS is a registered trademark of ATI. This site is not affiliated with or endorsed by ATI.</p>
    <p class="small muted">Question bank built ${esc(bank.built)}.</p>`, "About");
}
function viewNotFound() {
  setView(`<h1>Page not found</h1><p><a href="#/">Go to the home page</a></p>`, "Not found");
}

// ------------------------------------------------------------------ router
function route() {
  const h = location.hash.replace(/^#/, "").split("#")[0];
  const parts = h.split("/").filter(Boolean).map(decodeURIComponent);
  try {
    if (!parts.length) return viewHome();
    switch (parts[0]) {
      case "diagnostic": return parts[1] ? viewDiagnostic(parts[1], parts[2]) : viewDiagnosticMenu();
      case "results": return viewResults(parts[1]);
      case "practice":
        if (parts[1] === "continue") {
          const l = lastPracticeLink();
          if (l) { location.replace(l.href); return; }
          return viewPracticeMenu();
        }
        if (parts[1] === "weak") return viewPractice(null, parts[2]);
        if (parts[1] === "mix") return viewPractice(null, null, parts[2]);
        if (parts[1] && sectionOf(parts[1])) return viewPracticeSection(parts[1]);
        return parts[1] ? viewPractice(parts[1]) : viewPracticeMenu();
      case "progress": return viewProgress();
      case "about": return viewAbout();
      case "coach": return viewCoach();
      default: return viewNotFound();
    }
  } catch (err) {
    console.error(err);
    setView(`<h1>Something went wrong</h1><p>Sorry, that page hit an error. <a href="#/">Go home</a>. If it keeps happening, tell your instructor which page it was.</p>`);
  }
}

async function start() {
  load();
  if (!storageOk) document.getElementById("storage-warning").hidden = false;
  try {
    const [b, t] = await Promise.all([
      fetch("data/bank.json", { cache: "no-cache" }).then((r) => r.json()),
      fetch("study/titles.json").then((r) => (r.ok ? r.json() : {})).catch(() => ({})),
    ]);
    bank = b;
    studyTitles = t;
    byId = core.itemIndex(bank);
  } catch (e) {
    $main.innerHTML = `<h1>Couldn't load the questions</h1><p>Check your internet connection and reload the page.</p>`;
    return;
  }
  if (coachOn()) {
    document.querySelector(".site-header nav")?.insertAdjacentHTML("beforeend",
      `<a class="nav-coach" data-nav="coach"><span class="long">${esc(config.coach.name)}</span><span class="short">Coach</span><span class="nav-ext" aria-hidden="true"> ↗</span><span class="sr-only nav-ext-sr"> (opens Google Gemini in a new tab)</span></a>`);
  }
  // drop anything that doesn't match this bank (old saves, edited files)
  state = sanitize(state);
  updateCoachNav();
  document.querySelector(".skip")?.addEventListener("click", (e) => { e.preventDefault(); $main.focus(); });
  window.addEventListener("hashchange", route);
  route();
}
start();
