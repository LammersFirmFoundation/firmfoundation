import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import GuideCard from "@/components/GuideCard";
import SEO from "@/components/SEO";
import CtaSection from "@/components/CtaSection";
import { guides } from "@/data/guides";
import { BUSINESS } from "@/data/business";
import { breadcrumbSchema } from "@/lib/schema";

/**
 * `/guides`: the questions people ask before they call, each with its own
 * page. The short answers are printed here in full, so this page is useful on
 * its own and every guide is one link from the footer of every page.
 */
const GuidesPage = () => (
  <div className="min-h-screen flex flex-col">
    <Header />

    <main id="main" className="flex-1 pt-24">
      <SEO
        title="Guides: Land, Trees & Drainage in Mount Pleasant | Firm Foundation"
        description="Straight answers to the questions people ask before clearing, digging or draining in Mount Pleasant and greater Charleston, SC, with the local rules and their sources."
        canonical="/guides"
        keywords="Mount Pleasant tree permit, clearing a lot Mount Pleasant, yard drainage Charleston SC, pool excavation, stump grinding vs removal"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Guides",
            itemListElement: guides.map((guide, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: guide.question,
              url: `${BUSINESS.url}/guides/${guide.slug}`,
            })),
          },
          breadcrumbSchema("Guides", "/guides"),
        ]}
      />

      {/* ── Page header ───────────────────────────────────────────────────
          Pure CSS entrance (above the fold), lede set beside the title. */}
      <section className="px-5 pb-12 pt-10 sm:px-6 md:px-10 md:pb-16 md:pt-16">
        <div className="mx-auto grid max-w-content grid-cols-1 gap-7 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-8">
            <p className="mark mb-6 hero-rise">Guides</p>
            <h1 className="text-hero font-heading text-foreground text-balance">
              <span className="hero-line">
                <span style={{ animationDelay: "40ms" }}>Straight answers before you call</span>
              </span>
            </h1>
          </div>
          <p
            className="hero-rise max-w-md text-subtitle leading-relaxed text-muted-foreground lg:col-span-4 lg:pb-2"
            style={{ animationDelay: "160ms" }}
          >
            Answered with the local rules, and where each rule comes from.
          </p>
        </div>
      </section>

      {/* ── The contents ──────────────────────────────────────────────────
          A ruled list, numbered like the services index on the homepage, with
          each short answer printed in full beside its question. No scroll
          reveal: on a desktop the first rows sit above the fold, and
          FadeInView's opacity:0 start state is baked into the static HTML. */}
      <Section className="pt-0 md:pt-0">
        <h2 className="sr-only">All guides</h2>
        <ol className="border-t border-border">
          {guides.map((guide, index) => (
            <li key={guide.slug} className="border-b border-border">
              <GuideCard guide={guide} index={index} showAnswer />
            </li>
          ))}
        </ol>
      </Section>

      <CtaSection
        title="Not covered"
        accent="here?"
        blurb="Josiah can tell a lot from a photo of the ground, and the walk-through is free. Straight answers either way."
      />
    </main>

    <Footer />
  </div>
);

export default GuidesPage;
