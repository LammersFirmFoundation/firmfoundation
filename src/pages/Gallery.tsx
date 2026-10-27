import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import FadeInView from "@/components/animations/FadeInView";
import SEO from "@/components/SEO";
import SectionHeader from "@/components/layout/SectionHeader";
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
  /**
   * `jobs`: Firm Foundation's own work. `seat`: land clearing Josiah did from
   * the machine, much of it on another contractor's crew, shown as his
   * experience rather than as the company's jobs.
   */
  group: "jobs" | "seat";
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
   * `frame` is a literal Tailwind aspect class so the build can see it;
   * `zoom` scales the picture inside that frame about `origin`, for a view
   * whose edges are still cab.
   */
  crop?: { frame: string; position: string; zoom?: { scale: number; origin: string } };
};

/**
 * Order is the business's order (2026-10-17): landscaping and hardscapes first,
 * then the dirt work, then the one-offs.
 *
 * The finished jobs lead and get the most room: each before-and-after takes a
 * whole row. Then two to a row, each row pairing like shapes, because the grid
 * aligns to the top and a short picture beside a tall one leaves a hole.
 *
 * Two groups. Firm Foundation's own jobs first. Then the machine photos,
 * under their own heading: Josiah ran the machine in every one, and on
 * 2026-10-27 he asked for them to read as his land-clearing experience ("this
 * isn't my first rodeo"), real photos of him at work rather than general
 * pictures. Much of that work was on another contractor's crew, which he asked
 * not to name, so they are not captioned as the company's jobs. The section
 * is titled plainly, "Land-clearing experience" (Will, same day: keep it
 * professional).
 *
 * The three cab photos were sent 2026-10-09 "to show more experience". He
 * didn't say where each job was, so they carry no place: the label says who
 * was operating instead. Two are portrait shots from the seat, cut down to the
 * view through the glass.
 *
 * The odd one out in a group (the pantry) takes a row of its own, with its
 * caption beside it rather than under it.
 */
const projects: Project[] = [
  {
    group: "jobs",
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
    group: "jobs",
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
    group: "jobs",
    title: "Butler's Pantry Build",
    category: "Custom Projects",
    label: "Mount Pleasant, SC",
    place: "Mount Pleasant, SC",
    image: customPantry,
    alt: "Custom butler's pantry: painted shaker cabinetry, brass hardware, patterned tile backsplash, and a quartz counter, Mount Pleasant SC",
    width: 1200,
    height: 1600,
    // Landscape like the cab photos, so the one indoor job doesn't end up the
    // tallest picture on a page about yards. Held on the counter and the tile.
    crop: { frame: "aspect-[3/2]", position: "62% 64%" },
  },
  {
    group: "seat",
    title: "Timber & Lot Clearing",
    category: "Land Clearing",
    label: "Lowcountry, SC",
    place: "Lowcountry, SC",
    image: landClearing,
    alt: "A tracked excavator Josiah ran, working through felled timber on a Lowcountry clearing job",
    width: 1206,
    height: 904,
  },
  {
    group: "seat",
    title: "Stumps Out, Root Ball and All",
    category: "Stump Removal",
    label: "Operated by Josiah",
    image: stumpRootBall,
    srcSet: stumpRootBallSet,
    alt: "From Josiah's seat: an excavator bucket lifting a stump out of the ground with its whole root ball, a second excavator working behind it",
    width: 1600,
    height: 1200,
  },
  {
    group: "seat",
    title: "Clearing a Wooded Tract",
    category: "Land Clearing",
    label: "Operated by Josiah",
    image: clearingCab,
    srcSet: clearingCabSet,
    alt: "Through the windscreen of the excavator Josiah was running: the bucket working a pile of roots and brush across a cleared tract, with a second excavator at the tree line",
    width: 1200,
    height: 1600,
    // Sky, tree line, bucket and brush pile; stops above the cab's cross bar
    // (and the accessory decal on it).
    crop: { frame: "aspect-[3/2]", position: "50% 5%" },
  },
  {
    group: "seat",
    title: "Forestry Mulching",
    category: "Forestry Mulching",
    label: "Operated by Josiah",
    image: forestryMulching,
    srcSet: forestryMulchingSet,
    alt: "Through the windscreen of the forestry mulcher Josiah was running: the mulching head working through underbrush between standing pines",
    width: 1200,
    height: 1600,
    // The pines, the mulching head and the chips it leaves. The left quarter
    // of the frame is the cab's door pillar and its panel, so the picture is
    // drawn 1.38x about its top right to leave only the glass.
    crop: { frame: "aspect-[3/2]", position: "50% 14%", zoom: { scale: 1.38, origin: "100% 12.7%" } },
  },
];

