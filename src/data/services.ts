import landClearing from "@/assets/services/excavation.jpg";
import landClearingSet from "@/assets/services/excavation.jpg?w=640;1024;1600&format=webp&quality=68&as=srcset";
// Josiah's own photos, sent 2026-10-09. They replaced the stock pictures these
// two slots used to carry.
import clearingCard from "@/assets/services/land-clearing-from-the-cab.jpg";
import clearingCardSet from "@/assets/services/land-clearing-from-the-cab.jpg?w=640;1024;1600&format=webp&quality=68&as=srcset";
import stumpRootBall from "@/assets/services/stump-root-ball.jpg";
import stumpRootBallSet from "@/assets/services/stump-root-ball.jpg?w=640;1024;1600&format=webp&quality=68&as=srcset";
// Stock photography: licenses and the rules for using it are in
// src/assets/stock/CREDITS.md. None of these are Firm Foundation jobs; each is
// a placeholder for one of Josiah's own photos.
import drainagePipe from "@/assets/stock/drainage-pipe.jpg";
import drainagePipeSet from "@/assets/stock/drainage-pipe.jpg?w=640;1024;1600&format=webp&quality=68&as=srcset";
import hardscapes from "@/assets/services/hardscapes.jpg";
import hardscapesSet from "@/assets/services/hardscapes.jpg?w=640;1024;1600&format=webp&quality=68&as=srcset";
import landscaping from "@/assets/services/landscaping.jpg";
import landscapingSet from "@/assets/services/landscaping.jpg?w=640;1024;1600&format=webp&quality=68&as=srcset";
// Josiah's before-and-after pairs, split out of the composites in the gallery
// so a card can show the two halves side by side with real labels.
import landscapingBefore from "@/assets/services/landscaping-before.jpg";
import landscapingBeforeSet from "@/assets/services/landscaping-before.jpg?w=480;800&format=webp&quality=68&as=srcset";
import landscapingAfter from "@/assets/services/landscaping-after.jpg";
import landscapingAfterSet from "@/assets/services/landscaping-after.jpg?w=480;800&format=webp&quality=68&as=srcset";
import hardscapesBefore from "@/assets/services/hardscapes-before.jpg";
import hardscapesBeforeSet from "@/assets/services/hardscapes-before.jpg?w=480;800&format=webp&quality=68&as=srcset";
import hardscapesAfter from "@/assets/services/hardscapes-after.jpg";
import hardscapesAfterSet from "@/assets/services/hardscapes-after.jpg?w=480;800&format=webp&quality=68&as=srcset";
// Josiah's own photo (sent 2026-10-09): a 4:3 crop of the portrait gallery
// shot, so the page's object-cover lands on the mulching head and not on the
// cab interior. Widths stop at 1200 because the crop is 1200 wide.
import forestryMulching from "@/assets/services/forestry-mulching.jpg";
import forestryMulchingSet from "@/assets/services/forestry-mulching.jpg?w=640;1024;1200&format=webp&quality=68&as=srcset";
import customProjects from "@/assets/services/custom-projects.jpg";
import customProjectsSet from "@/assets/services/custom-projects.jpg?w=640;1024;1600&format=webp&quality=68&as=srcset";

export type ServiceItem = { label: string; detail: string };

/** One of the section drawings in `ServicePlate` — see that file for why they exist. */
export type PlateId = "clearing" | "trees" | "grading" | "pools" | "drainage" | "beds" | "pavers" | "mulching";

/**
 * `core` is the five services on Josiah's own flyer and business card
 * (2026-10-17): landscaping, hardscapes, excavation, pool and pond prep, land
 * clearing. `more` is the rest of the work he takes on. Those pages are just as
 * real and indexed; they sit in the grid's sixth tile and the footer rather
 * than leading, and are never labelled "smaller" or "on request".
 */
export type ServiceTier = "core" | "more";

export type Service = {
  /** Stable key used for URLs, anchors and schema. Renaming one needs a redirect in vercel.json. */
  slug: string;
  tier: ServiceTier;
  title: string;
  /** One line for the Services menu and compact lists. */
  navBlurb: string;
  /** Undefined until we have a real photo — ServiceImage draws the service's plate instead. */
  image?: string;
  /**
   * WebP variants at 640/1024/1600 for the same photo, generated at build time
   * by vite-imagetools. `image` stays the fallback `src` so a browser without
   * WebP (or without srcset) still gets the original JPEG.
   */
  imageSrcSet?: string;
  /** Describes the photo. Only needed alongside `image`; a drawing describes itself. */
  alt?: string;
  /** A different photo for the service grid, when `image` would repeat something already on screen. */
  cardImage?: string;
  cardImageSrcSet?: string;
  cardAlt?: string;
  /**
   * The same spot before and after one of Josiah's jobs. Where it exists, the
   * service card shows the pair instead of `image`: the homepage hero already
   * shows the finished photo, and the "before" is the half that proves it.
   */
  beforeAfter?: {
    before: string;
    beforeSrcSet: string;
    after: string;
    afterSrcSet: string;
    /** One sentence for the pair, read once rather than twice. */
    alt: string;
    /** Crop focus for each half, which is narrower than the photo. */
    position?: string;
  };
  /** The section drawing. Every core service has one; it stands in for a photo we don't have yet. */
  plate?: PlateId;
  /**
   * Per-page SEO for `/services/<slug>`. Required, not optional: a dedicated
   * page per service is the single highest-value local-organic factor there is,
   * and a new service shipping without its own title and description would
   * quietly launch a page that competes with the others for nothing.
   *
   * Titles must contain "Firm Foundation" inline — `SEO.tsx` only appends the
   * site name when the title doesn't already mention the brand, so one that
   * omits it silently grows to ~90 characters.
   */
  pageTitle: string;
  pageDescription: string;
  pageKeywords: string;
  /** One-paragraph version, used on the homepage. */
  summary: string;
  /** Two-paragraph version, used on the services page. */
  description1: string;
  description2: string;
  items: ServiceItem[];
  /**
   * The choice a homeowner actually has to make — grind or pull, surface or
   * buried, full or selective. Most people don't know there is a choice, and
   * knowing it is what makes the first phone call a useful one.
   */
  approaches?: {
    title: string;
    accent: string;
    options: { name: string; detail: string; bestFor: string }[];
  };
  /**
   * What moves the price — never the price itself. Rendered as the first FAQ
   * answer on the service page. There are no numbers on this site on purpose:
   * a range Josiah hasn't set is a promise he didn't make.
   */
  priceFactors?: ServiceItem[];
  /** Overrides the default "How much does <service> cost?" — use the phrasing people search. */
  priceQuestion?: string;
  /** Service-specific questions, rendered with the yard-problem FAQ and as FAQPage schema. */
  faqs?: { question: string; answer: string }[];
};

