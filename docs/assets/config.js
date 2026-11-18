// Settings Alex can change without touching the app code.
export default {
  siteName: "ESCC TEAS Prep",
  college: "Eastern Shore Community College",

  diagnostic: {
    // per subarea; the Blueprint tab's "Diagnostic items per subsection" also caps this
    maxPerSubarea: 15,
    // never stop a part before this many items
    minPerSubarea: 8,
    // stop a part early only when it is at least this likely that answering all of
    // its planned items would leave its band unchanged (simulated: early and full-length
    // bands agree 93-99% of the time; parts take about 9-12 items on average)
    stopConfidence: 0.9,
    // most items from one Reading passage on one diagnostic (RP-21 has 12 items,
    // so they are spread over several diagnostics)
    passageCapPerForm: 3,
    // share of items answered correctly: under 60%, 60-79%, 80% or more.
    // Practice bands, NOT TEAS score predictions.
    bands: [
      { id: "build", label: "Build the basics", upTo: 0.6 },
      { id: "developing", label: "Getting there", upTo: 0.8 },
      { id: "strong", label: "Strong", upTo: 1.0 },
    ],
  },

  practice: {
    // an objective needs this many answers (practice or diagnostic) before it can count as a weak spot
    minAttemptsForWeakSpot: 2,
    weakSpotSessionLength: 10,
  },

  // Optional: send results to a Google Form (responses land in a Sheet in Alex's Drive).
  // Leave url empty to hide the button. See SITE.md for setup.
  resultsForm: {
    url: "", // e.g. "https://docs.google.com/forms/d/e/XXXX/viewform"
    fields: {
      name: "", // e.g. "entry.1234567890"
      email: "",
      program: "",
      kind: "",
      section: "",
      summary: "",
      details: "",
    },
  },

  programs: ["LPN", "RN", "Dental hygiene", "Other / undecided"],

  // sections whose diagnostic and practice pages say the questions are awaiting
  // faculty review (each question's own note comes from its Review notes in the Sheet)
  reviewPendingSections: ["English", "Reading"],
};
