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

## The survey layer — and why it is NOT three.js
`src/lib/survey-layer.ts` draws topographic contour lines in ~120 lines of raw WebGL. Contour
lines are the literal visual language of grading and drainage, so the motif comes from Josiah's
trade rather than from a demo. Two modes: `ambient` (drifts behind the CTA band) and `reveal`
(one survey sweep over the hero on load, then the canvas and its GL context are dropped).

- **three.js was evaluated and rejected on measurement, 2026-08-20 — don't re-open it without new
  numbers.** Built against this repo's own toolchain, a realistic tree-shaken three.js hero scene
  (r0.185.1: renderer, scene, camera, instanced mesh, shader material, fog, lights) came to
  **106,027 bytes brotli** against the 198,434 the whole site's JS weighs. The shipped survey layer
  costs **2,469 bytes brotli** in its own lazy chunk plus **295 bytes** on the app chunk. A scene
  graph buys nothing here: an ambient background is one triangle and a function that colours
  pixels. `ogl` was measured at 12,749 brotli and is the middle option **if real geometry ever
  appears** — a before/after grade or drainage visualisation is the one case that would earn it.
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
