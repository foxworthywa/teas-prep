# TEAS Reading pages: content audit (R.1.1 to R.3.4)

Scope: every claim, example, table row, Check question and Check answer on the 14 Reading pages in /home/claude/teas/pages/R.*.md. Also checked: whether each page teaches what its objective asks, consistency across the Reading pages and with the English pages where they overlap (E.2.2 purpose, E.3.1 fact vs. arguable claim, E.3.2 word parts), the OpenStax links, and serial commas. No files were edited.

Overall: 26 of the 28 Check answers are correct and answerable from the page. Two are not: the R.1.3 Check 2 question can be read two ways, and the R.3.2 Check 2 answer depends on information the question doesn't give. The factual examples hold up: 20 oz soda is about 65 g of sugar, which is about 16 tsp; Nightingale reached Scutari in 1854 and opened her school in 1860; furosemide is a diuretic; oysters clear the water, which helps underwater grasses that shelter young crabs; and the blood-pressure step order is right. The other problems are wording that overstates a rule, three link labels that promise content the OpenStax section doesn't have, and one missing serial comma.

**Links (curl -s -o /dev/null -w '%{http_code}', 2026-11-18):** all five returned **200**: College Success 5.1, 5.2, 7.3, and 7.4, and Introductory Statistics 2e 2.1. A made-up OpenStax path returned 404, so a 200 here really means the page exists. Page titles match the link text. What each section actually covers is checked under SHOULD-FIX 12 to 14.

Severity: **MUST-FIX** = a wrong or unanswerable Check, or a factual error. **SHOULD-FIX** = misleading, overstated, inconsistent, or a gap in what the objective asks. **Optional** = polish.

---

## MUST-FIX

### M1. R.1.3, Check 2: the question can be read two ways, and the key goes against the page's own rule
Current: "A student put on gloves, then washed her hands. Which step did she do out of order?" Key: "**Step 1 (washing hands).** It should come before putting on gloves."
Section 3 tells students to "find the **first** step that went wrong." By that rule, the first step she got wrong was step 2: she put on gloves first. A student could defend "Step 1" or "Step 2," so the key isn't the only defensible answer.
Replace the question with: "A student put on gloves, then washed her hands. Which step should she have done first, and what did she do instead?"
Replace the answer with: "**Step 1, washing her hands.** She started with step 2 (gloves). Hand washing must come before gloves go on."

### M2. R.3.2, Check 2: the answer can't be supported from what the question says
Current: "Passage A argues for later school start times to protect teen health. Passage B worries about bus costs. What value might both authors share?" Key: "**Concern for students' well-being.**"
Nothing in the question says Passage B cares about students. B is described only as worrying about costs. To reach the key, students have to make the kind of unsupported leap that R.1.2 ("Too far") and R.3.1 ("Possible, but the text gives no support ✗") tell them to reject.
Replace with: "Passage A, by a pediatrician, argues for later school start times to protect teen health. Passage B, by the district's transportation director, worries that new bus routes would take money away from classroom aides. What value do both authors share, and how do their main concerns differ?"
Answer: "**Both care about students' well-being.** A focuses on health; B focuses on cost and its effect on classroom support."

---

## SHOULD-FIX

### 1. R.1.1, §4: "Themes belong to fiction" is overstated and conflicts with R.3.2
Current: "**Theme:** a life lesson in a story ("honesty matters"). Themes belong to fiction; see R.3.2."
R.3.2 promises "the theme or central message of one or more texts" and applies it to opinion pieces. TEAS theme items can use nonfiction.
Replace with: "**Theme:** a message or life lesson a text suggests ("honesty matters"). It's most often discussed for stories; in nonfiction, it's the central message. See R.3.2."

### 2. R.3.2, §1: the theme definition covers stories only
Current: "A **theme** is the message or lesson about life that a story suggests."
Replace with: "A **theme** is the message or lesson about life that a text suggests. In stories, it comes through what characters learn. In nonfiction, look for the central message or value the author returns to."

### 3. R.1.3, §2 table: "every 24 hours" is not a limit
Current row: "**every 24 hours / not more than** | a limit". "Every _ hours" tells you how often (timing), as in the page's own label ("every 6 hours"). The limit wording is "in 24 hours."
Replace with: "**not more than / in 24 hours / maximum** | a limit". Optionally add "every 6 hours" to the timing row.

