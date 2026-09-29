import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import FadeInView from "@/components/animations/FadeInView";
import ServiceImage from "@/components/ServiceImage";
import FaqList from "@/components/FaqList";
import SEO from "@/components/SEO";
import CtaSection from "@/components/CtaSection";
import { coreServices, moreServices, services } from "@/data/services";
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
 * Two tiers, as Josiah asked (2026-09-29): the five core services in full, and
 * the smaller work he still takes on in one compact row underneath — present
 * and findable, never leading.
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
        <section className="px-5 sm:px-6 md:px-10 py-16 md:py-24">
          <div className="mx-auto max-w-content">
            <FadeInView immediate>
              <p className="eyebrow text-primary mb-6">What We Do</p>
              <h1 className="text-hero md:text-display font-heading max-w-4xl">
                Land clearing
                <br />
                <span className="text-primary">&amp; excavation</span>
              </h1>
              <p className="text-subtitle text-muted-foreground mt-8 max-w-xl leading-relaxed">
                Five kinds of ground work, usually more than one on the same job,
                for properties across Mount Pleasant and the Lowcountry.
              </p>
            </FadeInView>
          </div>
        </section>

        {/* Core services, in full */}
        <Section className="pt-0">
          <div className="space-y-16 md:space-y-28">
            {coreServices.map((service, index) => {
              const visualLeft = index % 2 === 0;
              return (
                <article
                  key={service.slug}
                  id={service.slug}
                  className="grid grid-cols-1 items-center gap-8 scroll-mt-28 md:grid-cols-2 md:gap-14"
                >
                  <FadeInView className={visualLeft ? "" : "md:order-2"}>
                    <ServiceImage service={service} eager={index === 0} number={index + 1} />
                  </FadeInView>

                  <FadeInView delay={0.12} className={visualLeft ? "" : "md:order-1"}>
                    <span className="eyebrow text-primary block mb-4">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-title font-heading mb-6">{service.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{service.description1}</p>
                    <ul className="mt-7 flex flex-wrap gap-2">
                      {service.items.map((item) => (
                        <li
                          key={item.label}
                          className="rounded-full border border-border px-3.5 py-1.5 text-xs text-foreground/80"
                        >
                          {item.label}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-9 flex flex-wrap gap-3">
                      {/* Allowed to wrap: "More on pool & pond excavation" is wider
                          than a 320px phone on one line. */}
                      <Button asChild className="h-auto min-h-11 whitespace-normal py-3 text-center">
                        <Link to={`/services/${service.slug}`}>
                          More on {service.title.toLowerCase()}
                        </Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link to={`/contact?service=${service.slug}`}>Get a quote</Link>
                      </Button>
                    </div>
                  </FadeInView>
                </article>
              );
            })}
          </div>
        </Section>

        {/* The smaller tier */}
        <Section variant="muted">
          <SectionHeader
            eyebrow="Smaller jobs, still on request"
            title="And the finish"
            accent="on top"
            subtitle="Patios, beds and one-off builds. Mostly taken on alongside bigger ground work, where the dirt underneath is already ours."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
            {moreServices.map((service, i) => (
              <FadeInView key={service.slug} delay={i * 0.06} className="h-full">
                <Link
                  to={`/services/${service.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors duration-500 hover:border-primary/60"
                >
                  <ServiceImage
                    service={service}
                    aspect="aspect-[16/10]"
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="rounded-none"
                  />
                  <div className="flex flex-1 items-start justify-between gap-4 p-5 md:p-6">
                    <div>
                      <h3 className="font-heading text-xl font-extralight text-card-foreground md:text-2xl">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {service.navBlurb}
                      </p>
                    </div>
                    <ArrowUpRight
                      className="mt-1 h-5 w-5 shrink-0 text-primary transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              </FadeInView>
            ))}
          </div>
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
