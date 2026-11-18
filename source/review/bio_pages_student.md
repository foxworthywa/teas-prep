# Review: Biology pages S.2.1–S.2.5 (student-reader lens)

Reviewed against S.1.6 (approved) for style/depth. Figure metadata checked in build/figures.json. All Punnett ratios, base-pairing answers and Check answers verified correct; no arithmetic errors found.

## Must-fix

1. **S.2.1** — "Plant cells have everything listed above **plus** three structures animal cells lack"
   - Problem: "Everything listed above" includes lysosomes. The linked OpenStax text (Concepts of Biology 3.3) states animal cells have centrosomes and lysosomes and plant cells do not, and the page's own plant-cell figure (S.2.1-2) shows no lysosomes. TEAS-style items commonly test "centrioles/lysosomes = animal only." A student who follows this sentence will miss those items.
   - Fix: "Plant cells have most of the organelles above, **plus** three structures animal cells lack: … Animal cells have two things typical plant cells lack: **lysosomes** and **centrioles** (which help organize the spindle)." Add a matching trap line.
   - Severity: must-fix

## Should-fix

2. **S.2.1** — "Anaphase: sister chromatids are pulled apart"; "the spindle forms"; "Stays 46 (diploid) | Halved to 23 (haploid)"
   - Problem: *chromosome*, *sister chromatid*, *spindle*, *diploid*, *haploid* are never defined (and *chromosome* is not defined on any S.2 page). The table gives numbers in parentheses, which makes it look like "diploid" means "46."
   - Fix: Add 2–3 lines before PMAT: "A **chromosome** is one long DNA molecule packed with protein. After S phase each chromosome is two identical copies (**sister chromatids**) joined in the middle. The **spindle** is a set of protein fibers that pulls chromosomes apart. **Diploid** = two sets of chromosomes (46 in humans); **haploid** = one set (23)."
   - Severity: should-fix

3. **S.2.1** — "Check 1: … Which two organelles would you expect to be especially abundant?" / answer "Rough ER and Golgi apparatus."
   - Problem: "Ribosomes and Golgi" or "ribosomes and rough ER" are reasonable answers from the page's own export path, and ribosomes are listed as an organelle in the table. A weak reader would be marked wrong for good reasoning.
   - Fix: Ask "Which two **membrane-bound** organelles…", or accept ribosomes in the answer ("Rough ER (with its ribosomes) and Golgi").
   - Severity: should-fix

4. **S.2.1** — "Aerobic cellular respiration; make most of the cell's **ATP**"; "ribosome on rough ER → ER → Golgi → **vesicle** → …"
   - Problem: *ATP*, *aerobic* and *vesicle* are undefined on first use (ATP is explained only later on S.2.4).
   - Fix: "make most of the cell's **ATP** (the cell's energy currency); *aerobic* = uses oxygen." "vesicle (a small membrane bubble that carries cargo)."
   - Severity: should-fix

5. **S.2.1** — whole page (coverage gap)
   - Problem: No membrane transport. Diffusion, osmosis, passive vs active transport, and hypotonic/hypertonic/isotonic solutions are routine in TEAS cell items and in common prep materials (and relevant to nursing: IV fluids). The page calls the membrane "selectively permeable" but never says how things cross.
   - Fix: Add a short section: passive (diffusion, osmosis, facilitated diffusion; high → low, no ATP) vs active (low → high, uses ATP). One 3-row tonicity table: hypotonic → water in, cell swells/may burst; hypertonic → water out, cell shrinks; isotonic → no net change.
   - Severity: should-fix

6. **S.2.2 vs S.2.3** — S.2.2: "A **gene** is a stretch of DNA that codes for a protein (or a functional RNA)." S.2.3: "**Gene** | A section of DNA that codes for a trait"
   - Problem: Inconsistent definitions. "Codes for a trait" also hides the gene → protein → trait link that S.2.2 builds.
   - Fix: Use one definition on both pages: "A section of DNA that codes for a protein; the protein helps produce a trait." Drop "(or a functional RNA)" for this audience.
   - Severity: should-fix

7. **S.2.2** — "Check 2: A DNA **template strand** reads T-A-C." vs Step 1: "RNA polymerase, reads one DNA strand"
   - Problem: "Template strand" appears only in the Check. A weak reader may not connect it to "one DNA strand."
   - Fix: Step 1: "…reads one DNA strand (the **template strand**) and builds a matching mRNA."
   - Severity: should-fix

