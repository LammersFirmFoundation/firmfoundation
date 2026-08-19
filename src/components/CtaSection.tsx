import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import FadeInView from "@/components/animations/FadeInView";
import { BUSINESS } from "@/data/business";

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
 */
const CtaSection = ({
  title,
  accent,
  blurb,
  eyebrow = "Free On-Site Quotes",
}: CtaSectionProps) => (
  <Section className="text-center border-t border-border">
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
          <Link to="/contact">Send a Message</Link>
        </Button>
      </div>
    </FadeInView>
  </Section>
);

export default CtaSection;
