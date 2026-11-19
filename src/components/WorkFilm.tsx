import { BUSINESS } from "@/data/business";
import { cn } from "@/lib/utils";

const SRC = "/video/firm-foundation.mp4";
const POSTER = "/video/firm-foundation-poster.jpg";

/**
 * What happens in the film, scene by scene. It is the text alternative WCAG
 * 1.2.3 asks for (the film has music and no speech), and it is also the only
 * part of the film a search engine can read.
 */
const SCENES = [
  "Josiah climbs into the cab of Firm Foundation's new Cat excavator.",
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
  description: `Josiah Lammers of ${BUSINESS.name} running the company's new Cat excavator: clearing brush, moving a log, digging and hauling dirt. ${SCENES.length} scenes, 34 seconds.`,
  thumbnailUrl: `${BUSINESS.url}${POSTER}`,
  contentUrl: `${BUSINESS.url}${SRC}`,
  uploadDate: "2026-11-19",
  duration: "PT34S",
};

/**
 * Josiah's 34-second film, played only when someone presses play. Nothing
 * autoplays and nothing loops (WCAG 2.2.2, the site-wide rule), and
 * `preload="none"` means the 14 MB file costs nothing until it is wanted: the
 * poster is all a visitor downloads.
 */
const WorkFilm = ({ className }: { className?: string }) => (
  <figure className={cn("min-w-0", className)}>
    <video
      className="aspect-video w-full rounded-[3px] bg-muted object-cover"
      controls
      playsInline
      preload="none"
      poster={POSTER}
      width={1280}
      height={720}
      aria-label="Film: Josiah running Firm Foundation's new Cat excavator, 34 seconds, with music"
    >
      <source src={SRC} type="video/mp4" />
      <a href={SRC}>Download the film (MP4)</a>
    </video>
    <figcaption className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-baseline sm:justify-between">
      <span>Josiah at work. 34 seconds, with music.</span>
      <details className="sm:text-right">
        <summary className="cursor-pointer underline decoration-border underline-offset-4 hover:decoration-foreground">
          What&rsquo;s in the film
        </summary>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-left">
          {SCENES.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </details>
    </figcaption>
  </figure>
);

export default WorkFilm;
