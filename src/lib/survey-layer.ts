/**
 * The survey layer — topographic contour lines drawn in raw WebGL.
 *
 * Why not three.js: this is one triangle and a function that colours pixels,
 * so a scene graph buys nothing. Measured against this repo's own toolchain on
 * 2026-08-20, an equivalent three.js hero scene (r0.185.1, tree-shaken, with
 * instancing and a custom shader) came to 106,027 bytes brotli against the
 * 198,434 the whole site's JavaScript weighs. This file is under a kilobyte
 * compressed. Google's crawler does not support WebGL and <canvas> is not an
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
  /** `ambient` drifts forever behind a charcoal band; `reveal` sweeps once and stops. */
  mode?: SurveyMode;
  /** Isoline count. Higher reads as steeper ground. */
  density?: number;
  /** Peak opacity of the ink. */
  alpha?: number;
  /** Seconds the one-shot sweep takes. Ignored when `mode` is `ambient`. */
  duration?: number;
  /** Called once a `reveal` sweep has finished, so the caller can drop the canvas. */
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
/** -1 while ambient; otherwise 0 to 1 sweep progress. */
uniform float uReveal;

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

  float ambient = step(uReveal, -0.5);

  // Ambient: a soft band travelling up the frame forever.
  // Reveal: one pass down the frame, driven by progress rather than the clock.
  float centre = mix(mix(-0.18, 1.18, uReveal), fract(uTime * 0.045) * 1.4 - 0.2, ambient);
  float width  = mix(0.20, 0.34, ambient);
  float band   = smoothstep(width, 0.0, abs(uv.y - centre));

  // Ambient keeps the lines faintly lit everywhere; the sweep only shows what
  // it is passing over, led by a bright hairline.
  float lit  = mix(band * 1.35, 0.45 + band * 1.5, ambient);
  float edge = (1.0 - ambient) * (1.0 - smoothstep(0.0, 0.005, abs(uv.y - centre))) * 0.7;
  ink = ink * lit + edge;

  // Never show a hard boundary: fade the layer out at every edge. The falloff
  // is kept shallow because a CTA band is short and wide — a 30% fade at each
  // end left only the middle third of a 624px section carrying any ink at all.
  float vig = smoothstep(0.0, 0.16, uv.y) * smoothstep(1.0, 0.84, uv.y);
  vig *= smoothstep(0.0, 0.07, uv.x) * smoothstep(1.0, 0.93, uv.x);

  // The sweep dims as it leaves, so the hero settles back to the photograph.
  float fade = mix(smoothstep(1.0, 0.70, uReveal), 1.0, ambient);

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
  const duration = options.duration ?? 2.2;

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
  const uReveal = gl.getUniformLocation(program, "uReveal");
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

  const draw = (time: number, reveal: number) => {
    resize();
    gl.uniform1f(uTime, time);
    gl.uniform1f(uReveal, reveal);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  let raf = 0;
  let running = false;
  let destroyed = false;
  let finished = false;
  let started = 0;

  const frame = (now: number) => {
    if (destroyed) return;
    if (!started) started = now;
    const elapsed = (now - started) / 1000;

    if (mode === "reveal") {
      const progress = Math.min(elapsed / duration, 1);
      draw(elapsed, progress);
      if (progress >= 1) {
        finished = true;
        running = false;
        options.onDone?.();
        return;
      }
    } else {
      draw(elapsed, -1);
    }
    raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running || destroyed || finished) return;
    running = true;
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Under reduced motion the ambient layer holds a designed still frame rather
  // than disappearing, and the one-shot sweep never runs at all — a sweep IS
  // the motion, so freezing one mid-pass would leave a bright bar across the
  // hero for good.
  const syncMotion = () => {
    if (destroyed) return;
    if (reduced.matches) {
      stop();
      if (mode === "ambient") draw(9, -1);
      else {
        finished = true;
        options.onDone?.();
      }
      return;
    }
    start();
  };

  // A layer that has scrolled off screen must never keep a phone's GPU awake.
  const observer =
    mode === "ambient"
      ? new IntersectionObserver(
          ([entry]) => {
            if (reduced.matches || destroyed) return;
            if (entry.isIntersecting) start();
            else stop();
          },
          { threshold: 0 }
        )
      : null;
  observer?.observe(canvas);

  const onVisibility = () => {
    if (document.hidden) stop();
    else syncMotion();
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
    if (reduced.matches && mode === "ambient") draw(9, -1);
  };

  reduced.addEventListener("change", syncMotion);
  document.addEventListener("visibilitychange", onVisibility);
  canvas.addEventListener("webglcontextlost", onContextLost);
  window.addEventListener("resize", onResize);

  syncMotion();

  return {
    destroy() {
      destroyed = true;
      stop();
      observer?.disconnect();
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
