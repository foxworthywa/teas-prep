# English batch 2 source. MC items: correct option first; script assigns positions.
MC = "Multiple choice"
items = []
def mc(id, stem, correct, wrongs, expl, diff):
    items.append(dict(id=id, format=MC, stem=stem, correct=correct, wrongs=wrongs, explanation=expl, difficulty=diff))
def fixed(id, fmt, stem, options, answer, expl, distr, diff):
    items.append(dict(id=id, format=fmt, stem=stem, options=options, answer=answer, explanation=expl, distractors=distr, difficulty=diff))

# ---------- E.1.1 Spelling ----------
mc("E.1.1-005", "Which sentence uses the correct word?",
   "Please accept my apology for the delay.",
   [("The nurse could not except the gift from the family.", "\"except\" means \"but\" or \"excluding\"; the verb meaning \"receive\" is \"accept.\""),
    ("Everyone accept Maria passed the quiz.", "this needs \"except\" (\"everyone but Maria\")."),
    ("The clinic will except new patients next month.", "the verb meaning \"take in\" is \"accept.\"")],
   "\"Accept\" means to receive or agree to, which fits accepting an apology.", 1)
mc("E.1.1-006", "Which word correctly completes the sentence?\n\nThe patient asked ___ turn it was to use the shower.",
   "whose",
   [("who's", "\"who's\" means \"who is\": \"who is turn\" makes no sense."),
    ("whos", "not a word; the possessive is \"whose.\""),
    ("who is", "\"who is turn it was\" makes no sense; the sentence needs a possessive.")],
   "\"Whose\" is the possessive form (the turn belongs to someone). Test: \"who is turn\" doesn't work, so it isn't \"who's.\"", 2)
mc("E.1.1-007", "What is the correct plural of diagnosis?",
   "diagnoses",
   [("diagnosises", "adds -es to the singular instead of changing -is to -es."),
    ("diagnosis'", "an apostrophe never makes a plural."),
    ("diagnosi", "drops the s; the -is ending changes to -es.")],
   "Greek and Latin words ending in -is form the plural with -es: diagnosis → diagnoses (like crisis → crises).", 2)
mc("E.1.1-008", "Which word is spelled correctly?",
   "privilege",
   [("privelege", "uses e in place of the second i (priv-i-lege)."),
    ("priviledge", "adds a d that isn't there (no \"edge\" in privilege)."),
    ("privilage", "uses a in place of the e before g (-lege, not -lage).")],
   "The correct spelling is p-r-i-v-i-l-e-g-e, with no d.", 2)
mc("E.1.1-009", "Which word correctly adds a suffix to its base word?",
   "beginning (begin + -ing)",
   [("hopeing (hope + -ing)", "drop the silent e before a vowel suffix: hoping."),
    ("carful (care + -ful)", "keep the silent e before a consonant suffix: careful."),
    ("happyness (happy + -ness)", "change y to i after a consonant: happiness.")],
   "\"Begin\" is stressed on its last syllable and ends in one vowel + one consonant, so the n doubles before -ing: beginning.", 2)
mc("E.1.1-010", "Which word correctly completes the sentence?\n\nThe bandage was too ___ and kept slipping off.",
   "loose",
   [("lose", "\"lose\" is a verb meaning to misplace or fail to win."),
    ("loss", "\"loss\" is a noun (a loss of blood)."),
    ("lost", "\"lost\" is the past tense of lose and doesn't describe a bandage that is not tight.")],
   "\"Loose\" means not tight.", 1)
fixed("E.1.1-011", "Select all", "Which words are spelled correctly? Select all that apply.",
      ["schedule", "recieve", "benefited", "occured", "referred"], "A, C, E",
      "Schedule, benefited (stress on BEN, so no doubled t), and referred (stress on -FER, so the r doubles) are correct.",
      "B: the correct spelling is \"receive\" (e before i after c). D: the correct spelling is \"occurred\" (stress on -CUR, so the r doubles).", 3)
mc("E.1.1-012", "Which sentence is written correctly?",
   "It's been a long shift.",
   [("Its time to check the patient's vital signs.", "\"It is time\" needs the contraction \"It's.\""),
    ("The clinic changed it's hours.", "the possessive is \"its\"; \"it is hours\" makes no sense."),
    ("The cat licked it's paw.", "the possessive is \"its\" with no apostrophe.")],
   "\"It's\" means \"it has\" or \"it is\": \"It has been a long shift.\"", 2)
mc("E.1.1-013", "Which sentence uses then or than correctly?",
   "First wash your hands, then put on gloves.",
   [("Take the pill, than drink a full glass of water.", "time order needs \"then.\""),
    ("Her score was higher then mine.", "comparisons need \"than.\""),
    ("He would rather walk then drive.", "\"rather … than\" is a comparison, so it needs \"than.\"")],
   "\"Then\" shows time or order; \"than\" compares.", 1)

# ---------- E.1.2 Punctuation ----------
mc("E.1.2-005", "Which sentence is punctuated correctly?",
   "I studied hard; however, the test was difficult.",
   [("I studied hard, however, the test was difficult.", "a comma before \"however\" between two complete sentences makes a comma splice."),
    ("I studied hard however, the test was difficult.", "two complete sentences run together with no semicolon or period."),
    ("I studied hard; however the test, was difficult.", "the comma belongs after \"however,\" not between the subject and verb.")],
   "When \"however\" joins two complete sentences, use a semicolon before it and a comma after it.", 2)
