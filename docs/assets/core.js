// Core logic for ESCC TEAS Prep: no DOM, no storage. Tested in tests/core.test.mjs.
// Items use the Sheet's letters (A–F) as option ids everywhere; only the display
// layer maps them to the letters a student sees.

// ------------------------------------------------------------------ random
export function hashString(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

export function makeRng(seed) {
  let a = (typeof seed === "number" ? seed : hashString(String(seed))) >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ------------------------------------------------------------------ option order
// Returns canonical option ids in the order to show them.
// 'sorted' items (one quantity, same notation and unit; years; age groups) are
// shown ascending; 'fixed' items keep the Sheet order; the rest are shuffled with
// a seed so the order is stable for that student and attempt.
export function displayOrder(item, seed) {
  const ids = (item.options || []).map((o) => o.id);
  if (item.optionOrder === "sorted" && item.sortedOrder) return item.sortedOrder.slice();
  if (item.optionOrder === "fixed") return ids;
  const rng = makeRng(`${seed}|${item.id}`);
  let order = shuffle(ids, rng);
  // an ordered-response item should not start already in the correct order
  if (item.format === "order" && order.join() === (item.key || []).join() && ids.length > 1) {
    order = order.slice(1).concat(order[0]);
  }
  return order;
}

export const DISPLAY_LETTERS = "ABCDEF";

// canonical id -> letter shown to the student
export function letterMap(order) {
  const m = {};
  order.forEach((id, i) => (m[id] = DISPLAY_LETTERS[i]));
  return m;
}

export function joinLetters(letters) {
  if (letters.length <= 1) return letters.join("");
  if (letters.length === 2) return `${letters[0]} and ${letters[1]}`;
  return `${letters.slice(0, -1).join(", ")}, and ${letters[letters.length - 1]}`;
}

// Option letters in an explanation -> the letters the student saw.
// mode 'option': only 'Option C' / 'Choice C'. mode 'bare': every standalone A-F
// (used only for items listed in data/overrides.json, whose explanations say 'Only C ...').
export function relabelLetters(text, map, mode = "option") {
  if (mode === "bare") return text.replace(/\b([A-F])\b/g, (m, L) => map[L] || m);
  return text.replace(/\b(Option|option|Choice|choice)(s?) ([A-F])\b/g, (m, w, s, L) => (map[L] ? `${w}${s} ${map[L]}` : m));
}

// ------------------------------------------------------------------ supply-answer grading
const MINUS = /[−–—]/g;

export function normalizeText(s) {
  return String(s ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .trim()
    .replace(/^(the|a|an)\s+/, "")
    .replace(MINUS, "-")
    .replace(/[\s\-_.,'"’]/g, "");
}

// Parse a student's numeric answer. Strips spaces, commas, a leading 'x =' or '$',
// and trailing units ('g', 'mL', '%', '°C', 'cm³', 'grams'...). Accepts decimals,
// fractions (3/4) and mixed numbers (2 1/2). Returns null if it is not one number.
export function parseNumberAnswer(raw) {
  let s = String(raw ?? "").normalize("NFKC").replace(MINUS, "-").trim();
  if (!s) return null;
  s = s.replace(/^[a-z]\s*=\s*/i, "").replace(/^[≈~]\s*/, "").replace(/^\$\s*/, "");
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)(.*)$/);
  let value, rest;
  if (mixed) {
    const [, sign, w, n, d, r] = mixed;
    if (Number(d) === 0) return null;
    value = (Number(w) + Number(n) / Number(d)) * (sign ? -1 : 1);
    rest = r;
  } else {
    const t = s.replace(/,/g, "").replace(/\s+/g, "");
    const m = t.match(/^([-+]?(?:\d+\.?\d*|\.\d+))(?:\/(\d+(?:\.\d+)?))?(.*)$/);
    if (!m) return null;
    value = Number(m[1]);
    if (m[2] !== undefined) {
      if (Number(m[2]) === 0) return null;
      value = value / Number(m[2]);
    }
    rest = m[3];
  }
  rest = rest.replace(/\s+/g, "").replace(/^((?:c|m|d|k)?m|in|ft|yd)\^?[23]$/i, "$1"); // cm³, cm^3, cm3
  // trailing text may only be a unit: no digits, operators or a second number
  if (/[0-9=+*×÷^(<>]/.test(rest)) return null;
  if (rest.length > 15) return null;
  if (!Number.isFinite(value)) return null;
  return value;
}

export function numbersMatch(a, b) {
  return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));
}

// Numeric items: the answer must parse to one of the accepted numbers (units,
// spaces and commas ignored). Text items: compare with the accepted list,
// ignoring case, spaces, hyphens and punctuation.
export function gradeSupply(item, response) {
  const given = String(response ?? "").trim();
  if (!given) return false;
  if (item.numeric && item.numeric.length) {
    const v = parseNumberAnswer(given);
    if (v !== null) return item.numeric.some((x) => numbersMatch(v, x));
    // not one number: only an exact accepted answer (ignoring case and spaces) counts
    const squash = (x) => String(x).normalize("NFKC").toLowerCase().replace(/\s+/g, "");
    return (item.accepted || []).some((a) => squash(a) === squash(given));
  }
  const n = normalizeText(given);
  return n.length > 0 && (item.accepted || []).some((a) => normalizeText(a) === n);
}

// ------------------------------------------------------------------ grading
// response: mc -> 'B'; multi -> ['B','D']; order -> ['E','B','D','A','C']; supply -> string
export function grade(item, response) {
  switch (item.format) {
    case "mc":
      return response === item.key[0];
    case "multi": {
      const r = new Set(response || []);
      return r.size === item.key.length && item.key.every((k) => r.has(k));
    }
    case "order":
      return Array.isArray(response) && response.join() === item.key.join();
    case "supply":
      return gradeSupply(item, response);
    default:
      return false;
  }
}

export function isAnswered(item, response) {
  if (item.format === "mc") return !!response;
  if (item.format === "multi") return Array.isArray(response) && response.length > 0;
  if (item.format === "order") return Array.isArray(response) && response.length === item.options.length;
  return String(response ?? "").trim().length > 0;
}

// Notes to show after an answer, with Sheet letters swapped for displayed ones.
// Returns [{optionId|null, text}] (optionId null = general note).
export function feedbackNotes(item, response, order) {
  const map = letterMap(order);
  const out = [];
  const render = (note) =>
    note.lead ? `${joinLetters(note.lead.map((L) => map[L] || L).sort())} ${note.text}` : note.text;
  const seen = new Set();
  const add = (optionId) => {
    for (const note of (item.optionNotes || {})[optionId] || []) {
      const t = render(note);
      if (seen.has(t)) continue;
      seen.add(t);
      out.push({ optionId, text: t, lead: !!note.lead, shared: note.shared || null });
    }
  };
  if (item.format === "mc" && response && response !== item.key[0]) add(response);
  if (item.format === "multi") {
    const r = new Set(response || []);
    for (const id of order) {
      const inKey = item.key.includes(id);
      if (r.has(id) !== inKey) add(id); // wrongly chosen or missed
    }
  }
  for (const g of item.generalNotes || []) out.push({ optionId: null, text: g });
  return out;
}

// ------------------------------------------------------------------ bands
// A part's band comes from the share of its questions answered correctly, using the
// cut points in config (e.g. under 60%, 60-79%, 80% or more). These are practice
// bands, not TEAS score predictions.
export function bandIndex(share, bands) {
  for (let i = 0; i < bands.length; i++) if (share < bands[i].upTo - 1e-9) return i;
  return bands.length - 1;
}

export function bandFor(correct, n, cfg) {
  const share = n ? correct / n : 0;
  const index = bandIndex(share, cfg.bands);
  // within 5 points of a cut point: say so on the results page
  const near = cfg.bands.slice(0, -1).some((b) => Math.abs(share - b.upTo) < 0.05 + 1e-9);
  return { index, band: cfg.bands[index], share, nearCutoff: n > 0 && near };
}

const LF = [0];
function logFact(n) {
  for (let i = LF.length; i <= n; i++) LF[i] = LF[i - 1] + Math.log(i);
  return LF[n];
}
const logBeta = (a, b) => logFact(a - 1) + logFact(b - 1) - logFact(a + b - 1); // integer a, b >= 1

// Probability that, if the student answered all `total` planned questions in this
// part, the band would be the same as it is now (uniform prior on their true share;
// beta-binomial for the questions not yet answered).
export function chanceBandHolds(correct, n, total, cfg) {
  if (n >= total) return 1;
  const now = bandIndex(correct / n, cfg.bands);
  const r = total - n, a = 1 + correct, b = 1 + n - correct;
  let p = 0;
  for (let x = 0; x <= r; x++) {
    if (bandIndex((correct + x) / total, cfg.bands) !== now) continue;
    p += Math.exp(logFact(r) - logFact(x) - logFact(r - x) + logBeta(x + a, r - x + b) - logBeta(a, b));
  }
  return Math.min(1, p);
}

// Stop a part once it has at least minPerSubarea answers and finishing the part
// would very probably (stopConfidence) leave the band unchanged.
export function subareaSettled(correct, n, cfg, total) {
  if (n >= total) return true;
  if (n < cfg.minPerSubarea) return false;
  return chanceBandHolds(correct, n, total, cfg) >= cfg.stopConfidence;
}

// ------------------------------------------------------------------ diagnostic form
const DIFFICULTY_TARGETS = [2, 1, 3, 2, 2, 1, 3, 2, 1, 2, 3, 2, 1, 2, 3];

// Pick up to maxPer items per subarea for one section.
//  - never two items on the same form that a "Do not place on the same form" note forbids
//  - at most passageCap items per Reading passage (spreads RP-21's 12 items across forms)
//  - spreads objectives within a subarea; mixes difficulty
//  - prefers items the student has not seen in earlier diagnostics
// Returns { bySub: {code: [ids in planned order]}, order: [ids in administration order], relaxed: [...] }
export function assembleForm(bank, sectionName, opts) {
  const rng = makeRng(opts.seed);
  const maxPer = opts.maxPerSubarea;
  const cap = opts.passageCap;
  const seen = opts.seen || new Set();
  const section = bank.sections.find((s) => s.name === sectionName);
  const pool = bank.items.filter((i) => i.section === sectionName && i.diagnostic);
  const bySubPool = {};
  for (const s of section.subareas) bySubPool[s.code] = pool.filter((i) => i.subarea === s.code);

  const chosen = new Set();
  const banned = new Set();
  const passageCount = {};
  const bySub = {};
  const objCount = {};
  const relaxed = [];
  for (const s of section.subareas) bySub[s.code] = [];

  const passageOk = (it, c) => (it.passages || []).every((p) => (passageCount[p] || 0) < c);

  for (let k = 0; k < maxPer; k++) {
    for (const s of shuffle(section.subareas, rng)) {
      const code = s.code;
      if (bySub[code].length > k) continue;
      let cands = bySubPool[code].filter((i) => !chosen.has(i.id) && !banned.has(i.id));
      if (!cands.length) continue;
      let ok = cands.filter((i) => passageOk(i, cap));
      if (!ok.length) {
        ok = cands.filter((i) => passageOk(i, cap + 1));
        if (ok.length) relaxed.push(`${code}: passage cap raised to ${cap + 1}`);
      }
      if (!ok.length) continue;
      const counts = ok.map((i) => objCount[i.objective] || 0);
      const minCount = Math.min(...counts);
      const target = DIFFICULTY_TARGETS[k % DIFFICULTY_TARGETS.length];
      let best = null, bestScore = Infinity;
      for (const it of ok) {
        if ((objCount[it.objective] || 0) !== minCount) continue;
        let score = Math.abs(it.difficulty - target) * 2 + rng() * 0.9;
        if (seen.has(it.id)) score += 10;
        // share passages already on the form (less reading), but only a little
        if ((it.passages || []).some((p) => passageCount[p])) score -= 0.6;
        if (score < bestScore) { bestScore = score; best = it; }
      }
      if (!best) continue;
      chosen.add(best.id);
      bySub[code].push(best.id);
      objCount[best.objective] = (objCount[best.objective] || 0) + 1;
      for (const p of best.passages || []) passageCount[p] = (passageCount[p] || 0) + 1;
      for (const x of best.notWith || []) banned.add(x);
    }
  }

  // administration order
  const byId = Object.fromEntries(pool.map((i) => [i.id, i]));
  const round = {};
  for (const code in bySub) bySub[code].forEach((id, k) => (round[id] = k));
  let order;
  if (pool.some((i) => i.passages && i.passages.length)) {
    // keep each passage's items together; passages come in the order their
    // earliest-planned item was chosen, so every subarea gets early evidence
    const groups = new Map();
    for (const id of Object.keys(round)) {
      const p = (byId[id].passages || [id])[0];
      if (!groups.has(p)) groups.set(p, []);
      groups.get(p).push(id);
    }
    const gl = [...groups.values()].map((ids) => ({
      ids: ids.sort((a, b) => round[a] - round[b]),
      first: Math.min(...ids.map((i) => round[i])),
      tie: rng(),
    }));
    gl.sort((a, b) => a.first - b.first || a.tie - b.tie);
    order = gl.flatMap((g) => g.ids);
  } else {
    order = [];
    for (let k = 0; k < maxPer; k++) {
      for (const s of shuffle(section.subareas, rng)) {
        const id = bySub[s.code][k];
        if (id) order.push(id);
      }
    }
  }
  return { bySub, order, relaxed };
}

// Check a form against the do-not-pair notes (used by tests and as a guard).
export function formConflicts(bank, ids) {
  const set = new Set(ids);
  const byId = Object.fromEntries(bank.items.map((i) => [i.id, i]));
  const out = [];
  for (const id of ids) for (const x of byId[id].notWith || []) if (set.has(x) && id < x) out.push([id, x]);
  return out;
}

// ------------------------------------------------------------------ diagnostic session
export function newDiagnostic(bank, sectionName, cfg, { seed, seen }) {
  const form = assembleForm(bank, sectionName, {
    seed,
    seen,
    maxPerSubarea: Math.min(cfg.maxPerSubarea, bank.diagnosticMaxPerSubarea || cfg.maxPerSubarea),
    passageCap: cfg.passageCapPerForm,
  });
  const stats = {};
  for (const code in form.bySub) stats[code] = { n: 0, correct: 0, settled: form.bySub[code].length === 0, total: form.bySub[code].length };
  return {
    kind: "diagnostic",
    section: sectionName,
    seed,
    started: Date.now(),
    order: form.order,
    bySub: form.bySub,
    pos: 0,
    stats,
    answers: [], // {id, response, correct}
    finished: false,
  };
}

// index of the next item to give, skipping subareas that are already settled
export function nextIndex(session, bank) {
  const byId = itemIndex(bank);
  for (let i = session.pos; i < session.order.length; i++) {
    const it = byId[session.order[i]];
    if (!session.stats[it.subarea].settled) return i;
  }
  return -1;
}

let _idx = null, _idxBank = null;
export function itemIndex(bank) {
  if (_idxBank !== bank) { _idx = Object.fromEntries(bank.items.map((i) => [i.id, i])); _idxBank = bank; }
  return _idx;
}

export function recordDiagnosticAnswer(session, bank, cfg, index, response) {
  if (index !== nextIndex(session, bank)) return null; // stale or double submit
  const it = itemIndex(bank)[session.order[index]];
  const correct = grade(it, response);
  session.answers.push({ id: it.id, response, correct });
  const st = session.stats[it.subarea];
  st.n += 1;
  if (correct) st.correct += 1;
  st.settled = subareaSettled(st.correct, st.n, cfg, st.total ?? session.bySub[it.subarea].length);
  session.pos = index + 1;
  if (nextIndex(session, bank) === -1) session.finished = true;
  return correct;
}

export function diagnosticResults(session, bank, cfg) {
  const section = bank.sections.find((s) => s.name === session.section);
  const byId = itemIndex(bank);
  return section.subareas.map((s) => {
    const st = session.stats[s.code];
    const b = bandFor(st.correct, st.n, cfg);
    const missed = session.answers
      .filter((a) => !a.correct && byId[a.id].subarea === s.code)
      .map((a) => byId[a.id].objective);
    return {
      code: s.code,
      name: s.name,
      n: st.n,
      correct: st.correct,
      band: b.band,
      share: b.share,
      nearCutoff: b.nearCutoff,
      stoppedEarly: st.n < (st.total ?? session.bySub[s.code].length),
      missedObjectives: [...new Set(missed)],
    };
  });
}

// ------------------------------------------------------------------ practice queue
// Unseen first, then ones missed last time, then the rest; shuffled within each tier.
export function practiceQueue(items, history, seed) {
  const rng = makeRng(seed);
  const last = {};
  for (const h of history) last[h.id] = h; // history is chronological
  const tier = (it) => (!last[it.id] ? 0 : last[it.id].ok ? 2 : 1);
  return shuffle(items, rng)
    .map((it, i) => ({ it, t: tier(it), i }))
    .sort((a, b) => a.t - b.t || a.i - b.i)
    .map((x) => x.it.id);
}

// ------------------------------------------------------------------ rich text
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function inline(s) {
  return esc(s)
    .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*([^*\s][^*\n]*?)\*(?=[\s).,;:!?]|$)/g, "$1<em>$2</em>");
}

