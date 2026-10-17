import { Link, useParams } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import FadeInView from "@/components/animations/FadeInView";
import ServiceImage from "@/components/ServiceImage";
import BeforeAfterPair from "@/components/BeforeAfterPair";
import ServicePlate, { plateDescriptions } from "@/components/ServicePlate";
import FaqList, { type FaqEntry } from "@/components/FaqList";
import SEO from "@/components/SEO";
import CtaSection from "@/components/CtaSection";
import NotFound from "@/pages/NotFound";
import { coreServices, findService, type Service } from "@/data/services";
import { problemsForService } from "@/data/yard-problems";
import { guideCovering } from "@/data/guides";
import { BUSINESS, areaServedSchema } from "@/data/business";
import { businessRef } from "@/lib/schema";
import { cn } from "@/lib/utils";

/**
 * Sentence case for a label written in Title Case in `services.ts`, so the
 * page reads as prose rather than a menu ("Shrubs & trees", not "Shrubs &
 * Trees"). Presentational only: the data, and every schema block built from
 * it, keep their own casing. "French" is the one proper adjective in there.
 */
const sentenceCase = (s: string) =>
  s
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\bfrench\b/g, "French");

/** A text link the way the homepage sets one: a faint rule that darkens on hover. */
const textLink =
  "group inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-foreground underline decoration-foreground/25 underline-offset-[5px] transition-colors hover:decoration-foreground";

const LinkArrow = () => (
  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
);

/**
 * The link from a short FAQ answer to its guide, when one exists. The guide is
 * the page a search for that exact question should land on, so the link is
 * worded as what it is: the full answer.
 */
const FullAnswer = ({ question }: { question: string }) => {
  const guide = guideCovering(question);
  if (!guide) return null;
  return (
    <Link to={`/guides/${guide.slug}`} className={textLink}>
      The full answer
      <LinkArrow />
    </Link>
  );
};

/**
 * The choices, set the way a detail sheet sets its notes: a ruled list of
 * names, what each one is, and who it suits. No boxes and no A/B/C: the
 * options aren't a sequence, and the rules already separate them.
 *
 * `beside` stacks them in one column next to the drawing; otherwise they run
 * across the page in ruled columns, like the steps on the homepage.
 */
