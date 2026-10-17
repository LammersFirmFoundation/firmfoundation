import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import FadeInView from "@/components/animations/FadeInView";
import OurStory from "@/components/OurStory";
import SEO from "@/components/SEO";
import CtaSection from "@/components/CtaSection";
import { BUSINESS } from "@/data/business";
import { businessRef, breadcrumbSchema } from "@/lib/schema";
import missionPortrait from "@/assets/story/mission-portrait.jpg";

/** Short label + one sentence: four plain promises, set as a ruled list. */
const principles = [
  {
    title: "We show up",
    detail:
      "When we say we'll be there, we're there. If something changes, you hear it from us first — not after you've spent the morning waiting.",
  },
  {
    title: "We quote honestly",
    detail:
      "Every quote starts with walking the property. You get a real number and a straight answer about what the work will and won't fix.",
  },
  {
    title: "We clean up",
    detail:
      "Spoils hauled off, debris gone, the site left the way we'd want ours left. Every job, not just the big ones.",
  },
  {
    title: "We're from here",
    detail:
      "Family run and based in Mount Pleasant. We work the same roads we live on, which is the best reason there is to do it right.",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main" className="flex-1 pt-24">
        <SEO
          title="About Firm Foundation | Mount Pleasant, SC"
          description="A family-run landscaping, hardscape and excavation company based in Mount Pleasant, SC. Meet owner-operator Josiah Lammers and see how Firm Foundation works."
          canonical="/about"
          keywords="family owned landscaping Mount Pleasant SC, local hardscape contractor Charleston, excavation contractor Mount Pleasant, Josiah Lammers, about Firm Foundation"
          jsonLd={[
            {
              "@context": "https://schema.org",
              "@type": "AboutPage",
              name: `About ${BUSINESS.name}`,
              url: `${BUSINESS.url}/about`,
              mainEntity: businessRef,
            },
            breadcrumbSchema("About", "/about"),
          ]}
        />

        {/* ── Page header ─────────────────────────────────────────────────
            The mark, the title in one ink, and the lede set beside it rather
            than stacked under it. Above the fold, so the entrance is the pure
            CSS rise from index.css, never FadeInView (its opacity:0 start
            state would be baked into the prerendered HTML). */}
        <section className="px-5 pb-14 pt-10 sm:px-6 md:px-10 md:pb-20 md:pt-16">
          <div className="mx-auto grid max-w-content grid-cols-1 gap-7 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-7">
              <p className="mark mb-6 hero-rise">About</p>
              <h1 className="text-hero font-heading text-foreground text-balance">
                <span className="hero-line">
                  <span style={{ animationDelay: "40ms" }}>A family business in Mount Pleasant</span>
                </span>
              </h1>
            </div>
            <p
              className="hero-rise max-w-xl text-subtitle leading-relaxed text-muted-foreground lg:col-span-5 lg:pb-2"
              style={{ animationDelay: "160ms" }}
            >
              Firm Foundation Property Services is a family-run landscaping,
              hardscape and excavation company in Mount Pleasant, South
              Carolina, run by {BUSINESS.owner}. The dirt work goes back a lot
              further than the company does.
            </p>
          </div>
        </section>

        {/* ── The Uncle Donnie story ──────────────────────────────────── */}
        <Section variant="cream">
          <OurStory />
        </Section>

        {/* ── Where the name comes from ───────────────────────────────────
            Josiah's mission portrait beside the copy. The verse is inside the
            image, so the copy doesn't repeat it: the two share one section
            rather than costing the reader two. The reference is set in the
            serif, the site's one voice for words that are someone else's. */}
        <Section variant="muted">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:items-center md:gap-10">
            <FadeInView className="md:col-span-5 lg:col-span-4">
              <img
                src={missionPortrait}
                alt="Josiah's mission portrait: core values courageous, witty, life-giving, hardworking, warrior; mission to live a life of integrity; vision to speak life and change the atmosphere; anchored on Matthew 7:24"
                width={1100}
                height={1955}
                loading="lazy"
                decoding="async"
                className="mx-auto h-auto w-full max-w-[18rem] rounded-[3px] md:max-w-none"
              />
            </FadeInView>

            <div className="md:col-span-7 md:col-start-6 lg:col-span-7 lg:col-start-6">
              <p className="mark mb-5">Where the name comes from</p>
              <h2 className="font-heading text-[clamp(2.75rem,6.4vw,6rem)] leading-[0.9] text-foreground text-balance">
                Built on solid rock
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-6 border-t border-border pt-8 lg:grid-cols-2 lg:gap-10">
                <p className="leading-relaxed text-foreground md:text-lg">
                  <cite className="font-serif italic">Matthew 7:24</cite> is where the name came from
                  &mdash; the person who builds on solid rock is the one whose house stands. It&rsquo;s
                  also the standard: get the base right and everything on top of it holds. True of a
                  driveway, a patio, a drainage line.
                </p>
                <p className="leading-relaxed text-muted-foreground md:text-lg">
                  The rest of it is Josiah&rsquo;s own &mdash; the values he works by and the mission he
                  wrote for himself:{" "}
                  <span className="font-serif italic text-foreground">live a life of integrity</span>.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ── How we work ─────────────────────────────────────────────────
            Four plain promises as a ruled list, the way the services are set
            on the homepage. Not cards over a dimmed photograph: that was the
            template's treatment, and these read better as statements. */}
        <Section>
          <SectionHeader
            eyebrow="How we work"
            title="What you can"
            accent="count on"
            subtitle="Josiah&rsquo;s own mission statement is to live a life of integrity. On a job site, that cashes out as four fairly unglamorous things."
          />
          <ol className="border-t border-border">
            {principles.map((principle, i) => (
              <li
                key={principle.title}
                className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 border-b border-border py-7 sm:grid-cols-[3rem_minmax(0,1fr)] md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)] md:items-baseline md:gap-x-6 md:py-9"
              >
                <span className="font-serif text-sm tabular-nums text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading text-[clamp(1.875rem,3.6vw,3rem)] leading-[0.95] text-foreground">
                  {principle.title}
                </h3>
                <p className="col-start-2 mt-3 max-w-md leading-relaxed text-muted-foreground md:col-start-3 md:mt-0 md:text-[1.0625rem]">
                  {principle.detail}
                </p>
              </li>
            ))}
          </ol>
        </Section>

        <CtaSection
          title="Let’s look at"
          accent="your property"
          blurb="No pressure, no charge — just an honest read on what your place needs."
        />
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
