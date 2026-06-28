import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import FadeInView from "@/components/animations/FadeInView";
import SEO from "@/components/SEO";
import hardscapes from "@/assets/services/hardscapes.jpg";
import landscaping from "@/assets/services/landscaping.jpg";
import treeServices from "@/assets/services/tree-services.jpg";
import carpentry from "@/assets/services/carpentry.jpg";

const services = [
  {
    title: "Hardscapes",
    image: hardscapes,
    alt: "Professional hardscape paver installation",
    description1:
      "From patios and walkways to retaining walls and outdoor living spaces, Firm Foundation delivers durable, beautifully crafted hardscape installations designed to enhance your property's curb appeal and functionality.",
    description2:
      "We work with a variety of materials — including pavers, natural stone, and concrete — to create outdoor spaces that stand the test of time in the Lowcountry climate.",
    items: [
      { label: "Paver Patios", detail: "Custom-designed patios built for durability and style" },
      { label: "Stone Walkways", detail: "Decorative walkways using natural stone and pavers" },
      { label: "Retaining Walls", detail: "Sturdy walls for erosion control and elevated landscapes" },
      { label: "Outdoor Living Spaces", detail: "Complete backyard transformations and hardscape design" },
      { label: "Custom Stone Work", detail: "Tailored installations using premium materials" },
    ],
  },
  {
    title: "Landscaping",
    image: landscaping,
    alt: "Professional landscaping service",
    description1:
      "Create and preserve beautiful outdoor spaces that enhance your property's value and curb appeal. Our landscaping services are tailored to the Lowcountry climate.",
    description2:
      "From seasonal plantings to full bed maintenance, we handle all aspects of landscape care to keep your property looking its best.",
    items: [
      { label: "Mulching & Bed Maintenance", detail: "Fresh mulch installation, bed edging, and weed control" },
      { label: "Seasonal Planting", detail: "Color rotation, annual installation, and design consultation" },
      { label: "Irrigation Management", detail: "System checks, adjustments, and minor repairs" },
      { label: "Shrub & Tree Care", detail: "Pruning, shaping, and health monitoring" },
      { label: "Debris Removal", detail: "Leaf cleanup, branch removal, and storm cleanup" },
    ],
  },
  {
    title: "Tree Services",
    image: treeServices,
    alt: "Professional arborist trimming a live oak tree",
    description1:
      "Keep your trees healthy, safe, and beautiful with professional tree care tailored to the Lowcountry's live oaks, palms, and coastal canopy. From routine pruning to full removals, our team works safely and cleans up thoroughly.",
    description2:
      "Storm season is a reality on the coast — we help you stay ahead of it with proactive trimming, hazard removal, and hurricane preparation that protects your home and property.",
    items: [
      { label: "Tree Trimming & Pruning", detail: "Shaping, deadwood removal, and canopy thinning for healthy growth" },
      { label: "Tree Removal", detail: "Safe removal of hazardous, damaged, or unwanted trees" },
      { label: "Stump Grinding", detail: "Grind down stumps to reclaim your yard and prevent regrowth" },
      { label: "Storm & Hurricane Prep", detail: "Proactive trimming and hazard reduction ahead of storm season" },
      { label: "Limb & Debris Cleanup", detail: "Fallen branch removal and full cleanup after every job" },
    ],
  },
  {
    title: "Custom Projects",
    image: carpentry,
    alt: "Custom outdoor carpentry and project work",
    description1:
      "From deck repairs and fence work to pergolas and custom outdoor builds, we handle the projects that protect your investment and enhance your outdoor living space.",
    description2:
      "Our team works with a variety of wood and composite materials, delivering quality craftsmanship built for the Lowcountry climate.",
    items: [
      { label: "Deck Repair & Restoration", detail: "Replace damaged boards, reinforce framing, and refinish surfaces" },
      { label: "Fence Repair & Replacement", detail: "Fix leaning posts, replace broken pickets, and install new sections" },
      { label: "Pergolas & Arbors", detail: "Build or repair outdoor shade structures" },
      { label: "Gate Repair & Installation", detail: "Fix sagging gates or install new ones" },
      { label: "Custom Outdoor Builds", detail: "Tailored woodwork and projects for your property" },
    ],
  },
];

