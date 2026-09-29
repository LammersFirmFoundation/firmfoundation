# Firm Foundation Property Services

Marketing site for a family-run property services company in Mount Pleasant, SC (greater Charleston / Lowcountry). Owner is **Josiah Lammers**; Will owns the repo. **The entire point of this site is phone calls and quote requests** — optimise for that, not for time-on-page.

**Land clearing & excavation is the business (Josiah, 2026-09-29).** His words: make land clearing the main focus and feature tree and stump removal, grading, site prep for pools and ponds, and larger drainage projects; move small irrigation, landscaping and hardscapes out of the main messaging. His Instagram bio and ad now lead with the headline **"Land Clearing & Excavation"**, so the homepage H1, the header tagline and the share card use exactly those words: someone who taps the ad should land on the same sentence.

So `services.ts` has two tiers. **`core`** (land-clearing, tree-removal, excavation, pools-and-ponds, drainage) leads everywhere, in that order. **`more`** (hardscapes, landscaping, custom-projects) keeps its pages, because they are indexed and still bring work, but it never leads: it sits in a dashed "smaller jobs, still on request" tile, a menu sidebar, and a muted footer list. Irrigation is gone from the copy entirely; he said it isn't him long-term. `/services/tree-services` became `/services/tree-removal` with a permanent redirect in `vercel.json`. Rename any other slug the same way.

## Stack
- **Vite + React 18 + TypeScript strict + Tailwind 3** with a shadcn-style kit in `src/components/ui/`.
- **`vite-react-ssg`** prerenders every route to static HTML at build time: 14 pages, including `/services/<slug>` for all eight services via `getStaticPaths`. This is the whole SEO story — crawlers get full HTML, not an empty `#root`.
- **Vercel** hosting. One serverless function: `api/reviews.ts`.
- `framer-motion` for scroll reveals. **`leaflet`/`react-leaflet` are no longer rendered** — the homepage map became the coverage directory, and `ServiceAreaMap.tsx` is now unreferenced. Tree-shaking keeps both out of the bundle (verified), so it costs nothing shipped, but it is dead code: delete it or re-mount it, don't leave it as a third state.

## Commands
- `npm run dev` (port **8080**, proxies `/api` to production so live reviews work locally)
- `npm run build` — runs `vite-react-ssg build`. **A green build is the gate; there is no test suite.**
- `npx tsc --noEmit -p tsconfig.app.json` — must be clean.
- `npx eslint .` — **3 errors are pre-existing** shadcn/Tailwind boilerplate (`command.tsx`, `textarea.tsx` empty interfaces; `require()` in `tailwind.config.ts`). Don't count them as regressions; don't "fix" them either.

## Single sources of truth — do not re-inline these
The site previously wrote these out by hand in five to seven files, which is how it ended up **showing two different Google ratings on one page** (a hardcoded `5.0` stat beside a live `4.8`). Adding a service is now a one-file change.

