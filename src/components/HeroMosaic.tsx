import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Pause, Play, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
// Josiah's own film (2026-11-19): Josiah in Firm Foundation's new Cat 305 CR.
// The still is the hero's first frame and its LCP; the cut ends on this frame.
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

/** A 1x1 transparent GIF: what the copy for the other layout resolves to, so it downloads nothing. */
const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/**
 * Which layout a copy of the hero belongs to. The phone and desktop heroes are
 * laid out differently (see LandingPage), so the pictures are rendered twice
 * and CSS shows one. `<picture>` points the hidden copy at a blank GIF for
 * the other screen size, which the browser picks before fetching, so each
 * device downloads each photo once.
 */
type Media = "phone" | "desktop";
const OTHER: Record<Media, string> = { phone: "(min-width: 1024px)", desktop: "(max-width: 1023.98px)" };

type ImgProps = {
  media: Media;
  src: string;
  srcSet: string;
  sizes: string;
  alt: string;
  position: string;
  priority?: boolean;
  className?: string;
};

const Img = ({ media, src, srcSet, sizes, alt, position, priority, className }: ImgProps) => (
  <picture>
    <source media={OTHER[media]} srcSet={BLANK} />
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={1200}
      height={900}
      loading="eager"
      decoding={priority ? "sync" : "async"}
      // Lowercase on purpose: React 18 doesn't know the camelCase prop
      // and warns, but passes an unknown lowercase attribute straight through.
      {...({ fetchpriority: priority ? "high" : "low" } as Record<string, string>)}
      style={{ objectPosition: position }}
      className={className}
    />
  </picture>
);

type Connection = { saveData?: boolean; effectiveType?: string };

/**
 * The lead picture: Josiah's film, because excavation is the lead service
 * (Will, 2026-11-19). It opens as the still, which is what LCP measures and
 * what a crawler, a visitor without JavaScript or one who prefers reduced
 * motion sees. Once the page has loaded, a 12.8-second silent cut plays once
 * and rests on its last frame, the same frame as the still.
 *
 * It runs past five seconds, so WCAG 2.2.2 needs a pause control, and it has
 * one while it plays. "Watch with sound" plays the full film in the same
 * element, started inside the tap itself: iOS only allows sound when play()
 * is called in the gesture, so mounting a new autoplay video after a state
 * change left iPhones on a paused frame (Will's phone, 2026-11-19).
 */
const HeroFilm = ({ media }: { media: Media }) => {
  const root = useRef<HTMLSpanElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"still" | "cut" | "film">("still");
  const [shown, setShown] = useState(false);
  const [paused, setPaused] = useState(false);
  const [ended, setEnded] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    // Only the copy on screen plays: the other layout's copy is display:none.
    if (!root.current || root.current.getClientRects().length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = (navigator as Navigator & { connection?: Connection }).connection;
    if (c?.saveData || (c?.effectiveType && /2g|3g/.test(c.effectiveType))) return;
    let timer = 0;
    const start = () => {
      timer = window.setTimeout(() => {
        const v = video.current;
        if (!v || v.dataset.mode === "film") return;
        v.muted = true;
        v.src = window.innerWidth < 768 ? CUT_SMALL : CUT;
        v.dataset.mode = "cut";
        setMode("cut");
        void v.play().catch(() => setMode("still"));
      }, 900);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", start);
    };
  }, [mounted]);

  const togglePause = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };

  const watchWithSound = () => {
    const v = video.current;
    if (!v) return;
    // All of this runs inside the tap, so iOS allows the sound.
    v.dataset.mode = "film";
    v.src = FILM;
    v.muted = false;
    v.controls = true;
    v.currentTime = 0;
    void v.play();
    v.focus();
    setMode("film");
    setShown(true);
  };

  return (
    <span ref={root} className="absolute inset-0">
      <Img
        media={media}
        src={filmStill}
        srcSet={filmStillSet}
        sizes={media === "desktop" ? "42vw" : "100vw"}
        alt="Josiah in the cab of Firm Foundation's new Cat 305 CR mini excavator, working among tall pines"
        position={STILL_POSITION}
        priority
        className="absolute inset-0 h-full w-full object-cover"
      />
      {mounted && (
        <video
          ref={video}
          playsInline
          preload="none"
          tabIndex={mode === "film" ? 0 : -1}
          aria-hidden={mode === "film" ? undefined : true}
          aria-label={mode === "film" ? "Film: Josiah running Firm Foundation's new Cat 305 CR mini excavator, 34 seconds, with music" : undefined}
          onPlaying={() => setShown(true)}
          onEnded={() => setEnded(true)}
          style={{ objectPosition: STILL_POSITION }}
          className={cn(
            "absolute inset-0 h-full w-full transition-opacity duration-500",
            mode === "film" ? "bg-black object-contain" : "object-cover",
            shown && mode !== "still" ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        />
      )}
      {mode !== "film" && (
        // Controls with their own solid ground, so they read on any frame:
        // the one thing set on a picture, like the before/after labels.
        <span className="absolute bottom-2.5 left-2.5 flex gap-2 sm:bottom-4 sm:left-4">
          {mode === "cut" && !ended && (
            <button
              type="button"
              onClick={togglePause}
              className={cn(CONTROL, "px-2.5")}
              aria-label={paused ? "Play the video" : "Pause the video"}
            >
              {paused ? (
                <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              ) : (
                <Pause className="h-4 w-4 fill-current" aria-hidden="true" />
              )}
            </button>
          )}
          <button type="button" onClick={watchWithSound} className={CONTROL} disabled={!mounted}>
            <Volume2 className="h-4 w-4" aria-hidden="true" />
            <span>
              Watch with sound <span className="font-normal text-muted-foreground">0:34</span>
            </span>
          </button>
        </span>
      )}
    </span>
  );
};

const CONTROL =
  "inline-flex items-center gap-2 rounded-[3px] bg-background px-3 py-2 text-sm font-semibold text-foreground shadow-[0_6px_20px_-8px_rgb(0_0_0/0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

type Tile = {
  slug: string;
  label: string;
  src: string;
  srcSet: string;
  alt: string;
  position: string;
  /** Desktop placement on the artboard, by percentage. */
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
    box: "left-0 top-[59%] w-[48%] h-[33%]",
    delay: 300,
  },
  {
    slug: "hardscapes",
    label: "Hardscapes",
    src: walkway,
    srcSet: walkwaySet,
    alt: "A flagstone walkway set in new sod beside a front porch",
    position: "42% 70%",
    box: "right-0 top-[65%] w-[48%] h-[30%]",
    delay: 480,
  },
];

