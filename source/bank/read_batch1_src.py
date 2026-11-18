MC = "Multiple choice"
items = []
def mc(id, psg, stem, correct, wrongs, expl, diff):
    items.append(dict(id=id, passage=psg, format=MC, stem=stem, correct=correct, wrongs=wrongs, explanation=expl, difficulty=diff))
def fixed(id, psg, fmt, stem, options, answer, expl, distr, diff):
    items.append(dict(id=id, passage=psg, format=fmt, stem=stem, options=options, answer=answer, explanation=expl, distractors=distr, difficulty=diff))

# ---------- R.1.1 Summarize ----------
mc("R.1.1-001", "RP-01", "Which statement best summarizes the passage?",
   "Scientists have proposed several explanations for yawning, but none has been proven.",
   [("Yawning brings extra oxygen to a tired brain, which is why people yawn when they are sleepy.", "the passage says this idea \"did not hold up.\""),
    ("Contagious yawning proves that people feel more empathy for strangers than for family members.", "reverses the detail (people catch yawns more from family) and overstates it as proof."),
    ("Dogs, cats, and fish yawn just as often as humans do, which shows that yawning is very old.", "the passage says animals yawn but never compares how often or discusses age.")],
   "A summary covers the main idea of the whole passage: several theories, none proven.", 2)
mc("R.1.1-002", "RP-09", "Which statement best summarizes the passage?",
   "Oysters help clean the bay's water, and people are working to restore them.",
   [("A single adult oyster can filter as much as 50 gallons of water in just one day.", "a single detail, not the main idea."),
    ("Overharvesting was the only reason the bay's oyster population fell sharply.", "the passage also names disease and pollution."),
    ("Underwater grasses in the bay give shelter to young crabs and many kinds of fish.", "a supporting detail, not the main idea.")],
   "The best summary covers the oysters' main role (filtering water) and the effort to restore them; the other options are single details or misstatements.", 2)
mc("R.1.1-003", "RP-08", "Which statement best summarizes the passage?",
   "Nightingale's statistics showed most deaths were preventable and helped bring about reforms.",
   [("Nightingale helped establish a nursing school at St Thomas' Hospital in London in 1860.", "a single detail from the last paragraph."),
    ("Most soldiers who died in the Crimean War were killed by their wounds from battle.", "contradicts the passage: most died of disease."),
    ("Nightingale's book Notes on Nursing taught nurses how to draw statistical charts.", "the passage says the book stressed fresh air, clean water, and cleanliness.")],
   "The passage's main point is that Nightingale used careful records and statistics to show that most deaths came from preventable disease, which helped change policy.", 2)
mc("R.1.1-004", "RP-07", "Which sentence best summarizes the story?",
   "On her first day, Dana asks why a resident won't eat, gets his problem fixed, and earns praise.",
   [("A charge nurse hands Dana a clipboard and a list of eight residents to care for.", "a detail from the opening, not the whole story."),
    ("A resident refuses his lunch because he dislikes the food that the kitchen serves him every day.", "gives the wrong reason; his dentures hurt."),
    ("Dana arrives early but decides by the end of the day that the job is too hard.", "contradicts the ending: she looks forward to tomorrow.")],
   "A summary of a story covers its beginning, key event, and outcome.", 1)

# ---------- R.1.2 Inferences ----------
mc("R.1.2-001", "RP-07", "What can the reader infer from Ms. Okafor's comment at the end of the story?",
   "She values staff who pay close attention to residents' needs.",
   [("She is upset that Dana spent so long talking with Mr. Bell.", "her words are praise, not criticism."),
    ("She plans to promote Dana to charge nurse right away.", "nothing in the story suggests a promotion."),
    ("She thinks Dana should have called the kitchen herself.", "Ms. Okafor called the kitchen and doesn't criticize Dana for reporting it.")],
   "She praises Dana for noticing something others missed and calls that what the job is \"really about.\"", 1)
mc("R.1.2-002", "RP-01", "According to the brain-cooling explanation, in which situation would a person be LEAST likely to yawn?",
   "Standing outside on a very hot day",
   [("Watching a family member yawn", "contagious yawning would make a yawn more likely."),
    ("Reading an article about yawning", "the passage says reading about yawns can trigger one."),
    ("Sitting in a cool room after a long day", "cool air would make a cooling yawn useful.")],
   "The passage says people yawn less when the outside air is very hot, because a deep breath wouldn't cool anything.", 2)
