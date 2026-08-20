/**
 * The relit hero — Josiah's excavator photograph, given real surface relief and
 * a light that rakes across it as the pointer moves.
 *
 * The technique is depth-map relighting: a monochrome depth map turns a flat
 * photograph into a height field, surface normals are derived from its
 * gradient, and a short ray-march through the same depth map produces soft
 * self-shadowing. The dirt, the cut timber and the machine each gain their own
 * relief, and the whole frame lights like a surface rather than a picture.
 *
 * Adapted from "Relighting Images with Depth Maps and Three.js" by Dominik
 * Fojcik, published on Codrops (2026-08-19) and released under the MIT licence:
 *   https://github.com/DGFX/codrops-relightning-images
 *   Copyright (c) Dominik Fojcik
 * The normal-from-depth gradient, the photo-luminance detail term and the
 * ray-marched shadow accumulation are his; this is a re-implementation in plain
 * WebGL2 rather than his Three.js TSL/WebGPU original, because the effect is a
 * single fragment shader over one quad either way and the WebGPU build of
 * three.js costs about 150 KB brotli that this file does not.
 *
 * Two assets, and only one of them is new: the colour texture is the SAME URL
 * as the hero `<img>`, so the browser serves it from cache and the effect adds
 * no second photograph. The depth map is 11 KB of WebP.
 *
 * Why the depth map is baked blurred: an 8-bit depth map carries visible
 * quantisation stair-steps, which show up as terracing across the normals. The
 * original melts them at runtime; blurring the asset at build time removes the
 * pass entirely and costs nothing at load.
 */

export interface RelitOptions {
  /** Same URL as the hero <img>, so it comes from cache. */
  photoUrl: string;
  /** Depth map. White is near, black is far. */
  depthUrl: string;
  /** Called once the first frame is on screen, so the caller can fade it in. */
  onReady?: () => void;
}

export interface RelitHandle {
  destroy: () => void;
}