- **`src/data/services.ts`** — the service list, its tier, and each core service's `approaches` (the choice the homeowner has to make), `process`, `priceFactors` and `faqs`. Homepage, `/services`, every service page, the header menu, the footer, the quote form and every JSON-LD block read from it.
- **`src/data/yard-problems.ts`** — the situations a homeowner can describe but not name, each routed to a service. They feed the homepage triage (`homepageProblems`, six hand-picked ids), each service page's FAQ + `FAQPage` schema, and the quote form's `?problem=` prefill. A build-time guard fails the build if one points at a service that doesn't exist.
- **`src/data/quote-questions.ts`** — the tap-to-answer questions the quote form asks per job (acreage band, what's on it, keeping trees, access, timeline). All optional, by design; see the file header.
- **`src/data/business.ts`** — NAP, service areas *with map coordinates*, and schema helpers. The map, the footer, the prerendered fallback list and `areaServed` all derive from one array.
- **`src/lib/schema.ts`** — one `LocalBusiness` node with a stable `@id` that other pages reference.

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

## The section drawings (`ServicePlate.tsx`) — why the services have drawings, not photos
Only one real clearing photo exists (the hero). Stock photos of someone else's excavator were ruled out: a small lie on a site whose pitch is honesty. So each core service has a **section drawing** in the language of a civil detail sheet: hatched earth, dashed existing grade, the water-table symbol, a title block reading "N.T.S.". They explain the underground half of the work (root ball, French drain, cut and fill) that no photo can show, and they extend the survey-contour motif rather than adding a new one.
- **`ServiceImage` shows the photo when `image` exists, else the plate.** Dropping in a real photo later is one line in `services.ts`. `preferPlate` forces the drawing (the homepage bento does this for land clearing, because the hero one screen up already carries that exact photo).
- **The one dimension drawn is the code's, not ours:** 6 in. of fall in the first 10 ft is IRC R401.3. Don't add numbers that are ours.
- **Never add `vectorEffect="non-scaling-stroke"` to a drawn path.** It breaks framer-motion's `pathLength` normalisation, and lines stop drawing partway. That cost an iteration.
- **Callouts hide in `compact` mode and below `sm`.** At card size or phone width the 8.6-unit labels render at 6–7px. `.on-dark` (in `index.css`) keeps a plate's dark palette when it sits inside a cream section.
- **They draw once and stay drawn** (WCAG 2.2.2, the same rule as the survey layer), and render finished under reduced motion.

## The quote form — scoping, not just contact
`/contact` asks for the job first (five core cards plus "Something else"), then chips specific to that job, then name and phone. **Email is optional**: Josiah calls or texts back, so requiring email blocked the one thing the visitor came to do. The Formspree payload carries a one-line `summary` (e.g. "Land Clearing · ¼ to 1 acre · Brush & vines, Small trees · Yes, some · New build") plus each answer as its own labelled line. `?problem=<id>` and `?service=<slug>` prefill it. Formspree's free tier has no file upload, so the form asks people to **text photos** instead. Tested end to end with Formspree mocked (2026-09-29).

## Homepage length — measured, and why the ORDER mattered more than the cutting
**Re-measured 2026-09-29 after the land-clearing rebuild:** 8,542px desktop (9.5 screens at 900px) and 8,923px on a 390×844 phone (10.6 screens). The +1.1 mobile screens is the new "How it works" process strip. The reviews moved **up**, to about screen 4.4 on a phone. The stats strip is gone: its rating duplicated the hero, and its slot now holds a desktop-only service index under the fold. Current order: hero → service index (md+) → services bento → triage → reviews → process → story → areas → CTA.

Measured 2026-08-21 against the built page: the homepage was **12.7 screens on a phone** (8,514px
desktop / 10,746px mobile), 8 sections, 1,006 words. Now **9.5 screens** (8.1 desktop), 753 words.

The bigger fix was order, not length. NN/g finds **65% of viewing time goes to the top 40% of a
page regardless of how long it is**, and average scroll depth on a well-designed page is ~63%. The
reviews — a real 4.9 from verified Google reviews, the strongest trust signal the business has —
sat at **screen 8.9 of 12.7**, past where most visitors ever reach. They now sit at screen 5.0,
directly after Services and ahead of the story. **Proof before biography.**

What was cut and why, so it isn't undone:
- **The services bento drops its drawings on a phone except the lead tile**, and the rest become
  compact rows. Five stacked image cards were 3.4 screens — the biggest block on the page. Cards
  link to `/services/<slug>`, not the index, which is also the internal linking those pages want.
- **The triage starts fully collapsed, and the homepage shows six hand-picked situations**
  (`homepageProblems`): the ones a homeowner can describe but can't turn into a job. Those are
  overgrown ground, keeping the good trees, stumps, a pool dig, standing water, and water toward
  the house. "A tree needs to come down" or "I want a patio" are things people already know how
  to ask for, so on the homepage they would be a menu, not a diagnosis. All fifteen still render
  on the service page each routes to, as prose AND `FAQPage` schema.

Still on the table if it needs to be shorter, all content calls rather than craft ones: Areas We
Serve (0.74, duplicates the footer), shortening Our Story to a teaser plus the existing link to
`/about` (~0.8), and the process strip on phones (~1.1, and every core service page carries its
own version).

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
- **Titles must contain "Firm Foundation" inline.** `SEO.tsx` only appends the site name when the title doesn't already mention the brand, so a title without it silently grows to ~90 chars. All six are currently 42–63 chars and all carry the locality.
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
- **axe-core** — currently **0 violations across all 6 pages**. Keep it there.
- **Horizontal overflow** — check 320/375/414/768/1024/1440/1920. **Clean at every width** (re-checked 2026-09-29): `html, body { overflow-x: clip }` in `index.css` contains the tilted `OurStory` polaroid without clipping its composition. The overflow check also flags any element inside `<main>` wider than the viewport, which is how the non-wrapping "More on pool & pond excavation" button at 320px was caught.
- **The relit hero looks blocky in headless Chromium.** SwiftShader (no GPU) shows checkerboarding on the cab glass and stripes on the boom; with WebGL disabled the photo is clean. It was built and checked on real hardware, so this is probably the software rasteriser, but it is **unconfirmed on a real GPU as of 2026-09-29**. Check it on a Mac before trusting either reading.
- **Contrast** — compute WCAG ratios for real token pairs including opacity-modified ones (`text-charcoal/55` etc.) rather than eyeballing.

## Open items
- **Google Business Profile category is now the biggest lever, and it lives outside this repo.** Whitespark 2026 puts primary GBP category at #1 for the map pack. With land clearing and excavation now the business, the research (2026-09-29) recommends **"Excavating contractor" as primary**, with "Earth works company", "Drainage service" and "Pond contractor" as secondaries. "Land clearing service" could not be confirmed as a real GBP category, so check the picker. The trade-off: changing the primary can trigger re-verification, which is why the earlier advice was secondary-only. That decision belongs to Josiah. (Per-service pages, which this item used to call "not built", shipped in b4e29fa.)
- **Searchers say "Charleston", not "Mount Pleasant", for clearing.** Google autocompletes "land clearing mount pleasant" to Mount Pleasant, **TX**. Titles and H1s therefore pair the two ("Mount Pleasant & Charleston"). Coverage for clearing is probably wider than the nine towns listed (Awendaw, Wando/Cainhoy, Huger, Ravenel), but those are Josiah's to add, not ours to invent.
- **The FAQ permit answers cite code sections verified 2026-09-29** (Mount Pleasant Zoning Code Ch. 156, S.C. Code Titles 40/48/49/58, 33 CFR 323.2, IRC R401.3). Ordinances change, so re-verify yearly. Charleston County's tree rules were deliberately left out: Ord. 2275 and a 2024 grand-tree amendment couldn't be read.
- **Vercel Web Analytics is still not enabled** (`get_web_analytics` returned 404 again on
  2026-08-20). The tracking code has been shipping for weeks and recording nothing, so there is no
  device split, no traffic baseline, and no way to judge whether any change helped. One dashboard
  toggle: Project → Analytics → Enable.
- Photography is the real ceiling, and more so now: the lead service has **one** photo. The asks, in order: a before and after of one clearing job from the same spot, a pool dig mid-dig, a finished French drain before backfill, and a stump root ball on the bucket. **Landscape orientation**. Each one drops into `services.ts` and replaces a drawing with no other change. Six good shots of one job would also unlock named project pages (`/work/<slug>`).
- "Uncle Donnie" vs "Danny" — Will wrote Donnie, Josiah's voice note said Danny. Site says **Donnie** in three places.
