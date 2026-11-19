import { Button } from "@/components/ui/button";
import { Link, useLoaderData } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import SEO from "@/components/SEO";
import CtaSection from "@/components/CtaSection";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import GoogleIcon from "@/components/icons/GoogleIcon";
import StarRating from "@/components/StarRating";
import ServicesIndex from "@/components/ServicesIndex";
import ProcessSteps from "@/components/ProcessSteps";
import ReviewsGrid from "@/components/ReviewsGrid";
import HeroMosaic from "@/components/HeroMosaic";
import logoLockup from "@/assets/brand/logo-lockup.svg";
import OurStory from "@/components/OurStory";
import { useReviews, type ApiResponse } from "@/lib/useReviews";
import { useInstagram, type InstagramFeed } from "@/lib/useInstagram";
import InstagramStrip from "@/components/InstagramStrip";
import { workFilmSchema } from "@/components/WorkFilm";
import { BUSINESS, howAJobRuns } from "@/data/business";
import { localBusinessSchema, websiteSchema } from "@/lib/schema";


/**
 * The homepage, in order, each block answering one question a visitor has:
 *
 *   1. Hero: what do they do, is it any good, how do I reach them?
 *   2. Reviews: says who?
 *   3. Services: do they do my job?
 *   4. How it works: what happens if I call?
 *   5. Instagram: what are they working on now? (only once the feed is live)
 *   6. Story, then the CTA: who is this, and where do they work?
 *
 * Cut, and why, so nothing comes back by habit:
 * - 2026-09-29: a service strip that repeated the grid under it; the six-item
 *   "what are you looking at?" accordion (its answers are service-page FAQs);
 *   the review carousel; a fourth process step; an areas grid that repeated
 *   the footer (the areas are one line in the CTA).
 * - 2026-10-17: the before-and-after section (the same two jobs already lead
 *   the hero, /services and both service pages, so the homepage showed each
 *   twice in two screens), the "send a photo" band (the CTA carries it), and a
 *   spaced-capitals label over every section, which read as a template.
 */
/** The three kinds of caller the excavation work comes from. */
const audiences = [
  {
    title: "Homeowners",
    body: "Grading a yard that holds water, a pad for a shed or a drive, a lot cleared for a build, then the beds and patio on top.",
    cta: "Get a free quote",
    href: "/contact?service=excavation",
  },
  {
    title: "Builders and remodelers",
    body: "Site prep, cut and fill, pads and trenching to the grade the next trade needs, with the spoils hauled off.",
    cta: "Send the plans",
    href: "/contact?service=excavation",
  },
  {
    title: "Pool builders",
    body: "We dig to your layout and depths, get the dirt gone, and come back for backfill and final grade when the shell is in.",
    cta: "Pool dig details",
    href: "/services/pools-and-ponds",
  },
];

