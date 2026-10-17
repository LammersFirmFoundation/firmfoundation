import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { PlateId } from "@/data/services";

/**
 * Section drawings — one per service — drawn the way a grading plan or a
 * civil detail sheet is drawn: hairlines, hatched earth, a dashed existing
 * grade, the water-table symbol, a title block.
 *
 * They started as stand-ins for photos Josiah doesn't have yet, and turned out
 * to be better at a different job: explaining. A photo shows the machine; a
 * section shows the half of the work that happens underground — a root ball,
 * a French drain, cut and fill — which a homeowner has never seen and which is
 * what the quote is actually paying for. So each service page puts its drawing
 * beside the choice it illustrates (grind or pull, swale or drain), and the
 * photographs carry the cards and the heroes.
 *
 * It is the same visual language as the survey layer behind every CTA
 * (`survey-layer.ts`): contour lines are how grading work is drawn, and a
 * section is the next drawing on the same sheet.
 *
 * Rules that keep them honest and legible:
 * - **Not to scale, and labelled so.** "N.T.S." is the drafting convention for
 *   exactly this, and it stops a drawing reading as a measured claim.
 * - **Every number drawn is a published standard's, not ours**, and is cited
 *   where it is drawn: 6 in. of fall in the first 10 ft (IRC R401.3), a 4 in.
 *   minimum paver base (CMHA PAV-TEC-002), 2–3 in. of mulch (Clemson HGIC
 *   1052). Anything without a source is a label, never a dimension.
 * - **Labels only when there's room.** At card size a 10px label renders at
 *   7px, so `compact` drops them and keeps the drawing.
 * - **One pass, never a loop.** Lines draw in once when scrolled into view and
 *   stay drawn (WCAG 2.2.2 — the same rule as the survey layer), and not at all
 *   under reduced motion.
 */

// ── Deterministic noise, so every build draws the same trees ────────────────
const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const f = (n: number) => Math.round(n * 10) / 10;

/** A closed, smoothed, irregular outline — a tree crown or a shrub. */
function blob(cx: number, cy: number, rx: number, ry: number, seed: number, n = 16, jitter = 0.16) {
  const r = rng(seed);
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const k = 1 - jitter + r() * jitter * 2;
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k] as const;
  });
  // Catmull-Rom through the points, as cubic Béziers.
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + "Z";
}

/**
 * A scalloped outline — how a tree canopy is drawn on an architectural
 * elevation. `flat` squashes the underside, which is what makes a live oak
 * read as a live oak rather than a lollipop.
 */
function scallop(cx: number, cy: number, rx: number, ry: number, seed: number, n = 14, flat = 0.55) {
  const r = rng(seed);
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + r() * 0.12;
    const k = 0.9 + r() * 0.2;
    const under = Math.sin(a) > 0 ? flat : 1; // SVG y grows downward
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k * under] as const;
  });
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    const mx = (a[0] + b[0]) / 2;
    const my = (a[1] + b[1]) / 2;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const ox = mx - cx;
    const oy = my - cy;
    const ol = Math.hypot(ox, oy) || 1;
    const bulge = len * (0.34 + r() * 0.18);
    d += ` Q${f(mx + (ox / ol) * bulge)} ${f(my + (oy / ol) * bulge)} ${f(b[0])} ${f(b[1])}`;
  }
  return d + "Z";
}

/**
 * A loblolly pine: a tall bare trunk and a high, broken crown of tufts at the
 * ends of a few short limbs. Returns separate strokes so each can draw in.
 */
function pine(x: number, ground: number, h: number, seed: number) {
  const r = rng(seed);
  const top = ground - h;
  const trunk = `M${x} ${ground} L${f(x + (r() - 0.5) * 2)} ${f(top + 6)}`;
  const limbs: string[] = [];
  const tufts: string[] = [];
  const count = 5;
  for (let i = 0; i < count; i++) {
    const y = top + 10 + i * 11 + r() * 4;
    const side = i % 2 === 0 ? -1 : 1;
    const reach = 9 + r() * 10;
    const ex = x + side * reach;
    const ey = y - 5 - r() * 5;
    limbs.push(`M${x} ${f(y)} Q${f(x + side * reach * 0.5)} ${f(y - 1)} ${f(ex)} ${f(ey)}`);
    tufts.push(scallop(ex, ey - 2, 7 + r() * 5, 5 + r() * 2.5, seed * 7 + i, 7, 0.7));
  }
  tufts.push(scallop(x, top + 2, 8 + r() * 3, 6, seed * 11, 7, 0.7));
  return { trunk, limbs, tufts };
}

/** A thicket along the ground: overlapping low shrub outlines, flat at the base. */
function thicket(x0: number, x1: number, ground: number, seed: number) {
  const r = rng(seed);
  const out: string[] = [];
  let x = x0;
  while (x < x1) {
    const rx = 7 + r() * 9;
    const ry = 6 + r() * 10;
    out.push(scallop(x + rx, ground - ry * 0.55, rx, ry, seed * 13 + out.length, 8, 0.2));
    x += rx * (1.1 + r() * 0.5);
  }
  return out;
}

/** A root system: a few branching strokes fanning down and out from a point. */
function roots(x: number, y: number, spread: number, depth: number, seed: number) {
  const r = rng(seed);
  const strokes: string[] = [];
  const arms = 7;
  for (let i = 0; i < arms; i++) {
    const t = i / (arms - 1) - 0.5; // -0.5 … 0.5
    const ex = x + t * spread * 2 * (0.8 + r() * 0.3);
    const ey = y + depth * (0.45 + (0.5 - Math.abs(t)) * 0.9) * (0.85 + r() * 0.3);
    const mx = x + t * spread * 0.6;
    const my = y + depth * 0.25;
    strokes.push(`M${x + t * 14} ${y} Q${f(mx)} ${f(my)} ${f(ex)} ${f(ey)}`);
    // a small fork off each arm
    const fx = (x + ex) / 2 + t * 10;
    const fy = (y + ey) / 2 + 4;
    strokes.push(`M${f(fx)} ${f(fy)} q${f(t * 26 + (r() - 0.5) * 10)} ${f(8 + r() * 10)} ${f(t * 36)} ${f(14 + r() * 8)}`);
  }
  return strokes;
}

/** An open, smoothed line through points — Catmull-Rom, as cubic Béziers. */
function curve(pts: (readonly [number, number])[]) {
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

/** Points along y = fn(x), every `step` units, for `curve`. */
const along = (fn: (x: number) => number, x0: number, x1: number, step = 10) => {
  const pts: [number, number][] = [];
  for (let x = x0; x < x1; x += step) pts.push([x, fn(x)]);
  pts.push([x1, fn(x1)]);
  return pts;
};

/**
 * Mulch in section: short strokes scattered between two edges, lying mostly
 * flat the way chips settle. Split into `groups` so they can fade in staggered
 * without one path per chip.
 */
function chips(x0: number, x1: number, top: (x: number) => number, bottom: (x: number) => number, count: number, seed: number, size = 3.2, groups = 3) {
  const r = rng(seed);
  const out = Array.from({ length: groups }, () => "");
  for (let i = 0; i < count; i++) {
    const x = x0 + r() * (x1 - x0);
    const t = top(x);
    const y = t + 1.2 + r() * Math.max(bottom(x) - t - 2.4, 0);
    const len = size * (0.6 + r() * 0.7);
    const a = (r() - 0.5) * 1.1;
    out[i % groups] += `M${f(x - (Math.cos(a) * len) / 2)} ${f(y - (Math.sin(a) * len) / 2)} l${f(Math.cos(a) * len)} ${f(Math.sin(a) * len)}`;
  }
  return out;
}

/**
 * Crushed stone in section: small angular outlines on a loose grid between two
 * edges. Angular, not round: a compacted base is crusher run that locks
 * together, where the washed stone in a French drain is round so water passes.
 */
function aggregate(x0: number, x1: number, top: (x: number) => number, bottom: (x: number) => number, seed: number, groups = 4) {
  const r = rng(seed);
  const out = Array.from({ length: groups }, () => "");
  let n = 0;
  for (let x = x0 + 4; x < x1 - 3; x += 8) {
    const t = top(x);
    const b = bottom(x);
    for (let y = t + 4.5; y < b - 3; y += 7) {
      if (r() < 0.14) continue;
      const cx = x + (r() - 0.5) * 3.4;
      const cy = y + (r() - 0.5) * 2.6;
      const rad = 1.5 + r() * 1.4;
      const k = r() < 0.55 ? 3 : 4;
      const rot = r() * Math.PI * 2;
      let d = "";
      for (let j = 0; j < k; j++) {
        const a = rot + (j / k) * Math.PI * 2 + (r() - 0.5) * 0.5;
        const rr = rad * (0.75 + r() * 0.45);
        d += `${j ? "L" : "M"}${f(cx + Math.cos(a) * rr)} ${f(cy + Math.sin(a) * rr)}`;
      }
      out[n++ % groups] += d + "Z";
    }
  }
  return out;
}

// ── Motion ──────────────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;

// Every variant set has a `shown` state: the finished drawing with no
// transition, which is what reduced motion gets. The plate always STARTS from
// `hidden`, because reduced motion is unknown while prerendering and a start
// state that depended on it broke hydration (CLAUDE.md, "Reduced motion").
const shown = { pathLength: 1, opacity: 1, transition: { duration: 0 } };

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  shown,
  visible: (i: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: 0.1 + i * 0.12, duration: 1.4, ease: EASE },
      opacity: { delay: 0.1 + i * 0.12, duration: 0.2 },
    },
  }),
};

