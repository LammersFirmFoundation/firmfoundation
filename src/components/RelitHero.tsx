import { useEffect, useRef, useState } from "react";
import type { RelitHandle } from "@/lib/relit-hero";

interface RelitHeroProps {
  /** Must be the exact same URL the hero <img> uses, so it comes from cache. */
  photoUrl: string;
  depthUrl: string;
  /** Below this width no WebGL context is created at all. */
  minWidth?: number;
}

/**
 * Client-only mount for the relit hero.
 *
 * The photograph underneath is never replaced. It stays a plain `<img>` with
 * `fetchpriority="high"`, which keeps it the LCP element — a `<canvas>` is not
 * an eligible LCP candidate, so drawing the hero *into* one would silently move
 * the metric to the H1. The canvas is layered on top, starts transparent, and
 * fades in only once its first frame is actually on screen, so there is never a
 * flash of empty black over the photo.
 *
 * Phones are excluded deliberately, the same call `HeroVideo` makes about the
 * hero clip: the effect is driven by a pointer they don't have, and it would
 * cost a context, a shader compile and two texture uploads on the device least
 * able to spare them. They get the photograph, instantly.
 */
const RelitHero = ({ photoUrl, depthUrl, minWidth = 1024 }: RelitHeroProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [eligible, setEligible] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // A pointer is what drives the light, so a touch-only device gets nothing
    // even if it is wide enough — a tablet would otherwise sit on a static
    // relight it can never move.
    const query = window.matchMedia(`(min-width: ${minWidth}px) and (hover: hover) and (pointer: fine)`);
    const sync = () => setEligible(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [minWidth]);

  useEffect(() => {
    if (!eligible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let handle: RelitHandle | null = null;

    // Deferred to an idle moment: this competes with the hero photograph for
    // the same first second, and the photograph is what the page is measured on.
    const startup = () => {
      if (disposed) return;
      import("@/lib/relit-hero")
        .then(({ mountRelitHero }) =>
          mountRelitHero(canvas, {
            photoUrl,
            depthUrl,
            onReady: () => !disposed && setVisible(true),
          })
        )
        .then((mounted) => {
          if (disposed) mounted?.destroy();
          else handle = mounted;
        })
        .catch(() => {
          /* No effect is a fine outcome — the photograph is the whole picture. */
        });
    };

    const idle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(startup, { timeout: 900 })
        : window.setTimeout(startup, 320);

    return () => {
      disposed = true;
      if (typeof window.requestIdleCallback === "function") window.cancelIdleCallback(idle as number);
      else window.clearTimeout(idle as number);
      handle?.destroy();
    };
  }, [eligible, photoUrl, depthUrl]);

  if (!eligible) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    />
  );
};

export default RelitHero;