const isTableLine = (l) => l.includes("|") && l.split("|").filter((c) => c.trim()).length >= 2;
const isSepLine = (l) => /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/.test(l);
const cells = (l) => l.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());

// Renders stems, passages and explanations: paragraphs, line breaks, pipe tables
// (with or without a |---| line), bulleted and numbered lists, **bold**, *italic*.
export function renderRich(text) {
  const blocks = String(text ?? "").replace(/\r\n/g, "\n").split(/\n\s*\n/);
  const html = [];
  for (const block of blocks) {
    const lines = block.split("\n");
    let i = 0;
    while (i < lines.length) {
      if (isTableLine(lines[i]) && i + 1 < lines.length && (isTableLine(lines[i + 1]) || isSepLine(lines[i + 1]))) {
        const rows = [];
        while (i < lines.length && (isTableLine(lines[i]) || isSepLine(lines[i]))) {
          if (!isSepLine(lines[i])) rows.push(cells(lines[i]));
          i++;
        }
        const [head, ...body] = rows;
        html.push(
          `<div class="table-wrap"><table><thead><tr>${head.map((c) => `<th scope="col">${inline(c)}</th>`).join("")}</tr></thead>` +
            `<tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`
        );
        continue;
      }
      if (/^\s*(?:[•\-*])\s+/.test(lines[i])) {
        const li = [];
        while (i < lines.length && /^\s*(?:[•\-*])\s+/.test(lines[i])) li.push(lines[i++].replace(/^\s*(?:[•\-*])\s+/, ""));
        html.push(`<ul>${li.map((x) => `<li>${inline(x)}</li>`).join("")}</ul>`);
        continue;
      }
      if (/^\s*\d+\.\s+/.test(lines[i])) {
        const start = Number(lines[i].match(/^\s*(\d+)/)[1]);
        const li = [];
        while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) li.push(lines[i++].replace(/^\s*\d+\.\s+/, ""));
        html.push(`<ol${start !== 1 ? ` start="${start}"` : ""}>${li.map((x) => `<li>${inline(x)}</li>`).join("")}</ol>`);
        continue;
      }
      const para = [];
      while (
        i < lines.length &&
        !(isTableLine(lines[i]) && i + 1 < lines.length && (isTableLine(lines[i + 1]) || isSepLine(lines[i + 1]))) &&
        !/^\s*(?:[•\-*])\s+/.test(lines[i]) &&
        !/^\s*\d+\.\s+/.test(lines[i])
      ) para.push(lines[i++]);
      if (para.join("").trim()) html.push(`<p>${para.map(inline).join("<br>")}</p>`);
    }
  }
  return html.join("\n");
}

export { esc as escapeHtml };
