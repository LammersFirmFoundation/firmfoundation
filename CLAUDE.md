# Firm Foundation Property Services

Marketing site for a family-run property services company in Mount Pleasant, SC (greater Charleston / Lowcountry). Owner is **Josiah Lammers**; Will owns the repo. **The entire point of this site is phone calls and quote requests** — optimise for that, not for time-on-page.

**The business is pivoting toward small excavation** (grading, drainage, irrigation trenching, clearing, driveway prep) while keeping landscaping, hardscapes, tree work and custom projects. That's why Excavation is first in `src/data/services.ts`, and order in that file is the order it renders everywhere.

## Stack
- **Vite + React 18 + TypeScript strict + Tailwind 3** with a shadcn-style kit in `src/components/ui/`.
- **`vite-react-ssg`** prerenders all 6 routes to static HTML at build time (`/`, `/services`, `/gallery`, `/about`, `/contact`, `/reviews`). This is the whole SEO story — crawlers get full HTML, not an empty `#root`.
- **Vercel** hosting. One serverless function: `api/reviews.ts`.
- `framer-motion` for scroll reveals. **`leaflet`/`react-leaflet` are no longer rendered** — the homepage map became the coverage directory, and `ServiceAreaMap.tsx` is now unreferenced. Tree-shaking keeps both out of the bundle (verified), so it costs nothing shipped, but it is dead code: delete it or re-mount it, don't leave it as a third state.

## Commands
- `npm run dev` (port **8080**, proxies `/api` to production so live reviews work locally)
- `npm run build` — runs `vite-react-ssg build`. **A green build is the gate; there is no test suite.**
- `npx tsc --noEmit -p tsconfig.app.json` — must be clean.
- `npx eslint .` — **3 errors are pre-existing** shadcn/Tailwind boilerplate (`command.tsx`, `textarea.tsx` empty interfaces; `require()` in `tailwind.config.ts`). Don't count them as regressions; don't "fix" them either.

## Single sources of truth — do not re-inline these
The site previously wrote these out by hand in five to seven files, which is how it ended up **showing two different Google ratings on one page** (a hardcoded `5.0` stat beside a live `4.8`). Adding a service is now a one-file change.

- **`src/data/services.ts`** — the service list. Homepage, `/services`, footer, the contact form's dropdown, and every JSON-LD block read from it.
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

## Homepage length — measured, and why the ORDER mattered more than the cutting
Measured 2026-08-21 against the built page: the homepage was **12.7 screens on a phone** (8,514px
desktop / 10,746px mobile), 8 sections, 1,006 words. Now **9.5 screens** (8.1 desktop), 753 words.

The bigger fix was order, not length. NN/g finds **65% of viewing time goes to the top 40% of a
page regardless of how long it is**, and average scroll depth on a well-designed page is ~63%. The
reviews — a real 4.9 from verified Google reviews, the strongest trust signal the business has —
sat at **screen 8.9 of 12.7**, past where most visitors ever reach. They now sit at screen 5.0,
directly after Services and ahead of the story. **Proof before biography.**

What was cut and why, so it isn't undone:
- **Services cards drop their photo on a phone except the lead service**, and non-lead cards drop
  their summary sentence. Five stacked image cards were 3.4 screens — the biggest block on the page
  — duplicating five pages that now exist in their own right. Cards link to `/services/<slug>`, not
  the index, which is also the internal linking those pages want.
- **The yard triage starts fully collapsed, and the homepage shows only the SIX Excavation
  problems** (`homepageProblems`). With the first panel open and all ten rows it ran 2.5 screens;
  it is now 1.17. The tool earns its place because a homeowner cannot name a drainage problem —
  but "I want a patio", "a tree needs to come down" and "the beds look tired" are things people
  already know, so for those four it was a menu, not a diagnosis. All ten still render on the
  service page each routes to, as prose AND `FAQPage` schema — verified against the built HTML.
  Keyed on `serviceSlug`, not `group`: "Can you clear overgrown brush and small trees?" routes to
  Excavation while sitting under the "Trees and growth" heading, so cutting by group would have
  dropped a lead-service question.

Still on the table if it needs to be shorter, all three being content calls rather than craft ones:
the stats strip (0.32 screens, and its Google rating duplicates the hero 300px above), Areas We
Serve (0.74, duplicates the footer), and shortening Our Story to a teaser plus the existing link to
`/about` (~0.8). Those three together would land it near 8 screens.