mc("E.1.2-006", "Which sentence uses a colon correctly?",
   "The kit includes three items: gauze, tape, and gloves.",
   [("The kit includes: gauze, tape, and gloves.", "the words before the colon (\"The kit includes\") aren't a complete sentence."),
    ("The kit: includes gauze, tape, and gloves.", "a colon can't split a subject from its verb."),
    ("The kit includes items such as: gauze, tape, and gloves.", "no colon after \"such as.\"")],
   "A colon introduces a list only after a complete sentence (\"The kit includes three items\").", 2)
mc("E.1.2-007", "Maria has only one sister. Which sentence that Maria might write about her sister is punctuated correctly?",
   "My sister, who lives in Norfolk, is a nurse.",
   [("My sister who lives in Norfolk, is a nurse.", "one comma separates the subject from its verb; extra information needs a comma on both sides."),
    ("My sister, who lives in Norfolk is a nurse.", "the extra information needs a closing comma too."),
    ("My, sister who lives in Norfolk is a nurse.", "the comma after \"My\" splits a word from the noun it belongs to.")],
   "Maria has one sister, so \"who lives in Norfolk\" is extra information. Extra information takes a pair of commas, one on each side.", 3)
mc("E.1.2-008", "Which sentence punctuates the quotation correctly?",
   "She said, \"The lab opens at noon.\"",
   [("She said, \"The lab opens at noon\".", "in American English the period goes inside the closing quotation mark."),
    ("She said \"The lab opens at noon.\"", "a comma is needed after \"said\" to introduce the quotation."),
    ("She said, \"the lab opens at noon.\"", "a full-sentence quotation starts with a capital letter.")],
   "Use a comma to introduce the quotation, capitalize its first word, and put the period inside the quotation marks.", 2)
mc("E.1.2-009", "Which is the correct way to write \"the books that belong to the children\"?",
   "the children's books",
   [("the childrens' books", "\"children\" is already plural and doesn't end in s, so add 's, not s'."),
    ("the childrens books", "the possessive needs an apostrophe."),
    ("the childrens's books", "adds an extra s; \"childrens\" is not a word.")],
   "For a plural noun that doesn't end in s, add 's: children → children's.", 2)
mc("E.1.2-010", "Which sentence is punctuated correctly?",
   "However, the shift ran late.",
   [("The doctor however, was on time.", "\"however\" in the middle of a sentence needs a comma on both sides."),
    ("Therefore the patient, rested.", "the comma belongs after \"Therefore,\" not between the subject and verb."),
    ("For example the test, was long.", "the comma belongs after \"For example,\" not between the subject and verb.")],
   "An introductory transition such as \"However\" is followed by a comma.", 1)
mc("E.1.2-011", "Which sentence is punctuated correctly?",
   "On March 3, 2026, the clinic opened.",
   [("On March 3 2026 the clinic opened.", "missing the commas after the day and after the year."),
    ("On March, 3 2026 the clinic opened.", "the comma goes between the day and the year, not between the month and the day."),
    ("On March 3, 2026 the clinic, opened.", "missing the comma after the year, and the last comma splits the subject from its verb.")],
   "In a full date, put a comma between the day and the year and another comma after the year when the sentence continues.", 2)
fixed("E.1.2-012", "Select all", "Which sentences are punctuated correctly? Select all that apply.",
      ["We checked the chart, and we called the doctor.", "We checked the chart, we called the doctor.",
       "We checked the chart; we called the doctor.", "We checked the chart and called the doctor.",
       "We checked the chart and, called the doctor."], "A, C, D",
      "A joins two complete sentences with a comma + \"and.\" C joins them with a semicolon. D has one subject with two verbs, so it needs no comma.",
      "B: a comma alone between two complete sentences is a comma splice. E: the comma after \"and\" is misplaced.", 3)
mc("E.1.2-013", "Which sentence uses capital letters correctly?",
   "Last spring, my aunt moved to Virginia.",
   [("Last Spring, my Aunt moved to Virginia.", "seasons aren't capitalized, and \"aunt\" isn't capitalized when it follows \"my.\""),
    ("Last spring, my aunt moved to virginia.", "a state's name is a proper noun and must be capitalized."),
    ("Last Spring, my aunt moved to Virginia.", "seasons aren't capitalized.")],
   "Capitalize proper nouns such as Virginia. Don't capitalize seasons, or family words used after \"my.\"", 2)
mc("E.1.2-014", "Which sentence uses capital letters correctly?",
   "I asked Doctor Patel about my results.",
   [("I asked doctor Patel about my results.", "a title used before a name is capitalized."),
    ("The Doctor said my results were normal.", "a title used alone, without a name, isn't capitalized."),
    ("I'm taking Biology and english this term.", "school subjects aren't capitalized unless they're languages, so it should be \"biology\" and \"English.\"")],
   "Capitalize a title when it comes right before a person's name.", 2)

