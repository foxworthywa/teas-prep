# Content audit: S.2.1 to S.2.5 (biology pages)

Scope: every factual claim, the Check questions and answers, memory hooks, figure alt text, titles and captions (all 9 images opened), checked against OpenStax *Concepts of Biology* (CoB). Severity: must-fix / should-fix / optional.

All Check questions and answers are correct (S.2.1 Q1 rough ER + Golgi, Q2 metaphase; S.2.2 Q1 C-T-A-A-G, Q2 AUG; S.2.3 Q1 1/2, Q2 incomplete dominance; S.2.4 Q1 protein, Q2 denaturation; S.2.5 Q1 and Q2). All codon, anticodon and amino-acid assignments in the figures check out (TAC GGA → AUG CCU → Met-Pro; AUG UUU CGA → Met-Phe-Arg with anticodons UAC/AAA/GCU).

---

## S.2.1 Cells

1. **Text:** "Plant cells have everything listed above **plus** three structures animal cells lack:"
   - **Problem:** "Everything listed above" includes lysosomes. CoB 3.3 says: "Animal cells have centrioles, centrosomes ..., and lysosomes, whereas plant cells do not." The page never names the structures animal cells have that plant cells lack. That is a common TEAS question ("Which structure is found in animal cells but not plant cells?"), and a student using this page would rule out lysosome or centriole.
   - **Fix:** "Plant cells have most of the organelles above **plus** three structures animal cells lack: ... " Then add after the list: "**Animal cells have** centrioles (in the centrosome) and lysosomes, which plant cells lack. (Plant vacuoles do the digesting.)" Add a trap line: "**Thinking plant cells have centrioles or lysosomes.** Those are animal-cell features."
   - **Severity:** must-fix

2. **Text:** "1. **Prophase:** chromosomes condense and become visible; the spindle forms."
   - **Problem:** It leaves out the breakdown of the nuclear envelope. TEAS-style stage-identification items often use that as the clue.
   - **Fix:** "**Prophase:** chromosomes condense and become visible, the nuclear envelope breaks down, and the spindle forms."
   - **Severity:** should-fix

3. **Text:** "**Stages of mitosis: PMAT**" (Fig S.2.1-4, directly below, shows prometaphase)
   - **Problem:** The figure and CoB 6.2 list five stages, including prometaphase. A student may think the figure contradicts the page.
   - **Fix:** Add: "(Your textbook also names *prometaphase* between prophase and metaphase; the TEAS usually uses the four PMAT stages.)"
   - **Severity:** should-fix

4. **Text:** Prokaryote/eukaryote table (no cell-wall row), together with "Cell wall ... (three structures animal cells lack)"
   - **Problem:** It invites the inference "cell wall = plant only". Most bacteria (peptidoglycan) and all fungi (chitin) have walls. A TEAS item asking which cell type lacks a cell wall expects "animal".
   - **Fix:** Add the row "Cell wall | Most have one (peptidoglycan in bacteria) | Plants (cellulose) and fungi (chitin); **animal cells have none**".
   - **Severity:** should-fix

5. **Text:** "Find each organelle from the table in the drawing." (caption, S.2.1-1)
   - **Problem:** The animal-cell figure has no "Ribosomes" label (they appear only as dots and in the rough ER note), so the instruction can't be fully followed.
   - **Fix:** "Find each organelle from the table in the drawing (ribosomes are the small dots on the rough ER). Note that the animal cell has no cell wall."
   - **Severity:** optional

6. **Text:** "Every cell has a cell membrane, cytoplasm, ribosomes and DNA."
   - **Problem:** This matches CoB, but nursing students will meet mature red blood cells, which have no nucleus, DNA or ribosomes.
   - **Fix:** "Every cell starts with a cell membrane, cytoplasm, ribosomes and DNA (mature red blood cells later lose their nucleus)."
   - **Severity:** optional

7. **Text:** "**Atom → molecule → organelle → cell → tissue → organ → organ system → organism.**"
   - **Problem:** It is accurate, but the TEAS sometimes extends the sequence beyond the organism.
   - **Fix:** Append "→ population → community → ecosystem → biosphere" as an optional extension.
   - **Severity:** optional

8. **Text:** "ribosome on rough ER → ER → Golgi → vesicle → cell membrane"
   - **Problem:** Proteins travel from the ER to the Golgi in vesicles too. The fix is minor.
   - **Fix:** "ribosome on rough ER → vesicle → Golgi → vesicle → cell membrane → out of the cell."
   - **Severity:** optional

Figures S.2.1-2, -3 and -4: the alt text, titles and captions match the images. No issues.

---

## S.2.2 DNA and protein synthesis

9. **Text:** "An enzyme, RNA polymerase, reads one DNA strand and builds a matching mRNA."
   - **Problem:** The mRNA is *complementary* to the strand that is read, not "matching" it. A student could write the template sequence back with U for T, which is the classic TEAS distractor.
   - **Fix:** "...reads one DNA strand (the template) and builds a **complementary** mRNA."
   - **Severity:** should-fix

10. **Text:** "Transcription happens in the nucleus; translation happens at ribosomes." (trap) / "Step 1: Transcription (in the nucleus)"
    - **Problem:** This is true only for eukaryotes. Prokaryotes have no nucleus, and S.2.1 and S.2.5 stress that point.
    - **Fix:** Add "(in eukaryotes; in bacteria, both happen in the cytoplasm)" once in Section 3.
    - **Severity:** optional

