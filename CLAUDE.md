# Firm Foundation Property Services

Marketing site for a family-run property services company in Mount Pleasant, SC (greater Charleston / Lowcountry). Owner is **Josiah Lammers**; Will owns the repo. **The entire point of this site is phone calls and quote requests** — optimise for that, not for time-on-page.

**Land clearing & excavation is the business (Josiah, 2026-09-29).** His words: make land clearing the main focus and feature tree and stump removal, grading, site prep for pools and ponds, and larger drainage projects; move small irrigation, landscaping and hardscapes out of the main messaging. His Instagram bio and ad now lead with the headline **"Land Clearing & Excavation"**, so the homepage H1, the header tagline and the share card use exactly those words: someone who taps the ad should land on the same sentence.

So `services.ts` has two tiers. **`core`** (land-clearing, tree-removal, excavation, pools-and-ponds, drainage) leads everywhere, in that order. **`more`** (hardscapes, landscaping, custom-projects) keeps its pages, because they are indexed and still bring work, but it never leads: it sits in a dashed "smaller jobs, still on request" tile, a menu sidebar, and a muted footer list. Irrigation is gone from the copy entirely; he said it isn't him long-term. `/services/tree-services` became `/services/tree-removal` with a permanent redirect in `vercel.json`. Rename any other slug the same way.

## Stack
- **Vite + React 18 + TypeScript strict + Tailwind 3** with a shadcn-style kit in `src/components/ui/`.
- **`vite-react-ssg`** prerenders every route to static HTML at build time: 20 pages, including `/services/<slug>` for all eight services and `/guides/<slug>` for all five guides via `getStaticPaths`. This is the whole SEO story — crawlers get full HTML, not an empty `#root`.
- **Vercel** hosting. One serverless function: `api/reviews.ts`.
- `framer-motion` for scroll reveals. **`leaflet`/`react-leaflet` are no longer rendered** — the homepage map became the coverage directory, and `ServiceAreaMap.tsx` is now unreferenced. Tree-shaking keeps both out of the bundle (verified), so it costs nothing shipped, but it is dead code: delete it or re-mount it, don't leave it as a third state.

## Commands
- `npm run dev` (port **8080**, proxies `/api` to production so live reviews work locally)
- `npm run build` — runs `vite-react-ssg build`. **A green build is the gate; there is no test suite.**
- `npx tsc --noEmit -p tsconfig.app.json` — must be clean.
- `npx eslint .` — **3 errors are pre-existing** shadcn/Tailwind boilerplate (`command.tsx`, `textarea.tsx` empty interfaces; `require()` in `tailwind.config.ts`). Don't count them as regressions; don't "fix" them either.

## Single sources of truth — do not re-inline these
The site previously wrote these out by hand in five to seven files, which is how it ended up **showing two different Google ratings on one page** (a hardcoded `5.0` stat beside a live `4.8`). Adding a service is now a one-file change.