mc("R.1.2-003", "RP-11", "A student parks on campus on January 20 without a spring permit. What will most likely happen?",
   "The student will receive a warning notice.",
   [("The student will receive a $25 ticket.", "tickets start after January 26."),
    ("The student's car will be towed away.", "the memo never mentions towing."),
    ("Nothing will happen, because permits are free.", "permits being free doesn't mean they're optional.")],
   "From January 12 to January 26, vehicles without a permit get a warning; tickets start after January 26.", 2)
mc("R.1.2-004", "RP-14", "In Story B, why does Mr. Lyle most likely keep planting tomatoes along the fence?",
   "He is attached to the way things were done when his wife was alive.",
   [("He does not know where the sunny corner of the yard is.", "he moves the plants there easily once he decides to."),
    ("His neighbor told him that the fence was the best place in the yard to plant tomatoes.", "the neighbor suggested the fence was the problem."),
    ("He believes tomatoes grow best in the shade.", "the story never says this; he says tomatoes \"had always grown there.\"")],
   "His grumbling that tomatoes grew there \"when his wife was alive\" suggests habit and memory, not reasons about sunlight.", 3)

# ---------- R.1.3 Written directions ----------
mc("R.1.3-001", "RP-02", "A patient with an 8:00 a.m. fasting test eats a granola bar at 9:30 p.m. the night before. According to the directions, what should the patient do?",
   "Call the lab, because the test may need to be rescheduled.",
   [("Go to the test as planned without mentioning the snack.", "the directions say to call the lab if you eat by mistake."),
    ("Arrive two hours late so that the fast lasts longer.", "the directions don't offer this option."),
    ("Drink extra water to wash out the food before the test.", "water is allowed, but it doesn't undo eating.")],
   "The last line says: \"If you eat by mistake during the fasting period, call the lab. You may need to reschedule.\"", 1)
mc("R.1.3-002", "RP-04", "According to the label, what should a parent do before giving these tablets to an 8-year-old with hay fever?",
   "Ask a doctor.",
   [("Give 1 tablet every 24 hours.", "that dose is for ages 12 and over."),
    ("Give half a tablet every 24 hours.", "the label gives no half-tablet dose."),
    ("Never use the product for this child.", "\"Do not use\" applies to children under 6.")],
   "For children 6 to under 12 years, the label says \"ask a doctor.\"", 2)
mc("R.1.3-003", "RP-15", "A person follows the saline-rinse directions but swallows the water after gargling. Which instruction did the person fail to follow?",
   "Spit the water into the sink.",
   [("Stir until the salt dissolves.", "has nothing to do with swallowing."),
    ("Make a fresh mixture each time.", "has nothing to do with swallowing."),
    ("Wash your hands first.", "has nothing to do with swallowing.")],
   "The directions say: \"Spit the water into the sink; do not swallow it.\"", 1)

# ---------- R.1.4 Locate information ----------
mc("R.1.4-001", "RP-11", "According to the memo, where can students pick up their parking permits?",
   "Room 104 in the Workforce Building",
   [("At the visitor spaces near the main entrance", "that's where visitors park."),
    ("On the student portal", "the portal is where you fill out the form, not where you pick up the permit."),
    ("At the campus bookstore", "the memo doesn't mention a bookstore.")],
   "Permits are picked up at the Campus Safety office, Room 104, Workforce Building.", 1)
fixed("R.1.4-002", "RP-08", MC, "According to the passage, in what year did Nightingale publish Notes on Nursing?",
      ["1854", "1858", "1859", "1860"], "C", "The passage says, \"In 1859 she published Notes on Nursing.\"",
      "A: the year she arrived at Scutari. B: a year the passage doesn't mention. D: the year the nursing school was established.", 1)
fixed("R.1.4-003", "RP-04", MC, "According to the label, at what temperature should the tablets be stored?",
      ["32–50 °F", "60–68 °F", "68–77 °F", "77–86 °F"], "C", "The label says to store the tablets at 68–77 °F.",
      "A: much colder than the label's range. B: cooler than the label's range. D: warmer than the label's range.", 1)

