import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import landscaping from "@/assets/services/landscaping.jpg";
import landscapingSet from "@/assets/services/landscaping.jpg?w=640;1024;1600&format=webp&quality=68&as=srcset";
import walkway from "@/assets/services/hardscapes.jpg";
import walkwaySet from "@/assets/services/hardscapes.jpg?w=640;1024&format=webp&quality=68&as=srcset";
import machine from "@/assets/services/excavation.jpg";
import machineSet from "@/assets/services/excavation.jpg?w=640;1024&format=webp&quality=68&as=srcset";

type Tile = {
  slug: string;
  label: string;
  src: string;
  srcSet: string;
  alt: string;
  /** Where the crop sits, so the subject survives every tile shape. */
  position: string;
  sizes: string;
  /** Where the photo sits on the artboard: percentages, phone first. */
  box: string;
  /** When its turn comes in the opening sequence. */
  delay: number;
};

/**
 * The hero's three photographs, one per word of the headline: Landscaping,
 * Hardscapes, Excavation. Every one is Josiah's own job, and each is a link
 * to that service (the arrow beside each caption says so), so the pictures
 * double as the first menu a visitor sees.
 *
 * Laid out as a composition, not a grid: an artboard of fixed proportions
 * with each photo placed on it by percentage, so the offsets hold at every
 * width. On a desktop the big one sits across the top on the frame's right
 * edge, and the pair under it are staggered: Hardscapes steps out to the left
 * and Excavation, back on the right edge, starts lower and finishes lower.
 * On a phone the pair on the right starts lower than the big one on the left
 * and finishes below it. Gutters are even and every photo shares an edge with
 * another, so the offsets read as placed rather than scattered. Captions sit
 * under each picture, never on it.
 *
 * Each photo is uncovered once, in turn, as the page opens (`.tile-reveal`
 * in index.css): pure CSS, so it starts on the first paint without waiting
 * for JavaScript, and the picture underneath is painted from that first
 * frame, which is what LCP measures.
 */
const tiles: Tile[] = [
  {
    slug: "landscaping",
    label: "Landscaping",
    src: landscaping,
    srcSet: landscapingSet,
    alt: "New mulch beds and shrubs along the front walk of a two-story Mount Pleasant home",
    // Toward the new beds and away from the leaf-littered lawn below them.
    position: "50% 38%",
    sizes: "(min-width: 1024px) 34vw, 58vw",
    box: "left-0 top-0 w-[57%] h-[80%] lg:left-[20%] lg:w-[80%] lg:h-[44%]",
    delay: 120,
  },
  {
    slug: "hardscapes",
    label: "Hardscapes",
    src: walkway,
    srcSet: walkwaySet,
    alt: "A flagstone walkway set in new sod beside a front porch",
    position: "42% 70%",
    sizes: "(min-width: 1024px) 20vw, 40vw",
    box: "right-0 top-[9%] w-[39%] h-[34%] lg:left-0 lg:right-auto lg:top-[52%] lg:w-[47%] lg:h-[39%]",
    delay: 300,
  },
  {
    slug: "excavation",
    label: "Excavation",
    src: machine,
    srcSet: machineSet,
    alt: "A Cat 305 excavator operated by Josiah, working a pile of cleared timber on a land-clearing job",
    position: "55% 55%",
    sizes: "(min-width: 1024px) 20vw, 40vw",
    box: "right-0 top-[55%] w-[39%] h-[33%] lg:top-[61%] lg:w-[47%] lg:h-[35%]",
    delay: 480,
  },
];

const HeroMosaic = ({ className }: { className?: string }) => (
  <div className={className}>
    {/* The artboard. Below lg it is as wide as the column; at lg it is as
        large as fits the space beside the copy, whichever of width or height
        runs out first, so the composition is never squashed. */}
    <div className="relative w-full aspect-[1.25] sm:aspect-[1.4] sm:max-w-[44rem] lg:aspect-[0.825] lg:w-[min(100%,calc((100svh_-_9rem)*0.825))] lg:max-w-none">
      {tiles.map((t, i) => (
        <Link
          key={t.slug}
          to={`/services/${t.slug}`}
          className={cn(
            "group absolute rounded-[3px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background",
            t.box,
          )}
        >
          <span
            className="tile-reveal absolute inset-0 rounded-[3px] bg-muted"
            style={{ animationDelay: `${t.delay}ms` }}
          >
            <img
              src={t.src}
              srcSet={t.srcSet}
              sizes={t.sizes}
              alt={t.alt}
              width={1200}
              height={900}
              loading="eager"
              decoding={i === 0 ? "sync" : "async"}
              // Lowercase on purpose: React 18 doesn't know the camelCase prop
              // and warns, but passes an unknown lowercase attribute straight through.
              {...({ fetchpriority: i === 0 ? "high" : "low" } as Record<string, string>)}
              style={{ objectPosition: t.position }}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.035]"
            />
          </span>
          {/* A caption under the picture, never a chip on it, with the arrow
              right beside the word: this goes to that page. */}
          <span
            className="hero-rise absolute left-0 top-full mt-1.5 inline-flex items-center gap-1.5 whitespace-nowrap text-[0.8125rem] font-semibold leading-tight text-foreground sm:mt-2 sm:text-sm"
            style={{ animationDelay: `${t.delay + 520}ms` }}
          >
            {t.label}
            <ArrowRight
              className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-foreground"
              aria-hidden="true"
            />
          </span>
        </Link>
      ))}
    </div>
  </div>
);

export default HeroMosaic;