- **`src/data/services.ts`** — the service list, its tier, and each core service's `approaches` (the choice the homeowner has to make), `priceFactors` and `faqs`. Homepage, `/services`, every service page, the header menu, the footer, the quote form and every JSON-LD block read from it.
- **`src/data/yard-problems.ts`** — the situations a homeowner can describe but not name, each routed to a service. They feed each service page's FAQ + `FAQPage` schema, each guide's "what Josiah looks at" section, and the quote form's `?problem=` prefill. A build-time guard fails the build if one points at a service that doesn't exist.
- **`src/data/quote-questions.ts`** — the tap-to-answer questions the quote form asks per job (acreage band, what's on it, keeping trees, access, timeline). All optional, by design; see the file header.
- **`src/data/business.ts`** — NAP, service areas *with map coordinates*, and schema helpers. The map, the footer, the prerendered fallback list and `areaServed` all derive from one array.
- **`src/lib/schema.ts`** — one `LocalBusiness` node with a stable `@id` that other pages reference.
- **`src/data/guides.ts`** — the five question pages at `/guides/<slug>`. A guide pulls service FAQs (`kind: "faq"`) and options (`kind: "approaches"`) in by reference rather than restating them, and `covers` lists the service-page questions that get a "The full answer" link to it. A build-time guard fails the build on any reference that doesn't resolve, so renaming a FAQ question means updating the guide that points at it.

`neighborhoods` (Dunes West, Park West…) is deliberately separate from `serviceAreas`: those are neighbourhoods inside Mount Pleasant, not municipalities, and listing them as schema `City` nodes was simply wrong.

## Design system
Palette is **sampled from Josiah's logo PNG**, not invented — brand yellow `#fcc832` = `hsl(45 96% 59%)`, charcoal ground `#191d23`. Fonts are **Outfit** (display, weight 200, huge and tight) + **Manrope**. The whole thing is modelled on **atkinsonpools.com**, whose real design tokens were read out of their stylesheet: near-black ground, one warm accent used *only* on buttons/eyebrows/hover, oversized ultra-light type, two-line section headings, pill buttons, generous section rhythm.

- **Section colour comes from `<Section variant>`** — `default`/`muted` (charcoal), `cream` (light relief). `.on-cream` in `index.css` remaps the semantic tokens for its whole subtree so nested shadcn components follow automatically. **Never hardcode a colour inside a cream section.**
- **There is no yellow section variant any more.** A full-yellow CTA block forced its heading into charcoal-on-charcoal and read muddy; the reference site keeps its CTA on the dark ground and never uses its accent as a large fill. Same here.
- **`--border` and `--input` diverge on purpose.** Form-control boundaries need 3:1 (WCAG 1.4.11); decorative section rules don't. `--input` is much lighter than `--border` for exactly that reason — don't "unify" them.
- **Yellow is 1.5:1 on cream**, so `.on-cream` remaps `--primary` to a dark amber. That's what keeps eyebrow-size text passing AA. Don't collapse it back.
- The theme is **forced dark** (`forcedTheme="dark"` in `App.tsx`); the `.dark` block mirrors `:root` so a stray toggle can't half-light the site.

## The relit hero
`src/lib/relit-hero.ts` gives the hero photograph real surface relief: a depth map turns it into a
height field, normals come from the depth gradient, and a 12-step ray-march through the same map
produces soft self-shadowing under a light that follows the pointer.

- **Adapted from Dominik Fojcik's "Relighting Images with Depth Maps and Three.js"** (Codrops,
  2026-08-19, https://github.com/DGFX/codrops-relightning-images). The README states MIT; keep the
  attribution in the file header. Re-implemented in plain WebGL2 rather than his TSL/WebGPU
  original — the effect is one fragment shader over one quad either way, and `three/webgpu` costs
  ~150 KB brotli that this does not. Shipped cost: **3.7 KB brotli + a 16 KB depth map**, desktop only.
- **Licensing, checked so it isn't re-checked:** Codrops demos are **MIT** and fine for client work.
  **Shadertoy's default is CC BY-NC-SA 3.0 — no commercial use** — so shaders lifted from there are
  off the table for this site unless the author states otherwise.
- **The depth map is generated locally**, not by hand or a paid service:
  `@huggingface/transformers` + `onnx-community/depth-anything-v2-small`, then blurred ~3px and
  saved as near-lossless WebP. Both steps matter — at 1.6px blur / q88 the 8-bit terracing survived
  and showed as blocky steps across the sky and down the boom.
- **The light is masked to the subject** (`smoothstep(0.18, 0.52, depth)`). The far background sits
  near zero in the depth map where the gradient is flat and noisy; lighting it produced most of the
  artifacting and bought nothing.

### The hero is SPLIT, and that is what made the photograph usable
The hero was a full-bleed still with the copy laid over it under a charcoal wash. That wash was
load-bearing — measured against the real composited pixels, opening it into a directional gradient
took the h1 from 3.34:1 to **2.18:1** and the eyebrow to **1.58:1**, both failing AA — but it also
reduced a real photograph to a texture and crushed anything happening inside it.

Splitting them removed the compromise instead of trading against it. Copy on solid charcoal,
photograph at full strength beside it, stacked rather than overlaid below `lg`. Measured after:
**h1 14.88:1, eyebrow 10.74:1, sub 14.88:1, nav 10.91:1**, no horizontal overflow 320–1920, axe 0
across all six routes.

Three things that are easy to break here:
- **The copy column is measured from the centred `max-w-content` container; the photo is positioned
  against the VIEWPORT.** Different origins, so the two can overlap even though the percentages look
  like they add up — at 54%/46% the column's box ran onto the picture. The current 52%/56% pair
  keeps a gap at every width from 1024 to 1920; re-measure `copyRight < photoLeft` if either moves.
- **The h1 needs its own clamp** (`lg:text-[clamp(2.4rem,4vw,4.1rem)]`). `text-hero` and
  `text-display` are sized for a full-width hero and both wrap "the Lowcountry's" onto its own line
  in a half-width column, turning three lines into five.
- **The header is transparent over the hero**, so the right-hand nav now sits on the photograph —
  measured at **1.27:1** before the `h-36` top band was added. Any change to that band needs the nav
  re-measured, not just axe re-run.

**axe cannot catch any of this** — it does not evaluate text over images. Sample the real pixels
with the text hidden.

## The survey layer — and why it is NOT three.js
`src/lib/survey-layer.ts` draws topographic contour lines in ~120 lines of raw WebGL. Contour
lines are the literal visual language of grading and drainage, so the motif comes from Josiah's
trade rather than from a demo. Two modes, both a single finite pass: `ambient` (crosses the CTA
band once, then settles into a still survey sheet that stays) and `reveal` (one sweep, canvas
dropped afterwards). **`reveal` currently has no caller** — it drove the hero until the relit hero
replaced it, because a single bright line crossing a photograph reads as a lightning flash rather
than a survey. Keep it or delete it; don't leave it as a third state.

- **three.js was evaluated and rejected on measurement, 2026-08-20 — don't re-open it without new
  numbers.** Built against this repo's own toolchain, a realistic tree-shaken three.js hero scene
  (r0.185.1: renderer, scene, camera, instanced mesh, shader material, fog, lights) came to
  **106,027 bytes brotli** against the 198,434 the whole site's JS weighs. The shipped survey layer
  costs **3,089 bytes brotli** in its own lazy chunk plus ~**300 bytes** on the app chunk — about
  34x lighter for the same feeling. **State the reason honestly:** three.js could be lazy-loaded
  exactly the way this layer is, so "it would bloat the bundle" is NOT the argument. The argument is
  that a scene graph buys nothing when there is no scene — an ambient background is one triangle and
  a function that colours pixels. `ogl` was measured at 12,749 brotli and is the middle option **if
  real geometry ever appears**; a before/after grade or drainage visualisation is the one case that
  would earn any of it, and it needs survey or drone data first.
- **Nothing may loop.** Both modes run ONE pass and stop, hard-capped under five seconds. WCAG 2.2.2
  Pause, Stop, Hide is **Level A** and sits under Conformance Requirement 5.2.5 (Non-Interference),
  which makes the *whole page* non-conforming when failed — even for pure decoration. A
  reduced-motion media query does **not** satisfy it; it is not among the sufficient techniques.
  Self-stopping does, and needs no pause button. Verified by counting rAF callbacks: 0 after the
  pass, and two screenshots two seconds apart are byte-identical.
- **Phones get no WebGL context at all** (`minWidth`, default 768). At 390px the copy fills the
  band, so the cleared title-block zone that keeps type legible covers essentially the whole canvas
  — the layer was invisible while still costing a context, a shader compile and GPU time on the
  device least able to spare it. Same call `HeroVideo` already makes about the hero clip.
- **The centre is cleared, like a title block.** A real survey sheet doesn't print contours through
  its own labelling. `ink` drops to 14% behind the middle of the band and returns to full at the
  margins, which is what makes it safe to put live copy — including a small yellow eyebrow — on top.
- **Meng To's Sylva cannot be copied.** Despite the "I open-sourced it" post, the repo README
  states: *"No license is granted for reuse or redistribution of the Sylva code, design, or
  artwork."* There is no root LICENSE. The separate `MengTo/Skills` repo **is** MIT and its
  SKILL.md files are worth reading — they mandate IntersectionObserver pausing, teardown and a
  reduced-motion still that Sylva itself never implements.
- **Never run the contour layer over a photograph.** Tested on the hero: the photo already carries
  the whole visual load, so a persistent layer over it reads as dirt on the lens. On the bare
  charcoal it reads as a survey sheet. A one-shot *sweep* over the photo is fine — that's `reveal`.
- **Frequency keys to the SHORT edge of the viewport, never the aspect ratio.** Keyed to aspect,
  the field stretches on a tall phone until the lines fall outside the frame — at 390px the motif
  had all but vanished, on exactly the visitor who matters most. Same reason the edge vignette is
  shallow (0.16, not 0.30): a CTA band is short and wide, and a deep falloff left only the middle
  third carrying any ink.
- **The canvas is rendered only AFTER mount, so it never appears in the prerendered HTML.**
  Googlebot does not support WebGL (Search Central, JS troubleshooting guide), and `<canvas>` is
  **not an LCP-eligible element** — if decoration ever displaced the hero `<img>`, LCP would
  silently move to the H1. The layer is additive, always.
- `SurveyLayer.tsx` reaches the module through a **dynamic `import()`**. Importing
  `@/lib/survey-layer` at the top of a page component puts WebGL on the contact form's critical
  path — all the client JS is still one chunk, so there is nothing else stopping it.
- The hero sweep waits for `requestIdleCallback` so it never competes with the hero still, which is
  what the page's LCP is actually measured on. Under `prefers-reduced-motion` the sweep does not
  run at all (freezing a sweep mid-pass leaves a bright bar across the hero for good); the ambient
  layer holds a designed still frame instead.

## Photos and drawings — which does what
**Photos carry the cards and the heroes; drawings explain.** The homepage hero and the land-clearing page are **Josiah's own machine** (`src/assets/services/excavation.jpg`). The other core services use **licensed stock** (`src/assets/stock/`, Unsplash/Pexels, no attribution required, sources and rules in `CREDITS.md`), added 2026-09-29 at Will's request for "professional, authentic land clearing images". Stock rules:
- **never** in the Gallery, never captioned as a job, and alt text says only what is in frame;
- nothing showing another contractor's name or phone number (the photo search rejected several, and one dealer sticker was retouched off);
- replace each photo the moment Josiah has a real one.

NN/g and the Harrington Movers test (+45% for a real truck photo over stock) are the reason: **his own photos will outperform all of these.** No licensed pool-dig photo exists, so a real one is the most valuable ask.

Each core service also has a **section drawing** (`ServicePlate.tsx`) in the language of a civil detail sheet: hatched earth, dashed existing grade, the water-table symbol, a title block marked "N.T.S.". On service pages it sits beside the choice it illustrates ("grind it or pull it", "a pool dig or a pond"). It shows the underground half of the work that no photo can.
- **`ServiceImage` shows the photo when `image` exists, else the plate.** `cardImage` lets a grid card use a different photo from the page hero. Land clearing uses it so the homepage never shows Josiah's photo twice in one scroll.
- **The one dimension drawn is the code's, not ours:** 6 in. of fall in the first 10 ft is IRC R401.3. Don't add numbers that are ours.
- **Never add `vectorEffect="non-scaling-stroke"` to a drawn path.** It breaks framer-motion's `pathLength` normalisation, and lines stop drawing partway. That cost an iteration.
- **Callouts hide in `compact` mode and below `sm`.** At card size or phone width the 8.6-unit labels render at 6–7px. `.on-dark` (in `index.css`) keeps a plate's dark palette when it sits inside a cream section.
- **They draw once and stay drawn** (WCAG 2.2.2, the same rule as the survey layer), and render finished under reduced motion.

## Navigation and the mobile bars
- **A plain Services dropdown, not a mega menu.** NN/g recommends mega menus for big sites; five services fit in one short list (Radix NavigationMenu, no Viewport, so the list positions under its trigger).
- **On phones the header slides away while scrolling down and returns on scroll up**, and the sticky Call/Text/Quote bar appears only once the hero's own buttons (`#hero-actions`) are off-screen, or after 240px on other pages. Two fixed bars on a 390px screen is the pattern NN/g singles out. Conversion Rate Experts measured a CTA bar that appears after scroll at +25%. While hidden, the bar is `inert`.

## Motion rules
Motion goes on **imagery**: photo curtain reveals, drawings drawing in, the process line. Text gets only a fast mask-rise on headings. NN/g finds slow scroll-triggered text reads as lag. The hero headline's rise is **pure CSS** (`.hero-line`, `.hero-rise` in `index.css`), so the prerendered HTML is the finished headline. Never put `FadeInView` or any JS reveal on above-the-fold text: its `opacity:0` start state is baked into the static HTML. `eager` images never animate. Everything plays once, and under reduced motion it is instant rather than absent (see the reduced-motion gotcha).

## The quote form — scoping, not just contact
`/contact` asks for the job first (five core cards plus "Something else"), then chips specific to that job, then name and phone. **Email is optional**: Josiah calls or texts back, so requiring email blocked the one thing the visitor came to do. The Formspree payload carries a one-line `summary` (e.g. "Land Clearing · ¼ to 1 acre · Brush & vines, Small trees · Yes, some · New build") plus each answer as its own labelled line. `?problem=<id>` and `?service=<slug>` prefill it. Formspree's free tier has no file upload, so the form asks people to **text photos** instead. Tested end to end with Formspree mocked (2026-09-29). **On a phone the form comes first** and the "Rather talk?" contact list follows it; on desktop the list sits left and sticky.

## Homepage length — measured, and why the ORDER mattered more than the cutting
**Simplified 2026-09-29 (second pass, at Will's request for "simple, concise, nobody has to hunt"):** now **6.7 screens desktop, 7.8 on a 390×844 phone** (from 9.5 / 10.6 earlier the same day). Order: **hero → reviews → services → "not sure? send a photo" → how it works (3 steps) → story (compact) → CTA with areas**. Each block answers one question a visitor from the ad has; see the header comment in `LandingPage.tsx`. What was cut, with the evidence, so it isn't re-added by habit:
- **Reviews directly under the hero**: NN/g puts about 65% of viewing time in the top 40% of a page, and third-party proof is what a cold ad visitor lacks.
- **Static 3-review grid, not the auto-rotating carousel.** NN/g: an auto-forwarded item is visible about 20% of the time, and moving content reads as an ad. `ReviewsGrid` leads with the most relevant reviews (clearing, trees, work ethic) and skips ones about retired services (pressure washing). The rating shown is still the true average of all of them, and all are on /reviews.
- **The triage accordion is gone from the homepage.** Its content still renders on every service page as FAQ, and `?problem=` still prefills the form. "Not sure what you need? Send a photo" does its job in one line.
- **The desktop service-index strip is gone:** it repeated the grid directly below it. **Areas We Serve** is one line inside `CtaSection` on every page, not a 3×3 grid repeating the footer.
- **The first phone screen is complete:** real photo (30svh), place, H1, one line, rating, both buttons. Proof sits above the buttons.

History: 2026-08-21 the homepage was 12.7 phone screens with the reviews at screen 8.9; moving
proof ahead of biography was the bigger win than any cut. **Proof before biography** still holds.
The services grid still drops its drawings on a phone except the lead tile. Service pages were cut
the same day to hero → the work → options + drawing → questions (price folded in as the first
answer, no numbers) → related → CTA, and `/services` is the same grid as the homepage plus the FAQ.

Re-measure with a scripted section audit rather than by eye — section heights in *screens* is the
unit that matters, and it differs a lot between desktop and mobile.

## Deliberate omissions — these are decisions, not oversights
- **No licensing / insurance / bonding / permitting claims anywhere.** These are verifiable legal claims, not marketing copy, and Will explicitly chose to leave them off (2026-08-19). **Corrected 2026-09-29, from the statute text:** the $500 residential-specialty threshold (S.C. Code §40-59-20(7)) covers a list of trades (plumbing, electrical, HVAC, roofing, masonry, carpentry…) that **does not include grading, excavation, land clearing or tree work**. **"Grading" is a Contractor's Licensing Board subclassification** (§40-11-410(2)(d)), and CLB licensing starts at **$10,000** total cost (§40-11-30, raised from $5,000 in 2023). Using the words "licensed contractor" without a CLB licence is itself unlawful (§40-11-370). **Unresolved:** whether a stand-alone residential grading or pool-dig job over $10,000 needs a CLB Grading licence. That is a question for LLR, not for this site, and it matters more now that grading and pool digs are core work. Same reason the Custom Projects copy doesn't advertise **electrical** even though he did the electrical on the pantry job.
- **No `aggregateRating` / `Review` nodes in JSON-LD.** Google makes a business republishing reviews about itself ineligible for the star rich result, so the markup can never pay off. Real ratings still render for visitors — they're just not claimed as schema.
- **`public/hero-excavator.mp4` exists but the hero doesn't use it.** All of Josiah's clips are portrait phone video (`rotation=-90`); cropped to a landscape band and put behind a headline it read as noise. Pass `src` back to `<HeroVideo>` when there's stabilised landscape footage. **Tell them to turn the phone sideways.**

## Josiah's mission portrait — what was used and what wasn't
He shared a Wildfire Leadership "mission portrait" (2026-08-19): core values *Courageous, Witty, Life-Giving, Hardworking, Warrior*; ID *Live it out*; mission *Live a life of integrity*; vision *To speak life and change the atmosphere*; anchored on **Matthew 7:24** ("…builds a house on solid rock").

- **The verse is where the company name came from**, and that had never been stated anywhere on the site. It's now a section on `/about` — understated, one verse, one paragraph tying it to getting the base right. This is the single strongest thing in that document.
- **Mission wording ("live a life of integrity") frames the principles section subtitle.**
- **The personal-formation language is deliberately NOT on the site** — *Witty*, *Warrior*, *ID: Live it out* are discipleship vocabulary that would read as confusing to a homeowner comparing excavation quotes. Not a slight; wrong register for the audience.
- **The portrait image itself is not published** — it's a personal document carrying another company's branding (Wildfire Leadership).
- How faith-forward to be is a **business positioning call that belongs to Josiah**, not a design decision. Current setting is "explains the name, doesn't preach." Dial either way on request.

## Gotchas that cost real time
- **`vercel.json` needs `cleanUrls: true`.** Without it the catch-all rewrite swallowed every interior route and `/services` was served the *homepage's* HTML and canonical tag — silently telling Google that `/services`, `/gallery`, `/reviews` and `/contact` were all duplicates of `/`. Verify after routing changes with `npx vercel build --yes` then read `.vercel/output/config.json`: `{"handle":"filesystem"}` must appear **before** the catch-all rewrite, and `overrides` must map `services.html → services`.
- **The static head is injected with a `String.replace`**, which eats `$$` as an escape — `priceRange: "$$"` shipped to crawlers as `"$"`. `SEO.tsx` escapes every `$` to the unicode form `\u0024` before emitting the JSON-LD (a JSON parser decodes it straight back, so the structured data is unchanged); leave that alone.
- **Reviews are real and pinned.** `api/reviews.ts` reads an Apify **task** (`APIFY_TASK_ID`, default `JKIP67d4omFdYH0Qp`) and filters by `place_id` — an earlier version read "last run across the account" and put **another business's reviews** on the site. `src/data/fallbackReviews.ts` is a snapshot of the real ones, used only when the API fails; its rating is derived from the reviews actually rendered so the headline can never disagree with what's on screen.
- **Steve Kelly's review praises "power washing"**, a service they no longer offer, and it's the first carousel slide. It's a genuine Google review — deleting it would be cherry-picking *and* would swing the fallback average from 4.8 to 5.0, re-creating the bug this all started with. The fix is more recent excavation reviews, not editing this one.
- **Google review avatars must go through `sizedPhoto()` (`src/lib/reviewPhoto.ts`).** Google's photo CDN puts the requested size in the URL and Apify returns the 1920px original, so five 48px circles were pulling **8.67MB** — two of them 2.9MB and 3.4MB each. Rewriting `=s1920` to `=s96` costs nothing and cuts it to 64KB. It's applied at render, not in the data, so it covers both the live API response and `fallbackReviews.ts`. Any new place that renders `avatarUrl` needs it too.
- **Nothing above the fold may use plain `<FadeInView>`.** It starts at `opacity:0` and vite-react-ssg bakes that start state into the prerendered HTML — the hero h1, subtitle and both CTAs shipped invisible until framer-motion hydrated. Pass `immediate` for above-the-fold content. Check with `curl` + grep for `opacity:0` before the `<h1>` after touching the hero.
- **Titles must contain "Firm Foundation" inline.** `SEO.tsx` only appends the site name when the title doesn't already mention the brand, so a title without it silently grows to ~90 chars. The guides guard enforces it for those; the page titles are 42–66 chars and carry the locality.
- **Reduced motion may change a transition, never markup or a start state.** `useReducedMotion()` is false while prerendering and true on such a visitor's first render, so anything it changes in the rendered output breaks hydration. Until 2026-10-05 it did, on every page: `ScrollProgress` returned `null` and `FadeInView`/`StaggerContainer` swapped `motion.div` for a plain `div`, React threw #418/#423 and client-rendered the whole root. The rule now: `initial` is the same for everyone; reduced motion gets `transition={{ duration: 0 }}`, or a `shown` variant (the end state, no transition) for variant-driven motion (`ServicePlate`, `StaggerContainer`); and the progress bar hides with `motion-reduce:hidden`. **A fix to one component alone is worse than none**: once hydration succeeds React 18 does not patch attributes, so any `FadeInView` still swapping elements would keep the prerendered `opacity:0` and stay invisible for exactly these visitors. Check with Playwright's `reducedMotion: "reduce"`: no page errors, and nothing left at `opacity:0` after scrolling.
- **iOS Safari auto-zooms any focused control under 16px.** `input.tsx` uses `text-base md:text-sm` for exactly this reason; `textarea.tsx` was missing it and yanked the viewport on the lead form. Keep both patterns in sync.
- **Grid/flex children need `min-w-0`.** The gmail address and `@firmfoundationsc` are unbreakable tokens; without it they pushed the page past the viewport at 320px.

## External setup (outside the repo — you can't find this by reading code)
- **Vercel MCP is connected.** Project `prj_YXYiByVTJ2fousNeHY35SBxyEsIA`, team `team_Qvqzen2SxSvJoGieMOpKOkai` (also in `.vercel/project.json`). Domain **firmfoundationsc.com**. Use `mcp__claude_ai_Vercel__get_project`, `list_deployments`, `get_runtime_logs`, `get_deployment_build_logs`, and `get_web_analytics` — you do **not** need to ask Will to paste dashboard screenshots.
- **Web Analytics is wired in code** (`src/components/Analytics.tsx`, mounted client-only via `ClientOnly` so prerendering is untouched). Custom events: `phone_click` (with `where` — header / header-mobile / mobile-bar / page-cta / contact-page), `quote_request` (with `service`), `email_click`. **Every event stays at ≤1 property; the included plan allows 2 — don't add a third or it forces the $10/mo Plus tier.**
- **Speed Insights is deliberately NOT installed.** It's a separately billed Vercel product and Will's instruction was no extra spend (2026-08-19). Measure Core Web Vitals locally with Lighthouse/Playwright instead. Don't "helpfully" add `@vercel/speed-insights` back.
  **⚠️ As of 2026-08-19 `get_web_analytics` returns 404 "Web Analytics not found" — it still has to be switched on once in the Vercel dashboard (Project → Analytics → Enable).** Check that first if the query fails; it is not a code bug.
- **`APIFY_TOKEN` must be set in Vercel env**, or `/api/reviews` 500s and the site silently falls back to the snapshot. `.env.local` holds the local copy and is gitignored.
- **The repo is PUBLIC.** `.claude/settings.local.json` contains the Apify token inside approved-command strings; it's gitignored both globally and in-repo now, but never move it or commit it.
- **Contact form posts to Formspree** (`xlgwpbnn`, hardcoded in `ContactUs.tsx`). No backend — if leads stop arriving, check Formspree, not the code.
- **Google Business Profile:** excavation still needs adding as a **secondary** category (leaving the primary alone avoids re-verification). Research put GBP service categories above any on-site change for local ranking.

## Verifying visual work
There's no browser extension here, but Playwright with system Chrome works and is how every visual claim in this repo was checked. Scripts live in the session scratchpad, not the repo — rebuild them as needed. Serve `dist/` over plain `http.server`-style Node and:
- **Screenshots** — scroll the page in ~0.6vh steps before capturing, or `FadeInView`'s IntersectionObserver never fires and full-page shots come back with huge empty sections.
- **axe-core** — **0 violations** on every route, guides included (re-checked 2026-10-05). Keep it there.
- **Horizontal overflow** — check 320/375/414/768/1024/1440/1920. **Clean at every width** (re-checked 2026-09-29): `html, body { overflow-x: clip }` in `index.css` contains the tilted `OurStory` polaroid without clipping its composition. The overflow check also flags any element inside `<main>` wider than the viewport, which is how the non-wrapping "More on pool & pond excavation" button at 320px was caught.
- **The relit hero's checkerboard was real, and it is fixed (2026-09-29).** Found by switching each shader term off in turn: it vanished only with `NORMAL_SCALE` at 0. The 8-bit depth map stores smooth slopes as one-level steps, and a 3-texel gradient turned each step into a hard lighting edge. That is the data, not the GPU. The gradient now spans 12 texels and averages three taps per side. **If the depth map is ever regenerated, keep the gradient wide or store 16-bit.**
- **Contrast** — compute WCAG ratios for real token pairs including opacity-modified ones (`text-charcoal/55` etc.) rather than eyeballing.

## Open items
- **Google Business Profile category is now the biggest lever, and it lives outside this repo.** Whitespark 2026 puts primary GBP category at #1 for the map pack. With land clearing and excavation now the business, the research (2026-09-29) recommends **"Excavating contractor" as primary**, with "Earth works company", "Drainage service" and "Pond contractor" as secondaries. "Land clearing service" could not be confirmed as a real GBP category, so check the picker. The trade-off: changing the primary can trigger re-verification, which is why the earlier advice was secondary-only. That decision belongs to Josiah. (Per-service pages, which this item used to call "not built", shipped in b4e29fa.)
- **Searchers say "Charleston", not "Mount Pleasant", for clearing.** Google autocompletes "land clearing mount pleasant" to Mount Pleasant, **TX**. Titles and H1s therefore pair the two ("Mount Pleasant & Charleston"). Coverage for clearing is probably wider than the nine towns listed (Awendaw, Wando/Cainhoy, Huger, Ravenel), but those are Josiah's to add, not ours to invent.
- **Guides exist to be cited by search and AI answers for questions people describe rather than name** (`src/data/guides.ts` header has the why). Baseline, 2026-10-05: a web search for five such questions (tree permit, clearing cost, yard flooding, "best land clearing company Charleston", who digs a pool) surfaced Firm Foundation for **none** of them. Re-run the same five about a month after the guides are live before adding more. Two things outside the repo matter more for the category query: free profiles on Yelp, Bing Places, Apple Business Connect, Nextdoor and Facebook (the "best" answers are built from Angi, Yelp and HomeAdvisor), and reviews past 20. Add each new profile to `sameAs` in `src/lib/schema.ts`. **The guides deliberately publish no prices**, and the clearing-cost question is therefore unwinnable here: every page that ranked for it gave $/acre ranges. Publishing honest ranges is Josiah's call.
- **The FAQ permit answers cite code sections verified 2026-09-29** (Mount Pleasant Zoning Code Ch. 156, S.C. Code Titles 40/48/49/58, 33 CFR 323.2, IRC R401.3). Ordinances change, so re-verify yearly. Charleston County's tree rules were deliberately left out: Ord. 2275 and a 2024 grand-tree amendment couldn't be read.
- **Vercel Web Analytics is still not enabled** (`count_pageviews` returned "Web Analytics not
  found" again on 2026-09-29, and 404 on 2026-08-20). Turn it on before any ad spend. The tracking code has been shipping for weeks and recording nothing, so there is no
  device split, no traffic baseline, and no way to judge whether any change helped. One dashboard
  toggle: Project → Analytics → Enable.
- Photography is the real ceiling, and more so now: the lead service has **one** photo. The asks, in order: a before and after of one clearing job from the same spot, a pool dig mid-dig, a finished French drain before backfill, and a stump root ball on the bucket. **Landscape orientation**. Each one drops into `services.ts` and replaces a drawing with no other change. Six good shots of one job would also unlock named project pages (`/work/<slug>`).
- "Uncle Donnie" vs "Danny" — Will wrote Donnie, Josiah's voice note said Danny. Site says **Donnie** in three places.