# ---------- E.1.3 Sentence structure ----------
mc("E.1.3-005", "Which of the following is a sentence fragment?",
   "Although the waiting room was full.",
   [("The nurse smiled at the anxious patient.", "has a subject and a verb and is a complete thought."),
    ("Please sit down and wait for your name.", "a command; the subject \"you\" is understood, so it's complete."),
    ("The test ended at noon on Friday.", "has a subject and a verb and is a complete thought.")],
   "\"Although\" makes the clause dependent, so it can't stand alone.", 1)
mc("E.1.3-006", "Which revision correctly fixes this comma splice?\n\nThe power went out, the generator started.",
   "When the power went out, the generator started.",
   [("The power went out, the generator, started.", "keeps the comma splice and adds a comma between the subject and verb."),
    ("The power went out the generator started.", "removing the comma makes a run-on."),
    ("The power went out, then the generator started.", "\"then\" isn't a FANBOYS word, so a comma before it still leaves a comma splice.")],
   "Making the first clause dependent with \"When\" turns the two sentences into one correct complex sentence.", 3)
mc("E.1.3-007", "Which sentence has parallel structure?",
   "She enjoys hiking, swimming, and reading.",
   [("She enjoys hiking, swimming, and to read.", "switches from -ing words to \"to read.\""),
    ("She enjoys to hike, swimming, and reading.", "mixes \"to hike\" with -ing words."),
    ("She enjoys hiking, to swim, and reads.", "mixes three different forms.")],
   "All three items use the same -ing form.", 1)
mc("E.1.3-008", "Which of the following is a complex sentence?",
   "Because the lab was closed, we left.",
   [("The lab was closed, so we left.", "two independent clauses joined by \", so\": a compound sentence."),
    ("The lab was closed.", "one independent clause: a simple sentence."),
    ("The lab was closed; we left.", "two independent clauses joined by a semicolon: a compound sentence.")],
   "A complex sentence has one independent clause plus a dependent clause (\"Because the lab was closed\").", 2)
mc("E.1.3-009", "Which sentence uses a modifier correctly?",
   "Driving to work, I saw a deer.",
   [("I saw a deer driving to work.", "the phrase sits next to \"deer,\" so the sentence can be read as saying the deer was driving."),
    ("Driving to work, a deer ran across the road.", "the phrase describes the deer, which wasn't driving."),
    ("Driving to work, the road was blocked by a deer.", "the phrase describes the road.")],
   "The phrase \"Driving to work\" must sit next to the person who was driving: \"I.\"", 2)
mc("E.1.3-010", "Which of the following is a compound-complex sentence?",
   "When the alarm rang, the nurse responded, and the patient woke up.",
   [("The alarm rang in the hall, and the nurse responded quickly.", "two independent clauses with no dependent clause: compound."),
    ("When the alarm rang in the hall, the nurse responded quickly.", "one dependent and one independent clause: complex."),
    ("The alarm rang loudly in the hall outside the patient's room.", "one independent clause: simple.")],
   "A compound-complex sentence has at least two independent clauses (\"the nurse responded\"; \"the patient woke up\") and at least one dependent clause (\"When the alarm rang\").", 3)
mc("E.1.3-011", "Which of the following is a complete sentence?",
   "The shuttle was delayed by the storm.",
   [("Running late for the exam.", "no subject and no complete verb."),
    ("Since the shuttle was delayed.", "\"Since\" makes this a dependent clause."),
    ("The shuttle, which was delayed by the storm.", "has a subject but no main verb for it.")],
   "It has a subject (shuttle), a verb (was delayed), and a complete thought.", 2)
mc("E.1.3-012", "Which revision best combines these two sentences?\n\nThe patient was nervous. She asked many questions.",
   "The patient was nervous, so she asked many questions.",
   [("The patient was nervous, she asked many questions.", "a comma alone between two complete sentences is a comma splice."),
    ("The patient was nervous so, she asked many questions.", "the comma belongs before \"so,\" not after it."),
    ("The patient, was nervous and asked, many questions.", "the commas split the subject from its verb and the verb from its object.")],
   "Two complete sentences can be joined with a comma plus a FANBOYS word such as \"so.\"", 2)
mc("E.1.3-013", "Which sentence is a run-on?",
   "The test is tomorrow I need to study.",
   [("The test is tomorrow, so I need to study.", "joined correctly with a comma + \"so.\""),
    ("Because the test is tomorrow, I need to study.", "a correct complex sentence."),
    ("The test is tomorrow; I need to study.", "joined correctly with a semicolon.")],
   "Two complete sentences are joined with no punctuation or joining word.", 1)

# ---------- E.2.1 Grammar for clarity ----------
mc("E.2.1-005", "Which verb correctly completes the sentence?\n\nNeither the students nor the instructor ___ ready.",
   "was",
   [("were", "agrees with \"students,\" but the verb should agree with the nearer subject, \"instructor.\""),
    ("are", "plural and present tense; the nearer subject, \"instructor,\" is singular."),
    ("have been", "plural; the nearer subject, \"instructor,\" is singular.")],
   "With \"neither … nor,\" the verb agrees with the subject nearer to it: \"the instructor was.\"", 3)
