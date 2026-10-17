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
import ServicesIndex from "@/components/ServicesIndex";
import BeforeAfterPair from "@/components/BeforeAfterPair";
import ProcessSteps from "@/components/ProcessSteps";
import ReviewsGrid from "@/components/ReviewsGrid";
import HeroMosaic from "@/components/HeroMosaic";
import OurStory from "@/components/OurStory";
import { useReviews, type ApiResponse } from "@/lib/useReviews";
import { useInstagram, type InstagramFeed } from "@/lib/useInstagram";
import InstagramStrip from "@/components/InstagramStrip";
import { ACCEPTS_SMS, BUSINESS, howAJobRuns, smsHref } from "@/data/business";
import { localBusinessSchema, websiteSchema } from "@/lib/schema";
import { services } from "@/data/services";

/** The services Josiah has a same-spot before and after for. */
const beforeAfterServices = services.filter((s) => s.beforeAfter);

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
              <p className="mark mb-6 hero-rise" style={{ animationDelay: "0ms" }}>
                Mount Pleasant &amp; Charleston, SC
              </p>
              {/* The three services Josiah leads with on his own flyer and
                  business card, in his order. Each line rises out of a mask
                  once, in CSS (see .hero-line in index.css), so the prerendered
                  HTML is already the finished headline for crawlers and no-JS. */}
              {/* The one place on the site set in capitals, the way the flyer
                  sets "DIRT WORK DONE RIGHT." Everything else is sentence case. */}
              <h1 className="text-hero font-heading uppercase text-foreground lg:text-[clamp(2.6rem,4.4vw,4.6rem)] lg:leading-[0.9]">
                <span className="hero-line">
                  <span style={{ animationDelay: "40ms" }}>Landscaping,</span>
                </span>
                <span className="hero-line">
                  <span style={{ animationDelay: "100ms" }}>Hardscapes &amp;</span>
                </span>
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
                <span className="hidden text-sm text-foreground/60 sm:inline">&middot; Free on-site quotes</span>
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
          <SectionHeader
            eyebrow="Google reviews"
            title="What people say about the work"
            subtitle="From the people Josiah has worked for, word for word."
          />
          <ReviewsGrid reviews={reviews} rating={aggregateRating} total={totalReviewCount} />
        </Section>

        {/* ── 3. Services ──────────────────────────────────────────────── */}
        <Section className="pt-0 md:pt-0">
          <SectionHeader
            eyebrow="What we do"
            title="From the dirt work to the finished yard"
            subtitle="Most jobs are more than one of these, and the same crew does all of it, so nothing gets handed off halfway."
          />
          <ServicesIndex />
        </Section>

        {/* ── 4. Before and after ─────────────────────────────────────────
            Proof in the one form a homeowner trusts most: the same spot, twice. */}
        <Section variant="cream">
          <SectionHeader
            eyebrow="Before and after"
            title="The same spot, before and after"
            subtitle={`Two of Josiah's jobs in Mount Pleasant. ${ACCEPTS_SMS ? "Text" : "Send"} him a photo of yours and he'll tell you what it usually takes.`}
          />
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8">
            {beforeAfterServices.map((service, i) => (
              <FadeInView key={service.slug} delay={0.08 * i}>
                <figure>
                  <BeforeAfterPair
                    pair={service.beforeAfter!}
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="aspect-[4/3] overflow-hidden rounded-[3px]"
                  />
                  <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-t border-border pt-4">
                    <span className="font-heading text-xl text-foreground md:text-2xl">{service.title}</span>
                    <Link
                      to={`/services/${service.slug}`}
                      className="shrink-0 text-sm font-semibold text-foreground underline decoration-foreground/25 underline-offset-[5px] hover:decoration-foreground"
                    >
                      About {service.title.toLowerCase()}
                    </Link>
                  </figcaption>
                </figure>
              </FadeInView>
            ))}
          </div>
        </Section>

        {/* ── 5. How it works ──────────────────────────────────────────── */}
        <Section variant="forest">
          <SectionHeader eyebrow="How it works" title="What happens when you call" />
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
