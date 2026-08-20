/**
 * The survey layer — topographic contour lines drawn in raw WebGL.
 *
 * Why not three.js: this is one triangle and a function that colours pixels,
 * so a scene graph buys nothing. Measured against this repo's own toolchain on
 * 2026-08-20, an equivalent three.js hero scene (r0.185.1, tree-shaken, with
 * instancing and a custom shader) came to 106,027 bytes brotli against the
 * 198,434 the whole site's JavaScript weighs. This file ships as its own lazy
 * chunk of roughly 2.5 KB brotli. Google's crawler does not support WebGL and
 * <canvas> is not an
 * LCP-eligible element, so every pixel drawn here is decoration that has to
 * pay for itself in feel alone — and at 106 KB it could not.
 *
 * The motif is contour lines because that is the literal visual language of
 * grading and drainage. Every fifth isoline is drawn heavier, the way an index
 * contour is actually printed on a survey sheet.
 *
 * Nothing here touches `window` at import time, but the module is still only
 * ever reached through a dynamic import from the client — `vite-react-ssg`
 * prerenders in Node, and a WebGL context does not exist there.
 */

export type SurveyMode = "ambient" | "reveal";

export interface SurveyOptions {
  /** `ambient` settles into a still survey sheet; `reveal` sweeps the hero and clears. */
  mode?: SurveyMode;
  /** Isoline count. Higher reads as steeper ground. */
  density?: number;
  /** Peak opacity of the ink. */
  alpha?: number;
  /** Seconds the pass takes. Clamped under five — see WCAG 2.2.2 below. */
  duration?: number;
  /** Called once the pass has finished, so a `reveal` caller can drop the canvas. */
  onDone?: () => void;
}

export interface SurveyHandle {
  destroy: () => void;
}

/** Equipment yellow (#fcc832) in linear 0–1, matching `--brand-yellow`. */
const INK: [number, number, number] = [0.988, 0.784, 0.196];

const VERT = "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";