/** For anything a pathLength animation would break (dashes, hatching, text). */
const fade: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 0 } },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { delay: 0.35 + i * 0.12, duration: 0.8, ease: EASE },
  }),
};

type Tone = "base" | "strong" | "accent" | "faint";
const toneClass: Record<Tone, string> = {
  base: "text-foreground/55",
  strong: "text-foreground/90",
  accent: "text-primary",
  faint: "text-foreground/25",
};

/** A drawn line. `step` staggers it into the sequence. */
const L = ({ d, tone = "base", step = 0, w = 1.25 }: { d: string; tone?: Tone; step?: number; w?: number }) => (
  <motion.path
    d={d}
    variants={draw}
    custom={step}
    fill="none"
    stroke="currentColor"
    strokeWidth={w}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={toneClass[tone]}
  />
);

/** A dashed line: fades in rather than draws, since a draw would erase the dashes. */
const D = ({ d, tone = "base", step = 0, w = 1.1, dash = "5 4" }: { d: string; tone?: Tone; step?: number; w?: number; dash?: string }) => (
  <motion.path
    d={d}
    variants={fade}
    custom={step}
    fill="none"
    stroke="currentColor"
    strokeWidth={w}
    strokeDasharray={dash}
    strokeLinecap="round"
    className={toneClass[tone]}
  />
);

/** A filled region — hatching, stone, water. */
const Fill = ({ d, fill, step = 0, className }: { d: string; fill: string; step?: number; className?: string }) => (
  <motion.path d={d} variants={fade} custom={step} fill={fill} stroke="none" className={className} />
);

/** Texture drawn as strokes — mulch chips, crushed stone. Fades in, like hatching. */
const Grain = ({ d, step = 0, w = 0.8, className = "text-foreground/40" }: { d: string; step?: number; w?: number; className?: string }) => (
  <motion.path
    d={d}
    variants={fade}
    custom={step}
    fill="none"
    stroke="currentColor"
    strokeWidth={w}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  />
);

/**
 * A callout: a dot on the thing, a leader, and a label. Rendered only when the
 * plate is large enough to read it.
 */
const Note = ({
  at,
  to,
  children,
  anchor = "start",
  step = 6,
  tone = "strong",
}: {
  at: [number, number];
  to: [number, number];
  children: ReactNode;
  anchor?: "start" | "end" | "middle";
  step?: number;
  tone?: Tone;
}) => {
  const [ax, ay] = at;
  const [tx, ty] = to;
  const dx = anchor === "end" ? -4 : anchor === "start" ? 4 : 0;
  return (
    <motion.g variants={fade} custom={step} className={toneClass[tone]} data-plate-label="">
      <circle cx={ax} cy={ay} r={1.9} fill="currentColor" className="text-primary" />
      <path
        d={`M${ax} ${ay} L${tx} ${ty}`}
        stroke="currentColor"
        strokeWidth={0.75}
        fill="none"
            className="text-foreground/45"
      />
      <text
        x={tx + dx}
        y={ty + 3.2}
        textAnchor={anchor}
        fill="currentColor"
        className="font-sans"
        style={{ fontSize: 8.6, fontWeight: 600, letterSpacing: "0.12em" }}
      >
        {children}
      </text>
    </motion.g>
  );
};

/** Arrowhead at the end of a straight segment. */
const arrow = (x1: number, y1: number, x2: number, y2: number, size = 5) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const l = [x2 - size * Math.cos(a - 0.45), y2 - size * Math.sin(a - 0.45)];
  const r = [x2 - size * Math.cos(a + 0.45), y2 - size * Math.sin(a + 0.45)];
  return `M${x1} ${y1} L${x2} ${y2} M${f(l[0])} ${f(l[1])} L${x2} ${y2} L${f(r[0])} ${f(r[1])}`;
};

/** The engineering symbol for a water table: an inverted triangle over two short bars. */
const waterTable = (x: number, y: number) =>
  `M${x - 5} ${y - 8} L${x + 5} ${y - 8} L${x} ${y - 1} Z M${x - 6} ${y + 2.5} L${x + 6} ${y + 2.5} M${x - 3.5} ${y + 5} L${x + 3.5} ${y + 5}`;

