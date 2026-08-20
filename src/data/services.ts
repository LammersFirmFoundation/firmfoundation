import excavation from "@/assets/services/excavation.jpg";
import hardscapes from "@/assets/services/hardscapes.jpg";
import landscaping from "@/assets/services/landscaping.jpg";
import treeServices from "@/assets/services/tree-services.jpg";
import customProjects from "@/assets/services/custom-projects.jpg";

export type ServiceItem = { label: string; detail: string };

export type Service = {
  /** Stable key used for anchors, schema, and image swaps. */
  slug: string;
  title: string;
  /** Undefined until we have a real photo — ServiceImage draws a branded panel instead. */
  image?: string;
  alt: string;
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
};

/**
 * The one place the service list lives. The homepage, the services page, the
 * footer, and every JSON-LD block read from here, so adding or renaming a
 * service can't leave one corner of the site contradicting another.
 *
 * Excavation leads deliberately: it's the direction the business is moving, and
 * order here is the order it appears everywhere on the site.
 */
export const services: Service[] = [
  {
    slug: "excavation",
    pageTitle: "Excavation & Grading, Mount Pleasant SC | Firm Foundation",
    pageDescription:
      "Yard grading, drainage and French drains, land clearing, driveway prep and irrigation trenching in Mount Pleasant and greater Charleston, SC.",
    pageKeywords:
      "excavation Mount Pleasant SC, yard grading, French drain installation, yard drainage, land clearing Charleston SC, irrigation trenching, driveway grading, shed pad prep, SC811",
    title: "Excavation",
    image: excavation,
    alt: "Firm Foundation's tracked excavator clearing timber on a Lowcountry site",
    summary:
      "Grading, drainage, clearing, and driveway prep for Lowcountry yards. We move dirt so water moves away from your house instead of pooling against it.",
    description1:
      "Standing water, washed-out driveways, and low spots that never dry out are a fact of life in the Lowcountry. Our excavation work fixes the ground itself — regrading yards, cutting drainage, and clearing overgrowth so water has somewhere to go.",
    description2:
      "This is the work Firm Foundation was built on. Josiah grew up running a tractor alongside his Uncle Donnie, and that same dirt work is what we bring to every grading, drainage, and clearing job today. We locate utilities through SC811 before any digging starts.",
    items: [
      { label: "Yard Grading & Leveling", detail: "Regrade low spots and slopes so water runs away from your house, not toward it" },
      { label: "Drainage & French Drains", detail: "Fix standing water and soggy yards with drainage planned around the Lowcountry's high water table" },
      { label: "Brush & Lot Clearing", detail: "Clear overgrown brush, undergrowth, and small trees to reclaim usable yard" },
      { label: "Driveway & Pad Prep", detail: "Grade and prep gravel driveways, shed pads, and small equipment pads" },
      { label: "Irrigation Trenching & Repair", detail: "Trench and set new irrigation lines, and dig up and fix broken ones" },
      { label: "Trenching & Ditch Cleanout", detail: "Trench for drain lines and clear clogged ditches and culverts so storm water can move" },
      { label: "Haul-Off & Debris Removal", detail: "Load out spoils, fill dirt, and cleared debris so the site is clean when we leave" },
    ],
  },
  {
    slug: "hardscapes",
    pageTitle: "Paver Patios & Walkways, Mount Pleasant | Firm Foundation",
    pageDescription:
      "Paver patios, stone walkways and retaining walls in Mount Pleasant and greater Charleston, SC, built on a base that is excavated and compacted properly.",
    pageKeywords:
      "paver patio Mount Pleasant SC, stone walkway Charleston, retaining wall installation, hardscapes Lowcountry, outdoor living space",
    title: "Hardscapes",
    image: hardscapes,
    alt: "Paver patio and stone walkway installation in Mount Pleasant, SC",
    summary:
      "From patios and walkways to retaining walls and outdoor living spaces, we deliver durable, beautifully crafted hardscape installations designed to enhance your property.",
    description1:
      "From patios and walkways to retaining walls and outdoor living spaces, Firm Foundation delivers durable, beautifully crafted hardscape installations designed to enhance your property's curb appeal and functionality.",
    description2:
      "We work with a variety of materials — including pavers, natural stone, and concrete — to create outdoor spaces that stand the test of time in the Lowcountry climate.",
    items: [
      { label: "Paver Patios", detail: "Custom-designed patios built for durability and style" },
      { label: "Stone Walkways", detail: "Decorative walkways using natural stone and pavers" },
      { label: "Retaining Walls", detail: "Sturdy walls for erosion control and elevated landscapes" },
      { label: "Outdoor Living Spaces", detail: "Complete backyard transformations and hardscape design" },
      { label: "Custom Stone Work", detail: "Tailored installations using premium materials" },
    ],
  },
  {
    slug: "landscaping",
    pageTitle: "Landscaping in Mount Pleasant, SC | Firm Foundation",
    pageDescription:
      "Bed installation, mulching, planting and seasonal yard cleanups across Mount Pleasant and greater Charleston, SC. Free on-site quotes.",
    pageKeywords:
      "landscaping Mount Pleasant SC, mulch installation Charleston, planting beds, sod installation, yard cleanup Lowcountry",
    title: "Landscaping",
    image: landscaping,
    alt: "Fresh mulch beds and seasonal plantings at a Mount Pleasant, SC home",
    summary:
      "Create and preserve beautiful outdoor spaces tailored to the Lowcountry climate. From seasonal plantings to full bed maintenance, we keep your property looking its best.",
    description1:
      "Create and preserve beautiful outdoor spaces that enhance your property's value and curb appeal. Our landscaping services are tailored to the Lowcountry climate.",
    description2:
      "From seasonal plantings to full bed maintenance, we handle all aspects of landscape care to keep your property looking its best.",
    items: [
      { label: "Mulching & Bed Maintenance", detail: "Fresh mulch installation, bed edging, and weed control" },
      { label: "Seasonal Planting", detail: "Color rotation, annual installation, and design consultation" },
      { label: "Irrigation Management", detail: "System checks, adjustments, and minor repairs" },
      { label: "Shrub & Tree Care", detail: "Pruning, shaping, and health monitoring" },
      { label: "Debris Removal", detail: "Leaf cleanup, branch removal, and storm cleanup" },
    ],
  },
  {
    slug: "tree-services",
    pageTitle: "Tree Trimming & Removal, Mount Pleasant | Firm Foundation",
    pageDescription:
      "Tree trimming, removal, stump grinding and storm prep in Mount Pleasant and greater Charleston, SC. Free on-site quotes.",
    pageKeywords:
      "tree removal Mount Pleasant SC, tree trimming Charleston, stump grinding, storm prep, limb removal Lowcountry",
    title: "Tree Services",
    image: treeServices,
    alt: "Arborist trimming a Lowcountry live oak in Mount Pleasant, SC",
    summary:
      "Keep your trees healthy, safe, and beautiful with professional pruning, removals, and stump grinding. Built for the Lowcountry's live oaks and palms, with proactive storm and hurricane prep.",
    description1:
      "Keep your trees healthy, safe, and beautiful with professional tree care tailored to the Lowcountry's live oaks, palms, and coastal canopy. From routine pruning to full removals, our team works safely and cleans up thoroughly.",
    description2:
      "Storm season is a reality on the coast — we help you stay ahead of it with proactive trimming, hazard removal, and hurricane preparation that protects your home and property.",
    items: [
      { label: "Tree Trimming & Pruning", detail: "Shaping, deadwood removal, and canopy thinning for healthy growth" },
      { label: "Tree Removal", detail: "Safe removal of hazardous, damaged, or unwanted trees" },
      { label: "Stump Grinding", detail: "Grind down stumps to reclaim your yard and prevent regrowth" },
      { label: "Storm & Hurricane Prep", detail: "Proactive trimming and hazard reduction ahead of storm season" },
      { label: "Limb & Debris Cleanup", detail: "Fallen branch removal and full cleanup after every job" },
    ],
  },
  {
    slug: "custom-projects",
    pageTitle: "Decks, Fences & Built-Ins, Mount Pleasant | Firm Foundation",
    pageDescription:
      "Decks, fences, pergolas, built-ins, tile and finish work for homes in Mount Pleasant and greater Charleston, SC. Free on-site quotes.",
    pageKeywords:
      "deck builder Mount Pleasant SC, fence installation Charleston, pergola, custom built-ins, tile backsplash, home finish work",
    title: "Custom Projects",
    image: customProjects,
    alt: "Custom butler's pantry with painted cabinetry, brass hardware, patterned tile backsplash, and a quartz counter",
    summary:
      "The jobs that don't fit a category, inside or out — custom cabinetry and built-ins, tile and backsplash, decks, fences, pergolas, and finish carpentry.",
    description1:
      "Some projects don't fit neatly onto a service list. A butler's pantry built from scratch, a tile backsplash, a deck that needs rebuilding, a fence line that has had it. We take on the work that needs someone who will do it properly and actually finish it.",
    description2:
      "Inside or out, we work in wood, composite, tile, and stone, and we stay on the job from demo through the last piece of trim.",
    items: [
      { label: "Custom Cabinetry & Built-Ins", detail: "Pantries, built-in storage, and cabinet installs finished to match the room" },
      { label: "Tile & Backsplash", detail: "Backsplashes, accent walls, and tile work cut and set by hand" },
      { label: "Finish Carpentry & Trim", detail: "Trim, molding, and the detail work that makes a room look done" },
      { label: "Deck Repair & Restoration", detail: "Replace damaged boards, reinforce framing, and refinish surfaces" },
      { label: "Fence, Gate & Pergola Work", detail: "Fix leaning posts and sagging gates, or build new fencing and shade structures" },
      { label: "Custom Builds", detail: "Tailored woodwork and one-off projects for your property" },
    ],
  },
];

/** Plain service names, e.g. for schema and the contact form's dropdown. */
export const serviceNames = services.map((s) => s.title);