11. **Text:** "each codon specifies one amino acid."
    - **Problem:** Stop codons specify no amino acid. The next bullets say so, but the sentence as written is wrong.
    - **Fix:** "each codon specifies one amino acid (or a stop signal)."
    - **Severity:** optional

Figures S.2.2-1 and S.2.2-2: the alt text and captions accurately describe the images and fit the text.

---

## S.2.3 Mendelian genetics

12. **Text:** "**Punnett squares, dominance patterns and sex-linked traits:** Section 8.2 Laws of Inheritance"
    - **Problem:** CoB 8.2 covers only dominant/recessive crosses, segregation and independent assortment. Incomplete dominance, codominance and X-linked traits are in 8.3 Extensions of the Laws of Inheritance, so the link sends students to the wrong section.
    - **Fix:** "Punnett squares and Mendel's laws: Section 8.2 Laws of Inheritance (link). Incomplete dominance, codominance and sex-linked traits: Section 8.3 Extensions of the Laws of Inheritance: https://openstax.org/books/concepts-biology/pages/8-3-extensions-of-the-laws-of-inheritance"
    - **Severity:** should-fix

13. **Text:** "## 2. Mendel's two laws"
    - **Problem:** Many TEAS prep sources and CoB 8.2's postulates also treat dominance as a Mendelian principle ("law of dominance"). "Two laws" could lead a student to reject a correct answer that cites the law of dominance.
    - **Fix:** Retitle it "Mendel's laws" and add a first bullet: "**Law of dominance:** in a heterozygote, the dominant allele masks the recessive one."
    - **Severity:** should-fix

14. **Text:** "**Gene** | A section of DNA that codes for a trait"
    - **Problem:** This is inconsistent with S.2.2 ("codes for a protein (or a functional RNA)"). Genes code for products, and traits result from them.
    - **Fix:** "A section of DNA that codes for a protein, which affects a trait"
    - **Severity:** optional

15. **Text:** "Codominance: ... ABO blood type: a person with alleles A and B has type **AB** blood."
    - **Problem:** This is correct, but ABO is also the standard example of *multiple alleles*, with O recessive. TEAS items ask for the blood types possible from A × B parents.
    - **Fix:** Add: "ABO has three alleles (A, B, O); A and B are codominant and both dominant over O, so type O is genotype OO."
    - **Severity:** optional

Figure S.2.3-1: the alt text and caption are accurate.

---

## S.2.4 Macromolecules

16. **Text:** "**Denaturation:** high temperature or the wrong pH changes the enzyme's shape..."
    - **Problem:** It is accurate, but the page doesn't say that cold slows enzymes without denaturing them. TEAS items contrast the two.
    - **Fix:** Add: "Cold slows enzymes down but does not denature them; activity returns on warming."
    - **Severity:** optional

17. **Text:** "**Elements:** carbohydrates and lipids are mostly C, H and O."
    - **Problem:** Phospholipids (covered in Section 4) contain phosphorus, which "mostly" glosses over.
    - **Fix:** "...mostly C, H and O (phospholipids also contain phosphorus)."
    - **Severity:** optional

18. **Text:** "a **hydrophilic** (water-loving) phosphate head"
    - **Problem:** It is acceptable at the intro level. The head is the phosphate group plus glycerol.
    - **Fix:** No change needed. Optionally use "phosphate-containing head".
    - **Severity:** optional

No figures. Everything else checked out (monomers, polymers, kcal/g, enzymes, pepsin pH, dehydration and hydrolysis).

---

## S.2.5 Microorganisms

19. **Text:** "A virus attaches to a specific host cell, injects its genetic material, and hijacks..."
    - **Problem:** Injection describes bacteriophages. Most human viruses, including the flu, HIV and COVID-19 viruses this page names, enter whole by membrane fusion or endocytosis and then uncoat (OpenStax Bio 2e 21.2). As written, it is wrong for the page's own examples.
    - **Fix:** "A virus attaches to a specific host cell, gets its genetic material inside (some inject it; most animal viruses are taken in whole), and hijacks..."
    - **Severity:** should-fix

20. **Text:** "when antibiotics are overused or a course is not finished, the most resistant bacteria survive and multiply."
    - **Problem:** The selection logic is right. It could also make clear that antibiotics *select* resistance rather than *cause* it, which is a common distractor ("bacteria become resistant because the drug changes them").
    - **Fix:** Append: "The antibiotic doesn't create resistance; it kills the susceptible bacteria and leaves the resistant ones (which arose by mutation or gene transfer) to multiply."
    - **Severity:** optional

21. **Text:** "**Fomites:** contaminated objects such as doorknobs or needles."
    - **Problem:** Needlesticks are usually taught as bloodborne/parenteral transmission. That is acceptable, but it blurs the category.
    - **Fix:** "contaminated objects such as doorknobs, bedrails or shared equipment."
    - **Severity:** optional

22. **Text:** "No nucleus, but a cell wall and its own ribosomes: two features antibiotics can target and viruses lack." (caption, S.2.5-1)
    - **Problem:** It is accurate for the figure. The alt text says "circular chromosome", but the image shows only tangled DNA, though that is true of bacteria.
    - **Fix:** No change needed.
    - **Severity:** optional

Everything else checked out (pathogen table, shapes and prefixes, vitamin K, malaria/*Plasmodium*, TB airborne, ringworm as fungal).

---

## Summary of must-fix

- **S.2.1:** "Plant cells have everything listed above plus..." implies that plant cells have lysosomes and never names the animal-only structures (centrioles/centrosome, lysosomes). This contradicts CoB 3.3 and a commonly tested plant-vs-animal distinction.
