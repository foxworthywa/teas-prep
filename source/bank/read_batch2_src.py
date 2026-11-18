MC = "Multiple choice"
items = []
def mc(id, psg, stem, correct, wrongs, expl, diff):
    items.append(dict(id=id, passage=psg, format=MC, stem=stem, correct=correct, wrongs=wrongs, explanation=expl, difficulty=diff))
def fixed(id, psg, fmt, stem, options, answer, expl, distr, diff):
    items.append(dict(id=id, passage=psg, format=fmt, stem=stem, options=options, answer=answer, explanation=expl, distractors=distr, difficulty=diff))

# ---------- R.1.1 Summarize (3) ----------
mc("R.1.1-005", "RP-17", "Which statement best summarizes the passage?",
   "Vaccines safely show the immune system a germ so it forms memory cells and can fight the real germ fast.",
   [("The flu vaccine must be updated every year because the virus that causes the flu keeps changing over time.", "a single detail from the last paragraph."),
    ("Vaccines often cause a sore arm or a mild fever, so many people choose not to get them at all.", "the passage mentions side effects but never says people skip vaccines."),
    ("The immune system needs several days to recognize a new germ, so most infections cannot be prevented.", "distorts the first paragraph and contradicts the point about vaccines.")],
   "The passage explains how the immune system learns and how vaccines use that ability. The other options are details or distortions.", 2)
mc("R.1.1-006", "RP-24", "Which statement best summarizes the passage?",
   "Fleming found penicillin by accident; others later purified and mass-produced it, changing medicine.",
   [("Fleming returned from a vacation in 1928 and found mold growing on a dish of bacteria in his laboratory.", "a detail from the opening, not the whole passage."),
    ("Fleming alone developed penicillin into a drug and produced enough of it to treat soldiers in World War I.", "the Oxford team purified it, and the passage describes World War II."),
    ("Bacteria have become resistant to penicillin, so doctors no longer use antibiotics to treat infections.", "overstates the warning in the last paragraph.")],
   "A summary covers the discovery, the later development, and the impact.", 2)
mc("R.1.1-007", "RP-21", "Which statement best summarizes both passages?",
   "A teacher argues for phone-free classrooms, while a parent supports limits but not a total ban.",
   [("Both writers agree that phones should be banned from every classroom without exception.", "Passage B argues against a total ban."),
    ("A teacher explains how phone apps can help students manage diabetes during class.", "the diabetes point comes from Passage B, the parent."),
    ("A parent argues that teachers should plan more lessons that require students to use phones.", "Passage B mentions planned use but argues mainly for a limited policy.")],
   "A summary of paired passages states each writer's position.", 1)

# ---------- R.1.2 Inferences (4) ----------
mc("R.1.2-005", "RP-20", "What can the reader infer about Marcus at the beginning of the power outage?",
   "He was nervous, even though he had been trained for emergencies.",
   [("He had never heard of a power outage before that night.", "nothing suggests this; he had trained for it."),
    ("He was angry that Ms. Reyes kept giving him extra tasks to do that night.", "nothing suggests anger; he follows her lead."),
    ("He planned to leave the clinic as soon as the storm ended.", "nothing in the story suggests this.")],
   "His heart pounds, and the story says the class hadn't prepared him for the real noise and fear.", 1)
mc("R.1.2-006", "RP-20", "What does Ms. Reyes most likely mean when she says, \"Plans help, but people are what get you through\"?",
   "Staying calm and caring for others matters as much as having a plan.",
   [("Emergency plans are useless and should not be written at all.", "she says plans help."),
    ("The clinic should hire more people to work the evening shift during storms.", "she isn't talking about staffing levels."),
    ("Patients should take care of themselves during an emergency.", "the staff took care of the patients.")],
   "The plan (flashlights, the generator) helped, but the story shows that calm people looking after the patients got everyone through the night.", 2)
mc("R.1.2-007", "RP-22", "Based on the passage, why did average steps most likely fall slightly in May?",
   "Employees on vacation wore their step counters less.",
   [("Employees forgot how to use their step counters.", "the passage gives no evidence for this."),
    ("The company ended the challenge at the start of May.", "May's average was still recorded."),
    ("The weather in May was too hot for walking outside.", "the passage never mentions weather.")],
   "The wellness coordinator links May to vacations and less use of the step counters.", 2)