const Options = ({
  options,
  beside,
}: {
  options: NonNullable<Service["approaches"]>["options"];
  beside: boolean;
}) => (
  <ul
    className={cn(
      "border-t border-border",
      !beside &&
        cn("grid grid-cols-1 md:divide-x md:divide-border", options.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"),
    )}
  >
    {options.map((option, i) => (
      <li
        key={option.name}
        className={cn(
          "border-b border-border py-7",
          !beside && "md:border-b-0 md:px-8 md:pb-2 md:pt-8 md:first:pl-0 md:last:pr-0 lg:px-10",
        )}
      >
        <FadeInView delay={0.08 * i}>
          <h3 className="font-heading text-[1.75rem] leading-none text-foreground md:text-[2rem]">{option.name}</h3>
          <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">{option.detail}</p>
          <p className="mt-5 grid max-w-md grid-cols-[auto_minmax(0,1fr)] gap-x-3 text-sm leading-relaxed">
            <span className="font-semibold text-foreground">Best for</span>
            <span className="text-foreground">{option.bestFor}</span>
          </p>
        </FadeInView>
      </li>
    ))}
  </ul>
);

/**
 * One page per service — `/services/<slug>`.
 *
 * This is the highest-value on-site change available to a local trades site:
 * Whitespark's 2026 Local Search Ranking Factors puts "dedicated page per
 * service" at #1 for local organic. The pages are prerendered by
 * `getStaticPaths` in `App.tsx`, so each is real static HTML with its own
 * title, description, canonical, Service and FAQPage schema.
 *
 * What keeps these from being near-identical doorway pages is that almost
 * everything below the hero is specific to the service: the choice the
 * homeowner actually has to make (`approaches`), what the job includes, what
 * moves its price, and the questions people ask about it — including the local
 * permit answers, cited to the section of code they come from. Each one reads
 * as a page someone could learn something from, which is the point.
 *
 * Set like the homepage: one ink, sentence case, hairline rules instead of
 * boxes, pictures captioned underneath. Below the hero the page is one sheet
 * of paper divided by rules, not alternating bands (two creams 2% apart read
 * as rendering seams, design review 2026-10-17), and the sections open in
 * different ways on purpose: the work with no label at all, the options with
 * a bare heading, the questions with their note under the heading, the
 * related work with its heading beside the list. The same mark + heading +
 * side note six times down a page is what a generated page looks like.
 *
 * The hero is the first screen, so it rises in CSS (`.hero-line`,
 * `.hero-rise`) and its picture never animates. A service with no photo
 * (pools and ponds, until Josiah has a dig) leads with its section drawing.
 */
const ServiceDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = findService(slug);

  // An unknown slug renders the real 404 rather than an empty shell. Only
  // reachable by hand-typed URL — every generated link comes from `services`.
  if (!service) return <NotFound />;

  const isCore = service.tier === "core";
  const others = coreServices.filter((s) => s.slug !== service.slug);
  const problems = problemsForService(service.slug);
  const path = `/services/${service.slug}`;
  const quoteHref = `/contact?service=${service.slug}`;
  // A service with a real photo leads with it; its drawing then earns its own
  // place further down: beside the choice it illustrates when there is one,
  // otherwise beside the description of the work (excavation's grade at the
  // foundation, which no photo can show).
  const plateBelow = Boolean(service.image && service.plate);
  const plateWithOptions = plateBelow && Boolean(service.approaches);
  const plateWithWork = plateBelow && !service.approaches;

  // Price is the first question anyone has, so it is the first answer, not a
  // section of its own. Still no numbers: a range Josiah hasn't set is a
  // promise he didn't make. What moves the price is the honest answer.
  const priceQuestion = service.priceQuestion ?? `How much does ${service.title.toLowerCase()} cost?`;
  const priceIntro =
    "There's no price list here, on purpose: no two pieces of ground are the same. Josiah walks it and gives you a straight number. What it comes down to:";
  const faqs: FaqEntry[] = [
    ...(service.priceFactors
      ? [
          {
            question: priceQuestion,
            answer: (
              <>
                <p>{priceIntro}</p>
                <ul className="mt-5 border-t border-border">
                  {service.priceFactors.map((factor) => (
                    <li key={factor.label} className="border-b border-border py-3.5">
                      <span className="font-semibold text-foreground">{factor.label}.</span> {factor.detail}
                    </li>
                  ))}
                </ul>
              </>
            ),
          },
        ]
      : []),
    ...problems.map((problem) => ({
      question: problem.question,
      answer: (
        <>
          <p>{problem.cause}</p>
          <p className="mt-3">{problem.fix}</p>
        </>
      ),
      footer: (
        <div className="flex flex-wrap gap-x-8">
          <FullAnswer question={problem.question} />
          <Link to={`/contact?problem=${problem.id}`} className={textLink}>
            Get a free quote for this
            <LinkArrow />
          </Link>
        </div>
      ),
    })),
    ...(service.faqs ?? []).map((faq) => ({
      question: faq.question,
      answer: <p>{faq.answer}</p>,
      footer: guideCovering(faq.question) ? <FullAnswer question={faq.question} /> : undefined,
    })),
  ];

  const faqSchema = [
    ...(service.priceFactors
      ? [{ q: priceQuestion, a: `${priceIntro} ${service.priceFactors.map((f) => `${f.label}: ${f.detail}`).join(" ")}` }]
      : []),
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

        {/* ── Hero: the pitch on the paper, the picture of the work beside it ──
            Everything here is the first screen, so nothing waits on JavaScript:
            the heading and its lines rise in CSS, and the picture loads eagerly
            and simply paints. */}
        <section className="pb-14 pt-6 md:pb-20 md:pt-10">
          <div className="frame grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-x-10">
            <div className="min-w-0 lg:col-span-6">
              <nav aria-label="Breadcrumb" className="mb-5 hero-rise" style={{ animationDelay: "0ms" }}>
                <ol className="flex flex-wrap items-center text-sm text-muted-foreground">
                  <li>
                    <Link to="/" className="inline-flex min-h-[44px] items-center transition-colors hover:text-foreground">
                      Home
                    </Link>
                    <span aria-hidden="true" className="mx-2.5 text-border">/</span>
                  </li>
                  <li>
                    <Link to="/services" className="inline-flex min-h-[44px] items-center transition-colors hover:text-foreground">
                      Services
                    </Link>
                    <span aria-hidden="true" className="mx-2.5 text-border">/</span>
                  </li>
                  <li aria-current="page" className="text-foreground">
                    {service.title}
                  </li>
                </ol>
              </nav>

              {/* One ink, sentence case, the place in the same breath as the
                  work. The interior `text-hero` step, the same as every other
                  page's title: no per-page clamp (design review 2026-10-17). */}
              <h1 className="font-heading text-hero text-foreground text-balance">
                <span className="hero-line">
                  <span style={{ animationDelay: "40ms" }}>
                    {sentenceCase(service.title)} in{" "}
                    <span className="whitespace-nowrap">Mount Pleasant</span>{" "}
                    <span className="whitespace-nowrap">&amp; Charleston</span>
                  </span>
                </span>
              </h1>
              <p
                className="mt-6 max-w-xl text-subtitle leading-relaxed text-muted-foreground hero-rise md:mt-7"
                style={{ animationDelay: "140ms" }}
              >
                {service.summary}
              </p>

              <div
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 md:mt-10 hero-rise"
                style={{ animationDelay: "220ms" }}
              >
                <Button asChild size="lg">
                  <Link to={quoteHref}>Get a free quote</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={BUSINESS.phoneHref} data-analytics-where="service-page">
                    <Phone aria-hidden="true" />
                    Call {BUSINESS.phone}
                  </a>
                </Button>
              </div>
            </div>

            <div className="min-w-0 lg:col-span-6">
              {/* Where Josiah has the same spot before and after, that pair is
                  the picture: it shows the work rather than only the result. */}
              {service.beforeAfter ? (
                <figure>
                  <BeforeAfterPair
                    pair={service.beforeAfter}
                    eager
                    sizes="(min-width: 1024px) 24vw, 50vw"
                    className="aspect-[4/3] overflow-hidden rounded-[3px] md:aspect-[16/10] lg:aspect-[4/3]"
                  />
                  <figcaption className="mt-4 border-t border-border pt-3 text-sm text-muted-foreground">
                    One of Josiah&rsquo;s jobs in Mount Pleasant.
                  </figcaption>
                </figure>
              ) : (
                <ServiceImage
                  service={service}
                  eager
                  aspect="aspect-[4/3] md:aspect-[16/10] lg:aspect-[4/3]"
                  sizes="(min-width: 1024px) 46vw, 100vw"
                />
              )}
            </div>
          </div>
        </section>

        {/* ── The work, and everything it includes ────────────────────────
            A standfirst on the left, the inventory on the right, like a spec
            sheet: each line a name and what it means, ruled, no numbers. The
            standfirst carries no label: it is the lead paragraph, and a mark
            beside the list's own "What's included" set two label styles side
            by side. */}
        <Section variant="cream">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
            {/* The standfirst holds still beside a long inventory. Not when it
                carries the drawing: then it can be taller than the screen. */}
            <FadeInView
              className={cn("min-w-0 lg:col-span-5", !plateWithWork && "lg:sticky lg:top-28 lg:self-start")}
            >
              <p className="text-[1.25rem] font-medium leading-[1.5] text-foreground md:text-[1.5rem] md:leading-[1.45]">
                {service.description1}
              </p>
              <p className="mt-6 hidden max-w-xl leading-relaxed text-muted-foreground md:block">{service.description2}</p>
              {plateWithWork && service.plate && (
                <ServicePlate
                  plate={service.plate}
                  label={plateDescriptions[service.plate]}
                  className="mt-10 rounded-[3px]"
                />
              )}
            </FadeInView>

            {/* One reveal around the whole list, never one per row: a
                FadeInView between <ul> and <li> puts a <div> there and
                destroys the list semantics a screen reader depends on. */}
            <FadeInView delay={0.1} className="min-w-0 lg:col-span-7 lg:col-start-6 xl:col-span-6 xl:col-start-7">
              <h2 className="eyebrow mb-4 text-foreground lg:mt-0.5">What&rsquo;s included</h2>
              <ul className="border-t border-border">
                {service.items.map((item) => (
                  <li
                    key={item.label}
                    className="grid grid-cols-1 gap-x-8 gap-y-1.5 border-b border-border py-4 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:py-5"
                  >
                    <span className="font-heading text-lg leading-snug text-foreground md:text-xl">
                      {sentenceCase(item.label)}
                    </span>
                    {/* Labels alone on a phone: seven two-line rows was a screen of
                        scrolling for detail the label mostly already says. */}
                    <span className="hidden text-[0.9375rem] leading-relaxed text-muted-foreground sm:block">
                      {item.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </FadeInView>
          </div>
        </Section>

        {/* ── The choice most people don't know they have ─────────────────
            The drawing and its notes side by side, as on a detail sheet. The
            drawing holds still while the notes scroll past it. */}
        {service.approaches && (
          <Section variant="cream">
            <SectionHeader title={service.approaches.title} accent={service.approaches.accent} />
            {plateWithOptions && service.plate ? (
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
                <FadeInView className="min-w-0 lg:col-span-7">
                  <div className="lg:sticky lg:top-28">
                    <ServicePlate
                      plate={service.plate}
                      label={plateDescriptions[service.plate]}
                      className="rounded-[3px]"
                    />
                  </div>
                </FadeInView>
                <div className="min-w-0 lg:col-span-5">
                  <Options options={service.approaches.options} beside />
                </div>
              </div>
            ) : (
              <Options options={service.approaches.options} beside={false} />
            )}
          </Section>
        )}

        {/* ── Questions ─────────────────────────────────────────────────
            The note sits under the heading here, not beside it: it qualifies
            the heading, and it breaks the side-note rhythm of the page. */}
        {faqs.length > 0 && (
          <Section variant="cream">
            <SectionHeader title="Questions people ask" className="mb-0 md:mb-0" />
            <p className="mb-10 mt-5 max-w-xl leading-relaxed text-muted-foreground text-pretty md:mb-14 md:text-lg">
              {service.faqs?.length
                ? "Including the local rules. Where a town has the final word, we say which one and how to reach it."
                : "And what Josiah would look at on the visit."}
            </p>
            <FaqList items={faqs} />
          </Section>
        )}

        {/* ── The rest of the core work ────────────────────────────────────
            The same ruled list as the homepage's services, smaller, with its
            heading set beside it. */}
        <Section variant="cream">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <FadeInView className="lg:col-span-4">
              <h2 className="font-heading text-[1.75rem] leading-none text-foreground text-balance md:text-[2.25rem]">
                {isCore ? "Often part of the same job" : "The main work"}
              </h2>
            </FadeInView>
            <FadeInView delay={0.08} className="min-w-0 lg:col-span-8">
              <ul className="border-t border-border">
                {others.map((other) => (
                  <li key={other.slug} className="border-b border-border">
                    <Link
                      to={`/services/${other.slug}`}
                      className="group grid min-h-[44px] grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_auto] md:gap-x-8 md:py-6"
                    >
                      <span className="font-heading text-xl leading-tight text-foreground underline decoration-transparent decoration-1 underline-offset-[5px] transition-colors duration-300 group-hover:decoration-foreground/35 md:text-2xl">
                        {other.title}
                      </span>
                      <span className="col-start-1 row-start-2 mt-1.5 text-sm leading-relaxed text-muted-foreground md:col-start-2 md:row-start-1 md:mt-0 md:text-base">
                        {other.navBlurb}
                      </span>
                      <ArrowRight
                        className="col-start-2 row-start-1 h-5 w-5 self-center text-muted-foreground transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-foreground md:col-start-3"
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
