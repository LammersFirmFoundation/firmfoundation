import { Button } from "@/components/ui/button";
import { Link, useLoaderData } from "react-router-dom";
import { Phone } from "lucide-react";
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
import OurStory from "@/components/OurStory";
import { useReviews, type ApiResponse } from "@/lib/useReviews";
import { useInstagram, type InstagramFeed } from "@/lib/useInstagram";
import InstagramStrip from "@/components/InstagramStrip";
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
      <Header transparent />

      <SEO
        title="Landscaping, Hardscapes &amp; Excavation, Mount Pleasant | Firm Foundation"
        description="Family-run landscaping, hardscapes and excavation in Mount Pleasant and Charleston, SC: beds and sod, patios and walls, pool and pond prep, land clearing."
        canonical="/"
        keywords="landscaping Mount Pleasant SC, hardscapes Charleston SC, paver patio Mount Pleasant, landscape installation Charleston, excavation contractor Mount Pleasant, pool excavation, land clearing, grading, Lowcountry"
        jsonLd={[localBusinessSchema, websiteSchema]}
      />

      <main id="main" className="flex-1">
        {/* ── 1. Hero ──────────────────────────────────────────────────────
            Copy on the cream ground, three of Josiah's own job photos beside it
            (above it on a phone), one per word of the headline. The photos sit
            below the header rather than under it, so the nav never crosses a
            picture and needs no wash to stay legible. */}
        <section className="relative overflow-hidden bg-background lg:min-h-[100svh]">
          {/* The mosaic's right edge is the frame's right edge (the same line as
              the header's quote button and every section), never its own. */}
          <HeroMosaic className="h-[34svh] min-h-[14rem] max-h-[22rem] px-5 pt-[4.5rem] sm:px-6 sm:pt-20 md:h-[42svh] md:max-h-[28rem] md:px-10 lg:absolute lg:bottom-8 lg:left-[54%] lg:right-[max(2.5rem,calc((100vw-1280px)/2))] lg:top-24 lg:h-auto lg:max-h-none lg:px-0 lg:pt-0" />

          <div className="frame relative z-10 flex items-center lg:min-h-[100svh]">
            <motion.div
              style={shouldReduceMotion ? undefined : { opacity: heroOpacity, y: heroLift }}
              className="w-full pb-12 pt-8 will-change-transform lg:w-[50%] lg:py-32 lg:pr-12"
            >
              <p className="mark mb-6 hero-rise" style={{ animationDelay: "0ms" }}>
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
                  <span style={{ animationDelay: "40ms" }}>Landscaping,</span>
                </span>{" "}
                <span className="hero-line">
                  <span style={{ animationDelay: "100ms" }}>Hardscapes &amp;</span>
                </span>{" "}
                <span className="hero-line">
                  <span style={{ animationDelay: "160ms" }}>Excavation</span>
                </span>
              </h1>
              <p
                className="text-subtitle text-foreground/70 mt-6 max-w-lg leading-relaxed hero-rise"
                style={{ animationDelay: "220ms" }}
              >
                New beds and lawns, patios and walls, pool and pond prep, and the
                dirt work under all of it, done right. Family run, out of Mount
                Pleasant.
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
