// ESCC TEAS Prep: single-page app (hash routes). Logic lives in core.js.
import * as core from "./core.js";
import config from "./config.js";

const { escapeHtml: esc, renderRich } = core;
const $main = document.getElementById("main");
const DCFG = config.diagnostic;
let bank = null;
let byId = {};
let studyTitles = {};

// ------------------------------------------------------------------ storage
const KEY = "escc-teas-prep:v1";
const blank = () => ({ v: 1, attempts: [], diagnostics: [], current: null, profile: {} });
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
        results: d.results.filter((r) => r && codes.has(r.code) && num(r.n) && num(r.correct) && bandIds.has(r.band))
          .map((r) => ({ code: r.code, n: r.n, correct: r.correct, band: r.band, stoppedEarly: !!r.stoppedEarly, nearCutoff: !!r.nearCutoff })),
        items: (Array.isArray(d.items) ? d.items : []).filter((id) => byId[id]),
        answers: (Array.isArray(d.answers) ? d.answers : []).filter((a) => a && byId[a.id] && typeof a.correct === "boolean")
          .map((a) => ({ id: a.id, correct: a.correct, response: Array.isArray(a.response) ? a.response.filter((x) => typeof x === "string") : typeof a.response === "string" ? a.response : null })),
      };
    });
  const p = data.profile && typeof data.profile === "object" ? data.profile : {};
  out.profile = { name: String(p.name || "").slice(0, 100), email: String(p.email || "").slice(0, 100), program: String(p.program || "").slice(0, 60) };
  const lp = data.lastPractice;
  out.lastPractice = lp && ["obj", "mix", "weak"].includes(lp.kind) && typeof lp.arg === "string" ? { kind: lp.kind, arg: lp.arg } : null;
  out.current = data.current && typeof data.current === "object" && Array.isArray(data.current.order) && data.current.order.every((id) => byId[id]) ? data.current : null;
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
  </div>`;
}

// ------------------------------------------------------------------ home
function viewHome() {
  navHighlight("");
  const cur = state.current;
  const last = {};
  for (const d of state.diagnostics) last[d.section] = d;
  const sectionCards = bank.sections.map((s) => {
    const d = last[s.name];
    return `<div class="card"><h3>${s.name}</h3>
      <p class="small muted">${s.subareas.map((x) => esc(x.name)).join(" · ")}</p>
      ${d ? `<p class="small">Last diagnostic ${fmtDate(d.date)}: ${d.results.map((r) => `${esc(r.code)} ${bandChip(bandById(r.band))}`).join(" ")}</p>` : `<p class="small muted">No diagnostic yet.</p>`}
      <div class="spacer"></div>
      <div class="btn-row" style="margin:6px 0 0"><a class="btn" href="#/diagnostic/${s.name}">Diagnostic</a><a class="btn secondary" href="#/practice/${s.name}">Practice</a></div></div>`;
  }).join("");
  setView(`
    <h1>Free TEAS 7 practice</h1>
    <p class="lead">From Eastern Shore Community College, for anyone preparing for the ATI TEAS: LPN, RN, dental hygiene and other programs. No login, and nothing to buy.</p>
    <p class="small muted">Your progress is saved in this browser on this device only. Clearing your browser data erases it; <a href="#/progress">My progress</a> lets you download a copy.</p>
    ${cur && !cur.finished ? `<p class="notice">You have a ${esc(cur.section)} diagnostic in progress. <a href="#/diagnostic/${cur.section}">Pick up where you left off</a>.</p>` : ""}
    ${(() => { const l = lastPracticeLink(); return l ? `<a class="keep-going" href="${l.href}"><span class="kg-label">Keep practicing</span><span class="kg-what">${esc(l.label)}</span></a>` : ""; })()}
    <div class="cards">
      <div class="card"><h2>1. Take a diagnostic</h2><p>A practice test for one section (Reading, Math, Science or English). It shows where you stand in each part of the section, so you know what to study. Allow 20 to 60 minutes.</p><div class="spacer"></div><a class="btn" href="#/diagnostic">Start a diagnostic</a></div>
      <div class="card"><h2>2. Practice by objective</h2><p>Questions for each of the 64 TEAS objectives, with an explanation for every answer you pick.</p><div class="spacer"></div><a class="btn" href="#/practice">Practice</a></div>
      <div class="card"><h2>3. Study pages</h2><p>A short page for each objective with figures, quick checks and links to free textbooks.</p><div class="spacer"></div><a class="btn" href="study/index.html">Study pages</a></div>
    </div>
    <h2>Sections</h2>
    <div class="cards">${sectionCards}</div>`);
}

// ------------------------------------------------------------------ diagnostic
function viewDiagnosticMenu() {
  navHighlight("diagnostic");
  const cards = bank.sections.map((s) => {
    const max = s.subareas.length * Math.min(DCFG.maxPerSubarea, bank.diagnosticMaxPerSubarea);
    const min = s.subareas.length * DCFG.minPerSubarea;
    const t = s.teas;
    return `<div class="card"><h2>${s.name}</h2>
      <p>${s.subareas.length} parts: ${s.subareas.map((x) => esc(x.name)).join("; ")}.</p>
      <p class="small muted">${min} to ${max} questions. ${t ? `The real TEAS ${s.name} section has ${t.questions} questions in ${t.minutes} minutes.` : ""}</p>
      <div class="spacer"></div><a class="btn" href="#/diagnostic/${s.name}">${state.current && state.current.section === s.name && !state.current.finished ? "Resume" : "Start"} ${s.name}</a></div>`;
  }).join("");
  setView(`<h1>Diagnostic</h1>
    <p class="lead">Pick a section. You'll answer questions from every part of that section, and you'll see how you did in each part at the end. No answers are shown until then, like the real test.</p>
    <p class="small muted">Results come as practice bands (<em>Build the basics</em>, <em>Getting there</em>, <em>Strong</em>), not a predicted TEAS score. The bands haven't been matched to real TEAS scores yet.</p>
    <div class="cards">${cards}</div>`, "Diagnostic");
}

function viewDiagnostic(sectionName) {
  navHighlight("diagnostic");
  const section = sectionOf(sectionName);
  if (!section) return viewNotFound();
  const cur = state.current;
  if (cur && cur.section === sectionName && !cur.finished) return runDiagnostic();
  const other = cur && !cur.finished ? cur.section : null;
  setView(`<h1>${sectionName} diagnostic</h1>
    <p class="lead">${DCFG.minPerSubarea} to ${Math.min(DCFG.maxPerSubarea, bank.diagnosticMaxPerSubarea)} questions for each of the ${section.subareas.length} parts of ${sectionName}, so ${section.subareas.length * DCFG.minPerSubarea} to ${section.subareas.length * Math.min(DCFG.maxPerSubarea, bank.diagnosticMaxPerSubarea)} in all. A part stops early only when more questions would be very unlikely to change your band. Students who do very well or are just starting usually finish sooner; students in the middle usually answer every question. Plan on about a minute per question.</p>
    <ul>
      <li>Work at your own pace. There's no timer. You can leave and come back; your place is saved in this browser.</li>
      <li>You can't go back to change an answer. Each answer helps decide what comes next.</li>
      <li>Use scratch paper. For Math you may use a basic calculator, as on the real TEAS.</li>
      ${sectionName === "Reading" ? "<li>Some questions come with a passage. On a wide screen, the passage stays beside the question.</li>" : ""}
    </ul>
    ${config.reviewPendingSections.includes(sectionName) ? `<p class="notice">${sectionName} questions are new and still being reviewed by ESCC faculty.</p>` : ""}
    ${other ? `<p class="notice">Starting this will discard your unfinished ${esc(other)} diagnostic.</p>` : ""}
    <div class="btn-row"><button class="btn" id="start">Start the ${sectionName} diagnostic</button><a class="btn secondary" href="#/diagnostic">Back</a></div>`, `${sectionName} diagnostic`);
  document.getElementById("start").addEventListener("click", () => {
    // prefer questions this student hasn't met yet, in earlier diagnostics or in practice
    const seen = new Set([...state.diagnostics.flatMap((d) => d.items || []), ...state.attempts.map((a) => a.id)]);
    state.current = core.newDiagnostic(bank, sectionName, DCFG, { seed: newSeed(), seen });
    save();
    runDiagnostic();
  });
}

function runDiagnostic() {
  const s = state.current;
  const idx = core.nextIndex(s, bank);
  if (idx === -1) return finishDiagnostic();
  const item = byId[s.order[idx]];
  const order = core.displayOrder(item, s.seed);
  const answered = s.answers.length;
  const maxTotal = s.order.length;
  const remainingMax = s.order.slice(idx).filter((id) => !s.stats[byId[id].subarea].settled).length - 1; // after this one
  const doneShare = answered / (answered + remainingMax);
  let response = null;
  setView(`<h1 class="sr-only">${esc(s.section)} diagnostic, question ${answered + 1}</h1>
    <div class="q-head"><span><strong>${esc(s.section)} diagnostic</strong> · Question ${answered + 1}</span><span>${remainingMax > 0 ? `at most ${remainingMax} more after this` : "last question"}</span></div>
    <div class="progressbar" role="progressbar" aria-label="Diagnostic progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(doneShare * 100)}"><span style="width:${(doneShare * 100).toFixed(1)}%"></span></div>
    <form id="qform">${itemHtml(item, { order, response, passageRepeat: passageRepeat(item) })}
      <div class="btn-row action-bar"><button class="btn" type="submit" id="submit" disabled>Submit answer</button>
      <button class="btn link" type="button" id="quit">Stop and discard this diagnostic</button></div></form>
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
    save();
    runDiagnostic();
  });
  document.getElementById("quit").addEventListener("click", () => {
    if (!confirmInline(form, "Discard this diagnostic? Answers so far won't be kept as a diagnostic result.")) return;
  });
}