/** SVG pattern defs shared by every plate. Ids are namespaced per plate so two on one page can't collide. */
const Patterns = ({ id }: { id: string }) => (
  <defs>
    <pattern id={`${id}-earth`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="7" stroke="currentColor" strokeWidth="0.8" className="text-foreground/[0.13]" />
    </pattern>
    <pattern id={`${id}-fill`} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
      <line x1="0" y1="0" x2="0" y2="9" stroke="currentColor" strokeWidth="0.8" className="text-primary/40" />
    </pattern>
    <pattern id={`${id}-cut`} width="5" height="5" patternUnits="userSpaceOnUse">
      <circle cx="2.5" cy="2.5" r="0.7" fill="currentColor" className="text-foreground/35" />
    </pattern>
    <pattern id={`${id}-water`} width="16" height="6" patternUnits="userSpaceOnUse">
      <path d="M0 3 Q4 1 8 3 T16 3" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-foreground/30" />
    </pattern>
  </defs>
);

// ── The drawings ────────────────────────────────────────────────────────────
// Each is a viewBox of 480 × 300, and each returns its drawing plus its notes
// separately so `compact` can drop the notes.

type Drawing = { art: ReactNode; notes: ReactNode };

function clearing(id: string): Drawing {
  const G = 238; // ground line
  const ground = `M0 ${G + 1} C60 ${G - 2} 120 ${G + 2} 190 ${G} S320 ${G - 1} 400 ${G + 1} S460 ${G} 480 ${G}`;
  const LIMIT = 198;
  const pines = [
    { x: 24, h: 188, s: 3 },
    { x: 58, h: 206, s: 7 },
    { x: 96, h: 176, s: 11 },
    { x: 132, h: 198, s: 13 },
    { x: 170, h: 184, s: 17 },
  ].map((p) => ({ ...p, ...pine(p.x, G, p.h, p.s) }));
  const scrub = thicket(2, LIMIT - 12, G, 5);
  const oakX = 334;
  return {
    art: (
      <>
        <Fill d={`${ground} L480 300 L0 300 Z`} fill={`url(#${id}-earth)`} step={0} />
        <L d={ground} tone="strong" step={0} w={1.4} />

        {/* Uncleared woods, left of the limit: pines over a thicket. */}
        {pines.map((p, i) => (
          <g key={p.x}>
            <L d={p.trunk} step={0.8 + i * 0.15} w={1.1} />
            {p.limbs.map((d, j) => (
              <L key={j} d={d} step={1.4 + i * 0.15} w={0.9} />
            ))}
            {p.tufts.map((d, j) => (
              <L key={`t${j}`} d={d} step={1.7 + i * 0.15} w={0.9} />
            ))}
          </g>
        ))}
        {scrub.map((d, i) => (
          <L key={i} d={d} step={2.2 + (i % 4) * 0.1} w={0.9} />
        ))}

        {/* The clearing limit, flagged. */}
        <D d={`M${LIMIT} ${G + 8} L${LIMIT} 30`} tone="accent" step={3} dash="7 5" w={1.3} />
        <L d={`M${LIMIT} 30 L${LIMIT + 18} 36 L${LIMIT} 42`} tone="accent" step={3} w={1.3} />

        {/* Cleared ground: stumps pulled, shown as ghosts below grade. */}
        <D d={scallop(240, G + 18, 13, 8, 21, 9, 1)} tone="faint" step={4} />
        <D d={scallop(452, G + 16, 11, 7, 23, 9, 1)} tone="faint" step={4} />

        {/* The keeper live oak: short trunk, big sweeping limbs, a crown wider than it is tall. */}
        <L d={`M${oakX - 9} ${G} C${oakX - 7} ${G - 26} ${oakX - 8} ${G - 44} ${oakX - 16} ${G - 58} C${oakX - 34} ${G - 84} ${oakX - 62} ${G - 96} ${oakX - 88} ${G - 104}`} tone="strong" step={3.2} w={1.4} />
        <L d={`M${oakX + 9} ${G} C${oakX + 8} ${G - 30} ${oakX + 10} ${G - 48} ${oakX + 22} ${G - 62} C${oakX + 40} ${G - 82} ${oakX + 64} ${G - 94} ${oakX + 90} ${G - 100}`} tone="strong" step={3.2} w={1.4} />
        <L d={`M${oakX - 14} ${G - 56} C${oakX - 8} ${G - 80} ${oakX - 2} ${G - 100} ${oakX - 18} ${G - 126}`} tone="strong" step={3.4} w={1.2} />
        <L d={`M${oakX + 20} ${G - 60} C${oakX + 18} ${G - 86} ${oakX + 26} ${G - 106} ${oakX + 40} ${G - 124}`} tone="strong" step={3.4} w={1.2} />
        <L d={scallop(oakX + 2, G - 118, 118, 44, 31, 18, 0.5)} tone="strong" step={3.8} w={1.2} />

        {/* Protection fence at the drip line. */}
        {[222, 244, 266, 402, 424, 446].map((x) => (
          <L key={x} d={`M${x} ${G + 1} L${x} ${G - 20}`} tone="accent" step={5} w={1.4} />
        ))}
        <D d={`M222 ${G - 16} L266 ${G - 16} M402 ${G - 16} L446 ${G - 16}`} tone="accent" step={5} dash="3 3" w={1.2} />
        <D d={`M216 ${G - 150} L216 ${G - 30} M452 ${G - 150} L452 ${G - 30}`} tone="faint" step={5} dash="2 4" />

        {/* Debris out. */}
        <L d={arrow(430, 34, 470, 34, 6)} tone="accent" step={5.5} w={1.3} />
      </>
    ),
    notes: (
      <>
        <Note at={[LIMIT, 58]} to={[LIMIT + 12, 58]} anchor="start">CLEARING LIMIT</Note>
        <Note at={[96, G - 12]} to={[96, 276]} anchor="middle">UNDERBRUSH &amp; SCRUB · OUT</Note>
        <Note at={[446, G - 16]} to={[470, 212]} anchor="end">FENCED AT THE DRIP LINE</Note>
        <Note at={[oakX + 60, G - 150]} to={[470, 66]} anchor="end">KEEPER LIVE OAK</Note>
        <Note at={[240, G + 18]} to={[256, 280]}>STUMPS PULLED</Note>
        <Note at={[430, 34]} to={[424, 34]} anchor="end">DEBRIS HAULED OFF</Note>
      </>
    ),
  };
}

function trees(id: string): Drawing {
  const G = 176;
  const X = 238;
  const ground = `M0 ${G} L480 ${G}`;
  const rootStrokes = roots(X, G + 2, 96, 86, 41);
  return {
    art: (
      <>
        <Fill d={`M0 ${G} L480 ${G} L480 300 L0 300 Z`} fill={`url(#${id}-earth)`} step={0} />
        <L d={ground} tone="strong" step={0} w={1.5} />

        {/* The tree that was: a ghost above the stump. */}
        <D d={`M${X - 16} ${G - 34} L${X - 13} 70 M${X + 16} ${G - 34} L${X + 12} 70`} tone="faint" step={0.5} />
        <D d={blob(X, 56, 70, 40, 51, 18, 0.16)} tone="faint" step={0.8} />
        {[120, 88].map((y) => (
          <D key={y} d={`M${X - 22} ${y} L${X + 22} ${y}`} tone="faint" step={1} dash="2 3" />
        ))}

        {/* The stump, cut, with its rings. */}
        <L d={`M${X - 18} ${G} L${X - 16} ${G - 34} M${X + 18} ${G} L${X + 16} ${G - 34}`} tone="strong" step={1.5} />
        <L d={`M${X - 16} ${G - 34} A16 5 0 1 0 ${X + 16} ${G - 34} A16 5 0 1 0 ${X - 16} ${G - 34}`} tone="strong" step={1.8} />
        <L d={`M${X - 9} ${G - 34} A9 2.8 0 1 0 ${X + 9} ${G - 34} A9 2.8 0 1 0 ${X - 9} ${G - 34}`} step={2} />

        {/* Roots, and the root ball the excavator lifts out whole. */}
        {rootStrokes.map((d, i) => (
          <L key={i} d={d} step={2.4 + (i % 7) * 0.08} />
        ))}
        <D d={blob(X, G + 44, 112, 56, 61, 18, 0.1)} tone="accent" step={3.4} dash="6 4" />

        {/* Grind line, just below grade. */}
        <D d={`M${X - 44} ${G + 16} L${X + 44} ${G + 16}`} tone="accent" step={3.8} dash="2 3" w={1.4} />

        {/* Lifted out. */}
        <L d={arrow(X + 128, G + 30, X + 128, G - 36, 6)} tone="accent" step={4.2} w={1.4} />
      </>
    ),
    notes: (
      <>
        <Note at={[X + 40, 60]} to={[X + 120, 28]}>TREE TAKEN DOWN</Note>
        <Note at={[X - 44, G + 16]} to={[20, G + 16]} anchor="start">GRIND LINE · BELOW GRADE</Note>
        <Note at={[X - 96, G + 62]} to={[20, 262]} anchor="start">ROOT BALL</Note>
        <Note at={[X + 128, G - 30]} to={[X + 148, G - 30]} anchor="start">OR PULLED WHOLE</Note>
        <Note at={[X, G - 36]} to={[X - 60, G - 70]} anchor="end">STUMP</Note>
      </>
    ),
  };
}

function grading(id: string): Drawing {
  // The house wall, then an existing grade that falls TOWARD it (dashed) and a
  // finished grade that falls away (solid). Vertical is exaggerated — N.T.S.
  const W = 64; // outside face of the foundation wall
  const existing = `M${W} 176 C150 170 250 160 470 150`;
  const finished = `M${W} 142 C110 150 170 162 240 166 S380 170 470 172`;
  const cross = 262; // roughly where the two grades cross
  return {
    art: (
      <>
        {/* Earth below the finished grade. */}
        <Fill d={`${finished} L470 300 L${W} 300 Z`} fill={`url(#${id}-earth)`} step={0} />
        {/* Fill near the house (finished above existing), cut further out. */}
        <Fill
          d={`M${W} 142 C110 150 170 162 240 166 L${cross} 166 C200 164 130 172 ${W} 176 Z`}
          fill={`url(#${id}-fill)`}
          step={2.5}
        />
        <Fill
          d={`M${cross} 166 C320 168 400 171 470 172 L470 150 C380 154 310 160 ${cross} 166 Z`}
          fill={`url(#${id}-cut)`}
          step={2.5}
        />

        {/* House, in section: footing, stem wall, sill, wall, eave. */}
        <L d={`M18 236 L${W + 18} 236 L${W + 18} 254 L18 254 Z`} tone="strong" step={0.3} />
        <L d={`M${W - 30} 236 L${W - 30} 120 M${W} 236 L${W} 120`} tone="strong" step={0.4} />
        <L d={`M${W - 34} 120 L${W + 2} 120 M${W - 34} 114 L${W + 2} 114`} step={0.5} w={1} />
        <L d={`M${W - 30} 114 L${W - 30} 46 M${W} 114 L${W} 46`} tone="strong" step={0.6} />
        <L d={`M${W - 44} 32 L${W + 34} 58 L${W + 34} 66`} tone="strong" step={0.7} />
        <L d={`M${W - 22} 62 L${W - 8} 62 M${W - 22} 92 L${W - 8} 92 M${W - 22} 62 L${W - 22} 92 M${W - 8} 62 L${W - 8} 92`} tone="faint" step={0.8} w={0.9} />
        <D d={existing} tone="base" step={1.2} dash="6 4" w={1.2} />
        <L d={finished} tone="accent" step={1.6} w={1.8} />

        {/* Fall arrow along the finished grade. */}
        <L d={arrow(120, 134, 214, 150, 6)} tone="accent" step={3} w={1.3} />

        {/* Dimensions: 10 ft across, 6 in. down. */}
        <L d={`M${W} 104 L206 104 M${W} 98 L${W} 110 M206 98 L206 110`} step={3.4} w={0.9} />
        <L d={`M226 142 L226 163 M221 142 L231 142 M221 163 L231 163`} step={3.4} w={0.9} />
        <D d={`M${W + 2} 142 L231 142`} tone="faint" step={3.4} dash="2 3" w={0.8} />
      </>
    ),
    notes: (
      <>
        <motion.text variants={fade} custom={4} x={135} y={98} textAnchor="middle" fill="currentColor" className="font-sans text-foreground/90" style={{ fontSize: 8.6, fontWeight: 600, letterSpacing: "0.12em" }}>
          10 FT
        </motion.text>
        <motion.text variants={fade} custom={4} x={236} y={156} fill="currentColor" className="font-sans text-foreground/90" style={{ fontSize: 8.6, fontWeight: 600, letterSpacing: "0.12em" }}>
          6 IN. MIN. FALL
        </motion.text>
        <Note at={[400, 153]} to={[410, 124]} anchor="end">EXISTING GRADE · TOWARD THE HOUSE</Note>
        <Note at={[400, 171]} to={[410, 214]} anchor="end">FINISHED GRADE · AWAY FROM IT</Note>
        <Note at={[140, 160]} to={[150, 214]} anchor="start">FILL</Note>
        <Note at={[330, 163]} to={[300, 250]} anchor="start">CUT</Note>
      </>
    ),
  };
}

function pools(id: string): Drawing {
  const G = 118;
  const pool = `M44 ${G} L50 170 L112 170 C136 174 150 202 164 222 L214 224 L220 ${G}`;
  const PL = 284;
  const PR = 456;
  const pond = `M${PL} ${G} C300 124 312 142 330 154 C346 164 356 170 370 170 C386 170 398 164 414 152 C430 140 442 124 ${PR} ${G}`;
  const berms = `M${PL - 22} ${G} Q${PL - 10} ${G - 12} ${PL} ${G} M${PR} ${G} Q${PR + 10} ${G - 12} ${PR + 22} ${G}`;
  const WT = 146; // groundwater
  const WL = WT; // a pond dug to groundwater fills to the water table
  return {
    art: (
      <>
        <defs>
          <clipPath id={`${id}-pond`}>
            <path d={`${pond} Z`} />
          </clipPath>
        </defs>
        {/* Earth, with the two digs cut out of it. */}
        <Fill
          d={`M0 ${G} L44 ${G} L50 170 L112 170 C136 174 150 202 164 222 L214 224 L220 ${G} L${PL} ${G} C300 124 312 142 330 154 C346 164 356 170 370 170 C386 170 398 164 414 152 C430 140 442 124 ${PR} ${G} L480 ${G} L480 300 L0 300 Z`}
          fill={`url(#${id}-earth)`}
          step={0}
        />
        <L d={`M0 ${G} L44 ${G} M220 ${G} L${PL - 22} ${G} M${PR + 22} ${G} L480 ${G}`} tone="strong" step={0} w={1.4} />

        {/* The pool dig. */}
        <L d={pool} tone="accent" step={1} w={1.7} />
        {/* The pond, its water, and banks built up from the spoils. */}
        <L d={pond} tone="accent" step={1.6} w={1.7} />
        <L d={berms} tone="strong" step={2} />
        <g clipPath={`url(#${id}-pond)`}>
          <Fill d={`M${PL} ${WL} L${PR} ${WL} L${PR} 180 L${PL} 180 Z`} fill={`url(#${id}-water)`} step={2.2} />
          <L d={`M${PL} ${WL} L${PR} ${WL}`} step={2.2} w={1} />
        </g>

        {/* Groundwater, with the engineering symbol for a water table. */}
        <D d={`M0 ${WT} L480 ${WT}`} tone="base" step={2.8} dash="10 5" />
        <L d={waterTable(250, WT)} tone="strong" step={3} w={1} />

        {/* Spoils out of the pool dig. */}
        <L d={`M132 ${G - 8} C146 76 180 58 226 52`} tone="accent" step={3.4} w={1.3} />
        <L d={arrow(222, 51, 236, 52, 6)} tone="accent" step={3.6} w={1.3} />
      </>
    ),
    notes: (
      <>
        <Note at={[82, 170]} to={[20, 262]} anchor="start">POOL DIG · TO THE BUILDER&rsquo;S LAYOUT</Note>
        <Note at={[370, 162]} to={[462, 224]} anchor="end">POND · DUG TO THE WATER</Note>
        <Note at={[PR + 11, G - 6]} to={[462, 84]} anchor="end">BANKS FROM THE SPOILS</Note>
        <Note at={[250, WT - 4]} to={[256, 196]} anchor="start">GROUNDWATER</Note>
        <Note at={[240, 52]} to={[246, 52]} anchor="start">SPOILS HAULED OFF</Note>
      </>
    ),
  };
}

function drainage(id: string): Drawing {
  const surface = `M0 108 L36 108 C60 110 84 132 110 132 C136 132 158 112 186 110 L262 112 L338 114 L480 122`;
  const T = { l: 270, r: 330, top: 113, bot: 236 }; // trench
  const r = rng(71);
  const stones: string[] = [];
  for (let y = 150; y < T.bot - 5; y += 8.5) {
    for (let x = T.l + 8; x < T.r - 6; x += 9) {
      const cx = x + (r() - 0.5) * 3.5;
      const cy = y + (r() - 0.5) * 3;
      if (Math.hypot(cx - 300, cy - 212) < 17) continue; // leave room for the pipe
      const rad = 2.4 + r() * 1.3;
      stones.push(`M${f(cx + rad)} ${f(cy)} A${f(rad)} ${f(rad)} 0 1 0 ${f(cx - rad)} ${f(cy)} A${f(rad)} ${f(rad)} 0 1 0 ${f(cx + rad)} ${f(cy)}`);
    }
  }
  const holes = [205, 230, 255, 285, 310, 335].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return [f(300 + Math.cos(a) * 7.5), f(212 - Math.sin(a) * 7.5)] as const;
  });
  return {
    art: (
      <>
        <Fill
          d={`${surface.replace(`L${T.l} 112`, "").replace(`L${T.r} 114`, "")} L480 300 L0 300 Z`}
          fill={`url(#${id}-earth)`}
          step={0}
        />
        <L d={surface} tone="strong" step={0} w={1.5} />

        {/* Swale, with surface water moving along it. */}
        <L d={arrow(66, 118, 96, 128, 5)} tone="accent" step={2} />
        <L d={arrow(156, 118, 126, 128, 5)} tone="accent" step={2} />

        {/* The French drain in section: trench, fabric, stone, pipe. */}
        <L d={`M${T.l} ${T.top} L${T.l} ${T.bot} L${T.r} ${T.bot} L${T.r} ${T.top + 1}`} tone="strong" step={1} />
        <D d={`M${T.l + 5} 146 L${T.l + 5} ${T.bot - 5} L${T.r - 5} ${T.bot - 5} L${T.r - 5} 146 Z`} tone="accent" step={1.6} dash="4 3" />
        <L d={`M${T.l} 146 L${T.r} 146`} step={1.6} />
        {stones.map((d, i) => (
          <motion.path key={i} d={d} variants={fade} custom={2 + (i % 5) * 0.05} fill="none" stroke="currentColor" strokeWidth={0.8} className="text-foreground/40" />
        ))}
        <L d="M312 212 A12 12 0 1 0 288 212 A12 12 0 1 0 312 212" tone="accent" step={2.6} w={1.8} />
        {holes.map(([cx, cy], i) => (
          <motion.circle key={i} cx={cx} cy={cy} r={1.3} variants={fade} custom={2.8} fill="currentColor" className="text-primary" />
        ))}

        {/* Water drawn in from the soil on both sides. */}
        <L d={arrow(236, 190, 262, 196, 5)} tone="accent" step={3.2} />
        <L d={arrow(364, 190, 338, 196, 5)} tone="accent" step={3.2} />
      </>
    ),
    notes: (
      <>
        <Note at={[110, 132]} to={[110, 170]} anchor="middle">SWALE</Note>
        <Note at={[T.r - 5, 170]} to={[420, 160]} anchor="end">FILTER FABRIC</Note>
        <Note at={[T.l + 16, 176]} to={[196, 238]} anchor="end">WASHED STONE</Note>
        <Note at={[312, 212]} to={[420, 244]} anchor="end">PERFORATED PIPE · TO AN OUTLET</Note>
        <Note at={[T.l + 10, 130]} to={[236, 70]} anchor="end">SOIL &amp; SOD</Note>
      </>
    ),
  };
}

