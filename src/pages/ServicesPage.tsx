import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import FadeInView from "@/components/animations/FadeInView";
import ServiceImage from "@/components/ServiceImage";
import SEO from "@/components/SEO";
import CtaSection from "@/components/CtaSection";
import { services } from "@/data/services";
import { BUSINESS, areaServedSchema, serviceAreaNames } from "@/data/business";
import { businessRef, breadcrumbSchema } from "@/lib/schema";

const faqs = [
  {
    question: "What services does Firm Foundation Property Services offer?",
    answer:
      "Five: excavation (grading, drainage, irrigation trenching, clearing, and driveway prep), hardscapes (paver patios, stone walkways, retaining walls), landscaping and bed maintenance, tree services (trimming, removal, stump grinding, and storm prep), and custom projects inside and out — cabinetry and built-ins, tile and backsplash, decks, fences, and pergolas.",
  },
  {
    question: "Do you do excavation and grading work?",
    answer:
      "Yes — it's the direction the business is heading. We handle small residential excavation: regrading yards and low spots, drainage and French drains, irrigation trenching and repair, brush and lot clearing, gravel driveway and pad prep, ditch and culvert cleanout, and haul-off. We locate utilities through SC811 before any digging begins.",
  },
  {
    question: "Can you fix standing water in my yard?",
    answer:
      "Usually. Standing water in the Lowcountry is normally a grading problem, a drainage problem, or a high water table — sometimes all three. We walk the property, look at where water actually goes, and tell you honestly what regrading or drainage will and won't solve before you spend anything.",
  },
  {
    question: "What areas do you serve?",
    answer: `We serve the greater Charleston area, including ${serviceAreaNames
      .slice(0, -1)
      .join(", ")}, and ${serviceAreaNames[serviceAreaNames.length - 1]}.`,
  },
  {
    question: "How do I get a quote?",
    answer: `Quotes are free and on-site. Call ${BUSINESS.phone} or send a message through our contact page and we'll get back to you as soon as we can.`,
  },
];

const ServicesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main" className="flex-1 pt-24">
        <SEO
          title="Excavation, Hardscapes &amp; More | Firm Foundation"
          description="Excavation, hardscapes, landscaping, tree services, and custom projects for homes across Mount Pleasant and greater Charleston, SC. See all five services."
          canonical="/services"
          keywords="excavation Mount Pleasant SC, yard grading, French drain installation, yard drainage, land clearing Charleston SC, irrigation trenching, driveway grading, hardscapes, landscaping, tree services, custom cabinetry, tile backsplash"
          jsonLd={[
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Property Services",
              itemListElement: services.map((service, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Service",
                  name: service.title,
                  serviceType: service.title,
                  url: `${BUSINESS.url}/services#${service.slug}`,
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
        <section className="px-5 sm:px-6 md:px-10 py-16 md:py-24">
          <div className="mx-auto max-w-content">
            <FadeInView>
              <p className="eyebrow text-primary mb-6">What We Do</p>
              <h1 className="text-hero md:text-display font-heading max-w-4xl">
                Excavation, landscaping,
                <br />
                <span className="text-primary">done properly</span>
              </h1>
              <p className="text-subtitle text-muted-foreground mt-8 max-w-xl leading-relaxed">
                Small excavation and dirt work first, plus everything else we do
                for homes across Mount Pleasant, Charleston, and the Lowcountry.
              </p>
            </FadeInView>
          </div>
        </section>

        {/* Services */}
        <Section className="pt-0">
          <div className="space-y-16 md:space-y-24">
            {services.map((service, index) => {
              const imageLeft = index % 2 === 0;
              return (
                <article
                  key={service.slug}
                  id={service.slug}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-start scroll-mt-28"
                >
                  <FadeInView
                    direction={imageLeft ? "left" : "right"}
                    className={imageLeft ? "" : "md:order-2"}
                  >
                    <ServiceImage service={service} eager={index === 0} />
                  </FadeInView>

                  <FadeInView
                    direction={imageLeft ? "right" : "left"}
                    delay={0.15}
                    className={imageLeft ? "" : "md:order-1"}
                  >
                    <span className="eyebrow text-primary block mb-4">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-title font-heading mb-6">{service.title}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-5">
                      {service.description1}
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-10">
                      {service.description2}
                    </p>
                    <ul className="divide-y divide-border border-t border-border">
                      {service.items.map((item) => (
                        <li key={item.label} className="py-4">
                          <span className="eyebrow text-foreground block mb-1.5">
                            {item.label}
                          </span>
                          <span className="text-sm text-muted-foreground leading-relaxed">
                            {item.detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </FadeInView>
                </article>
              );
            })}
          </div>
        </Section>

        {/* FAQ */}
        <Section variant="muted">
          <SectionHeader
            eyebrow="Questions"
            title="Frequently"
            accent="asked"
            subtitle="Quick answers about our work and our service area."
          />
          <div className="max-w-narrow mx-auto divide-y divide-border border-y border-border">
            {faqs.map((faq) => (
              <FadeInView key={faq.question}>
                <div className="py-6">
                  <h3 className="font-heading text-xl md:text-2xl text-foreground mb-2.5">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </FadeInView>
            ))}
          </div>
        </Section>

        <CtaSection
          title="Ready to"
          accent="get started?"
          blurb="Tell us what you’re dealing with and we’ll come look at it."
        />
      </main>

      <Footer />
    </div>
  );
};

export default ServicesPage;