# ---------- R.1.5 Charts and graphs ----------
mc("R.1.5-001", "RP-03", "A patient wants a blood draw and a dental cleaning on the same day. On which days is that possible?",
   "Tuesday or Thursday",
   [("Monday or Wednesday", "dental is closed on both days, and the lab is closed on Wednesday."),
    ("Wednesday or Friday", "the lab is closed on Wednesday, and dental is closed on both days."),
    ("Monday or Friday", "dental cleanings are closed on Monday and Friday.")],
   "Dental cleanings run only on Tuesday and Thursday, and the lab is open both of those mornings.", 2)
mc("R.1.5-002", "RP-10", "Which age groups met the health department's goal?",
   "Only adults 65 and older",
   [("Adults 50–64 and adults 65 and older", "50–64 reached only 52%."),
    ("None of the age groups", "the 65+ group reached 71%, which meets the 70% goal."),
    ("All groups over age 30", "30–49 reached only 35%.")],
   "Only the 65+ group (71%) reached at least 70%.", 2)
fixed("R.1.5-003", "RP-13", MC, "According to the survey, how many more minutes did students who used screens for more than 60 minutes before bed take to fall asleep than students who used no screens?",
      ["11 minutes", "15 minutes", "26 minutes", "41 minutes"], "C", "41 minutes − 15 minutes = 26 minutes.",
      "A: 41 − 30 = 11; this subtracts a screen-time category boundary (30 minutes) instead of the no-screen group's 15 minutes. B: this is the time for the no-screens group. D: this is the total time for the more-than-60-minutes group, not the difference.", 2)

# ---------- R.1.6 Sequence ----------
mc("R.1.6-001", "RP-08", "Which of these events happened first?",
   "Nightingale arrived at the army hospital in Scutari.",
   [("Nightingale published Notes on Nursing.", "1859, after the war."),
    ("Nightingale helped establish a nursing school in London.", "1860, the last event in the passage."),
    ("Nightingale worked with statisticians on death rates.", "this happened after the war.")],
   "She arrived in 1854, during the war; the analysis, book, and school all came later.", 1)
mc("R.1.6-002", "RP-07", "What happened immediately after Mr. Bell explained that his dentures hurt?",
   "Dana reported the problem to Ms. Okafor.",
   [("Ms. Okafor called the kitchen.", "this happened after Dana reported the problem."),
    ("Mr. Bell ate every bite of his meal.", "this happened later, after the soup arrived."),
    ("Dana recorded every meal in the chart.", "this happened earlier in the morning.")],
   "The order is: Mr. Bell explains → Dana reports → Ms. Okafor calls the kitchen → the soup arrives → he eats.", 2)
fixed("R.1.6-003", "RP-15", "Ordered response", "Put these steps for making the saline rinse in the correct order.",
      ["Stir in one-half teaspoon of salt.", "Wash your hands.", "Gargle for about 30 seconds.", "Pour warm water into a clean glass."],
      "B, D, A, C",
      "The directions say first wash your hands, next pour warm water, then add salt and stir, and then gargle.",
      "Common error: adding salt before the water is in the glass. Another: gargling before the salt dissolves.", 2)

# ---------- R.2.1 Fact and opinion ----------
mc("R.2.1-001", "RP-06", "Which sentence from the letter states an opinion?",
   "Nothing could be more ridiculous.",
   [("A 20-ounce bottle of regular soda contains about 16 teaspoons of sugar.", "a measurable fact."),
    ("Several hospitals across the country have already stopped selling sugary drinks.", "a fact that could be checked."),
    ("Last week I visited my father at Bayside General Hospital.", "a fact about the writer's experience.")],
   "\"Ridiculous\" expresses a judgment that can't be proven true or false.", 1)
mc("R.2.1-002", "RP-12", "Which statement in the advertisement is a fact that could be checked?",
   "Each gummy contains 3 mg of melatonin.",
   [("DreamDeep is the most amazing sleep aid ever made.", "opinion and exaggeration."),
    ("Ordinary sleeping pills are harsh.", "\"harsh\" is a judgment word, not a measurable fact."),
    ("\"I haven't slept this well in years!\"", "one customer's personal opinion, which can't be checked.")],
   "The amount of an ingredient can be measured and verified.", 1)
mc("R.2.1-003", "RP-12", "Which misconception does the advertisement encourage?",
   "That a product labeled natural must be safe for everyone",
   [("That melatonin is a hormone that plays a role in sleep cycles", "this is true, not a misconception, and the ad never mentions it."),
    ("That sleeping pills require a prescription", "the ad never says this."),
    ("That berry flavors make gummies taste better", "the ad doesn't argue this.")],
   "The ad says the product is \"100% natural, so it is completely safe for everyone.\" Natural substances can still have side effects and interactions.", 2)