const VERT = `#version 300 es
void main() {
  // One oversized triangle: covers the viewport with no seam and one fewer
  // vertex than a quad.
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;

uniform sampler2D uPhoto;
uniform sampler2D uDepth;
uniform vec2  uResolution;
uniform vec2  uImageSize;
/** Light in normalised frame space; z is height above the surface. */
uniform vec3  uLight;
uniform float uIntro;       // 0 to 1 across the opening sweep
uniform float uMix;         // global fade-in of the whole effect

out vec4 fragColor;

const float DISPLACEMENT   = 0.34;   // how tall the height field stands
const float NORMAL_SCALE   = 1.7;
/**
 * Relief taken from the photograph's own shading. Held deliberately LOW.
 * At 0.85 this term was the loudest thing on screen and it was mostly WebP
 * block artifacts and depth terracing, not surface — the sky and the boom
 * broke into visible stair-steps. The depth map carries the shapes; this only
 * has to hint at grain.
 */
const float DETAIL_SCALE   = 0.22;
const float SHADOW_STRENGTH= 0.85;
const float SHADOW_SOFTNESS= 0.085;
const int   SHADOW_STEPS   = 12;
const float MIN_LIGHT_ANGLE= 0.15;
const float SOFTNESS_GROWTH= 3.0;
const float AMBIENT        = 0.46;   // the photo is already lit; this is a relight, not a lift

/** object-fit: cover, in UV space. */
vec2 coverUv(vec2 fragUv) {
  float frameAspect = uResolution.x / uResolution.y;
  float imageAspect = uImageSize.x / uImageSize.y;
  vec2 scale = frameAspect > imageAspect
    ? vec2(1.0, imageAspect / frameAspect)
    : vec2(frameAspect / imageAspect, 1.0);
  return (fragUv - 0.5) / scale + 0.5;
}

float depthAt(vec2 uv) {
  return texture(uDepth, clamp(uv, 0.0, 1.0)).r;
}

float lum(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

void main() {
  vec2 fragUv = gl_FragCoord.xy / uResolution;
  vec2 uv = coverUv(fragUv);

  // Outside the image (only possible mid-resize) hand back the photo untouched.
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    fragColor = vec4(texture(uPhoto, clamp(uv, 0.0, 1.0)).rgb, 1.0);
    return;
  }

  float depth = depthAt(uv);

  // ── Normals ──────────────────────────────────────────────────────────
  // Central difference over the depth map gives the large shapes: the boom,
  // the cab, the bank of cut timber.
  vec2 texel = 3.0 / uImageSize;
  float dxL = depthAt(uv - vec2(texel.x, 0.0));
  float dxR = depthAt(uv + vec2(texel.x, 0.0));
  float dyD = depthAt(uv - vec2(0.0, texel.y));
  float dyU = depthAt(uv + vec2(0.0, texel.y));
  vec2 slope = vec2(dxR - dxL, dyU - dyD) * 0.5 / texel * DISPLACEMENT * NORMAL_SCALE;

  // A second gradient, taken from the photograph's own luminance at a blurred
  // mip level, adds the fine grain the depth map is far too smooth to carry —
  // tread plate, bark, broken ground.
  vec2 dtexel = 8.0 / uImageSize;
  float lL = lum(textureLod(uPhoto, uv - vec2(dtexel.x, 0.0), 4.0).rgb);
  float lR = lum(textureLod(uPhoto, uv + vec2(dtexel.x, 0.0), 4.0).rgb);
  float lD = lum(textureLod(uPhoto, uv - vec2(0.0, dtexel.y), 4.0).rgb);
  float lU = lum(textureLod(uPhoto, uv + vec2(0.0, dtexel.y), 4.0).rgb);
  vec2 detail = vec2(lR - lL, lU - lD) * 0.5 * DETAIL_SCALE * 4.0;

  vec3 normal = normalize(vec3(-slope.x - detail.x, -slope.y - detail.y, 1.0));

  // ── Light ────────────────────────────────────────────────────────────
  vec3 surface = vec3(uv, (depth - 1.0) * DISPLACEMENT);
  vec3 toLight = uLight - surface;
  float distance = max(length(toLight), 0.001);
  vec3 lightDir = toLight / distance;

  float diffuse = max(dot(normal, lightDir), 0.0);
  // Tighter than an inverse-square in world units: this has to read as a
  // travelling pool of light on a 1600px hero, and at 2.6 the pool covered the
  // whole frame evenly, which is indistinguishable from just brightening it.
  float falloff = 1.0 / (1.0 + 6.5 * distance * distance);

  /**
   * How much of the frame the light is allowed to touch.
   *
   * The far background — sky through the canopy, distant pines — sits near zero
   * in the depth map, where the gradient is flat and noisy. Lighting it produced
   * the blocky terracing across the sky and bought nothing: nobody expects a
   * work light to reach the treeline. Masking it off removes the artifact and
   * is also the more cinematic read, because the machine and the ground it is
   * standing on are the only things that respond.
   */
  float subject = smoothstep(0.18, 0.52, depth);

  // ── Self-shadowing ───────────────────────────────────────────────────
  // March from the surface toward the light through the depth map. Anything
  // standing higher along that line occludes this pixel.
  float remaining = 1.0 - depth;
  vec2 rayStep = (lightDir.xy / max(lightDir.z, MIN_LIGHT_ANGLE)) * DISPLACEMENT * remaining;
  float occlusion = 0.0;
  for (int i = 0; i < SHADOW_STEPS; i++) {
    float t = float(i + 1) / float(SHADOW_STEPS);
    float rayDepth = depth + remaining * t;
    float blocker = depthAt(uv + rayStep * t);
    float softness = SHADOW_SOFTNESS * (1.0 + t * SOFTNESS_GROWTH);
    occlusion = max(occlusion, clamp((blocker - rayDepth) / softness, 0.0, 1.0));
  }
  float shadow = 1.0 - occlusion * SHADOW_STRENGTH * step(0.0, lightDir.z);

  // ── Composite ────────────────────────────────────────────────────────
  vec3 photo = texture(uPhoto, uv).rgb;

  // Equipment yellow, so the moving light reads as the brand rather than as a
  // generic white torch. Warm, low saturation — it is sunlight, not a spotlight.
  vec3 lightColour = vec3(1.0, 0.87, 0.63);
  float key = diffuse * falloff * shadow * subject * 5.2;

  // Ambient is applied to everything so the frame never goes black, but only
  // the subject gets the key — the treeline keeps the exposure it was shot at.
  float base = mix(1.0, AMBIENT, subject);
  vec3 lit = photo * (base + key * 1.05);
  lit += photo * lightColour * key * 0.7;

  // A hint of rim on surfaces facing the light picks the machine off the trees.
  float rim = pow(max(dot(normal, normalize(vec3(lightDir.xy, 0.55))), 0.0), 3.0);
  lit += lightColour * rim * key * 0.18;

  // The opening sweep dissolves in from the far edge, so the effect arrives as
  // light crossing the ground rather than as a layer switching on.
  float introMask = smoothstep(uIntro - 0.35, uIntro + 0.15, uv.x);
  vec3 result = mix(lit, photo, introMask);

  fragColor = vec4(mix(photo, result, uMix), 1.0);
}`;

