import { Button } from "@/components/ui/button";
import { Link, useLoaderData } from "react-router-dom";
import { MessageSquare, Phone } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import SEO from "@/components/SEO";
import CtaSection from "@/components/CtaSection";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import FadeInView from "@/components/animations/FadeInView";
import GoogleIcon from "@/components/icons/GoogleIcon";
import StarRating from "@/components/StarRating";
import ServicesBento from "@/components/ServicesBento";
import ProcessSteps from "@/components/ProcessSteps";
import ReviewsGrid from "@/components/ReviewsGrid";
import HeroMosaic from "@/components/HeroMosaic";
import OurStory from "@/components/OurStory";
import { useReviews, type ApiResponse } from "@/lib/useReviews";
import { ACCEPTS_SMS, BUSINESS, howAJobRuns, smsHref } from "@/data/business";
import { localBusinessSchema, websiteSchema } from "@/lib/schema";

/**
 * The homepage, in six blocks, each answering one question a visitor actually
 * has:
 *
 *   1. Hero — what do they do, is it any good, how do I reach them?
 *   2. Reviews — says who?
 *   3. Services — do they do my job?
 *   4. Not sure? — the escape hatch: text a photo.
 *   5. How it works — what happens if I call?
 *   6. Story + CTA — who is this, and where do they work?
 *
 * What was cut on 2026-09-29, and why, so it isn't re-added by habit: a
 * desktop service strip that repeated the services grid directly under it; the
 * six-item "what are you looking at?" accordion (its answers live on the
 * service pages as FAQs and still deep-link into the form, and "text a photo"
 * does its job in one line); the auto-rotating review carousel; a four-step
 * process that fits in three; and an Areas We Serve block that repeated the
 * footer. The areas now sit in one line inside the closing CTA.
 */
const LandingPage = () => {
  const loaderData = useLoaderData() as ApiResponse | undefined;
  const { reviews, aggregateRating, totalReviewCount } = useReviews(loaderData);
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
        description="Family-run landscaping, hardscapes and excavation in Mount Pleasant and greater Charleston, SC: new beds and sod, patios and walls, pool and pond prep, and land clearing."
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
          <HeroMosaic className="h-[34svh] min-h-[14rem] max-h-[22rem] px-4 pt-[4.5rem] sm:px-6 sm:pt-20 lg:absolute lg:bottom-8 lg:left-[54%] lg:right-6 lg:top-24 lg:h-auto lg:max-h-none lg:px-0 lg:pt-0 xl:right-10" />

          <div className="relative z-10 mx-auto flex max-w-content items-center px-5 sm:px-6 md:px-10 lg:min-h-[100svh]">
            <motion.div
              style={shouldReduceMotion ? undefined : { opacity: heroOpacity, y: heroLift }}
              className="w-full pb-12 pt-8 will-change-transform lg:w-[50%] lg:py-32 lg:pr-12"
            >
              <p className="eyebrow text-primary mb-6 hero-rise" style={{ animationDelay: "0ms" }}>
                Mount Pleasant &middot; Greater Charleston
              </p>
              {/* The three services Josiah leads with on his own flyer and
                  business card, in his order. Each line rises out of a mask
                  once, in CSS (see .hero-line in index.css), so the prerendered
                  HTML is already the finished headline for crawlers and no-JS. */}
              <h1 className="text-hero font-heading text-foreground lg:text-[clamp(2.6rem,4.4vw,4.6rem)] lg:leading-[0.9]">
                <span className="hero-line">
                  <span style={{ animationDelay: "40ms" }}>Landscaping,</span>
                </span>
                <span className="hero-line">
                  <span style={{ animationDelay: "100ms" }}>Hardscapes &amp;</span>
                </span>
                <span className="hero-line text-highlight">
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
                <span className="hidden text-sm text-foreground/60 sm:inline">&middot; Free on-site quotes</span>
              </a>

              <div
                id="hero-actions"
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 hero-rise"
                style={{ animationDelay: "340ms" }}
              >
                <Button asChild size="lg">
                  <Link to="/contact">Get a Free Quote</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={BUSINESS.phoneHref} data-analytics-where="hero">
                    <Phone aria-hidden="true" />
                    {BUSINESS.phone}
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
          <SectionHeader eyebrow="Google reviews" title="What people" accent="say about the work" />
          <ReviewsGrid reviews={reviews} rating={aggregateRating} total={totalReviewCount} />
        </Section>

        {/* ── 3. Services ──────────────────────────────────────────────── */}
        <Section>
          <SectionHeader eyebrow="What we do" title="From the dirt work" accent="to the finished yard" />
          <ServicesBento />
        </Section>

        {/* ── 4. Not sure? Send a photo ─────────────────────────────────
            One line where a six-item diagnostic accordion used to be. The
            accordion earned its place by naming a problem the visitor couldn't
            name; a photo does that faster, and it is how most of these jobs
            start anyway. */}
        <section className="border-y border-border bg-muted px-5 py-12 sm:px-6 md:px-10 md:py-14">
          <FadeInView className="mx-auto flex max-w-content flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-heading text-3xl leading-tight text-foreground md:text-4xl">
                Not sure what you need? <span className="text-highlight">Send a photo.</span>
              </h2>
              <p className="mt-3 max-w-xl text-muted-foreground">
                {ACCEPTS_SMS ? "Text" : "Send"} Josiah a picture of the yard and he&rsquo;ll tell you
                what it usually takes. No obligation.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              {ACCEPTS_SMS && (
                <Button asChild size="lg">
                  <a href={smsHref} data-analytics-where="photo-band-text">
                    <MessageSquare aria-hidden="true" />
                    Text a photo
                    {/* A laptop can't always send a text, so wider screens get
                        the number itself to copy onto a phone. */}
                    <span className="hidden sm:inline">to {BUSINESS.phone}</span>
                  </a>
                </Button>
              )}
              <Button asChild size="lg" variant="outline">
                <Link to="/contact">Use the quote form</Link>
              </Button>
            </div>
          </FadeInView>
        </section>

        {/* ── 5. How it works ──────────────────────────────────────────── */}
        <Section variant="forest" className="py-16 md:py-20">
          <p className="eyebrow text-primary mb-10 text-center md:mb-12">How it works</p>
          <ProcessSteps steps={howAJobRuns} />
        </Section>

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
