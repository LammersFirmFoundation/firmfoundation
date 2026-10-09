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
import landClearing from "@/assets/services/excavation.jpg";
import clearingCab from "@/assets/gallery/clearing-from-the-cab.jpg";
import clearingCabSet from "@/assets/gallery/clearing-from-the-cab.jpg?w=640;1024;1200&format=webp&quality=70&as=srcset";
// The same landscape crop the Tree & Stump Removal page uses (and the same
// query string, so the build makes one set of files). Landscape on purpose: it
// pairs with "Timber & Lot Clearing" beside it, where a portrait left a gap.
import stumpRootBall from "@/assets/services/stump-root-ball.jpg";
import stumpRootBallSet from "@/assets/services/stump-root-ball.jpg?w=640;1024;1600&format=webp&quality=68&as=srcset";
import forestryMulching from "@/assets/gallery/forestry-mulching.jpg";
import forestryMulchingSet from "@/assets/gallery/forestry-mulching.jpg?w=640;1024;1200&format=webp&quality=70&as=srcset";

type Project = {
  title: string;
  category: string;
  /** The small line under the title. A place when we know it, otherwise what the picture is. */
  label: string;
  /** Where the job was, for schema. Left out when we don't know it rather than guessed. */
  place?: string;
  image: string;
  srcSet?: string;
  alt: string;
};

/**
 * Order is the business's order: clearing first. The finish-work projects stay
 * — they are real and they are good — but they no longer lead the portfolio of
 * a land clearing and excavation company.
 *
 * The three cab photos are Josiah's own, sent 2026-10-09 "to show more
 * experience". He didn't say where each job was, so they carry no place: the
 * label says what they are instead.
 *
 * Two to a row, and each row pairs like shapes (4:3 with 4:3, portrait with
 * portrait), because the grid aligns to the top and a short picture beside a
 * tall one leaves a hole.
 */
const projects: Project[] = [
  {
    title: "Timber & Lot Clearing",
    category: "Land Clearing",
    label: "Lowcountry, SC",
    place: "Lowcountry, SC",
    image: landClearing,
    alt: "Firm Foundation's tracked excavator working through felled timber on a Lowcountry clearing job",
  },
  {
    title: "Stumps Out, Root Ball and All",
    category: "Stump Removal",
    label: "From the operator's seat",
    image: stumpRootBall,
    srcSet: stumpRootBallSet,
    alt: "An excavator bucket lifting a stump out of the ground with its whole root ball, a second excavator working behind it",
  },
  {
    title: "Clearing a Wooded Tract",
    category: "Land Clearing",
    label: "From the operator's seat",
    image: clearingCab,
    srcSet: clearingCabSet,
    alt: "From the excavator cab: the bucket working a pile of roots and brush across a cleared tract, with a second excavator at the tree line",
  },
  {
    title: "Forestry Mulching",
    category: "Land Clearing",
    label: "From the operator's seat",
    image: forestryMulching,
    srcSet: forestryMulchingSet,
    alt: "From the cab of a forestry mulcher: the mulching head working through underbrush between standing pines",
  },
  {
    title: "Front Walkway & Lawn Renovation",
    category: "Landscaping",
    label: "Mount Pleasant, SC",
    place: "Mount Pleasant, SC",
    image: landscapingWalkway,
    alt: "Before and after: bare mulch bed transformed into a flagstone walkway with fresh sod, Mount Pleasant SC",
  },
  {
    title: "Planting Bed Installation",
    category: "Landscaping",
    label: "Mount Pleasant, SC",
    place: "Mount Pleasant, SC",
    image: landscapingBed,
    alt: "Before and after: overgrown front yard transformed with fresh mulch beds and plantings, Mount Pleasant SC",
  },
  {
    title: "Butler's Pantry Build",
    category: "Custom Projects",
    label: "Mount Pleasant, SC",
    place: "Mount Pleasant, SC",
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
          description="Recent land clearing, excavation and finish work from Firm Foundation in Mount Pleasant and the greater Charleston area."
          canonical="/gallery"
          keywords="land clearing photos Charleston SC, lot clearing Mount Pleasant, excavation project photos, before and after Mount Pleasant"
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
                ...(project.place && {
                  contentLocation: { "@type": "Place", name: project.place },
                }),
              })),
            },
            breadcrumbSchema("Our Work", "/gallery"),
          ]}
        />

        {/* Page header */}
        <section className="px-5 sm:px-6 md:px-10 py-16 md:py-24">
          <div className="mx-auto max-w-content">
            <FadeInView immediate>
              <p className="eyebrow text-primary mb-6">Portfolio</p>
              <h1 className="text-hero md:text-display font-heading max-w-4xl">
                Recent work in
                <br />
                <span className="text-primary">Mount Pleasant</span>
              </h1>
              <p className="text-subtitle text-muted-foreground mt-8 max-w-xl leading-relaxed">
                Real jobs, photographed on site, from clearing and dirt work
                to the finish on top.
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
                      srcSet={project.srcSet}
                      sizes={project.srcSet ? "(min-width: 768px) 50vw, 100vw" : undefined}
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
                        {project.label}
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
