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
import gradingBackyard from "@/assets/stock/grading-backyard.jpg";
import gradingBackyardSet from "@/assets/stock/grading-backyard.jpg?w=640;1024;1600&format=webp&quality=68&as=srcset";
import pondExcavation from "@/assets/stock/pond-excavation.jpg";
import pondExcavationSet from "@/assets/stock/pond-excavation.jpg?w=640;1024;1600&format=webp&quality=68&as=srcset";
import drainagePipe from "@/assets/stock/drainage-pipe.jpg";
import drainagePipeSet from "@/assets/stock/drainage-pipe.jpg?w=640;1024;1600&format=webp&quality=68&as=srcset";
import hardscapes from "@/assets/services/hardscapes.jpg";
import hardscapesSet from "@/assets/services/hardscapes.jpg?w=640;1024;1600&format=webp&quality=68&as=srcset";
import landscaping from "@/assets/services/landscaping.jpg";
import landscapingSet from "@/assets/services/landscaping.jpg?w=640;1024;1600&format=webp&quality=68&as=srcset";
import customProjects from "@/assets/services/custom-projects.jpg";
import customProjectsSet from "@/assets/services/custom-projects.jpg?w=640;1024;1600&format=webp&quality=68&as=srcset";

export type ServiceItem = { label: string; detail: string };

/** One of the section drawings in `ServicePlate` — see that file for why they exist. */
export type PlateId = "clearing" | "trees" | "grading" | "pools" | "drainage";

/**
 * `core` is what the business is: land clearing and excavation. `more` is work
 * Josiah still takes on but asked (2026-09-29) to move out of the main
 * messaging — the pages stay live, because they are indexed and they still
 * bring in jobs, but they never lead and never sit in the main grid.
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
  /**
   * A different photo for the service grid, when `image` would repeat something
   * already on screen. Land clearing uses it: its `image` is Josiah's own
   * machine, which the homepage hero already shows one screen up.
   */
  cardImage?: string;
  cardImageSrcSet?: string;
  cardAlt?: string;
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
 * Order is the order it appears everywhere. Land clearing leads because that is
 * the direction Josiah is taking the business (2026-09-29) and the headline his
 * Instagram ad now runs — "Land Clearing & Excavation" — so someone arriving
 * from that ad lands on the same words.
 */