mc("E.2.1-006", "Which verb correctly completes the sentence?\n\nThe results of the study ___ surprising.",
   "were",
   [("was", "agrees with \"study,\" but the subject is \"results.\""),
    ("is", "singular; the subject \"results\" is plural."),
    ("has been", "singular; the subject \"results\" is plural.")],
   "The subject is \"results\" (plural). \"Of the study\" is a phrase in between and doesn't change the verb.", 2)
mc("E.2.1-007", "Which sentence uses who or whom correctly?",
   "To whom should I send the form?",
   [("Whom is calling?", "the caller is a subject (he is calling), so use \"who.\""),
    ("The nurse whom helped me was kind.", "the nurse is the subject of \"helped\" (she helped), so use \"who.\""),
    ("Whom did the report say was absent?", "the person is the subject of \"was absent\" (he was absent), so use \"who.\"")],
   "After a preposition (\"to\"), use the object form \"whom.\" Test: send it to him.", 3)
mc("E.2.1-008", "Which sentence uses pronouns correctly?",
   "The instructor gave the handouts to Ana and me.",
   [("The instructor gave the handouts to Ana and I.", "\"I\" can't follow \"to\"; test: \"gave the handouts to I.\""),
    ("Between you and I, the test was hard.", "after the preposition \"between,\" use \"me.\""),
    ("Him and Ana finished early.", "the subject needs \"He\"; test: \"Him finished early.\"")],
   "After the preposition \"to,\" use the object form \"me.\" Test by removing Ana: \"gave the handouts to me.\"", 2)
mc("E.2.1-009", "Which sentence uses fewer or less correctly?",
   "There were fewer patients in the clinic today.",
   [("There were less patients in the clinic today.", "patients can be counted, so use \"fewer.\""),
    ("We need fewer water for this recipe.", "water is an amount, not a count, so use \"less.\""),
    ("She drank fewer coffee this week.", "coffee is an amount, so use \"less.\"")],
   "Use \"fewer\" for things you can count and \"less\" for amounts.", 2)
mc("E.2.1-010", "Which sentence is written in the active voice?",
   "The technician collected the samples.",
   [("The samples were collected by the technician.", "passive: the subject (samples) receives the action."),
    ("The samples had been collected before noon.", "passive, and the doer isn't named."),
    ("Mistakes were made during the procedure.", "passive, and the doer isn't named.")],
   "In the active voice the subject (the technician) does the action.", 2)
mc("E.2.1-011", "Which revision of this sentence is clearest and most concise?\n\nDue to the fact that the road was closed, we were late.",
   "Because the road was closed, we were late.",
   [("Due to the fact of the road closure, we were late.", "keeps the wordy \"due to the fact.\""),
    ("Owing to the fact that the road was closed, we were late.", "just as wordy as the original."),
    ("Due to the fact that there was a road closure, we were late.", "even wordier than the original.")],
   "\"Because\" replaces the five-word phrase \"due to the fact that\" without losing meaning.", 1)
mc("E.2.1-012", "Which sentence uses an adjective or adverb correctly?",
   "She answered the question correctly.",
   [("She sings good.", "\"sings\" is an action verb, so it needs the adverb \"well.\""),
    ("The soup smells well.", "\"smells\" is a linking verb here, so it needs the adjective \"good.\""),
    ("He did really good on the exam.", "\"did\" is an action verb, so it needs \"well.\"")],
   "\"Correctly\" is an adverb describing the action verb \"answered.\"", 2)
mc("E.2.1-013", "Which verb correctly completes the sentence?\n\nThere ___ several reasons to arrive early.",
   "are",
   [("is", "the subject comes after the verb: \"reasons\" is plural."),
    ("was", "singular; the subject \"reasons\" is plural."),
    ("has been", "singular; the subject \"reasons\" is plural.")],
   "In a \"There is/There are\" sentence, the subject comes after the verb. \"Reasons\" is plural, so use \"are.\"", 2)
mc("E.2.1-014", "Which sentence avoids an unclear pronoun reference?",
   "When Sam called Raj, Sam was still at work.",
   [("The doctor told the nurse that she needed a break.", "\"she\" could mean the doctor or the nurse."),
    ("When the cup hit the tray, it broke.", "\"it\" could mean the cup or the tray."),
    ("They say the clinic is closing.", "\"They\" doesn't refer to anyone named.")],
   "Repeating the name removes any doubt about who was at work.", 3)

# ---------- E.2.2 Audience ----------
mc("E.2.2-005", "Which sentence is most appropriate for a cover letter for a nursing assistant job?",
   "I am excited to apply for your nursing assistant position.",
   [("I'm super pumped to work at your totally awesome hospital this year!", "slang and exaggeration are too informal for a cover letter."),
    ("Hire me for this job right away. You definitely won't regret it.", "a pushy command that's too demanding for a cover letter."),
    ("I really need this job badly because my bills keep piling up.", "informal, and it focuses on the writer's need, not what they offer.")],
   "A cover letter calls for a polite, formal, and specific tone.", 1)
