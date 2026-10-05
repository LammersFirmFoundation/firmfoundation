import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, ChevronRight, MessageSquare } from "lucide-react";
import GuideCard from "@/components/GuideCard";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import FadeInView from "@/components/animations/FadeInView";
import ServicePlate, { plateDescriptions } from "@/components/ServicePlate";
import SEO from "@/components/SEO";
import CtaSection from "@/components/CtaSection";
import NotFound from "@/pages/NotFound";
import { findService } from "@/data/services";
import { findYardProblem } from "@/data/yard-problems";
import {
  findGuide,
  findServiceFaq,
  formatGuideDate,
  guides,
  type GuideSection,
} from "@/data/guides";
import { ACCEPTS_SMS, BUSINESS, smsHref } from "@/data/business";
import { businessRef } from "@/lib/schema";

const headingClass = "font-heading text-2xl font-light leading-snug text-foreground md:text-[1.75rem]";

/** The small bar bullet the service pages use, so lists read the same everywhere. */
const Bullet = () => <span aria-hidden="true" className="mt-2.5 h-1 w-3 shrink-0 rounded-full bg-primary" />;

const SeeAlso = ({ slug }: { slug: string }) => {
  const other = findGuide(slug);
  if (!other) return null;
  return (
    <Link
      to={`/guides/${other.slug}`}
      className="eyebrow mt-5 inline-flex items-center gap-1.5 text-primary hover:underline"
    >
      Related: {other.short}
      <ChevronRight className="h-3 w-3" aria-hidden="true" />
    </Link>
  );
};