const FRAG = `
precision mediump float;

uniform vec2  uRes;
uniform float uTime;
uniform vec3  uInk;
uniform float uDensity;
uniform float uAlpha;
/** 0 to 1 across a single survey pass. Both modes are finite. */
uniform float uProgress;
/** 1 for the ambient layer, 0 for the one-shot hero sweep. */
uniform float uAmbient;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;

  // Frequency is keyed to the SHORT edge, never the aspect ratio. Keyed to
  // aspect, the field stretches on a tall viewport until the lines fall outside
  // the frame — at 390px the motif had all but vanished, which is exactly the
  // visitor who can least afford to lose it.
  vec2 st = gl_FragCoord.xy / min(uRes.x, uRes.y);

  float h = fbm(st * 3.1 + vec2(uTime * 0.014, uTime * 0.008));
  h += 0.35 * fbm(st * 6.4 - uTime * 0.006);

  // Isolines of the height field. The width correction keeps a line one pixel
  // wide whether the ground under it is steep or flat.
  float bands = h * uDensity;
  float d = abs(fract(bands) - 0.5);
  float line = 1.0 - smoothstep(0.0, max(fwidth(bands) * 1.2, 0.001), d);

  float idx = abs(fract(bands * 0.2) - 0.5);
  float indexLine = (1.0 - smoothstep(0.0, max(fwidth(bands * 0.2) * 1.4, 0.001), idx)) * 0.85;
  float ink = max(line * 0.55, indexLine);

  // ONE pass down the frame, in both modes. Nothing here loops: WCAG 2.2.2
  // Pause, Stop, Hide is a Level A criterion covering any automatic motion
  // lasting over five seconds, and it sits under Conformance Requirement 5.2.5
  // (Non-Interference), so failing it makes the WHOLE PAGE non-conforming even
  // though this layer is pure decoration. A reduced-motion media query does NOT
  // satisfy it — it is not among the sufficient techniques. Stopping on our own
  // well inside five seconds does, and needs no pause button on a decoration.
  // The travel runs past both edges by more than the band's own half-width,
  // so the pass fully clears the frame. Ending at 1.18 with a 0.34 band left a
  // residual glow sitting on the eyebrow text for good.
  float centre = mix(-0.40, 1.40, uProgress);
  float width  = mix(0.20, 0.34, uAmbient);
  float band   = smoothstep(width, 0.0, abs(uv.y - centre));

  // The ambient layer keeps the lines lit after the pass has gone by, so the
  // band settles into a survey sheet. The hero sweep only shows what it is
  // crossing, led by a bright hairline, and leaves nothing behind.
  // The resting floor is deliberately low: this sheet sits BEHIND live copy,
  // including a small yellow eyebrow, and contour lines crossing type is the
  // one way a decorative layer can actually cost the page something.
  float lit  = mix(band * 1.35, 0.30 + band * 1.35, uAmbient);
  float edge = (1.0 - uAmbient) * (1.0 - smoothstep(0.0, 0.005, abs(uv.y - centre))) * 0.7;
  ink = ink * lit + edge;

  // A real survey sheet clears a title block rather than printing contours
  // through its own labelling, and the same move is what keeps this layer from
  // ever costing legibility: the ink drops to a trace behind the centre of the
  // band, where the eyebrow, heading and buttons all sit, and comes back to
  // full strength out at the margins. Ambient only — the hero sweep is
  // transient and its copy sits low and left.
  vec2 fromCentre = vec2((uv.x - 0.5) / 0.46, (uv.y - 0.5) / 0.50);
  float clearing = smoothstep(0.55, 1.30, length(fromCentre));
  ink *= mix(1.0, mix(0.14, 1.0, clearing), uAmbient);

  // Never show a hard boundary: fade the layer out at every edge. The falloff
  // is kept shallow because a CTA band is short and wide — a 30% fade at each
  // end left only the middle third of a 624px section carrying any ink at all.
  float vig = smoothstep(0.0, 0.16, uv.y) * smoothstep(1.0, 0.84, uv.y);
  vig *= smoothstep(0.0, 0.07, uv.x) * smoothstep(1.0, 0.93, uv.x);

  // The hero sweep dims as it leaves, so the photograph is handed back clean.
  float fade = mix(smoothstep(1.0, 0.70, uProgress), 1.0, uAmbient);

  float a = clamp(ink, 0.0, 1.0) * vig * uAlpha * fade;
  gl_FragColor = vec4(uInk * a, a);
}
`;

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

/**
 * Attaches the layer to a canvas. Returns `null` — not a throw — when WebGL is
 * unavailable or the shader will not compile, so the caller simply renders
 * nothing and the page is unchanged.
 */