mc("E.2.2-006", "A writer wants to describe a patient's attitude in a positive way. Which word fits best?",
   "determined",
   [("stubborn", "similar meaning but a negative connotation."),
    ("obstinate", "similar meaning but a negative connotation."),
    ("bullheaded", "negative and informal.")],
   "All four words describe someone who won't give up or give in, but only \"determined\" has a positive connotation.", 2)
mc("E.2.2-007", "Which sentence is most appropriate for a lab report?",
   "The plants kept in light grew 4 cm more than the plants kept in the dark.",
   [("We think the plants probably grew more because of the light, maybe.", "vague and full of hedging words."),
    ("The light made the plants grow like crazy compared to the dark ones.", "slang, and gives no measurement."),
    ("I was totally amazed by how much the plants in the light grew!", "emotional, and gives no data.")],
   "A lab report should be objective and precise, reporting measured results.", 1)
mc("E.2.2-008", "A pamphlet is titled \"Why You Should Get a Flu Shot.\" What is the main purpose of the pamphlet?",
   "To persuade readers to get vaccinated",
   [("To entertain readers with a story", "the title gives reasons, not a story."),
    ("To explain how the flu virus was discovered", "the title isn't about history."),
    ("To describe a nurse's workday", "the topic is the flu shot, not a nurse's day.")],
   "\"Why you should\" signals an argument meant to convince the reader to act.", 1)
mc("E.2.2-009", "A nurse is writing discharge instructions for a patient. Which sentence is best?",
   "Walk three times a day, and don't eat or drink anything after midnight.",
   [("Ambulate TID and maintain NPO status after midnight before your procedure.", "medical abbreviations the patient may not understand."),
    ("Try to get some walking in and maybe skip eating late at night.", "too vague: how often, and what exactly to skip?"),
    ("Ambulation and NPO adherence after midnight are recommended for you.", "jargon the patient may not understand, and it doesn't say how often to walk.")],
   "Patient instructions should use plain, specific language.", 2)
mc("E.2.2-010", "Which phrase uses person-first language?",
   "the patient with diabetes in room 4",
   [("the diabetic patient in room 4", "puts the condition before the person."),
    ("the diabetes case in room 4", "calls the person a \"case.\""),
    ("the diabetic woman in room 4", "puts the condition before the person.")],
   "Person-first language names the person first and the condition second.", 2)
mc("E.2.2-011", "Which message is the most appropriate text to a close friend?",
   "I'm running 10 min late. Save me a seat!",
   [("Dear Ms. Lopez, I regret to inform you that I will be late.", "far too formal for a close friend."),
    ("Pursuant to our arrangement, I shall arrive late.", "stiff legal wording that doesn't fit a friend."),
    ("To whom it may concern: I will be late.", "a formal greeting for an unknown reader.")],
   "Informal, short messages suit a close friend. The best register depends on the audience.", 1)
mc("E.2.2-012", "Which sentence avoids unnecessary references to personal traits?",
   "The doctor explained the results.",
   [("The elderly lady doctor explained the results.", "age and gender have nothing to do with the point."),
    ("The female doctor, surprisingly, explained the results clearly.", "mentions gender, and \"surprisingly\" implies bias."),
    ("The young male nurse helped the patient.", "age and gender have nothing to do with the point.")],
   "Mention traits such as age or gender only when they matter to the point.", 2)
mc("E.2.2-013", "Which choice is the most precise wording for a formal report?\n\nThe medication ___ the patient's pain.",
   "reduced",
   [("did stuff to", "vague and informal."),
    ("messed with", "slang."),
    ("kind of helped", "vague and informal.")],
   "\"Reduced\" is precise and formal.", 1)

# ---------- E.2.3 Paragraphs ----------
mc("E.2.3-005", "Choose the best transition for the blank.\n\nThe clinic extended its hours. ___, more working adults were able to get care.",
   "As a result",
   [("However", "signals a contrast, but the second sentence is a result."),
    ("For example", "the second sentence isn't an example of extended hours."),
    ("Similarly", "signals a comparison, not a result.")],
   "The second sentence describes an effect of the first, so a cause-and-effect transition fits.", 1)
mc("E.2.3-006", "Choose the best transition for the blank.\n\nSome students study best in the morning. ___, others focus better at night.",
   "In contrast",
   [("Therefore", "signals a result; night studying isn't caused by morning studying."),
    ("For instance", "the second sentence isn't an example of the first."),
    ("As a result", "signals a result, not a difference.")],
   "The two sentences describe opposite habits, so a contrast transition fits.", 1)
mc("E.2.3-007", "Which sentence would best conclude this paragraph?\n\nDrinking enough water helps the body in several ways. It keeps body temperature steady. It helps the kidneys remove waste. It also cushions the joints.",
   "For these reasons, staying hydrated supports good health.",
   [("Some people prefer sparkling water to plain tap water.", "an off-topic detail."),
    ("Water covers most of Earth's surface, including the oceans.", "true, but off topic."),
    ("Coffee and tea also contain a lot of water.", "introduces a new topic instead of wrapping up.")],
   "A concluding sentence sums up the main idea that the details supported.", 1)
