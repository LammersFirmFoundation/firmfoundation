# Firm Foundation Property Services

Marketing site for a family-run property services company in Mount Pleasant, SC (greater Charleston / Lowcountry). Owner is **Josiah Lammers**; Will owns the repo. **The entire point of this site is phone calls and quote requests** — optimise for that, not for time-on-page.

**Landscaping, hardscapes and the dirt work under them is the business (Josiah, 2026-10-17).** His new flyer and business card list, in this order: **Excavation, Landscaping, Hardscapes, Pool & Pond Prep, Land Clearing**, with the line "Dirt work done right." He asked to bring hardscapes back and to focus on new landscape installs and hardscapes, with only occasional *small* land clearing, and not to box the site in while the business is still growing. This **supersedes the 2026-09-29 positioning** ("Land Clearing & Excavation" as the headline, landscaping and hardscapes demoted to a "smaller jobs" tier). Don't drift back to it.

So `services.ts` still has two tiers, re-cut. **`core`**, in this order: landscaping, hardscapes, excavation, pools-and-ponds ("Pool & Pond Prep", his card's words), land-clearing. **`more`**: tree-removal, drainage, forestry-mulching, custom-projects. They are linked and indexed, sit in the sixth tile of the services grid and the footer, and are never labelled "smaller" or "on request". The homepage H1 is **"Landscaping, Hardscapes & Excavation"**. Irrigation is still gone from the copy; he said it isn't him long-term. Renamed slugs get a permanent redirect in `vercel.json` (as `/services/tree-services` → `/services/tree-removal` did).

**The brand is Josiah's own badge** (the FF letters under a roofline, an excavator arm, a plant, a brick foundation, "Firm Foundation" in script). Will asked for new logo options on 2026-10-17, then chose to keep Josiah's: "we like the logo that he sent more." Don't redesign it. `src/assets/brand/` holds a vector trace of it: `logo-badge.svg` (the whole badge, footer) and `logo-lockup.svg` (mark beside the script, header), recomposed from the same traced paths. Favicons crop the FF; the 180/192 icons carry the full mark.

## Stack
- **Vite + React 18 + TypeScript strict + Tailwind 3** with a shadcn-style kit in `src/components/ui/`.
- **`vite-react-ssg`** prerenders every route to static HTML at build time: every route, including `/services/<slug>` for every service and `/guides/<slug>` for every guide, via `getStaticPaths`. This is the whole SEO story — crawlers get full HTML, not an empty `#root`.
- **Vercel** hosting. One serverless function: `api/reviews.ts`.
- `framer-motion` for scroll reveals. **The Leaflet service-area map was deleted on 2026-10-05** (`ServiceAreaMap.tsx` and its CSS). It had been unrendered since the homepage map became the coverage directory, but `index.css` still imported `leaflet.css`, so every visitor downloaded ~240 Leaflet rules in the render-blocking stylesheet; tree-shaking only ever removed the JS. `leaflet`, `react-leaflet` and `@types/leaflet` are still listed in `package.json` because the repo carries both `package-lock.json` and a binary `bun.lockb`, and removing them means regenerating both together. They ship nothing. The coordinates in `business.ts` are what a future map would read.

## Commands
- `npm run dev` (port **8080**, proxies `/api` to production so live reviews work locally)
- `npm run build` — runs `vite-react-ssg build`. **A green build is the gate; there is no test suite.**
- **`dist/404.html` is prerendered from a `404` route** in `App.tsx`, and Vercel serves it with a 404 status for any address that matches no file. Before 2026-10-17 a mistyped link got Vercel's plain-text NOT_FOUND. Keep the `404` route above the `*` catch-all.
- `npx tsc --noEmit -p tsconfig.app.json` — must be clean.
- `npx eslint .` — **3 errors are pre-existing** shadcn/Tailwind boilerplate (`command.tsx`, `textarea.tsx` empty interfaces; `require()` in `tailwind.config.ts`). Don't count them as regressions; don't "fix" them either.

## Single sources of truth — do not re-inline these
The site previously wrote these out by hand in five to seven files, which is how it ended up **showing two different Google ratings on one page** (a hardcoded `5.0` stat beside a live `4.8`). Adding a service is now a one-file change.

- **`src/data/services.ts`** — the service list, its tier, and each core service's `approaches` (the choice the homeowner has to make), `priceFactors` and `faqs`. Homepage, `/services`, every service page, the header menu, the footer, the quote form and every JSON-LD block read from it.
- **`src/data/yard-problems.ts`** — the situations a homeowner can describe but not name, each routed to a service. They feed each service page's FAQ + `FAQPage` schema, each guide's "what Josiah looks at" section, and the quote form's `?problem=` prefill. A build-time guard fails the build if one points at a service that doesn't exist.
- **`src/data/quote-questions.ts`** — the tap-to-answer questions the quote form asks per job (acreage band, what's on it, keeping trees, access, timeline). All optional, by design; see the file header.
- **`src/data/business.ts`** — NAP, service areas *with coordinates*, and schema helpers. The footer, the closing CTA's areas line, the contact page, the services FAQ, the schema `geo` and `areaServed` all derive from one array.
- **`src/lib/schema.ts`** — one `LocalBusiness` node with a stable `@id` that other pages reference.
- **`src/data/guides.ts`** — the five question pages at `/guides/<slug>`. A guide pulls service FAQs (`kind: "faq"`) and options (`kind: "approaches"`) in by reference rather than restating them, and `covers` lists the service-page questions that get a "The full answer" link to it. A build-time guard fails the build on any reference that doesn't resolve, so renaming a FAQ question means updating the guide that points at it.

`neighborhoods` (Dunes West, Park West…) is deliberately separate from `serviceAreas`: those are neighbourhoods inside Mount Pleasant, not municipalities, and listing them as schema `City` nodes was simply wrong.

## Design system
**Two colours, both from Josiah's badge and flyer** (2026-10-17): green ink `#20472c` = `hsl(138 38% 20%)` on cream paper, plus the flyer's deep-green band `#12351f`. Cream paper with green ink is the default page; deep-green bands (`<Section variant="forest">`, the closing CTA, the footer) give the page weight.

**The brief is "designed, not generated"** (Will, 2026-10-17: "creative, clean, I don't want it to look vibe coded and like AI"). Everything below comes from Josiah's own printed pieces, the business card and the flyer, rather than from a landing-page template. Before adding anything, check it against this list of patterns that were removed as template tells, and don't bring them back:
- giant two-tone ALL-CAPS section headings (a dark line over a green line) on every section;
- tiny letterspaced uppercase eyebrows on every label, nav item and button;
- uppercase pill buttons;
- numbered chips and labels laid over photographs;
- arrow-in-a-circle icons, numbered circles joined by a line;
- boxed cards for everything, and every section centred.

**Type.** Three faces, each with one job:
- **Archivo**, condensed (`font-stretch: 78%`), weight 800, for headings. **Sentence case everywhere except the homepage H1**, which is the one place set in capitals, the way the flyer sets "DIRT WORK DONE RIGHT."
- **Manrope** for everything readable, including buttons, nav and labels.
- **Besley** (a Clarendon revival, the face the flyer sets its service names and phone number in) for **quotes and numerals only**: review quotes in italic, the big phone number in the CTA, step numerals, list numbers. One warm note, never body copy.

**The section opening** is `<SectionHeader>`: a `.mark` (the badge's spaced capitals behind a short rule, "— PROPERTY SERVICES"), a sentence-case `text-title` heading in one ink, and the subtitle set beside it on desktop rather than centred under it. `accent` is still accepted but renders in the same ink. **One `.mark` per section at most**; everywhere else a label is `.eyebrow`, which is now plain sentence-case Manrope semibold, not tracked capitals.

**Components.**
- **Buttons are square-cornered (3px), sentence case**, Manrope semibold ("Get a free quote", never "GET A FREE QUOTE"). Primary is solid ink; secondary is a thin outline. Text links are underlined with a faint rule that darkens on hover.
- **Rules, not boxes.** Hairline `border-border` rules divide lists, columns and sections (the business card's vertical divider). Reach for a bordered card only when the thing really is a separate object.
- **Photos are captioned underneath, never labelled on top.** Corners are 3px. The before/after labels are the one exception, because they name the half.
- **Left-aligned by default.** Centre only something short and singular.

**Tokens.**
- **The site is light now.** `:root` holds the light values and `.dark` mirrors them, and `App.tsx` forces `light`, so a stray toggle can't half-dark it. (Until 2026-10-17 it was forced dark on charcoal with equipment yellow, sampled from his old logo.)
- **Section colour comes from `<Section variant>`**: `default` (paper), `muted` (sand), `cream` (lighter paper, for long reading), `forest` (deep green). `.on-forest` in `index.css` remaps the semantic tokens for its whole subtree, so nested buttons, borders and muted text follow. **Never hardcode a colour inside a forest band.**
- **`text-highlight`** (leaf green, `hsl(135 33% 36%)`) is **4.5:1 on paper, so display-size type only**, never body copy. On forest it remaps to a sage that measures 8.1:1. It is no longer used for the second line of headings.
- **`--border` and `--input` diverge on purpose.** Form-control boundaries need 3:1 (WCAG 1.4.11); decorative section rules don't. `--input` is much darker than `--border` (3.3:1 on paper) for exactly that reason. Don't "unify" them.
- **`cn()` knows the custom font sizes.** `src/lib/utils.ts` extends tailwind-merge with `display`/`hero`/`title`/`subtitle`; without it `cn("text-title text-foreground")` silently drops the size, which once rendered every section heading at body size. Add any new `fontSize` key there too.
- Every token pair is measured in the comment at the top of `index.css`. Re-measure any new pair, including opacity-modified ones.

## The homepage hero: three photographs, one per word
The H1 names three trades, so the hero shows three of Josiah's own photos (`HeroMosaic.tsx`): the new beds at a Mount Pleasant house front (large), the flagstone walkway, and an excavator Josiah ran on a land-clearing job (see "Josiah's machine photos" below). **Each tile is a link to that service**, so the pictures double as the first menu a visitor sees. A single excavator photo under "Landscaping" would contradict the headline's first word.

- **Copy on the paper, photos beside it (above it on a phone), never text over a photo.** The split was the fix that made the old hero legible (a full-bleed photo needed a wash so heavy that the h1 measured 2.18:1 when it was opened up). Nothing about that has changed: axe cannot evaluate text over images, so don't reintroduce it.
- **The mosaic sits BELOW the header, not under it.** The header is transparent over the hero, and the old full-height photo needed an `h-36` cream band to keep the nav legible where it crossed the sky (1.27:1 without it). Starting the photos at `lg:top-28` (below the 96px header at the top of the page) removes the problem rather than masking it.
- **The copy column is measured from the centred `max-w-content` container; the mosaic is positioned against the VIEWPORT** (`lg:left-[54%]`). Different origins, so they can overlap even when the percentages look like they add up. Re-measure `copyRight < mosaicLeft` across 1024 to 1920 if either moves.
- **A staggered composition, not a grid** (Will, 2026-10-17: "stagger them so they're a little offset and more aesthetic"). `HeroMosaic` is an artboard of fixed proportions with each photo placed on it by percentage, so the offsets hold at every width. Desktop: Landscaping large across the top on the frame's right edge, Hardscapes stepping out to the left below it, Excavation back on the right edge and set lower. Phone: Landscaping large on the left, the pair on the right starting lower and finishing below it. Even gutters, and every photo shares an edge with another; a first pass with free-floating offsets read as scattered. At `lg` the artboard is `min(100%, (100svh - 9rem) * 0.825)` wide (7rem above, 2rem below), so it fits whichever of width or height runs out first.
- **The photos are uncovered once each, in turn, as the page opens** (`.tile-reveal` in `index.css`): a paper-coloured sheet draws up off each picture while it settles from a slight zoom. Pure CSS, so it starts on the first paint without waiting for JavaScript, and off under reduced motion. **The image never starts transparent**, which is what keeps it the LCP element: LCP ignores anything laid over an element, so it is counted from the first frame. Measured 2026-10-17: the Landscaping photo is LCP at 1440, 1280 and 390 wide. Never move the reveal onto the image's own opacity or clip-path. The image keyframe uses `backwards` fill, not `both`, so the hover zoom works once it ends.
- **All three load eagerly**; the large tile carries `fetchpriority="high"`, written lowercase via a spread because React 18 warns on the camelCase prop.
- **The copy's `.frame` must stay `pointer-events-none`** (the copy column inside it re-enables them). At `lg` the frame spans the whole hero above the absolutely positioned photos, and until 2026-10-17 it silently swallowed every click on them: the photos and their arrows did nothing on any desktop. Re-run an `elementFromPoint` check on each tile after touching the hero.
- **Retired 2026-10-17:** the WebGL relit hero (`relit-hero.ts`, `RelitHero.tsx`, its depth map) and `HeroVideo.tsx` with `public/hero-excavator.mp4`. They lit one photograph of one machine, which no longer leads. Both are in git history before that date. The licensing notes from that work still hold: **Codrops demos are MIT; Shadertoy's default is CC BY-NC-SA 3.0, no commercial use.**

### Before and after, side by side
`BeforeAfterPair.tsx` shows two photos of the same spot with real "Before" / "After" labels: on the landscaping and hardscapes cards in the services grid, and as the hero picture of those two service pages. The halves are split out of Josiah's gallery composites (`src/assets/services/*-before.jpg`, `*-after.jpg`). **Side by side only, never a slider or an overlay**: they are phone photos from roughly the same spot, not a tripod, and anything implying one frame would show the seams. The pair is one `role="img"` with one label, so a screen reader hears it once.

## The survey layer — and why it is NOT three.js
`src/lib/survey-layer.ts` draws topographic contour lines in ~120 lines of raw WebGL. Contour
lines are the literal visual language of grading and drainage, so the motif comes from Josiah's
trade rather than from a demo. Two modes, both a single finite pass: `ambient` (crosses the CTA
band once, then settles into a still survey sheet that stays) and `reveal` (one sweep, canvas
dropped afterwards). **`reveal` currently has no caller**: it drove the hero until 2026-09, because
a single bright line crossing a photograph reads as a lightning flash rather than a survey. Keep it
or delete it; don't leave it as a third state.

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
  device least able to spare it.
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
**Photos carry the cards and the heroes; drawings explain.** The homepage hero is three of Josiah's own photos (above), and the excavation and land-clearing pages lead with machines Josiah operated (`src/assets/services/excavation.jpg`, `land-clearing-from-the-cab.jpg`). The landscaping and hardscapes photos are his Mount Pleasant jobs, and their before-and-after halves come from the gallery composites. **Josiah sent three more on 2026-10-09** (from the cab, portrait phone shots): a stump coming out root ball and all is now the Tree & Stump Removal photo, a cleared tract seen over the bucket is the land-clearing card, and all three are in the Gallery (a forestry-mulching shot only there). Gallery rows pair like shapes, so the stump photo uses its landscape crop there too. He didn't say where the jobs were, so their schema carries no place and their gallery label says who was operating ("Operated by Josiah"). One shows a decal reading "The Perry Company": that is a Texas maker of cab accessories, not another contractor, so nothing was retouched. The crops for the service slots stop above it anyway. Grading, pools & ponds and drainage still use **licensed stock** (`src/assets/stock/`, Unsplash/Pexels, no attribution required, sources and rules in `CREDITS.md`), added 2026-09-29 at Will's request for "professional, authentic land clearing images". Stock rules:
- **never** in the Gallery, never captioned as a job, and alt text says only what is in frame;
- nothing showing another contractor's name or phone number (the photo search rejected several, and one dealer sticker was retouched off);
- replace each photo the moment Josiah has a real one.

### Josiah's machine photos are his experience, not the company's jobs
**On 2026-10-27 Josiah said what the machine photos are:** him operating, much of it on another land-clearing contractor's crew. He asked that the experience come through ("this isn't my first rodeo"; "these are actual pictures of me … not just general pictures") and that the contractor **not be named**. The name is in hq, never in this public repo. So:
- **`/gallery` has two groups**: Firm Foundation's own projects, then a "Land-clearing experience" section with the four machine photos, every one captioned "Operated by Josiah" (Josiah, 2026-10-28: he is operating in all of them, including the Cat 305 in front of the log pile, which still carries "Lowcountry, SC" only in its schema place). They are not presented as Firm Foundation jobs.
- **The excavator in the hero and on the excavation page is a Cat 305** (Josiah's words), and its alt text and caption say so.
- **Service pages caption a photo of Josiah at work** (`imageCaption` in `services.ts`: excavation, land clearing, tree removal, forestry mulching). Never set it on stock: a caption is the claim "this is his work".
- **Alt text says Josiah ran the machine**, never "Firm Foundation's excavator": nobody has said the company owns it.
- **Plain, professional wording** (Will, same day: "it should be professional still"). State what he operated, on what work, and that he is the operator; no idioms in headings, and no "not stock" protest. NN/g's trust research backs saying it at all: visitors want to see the work being done and who does it, and generic result photos read as filler.
- **No timeline or numbers are claimed** (how long he ran machines, when, how many acres), because none have been given. A real figure ("five years operating excavators") would be the strongest line on the page; ask Josiah, then add it.

NN/g and the Harrington Movers test (+45% for a real truck photo over stock) are the reason: **his own photos will outperform all of these.** No licensed pool-dig photo exists, so a real one is the most valuable ask.

Each core service also has a **section drawing** (`ServicePlate.tsx`) in the language of a civil detail sheet: hatched earth, dashed existing grade, the water-table symbol, a title block marked "N.T.S.". On service pages it sits beside the choice it illustrates ("grind it or pull it", "a pool dig or a pond"). It shows the underground half of the work that no photo can.
- **`ServiceImage` shows the photo when `image` exists, else the plate.** `cardImage` lets a grid card use a different photo from the page hero, and `beforeAfter` replaces both with the pair. Both exist so the homepage doesn't show the same photo twice in one scroll: the hero already has the finished landscaping, walkway and excavator shots.
- **Every dimension drawn is a published one, cited in a code comment, never ours:** 6 in. of fall in the first 10 ft (IRC R401.3) on the grading plate, a 4 in. minimum compacted base under a patio (CMHA Tech Note PAV-TEC-002) on the paver plate, and 2 to 3 in. of mulch kept off the stems (Clemson HGIC 1052 and 1604) on the bed plate. Don't add numbers that are ours.
- **Never add `vectorEffect="non-scaling-stroke"` to a drawn path.** It breaks framer-motion's `pathLength` normalisation, and lines stop drawing partway. That cost an iteration.
- **Callouts hide in `compact` mode and below `sm`.** At card size or phone width the 8.6-unit labels render at 6–7px. `.on-dark` (in `index.css`) keeps a plate's dark palette when it sits inside a cream section.
- **They draw once and stay drawn** (WCAG 2.2.2, the same rule as the survey layer), and render finished under reduced motion.

## Navigation and the mobile bars
- **The logo is as large as each width allows** (Josiah, 2026-10-27: make the name stand out more). Phones: 34px tall at 320, 40 at 375, 42 at 390, 48 from 430; the call and menu buttons set the limit, and the button group's `-mr-2.5` lets their 44px tap targets overhang the margin so the menu icon sits on the frame edge and the logo gets ~10px more. Desktop: 56px at the top of a page, easing to 48px once the bar turns solid, with the bar's padding tightening too. Measured gaps beside the logo stay at least 24px at every width; re-measure if anything joins the header.
- **On the homepage the logo is the hero's focal point** (Josiah, 2026-10-27/28: "bigger or just more emphasized … a little bit focal point"). The header has no room to grow it on a phone, so the homepage shows the lockup large in the hero (full column width on a phone, up to 21rem, above the photos; 26 to 28rem at the head of the copy column on a desktop), and the header's own logo is out of sight (`opacity-0`, `aria-hidden`, out of the tab order) until that one scrolls up under the bar, then fades in. `<Header brandInHero>` watches every `[data-hero-brand]` with an IntersectionObserver; it starts hidden on the server so the prerender never shows two logos. Every other page keeps the normal header logo.
- **The logo always goes home, including from the homepage itself** (`HomeLink.tsx`, used by the header and the footer badge). A link to "/" on "/" is a no-op, so Josiah tapped the logo halfway down the homepage and nothing happened; there it now scrolls to the top.
- **A plain Services dropdown, not a mega menu.** NN/g recommends mega menus for big sites; five services fit in one short list (Radix NavigationMenu, no Viewport, so the list positions under its trigger). The other four are named in its footer, in the mobile menu and in the site footer.
- **The full nav starts at `lg`, not `md`.** Five links, the phone number and the quote button need about 1,000px; at 820px the button was cut off. Below `lg` it is the logo, a call button and the menu.
- **On phones the header slides away while scrolling down and returns on scroll up**, and the sticky Call/Text/Quote bar shows whenever less than half of the hero's own buttons (`#hero-actions`) is on screen, above or below, or after 240px on other pages. "Below" matters since the hero logo (2026-10-28): on a 390×844 phone the hero buttons now start just under the first screen, so the bar carries the call there instead; on a 430px phone they fit and the bar stays down. Measured: every size from 320×640 to 430×932 has a working call/quote on the first screen, and the same three actions are never on screen twice. Two fixed bars on a 390px screen is the pattern NN/g singles out. Conversion Rate Experts measured a CTA bar that appears after scroll at +25%. While hidden, the bar is `inert`.

## Motion rules
Motion goes on **imagery**: photo curtain reveals, drawings drawing in, the process line. Text gets only a fast mask-rise on headings. NN/g finds slow scroll-triggered text reads as lag. The hero headline's rise is **pure CSS** (`.hero-line`, `.hero-rise` in `index.css`), so the prerendered HTML is the finished headline. Never put `FadeInView` or any JS reveal on above-the-fold text: its `opacity:0` start state is baked into the static HTML. `eager` images never animate. Everything plays once, and under reduced motion it is instant rather than absent (see the reduced-motion gotcha).

## The quote form — scoping, not just contact
`/contact` asks for the job first (five core cards plus "Something else"), then chips specific to that job, then name and phone. **Email is optional**: Josiah calls or texts back, so requiring email blocked the one thing the visitor came to do. The Formspree payload carries a one-line `summary` (e.g. "Land Clearing · ¼ to 1 acre · Brush & vines, Small trees · Yes, some · New build") plus each answer as its own labelled line. `?problem=<id>` and `?service=<slug>` prefill it. Formspree's free tier has no file upload, so the form asks people to **text photos** instead. Tested end to end with Formspree mocked (2026-09-29). **On a phone the form comes first** and the "Rather talk?" contact list follows it; on desktop the list sits left and sticky.

## Homepage order, and why
**Order (2026-10-17): hero → reviews → services → how it works → Instagram → story → CTA.** (A before-and-after band was cut the same day: the same two jobs already lead /services and both service pages.) Each block answers one question a visitor has; see the header comment in `LandingPage.tsx`. About 6.5 screens on desktop, 9 on a 390×844 phone. Rules carried over from the 2026-09-29 simplification, with the evidence, so they aren't undone by habit:
- **Reviews directly under the hero.** NN/g puts about 65% of viewing time in the top 40% of a page, and third-party proof is what a cold visitor lacks. **Proof before biography** (on 2026-08-21 the reviews sat at screen 8.9 of 12.7).
- **Reviews are static, never a carousel.** NN/g: an auto-forwarded item is visible about 20% of the time. `ReviewsGrid` sets the most relevant review as a pull quote with two beside it, and skips reviews of retired services (pressure washing). The rating is still the true average of all of them.
- **The services are a typeset list (`ServicesIndex`), not a card grid**, the way the business card lists them. The hero already carries the photographs; `/services` has the picture grid (`ServicesBento`). On a desktop with a mouse, hovering a row brings up that service's photo (or its drawing) beside the cursor, placed past the end of the hovered name so it never covers it. It is enhancement only: switched on after mount by a `matchMedia` for hover, a fine pointer, `lg` and no reduced motion, so it is never in the prerender and a phone, keyboard or crawler gets just the list.
- **The story band shows both family photos on a desktop**, staggered like the hero (cab photo large, toy tractor smaller and lower). Phones keep one photo; the second is `hidden` there so the lazy image never loads.
- **"Not sure? Send a photo" lives in the closing CTA** ("Text a photo of the yard"), not in its own band.
- **Areas served are one line in `CtaSection`** on every page, not a grid repeating the footer.
- **The Instagram strip renders nothing until the feed is connected** (see External setup), so the page never shows an empty frame.

Re-measure with a scripted section audit rather than by eye: section heights in *screens* is the unit that matters, and it differs a lot between desktop and mobile.

## Deliberate omissions — these are decisions, not oversights
- **No licensing / insurance / bonding / permitting claims anywhere.** These are verifiable legal claims, not marketing copy, and Will explicitly chose to leave them off (2026-08-19). **Corrected 2026-09-29, from the statute text:** the $500 residential-specialty threshold (S.C. Code §40-59-20(7)) covers a list of trades (plumbing, electrical, HVAC, roofing, masonry, carpentry…) that **does not include grading, excavation, land clearing or tree work**. **"Grading" is a Contractor's Licensing Board subclassification** (§40-11-410(2)(d)), and CLB licensing starts at **$10,000** total cost (§40-11-30, raised from $5,000 in 2023). Using the words "licensed contractor" without a CLB licence is itself unlawful (§40-11-370). **Unresolved:** whether a stand-alone residential grading or pool-dig job over $10,000 needs a CLB Grading licence. That is a question for LLR, not for this site, and it matters more now that grading and pool digs are core work. **Also unresolved since hardscapes became core (2026-10-17): "masonry" IS on the §40-59-20 residential-specialty list**, so whether paver, stone-walkway or segmental retaining-wall work over $500 needs a residential specialty registration is another LLR question. Until someone has asked, the site makes no claim either way. Same reason the Custom Projects copy doesn't advertise **electrical** even though he did the electrical on the pantry job.
- **No `aggregateRating` / `Review` nodes in JSON-LD.** Google makes a business republishing reviews about itself ineligible for the star rich result, so the markup can never pay off. Real ratings still render for visitors — they're just not claimed as schema.
- **No hero video.** All of Josiah's clips were portrait phone video (`rotation=-90`); cropped to a landscape band behind a headline they read as noise, and the clip and its player were deleted on 2026-10-17. If stabilised landscape footage ever arrives, it would have to earn a place against the three-photo hero. **Tell them to turn the phone sideways.**

## Josiah's mission portrait — what was used and what wasn't
He shared a Wildfire Leadership "mission portrait" (2026-08-19): core values *Courageous, Witty, Life-Giving, Hardworking, Warrior*; ID *Live it out*; mission *Live a life of integrity*; vision *To speak life and change the atmosphere*; anchored on **Matthew 7:24** ("…builds a house on solid rock").

- **The verse is where the company name came from**, and that had never been stated anywhere on the site. It's now a section on `/about` — understated, one verse, one paragraph tying it to getting the base right. This is the single strongest thing in that document.
- **Mission wording ("live a life of integrity") frames the principles section subtitle.**
- **The personal-formation language stays out of the page copy.** *Witty*, *Warrior*, *ID: Live it out* are discipleship vocabulary that would read as confusing to a homeowner comparing excavation quotes. Not a slight; wrong register for the audience. They do appear inside the portrait image and its alt text, below.
- **The portrait image IS published, at Will's request (2026-08-19, d71c9d5):** it is the left half of the Matthew 7:24 section on `/about`, with the copy beside it. It carries Wildfire Leadership's branding, so it is the one image to revisit if Josiah ever wants the About page to read as his company alone. (An earlier version of this file said it was not published; that was written before d71c9d5 and was wrong from that day.)
- How faith-forward to be is a **business positioning call that belongs to Josiah**, not a design decision. Current setting is "explains the name, doesn't preach." Dial either way on request.

## Gotchas that cost real time
- **`vercel.json` needs `cleanUrls: true`.** Without it the catch-all rewrite swallowed every interior route and `/services` was served the *homepage's* HTML and canonical tag — silently telling Google that `/services`, `/gallery`, `/reviews` and `/contact` were all duplicates of `/`. Verify after routing changes with `npx vercel build --yes` then read `.vercel/output/config.json`: `{"handle":"filesystem"}` must appear **before** the catch-all rewrite, and `overrides` must map `services.html → services`.
- **The static head is injected with a `String.replace`**, which eats `$$` as an escape — `priceRange: "$$"` shipped to crawlers as `"$"`. `SEO.tsx` escapes every `$` to the unicode form `\u0024` before emitting the JSON-LD (a JSON parser decodes it straight back, so the structured data is unchanged); leave that alone.
- **Reviews are real and pinned.** `api/reviews.ts` reads an Apify **task** (`APIFY_TASK_ID`, default `JKIP67d4omFdYH0Qp`) and filters by `place_id` — an earlier version read "last run across the account" and put **another business's reviews** on the site. `src/data/fallbackReviews.ts` is a snapshot of the real ones, used only when the API fails; its rating is derived from the reviews actually rendered so the headline can never disagree with what's on screen.
- **Steve Kelly's review praises "power washing"**, a service they no longer offer, and it's the first carousel slide. It's a genuine Google review — deleting it would be cherry-picking *and* would swing the fallback average from 4.8 to 5.0, re-creating the bug this all started with. The fix is more recent excavation reviews, not editing this one.
- **Google review avatars must go through `sizedPhoto()` (`src/lib/reviewPhoto.ts`).** Google's photo CDN puts the requested size in the URL and Apify returns the 1920px original, so five 48px circles were pulling **8.67MB** — two of them 2.9MB and 3.4MB each. Rewriting `=s1920` to `=s96` costs nothing and cuts it to 64KB. It's applied at render, not in the data, so it covers both the live API response and `fallbackReviews.ts`. Any new place that renders `avatarUrl` needs it too.
- **Nothing above the fold may use plain `<FadeInView>`.** It starts at `opacity:0` and vite-react-ssg bakes that start state into the prerendered HTML — the hero h1, subtitle and both CTAs shipped invisible until framer-motion hydrated. Pass `immediate` for above-the-fold content. Check with `curl` + grep for `opacity:0` before the `<h1>` after touching the hero.
- **Titles must contain "Firm Foundation" inline.** `SEO.tsx` only appends the site name when the title doesn't already mention the brand, so a title without it silently grows to ~90 chars. The guides guard enforces it for those; the page titles are 42–66 chars and carry the locality.
- **Reduced motion may change a transition, never markup or a start state.** `useReducedMotion()` is false while prerendering and true on such a visitor's first render, so anything it changes in the rendered output breaks hydration. Until 2026-10-05 it did, on every page: `ScrollProgress` returned `null` and `FadeInView`/`StaggerContainer` swapped `motion.div` for a plain `div`, React threw #418/#423 and client-rendered the whole root. The rule now: `initial` is the same for everyone; reduced motion gets `transition={{ duration: 0 }}`, or a `shown` variant (the end state, no transition) for variant-driven motion (`ServicePlate`, `StaggerContainer`). (The scroll-progress bar that also once broke this was removed on 2026-10-17: a blog device that added nothing to a six-screen trade site.) **A fix to one component alone is worse than none**: once hydration succeeds React 18 does not patch attributes, so any `FadeInView` still swapping elements would keep the prerendered `opacity:0` and stay invisible for exactly these visitors. Check with Playwright's `reducedMotion: "reduce"`: no page errors, and nothing left at `opacity:0` after scrolling.
- **iOS Safari auto-zooms any focused control under 16px.** `input.tsx` uses `text-base md:text-sm` for exactly this reason; `textarea.tsx` was missing it and yanked the viewport on the lead form. Keep both patterns in sync.
- **Grid/flex children need `min-w-0`.** The gmail address and `@firmfoundation_sc` are unbreakable tokens; without it they pushed the page past the viewport at 320px.

## External setup (outside the repo — you can't find this by reading code)
- **Vercel MCP is connected.** Project `prj_YXYiByVTJ2fousNeHY35SBxyEsIA`, team `team_Qvqzen2SxSvJoGieMOpKOkai` (also in `.vercel/project.json`). Domain **firmfoundationsc.com**. Use `mcp__claude_ai_Vercel__get_project`, `list_deployments`, `get_runtime_logs`, `get_deployment_build_logs`, and `get_web_analytics` — you do **not** need to ask Will to paste dashboard screenshots.
- **Web Analytics is wired in code** (`src/components/Analytics.tsx`, mounted client-only via `ClientOnly` so prerendering is untouched). Custom events: `phone_click` (with `where` — header / header-mobile / mobile-bar / page-cta / contact-page), `quote_request` (with `service`), `email_click`. **Every event stays at ≤1 property; the included plan allows 2 — don't add a third or it forces the $10/mo Plus tier.**
- **Speed Insights is deliberately NOT installed.** It's a separately billed Vercel product and Will's instruction was no extra spend (2026-08-19). Measure Core Web Vitals locally with Lighthouse/Playwright instead. Don't "helpfully" add `@vercel/speed-insights` back.
  **⚠️ As of 2026-08-19 `get_web_analytics` returns 404 "Web Analytics not found" — it still has to be switched on once in the Vercel dashboard (Project → Analytics → Enable).** Check that first if the query fails; it is not a code bug.
- **The Instagram strip needs `BEHOLD_FEED_ID` in Vercel env** (added 2026-10-17). `api/instagram.ts` reads Josiah's six latest posts from a free Behold JSON feed (behold.so), which holds the Instagram login, refreshes its 60-day token and re-hosts the pictures; Instagram's own image URLs are signed and expire. **Until the variable is set, the endpoint returns no posts and the homepage strip renders nothing**, which is a supported state, not a bug. Setup: Josiah's account must be a Professional account (Business or Creator, free and reversible in Instagram's settings); someone with his login connects it at behold.so as a basic source, creates a JSON feed, and puts the feed ID (the last part of `https://feeds.behold.so/<id>`) in Vercel as `BEHOLD_FEED_ID`, then redeploys. **The free plan pauses at 1,200 requests a month**, so browsers must never call Behold directly: they call `/api/instagram`, whose `s-maxage=21600` lets Vercel's CDN answer nearly every request. Don't shorten that cache or fetch the feed client-side. The handle is **@firmfoundation_sc**; the old `@firmfoundation_chs` no longer exists (checked 2026-10-17).
- **`APIFY_TOKEN` must be set in Vercel env**, or `/api/reviews` 500s and the site silently falls back to the snapshot. `.env.local` holds the local copy and is gitignored.
- **The repo is PUBLIC.** `.claude/settings.local.json` contains the Apify token inside approved-command strings; it's gitignored both globally and in-repo now, but never move it or commit it.
- **Contact form posts to Formspree** (`xlgwpbnn`, hardcoded in `ContactUs.tsx`). No backend — if leads stop arriving, check Formspree, not the code.
- **Google Business Profile:** the category decision (primary vs secondary, and which) is in Open items. Research put GBP categories above any on-site change for local ranking.

## Verifying visual work
There's no browser extension here, but Playwright with system Chrome works and is how every visual claim in this repo was checked. Scripts live in the session scratchpad, not the repo — rebuild them as needed. Serve `dist/` over plain `http.server`-style Node and:
- **Screenshots** — scroll the page in ~0.6vh steps before capturing, or `FadeInView`'s IntersectionObserver never fires and full-page shots come back with huge empty sections.
- **axe-core** — **0 violations** on every route, guides included (re-checked 2026-10-05). Keep it there.
- **Horizontal overflow** — check 320/375/414/768/1024/1440/1920. **Clean at every width** (re-checked 2026-09-29): `html, body { overflow-x: clip }` in `index.css` contains `FadeInView`'s off-screen start states without becoming a scroll container (which would break `position: sticky`). Re-checked after the 2026-10-17 redesign: clean at every width on every route. The overflow check also flags any element inside `<main>` wider than the viewport, which is how the non-wrapping "More on pool & pond excavation" button at 320px was caught.
- **Contrast** — compute WCAG ratios for real token pairs including opacity-modified ones (`text-charcoal/55` etc.) rather than eyeballing.

## Open items
- **Google Business Profile categories were changed on 2026-10-21, at Josiah's request** (he wanted "landscaping stuff to come up instead of just excavating"). Primary is now **Landscaper**; additional are Property maintenance, Excavating contractor and Paving contractor. Before, Excavating contractor was primary. Google asked for no re-verification. The picker has **no hardscape category**, and its only patio one, "Patio enclosure supplier", doesn't fit, so Paving contractor stands in. Whitespark 2026 puts primary category at #1 for the map pack, and nothing on the site can outvote it, so don't move it back without Josiah. The same day the profile description was rewritten to lead with landscaping (no licensing or price claims, matching the site; it dropped the old mentions of irrigation and palm trimming) and 13 services were added: Landscape installations, Retaining walls and Sod installation from Google's own list, the rest custom. The profile can be edited from Will's Google account. (The 2026-09-29 advice, Excavating contractor primary, belonged to the clearing-first positioning and is superseded.)
- **Search Console is a URL-prefix property for `https://firmfoundationsc.com/`** (there is no domain property), reachable from Will's Google account; `googlea01cc30a344a5dd0.html` in `public/` is its verification file. The sitemap was first submitted 2026-02-21 and resubmitted 2026-10-21; indexing was requested that day for `/`, `/services/landscaping` and `/services/hardscapes`. Check it there rather than guessing what Google has indexed.
- **A different "Firm Foundation Property Services" exists in Greater Atlanta** (trustfirmfoundation.com, a Wix site with a 678 number, pressure washing and landscaping). It is not Josiah's, and it came first on Google for the bare name on 2026-10-21. Location searches are the ones that matter, which is why every page title carries "Mount Pleasant" or "Charleston"; don't drop the locality from a title.
- **Searchers say "Charleston", not "Mount Pleasant", for clearing.** Google autocompletes "land clearing mount pleasant" to Mount Pleasant, **TX**. Titles and H1s therefore pair the two ("Mount Pleasant & Charleston"). Coverage for clearing is probably wider than the nine towns listed (Awendaw, Wando/Cainhoy, Huger, Ravenel), but those are Josiah's to add, not ours to invent.
- **Guides exist to be cited by search and AI answers for questions people describe rather than name** (`src/data/guides.ts` header has the why). Baseline, 2026-10-05: a web search for five such questions (tree permit, clearing cost, yard flooding, "best land clearing company Charleston", who digs a pool) surfaced Firm Foundation for **none** of them. Re-run the same five about a month after the guides are live before adding more. Two things outside the repo matter more for the category query: free profiles on Yelp, Bing Places, Apple Business Connect, Nextdoor and Facebook (the "best" answers are built from Angi, Yelp and HomeAdvisor), and reviews past 20. Add each new profile to `sameAs` in `src/lib/schema.ts`. **The guides deliberately publish no prices**, and the clearing-cost question is therefore unwinnable here: every page that ranked for it gave $/acre ranges. Publishing honest ranges is Josiah's call.
- **The FAQ permit answers cite code sections verified 2026-09-29** (Mount Pleasant Zoning Code Ch. 156, S.C. Code Titles 40/48/49/58, 33 CFR 323.2, IRC R401.3). Ordinances change, so re-verify yearly. Charleston County's tree rules were deliberately left out: Ord. 2275 and a 2024 grand-tree amendment couldn't be read.
- **Vercel Web Analytics is still not enabled** (`count_pageviews` returned "Web Analytics not
  found" again on 2026-09-29, and 404 on 2026-08-20). Turn it on before any ad spend. The tracking code has been shipping for weeks and recording nothing, so there is no
  device split, no traffic baseline, and no way to judge whether any change helped. One dashboard
  toggle: Project → Analytics → Enable.
- Photography is still the ceiling. The stump-root-ball ask was met on 2026-10-09. Still asked for, in order: a before and after of one clearing job from the same spot, a pool dig mid-dig, a finished French drain before backfill, and anything showing grading. **Landscape orientation, taken outside the cab**: the 2026-10-09 set is portrait and shot through glass, which crops well for a card but streaks and reflections limit them (the mulching one is gallery-only for that reason). Each one drops into `services.ts` and replaces a drawing with no other change. Six good shots of one job would also unlock named project pages (`/work/<slug>`).
- "Uncle Donnie" vs "Danny" — Will wrote Donnie, Josiah's voice note said Danny. Site says **Donnie** in three places.