mc("R.1.2-008", "RP-24", "What can the reader infer from the fact that Fleming warned about misuse of penicillin in his Nobel lecture?",
   "Concern about antibiotic resistance is not new.",
   [("Fleming did not deserve the Nobel Prize.", "the passage praises the discovery."),
    ("Penicillin was first produced in large amounts in 1945.", "the passage says large-scale production happened during the war, and the lecture isn't about production."),
    ("Penicillin no longer works against any infections.", "the passage doesn't say this.")],
   "Fleming's warning, given when penicillin was new, shows the problem was foreseen from the start.", 3)

# ---------- R.1.3 Written directions (4) ----------
mc("R.1.3-004", "RP-18", "According to the directions, where should a person aim the extinguisher?",
   "Low, at the base of the fire",
   [("High, at the top of the flames", "the directions say not to aim at the flames."),
    ("At the smoke above the fire", "the directions don't mention aiming at smoke."),
    ("At the wall behind the fire", "the directions say to aim at the base of the fire.")],
   "Step A says: \"Aim the nozzle low, at the base of the fire, not at the flames.\"", 1)
mc("R.1.3-005", "RP-18", "A small trash-can fire starts in an office, and the room begins filling with smoke. According to the directions, what should a worker do?",
   "Leave immediately and call 911.",
   [("Pull the pin and aim at the base of the fire.", "the directions say to leave if the room is filling with smoke."),
    ("Stand 6 to 8 feet away and begin to sweep.", "only for a small fire with no spreading smoke."),
    ("Open a window and wait for the smoke to clear.", "the directions never suggest this.")],
   "The directions say: \"If the fire is spreading or the room is filling with smoke, leave immediately and call 911.\"", 2)
mc("R.1.3-006", "RP-04", "An adult took one Allergy Relief tablet at 8:00 a.m. and still has a runny nose at 2:00 p.m. According to the label, what should the adult do?",
   "Wait until 8:00 a.m. the next day before taking another tablet.",
   [("Take a second tablet now, because the first one did not work.", "the label says not to take more than 1 tablet in 24 hours."),
    ("Take half a tablet now and half a tablet at bedtime tonight.", "the label gives no half-tablet dose and limits use to 1 tablet in 24 hours."),
    ("Stop using the product, because it does not work for adults.", "the label doesn't say this; adults are the intended users.")],
   "Adults take 1 tablet every 24 hours, and no more than 1 tablet in 24 hours.", 2)
mc("R.1.3-007", "RP-11", "A student finishes the online permit form on January 8. According to the memo, what is the earliest day the student can pick up the permit?",
   "January 10",
   [("January 8", "permits aren't ready on the day the form is submitted."),
    ("January 9", "that's the form deadline, not the pickup date."),
    ("January 12", "that's the day permits are required, not the first pickup day.")],
   "The memo says permits will be ready for pickup starting January 10.", 2)

# ---------- R.1.4 Locate (3) ----------
mc("R.1.4-004", "RP-24", "According to the passage, who led the Oxford team that purified penicillin?",
   "Howard Florey and Ernst Chain",
   [("Alexander Fleming and Howard Florey", "Fleming was not part of the Oxford team."),
    ("Alexander Fleming working alone", "Fleming couldn't produce enough pure penicillin."),
    ("Ernst Chain and a drug company", "the drug companies came later, during the war.")],
   "The passage names Howard Florey and Ernst Chain as the leaders of the Oxford team.", 1)
mc("R.1.4-005", "RP-23", "According to the label, how many grams of added sugars are in one serving?",
   "8 g",
   [("4 g", "that's the dietary fiber (and the protein)."),
    ("9 g", "that's total sugars, which includes the added sugars."),
    ("30 g", "that's total carbohydrate.")],
   "The label says \"Total sugars: 9 g, including 8 g added sugars.\"", 2)