fixed("E.2.3-008", "Ordered response", "Put these sentences in the most logical order for a paragraph about checking a pulse at the wrist.",
      ["Count the beats for 30 seconds.", "Place two fingers on the inside of the wrist, below the thumb.",
       "Multiply the count by 2 to get beats per minute.", "Have the person sit and rest for a few minutes."], "D, B, A, C",
      "The steps follow time order: rest first, find the pulse, count, then calculate.",
      "Common error: counting before the fingers are placed. Another: multiplying before counting.", 2)
fixed("E.2.3-009", "Select all", "A paragraph's topic sentence is \"Regular sleep improves student performance.\" Which sentences support it? Select all that apply.",
      ["Well-rested students remember more of what they study.", "Many dorms have bunk beds.",
       "Sleep helps the brain store new information.", "Some students work night shifts at restaurants.",
       "Students who sleep enough often score higher on tests."], "A, C, E",
      "A, C, and E each connect sleep to learning or test performance.",
      "B: about furniture, not performance. D: about jobs; it doesn't connect sleep to performance.", 2)
mc("E.2.3-010", "Which sentence does NOT belong in a paragraph about preparing for a blood draw?",
   "Blood is made of plasma, red cells, white cells, and platelets.",
   [("Drink plenty of water the day before so your veins are easier to find.", "a preparation tip."),
    ("Wear a shirt with sleeves that roll up easily.", "a preparation tip."),
    ("Tell the technician if you tend to feel faint.", "a preparation tip.")],
   "The paragraph is about how to prepare. What blood is made of is true but off topic.", 2)
mc("E.2.3-011", "Which topic sentence best fits these supporting details?\n\n• The program offers evening classes.\n• Students can get help with child care costs.\n• Tutors are available on weekends.",
   "The program is designed to fit the lives of working adults.",
   [("Evening classes in the program start at 6 p.m. on weeknights.", "a single detail, not a main idea."),
    ("Tutoring can be useful for many different kinds of students.", "covers only one detail."),
    ("Many college programs in Virginia are expensive to attend.", "doesn't connect to the details listed.")],
   "Each detail shows the program fitting around jobs and family, so this main idea covers all three.", 2)
mc("E.2.3-012", "A writer lists reasons to wash hands and saves the strongest reason for last. Which transition best introduces that last reason?",
   "Most importantly",
   [("First", "starts a list rather than ending it."),
    ("For example", "introduces an example, not the strongest reason."),
    ("In contrast", "signals an opposing idea.")],
   "Order of importance builds to the strongest point, often signaled by \"most importantly.\"", 2)
mc("E.2.3-013", "Which method of organization does this paragraph use?\n\nFirst, blood enters the right atrium. Next, it flows into the right ventricle. Then it is pumped to the lungs.",
   "Chronological (sequence) order",
   [("Spatial (location) order", "describes where things are, not when they happen."),
    ("Compare-and-contrast order", "would show similarities and differences."),
    ("Order of importance (ranking)", "would rank ideas from least to most important.")],
   "The signal words first, next, and then show steps in time order.", 1)

# ---------- E.3.1 Writing process ----------
mc("E.3.1-005", "A student lists every idea she can think of about her topic without judging any of them. Which prewriting strategy is she using?",
   "Brainstorming",
   [("Proofreading", "checks a finished draft for errors."),
    ("Citing", "gives credit to sources."),
    ("Revising", "improves a draft that already exists.")],
   "Brainstorming means listing ideas freely before choosing what to use.", 1)
mc("E.3.1-006", "Which task belongs to the drafting stage of the writing process?",
   "Writing full paragraphs from an outline",
   [("Choosing a topic and making a list of ideas", "prewriting."),
    ("Checking each sentence for comma errors", "editing."),
    ("Submitting the final copy to the instructor", "publishing.")],
   "Drafting turns the plan into a first full version.", 1)
mc("E.3.1-007", "Which addition would most strengthen support for this thesis?\n\nCommunity gardens improve neighborhood health.",
   "Survey data showing garden members eat more vegetables",
   [("A sentence explaining that the writer personally enjoys gardening", "personal preference isn't evidence."),
    ("A paragraph describing the history of the garden shovel", "off topic."),
    ("A list of the most popular flower colors in local gardens", "doesn't connect to health.")],
   "Data that links gardens to healthier eating directly supports the claim.", 2)
mc("E.3.1-008", "Which is the strongest evidence for the claim that handwashing reduces infections?",
   "A hospital study found infections fell as staff handwashing rose.",
   [("My friend washes her hands all the time and almost never gets sick.", "one person's experience is weak evidence."),
    ("Washing your hands with warm water and soap feels very refreshing.", "a feeling isn't evidence about infections."),
    ("Everyone already knows that washing your hands works well.", "an appeal to popular belief, not evidence.")],
   "Data from a study is stronger evidence than opinion or a single anecdote.", 2)
mc("E.3.1-009", "Which of the following is an example of plagiarism?",
   "Copying a paragraph from a website without quotation marks or credit",
   [("Quoting a source in quotation marks and citing it", "proper use of a source."),
    ("Summarizing a source in your own words and citing it", "proper use of a source."),
    ("Stating common knowledge, such as \"the heart pumps blood,\" without a citation", "common knowledge doesn't need a citation.")],
   "Using someone else's words or ideas without credit is plagiarism.", 1)