/** One block of the article. FAQ and approaches sections read from services.ts, never a copy. */
const GuideBlock = ({ section }: { section: GuideSection }) => {
  if (section.kind === "faq") {
    const faq = findServiceFaq(section.question);
    if (!faq) return null;
    return (
      <section>
        <h2 className={headingClass}>{faq.question}</h2>
        <p className="mt-4">{faq.answer}</p>
      </section>
    );
  }

  if (section.kind === "approaches") {
    const options = findService(section.serviceSlug)?.approaches?.options ?? [];
    return (
      <section>
        <h2 className={headingClass}>{section.heading}</h2>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {options.map((option) => (
            <div key={option.name} className="flex flex-col rounded-lg border border-border p-5">
              <h3 className="font-heading text-xl font-light text-foreground">{option.name}</h3>
              <p className="mt-2 flex-1 text-[0.95rem]">{option.detail}</p>
              <p className="mt-4 border-t border-border pt-3 text-sm text-foreground/85">
                <span className="eyebrow mr-2 text-muted-foreground">Best for</span>
                {option.bestFor}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className={headingClass}>{section.heading}</h2>
      {section.paragraphs?.map((p) => (
        <p key={p} className="mt-4">
          {p}
        </p>
      ))}
      {section.bullets && (
        <ul className="mt-4 space-y-3">
          {section.bullets.map((b) => (
            <li key={b} className="flex gap-3">
              <Bullet />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
      {section.steps && (
        <ol className="mt-5 space-y-4">
          {section.steps.map((step, i) => (
            <li key={step} className="flex gap-4">
              <span className="eyebrow pt-1 text-primary">{String(i + 1).padStart(2, "0")}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      )}
      {section.then?.map((p) => (
        <p key={p} className="mt-4">
          {p}
        </p>
      ))}
      {section.see && <SeeAlso slug={section.see} />}
    </section>
  );
};

/**
 * One question, answered: `/guides/<slug>`, prerendered by `getStaticPaths`.
 *
 * The order is deliberate. The short answer sits directly under the question,
 * complete on its own, because that is the passage a search result or an AI
 * answer lifts; everything below it is the detail that makes the page worth
 * citing over the Town's own page — what the rule means on a real lot, in the
 * order the job happens, with every rule sourced and dated at the end.
 */
const GuidePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const guide = findGuide(slug);
  if (!guide) return <NotFound />;

  const service = findService(guide.serviceSlug)!;
  const problem = findYardProblem(guide.problemId)!;
  const path = `/guides/${guide.slug}`;
  const quoteHref = `/contact?problem=${problem.id}`;
  const others = guides.filter((g) => g.slug !== guide.slug);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main" className="flex-1 pt-24">
        <SEO
          title={guide.title}
          description={guide.description}
          canonical={path}
          keywords={guide.keywords}
          type="article"
          jsonLd={[
            {
              "@context": "https://schema.org",
              "@type": "Article",
              headline: guide.question,
              description: guide.answer,
              url: `${BUSINESS.url}${path}`,
              mainEntityOfPage: `${BUSINESS.url}${path}`,
              datePublished: guide.published,
              dateModified: guide.checked,
              author: businessRef,
              publisher: businessRef,
              about: {
                "@type": "Service",
                name: service.title,
                url: `${BUSINESS.url}/services/${service.slug}`,
              },
              citation: guide.sources.filter((s) => s.url).map((s) => s.url),
              image: `${BUSINESS.url}/og-land-clearing.jpg`,
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: BUSINESS.url },
                { "@type": "ListItem", position: 2, name: "Guides", item: `${BUSINESS.url}/guides` },
                { "@type": "ListItem", position: 3, name: guide.short, item: `${BUSINESS.url}${path}` },
              ],
            },
          ]}
        />

        {/* ── The question, and the answer in full ─────────────────────── */}
        <section className="px-5 sm:px-6 md:px-10 pt-8 pb-14 md:pt-12 md:pb-20">
          <FadeInView immediate className="mx-auto max-w-content">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <li>
                  <Link to="/" className="hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <ChevronRight className="h-3 w-3" aria-hidden="true" />
                <li>
                  <Link to="/guides" className="hover:text-primary transition-colors">
                    Guides
                  </Link>
                </li>
                <ChevronRight className="h-3 w-3" aria-hidden="true" />
                <li aria-current="page" className="text-foreground">
                  {guide.short}
                </li>
              </ol>
            </nav>

            <div className="max-w-4xl">
              <p className="eyebrow text-primary mb-6">{service.title}</p>
              <h1 className="font-heading text-[2.1rem] font-extralight leading-[1.05] tracking-[-0.02em] text-foreground sm:text-5xl md:text-[3.5rem]">
                {guide.question}
              </h1>

              <div className="mt-10 max-w-3xl border-l-2 border-primary pl-5 md:pl-7">
                <p className="eyebrow text-primary">The short answer</p>
                <p className="mt-3 text-lg leading-relaxed text-foreground/90 md:text-xl">{guide.answer}</p>
              </div>

              <p className="mt-8 text-sm text-muted-foreground">
                Rules checked <time dateTime={guide.checked}>{formatGuideDate(guide.checked)}</time> against
                the sources at the end of this page.
              </p>
            </div>
          </FadeInView>
        </section>

        {/* ── The detail, with the drawing and the ask beside it ──────── */}
        <Section variant="cream">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-20">
            <article className="max-w-[42rem] space-y-12 text-base leading-relaxed text-muted-foreground md:text-[1.0625rem]">
              {guide.sections.map((section, i) => (
                <GuideBlock key={i} section={section} />
              ))}

              <section>
                <h2 className={headingClass}>What Josiah looks at on a visit</h2>
                <p className="mt-4">{problem.visit}</p>
                <Link
                  to={quoteHref}
                  className="eyebrow mt-5 inline-flex items-center gap-1.5 text-primary hover:underline"
                >
                  Get a quote for this
                  <ChevronRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </section>

              <section className="border-t border-border pt-10">
                <h2 className="eyebrow text-foreground">Sources</h2>
                <ol className="mt-5 list-decimal space-y-2.5 pl-5 text-sm marker:text-muted-foreground">
                  {guide.sources.map((source) => (
                    <li key={source.label}>
                      {source.url ? (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
                        >
                          {source.label}
                        </a>
                      ) : (
                        source.label
                      )}
                    </li>
                  ))}
                </ol>
                <p className="mt-6 text-sm">
                  Checked {formatGuideDate(guide.checked)}. Rules change, so the town or agency named has the
                  final word. This page explains how the rules usually apply; it isn&rsquo;t legal advice.
                </p>
              </section>
            </article>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <ServicePlate plate={guide.plate} label={plateDescriptions[guide.plate]} />
              {/* Desktop only: on a phone the sticky Call/Text/Quote bar and the
                  closing CTA already make this ask, two screens apart. */}
              <div className="mt-5 hidden rounded-lg border border-border p-6 lg:block">
                <p className="font-heading text-xl font-light leading-snug text-foreground">
                  Want Josiah to look at yours?
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  He can tell a lot from a photo, and the walk-through is free.
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  {ACCEPTS_SMS && (
                    <Button asChild>
                      <a href={smsHref} data-analytics-where="guide-text">
                        <MessageSquare aria-hidden="true" />
                        Text a photo
                      </a>
                    </Button>
                  )}
                  <Button asChild variant="outline">
                    <Link to={quoteHref}>Get a free quote</Link>
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </Section>

        {/* ── Where to go next ─────────────────────────────────────────── */}
        <Section className="border-t border-border">
          <FadeInView>
            <p className="eyebrow text-primary mb-6">More straight answers</p>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {others.map((other) => (
                <li key={other.slug}>
                  <GuideCard guide={other} />
                </li>
              ))}
            </ul>
            <Link
              to={`/services/${service.slug}`}
              className="group mt-8 inline-flex items-center gap-2 text-foreground transition-colors hover:text-primary"
            >
              <span className="eyebrow text-muted-foreground">The service</span>
              <span className="font-heading text-lg">{service.title}</span>
              <ArrowUpRight
                className="h-4 w-4 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </FadeInView>
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

export default GuidePage;