8. **S.2.2** — "transcription keeps the same 'language' (nucleic acid → nucleic acid…)"; "pair complementary bases"
   - Problem: *nucleic acid* is first defined on S.2.4, and *complementary* is never defined.
   - Fix: "nucleic acid (DNA or RNA)"; "**complementary** = the matching partner base (A↔T, G↔C)."
   - Severity: should-fix

9. **S.2.2** — section 1 (coverage gap)
   - Problem: No size hierarchy. The order chromosome > gene > codon/triplet > nucleotide is a frequent TEAS item for this objective ("relationship between genetic material and protein structure").
   - Fix: One line: "Largest to smallest: **chromosome → gene → codon (3 bases) → nucleotide**. Humans have 46 chromosomes, each carrying many genes."
   - Severity: should-fix

10. **S.2.3** — {{FIG S.2.3-1}} (figure uses "Parent generation", "F1"; caption also refers to F1/F2 crosses)
    - Problem: P, F1 and F2 are not defined on the page but appear in the figure and are standard TEAS vocabulary.
    - Fix: Add vocabulary rows: "**P generation** = parents; **F1** = their offspring; **F2** = offspring of two F1s."
    - Severity: should-fix

11. **S.2.3** — "**Sex-linked (X-linked) traits:** … This is why color blindness and hemophilia are more common in males."
    - Problem: This is stated but never worked. X-linked Punnett squares (carrier mother × unaffected father) are a common TEAS genetics item, and the page has no example.
    - Fix: Add one worked cross: XᴴXʰ × XᴴY → daughters: 1/2 XᴴXᴴ, 1/2 XᴴXʰ (carriers, unaffected); sons: 1/2 XᴴY, 1/2 XʰY (affected). "Each son has a 50% chance; overall 1/4 of children are affected sons."
    - Severity: should-fix

12. **S.2.3** — "Codominance: … a person with alleles A and B has type **AB** blood."
    - Problem: This gives no basis for blood-type crosses, which are a common item. The page doesn't say that O is recessive (i), that ABO has three alleles, or which genotypes give A or B.
    - Fix: Add: "ABO has three alleles: Iᴬ and Iᴮ are codominant; i (type O) is recessive. Type A = IᴬIᴬ or Iᴬi; B = IᴮIᴮ or Iᴮi; AB = IᴬIᴮ; O = ii." Optionally add a Check: Iᴬi × Iᴮi → 1/4 each of A, B, AB, O.
    - Severity: should-fix

13. **S.2.3** — "Incomplete dominance: … Red × white snapdragons give pink."
    - Problem: The pink × pink result (1 red : 2 pink : 1 white, where the phenotype ratio equals the genotype ratio) is the standard follow-up question and isn't on the page.
    - Fix: Add: "Pink × pink → 1 red : 2 pink : 1 white (no hidden carriers, so phenotype ratio = genotype ratio)."
    - Severity: should-fix

14. **S.2.4** — table row "Lipids | … lipids are not true **polymers**"
    - Problem: *Polymer* is used in the table before it is defined (first explained in section 2). The table header defines only monomer.
    - Fix: Under the section heading, add: "**Monomer** = one building block; **polymer** = a long chain of monomers (*mono* = one, *poly* = many)." Move "lipids are not true polymers" to a footnote under the table to declutter the cell.
    - Severity: should-fix

15. **S.2.4** — Carbohydrates row (coverage gap)
    - Problem: No mono/di/polysaccharide terms or disaccharide examples (sucrose, lactose). These are commonly tested, and lactose ties to the "lactase" example in the Enzymes section.
    - Fix: Add: "1 sugar = monosaccharide (glucose, fructose); 2 = disaccharide (sucrose, lactose); many = polysaccharide (starch, glycogen, cellulose)."
    - Severity: should-fix

16. **S.2.4** — Lipids row (coverage gap)
    - Problem: Saturated vs unsaturated fats are missing. This is a common item with a health tie-in.
    - Fix: Add: "**Saturated** fats: no double bonds, solid at room temp (butter). **Unsaturated**: one or more double bonds, liquid (olive oil)."
    - Severity: should-fix

17. **S.2.4** — "speed up reactions by **lowering the activation energy**"
    - Problem: *Activation energy* is undefined.
    - Fix: "…lowering the **activation energy** (the energy needed to get a reaction started)."
    - Severity: should-fix

