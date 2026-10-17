import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
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
 * (2026-10-17), and the rest of the work he takes on follows as a ruled list,
 * present and findable.
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

        {/* Page header: Josiah's own line from his flyer, with what it covers
            set under it like the line under a slogan, rather than beside it
            the way the section openings used to repeat. No mark: "What we do"
            only restated the page. Pure CSS rise (.hero-line, .hero-rise), so
            the prerendered HTML is already the finished header: a JS reveal
            would bake opacity:0 into the first screen. */}
        <section className="pb-12 pt-6 md:pb-16 md:pt-16">
          <div className="frame">
            <h1 className="font-heading text-hero text-foreground text-balance">
              <span className="hero-line">
                <span style={{ animationDelay: "40ms" }}>Dirt work done right.</span>
              </span>
            </h1>
            <p
              className="mt-6 max-w-xl text-subtitle leading-relaxed text-muted-foreground hero-rise md:mt-7"
              style={{ animationDelay: "160ms" }}
            >
              Landscaping, hardscapes and the dirt work under them. Most jobs
              are more than one of these, done by the same crew.
            </p>
          </div>
        </section>

        {/* Every service on one sheet. Each has its own page for the long
            version; the homepage sets the same list as type. */}
        <Section className="pt-0 md:pt-0">
          {/* The cards are h3s; the page needs an h2 above them for a sane outline. */}
          <h2 className="sr-only">All services</h2>
          <ServicesBento />
        </Section>

        {/* FAQ: a plain heading set beside the questions, no mark and no
            subtitle. The rule above the section does the dividing. */}
        <Section variant="cream">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <h2 className="font-heading text-title text-foreground text-balance lg:sticky lg:top-28">
                Questions people ask
              </h2>
            </div>
            <FaqList
              className="min-w-0 lg:col-span-8"
              items={faqs.map((faq) => ({ question: faq.question, answer: <p>{faq.answer}</p> }))}
            />
          </div>
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
