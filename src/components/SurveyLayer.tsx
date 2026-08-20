import { useEffect, useRef, useState } from "react";
import type { SurveyMode } from "@/lib/survey-layer";

interface SurveyLayerProps {
  /** `ambient` settles into a still survey sheet; `reveal` sweeps the hero and clears. */
  mode?: SurveyMode;
  density?: number;
  alpha?: number;
  /** Seconds the pass takes. Clamped under five seconds by the module. */
  duration?: number;
  /** Below this viewport width no WebGL context is created at all. */
  minWidth?: number;
  className?: string;
}

/**
 * Client-only mount point for the contour layer.
 *
 * Three things here are load-bearing.
 *
 * **Phones never get it.** The same call `HeroVideo` already makes about the
 * hero clip, for a better reason: at 390px the copy fills the band, so the
 * cleared zone that keeps type legible covers essentially the whole canvas and
 * the layer is invisible — while still costing a WebGL context, a shader
 * compile and GPU time on the device least able to spare them. This audience is
 * mostly older homeowners on cellular. They get the fast page; desktop gets the
 * craft. Measured at 390px before this gate: the layer could not be seen at all.
 *
 * **The canvas is rendered only AFTER mount**, so the prerendered HTML that
 * `vite-react-ssg` writes is unchanged — no extra element, nothing for a crawler
 * to weigh, and no chance of decoration displacing the hero photograph as the
 * LCP element (a `<canvas>` is not an eligible LCP candidate, so if it ever
 * replaced the `<img>` the metric would silently move to the H1).
 *
 * **The module arrives through a dynamic `import()`**, which is what keeps it
 * out of the single app chunk. Importing `@/lib/survey-layer` at the top of a
 * page component would put WebGL on the contact form's critical path.
 */
const SurveyLayer = ({
  mode = "ambient",
  density,
  alpha,
  duration,
  minWidth = 768,
  className,
}: SurveyLayerProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [wideEnough, setWideEnough] = useState(false);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${minWidth}px)`);
    const sync = () => setWideEnough(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [minWidth]);

  // The hero sweep waits for an idle moment: it is decoration competing with
  // the hero photograph for the same first second, and the photograph is what
  // the page is actually measured on.
  useEffect(() => {
    if (!wideEnough) return;
    if (mode !== "reveal") {
      setReady(true);
      return;
    }
    if (typeof window.requestIdleCallback !== "function") {
      const timer = window.setTimeout(() => setReady(true), 240);
      return () => window.clearTimeout(timer);
    }
    const handle = window.requestIdleCallback(() => setReady(true), { timeout: 600 });
    return () => window.cancelIdleCallback(handle);
  }, [wideEnough, mode]);

  useEffect(() => {
    if (!wideEnough || !ready || done) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let handle: { destroy: () => void } | null = null;

    import("@/lib/survey-layer")
      .then(({ mountSurveyLayer }) => {
        if (disposed) return;
        handle = mountSurveyLayer(canvas, {
          mode,
          density,
          alpha,
          duration,
          // The hero sweep is a moment, not a feature: once it has passed, the
          // canvas and its GL context go away. The ambient layer keeps its
          // final still frame, so it must NOT be unmounted.
          onDone: mode === "reveal" ? () => setDone(true) : undefined,
        });
      })
      .catch(() => {
        /* No layer is a perfectly good outcome; the page is complete without it. */
      });

    return () => {
      disposed = true;
      handle?.destroy();
    };
  }, [wideEnough, ready, done, mode, density, alpha, duration]);

  if (!wideEnough || !ready || done) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className ?? "pointer-events-none absolute inset-0 h-full w-full"}
    />
  );
};

export default SurveyLayer;
