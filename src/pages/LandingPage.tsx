import { Button } from "@/components/ui/button";
import { Link, useLoaderData } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight, ExternalLink, MapPin, Pause, Play } from "lucide-react";
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
import ServiceImage from "@/components/ServiceImage";
import HeroVideo from "@/components/HeroVideo";
import OurStory from "@/components/OurStory";
import { useReviews, type ApiResponse } from "@/lib/useReviews";
import { services } from "@/data/services";
import { BUSINESS, serviceAreaNames } from "@/data/business";
import { localBusinessSchema, websiteSchema } from "@/lib/schema";
import heroPoster from "@/assets/services/excavation.jpg";

// Leaflet touches `window` at import time, so the map loads on the client only.
// The static fallback keeps the service-area names in the prerendered HTML.

// The Google rating is prepended at render time from live review data, so this
// strip can never print a different number than the hero or the reviews section.
const staticStats: { value: string; label: string }[] = [
  { value: "100+", label: "Properties Served" },
  { value: "Free", label: "On-Site Quotes" },
  { value: "Local", label: "Family Run" },
];

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
        title="Excavation &amp; Grading in Mount Pleasant, SC | Firm Foundation"
        description="Family-run excavation, grading, drainage, hardscapes, landscaping, and tree services in Mount Pleasant and greater Charleston, SC. Call for a free quote."
        canonical="/"
        keywords="excavation Mount Pleasant SC, yard grading, yard drainage, French drain installation, land clearing Charleston SC, irrigation trenching, landscaping, hardscapes, tree services, Lowcountry"
        jsonLd={[localBusinessSchema, websiteSchema]}
      />

      <main id="main" className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative min-h-[100svh] flex items-end overflow-hidden">
          {/* Hero is the still. The cab clip is handheld phone footage shot
              through dirty glass, and behind a headline it reads as noise
              rather than atmosphere — re-add src="/hero-excavator.mp4" once
              there's stabilised landscape footage worth the motion. */}
          <HeroVideo
            poster={heroPoster}
            posterAlt="Firm Foundation's excavator clearing timber on a Lowcountry site"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/85 via-charcoal/55 to-charcoal" />
          <div className="absolute inset-0 bg-charcoal/18" />

          <motion.div
            style={shouldReduceMotion ? undefined : { opacity: heroOpacity, y: heroLift }}
            className="relative z-10 w-full mx-auto max-w-content px-5 sm:px-6 md:px-10 pb-24 pt-32 md:pb-32 will-change-transform"
          >
            <FadeInView immediate>
              <p className="eyebrow text-primary mb-6">
                Mount Pleasant &middot; Greater Charleston
              </p>
              <h1 className="text-hero md:text-display font-heading text-foreground max-w-6xl">
                Groundwork for
                <br />
                <span className="text-primary">the Lowcountry&rsquo;s</span>
                <br />
                finest homes
              </h1>
              <p className="text-subtitle text-foreground/70 mt-8 max-w-xl leading-relaxed">
                Small excavation, grading, drainage, and irrigation &mdash; plus
                the landscaping, hardscapes, and tree work that got us here.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:items-center">
                <Button asChild size="lg" variant="contrast">
                  <Link to="/contact">Get a Free Quote</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/services">Our Services</Link>
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
                  {aggregateRating.toFixed(1)} from verified Google reviews
                </span>
              </a>
            </FadeInView>
          </motion.div>

          {!shouldReduceMotion && (
            <motion.div
              className="absolute bottom-8 right-8 hidden md:block text-foreground/40"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              aria-hidden="true"
            >
              <ChevronDown className="h-6 w-6" />
            </motion.div>
          )}
        </section>

        {/* ── Stats strip ──────────────────────────────────────────────── */}
        <section className="border-y border-border bg-background">
          <div className="mx-auto max-w-content px-5 sm:px-6 md:px-10">
            <dl className="grid grid-cols-2 md:grid-cols-4 border-border [&>*]:border-border [&>*]:border-t [&>*]:border-l max-md:[&>*:nth-child(-n+2)]:border-t-0 max-md:[&>*:nth-child(odd)]:border-l-0 md:[&>*]:border-t-0 md:[&>*:first-child]:border-l-0">
              {[
                { value: aggregateRating.toFixed(1), label: "Google Rating", isRating: true },
                ...staticStats,
              ].map((stat, i) => (
                <div key={stat.label} className="py-10 px-5 text-center">
                  <dd className="font-heading text-4xl md:text-5xl text-foreground">
                    {stat.value}
                  </dd>
                  <dt className="eyebrow text-muted-foreground mt-3 inline-flex items-center gap-1.5">
                    {"isRating" in stat && <GoogleIcon className="h-3 w-3" />}
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Services ─────────────────────────────────────────────────── */}
        <Section>
          <SectionHeader
            eyebrow="What We Do"
            title="Our"
            accent="Services"
            subtitle="Dirt work first, and everything else that keeps a Lowcountry property right."
          />

          {/* A compact grid, not five full-width alternating rows. The rows
              looked good but cost roughly five screens of scrolling on the
              page whose only job is to get someone to call. The detailed
              alternating treatment still lives on /services. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <FadeInView key={service.slug} delay={index * 0.06}>
                <Link
                  to="/services"
                  className="group flex h-full flex-col rounded-lg overflow-hidden border border-border bg-card transition-colors duration-500 hover:border-primary/60"
                >
                  <div className="overflow-hidden">
                    <ServiceImage
                      service={service}
                      eager={index === 0}
                      aspect="aspect-[16/10]"
                      className="rounded-none transition-transform duration-700 ease-editorial group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    <span className="eyebrow text-primary mb-3">
                      {String(index + 1).padStart(2, "0")}
                      {index === 0 && " · Lead service"}
                    </span>
                    <h3 className="font-heading text-2xl md:text-[1.75rem] font-extralight leading-tight text-card-foreground mb-3">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.summary}
                    </p>
                    <span className="eyebrow text-primary mt-6 inline-block group-hover:text-foreground transition-colors">
                      Learn more
                    </span>
                  </div>
                </Link>
              </FadeInView>
            ))}
          </div>
        </Section>

        {/* ── Our story ────────────────────────────────────────────────── */}
        <Section variant="cream">
          <OurStory showLink />
        </Section>

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
          title="Ready to"
          accent="get started?"
          blurb="Call Josiah for a free walk-through and an honest quote — usually same week."
        />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
