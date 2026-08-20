import { Link, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import FadeInView from "@/components/animations/FadeInView";
import ServiceImage from "@/components/ServiceImage";
import SEO from "@/components/SEO";
import CtaSection from "@/components/CtaSection";
import NotFound from "@/pages/NotFound";
import { services } from "@/data/services";
import { problemsForService } from "@/data/yard-problems";
import { BUSINESS, areaServedSchema, serviceAreaNames } from "@/data/business";
import { businessRef } from "@/lib/schema";

/**
 * One page per service — `/services/<slug>`.
 *
 * This is the highest-value on-site change available to a local trades site:
 * Whitespark's 2026 Local Search Ranking Factors puts "dedicated page per
 * service" at #1 for local organic, and all five previously shared a single
 * `/services` page while their slugs sat unused in the data file.
 *
 * The pages are prerendered by `getStaticPaths` in `App.tsx`, so each one is
 * real static HTML with its own title, description, canonical and Service
 * schema — which is the entire point. A client-only route would have been
 * worthless here.
 *
 * The FAQ is not filler: it is the same yard-problem content the homepage
 * picker uses, phrased as the questions people type into Google, and it is what
 * gives each page substantial unique prose rather than five near-identical
 * pages competing with each other. That distinction is also what separates this
 * from a doorway page.
 */
const ServiceDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = services.find((s) => s.slug === slug);

  // An unknown slug renders the real 404 rather than an empty shell. Only
  // reachable by hand-typed URL — every generated link comes from `services`.
  if (!service) return <NotFound />;

  const index = services.findIndex((s) => s.slug === service.slug);
  const others = services.filter((s) => s.slug !== service.slug);
  const problems = problemsForService(service.slug);
  const path = `/services/${service.slug}`;

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
            ...(problems.length
              ? [
                  {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    mainEntity: problems.map((problem) => ({
                      "@type": "Question",
                      name: problem.question,
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: `${problem.cause} ${problem.fix}`,
                      },
                    })),
                  },
                ]
              : []),
          ]}
        />

        {/* Page header */}
        <section className="px-5 sm:px-6 md:px-10 py-12 md:py-20">
          <div className="mx-auto max-w-content">
            <FadeInView>
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
                Service {String(index + 1).padStart(2, "0")}
              </p>
              {/* One size down from the homepage hero on purpose: with the
                  locality on the second line, `md:text-display` ran to three
                  lines at 1440 and pushed everything below the fold on a page
                  whose job is to get to the photo and the phone number. */}
              <h1 className="text-hero font-heading max-w-5xl">
                {service.title}
                <br />
                <span className="text-primary">in Mount Pleasant, SC</span>
              </h1>
              <p className="text-subtitle text-muted-foreground mt-8 max-w-xl leading-relaxed">
                {service.summary}
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link to="/contact">Get a Free Quote</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={BUSINESS.phoneHref} data-analytics-where="service-page">
                    Call {BUSINESS.phone}
                  </a>
                </Button>
              </div>
            </FadeInView>
          </div>
        </section>

        {/* Photo + detail */}
        <Section className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-start">
            {/* "up", not "left": the x-offset directions start the element 56px
                to the right, and that start state is baked into the prerendered
                HTML — so on a narrow viewport the page is horizontally
                scrollable until the observer fires. */}
            <FadeInView>
              <ServiceImage service={service} eager />
            </FadeInView>

            <FadeInView delay={0.15}>
              <p className="text-muted-foreground leading-relaxed mb-5">
                {service.description1}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {service.description2}
              </p>
            </FadeInView>
          </div>
        </Section>

        {/* What's included */}
        <Section variant="cream">
          <SectionHeader
            eyebrow="What's included"
            title="The work"
            accent="itself"
            subtitle={`Everything we handle under ${service.title.toLowerCase()}.`}
          />
          {/* One reveal around the whole list, never one per row: a FadeInView
              between <ul> and <li> puts a <div> there and destroys the list
              semantics a screen reader depends on. */}
          <FadeInView>
            <ul className="max-w-narrow mx-auto divide-y divide-border border-y border-border">
              {service.items.map((item) => (
                <li key={item.label} className="py-5">
                  <span className="eyebrow text-foreground block mb-1.5">{item.label}</span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    {item.detail}
                  </span>
                </li>
              ))}
            </ul>
          </FadeInView>
        </Section>

        {/* What people call about — the yard-problem content, as FAQ */}
        {problems.length > 0 && (
          <Section variant="muted">
            <SectionHeader
              eyebrow="What people call about"
              title="Common"
              accent="questions"
              subtitle="Straight answers, and what Josiah would look at on the visit."
            />
            <div className="max-w-narrow mx-auto divide-y divide-border border-y border-border">
              {problems.map((problem) => (
                <FadeInView key={problem.id}>
                  <div className="py-7">
                    <h3 className="font-heading text-xl md:text-2xl text-foreground mb-3">
                      {problem.question}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      {problem.cause}
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-4">{problem.fix}</p>
                    <Link
                      to={`/contact?problem=${problem.id}`}
                      className="eyebrow text-primary hover:underline inline-flex items-center gap-1.5"
                    >
                      Get a quote for this
                      <ChevronRight className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  </div>
                </FadeInView>
              ))}
            </div>
          </Section>
        )}

        {/* Coverage + the other services */}
        <Section>
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <FadeInView>
              <p className="eyebrow text-primary mb-5">Where we work</p>
              <p className="text-muted-foreground leading-relaxed">
                {service.title} across {serviceAreaNames.slice(0, -1).join(", ")}, and{" "}
                {serviceAreaNames[serviceAreaNames.length - 1]}. Josiah is based in
                Mount Pleasant, and quotes are free and on-site.
              </p>
            </FadeInView>

            <FadeInView delay={0.1}>
              <p className="eyebrow text-primary mb-5">Also from Firm Foundation</p>
              <ul className="divide-y divide-border border-y border-border">
                {others.map((other) => (
                  <li key={other.slug}>
                    <Link
                      to={`/services/${other.slug}`}
                      className="flex items-center justify-between gap-4 py-4 min-h-[44px] group"
                    >
                      <span className="text-foreground group-hover:text-primary transition-colors">
                        {other.title}
                      </span>
                      <ChevronRight
                        className="h-4 w-4 flex-none text-primary opacity-60 group-hover:opacity-100 transition-opacity"
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
