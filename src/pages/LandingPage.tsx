import { Button } from "@/components/ui/button";
import { Link, useLoaderData } from "react-router-dom";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, ExternalLink, MapPin, Pause, Play } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import SEO from "@/components/SEO";
import { sizedPhoto } from "@/lib/reviewPhoto";
import CtaSection from "@/components/CtaSection";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import FadeInView from "@/components/animations/FadeInView";
import ReviewImages from "@/components/ReviewImages";
import GoogleIcon from "@/components/icons/GoogleIcon";
import StarRating from "@/components/StarRating";
import ServicesBento from "@/components/ServicesBento";
import ProcessSteps from "@/components/ProcessSteps";
import HeroVideo from "@/components/HeroVideo";
import RelitHero from "@/components/RelitHero";
import YardTriage from "@/components/YardTriage";
import OurStory from "@/components/OurStory";
import { useReviews, type ApiResponse } from "@/lib/useReviews";
import { coreServices } from "@/data/services";
import { BUSINESS, howAJobRuns, serviceAreaNames } from "@/data/business";
import { localBusinessSchema, websiteSchema } from "@/lib/schema";
import heroPoster from "@/assets/services/excavation.jpg";
import heroPosterSet from "@/assets/services/excavation.jpg?w=640;1024;1600;2000&format=webp&quality=68&as=srcset";
// The colour texture for the relit hero. Deliberately ONE of the srcset
// candidates above rather than a separate export, so on a desktop the browser
// has usually already fetched this exact file for the <img> and the canvas
// costs nothing more than the 11 KB depth map.
import heroRelitPhoto from "@/assets/services/excavation.jpg?w=1600&format=webp&quality=68&as=url";
import heroDepth from "@/assets/services/excavation-depth.webp";