### 4. R.1.4, §2: missing serial comma (house style), which makes the list unclear
Current: "two dates, three rooms, a deadline and a start date."
Replace with: "two dates, three rooms, or a deadline and a start date."

### 5. R.2.1, §1: "A fact can be wrong" contradicts itself
Current: "A fact can be wrong and still be a fact-type statement: "The moon is 50 miles away" can be **checked** (and is false)."
Replace with: "A factual statement is one that can be checked, even if it turns out to be false: "The moon is 50 miles away" is a factual statement (it can be checked), but it is false. It is not an opinion."

### 6. R.2.1, §1: signal words are presented as if they decide the answer
"*must*" and "*should*" also appear in rules and directions that can be checked ("Patients must fast 12 hours"). R.1.3 trains students to obey exactly these words.
After the signal-word line, add: "These words are clues, not proof. "Patients must fast for 12 hours before the test" is a rule you can check, not an opinion."

### 7. R.2.1, Common traps: the "Nine out of ten" example doesn't fit the page's own definition
Current: "**Calling a statement a fact because it includes a number.** "Nine out of ten people love it" may be an unsupported claim."
Under §1, a statement with a number can be checked, so it is factual in form. The real lesson is that a number isn't the same as verification.
Replace with: "**Calling a statement true because it includes a number.** "Nine out of ten people love it" gives no source and mixes a number with a feeling. Ask who counted, and how."

### 8. R.2.1: stereotypes are promised but never taught
The "What the TEAS expects" line says "spot bias, stereotypes, and misconceptions," but the page never defines a stereotype. The administrator example is one, but it isn't labeled as one.
Add to §2: "- **Stereotypes:** a fixed, oversimplified belief applied to every member of a group (*"Older patients can't learn new technology"*). A stereotype is a kind of overgeneralization about people."

### 9. R.2.2, §1 table: the cause-and-effect example is awkward
Current: "*Because the medicine is temporary, the dose is repeated daily.*" Medicines aren't "temporary"; their effects are.
Replace with: "*Because the relief is only temporary, the dose is repeated every six hours.*"

### 10. R.2.2, §4: the breakdown of "temporarily" skips a suffix
Current: "*temporarily* → *tempor* (time) + *-ly* → for a time." This drops *-ary*.
Replace with: "*temporarily* → *tempor* (time) + *-ary* (relating to) + *-ly* (in a way) → for a limited time."

### 11. R.2.3, Check 2: the key depends on a fact the question doesn't state
Current: "An article on oysters says that cleaner water lets sunlight reach underwater grasses that shelter young crabs." Key: "To show how cleaner water **from oysters** benefits other living things." The question never says that oysters clean the water. Only R.3.1 says so.
Replace with: "An article on oysters explains that oysters filter the water, and that cleaner water lets sunlight reach underwater grasses that shelter young crabs. Why does the author mention the grasses?"

### 12. R.1.4: the link label promises content that section 5.1 doesn't have
Label: "Types of reading, including skimming and scanning: ... Section 5.1". Section 5.1 mentions skimming once and never mentions scanning. Section 5.2 has a "Skimming" subsection.
Replace with: "**Skimming and active reading:** OpenStax *College Success*, Section 5.2 Effective Reading Strategies: https://openstax.org/books/college-success/pages/5-2-effective-reading-strategies". Or keep 5.1 and relabel it "Types of reading."

### 13. R.2.3 and R.3.2: the link label claims section 7.3 covers analytical reading
Labels: "Analytical reading and thinking" (R.2.3) and "Analytical reading" (R.3.2). Section 7.3 is about general analytical problem-solving: component parts, a mechanic example, cost analysis. It says nothing about author's purpose, themes, or reading.
- R.2.3: link section 5.2 instead ("Researching Topic and Author" and the discussion of author bias fit purpose better), labeled "**Reading for an author's purpose and bias:** ... Section 5.2 Effective Reading Strategies". Or keep 7.3 labeled "**Analytical thinking (general background):**".
- R.3.2: relabel it "**Analytical thinking (general background):**". College Success has no section on theme.

### 14. R.2.4, §2 table: "however" isn't a cautious word
Current cautious row: "*however, the details matter, should study first*". "However" signals contrast, and R.3.3 uses it to mark a rebuttal. It shows up in confident and critical texts too.
Replace with: "*may, might, more study is needed, the details matter, it's too early to say*".