mc("R.2.1-004", "RP-06", "Which statement from the letter best shows the writer's bias?",
   "Every hospital administrator who keeps these machines stocked is simply putting profit ahead of patients.",
   [("A 20-ounce bottle of regular soda contains about 16 teaspoons of sugar.", "a factual statement."),
    ("The American Heart Association recommends that most women limit added sugar to about 6 teaspoons a day and most men to about 9.", "a factual statement attributed to a named health organization."),
    ("Several hospitals across the country have already stopped selling sugary drinks.", "a factual statement.")],
   "Saying that \"every\" administrator acts only for profit is an overgeneralization that assumes motives without evidence.", 2)
mc("R.2.1-005", "RP-05", "Which statement from the passages is a fact rather than an opinion?",
   "During puberty, the brain begins releasing the sleep hormone melatonin later at night.",
   [("Starting high school at 8:30 a.m. or later is a simple change that protects students' health.", "\"simple\" and the recommendation are judgments."),
    ("Later start times sound good, but the details matter.", "a judgment."),
    ("Before changing the schedule, our district should study what the change would cost.", "\"should\" signals a recommendation, not a fact.")],
   "The timing of melatonin release is a scientific finding that can be checked.", 2)

# ---------- R.2.2 Words in context ----------
mc("R.2.2-001", "RP-01", "In the last paragraph, the word humble in \"the humble yawn\" most nearly means",
   "ordinary",
   [("proud", "the opposite meaning."),
    ("dangerous", "nothing in the passage suggests danger."),
    ("mysterious", "the sentence calls the yawn a mystery, but \"humble\" describes how ordinary it is.")],
   "The author contrasts an everyday, ordinary act with the fact that it is still a mystery.", 2)
mc("R.2.2-002", "RP-09", "In the last sentence, the word promising most nearly means",
   "likely to succeed",
   [("guaranteed to work", "too strong; the passage says restoration takes time."),
    ("very expensive", "the passage doesn't discuss cost."),
    ("recently discovered", "the passage says restoration takes time and has gone on for years; \"promising\" isn't about newness.")],
   "Scientists see restoration as a way that will likely improve the bay's health.", 1)
mc("R.2.2-003", "RP-08", "In the first sentence, the word pioneer most nearly means",
   "one of the first people to do something",
   [("a soldier who fought in a war", "she was a nurse, not a soldier."),
    ("a person who criticizes the government", "the passage describes her persuading officials, not criticizing them."),
    ("a teacher at a nursing school", "she helped establish a school, but \"pioneer\" refers to being first.")],
   "Nightingale was among the first to use statistics to change policy.", 1)
mc("R.2.2-004", "RP-16", "In the first paragraph, the word luxury most nearly means",
   "something nice to have but not necessary",
   [("a requirement that every student must meet before graduating", "the opposite: the author contrasts luxury with necessity."),
    ("a costly mistake that a college later regrets making", "the sentence isn't about mistakes."),
    ("a special reward given to students for high grades", "the sentence isn't about rewards.")],
   "The author says online tutoring is \"not a luxury\" but a necessity, so luxury means something extra.", 2)
mc("R.2.2-005", "RP-04", "On the label, the word temporarily in \"temporarily relieves sneezing\" most nearly means",
   "for a limited time",
   [("for all time", "the opposite meaning."),
    ("in every way", "describes how much, not how long."),
    ("at a slow pace", "describes speed, not how long.")],
   "The tablets relieve symptoms for a while, which is why a dose is taken every 24 hours.", 1)

# ---------- R.2.3 Author's purpose ----------
mc("R.2.3-001", "RP-01", "Why does the author most likely end the passage with the question in parentheses?",
   "To playfully show that reading about yawns can cause one",
   [("To prove that the brain-cooling explanation is correct", "the passage says none of the explanations is proven."),
    ("To warn readers that frequent yawning is a sign of illness", "the passage never discusses illness."),
    ("To introduce a new theory that will be explained next", "it's the last sentence; nothing follows."),],
   "The question connects to the earlier point that reading about yawns can trigger one, in a light, friendly way.", 2)
