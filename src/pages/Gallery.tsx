import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import FadeInView from "@/components/animations/FadeInView";
import SEO from "@/components/SEO";
import CtaSection from "@/components/CtaSection";
import InstagramStrip from "@/components/InstagramStrip";
import { useInstagram } from "@/lib/useInstagram";
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
  /** Intrinsic size, so the page doesn't jump as each photo arrives. */
  width: number;
  height: number;
};

/**
 * Order is the business's order (2026-10-17): landscaping and hardscapes first,
 * then the dirt work, then the one-offs.
 *
 * The three cab photos are Josiah's own, sent 2026-10-09 "to show more
 * experience". He didn't say where each job was, so they carry no place: the
 * label says what they are instead.
 *
 * Two to a row, and each row pairs like shapes (4:3 with 4:3, portrait with
 * portrait), because the grid aligns to the top and a short picture beside a
 * tall one leaves a hole. The odd one out (the pantry) takes a row of its
 * own, with its caption beside it rather than under it.
 */
const projects: Project[] = [
  {
    title: "Planting Bed Installation",
    category: "Landscaping",
    label: "Mount Pleasant, SC",
    place: "Mount Pleasant, SC",
    image: landscapingBed,
    alt: "Before and after: overgrown front yard transformed with fresh mulch beds and plantings, Mount Pleasant SC",
    width: 1069,
    height: 1600,
  },
  {
    title: "Front Walkway & Lawn Renovation",
    category: "Hardscapes",
    label: "Mount Pleasant, SC",
    place: "Mount Pleasant, SC",
    image: landscapingWalkway,
    alt: "Before and after: bare mulch bed transformed into a flagstone walkway with fresh sod, Mount Pleasant SC",
    width: 1024,
    height: 1536,
  },
  {
    title: "Timber & Lot Clearing",
    category: "Land Clearing",
    label: "Lowcountry, SC",
    place: "Lowcountry, SC",
    image: landClearing,
    alt: "Firm Foundation's tracked excavator working through felled timber on a Lowcountry clearing job",
    width: 1206,
    height: 904,
  },
  {
    title: "Stumps Out, Root Ball and All",
    category: "Stump Removal",
    label: "From the operator's seat",
    image: stumpRootBall,
    srcSet: stumpRootBallSet,
    alt: "An excavator bucket lifting a stump out of the ground with its whole root ball, a second excavator working behind it",
    width: 1600,
    height: 1200,
  },
  {
    title: "Clearing a Wooded Tract",
    category: "Land Clearing",
    label: "From the operator's seat",
    image: clearingCab,
    srcSet: clearingCabSet,
    alt: "From the excavator cab: the bucket working a pile of roots and brush across a cleared tract, with a second excavator at the tree line",
    width: 1200,
    height: 1600,
  },
  {
    title: "Forestry Mulching",
    category: "Forestry Mulching",
    label: "From the operator's seat",
    image: forestryMulching,
    srcSet: forestryMulchingSet,
    alt: "From the cab of a forestry mulcher: the mulching head working through underbrush between standing pines",
    width: 1200,
    height: 1600,
  },
  {
    title: "Butler's Pantry Build",
    category: "Custom Projects",
    label: "Mount Pleasant, SC",
    place: "Mount Pleasant, SC",
    image: customPantry,
    alt: "Custom butler's pantry: painted shaker cabinetry, brass hardware, patterned tile backsplash, and a quartz counter, Mount Pleasant SC",
    width: 1200,
    height: 1600,
  },
];

/**
 * Display casing for a caption. The data keeps its Title Case (it is also the
 * schema `name`); the page sets titles in sentence case like every other
 * heading on the site.
 */
const sentenceCase = (text: string) => text.charAt(0) + text.slice(1).toLowerCase();

