import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { BUSINESS } from "@/data/business";
import { cn } from "@/lib/utils";

const FILM = "/video/firm-foundation.mp4";
const FILM_POSTER = "/video/firm-foundation-poster.jpg";

/**
 * What happens in the film, scene by scene. It is the text alternative WCAG
 * 1.2.3 asks for (the film has music and no speech), and it is also the only
 * part of the film a search engine can read.
 */
export const FILM_SCENES = [
  "Josiah climbs into the cab of Firm Foundation's new Cat 305 CR mini excavator.",
  "The excavator clears brush and small trees in a stand of pines and moves a fallen log.",
  "It digs into a pile of sandy fill and lifts a full bucket.",
  "It carries dirt through the trees and dumps it.",
  "It ends on the Firm Foundation badge.",
];

/**
 * schema.org VideoObject for the film. `uploadDate` is the day it went on the
 * site. Emitted on the pages that show the film, so Google can list it.
 */
export const workFilmSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Firm Foundation at work",
  description: `Josiah Lammers of ${BUSINESS.name} running the company's new Cat 305 CR mini excavator: clearing brush, moving a log, digging and hauling dirt. ${FILM_SCENES.length} scenes, 34 seconds.`,
  thumbnailUrl: `${BUSINESS.url}${FILM_POSTER}`,
  contentUrl: `${BUSINESS.url}${FILM}`,
  uploadDate: "2026-11-19",
  duration: "PT34S",
};

type Still = { src: string; srcSet: string; alt: string; position?: string };

interface FilmPlayerProps {
  /** The still shown until play. */
  still: Still;
  /** The frame's shape and corners. */
  frameClassName?: string;
  sizes: string;
  /** Above the fold: load the still eagerly. */
  eager?: boolean;
}

/**
 * Josiah's 34-second film, click to play. Until someone presses play only the
 * still loads; the 14 MB film is fetched on the press, then plays with sound
 * and native controls.
 *
 * The press sets the source and calls play() inside the tap itself, on a
 * video element that is already in the page: iOS only allows sound when
 * play() runs in the gesture, so mounting a new autoplay video after a state
 * change left iPhones on a paused first frame (2026-11-19). The video element
 * is added after mount, so the prerender is the still and the button.
 */
export const FilmPlayer = ({ still, frameClassName, sizes, eager }: FilmPlayerProps) => {
  const film = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => setMounted(true), []);

  const play = () => {
    const v = film.current;
    if (!v) return;
    v.src = FILM;
    v.muted = false;
    v.controls = true;
    void v.play();
    v.focus();
    setPlaying(true);
  };

  return (
    <div className={cn("relative overflow-hidden bg-muted", frameClassName)}>
      <img
        src={still.src}
        srcSet={still.srcSet}
        sizes={sizes}
        alt={still.alt}
        width={1920}
        height={1080}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        style={{ objectPosition: still.position }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {mounted && (
        <video
          ref={film}
          playsInline
          preload="none"
          poster={FILM_POSTER}
          tabIndex={playing ? 0 : -1}
          aria-hidden={playing ? undefined : true}
          aria-label={playing ? "Film: Josiah running Firm Foundation's new Cat 305 CR mini excavator, 34 seconds, with music" : undefined}
          className={cn(
            "absolute inset-0 h-full w-full bg-black object-contain",
            playing ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        />
      )}
      {!playing && (
        // A control with its own solid ground, so it reads on any frame: the
        // one thing set on the picture, like the before/after labels.
        <button
          type="button"
          onClick={play}
          disabled={!mounted}
          className="group absolute bottom-2.5 left-2.5 inline-flex items-center gap-2.5 rounded-[3px] bg-background py-2 pl-2 pr-3.5 text-left text-foreground shadow-[0_6px_24px_-8px_rgb(0_0_0/0.45)] transition-transform duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:bottom-5 sm:left-5 sm:gap-3 sm:py-3 sm:pl-3 sm:pr-5"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[3px] bg-primary text-primary-foreground sm:h-10 sm:w-10">
            <Play className="h-4 w-4 translate-x-px fill-current" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block text-[0.9375rem] font-semibold sm:text-base">Play the film</span>
            <span className="hidden text-sm text-muted-foreground sm:block">34 seconds, sound on</span>
          </span>
        </button>
      )}
    </div>
  );
};

/** The scene list, the film's text alternative, set under the player. */
export const FilmScenes = ({ className }: { className?: string }) => (
  <details className={cn("text-sm text-muted-foreground", className)}>
    <summary className="cursor-pointer underline decoration-border underline-offset-4 hover:decoration-foreground">
      What&rsquo;s in the film
    </summary>
    <ol className="mt-2 list-decimal space-y-1 pl-5">
      {FILM_SCENES.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ol>
  </details>
);
