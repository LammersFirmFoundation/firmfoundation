import { motion, useReducedMotion } from "framer-motion";
import FadeInView from "@/components/animations/FadeInView";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  /** The heading. */
  title: string;
  /**
   * The rest of the heading, kept as a separate prop so older call sites
   * still read naturally. It is set in the same ink as `title`: the two-tone,
   * two-line capitals this used to produce on every section were the most
   * template-looking thing on the site.
   */
  accent?: string;
  /** The section mark above the heading (the badge's ruled capitals). */
  eyebrow?: string;
  subtitle?: string;
  /** Left is the default: a heading with its note beside it, like a printed sheet. */
  align?: "left" | "center";
  className?: string;
  /** Render as h1, for page headers where this is the document title. */
  as?: "h1" | "h2";
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * A section opening: the mark, a sentence-case heading, and the note that
 * goes with it set to the side rather than stacked and centred under it.
 *
 * The heading rises out of a mask once as it enters the viewport, the same
 * gesture as the hero, and under reduced motion it is simply there.
 */
const SectionHeader = ({
  title,
  accent,
  eyebrow,
  subtitle,
  align = "left",
  className,
  as: Heading = "h2",
}: SectionHeaderProps) => {
  const reduce = useReducedMotion();
  const text = accent ? `${title} ${accent}` : title;
  const centered = align === "center";

  const heading = (
    <Heading className={cn("text-title font-heading text-foreground text-balance", centered && "mx-auto max-w-3xl")}>
      {/* pb/-mb keep descenders from being clipped by the mask. */}
      <span className="block overflow-hidden pb-[0.15em] -mb-[0.15em]">
        <motion.span
          className="block"
          // Same start state for everyone; reduced motion only makes it instant.
          initial={{ y: "105%" }}
          whileInView={{ y: "0%" }}
          viewport={{ once: true, margin: "0px 0px -6% 0px" }}
          transition={reduce ? { duration: 0 } : { duration: 0.7, ease: EASE }}
        >
          {text}
        </motion.span>
      </span>
    </Heading>
  );

  if (centered) {
    return (
      <div className={cn("mb-10 text-center md:mb-14", className)}>
        {eyebrow && <p className="mark mb-5 justify-center">{eyebrow}</p>}
        {heading}
        {subtitle && (
          <FadeInView delay={0.15}>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted-foreground md:text-lg">{subtitle}</p>
          </FadeInView>
        )}
      </div>
    );
  }

  return (
    <div className={cn("mb-10 grid gap-5 md:mb-14 lg:grid-cols-12 lg:items-end lg:gap-10", className)}>
      <div className="lg:col-span-7">
        {eyebrow && <p className="mark mb-5">{eyebrow}</p>}
        {heading}
      </div>
      {subtitle && (
        <FadeInView delay={0.15} className="lg:col-span-5 lg:col-start-8">
          <p className="max-w-md leading-relaxed text-muted-foreground md:text-lg lg:pb-1">{subtitle}</p>
        </FadeInView>
      )}
    </div>
  );
};

export default SectionHeader;