Re-measure with a scripted section audit rather than by eye — section heights in *screens* is the
unit that matters, and it differs a lot between desktop and mobile.

## Deliberate omissions — these are decisions, not oversights
- **No licensing / insurance / bonding / permitting claims anywhere.** SC requires an LLR residential specialty licence for grading work over $500 and Josiah hasn't confirmed status. These are verifiable legal claims, not marketing copy. Will explicitly chose to leave them off (2026-08-19). Same reason the Custom Projects copy doesn't advertise **electrical** even though he did the electrical on the pantry job.
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
  **BLOCKED until ownership verification clears.** Google emailed `josiahlammers1@gmail.com` on 2026-08-24 from the genuine `businessprofile-noreply@google.com` asking for further verification that Josiah *manages* the profile — the listing itself is live and carries the real reviews this site pulls. That is a normal step for a service-area business at a residential address with no storefront, not a denial. **A category edit while verification is pending can restart it**, so add excavation only after it clears. Path is video verification: one unedited 30s+ take shot on the phone while signed into that exact Google account (street sign → house number → truck plate → equipment → unlock/start the truck → a document naming the business → the profile open on screen). Failed attempts now end in a "No more ways to verify" dead end needing support, so it is a one-shot.
  **Scam calls are riding on this.** Two so far (2026-08-21, 2026-08-25), both claiming a "verified listing department", both with a spoofed caller ID and a different callback area code, both citing a fake "issue with your keywords attached to your listing" and a same-day deadline. Google never cold-calls about verification and has no such department. Never grant anyone manager access; the goal of these calls is the profile itself.

## Verifying visual work
There's no browser extension here, but Playwright with system Chrome works and is how every visual claim in this repo was checked. Scripts live in the session scratchpad, not the repo — rebuild them as needed. Serve `dist/` over plain `http.server`-style Node and:
- **Screenshots** — scroll the page in ~0.6vh steps before capturing, or `FadeInView`'s IntersectionObserver never fires and full-page shots come back with huge empty sections.
- **axe-core** — currently **0 violations across all 6 pages**. Keep it there.
- **Horizontal overflow** — check 320/375/414/768/1024/1440/1920. Clean from 768 up. **It is NOT clean below that**: measured 2026-08-20, the page scrolls sideways at 320 (367px), 375 (422px) and 414. The offender is the tilted polaroid pair in `OurStory.tsx` — the second `<figure>` is `absolute -bottom-10 -right-3 w-[44%]` inside a wrapper with no clip. Confirmed identical on a build with no other changes, so it is long-standing and not a regression. Fixing it means deciding whether that photo is *meant* to poke past the edge; clipping it changes the composition, so it's a design call, not a patch.
- **Contrast** — compute WCAG ratios for real token pairs including opacity-modified ones (`text-charcoal/55` etc.) rather than eyeballing.

## Open items
- **A page per service is the highest-value on-site change left, and it is not built.** Whitespark's
  2026 Local Search Ranking Factors puts "dedicated page per service" at **#1 for local organic**;
  all five services currently share one `/services` page, and the slugs already exist unused in
  `src/data/services.ts`. Same study puts site speed at **#95 and #137 in the local pack**, with
  Core Web Vitals not listed at all — which is the honest frame for how much any front-end polish
  can move rankings here. GBP category (#1) and proximity (#2) dominate, so **adding excavation as
  a secondary GBP category outranks anything in this repo.**
- **Vercel Web Analytics is still not enabled** (`get_web_analytics` returned 404 again on
  2026-08-20). The tracking code has been shipping for weeks and recording nothing, so there is no
  device split, no traffic baseline, and no way to judge whether any change helped. One dashboard
  toggle: Project → Analytics → Enable.
- Photography is the real ceiling. Six good **landscape** shots of one excavation job unlock named project pages (`/work/<slug>`) and the pinned-scroll treatment, which are the two biggest remaining gaps vs the reference site.
- Does `(843) 998-5593` accept texts? If yes, add click-to-text — contractor leads skew heavily to SMS.
- "Uncle Donnie" vs "Danny" — Will wrote Donnie, Josiah's voice note said Danny. Site says **Donnie** in three places.
