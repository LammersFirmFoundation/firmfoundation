import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { PlateId } from "@/data/services";

/**
 * Section drawings — one per core service — drawn the way a grading plan or a
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
 * - **The one number drawn is the code's, not ours**: 6 in. of fall in the
 *   first 10 ft is IRC R401.3's minimum for grade away from a foundation.
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

// ── The five drawings ───────────────────────────────────────────────────────
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

const drawings: Record<PlateId, (id: string) => Drawing> = {
  clearing,
  trees,
  grading,
  pools,
  drainage,
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
};

/** Title-block text for each plate. */
export const plateTitles: Record<PlateId, { view: string; caption: string }> = {
  clearing: { view: "Elevation", caption: "Selective clear" },
  trees: { view: "Section", caption: "Stump & root ball" },
  grading: { view: "Section", caption: "Grade at the foundation" },
  pools: { view: "Section", caption: "Pool dig & pond" },
  drainage: { view: "Section", caption: "Swale & French drain" },
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
        "on-dark flex flex-col overflow-hidden rounded-lg border border-border bg-charcoal-deep text-foreground",
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
