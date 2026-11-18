// Run: node --test tests/
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import * as core from "../docs/assets/core.js";
import config from "../docs/assets/config.js";

const bank = JSON.parse(fs.readFileSync(new URL("../docs/data/bank.json", import.meta.url)));
const byId = Object.fromEntries(bank.items.map((i) => [i.id, i]));
const cfg = { ...config.diagnostic };

test("bank has only approved content and expected counts", () => {
  assert.equal(bank.items.length, 482);
  assert.equal(Object.keys(bank.passages).length, 24);
  assert.equal(Object.keys(bank.objectives).length, 64);
  for (const it of bank.items) {
    assert.ok(bank.objectives[it.objective], it.id);
    for (const p of it.passages || []) assert.ok(bank.passages[p], it.id);
    if (it.format !== "supply") for (const k of it.key) assert.ok(it.options.some((o) => o.id === k), it.id);
  }
});

test("do-not-pair notes are symmetric", () => {
  for (const it of bank.items) for (const x of it.notWith || []) assert.ok(byId[x].notWith.includes(it.id), `${it.id}/${x}`);
});

test("supply grading normalizes spaces, commas, units and number formats", () => {
  const g = (id, r) => core.gradeSupply(byId[id], r);
  assert.ok(g("S.4.1-002", "2500"));
  assert.ok(g("S.4.1-002", "2,500 g"));
  assert.ok(g("S.4.1-002", " 2 500 grams "));
  assert.ok(g("S.4.1-002", "2500.0"));
  assert.ok(!g("S.4.1-002", "250"));
  assert.ok(!g("S.4.1-002", "2.5 kg x 1000"));
  assert.ok(g("M.1.4-002", "x=5"));
  assert.ok(g("M.1.4-002", "X = 5.00"));
  assert.ok(g("M.1.4-002", "10/2"));
  assert.ok(g("M.1.1-002", "4.5 %"));
  assert.ok(g("M.1.1-002", "4.50"));
  assert.ok(!g("M.1.1-002", "0.045"));
  assert.ok(g("S.4.1-006", "39°C"));
  assert.ok(g("S.4.1-006", "39 degrees Celsius"));
  assert.ok(g("M.2.4-004", "282.6 cm³"));
  assert.ok(g("M.2.4-004", "282.7"));
  assert.ok(g("M.1.8-002", "8 mL"));
  assert.ok(g("M.1.8-002", "8ml"));
  assert.ok(g("S.3.5-003", "12 1/2"));
  assert.ok(g("S.1.4-002", "Gall Bladder"));
  assert.ok(g("S.1.4-002", "gallbladder."));
  assert.ok(!g("S.1.4-002", "liver"));
  assert.ok(!g("M.1.2-004", ""));
  assert.ok(!g("M.1.2-004", "12 + 3"));
  assert.ok(g("M.1.2-004", "12"));
  assert.ok(g("M.1.2-004", "+12"));
});

test("parseNumberAnswer", () => {
  assert.equal(core.parseNumberAnswer("−6"), -6);
  assert.equal(core.parseNumberAnswer("$1,152.00"), 1152);
  assert.equal(core.parseNumberAnswer("3/4"), 0.75);
  assert.equal(core.parseNumberAnswer("-2 1/2"), -2.5);
  assert.equal(core.parseNumberAnswer(".5"), 0.5);
  assert.equal(core.parseNumberAnswer("abc"), null);
  assert.equal(core.parseNumberAnswer("5/0"), null);
});

test("grading for each format", () => {
  const mc = byId["S.1.1-001"];
  assert.ok(core.grade(mc, "C"));
  assert.ok(!core.grade(mc, "A"));
  const multi = byId["S.1.1-003"];
  assert.ok(core.grade(multi, ["E", "B", "D"]));
  assert.ok(!core.grade(multi, ["B", "D"]));
  assert.ok(!core.grade(multi, ["B", "D", "E", "A"]));
  const ord = byId["S.1.2-001"];
  assert.ok(core.grade(ord, ["E", "B", "D", "A", "C"]));
  assert.ok(!core.grade(ord, ["B", "E", "D", "A", "C"]));
});