// small inline confirm (avoids window.confirm dialogs)
function confirmInline(anchor, text) {
  let box = document.getElementById("confirm-box");
  if (box) box.remove();
  box = document.createElement("div");
  box.id = "confirm-box";
  box.className = "notice";
  box.innerHTML = `<p>${esc(text)}</p><div class="btn-row" style="margin:8px 0 0"><button class="btn" type="button" data-yes>Yes, discard</button><button class="btn secondary" type="button" data-no>Keep going</button></div>`;
  anchor.after(box);
  box.querySelector("[data-no]").addEventListener("click", () => box.remove());
  box.querySelector("[data-yes]").addEventListener("click", () => {
    state.current = null;
    save();
    location.hash = "#/diagnostic";
  });
  box.querySelector("[data-no]").focus();
  return false;
}

function finishDiagnostic() {
  const s = state.current;
  const results = core.diagnosticResults(s, bank, DCFG);
  const rec = {
    section: s.section,
    date: Date.now(),
    seed: s.seed,
    results: results.map((r) => ({ code: r.code, n: r.n, correct: r.correct, band: r.band.id, stoppedEarly: r.stoppedEarly, nearCutoff: r.nearCutoff })),
    items: s.answers.map((a) => a.id),
    answers: s.answers,
  };
  state.diagnostics.push(rec);
  state.current = null;
  save();
  location.hash = `#/results/${state.diagnostics.length - 1}`;
}