mc("R.1.4-006", "RP-17", "According to the passage, what are the most common side effects of vaccines?",
   "A sore arm or a mild fever for a day or two",
   [("Several days of illness while the body learns the germ", "describes catching the real germ, not getting a vaccine."),
    ("A changing virus that requires a new dose every year", "describes why the flu vaccine is updated."),
    ("Memory cells that stay in the body after an infection", "memory cells are the goal, not a side effect.")],
   "The last paragraph names \"a sore arm or a mild fever for a day or two.\"", 1)

# ---------- R.1.5 Visuals (2) ----------
mc("R.1.5-005", "RP-19", "A student needs to be at the Health Sciences Building by 10:00 a.m. Which is the latest shuttle run from the Main Street Park-and-Ride that gets her there on time?",
   "Run 2, leaving at 9:30 a.m.",
   [("Run 1, leaving at 7:00 a.m.", "arrives on time, but Run 2 is later and still arrives by 9:55."),
    ("Run 3, leaving at 12:30 p.m.", "arrives at 12:55 p.m., too late."),
    ("Run 4, leaving at 4:00 p.m.", "arrives at 4:25 p.m., too late.")],
   "Run 2 reaches the Health Sciences Building at 9:55 a.m., before 10:00.", 2)
mc("R.1.5-006", "RP-22", "In which month did the employees first reach the company's goal?",
   "April",
   [("February", "4,800 is below 7,000."),
    ("March", "6,100 is below 7,000."),
    ("May", "May also met the goal (7,200), but April was first.")],
   "April's average (7,400) was the first to reach at least 7,000.", 1)

# ---------- R.1.6 Sequence (3) ----------
mc("R.1.6-004", "RP-24", "Which event happened last?",
   "Fleming, Florey, and Chain shared the Nobel Prize.",
   [("Fleming published his findings about penicillin.", "1929."),
    ("The Oxford team showed that penicillin cured infections.", "around 1940."),
    ("Fleming found mold growing on a dish of bacteria.", "1928, the first event.")],
   "The Nobel Prize came in 1945, after the other events.", 1)
mc("R.1.6-005", "RP-20", "What did Ms. Reyes ask Marcus to do after she sent him for flashlights?",
   "Sit with the waiting patients and explain what was happening",
   [("Lock up the clinic for the night", "they locked up at the end of the story."),
    ("Check that the backup generator had started", "Ms. Reyes checked the generator herself while Marcus got the flashlights."),
    ("Call the doctor to cancel the evening appointments", "the story says every patient was seen.")],
   "She sent Marcus for flashlights while she checked the generator herself. Then she asked him to sit with the patients and explain what was happening.", 2)
fixed("R.1.6-006", "RP-18", "Ordered response", "Put these actions in the correct order for using a fire extinguisher.",
      ["Squeeze the handle slowly and evenly.", "Pull the pin.", "Sweep from side to side.", "Aim the nozzle at the base of the fire."],
      "B, D, A, C", "PASS: Pull, Aim, Squeeze, Sweep.",
      "Common error: squeezing before aiming. Another: aiming before pulling the pin, which leaves the extinguisher sealed.", 1)

# ---------- R.2.1 Fact/opinion/bias (5) ----------
mc("R.2.1-006", "RP-21", "Which statement based on Passage A is an opinion?",
   "Classrooms should be phone-free.",
   [("Every time a phone buzzes, my students' attention breaks.", "an observation the teacher reports."),
    ("Our school began requiring students to keep phones in their lockers.", "a fact about the school's policy."),
    ("I have seen fewer missing assignments since the policy began.", "an observation that could be checked against records.")],
   "\"Should\" signals a recommendation, which is an opinion.", 1)
mc("R.2.1-007", "RP-17", "Which statement is a fact rather than an opinion?",
   "Some vaccines, such as the flu vaccine, are updated every year.",
   [("Everyone should be grateful for the scientists who make vaccines.", "a judgment, and it isn't in the passage."),
    ("Vaccines are the most important medical discovery in history.", "a judgment, and it isn't in the passage."),
    ("Getting a sore arm is a small price to pay for being protected.", "a judgment, and it isn't in the passage.")],
   "Whether a vaccine is updated yearly can be checked. The other options are opinions that the passage doesn't state.", 1)
