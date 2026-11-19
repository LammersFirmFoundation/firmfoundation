import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Pause, Play, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
// Josiah's own film (2026-11-19): Josiah in Firm Foundation's new Cat. The
// still is the hero's first frame and its LCP; the cut ends on this frame.
import filmStill from "@/assets/work/machine-in-the-woods.jpg";
import filmStillSet from "@/assets/work/machine-in-the-woods.jpg?w=640;1024;1600&format=webp&quality=68&as=srcset";
import landscaping from "@/assets/services/landscaping.jpg";
import landscapingSet from "@/assets/services/landscaping.jpg?w=640;1024&format=webp&quality=68&as=srcset";
import walkway from "@/assets/services/hardscapes.jpg";
import walkwaySet from "@/assets/services/hardscapes.jpg?w=640;1024&format=webp&quality=68&as=srcset";

const CUT = "/video/hero-cut.mp4"; // 12.8 s, 1280x720, silent, 3.6 MB
const CUT_SMALL = "/video/hero-cut-480.mp4"; // the same at 854x480, 2.0 MB, under 768px
const FILM = "/video/firm-foundation.mp4"; // the full 34 s with sound, only on request
const STILL_POSITION = "68% 50%"; // the cab and Josiah sit right of centre

type Connection = { saveData?: boolean; effectiveType?: string };

/**
 * The lead tile: Josiah's film, because excavation is the lead service
 * (Will, 2026-11-19). It opens as the still, which is what LCP measures and
 * what a crawler, a visitor without JavaScript or one who prefers reduced
 * motion sees. Once the page has loaded, a 12.8-second silent cut of the film
 * plays once and rests on its last frame, the same frame as the still.
 *
 * It runs past five seconds, so WCAG 2.2.2 needs a pause control, and it has
 * one, visible while it plays. "Watch with sound" swaps in the full film with
 * native controls. No cut on Save-Data or a 2G/3G connection.
 */
const HeroFilm = () => {
  const cut = useRef<HTMLVideoElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const [cutSrc, setCutSrc] = useState<string | null>(null);
  const [cutShown, setCutShown] = useState(false);
  const [paused, setPaused] = useState(false);
  const [ended, setEnded] = useState(false);
  const [full, setFull] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = (navigator as Navigator & { connection?: Connection }).connection;
    if (c?.saveData || (c?.effectiveType && /2g|3g/.test(c.effectiveType))) return;
    let timer = 0;
    // After the pictures' own reveal has finished.
    const start = () => {
      timer = window.setTimeout(() => setCutSrc(window.innerWidth < 768 ? CUT_SMALL : CUT), 900);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", start);
    };
  }, []);

  useEffect(() => {
    if (full) film.current?.focus();
  }, [full]);

  const togglePause = () => {
    const v = cut.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };

  if (full) {
    return (
      <video
        ref={film}
        className="absolute inset-0 h-full w-full bg-black object-contain"
        controls
        autoPlay
        playsInline
        aria-label="Film: Josiah running Firm Foundation's new Cat 305 CR mini excavator, 34 seconds, with music"
      >
        <source src={FILM} type="video/mp4" />
      </video>
    );
  }

  const control =
    "inline-flex items-center gap-2 rounded-[3px] bg-background px-3 py-2 text-sm font-semibold text-foreground shadow-[0_6px_20px_-8px_rgb(0_0_0/0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <>
      <img
        src={filmStill}
        srcSet={filmStillSet}
        sizes="(min-width: 1024px) 42vw, 100vw"
        alt="Josiah in the cab of Firm Foundation's new Cat 305 CR mini excavator, working among tall pines"
        width={1920}
        height={1080}
        loading="eager"
        decoding="sync"
        // Lowercase on purpose: React 18 doesn't know the camelCase prop
        // and warns, but passes an unknown lowercase attribute straight through.
        {...({ fetchpriority: "high" } as Record<string, string>)}
        style={{ objectPosition: STILL_POSITION }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {cutSrc && (
        <video
          ref={cut}
          src={cutSrc}
          muted
          autoPlay
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setCutShown(true)}
          onEnded={() => setEnded(true)}
          style={{ objectPosition: STILL_POSITION }}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            cutShown ? "opacity-100" : "opacity-0",
          )}
        />
      )}
      {/* Controls with their own solid ground, so they read on any frame: the
          one thing set on a picture, like the before/after labels. */}
      <div className="absolute bottom-2.5 left-2.5 flex gap-2 sm:bottom-4 sm:left-4">
        {cutSrc && !ended && (
          <button
            type="button"
            onClick={togglePause}
            className={cn(control, "px-2.5")}
            aria-label={paused ? "Play the video" : "Pause the video"}
          >
            {paused ? (
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
            ) : (
              <Pause className="h-4 w-4 fill-current" aria-hidden="true" />
            )}
          </button>
        )}
        <button type="button" onClick={() => setFull(true)} className={control}>
          <Volume2 className="h-4 w-4" aria-hidden="true" />
          <span>
            Watch with sound <span className="font-normal text-muted-foreground">0:34</span>
          </span>
        </button>
      </div>
    </>
  );
};

