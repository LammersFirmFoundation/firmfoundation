import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import FadeInView from "@/components/animations/FadeInView";
import SEO from "@/components/SEO";
import pressureWashing from "@/assets/services/pressure-washing.jpg";
import landscaping from "@/assets/services/landscaping.jpg";
import windowWashing from "@/assets/services/window-washing.jpg";
import carpentry from "@/assets/services/carpentry.jpg";

const services = [
  {
    title: "Pressure Washing",
    image: pressureWashing,
    alt: "Professional pressure washing service on residential driveway",
    description1:
      "Transform your property's appearance with our professional pressure washing services. Using state-of-the-art equipment and eco-friendly cleaning solutions, we safely remove years of dirt, grime, mold, and mildew from all exterior surfaces.",
    description2:
      "Whether it's your driveway showing oil stains, siding covered in algae, or a deck that's lost its luster, our pressure washing service restores surfaces to their original beauty.",
    items: [
      { label: "Driveways & Walkways", detail: "Remove oil stains, tire marks, and embedded dirt" },
      { label: "House Washing & Siding", detail: "Gentle soft-washing for vinyl, brick, stucco, and wood" },
      { label: "Decks & Patios", detail: "Restore wood and composite materials to like-new condition" },
      { label: "Fences", detail: "Brighten and preserve wood, vinyl, and metal fencing" },
      { label: "Pool Areas", detail: "Clean concrete, pavers, and surrounding surfaces" },
      { label: "Gutters & Downspouts", detail: "Remove exterior buildup and staining" },
      { label: "Gutter Cleaning & Debris Removal", detail: "Clear gutters and downspouts to prevent water damage and overflow" },
    ],
  },
  {
    title: "Landscaping",
    image: landscaping,
    alt: "Professional landscaping and lawn maintenance service",
    description1:
      "Maintain a pristine outdoor environment year-round with our comprehensive landscaping services. We go beyond basic lawn care to create and preserve beautiful outdoor spaces that enhance your property's value and curb appeal.",
    description2:
      "From weekly maintenance to seasonal transformations, we handle all aspects of landscape care. Our services are customizable to meet your specific needs and budget.",
    items: [
      { label: "Weekly Lawn Maintenance", detail: "Mowing, edging, trimming, and blowing" },
      { label: "Mulching & Bed Maintenance", detail: "Fresh mulch installation, bed edging, and weed control" },
      { label: "Seasonal Planting", detail: "Color rotation, annual installation, and design consultation" },
      { label: "Irrigation Management", detail: "System checks, adjustments, and minor repairs" },
      { label: "Shrub & Tree Care", detail: "Pruning, shaping, and health monitoring" },
      { label: "Debris Removal", detail: "Leaf cleanup, branch removal, and storm cleanup" },
    ],
  },
  {
    title: "Window Washing",
    image: windowWashing,
    alt: "Professional window cleaning service on residential property",
    description1:
      "Experience crystal-clear views with our professional window washing services. Clean windows allow more natural light into your home and can extend the life of your windows by preventing buildup of corrosive materials.",
    description2:
      "Our window cleaning process is thorough and efficient. We clean both interior and exterior surfaces, pay special attention to frames and sills, and ensure screens are cleaned or replaced as needed.",
    items: [
      { label: "Interior & Exterior Cleaning", detail: "Both sides cleaned to perfection" },
      { label: "Screen Cleaning & Repair", detail: "Screens cleaned, repaired, or replaced" },
      { label: "Track & Sill Detailing", detail: "Remove buildup from frames and tracks" },
      { label: "High Window Access", detail: "Safe cleaning of second and third-story windows" },
      { label: "Hard Water Stain Removal", detail: "Treatment for mineral deposits and staining" },
      { label: "Sliding Door Cleaning", detail: "Complete cleaning of glass doors and tracks" },
    ],
  },
  {
    title: "Carpentry",
    image: carpentry,
    alt: "Professional carpentry and deck repair service",
    description1:
      "Keep your outdoor structures safe, functional, and beautiful with our professional carpentry services. From worn deck boards to leaning fence posts, we handle the repairs and small builds that protect your investment.",
    description2:
      "Our skilled carpenters work with a variety of wood and composite materials, ensuring quality craftsmanship that stands up to the Lowcountry climate.",
    items: [
      { label: "Deck Repair & Restoration", detail: "Replace damaged boards, reinforce framing, and refinish surfaces" },
      { label: "Fence Repair & Replacement", detail: "Fix leaning posts, replace broken pickets, and install new sections" },
      { label: "Railing & Step Repairs", detail: "Tighten, rebuild, or replace railings and stairs for safety" },
      { label: "Pergolas & Arbors", detail: "Build or repair outdoor shade structures" },
      { label: "Gate Repair & Installation", detail: "Fix sagging gates or install new ones" },
      { label: "Custom Outdoor Builds", detail: "Small-scale custom woodwork tailored to your property" },
    ],
  },
];

const ServicesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-[72px]">
        <SEO
          title="Services – Pressure Washing, Landscaping & More"
          description="Professional pressure washing, landscaping, window washing, and carpentry services in Mount Pleasant, SC. Free quotes available."
          canonical="/services"
          keywords="pressure washing Mount Pleasant, landscaping Mount Pleasant SC, window washing, carpentry, property maintenance services"
          jsonLd={{
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
                  name: "Firm Foundation Property Maintenance",
                  telephone: "(419) 419-8082",
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
          }}
        />

        {/* Page Header */}
        <section className="py-20 md:py-28 px-4">
          <div className="container mx-auto max-w-content text-center">
            <FadeInView>
              <h1 className="text-hero md:text-display font-bold text-foreground tracking-tight font-heading mb-4">
                Our Services
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Professional property maintenance for Mount Pleasant's finest homes
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
                <a href="tel:4194198082">Call (419) 419-8082</a>
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