mc("E.3.1-010", "While revising, a writer notices that one paragraph discusses two unrelated ideas. What should the writer do?",
   "Split it into two paragraphs, each with its own topic sentence",
   [("Correct all the spelling errors in that paragraph", "editing won't fix a problem with unity."),
    ("Add a more interesting title to the beginning of the essay", "doesn't address the paragraph."),
    ("Delete the conclusion so the essay is shorter", "unrelated to the problem.")],
   "Each paragraph should develop one main idea, so the two ideas need separate paragraphs.", 2)
mc("E.3.1-011", "In a short academic essay, where is the thesis statement usually placed?",
   "At the end of the introduction",
   [("Only in the conclusion", "the conclusion restates the thesis; it doesn't introduce it."),
    ("In the middle of the second body paragraph", "readers need the main claim up front."),
    ("Only in the title", "a title isn't a full thesis statement.")],
   "The introduction leads up to the thesis, which tells the reader the essay's main claim.", 1)
mc("E.3.1-012", "During prewriting, which question best helps a writer plan for the audience?",
   "Who will read this, and what do they already know?",
   [("Did I spell every word in my draft correctly?", "an editing question."),
    ("Which font and color will make the essay look best?", "about formatting, not audience."),
    ("Are all of my commas in the right places?", "an editing question.")],
   "Thinking about readers' needs and background shapes content, word choice, and tone.", 1)
mc("E.3.1-013", "Which sentence is the best paraphrase of this one?\n\n\"Regular exercise lowers the risk of heart disease.\"",
   "People who work out often are less likely to develop heart problems.",
   [("\"Regular exercise lowers the risk of heart disease.\"", "this is a direct quotation, not a paraphrase."),
    ("Exercise is one of the main causes of heart disease in adults.", "reverses the meaning."),
    ("Heart disease is a common illness in the United States.", "drops the main idea about exercise.")],
   "A paraphrase keeps the original meaning in new words.", 2)
mc("E.3.1-014", "What is the main job of a conclusion paragraph?",
   "To restate the main point and show why it matters",
   [("To introduce a brand-new argument for the reader", "new arguments belong in the body."),
    ("To list every source the writer used in the essay", "that's the job of the reference list."),
    ("To apologize for any weaknesses in the argument", "undercuts the essay.")],
   "A conclusion wraps up by restating the thesis in new words and showing its significance.", 1)
mc("E.3.1-015", "Which point would support the thesis \"High schools should start later in the morning\"?",
   "Teenagers get more sleep when school starts later.",
   [("School buses are painted yellow.", "about bus color, not start times."),
    ("Some schools require uniforms.", "about dress codes, not start times."),
    ("Later start times can make it harder for students to get to after-school jobs.", "on topic, but it's a point against the thesis, not support for it.")],
   "Only this point gives a reason for the claim.", 1)
mc("E.3.1-016", "Why might a writer include a counterargument in a persuasive essay?",
   "To answer an opposing view and strengthen the argument",
   [("To confuse readers about which side the writer is on", "a counterargument is answered, not left hanging."),
    ("To make the essay shorter and easier to finish", "it usually adds length."),
    ("To replace the thesis statement with a new claim", "the thesis stays the same.")],
   "Addressing the other side and answering it makes an argument more convincing.", 2)
fixed("E.3.1-017", "Ordered response", "Put the stages of the writing process in order.",
      ["Revising", "Prewriting", "Editing and proofreading", "Drafting"], "B, D, A, C",
      "Plan (prewriting), write (drafting), improve the content (revising), then fix surface errors (editing and proofreading).",
      "Common error: editing before revising; there's no point polishing sentences that may be cut.", 2)
fixed("E.3.1-018", "Select all", "Which of these are revising tasks? Select all that apply.",
      ["Moving a paragraph to improve the order", "Fixing a misspelled word", "Adding an example to support a point",
       "Correcting a comma splice", "Cutting a sentence that is off topic"], "A, C, E",
      "Revising changes content and organization: moving, adding, and cutting.",
      "B and D: fixing spelling and punctuation is editing.", 2)
mc("E.3.1-019", "Which source is most reliable for a research paper on high blood pressure?",
   "A government health agency website, such as the CDC's",
   [("An anonymous post shared widely on social media", "no author or evidence to check."),
    ("An advertisement for a blood pressure supplement", "written to sell a product."),
    ("An online forum where users share their opinions", "opinions, not checked facts.")],
   "Government health agencies publish reviewed, evidence-based information and name their sources.", 1)
mc("E.3.1-020", "Which detail best supports the thesis \"Everyone should learn basic first aid\"?",
   "Prompt bystander CPR can double or triple the chance of surviving cardiac arrest.",
   [("First aid kits come in many sizes and are sold at most drugstores.", "doesn't give a reason to learn first aid."),
    ("The American Red Cross, which teaches first aid, was founded in the 1800s.", "a history fact, not a reason."),
    ("Some people dislike the sight of blood and feel uneasy around injuries.", "doesn't support the claim.")],
   "Evidence that bystander CPR saves lives gives a strong reason for everyone to learn it.", 2)

