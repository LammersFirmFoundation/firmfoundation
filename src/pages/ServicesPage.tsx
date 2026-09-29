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
    answer: `Land clearing and excavation: lot and underbrush clearing, tree and stump removal, grading and site prep, pool and pond digs, and drainage, across Mount Pleasant and greater Charleston. Smaller hardscape, landscaping and custom jobs are still taken on by request, usually alongside bigger ground work.`,
  },
  {
    question: "Can you clear a lot and keep the good trees?",
    answer:
      "Yes, and on most wooded Lowcountry lots that is the better job. Selective clearing takes out the brush, vines and scrub trees and leaves the oaks and pines you choose, with the machine kept off their roots. Big trees are worth checking with the town before anything comes down: Mount Pleasant protects most trees 16 inches and up on a single-family lot.",
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
 * The services hub. Its title is deliberately broad: `/services/land-clearing`
 * and `/services/excavation` exist to own those terms, and a hub that led on
 * one of them would compete with its own child page.
 *
 * Two tiers, as Josiah asked (2026-09-29): the five core services lead, and
 * the smaller work he still takes on sits in one tile — present and findable,
 * never leading.
 */
const ServicesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main" className="flex-1 pt-24">
        <SEO
          title="Our Services, Mount Pleasant & Charleston SC | Firm Foundation"
          description="Land clearing, tree and stump removal, grading and site prep, pool and pond excavation, and drainage for properties across Mount Pleasant and greater Charleston, SC."
          canonical="/services"
          keywords="land clearing Charleston SC, excavation Mount Pleasant SC, lot clearing, stump removal, grading, site prep, pool excavation, pond digging, French drains, yard drainage"
          jsonLd={[
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Land Clearing & Excavation Services",
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
                Land clearing
                <br />
                <span className="text-primary">&amp; excavation</span>
              </h1>
              <p className="text-subtitle text-muted-foreground mt-8 max-w-xl leading-relaxed">
                Five kinds of ground work, often more than one on the same job.
              </p>
            </FadeInView>
          </div>
        </section>

        {/* The same grid as the homepage: one way of showing the services,
            everywhere. This page used to run five long alternating rows plus a
            second section for the smaller jobs; each service already has its
            own page for the long version. */}
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
          accent="the ground"
          blurb="What you're dealing with, and what you want it to be. We'll come look."
        />
      </main>

      <Footer />
    </div>
  );
};

export default ServicesPage;