mc("R.2.3-002", "RP-12", "What is the main purpose of the advertisement?",
   "To persuade readers to buy the product",
   [("To explain the science of how melatonin works", "the ad gives almost no science."),
    ("To entertain readers with a story about sleep", "there's no story."),
    ("To compare several sleep aids fairly", "it compares only to \"harsh sleeping pills,\" and not fairly.")],
   "Superlatives, testimonials, and \"Order today\" show that the goal is to sell.", 1)
mc("R.2.3-003", "RP-02", "What is the main purpose of the passage?",
   "To tell patients how to prepare for a fasting blood test",
   [("To persuade patients that they should get blood tests more often", "it doesn't argue for more tests."),
    ("To explain how labs analyze blood samples", "it doesn't describe lab work."),
    ("To describe the history of fasting", "it includes no history.")],
   "Numbered steps and commands such as \"Stop eating\" show that the purpose is to instruct.", 1)
mc("R.2.3-004", "RP-09", "Why does the author mention underwater grasses in the second paragraph?",
   "To show how oysters help other living things",
   [("To explain why oysters became less common", "the decline is discussed in the third paragraph."),
    ("To argue that grasses filter more water than oysters do", "the passage never compares the two."),
    ("To describe what oysters eat as they filter the water", "the passage says oysters trap algae and sediment; the grasses are mentioned as shelter, not food.")],
   "Clearer water lets light reach the grasses, which shelter crabs and fish: a chain of benefits.", 2)
mc("R.2.3-005", "RP-06", "Why does the writer include the amount of sugar in a bottle of soda?",
   "To support the claim that sugary drinks are unhealthy",
   [("To show that the writer's father drinks too much soda", "the letter doesn't say what the father drinks."),
    ("To compare the prices of drinks in the hospital store", "no prices are given."),
    ("To explain how the vending machine works", "the letter never describes how the machine works.")],
   "Comparing 16 teaspoons with the recommended daily limits backs up the argument with evidence.", 2)

# ---------- R.2.4 Point of view ----------
mc("R.2.4-001", "RP-05", "The author of Passage B is a parent and bus company owner. How does this background most likely shape the author's view?",
   "The author focuses on buses, costs, and family schedules.",
   [("The author focuses on how teenagers' bodies respond to sleep loss.", "this is Passage A's focus."),
    ("The author focuses on how later start times affect lesson plans.", "Passage B never mentions lessons or teaching."),
    ("The author focuses on students' wish to sleep later in the morning.", "Passage B doesn't discuss what students want.")],
   "The author's concerns (buses in shifts, the cost of drivers, and after-school schedules) match a parent's and bus owner's experience.", 2)
mc("R.2.4-002", "RP-05", "The author of Passage A would most likely agree with which statement?",
   "School schedules should be adjusted to fit teenagers' biology.",
   [("Teenagers who sleep late are simply lazy.", "Passage A says \"Teenagers are not lazy.\""),
    ("The cost of extra buses matters more than students' health and safety.", "Passage A puts students' health and safety first; neither passage says bus costs matter more than safety."),
    ("Start times have no effect on attendance.", "Passage A cites better attendance after later starts.")],
   "Passage A argues that teen body clocks shift later, so schools should start later.", 1)
mc("R.2.4-003", "RP-16", "Which best describes the author's point of view toward around-the-clock online tutoring?",
   "Strongly in favor",
   [("Neutral", "the author takes a clear side."),
    ("Strongly opposed", "the author argues for it."),
    ("Unsure", "the author states the position firmly.")],
   "The author calls it \"the difference between getting help and getting none\" and answers critics.", 1)
mc("R.2.4-004", "RP-07", "From which point of view is the story told?",
   "Third person, by a narrator who follows Dana",
   [("First person, by Dana", "the story says \"Dana,\" \"she,\" and \"her,\" not \"I.\""),
    ("First person, by Mr. Bell", "Mr. Bell is described from the outside."),
    ("Second person, addressing the reader as \"you\"", "the story doesn't address the reader.")],
   "The narrator uses \"Dana\" and \"she\" and stays close to Dana's experience.", 2)
mc("R.2.4-005", "RP-06", "Which word best describes the writer's attitude toward the vending machines in the hospital lobby?",
   "disapproving",
   [("amused", "the writer is critical, not entertained."),
    ("indifferent", "the writer clearly cares."),
    ("admiring", "the opposite attitude.")],
   "The writer calls the setup \"ridiculous\" and demands that the drinks be removed.", 1)