test("display order: sorted, fixed and shuffled options", () => {
  const sorted = byId["M.1.1-001"];
  const texts = core.displayOrder(sorted, "s1").map((id) => sorted.options.find((o) => o.id === id).text);
  assert.deepEqual(texts, ["0.0375", "0.375", "0.38", "0.83"]);
  const fixed = byId["M.1.3-002"];
  assert.deepEqual(core.displayOrder(fixed, "s1"), fixed.options.map((o) => o.id));
  const sh = byId["S.1.1-002"];
  const orders = new Set(Array.from({ length: 30 }, (_, i) => core.displayOrder(sh, "seed" + i).join("")));
  assert.ok(orders.size > 5, "shuffles vary by student");
  assert.equal(core.displayOrder(sh, "same").join(), core.displayOrder(sh, "same").join(), "stable for a seed");
  for (const it of bank.items.filter((i) => i.format === "order")) {
    for (let s = 0; s < 20; s++) assert.notEqual(core.displayOrder(it, "o" + s).join(), it.key.join(), it.id);
  }
});

test("feedback notes use displayed letters", () => {
  const it = byId["S.1.5-003"]; // 'A and F are parasympathetic ...'
  const order = ["F", "B", "C", "A", "D", "E"];
  const notes = core.feedbackNotes(it, ["A", "B", "C", "D", "E"], order);
  assert.ok(notes.some((n) => n.text.startsWith("D and A are parasympathetic")), JSON.stringify(notes));
  const mc = byId["E.1.1-002"];
  const n2 = core.feedbackNotes(mc, "D", ["A", "B", "C", "D"]);
  assert.equal(n2.length, 1);
  assert.match(n2[0].text, /misspelling/);
  assert.equal(core.relabelLetters("Option C takes a clear position.", { C: "A" }), "Option A takes a clear position.");
});

test("every multiple-choice distractor has a note", () => {
  for (const it of bank.items.filter((i) => i.format === "mc")) {
    for (const o of it.options) {
      if (it.key.includes(o.id)) continue;
      assert.ok((it.optionNotes[o.id] || []).length || it.generalNotes.length, `${it.id} ${o.id}`);
    }
  }
});

test("bands and stopping", () => {
  const b = (c, n) => core.bandFor(c, n, cfg).band.id;
  assert.equal(b(15, 15), "strong");
  assert.equal(b(0, 15), "build");
  assert.equal(b(10, 15), "developing");
  assert.ok(!core.subareaSettled(5, 5, cfg), "never before the minimum");
  assert.ok(core.subareaSettled(0, 6, cfg));
  assert.ok(core.subareaSettled(9, 9, cfg));
  assert.ok(!core.subareaSettled(7, 10, cfg));
  const probs = core.bandProbabilities(7, 10, cfg.bands);
  assert.ok(Math.abs(probs.reduce((a, x) => a + x, 0) - 1) < 1e-9);
  assert.ok(Math.abs(core.betaCdf(0.5, 3, 3) - 0.5) < 1e-12);
});

test("diagnostic forms respect every constraint", () => {
  const rp21 = new Set(bank.passages["RP-21"].items);
  const rp21Seen = new Set();
  let seen = new Set();
  for (let s = 0; s < 200; s++) {
    for (const sec of ["Reading", "Math", "Science", "English"]) {
      const f = core.assembleForm(bank, sec, { seed: `t${s}`, maxPerSubarea: 15, passageCap: 3, seen: sec === "Reading" ? seen : new Set() });
      const ids = Object.values(f.bySub).flat();
      assert.equal(new Set(ids).size, ids.length, "no repeats");
      assert.deepEqual([...ids].sort(), [...f.order].sort(), "order covers the plan");
      assert.deepEqual(core.formConflicts(bank, ids), [], `${sec} do-not-pair`);
      for (const [code, list] of Object.entries(f.bySub)) {
        assert.ok(list.length <= 15, code);
        assert.ok(list.length >= 12, `${sec} ${code} only ${list.length}`);
        assert.ok(list.every((id) => byId[id].subarea === code));
      }
      if (sec === "Reading") {
        const count = {};
        for (const id of ids) for (const p of byId[id].passages) count[p] = (count[p] || 0) + 1;
        assert.ok(Object.values(count).every((c) => c <= 4), JSON.stringify(count));
        assert.ok((count["RP-21"] || 0) <= 3, "RP-21 spread");
        ids.filter((id) => rp21.has(id)).forEach((id) => rp21Seen.add(id));
        // passage groups are contiguous
        const first = {}, last = {};
        f.order.forEach((id, i) => { const p = byId[id].passages[0]; first[p] ??= i; last[p] = i; });
        for (const p in first) {
          const span = f.order.slice(first[p], last[p] + 1);
          assert.ok(span.every((id) => byId[id].passages[0] === p), `passage ${p} split`);
        }
        if (s < 5) seen = new Set([...seen, ...ids]);
      }
      if (sec !== "Reading" && s === 0) {
        // objectives spread: no objective twice before every objective has one
        for (const [code, list] of Object.entries(f.bySub)) {
          const objs = bank.sections.find((x) => x.name === sec).subareas.find((x) => x.code === code).objectives;
          const firstN = list.slice(0, objs.length).map((id) => byId[id].objective);
          assert.equal(new Set(firstN).size, firstN.length, `${code} objectives spread`);
        }
      }
    }
  }
  assert.ok(rp21Seen.size >= 10, `RP-21 items rotate across forms (${rp21Seen.size} of 12 used)`);
});

