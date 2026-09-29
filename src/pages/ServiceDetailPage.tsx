import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import FadeInView from "@/components/animations/FadeInView";
import ServiceImage from "@/components/ServiceImage";
import ServicePlate, { plateDescriptions } from "@/components/ServicePlate";
import ProcessSteps from "@/components/ProcessSteps";
import FaqList, { type FaqEntry } from "@/components/FaqList";
import SEO from "@/components/SEO";
import CtaSection from "@/components/CtaSection";
import NotFound from "@/pages/NotFound";
import { coreServices, findService } from "@/data/services";
import { problemsForService } from "@/data/yard-problems";
import { BUSINESS, areaServedSchema, serviceAreaNames } from "@/data/business";
import { businessRef } from "@/lib/schema";

/**
 * One page per service — `/services/<slug>`.
 *
 * This is the highest-value on-site change available to a local trades site:
 * Whitespark's 2026 Local Search Ranking Factors puts "dedicated page per
 * service" at #1 for local organic. The pages are prerendered by
 * `getStaticPaths` in `App.tsx`, so each is real static HTML with its own
 * title, description, canonical, Service and FAQPage schema.
 *
 * What keeps five of these from being near-identical doorway pages is that
 * almost everything below the hero is specific to the service: the choice the
 * homeowner actually has to make (`approaches`), how that job runs, what moves
 * its price, and the questions people ask about it — including the local
 * permit answers, cited to the section of code they come from. Each one reads
 * as a page someone could learn something from, which is the point.
 */
const ServiceDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = findService(slug);

  // An unknown slug renders the real 404 rather than an empty shell. Only
  // reachable by hand-typed URL — every generated link comes from `services`.
  if (!service) return <NotFound />;

  const isCore = service.tier === "core";
  const coreIndex = coreServices.findIndex((s) => s.slug === service.slug);
  const others = coreServices.filter((s) => s.slug !== service.slug);
  const problems = problemsForService(service.slug);
  const path = `/services/${service.slug}`;
  const quoteHref = `/contact?service=${service.slug}`;
  // A service with a real photo leads with it; its drawing then earns its own
  // place further down, next to the choice it illustrates.
  const plateBelow = Boolean(service.image && service.plate);

  const faqs: FaqEntry[] = [
    ...problems.map((problem) => ({
      question: problem.question,
      answer: (
        <>
          <p>{problem.cause}</p>
          <p className="mt-3">{problem.fix}</p>
        </>
      ),
      footer: (
        <Link
          to={`/contact?problem=${problem.id}`}
          className="eyebrow inline-flex items-center gap-1.5 text-primary hover:underline"
        >
          Get a quote for this
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      ),
    })),
    ...(service.faqs ?? []).map((faq) => ({ question: faq.question, answer: <p>{faq.answer}</p> })),
  ];

  const faqSchema = [
    ...problems.map((p) => ({ q: p.question, a: `${p.cause} ${p.fix}` })),
    ...(service.faqs ?? []).map((f) => ({ q: f.question, a: f.answer })),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main" className="flex-1 pt-24">
        <SEO
          title={service.pageTitle}
          description={service.pageDescription}
          canonical={path}
          keywords={service.pageKeywords}
          jsonLd={[
            {
              "@context": "https://schema.org",
              "@type": "Service",
              name: service.title,
              serviceType: service.title,
              url: `${BUSINESS.url}${path}`,
              description: service.description1,
              provider: businessRef,
              areaServed: areaServedSchema,
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: `${service.title} services`,
                itemListElement: service.items.map((item) => ({
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: item.label,
                    description: item.detail,
                  },
                })),
              },
            },
            // Three levels, because this page really is two clicks deep.
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: BUSINESS.url },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Services",
                  item: `${BUSINESS.url}/services`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: service.title,
                  item: `${BUSINESS.url}${path}`,
                },
              ],
            },
            ...(faqSchema.length
              ? [
                  {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    mainEntity: faqSchema.map((faq) => ({
                      "@type": "Question",
                      name: faq.q,
                      acceptedAnswer: { "@type": "Answer", text: faq.a },
                    })),
                  },
                ]
              : []),
          ]}
        />

        {/* ── Hero: the pitch on the left, the picture of the work on the right ── */}
        <section className="px-5 sm:px-6 md:px-10 pt-8 pb-section-sm md:pt-12 md:pb-20">
          <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <FadeInView immediate>
              <nav aria-label="Breadcrumb" className="mb-8">
                <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <li>
                    <Link to="/" className="hover:text-primary transition-colors">
                      Home
                    </Link>
                  </li>
                  <ChevronRight className="h-3 w-3" aria-hidden="true" />
                  <li>
                    <Link to="/services" className="hover:text-primary transition-colors">
                      Services
                    </Link>
                  </li>
                  <ChevronRight className="h-3 w-3" aria-hidden="true" />
                  <li aria-current="page" className="text-foreground">
                    {service.title}
                  </li>
                </ol>
              </nav>

              <p className="eyebrow text-primary mb-6">
                {isCore ? `Service ${String(coreIndex + 1).padStart(2, "0")}` : "Also on request"}
              </p>
              {/* Sized for a half-width column, like the homepage hero: the
                  full `text-hero` scale breaks a service name plus the locality
                  into four or five ragged lines here. */}
              <h1 className="text-hero font-heading lg:text-[clamp(2.5rem,4.2vw,4.25rem)] lg:leading-[0.92]">
                {service.title}
                <br />
                <span className="text-primary">
                  in Mount Pleasant <span className="whitespace-nowrap">&amp; Charleston</span>
                </span>
              </h1>
              <p className="text-subtitle text-muted-foreground mt-8 max-w-xl leading-relaxed">
                {service.summary}
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link to={quoteHref}>Get a Free Quote</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={BUSINESS.phoneHref} data-analytics-where="service-page">
                    Call {BUSINESS.phone}
                  </a>
                </Button>
              </div>
            </FadeInView>

            <FadeInView immediate>
              <ServiceImage
                service={service}
                eager
                number={isCore ? coreIndex + 1 : undefined}
                sizes="(min-width: 1024px) 48vw, 100vw"
              />
            </FadeInView>
          </div>
        </section>

        {/* ── The work, and everything it includes ────────────────────── */}
        <Section variant="cream">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
            <FadeInView>
              <p className="eyebrow text-primary mb-6">The work</p>
              <p className="font-heading text-2xl font-light leading-snug text-foreground md:text-[1.75rem]">
                {service.description1}
              </p>
              <p className="mt-6 leading-relaxed text-muted-foreground">{service.description2}</p>
            </FadeInView>

            {/* One reveal around the whole list, never one per row: a
                FadeInView between <ul> and <li> puts a <div> there and
                destroys the list semantics a screen reader depends on. */}
            <FadeInView delay={0.1}>
              <h2 className="eyebrow text-primary mb-6">What&rsquo;s included</h2>
              <ul className="grid grid-cols-1 border-t border-border sm:grid-cols-2 sm:gap-x-10">
                {service.items.map((item, i) => (
                  <li key={item.label} className="flex gap-4 border-b border-border py-5">
                    <span className="eyebrow pt-1 text-primary">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="block font-heading text-lg leading-snug text-foreground">
                        {item.label}
                      </span>
                      <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
                        {item.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </FadeInView>
          </div>
        </Section>

        {/* ── The choice most people don't know they have ─────────────── */}
        {service.approaches && (
          <Section>
            <SectionHeader
              eyebrow="Know your options"
              title={service.approaches.title}
              accent={service.approaches.accent}
            />
            {plateBelow && service.plate && (
              <FadeInView className="mx-auto mb-10 max-w-4xl md:mb-14">
                <ServicePlate
                  plate={service.plate}
                  number={coreIndex + 1}
                  label={plateDescriptions[service.plate]}
                />
              </FadeInView>
            )}
            <div
              className={`grid grid-cols-1 gap-4 md:gap-6 ${
                service.approaches.options.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 max-w-4xl mx-auto"
              }`}
            >
              {service.approaches.options.map((option, i) => (
                <FadeInView key={option.name} delay={i * 0.08} className="h-full">
                  <article className="flex h-full flex-col rounded-lg border border-border bg-card p-6 md:p-8">
                    <span className="eyebrow text-primary">{String.fromCharCode(65 + i)}</span>
                    <h3 className="mt-4 font-heading text-3xl font-extralight leading-none text-card-foreground">
                      {option.name}
                    </h3>
                    <p className="mt-4 flex-1 leading-relaxed text-muted-foreground">{option.detail}</p>
                    <p className="mt-6 border-t border-border pt-4 text-sm text-foreground/85">
                      <span className="eyebrow mr-2 text-muted-foreground">Best for</span>
                      {option.bestFor}
                    </p>
                  </article>
                </FadeInView>
              ))}
            </div>
          </Section>
        )}

        {/* ── How the job runs ─────────────────────────────────────────── */}
        {service.process && (
          <Section variant="muted">
            <SectionHeader eyebrow="How it runs" title="Start" accent="to finish" />
            <ProcessSteps steps={service.process} />
          </Section>
        )}

        {/* ── What moves the price — never the price ───────────────────── */}
        {service.priceFactors && (
          <Section className="border-t border-border">
            <SectionHeader
              eyebrow="Pricing, honestly"
              title="What moves"
              accent="the price"
              subtitle="There&rsquo;s no price list on this site, on purpose: no two pieces of ground are the same. These are the things a quote actually comes down to."
            />
            <FadeInView>
              <ul className="grid grid-cols-1 border-t border-border sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3">
                {service.priceFactors.map((factor, i) => (
                  <li key={factor.label} className="border-b border-border py-6">
                    <span className="eyebrow text-primary">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-3 font-heading text-xl leading-snug text-foreground">{factor.label}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{factor.detail}</p>
                  </li>
                ))}
              </ul>
            </FadeInView>
          </Section>
        )}

        {/* ── Questions ────────────────────────────────────────────────── */}
        {faqs.length > 0 && (
          <Section variant="cream">
            <SectionHeader
              eyebrow="Straight answers"
              title="Questions"
              accent="people ask"
              subtitle={
                service.faqs?.length
                  ? "Including the local rules. Where a town has the final word, we say which one and how to reach it."
                  : "And what Josiah would look at on the visit."
              }
            />
            <FaqList items={faqs} />
          </Section>
        )}

        {/* ── Coverage + the rest of the core work ─────────────────────── */}
        <Section className="border-t border-border">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <FadeInView>
              <p className="eyebrow text-primary mb-5">Where we work</p>
              <p className="text-muted-foreground leading-relaxed">
                {service.title} across {serviceAreaNames.slice(0, -1).join(", ")}, and{" "}
                {serviceAreaNames[serviceAreaNames.length - 1]}. Josiah is based in Mount
                Pleasant, and quotes are free and on-site.
              </p>
            </FadeInView>

            <FadeInView delay={0.1}>
              <p className="eyebrow text-primary mb-5">
                {isCore ? "Often part of the same job" : "What we mostly do"}
              </p>
              <ul className="divide-y divide-border border-y border-border">
                {others.map((other) => (
                  <li key={other.slug}>
                    <Link
                      to={`/services/${other.slug}`}
                      className="group flex min-h-[44px] items-center justify-between gap-4 py-4"
                    >
                      <span>
                        <span className="block text-foreground transition-colors group-hover:text-primary">
                          {other.title}
                        </span>
                        <span className="mt-0.5 block text-sm text-muted-foreground">{other.navBlurb}</span>
                      </span>
                      <ArrowUpRight
                        className="h-4 w-4 flex-none text-primary opacity-60 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </FadeInView>
          </div>
        </Section>

        <CtaSection
          title="Tell us what"
          accent="you're dealing with"
          blurb="Free on-site quotes across Mount Pleasant and the greater Charleston area."
        />
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetailPage;
