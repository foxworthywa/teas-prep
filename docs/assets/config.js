// Settings Alex can change without touching the app code.
export default {
  siteName: "ESCC TEAS Prep",
  college: "Eastern Shore Community College",

  diagnostic: {
    // per subarea; the Blueprint tab's "Diagnostic items per subsection" also caps this
    maxPerSubarea: 15,
    // never stop a subarea before this many items
    minPerSubarea: 6,
    // stop a subarea once the most likely band has at least this probability
    stopConfidence: 0.85,
    // most items from one Reading passage on one diagnostic (RP-21 has 12 items,
    // so they are spread over several diagnostics)
    passageCapPerForm: 3,
    // share of items answered correctly; practice bands, NOT TEAS score predictions
    bands: [
      { id: "build", label: "Build the basics", upTo: 0.6 },
      { id: "developing", label: "Getting there", upTo: 0.8 },
      { id: "strong", label: "Strong", upTo: 1.0 },
    ],
  },

  practice: {
    // an objective needs this many first tries before it can count as a weak spot
    minAttemptsForWeakSpot: 2,
    weakSpotSessionLength: 10,
  },

  // Optional: send results to a Google Form (responses land in a Sheet in Alex's Drive).
  // Leave url empty to hide the button. See docs/README-site.md for setup.
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

  // English and Reading items are still awaiting faculty review
  reviewPendingSections: ["English", "Reading"],
};
