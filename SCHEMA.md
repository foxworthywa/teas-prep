# Item data (`docs/data/bank.json`) and Canvas QTI mapping

`bank.json` is made by `scripts/build_data.py` from the Master Bank Sheet. It is neutral data, not tied to this site, so a later script can turn it into QTI for Canvas. Text is kept exactly as written in the Sheet, with plain-text tables in pipe format and lists as `1.` or `•` lines. Nothing is converted to HTML until the site displays it.

## Top level

| Key | Meaning |
|---|---|
| `sections[]` | Reading, Math, Science, English. Each has `subareas[]` (`code`, `name`, `teasItems`, `objectives[]`, `itemCount`) and `teas` (real-test question count and minutes). |
| `objectives{code}` | `section`, `subarea`, `subareaName`, `text` (ATI outline wording), `studyDoc` (Google Doc link from Objectives column J) |
| `passages{RP-xx}` | `title`, `type`, `text`, `items[]`, `reviewPending` |
| `items[]` | Approved items only (see below) |
| `diagnosticMaxPerSubarea` | from the Blueprint tab |

## Item

| Key | From the Sheet | Notes |
|---|---|---|
| `id`, `section`, `subarea`, `objective` | A–D | |
| `format` | E | `mc`, `multi` (select all), `order` (ordered response), `supply` (supply answer) |
| `stem` | F | |
| `options[]` `{id, text}` | G–L | `id` is the Sheet letter A–F. The site shuffles the display but always stores and grades by these ids. |
| `key[]` | M | One letter for `mc`; the set for `multi`; the full sequence for `order` |
| `accepted[]`, `numeric[]`, `inputMode` | M (supply) | `accepted` is the `a\|b\|c` list; `numeric` holds the numbers in it. The grader also accepts any answer that parses to one of those numbers after stripping spaces, commas and units. |
| `explanation` | N | |
| `optionNotes{letter: [{text, shared?, lead?}]}`, `generalNotes[]` | O | Distractor notes split by option. `lead` means the note began "A and F are …"; the site writes the displayed letters back in front. |
| `difficulty` | P | 1–3, author-rated (not yet calibrated) |
| `diagnostic` | Q | |
| `passages[]` | R | Reading passage IDs (some items use two) |
| `notWith[]` | T | From "Do not place on the same form as …", made two-way |
| `reviewPending` | T | "faculty review pending" in Review notes |
| `optionOrder`, `sortedOrder[]` | derived | `sorted`: one quantity per option in the same notation and unit, or years/age ranges; shown ascending. `fixed`: mixed notations or units, or an "All of them" option; Sheet order kept. `shuffle`: everything else. |

## Canvas QTI (later)

| `format` | Classic Quizzes (QTI 1.2) | New Quizzes (QTI 2.1 / 3.0) |
|---|---|---|
| `mc` | `multiple_choice_question` | choiceInteraction, maxChoices=1 |
| `multi` | `multiple_answers_question` | choiceInteraction, maxChoices=0 |
| `order` | no native type (use `matching_question` with positions 1..n) | orderInteraction |
| `supply` with `numeric` | `numerical_question` (exact answers from `numeric`, margin 0) | textEntryInteraction, float baseType |
| `supply` text | `short_answer_question` with every `accepted` entry | textEntryInteraction, string baseType |

- Passages: a Canvas question group per passage, with the passage text in the first question's stem or as a stimulus (New Quizzes).
- `explanation` goes into general feedback. Each `optionNotes` entry goes into answer-specific feedback, matched by option id, so it's unaffected by shuffling.
- `notWith` and the passage cap only matter to the diagnostic builder. A Canvas bank can ignore them, or use separate question groups.
- Canvas shuffles answers per quiz, not per item. Set "shuffle answers" off for quizzes that contain `sorted` or `fixed` items, or put those items in their own group.