export const services: Service[] = [
  {
    slug: "land-clearing",
    tier: "core",
    priceQuestion: "How much does it cost to clear an acre?",
    title: "Land Clearing",
    navBlurb: "Lots, underbrush and fence lines, cleared and hauled off",
    plate: "clearing",
    pageTitle: "Land Clearing, Charleston & Mount Pleasant SC | Firm Foundation",
    pageDescription:
      "Lot clearing, underbrush and selective clearing, stump removal and debris haul-off in Mount Pleasant and greater Charleston, SC. The good trees stay. Free on-site quotes.",
    pageKeywords:
      "land clearing Mount Pleasant SC, lot clearing Charleston SC, underbrush clearing, selective clearing, brush clearing, clearing for new construction, stump removal, debris haul-off, Lowcountry land clearing",
    image: landClearing,
    imageSrcSet: landClearingSet,
    alt: "Firm Foundation's tracked excavator clearing timber on a Lowcountry lot",
    cardImage: clearingCard,
    cardImageSrcSet: clearingCardSet,
    cardAlt: "From the excavator cab: the bucket working a pile of roots and brush across a cleared tract",
    summary:
      "Overgrown lots, underbrush and small trees cleared down to usable ground, with the trees worth keeping left standing and the debris hauled off.",
    description1:
      "Most clearing in the Lowcountry isn't about flattening everything. It's about getting back ground the undergrowth took: a back acre gone to vines and sweetgum, a lot that has to open up before a build, a fence line nobody can walk anymore.",
    description2:
      "We clear with a tracked excavator, take out the brush, scrub trees and stumps, and leave the good trees standing. Before a machine moves, we walk the lot with you and mark what stays, and where the debris goes is settled in the quote rather than after.",
    items: [
      { label: "Lot Clearing", detail: "Open up a lot for a new build, a pool, a driveway, or simply usable ground" },
      { label: "Underbrush & Selective Clearing", detail: "Vines, briars and scrub trees out; the oaks and pines worth keeping stay" },
      { label: "Fence-Line & Perimeter Clearing", detail: "Edges cut back so you can walk, fence, or survey the property line" },
      { label: "View & Access Clearing", detail: "Sightlines opened toward the water or the road, and a way in cut for equipment" },
      { label: "Stump Removal", detail: "Stumps pulled or ground out so the ground can actually be used" },
      { label: "Debris Haul-Off", detail: "Brush, logs and stumps loaded out so the site is clean when we leave" },
      { label: "Rough Grading After Clearing", detail: "Ruts and root holes knocked down, ground left ready for the next step" },
    ],
    approaches: {
      title: "Three ways",
      accent: "to clear a lot",
      options: [
        {
          name: "Full clear",
          detail: "Everything comes out: brush, trees and stumps, down to bare, workable ground.",
          bestFor: "House pads, pools, driveways",
        },
        {
          name: "Selective clear",
          detail: "The brush and scrub trees come out. The trees you pick stay, and the machine works around their roots rather than over them.",
          bestFor: "Wooded lots you want to live on",
        },
        {
          name: "Underbrush clear",
          detail: "Only the understory goes: vines, briars and saplings. The canopy overhead is left alone.",
          bestFor: "Reclaiming a back acre, trails, fence lines",
        },
      ],
    },
    priceFactors: [
      { label: "How thick it is", detail: "Density matters more than acreage. A quarter acre of scrub and vines can take longer than an acre of open pines." },
      { label: "What's on it", detail: "Brush and saplings go quickly. Big trees and stumps are what add time." },
      { label: "What stays", detail: "Clearing around keeper trees is slower, more careful work than clearing everything." },
      { label: "Where the debris goes", detail: "Loading and hauling everything off is one of the larger parts of most clearing jobs." },
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
          "Not in town. Mount Pleasant only allows burning inside an approved, screened, non-combustible container (Town Code §92.30), and South Carolina's open-burning rules keep land-clearing fires at least 1,000 feet from homes and public roads. On a residential lot, the debris gets hauled off.",
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
    tier: "core",
    title: "Tree & Stump Removal",
    navBlurb: "Trees down, stumps ground or pulled, cleanup included",
    plate: "trees",
    image: stumpRootBall,
    imageSrcSet: stumpRootBallSet,
    alt: "An excavator bucket lifting a stump out of the ground with its whole root ball, a second excavator working behind it",
    pageTitle: "Tree & Stump Removal, Mount Pleasant SC | Firm Foundation",
    pageDescription:
      "Tree removal, stump grinding and full stump and root-ball removal with an excavator, plus storm cleanup, in Mount Pleasant and greater Charleston, SC. Free on-site quotes.",
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
    slug: "excavation",
    tier: "core",
    title: "Excavation & Grading",
    navBlurb: "Site prep, pads, driveways and regrading",
    plate: "grading",
    image: gradingBackyard,
    imageSrcSet: gradingBackyardSet,
    alt: "A compact excavator beside a freshly graded dirt pad behind a brick house",
    pageTitle: "Excavation & Grading, Mount Pleasant SC | Firm Foundation",
    pageDescription:
      "Grading, site prep, building and shed pads, gravel driveways and trenching in Mount Pleasant and greater Charleston, SC. Utilities located through SC811 before any digging.",
    pageKeywords:
      "excavation Mount Pleasant SC, grading contractor Charleston SC, site prep, yard grading, building pad, shed pad prep, gravel driveway, trenching, fill dirt, SC811",
    summary:
      "Grading, site prep and dirt work: pads, driveways and yards set so the ground sits level and water runs where it should.",
    description1:
      "Everything built outside sits on dirt that someone graded, or didn't. A pad that wasn't compacted settles. A driveway without a crown washes out. A yard that falls toward the house puts water against the foundation. Our excavation work is getting that ground right before anything goes on top of it.",
    description2:
      "This is the work Firm Foundation was built on. Josiah grew up running a tractor alongside his Uncle Donnie, and that same dirt work is what we bring to every job today. We locate utilities through SC811 before any digging starts.",
    items: [
      { label: "Yard Grading & Leveling", detail: "Low spots filled and slopes corrected so the yard drains and mows level" },
      { label: "Site Prep", detail: "Ground cleared, cut and filled to the grade the next trade needs" },
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
    title: "Pool & Pond Excavation",
    navBlurb: "Pool digs and ponds, spoils hauled off",
    plate: "pools",
    image: pondExcavation,
    imageSrcSet: pondExcavationSet,
    alt: "An excavator beside a newly dug pond on flat open ground",
    pageTitle: "Pool & Pond Excavation, Mount Pleasant | Firm Foundation",
    pageDescription:
      "Site prep and excavation for in-ground pools and ponds in Mount Pleasant and greater Charleston, SC: access, clearing, digging to plan and spoils haul-off.",
    pageKeywords:
      "pool excavation Charleston SC, pool dig Mount Pleasant, pool site prep, pond digging Charleston SC, pond excavation Lowcountry, spoils haul-off, backyard pond",
    summary:
      "Site prep and digs for in-ground pools and ponds: a way in cleared, the ground dug to plan, the spoils hauled off, and the yard put back after.",
    description1:
      "A pool starts as a hole in the ground and a lot of dirt that has to go somewhere. We handle the part before the pool crew arrives: clearing the way in, digging to the builder's layout, and getting the spoils off the property.",
    description2:
      "Ponds are their own kind of dig. In the Lowcountry the water table often sits close to the surface, which can help a pond and complicate a pool. We look at that on the first visit, before anyone commits to a shape.",
    items: [
      { label: "Pool Excavation", detail: "Dug to the pool builder's layout and depths" },
      { label: "Access & Site Prep", detail: "A path in for the machine cleared before dig day" },
      { label: "Clearing the Footprint", detail: "Trees, stumps and roots out of the way first" },
      { label: "Spoils Haul-Off", detail: "Dirt loaded out, or spread and graded on site where there's room" },
      { label: "Pond Excavation", detail: "Dug and shaped, with the spoils used to build up the banks or hauled off" },
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
          bestFor: "Acreage, and low ground that already holds water",
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
    slug: "drainage",
    tier: "core",
    title: "Drainage",
    navBlurb: "French drains, swales, ditches and culverts",
    plate: "drainage",
    image: drainagePipe,
    imageSrcSet: drainagePipeSet,
    alt: "A mini excavator next to a coil of perforated drain pipe",
    pageTitle: "Drainage & French Drains, Mount Pleasant | Firm Foundation",
    pageDescription:
      "French drains, swales, regrading, ditch and culvert work for yards that hold water in Mount Pleasant and greater Charleston, SC. Planned around the high water table.",
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
    slug: "hardscapes",
    tier: "more",
    title: "Hardscapes",
    navBlurb: "Patios, walkways and retaining walls",
    pageTitle: "Paver Patios & Walkways, Mount Pleasant | Firm Foundation",
    pageDescription:
      "Paver patios, stone walkways and retaining walls in Mount Pleasant and greater Charleston, SC, built on a base that is excavated and compacted properly.",
    pageKeywords:
      "paver patio Mount Pleasant SC, stone walkway Charleston, retaining wall installation, hardscapes Lowcountry, outdoor living space",
    image: hardscapes,
    imageSrcSet: hardscapesSet,
    alt: "Paver patio and stone walkway installation in Mount Pleasant, SC",
    summary:
      "Patios, walkways and retaining walls, built on a base that was excavated and compacted properly first.",
    description1:
      "From patios and walkways to retaining walls and outdoor living spaces, Firm Foundation delivers durable, carefully built hardscape installations designed to hold up.",
    description2:
      "We work with pavers, natural stone and concrete. Hardscape lives or dies on what is under it, which is why the dirt work comes first.",
    items: [
      { label: "Paver Patios", detail: "Patios built on a proper excavated and compacted base" },
      { label: "Stone Walkways", detail: "Decorative walkways using natural stone and pavers" },
      { label: "Retaining Walls", detail: "Sturdy walls for erosion control and elevated landscapes" },
      { label: "Outdoor Living Spaces", detail: "Complete backyard hardscape layouts" },
    ],
  },
  {
    slug: "landscaping",
    tier: "more",
    title: "Landscaping",
    navBlurb: "Beds, mulch and planting",
    pageTitle: "Landscaping in Mount Pleasant, SC | Firm Foundation",
    pageDescription:
      "Bed installation, mulching, planting and yard cleanups across Mount Pleasant and greater Charleston, SC. Free on-site quotes.",
    pageKeywords:
      "landscaping Mount Pleasant SC, mulch installation Charleston, planting beds, sod installation, yard cleanup Lowcountry",
    image: landscaping,
    imageSrcSet: landscapingSet,
    alt: "Fresh mulch beds and seasonal plantings at a Mount Pleasant, SC home",
    summary:
      "Bed installs, fresh mulch, planting and yard cleanups, usually as the finish on a clearing or grading job.",
    description1:
      "Once the ground is right, beds and planting are what make it look finished. We cut and mulch beds, plant, lay sod and clean up yards across Mount Pleasant.",
    description2:
      "Most of our landscaping now comes at the end of bigger ground work, putting a yard back together after clearing, grading or drainage.",
    items: [
      { label: "Mulching & Bed Edging", detail: "Fresh mulch installation, crisp bed edges, and weed control" },
      { label: "Planting", detail: "Shrubs, color and bed design suited to the Lowcountry" },
      { label: "Sod", detail: "New sod laid on properly graded ground" },
      { label: "Yard Cleanups", detail: "Leaf, branch and storm cleanup" },
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