function pavers(id: string): Drawing {
  // A patio against the house, in section. The finished surface falls away
  // from the wall and every layer under it runs parallel to it. The base is
  // drawn deep on purpose: the pavers are the part people see, the base is
  // the part that decides whether they stay flat, and it is the dirt work.
  const W = 60; // outside face of the foundation wall
  const E = 352; // open edge of the patio: inside face of the edge restraint
  const X2 = 392; // the base runs on past the restraint
  const top = (x: number) => 126 + ((x - W) / (E - W)) * 8; // finished surface
  const P = 13; // paver
  const S = 5; // bedding sand
  const B = 40; // aggregate base
  const sandTop = (x: number) => top(x) + P;
  const baseTop = (x: number) => sandTop(x) + S;
  const exc = (x: number) => baseTop(x) + B; // geotextile on the compacted subgrade
  const lawn = f(top(E) + 3); // turf sits just below the pavers, so water leaves the patio
  const seg = (fn: (x: number) => number, x0: number, x1: number) => `M${x0} ${f(fn(x0))} L${x1} ${f(fn(x1))}`;

  // Eleven pavers, chamfered on their top edges, with a sand-swept joint between each.
  const n = 11;
  const pitch = (E - W - 2) / n;
  const gap = 1.8;
  const bev = 1.6;
  let units = "";
  const joints: number[] = [];
  for (let i = 0; i < n; i++) {
    const x0 = f(W + 1 + i * pitch + (i ? gap / 2 : 0));
    const x1 = f(W + 1 + (i + 1) * pitch - (i < n - 1 ? gap / 2 : 0));
    if (i) joints.push(W + 1 + i * pitch);
    units += `M${x0} ${f(sandTop(x0))} L${x0} ${f(top(x0) + bev)} L${f(x0 + bev)} ${f(top(x0 + bev))} L${f(x1 - bev)} ${f(top(x1 - bev))} L${x1} ${f(top(x1) + bev)} L${x1} ${f(sandTop(x1))} Z`;
  }
  const jointSand = joints
    .map((x) => [3.6, 7, 10.4].map((dy) => `M${f(x + 0.55)} ${f(top(x) + dy)} A0.55 0.55 0 1 0 ${f(x - 0.55)} ${f(top(x) + dy)} A0.55 0.55 0 1 0 ${f(x + 0.55)} ${f(top(x) + dy)}`).join(""))
    .join("");

  const stone = aggregate(W, X2, baseTop, exc, 83);
  const base = `M${W} ${f(baseTop(W))} L${X2} ${f(baseTop(X2))} L${X2} ${f(exc(X2))} L${W} ${f(exc(W))} Z`;

  // Edge restraint: a vertical leg against the last paver and a flange spiked
  // into the base, set below the paver surface so the turf can cover it.
  const rt = f(top(E) + 3);
  const rb = f(baseTop(E));
  const restraint = `M${E} ${rb} L${E} ${rt} L${E + 3} ${rt} L${E + 3} ${f(rb - 3)} L${E + 20} ${f(baseTop(E + 20) - 3)} L${E + 20} ${f(baseTop(E + 20))} Z`;
  const SP = E + 12;
  const spike = `M${SP - 3} ${f(baseTop(SP) - 5)} L${SP + 3} ${f(baseTop(SP) - 5)} M${SP} ${f(baseTop(SP) - 5)} L${SP} ${f(baseTop(SP) + 24)}`;

  const r = rng(89);
  let turf = "";
  for (let x = E + 6; x < 476; x += 3 + r() * 1.6) {
    turf += `M${f(x)} ${lawn} l${f((r() - 0.5) * 2.4)} ${f(-(2.4 + r() * 3))}`;
  }

  // The base thickness, dimensioned past the end of the base.
  // 4 in. min. after compaction for "sidewalks, patios and pedestrian areas …
  // over well-drained soils": CMHA Tech Note PAV-TEC-002-22 (formerly ICPI
  // Tech Spec 2), "Construction of Interlocking Concrete Pavements", Base
  // section. Wetter or weaker soils need more, so it is drawn as a minimum.
  const DX = X2 + 10;
  const by1 = f(baseTop(X2));
  const by2 = f(exc(X2));

  return {
    art: (
      <>
        <defs>
          <pattern id={`${id}-sand`} width="3" height="3" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="0.6" fill="currentColor" className="text-foreground/55" />
          </pattern>
          <clipPath id={`${id}-base`}>
            <path d={base} />
          </clipPath>
        </defs>

        {/* Native soil and the topsoil over the base past the edge. */}
        <Fill
          d={`M${E + 3} ${lawn} L480 ${lawn} L480 300 L${W} 300 L${W} 254 L${W + 18} 254 L${W + 18} 236 L${W} 236 L${W} ${f(exc(W))} L${X2} ${by2} L${X2} ${by1} L${E + 3} ${f(baseTop(E + 3))} Z`}
          fill={`url(#${id}-earth)`}
          step={0}
        />

        {/* House, in section: footing, stem wall, sill, wall, eave. */}
        <L d={`M${W - 46} 236 L${W + 18} 236 L${W + 18} 254 L${W - 46} 254 Z`} tone="strong" step={0.3} />
        <L d={`M${W - 30} 236 L${W - 30} 110 M${W} 236 L${W} 110`} tone="strong" step={0.4} />
        <L d={`M${W - 34} 110 L${W + 2} 110 M${W - 34} 104 L${W + 2} 104`} step={0.5} w={1} />
        <L d={`M${W - 30} 104 L${W - 30} 40 M${W} 104 L${W} 40`} tone="strong" step={0.6} />
        <L d={`M${W - 44} 26 L${W + 34} 52 L${W + 34} 60`} tone="strong" step={0.7} />
        <L d={`M${W - 22} 52 L${W - 8} 52 M${W - 22} 82 L${W - 8} 82 M${W - 22} 52 L${W - 22} 82 M${W - 8} 52 L${W - 8} 82`} tone="faint" step={0.8} w={0.9} />

        {/* The excavation: geotextile on the compacted subgrade, then the base. */}
        <L d={`M${W} ${f(exc(W))} L${X2} ${by2} L${X2} ${by1}`} tone="strong" step={1} />
        <D d={`M${W + 3} ${f(exc(W + 3) - 2.6)} L${X2 - 3} ${f(exc(X2 - 3) - 2.6)} L${X2 - 3} ${f(baseTop(X2) + 6)}`} tone="accent" step={1.4} dash="4 3" />
        <g clipPath={`url(#${id}-base)`}>
          {stone.map((d, i) => (
            <Grain key={i} d={d} step={1.8 + i * 0.08} w={0.75} />
          ))}
        </g>
        <L d={seg(baseTop, W, X2)} step={2} w={1} />

        {/* Bedding sand, the pavers, and sand swept into the joints. */}
        <Fill d={`${seg(sandTop, W, E)} L${E} ${f(baseTop(E))} L${W} ${f(baseTop(W))} Z`} fill={`url(#${id}-sand)`} step={2.4} />
        <L d={units} tone="strong" step={2.6} w={1.2} />
        <motion.path d={jointSand} variants={fade} custom={3} fill="currentColor" className="text-foreground/60" />

        {/* Edge restraint, spiked into the base; turf beyond it. */}
        <L d={restraint} tone="accent" step={3} w={1.2} />
        <L d={spike} tone="accent" step={3.2} w={1.1} />
        <L d={`M${E + 3} ${lawn} L480 ${lawn}`} tone="strong" step={3} w={1.3} />
        <L d={turf} step={3.4} w={0.8} />

        {/* Water off the surface, away from the house. */}
        <L d={arrow(168, f(top(168) - 11), 300, f(top(300) - 11), 6)} tone="accent" step={3.8} w={1.3} />

        {/* Dimension: the depth of the base. */}
        <D d={`M${X2 + 2} ${by1} L${DX + 5} ${by1} M${X2 + 2} ${by2} L${DX + 5} ${by2}`} tone="faint" step={4} dash="2 3" w={0.8} />
        <L d={`M${DX} ${by1} L${DX} ${by2} M${DX - 5} ${by1} L${DX + 5} ${by1} M${DX - 5} ${by2} L${DX + 5} ${by2}`} step={4} w={0.9} />
      </>
    ),
    notes: (
      <>
        <motion.text variants={fade} custom={4.4} x={234} y={f(top(234) - 19)} textAnchor="middle" fill="currentColor" className="font-sans text-foreground/90" style={{ fontSize: 8.6, fontWeight: 600, letterSpacing: "0.12em" }}>
          FALLS AWAY FROM THE HOUSE
        </motion.text>
        <motion.text variants={fade} custom={4.4} x={DX + 9} y={f((by1 + by2) / 2 + 3.2)} fill="currentColor" className="font-sans text-foreground/90" style={{ fontSize: 8.6, fontWeight: 600, letterSpacing: "0.12em" }}>
          4 IN. MIN.
        </motion.text>
        <Note at={[joints[2], f(top(joints[2]) + 2)]} to={[joints[2], 66]}>PAVERS · SAND-SWEPT JOINTS</Note>
        <Note at={[E + 1.5, f(top(E) + 9)]} to={[456, 86]} anchor="end">EDGE RESTRAINT</Note>
        <Note at={[150, f(sandTop(150) + 2.5)]} to={[150, 214]} anchor="end">BEDDING SAND</Note>
        <Note at={[222, f(baseTop(222) + 21)]} to={[222, 236]} anchor="end">COMPACTED BASE</Note>
        <Note at={[296, f(exc(296) - 2.6)]} to={[296, 258]} anchor="end">GEOTEXTILE ON COMPACTED SUBGRADE</Note>
      </>
    ),
  };
}