mc("R.2.1-008", "RP-21", "Which statement from Passage B shows the writer's awareness of the other side?",
   "I understand why teachers are frustrated, but a total ban goes too far.",
   [("Phones let families reach students during emergencies.", "supports the writer's own side."),
    ("Some students use apps to manage health conditions, such as diabetes.", "supports the writer's own side."),
    ("Phones can also be learning tools when teachers plan for them.", "supports the writer's own side.")],
   "Acknowledging teachers' frustration shows a balanced, less biased approach.", 2)
mc("R.2.1-009", "RP-23", "A cereal box's front says \"Made with whole grains, so it's healthy!\" Which misconception does this slogan encourage?",
   "That one healthy ingredient makes a food healthy overall",
   [("That whole grains contain no carbohydrates or calories at all", "the slogan doesn't say anything about carbohydrates."),
    ("That cereal should always be eaten with milk", "the slogan doesn't mention milk."),
    ("That a serving size is always the whole box of cereal", "the slogan doesn't mention serving size.")],
   "The slogan points to one ingredient, but the label shows that a serving also has 8 g of added sugars and 190 mg of sodium. One ingredient doesn't describe the whole food.", 2)
mc("R.2.1-010", "RP-24", "Which statement best describes the language in the passage?",
   "It presents mostly facts that can be checked, such as dates and names.",
   [("It presents mostly the author's personal opinions about Fleming's character.", "the passage reports events, not opinions about his character."),
    ("It uses loaded words to persuade readers to stop taking antibiotics.", "the passage warns about overuse but doesn't urge readers to stop."),
    ("It relies on one person's story with no dates or names to check.", "the passage gives many dates and names.")],
   "Dates (1928, 1929, 1945), names, and events can all be verified; the passage is informational.", 2)

# ---------- R.2.2 Words in context (5) ----------
mc("R.2.2-006", "RP-17", "In the second paragraph, the word preview in \"a safe preview of a germ\" most nearly means",
   "an early look",
   [("a full infection", "the point is that you don't get the disease."),
    ("a written report", "nothing is written."),
    ("a type of medicine", "the vaccine is the medicine; the preview is what it offers.")],
   "A vaccine lets the immune system \"see\" the germ ahead of time without the disease.", 1)
mc("R.2.2-007", "RP-20", "In the first paragraph, the word flickered in \"the emergency lights flickered on\" most nearly means",
   "came on unsteadily",
   [("broke completely", "the lights came on."),
    ("shone very brightly", "the lights were \"dim.\""),
    ("turned off again", "the lights stayed on.")],
   "\"Dim and yellow\" lights that \"flickered on\" came on in an uneven, wavering way.", 1)
mc("R.2.2-008", "RP-21", "In Passage B, the phrase \"goes too far\" most nearly means",
   "is more extreme than necessary",
   [("covers a long distance", "a literal meaning that doesn't fit."),
    ("is not nearly strict enough", "the opposite of the writer's point."),
    ("is simple and easy to enforce", "the writer doesn't discuss enforcement.")],
   "The writer thinks limits are fine but a total ban is excessive.", 1)
mc("R.2.2-009", "RP-24", "In the first paragraph, the word realized most nearly means",
   "understood",
   [("hoped", "Fleming saw evidence; he wasn't just hoping."),
    ("forgot", "the opposite of what happened."),
    ("denied", "he didn't reject the idea.")],
   "Seeing the clear ring, Fleming came to understand that the mold killed bacteria.", 1)
mc("R.2.2-010", "RP-17", "In the last paragraph, the word monitor in \"continue to monitor vaccine safety\" most nearly means",
   "keep watching and checking",
   [("approve for the first time", "the sentence says this happens after approval."),
    ("stop selling", "nothing suggests removing vaccines."),
    ("advertise to the public", "monitoring isn't advertising.")],
   "Agencies keep checking safety even after approval.", 2)

# ---------- R.2.3 Author's purpose (5) ----------
mc("R.2.3-006", "RP-17", "What is the main purpose of the passage?",
   "To explain how vaccines help the immune system",
   [("To persuade readers to oppose vaccines", "the passage is not against vaccines."),
    ("To tell a story about a patient getting sick", "there's no story."),
    ("To give directions for scheduling a vaccine", "no steps or directions are given.")],
   "The passage explains a process in a neutral, informative way.", 1)
