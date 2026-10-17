import { services } from "@/data/services";

/**
 * The situations a homeowner actually recognises, and what each one usually
 * turns out to be. They render as each service page's FAQ (and `FAQPage`
 * schema), and `/contact?problem=<id>` prefills the quote form from one. The
 * homepage accordion that used to show six of them was cut on 2026-09-29 for
 * simplicity; "send a photo" replaced it.
 *
 * This exists because the real barrier to someone calling is not that they
 * don't trust Josiah — it's that they cannot name their own job. They know
 * "the back half of the lot has gone to vines and I can't walk it." They don't
 * know that's selective clearing, that the good trees can stay, or what it
 * involves. So they put it off.
 *
 * Every entry is written to the same three rules:
 *
 * 1. **The label is the homeowner's words, never the trade's.** "Water stands
 *    in the yard after it rains", not "inadequate positive drainage".
 * 2. **No prices, no promises, no licensing claims.** `cause` says what it
 *    *usually* is; `fix` says what the work *is*, not what it will cost or
 *    guarantee. The site makes no licensing or insurance claim anywhere and
 *    this must not become the place one sneaks in.
 * 3. **`service` must match a real service title**, because it is posted
 *    straight into the contact form — a value that isn't in `serviceNames`
 *    would fail validation on arrival. Checked at build time, below.
 *
 * `note` is what lands in the message box. It is written in the first person,
 * as the customer, because that is who is sending it — and it is deliberately
 * a starting point they can edit rather than a finished description.
 */
export type YardProblemGroup =
  | "Lawns, beds and patios"
  | "Land and trees"
  | "Water and ground"
  | "Something to dig or build";

export type YardProblem = {
  /** Stable id — used in the deep link, so it must not change casually. */
  id: string;
  group: YardProblemGroup;
  /** The situation, in the words someone would use out loud. */
  label: string;
  /**
   * The same thing phrased as the question people actually type into Google.
   * Feeds the FAQ block and FAQPage schema on the service page this routes to,
   * which is where the search value of this content actually lands.
   */
  question: string;
  /** What that usually turns out to be here. */
  cause: string;
  /** What the work actually involves. */
  fix: string;
  /** What Josiah would want to see standing on the property. */
  visit: string;
  /** Slug of the service page this routes to. */
  serviceSlug: string;
  /** Must be one of `serviceNames` — it is posted into the form. */
  service: string;
  /** Seeds the contact form's message box. First person, editable. */
  note: string;
};

