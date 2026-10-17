import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
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
  className: string;
};

/**
 * The hero's three photographs, one per word of the headline: Landscaping,
 * Hardscapes, Excavation. Every one is Josiah's own job, and each tile is a
 * link to that service, so the pictures double as the first menu a visitor
 * sees.
 *
 * Why not one big photo any more: the headline names three trades now, and a
 * single excavator under "Landscaping" would contradict the first word.
 *
 * Nothing here animates. These are above the fold and eager, and the largest
 * one is what LCP is measured on, so they paint in their finished state.
 */
const tiles: Tile[] = [
  {
    slug: "landscaping",
    label: "Landscaping",
    src: landscaping,
    srcSet: landscapingSet,
    alt: "New mulch beds and shrubs along the front walk of a two-story Mount Pleasant home",
    position: "50% 62%",
    sizes: "(min-width: 1024px) 44vw, 64vw",
    className: "col-span-2 row-span-2 lg:row-span-1",
  },
  {
    slug: "hardscapes",
    label: "Hardscapes",
    src: walkway,
    srcSet: walkwaySet,
    alt: "A flagstone walkway set in new sod beside a front porch",
    position: "42% 70%",
    sizes: "(min-width: 1024px) 22vw, 32vw",
    className: "lg:col-span-1",
  },
  {
    slug: "excavation",
    label: "Excavation",
    src: machine,
    srcSet: machineSet,
    alt: "Firm Foundation's excavator working a pile of cleared timber",
    position: "55% 55%",
    sizes: "(min-width: 1024px) 22vw, 32vw",
    className: "lg:col-span-1",
  },
];

const HeroMosaic = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "grid grid-cols-3 grid-rows-2 gap-x-2 gap-y-2.5 sm:gap-x-3 sm:gap-y-4 lg:grid-cols-2 lg:grid-rows-[3fr_2fr] lg:gap-x-4 lg:gap-y-5",
      className,
    )}
  >
    {tiles.map((t, i) => (
      <Link
        key={t.slug}
        to={`/services/${t.slug}`}
        className={cn(
          "group flex min-h-0 flex-col gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:gap-2",
          t.className,
        )}
      >
        <span className="relative min-h-0 flex-1 overflow-hidden rounded-[3px] bg-muted">
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
        {/* A caption under the picture, never a chip on it: nothing laid
            over the photograph, and it reads like a printed plate. */}
        <span className="flex items-baseline justify-between gap-2 text-[0.6875rem] font-semibold text-foreground sm:text-sm">
          {t.label}
          <ArrowUpRight
            className="hidden h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-foreground sm:block"
            aria-hidden="true"
          />
        </span>
      </Link>
    ))}
  </div>
);

export default HeroMosaic;
