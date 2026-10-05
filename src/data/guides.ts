import { services, type PlateId } from "@/data/services";
import { yardProblems } from "@/data/yard-problems";

/**
 * Guides: one page per question a homeowner actually types, at `/guides/<slug>`.
 *
 * Why these exist (2026-10-05): search and AI answers credit a business when
 * someone names the category ("land clearing company Charleston"), but when
 * someone describes the job ("do I need a permit to take down a tree in Mount
 * Pleasant") they cite whichever page answers that exact question. The answers
 * already existed here, as FAQ entries halfway down a service page, and a
 * search for the question found the Town's page or a competitor's instead. A
 * baseline run that day: Firm Foundation came up for none of five such
 * questions.
 *
 * Rules, so these stay worth citing:
 *
 * 1. **Few and real.** Five pages, each a question people ask before they
 *    call. Never a page per town ("land clearing in Folly Beach"): Google
 *    treats those as doorway pages, and they would cost the site more than
 *    they could earn.
 * 2. **The short answer comes first** and stands on its own. It is the part a
 *    search result or an AI answer lifts, so it must be complete in two or
 *    three sentences.
 * 3. **Every rule is cited and dated.** `sources` lists where each one comes
 *    from, and `checked` is the day they were last read against those
 *    sources. Ordinances change; re-check yearly and bump `checked` only when
 *    you actually have.
 * 4. **No prices and no licensing claims**, the same as the rest of the site.
 * 5. **Never write an answer twice.** A section can pull a service FAQ in
 *    (`kind: "faq"`) or a service's options (`kind: "approaches"`) rather than
 *    restating them, and the "what Josiah looks at" section comes from the
 *    guide's yard problem. Both are checked at build time below.
 */

export type GuideSection =
  | {
      kind?: "prose";
      heading: string;
      paragraphs?: string[];
      bullets?: string[];
      steps?: string[];
      /** Paragraphs after the list. */
      then?: string[];
      /** Slug of another guide this section points on to. */
      see?: string;
    }
  /** A service FAQ, rendered with its question as the heading. Single source: services.ts. */
  | { kind: "faq"; question: string }
  /** A service's `approaches`, the choice a homeowner has to make. */
  | { kind: "approaches"; heading: string; serviceSlug: string };

export type GuideSource = { label: string; url?: string };

export type Guide = {
  /** Stable: it is the URL. Renaming one needs a redirect in vercel.json. */
  slug: string;
  /** Short name for breadcrumbs, cards and the footer. */
  short: string;
  /** The H1, phrased the way people ask it. */
  question: string;
  /** `<title>`. Must contain "Firm Foundation" inline (see SEO.tsx). */
  title: string;
  description: string;
  keywords: string;
  /** Two or three sentences that answer the question completely on their own. */
  answer: string;
  /** The service this question leads to. */
  serviceSlug: string;
  /** The yard problem behind it: prefills the quote form and supplies "what Josiah looks at". */
  problemId: string;
  plate: PlateId;
  sections: GuideSection[];
  sources: GuideSource[];
  /** ISO dates. `checked` is when the rules were last read against `sources`. */
  published: string;
  checked: string;
  /**
   * Service-page FAQ and yard-problem questions this guide is the long answer
   * to. Each one gets a "full answer" link on its service page.
   */
  covers: string[];
};

const MP_TREES: GuideSource = {
  label: "Town of Mount Pleasant, Trees (tree permit questions)",
  url: "https://www.tompsc.com/1413/Trees",
};
const MP_TREE_PROTECTION: GuideSource = {
  label: "Town of Mount Pleasant, Tree Protection and Removal",
  url: "https://www.tompsc.com/1419/Tree-Protection-and-Removal",
};
const MP_SINGLE_FAMILY: GuideSource = {
  label: "Town of Mount Pleasant, Single Family Stormwater Management and Tree Preservation",
  url: "https://www.tompsc.com/1555/Single-Family-Stormwater-Management-and-",
};
const SC_811: GuideSource = {
  label: "S.C. Code §58-36-60, notice before excavating (SC811)",
  url: "https://law.justia.com/codes/south-carolina/title-58/chapter-36/section-58-36-60/",
};

