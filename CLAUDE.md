# Firm Foundation Property Services

Marketing site for a family-run property services company in Mount Pleasant, SC (greater Charleston / Lowcountry). Owner is **Josiah Lammers**; Will owns the repo. **The entire point of this site is phone calls and quote requests** — optimise for that, not for time-on-page.

**The business is pivoting toward small excavation** (grading, drainage, irrigation trenching, clearing, driveway prep) while keeping landscaping, hardscapes, tree work and custom projects. That's why Excavation is first in `src/data/services.ts`, and order in that file is the order it renders everywhere.

## Stack
- **Vite + React 18 + TypeScript strict + Tailwind 3** with a shadcn-style kit in `src/components/ui/`.
- **`vite-react-ssg`** prerenders all 6 routes to static HTML at build time (`/`, `/services`, `/gallery`, `/about`, `/contact`, `/reviews`). This is the whole SEO story — crawlers get full HTML, not an empty `#root`.
- **Vercel** hosting. One serverless function: `api/reviews.ts`.
- `framer-motion` for scroll reveals, `leaflet`/`react-leaflet` for the service-area map (client-only — it touches `window` at import).

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
- **Grid/flex children need `min-w-0`.** The gmail address and `@firmfoundationsc` are unbreakable tokens; without it they pushed the page past the viewport at 320px.

## External setup (outside the repo — you can't find this by reading code)
- **Vercel MCP is connected.** Project `prj_YXYiByVTJ2fousNeHY35SBxyEsIA`, team `team_Qvqzen2SxSvJoGieMOpKOkai` (also in `.vercel/project.json`). Domain **firmfoundationsc.com**. Use `mcp__claude_ai_Vercel__get_project`, `list_deployments`, `get_runtime_logs`, `get_deployment_build_logs`, and `get_web_analytics` — you do **not** need to ask Will to paste dashboard screenshots.
- **Web Analytics + Speed Insights are wired in code** (`src/components/Analytics.tsx`, mounted client-only via `ClientOnly` so prerendering is untouched). Custom events: `phone_click` (with `where` — header / header-mobile / mobile-bar / page-cta / contact-page), `quote_request` (with `service`), `email_click`.
  **⚠️ As of 2026-08-19 `get_web_analytics` returns 404 "Web Analytics not found" — it still has to be switched on once in the Vercel dashboard (Project → Analytics → Enable).** Check that first if the query fails; it is not a code bug.
- **`APIFY_TOKEN` must be set in Vercel env**, or `/api/reviews` 500s and the site silently falls back to the snapshot. `.env.local` holds the local copy and is gitignored.
- **The repo is PUBLIC.** `.claude/settings.local.json` contains the Apify token inside approved-command strings; it's gitignored both globally and in-repo now, but never move it or commit it.
- **Contact form posts to Formspree** (`xlgwpbnn`, hardcoded in `ContactUs.tsx`). No backend — if leads stop arriving, check Formspree, not the code.
- **Google Business Profile:** excavation still needs adding as a **secondary** category (leaving the primary alone avoids re-verification). Research put GBP service categories above any on-site change for local ranking.

## Verifying visual work
There's no browser extension here, but Playwright with system Chrome works and is how every visual claim in this repo was checked. Scripts live in the session scratchpad, not the repo — rebuild them as needed. Serve `dist/` over plain `http.server`-style Node and:
- **Screenshots** — scroll the page in ~0.6vh steps before capturing, or `FadeInView`'s IntersectionObserver never fires and full-page shots come back with huge empty sections.
- **axe-core** — currently **0 violations across all 6 pages**. Keep it there.
- **Horizontal overflow** — check 320/375/414/768/1024/1440/1920. Currently clean at every width.
- **Contrast** — compute WCAG ratios for real token pairs including opacity-modified ones (`text-charcoal/55` etc.) rather than eyeballing.

## Open items
- Photography is the real ceiling. Six good **landscape** shots of one excavation job unlock named project pages (`/work/<slug>`) and the pinned-scroll treatment, which are the two biggest remaining gaps vs the reference site.
- Does `(843) 998-5593` accept texts? If yes, add click-to-text — contractor leads skew heavily to SMS.
- "Uncle Donnie" vs "Danny" — Will wrote Donnie, Josiah's voice note said Danny. Site says **Donnie** in three places.