export const yardProblems: YardProblem[] = [
  // ── Lawns, beds and patios ──────────────────────────────────────────────
  {
    id: "bare-yard",
    group: "Lawns, beds and patios",
    label: "The yard looks bare and I don't know where to start",
    question: "Where do you start with landscaping a bare yard?",
    cause:
      "Usually there's no single problem, just no plan yet. The lawn never filled in and there are no real beds, so nothing ties the house to the ground around it.",
    fix:
      "Starting from the ground: low spots graded out and the soil made ready. Then beds along the house and the walk, planted for the sun and salt each spot gets, and sod only where there's light enough to keep it.",
    visit:
      "How much sun each part of the yard gets, where water goes when it rains, how close you are to salt water, and how much upkeep you want to take on.",
    serviceSlug: "landscaping",
    service: "Landscaping",
    note: "My yard is pretty bare and I'd like help knowing where to start. The area is ",
  },
  {
    id: "grass-under-oaks",
    group: "Lawns, beds and patios",
    label: "Grass won't grow under the oaks",
    question: "Why won't grass grow under my oak trees?",
    cause:
      "Shade, mostly, and the tree's roots taking the water. Clemson Extension's rule is that under 4 hours of direct sun a day it's too shady for grass to grow well, and a big live oak can cast that much shade on its own.",
    fix:
      "The fix that lasts is to stop fighting the shade. The ground under the canopy becomes a bed of pine straw, mulch or groundcover, laid over the roots without piling new soil on them, and the sod stays where the sun is.",
    visit:
      "How many hours of direct sun the spot really gets, how close the roots run to the surface, and where the lawn could stay.",
    serviceSlug: "landscaping",
    service: "Landscaping",
    note: "Grass won't grow under the trees in my yard. The area is about ",
  },
  {
    id: "tired-beds",
    group: "Lawns, beds and patios",
    label: "The beds look tired and overgrown",
    question: "Can you redo beds that have gotten tired and overgrown?",
    cause:
      "Shrubs that have outgrown their spot, edges that have disappeared into the lawn, and years of new mulch spread over old until it's banked up against the house.",
    fix:
      "Pulling out what has outgrown its place, re-cutting the edges, taking the old mulch down instead of adding to it, and replanting with plants that fit. Then fresh mulch or pine straw at the right depth, kept back from the siding.",
    visit:
      "What is worth keeping, what has outgrown its place, how high the beds now sit against the house, and how much upkeep you want to be doing.",
    serviceSlug: "landscaping",
    service: "Landscaping",
    note: "My beds have gotten tired and overgrown. What I'd like is ",
  },
  {
    id: "patio-or-walkway",
    group: "Lawns, beds and patios",
    label: "I want a patio, a walkway, or somewhere to sit outside",
    question: "What goes into a paver patio that won't sink?",
    cause:
      "Not a problem so much as a project. The part most people underestimate is underneath it: a patio on a base that wasn't dug out and compacted properly starts to move.",
    fix:
      "Digging out the footprint, clearing roots and soft soil, and building a compacted stone base in layers, sloped so water runs off. Then the pavers, stone or gravel on top, with an edge that holds them. The dirt work is most of the job, which is why we do both.",
    visit:
      "Where it would go, the ground under it, where water moves across that spot, any big trees nearby, and how it ties into the house and the walk.",
    serviceSlug: "hardscapes",
    service: "Hardscapes",
    note: "I'm interested in a patio or walkway. Roughly what I have in mind is ",
  },
  {
    id: "pavers-sinking",
    group: "Lawns, beds and patios",
    label: "My pavers are sinking or coming loose",
    question: "Why are my pavers sinking, and can they be fixed?",
    cause:
      "Usually what's under them: a base that was too thin or never compacted, roots or soft soil left underneath to rot and settle, no edge holding the pavers in, or water running under the patio instead of off it.",
    fix:
      "Most can be. The pavers come up, the base under the low area is dug out and rebuilt in compacted layers, and the pavers go back down. Where the edge is the problem, a proper edge restraint goes in.",
    visit:
      "Where it has sunk, where water runs across it, whether anything is holding the edge, and what's under it once a few pavers are lifted.",
    serviceSlug: "hardscapes",
    service: "Hardscapes",
    note: "My pavers are sinking or coming loose. The patio is about ",
  },
  {
    id: "slope-washing-out",
    group: "Lawns, beds and patios",
    label: "A slope keeps washing out",
    question: "How do you stop a slope from washing out?",
    cause:
      "Bare soil on a grade, with water running down it every time it rains. Sometimes a downspout or a neighbor's runoff is aimed straight at it.",
    fix:
      "On a gentle slope, planting and pine straw, which holds on a slope better than most mulches. Where it's too steep for that, a retaining wall with gravel and a drain behind it, and an engineered design if the wall has to hold back more than 4 feet of earth.",
    visit:
      "How tall and steep the slope is, where the water comes from, and what sits at the top of it.",
    serviceSlug: "hardscapes",
    service: "Hardscapes",
    note: "I have a slope that keeps washing out. It's about ",
  },
  // ── Land and trees ──────────────────────────────────────────────────────
  {
    id: "overgrown",
    group: "Land and trees",
    label: "Brush and vines have taken over the backyard or the lot",
    question: "Can you clear overgrown brush and small trees?",
    cause:
      "Lowcountry undergrowth reclaims unused ground quickly, and once sweetgum, wax myrtle and vines establish in it, clearing by hand stops being realistic.",
    fix:
      "Clearing the brush, undergrowth and small trees down to usable ground, pulling the stumps that are in the way, and hauling the debris off so you can see what you actually have. Where the ground will stay natural, the brush can be mulched in place instead.",
    visit:
      "How much there is, what is worth keeping, and whether a machine can get to it.",
    serviceSlug: "land-clearing",
    service: "Land Clearing",
    note: "I have brush and undergrowth that's taken over part of the property. It's about ",
  },
  {
    id: "keep-good-trees",
    group: "Land and trees",
    label: "I want the underbrush gone but the good trees kept",
    question: "Can you clear underbrush without taking out the big trees?",
    cause:
      "Most wooded Lowcountry lots have good oaks and pines standing in a thicket of vines, sweetgum and scrub. It's the thicket that makes the land feel unusable, not the trees.",
    fix:
      "Selective clearing: the brush, briars and saplings come out, the trees you choose stay, and the machine works around their root zones instead of driving over them.",
    visit:
      "Which trees are worth keeping, how close the brush grows to them, and how a machine can work in there without tearing up their roots.",
    serviceSlug: "land-clearing",
    service: "Land Clearing",
    note: "I'd like the underbrush cleared but the good trees kept. The area is about ",
  },
  {
    id: "building-lot",
    group: "Land and trees",
    label: "I'm building, and the lot needs clearing first",
    question: "What's involved in clearing a lot for a new house?",
    cause:
      "Not a problem so much as the first step. The builder needs the footprint, the driveway and a work area opened up, and usually wants the trees outside that left alone.",
    fix:
      "Clearing the building area, drive and access down to workable ground, pulling stumps wherever something will be built, and hauling the debris off, with the trees outside the clearing line left standing.",
    visit:
      "The site plan if you have one, which trees you want kept, and how trucks and equipment will get in.",
    serviceSlug: "land-clearing",
    service: "Land Clearing",
    note: "I'm building on a lot that needs clearing first. The lot is about ",
  },
  {
    id: "mulch-in-place",
    group: "Land and trees",
    label: "I want the brush gone, but not hauled off or burned in a pile",
    question: "Can brush be cleared without hauling it off or burning it?",
    cause:
      "Most clearing leaves a pile behind: brush, limbs and small trees that have to be loaded out. On ground that is going to stay natural, that pile is the part nobody needed.",
    fix:
      "Forestry mulching: a mulching head grinds the brush and small trees where they stand and leaves them as a layer of wood chips over the ground. Nothing to haul and nothing to burn. It suits ground you want open and walkable, not ground that is about to be built on or sodded, because the chips and stumps stay.",
    visit:
      "What is growing there, how big the trees are, what you plan to do with the ground next, and whether any of it is low or wet.",
    serviceSlug: "forestry-mulching",
    service: "Forestry Mulching",
    note: "I'd like brush cleared and mulched in place rather than hauled off. The area is about ",
  },
  {
    id: "trail",
    group: "Land and trees",
    label: "I want a path cut through the woods",
    question: "Can you cut a trail through wooded land?",
    cause:
      "Not a problem so much as a job: the woods are there, but the undergrowth means nobody can walk them.",
    fix:
      "Mulching a path through the understory. The brush and saplings along the line are ground into chips that stay on the ground, and the trees on either side are left alone.",
    visit:
      "Where you want the path to go, which trees it has to wind around, and whether any of the route crosses low, wet ground.",
    serviceSlug: "forestry-mulching",
    service: "Forestry Mulching",
    note: "I'd like a path cut through the woods on my property. It would run roughly ",
  },
  {
    id: "tree-problem",
    group: "Land and trees",
    label: "A tree needs to come down",
    question: "Can you take down a tree near the house?",
    cause:
      "A lean toward the house, storm damage, or a tree that has simply outgrown where it was planted. Worth dealing with before hurricane season rather than after.",
    fix:
      "Taking it down, cleaning up every limb, and grinding or pulling the stump depending on what the ground is for next.",
    visit:
      "What is around it (roof, fence, drive) and how much room there is to work.",
    serviceSlug: "tree-removal",
    service: "Tree & Stump Removal",
    note: "I have a tree that needs to come down. It's ",
  },
  {
    id: "stumps",
    group: "Land and trees",
    label: "Old stumps are in the way",
    question: "Should a stump be ground down or pulled out?",
    cause:
      "Stumps left behind from old removals, or a whole lot of them after clearing. They are a mowing hazard, and they stop you using the ground.",
    fix:
      "Grinding them below the surface where you'll plant or lay sod, or pulling the stump and root ball with the excavator where the ground will be dug or built on, then backfilling the hole.",
    visit:
      "How many there are, how big, and what the ground is going to be used for next.",
    serviceSlug: "tree-removal",
    service: "Tree & Stump Removal",
    note: "I have stumps that need dealing with. There are about ",
  },
  {
    id: "storm-damage",
    group: "Land and trees",
    label: "A storm brought a tree or limbs down",
    question: "Can you clean up a tree that came down in a storm?",
    cause:
      "Hurricane season and summer storms. A tree lying on open ground is one job; one resting on the house or the fence is a more careful one.",
    fix:
      "Cutting up what's down, taking down anything left standing that isn't safe, dealing with the stumps, and hauling it all off.",
    visit:
      "What it's resting on, what's still standing, and how equipment can reach it.",
    serviceSlug: "tree-removal",
    service: "Tree & Stump Removal",
    note: "A storm brought down a tree on my property. It's ",
  },

  // ── Water and ground ────────────────────────────────────────────────────
  {
    id: "standing-water",
    group: "Water and ground",
    label: "Water stands in the yard after it rains",
    question: "Why does water stand in my yard after it rains?",
    cause:
      "Almost always the grade rather than the soil. The ground slopes so that water collects somewhere instead of leaving, and in the Lowcountry a high water table means it has nowhere to soak away to once it gets there.",
    fix:
      "Regrading the low areas so water runs off, and cutting drainage where the grade alone can't carry it. Which of the two does the work depends on how much fall there is to play with.",
    visit:
      "Where the water actually collects, where it could go instead, and how much fall there is between those two points.",
    serviceSlug: "drainage",
    service: "Drainage",
    note: "Water stands in my yard after it rains. It collects in ",
  },
  {
    id: "soggy-spot",
    group: "Water and ground",
    label: "One spot stays soggy and never dries out",
    question: "How do you fix a spot in the yard that stays soggy?",
    cause:
      "Usually a low pocket holding water long after the rest of the yard has drained, sometimes fed by a downspout or a neighbouring slope. Occasionally it is the water table sitting close to the surface, which is a different conversation.",
    fix:
      "A French drain to give the water a path out, or regrading to remove the pocket. Drainage here has to be planned around the high water table: a trench that fills from below solves nothing.",
    visit:
      "How long it holds water, what feeds it, and whether there is anywhere lower to run a drain to.",
    serviceSlug: "drainage",
    service: "Drainage",
    note: "I have a spot in the yard that stays soggy and never dries out. It's about ",
  },
  {
    id: "water-toward-house",
    group: "Water and ground",
    label: "Water runs toward the house, not away from it",
    question: "Water runs toward my house. What can be done about it?",
    cause:
      "The grade falls the wrong way near the foundation. Common on older yards where beds have been topped up with soil and mulch over the years until the ground beside the house sits higher than it did.",
    fix:
      "Re-establishing fall away from the foundation, and drainage to carry water somewhere it can leave. This is the one worth looking at soonest: it's the problem that gets more expensive the longer it runs.",
    visit:
      "The grade in the first few feet out from the wall, where the downspouts discharge, and any staining that shows how high water has stood.",
    serviceSlug: "drainage",
    service: "Drainage",
    note: "Water runs toward my house instead of away from it. The worst side is ",
  },
  {
    id: "driveway-washing-out",
    group: "Water and ground",
    label: "The gravel driveway is rutting or washing out",
    question: "How do you stop a gravel driveway from rutting and washing out?",
    cause:
      "Either water crossing the drive instead of running alongside it, or a base that was never built to hold up under traffic. Adding stone on top of a soft base washes out again by the next storm.",
    fix:
      "Regrading the drive with a crown so water sheds to the sides, cutting drainage along it where needed, and prepping a proper base before any new stone goes down.",
    visit:
      "Where the water crosses, how deep the ruts run, and what is under the existing stone.",
    serviceSlug: "excavation",
    service: "Excavation & Grading",
    note: "My gravel driveway keeps rutting and washing out. It's roughly ",
  },
  {
    id: "need-a-pad",
    group: "Water and ground",
    label: "I need a level pad for a shed, parking or equipment",
    question: "Can you prep a level pad for a shed or parking?",
    cause:
      "Not a problem so much as a job: something needs to sit on ground that is level, compacted, and drains, so it doesn't settle or sit in water later.",
    fix:
      "Clearing and grading the footprint, building a compacted base, and setting the grade so water sheds off the pad rather than sitting under whatever goes on it.",
    visit:
      "The footprint and access for equipment, what the ground is like underneath, and where water moves across that part of the property.",
    serviceSlug: "excavation",
    service: "Excavation & Grading",
    note: "I need a level pad prepped. It's for ",
  },
  {
    id: "low-spot-fill",
    group: "Water and ground",
    label: "Part of the yard sits low and needs building up",
    question: "Can you bring in fill dirt to raise a low part of the yard?",
    cause:
      "Usually ground that has settled over the years, or was never brought up to grade when the house went in. Filling it without thinking about where the water goes only moves the puddle.",
    fix:
      "Bringing in fill or topsoil, spreading it, and grading it so it ties into the rest of the yard and still sheds water away from the house.",
    visit:
      "How low it sits, where water goes now, and how a truck can get the dirt to it.",
    serviceSlug: "excavation",
    service: "Excavation & Grading",
    note: "Part of my yard sits low and needs building up. It's about ",
  },

  // ── Something to dig or build ───────────────────────────────────────────
  {
    id: "pool-dig",
    group: "Something to dig or build",
    label: "We're putting in a pool and need the dig",
    question: "Who digs the hole for an in-ground pool?",
    cause:
      "It depends on the pool builder. Some bring their own excavator; others have the dig and the haul-off done separately. Either way, the dirt has to go somewhere, and the machine has to get to the backyard.",
    fix:
      "Clearing the way in, digging to the builder's layout and depths, and trucking the spoils off, then backfill and a final grade when the builder is ready.",
    visit:
      "The layout, how a machine gets to the backyard, what's in the footprint, and where the trucks can load.",
    serviceSlug: "pools-and-ponds",
    service: "Pool & Pond Prep",
    note: "We're putting in a pool and need the dig and the site prep. Our pool builder is ",
  },
  {
    id: "pond",
    group: "Something to dig or build",
    label: "I want a pond",
    question: "Can you dig a pond on my property?",
    cause:
      "Often it's low ground that already holds water. In the Lowcountry the water table sits close to the surface, which can help a pond hold water through a dry spell.",
    fix:
      "Digging and shaping the pond with gently sloped edges, using the spoils to build up the banks or hauling them off.",
    visit:
      "Where water already collects, how big and deep you're picturing it, and whether any of the ground could be wetland, which is worth checking before anything is dug.",
    serviceSlug: "pools-and-ponds",
    service: "Pool & Pond Prep",
    note: "I'm interested in a pond. What I'm picturing is ",
  },
  {
    id: "something-built",
    group: "Something to dig or build",
    label: "Something needs building, inside or out",
    question: "Do you build decks, fences, and built-ins?",
    cause:
      "Decks, fences, pergolas, built-ins, tile work. Jobs that need someone who will actually turn up and finish, which is most of the complaint people have about this trade.",
    fix:
      "Depends entirely on the job. Best handled by describing it and having Josiah come look rather than guessing from a list.",
    visit: "The space, what you want out of it, and what is realistic in it.",
    serviceSlug: "custom-projects",
    service: "Custom Projects",
    note: "I have a project I'd like a quote on. It's ",
  },
];

export const yardProblemGroups: YardProblemGroup[] = [
  "Lawns, beds and patios",
  "Land and trees",
  "Water and ground",
  "Something to dig or build",
];

export const findYardProblem = (id: string | null | undefined) =>
  id ? yardProblems.find((p) => p.id === id) : undefined;

/**
 * Guard rail: every problem must point at a service that actually exists, or
 * the deep link lands on a 404 and the form rejects the value. This runs at
 * module load in dev and at build time, so a typo fails the build rather than
 * reaching a customer.
 */
if (import.meta.env.DEV || import.meta.env.SSR) {
  for (const problem of yardProblems) {
    const service = services.find((s) => s.slug === problem.serviceSlug);
    if (!service) {
      throw new Error(`yard-problems: "${problem.id}" points at unknown service "${problem.serviceSlug}"`);
    }
    if (service.title !== problem.service) {
      throw new Error(
        `yard-problems: "${problem.id}" service "${problem.service}" does not match "${service.title}"`
      );
    }
  }
}

/** The situations that route to a given service — powers its FAQ block. */
export const problemsForService = (serviceSlug: string) =>
  yardProblems.filter((p) => p.serviceSlug === serviceSlug);