export function mountSurveyLayer(
  canvas: HTMLCanvasElement,
  options: SurveyOptions = {}
): SurveyHandle | null {
  const mode: SurveyMode = options.mode ?? "ambient";
  const density = options.density ?? 8;
  const alpha = options.alpha ?? 0.85;
  // Hard-capped under five seconds. WCAG 2.2.2 (Level A) covers any automatic
  // motion running longer than that without a pause control, so the cap — not
  // a caller's good intentions — is what keeps this layer conforming.
  const duration = Math.min(options.duration ?? (mode === "reveal" ? 2.4 : 4.5), 4.8);

  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    // This is atmosphere. It must never ask a phone for the discrete GPU.
    powerPreference: "low-power",
  });
  if (!gl) return null;

  // `fwidth` lives behind an extension in WebGL1. Without it the lines still
  // draw, just at a fixed width — a slightly softer sheet, not a broken one.
  const derivatives = gl.getExtension("OES_standard_derivatives");
  const prelude = derivatives
    ? "#extension GL_OES_standard_derivatives : enable\n"
    : "#define fwidth(x) 0.004\n";

  const vert = compile(gl, gl.VERTEX_SHADER, VERT);
  const frag = compile(gl, gl.FRAGMENT_SHADER, prelude + FRAG);
  if (!vert || !frag) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  gl.useProgram(program);

  // One oversized triangle covers the viewport with no seam down the middle
  // and one fewer vertex than a quad.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "p");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, "uRes");
  const uTime = gl.getUniformLocation(program, "uTime");
  const uProgress = gl.getUniformLocation(program, "uProgress");
  gl.uniform1f(gl.getUniformLocation(program, "uAmbient"), mode === "ambient" ? 1 : 0);
  gl.uniform3fv(gl.getUniformLocation(program, "uInk"), INK);
  gl.uniform1f(gl.getUniformLocation(program, "uDensity"), density);
  gl.uniform1f(gl.getUniformLocation(program, "uAlpha"), alpha);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const resize = () => {
    // Capped at 1.5: this is an ambient layer, not a photograph, and a 3x
    // buffer triples fragment cost for nothing anyone can see.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(uRes, canvas.width, canvas.height);
  };

  const draw = (time: number, progress: number) => {
    resize();
    gl.uniform1f(uTime, time);
    gl.uniform1f(uProgress, progress);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  let raf = 0;
  let running = false;
  let destroyed = false;
  let finished = false;
  let elapsed = 0;
  let last = 0;

  /**
   * The pass is over. The hero drops its canvas; the ambient layer keeps its
   * last frame on screen — a still survey sheet — and never animates again.
   */
  const finish = () => {
    finished = true;
    running = false;
    cancelAnimationFrame(raf);
    if (mode === "ambient") draw(duration, 1);
    options.onDone?.();
  };

  const frame = (now: number) => {
    if (destroyed) return;
    // Time is accumulated rather than measured from a fixed start, so a pass
    // interrupted by a scroll or a tab switch resumes where it stopped instead
    // of jumping forward. The clamp keeps a long stall from skipping the pass.
    const delta = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    elapsed += delta;

    const progress = Math.min(elapsed / duration, 1);
    draw(elapsed, progress);
    if (progress >= 1) {
      finish();
      return;
    }
    raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running || destroyed || finished) return;
    running = true;
    last = 0;
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Reduced motion never gets a moving frame at all. The ambient layer jumps
  // straight to the finished still; the hero sweep is skipped entirely, since a
  // sweep IS the motion and freezing one mid-pass would leave a bright bar
  // across the photograph for good.
  const applyReducedMotion = () => {
    stop();
    elapsed = duration;
    finish();
  };

  // Gates the start on visibility, so the pass plays when the band is actually
  // on screen rather than finishing above the fold, and so a layer scrolled
  // away mid-pass never keeps a phone's GPU awake.
  let onScreen = false;
  const observer = new IntersectionObserver(
    ([entry]) => {
      onScreen = entry.isIntersecting;
      if (destroyed || finished || reduced.matches) return;
      if (onScreen) start();
      else stop();
    },
    { threshold: 0 }
  );

  const syncMotion = () => {
    if (destroyed || finished) return;
    if (reduced.matches) applyReducedMotion();
  };

  // A tab switch mid-pass must not strand the band halfway down the section:
  // the observer only fires on intersection changes, so coming back needs an
  // explicit restart.
  const onVisibility = () => {
    if (destroyed || finished || reduced.matches) return;
    if (document.hidden) stop();
    else if (onScreen) start();
  };

  // iOS drops WebGL contexts under memory pressure. Swallowing the default
  // stops the browser's own "content lost" treatment; there is nothing to
  // restore because the layer is decoration.
  const onContextLost = (event: Event) => {
    event.preventDefault();
    stop();
    finished = true;
    options.onDone?.();
  };

  const onResize = () => {
    if (finished && mode === "ambient") draw(duration, 1);
  };

  reduced.addEventListener("change", syncMotion);
  document.addEventListener("visibilitychange", onVisibility);
  canvas.addEventListener("webglcontextlost", onContextLost);
  window.addEventListener("resize", onResize);

  if (reduced.matches) applyReducedMotion();
  else observer.observe(canvas);

  return {
    destroy() {
      destroyed = true;
      stop();
      observer.disconnect();
      reduced.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      window.removeEventListener("resize", onResize);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