function beds(id: string): Drawing {
  // A shrub planted the way Clemson Extension says to (HGIC 1052, "Planting
  // Shrubs Correctly"): the hole dug two to five times wider than the root
  // ball but never deeper, the ball sitting on undisturbed soil with its top
  // at grade or a little above, the hole backfilled with the same soil that
  // came out of it, and mulch kept off the stems.
  const G = 172; // native grade
  const X = 196; // the shrub's crown
  const BL = X - 46;
  const BR = X + 46;
  const TB = G - 3; // top of the root ball: at grade or a touch above, never buried
  const BB = G + 54; // bottom of the ball
  const HL = X - 110;
  const HR = X + 110;
  const EDGE = 360; // the spade-cut bed edge, turf beyond it
  const TR = 16; // depth of the edge trench
  const M = 12; // mulch, drawn deep: N.T.S.
  const GAP = 13; // mulch pulled back from the stems

  const hole = `M${HL} ${G} C${HL + 30} ${G + 6} ${BL - 10} ${BB - 16} ${BL + 18} ${BB} L${BR - 18} ${BB} C${BR + 10} ${BB - 16} ${HR - 30} ${G + 6} ${HR} ${G}`;
  const ball = `M${BL + 4} ${TB} L${BR - 4} ${TB} Q${BR} ${TB} ${BR} ${TB + 4} C${BR + 1} ${G + 26} ${BR - 5} ${BB - 5} ${BR - 24} ${BB} L${BL + 24} ${BB} C${BL + 5} ${BB - 5} ${BL - 1} ${G + 26} ${BL} ${TB + 4} Q${BL} ${TB} ${BL + 4} ${TB} Z`;
  // Backfill: the hole less the ball, either side.
  const backfill =
    `M${HL} ${G} C${HL + 30} ${G + 6} ${BL - 10} ${BB - 16} ${BL + 18} ${BB} L${BL + 24} ${BB} C${BL + 5} ${BB - 5} ${BL - 1} ${G + 26} ${BL} ${TB + 4} L${BL} ${G} Z ` +
    `M${HR} ${G} C${HR - 30} ${G + 6} ${BR + 10} ${BB - 16} ${BR - 18} ${BB} L${BR - 24} ${BB} C${BR - 5} ${BB - 5} ${BR + 1} ${G + 26} ${BR} ${TB + 4} L${BR} ${G} Z`;

  // Mulch: 2–3 in. deep per Clemson HGIC 1052 ("Apply 2 to 3 inches of
  // natural, organic mulch over the planted area") and HGIC 1604, "Mulch"
  // ("Keep mulch 2 to 3 inches away from the stems of woody plants"). The
  // depth is the number in the callout; the gap at the stems is labelled,
  // not measured, because drawn to any scale it would vanish.
  const under = (x: number) => (x > BL && x < BR ? TB : G);
  const r = rng(97);
  const jit = () => (r() - 0.5) * 2.2;
  const mulchLeft: [number, number][] = [[24, G], [32, G - M + 3]];
  for (let x = 44; x < X - GAP - 8; x += 12) mulchLeft.push([x, G - M + jit()]);
  mulchLeft.push([X - GAP - 4, G - M + 3], [X - GAP, TB]);
  const mulchRight: [number, number][] = [[X + GAP, TB], [X + GAP + 4, G - M + 3]];
  for (let x = X + GAP + 14; x < EDGE - 22; x += 12) mulchRight.push([x, G - M + jit()]);
  mulchRight.push([EDGE - 18, G - M + 2], [EDGE - 10, G + 4]);
  const mulchTopLeft = curve(mulchLeft);
  const mulchTopRight = curve(mulchRight);
  const mulchArea =
    `${mulchTopLeft} L${X - GAP} ${TB} L${BL} ${TB} L${BL} ${G} L24 ${G} Z ` +
    `${mulchTopRight} L${EDGE - 10} ${G + 4} L${EDGE - 20} ${G} L${BR} ${G} L${BR} ${TB} L${X + GAP} ${TB} Z`;
  const mulchChips = chips(24, EDGE - 10, () => G - M - 1, under, 260, 101, 2.6);

  // The shrub: a crown of stems out of the top of the ball under a low,
  // spreading mound, wider than it is tall.
  const stems = [
    `M${X - 3} ${TB} C${X - 5} ${TB - 12} ${X - 16} ${TB - 22} ${X - 30} ${TB - 36}`,
    `M${X} ${TB} C${X + 1} ${TB - 16} ${X - 2} ${TB - 32} ${X + 1} ${TB - 54}`,
    `M${X + 3} ${TB} C${X + 6} ${TB - 12} ${X + 17} ${TB - 21} ${X + 32} ${TB - 33}`,
  ];
  const twigs = [
    `M${X - 14} ${TB - 22} Q${X - 18} ${TB - 34} ${X - 16} ${TB - 46}`,
    `M${X - 1} ${TB - 30} Q${X - 10} ${TB - 40} ${X - 20} ${TB - 52}`,
    `M${X} ${TB - 36} Q${X + 10} ${TB - 44} ${X + 18} ${TB - 54}`,
    `M${X + 15} ${TB - 20} Q${X + 20} ${TB - 32} ${X + 18} ${TB - 44}`,
  ];
  const flare = `M${X - 8} ${TB} Q${X - 3} ${TB - 1} ${X - 3} ${TB - 7} M${X + 8} ${TB} Q${X + 3} ${TB - 1} ${X + 3} ${TB - 7}`;
  const canopy = scallop(X, G - 46, 68, 34, 103, 26, 0.7);
  const rootStrokes = roots(X, TB + 3, 30, 40, 107);

  let turf = "";
  for (let x = EDGE + 4; x < 476; x += 3 + r() * 1.6) {
    turf += `M${f(x)} ${G} l${f((r() - 0.5) * 2.4)} ${f(-(2.4 + r() * 3))}`;
  }

  return {
    art: (
      <>
        <defs>
          <clipPath id={`${id}-ball`}>
            <path d={ball} />
          </clipPath>
          <clipPath id={`${id}-mulch`}>
            <path d={mulchArea} />
          </clipPath>
        </defs>

        {/* Native soil, less the planting hole and the edge trench. */}
        <Fill
          d={`M0 ${G} L${HL} ${G} ${hole.replace(/^M\S+ \S+/, "")} L${EDGE - 20} ${G} L${EDGE} ${G + TR} L${EDGE} ${G} L480 ${G} L480 300 L0 300 Z`}
          fill={`url(#${id}-earth)`}
          step={0}
        />
        <L d={`M0 ${G} L${BL} ${G} M${BR} ${G} L${EDGE - 20} ${G} L${EDGE} ${G + TR} L${EDGE} ${G} L480 ${G}`} tone="strong" step={0} w={1.4} />

        {/* The hole, dug wide; the same soil back in around the ball. */}
        <D d={hole} step={1} dash="6 4" w={1.2} />
        <Fill d={backfill} fill={`url(#${id}-fill)`} step={1.6} />

        {/* The root ball, its top at grade, on undisturbed soil. */}
        <L d={ball} tone="strong" step={1.2} w={1.4} />
        <g clipPath={`url(#${id}-ball)`}>
          {rootStrokes.map((d, i) => (
            <L key={i} d={d} step={1.8 + (i % 7) * 0.08} w={0.9} />
          ))}
        </g>

        {/* The shrub. */}
        {stems.map((d, i) => (
          <L key={i} d={d} tone="strong" step={2.2 + i * 0.1} w={1.3} />
        ))}
        {twigs.map((d, i) => (
          <L key={`w${i}`} d={d} step={2.4 + i * 0.05} w={0.9} />
        ))}
        <L d={flare} tone="strong" step={2.2} w={1.1} />
        <L d={canopy} tone="strong" step={2.6} w={1.2} />

        {/* Mulch, pulled back from the stems. */}
        <L d={mulchTopLeft} step={3} w={1} />
        <L d={mulchTopRight} step={3} w={1} />
        <g clipPath={`url(#${id}-mulch)`}>
          {mulchChips.map((d, i) => (
            <Grain key={i} d={d} step={3.2 + i * 0.1} w={0.8} className="text-foreground/45" />
          ))}
        </g>

        {/* Turf beyond the edge. */}
        <L d={turf} step={3.4} w={0.8} />

      </>
    ),
    notes: (
      <>
        <Note at={[X - 5, TB]} to={[118, 152]} anchor="end">ROOT FLARE AT GRADE</Note>
        <Note at={[X + GAP + 2, G - 7]} to={[268, 150]}>2–3 IN. MULCH · KEPT OFF THE STEMS</Note>
        <Note at={[HL + 34, G + 16]} to={[HL + 26, 254]}>HOLE DUG WIDE · NATIVE SOIL BACK IN</Note>
        <Note at={[X, BB + 1]} to={[300, 236]}>BALL ON UNDISTURBED SOIL</Note>
        <Note at={[EDGE - 2, G + TR - 3]} to={[470, 200]} anchor="end">SPADE-CUT BED EDGE</Note>
      </>
    ),
  };
}