const jobs = projects.filter((p) => p.group === "jobs");
const seat = projects.filter((p) => p.group === "seat");

/**
 * Display casing for a caption. The data keeps its Title Case (it is also the
 * schema `name`); the page sets titles in sentence case like every other
 * heading on the site.
 */
const sentenceCase = (text: string) => text.charAt(0) + text.slice(1).toLowerCase();

/**
 * One group of plates. `first` is the group's position in the whole page, so
 * only the very first plate loads eagerly and the first two never fade in.
 */
const Plates = ({ list, first, heading: Heading }: { list: Project[]; first: number; heading: "h2" | "h3" }) => {
  /** The plates that share rows two by two. A pair takes a row to itself. */
  const halves = list.filter((p) => !p.pair);
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 md:gap-y-20 lg:gap-x-12">
      {list.map((project, i) => {
        const index = first + i;
        // The first plate is on screen at load: eager, so the prerendered
        // HTML is the finished picture. The second is close enough to the
        // fold on a phone that it doesn't fade in either.
        const eager = index === 0;
        const reveal = index >= 2;
        const halfIndex = halves.indexOf(project);
        // An odd last plate has no partner of its shape. Rather than leave the
        // row's right half as an accidental hole, it takes the whole row and
        // its caption moves into that half, set against the foot of the photo
        // like a side caption in a printed book.
        const alone = !project.pair && halfIndex === halves.length - 1 && halves.length % 2 === 1;

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
              style={{
                objectPosition: project.crop.position,
                ...(project.crop.zoom && {
                  transform: `scale(${project.crop.zoom.scale})`,
                  transformOrigin: project.crop.zoom.origin,
                }),
              }}
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
            <figcaption className={cn("mt-5 min-w-0 border-t border-border pt-4", alone && "md:mt-0 md:self-end")}>
              <Heading className="font-heading text-2xl leading-[1.02] text-foreground md:text-[1.75rem]">
                {sentenceCase(project.title)}
              </Heading>
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
  );
};

const Gallery = () => {
  // The portfolio is curated; Instagram is what Josiah posted this month.
  const instagramPosts = useInstagram();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main" className="flex-1 pt-24">
        <SEO
          title="Project Gallery | Firm Foundation, Mount Pleasant"
          description="Landscaping, hardscape and custom work from Firm Foundation in Mount Pleasant, SC, before and after, plus Josiah's land-clearing experience as an excavator operator."
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
              Real jobs, photographed on site: Firm Foundation&rsquo;s
              projects first, then Josiah&rsquo;s land-clearing experience.
            </p>
          </div>
        </section>

        {/* ── Firm Foundation's own jobs ──────────────────────────────────
            Set like a printed portfolio: each photo at its own shape, with a
            title, kind of work and place underneath. No plate numbers: the
            order means nothing, so a number would only be decoration. No hover
            zoom: nothing here is a link, so nothing should act like one. */}
        <Section className="pt-0 md:pt-0">
          <Plates list={jobs} first={0} heading="h2" />
        </Section>

        {/* ── Josiah's land-clearing experience ───────────────────────────
            His ask, 2026-10-27: show that "this isn't my first rodeo", and that
            these are photos of him at work, not general pictures. Will asked
            for it to stay professional, so it is said plainly: what he has
            operated, on what work, and that he is the operator in each photo.
            NN/g's trust research is the reason it is worth saying: visitors
            want to see the work being done and who does it. */}
        <Section className="pt-4 md:pt-8">
          <SectionHeader
            title="Land-clearing experience"
            subtitle="Josiah has operated excavators and forestry mulchers on a land-clearing crew, clearing timber, removing stumps and mulching wooded tracts. He is the operator in each of these photos."
          />
          <Plates list={seat} first={jobs.length} heading="h3" />
        </Section>

        <InstagramStrip posts={instagramPosts} />

        <CtaSection
          title="Got a job like these?"
          blurb="Tell us what you have in mind, and Josiah will come out and walk it with you."
        />
      </main>

      <Footer />
    </div>
  );
};

export default Gallery;
