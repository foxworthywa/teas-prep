# TEAS Math pages: content audit (M.1.1 to M.2.5)

Scope: 15 pages in `/home/claude/teas/pages/M.*.md`, figures `M.2.1-fig1-graphs.png` and `M.2.3-fig1-scatter.png`, manifest entries M.2.1-1 and M.2.3-1 in `build/figures.json`. No files were edited.

## Verification summary

I recomputed every worked example, table value, conversion factor and Check answer, using Python for the arithmetic. **No arithmetic errors. Every Check answer is correct.**

- M.1.1: 3/8 = 0.375; 0.45 = 9/20; 35% = 7/20; 3/5 = 60%; 2 3/4 = 11/4 = 2.75; 17/5 = 3 2/5; 18/24 = 3/4; benchmark table; Check 1 is 8% and 2/25; Check 2 is 2.375.
- M.1.2: 20 − 3 × (4 − 2)² = 8; 1/2 + 1/3 = 5/6; 2/3 × 3/4 = 1/2; 3/4 ÷ 1/2 = 1 1/2; 1 1/2 × 2 2/3 = 4; 0.3 × 0.02 = 0.006; 4.5 ÷ 0.15 = 30; Check 1 is 3; Check 2 is −3.
- M.1.3: 0.6 < 65% < 0.66 < 2/3; 5/7 > 7/10 (50 vs 49); Check 1 is 0.7, 72%, 0.745, 3/4; Check 2 is −0.6.
- M.1.4: x = 7, 11, 6 and 35; Check 1 is x = 5 (both sides = 18); Check 2 is C = 40.
- M.1.5: 250 mL left; $0.75 vs $0.70 per can; 7 vans; 2 h 35 min; Check 1 is $59; Check 2 is 1400, 2000 and 0200.
- M.1.6: 12, 15%, 80; 10% increase; $36, $53, $47.20, $20.80, $72; 34/17/3.4/51; Check 1 is 75%; Check 2 is $183.75.
- M.1.7: 4,700; 3.48; 12.4; 0.08; 303.78; about 20.8; $25.02; 3.446 rounds to 3.4; Check 1 is 18.9; Check 2 is 11 boxes.
- M.1.8: 5 cups; 87.5 mi; 8 mL; 3 tablets; 4 × 6 = 8 × 3; Check 1 is 13 gal; Check 2 is 1.5 mL.
- M.1.9: 2:3 and 2:5; $240 and $360; 60 mph; $0.30/oz; 3 h; 45 mi; 2 kg/yr; Check 1 is 100 mL; Check 2 is −120 mL/h.
- M.1.10: 40 (from 3x² − 2x at x = 4); (−2)² = 4; h ≥ 30; x > −4; m = 100; Check 1 is 30 + 0.10t, $45; Check 2 is x ≥ 3.
- M.2.1: the figure matches the page and the manifest alt text (Jan 120, Feb 150, Mar 140, Apr 180, May 165; temperatures 101.8, 101.2, 100.6, 100.2, 99.6, 99.0, 98.8). Every value the page reads off the figure is correct: April is the maximum, January the minimum; +30; 410; the largest consecutive increase is Mar→Apr, +40; 100.2 °F at 3 h; a 3.0 °F drop; the 5→6 h segment is the flattest (−0.2). Pie slices sum to 100%; $960; Check 1 is 50%; Check 2 is $120.
- M.2.2: mean 6, median 5, mode 5, range 6; 5.5; 90; $94.8k; Check 1 is 15/15/15/9; Check 2 has mean 20 and median 12.
- M.2.3: the scatter figure matches the manifest (positive, negative, none). Slope 3; Check 2 is −6.
- M.2.4: 31.4 cm; 78.5 cm²; 30,000 cm³ = 30 L; ladder 8 ft; Check 1 is $588; Check 2 is 65°.
- M.2.5: every conversion factor is right (1 in = 2.54 cm exactly; 0.4536 kg/lb; 2.205 lb/kg; 29.6 mL/fl oz; 4.93 mL/tsp; 14.8 mL/tbsp; 236.6 mL/cup; 0.946 L/qt; 1.609 km/mi; all U.S. customary relations). 75 kg; 480 mL; 140 mg; Check 1 is 60.96 cm; Check 2 is 1,440 mL.
- Cross-references S.4.1 (prefix table) and S.4.2 (correlation vs causation) both exist.