# ---------- R.3.1 Evidence: predictions, inferences, conclusions ----------
mc("R.3.1-001", "RP-09", "If restoration adds many oysters to a river, what would most likely happen over time?",
   "The water would become clearer, and underwater grasses would increase.",
   [("The water would become cloudier as the growing oysters stirred up mud from the bottom.", "the passage says fewer oysters led to cloudier water."),
    ("Crabs and fish would leave because the reef took their space.", "the passage says reefs shelter small animals."),
    ("The oysters would reach market size within a few months.", "the passage says it takes about two to three years.")],
   "More oysters filter more water; clearer water lets sunlight reach the grasses.", 2)
mc("R.3.1-002", "RP-13", "Based on both sources, what should a student who wants to fall asleep faster most likely do?",
   "Stop using screens an hour before bed and read a paper book instead.",
   [("Use a phone in bed but turn the screen brightness all the way up.", "brighter light would make the problem worse."),
    ("Watch videos until feeling sleepy and then put the phone away.", "the survey links more screen time with taking longer to fall asleep."),
    ("Exercise hard right before bed to get tired.", "neither source discusses exercise.")],
   "The article recommends no screens for an hour before bed, and the survey shows the no-screen group fell asleep fastest.", 1)
mc("R.3.1-003", "RP-14", "Based on Story A, what would Marisol most likely do if one of her later designs failed?",
   "Study why it failed and change the design.",
   [("Give up on building contests altogether.", "she kept trying after her first failure."),
    ("Blame the judges for setting the weights unfairly.", "she looked for the cause in her own design."),
    ("Build the same design again and hope for better luck.", "she changed the design after studying the breaks.")],
   "After her first failure, she studied the broken pieces and improved the joints, a pattern she would likely repeat.", 2)
mc("R.3.1-004", "RP-02", "Which lines from the directions best support the conclusion that a patient's activities before the test can affect its accuracy?",
   "Do not chew gum, smoke, or exercise hard during the fasting period. These can change your results.",
   [("Schedule your blood draw for the morning if you can. Most of your fasting time will then happen while you sleep.", "about convenience, not accuracy."),
    ("Take your usual medicines with water unless your provider told you to stop them.", "about medicines, not about what can change results."),
    ("Keep drinking plain water. Water makes your veins easier to find.", "about finding a vein, not about results.")],
   "These lines say directly that these activities can change the results.", 2)
mc("R.3.1-005", "RP-10", "Suppose next season the vaccination rate for adults 30–49 rises by 20 percentage points. Based on the survey, would that group then meet the health department's goal?",
   "No, because the rate would reach only 55%.",
   [("Yes, because the rate would reach 70% or more.", "35% + 20 = 55%, which is below 70%."),
    ("Yes, because the rate would then be higher than every other group's.", "55% would be higher than the 50–64 group's 52% but still below the 65+ group's 71%; in any case, the goal is 70%, not beating other groups."),
    ("No, because the rate would fall below the 18–29 group's rate.", "55% would be above 28%; the reason is wrong.")],
   "35% + 20 percentage points = 55%, still short of the 70% goal.", 2)

# ---------- R.3.2 Compare themes ----------
mc("R.3.2-001", "RP-14", "Which theme do both stories share?",
   "Learning from failure and changing your approach can lead to success.",
   [("Winning a contest matters more than enjoying the work you do.", "only Story A has a contest, and it isn't the message."),
    ("Advice from neighbors and friends usually turns out to be wrong in the end.", "the neighbor's advice in Story B turns out to be right."),
    ("Some problems can never be solved, no matter how hard you try.", "both characters solve their problems.")],
   "Both characters fail, change their approach, and then succeed.", 1)
mc("R.3.2-002", "RP-14", "How does Mr. Lyle's response to failure differ from Marisol's?",
   "Marisol finds the problem on her own, while Mr. Lyle at first resists advice.",
   [("Marisol gives up on contests, while Mr. Lyle keeps planting in the same spot.", "Marisol doesn't give up."),
    ("Mr. Lyle studies the problem on his own, while Marisol waits for advice.", "this reverses the characters."),
    ("Both characters succeed on the first try without changing anything.", "both fail first.")],
   "Marisol studies the breaks right away; Mr. Lyle ignores his neighbor for a season before he changes.", 2)