function viewResults(i) {
  navHighlight("progress");
  const rec = state.diagnostics[Number(i)];
  if (!rec) return viewNotFound();
  const section = sectionOf(rec.section);
  const rows = rec.results.map((r) => {
    const sub = section.subareas.find((x) => x.code === r.code);
    const note = r.nearCutoff ? "Close to the line between two bands" : r.stoppedEarly ? "Stopped early: more questions were very unlikely to change the band" : "";
    return `<tr><th scope="row">${esc(r.code)} ${esc(sub?.name || "")}</th><td data-label="Band">${bandChip(bandById(r.band))}</td>
      <td data-label="Score">${r.correct} of ${r.n} correct (${pct(r.correct, r.n)}%)</td><td data-label="Note" class="small muted">${note}</td></tr>`;
  }).join("");
  const missed = {};
  for (const a of rec.answers) if (!a.correct) { const o = byId[a.id]?.objective; if (o) missed[o] = (missed[o] || 0) + 1; }
  const missedList = Object.keys(missed).sort();
  const review = rec.answers.map((a, k) => {
    const it = byId[a.id];
    if (!it) return "";
    const order = core.displayOrder(it, rec.seed);
    return `<details class="review-item" data-k="${k}"><summary>${a.correct ? '<span class="ok-mark">✓</span>' : '<span class="bad-mark">✗</span>'} Question ${k + 1} · ${it.objective} ${esc(objTitle(it.objective))}</summary><div class="review-body"></div></details>`;
  }).join("");
  setView(`<h1>${esc(rec.section)} diagnostic results</h1>
    <p class="muted">${fmtDate(rec.date)} · ${rec.answers.length} questions</p>
    <div class="table-wrap"><table class="results stack"><thead><tr><th scope="col">Part</th><th scope="col">Band</th><th scope="col">Score</th><th scope="col">Note</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="small muted">Bands: <em>Build the basics</em> means under 60% correct; <em>Getting there</em>, 60% to 79%; <em>Strong</em>, 80% or more. These are practice bands for this site's questions, not a predicted TEAS score.</p>
    ${config.reviewPendingSections.includes(rec.section) ? `<p class="notice">${esc(rec.section)} questions are new and still being checked by ESCC faculty, so treat these bands as a rough guide.</p>` : ""}
    <h2>What to work on</h2>
    ${missedList.length ? `<ul class="obj-list">${missedList.map((o) => `<li><span class="obj-main"><span class="code">${o}</span>${esc(objTitle(o))}</span>
      <span><a href="${studyUrl(o)}">Study page</a> · <a href="#/practice/${o}">Practice</a></span></li>`).join("")}</ul>` : "<p>You didn't miss anything. Try another section, or practice the objectives you want to keep fresh.</p>"}
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
  setView(`<h1>Practice</h1>
    ${last ? `<a class="keep-going" href="${last.href}"><span class="kg-label">Keep going</span><span class="kg-what">${esc(last.label)}</span></a>` : ""}
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
  const latest = {};
  for (const { d } of state.diagnostics.map((d) => ({ d }))) latest[d.section] = d;
  const sections = bank.sections.map((s) => {
    const d = latest[s.name];
    const rows = s.subareas.map((sub) => {
      const r = d?.results.find((x) => x.code === sub.code);
      const since = d ? state.attempts.filter((a) => a.m === "p" && a.t > d.date && byId[a.id]?.subarea === sub.code) : [];
      const sc = since.filter((a) => a.ok).length;
      const all = stats(bank.items.filter((i) => i.subarea === sub.code).map((i) => i.id));
      return `<tr><th scope="row">${sub.code} ${esc(sub.name)}</th><td data-label="Diagnostic band">${r ? bandChip(bandById(r.band)) : bandChip(null)}</td>
        <td data-label="Since then" class="small">${since.length ? `${sc}/${since.length} right in practice since then` : d ? "No practice since" : "—"}</td>
        <td data-label="All answers" class="small">${all.n ? `${all.c}/${all.n} overall (${pct(all.c, all.n)}%)` : "—"}</td></tr>`;
    }).join("");
    return `<h3>${s.name}${d ? ` <span class="small muted">· last diagnostic ${fmtDate(d.date)}</span>` : ""}</h3>
      <div class="table-wrap"><table class="results stack"><thead><tr><th scope="col">Part</th><th scope="col">Diagnostic band</th><th scope="col">Since then</th><th scope="col">All answers</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }).join("");
  const history = diag.length
    ? `<ul class="obj-list">${diag.map(({ d, i }) => `<li><span class="obj-main"><a href="#/results/${i}">${esc(d.section)} diagnostic</a> · ${fmtDate(d.date)}</span><span class="obj-stats">${d.results.map((r) => `${esc(r.code)} ${bandChip(bandById(r.band))}`).join(" ")}</span></li>`).join("")}</ul>`
    : "<p>No diagnostics yet.</p>";
  setView(`<h1>My progress</h1>
    <p class="lead">${state.attempts.length} questions answered on this device. Nothing is sent anywhere unless you choose to send it.</p>
    ${sections}
    <h2>Diagnostic history</h2>${history}
    <div class="btn-row">${sendButton()}</div>
    <h2>Move or clear your progress</h2>
    <p class="small muted">Progress lives in this browser only. To move it to another device, download it here and load it there.</p>
    <div class="btn-row"><button class="btn secondary" id="export">Download my progress</button>
      <label class="btn secondary" for="import">Load progress from a file</label><input id="import" type="file" accept="application/json,.json" class="sr-only">
      <button class="btn link" id="clear">Clear all my progress</button></div>
    <div id="io-msg" aria-live="polite"></div>`, "My progress");
  document.getElementById("export").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `teas-prep-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });
  document.getElementById("import").addEventListener("change", async (e) => {
    const f = e.target.files[0];
    const msg = document.getElementById("io-msg");
    if (!f) return;
    try {
      const parsed = JSON.parse(await f.text());
      if (!parsed || !Array.isArray(parsed.attempts) || !Array.isArray(parsed.diagnostics)) throw new Error("not a progress file");
      const data = sanitize(parsed);
      // merge: keep everything, drop exact duplicates
      const key = (a) => `${a.id}|${a.t}`;
      const have = new Set(state.attempts.map(key));
      state.attempts = state.attempts.concat(data.attempts.filter((a) => !have.has(key(a)))).sort((a, b) => a.t - b.t);
      const dk = new Set(state.diagnostics.map((d) => `${d.section}|${d.date}`));
      state.diagnostics = state.diagnostics.concat(data.diagnostics.filter((d) => !dk.has(`${d.section}|${d.date}`))).sort((a, b) => a.date - b.date);
      save();
      viewProgress();
      document.getElementById("io-msg").innerHTML = `<p class="notice">Progress loaded and combined with what was already here.</p>`;
    } catch {
      msg.innerHTML = `<p class="notice">That file couldn't be read as a TEAS Prep progress file.</p>`;
    }
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
    const latest = {};
    for (const d of state.diagnostics) latest[d.section] = d;
    for (const d of Object.values(latest))
      lines.push(`${d.section} ${new Date(d.date).toISOString().slice(0, 10)}: ` + d.results.map((r) => `${r.code} ${bandById(r.band)?.label} (${r.correct}/${r.n})`).join("; "));
    lines.push(`Questions answered: ${state.attempts.length}`);
  }
  const details = [];
  const objs = rec ? [...new Set(rec.answers.filter((a) => !a.correct).map((a) => byId[a.id]?.objective).filter(Boolean))] : null;
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
    <p>Each section's diagnostic asks ${DCFG.minPerSubarea} to ${Math.min(DCFG.maxPerSubarea, bank.diagnosticMaxPerSubarea)} questions from each part of the section. A part stops early only when more questions would be very unlikely to change your band; students near the line between two bands usually answer all of them. If you take a diagnostic again, you get mostly questions you haven't seen.</p>
    <p>Results are given as bands, not scores: <em>Build the basics</em> (under 60% correct), <em>Getting there</em> (60% to 79%) and <em>Strong</em> (80% or more). The bands describe how you did on this site's questions. They aren't a prediction of your TEAS score; that will come only after these results are checked against real TEAS scores.</p>
    <h2>Your privacy</h2>
    <p>There's no login. Your answers are stored only in this browser, on this device. If you clear your browser data, your progress is erased, so use <a href="#/progress">My progress</a> to download a copy. Results are sent to ESCC only if you choose to, through a Google Form you submit yourself.</p>
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
      case "diagnostic": return parts[1] ? viewDiagnostic(parts[1]) : viewDiagnosticMenu();
      case "results": return viewResults(parts[1]);
      case "practice":
        if (parts[1] === "weak") return viewPractice(null, parts[2]);
        if (parts[1] === "mix") return viewPractice(null, null, parts[2]);
        if (parts[1] && sectionOf(parts[1])) return viewPracticeSection(parts[1]);
        return parts[1] ? viewPractice(parts[1]) : viewPracticeMenu();
      case "progress": return viewProgress();
      case "about": return viewAbout();
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
  // drop anything that doesn't match this bank (old saves, edited files)
  state = sanitize(state);
  document.querySelector(".skip")?.addEventListener("click", (e) => { e.preventDefault(); $main.focus(); });
  window.addEventListener("hashchange", route);
  route();
}
start();
