# Google Docs vs Markdown sources: sync check

Date: 2026-11-18. Scope: all 64 study pages in `source/pages/*.md`, compared with the published Google Docs listed in `data/raw/objectives.json` (column 9). The Docs are authoritative.

## Method

1. Each Doc was read in full with the Google Drive `read_file_content` tool (read only; no Doc was edited and no sharing was changed).
2. Each `.md` was rendered with `build_pages.render(text, "docs")`, so every `{{FIG id}}` marker became the same bold "Figure n. Title." caption and italic credit line the Docs carry (from `build/figures.json`).
3. Both texts were normalized to ignore what does not count as a difference: Markdown and Docs-export syntax (`#`, `**`, `*`, `>`, list markers and numbering, table pipes and separator rows, horizontal rules, the Docs export's backslash escapes and `<!-- end list -->` markers), image placeholders, smart vs straight quotes, and whitespace. Link text `[text](url)` was kept as text plus URL so that a changed link target would show up.
4. The two token streams were compared word by word (Python `difflib`, no autojunk). Punctuation stays attached to words, so a dropped or added serial comma, a changed number or a changed word would all register. A separate pass compared every heading's level and text.
5. Check that the method catches small edits: removing one serial comma and changing one number in a test copy of the R.1.1 Doc text were both flagged.

## Result

**Identical: 64. Updated .md: 0. Needs a decision: 0.**

No wording, number, fact, example, punctuation, heading, list-item or link-target difference was found between any Doc and its `.md` source. Every heading also matches in level and text. No `.md` file was changed.

| Objective | Source file | Doc ID | Status |
|---|---|---|---|
| R.1.1 | `R.1.1_summarizing.md` | `1yWRJcpSpw1cNRytp7GOmkKGX-Y2k9q6jOk6KuvbKDxk` | identical |
| R.1.2 | `R.1.2_inferences.md` | `1c0eBhUkoBjHOnfbsQ_uobjD__qRLiTmb39kGgS-i0GY` | identical |
| R.1.3 | `R.1.3_written-directions.md` | `1vUNc1Lc3d_XNgAWQSfCOZfX9hpVFuFSOjKOeCRGiow0` | identical |
| R.1.4 | `R.1.4_locating-information.md` | `13vByZ5d6KtNhu1ufvC9QEXWHRWVLcr7yqw88ISMJauM` | identical |
| R.1.5 | `R.1.5_charts-and-visuals.md` | `1xwGIXMs3ACoKghatGy4LEklJSmrjHAwk_zFUYjWbXL8` | identical |
| R.1.6 | `R.1.6_sequence.md` | `1-kh31lkpqm8CXtstfibgmuqufKhDb7VUVMTOu6jrO5I` | identical |
| R.2.1 | `R.2.1_fact-and-opinion.md` | `1MGta5-BVcjJ_jolCrwjhy5BL7QYIiktW_QwKO1NNqsE` | identical |
| R.2.2 | `R.2.2_words-in-context.md` | `15xhNh45OC6BxkhGCZSWEVNCSpYDGBotiFSUv_rLSwSU` | identical |
| R.2.3 | `R.2.3_authors-purpose.md` | `13EjkGixHLcLrFPIUjgm5xWsSAxiVr9eQx8A6368aN5U` | identical |
| R.2.4 | `R.2.4_point-of-view.md` | `1gEW6DSwmh45Fj1ElGFAfSsUJmUZUvjjswF7cnya97Po` | identical |
| R.3.1 | `R.3.1_evidence-and-predictions.md` | `1xaG-zdMb7lvMP7w-eMSlTKUD_dZDz1QL9tsX9HJ8eM0` | identical |
| R.3.2 | `R.3.2_comparing-themes.md` | `1d89v0LqYlwWCEsod24vGErAVR8waYWy0-8L9DAOcujk` | identical |
| R.3.3 | `R.3.3_evaluating-arguments.md` | `1mG7_RfmVw0FraoDSjnRJuEoffAQrmb9DAnEgnVHGAMs` | identical |
| R.3.4 | `R.3.4_multiple-sources.md` | `1uW9qjeBGEgXeoLNce3CthapjK79wKYRJxL5nohS3Ls8` | identical |
| M.1.1 | `M.1.1_fractions-decimals-percents.md` | `1W_zey5kRjQN6wF62YfImoE4SnjSpFQVZkKywbD8Pa2s` | identical |
| M.1.2 | `M.1.2_operations-with-rational-numbers.md` | `1QA-YDFUsv8c8UkvnI6sTFl5WuEO-btp0OIUeqrEsgEY` | identical |
| M.1.3 | `M.1.3_comparing-and-ordering.md` | `118UL-RVpxv6du4p-GCc4hRvikX_UO-oWlRCjY3YkBKA` | identical |
| M.1.4 | `M.1.4_one-variable-equations.md` | `16oqPDlWGisQT6ilqCcekjl_OKDklLYmPGP7Bg8PIgQk` | identical |
| M.1.5 | `M.1.5_multi-step-word-problems.md` | `1teihx4Y8H1PGuP-cRdg8Bdv8I6Lh4lnjNSVpWSwndq8` | identical |
| M.1.6 | `M.1.6_percent-problems.md` | `15zzWUQHyb1zH-h2YO8nC-rmo9uYJxMEE8RTzvD5-VtY` | identical |
| M.1.7 | `M.1.7_estimation-and-rounding.md` | `1t-feiB8HjecYwcpyZVeZIG_z63-8BSz0ifo1YGa8RIQ` | identical |
| M.1.8 | `M.1.8_proportions.md` | `1QfVp-iu34eHLisO8cik3Qr0ZYq9XSdfZnde7OZ19MnA` | identical |
| M.1.9 | `M.1.9_ratios-and-rates.md` | `1uRZ-2JXk9L_aPC9k3hXS3yMzRnVH5ZcKT5a8CiDP9E4` | identical |
| M.1.10 | `M.1.10_expressions-equations-inequalities.md` | `1zfD7LrqyV77g7Vd2hiCUHpTUTqNtki64LYcQliXbKk4` | identical |
| M.2.1 | `M.2.1_tables-charts-graphs.md` | `1h9TIehoQBuSk2ya89koyYhb_KykvaB6b7R8-sDxTVzw` | identical |
| M.2.2 | `M.2.2_statistics.md` | `1zj1wpNferCu-iIMndSZ7Ad_wK4YjZnrvbS3kpcA2Srk` | identical |
| M.2.3 | `M.2.3_two-variables.md` | `1qHogt1Ay1s0NagGBEA-4ncXWTtzmy4aLDxjICAaZdR0` | identical (see note 1: Doc display defect, no .md change) |
| M.2.4 | `M.2.4_geometry.md` | `13x93lBxxg5ueRTqBZkN1-of6sXids3oUAU0QK0nfDbA` | identical |
| M.2.5 | `M.2.5_unit-conversions.md` | `1lXGZ9PLbKt2TLJ2QL-1ies-xMm4lZdVc2iiSfDHyu6Q` | identical |
| S.1.1 | `S.1.1_body-orientation.md` | `1nsaeT5hiPnbRjAL_kChoqidlrVL13QaaQpQkC2jvJUI` | identical |
| S.1.2 | `S.1.2_respiratory-system.md` | `1IesukPPzWYkfTc4V2Huzh798FDUUew4SfpRnhLq9OcE` | identical |
| S.1.3 | `S.1.3_cardiovascular-system.md` | `1PKNuMitK5oQ5cQ79EdlzePCbvRAADWBcCZ-BfPAXEUI` | identical |
| S.1.4 | `S.1.4_digestive-system.md` | `1O22SGL53wDMcP81-yYG4_wSbGDhcCS6UCkCPRLzMmw0` | identical |
| S.1.5 | `S.1.5_nervous-system.md` | `1nya9xzsj5M33OqBt02Jv617y9Ub-crj7UzvaGPfcnEI` | identical |
| S.1.6 | `S.1.6_muscular-system.md` | `1LQrrAnaZIfLtCNr_F4NTwTODacdTckR4EWPRRBqZSLM` | identical |
| S.1.7 | `S.1.7_reproductive-system.md` | `1i2eOrSrGuunr-L-x9mqDkKGNic4S1MQsSskeHxmb-FU` | identical |
| S.1.8 | `S.1.8_integumentary-system.md` | `1sVHdfGMJlvghewibdnpd9eiuBVq9BS65-8DYpjeRX9k` | identical |
| S.1.9 | `S.1.9_endocrine-system.md` | `1xiRRM46jwh00J5OEn0uP7Gnr6wvKjBDjFirT1txFcco` | identical |
| S.1.10 | `S.1.10_urinary-system.md` | `1TWl0GbwMMsAmQhdantv3LKRiSDZ9fQFEa4bOtWcJC-k` | identical |
| S.1.11 | `S.1.11_immune-system.md` | `1sqMruVnQLH9afvH9UaRdc5RpA6vx8eDRYzBj4tM1FKI` | identical |
| S.1.12 | `S.1.12_skeletal-system.md` | `16qZzK8mVSsDnBhkhxuGwL-p7-VtrD-45fmZaqlEt_Hw` | identical |
| S.2.1 | `S.2.1_cells.md` | `1aKxFP7JpZFQEbiIf69RdVvuiphbgMYazcHjmDQH8I7s` | identical |
| S.2.2 | `S.2.2_dna-and-protein-synthesis.md` | `1KTVEhlM3HuOmis1DDkCMzMT3T-JLahJySgjteRT5GqA` | identical |
| S.2.3 | `S.2.3_mendelian-genetics.md` | `1IhQT0ShWO7pr5jNu2WcaDTxL--u_LtodjM0kx16x7nw` | identical |
| S.2.4 | `S.2.4_macromolecules.md` | `17WjKSoath6cixcVO-KYgCnW-TWoLdQWuMLHgYldmLE4` | identical |
| S.2.5 | `S.2.5_microorganisms.md` | `1TqV59GL4Jw-ekomdV0QxTDO93ZuRbfl9SJerlmfi8oo` | identical |
| S.3.1 | `S.3.1_atoms-and-periodic-table.md` | `1VHnbDzaMG9gg5NeufxQGNv4OPy7jFGUNcMz5b64eBCo` | identical |
| S.3.2 | `S.3.2_states-and-properties-of-matter.md` | `1XWF4izSLA7W91WLg78NzvvHUesgSrtVxwJgYrJsdBxo` | identical |
| S.3.3 | `S.3.3_chemical-reactions.md` | `1P0fT7y_XWphyP4amRlKHjcyWHV2Ez9YsvqZpC9JdPoA` | identical |
| S.3.4 | `S.3.4_reaction-rates.md` | `1R0pk6EaQpkbHp3e0-T3SjE_A3KDG8-DsQcWbJ666Fn4` | identical |
| S.3.5 | `S.3.5_solutions.md` | `1dzr6emk6TNM2LJ-9z0v2IuMniVEJGv64qP7sAiaO4aw` | identical |
| S.3.6 | `S.3.6_acids-and-bases.md` | `1xYmrofx2n2lgr4iaghsvSfknIwUCjAWehrYkH3O0izI` | identical |
| S.4.1 | `S.4.1_measurement.md` | `1ZxYslUtEyOhY00NcMUtRinM3_EwefkHXp-qDReiRx2I` | identical |
| S.4.2 | `S.4.2_logic-and-evidence.md` | `1m3ZcTsajai_4kncKONVYyZZ8eBlfpCjFZ_2bDC_3R4Y` | identical |
| S.4.3 | `S.4.3_predicting-relationships.md` | `1ggEOBpjBdGMNeg4o1QZKbKA-7qoVEAmdZWMW9dOnBig` | identical |
| S.4.4 | `S.4.4_scientific-method.md` | `1teVstotUqHKM7EeEfU8iHSMe2ftmMHAy9JA-V1_WBjA` | identical |
| E.1.1 | `E.1.1_spelling.md` | `10qLvser1Emsneu06MsecyS_j2ilkrn2Mz-54l_YHMaA` | identical |
| E.1.2 | `E.1.2_punctuation.md` | `1DjX9e_PcyOFCqFw1kpWD2BlijHlatx0ou4tQ9xOqwZ4` | identical |
| E.1.3 | `E.1.3_sentence-structure.md` | `1jagsKXhSVWrNur2oZTdgA6cqMLQrWc5tC8Nsy7anb0g` | identical |
| E.2.1 | `E.2.1_grammar-for-clarity.md` | `1hbdT59gwf25TXNLlgPq19GrWdkFn55kSGVb8ZiS6-pU` | identical (see note 2: Doc emphasis formatting only) |
| E.2.2 | `E.2.2_audience-and-tone.md` | `1LjB_1hGkEvpTi96rMz3k-TatKWi-uS-DDIelaLzj3gQ` | identical |
| E.2.3 | `E.2.3_paragraphs.md` | `1XGoK3J6aESDJgF0yvHJ8WqvAQewlCL0LbQgzb0HSO9M` | identical |
| E.3.1 | `E.3.1_writing-process.md` | `1wX_tVB4c5DxdVYbtzljIEpiIQ453FWbc_kZpWMl7dkU` | identical |
| E.3.2 | `E.3.2_word-parts.md` | `1K7VSGTF9QVli63pYtSHJBoAmeS3WkIHCMqtJ8VgKJ1s` | identical |

## Changes made (before → after)

None. Every `.md` already matches its Doc.

## Things I was unsure about (no .md change made)

1. **M.2.3 (Doc display defect, not a correction).** The `.md` reads `**Test:** say "___ depends on ___."`. In the Doc the blanks are gone and the text reads `say " depends on ."`, with "depends on" in bold italic. The Markdown-to-HTML step (`build_docs_html.py`) read the `___ … ___` pair as emphasis markers. This was a build problem, not an edit, so the `.md` was left as it is. **The Doc is the one that needs fixing:** put the blanks back in the Doc, or escape the underscores in the source or the converter before any Docs are rebuilt.
2. **E.2.1, section 5 (formatting only).** The text matches, but the Doc's bold and italic are scrambled around "*The patient feels **bad*** (not *badly*). **Linking verbs** (*is, seems, …*)". The `***` nesting in the source was misread at conversion, so stray emphasis now runs across "(not badly). Linking verbs" and the verb list. You may want to fix the formatting in the Doc. No `.md` change is needed.
3. **Link targets.** In both versions, every link on these pages appears as a visible URL (for example "…: https://openstax.org/…"), so the URLs were compared as text. A Doc link whose hidden target differs from the URL it displays would not show in a plain-text export. Nothing suggests this happened, but the hidden targets were not checked one by one.
4. **Formatting-only edits are invisible to this check.** A Doc edit that changed only bold or italic, with no change to the words, would not appear in the text export. Heading levels and heading text were checked and all match.
5. **Two awkward double parentheticals that appear in both versions** (so they are not sync issues), noted in case someone wants to tidy them:
   - S.3.1 §3: "same number of valence electrons (for groups 1–2, the group number; for groups 13–18, subtract 10: oxygen in group 16 has 6) (outer-shell electrons), so they react similarly".
   - S.4.4 §1: "a testable, falsifiable prediction (one that a result could prove wrong) (often "If…, then…")".