function mulching(id: string): Drawing {
  // Forestry mulching, read left to right: keepers standing, the ground
  // already mulched (the brush that was there drawn as a ghost), the head
  // working, and brush still standing ahead of it. The point of the drawing
  // is what stays: the trees, the stumps, the roots and the mulch itself.
  const G = 216;
  const ground = (x: number) => G + Math.sin(x / 58) * 1.4 + Math.sin(x / 21 + 1) * 0.5;
  const groundLine = curve(along(ground, 0, 480, 10));
  const H = 384; // the mulching head's drum
  const DR = 11; // drum radius
  const CY = G - DR - 2;
  const END = H - 20; // where the mulch layer ends, just behind the head

  const r = rng(113);
  const mulchPts = along((x) => ground(x) - 9 + (r() - 0.5) * 2.4, 0, END - 8, 12);
  mulchPts.push([END, ground(END) - 3]);
  const mulchTopLine = curve(mulchPts);
  const mulchArea = `${mulchTopLine} L${END} ${f(ground(END))} ${curve(along(ground, 0, END, 10).reverse()).replace(/^M/, "L")} Z`;
  const mulchChips = chips(0, END, (x) => ground(x) - 11, ground, 320, 127, 3.4);

  const keepers = [
    { x: 34, h: 182, s: 19 },
    { x: 94, h: 196, s: 29 },
  ].map((p) => ({ ...p, ...pine(p.x, G, p.h, p.s) }));
  const FLAG = G - 58;
  const flag = (x: number) => `M${x - 3.5} ${FLAG} L${x + 3.5} ${FLAG} M${x + 3.5} ${FLAG} l5 5 M${x + 3.5} ${FLAG} l2.5 7.5`;

  // What was there: brush and saplings, as a ghost over the mulch.
  const ghostBrush = thicket(126, END - 24, G - 4, 131);
  const saplings = [
    { x: 246, h: 74, s: 139 },
    { x: 314, h: 64, s: 149 },
  ];
  const stumps = [{ x: 168, s: 137 }, ...saplings];

  // Ahead of the head: brush still standing.
  const ahead = thicket(H + 26, 478, G, 151);
  const SAP = 448;

  // The head: a drum of teeth under a hood, pushed on arms from a carrier
  // that is not drawn — the arms end in a break line, the drafting mark for
  // "continues, not shown".
  const teeth = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2 + 0.26;
    return `M${f(H + Math.cos(a) * DR)} ${f(CY + Math.sin(a) * DR)} L${f(H + Math.cos(a) * (DR + 3.2))} ${f(CY + Math.sin(a) * (DR + 3.2))}`;
  }).join(" ");
  const hood = `M${H - 22} ${G - 6} L${H - 22} ${G - 28} Q${H - 22} ${G - 34} ${H - 16} ${G - 34} L${H + 4} ${G - 34} C${H + 16} ${G - 34} ${H + 23} ${G - 28} ${H + 23} ${G - 14}`;
  const u = [-0.77, -0.64] as const; // up and back, toward the carrier
  const v = [0.64, -0.77] as const; // across the arm
  // Both arm lines start on the hood's back plate and stop on one line square
  // to them, where the break line goes.
  const LEN = 40;
  const lower = [H - 22, G - 14] as const;
  const upper = [H - 22, G - 26] as const;
  const lift = (upper[1] - lower[1]) * u[1]; // how far `upper` already sits along the arm
  const tip = (p: readonly [number, number], len: number) => [p[0] + u[0] * len, p[1] + u[1] * len] as const;
  const lowerEnd = tip(lower, LEN + lift);
  const upperEnd = tip(upper, LEN);
  const arms = `M${lower[0]} ${lower[1]} L${f(lowerEnd[0])} ${f(lowerEnd[1])} M${upper[0]} ${upper[1]} L${f(upperEnd[0])} ${f(upperEnd[1])}`;
  const e = [(lowerEnd[0] + upperEnd[0]) / 2, (lowerEnd[1] + upperEnd[1]) / 2] as const;
  const brk = [
    [e[0] - v[0] * 10, e[1] - v[1] * 10],
    [e[0] - v[0] * 2.5, e[1] - v[1] * 2.5],
    [e[0] - v[0] * 1 + u[0] * 3.5, e[1] - v[1] * 1 + u[1] * 3.5],
    [e[0] + v[0] * 1 - u[0] * 3.5, e[1] + v[1] * 1 - u[1] * 3.5],
    [e[0] + v[0] * 2.5, e[1] + v[1] * 2.5],
    [e[0] + v[0] * 10, e[1] + v[1] * 10],
  ]
    .map(([x, y], i) => `${i ? "L" : "M"}${f(x)} ${f(y)}`)
    .join("");
  // A centre mark on the drum's shaft, as any circle on a detail sheet gets.
  const centre = `M${H - 3.5} ${CY} L${H + 3.5} ${CY} M${H} ${CY - 3.5} L${H} ${CY + 3.5}`;
  // Chips thrown back onto the ground behind the head.
  let spray = "";
  for (let i = 0; i < 9; i++) {
    const x = H - 26 - r() * 12;
    const y = G - 12 - r() * 12;
    const a = Math.PI + 0.5 + (r() - 0.5) * 0.9;
    spray += `M${f(x)} ${f(y)} l${f(Math.cos(a) * 3)} ${f(Math.sin(a) * 3)}`;
  }

  return {
    art: (
      <>
        <defs>
          <clipPath id={`${id}-mulch`}>
            <path d={mulchArea} />
          </clipPath>
        </defs>

        <Fill d={`${groundLine} L480 300 L0 300 Z`} fill={`url(#${id}-earth)`} step={0} />
        <L d={groundLine} tone="strong" step={0} w={1.4} />

        {/* The brush that was there, ghosted. */}
        {ghostBrush.map((d, i) => (
          <D key={i} d={d} tone="faint" step={0.6 + (i % 4) * 0.08} />
        ))}
        {saplings.map((s) => (
          <g key={s.x}>
            <D d={`M${s.x} ${G - 4} L${s.x + 1} ${G - s.h}`} tone="faint" step={0.8} />
            <D d={scallop(s.x + 1, G - s.h - 6, 14, 11, s.s, 8, 0.7)} tone="faint" step={0.9} />
          </g>
        ))}

        {/* Keepers, flagged. */}
        {keepers.map((p, i) => (
          <g key={p.x}>
            <L d={p.trunk} tone="strong" step={1 + i * 0.15} w={1.3} />
            {p.limbs.map((d, j) => (
              <L key={j} d={d} tone="strong" step={1.4 + i * 0.15} w={1} />
            ))}
            {p.tufts.map((d, j) => (
              <L key={`t${j}`} d={d} tone="strong" step={1.7 + i * 0.15} w={1} />
            ))}
            <L d={flag(p.x)} tone="accent" step={2.2} w={1.3} />
          </g>
        ))}

        {/* Stumps cut low, roots left where they are. */}
        {stumps.map((s, i) => (
          <g key={s.x}>
            <L d={`M${s.x - 5.5} ${f(ground(s.x) + 1)} L${s.x - 3.5} ${G - 12} L${s.x + 3.5} ${G - 12} L${s.x + 5.5} ${f(ground(s.x) + 1)}`} tone="strong" step={2.4 + i * 0.1} w={1.2} />
            {roots(s.x, f(ground(s.x) + 1), 15, 26, s.s * 3).map((d, j) => (
              <L key={j} d={d} step={2.6 + i * 0.1 + (j % 7) * 0.05} w={0.85} />
            ))}
          </g>
        ))}

        {/* The mulch layer, left on the ground. */}
        <L d={mulchTopLine} step={3} w={1} />
        <g clipPath={`url(#${id}-mulch)`}>
          {mulchChips.map((d, i) => (
            <Grain key={i} d={d} step={3.2 + i * 0.1} w={0.9} className="text-foreground/45" />
          ))}
        </g>

        {/* Brush still standing ahead of the head. */}
        {ahead.map((d, i) => (
          <L key={i} d={d} step={1.2 + (i % 4) * 0.1} w={0.9} />
        ))}
        <L d={`M${SAP} ${G} L${SAP + 1} ${G - 58}`} step={1.2} w={1} />
        <L d={scallop(SAP + 1, G - 64, 15, 12, 157, 8, 0.7)} step={1.4} w={0.9} />

        {/* The mulching head. */}
        <L d={`M${H + DR} ${CY} A${DR} ${DR} 0 1 0 ${H - DR} ${CY} A${DR} ${DR} 0 1 0 ${H + DR} ${CY}`} tone="accent" step={3.4} w={1.6} />
        <L d={teeth} tone="accent" step={3.6} w={1.4} />
        <L d={centre} step={3.8} w={0.9} />
        <L d={hood} tone="strong" step={3.4} w={1.4} />
        <L d={arms} tone="strong" step={3.6} w={1.3} />
        <L d={brk} step={3.8} w={1} />
        <Grain d={spray} step={4} w={1} className="text-foreground/60" />

        {/* Working forward, into the brush. */}
        <L d={arrow(H - 6, G - 50, H + 28, G - 50, 6)} tone="accent" step={4.2} w={1.3} />
      </>
    ),
    notes: (
      <>
        <Note at={[97.5, FLAG]} to={[112, FLAG]}>FLAGGED KEEPERS STAY</Note>
        <Note at={[280, G - 18]} to={[280, 112]} anchor="middle">UNDERBRUSH · GROUND WHERE IT STOOD</Note>
        <Note at={[H + 9, G - 5]} to={[470, 262]} anchor="end">MULCHING HEAD</Note>
        <Note at={[172, f(ground(172) + 18)]} to={[180, 256]}>STUMPS CUT LOW · ROOTS LEFT IN</Note>
        <Note at={[124, f(ground(124) - 4)]} to={[118, 282]}>MULCH STAYS · NOTHING HAULED OFF</Note>
      </>
    ),
  };
}