18. **S.2.4** — "**Denaturation:** high temperature or the wrong pH changes the enzyme's shape…"
    - Problem: The page doesn't say that cold slows enzymes without denaturing them. This is a standard distractor, and students over-generalize "wrong temperature = denatured."
    - Fix: Add: "Cold slows enzymes but does not denature them; activity returns when warmed." Add a matching trap line.
    - Severity: should-fix

## Optional

19. **S.2.1** — "Stages of mitosis: PMAT" vs figure S.2.1-4, which shows prophase, *prometaphase*, metaphase, anaphase, telophase
    - Problem: A weak reader will see 5 stages in the figure and 4 in the text.
    - Fix: Add a line: "(Some diagrams add *prometaphase* between P and M; for the TEAS, PMAT is enough.)" Also add "nuclear envelope breaks down" to prophase.
    - Severity: optional

20. **S.2.1** — Prokaryotes vs eukaryotes table
    - Problem: It has no cell-wall row. S.2.5 says bacteria have cell walls, but S.2.1 presents the cell wall only as a plant feature.
    - Fix: Add a row: "Cell wall | Most have one (not cellulose) | Plants (cellulose), fungi (chitin); animals none."
    - Severity: optional

21. **S.2.1** — "4, genetically different (in females, one egg plus small polar bodies)"
    - Problem: The parenthetical crowds the table cell and introduces an undefined term.
    - Fix: Move it to a sentence under the table, or drop it.
    - Severity: optional

22. **S.2.3** — "The four crosses to know" / "for a single trait"
    - Problem: There is no mention of a dihybrid cross. Some TEAS prep materials include the 9:3:3:1 ratio. This is low priority given compression.
    - Fix: One line: "Two traits, both parents heterozygous (AaBb × AaBb) → 9:3:3:1." Or leave as is.
    - Severity: optional

23. **S.2.4** — "**Proteins** | Amino acids…"
    - Problem: The page doesn't connect amino-acid order to protein shape (primary structure), although S.2.2 does. A one-line link would reinforce the cross-page story.
    - Fix: "The amino-acid order (set by the gene; see S.2.2) determines how the protein folds."
    - Severity: optional

24. **S.2.5** — "A virus attaches to a specific host cell, **injects** its genetic material…"
    - Problem: "Injects" describes bacteriophages. Most human viruses (flu, HIV, SARS-CoV-2) enter by fusion or endocytosis.
    - Fix: "…attaches to a specific host cell and gets its genetic material inside…"
    - Severity: optional

25. **S.2.5** — "Athlete's foot, **ringworm**, yeast…"
    - Problem: Ringworm is a classic trap item (fungus, not a worm), and it sits next to the "Helminths = worms" row.
    - Fix: Add to Common traps: "**Calling ringworm a worm.** It is a fungal skin infection."
    - Severity: optional

26. **S.2.5** — Check 1 answer "Antibiotics target bacterial structures such as cell walls and bacterial ribosomes"
    - Problem: The page body never says what antibiotics target. It is answerable only from the figure caption plus inference.
    - Fix: Add to section 1: "Antibiotics attack parts only bacteria have, such as the bacterial cell wall and bacterial ribosomes."
    - Severity: optional (should-fix if figures may be omitted in print/tutor builds)

27. **S.2.5** — Title "Microorganisms and Disease" with Helminths row
    - Problem: Adult helminths are not microorganisms. A careful student may be confused.
    - Fix: "(not strictly microorganisms, but often grouped with them as parasites)."
    - Severity: optional

28. **S.2.2** — "**Translation (at a ribosome in the cytoplasm)**" vs S.2.1, where ribosomes sit "on rough ER"
    - Problem: A weak reader may think these conflict.
    - Fix: "(at a ribosome, either free in the cytoplasm or on the rough ER)."
    - Severity: optional

## Verified correct (no action)
- S.2.2 Check 1: G-A-T-T-C → C-T-A-A-G. Check 2: TAC → AUG. Stop codons and AUG/Met are correct. A frameshift from 1–2 base indels and sickle cell as a substitution are correct.
- S.2.3: all four cross rows (AA×aa, Aa×Aa 1:2:1 / 3:1, Aa×aa 1:1, AA×Aa 1:1 all dominant) are correct. Check 1: Bb×bb = 1/2. Check 2: incomplete dominance.
- S.2.4: 9 vs 4 Cal/g, CHONP, pepsin pH ~2 and glycogen storage sites are correct.
- S.2.5: chitin walls, malaria/Plasmodium/mosquito vector and vitamin K are correct.
- All Checks are answerable from the page except as noted in items 3 and 26.
