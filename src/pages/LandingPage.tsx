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
import HeroVideo from "@/components/HeroVideo";
import RelitHero from "@/components/RelitHero";
import OurStory from "@/components/OurStory";
import { useReviews, type ApiResponse } from "@/lib/useReviews";
import { ACCEPTS_SMS, BUSINESS, howAJobRuns, smsHref } from "@/data/business";
import { localBusinessSchema, websiteSchema } from "@/lib/schema";
import heroPoster from "@/assets/services/excavation.jpg";
import heroPosterSet from "@/assets/services/excavation.jpg?w=640;1024;1600;2000&format=webp&quality=68&as=srcset";
// The colour texture for the relit hero. Deliberately ONE of the srcset
// candidates above rather than a separate export, so on a desktop the browser
// has usually already fetched this exact file for the <img> and the canvas
// costs nothing more than the 16 KB depth map.
import heroRelitPhoto from "@/assets/services/excavation.jpg?w=1600&format=webp&quality=68&as=url";
import heroDepth from "@/assets/services/excavation-depth.webp";

/**
 * The homepage, in six blocks, each answering one question a visitor arriving
 * from the "Land Clearing & Excavation" ad actually has:
 *
 *   1. Hero — is this the thing I tapped, is it any good, how do I reach them?
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
        title="Land Clearing &amp; Excavation, Charleston SC | Firm Foundation"
        description="Family-run land clearing and excavation in Mount Pleasant and greater Charleston, SC: lot clearing, tree and stump removal, grading, pool and pond digs, and drainage."
        canonical="/"
        keywords="land clearing Charleston SC, land clearing Mount Pleasant SC, lot clearing, excavation contractor Mount Pleasant, stump removal, grading, pool excavation, pond digging, yard drainage, French drains, Lowcountry"
        jsonLd={[localBusinessSchema, websiteSchema]}
      />

      <main id="main" className="flex-1">
        {/* ── 1. Hero ──────────────────────────────────────────────────────
            A SPLIT hero: copy on solid charcoal, Josiah's own photograph at full
            strength beside it (stacked on a phone). A full-bleed photo under
            the copy needed a wash so heavy it reduced the picture to a texture;
            measured, opening the wash took the h1 to 2.18:1. Splitting them
            removed the compromise. */}
        <section className="relative overflow-hidden bg-background lg:min-h-[100svh]">
          <div className="relative h-[30svh] min-h-[13rem] w-full lg:absolute lg:inset-y-0 lg:left-[56%] lg:right-0 lg:h-auto lg:w-auto">
            <HeroVideo
              poster={heroPoster}
              posterSrcSet={heroPosterSet}
              posterAlt="Firm Foundation's excavator clearing timber on a Lowcountry site"
              overlay={<RelitHero photoUrl={heroRelitPhoto} depthUrl={heroDepth} />}
            />
            {/* Feathered into the charcoal rather than butted against it. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent lg:hidden"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 hidden w-44 bg-gradient-to-r from-background to-transparent lg:block"
            />
          </div>

          {/* The header is transparent over the hero; this band keeps the nav
              legible where it crosses the bright sky (measured 1.27:1 without it). */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-36 bg-gradient-to-b from-background via-background/85 to-transparent"
          />

          <div className="relative z-10 mx-auto flex max-w-content items-center px-5 sm:px-6 md:px-10 lg:min-h-[100svh]">
            <motion.div
              style={shouldReduceMotion ? undefined : { opacity: heroOpacity, y: heroLift }}
              className="w-full pb-12 pt-6 will-change-transform lg:w-[52%] lg:py-32 lg:pr-10"
            >
              <p className="eyebrow text-primary mb-6 hero-rise" style={{ animationDelay: "0ms" }}>
                Mount Pleasant &middot; Greater Charleston
              </p>
              {/* The same words as the Instagram ad, on purpose: someone who
                  taps "Land Clearing & Excavation" should land on "Land
                  Clearing & Excavation". Each line rises out of a mask once,
                  in CSS (see .hero-line in index.css), so the prerendered HTML
                  is already the finished headline for crawlers and no-JS. */}
              <h1 className="text-hero font-heading text-foreground lg:text-[clamp(2.6rem,4.6vw,4.75rem)] lg:leading-[0.9] lg:tracking-[-0.035em]">
                <span className="hero-line">
                  <span style={{ animationDelay: "40ms" }}>Land Clearing</span>
                </span>
                <span className="hero-line text-primary">
                  <span style={{ animationDelay: "110ms" }}>&amp; Excavation</span>
                </span>
              </h1>
              <p
                className="text-subtitle text-foreground/70 mt-6 max-w-lg leading-relaxed hero-rise"
                style={{ animationDelay: "180ms" }}
              >
                Lots cleared, stumps out, ground graded, pools and ponds dug,
                drainage fixed. Family run, out of Mount Pleasant.
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
                style={{ animationDelay: "240ms" }}
              >
                <StarRating rating={aggregateRating} size="h-4 w-4" className="text-primary" />
                <span className="text-sm text-foreground/75 inline-flex items-center gap-1.5">
                  <GoogleIcon className="h-3.5 w-3.5" />
                  {aggregateRating.toFixed(1)} from {totalReviewCount} Google reviews
                </span>
                <span className="hidden text-sm text-foreground/50 sm:inline">&middot; Free on-site quotes</span>
              </a>

              <div
                id="hero-actions"
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 hero-rise"
                style={{ animationDelay: "300ms" }}
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
          <SectionHeader eyebrow="What we do" title="From overgrown lot" accent="to finished grade" />
          <ServicesBento />
        </Section>

        {/* ── 4. Not sure? Send a photo ─────────────────────────────────
            One line where a six-item diagnostic accordion used to be. The
            accordion earned its place by naming a problem the visitor couldn't
            name; a photo does that faster, and it is how most of these jobs
            start anyway. */}
        <section className="border-y border-border bg-muted px-5 py-12 sm:px-6 md:px-10 md:py-14">
          <FadeInView className="mx-auto flex max-w-content flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="font-heading text-3xl font-extralight leading-tight text-foreground md:text-4xl">
                Not sure what you need? <span className="text-primary">Send a photo.</span>
              </h2>
              <p className="mt-3 max-w-xl text-muted-foreground">
                {ACCEPTS_SMS ? "Text" : "Send"} Josiah a picture of the ground and he&rsquo;ll tell you
                what it usually takes. No obligation.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              {ACCEPTS_SMS && (
                <Button asChild size="lg">
                  <a href={smsHref} data-analytics-where="photo-band-text">
                    <MessageSquare aria-hidden="true" />
                    Text a photo
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
        <Section variant="muted" className="py-16 md:py-20">
          <p className="eyebrow text-primary mb-10 text-center md:mb-12">How it works</p>
          <ProcessSteps steps={howAJobRuns} />
        </Section>

        {/* ── 6. Who ───────────────────────────────────────────────────── */}
        <Section variant="cream" className="py-14 md:py-20">
          <OurStory showLink compact />
        </Section>

        <CtaSection
          title="Got ground"
          accent="that needs work?"
          blurb="Call Josiah for a free walk-through and an honest quote, usually the same week."
        />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