const LandingPage = () => {
  const loaderData = useLoaderData() as ApiResponse | undefined;
  const { reviews, aggregateRating, totalReviewCount } = useReviews(loaderData);
  const shouldReduceMotion = useReducedMotion();

  // Hero copy drifts up and dissolves as the page moves off it, so the hero
  // hands over to the next section instead of just scrolling away.
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 520], [1, 0]);
  const heroLift = useTransform(scrollY, [0, 520], [0, -70]);

  // Every review, not a fixed slice — this was hardcoded to 5 and silently
  // dropped the two newest the moment the profile went from 5 reviews to 7.
  // /reviews is still the full list; this carousel just no longer hides any.
  const testimonials = reviews.map((r) => ({
    quote: r.review,
    name: r.name,
    location: r.location || "Verified Google Review",
    avatarUrl: r.avatarUrl,
    images: r.images ?? [],
    sourceUrl: r.sourceUrl,
  }));

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [paused, setPaused] = useState(false);
  // Hover and focus pausing never reaches a touch-only visitor, so autoplay
  // also needs a control they can actually press.
  const [autoplayOff, setAutoplayOff] = useState(false);

  useEffect(() => {
    if (testimonials.length <= 1 || paused || autoplayOff) return;
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length, paused, autoplayOff]);

  const goPrev = () =>
    setActiveTestimonial((p) => (p - 1 + testimonials.length) % testimonials.length);
  const goNext = () => setActiveTestimonial((p) => (p + 1) % testimonials.length);

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
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-background lg:min-h-[100svh]">
          {/*
            A SPLIT hero, and the split is what makes the photograph usable.

            This was a full-bleed still with the copy laid over it and a
            charcoal wash covering the whole frame to keep the headline legible.
            That wash was load-bearing — measured against the real composited
            pixels, opening it up took the h1 from 3.34:1 to 2.18:1 and the
            eyebrow to 1.58:1, both failing AA — but it also reduced a real
            photograph of Josiah's machine to a texture, and it crushed anything
            happening inside the picture.

            Separating them removes the compromise entirely. The copy sits on
            solid charcoal, so its contrast is fixed and no longer depends on
            what the photo is doing behind it, and the photograph runs at full
            strength with the relit light actually visible. Below `lg` the two
            stack rather than sitting side by side, so a phone never puts type
            over the picture either.
          */}
          <div className="relative h-[42svh] min-h-[16rem] w-full lg:absolute lg:inset-y-0 lg:left-[56%] lg:right-0 lg:h-auto lg:w-auto">
            {/* Hero is the still. The cab clip is handheld phone footage shot
                through dirty glass, and behind a headline it reads as noise
                rather than atmosphere — re-add src="/hero-excavator.mp4" once
                there's stabilised landscape footage worth the motion. */}
            <HeroVideo
              poster={heroPoster}
              posterSrcSet={heroPosterSet}
              posterAlt="Firm Foundation's excavator clearing timber on a Lowcountry site"
              overlay={<RelitHero photoUrl={heroRelitPhoto} depthUrl={heroDepth} />}
            />
            {/* Feathered into the charcoal rather than butted against it — a
                hard vertical seam between a panel and a photograph is the tell
                of a template. Horizontal on desktop, upward on mobile, so the
                picture always dissolves into the copy's ground. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent lg:hidden"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 hidden w-44 bg-gradient-to-r from-background to-transparent lg:block"
            />
          </div>

          {/* The header is transparent over the hero, and the split now puts the
              right-hand nav items on top of a bright photograph — measured at
              1.27:1 against the sky, where the old full-frame wash had been
              carrying them invisibly. This band is the smallest thing that
              fixes it: opaque at the very top where the nav sits, gone by
              9rem, so the machine and the timber below are untouched. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-36 bg-gradient-to-b from-background via-background/85 to-transparent"
          />

          <div className="relative z-10 mx-auto flex max-w-content items-center px-5 sm:px-6 md:px-10 lg:min-h-[100svh]">
            <motion.div
              style={shouldReduceMotion ? undefined : { opacity: heroOpacity, y: heroLift }}
              className="w-full py-14 will-change-transform lg:w-[52%] lg:py-32 lg:pr-10"
            >
              <FadeInView immediate>
                <p className="eyebrow text-primary mb-6">
                  Mount Pleasant &middot; Greater Charleston
                </p>
                {/* The same words as the Instagram ad, on purpose: someone who
                    taps "Land Clearing & Excavation" should land on "Land
                    Clearing & Excavation", not on a different pitch. Its own
                    clamp rather than `text-hero`, which is sized for a
                    full-width hero and breaks badly in a half-width column. */}
                <h1 className="text-hero font-heading text-foreground lg:text-[clamp(2.6rem,4.6vw,4.75rem)] lg:leading-[0.9] lg:tracking-[-0.035em]">
                  Land Clearing
                  <br />
                  <span className="text-primary">&amp; Excavation</span>
                </h1>
                <p className="text-subtitle text-foreground/70 mt-8 max-w-xl leading-relaxed">
                  Lots cleared, trees and stumps out, ground graded, pools and
                  ponds dug, and water sent where it belongs &mdash; across Mount
                  Pleasant and the Lowcountry.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:items-center">
                  <Button asChild size="lg">
                    <Link to="/contact">Get a Free Quote</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a href={BUSINESS.phoneHref} data-analytics-where="hero">
                      Call {BUSINESS.phone}
                    </a>
                  </Button>
                </div>

                <a
                  href="#reviews"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("reviews")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="mt-10 inline-flex items-center gap-2.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <StarRating rating={aggregateRating} size="h-4 w-4" className="text-primary" />
                  <span className="text-sm text-foreground/75 inline-flex items-center gap-1.5">
                    <GoogleIcon className="h-3.5 w-3.5" />
                    {aggregateRating.toFixed(1)} from {totalReviewCount} verified Google reviews
                  </span>
                </a>
              </FadeInView>
            </motion.div>
          </div>

          {!shouldReduceMotion && (
            <motion.div
              className="absolute bottom-8 left-8 hidden text-foreground/40 lg:block"
              animate={{ y: [0, 8, 0] }}
              /* Finite, not `repeat: Infinity`. WCAG 2.2.2 Pause, Stop, Hide is
                 Level A and covers any automatic motion past five seconds
                 without a pause control; four two-second cycles land inside it
                 and the hint has done its job by then anyway. */
              transition={{ duration: 2, repeat: 3 }}
              aria-hidden="true"
            >
              <ChevronDown className="h-6 w-6" />
            </motion.div>
          )}
        </section>

        {/* ── Service index ────────────────────────────────────────────
            Where the stats strip was. Its Google rating duplicated the hero's
            300px above, and the ad this page answers lists services, not
            stats — so the band directly under the fold now names the five
            things the business does, each one tap from its own page. Desktop
            only: on a phone the grid below is the very next thing anyway, and
            the same five rows twice in a row is just scrolling. */}
        <nav aria-label="Services" className="hidden border-y border-border bg-background md:block">
          <ul className="mx-auto grid max-w-content grid-cols-5 px-6 md:px-10">
            {coreServices.map((service, i) => (
              <li key={service.slug} className="border-l border-border first:border-l-0">
                <Link
                  to={`/services/${service.slug}`}
                  className="group flex h-full flex-col justify-between gap-5 px-5 py-7 transition-colors hover:bg-card lg:px-6"
                >
                  <span className="eyebrow text-primary">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex items-end justify-between gap-3">
                    <span className="font-heading text-lg font-light leading-tight text-foreground lg:text-xl">
                      {service.title}
                    </span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Services ─────────────────────────────────────────────────── */}
        <Section>
          <SectionHeader
            eyebrow="What we do"
            title="From overgrown lot"
            accent="to finished grade"
            subtitle="Most jobs are more than one of these. The lot gets cleared, the stumps come out, the ground gets graded and the water gets somewhere to go, and it is all one call."
          />
          <ServicesBento />
        </Section>

        {/* ── Not sure what you need? ─────────────────────────────────────
            After the services rather than before them now: the visitor this
            page is built for arrives from an ad that already named the work.
            The triage is for the one who recognises the situation but not the
            job — it names the job, and hands them a form that already knows. */}
        <Section variant="muted" id="yard" className="scroll-mt-24">
          <SectionHeader
            eyebrow="Not sure what you need?"
            title="What are you"
            accent="looking at?"
            subtitle="Pick what you&rsquo;re seeing. We&rsquo;ll tell you what it usually is, what the work involves, and what Josiah looks at on the visit."
          />
          <YardTriage />
        </Section>

        {/* Reviews sit directly after Services, ahead of the story.
            NN/g: 65% of viewing time goes to the top 40% of a page regardless
            of length, and average scroll depth on a well-designed page is ~63%.
            Below the story, the 4.9 Google rating landed at screen 8.9 of 12.7
            on a phone — past where most visitors ever get. Proof has to come
            before biography. */}
        {/* ── Reviews ──────────────────────────────────────────────────── */}
        <Section variant="muted" id="reviews" className="scroll-mt-24">
          <SectionHeader
            eyebrow="Testimonials"
            title="Client"
            accent="Reviews"
            subtitle="Real, verified Google reviews from homeowners across the Lowcountry."
          />

          <div
            className="max-w-3xl mx-auto text-center relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            {testimonials.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous review"
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 sm:-translate-x-8 z-10 h-11 w-11 rounded-full border border-border hover:border-primary hover:text-primary flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next review"
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 sm:translate-x-8 z-10 h-11 w-11 rounded-full border border-border hover:border-primary hover:text-primary flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </>
            )}

            <div className="grid px-4">
              {testimonials.map((t, i) => {
                const isActive = i === activeTestimonial % testimonials.length;
                return (
                  <div
                    key={i}
                    // `inert` keeps hidden slides out of the tab order and away
                    // from screen readers; opacity alone left them focusable.
                    {...(!isActive ? { inert: "" } : {})}
                    className={`[grid-column:1] [grid-row:1] flex flex-col items-center transition-opacity duration-700 ease-editorial ${
                      isActive ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <p className="text-xl md:text-2xl font-heading font-light text-foreground leading-snug mb-6">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    {t.images.length > 0 && (
                      <ReviewImages
                        images={t.images}
                        alt={`Photo from ${t.name}'s review`}
                        variant="row"
                        max={3}
                        className="mb-6"
                        onOpenChange={setPaused}
                      />
                    )}
                    <div className="flex flex-col items-center gap-2.5">
                      {t.avatarUrl && (
                        <img
                          src={sizedPhoto(t.avatarUrl, 96)}
                          alt=""
                          loading="lazy"
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <p className="eyebrow text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                        <GoogleIcon className="h-3 w-3" />
                        {t.location}
                      </p>
                      <a
                        href={t.sourceUrl ?? BUSINESS.googleReviewsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        View on Google <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-3 mt-7">
              <div className="flex flex-wrap justify-center items-center -my-4">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    aria-label={`Go to review ${i + 1}`}
                    aria-current={i === activeTestimonial ? "true" : undefined}
                    className="group flex h-11 items-center px-2.5"
                  >
                    <span
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === activeTestimonial
                          ? "w-8 bg-primary"
                          : "w-1.5 bg-muted-foreground/70 group-hover:bg-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {testimonials.length > 1 && (
                <button
                  type="button"
                  onClick={() => setAutoplayOff((v) => !v)}
                  aria-label={
                    autoplayOff ? "Resume review autoplay" : "Pause review autoplay"
                  }
                  className="ml-1 flex h-11 w-11 items-center justify-center rounded-full border border-muted-foreground/70 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {autoplayOff ? (
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                </button>
              )}
            </div>
          </div>

          <FadeInView delay={0.2}>
            <div className="flex flex-wrap items-center justify-center gap-5 mt-10 pt-8 border-t border-border">
              <StarRating rating={aggregateRating} size="h-5 w-5" className="text-primary" />
              <span className="eyebrow text-muted-foreground inline-flex items-center gap-2">
                <GoogleIcon className="h-3.5 w-3.5" />
                {aggregateRating.toFixed(1)} average from {totalReviewCount} verified Google reviews
              </span>
            </div>
          </FadeInView>
        </Section>

        {/* ── How a job runs ───────────────────────────────────────────── */}
        <Section>
          <SectionHeader
            eyebrow="How it works"
            title="One walk-through,"
            accent="one straight number"
          />
          <ProcessSteps steps={howAJobRuns} />
        </Section>

        {/* ── Our story ────────────────────────────────────────────────── */}
        <Section variant="cream">
          <OurStory showLink />
        </Section>

        {/* ── Service areas ────────────────────────────────────────────────
            Was a centred heading over a 400px leaflet map: 994px of homepage,
            with the town names written out in prose and then again as pins. A
            homeowner knows whether they live near "Johns Island" the instant
            they read it — decoding a pin against a mostly-empty Lowcountry
            frame is slower than reading the word. So this is a directory, not
            a map, set beside the heading rather than stacked under it.

            The map is gone from the homepage but ServiceAreaMap.tsx stays in
            the repo — it belongs on a future location or project page, where
            it would want fitBounds rather than the fixed zoom that left two
            thirds of the frame empty here.

            Nothing here is client-only any more, so the nine towns are plain
            server-rendered text instead of living in a ClientOnly fallback —
            strictly better for the local SEO these names carry. Hairline grid
            matches the stats strip idiom above. */}
        <Section>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16 lg:items-center">
            <FadeInView>
              <p className="eyebrow text-primary mb-4">Coverage</p>
              <h2 className="text-hero font-heading">
                <span className="whitespace-nowrap">Areas We</span>
                <br />
                <span className="text-primary">Serve</span>
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                Based in Mount Pleasant, working the length of the Charleston
                Lowcountry.
              </p>
            </FadeInView>

            <FadeInView delay={0.1}>
              <ul className="grid grid-cols-2 sm:grid-cols-3 border-border [&>li]:border-border [&>li]:border-t [&>li]:border-l max-sm:[&>li:nth-child(-n+2)]:border-t-0 max-sm:[&>li:nth-child(odd)]:border-l-0 sm:[&>li:nth-child(-n+3)]:border-t-0 sm:[&>li:nth-child(3n+1)]:border-l-0">
                {serviceAreaNames.map((area) => (
                  <li
                    key={area}
                    className="flex min-w-0 items-center gap-2 px-3 py-3.5 sm:px-4 md:px-5 md:py-5 sm:gap-2.5"
                  >
                    <MapPin
                      className="h-3.5 w-3.5 shrink-0 text-primary/70"
                      aria-hidden="true"
                    />
                    <span className="min-w-0 font-heading text-[0.9375rem] sm:text-base md:text-lg text-foreground">
                      {area}
                    </span>
                    {area === BUSINESS.address.locality && (
                      <span className="eyebrow text-[0.625rem] text-primary shrink-0">
                        HQ
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </FadeInView>
          </div>
        </Section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
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