/**
 * The one place the service list lives. The homepage, the services pages, the
 * menu, the footer, the quote form and every JSON-LD block read from here, so
 * adding or renaming a service can't leave one corner of the site
 * contradicting another.
 *
 * Order is the order it appears everywhere. Landscaping and hardscapes lead,
 * then the dirt work under them, matching the homepage H1 "Landscaping,
 * Hardscapes & Excavation" (2026-10-17). This replaced the 2026-09-29 order,
 * which led with land clearing.
 */
export const services: Service[] = [
  {
    slug: "landscaping",
    tier: "core",
    title: "Landscaping",
    navBlurb: "New beds, planting, sod, mulch and pine straw",
    plate: "beds",
    image: landscaping,
    imageSrcSet: landscapingSet,
    alt: "New mulch beds and rounded shrubs along the curved front walk of a two-story Mount Pleasant house, with a palm and an American flag by the porch",
    beforeAfter: {
      before: landscapingBefore,
      beforeSrcSet: landscapingBeforeSet,
      after: landscapingAfter,
      afterSrcSet: landscapingAfterSet,
      alt: "Before and after at a Mount Pleasant home: tired beds along the front walk, then new mulch beds and shrubs",
      position: "38% 60%",
    },
    pageTitle: "Landscaping, Mount Pleasant & Charleston SC | Firm Foundation",
    pageDescription:
      "New landscape installs in Mount Pleasant and greater Charleston, SC: beds, shrubs and trees, sod, mulch and pine straw, chosen for Lowcountry sun and salt.",
    pageKeywords:
      "landscaping Mount Pleasant SC, landscape installation Charleston SC, landscapers Mount Pleasant, sod installation Charleston SC, planting beds, shrub and tree planting, mulch and pine straw, best grass for Charleston SC, salt tolerant plants, Lowcountry landscaping",
    summary:
      "New landscape installs: beds laid out and planted, and sod laid on ground that was graded first. Every plant is picked for the sun and salt it will get.",
    description1:
      "Most yards don't need more plants. They need the right ones in the right places: shrubs that suit the sun and salt they'll get, grass only where there's light enough to grow it, and beds that tie the house to the ground around it.",
    description2:
      "Every install starts with the ground. Low spots get graded out and the soil worked before anything is planted. Shrubs and trees go in at the right depth and in the right season, and the mulch stays back from the house and off the trunks.",
    items: [
      { label: "Landscape Installs", detail: "New beds laid out and planted along the house, the walk and the yard" },
      { label: "Shrubs & Trees", detail: "Planted at the right depth and in the right season, for the sun and salt each spot gets" },
      { label: "Sod", detail: "Laid on ground that was graded and prepped first, so it roots in and water runs off" },
      { label: "Mulch & Pine Straw", detail: "Spread to the right depth and kept back from the siding and the trunks" },
      { label: "Bed Edging", detail: "A clean line between bed and lawn, so the grass stays out of the beds" },
      { label: "Yard Renovations", detail: "Tired, overgrown yards cut back, cleared out and replanted" },
      { label: "Cleanups", detail: "Leaves, overgrowth and storm debris cleared and hauled off" },
    ],
    approaches: {
      title: "Lawn where it grows,",
      accent: "beds where it won't",
      options: [
        {
          name: "Sod",
          detail:
            "A finished lawn the day it goes down, on ground that was graded and prepped first. It needs real sun: even the shade-tolerant grasses want 4 to 6 hours of direct light a day.",
          bestFor: "Open, sunny ground you walk and play on",
        },
        {
          name: "Planted beds",
          detail:
            "Shrubs, trees and groundcover in mulched beds, each plant picked for how much sun, salt and water that spot gets.",
          bestFor: "Along the house and the walk, and anywhere grass struggles",
        },
        {
          name: "Pine straw or mulch",
          detail:
            "Under big oaks, grass is usually a losing fight. A clean bed of pine straw or mulch goes over the roots instead, with no new soil piled on them.",
          bestFor: "Shade under big live oaks",
        },
      ],
    },
    priceFactors: [
      { label: "How much ground", detail: "The size of the beds and the lawn, and how much of the yard they cover." },
      { label: "What goes in", detail: "How many plants and how big they are, and which grass. A few large shrubs and trees are a different job from a bed of small ones." },
      { label: "What comes out first", detail: "Old shrubs, dead grass and years of broken-down mulch, cleared and hauled off before anything new goes in." },
      { label: "Getting the ground ready", detail: "Grading out low spots, and bringing in soil where the yard needs it." },
      { label: "Access", detail: "Whether a machine can reach the work, or soil and mulch go in by wheelbarrow." },
    ],
    faqs: [
      {
        question: "What grass grows best in Charleston?",
        answer:
          "Sun decides most of it. Clemson Extension rates St. Augustine and zoysia excellent in shade, though both still need 4 to 6 hours of direct sun a day. Centipede is the low-upkeep grass for open sun, but it handles salt and foot traffic poorly. Bermuda stands up to wear and salt but needs full sun. Under 4 hours of sun, Clemson says it's too shady for grass to grow well.",
      },
      {
        question: "When is the best time to lay sod in Charleston?",
        answer:
          "Spring or fall. Clemson Extension says sod is best laid in mid to late spring or in the fall, and in the fall early enough for it to root before cold weather. Summer sod can work, but it takes a lot of water. Sod laid in winter may or may not survive, depending on the temperatures.",
      },
      {
        question: "How deep should mulch or pine straw be?",
        answer:
          "About 2 to 3 inches for pine straw and the finer bark mulches, according to Clemson Extension, and up to 4 for coarse pine bark nuggets. Keep it 2 to 3 inches back from shrub stems and tree trunks, and 6 to 12 inches back from the house, because termite treatments are applied to the soil there. On a slope, pine straw stays put better: large bark nuggets can float off in a heavy rain.",
      },
      {
        question: "When should shrubs and trees be planted here?",
        answer:
          "Fall. Clemson Extension calls it the best season to plant shrubs in South Carolina, because the roots keep growing through the cooler months. Depth matters as much as timing: a plant goes no deeper than its root ball, and in poorly drained or compacted ground Clemson sets the top of the root ball 2 to 4 inches above the surrounding soil. Planting too deep is one of the most common and serious mistakes it lists.",
      },
      {
        question: "What plants hold up to salt spray?",
        answer:
          "Clemson Extension's list for the South Carolina coast rates live oak, magnolia, yaupon holly, southern wax myrtle, sabal palmetto, pittosporum and oleander as highly salt tolerant: they grow where they take direct salt spray. Plants rated moderate do best sheltered behind those, a building or a dune. For lawns, Clemson rates centipede poorly for salt and calls Bermuda a good choice for oceanfront property.",
      },
    ],
  },
  {
    slug: "hardscapes",
    tier: "core",
    title: "Hardscapes",
    navBlurb: "Paver patios, walkways and retaining walls",
    plate: "pavers",
    priceQuestion: "How much does a paver patio cost?",
    image: hardscapes,
    imageSrcSet: hardscapesSet,
    alt: "A flagstone walkway set in pea gravel, curving through new sod to a front porch, beside a freshly mulched bed and a small red-leafed tree",
    beforeAfter: {
      before: hardscapesBefore,
      beforeSrcSet: hardscapesBeforeSet,
      after: hardscapesAfter,
      afterSrcSet: hardscapesAfterSet,
      alt: "Before and after beside a front porch: a bare strip of dirt, then a flagstone walkway set in new sod",
      position: "45% 60%",
    },
    pageTitle: "Paver Patios & Retaining Walls, Mount Pleasant | Firm Foundation",
    pageDescription:
      "Paver patios, flagstone and gravel walkways and retaining walls in Mount Pleasant and greater Charleston, SC, built on a base dug out and compacted first.",
    pageKeywords:
      "paver patio Mount Pleasant SC, paver patio Charleston SC, hardscapes Charleston SC, flagstone walkway, gravel patio, retaining wall Mount Pleasant SC, paver base, sinking pavers, patio contractor Lowcountry",
    summary:
      "Paver patios, flagstone and gravel walkways, and retaining walls, built on a base that's dug out and compacted before anything goes on top.",
    description1:
      "A patio is only as good as what's under it. When pavers sink, the cause is usually underneath. The base was too thin or never compacted, or it went down over roots that rotted and settled.",
    description2:
      "The digging comes first. Utilities get marked through SC811 before any of it. Then the ground is dug out and cleared of roots, and the stone base goes down in compacted layers before a single paver or stone is set. Walls get gravel and a drain behind them, because water trapped behind a wall adds pressure it wasn't built to hold.",
    items: [
      { label: "Paver Patios", detail: "Laid on a dug-out, compacted stone base, with an edge that holds them in place" },
      { label: "Walkways & Paths", detail: "Pavers, flagstone or gravel, from the drive to the door or across the yard" },
      { label: "Retaining Walls", detail: "Block walls with gravel and a drain behind them, for slopes and raised beds" },
      { label: "Fire-Pit Areas", detail: "A level, compacted pad with room to sit around it" },
      { label: "Steps", detail: "Set into a slope, or up to a patio or porch" },
      { label: "Gravel Patios", detail: "A compacted base and a firm edge, so the stone stays where it's put" },
      { label: "Base & Excavation", detail: "The digging, grading and compaction under all of it" },
    ],
    approaches: {
      title: "Pavers, stone,",
      accent: "or gravel",
      options: [
        {
          name: "Pavers",
          detail:
            "Concrete pavers on a compacted stone base and a thin bed of sand, locked in by an edge restraint. The surface can flex a little without cracking, and a section that settles can be lifted and reset.",
          bestFor: "Patios and walkways you use every day",
        },
        {
          name: "Flagstone",
          detail:
            "Natural stone, set dry in gravel or sand, or mortared onto a concrete slab. Set dry, it drains and can be re-leveled. Mortared, it's firmer underfoot, but only as sound as the slab under it.",
          bestFor: "Walkways and garden paths with a natural look",
        },
        {
          name: "Gravel",
          detail:
            "A compacted base with gravel on top and a firm edge to hold it. The simplest of the three and the easiest to change later, though it shifts underfoot and needs topping up.",
          bestFor: "Side yards, paths and fire-pit areas",
        },
      ],
    },
    priceFactors: [
      { label: "Size and shape", detail: "The square footage, and how many curves and cuts it takes. Straight edges go faster than curves." },
      { label: "The material", detail: "Pavers, natural stone or gravel, and the pattern they're laid in." },
      { label: "What's underneath", detail: "How much soil comes out, how much stone base goes in, and whether wet ground calls for a thicker base." },
      { label: "What's there now", detail: "An old patio, roots or a stump in the footprint, all taken out before the base goes in." },
      { label: "Walls and steps", detail: "How long and how tall. A taller wall needs an engineered design." },
      { label: "Access", detail: "Getting a machine, stone and pavers to the back yard." },
    ],
    faqs: [
      {
        question: "How deep should the base be under a paver patio?",
        answer:
          "At least 4 inches of compacted stone base under a patio or walkway on well-drained soil, and 6 under a residential driveway, by the construction guide of the Concrete Masonry & Hardscapes Association (CMHA Tech Note PAV-TEC-002). Ground that stays wet or soft needs more. The base goes down in compacted layers with about an inch of bedding sand on top, and that sand is never used to make up for an uneven base.",
      },
      {
        question: "Do I need an engineer for a retaining wall?",
        answer:
          "Past a certain height, yes. The residential building code requires an engineered design for a wall that holds back more than 48 inches of earth (the difference in ground level from one side to the other) without support at the top, or for one over 24 inches that also carries loads besides the soil behind it, such as a driveway above it (IRC R404.4). A town or an HOA can add rules of its own.",
      },
      {
        question: "Why do retaining walls lean or fail?",
        answer:
          "Often, water. The industry's best-practices guide for block retaining walls (CMHA) calls poor water management a frequent source of problems in any retaining wall: water trapped behind a wall adds pressure it wasn't designed to take. So a block wall gets at least 12 inches of gravel behind it, a drain pipe at the base to carry the water out, and a first course set below grade on a compacted pad.",
      },
      {
        question: "Do I need a permit for a patio in Mount Pleasant?",
        answer:
          "It can. The Town requires its stormwater management and tree preservation permit before land on a single-family lot is graded or otherwise disturbed, applied for along with a building permit. The Town counts a patio as impervious ground cover, and in the Old Village an overlay district caps impervious surface at 40 percent of the lot. The Town's Engineering and Environmental Division takes questions at (843) 884-8517.",
      },
      {
        question: "Can a patio go under a big oak?",
        answer:
          "Carefully, and not always. Digging and compacting a base is exactly what hurts trees: Clemson Extension names soil compaction, grade changes and cut roots as the three main causes of tree death during construction, and advises keeping equipment out beyond the drip line. Near a tree worth keeping, the patio's footprint and base get planned around the roots, and an arborist's opinion is worth having first.",
      },
    ],
  },
  {
    slug: "excavation",
    tier: "core",
    title: "Excavation & Grading",
    navBlurb: "The dirt work under every patio, pool, bed and drive",
    plate: "grading",
    // Josiah's own machine. It was a stock photo of a Texas subdivision until
    // 2026-10-17, so the hero's "Excavation" tile, which shows this machine,
    // landed on a different one.
    image: landClearing,
    imageSrcSet: landClearingSet,
    alt: "Firm Foundation's tracked excavator at work on a Lowcountry site, with felled timber behind it",
    pageTitle: "Excavation & Grading, Mount Pleasant SC | Firm Foundation",
    pageDescription:
      "Grading, site prep, patio and walkway bases, pads, gravel drives, fill and trenching in Mount Pleasant and Charleston, SC. Utilities marked through SC811 first.",
    pageKeywords:
      "excavation Mount Pleasant SC, grading contractor Charleston SC, site prep, yard grading, patio base excavation, pool site prep, building pad, shed pad prep, gravel driveway, fill dirt Mount Pleasant, trenching, SC811",
    summary:
      "The dirt work under everything else: grading, site prep, bases for patios and walkways, pads and driveways, set so the ground sits level and water runs where it should.",
    description1:
      "Everything built outside sits on dirt that someone graded, or didn't. A patio on a soft base shifts. A pad that wasn't compacted settles. A driveway without a crown washes out. A yard that falls toward the house puts water against the foundation. Our excavation work is getting that ground right before anything goes on top of it.",
    description2:
      "This is the work Firm Foundation was built on, and it sits under nearly everything else we do: the base under a patio, the grade under a new bed, the dig for a pool. Josiah grew up running a tractor alongside his Uncle Donnie, and that same dirt work is what we bring to every job today. We locate utilities through SC811 before any digging starts.",
    items: [
      { label: "Yard Grading & Leveling", detail: "Low spots filled and slopes corrected so the yard drains and mows level" },
      { label: "Site Prep", detail: "Ground cleared, cut and filled to the grade the next trade needs" },
      { label: "Patio & Walkway Bases", detail: "Dug out and compacted so the stone or pavers on top stay where they're set" },
      { label: "Bed & Planting Prep", detail: "Ground cut, shaped and graded before the beds and sod go in" },
      { label: "Driveway Prep & Gravel Drives", detail: "Cut, crowned and based so the stone stays where it's put" },
      { label: "Shed & Equipment Pads", detail: "Level, compacted pads that shed water instead of sitting in it" },
      { label: "Trenching", detail: "Trenches for drain lines and conduit, backfilled and packed" },
      { label: "Fill Dirt & Topsoil", detail: "Brought in, spread and graded" },
      { label: "Haul-Off", detail: "Spoils loaded out so the site is clean when we leave" },
    ],
    priceFactors: [
      { label: "How much dirt moves", detail: "The volume cut from the high spots and filled into the low ones." },
      { label: "What comes in", detail: "Fill, stone or topsoil trucked to the site." },
      { label: "What goes out", detail: "Spoils that have to be loaded and hauled away." },
      { label: "Access", detail: "How easily a machine and a truck can reach the work." },
      { label: "The finish", detail: "A rough grade, or a finish grade ready for sod or stone." },
    ],
    faqs: [
      {
        question: "Do you call 811 before digging?",
        answer:
          "Yes. South Carolina puts that on whoever does the digging: notice goes in 3 to 12 working days before work starts, and it is free (S.C. Code §58-36-60). 811 only marks public lines up to the meter, so tell us about anything private: irrigation, a gas line to a pool heater, power run out to a shed.",
      },
      {
        question: "How much should the yard slope away from the house?",
        answer:
          "The residential building code's minimum is 6 inches of fall within the first 10 feet out from the foundation (IRC R401.3). Where the lot is too tight or too flat to get that, a swale or a drain has to carry the water away instead.",
      },
      {
        question: "Do I need a permit to grade my lot?",
        answer:
          "In Mount Pleasant, clearing, excavating or filling a lot needs a zoning permit first (Zoning Code §156.1171), and unincorporated Charleston County requires a stormwater permit once land disturbance passes 5,000 square feet. Near the marsh, state stormwater rules can apply to jobs well under an acre.",
      },
    ],
  },
  {
    slug: "pools-and-ponds",
    tier: "core",
    priceQuestion: "How much does a pool dig or a pond cost?",
    title: "Pool & Pond Prep",
    navBlurb: "Site prep for pools and ponds, from access to final grade",
    plate: "pools",
    // No photo on purpose: the only licensed one was a reservoir-scale dig in
    // the Netherlands, the wrong scale for a backyard pool. The section
    // drawing leads until Josiah has a photo of one of his own digs.
    pageTitle: "Pool & Pond Prep, Mount Pleasant & Charleston | Firm Foundation",
    pageDescription:
      "Site prep for in-ground pools and ponds in Mount Pleasant and Charleston, SC: access, clearing the footprint, the dig, haul-off, backfill and final grade.",
    pageKeywords:
      "pool site prep Charleston SC, pool excavation Mount Pleasant, pool dig, pool backfill and grading, pond digging Charleston SC, pond excavation Lowcountry, spoils haul-off, backyard pond",
    summary:
      "The ground work around a pool or a pond: a way in, the footprint cleared, the dig to plan, the spoils hauled off, and the backfill and final grade after.",
    description1:
      "A pool starts as a hole in the ground and a lot of dirt that has to go somewhere. We handle the ground work around it: clearing the way in and the footprint, digging to the builder's layout, getting the spoils off the property, and coming back for backfill and final grade once the shell is in.",
    description2:
      "Ponds are their own kind of dig. In the Lowcountry the water table often sits close to the surface, which can help a pond and complicate a pool. We look at that on the first visit, before anyone commits to a shape.",
    items: [
      { label: "Access & Site Prep", detail: "A path in for the machine cleared before dig day" },
      { label: "Clearing the Footprint", detail: "Trees, stumps and roots out of the way first" },
      { label: "Pool Excavation", detail: "Dug to the pool builder's layout and depths" },
      { label: "Pond Excavation", detail: "Dug and shaped, with the spoils used to build up the banks or hauled off" },
      { label: "Spoils Haul-Off", detail: "Dirt loaded out, or spread and graded on site where there's room" },
      { label: "Backfill & Final Grade", detail: "Graded so water runs away from the pool once the builder is done" },
    ],
    approaches: {
      title: "A pool dig,",
      accent: "or a pond",
      options: [
        {
          name: "Pool dig",
          detail: "Precise work: the pool builder sets the layout and depths, we dig to them and get the dirt gone.",
          bestFor: "In-ground pools, alongside your pool builder",
        },
        {
          name: "Pond",
          detail: "Shaped to the land: where water already collects, how deep it needs to be, and where the spoils go.",
          bestFor: "Larger lots, and low ground that already holds water",
        },
      ],
    },
    priceFactors: [
      { label: "Size and depth", detail: "How much ground comes out of the hole." },
      { label: "Where the dirt goes", detail: "Trucking spoils away is often the biggest part of a pool dig." },
      { label: "Access", detail: "How a machine gets to the backyard, and how tight the path is." },
      { label: "Groundwater", detail: "Digging near the water table can mean pumping water out as you go." },
      { label: "Clearing first", detail: "Trees or stumps sitting in the footprint." },
    ],
    faqs: [
      {
        question: "Do you work directly with pool builders?",
        answer:
          "Yes. Send the layout and depths and we dig to them, haul the spoils, and come back for backfill and final grade when the shell is in and the builder is ready.",
      },
      {
        question: "Why does groundwater matter for a pool dig?",
        answer:
          "In much of the Lowcountry the water table sits only a few feet down. A dig that goes below it can take on water as it goes, which means pumping, and it is something the pool builder designs the shell around. Better found on the first visit than on dig day.",
      },
      {
        question: "Do I need a permit to dig a backyard pond?",
        answer:
          "Not from the state's dam-safety program, which only reaches dams 25 feet or taller or ponds holding back 50 acre-feet or more (S.C. Code §49-11-120). A pond still needs the local clearing, grading and stormwater permits any other dig would, and a federal permit if it is dug in a wetland. SCDNR notes a pond sited entirely on upland needs no Army Corps permit.",
      },
      {
        question: "How deep should a pond be?",
        answer:
          "Coastal ponds are usually dug down into the groundwater rather than held back by a dam, and Clemson Extension puts them at typically 4 to 6 feet deep. A pond meant for fish wants more: SCDNR suggests 5 to 10 feet at the deepest point.",
      },
    ],
  },
  {
    slug: "land-clearing",
    tier: "core",
    priceQuestion: "How much does it cost to clear a lot?",
    title: "Land Clearing",
    navBlurb: "Backyards, lots and fence lines, cleared and cleaned up",
    plate: "clearing",
    pageTitle: "Land Clearing, Mount Pleasant & Charleston SC | Firm Foundation",
    pageDescription:
      "Backyard, lot and underbrush clearing in Mount Pleasant and Charleston, SC. The good trees stay, stumps come out, and debris is hauled off or mulched in place.",
    pageKeywords:
      "land clearing Mount Pleasant SC, lot clearing Charleston SC, backyard clearing, overgrown yard clearing, underbrush clearing, selective clearing, brush removal, clearing for a pool or shed, stump removal, debris haul-off",
    image: clearingCard,
    imageSrcSet: clearingCardSet,
    alt: "From the excavator cab: the bucket working a pile of roots and brush across a cleared tract",
    summary:
      "Overgrown backyards, lots and fence lines cleared down to usable ground, with the trees worth keeping left standing and the brush hauled off or mulched in place.",
    description1:
      "Most clearing in the Lowcountry isn't about flattening everything. It's about getting back ground the undergrowth took: a back corner gone to vines and sweetgum, a lot that has to open up before a build, room for a pool or a shed, a fence line nobody can walk anymore.",
    description2:
      "We clear with a tracked excavator, take out the brush, scrub trees and stumps, and leave the good trees standing. A backyard or a few wooded acres, it starts the same way: we walk it with you, mark what stays, and settle where the debris goes in the quote rather than after.",
    items: [
      { label: "Backyard Clearing", detail: "Overgrown corners, vines and scrub cleared so the yard is usable again" },
      { label: "Lot Clearing", detail: "A lot opened up for a new house, a driveway, or simply usable ground" },
      { label: "Room for a Pool, Shed or Patio", detail: "The footprint cleared and the stumps pulled before the next trade arrives" },
      { label: "Underbrush & Selective Clearing", detail: "Vines, briars and scrub trees out; the oaks and pines worth keeping stay" },
      { label: "Fence Lines & Access", detail: "Edges cut back so you can walk, fence or survey the line, and a way in cut for equipment" },
      { label: "Stump Removal", detail: "Stumps pulled or ground out so the ground can actually be used" },
      { label: "Debris Haul-Off", detail: "Brush, logs and stumps loaded out so the site is clean when we leave" },
      { label: "Mulching in Place", detail: "Where the ground will stay natural, brush ground into chips and left as cover instead" },
      { label: "Rough Grading After Clearing", detail: "Ruts and root holes knocked down, ground left ready for the next step" },
    ],
    approaches: {
      title: "Three ways",
      accent: "to clear ground",
      options: [
        {
          name: "Full clear",
          detail: "Everything comes out: brush, trees and stumps, down to bare, workable ground.",
          bestFor: "Pools, sheds, patios and house pads",
        },
        {
          name: "Selective clear",
          detail: "The brush and scrub trees come out. The trees you pick stay, and the machine works around their roots rather than over them.",
          bestFor: "Wooded lots and yards you want to live on",
        },
        {
          name: "Underbrush clear",
          detail: "Only the understory goes: vines, briars and saplings. The canopy overhead is left alone.",
          bestFor: "Back corners, trails and fence lines",
        },
      ],
    },
    priceFactors: [
      { label: "How thick it is", detail: "Density matters more than size. A small yard thick with vines and scrub can take longer than a bigger stretch of open pines." },
      { label: "What's on it", detail: "Brush and saplings go quickly. Big trees and stumps are what add time." },
      { label: "What stays", detail: "Clearing around keeper trees is slower, more careful work than clearing everything." },
      { label: "Where the debris goes", detail: "Loading and hauling everything off is one of the larger parts of most clearing jobs. Where the ground will stay natural, mulching the brush in place is the other option." },
      { label: "Access", detail: "Whether a machine can drive straight in, or has to come through a gate or a side yard." },
      { label: "Ground conditions", detail: "Wet Lowcountry ground sometimes means waiting for it to dry out enough to carry a machine." },
    ],
    faqs: [
      {
        question: "Do I need a permit to clear my lot in Mount Pleasant?",
        answer:
          "Usually, yes. The Town requires a zoning permit before any lot is cleared, excavated or filled (Zoning Code §156.1171), and protected trees need their own removal permit. Unincorporated Charleston County requires a stormwater permit once land disturbance passes 5,000 square feet. Rules differ town by town, so the permit question gets answered before the work is scheduled, not after.",
      },
      {
        question: "Can you clear right up to the marsh?",
        answer:
          "No. Mount Pleasant keeps a natural, undisturbed buffer landward of the state critical line, averaging 35 feet and never less than 20 (Zoning Code §§156.622–156.623), and the City of Charleston does not allow trees in its critical line buffer to be removed. The marsh itself is state critical area, and altering it needs a state permit.",
      },
      {
        question: "What if part of the property is wet?",
        answer:
          "Have it looked at before anything is cleared. Under federal rules, mechanized land clearing in a wetland can count as a regulated discharge (33 CFR 323.2), which needs a permit from the Army Corps of Engineers, Charleston District. The federal definition of a regulated wetland is being rewritten as of 2026, so on low, wet ground a wetland delineation is the safe first step.",
      },
      {
        question: "Can the brush be burned instead of hauled off?",
        answer:
          "Not in town. Mount Pleasant only allows burning inside an approved, screened, non-combustible container (Town Code §92.30), and South Carolina's open-burning rules keep land-clearing fires at least 1,000 feet from homes and public roads. On a residential lot, the brush gets hauled off, or mulched in place where the ground will stay natural.",
      },
      {
        question: "Will the town pick up the debris?",
        answer:
          "Not if a contractor cut it. Mount Pleasant and the City of Charleston both leave debris from hired work to the contractor to haul away, which is why where the debris goes is part of the quote from the start.",
      },
    ],
  },
  {
    slug: "tree-removal",
    tier: "more",
    title: "Tree & Stump Removal",
    navBlurb: "Trees down, stumps ground or pulled, cleanup included",
    plate: "trees",
    image: stumpRootBall,
    imageSrcSet: stumpRootBallSet,
    alt: "An excavator bucket lifting a stump out of the ground with its whole root ball, a second excavator working behind it",
    pageTitle: "Tree & Stump Removal, Mount Pleasant SC | Firm Foundation",
    pageDescription:
      "Tree removal, stump grinding and full stump and root-ball removal with an excavator, plus storm cleanup, in Mount Pleasant and greater Charleston, SC.",
    pageKeywords:
      "tree removal Mount Pleasant SC, stump removal Charleston SC, stump grinding, root ball removal, storm cleanup, fallen tree removal, Lowcountry tree removal",
    summary:
      "Trees taken down and cleaned up, stumps ground below the surface or pulled out by the roots, and every limb hauled off.",
    description1:
      "A tree that has to come out is rarely standing somewhere convenient. It leans toward the house, it's over the fence, or it came down in the last storm. We take it down, clean up every limb, and deal with the stump properly instead of leaving a trip hazard behind.",
    description2:
      "Because we run an excavator, a stump doesn't have to stop at grinding. Where the ground will be dug, built on or regraded, we pull the stump and root ball out entirely and backfill the hole so it doesn't sink later.",
    items: [
      { label: "Tree Removal", detail: "Unwanted, dead, leaning or storm-damaged trees taken down and cleaned up" },
      { label: "Stump Grinding", detail: "Ground below the surface so you can plant, sod or mow over it" },
      { label: "Stump & Root-Ball Removal", detail: "Pulled out entirely with the excavator where the ground will be dug or built on" },
      { label: "Storm Cleanup", detail: "Downed trees and limbs cut up and cleared after a blow" },
      { label: "Limb Removal", detail: "Limbs off the roof and back from the house, deadwood out" },
      { label: "Haul-Off", detail: "Logs, limbs and grindings loaded out and gone" },
    ],
    approaches: {
      title: "Grind the stump,",
      accent: "or pull it out",
      options: [
        {
          name: "Grind it",
          detail: "The stump is ground down below the surface and the hole filled. Quick and tidy; the roots are left to rot in place.",
          bestFor: "Lawns and beds you'll plant over",
        },
        {
          name: "Pull it",
          detail: "The excavator lifts the stump and its root ball out whole, and the hole is backfilled and packed.",
          bestFor: "Anywhere you'll dig, pour, or build",
        },
      ],
    },
    priceFactors: [
      { label: "Size of the tree", detail: "Height and trunk thickness decide how much work it is to bring down and cut up." },
      { label: "What's underneath it", detail: "Open ground is one job. A roof, a fence or a driveway underneath is a slower one." },
      { label: "Stumps", detail: "How many, how big, and whether they're ground or pulled." },
      { label: "Access", detail: "Whether equipment can reach the tree, or everything is carried out by hand." },
      { label: "Haul-off", detail: "Whether the wood leaves the property or stays as firewood." },
    ],
    faqs: [
      {
        question: "Do I need a permit to take down a tree in Mount Pleasant?",
        answer:
          "Often, yes. On a single-family lot the Town protects most trees 16 inches or more across, measured 4.5 feet off the ground (Zoning Code Table 156.702-2), and any live oak of 24 inches or more is a historic tree. Pines are exempt below 24 inches, and so are sweet gum, Leyland cypress, Chinese tallow and a handful of other species. Fines can land on the homeowner and on whoever does the cutting (§156.709), so it is worth checking before anything comes down. The Town has the final word: trees@tompsc.com or (843) 884-1229.",
      },
      {
        question: "What are the tree rules elsewhere around Charleston?",
        answer:
          "Each town sets its own line. The City of Charleston, which covers West Ashley, Daniel Island and parts of James and Johns Island, regulates grand trees of 24 inches and up, not counting pines and sweet gums. The Town of James Island draws the line at 18 inches, Isle of Palms reviews most trees over 8 inches, and Sullivan's Island protects trees from 6 inches. These change, so the town is always the one to confirm with.",
      },
      {
        question: "A storm damaged a tree. Can it come down right away?",
        answer:
          "A dead, diseased or hazardous tree can usually be approved for removal, sometimes with an arborist's letter, and after a declared emergency Mount Pleasant can waive the process for fallen and severely damaged trees (§156.704). Take photos before anything is cut: you may be asked to document it afterwards.",
      },
    ],
  },
  {
    slug: "drainage",
    tier: "more",
    title: "Drainage",
    navBlurb: "French drains, swales, ditches and culverts",
    plate: "drainage",
    image: drainagePipe,
    imageSrcSet: drainagePipeSet,
    alt: "A mini excavator next to a coil of perforated drain pipe",
    pageTitle: "Drainage & French Drains, Mount Pleasant | Firm Foundation",
    pageDescription:
      "French drains, swales, regrading, ditch and culvert work for yards that hold water in Mount Pleasant and Charleston, SC, planned around the high water table.",
    pageKeywords:
      "yard drainage Mount Pleasant SC, French drain installation Charleston SC, standing water in yard, swale, regrading, ditch cleanout, culvert, drainage contractor Lowcountry",
    summary:
      "French drains, swales, ditches and culverts for ground that holds water, planned around the Lowcountry's high water table rather than in spite of it.",
    description1:
      "Standing water, a soggy side yard, water running toward the house: in the Lowcountry these usually come down to grade, and nowhere for the water to go. Our drainage work gives it somewhere to go, whether that's regrading, swales, French drains, or clearing the ditches and culverts that should have been carrying it all along.",
    description2:
      "Drainage here has to be planned around a high water table. A trench that fills from below solves nothing, so every drainage job starts with where the water comes from, where it can leave, and how much fall there is between the two.",
    items: [
      { label: "French Drains", detail: "Perforated pipe in washed stone and fabric, carrying water somewhere it can leave" },
      { label: "Swales & Regrading", detail: "Shallow channels shaped into the ground so surface water moves on its own" },
      { label: "Ditch & Culvert Work", detail: "Clogged ditches cleaned out and culverts cleared or set so storm water can move" },
      { label: "Downspout & Surface Drain Lines", detail: "Roof water piped away from the foundation instead of dumped beside it" },
      { label: "Driveway Drainage", detail: "Crowns, side ditches and crossings for drives that wash out" },
      { label: "Low-Spot Correction", detail: "Pockets that hold water filled and regraded" },
    ],
    approaches: {
      title: "On the surface,",
      accent: "or under it",
      options: [
        {
          name: "Swale or regrade",
          detail: "Reshape the surface so water runs off on its own. Nothing buried, so nothing to clog.",
          bestFor: "Ground with some fall to work with",
        },
        {
          name: "French drain",
          detail: "A buried channel of stone and perforated pipe that collects water and carries it away.",
          bestFor: "Wet spots with nowhere to run on the surface",
        },
      ],
    },
    priceFactors: [
      { label: "Length of the run", detail: "How far the water has to be carried." },
      { label: "Depth and outlet", detail: "How far it is to somewhere the water can actually leave." },
      { label: "Materials", detail: "Pipe, stone, fabric and any catch basins." },
      { label: "What's in the way", detail: "Fences, drives, beds and roots between the problem and the outlet." },
      { label: "Putting it back", detail: "Restoring the lawn and beds the trench crosses." },
    ],
    faqs: [
      {
        question: "Why do French drains fail here?",
        answer:
          "Usually because the water had nowhere to go. A drain needs an outlet lower than the problem, and with a high water table a trench dug too deep simply fills from below. Filter fabric matters too: without it, sandy soil washes into the stone and clogs it over time.",
      },
      {
        question: "Can I drain my yard onto the neighbor's?",
        answer:
          "Not as concentrated runoff. Mount Pleasant's single-family stormwater guidance says runoff cannot be concentrated onto lower neighboring property, and downspouts cannot discharge within 10 feet of a shared property line. Drainage has to end somewhere it is allowed to: a ditch, a storm drain, or ground that can take it.",
      },
    ],
  },
  {
    slug: "forestry-mulching",
    tier: "more",
    title: "Forestry Mulching",
    navBlurb: "Brush and small trees ground in place, nothing hauled off",
    plate: "mulching",
    image: forestryMulching,
    imageSrcSet: forestryMulchingSet,
    alt: "From the cab of a forestry mulcher: the mulching head over a fresh layer of wood chips, with tall pines standing beyond it",
    pageTitle: "Forestry Mulching, Mount Pleasant & Charleston | Firm Foundation",
    pageDescription:
      "Forestry mulching in Mount Pleasant and Charleston, SC: brush, vines and small trees ground in place and left as cover. Nothing to haul off, nothing to burn.",
    pageKeywords:
      "forestry mulching Charleston SC, forestry mulching Mount Pleasant, brush mulching, underbrush mulching, land clearing without hauling, mulching overgrown land, trail clearing, fence line clearing, Lowcountry forestry mulching",
    summary:
      "Brush, vines and small trees ground up where they stand and left on the ground as a layer of wood chips: nothing to haul off, nothing to burn.",
    description1:
      "Some ground doesn't need to be stripped bare. It needs the thicket gone: the vines, briars and sweetgum saplings that make a back lot or a wooded edge impossible to walk. A forestry mulcher grinds that growth where it stands and leaves it on the ground as chips.",
    description2:
      "Mulching suits ground that will stay natural: a wooded lot you want open underneath, a trail, a fence line. It isn't the right tool for ground that's about to be built on or sodded, because the chips and the stumps stay behind. We'll tell you which one your ground needs on the first visit.",
    items: [
      { label: "Underbrush Mulching", detail: "Vines, briars and saplings ground down under the trees you're keeping" },
      { label: "Overgrown Lots & Back Corners", detail: "Ground that has gone to thicket opened up and left walkable" },
      { label: "Trails & Paths", detail: "A way through the woods cut and mulched" },
      { label: "Fence Lines & Edges", detail: "Property lines ground back so you can walk, fence or survey them" },
      { label: "Small Trees & Saplings", detail: "Brought down and ground in place, with the stumps left in the ground" },
      { label: "Mulch Left as Cover", detail: "The chips stay on the ground, covering the soil instead of leaving it bare" },
    ],
    approaches: {
      title: "Mulch it in place,",
      accent: "or clear and haul",
      options: [
        {
          name: "Mulch in place",
          detail: "The mulcher grinds brush and small trees where they stand. The chips stay on the ground as a layer of cover, and the stumps and roots stay under it.",
          bestFor: "Ground that will stay natural: wooded lots, trails, fence lines",
        },
        {
          name: "Clear and haul",
          detail: "Brush, trees and stumps come out and the debris is loaded off the property, down to bare, workable ground.",
          bestFor: "Anywhere you'll build, pour, dig or lay sod",
        },
      ],
    },
    priceFactors: [
      { label: "How thick it is", detail: "A dense thicket of vines and saplings takes longer to grind through than open ground with scattered brush." },
      { label: "Size of what's growing", detail: "Brush and saplings go quickly. The bigger the trees, the slower the work." },
      { label: "How much ground", detail: "The area to be mulched, and how much of it means working around trees you're keeping." },
      { label: "Access", detail: "Whether the machine can drive straight in, or has to come through a gate or a side yard." },
      { label: "Ground conditions", detail: "Soft, wet ground has to dry out before a machine can work it without rutting." },
    ],
    faqs: [
      {
        question: "What is forestry mulching?",
        answer:
          "One machine that cuts and cleans up at the same time. A mulching head, a spinning drum or disk fitted with teeth or blades, grinds brush, vines and small trees where they stand and leaves them on the ground as wood chips. Forest Service researchers call it mastication, and forest managers use it to grind down competing brush, free up young trees and prepare ground for new growth (USDA Forest Service, RMRS-GTR-381, 2018).",
      },
      {
        question: "Is forestry mulching better than clearing and hauling?",
        answer:
          "For some ground. Mulching leaves nothing to haul off and nothing to burn, and the chips cover the soil instead of leaving it bare. A 2018 Forest Service review of the research found ground under mulched chips lost less soil than bare ground, with erosion slight as long as the chip layer stayed (RMRS-GTR-381). The trade-off is that the chips, stumps and roots all stay too, so for anything you'll build on, pour, dig or sod, clearing and hauling is the better call.",
      },
      {
        question: "Can I lay sod or build right after forestry mulching?",
        answer:
          "Not on top of it. Clemson Extension's lawn guide calls for removing all debris from the area to be planted, large roots and old tree trunks included (HGIC 1203), and the residential building code requires vegetation and topsoil to be removed from under a concrete slab (IRC R506.2). If a lawn or a building is the plan, the stumps get pulled and the ground gets cleared properly. Mulching is for ground that will stay natural.",
      },
      {
        question: "Does forestry mulching get rid of stumps?",
        answer:
          "Not out of the ground. A mulching head leaves a stump behind, ragged or clean-cut depending on the type of head (USDA Forest Service, RMRS-GTR-381), and the roots stay where they are. Roots left in the ground can come back: sweet gum in particular regrows from its roots (USDA Forest Service, Silvics of North America). Where a stump will be in the way, it gets pulled with the excavator instead.",
      },
      {
        question: "Can you mulch on wet ground or in a wetland?",
        answer:
          "Have it looked at first. Federal rules leave out cutting vegetation above the ground, like mowing or rotary cutting, as long as it doesn't substantially disturb the root system or push soil around (33 CFR 323.2(d)(2)(ii)). Mechanized land clearing that does disturb the soil can count as a regulated discharge in a wetland, which can need an Army Corps of Engineers permit (33 CFR 323.2(d)(1)(iii)). Rutting soft ground is soil disturbance, so on low, wet ground a wetland delineation comes first, and the work waits for the ground to dry.",
      },
      {
        question: "Do I need a permit for forestry mulching in Mount Pleasant?",
        answer:
          "Treat it like any other clearing and ask before it's scheduled. The Town says clearing and grading that disturbs or alters land on a single-family lot needs its stormwater management and tree preservation permit first. Protected trees need their own approval whatever takes them down, and trees in a buffer, a critical area, an easement or a right-of-way can be protected at any size or species.",
      },
    ],
  },
  {
    slug: "custom-projects",
    tier: "more",
    title: "Custom Projects",
    navBlurb: "Decks, fences, built-ins and one-offs",
    pageTitle: "Decks, Fences & Built-Ins, Mount Pleasant | Firm Foundation",
    pageDescription:
      "Decks, fences, pergolas, built-ins, tile and finish work for homes in Mount Pleasant and greater Charleston, SC. Free on-site quotes.",
    pageKeywords:
      "deck builder Mount Pleasant SC, fence installation Charleston, pergola, custom built-ins, tile backsplash, home finish work",
    image: customProjects,
    imageSrcSet: customProjectsSet,
    alt: "Custom butler's pantry with painted cabinetry, brass hardware, patterned tile backsplash, and a quartz counter",
    summary:
      "The jobs that don't fit a category, inside or out: built-ins, tile, decks, fences, pergolas and finish carpentry.",
    description1:
      "Some projects don't fit neatly onto a service list. A butler's pantry built from scratch, a tile backsplash, a deck that needs rebuilding, a fence line that has had it. We take on the work that needs someone who will do it properly and actually finish it.",
    description2:
      "Inside or out, we work in wood, composite, tile and stone, and we stay on the job from demo through the last piece of trim.",
    items: [
      { label: "Custom Cabinetry & Built-Ins", detail: "Pantries, built-in storage, and cabinet installs finished to match the room" },
      { label: "Tile & Backsplash", detail: "Backsplashes, accent walls, and tile work cut and set by hand" },
      { label: "Finish Carpentry & Trim", detail: "Trim, molding, and the detail work that makes a room look done" },
      { label: "Deck Repair & Restoration", detail: "Replace damaged boards, reinforce framing, and refinish surfaces" },
      { label: "Fence, Gate & Pergola Work", detail: "Fix leaning posts and sagging gates, or build new fencing and shade structures" },
    ],
  },
];

/** What the business is. Leads everywhere. */
export const coreServices = services.filter((s) => s.tier === "core");
/** Work still taken on, kept off the main messaging. */
export const moreServices = services.filter((s) => s.tier === "more");

/** Plain service names, e.g. for schema and the contact form. */
export const serviceNames = services.map((s) => s.title);

export const findService = (slug: string | null | undefined) =>
  slug ? services.find((s) => s.slug === slug) : undefined;