mc("R.2.3-007", "RP-18", "Why does the author include the word PASS?",
   "To help readers remember the steps in order",
   [("To show that using an extinguisher is a test", "PASS isn't about passing a test."),
    ("To describe how fires start and spread", "it describes using the extinguisher."),
    ("To list the types of extinguishers sold", "no types are listed.")],
   "Each letter stands for a step, making the order easy to recall in an emergency.", 1)
mc("R.2.3-008", "RP-20", "Why does the author describe the rain and the crying toddler?",
   "To show why Marcus felt more stress than his class had prepared him for",
   [("To explain how the storm caused the power outage at the clinic", "the outage's cause isn't the point of these details."),
    ("To show that the toddler was the most seriously ill patient at the clinic that night", "nothing says the toddler was seriously ill."),
    ("To suggest that the clinic should close during bad weather", "the story doesn't argue this.")],
   "The story says the class \"had not included\" these sounds, which explains Marcus's pounding heart.", 2)
mc("R.2.3-009", "RP-22", "Why does the author include the last sentence of the passage?",
   "To offer a possible reason for the drop in May",
   [("To show that the challenge failed to meet its goal", "May still met the goal."),
    ("To argue that employees should not take vacations", "the note doesn't argue this."),
    ("To explain how step counters measure steps", "the note is about vacations, not how step counters work.")],
   "The note explains why steps dipped slightly in May.", 2)
mc("R.2.3-010", "RP-23", "What is the main purpose of a Nutrition Facts label like this one?",
   "To inform shoppers about what is in one serving of the food",
   [("To persuade shoppers that the cereal is the healthiest choice", "the label gives facts, not arguments."),
    ("To give a recipe that uses the cereal as an ingredient", "there is no recipe."),
    ("To tell a story about how the cereal was invented", "there is no story.")],
   "The label lists amounts of calories and nutrients per serving so shoppers can compare foods.", 1)

# ---------- R.2.4 Point of view (5) ----------
mc("R.2.4-006", "RP-21", "The author of Passage B works as an emergency medical technician. How does this most likely shape the author's view?",
   "It makes the author focus on emergencies and medical needs.",
   [("It makes the author focus on lesson plans and grading.", "those are a teacher's concerns."),
    ("It makes the author focus on the cost of new phones.", "cost isn't mentioned."),
    ("It makes the author focus on conflicts in the hallway.", "that's Passage A's concern.")],
   "The author's main reasons are reaching students in emergencies and managing health conditions.", 2)
mc("R.2.4-007", "RP-21", "The author of Passage A would most likely agree with which statement?",
   "Phones in class distract students even when they are face down.",
   [("Phones should stay in class but be silenced.", "this is closer to Passage B's proposal."),
    ("Teachers should plan lessons that require students to use their phones.", "this is Passage B's point."),
    ("Families must be able to text students during class.", "Passage B's concern.")],
   "Passage A says even a phone face down \"can pull a student's thoughts away.\"", 1)
mc("R.2.4-008", "RP-20", "From whose perspective is the story mainly told?",
   "Marcus's, through a third-person narrator",
   [("Ms. Reyes's, in the first person", "the story uses \"she,\" not \"I,\" for Ms. Reyes."),
    ("The toddler's mother's, in the first person", "she's described from the outside."),
    ("The reader's, in the second person", "the story doesn't use \"you.\"")],
   "The narrator uses \"he\" and shares Marcus's feelings (his pounding heart, his thoughts on the way home).", 2)
mc("R.2.4-009", "RP-24", "Which best describes the author's attitude toward Fleming's discovery?",
   "Respectful and informative",
   [("Mocking and dismissive", "the author never makes fun of Fleming."),
    ("Angry and critical", "the author doesn't criticize Fleming."),
    ("Uncertain and confused", "the author states events clearly.")],
   "The title calls it \"an accident that changed medicine,\" and the tone is factual and appreciative.", 1)
mc("R.2.4-010", "RP-12", "Whose interests does the DreamDeep advertisement mainly represent?",
   "The company selling the product",
   [("Doctors who treat sleep problems", "no doctor is involved."),
    ("The Food and Drug Administration", "the fine print says the FDA hasn't evaluated the claims."),
    ("Researchers who study melatonin", "no research is cited.")],
   "An advertisement is written to sell, so it reflects the seller's point of view.", 1)