export const guides: Guide[] = [
  {
    slug: "mount-pleasant-tree-permit",
    short: "Tree permits in Mount Pleasant",
    question: "Do I need a permit to remove a tree in Mount Pleasant?",
    title: "Do You Need a Tree Permit in Mount Pleasant? | Firm Foundation",
    description:
      "Which trees need a permit in Mount Pleasant, SC, which species never do, how the $50 request works, and who gets fined when a protected tree comes down without one.",
    keywords:
      "Mount Pleasant tree permit, tree removal permit Mount Pleasant SC, protected trees Mount Pleasant, do I need a permit to cut down a tree Mount Pleasant, Charleston tree ordinance",
    answer:
      "Usually, yes. On a residential lot the Town protects trees 16 inches or more across, measured 4½ feet off the ground, and pines from 24 inches. A short list of species, sweet gum among them, never needs a permit. Take a protected tree down without one and the Town fines both the homeowner and whoever cut it.",
    serviceSlug: "tree-removal",
    problemId: "tree-problem",
    plate: "trees",
    sections: [
      {
        heading: "Which trees need a permit",
        paragraphs: [
          "On a residential lot, the Town protects trees 16 inches or more in diameter, measured 4½ feet above the ground. You can check it yourself: wrap a tape around the trunk at that height and divide by 3.14. A trunk about 50 inches around is right at the line.",
        ],
        bullets: [
          "Most trees 16 inches and up need approval before they come down.",
          "Pines are protected from 24 inches.",
          "Historic trees, 24 inches and larger, need an arborist's report, and sometimes a variance from the Board of Zoning Appeals.",
          "A tree in a buffer, a critical area, an easement or a right-of-way can be protected at any size and any species.",
        ],
      },
      {
        heading: "The trees that never need one",
        paragraphs: [
          "The Town exempts sweet gum, Callery pear (the Bradford pear is one), river birch, mimosa, chinaberry, Chinese tallow, camphor and white poplar at any size, and its tree permit FAQ adds mulberry and Leyland cypress. Pines under 24 inches are exempt too.",
        ],
      },
      {
        heading: "How the permit works",
        steps: [
          "Request it online through OPAL, the Town's permitting system. There's a $50 application fee, and it isn't refunded.",
          "The Town inspects the tree: its health, whether it can come out, and whether you'll need to plant replacements, which the Town calls mitigation.",
          "A passed inspection isn't the permit. You sign back into OPAL, read the inspector's comments and name the tree company doing the work. If replacements are required, you sign a mitigation affidavit.",
          "Once the permit is issued, it goes up where it can be seen from outside, such as a front window or storm door, while the work is done.",
        ],
        then: [
          "If the tree is coming out for construction, a new house or a pool say, it's reviewed with the building permit instead. And Town staff won't come out to tell you whether a tree is healthy. That opinion comes from an arborist.",
        ],
      },
      {
        heading: "Dead, damaged and storm-hit trees",
        paragraphs: [
          "A declining or damaged tree goes through the same request if it's a protected size and species. After a declared emergency, Mount Pleasant can waive the process for fallen and severely damaged trees (Zoning Code §156.704). Either way, photograph the tree before anything is cut, in case you're asked to show its condition afterwards.",
        ],
      },
      {
        heading: "What happens if you skip it",
        paragraphs: [
          "Removing a protected tree without approval and a posted permit brings a fine, and the Town fines the homeowner and the tree company both. It's why we ask about the permit before a date goes on the calendar.",
        ],
      },
      { kind: "faq", question: "What are the tree rules elsewhere around Charleston?" },
      {
        heading: "Who has the final word",
        paragraphs: [
          "The Town does. Tree questions go to trees@tompsc.com or (843) 884-1229. If your neighborhood has an HOA, it may have rules of its own on top of the Town's.",
        ],
        see: "stump-grinding-vs-removal",
      },
    ],
    sources: [
      MP_TREES,
      MP_TREE_PROTECTION,
      {
        label: "Mount Pleasant Zoning Code §156.702, tree removal and replacement",
        url: "https://codelibrary.amlegal.com/codes/mtpleasantsc/latest/mpleasant_sc/0-0-0-137141",
      },
      { label: "Mount Pleasant Zoning Code §156.704, emergencies" },
    ],
    published: "2026-10-05",
    checked: "2026-10-05",
    covers: ["Do I need a permit to take down a tree in Mount Pleasant?"],
  },
  {
    slug: "clearing-a-lot-in-mount-pleasant",
    short: "Clearing a lot in Mount Pleasant",
    question: "What does it take to clear a lot in Mount Pleasant?",
    title: "Clearing a Lot in Mount Pleasant: What It Takes | Firm Foundation",
    description:
      "Permits, protected trees, the marsh buffer, wet ground and where the debris goes: what clearing a residential lot in Mount Pleasant, SC involves, in the order it happens.",
    keywords:
      "clearing a lot Mount Pleasant SC, lot clearing permit Mount Pleasant, land clearing rules Charleston SC, marsh buffer Mount Pleasant, can I burn brush Mount Pleasant, clearing a lot for a new house",
    answer:
      "Permit first. Then a walk-through to flag what stays, then the clearing and the haul-off. In Mount Pleasant a single-family lot needs a permit before it's cleared or graded, protected trees need their own approval, the marsh buffer stays untouched, and nothing gets burned.",
    serviceSlug: "land-clearing",
    problemId: "building-lot",
    plate: "clearing",
    sections: [
      {
        heading: "Before anything is cut: the permits",
        bullets: [
          "Clearing or grading on a single-family lot in Mount Pleasant needs the Town's stormwater management and tree preservation permit before work starts. The zoning code requires a permit before any lot is cleared, excavated or filled (§156.1171).",
          "Protected trees need their own approval. If the clearing is for a new house, tree removal is reviewed with the building permit.",
          "Outside town limits, unincorporated Charleston County requires a stormwater permit once land disturbance passes 5,000 square feet.",
        ],
        see: "mount-pleasant-tree-permit",
      },
      {
        kind: "approaches",
        heading: "Most lots don't need everything gone",
        serviceSlug: "land-clearing",
      },
      { kind: "faq", question: "Can you clear right up to the marsh?" },
      { kind: "faq", question: "What if part of the property is wet?" },
      { kind: "faq", question: "Can the brush be burned instead of hauled off?" },
      { kind: "faq", question: "Will the town pick up the debris?" },
      {
        heading: "How the job runs",
        steps: [
          "Walk the lot together and flag what stays: the trees worth keeping, the clearing limit, and the way in for equipment.",
          "Permits in hand before work starts.",
          "Utilities marked through SC811 before any stumps are pulled, because pulling a stump is digging.",
          "Clear with a tracked excavator, working around the keeper trees' roots rather than driving over them.",
          "Haul the debris off and knock down the ruts and root holes, so the ground is ready for whatever comes next.",
        ],
      },
    ],
    sources: [
      MP_SINGLE_FAMILY,
      MP_TREES,
      { label: "Mount Pleasant Zoning Code §156.1171, permits for clearing, excavating and filling" },
      { label: "Mount Pleasant Zoning Code §§156.622–156.623, critical line buffers" },
      { label: "Mount Pleasant Town Code §92.30, burning" },
      {
        label: "33 CFR 323.2, discharges of dredged or fill material (wetlands)",
        url: "https://www.ecfr.gov/current/title-33/chapter-II/part-323/section-323.2",
      },
      SC_811,
    ],
    published: "2026-10-05",
    checked: "2026-10-05",
    covers: [
      "Do I need a permit to clear my lot in Mount Pleasant?",
      "What's involved in clearing a lot for a new house?",
    ],
  },
  {
    slug: "yard-floods-after-rain",
    short: "When the yard floods after rain",
    question: "Why does my yard flood after it rains, and how do you fix it?",
    title: "Why Your Yard Floods After Rain, and the Fix | Firm Foundation",
    description:
      "Why water stands in Lowcountry yards, how much slope a yard needs, when a French drain works and when it fails, and what you can't drain onto a neighbor in Mount Pleasant, SC.",
    keywords:
      "yard floods after rain, standing water in yard Mount Pleasant, yard drainage Charleston SC, French drain Mount Pleasant, water running toward house, regrading yard, swale",
    answer:
      "Usually it's the grade. The ground holds water in a low spot or sends it toward the house, and the Lowcountry's high water table leaves it nowhere to soak in. The fix is regrading where there's enough fall, and a swale or French drain where there isn't, run to somewhere the water is allowed to go.",
    serviceSlug: "drainage",
    problemId: "standing-water",
    plate: "drainage",
    sections: [
      {
        heading: "First: your yard, or the whole street?",
        paragraphs: [
          "In a big storm a whole neighborhood can sit under water because the system itself is full. In August 2024, with streets flooded, the Town of Mount Pleasant said most problems weren't clogged drains: the drainage systems were full, and the ponds and wetlands around them were at capacity. Nothing done in one backyard changes that.",
          "What can be fixed is water that sits in your yard after an ordinary rain, or water that heads for your house.",
        ],
      },
      {
        heading: "Why water sits where it does",
        bullets: [
          "It stands in a low spot. The ground slopes so the water collects instead of leaving.",
          "One spot never dries out. Often a pocket fed by a downspout or a neighbor's slope. Sometimes it's the water table close to the surface, which is a different problem.",
          "It runs toward the house. Common in older yards where beds have been topped up with soil and mulch for years, until the ground by the wall sits higher than it should.",
        ],
      },
      { kind: "faq", question: "How much should the yard slope away from the house?" },
      {
        kind: "approaches",
        heading: "Regrade it, or drain it",
        serviceSlug: "drainage",
      },
      { kind: "faq", question: "Why do French drains fail here?" },
      { kind: "faq", question: "Can I drain my yard onto the neighbor's?" },
      {
        heading: "Permits",
        paragraphs: [
          "Regrading on a single-family lot in Mount Pleasant needs the Town's stormwater management and tree preservation permit before the work starts, and it gets checked before anything is scheduled.",
        ],
      },
    ],
    sources: [
      {
        label: "Town of Mount Pleasant, statement on neighborhood flooding, 2024-08-06",
        url: "https://www.tompsc.com/m/newsflash/Home/Detail/2778",
      },
      MP_SINGLE_FAMILY,
      { label: "International Residential Code R401.3, drainage" },
    ],
    published: "2026-10-05",
    checked: "2026-10-05",
    covers: [
      "Why does water stand in my yard after it rains?",
      "How do you fix a spot in the yard that stays soggy?",
      "Water runs toward my house. What can be done about it?",
    ],
  },
  {
    slug: "who-digs-a-pool",
    short: "Who digs a pool",
    question: "Who digs the hole for an in-ground pool?",
    title: "Who Digs the Hole for an In-Ground Pool? | Firm Foundation",
    description:
      "Who handles a pool dig, how much dirt comes out, getting a machine to the backyard, and why groundwater matters for pools in Mount Pleasant and greater Charleston, SC.",
    keywords:
      "who digs the hole for an inground pool, pool excavation Charleston SC, pool dig Mount Pleasant, pool excavation contractor, pool dirt haul off, groundwater pool dig Lowcountry",
    answer:
      "It depends on your pool builder. Some bring their own excavator; others hire an excavation company, which digs to the builder's layout and depths, trucks the dirt away, and comes back for backfill and final grade once the pool is in.",
    serviceSlug: "pools-and-ponds",
    problemId: "pool-dig",
    plate: "pools",
    sections: [
      {
        heading: "Who does what",
        bullets: [
          "The pool builder sets the layout, depths and elevations, and normally handles the pool's own permit.",
          "The excavator clears a way in, digs to the builder's layout, and gets the dirt off the property.",
          "Once the shell is in: backfill around it and a final grade, so water runs away from the pool and the house.",
        ],
      },
      {
        heading: "How much dirt comes out",
        paragraphs: [
          "More than most people picture. A 16 by 32 foot pool averaging 5 feet deep is about 95 cubic yards of earth, and dirt takes up more room once it's dug loose. Trucking it away is often the biggest part of a pool dig, so where it goes gets decided first: hauled off, or spread and graded somewhere else on the property if there's room.",
        ],
      },
      {
        heading: "Getting a machine to the backyard",
        paragraphs: [
          "Access decides a lot: the gate width, a fence section that has to come out for a day, what's buried along the way, and where trucks can load without tearing up the driveway. Trees or stumps in the footprint come out first. In Mount Pleasant, protected trees removed for a pool are reviewed with the building permit.",
        ],
        see: "mount-pleasant-tree-permit",
      },
      { kind: "faq", question: "Why does groundwater matter for a pool dig?" },
      { kind: "faq", question: "Do you call 811 before digging?" },
      { kind: "faq", question: "Do you work directly with pool builders?" },
    ],
    sources: [SC_811, MP_TREES],
    published: "2026-10-05",
    checked: "2026-10-05",
    covers: ["Who digs the hole for an in-ground pool?"],
  },
  {
    slug: "stump-grinding-vs-removal",
    short: "Grind or pull a stump",
    question: "Should a stump be ground down or pulled out?",
    title: "Stump Grinding vs. Stump Removal: Which One? | Firm Foundation",
    description:
      "When to grind a stump and when to pull the whole root ball out with an excavator: what each leaves behind, settling and sprouts, and what to do before you build or dig.",
    keywords:
      "stump grinding vs stump removal, should I grind or remove a stump, stump root ball removal, stump removal Mount Pleasant SC, stump grinding Charleston SC, building over a stump",
    answer:
      "Grind it if the spot will be lawn or a bed. Pull it if anything will be built or dug there. Grinding takes the stump below the surface and leaves the roots to rot; pulling lifts the stump and root ball out whole, and the hole is backfilled and packed.",
    serviceSlug: "tree-removal",
    problemId: "stumps",
    plate: "trees",
    sections: [
      {
        kind: "approaches",
        heading: "The two options",
        serviceSlug: "tree-removal",
      },
      {
        heading: "What grinding leaves behind",
        paragraphs: [
          "A grinder chews the stump and its big surface roots down below the ground, typically 8 to 12 inches, and leaves a pile of chips in the hole. The roots underneath stay and rot over the years. As the chips and roots break down the spot can settle, so it may want topping up with soil before it's sodded, and again later.",
          "Some trees common here, sweet gum especially, can send up shoots from the roots left behind.",
        ],
      },
      {
        heading: "When it has to come out whole",
        paragraphs: [
          "Anywhere you'll dig, pour or build: a pool, a slab, a footing, a driveway, or a trench for a drain. Roots rotting in place leave soft ground behind, and a grinder doesn't reach deep enough to clear a footing or a pool dig. With an excavator, the stump and root ball come out in one piece, and the hole is filled and packed so it doesn't sink later.",
        ],
      },
      {
        heading: "A whole lot of stumps",
        paragraphs: [
          "After a clearing, the stumps where something will be built get pulled, and the rest are ground or left depending on what that ground is for. It's one conversation about the plan for the lot, not a stump-by-stump one.",
        ],
        see: "clearing-a-lot-in-mount-pleasant",
      },
      {
        heading: "Before a stump is pulled",
        paragraphs: [
          "Pulling a stump is digging, so utilities get marked through SC811 first: roots and buried lines share the same ground. And if the tree is still standing and it's a protected size, the Town's tree permit comes before any of this.",
        ],
        see: "mount-pleasant-tree-permit",
      },
    ],
    sources: [
      {
        label: "Iowa State University Extension, How to remove tree stumps",
        url: "https://yardandgarden.extension.iastate.edu/how-to/how-remove-tree-stumps",
      },
      {
        label: "USDA Forest Service, Silvics of North America: Sweetgum (root and stump sprouting)",
        url: "https://research.fs.usda.gov/silvics/sweetgum",
      },
      SC_811,
    ],
    published: "2026-10-05",
    checked: "2026-10-05",
    covers: ["Should a stump be ground down or pulled out?"],
  },
];

