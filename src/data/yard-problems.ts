import { services } from "@/data/services";

/**
 * The situations a homeowner actually recognises, and what each one usually
 * turns out to be.
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
export type YardProblemGroup = "Land and trees" | "Water and ground" | "Something to dig or build";

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
  // ── Land and trees ──────────────────────────────────────────────────────
  {
    id: "overgrown",
    group: "Land and trees",
    label: "Brush and undergrowth have taken over the property",
    question: "Can you clear overgrown brush and small trees?",
    cause:
      "Lowcountry undergrowth reclaims unused ground quickly, and once sweetgum, wax myrtle and vines establish in it, clearing by hand stops being realistic.",
    fix:
      "Clearing the brush, undergrowth and small trees down to usable ground, pulling the stumps that are in the way, and hauling the debris off so you can see what you actually have.",
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
    question: "Water runs toward my house — what can be done about it?",
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
    service: "Pool & Pond Excavation",
    note: "We're putting in a pool and need the excavation. Our pool builder is ",
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
    service: "Pool & Pond Excavation",
    note: "I'm interested in a pond. What I'm picturing is ",
  },
  {
    id: "patio-or-walkway",
    group: "Something to dig or build",
    label: "I want a patio, walkway, or retaining wall",
    question: "What actually goes into building a paver patio or walkway?",
    cause:
      "The part people underestimate is that hardscape lives or dies on what is under it. A patio on a base that wasn't prepped properly moves within a couple of seasons.",
    fix:
      "Excavating and compacting a proper base first, then the paver, stone or wall work on top of it. The dirt work is most of the job, which is why we do both.",
    visit:
      "The ground under it, where water moves across the area, and how it ties into what is already there.",
    serviceSlug: "hardscapes",
    service: "Hardscapes",
    note: "I'm interested in a patio or walkway. Roughly what I have in mind is ",
  },
  {
    id: "tired-beds",
    group: "Something to dig or build",
    label: "The beds and yard look tired",
    question: "Can you clean up and re-mulch tired beds?",
    cause:
      "Usually maintenance rather than anything structural: beds that have lost their edge, mulch that has broken down, plantings that have outgrown their spot.",
    fix:
      "Re-cutting and re-mulching the beds, cleaning up plantings, and putting the yard back into a shape that is easy to keep.",
    visit:
      "What is worth keeping, what has outgrown its place, and how much upkeep you actually want to be doing.",
    serviceSlug: "landscaping",
    service: "Landscaping",
    note: "My beds and yard need cleaning up. What I'm after is ",
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
  "Land and trees",
  "Water and ground",
  "Something to dig or build",
];

/**
 * What the HOMEPAGE shows — six, chosen, not filtered.
 *
 * The triage earns its place on the homepage only where a homeowner genuinely
 * can't name the job: that the good trees can stay while the thicket goes,
 * that a stump can be pulled rather than ground, that a pool builder may not
 * do the dig, that standing water is a grade problem. "A tree needs to come
 * down" and "I want a patio" are things people already know how to ask for, so
 * there the tool would be a menu, not a diagnosis — and every row is a row of
 * scrolling on the page whose only job is to get someone to call.
 *
 * Nothing left off is lost: every problem renders on the service page it
 * routes to, as prose and as `FAQPage` schema.
 */
const HOMEPAGE_IDS = [
  "overgrown",
  "keep-good-trees",
  "stumps",
  "pool-dig",
  "standing-water",
  "water-toward-house",
];

export const homepageProblems = HOMEPAGE_IDS.map(
  (id) => yardProblems.find((p) => p.id === id)!
);

export const findYardProblem = (id: string | null | undefined) =>
  id ? yardProblems.find((p) => p.id === id) : undefined;

/**
 * Guard rail: every problem must point at a service that actually exists, or
 * the deep link lands on a 404 and the form rejects the value. This runs at
 * module load in dev and at build time, so a typo fails the build rather than
 * reaching a customer.
 */
if (import.meta.env.DEV || import.meta.env.SSR) {
  for (const id of HOMEPAGE_IDS) {
    if (!yardProblems.some((p) => p.id === id)) {
      throw new Error(`yard-problems: homepage lists unknown problem "${id}"`);
    }
  }
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