test("a diagnostic session stops adaptively and reports bands", () => {
  const all = { ...cfg };
  const sess = core.newDiagnostic(bank, "Science", all, { seed: "x", seen: new Set() });
  let i, guard = 0;
  while ((i = core.nextIndex(sess, bank)) !== -1 && guard++ < 100) {
    const it = byId[sess.order[i]];
    // perfect student
    const r = it.format === "supply" ? it.accepted[0] : it.format === "mc" ? it.key[0] : it.key.slice();
    core.recordDiagnosticAnswer(sess, bank, all, i, r);
  }
  assert.ok(sess.finished);
  const res = core.diagnosticResults(sess, bank, all);
  for (const r of res) {
    assert.equal(r.band.id, "strong");
    assert.ok(r.n >= all.minPerSubarea && r.n < 15, `${r.code} stopped at ${r.n}`);
  }
});

test("practice queue: unseen, then missed, then the rest", () => {
  const items = bank.items.filter((i) => i.objective === "S.1.2");
  const hist = [{ id: items[0].id, ok: true }, { id: items[1].id, ok: false }];
  const q = core.practiceQueue(items, hist, "p");
  assert.equal(q[q.length - 1], items[0].id);
  assert.equal(q[q.length - 2], items[1].id);
});

test("rich text renders tables, lists and escapes HTML", () => {
  const h = core.renderRich(byId["M.2.1-001"].stem);
  assert.match(h, /<table>/);
  assert.match(h, /<th scope="col">Day<\/th>/);
  const p = core.renderRich(bank.passages["RP-13"].text);
  assert.match(p, /<table>/);
  assert.match(p, /<th scope="col">Screen use in the hour before bed<\/th>/);
  assert.ok(!p.includes("---"));
  const l = core.renderRich(bank.passages["RP-02"].text);
  assert.match(l, /<ol><li>Schedule/);
  assert.match(core.renderRich(byId["E.2.3-011"].stem), /<ul><li>The program offers/);
  assert.equal(core.renderRich("<b>x</b>"), "<p>&lt;b&gt;x&lt;/b&gt;</p>");
  for (const it of bank.items) core.renderRich(it.stem);
});

test("export copies Sheet text exactly (raw dump vs bank.json)", () => {
  let raw;
  try { raw = JSON.parse(fs.readFileSync(new URL("../data/raw/items.json", import.meta.url))); } catch { return; }
  const H = raw[0];
  const rows = raw.slice(1).map((r) => Object.fromEntries(H.map((h, i) => [h, r[i] ?? ""])));
  const approved = rows.filter((r) => r.Status === "Approved");
  assert.equal(approved.length, bank.items.length);
  for (const r of approved) {
    const it = byId[r["Item ID"]];
    assert.ok(it, r["Item ID"]);
    assert.equal(it.stem, r["Question stem"].trim());
    assert.equal(it.explanation, r["Explanation"].trim());
    for (const L of "ABCDEF") {
      const t = (r[`Option ${L}`] || "").trim();
      const o = (it.options || []).find((x) => x.id === L);
      if (it.format !== "supply") assert.equal(o ? o.text : "", t, `${it.id} ${L}`);
    }
    if (it.format !== "supply") assert.deepEqual(it.key, r["Correct answer"].match(/[A-F]/g), it.id);
  }
});
