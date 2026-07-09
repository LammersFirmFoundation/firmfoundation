import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import FadeInView from "@/components/animations/FadeInView";
import SEO from "@/components/SEO";
import landscapingWalkway from "@/assets/gallery/landscaping-walkway-mount-pleasant.jpg";
import landscapingBed from "@/assets/gallery/landscaping-bed-mount-pleasant.jpg";

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
];

const Gallery = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-[72px]">
        <SEO
          title="Our Work – Recent Projects"
          description="See real before-and-after landscaping, hardscape, and property transformations by Firm Foundation in Mount Pleasant and the greater Charleston area."
          canonical="/gallery"
          keywords="landscaping before and after, Mount Pleasant landscaping photos, property transformation, real projects Charleston SC"
        />

        {/* Page Header */}
        <section className="py-20 md:py-28 px-4">
          <div className="container mx-auto max-w-content text-center">
            <FadeInView>
              <h1 className="text-hero md:text-display font-bold text-foreground tracking-tight font-heading mb-4">
                Our Work
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Real before-and-after transformations from properties across Mount Pleasant and the Lowcountry
              </p>
            </FadeInView>
          </div>
        </section>

        {/* Project Gallery */}
        <Section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {projects.map((project) => (
              <FadeInView key={project.title}>
                <div className="rounded-lg overflow-hidden border border-border bg-card">
                  <div className="overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.alt}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">
                      {project.category}
                    </span>
                    <h2 className="text-lg font-bold text-foreground font-heading mb-1">
                      {project.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">{project.location}</p>
                  </div>
                </div>
              </FadeInView>
            ))}
          </div>

          <FadeInView delay={0.1}>
            <p className="text-center text-muted-foreground mt-12">
              More projects added regularly — check back soon for the latest work.
            </p>
          </FadeInView>
        </Section>

        {/* CTA Section */}
        <Section variant="dark" className="text-center bg-gradient-to-b from-[hsl(210,50%,22%)] to-[hsl(220,20%,10%)]">
          <FadeInView>
            <h2 className="text-hero md:text-display font-bold text-background mb-6 font-heading leading-tight">
              Ready for Your Own Transformation?
            </h2>
            <p className="text-xl text-background/70 mb-10 max-w-2xl mx-auto">
              Contact us today for a free quote on your next project
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

export default Gallery;