const faqs = [
  {
    question: "What services does Firm Foundation Property Services offer?",
    answer:
      "We offer four core services: hardscapes (paver patios, stone walkways, and retaining walls), landscaping and bed maintenance, tree services (trimming, removal, stump grinding, and storm prep), and custom outdoor projects such as decks, fences, and pergolas.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We proudly serve Mount Pleasant, Isle of Palms, Sullivan's Island, Dunes West, and Park West in South Carolina's Lowcountry.",
  },
  {
    question: "Do you handle tree removal and storm preparation?",
    answer:
      "Yes. Our tree services include trimming and pruning, tree removal, stump grinding, and proactive storm and hurricane preparation tailored to the Lowcountry's live oaks and palms.",
  },
  {
    question: "How do I get a quote?",
    answer:
      "Getting a quote is free. Call us at (843) 998-5593 or send a message through our contact page, and we'll get back to you as soon as possible.",
  },
];

const ServicesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-[72px]">
        <SEO
          title="Services – Hardscapes, Landscaping, Tree Services & More"
          description="Professional hardscapes, landscaping, tree services, and custom project services in Mount Pleasant, SC. Free quotes available."
          canonical="/services"
          keywords="hardscapes Mount Pleasant, landscaping Mount Pleasant SC, tree services, tree trimming, tree removal, custom projects, property services"
          jsonLd={[
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: services.map((service, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Service",
                  name: service.title,
                  description: service.description1,
                  provider: {
                    "@type": "LocalBusiness",
                    name: "Firm Foundation Property Services",
                    telephone: "(843) 998-5593",
                    url: "https://firmfoundationsc.com",
                  },
                  areaServed: [
                    { "@type": "City", name: "Mount Pleasant", addressRegion: "SC" },
                    { "@type": "City", name: "Isle of Palms", addressRegion: "SC" },
                    { "@type": "City", name: "Sullivan's Island", addressRegion: "SC" },
                    { "@type": "City", name: "Dunes West", addressRegion: "SC" },
                    { "@type": "City", name: "Park West", addressRegion: "SC" },
                  ],
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
          ]}
        />

        {/* Page Header */}
        <section className="py-20 md:py-28 px-4">
          <div className="container mx-auto max-w-content text-center">
            <FadeInView>
              <h1 className="text-hero md:text-display font-bold text-foreground tracking-tight font-heading mb-4">
                Our Services
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Professional property services for homeowners across Mount Pleasant
              </p>
            </FadeInView>
          </div>
        </section>

        {/* Services — Alternating Layout */}
        <Section>
          <div className="space-y-32">
            {services.map((service, index) => {
              const imageLeft = index % 2 === 0;
              return (
                <div
                  key={service.title}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start"
                >
                  <FadeInView
                    direction={imageLeft ? "left" : "right"}
                    className={imageLeft ? "" : "md:order-2"}
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.alt}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </FadeInView>

                  <FadeInView
                    direction={imageLeft ? "right" : "left"}
                    delay={0.15}
                    className={imageLeft ? "" : "md:order-1"}
                  >
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading">
                      {service.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {service.description1}
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {service.description2}
                    </p>
                    <ul className="space-y-3">
                      {service.items.map((item) => (
                        <li key={item.label} className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{item.label}:</span>{" "}
                          {item.detail}
                        </li>
                      ))}
                    </ul>
                  </FadeInView>
                </div>
              );
            })}
          </div>
        </Section>

        {/* FAQ */}
        <Section variant="muted">
          <SectionHeader
            title="Frequently Asked Questions"
            subtitle="Quick answers about our services and service area"
          />
          <div className="max-w-3xl mx-auto space-y-5">
            {faqs.map((faq) => (
              <FadeInView key={faq.question}>
                <div className="border border-border rounded-lg p-6 bg-background">
                  <h3 className="font-semibold text-foreground mb-2 font-heading">
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

        {/* CTA Section */}
        <Section variant="dark" className="text-center bg-gradient-to-b from-[hsl(210,50%,22%)] to-[hsl(220,20%,10%)]">
          <FadeInView>
            <h2 className="text-hero md:text-display font-bold text-background mb-6 font-heading leading-tight">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-background/70 mb-10 max-w-2xl mx-auto">
              Contact us today for a free quote on any of our services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 text-lg px-10 py-6 h-auto"
              >
                <a href="tel:8439985593">Call (843) 998-5593</a>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-transparent border-2 border-background/40 text-background hover:bg-background/10 text-lg px-10 py-6 h-auto"
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </FadeInView>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default ServicesPage;
