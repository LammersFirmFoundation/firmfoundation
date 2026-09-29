import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import FadeInView from "@/components/animations/FadeInView";
import SurveyLayer from "@/components/SurveyLayer";
import { BUSINESS, serviceAreaNames } from "@/data/business";

interface CtaSectionProps {
  /** First line of the display heading. */
  title: string;
  /** Second line, set in the brand yellow. */
  accent: string;
  blurb: string;
  eyebrow?: string;
}

/**
 * The closing block on every page.
 *
 * This was a full brand-yellow panel, which forced the heading's two tones to
 * be charcoal-on-charcoal and read muddy. The reference site keeps its own
 * closing CTA on the dark ground and never uses its accent as a large fill —
 * so this does the same, and the yellow goes back to being an accent.
 *
 * The contour layer lives here rather than on the hero: over a photograph it
 * reads as dirt on the lens, because the photograph is already carrying the
 * whole visual load. On the bare charcoal it reads as a survey sheet, which is
 * the right note directly above a phone number.
 */
const CtaSection = ({
  title,
  accent,
  blurb,
  eyebrow = "Free On-Site Quotes",
}: CtaSectionProps) => (
  <Section
    className="text-center border-t border-border"
    backdrop={<SurveyLayer mode="ambient" density={9} alpha={1} />}
  >
    <SectionHeader
      eyebrow={eyebrow}
      title={title}
      accent={accent}
      subtitle={blurb}
      className="mb-12 md:mb-14"
    />
    <FadeInView delay={0.1}>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg">
          <a href={BUSINESS.phoneHref} data-analytics-where="page-cta">
            Call {BUSINESS.phone}
          </a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/contact">Get a Free Quote</Link>
        </Button>
      </div>
      {/* Where we work, in one line. This used to be its own homepage section,
          a 3×3 grid that repeated the footer; one line answers "do you come to
          me?" right beside the phone number, which is where the question gets asked. */}
      <p className="mx-auto mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        <span className="eyebrow mr-2 text-foreground/80">Serving</span>
        {serviceAreaNames.join(" · ")}
      </p>
    </FadeInView>
  </Section>
);

export default CtaSection;
