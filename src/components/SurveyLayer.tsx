import { useEffect, useRef, useState } from "react";
import type { SurveyMode } from "@/lib/survey-layer";

interface SurveyLayerProps {
  /** `ambient` drifts behind a charcoal band; `reveal` sweeps once over the hero. */
  mode?: SurveyMode;
  density?: number;
  alpha?: number;
  /** Seconds the one-shot sweep takes. Ignored when `mode` is `ambient`. */
  duration?: number;
  className?: string;
}

/**
 * Client-only mount point for the contour layer.
 *
 * Two things here are load-bearing.
 *
 * The canvas is rendered only AFTER mount, so the prerendered HTML that
 * `vite-react-ssg` writes is unchanged — no extra element, nothing for a
 * crawler to weigh, and no chance of the decoration displacing the hero
 * photograph as the LCP element (a <canvas> is not an eligible LCP candidate,
 * so if it ever replaced the <img> the metric would silently move to the H1).
 *
 * And the module arrives through a dynamic `import()`, which is what keeps it
 * out of the single app chunk. Importing `@/lib/survey-layer` at the top of a
 * page component would put WebGL code on the contact form's critical path.
 */
const SurveyLayer = ({
  mode = "ambient",
  density,
  alpha,
  duration,
  className,
}: SurveyLayerProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [done, setDone] = useState(false);

  // The hero sweep waits for an idle moment: it is decoration competing with
  // the hero photograph for the same first second, and the photograph is what
  // the page is measured on.
  useEffect(() => {
    if (mode !== "reveal") {
      setMounted(true);
      return;
    }
    if (typeof window.requestIdleCallback !== "function") {
      const timer = window.setTimeout(() => setMounted(true), 240);
      return () => window.clearTimeout(timer);
    }
    const handle = window.requestIdleCallback(() => setMounted(true), { timeout: 600 });
    return () => window.cancelIdleCallback(handle);
  }, [mode]);

  useEffect(() => {
    if (!mounted || done) return;
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
          // The sweep is a moment, not a feature. Once it has passed, the
          // canvas and its GL context go away entirely.
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
  }, [mounted, done, mode, density, alpha, duration]);

  if (!mounted || done) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className ?? "pointer-events-none absolute inset-0 h-full w-full"}
    />
  );
};

export default SurveyLayer;
