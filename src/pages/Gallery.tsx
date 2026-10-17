import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import FadeInView from "@/components/animations/FadeInView";
import SEO from "@/components/SEO";
import CtaSection from "@/components/CtaSection";
import InstagramStrip from "@/components/InstagramStrip";
import BeforeAfterPair from "@/components/BeforeAfterPair";
import { useInstagram } from "@/lib/useInstagram";
import { BUSINESS } from "@/data/business";
import { services, type Service } from "@/data/services";
import { businessRef, breadcrumbSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
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

type Pair = NonNullable<Service["beforeAfter"]>;

/**
 * The before-and-after halves, taken from the service they belong to. These
 * replaced the composites Josiah first sent (two photos stacked, one with a
 * "FIRM FOUNDATION" band of someone else's type across the middle): the split
 * halves are the same pictures, labelled honestly by `BeforeAfterPair`.
 * Throws rather than rendering a hole if the data ever loses one.
 */
const pairFor = (slug: string): Pair => {
  const pair = services.find((s) => s.slug === slug)?.beforeAfter;
  if (!pair) throw new Error(`Gallery: services.ts has no beforeAfter for "${slug}"`);
  return pair;
};

type Project = {
  title: string;
  category: string;
  /** The small line under the title. A place when we know it, otherwise what the picture is. */
  label: string;
  /** Where the job was, for schema. Left out when we don't know it rather than guessed. */
  place?: string;
  /** The photo, or for a before-and-after the "after" half (that is what schema points at). */
  image: string;
  srcSet?: string;
  /** Describes `image`. A pair's own one-sentence label comes from the pair. */
  alt: string;
  /** Intrinsic size, so the page doesn't jump as each photo arrives. */
  width: number;
  height: number;
  /** Before and after, shown side by side across the whole row. */
  pair?: Pair;
  /**
   * A landscape window cut from a portrait photo. The cab shots are mostly
   * jeans, boots and dashboard; the work is through the top of the windscreen.
   * `frame` is a literal Tailwind aspect class so the build can see it.
   */
  crop?: { frame: string; position: string };
};

/**
 * Order is the business's order (2026-10-17): landscaping and hardscapes first,
 * then the dirt work, then the one-offs.
 *
 * The finished jobs lead and get the most room: each before-and-after takes a
 * whole row. Then two to a row, each row pairing like shapes, because the grid
 * aligns to the top and a short picture beside a tall one leaves a hole.
 *
 * The three cab photos are Josiah's own, sent 2026-10-09 "to show more
 * experience". He didn't say where each job was, so they carry no place: the
 * label says what they are instead. Two of them are portrait shots from the
 * seat, and whole they were the tallest pictures on the page, ahead of the
 * finished work. They are cut down to the view through the glass.
 *
 * The odd one out (the pantry) takes a row of its own, with its caption
 * beside it rather than under it.
 */
const projects: Project[] = [
  {
    title: "Planting Bed Installation",
    category: "Landscaping",
    label: "Mount Pleasant, SC",
    place: "Mount Pleasant, SC",
    pair: pairFor("landscaping"),
    image: pairFor("landscaping").after,
    alt: "New mulch beds and rounded shrubs along the curved front walk of a two-story house, Mount Pleasant SC",
    width: 1069,
    height: 795,
  },
  {
    title: "Front Walkway & Lawn Renovation",
    category: "Hardscapes",
    label: "Mount Pleasant, SC",
    place: "Mount Pleasant, SC",
    pair: pairFor("hardscapes"),
    image: pairFor("hardscapes").after,
    alt: "A flagstone walkway set in pea gravel, curving through new sod beside a front porch, Mount Pleasant SC",
    width: 1024,
    height: 718,
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
    alt: "Through the excavator's windscreen: the bucket working a pile of roots and brush across a cleared tract, with a second excavator at the tree line",
    width: 1200,
    height: 1600,
    // Sky, tree line, bucket and brush pile; stops above the cab's cross bar
    // (and the accessory decal on it).
    crop: { frame: "aspect-[3/2]", position: "50% 5%" },
  },
  {
    title: "Forestry Mulching",
    category: "Forestry Mulching",
    label: "From the operator's seat",
    image: forestryMulching,
    srcSet: forestryMulchingSet,
    alt: "Through the windscreen of a forestry mulcher: the mulching head working through underbrush between standing pines",
    width: 1200,
    height: 1600,
    // The pines, the mulching head and the chips it leaves; stops above the dash.
    crop: { frame: "aspect-[3/2]", position: "50% 14%" },
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

/** The plates that share rows two by two. A pair takes a row to itself. */
const halves = projects.filter((p) => !p.pair);

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
            Pure CSS entrance (above the fold), lede set beside the title. No
            mark: "Portfolio" over "Recent work" said the same thing twice. */}
        <section className="pb-12 pt-10 md:pb-16 md:pt-16">
          <div className="frame grid grid-cols-1 gap-7 lg:grid-cols-12 lg:items-end lg:gap-10">
            <h1 className="text-hero font-heading text-foreground text-balance lg:col-span-8">
              <span className="hero-line">
                <span style={{ animationDelay: "40ms" }}>Recent work in Mount Pleasant</span>
              </span>
            </h1>
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
            Set like a printed portfolio: each photo at its own shape, with a
            title, kind of work and place underneath. No plate numbers: the
            order means nothing, so a number would only be decoration. No hover
            zoom: nothing here is a link, so nothing should act like one. */}
        <Section className="pt-0 md:pt-0">
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 md:gap-y-20 lg:gap-x-12">
            {projects.map((project, index) => {
              // The first plate is on screen at load: eager, so the
              // prerendered HTML is the finished picture. The second is close
              // enough to the fold on a phone that it doesn't fade in either.
              const eager = index === 0;
              const reveal = index >= 2;
              const halfIndex = halves.indexOf(project);
              // An odd last plate has no partner of its shape. Rather than
              // leave the row's right half as an accidental hole, it takes the
              // whole row and its caption moves into that half, set against
              // the foot of the photo like a side caption in a printed book.
              const alone =
                !project.pair && halfIndex === halves.length - 1 && halves.length % 2 === 1;

              const picture = project.pair ? (
                <BeforeAfterPair
                  pair={project.pair}
                  eager={eager}
                  sizes="(min-width: 1360px) 640px, 50vw"
                  className="aspect-[4/3] overflow-hidden rounded-[3px] sm:aspect-[2/1] md:aspect-[8/3]"
                />
              ) : project.crop ? (
                <div className={cn("relative overflow-hidden rounded-[3px] bg-muted", project.crop.frame)}>
                  <img
                    src={project.image}
                    srcSet={project.srcSet}
                    sizes={project.srcSet ? "(min-width: 768px) 50vw, 100vw" : undefined}
                    alt={project.alt}
                    width={project.width}
                    height={project.height}
                    loading={eager ? "eager" : "lazy"}
                    decoding="async"
                    style={{ objectPosition: project.crop.position }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              ) : (
                <img
                  src={project.image}
                  srcSet={project.srcSet}
                  sizes={project.srcSet ? "(min-width: 768px) 50vw, 100vw" : undefined}
                  alt={project.alt}
                  width={project.width}
                  height={project.height}
                  loading={eager ? "eager" : "lazy"}
                  decoding="async"
                  className="h-auto w-full rounded-[3px] bg-muted"
                />
              );

              const figure = (
                <figure className={alone ? "md:grid md:grid-cols-2 md:gap-x-8 lg:gap-x-12" : undefined}>
                  {picture}
                  <figcaption
                    className={cn("mt-5 min-w-0 border-t border-border pt-4", alone && "md:mt-0 md:self-end")}
                  >
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
                  </figcaption>
                </figure>
              );

              const span = project.pair || alone ? "md:col-span-2" : undefined;
              return reveal ? (
                <FadeInView key={project.title} delay={(halfIndex % 2) * 0.08} className={span}>
                  {figure}
                </FadeInView>
              ) : (
                <div key={project.title} className={span}>
                  {figure}
                </div>
              );
            })}
          </div>
        </Section>

        <InstagramStrip posts={instagramPosts} />

        <CtaSection
          title="Got a job like these?"
          blurb="Tell us what you have in mind and we’ll come take a look."
        />
      </main>

      <Footer />
    </div>
  );
};

export default Gallery;