# ---------- R.3.1 Evidence / predictions / conclusions (5) ----------
mc("R.3.1-006", "RP-17", "Based on the passage, what would most likely happen if a vaccinated person were later exposed to the germ the vaccine targets?",
   "The person's memory cells would recognize the germ and fight it quickly.",
   [("The person would become sick for several days, exactly as if never vaccinated.", "the vaccine's purpose is to prevent this."),
    ("The person's body would have no defense, because vaccines contain dead germs.", "the passage says vaccines lead to memory cells."),
    ("The person would need a new vaccine before the immune system could respond.", "memory cells already allow a quick response.")],
   "The passage says memory cells let the body fight the germ \"before you feel ill.\"", 2)
mc("R.3.1-007", "RP-22", "Suppose that in June employees wear their step counters as often as they did in April. Which prediction is best supported?",
   "The June average will likely be close to or above the goal.",
   [("The June average will likely fall back to February's level.", "the passage gives no reason for such a large drop."),
    ("The company will likely raise the goal to 12,000 steps.", "nothing suggests a new goal."),
    ("The challenge will likely be cancelled for poor results.", "the results met the goal.")],
   "When employees wore their counters regularly in April, the average was 7,400 steps, above the 7,000 goal.", 2)
mc("R.3.1-008", "RP-24", "Which sentence best supports the conclusion that Fleming's discovery alone was not enough to help patients?",
   "\"Fleming published his findings in 1929, but he could not produce enough pure penicillin to treat patients.\"",
   [("\"Around the mold was a clear ring where the bacteria had died.\"", "describes the discovery, not its limits."),
    ("\"In 1945, Fleming, Florey, and Chain shared the Nobel Prize in Physiology or Medicine.\"", "describes an honor, not a limitation."),
    ("\"Today, doctors warn that bacteria can become resistant to antibiotics when these drugs are overused or misused.\"", "about today's resistance, not the early limits.")],
   "This sentence directly says penicillin couldn't yet be made in usable amounts.", 2)
mc("R.3.1-009", "RP-20", "Based on the story, how will Marcus most likely act during the next emergency?",
   "He will try to stay calm and reassure patients, as he did that night.",
   [("He will refuse to work any shifts during bad weather.", "nothing suggests he wants to avoid storms."),
    ("He will leave the patients alone and wait for the manager to tell him what to do.", "he learned the value of staying with patients."),
    ("He will ignore the plan and do whatever feels right.", "Ms. Reyes says plans help.")],
   "The story ends with Marcus thinking about Ms. Reyes's lesson all the way home.", 2)
mc("R.3.1-010", "RP-18", "A worker uses an extinguisher on a small wastebasket fire, and the fire appears to be out. Based on the directions, what should the worker do next?",
   "Watch the area and report the fire to the fire department.",
   [("Return to work right away, since the fire is out.", "the directions say a fire can start again."),
    ("Put the pin back in and store the extinguisher.", "the directions don't mention this."),
    ("Open the windows and wait for the smoke to clear.", "the directions don't mention this.")],
   "The directions say to watch the area because a fire can start again, and to report the fire even if you put it out.", 2)

# ---------- R.3.2 Compare themes (5) ----------
mc("R.3.2-006", "RP-20 and RP-07", "Which theme is shared by \"The Storm Shift\" and \"First Shift\"?",
   "A new worker learns that caring attention to people matters most.",
   [("Experienced workers should never trust new employees with important tasks.", "both supervisors trust the new worker with important tasks."),
    ("Training classes are useless once someone starts a real job.", "neither story calls training useless; Marcus's class simply didn't cover everything."),
    ("Bad weather is the greatest danger in health care settings.", "only one story involves weather.")],
   "Both new workers succeed by paying close attention to the people in their care, and each supervisor's closing words stress the importance of people.", 2)