type Tile = {
  slug: string;
  label: string;
  src: string;
  srcSet: string;
  alt: string;
  position: string;
  sizes: string;
  /** Where the photo sits on the artboard: percentages, phone first. */
  box: string;
  delay: number;
};

/** The two trades under the film, each a link to its page. */
const tiles: Tile[] = [
  {
    slug: "landscaping",
    label: "Landscaping",
    src: landscaping,
    srcSet: landscapingSet,
    alt: "New mulch beds and shrubs along the front walk of a two-story Mount Pleasant home",
    position: "50% 38%",
    sizes: "(min-width: 1024px) 20vw, 48vw",
    box: "left-0 top-[62%] w-[48.5%] h-[30%] lg:top-[59%] lg:w-[48%] lg:h-[33%]",
    delay: 300,
  },
  {
    slug: "hardscapes",
    label: "Hardscapes",
    src: walkway,
    srcSet: walkwaySet,
    alt: "A flagstone walkway set in new sod beside a front porch",
    position: "42% 70%",
    sizes: "(min-width: 1024px) 20vw, 48vw",
    box: "right-0 top-[67%] w-[48.5%] h-[25%] lg:top-[65%] lg:w-[48%] lg:h-[30%]",
    delay: 480,
  },
];

const caption =
  "hero-rise absolute left-0 top-full mt-1.5 inline-flex items-center gap-1.5 whitespace-nowrap text-[0.8125rem] font-semibold leading-tight text-foreground sm:mt-2 sm:text-sm";
const arrow =
  "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-foreground";

/**
 * The hero's pictures, one per word of the headline: Excavation (Josiah's
 * film, large, leading), then Landscaping and Hardscapes below it, staggered.
 * Each caption links to that service, so the pictures double as the first
 * menu a visitor sees. Captions sit under each picture, never on it.
 *
 * Laid out as a composition on an artboard of fixed proportions, each picture
 * placed by percentage so the offsets hold at every width. Each is uncovered
 * once as the page opens (`.tile-reveal` in index.css), pure CSS, with the
 * picture painted underneath from the first frame, which is what LCP measures.
 */
const HeroMosaic = ({ className }: { className?: string }) => (
  <div className={className}>
    <div className="relative w-full aspect-[0.95] sm:aspect-[1.2] sm:max-w-[44rem] lg:aspect-[0.825] lg:w-[min(100%,calc((100svh_-_9rem)*0.825))] lg:max-w-none">
      {/* The film. Not a link itself: it holds its own buttons. */}
      <div className="absolute left-0 top-0 h-[52%] w-full lg:h-[51%]">
        <span
          className="tile-reveal absolute inset-0 overflow-hidden rounded-[3px] bg-muted"
          style={{ animationDelay: "120ms" }}
        >
          <HeroFilm />
        </span>
        <Link
          to="/services/excavation"
          className={cn(caption, "group rounded-[2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring")}
          style={{ animationDelay: "640ms" }}
        >
          Excavation
          <ArrowRight className={arrow} aria-hidden="true" />
        </Link>
      </div>

      {tiles.map((t) => (
        <Link
          key={t.slug}
          to={`/services/${t.slug}`}
          className={cn(
            "group absolute rounded-[3px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background",
            t.box,
          )}
        >
          <span className="tile-reveal absolute inset-0 rounded-[3px] bg-muted" style={{ animationDelay: `${t.delay}ms` }}>
            <img
              src={t.src}
              srcSet={t.srcSet}
              sizes={t.sizes}
              alt={t.alt}
              width={1200}
              height={900}
              loading="eager"
              decoding="async"
              {...({ fetchpriority: "low" } as Record<string, string>)}
              style={{ objectPosition: t.position }}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.035]"
            />
          </span>
          <span className={caption} style={{ animationDelay: `${t.delay + 520}ms` }}>
            {t.label}
            <ArrowRight className={arrow} aria-hidden="true" />
          </span>
        </Link>
      ))}
    </div>
  </div>
);

export default HeroMosaic;
