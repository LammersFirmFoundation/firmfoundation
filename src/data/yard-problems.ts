import { services } from "@/data/services";

/**
 * The symptoms a homeowner actually recognises, and what each one usually
 * turns out to be.
 *
 * This exists because the real barrier to someone calling is not that they
 * don't trust Josiah — it's that they cannot name their own problem. They know
 * "the side yard is swampy and mulch keeps washing into the driveway." They
 * don't know that's grading, that it's fixable, or what fixing it involves. So
 * they put it off.
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
 *    straight into the contact form's service dropdown — a value that isn't in
 *    `serviceNames` would fail validation on arrival.
 *
 * `note` is what lands in the message box. It is written in the first person,
 * as the customer, because that is who is sending it — and it is deliberately
 * a starting point they can edit rather than a finished description.
 */
export type YardProblemGroup = "Water and ground" | "Trees and growth" | "Something you want built";

export type YardProblem = {
  /** Stable id — used in the deep link, so it must not change casually. */
  id: string;
  group: YardProblemGroup;
  /** The symptom, in the words someone would use out loud. */
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
  /** What Josiah would want to see standing in the yard. */
  visit: string;
  /** Slug of the service page this routes to. */
  serviceSlug: string;
  /** Must be one of `serviceNames` — it is posted into the form's dropdown. */
  service: string;
  /** Seeds the contact form's message box. First person, editable. */
  note: string;
};

export const yardProblems: YardProblem[] = [
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
    serviceSlug: "excavation",
    service: "Excavation",
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
      "A French drain to give the water a path out, or regrading to remove the pocket. Drainage here has to be planned around the high water table — a trench that fills from below solves nothing.",
    visit:
      "How long it holds water, what feeds it, and whether there is anywhere lower to run a drain to.",
    serviceSlug: "excavation",
    service: "Excavation",
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
      "Re-establishing fall away from the foundation, and drainage to carry water to somewhere it can leave. This is the one worth looking at soonest — it is the problem that gets more expensive the longer it runs.",
    visit:
      "The grade in the first few feet out from the wall, where the downspouts discharge, and any staining that shows how high water has stood.",
    serviceSlug: "excavation",
    service: "Excavation",
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
    service: "Excavation",
    note: "My gravel driveway keeps rutting and washing out. It's roughly ",
  },
  {
    id: "need-a-pad",
    group: "Water and ground",
    label: "I need a level pad — shed, parking, equipment",
    question: "Can you prep a level pad for a shed or parking?",
    cause:
      "Not a problem so much as a job: something needs to sit on ground that is level, compacted, and drains, so it doesn't settle or sit in water later.",
    fix:
      "Clearing and grading the footprint, building a compacted base, and setting the grade so water sheds off the pad rather than sitting under whatever goes on it.",
    visit:
      "The footprint and access for equipment, what the ground is like underneath, and where water moves across that part of the property.",
    serviceSlug: "excavation",
    service: "Excavation",
    note: "I need a level pad prepped. It's for ",
  },
  {
    id: "overgrown",
    group: "Trees and growth",
    label: "Brush and undergrowth have taken over part of the yard",
    question: "Can you clear overgrown brush and small trees?",
    cause:
      "Lowcountry undergrowth reclaims unused ground quickly, and once small trees establish in it, hand clearing stops being realistic.",
    fix:
      "Clearing the brush, undergrowth and small trees, then hauling the debris off so the ground is usable and you can actually see what you have.",
    visit:
      "How much there is, what is worth keeping, and whether equipment can get to it.",
    serviceSlug: "excavation",
    service: "Excavation",
    note: "I have brush and undergrowth that's taken over part of the yard. It's about ",
  },
  {
    id: "tree-problem",
    group: "Trees and growth",
    label: "A tree needs trimming, or needs to come down",
    question: "Can you trim a tree or take one down?",
    cause:
      "Storm damage, limbs over the roof, or a tree that has simply outgrown where it was planted. Worth dealing with before hurricane season rather than after.",
    fix:
      "Trimming back what can stay, removing what can't, and grinding the stump if you want the ground back.",
    visit:
      "What is around it — roof, lines, fences — and how much room there is to work and drop limbs safely.",
    serviceSlug: "tree-services",
    service: "Tree Services",
    note: "I have a tree that needs looking at. It's ",
  },
  {
    id: "tired-beds",
    group: "Trees and growth",
    label: "The beds and yard look tired",
    question: "Can you clean up and re-mulch tired beds?",
    cause:
      "Usually maintenance rather than anything structural — beds that have lost their edge, mulch that has broken down, plantings that have outgrown their spot.",
    fix:
      "Re-cutting and re-mulching the beds, cleaning up plantings, and putting the yard back into a shape that is easy to keep.",
    visit:
      "What is worth keeping, what has outgrown its place, and how much upkeep you actually want to be doing.",
    serviceSlug: "landscaping",
    service: "Landscaping",
    note: "My beds and yard need cleaning up. What I'm after is ",
  },
  {
    id: "patio-or-walkway",
    group: "Something you want built",
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
    id: "something-built",
    group: "Something you want built",
    label: "Something needs building — inside or out",
    question: "Do you build decks, fences, and built-ins?",
    cause:
      "Decks, fences, pergolas, built-ins, tile work. Jobs that need someone who will actually turn up and finish, which is most of the complaint people have about this trade.",
    fix:
      "Depends entirely on the job. Best handled by describing it and having Josiah come look rather than guessing from a list.",
    visit:
      "The space, what you want out of it, and what is realistic in it.",
    serviceSlug: "custom-projects",
    service: "Custom Projects",
    note: "I have a project I'd like a quote on. It's ",
  },
];

export const yardProblemGroups: YardProblemGroup[] = [
  "Water and ground",
  "Trees and growth",
  "Something you want built",
];

export const findYardProblem = (id: string | null | undefined) =>
  id ? yardProblems.find((p) => p.id === id) : undefined;

/**
 * Guard rail: every problem must point at a service that actually exists, or
 * the deep link lands on a 404 and the form's dropdown rejects the value. This
 * runs at module load in dev and at build time, so a typo fails the build
 * rather than reaching a customer.
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

/** The symptoms that route to a given service — powers its FAQ block. */
export const problemsForService = (serviceSlug: string) =>
  yardProblems.filter((p) => p.serviceSlug === serviceSlug);