mc("R.3.2-007", "RP-21", "How do the two passages differ in their main concern?",
   "Passage A focuses on attention and learning; Passage B focuses on safety and health.",
   [("Passage A focuses on emergencies; Passage B focuses on missing assignments.", "this reverses the passages."),
    ("Both passages focus mainly on the cost of buying phones for students.", "neither discusses cost."),
    ("Passage A wants phones used in lessons; Passage B wants them banned.", "this reverses their positions.")],
   "The teacher cites distraction and classroom results; the parent cites emergencies and medical apps.", 1)
mc("R.3.2-008", "RP-21", "On which point would both authors most likely agree?",
   "Phones should not be used freely during class.",
   [("Phones should be locked away with no exceptions.", "Passage B wants medical exceptions."),
    ("Phones are never useful for learning.", "Passage B says they can be learning tools."),
    ("Students' families should not contact them at school.", "Passage B says families need to reach them.")],
   "Passage A wants them in lockers; Passage B wants them silent and out of sight unless a teacher allows them. Both limit free use.", 3)
mc("R.3.2-009", "RP-14 and RP-24", "How is Fleming's discovery in \"An Accident That Changed Medicine\" similar to Marisol's success in Story A?",
   "Both came from closely examining something that had gone wrong.",
   [("Both happened on the very first try without any setbacks.", "Marisol failed first, and penicillin took years to develop."),
    ("Both depended on helpful advice that came from a neighbor.", "only Mr. Lyle in Story B got advice."),
    ("Both ended with a large cash prize for the person who succeeded.", "neither text mentions money.")],
   "Fleming studied a contaminated dish; Marisol studied her broken bridge.", 3)
mc("R.3.2-010", "RP-14 and RP-20", "How is Marcus's situation in \"The Storm Shift\" different from Marisol's in Story A?",
   "Marcus must act fast with a supervisor's help; Marisol studies her problem alone over time.",
   [("Marcus fails and never recovers, while Marisol succeeds easily on her very first try.", "Marcus handles the night well, and Marisol fails first."),
    ("Marisol works under a supervisor, while Marcus works completely alone during the storm.", "this reverses the characters."),
    ("Both characters ignore the advice they are given and succeed mostly because of luck.", "neither succeeds by luck, and Marcus follows Ms. Reyes's directions.")],
   "Marcus has to respond in the moment with Ms. Reyes directing him; Marisol studies her broken bridge for a week and redesigns it the next year.", 3)

# ---------- R.3.3 Evaluate an argument (5) ----------
mc("R.3.3-006", "RP-21", "What evidence does the author of Passage A use to support banning phones in class?",
   "The teacher's own observations after the school's policy began",
   [("Results from a national survey of thousands of teachers in many states", "the passage cites no survey."),
    ("Statements from students who say they prefer phone-free classrooms", "no students are quoted."),
    ("Data showing that phone apps help students manage diabetes in class", "that's Passage B's point.")],
   "The teacher relies on personal observation of one school's results.", 2)
mc("R.3.3-007", "RP-21", "What is the main weakness of the evidence in Passage A?",
   "It comes from one teacher's observations at one school.",
   [("It includes too many statistics from scientific studies.", "the passage includes no studies."),
    ("It focuses only on the cost of the policy.", "cost isn't discussed."),
    ("It relies only on statistics from other schools.", "the teacher describes only the teacher's own school.")],
   "Personal observation is useful but limited; it may not apply to other schools.", 2)
mc("R.3.3-008", "RP-21", "Which additional evidence would most strengthen Passage B's argument?",
   "Data showing how often students used phones to reach help during school emergencies",
   [("A study showing that phones distract students even when they are face down", "this supports Passage A."),
    ("A list of schools that require all students to keep their phones in lockers during class", "doesn't show the value of phones."),
    ("A report showing that most students check social media during class", "this supports Passage A.")],
   "Passage B's main reason is emergencies, so data on emergency use supports it most directly.", 2)
mc("R.3.3-009", "RP-22", "Suppose the company announces that the walking challenge made its employees healthier. What is the main weakness of this conclusion, based on the passage?",
   "The passage reports step counts, not any measure of health.",
   [("The average never reached the company's step goal.", "April and May both met the 7,000-step goal."),
    ("The challenge lasted only one week in February.", "the challenge lasted four months."),
    ("The wellness coordinator counted every step by hand.", "employees wore step counters.")],
   "Walking more may help health, but the passage measured only steps, so it can't show that health improved.", 2)
