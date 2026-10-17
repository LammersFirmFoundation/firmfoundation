/**
 * The questions the quote form asks after someone picks a job.
 *
 * The point is the first phone call. "How much to clear my lot?" can only be
 * answered with "I'd have to see it". "About half an acre, brush and small
 * trees, keeping the big oaks, it's for a new build, we'd like to start next
 * month" tells Josiah which machine, how long, and whether it's worth driving
 * out today. Every question here is one he would otherwise ask on that call.
 *
 * Rules for adding one:
 * - **Taps, not typing.** Every question is chips. The free-text box is still
 *   there at the end for anything the chips don't cover.
 * - **Never required.** A visitor who skips all of them still sends a valid
 *   request; a form that blocks on "how many acres?" loses the person who
 *   genuinely doesn't know.
 * - **Plain words.** "Is there a way for a machine to get to the back?", not
 *   "equipment access".
 * - **Keyed on the service slug**, so a renamed service title can't orphan
 *   its questions.
 */
export type QuoteQuestion = {
  id: string;
  label: string;
  options: string[];
  /** Checkboxes rather than radios. */
  multi?: boolean;
  hint?: string;
};

export const questionsByService: Record<string, QuoteQuestion[]> = {
  excavation: [
    {
      id: "purpose",
      label: "What's it for?",
      options: [
        "Patio or walkway base",
        "New beds or sod",
        "Pool",
        "Driveway",
        "Shed or equipment pad",
        "Regrade the yard",
        "Bring in fill",
        "Site prep for a build",
        "Trenching",
        "Something else",
      ],
      multi: true,
    },
    {
      id: "size",
      label: "Roughly how big?",
      options: ["A pad or a strip", "Part of the yard", "The whole lot", "Not sure"],
    },
  ],
  "pools-and-ponds": [
    { id: "dig", label: "Pool or pond?", options: ["Pool", "Pond"] },
    { id: "builder", label: "Pool builder lined up?", options: ["Yes", "Not yet", "It's a pond"] },
    {
      id: "access",
      label: "Can a machine get to the back?",
      options: ["Wide open", "Through a gate or side yard", "Not sure"],
    },
    {
      id: "footprint",
      label: "Anything where it's going?",
      options: ["Open lawn", "Trees or stumps", "A fence, shed or slab", "Not sure"],
      multi: true,
    },
    {
      id: "spoils",
      label: "Where should the dirt go?",
      options: ["Haul it off", "Spread it on site", "Not sure"],
    },
  ],
  "land-clearing": [
    {
      id: "area",
      label: "Roughly how much ground?",
      options: ["A backyard", "Under ¼ acre", "¼ to 1 acre", "More than an acre", "Not sure"],
      hint: "Just the part to be cleared. A quarter acre is a little over 100 by 100 feet.",
    },
    {
      id: "onIt",
      label: "What's on it?",
      options: ["Brush & vines", "Small trees", "Big trees", "Stumps", "Old debris"],
      multi: true,
    },
    { id: "keep", label: "Keeping any trees?", options: ["Yes, some", "No, clear it all", "Not sure yet"] },
    {
      id: "purpose",
      label: "What's it for?",
      options: ["New build", "Pool", "Shed, patio or pad", "Driveway", "Usable yard", "Fence line or trail", "Something else"],
    },
    {
      id: "debris",
      label: "Where should the brush go?",
      options: ["Hauled off", "Mulched in place", "Not sure"],
      hint: "Mulching leaves the chips and stumps on the ground, so it suits ground that will stay natural.",
    },
  ],
  "tree-removal": [
    { id: "trees", label: "How many trees?", options: ["Just stumps", "1", "2 to 5", "6 or more"] },
    { id: "stumps", label: "The stumps?", options: ["Grind them", "Pull them out", "Not sure", "Leave them"] },
    {
      id: "near",
      label: "What's close by?",
      options: ["The house", "A fence", "A driveway", "Open ground"],
      multi: true,
    },
  ],
  drainage: [
    {
      id: "problem",
      label: "What's happening?",
      options: [
        "Standing water",
        "Water toward the house",
        "A spot that stays soggy",
        "Driveway washing out",
        "Ditch or culvert",
        "Something else",
      ],
      multi: true,
    },
  ],
  "forestry-mulching": [
    {
      id: "area",
      label: "Roughly how much ground?",
      options: ["A backyard", "Under ¼ acre", "¼ to 1 acre", "More than an acre", "Not sure"],
      hint: "Just the part to be mulched. A quarter acre is a little over 100 by 100 feet.",
    },
    {
      id: "onIt",
      label: "What's growing on it?",
      options: ["Brush & vines", "Saplings", "Some bigger trees", "Not sure"],
      multi: true,
    },
    {
      id: "after",
      label: "What's the ground for after?",
      options: ["Leave it natural", "A trail or path", "Lawn or garden later", "Build on it later", "Not sure"],
      hint: "If it's going to be lawn or built on, the stumps need pulling, so it's worth saying.",
    },
    {
      id: "wet",
      label: "Is any of it low or wet?",
      options: ["Dry ground", "Some low spots", "It stays wet", "Not sure"],
    },
  ],
};

/** Asked for every job. */
export const commonQuestions: QuoteQuestion[] = [
  {
    id: "when",
    label: "When are you hoping to start?",
    options: ["As soon as possible", "In the next month or two", "Just planning"],
  },
];
