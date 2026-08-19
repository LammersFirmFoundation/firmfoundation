import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import FadeInView from "@/components/animations/FadeInView";
import SEO from "@/components/SEO";
import CtaSection from "@/components/CtaSection";
import { BUSINESS } from "@/data/business";
import { businessRef, breadcrumbSchema } from "@/lib/schema";
import landscapingWalkway from "@/assets/gallery/landscaping-walkway-mount-pleasant.jpg";
import landscapingBed from "@/assets/gallery/landscaping-bed-mount-pleasant.jpg";
import customPantry from "@/assets/gallery/custom-pantry-mount-pleasant.jpg";

const projects = [
  {
    title: "Front Walkway & Lawn Renovation",
    category: "Landscaping",
    location: "Mount Pleasant, SC",
    image: landscapingWalkway,
    alt: "Before and after: bare mulch bed transformed into a flagstone walkway with fresh sod, Mount Pleasant SC",
  },
  {
    title: "Planting Bed Installation",
    category: "Landscaping",
    location: "Mount Pleasant, SC",
    image: landscapingBed,
    alt: "Before and after: overgrown front yard transformed with fresh mulch beds and plantings, Mount Pleasant SC",
  },
  {
    title: "Butler's Pantry Build",
    category: "Custom Projects",
    location: "Mount Pleasant, SC",
    image: customPantry,
    alt: "Custom butler's pantry: painted shaker cabinetry, brass hardware, patterned tile backsplash, and a quartz counter, Mount Pleasant SC",
  },
];

const Gallery = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main" className="flex-1 pt-24">
        <SEO
          title="Project Gallery | Firm Foundation, Mount Pleasant"
          description="Recent excavation, hardscape, landscaping, and custom project work from Firm Foundation in Mount Pleasant and the greater Charleston area."
          canonical="/gallery"
          keywords="landscaping before and after, Mount Pleasant landscaping photos, custom cabinetry Mount Pleasant, property transformation Charleston SC"
          jsonLd={[
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: `Our Work — ${BUSINESS.name}`,
              url: `${BUSINESS.url}/gallery`,
              about: businessRef,
              hasPart: projects.map((project) => ({
                "@type": "ImageObject",
                name: project.title,
                description: project.alt,
                contentUrl: `${BUSINESS.url}${project.image}`,
                contentLocation: {
                  "@type": "Place",
                  name: project.location,
                },
              })),
            },
            breadcrumbSchema("Our Work", "/gallery"),
          ]}
        />

        {/* Page header */}
        <section className="px-5 sm:px-6 md:px-10 py-24 md:py-36">
          <div className="mx-auto max-w-content">
            <FadeInView>
              <p className="eyebrow text-primary mb-6">Portfolio</p>
              <h1 className="text-hero md:text-display font-heading max-w-4xl">
                Recent work in
                <br />
                <span className="text-primary">Mount Pleasant</span>
              </h1>
              <p className="text-subtitle text-muted-foreground mt-8 max-w-xl leading-relaxed">
                Real projects from properties across Mount Pleasant and the
                Lowcountry &mdash; outside and in.
              </p>
            </FadeInView>
          </div>
        </section>

        <Section className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
            {projects.map((project, index) => (
              <FadeInView key={project.title} delay={index * 0.08}>
                <figure className="group">
                  <div className="overflow-hidden rounded-lg bg-muted">
                    <img
                      src={project.image}
                      alt={project.alt}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className="w-full h-auto object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
                    />
                  </div>
                  <figcaption className="mt-6 flex items-start justify-between gap-6 border-t border-border pt-5">
                    <div>
                      <h2 className="font-heading text-xl md:text-2xl text-foreground">
                        {project.title}
                      </h2>
                      <p className="eyebrow text-muted-foreground mt-2.5">
                        {project.location}
                      </p>
                    </div>
                    <span className="eyebrow text-primary shrink-0 pt-1">
                      {project.category}
                    </span>
                  </figcaption>
                </figure>
              </FadeInView>
            ))}
          </div>

          <FadeInView delay={0.1}>
            <p className="text-center eyebrow text-muted-foreground mt-20">
              More projects added regularly
            </p>
          </FadeInView>
        </Section>

        <CtaSection
          title="Ready for"
          accent="yours?"
          blurb="Tell us what you have in mind and we’ll come take a look."
        />
      </main>

      <Footer />
    </div>
  );
};

export default Gallery;
