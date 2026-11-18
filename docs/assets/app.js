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
  try {
    const raw = localStorage.getItem(KEY);
    state = raw ? { ...blank(), ...JSON.parse(raw) } : blank();
    localStorage.setItem(KEY + ":test", "1");
    localStorage.removeItem(KEY + ":test");
  } catch {
    storageOk = false;
    state = blank();
  }
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

function setView(html, title) {
  $main.innerHTML = html;
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
  const pending = config.reviewPendingSections.includes(item.section) && item.reviewPending;
  const passages = (item.passages || []).map((pid) => bank.passages[pid]).filter(Boolean);
  const passageHtml = passages
    .map((p, i) => `<section class="passage" aria-labelledby="ph-${esc(p.id)}">
      <h2 id="ph-${esc(p.id)}">${passages.length > 1 ? `Text ${i + 1}: ` : ""}${esc(p.title)}</h2>
      <p class="ptype">${esc(p.type)}</p>${renderRich(p.text)}</section>`)
    .join("");
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
    answer = `<p class="small muted" id="ord-help">Use the Move up and Move down buttons to put the steps in order. Position 1 comes first.</p>
      <ol class="order-list" aria-describedby="ord-help">` +
      cur.map((id, i) => `<li data-id="${id}"><span class="pos">${i + 1}.</span><span class="txt">${renderInline(optById[id].text)}</span>
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

  const q = `<div class="q-col">${pending ? `<p class="review-note">Draft question: awaiting ESCC faculty review.</p>` : ""}
    <div class="stem">${renderRich(item.stem)}</div>${answer}<div class="fb-slot" aria-live="polite"></div></div>`;
  return passages.length
    ? `<div class="q-layout with-passage"><div class="passage-col">${passageHtml}</div>${q}</div>`
    : `<div class="q-layout">${q}</div>`;
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
    const label = item.format === "multi"
      ? (response || []).includes(n.optionId) ? `You chose ${map[n.optionId]}` : `You left out ${map[n.optionId]}`
      : `Why not ${map[n.optionId]}`;
    return `<p><strong>${label}:</strong> ${renderInline(n.text)}</p>`;
  }).join("");
  const generalHtml = general.length ? `<h3>${item.format === "supply" || item.format === "order" ? "Common mistakes" : "Also worth knowing"}</h3>${general.map((n) => `<p>${renderInline(n.text)}</p>`).join("")}` : "";
  const expl = core.relabelLetters(item.explanation, map);
  return `<div class="feedback ${ok ? "ok" : "bad"}">
    <p class="verdict">${ok ? "Correct" : "Not quite"}</p>
    ${!ok && keyLine ? `<p><strong>Correct answer:</strong> ${keyLine}</p>` : ""}
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
      ${d ? `<p class="small">Last diagnostic ${fmtDate(d.date)}: ${d.results.map((r) => `${r.code} ${bandChip(bandById(r.band))}`).join(" ")}</p>` : `<p class="small muted">No diagnostic yet.</p>`}
      <div class="spacer"></div>
      <div class="btn-row" style="margin:6px 0 0"><a class="btn" href="#/diagnostic/${s.name}">Diagnostic</a><a class="btn secondary" href="#/practice#${s.name.toLowerCase()}">Practice</a></div></div>`;
  }).join("");
  setView(`
    <h1>Free TEAS 7 practice</h1>
    <p class="lead">From Eastern Shore Community College, for anyone preparing for the ATI TEAS: LPN, RN, dental hygiene and other programs. No login, and nothing to buy. Your progress is saved in this browser only.</p>
    ${cur && !cur.finished ? `<p class="notice">You have a ${esc(cur.section)} diagnostic in progress. <a href="#/diagnostic/${cur.section}">Pick up where you left off</a>.</p>` : ""}
    <div class="cards">
      <div class="card"><h2>1. Take a diagnostic</h2><p>One section at a time. It stops early once it has a clear picture, and shows where you stand in each part of that section.</p><div class="spacer"></div><a class="btn" href="#/diagnostic">Start a diagnostic</a></div>
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
    <p class="lead">Pick a section. You'll answer questions from every part of that section. The diagnostic stops a part once your answers make your level there clear. No feedback appears until the end, like the real test.</p>
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
    <p class="lead">Up to ${Math.min(DCFG.maxPerSubarea, bank.diagnosticMaxPerSubarea)} questions for each of the ${section.subareas.length} parts of ${sectionName}. Most people finish in fewer, because a part stops once your answers settle into a band.</p>
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
    const seen = new Set(state.diagnostics.filter((d) => d.section === sectionName).flatMap((d) => d.items || []));
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
  const remainingMax = s.order.slice(idx).filter((id) => !s.stats[byId[id].subarea].settled).length;
  const doneShare = answered / (answered + remainingMax);
  let response = null;
  setView(`<h1 class="sr-only">${esc(s.section)} diagnostic, question ${answered + 1}</h1>
    <div class="q-head"><span><strong>${esc(s.section)} diagnostic</strong> · Question ${answered + 1}</span><span>at most ${remainingMax} more</span></div>
    <div class="progressbar" role="progressbar" aria-label="Diagnostic progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(doneShare * 100)}"><span style="width:${(doneShare * 100).toFixed(1)}%"></span></div>
    <form id="qform">${itemHtml(item, { order, response })}
      <div class="btn-row"><button class="btn" type="submit" id="submit" disabled>Submit answer</button>
      <button class="btn link" type="button" id="quit">Stop and discard this diagnostic</button></div></form>
    <p class="small muted">Your place is saved. You can close this page and come back later.</p>`, `${s.section} diagnostic`);
  const form = document.getElementById("qform");
  const submit = document.getElementById("submit");
  bindItem(form, item, { order, response, onChange: (r) => { response = r; submit.disabled = !core.isAnswered(item, r); } });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!core.isAnswered(item, response)) return;
    const ok = core.recordDiagnosticAnswer(s, bank, DCFG, idx, Array.isArray(response) ? response.slice() : response);
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
    results: results.map((r) => ({ code: r.code, n: r.n, correct: r.correct, band: r.band.id, settled: r.settled })),
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
    return `<tr><th scope="row">${r.code} ${esc(sub?.name || "")}</th><td>${bandChip(bandById(r.band))}</td>
      <td>${r.correct} of ${r.n} correct</td><td class="small muted">${r.settled ? "Clear result" : "Tentative. Practice will sharpen it."}</td></tr>`;
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
    <div class="table-wrap"><table class="results"><thead><tr><th scope="col">Part</th><th scope="col">Band</th><th scope="col">Score</th><th scope="col">How sure</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="small muted">Bands: <em>Build the basics</em> means under about 60% of these questions; <em>Getting there</em>, 60–80%; <em>Strong</em>, over 80%. These are practice bands for this site's questions, not a predicted TEAS score.</p>
    <h2>What to work on</h2>
    ${missedList.length ? `<ul class="obj-list">${missedList.map((o) => `<li><span class="obj-main"><span class="code">${o}</span>${esc(objTitle(o))}</span>
      <span><a href="${studyUrl(o)}">Study page</a> · <a href="#/practice/${o}">Practice</a></span></li>`).join("")}</ul>` : "<p>You didn't miss anything. Try another section, or practice the objectives you want to keep fresh.</p>"}
    <div class="btn-row">${sendButton()}<a class="btn secondary" href="#/practice#${rec.section.toLowerCase()}">Practice ${esc(rec.section)}</a><a class="btn secondary" href="#/diagnostic">Another diagnostic</a></div>
    <h2>Review your answers</h2><p class="small muted">Open a question to see the explanation.</p>${review}`, `${rec.section} results`);
  $main.querySelectorAll("details.review-item").forEach((d) =>
    d.addEventListener("toggle", () => {
      const body = d.querySelector(".review-body");
      if (!d.open || body.dataset.done) return;
      const a = rec.answers[Number(d.dataset.k)];
      const it = byId[a.id];
      const order = core.displayOrder(it, rec.seed);
      body.innerHTML = itemHtml(it, { order, response: a.response, locked: true, showKey: true }) + feedbackHtml(it, a.response, order);
      body.dataset.done = "1";
    })
  );
  bindSend(() => resultsPayload("Diagnostic", rec.section, rec));
}

// ------------------------------------------------------------------ practice
function viewPracticeMenu() {
  navHighlight("practice");
  const parts = bank.sections.map((s) => {
    const subs = s.subareas.map((sub) => {
      const lis = sub.objectives.map((o) => {
        const st = objectiveStats(o);
        const n = bank.items.filter((i) => i.objective === o).length;
        return `<li><span class="obj-main"><a href="#/practice/${o}"><span class="code">${o}</span>${esc(objTitle(o))}</a></span>
          <span class="obj-stats">${st.n ? `<span class="meter" aria-hidden="true"><span style="width:${pct(st.c, st.n)}%"></span></span>${st.c}/${st.n} right` : `${n} questions`}</span></li>`;
      }).join("");
      return `<h3>${sub.code} ${esc(sub.name)}</h3><ul class="obj-list">${lis}</ul>`;
    }).join("");
    return `<section aria-labelledby="sec-${s.name.toLowerCase()}"><h2 id="sec-${s.name.toLowerCase()}">${s.name}</h2>
      ${config.reviewPendingSections.includes(s.name) ? `<p class="small muted">${s.name} questions are still being reviewed by ESCC faculty.</p>` : ""}
      <p><a class="btn secondary" href="#/practice/weak/${s.name}">Practice my weak spots in ${s.name}</a></p>${subs}</section>`;
  }).join("");
  setView(`<h1>Practice</h1><p class="lead">Pick an objective. You'll see an explanation after every answer and a link to that objective's study page. New questions come first, then ones you missed.</p>${parts}`, "Practice");
  const frag = location.hash.split("#")[2];
  if (frag) document.getElementById(`sec-${frag}`)?.scrollIntoView();
}

function weakObjectives(sectionName) {
  const sec = sectionOf(sectionName);
  const objs = sec.subareas.flatMap((s) => s.objectives);
  const scored = objs.map((o) => ({ o, ...objectiveStats(o) }));
  const enough = scored.filter((x) => x.n >= config.practice.minAttemptsForWeakSpot);
  enough.sort((a, b) => a.c / a.n - b.c / b.n);
  return enough.filter((x) => x.c / x.n < 0.8).slice(0, 3).map((x) => x.o);
}

function viewPractice(arg, weakSection) {
  navHighlight("practice");
  let items, title, back, objs;
  if (weakSection) {
    if (!sectionOf(weakSection)) return viewNotFound();
    objs = weakObjectives(weakSection);
    if (!objs.length) {
      return setView(`<h1>Weak spots: ${esc(weakSection)}</h1><p>There isn't enough history yet to find weak spots. You need at least ${config.practice.minAttemptsForWeakSpot} answers in an objective, and your score there has to be under 80%. Take the ${esc(weakSection)} diagnostic or practice a few objectives first.</p>
        <div class="btn-row"><a class="btn" href="#/diagnostic/${weakSection}">${esc(weakSection)} diagnostic</a><a class="btn secondary" href="#/practice">Back to practice</a></div>`, "Weak spots");
    }
    items = bank.items.filter((i) => objs.includes(i.objective));
    title = `Weak spots: ${weakSection}`;
    back = `#/practice#${weakSection.toLowerCase()}`;
  } else {
    const obj = bank.objectives[arg];
    if (!obj) return viewNotFound();
    objs = [arg];
    items = bank.items.filter((i) => i.objective === arg);
    title = `${arg} ${objTitle(arg)}`;
    back = `#/practice#${obj.section.toLowerCase()}`;
  }
  const seed = newSeed();
  let queue = core.practiceQueue(items, state.attempts, seed);
  if (weakSection) queue = queue.slice(0, config.practice.weakSpotSessionLength);
  const session = { pos: 0, right: 0, done: 0 };

  const showNext = () => {
    if (session.pos >= queue.length) return showEnd();
    const item = byId[queue[session.pos]];
    const order = core.displayOrder(item, seed);
    let response = null;
    setView(`<p class="crumbs"><a href="${back}">Practice</a> › ${esc(item.section)}</p>
      <h1>${esc(title)}</h1>
      ${objs.length === 1 ? `<p class="small muted">${esc(bank.objectives[objs[0]].text)} · <a href="${studyUrl(objs[0])}">Study page</a></p>` : `<p class="small muted">Mixing ${objs.map((o) => `<a href="${studyUrl(o)}">${o}</a>`).join(", ")}</p>`}
      <div class="q-head"><span>Question ${session.pos + 1} of ${queue.length}</span><span>${session.done ? `${session.right} of ${session.done} right so far` : ""}</span></div>
      <form id="qform">${itemHtml(item, { order, response })}
        <div class="btn-row"><button class="btn" type="submit" id="submit" disabled>Check answer</button><a class="btn link" href="${back}">Finish</a></div></form>`, title);
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
      tmp.innerHTML = itemHtml(item, { order, response, locked: true, showKey: true });
      holder.replaceWith(tmp.firstElementChild);
      form.querySelector(".fb-slot").innerHTML = feedbackHtml(item, response, order);
      submit.textContent = session.pos + 1 < queue.length ? "Next question" : "See summary";
      submit.focus();
      form.querySelector(".feedback").scrollIntoView({ block: "nearest" });
    });
  };

  const showEnd = () => {
    setView(`<h1>${esc(title)}</h1>
      <p class="lead">You got ${session.right} of ${session.done} right this round.</p>
      <div class="btn-row"><a class="btn" href="${location.hash}" id="again">Practice again</a>
      ${objs.length === 1 ? `<a class="btn secondary" href="${studyUrl(objs[0])}">Study page</a>` : ""}
      <a class="btn secondary" href="${back}">More objectives</a></div>`, title);
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
      return `<tr><th scope="row">${sub.code} ${esc(sub.name)}</th><td>${r ? bandChip(bandById(r.band)) : bandChip(null)}</td>
        <td class="small">${since.length ? `${sc}/${since.length} right in practice since then` : d ? "No practice since" : ""}</td>
        <td class="small">${all.n ? `${all.c}/${all.n} overall (${pct(all.c, all.n)}%)` : "—"}</td></tr>`;
    }).join("");
    return `<h3>${s.name}${d ? ` <span class="small muted">· last diagnostic ${fmtDate(d.date)}</span>` : ""}</h3>
      <div class="table-wrap"><table class="results"><thead><tr><th scope="col">Part</th><th scope="col">Diagnostic band</th><th scope="col">Since then</th><th scope="col">All answers</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }).join("");
  const history = diag.length
    ? `<ul class="obj-list">${diag.map(({ d, i }) => `<li><span class="obj-main"><a href="#/results/${i}">${esc(d.section)} diagnostic</a> · ${fmtDate(d.date)}</span><span class="obj-stats">${d.results.map((r) => `${r.code} ${bandChip(bandById(r.band))}`).join(" ")}</span></li>`).join("")}</ul>`
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
      const data = JSON.parse(await f.text());
      if (!Array.isArray(data.attempts) || !Array.isArray(data.diagnostics)) throw new Error("not a progress file");
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

function bindSend(payloadFn) {
  const btn = document.getElementById("send");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const p = state.profile || {};
    const dlg = document.createElement("dialog");
    dlg.innerHTML = `<form method="dialog" id="sendform"><h2 style="margin-top:0">Send results to ESCC</h2>
      <p class="small">This opens a Google Form with your results filled in. You can check it, then press Submit there. Nothing is sent until you do. Name and email are optional; add them if you'd like an advisor to follow up.</p>
      <div class="form-row"><label for="f-name">Name (optional)</label><input id="f-name" autocomplete="name" value="${esc(p.name || "")}"></div>
      <div class="form-row"><label for="f-email">Email (optional)</label><input id="f-email" type="email" autocomplete="email" value="${esc(p.email || "")}"></div>
      <div class="form-row"><label for="f-prog">Program you're aiming for</label><select id="f-prog"><option value="">Choose…</option>${config.programs.map((x) => `<option ${p.program === x ? "selected" : ""}>${esc(x)}</option>`).join("")}</select></div>
      <div class="btn-row"><button class="btn" value="go">Open the form</button><button class="btn secondary" value="cancel" formnovalidate>Cancel</button></div></form>`;
    document.body.appendChild(dlg);
    dlg.addEventListener("close", () => {
      if (dlg.returnValue === "go") {
        state.profile = { name: dlg.querySelector("#f-name").value.trim(), email: dlg.querySelector("#f-email").value.trim(), program: dlg.querySelector("#f-prog").value };
        save();
        const pl = payloadFn();
        const f = config.resultsForm.fields;
        const u = new URL(config.resultsForm.url);
        u.searchParams.set("usp", "pp_url");
        const put = (field, val) => { if (field && val) u.searchParams.set(field, val); };
        put(f.name, state.profile.name);
        put(f.email, state.profile.email);
        put(f.program, state.profile.program);
        put(f.kind, pl.kind);
        put(f.section, pl.section);
        put(f.summary, pl.summary);
        put(f.details, pl.details);
        window.open(u.toString(), "_blank", "noopener");
      }
      dlg.remove();
    });
    dlg.showModal();
  });
}

// ------------------------------------------------------------------ about / 404
function viewAbout() {
  navHighlight("");
  setView(`<h1>About this site</h1>
    <p>ESCC TEAS Prep is free practice for the ATI TEAS 7, written for Eastern Shore Community College students and applicants. It covers all four TEAS sections: Reading, Math, Science and English and Language Usage. There are ${bank.items.length} practice questions, ${Object.keys(bank.passages).length} original reading passages, and a study page for each of the ${Object.keys(bank.objectives).length} TEAS objectives.</p>
    <h2>How the diagnostic works</h2>
    <p>Each section's diagnostic draws up to ${Math.min(DCFG.maxPerSubarea, bank.diagnosticMaxPerSubarea)} questions from each part of the section. That's more than the real test uses, so the picture is clearer. A part stops early once your answers make your band clear (at least ${DCFG.minPerSubarea} questions). If you take a diagnostic again, you get mostly different questions.</p>
    <p>Results are given as bands, not scores: <em>Build the basics</em> (about 60% correct or less), <em>Getting there</em> (about 60–80%) and <em>Strong</em> (above 80%). The bands describe how you did on this site's questions. They aren't a prediction of your TEAS score; we'll add that only after checking our results against real TEAS scores.</p>
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
      fetch("data/bank.json").then((r) => r.json()),
      fetch("study/titles.json").then((r) => (r.ok ? r.json() : {})).catch(() => ({})),
    ]);
    bank = b;
    studyTitles = t;
    byId = core.itemIndex(bank);
  } catch (e) {
    $main.innerHTML = `<h1>Couldn't load the questions</h1><p>Check your internet connection and reload the page.</p>`;
    return;
  }
  // a saved diagnostic from an older bank may reference removed items
  if (state.current && state.current.order.some((id) => !byId[id])) state.current = null;
  window.addEventListener("hashchange", route);
  route();
}
start();