const drawings: Record<PlateId, (id: string) => Drawing> = {
  clearing,
  trees,
  grading,
  pools,
  drainage,
  beds,
  pavers,
  mulching,
};

/** What each drawing shows, for screen readers when the drawing carries meaning on its own. */
export const plateDescriptions: Record<PlateId, string> = {
  clearing:
    "Elevation drawing of a selective clear: pines and underbrush beyond a flagged clearing limit, cleared ground with stumps pulled, and a keeper live oak fenced at its drip line.",
  trees:
    "Section drawing of a stump: the tree taken down above, the grind line just below grade, and the whole root ball the excavator can pull out instead.",
  grading:
    "Section drawing at a house foundation: the existing grade falling toward the house, the finished grade falling away from it, with at least 6 inches of fall in the first 10 feet.",
  pools:
    "Section drawing of a pool dig to the builder's layout and a pond dug down to groundwater, with banks built from the spoils and the rest hauled off.",
  drainage:
    "Section drawing of a surface swale and a French drain: a trench lined with filter fabric, filled with washed stone, around a perforated pipe running to an outlet.",
  beds:
    "Section drawing of a planted shrub: the top of the root ball at grade, set on undisturbed soil in a hole dug much wider than the ball and backfilled with the native soil, 2 to 3 inches of mulch kept off the stems, and a spade-cut edge where the bed meets the lawn.",
  pavers:
    "Section drawing of a paver patio against a house: pavers with sand-swept joints on a thin layer of bedding sand, over a compacted aggregate base at least 4 inches thick, geotextile on the compacted subgrade, an edge restraint at the open end, and the surface falling away from the house.",
  mulching:
    "Section drawing of forestry mulching: flagged keeper trees left standing, underbrush ground in place by a mulching head into a layer of mulch left on the ground, stumps cut low with their roots left in the soil, and nothing hauled off.",
};

