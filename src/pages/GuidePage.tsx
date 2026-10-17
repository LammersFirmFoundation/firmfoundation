import { Link, useParams } from "react-router-dom";
import { ArrowRight, ChevronRight, MessageSquare } from "lucide-react";
import GuideCard from "@/components/GuideCard";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
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

const headingClass = "font-heading text-[1.75rem] leading-[1.02] text-foreground text-balance md:text-[2.125rem]";

/** An underlined text link with a small arrow, the same as the homepage's "Read them all". */
const textLinkClass =
  "group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground underline decoration-foreground/25 underline-offset-[5px] transition-colors hover:decoration-foreground";

const LinkArrow = () => (
  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
);

/** A short rule for a bullet, the same stroke as the rule in front of `.mark`. */
const Bullet = () => <span aria-hidden="true" className="mt-[0.8em] h-px w-3.5 shrink-0 bg-foreground/45" />;

const SeeAlso = ({ slug }: { slug: string }) => {
  const other = findGuide(slug);
  if (!other) return null;
  return (
    <Link to={`/guides/${other.slug}`} className={textLinkClass}>
      Related: {other.short}
      <LinkArrow />
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
        <p className="mt-5">{faq.answer}</p>
      </section>
    );
  }

  if (section.kind === "approaches") {
    const options = findService(section.serviceSlug)?.approaches?.options ?? [];
    return (
      <section>
        <h2 className={headingClass}>{section.heading}</h2>
        {/* The choice as a ruled list, the option's name in the margin and
            what it means beside it: reads the same with two options or three,
            where side-by-side cards broke into an orphaned third. */}
        <div className="mt-7 border-t border-border">
          {options.map((option) => (
            <div
              key={option.name}
              className="grid grid-cols-1 gap-x-6 gap-y-2 border-b border-border py-6 last:border-b-0 last:pb-0 sm:grid-cols-[9.5rem_minmax(0,1fr)]"
            >
              <h3 className="font-heading text-[1.375rem] leading-tight text-foreground">{option.name}</h3>
              <div className="min-w-0">
                <p>{option.detail}</p>
                <p className="mt-3 text-[0.9375rem] text-foreground/85">
                  <span className="mr-2 font-semibold text-foreground">Best for</span>
                  {option.bestFor}
                </p>
              </div>
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
        <p key={p} className="mt-5">
          {p}
        </p>
      ))}
      {section.bullets && (
        <ul className="mt-5 space-y-3.5">
          {section.bullets.map((b) => (
            <li key={b} className="flex gap-3.5">
              <Bullet />
              <span className="min-w-0">{b}</span>
            </li>
          ))}
        </ul>
      )}
      {section.steps && (
        <ol className="mt-6 border-t border-border">
          {section.steps.map((step, i) => (
            <li key={step} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 border-b border-border py-4">
              <span className="font-serif text-lg leading-[1.5] tabular-nums text-muted-foreground">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      )}
      {section.then?.map((p) => (
        <p key={p} className="mt-5">
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
 *
 * Set as an article on one sheet of the lighter paper: a reading measure of
 * about 65 characters, a hairline between sections, the drawing and the ask
 * in the margin, and the sources as numbered references.
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

      <main id="main" className="flex-1 bg-paper pt-24">
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
              image: `${BUSINESS.url}/og-firm-foundation.jpg`,
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

        {/* ── The question, and the answer in full ──────────────────────
            Above the fold, so nothing here waits on JavaScript: the static
            HTML is the finished header. */}
        <section className="pb-12 pt-8 md:pb-16 md:pt-12">
          <div className="frame">
            <nav aria-label="Breadcrumb" className="mb-10">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <li>
                  <Link to="/" className="hover:text-foreground transition-colors">
                    Home
                  </Link>
                </li>
                <ChevronRight className="h-3 w-3" aria-hidden="true" />
                <li>
                  <Link to="/guides" className="hover:text-foreground transition-colors">
                    Guides
                  </Link>
                </li>
                <ChevronRight className="h-3 w-3" aria-hidden="true" />
                <li aria-current="page" className="text-foreground">
                  {guide.short}
                </li>
              </ol>
            </nav>

            {/* No mark over the question: the breadcrumb already places it, and
                the service it belongs to is linked at the foot of the page. */}
            <h1 className="max-w-[22ch] font-heading text-hero text-foreground text-balance">
              {guide.question}
            </h1>

            {/* The short answer, as a printed callout: a heavy rule over it, a
                hairline under it, the label in the margin on a desktop. It is
                the passage that gets quoted, so it is set to be read first. */}
            <div className="mt-10 grid max-w-[60rem] grid-cols-1 gap-3 border-b border-t-2 border-b-border border-t-foreground pb-7 pt-5 md:mt-14 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-8 md:pb-9 md:pt-6">
              <p className="eyebrow pt-1 text-foreground">The short answer</p>
              <p className="max-w-[44rem] text-lg leading-relaxed text-foreground md:text-[1.3125rem] md:leading-[1.6]">
                {guide.answer}
              </p>
            </div>

            <p className="mt-5 max-w-[60rem] text-sm text-muted-foreground md:pl-[13rem]">
              Rules checked <time dateTime={guide.checked}>{formatGuideDate(guide.checked)}</time> against
              the sources at the end of this page.
            </p>
          </div>
        </section>

        {/* ── The detail, with the drawing and the ask in the margin ─────
            The whole guide is one sheet of the lighter paper, so its sections
            paint no background of their own. This one runs straight on from
            the short answer, with no rule between them. */}
        <Section className="bg-transparent pt-4 md:pt-6">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
            <article className="min-w-0 max-w-[65ch] text-[1.0625rem] leading-[1.7] text-foreground/80 lg:col-span-7 [&>section+section]:mt-14 [&>section+section]:border-t [&>section+section]:border-border [&>section+section]:pt-12">
              {guide.sections.map((section, i) => (
                <GuideBlock key={i} section={section} />
              ))}

              <section>
                <h2 className={headingClass}>What Josiah looks at on a visit</h2>
                <p className="mt-5">{problem.visit}</p>
                <Link to={quoteHref} className={textLinkClass}>
                  Get a free quote for this
                  <LinkArrow />
                </Link>
              </section>

              {/* Sources as numbered references, the numerals in the serif. */}
              <section className="text-sm leading-relaxed">
                <h2 className="font-heading text-xl text-foreground md:text-[1.375rem]">Sources</h2>
                <ol role="list" className="mt-5 border-t border-border">
                  {guide.sources.map((source, i) => (
                    <li
                      key={source.label}
                      className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-2 border-b border-border py-3"
                    >
                      <span className="font-serif tabular-nums text-muted-foreground">{i + 1}</span>
                      <span className="min-w-0 break-words">
                        {source.url ? (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-foreground"
                          >
                            {source.label}
                          </a>
                        ) : (
                          source.label
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="mt-6 text-muted-foreground">
                  Checked {formatGuideDate(guide.checked)}. Rules change, so the town or agency named has the
                  final word. This page explains how the rules usually apply; it isn&rsquo;t legal advice.
                </p>
              </section>
            </article>

            <aside className="lg:sticky lg:top-28 lg:col-span-4 lg:col-start-9 lg:self-start">
              <ServicePlate
                plate={guide.plate}
                label={plateDescriptions[guide.plate]}
                className="rounded-[3px]"
              />
              {/* Desktop only: on a phone the sticky Call/Text/Quote bar and the
                  closing CTA already make this ask, two screens apart. Ruled
                  like the short answer, not boxed. */}
              <div className="mt-8 hidden border-t-2 border-foreground pt-5 lg:block">
                <p className="font-heading text-2xl leading-tight text-foreground">
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

        {/* ── Where to go next ─────────────────────────────────────────────
            A plain heading beside the list, and the service this question
            belongs to under it. The section's hairline is the only rule
            between the article and this. */}
        <Section variant="cream" className="bg-transparent">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <h2 className="font-heading text-[1.75rem] leading-none text-foreground text-balance md:text-[2.25rem]">
                Other questions
              </h2>
              <Link
                to={`/services/${service.slug}`}
                className="group mt-5 inline-flex flex-wrap items-baseline gap-x-2.5 gap-y-1 text-foreground"
              >
                <span className="text-sm text-muted-foreground">The service</span>
                <span className="font-heading text-2xl underline decoration-foreground/25 decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-foreground">
                  {service.title}
                </span>
                <ArrowRight
                  className="h-4 w-4 self-center text-muted-foreground transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
            <ul className="border-t border-border lg:col-span-8">
              {others.map((other) => (
                <li key={other.slug} className="border-b border-border">
                  <GuideCard guide={other} />
                </li>
              ))}
            </ul>
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

export default GuidePage;