**Must-fix items: none.** The findings below are wording that could lead a student to a wrong TEAS answer, Check items that test poorly, and gaps in coverage.

---

## Findings

### M.1.10 Expressions, Equations and Inequalities

**1. Translation table: "less than" and "more than" rows contradict the rows above them.** Severity: **should-fix**

Quoted:
> | 5 more than a number | x + 5 |
> | 5 less than a number | **x − 5** (order flips!) |
> ...
> | more than, exceeds | > |
> | less than, fewer than | < |

Problem: the same table maps "more than" to both + and >, and "less than" to both − and <. Telling the arithmetic phrase ("5 less than x") apart from the comparison ("x is less than 5") is a classic TEAS distractor. The table as written invites x < 5 for "5 less than x".

Suggested replacement:
> | is more than, is greater than, exceeds | > |
> | is less than, is fewer than | < |

Then add a line under the table: **"Watch the word *is*.** '5 less than x' is an amount, x − 5. 'x **is** less than 5' is a comparison, x < 5."

**2. Inequality example has no story, but the page then interprets it in context.** Severity: **should-fix**

Quoted:
> - 150 + 15h ≥ 600 → 15h ≥ 450 → **h ≥ 30**
> ...
> **Reading the answer in context:** h ≥ 30 means she must work **at least 30 hours**.

Problem: the page never says who "she" is or what 150, 15 and 600 stand for. Interpreting a solution in context is the skill this objective tests, and here the context is missing.

Suggested replacement:
> **Example:** A student has $150 saved and earns $15 an hour. She needs at least $600 for tuition. How many hours must she work? 150 + 15h ≥ 600 → 15h ≥ 450 → **h ≥ 30**.

**3. Gap: no budget-limit inequality whose answer rounds down.** Severity: optional

TEAS items often ask for the greatest whole number satisfying a ≤ (for example, "$40 budget, $6 per item plus $4 shipping: how many items at most?" gives 6x + 4 ≤ 40 → x ≤ 6). One line linking this to M.1.7 rounding in context would help.

### M.1.8 Proportions

**4. Dosage formula label is ambiguous.** Severity: **should-fix**

Quoted:
> **Have / on hand = desired / x**

Problem: "Have / on hand" reads as "have divided by on hand." The worked example actually uses (dose on hand ÷ volume on hand) = (dose desired ÷ x). Students who know the nursing formula D/H × Q may set it up wrongly.

Suggested replacement:
> **Dose on hand / amount it comes in = dose ordered / x**
> (Same thing as the nursing formula: x = Desired ÷ Have × Quantity.)

### M.2.2 Statistics

**5. Check 1 cannot tell whether a student knows the measures apart.** Severity: **should-fix**

Quoted:
> **Check 1:** Find the mean, median, mode and range of: 12, 15, 11, 15, 20, 17.
> ...
> 1. **Mean 15, median 15, mode 15, range 9.**

Problem: mean, median and mode are all 15. A student who confuses the three, or who forgets to average the two middle values, still gets every answer right. The Check gives false reassurance on exactly the errors the "Common traps" section lists.

Suggested replacement (verified): **"12, 15, 11, 15, 22, 9."**
- Ordered: 9, 11, 12, 15, 15, 22
- Mean = 84 ÷ 6 = **14**
- Median = (12 + 15) ÷ 2 = **13.5**
- Mode = **15**
- Range = 22 − 9 = **13**

The answer line becomes: "**Mean 14, median 13.5, mode 15, range 13.** Sum = 84; 84 ÷ 6 = 14. Ordered: 9, 11, 12, 15, 15, 22; middle two are 12 and 15, so (12 + 15) ÷ 2 = 13.5. Range = 22 − 9 = 13."

**6. Gap: distribution shape and summary statistics from a table or graph.** Severity: **should-fix**