export const findGuide = (slug: string | null | undefined) =>
  slug ? guides.find((g) => g.slug === slug) : undefined;

/** The long answer to a service-page question, if there is one. */
export const guideCovering = (question: string) => guides.find((g) => g.covers.includes(question));

/** A service FAQ by its exact question, from whichever service carries it. */
export const findServiceFaq = (question: string) => {
  for (const service of services) {
    const faq = service.faqs?.find((f) => f.question === question);
    if (faq) return { ...faq, service };
  }
  return undefined;
};

/** "2026-10-05" → "October 5, 2026". By hand, because a Date parsed from an ISO day is UTC midnight and prints as the day before in US time zones. */
export const formatGuideDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[m - 1]} ${d}, ${y}`;
};

/**
 * Guard rail, like the one in yard-problems.ts: every reference a guide makes
 * must resolve, or a section silently renders empty and a "full answer" link
 * silently disappears. Runs in dev and at build time, so a typo or a renamed
 * FAQ question fails the build instead of shipping.
 */
if (import.meta.env.DEV || import.meta.env.SSR) {
  const problemQuestions = new Set(yardProblems.map((p) => p.question));
  const slugs = new Set(guides.map((g) => g.slug));
  for (const guide of guides) {
    const fail = (why: string) => {
      throw new Error(`guides: "${guide.slug}" ${why}`);
    };
    if (!services.some((s) => s.slug === guide.serviceSlug)) fail(`points at unknown service "${guide.serviceSlug}"`);
    if (!yardProblems.some((p) => p.id === guide.problemId)) fail(`points at unknown yard problem "${guide.problemId}"`);
    if (!guide.title.includes("Firm Foundation")) fail("title must contain \"Firm Foundation\"");
    for (const section of guide.sections) {
      if (section.kind === "faq" && !findServiceFaq(section.question)) fail(`pulls in a FAQ that doesn't exist: "${section.question}"`);
      if (section.kind === "approaches" && !services.find((s) => s.slug === section.serviceSlug)?.approaches) {
        fail(`pulls in approaches from "${section.serviceSlug}", which has none`);
      }
      if ("see" in section && section.see && !slugs.has(section.see)) {
        fail(`links to unknown guide "${section.see}"`);
      }
    }
    for (const question of guide.covers) {
      if (!findServiceFaq(question) && !problemQuestions.has(question)) {
        fail(`covers a question no service page asks: "${question}"`);
      }
    }
  }
}