mc("R.3.2-003", "RP-05", "How do the two passages differ in focus?",
   "Passage A focuses on student health; Passage B focuses on costs and logistics.",
   [("Passage A focuses on bus schedules, while Passage B focuses on sleep hormones.", "this reverses the passages."),
    ("Both passages focus mainly on how later start times affect after-school sports.", "only Passage B mentions sports, briefly."),
    ("Passage A opposes later start times, while Passage B strongly supports them.", "Passage A supports them; B urges caution.")],
   "A discusses body clocks, sleep, and safety; B discusses buses, costs, and schedules.", 1)
mc("R.3.2-004", "RP-05", "On which point would both authors most likely agree?",
   "Students' well-being matters when schools set their schedules.",
   [("Later start times should begin immediately in every district.", "Passage B wants the change studied first."),
    ("The cost of more buses is not worth considering.", "Passage B says cost is a major concern."),
    ("Teenagers need less sleep than younger children.", "neither passage compares how much sleep teens and younger children need.")],
   "A argues for teen health; B worries about young children at bus stops in the dark and about students' jobs. Both care about students.", 3)
mc("R.3.2-005", "RP-07 and RP-14", "Which theme is shared by \"First Shift\" and Story A (\"The Bridge\")?",
   "Paying close attention to details helps solve problems.",
   [("Hard work always leads to a promotion.", "neither story involves a promotion."),
    ("It is best to follow the same routine every day, even when it isn't working.", "both characters succeed by noticing something new."),
    ("Winning is the most important goal.", "\"First Shift\" has no competition.")],
   "Dana notices why Mr. Bell won't eat; Marisol notices where her bridge broke. Careful observation solves each problem.", 2)

# ---------- R.3.3 Evaluate an argument ----------
mc("R.3.3-001", "RP-16", "Which evidence does the author use to support the claim that online tutoring helps students succeed?",
   "Students who used online tutoring at least three times were more likely to pass their math course.",
   [("Community college students juggle classes with jobs, families, and long commutes.", "describes students' lives, not the results of tutoring."),
    ("The campus tutoring center closes long before many working students are able to study.", "explains the need, not the effect."),
    ("Good tutoring services train their tutors to ask guiding questions instead of giving answers.", "answers a critic; it isn't evidence of results.")],
   "The pass-rate finding directly links using tutoring to better outcomes.", 2)
mc("R.3.3-002", "RP-16", "How does the author respond to critics who say online tutoring is too expensive?",
   "By arguing that failing and retaking courses costs students and colleges more",
   [("By admitting that the cost is too high and suggesting a cheaper option instead of tutoring", "the author doesn't concede the point."),
    ("By saying that money doesn't matter in education", "the author compares costs rather than dismissing them."),
    ("By ignoring the concern entirely", "the author addresses it directly.")],
   "The author answers the counterargument with a cost comparison: \"the cost of a student failing … is far higher.\"", 2)
mc("R.3.3-003", "RP-06", "Which is the weakest part of the writer's argument?",
   "The claim that every administrator who keeps the machines stocked puts profit ahead of patients",
   [("The fact that a 20-ounce bottle of regular soda contains about 16 teaspoons of sugar", "a specific fact that supports the argument."),
    ("The example of hospitals across the country whose stores still make money after dropping sugary drinks", "evidence that the change can work."),
    ("The point that hospitals are supposed to protect the health of their patients", "a reasonable premise.")],
   "The writer assumes the motives of every administrator without evidence. It's an overgeneralization.", 3)
mc("R.3.3-004", "RP-12", "What is the advertisement's main evidence that DreamDeep works?",
   "Statements from satisfied customers",
   [("Results from a clinical trial", "the ad cites no study."),
    ("Approval by the Food and Drug Administration", "the fine print says the FDA has not evaluated these statements."),
    ("A recommendation from a doctor", "no doctor is quoted.")],
   "The ad relies on testimonials such as Jamie's, which are weak evidence.", 2)
mc("R.3.3-005", "RP-05", "Which additional evidence would most strengthen Passage B's argument?",
   "A cost estimate showing how many extra buses and drivers the change would require",
   [("A study showing that teenagers' bodies release melatonin later at night than adults' do", "supports Passage A, not B."),
    ("A survey showing that most high school students would prefer to sleep later", "supports later start times."),
    ("A list of the school districts that have already moved to later start times", "doesn't address cost.")],
   "Passage B's main concern is cost, so specific cost figures would support it best.", 2)