### 15. R.3.3, §4: "main concern" is the wrong target
Current: "To **strengthen** an argument, add evidence that supports the author's **main concern**."
Replace with: "To **strengthen** an argument, add evidence that supports the **claim** or shows that the existing evidence really fits it. To **weaken** it, add evidence that contradicts the claim or points to another cause."

### 16. R.3.4, Check 2 answer: heat doesn't cause sunburn
Current: "Both rise in hot, sunny weather; the heat is the shared cause." Sunburn comes from UV exposure, not heat. That matters on a page for future health workers.
Replace with: "**No.** Both rise in hot, sunny weather, when people buy more ice cream and spend more time in the sun. The weather is the shared cause."

---

## Optional

- **R.1.1, §2:** the sample labels ("oxygen theory rejected," "cooling theory," "contagious yawning") come from a yawning passage that isn't on the page. Add "(for a passage about why we yawn)". The same applies to "*the humble yawn*" in R.2.2 §3.
- **R.1.2, Check 1 answer:** "so the store will reopen" claims more than the sign shows. Use "so the closure appears temporary."
- **R.1.2, Common traps:** "If it's stated word for word, it's not an inference question's best answer." Change "it's not" to "it's usually not."
- **R.1.2, link:** section 5.2 has an "Inferring and Implying" subsection that fits better than 7.4 (7.4 mentions "conclusion" once). Consider linking both.
- **R.1.3, Check 2 directions:** in real wound care, gloves are changed after the old dressing comes off. That doesn't matter for a reading item, but you could add "(simplified)" if clinical faculty will see it.
- **R.1.6, Check 2 answer:** "Rest, place the cuff, take the measurement, record it" lists four items with no "and." That's fine, but "...take the measurement, and record it" matches house style better.
- **R.2.3, §1:** E.2.2 lists three purposes (inform, persuade, entertain), and R.2.3 adds a fourth, "instruct." Add "(some books treat *instruct* as a kind of *inform*)" so the two pages don't seem to disagree.
- **R.2.4, §3:** "A pediatrician writes about health; a bus company owner writes about buses and costs" depends on a school-start-time passage that isn't shown. Use "A pediatrician writing about later school start times focuses on sleep and health; a bus company owner focuses on routes and costs."
- **R.2.4, link:** section 7.4 mentions "perspective" once. It's a weak fit, so leave it, but consider relabeling it "Critical thinking (general background)."
- **R.3.1, §3 table:** "Uses outside knowledge ✗" would read better as "Relies on outside knowledge instead of the text ✗". Some predictions need everyday knowledge, as in the foot-tapping example in R.1.2.
- **R.3.3, Check 1:** the evidence (students who used tutoring were more likely to pass) says nothing about *all-night* hours, and students chose whether to use it. The answer could add: "(Note: it supports tutoring in general, not all-night hours, which is a weakness.)" That models the "evidence that directly fits the claim" row. "Pass-rate result" could also read "the finding that users were more likely to pass," since no rate is given.
- **R.3.4:** the objective includes sources "in various formats, including media." Consider adding "Video, infographic, or website | ..." to the §1 table.

---

## Per-page verdict

- R.1.1 summarizing: **FIX** (SF1: "Themes belong to fiction")
- R.1.2 inferences: **PASS** (optional only)
- R.1.3 written directions: **FIX** (M1 two-way Check 2; SF3 "every 24 hours" limit row)
- R.1.4 locating information: **FIX** (SF4 serial comma; SF12 link label)
- R.1.5 charts and visuals: **PASS**
- R.1.6 sequence: **PASS**
- R.2.1 fact and opinion: **FIX** (SF5 to SF8: fact wording, signal words, "Nine out of ten," stereotypes not taught)
- R.2.2 words in context: **FIX** (SF9 "medicine is temporary"; SF10 *temporarily* breakdown)
- R.2.3 author's purpose: **FIX** (SF11 Check 2 answerability; SF13 link label)
- R.2.4 point of view: **FIX** (SF14 "however" as a cautious word)
- R.3.1 evidence and predictions: **PASS**
- R.3.2 comparing themes: **FIX** (M2 unsupported Check 2; SF2 theme definition; SF13 link label)
- R.3.3 evaluating arguments: **FIX** (SF15 "main concern")
- R.3.4 multiple sources: **FIX** (SF16 heat vs. UV)
