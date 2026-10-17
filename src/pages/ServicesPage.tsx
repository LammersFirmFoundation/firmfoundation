import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import FadeInView from "@/components/animations/FadeInView";
import ServicesBento from "@/components/ServicesBento";
import FaqList from "@/components/FaqList";
import SEO from "@/components/SEO";
import CtaSection from "@/components/CtaSection";
import { services } from "@/data/services";
import { ACCEPTS_SMS, BUSINESS, areaServedSchema, serviceAreaNames } from "@/data/business";
import { businessRef, breadcrumbSchema } from "@/lib/schema";

const faqs = [
  {
    question: "What does Firm Foundation do?",
    answer: `Landscaping, hardscapes and the dirt work under them: new beds, planting and sod, patios, walkways and retaining walls, grading and site prep, pool and pond prep, and land clearing, across Mount Pleasant and greater Charleston. Tree and stump removal, drainage, forestry mulching and one-off builds too. Most jobs are more than one of these.`,
  },
  {
    question: "Can you do the whole job, from the dirt work to the planting?",
    answer:
      "Yes, and that is usually the better way to do it. A patio, a new bed or a fresh lawn is only as good as the ground under it, so the same crew that clears, grades and compacts the base is the one that lays the stone or sets the plants. Nothing gets handed off halfway, and nobody blames the last trade when something settles.",
  },
  {
    question: "Can you fix standing water in my yard?",
    answer:
      "Usually. Standing water in the Lowcountry is normally a grading problem, a drainage problem, or a high water table, sometimes all three. We walk the property, look at where water actually goes, and tell you honestly what regrading or drainage will and won't solve before you spend anything.",
  },
  {
    question: "What areas do you serve?",
    answer: `The greater Charleston area, including ${serviceAreaNames
      .slice(0, -1)
      .join(", ")}, and ${serviceAreaNames[serviceAreaNames.length - 1]}.`,
  },
  {
    question: "How do I get a quote?",
    answer: `Quotes are free and on-site. ${
      ACCEPTS_SMS ? `Call or text ${BUSINESS.phone}` : `Call ${BUSINESS.phone}`
    }, or send the details through the quote form, and Josiah will set a time to walk the property with you.`,
  },
];

/**
 * The services hub. Its title is deliberately broad: each service has its own
 * page to own its terms, and a hub that led on one of them would compete with
 * its own child page.
 *
 * Two tiers: the five services on Josiah's own flyer and business card lead
 * (2026-10-17), and the rest of the work he takes on sits in one tile, present
 * and findable.
 */
const ServicesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main" className="flex-1 pt-24">
        <SEO
          title="Our Services, Mount Pleasant & Charleston SC | Firm Foundation"
          description="Landscaping, hardscapes, excavation and grading, pool and pond prep, and land clearing for homes across Mount Pleasant and greater Charleston, SC."
          canonical="/services"
          keywords="landscaping Mount Pleasant SC, hardscapes Charleston SC, paver patio, retaining wall, sod installation, excavation Mount Pleasant SC, grading, pool excavation, land clearing, stump removal, drainage, forestry mulching"
          jsonLd={[
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Landscaping, Hardscape & Excavation Services",
              itemListElement: services.map((service, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Service",
                  name: service.title,
                  serviceType: service.title,
                  url: `${BUSINESS.url}/services/${service.slug}`,
                  description: service.description1,
                  provider: businessRef,
                  areaServed: areaServedSchema,
                },
              })),
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            },
            breadcrumbSchema("Services", "/services"),
          ]}
        />

        {/* Page header */}
        <section className="px-5 sm:px-6 md:px-10 py-14 md:py-20">
          <div className="mx-auto max-w-content">
            <FadeInView immediate>
              <p className="eyebrow text-primary mb-6">What We Do</p>
              <h1 className="text-hero md:text-display font-heading max-w-4xl">
                From the ground
                <br />
                <span className="text-highlight">up</span>
              </h1>
              <p className="text-subtitle text-muted-foreground mt-8 max-w-xl leading-relaxed">
                Landscaping, hardscapes and the dirt work under them. Most jobs
                are more than one of these, done by the same crew.
              </p>
            </FadeInView>
          </div>
        </section>

        {/* The same grid as the homepage: one way of showing the services,
            everywhere. Each service has its own page for the long version. */}
        <Section className="pt-0">
          {/* The cards are h3s; the page needs an h2 above them for a sane outline. */}
          <h2 className="sr-only">All services</h2>
          <ServicesBento />
        </Section>

        {/* FAQ */}
        <Section variant="cream">
          <SectionHeader
            eyebrow="Questions"
            title="Frequently"
            accent="asked"
            subtitle="Quick answers about the work and where we do it."
          />
          <FaqList items={faqs.map((faq) => ({ question: faq.question, answer: <p>{faq.answer}</p> }))} />
        </Section>

        <CtaSection
          title="Tell us about"
          accent="the yard"
          blurb="What you're dealing with, and what you want it to be. We'll come look."
        />
      </main>

      <Footer />
    </div>
  );
};

export default ServicesPage;