mc("R.3.3-010", "RP-16", "Which statement would a critic most likely use to weaken the essay's argument?",
   "The essay's pass-rate data come from only one college.",
   [("The essay says students study late at night.", "this supports the essay."),
    ("The essay says good tutors ask guiding questions.", "this answers a criticism."),
    ("The essay says failing a course costs money.", "this supports the essay.")],
   "Evidence from a single college may not apply everywhere, which is a fair weakness to point out.", 3)

# ---------- R.3.4 Integrate sources (5) ----------
mc("R.3.4-006", "RP-19 and RP-11", "A student submitted the online permit form on January 8 and wants to pick up the permit as early as possible. The Workforce Building is a short walk from the Student Center stop. Assume January 8 through January 12 are all weekdays and none is a college holiday. Which date and shuttle run from the Main Street Park-and-Ride should the student choose?",
   "January 10, Run 1 (arrives at the Student Center at 7:35 a.m.)",
   [("January 9, Run 1 (arrives at the Student Center at 7:35 a.m.)", "January 9 is the form deadline; permits aren't ready until January 10."),
    ("January 10, Run 2 (arrives at the Student Center at 10:05 a.m.)", "Run 2 is later than Run 1 on the same day."),
    ("January 12, Run 1 (arrives at the Student Center at 7:35 a.m.)", "January 12 is when permits become required, not the first pickup day.")],
   "The memo says permits are ready starting January 10, and Run 1 is the earliest shuttle to reach the Student Center that day.", 3)
fixed("R.3.4-007", "RP-23 and RP-06", MC, "The letter in \"Get Sugary Drinks Out of Our Hospital\" gives the American Heart Association's daily limit on added sugar for most women. Using the cereal label and that limit, how many servings of the cereal would reach the limit? (1 teaspoon of sugar ≈ 4 grams)",
      ["Less than 1 serving", "2 servings", "3 servings", "About 4½ servings"], "C",
      "One serving has 8 g of added sugars, which is about 2 teaspoons (8 ÷ 4). The letter gives a limit of about 6 teaspoons for most women, and 6 ÷ 2 = 3 servings.",
      "A: compares 8 grams directly with 6 teaspoons without converting units. B: 8 ÷ 4 = 2 is the number of teaspoons in one serving, not the number of servings. D: uses the limit for most men (9 ÷ 2), not for women.", 3)
mc("R.3.4-008", "RP-22 and RP-17", "Using both passages, which statement is supported?",
   "Both describe ways people can protect or improve their health.",
   [("Both use data tables to show results over several months.", "only the walking passage has a table."),
    ("Both argue against the advice given by health agencies.", "neither argues against health agencies."),
    ("Both report that their efforts failed to reach their goals in the end.", "the challenge met its goal, and the vaccine passage sets no goal.")],
   "The vaccine passage explains how vaccines prevent disease, and the walking passage shows average steps rising to meet a goal.", 2)
mc("R.3.4-009", "RP-24 and RP-02", "The penicillin passage warns about overusing antibiotics. The fasting-test directions say to take usual medicines unless told to stop. What do both texts suggest about medicines?",
   "They should be used as directed by a health care provider.",
   [("They should be stopped whenever a person feels better.", "neither text says this."),
    ("They are always safe in any amount.", "the penicillin passage warns about overuse."),
    ("They should be avoided before any medical test.", "the directions say to keep taking usual medicines.")],
   "One warns against overuse; the other says to follow the provider's instructions. Both point to using medicines as directed.", 3)
mc("R.3.4-010", "RP-21 and RP-13", "How could the survey in \"Screens and Sleep\" be used in the debate about phones in the classroom?",
   "Neither side could use it directly; it measures bedtime screen use, not class use.",
   [("It proves that phones in class cause students to fail their courses.", "the survey doesn't study class time or grades."),
    ("It shows that students who keep their phones in lockers during class sleep better.", "lockers aren't part of the survey."),
    ("It shows that phones are needed so that students can manage medical conditions.", "the survey says nothing about medical apps.")],
   "A source is only useful evidence when it measures what the argument is about.", 3)