The objective says "evaluate the information in data sets, **tables, charts, and graphs** using statistics." The page only works with raw lists. Missing:
- (a) **Mean from a frequency table** (weighted mean). Example: scores 70 (×2), 80 (×5), 90 (×3) give (140 + 400 + 270) ÷ 10 = **81**.
- (b) **Shape of a distribution**: symmetric, skewed right (tail to the right, so mean > median) and skewed left. Study guides cover this widely for this objective; I could not confirm ATI's exact item scope, so treat it as likely rather than certain.
- (c) **Reading a statistic off a graph**, for example the median of the five bar values in the M.2.1 figure (150).

Suggested addition: a short "Statistics from a table" subsection with example (a), and one line on skew tied to the existing Outliers section.

### M.2.3 Two Variables

**7. "Strong" overstates what falling points show.** Severity: **should-fix**

Quoted:
> - **Reading a negative slope as "no relationship."** Falling points are a strong negative relationship.

Problem: falling points show a *negative* relationship. Whether it is *strong* depends on how tightly the points hug a line, which the page itself teaches just above ("The closer the points are to a straight line, the stronger the relationship"). This bullet contradicts that and blurs direction with strength, a distinction TEAS items do test.

Suggested replacement:
> - **Reading a negative slope as "no relationship."** Falling points show a negative relationship. Strength is a separate question: how tightly the points follow a line.

**8. Independent variable described as "the cause".** Severity: optional

Quoted:
> - The **independent variable** is the input, the cause or the thing that's chosen.

Problem: the same page later warns that correlation is not causation. Calling the x-variable "the cause" sits awkwardly with that warning.

Suggested replacement: "the input: the thing that is changed, chosen or controlled."

**9. Gap: using a trend line to predict.** Severity: optional

A one-line example of reading a predicted y-value from a line of best fit, or of plugging x into y = mx + b, would round out the objective. The plumber example could add: "a 3-hour job costs 75(3) + 50 = **$275**."

### M.2.5 Unit Conversions

**10. The introductory sentence is contradicted by its own table.** Severity: **should-fix**

Quoted:
> Most prefix steps are a factor of 10, but the jumps below are 1,000 (see S.4.1 for the full prefix table).

Problem: the table includes 1 m = **100** cm, and 1 mL = 1 cm³, which is not a prefix jump at all. A student who takes the sentence literally may convert m → cm by 1,000.

Suggested replacement:
> Each step between neighboring prefixes is a factor of 10 (see S.4.1 for the full prefix table). The conversions you'll use most are below. Note that most are jumps of 1,000, but m → cm is 100.

**11. Check 2 answer differs from the page's own quart factor.** Severity: optional

The table says 1 qt ≈ 0.95 L, which gives 1.5 qt ≈ **1,425 mL**. Check 2 tells students to use 240 mL per cup, which gives **1,440 mL**. The Check is internally correct because it states its factors. Add one sentence to the answer: "Using 1 qt ≈ 0.95 L gives about 1,425 mL. On the TEAS, use whatever factor the question gives."

**12. Gap: converting area units.** Severity: optional

Students often convert ft² to in² by multiplying by 12 instead of 144. One line would cover it: "1 ft² = 12 × 12 = 144 in²; 1 yd² = 9 ft²; 1 m² = 10,000 cm²." This also serves M.2.4.

**13. Gap: temperature conversion.** Severity: optional

There is no °F ↔ °C on this page. It appears only as an algebra Check in M.1.4. Add a cross-reference: "°F = 1.8 × °C + 32 (see M.1.4, Check 2)."

### M.1.6 Percent Problems

**14. Gap: working backward to the original amount.** Severity: **should-fix**

The page covers forward discount and tax but not "after a 20% discount the price is $36; what was the original price?" (36 ÷ 0.80 = **$45**). Two errors are common here: adding 20% to $36 (which gives $43.20), and dividing by 0.20. These are standard TEAS distractors.

Suggested addition to section 3:
> **Working backward:** a sale price of $36 after 20% off means $36 is 80% of the original. Original = 36 ÷ 0.80 = **$45**, not 36 × 1.20 = $43.20.

