import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
import principlesBackdrop from "@/assets/services/excavation.jpg";

/** Short label + one sentence, the way the reference site frames its own. */
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
          description="A family-run property services company based in Mount Pleasant, SC. Meet founder Josiah Lammers and see how Firm Foundation works."
          canonical="/about"
          keywords="family owned landscaping Mount Pleasant SC, local property services Charleston, about Firm Foundation"
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

        {/* Page header */}
        <section className="px-5 sm:px-6 md:px-10 py-24 md:py-36">
          <div className="mx-auto max-w-content">
            <FadeInView>
              <p className="eyebrow text-primary mb-6">About</p>
              <h1 className="text-hero md:text-display font-heading max-w-4xl">
                A family business
                <br />
                <span className="text-primary">in Mount Pleasant</span>
              </h1>
              <p className="text-subtitle text-muted-foreground mt-8 max-w-xl leading-relaxed">
                Firm Foundation Property Services is a family-run excavation
                and landscaping contractor in Mount Pleasant, South Carolina,
                run by {BUSINESS.owner}. The work goes back a lot further than
                the company does.
              </p>
            </FadeInView>
          </div>
        </section>

        {/* The Uncle Donnie story */}
        <Section variant="cream">
          <OurStory />
        </Section>

        {/* Where the name comes from. Josiah's mission portrait is built on
            Matthew 7:24 — which is literally where "Firm Foundation" came
            from, and that had never been said anywhere on the site. */}
        <Section className="border-t border-border">
          <div className="max-w-narrow mx-auto text-center">
            <FadeInView>
              <p className="eyebrow text-primary mb-8">Where the name comes from</p>
              <blockquote className="font-heading text-3xl md:text-[2.75rem] font-extralight leading-[1.15] text-foreground">
                &ldquo;Anyone who listens to my teaching and follows it is wise,
                like a person who builds a house on{" "}
                <span className="text-primary">solid rock</span>.&rdquo;
              </blockquote>
              <cite className="eyebrow text-muted-foreground mt-8 block not-italic">
                Matthew 7:24
              </cite>
              <p className="text-muted-foreground leading-relaxed mt-10">
                That verse is where the name came from. It&rsquo;s also the
                standard: get the base right and everything you build on top of
                it holds. It&rsquo;s true of a driveway, a patio, a drainage
                line &mdash; and of how we&rsquo;d like to do business.
              </p>
            </FadeInView>
          </div>
        </Section>

        {/* Principles — tall translucent cards over a dimmed site photo, the
            treatment the reference site uses for the same kind of block. */}
        <section className="relative overflow-hidden py-section-sm md:py-section px-5 sm:px-6 md:px-10">
          <img
            src={principlesBackdrop}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-[0.16]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background"
          />

          <div className="relative mx-auto max-w-content">
            <SectionHeader
              eyebrow="How We Work"
              title="What you can"
              accent="count on"
              subtitle="Josiah&rsquo;s own mission statement is to live a life of integrity. On a job site, that cashes out as four fairly unglamorous things."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
              {principles.map((principle, i) => (
                <FadeInView key={principle.title} delay={i * 0.08} direction="up">
                  <article className="group flex h-full min-h-[360px] md:min-h-[440px] flex-col justify-between rounded-sm border border-border bg-background/70 p-7 md:p-9 backdrop-blur-sm transition-colors duration-500 hover:border-primary/70">
                    <div>
                      <span className="eyebrow text-primary block mb-7">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-heading text-3xl md:text-[2.5rem] font-extralight leading-[1.05] text-foreground">
                        {principle.title}
                      </h3>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed mt-10">
                      {principle.detail}
                    </p>
                  </article>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>

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