const compile = (gl: WebGL2RenderingContext, type: number, src: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

const makeTexture = (gl: WebGL2RenderingContext, image: HTMLImageElement, mip: boolean) => {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  if (mip) {
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  } else {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }
  return texture;
};

/**
 * Returns null — never throws — when WebGL2 is unavailable, the shader will not
 * compile, or either texture fails to load. The hero `<img>` underneath is the
 * whole picture on its own, so the page is complete either way.
 */
export async function mountRelitHero(
  canvas: HTMLCanvasElement,
  options: RelitOptions
): Promise<RelitHandle | null> {
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;

  const vert = compile(gl, gl.VERTEX_SHADER, VERT);
  const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
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

  let photo: HTMLImageElement;
  let depth: HTMLImageElement;
  try {
    [photo, depth] = await Promise.all([
      loadImage(options.photoUrl),
      loadImage(options.depthUrl),
    ]);
  } catch {
    return null;
  }

  gl.useProgram(program);
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const photoTex = makeTexture(gl, photo, true);
  const depthTex = makeTexture(gl, depth, false);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, photoTex);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, depthTex);
  gl.uniform1i(gl.getUniformLocation(program, "uPhoto"), 0);
  gl.uniform1i(gl.getUniformLocation(program, "uDepth"), 1);
  gl.uniform2f(gl.getUniformLocation(program, "uImageSize"), photo.width, photo.height);

  const uResolution = gl.getUniformLocation(program, "uResolution");
  const uLight = gl.getUniformLocation(program, "uLight");
  const uIntro = gl.getUniformLocation(program, "uIntro");
  const uMix = gl.getUniformLocation(program, "uMix");

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Where the light sits when nobody is pointing at anything: high and to the
  // left, matching the direction the sun already falls in the photograph, so
  // the resting frame looks like the photo rather than an argument with it.
  const REST: [number, number] = [0.3, 0.72];
  const target: [number, number] = [...REST];
  const current: [number, number] = [...REST];

  let raf = 0;
  let destroyed = false;
  let running = false;
  let start = 0;
  let mix = 0;
  let announced = false;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(uResolution, canvas.width, canvas.height);
  };

  const INTRO_SECONDS = 2.6;

  const frame = (now: number) => {
    if (destroyed) return;
    if (!start) start = now;
    const elapsed = (now - start) / 1000;

    // Ease the light toward the pointer rather than snapping to it — the lag is
    // most of what makes it read as a heavy light rather than a cursor effect.
    current[0] += (target[0] - current[0]) * 0.06;
    current[1] += (target[1] - current[1]) * 0.06;

    resize();
    gl.uniform3f(uLight, current[0], current[1], 0.62);

    // One opening sweep, well inside five seconds, then it rests. WCAG 2.2.2
    // (Level A) covers automatic motion past that mark, and pointer response
    // afterwards is user-driven, so it is not caught by the criterion at all.
    const intro = reduced.matches ? 1 : Math.min(elapsed / INTRO_SECONDS, 1);
    gl.uniform1f(uIntro, intro * 1.5 - 0.25);

    mix = Math.min(mix + 0.04, 1);
    gl.uniform1f(uMix, mix);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (!announced) {
      announced = true;
      options.onReady?.();
    }

    // Once the intro has finished and the light has settled, stop drawing
    // entirely. The pointer wakes it again.
    const settled =
      intro >= 1 &&
      mix >= 1 &&
      Math.abs(target[0] - current[0]) < 0.0015 &&
      Math.abs(target[1] - current[1]) < 0.0015;
    if (settled) {
      running = false;
      return;
    }
    raf = requestAnimationFrame(frame);
  };

  const wake = () => {
    if (destroyed || running) return;
    running = true;
    raf = requestAnimationFrame(frame);
  };

  const onPointerMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    target[0] = (event.clientX - rect.left) / rect.width;
    // Flipped: WebGL's origin is bottom-left, the pointer's is top-left.
    target[1] = 1 - (event.clientY - rect.top) / rect.height;
    wake();
  };
  const onPointerLeave = () => {
    target[0] = REST[0];
    target[1] = REST[1];
    wake();
  };

  // Pointer, not mouse: this listens on the window so the light keeps tracking
  // while the visitor is anywhere over the hero, including over the headline
  // and the buttons sitting above the canvas.
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerleave", onPointerLeave);

  const onContextLost = (event: Event) => {
    event.preventDefault();
    destroyed = true;
    cancelAnimationFrame(raf);
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) wake();
      else {
        running = false;
        cancelAnimationFrame(raf);
      }
    },
    { threshold: 0 }
  );
  observer.observe(canvas);

  const onResize = () => wake();
  window.addEventListener("resize", onResize);

  wake();

  return {
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.deleteTexture(photoTex);
      gl.deleteTexture(depthTex);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