# ---------- R.3.4 Integrate multiple sources ----------
mc("R.3.4-001", "RP-13", "How does the survey in Source 2 relate to the article in Source 1?",
   "Its results fit the article's advice: more screen time before bed goes with less sleep.",
   [("It shows that screen time before bed has no effect on how long students take to fall asleep.", "times rise from 15 to 41 minutes as screen use increases."),
    ("It proves that blue light causes sleep problems.", "the survey doesn't measure blue light, and it can't prove a cause."),
    ("It contradicts the article by showing that screens help students sleep.", "the data show the opposite.")],
   "Students with more screen time before bed fell asleep more slowly and slept less, which fits the article's advice.", 2)
mc("R.3.4-002", "RP-13", "Source 1 says screens delay the release of melatonin. Why can't the survey in Source 2, by itself, show that screen use causes students to sleep less?",
   "It shows a pattern, but other factors could affect both screen use and sleep.",
   [("It shows that students who used no screens slept the least of any group.", "the no-screen group slept the most (7.4 hours)."),
    ("It found no clear pattern between screen use and average hours of sleep.", "sleep falls steadily from 7.4 to 6.2 hours as screen use rises."),
    ("It does not report any averages for the students who took part in it.", "the table reports average minutes and hours.")],
   "A survey shows things happening together (a correlation). Other factors, such as stress or late-night jobs, could explain both, so the survey alone can't prove cause. The article's explanation is what suggests a cause.", 3)
mc("R.3.4-003", "RP-02 and RP-03", "A patient needs the fasting blood test described in the directions and wants to go to Shore Health Clinic. Which plan follows both the directions and the clinic's hours?",
   "Stop eating at 7 p.m. Wednesday and get the blood draw at 7 a.m. Thursday.",
   [("Stop eating at 9 p.m. Tuesday and get the blood draw at 9 a.m. Wednesday.", "the lab is closed on Wednesday."),
    ("Stop eating at 11 p.m. Wednesday and get the blood draw at 7 a.m. Thursday.", "only 8 hours of fasting; the directions require 12."),
    ("Stop eating at 7 p.m. Friday and get the blood draw at 7 a.m. Saturday.", "the clinic is closed on Saturday.")],
   "7 p.m. to 7 a.m. is 12 hours, and the lab is open Thursday from 7 to 11 a.m.", 3)
mc("R.1.5-004", "RP-10", "Which statement is supported by the survey data?",
   "Vaccination rates were higher in each older age group.",
   [("Most adults aged 30–49 got a flu shot.", "only 35% did."),
    ("Every age group met the 70% goal.", "only the 65+ group did."),
    ("Adults 50–64 were vaccinated at twice the rate of adults 65 and older.", "52% is lower than 71%.")],
   "The rates rise steadily: 28%, 35%, 52%, 71%.", 1)
mc("R.3.4-004", "RP-04 and RP-12", "A shopper compares the Allergy Relief label with the DreamDeep advertisement. Which difference between the two texts matters most for using a product safely?",
   "The label lists warnings and limits on use, while the ad claims the product is safe for everyone.",
   [("Both texts list the same side effects and warn against drinking alcohol.", "only the label gives warnings; the ad lists none."),
    ("The ad gives a dose for each age group, while the label gives no dose at all.", "this reverses the texts: the label gives doses by age."),
    ("The label says its product is all natural, while the ad lists only chemical ingredients and side effects.", "the ad, not the label, claims to be natural.")],
   "The label tells users when not to take the product and what to watch for; the ad's \"completely safe for everyone\" claim gives no such guidance.", 2)
mc("R.3.4-005", "RP-12 and RP-13", "How does the advice in Source 1 of \"Screens and Sleep\" differ from the approach of the DreamDeep advertisement?",
   "The article suggests changing habits, while the ad suggests buying a product.",
   [("Both recommend taking melatonin gummies before bed.", "the article never recommends supplements."),
    ("The article recommends taking sleeping pills, while the ad warns readers against using them.", "the article mentions no pills."),
    ("Both are based on the same survey of college students.", "the ad cites no survey.")],
   "The article recommends replacing screen time with calm activities; the ad's solution is to buy gummies.", 2)