const LandingPage = () => {
  const loaderData = useLoaderData() as (ApiResponse & { instagram?: InstagramFeed }) | undefined;
  // The loader returns an empty review list when only Instagram answered;
  // that must fall back to the snapshot, not count as "no reviews".
  const { reviews, aggregateRating, totalReviewCount } = useReviews(
    loaderData?.reviews?.length ? loaderData : undefined,
  );
  const instagramPosts = useInstagram(loaderData?.instagram);
  const shouldReduceMotion = useReducedMotion();

  // Hero copy drifts up and dissolves as the page moves off it, so the hero
  // hands over to the next section instead of just scrolling away.
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 520], [1, 0]);
  const heroLift = useTransform(scrollY, [0, 520], [0, -70]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header transparent brandInHero />

      <SEO
        title="Excavation, Landscaping &amp; Hardscapes, Mount Pleasant | Firm Foundation"
        description="Excavation and grading with our own Cat excavator in Mount Pleasant and Charleston, SC: site prep, pool digs, land clearing, plus landscaping and hardscapes."
        canonical="/"
        keywords="excavation contractor Mount Pleasant SC, grading contractor Charleston SC, site prep, pool excavation, land clearing Charleston, landscaping Mount Pleasant, hardscapes Charleston, Lowcountry"
        jsonLd={[localBusinessSchema, websiteSchema, workFilmSchema]}
      />

      <main id="main" className="flex-1">
        {/* ── 1. Hero ──────────────────────────────────────────────────────
            Copy on the cream ground, three of Josiah's own job photos beside it
            (above it on a phone), one per word of the headline. The photos sit
            below the header rather than under it, so the nav never crosses a
            picture and needs no wash to stay legible. */}
        <section className="relative overflow-hidden bg-background lg:min-h-[100svh]">
          {/* The logo as the page's focal point (Josiah, 2026-10-27: "my main
              logo … bigger or just more emphasized … a little bit focal
              point"). The header logo has no room to grow on a phone, so the
              homepage shows it large here instead, and the header's own copy
              waits out of sight until this one scrolls under the bar
              (`brandInHero`). Phones get it above the photos, desktops at the
              head of the copy column. The `data-hero-brand` attribute is what
              the header watches. */}
          <div className="px-5 pt-[4.5rem] sm:px-6 sm:pt-24 md:px-10 lg:hidden">
            <img
              data-hero-brand
              src={logoLockup}
              alt={BUSINESS.name}
              width={1443}
              height={255}
              className="hero-rise h-auto w-full max-w-[21rem] sm:max-w-[24rem]"
            />
          </div>

          {/* The mosaic's right edge is the frame's right edge (the same line as
              the header's quote button and every section), never its own. */}
          <HeroMosaic className="px-5 pt-5 sm:px-6 sm:pt-8 md:px-10 lg:absolute lg:bottom-8 lg:left-[54%] lg:right-[max(2.5rem,calc((100vw-1280px)/2))] lg:top-28 lg:flex lg:items-center lg:justify-end lg:px-0 lg:pt-0" />

          {/* On a desktop this frame spans the whole hero, photos included, and
              sits above them, so it must not take the clicks: until 2026-10-17
              it silently swallowed every click on the three photos. Only the
              copy column takes pointer events. */}
          <div className="frame pointer-events-none relative z-10 flex items-center lg:min-h-[100svh]">
            <motion.div
              style={shouldReduceMotion ? undefined : { opacity: heroOpacity, y: heroLift }}
              className="pointer-events-auto w-full pb-12 pt-8 will-change-transform sm:pt-12 lg:w-[50%] lg:py-28 lg:pr-12"
            >
              <img
                data-hero-brand
                src={logoLockup}
                alt={BUSINESS.name}
                width={1443}
                height={255}
                className="hero-rise mb-10 hidden h-auto w-[min(100%,26rem)] lg:block xl:w-[min(100%,28rem)]"
              />
              <p className="mark mb-6 hero-rise" style={{ animationDelay: "40ms" }}>
                Mount Pleasant &amp; Charleston, SC
              </p>
              {/* The three services Josiah leads with on his own flyer and
                  business card, in his order. Each line rises out of a mask
                  once, in CSS (see .hero-line in index.css), so the prerendered
                  HTML is already the finished headline for crawlers and no-JS. */}
              {/* The one place on the site set in capitals, the way the flyer
                  sets "DIRT WORK DONE RIGHT." Everything else is sentence case. */}
              <h1 className="font-heading text-display uppercase text-foreground md:text-[3.75rem] lg:text-display">
                <span className="hero-line">
                  <span style={{ animationDelay: "40ms" }}>Excavation,</span>
                </span>{" "}
                <span className="hero-line">
                  <span style={{ animationDelay: "100ms" }}>Landscaping &amp;</span>
                </span>{" "}
                <span className="hero-line">
                  <span style={{ animationDelay: "160ms" }}>Hardscapes</span>
                </span>
              </h1>
              <p
                className="text-subtitle text-foreground/70 mt-6 max-w-lg leading-relaxed hero-rise"
                style={{ animationDelay: "220ms" }}
              >
                Grading, site prep, pool digs and land clearing with our own Cat
                excavator, then the beds, lawns and patios that go on top. Family
                run, out of Mount Pleasant.
              </p>

              {/* Proof sits between the promise and the ask, so the first phone
                  screen carries all four: what, where, how good, how to reach. */}
              <a
                href="#reviews"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="mt-6 inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-full hero-rise focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                style={{ animationDelay: "280ms" }}
              >
                <StarRating rating={aggregateRating} size="h-4 w-4" className="text-primary" />
                <span className="text-sm text-foreground/75 inline-flex items-center gap-1.5">
                  <GoogleIcon className="h-3.5 w-3.5" />
                  {aggregateRating.toFixed(1)} from {totalReviewCount} Google reviews
                </span>
              </a>

              <div
                id="hero-actions"
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 hero-rise"
                style={{ animationDelay: "340ms" }}
              >
                <Button asChild size="lg">
                  <Link to="/contact">Get a free quote</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={BUSINESS.phoneHref} data-analytics-where="hero">
                    <Phone aria-hidden="true" />
                    Call {BUSINESS.phone}
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Reviews directly under the hero: NN/g measures ~65% of viewing time
            in the top 40% of a page, and third-party proof is what a cold
            visitor from an ad is missing. */}
        {/* ── 2. Reviews ───────────────────────────────────────────────── */}
        <Section id="reviews" className="scroll-mt-24">
          <SectionHeader title="What people say about the work" />
          <ReviewsGrid reviews={reviews} rating={aggregateRating} total={totalReviewCount} />
        </Section>

        {/* ── 3. Services ──────────────────────────────────────────────── */}
        <Section className="pt-0 md:pt-0">
          <SectionHeader
            title="From the dirt work to the finished yard"
            subtitle="Most jobs are more than one of these, and the same crew does all of it, so nothing gets handed off halfway."
          />
          <ServicesIndex />
        </Section>


        {/* ── Who we work with ────────────────────────────────────────────
            The bigger excavation work comes from three kinds of caller, so
            each gets one line and its own way in (the pattern the strongest
            site-work firms share: route visitors by who they are). Ruled
            columns, not cards. */}
        <Section className="pt-0 md:pt-0">
          <SectionHeader
            title="Who we work with"
            subtitle="One machine, one owner in the seat, and the same crew from the dig to the final grade."
          />
          <ul className="grid grid-cols-1 border-t border-border md:grid-cols-3 md:border-t-0">
            {audiences.map((a, i) => (
              <li
                key={a.title}
                className={cn(
                  "border-b border-border py-6 md:border-b-0 md:border-t md:py-7",
                  i > 0 && "md:border-l md:pl-8",
                  i < audiences.length - 1 && "md:pr-8",
                )}
              >
                <h3 className="font-heading text-xl text-foreground md:text-2xl">{a.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{a.body}</p>
                <Link
                  to={a.href}
                  className="mt-4 inline-flex items-center gap-1.5 font-semibold text-foreground underline decoration-foreground/25 underline-offset-[5px] hover:decoration-foreground"
                >
                  {a.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        {/* ── 4. How it works ──────────────────────────────────────────── */}
        <Section variant="forest">
          <SectionHeader title="What happens when you call" />
          <ProcessSteps steps={howAJobRuns} />
        </Section>

        {/* ── Instagram: what Josiah has been doing lately. Renders nothing
            until the feed is connected (see api/instagram.ts). */}
        <InstagramStrip posts={instagramPosts} />

        {/* ── 6. Who ───────────────────────────────────────────────────── */}
        <Section variant="cream" className="py-14 md:py-20">
          <OurStory showLink compact />
        </Section>

        <CtaSection
          title="Got a yard"
          accent="that needs work?"
          blurb="Call Josiah for a free walk-through and an honest quote, usually the same week."
        />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