const caption =
  "hero-rise mt-1.5 inline-flex items-center gap-1.5 whitespace-nowrap text-[0.8125rem] font-semibold leading-tight text-foreground sm:mt-2 sm:text-sm";
const arrow =
  "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-foreground";

const ExcavationCaption = ({ className }: { className?: string }) => (
  <Link
    to="/services/excavation"
    className={cn(caption, "group rounded-[2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
    style={{ animationDelay: "640ms" }}
  >
    Excavation
    <ArrowRight className={arrow} aria-hidden="true" />
  </Link>
);

const TileLink = ({ t, media, className }: { t: Tile; media: Media; className?: string }) => (
  <Link
    to={`/services/${t.slug}`}
    className={cn(
      "group block rounded-[3px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background",
      className,
    )}
  >
    <span
      className={cn("tile-reveal relative block overflow-hidden rounded-[3px] bg-muted", media === "phone" ? "aspect-[4/3]" : "absolute inset-0")}
      style={{ animationDelay: `${t.delay}ms` }}
    >
      <Img
        media={media}
        src={t.src}
        srcSet={t.srcSet}
        sizes={media === "desktop" ? "20vw" : "48vw"}
        alt={t.alt}
        position={t.position}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.035]"
      />
    </span>
    <span
      className={cn(caption, media === "desktop" && "absolute left-0 top-full")}
      style={{ animationDelay: `${t.delay + 520}ms` }}
    >
      {t.label}
      <ArrowRight className={arrow} aria-hidden="true" />
    </span>
  </Link>
);

/**
 * The hero's pictures, one per word of the headline: Excavation (Josiah's
 * film, large, leading), then Landscaping and Hardscapes.
 *
 * - `desktop`: one composition on an artboard of fixed proportions, the film
 *   across the top and the two photos staggered under it, beside the copy.
 * - `film` and `tiles` (phones and tablets): the film above the headline and
 *   the two photos below the copy, so a phone's first screen carries the logo,
 *   the film and the headline (until 2026-11-19 a phone had to scroll past all
 *   three pictures to find what the company does).
 *
 * Each picture is uncovered once as the page opens (`.tile-reveal` in
 * index.css), pure CSS, with the picture painted underneath from the first
 * frame, which is what LCP measures. Captions sit under each picture, never
 * on it, and link to that service.
 */
const HeroMosaic = ({ className, part }: { className?: string; part: "desktop" | "film" | "tiles" }) => {
  if (part === "film") {
    return (
      <div className={className}>
        <div className="relative aspect-video w-full sm:max-w-[44rem]">
          <span className="tile-reveal absolute inset-0 overflow-hidden rounded-[3px] bg-muted" style={{ animationDelay: "120ms" }}>
            <HeroFilm media="phone" />
          </span>
        </div>
        <ExcavationCaption />
      </div>
    );
  }
  if (part === "tiles") {
    return (
      <div className={className}>
        <div className="grid grid-cols-2 gap-3 sm:max-w-[44rem] sm:gap-4">
          <TileLink t={tiles[0]} media="phone" />
          <TileLink t={tiles[1]} media="phone" className="mt-6" />
        </div>
      </div>
    );
  }
  return (
    <div className={className}>
      <div className="relative aspect-[0.825] w-[min(100%,calc((100svh_-_9rem)*0.825))]">
        <div className="absolute left-0 top-0 h-[51%] w-full">
          <span className="tile-reveal absolute inset-0 overflow-hidden rounded-[3px] bg-muted" style={{ animationDelay: "120ms" }}>
            <HeroFilm media="desktop" />
          </span>
          <ExcavationCaption className="absolute left-0 top-full" />
        </div>
        {tiles.map((t) => (
          <TileLink key={t.slug} t={t} media="desktop" className={cn("absolute", t.box)} />
        ))}
      </div>
    </div>
  );
};

export default HeroMosaic;