const Gallery = () => {
  // The portfolio is curated; Instagram is what Josiah posted this month.
  const instagramPosts = useInstagram();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main" className="flex-1 pt-24">
        <SEO
          title="Project Gallery | Firm Foundation, Mount Pleasant"
          description="Recent landscaping, hardscape, excavation and clearing work from Firm Foundation in Mount Pleasant and the greater Charleston area, before and after."
          canonical="/gallery"
          keywords="landscaping before and after Mount Pleasant, flagstone walkway Charleston SC, landscape installation photos, excavation project photos, land clearing photos Charleston SC"
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

        {/* ── Page header ─────────────────────────────────────────────────
            Pure CSS entrance (above the fold), lede set beside the title. */}
        <section className="px-5 pb-12 pt-10 sm:px-6 md:px-10 md:pb-16 md:pt-16">
          <div className="mx-auto grid max-w-content grid-cols-1 gap-7 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-8">
              <p className="mark mb-6 hero-rise">Portfolio</p>
              <h1 className="text-hero font-heading text-foreground text-balance">
                <span className="hero-line">
                  <span style={{ animationDelay: "40ms" }}>Recent work in Mount Pleasant</span>
                </span>
              </h1>
            </div>
            <p
              className="hero-rise max-w-md text-subtitle leading-relaxed text-muted-foreground lg:col-span-4 lg:pb-2"
              style={{ animationDelay: "160ms" }}
            >
              Real jobs, photographed on site, from the dirt work to the
              finished yard.
            </p>
          </div>
        </section>

        {/* ── The plates ──────────────────────────────────────────────────
            Set like a printed portfolio: each photo whole, at its own shape,
            with a plate number, title, kind of work and place underneath. No
            hover zoom: nothing here is a link, so nothing should act like one. */}
        <Section className="pt-0 md:pt-0">
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 md:gap-y-20 lg:gap-x-12">
            {projects.map((project, index) => {
              // The first row is on screen at load: no reveal, eager, so the
              // prerendered HTML is the finished picture.
              const aboveFold = index < 2;
              // An odd last plate has no partner of its shape. Rather than
              // leave the row's right half as an accidental hole, it takes the
              // whole row and its caption moves into that half, set against
              // the foot of the photo like a side caption in a printed book.
              const alone = index === projects.length - 1 && projects.length % 2 === 1;
              const figure = (
                <figure className={alone ? "md:grid md:grid-cols-2 md:gap-x-8 lg:gap-x-12" : undefined}>
                  <img
                    src={project.image}
                    srcSet={project.srcSet}
                    sizes={project.srcSet ? "(min-width: 768px) 50vw, 100vw" : undefined}
                    alt={project.alt}
                    width={project.width}
                    height={project.height}
                    loading={aboveFold ? "eager" : "lazy"}
                    decoding="async"
                    className="h-auto w-full rounded-[3px] bg-muted"
                  />
                  <figcaption
                    className={
                      "mt-5 grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 border-t border-border pt-4 sm:grid-cols-[2.75rem_minmax(0,1fr)]" +
                      (alone ? " md:mt-0 md:self-end" : "")
                    }
                  >
                    <span className="pt-1.5 font-serif text-sm tabular-nums text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h2 className="font-heading text-2xl leading-[1.02] text-foreground md:text-[1.75rem]">
                        {sentenceCase(project.title)}
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {sentenceCase(project.category)}
                        <span aria-hidden="true" className="mx-2 text-foreground/30">
                          /
                        </span>
                        <span className="sr-only">, </span>
                        {project.label}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              );

              const span = alone ? "md:col-span-2" : undefined;
              return aboveFold ? (
                <div key={project.title} className={span}>
                  {figure}
                </div>
              ) : (
                <FadeInView key={project.title} delay={(index % 2) * 0.08} className={span}>
                  {figure}
                </FadeInView>
              );
            })}
          </div>

          {/* The colophon, in the caption column: under the last side caption
              when the plates run odd, so it reads as the end of the set. */}
          <div className="mt-14 md:mt-20 md:grid md:grid-cols-2 md:gap-x-8 lg:gap-x-12">
            <p className="border-t border-border pt-4 text-sm text-muted-foreground md:col-start-2">
              More projects added regularly
            </p>
          </div>
        </Section>

        <InstagramStrip posts={instagramPosts} />

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