**15. Heading promises "markup" but there is no markup example.** Severity: optional

Quoted:
> ## 3. Discounts, tax, tip and markup

Either rename the heading or add a row: "Markup of 25% | × 1.25 | $40 cost × 1.25 = **$50**."

**16. Gap: no percent-decrease example.** Severity: optional

The only percent-change example is an increase. Add a decrease to show the negative sign. For example, 80 → 68: −12 ÷ 80 = **−15%**, a 15% decrease.

### M.2.4 Geometry

**17. Gap: composite figures and working backward.** Severity: **should-fix**

The objective is "calculate geometric quantities." TEAS items commonly involve:
- **Composite or irregular shapes.** Example: an L-shaped room split into two rectangles. Or a 10 × 6 rectangle with a semicircle on the 6 side: 60 + ½ × 3.14 × 3² = 60 + 14.13 = **74.13**.
- **Finding a dimension from a given area, perimeter or volume.** Examples: a square with area 49 has side 7; a box with V = 120, l = 5, w = 4 has h = 6.

Neither appears on the page. Suggest one worked example of each.

**18. Gap: angle relationships.** Severity: optional

Add complementary (sum 90°), supplementary (sum 180°) and vertical angles (equal) to section 4.

**19. Pythagorean triples list.** Severity: optional

Quoted:
> Common whole-number triples: **3-4-5**, **5-12-13**, **6-8-10**.

6-8-10 is simply 2 × (3-4-5). It is more useful to say "and any multiple of these, such as 6-8-10 or 9-12-15."

### M.2.1 Tables, Charts and Graphs

**20. Data labels on the bars bypass the scale-reading skill.** Severity: optional

The bar graph prints the exact value above each bar, so students never practice reading a bar against the grid. That is the skill section 1 and the first Common trap emphasize. Consider removing the labels, or adding a second, unlabeled practice read.

**21. Gap: truncated (non-zero) axis.** Severity: optional

The line graph's y-axis starts at 98 °F, which visually exaggerates the drop. That makes it a good teaching opportunity. Add a trap bullet: "**Axis that doesn't start at zero.** The temperature graph starts at 98 °F, so a 3-degree drop looks huge. Read the numbers, not the picture."

### M.1.1 Fractions, Decimals, Percents

**22. Heading says three conversions; the table shows six.** Severity: optional

Quoted:
> ## 1. The three conversions you need

Suggested: "## 1. Converting in every direction" (or "The six conversions").

**23. Gap: percents over 100% and repeating decimals.** Severity: optional

Examples worth adding: 150% = 1.5 = 3/2, and 0.1666… = 1/6. Both appear in TEAS-style items.

### M.1.4 One-Variable Equations

**24. "Working backward from the order of operations" doesn't match the step list.** Severity: optional

Quoted:
> Use the **opposite operation** to undo each step, working backward from the order of operations:
> 1. Distribute to clear **parentheses**.

Problem: the list begins with parentheses, which is *forward* PEMDAS. The "backward" idea applies to steps 4–5 (undo addition and subtraction before multiplication and division).

Suggested: drop "working backward from the order of operations," or move it to step 4 ("undo + and − first, then × and ÷").

**25. Gap: fractional coefficients and dividing by a negative.** Severity: optional

Add one example such as (2/3)x = 12 → x = 12 × 3/2 = **18**, and one with a negative coefficient: −4x = 20 → **x = −5**.

### M.1.2 Rational-number operations

**26. Gap: −3² versus (−3)².** Severity: optional

PEMDAS with negatives is a frequent error: −3² = −9, but (−3)² = 9. M.1.10 touches it only when substituting. One line in section 4 would cover it.

### M.1.7 Estimation and Rounding

**27. Gap: rounding when a 9 rolls over.** Severity: optional

Add a row: 2.96 → nearest tenth → **3.0** (the 9 rolls over, and the trailing zero is kept).

### No issues found

M.1.3, M.1.5 and M.1.9 have no errors and no significant gaps.
