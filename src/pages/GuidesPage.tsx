import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import FadeInView from "@/components/animations/FadeInView";
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

      <section className="px-5 sm:px-6 md:px-10 py-14 md:py-20">
        <div className="mx-auto max-w-content">
          <FadeInView immediate>
            <p className="eyebrow text-primary mb-6">Guides</p>
            <h1 className="text-hero md:text-display font-heading max-w-4xl">
              Straight answers
              <br />
              <span className="text-primary">before you call</span>
            </h1>
            <p className="text-subtitle text-muted-foreground mt-8 max-w-xl leading-relaxed">
              Answered with the local rules, and where each rule comes from.
            </p>
          </FadeInView>
        </div>
      </section>

      <Section className="pt-0">
        <h2 className="sr-only">All guides</h2>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* No scroll reveal: on a desktop the first cards sit above the fold,
              and FadeInView's opacity:0 start state is baked into the static HTML. */}
          {guides.map((guide) => (
            <li key={guide.slug}>
              <GuideCard guide={guide} showAnswer />
            </li>
          ))}
        </ul>
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