/** Title-block text for each plate. */
export const plateTitles: Record<PlateId, { view: string; caption: string }> = {
  clearing: { view: "Elevation", caption: "Selective clear" },
  trees: { view: "Section", caption: "Stump & root ball" },
  grading: { view: "Section", caption: "Grade at the foundation" },
  pools: { view: "Section", caption: "Pool dig & pond" },
  drainage: { view: "Section", caption: "Swale & French drain" },
  beds: { view: "Section", caption: "Shrub & planting bed" },
  pavers: { view: "Section", caption: "Paver patio & base" },
  mulching: { view: "Section", caption: "Forestry mulching" },
};

interface ServicePlateProps {
  plate: PlateId;
  /** Plate number in the title block, e.g. 1 → "01". */
  number?: number;
  /** Drop the callouts — for cards, where they would render too small to read. */
  compact?: boolean;
  /** Accessible description of what the drawing shows. */
  label: string;
  className?: string;
  /** Aspect of the drawing area (the title block sits below it). The drawing is 8:5 and centres inside. */
  aspect?: string;
  /** Stretch to fill a parent of fixed height instead of keeping an aspect. */
  fill?: boolean;
  /** Hide from assistive tech — for a card whose link text already names the service. */
  decorative?: boolean;
}

const ServicePlate = ({
  plate,
  number,
  compact = false,
  label,
  className,
  aspect = "aspect-[8/5]",
  fill = false,
  decorative = false,
}: ServicePlateProps) => {
  const reduce = useReducedMotion();
  const id = `plate-${plate}${compact ? "-c" : ""}`;
  const { art, notes } = drawings[plate](id);
  const title = plateTitles[plate];

  return (
    <figure
      className={cn(
        "on-forest flex flex-col overflow-hidden rounded-lg border border-border bg-forest text-foreground",
        className
      )}
    >
      <div className={cn("relative", fill ? "min-h-[15rem] flex-1" : aspect)}>
        {/* Registration ticks in the corners: a drawing sheet, not a card. */}
        <span aria-hidden="true" className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-foreground/25" />
        <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-foreground/25" />

        <motion.svg
          viewBox="0 0 480 300"
          preserveAspectRatio="xMidYMid meet"
          {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": label })}
          className="absolute inset-0 h-full w-full"
          initial="hidden"
          whileInView={reduce ? "shown" : "visible"}
          viewport={{ once: true, margin: "-10% 0px" }}
        >
          <Patterns id={id} />
          {art}
          {/* Callouts drop below `sm` too: at phone width the 8.6-unit labels
              render around 6px, which is decoration pretending to be text. */}
          {!compact && <g className="max-sm:hidden">{notes}</g>}
        </motion.svg>
      </div>

      {/* Title block. */}
      <figcaption className="flex h-9 shrink-0 items-center justify-between gap-3 border-t border-border px-3.5 text-[0.625rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        <span className="truncate">
          {number !== undefined && (
            <span className="text-primary">{String(number).padStart(2, "0")}&nbsp;&nbsp;</span>
          )}
          {title.caption}
        </span>
        <span className="shrink-0">{title.view} · N.T.S.</span>
      </figcaption>
    </figure>
  );
};

export default ServicePlate;