# ---------- E.3.2 Word parts ----------
mc("E.3.2-005", "The prefix brady- means",
   "slow", [("fast", "fast is tachy-."), ("large", "large or enlarged is megal/o or -megaly."), ("painful", "pain is -algia.")],
   "Brady- means slow, as in bradycardia (a slow heart rate).", 1)
mc("E.3.2-006", "Using its word parts, what does gastritis mean?",
   "Inflammation of the stomach",
   [("Surgical removal of the stomach", "removal is -ectomy (gastrectomy)."),
    ("Study of the stomach", "study of is -logy."),
    ("Pain in the stomach", "pain is -algia.")],
   "Gastr/o = stomach; -itis = inflammation.", 1)
mc("E.3.2-007", "Which term means surgical removal of the appendix?",
   "appendectomy",
   [("appendicitis", "-itis means inflammation."),
    ("appendotomy", "-otomy means cutting into, not removal."),
    ("appendalgia", "-algia means pain.")],
   "-Ectomy means surgical removal.", 1)
mc("E.3.2-008", "The root nephr/o refers to the",
   "kidney", [("liver", "liver is hepat/o."), ("lung", "lung is pulmon/o or pneumon/o."), ("nerve", "nerve is neur/o.")],
   "Nephr/o means kidney, as in nephrology.", 1)
mc("E.3.2-009", "Using its word parts, what does intravenous mean?",
   "Within a vein",
   [("Around a vein", "around is peri-."),
    ("Under a vein", "under is sub-."),
    ("Removal of a vein", "removal is -ectomy.")],
   "Intra- = within; ven/o = vein.", 1)
mc("E.3.2-010", "Using its word parts, what does cardiomegaly mean?",
   "An enlarged heart",
   [("A slow heart rate", "that's bradycardia."),
    ("Inflammation of the heart", "that's carditis."),
    ("Heart pain", "pain is -algia.")],
   "Cardi/o = heart; -megaly = enlargement.", 2)
mc("E.3.2-011", "The suffix -algia means",
   "pain", [("inflammation", "inflammation is -itis."), ("enlargement", "enlargement is -megaly."), ("study of", "study of is -logy.")],
   "-Algia means pain, as in neuralgia (nerve pain).", 1)
mc("E.3.2-012", "Which term means a body temperature that is below normal?",
   "hypothermia",
   [("hyperthermia", "hyper- means above normal."),
    ("hypoglycemia", "glyc/o means sugar: low blood sugar."),
    ("thermometer", "therm/o = heat and -meter = measuring instrument; a thermometer measures temperature, not a condition.")],
   "Hypo- = below; therm/o = heat; -ia = condition.", 2)
mc("E.3.2-013", "Using its word parts, what does pericardium most likely refer to?",
   "The sac around the heart",
   [("The inside lining of the heart", "inside would be endo- (endocardium)."),
    ("The heart muscle", "muscle is my/o (myocardium)."),
    ("An enlarged heart", "that's cardiomegaly.")],
   "Peri- = around; cardi/o = heart.", 2)
mc("E.3.2-014", "Using its word parts, what does transport mean?",
   "To carry across",
   [("To look across", "\"look\" is the root spect."),
    ("To write again", "\"write\" is the root scrib/script, and \"again\" is re-."),
    ("Unable to be carried", "\"not\" is un- or in-, and \"able\" is -able.")],
   "Trans- = across; port = carry.", 2)
mc("E.3.2-015", "What does dys- mean in the word dysfunction?",
   "abnormal or impaired", [("without or lacking", "without is a- or an-."), ("under or below", "under is sub-."), ("again or back", "again is re-.")],
   "Dys- means difficult, painful, or abnormal. A dysfunction is abnormal or impaired function.", 2)
mc("E.3.2-016", "Which word part means cell?",
   "cyt/o", [("my/o", "my/o means muscle."), ("oste/o", "oste/o means bone."), ("derm/o", "derm/o means skin.")],
   "Cyt/o means cell, as in cytology (the study of cells).", 1)
mc("E.3.2-017", "A patient reports arthralgia. Using word parts, what does this mean?",
   "Joint pain",
   [("Joint inflammation", "that would be arthritis (-itis)."),
    ("Surgical removal of a joint", "removal is -ectomy."),
    ("Joint enlargement", "enlargement is -megaly.")],
   "Arthr/o = joint; -algia = pain.", 2)
mc("E.3.2-018", "In the word postoperative, the prefix post- means",
   "after", [("before", "before is pre-."), ("during", "during is intra- (intraoperative)."), ("around", "around is peri-.")],
   "Postoperative means after surgery.", 1)
fixed("E.3.2-019", "Select all", "Which words contain a word part meaning blood? Select all that apply.",
      ["hematology", "anemia", "hepatitis", "hemorrhage", "nephrology"], "A, B, D",
      "Hemat/o and hem/o mean blood (hematology, hemorrhage); -emia means a blood condition (anemia).",
      "C: hepat/o means liver. E: nephr/o means kidney.", 3)
mc("E.3.2-020", "Which term means the study of the skin?",
   "dermatology",
   [("dermatitis", "-itis means inflammation."),
    ("hematology", "hemat/o means blood."),
    ("cytology", "cyt/o means cell.")],
   "Dermat/o = skin; -logy = study of.", 1)
