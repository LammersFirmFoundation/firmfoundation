import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Section from "@/components/layout/Section";
import FadeInView from "@/components/animations/FadeInView";
import SurveyLayer from "@/components/SurveyLayer";
import { ACCEPTS_SMS, BUSINESS, serviceAreaNames, smsHref } from "@/data/business";

interface CtaSectionProps {
  /** The heading. */
  title: string;
  /** The rest of the heading, in the same ink (see SectionHeader). */
  accent?: string;
  blurb: string;
  eyebrow?: string;
}

/**
 * The closing block on every page.
 *
 * A deep-green band with cream contour lines, which is what the bottom of
 * Josiah's flyer is ("LET'S TALK ABOUT YOUR NEXT PROJECT" over topo lines),
 * and like the flyer it puts the phone number first and large, in the serif
 * the flyer sets it in. The heading sits left with the number beside it
 * rather than everything stacked and centred.
 *
 * The contour layer lives here rather than on the hero: over a photograph it
 * reads as dirt on the lens. On the bare green it reads as a survey sheet.
 */
const CtaSection = ({ title, accent, blurb, eyebrow = "Free on-site quotes" }: CtaSectionProps) => (
  <Section variant="forest" backdrop={<SurveyLayer mode="ambient" density={9} alpha={0.55} />}>
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end lg:gap-10">
      <FadeInView className="lg:col-span-7">
        <p className="mark mb-5">{eyebrow}</p>
        <h2 className="text-title font-heading text-foreground text-balance md:text-[clamp(2.5rem,4.6vw,4.25rem)]">
          {accent ? `${title} ${accent}` : title}
        </h2>
        <p className="mt-5 max-w-md leading-relaxed text-muted-foreground md:text-lg">{blurb}</p>
      </FadeInView>

      <FadeInView delay={0.1} className="lg:col-span-5">
        <a
          href={BUSINESS.phoneHref}
          data-analytics-where="page-cta"
          className="inline-block font-serif text-[2.25rem] font-semibold leading-none tracking-[-0.01em] text-foreground underline decoration-foreground/25 decoration-1 underline-offset-[10px] transition-colors hover:decoration-foreground sm:text-5xl"
        >
          {BUSINESS.phone}
        </a>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild size="lg">
            <Link to="/contact">Get a free quote</Link>
          </Button>
          {ACCEPTS_SMS && (
            <Button asChild size="lg" variant="outline">
              <a href={smsHref} data-analytics-where="page-cta-text">
                <MessageSquare aria-hidden="true" />
                Text a photo of the yard
              </a>
            </Button>
          )}
        </div>
      </FadeInView>
    </div>

    {/* Where we work, in one line, right beside the number: that is where
        "do you come to me?" gets asked. */}
    <FadeInView delay={0.15}>
      <p className="mt-14 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
        <span className="mr-2 font-semibold text-foreground">Serving</span>
        {serviceAreaNames.join(" · ")}
      </p>
    </FadeInView>
  </Section>
);

export default CtaSection;
