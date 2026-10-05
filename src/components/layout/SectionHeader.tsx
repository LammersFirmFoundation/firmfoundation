import { motion, useReducedMotion } from "framer-motion";
import FadeInView from "@/components/animations/FadeInView";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  /** First line of the display heading. */
  title: string;
  /**
   * Second line, set in the accent. The reference design breaks almost every
   * section heading over two lines this way ("Recent / Work", "Client /
   * Reviews") — it's what makes the huge type feel composed rather than
   * merely large.
   */
  accent?: string;
  /** Small uppercase label above the heading. */
  eyebrow?: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
  /** Render as h1 — for page headers where this is the document title. */
  as?: "h1" | "h2";
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * One heading line rising out of a mask — the same gesture as the hero
 * headline, so the whole site moves one way. Plays once, fast, as the line
 * enters the viewport — NN/g finds slow scroll-triggered text reads as lag —
 * and under reduced motion it is simply there.
 */
const Line = ({ children, delay, className }: { children: string; delay: number; className?: string }) => {
  const reduce = useReducedMotion();
  return (
    // pb/-mb keep descenders (g, y, p) from being clipped by the mask.
    <span className={cn("block overflow-hidden pb-[0.2em] -mb-[0.2em]", className)}>
      <motion.span
        className="inline-block"
        // Same start state for everyone (see FadeInView); reduced motion only
        // makes the rise instant.
        initial={{ y: "105%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "0px 0px -6% 0px" }}
        transition={reduce ? { duration: 0 } : { duration: 0.7, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
};

const SectionHeader = ({
  title,
  accent,
  eyebrow,
  subtitle,
  align = "center",
  className,
  as: Heading = "h2",
}: SectionHeaderProps) => {
  const centered = align === "center";

  return (
    <div className={cn("mb-10 md:mb-14", className)}>
      {eyebrow && (
        <FadeInView direction="none">
          <p className={cn("eyebrow text-primary mb-4", centered && "text-center")}>{eyebrow}</p>
        </FadeInView>
      )}
      <Heading className={cn("text-hero md:text-display font-heading", centered && "text-center")}>
        <Line delay={0}>{title}</Line>
        {accent && <Line delay={0.08} className="text-primary">{accent}</Line>}
      </Heading>
      {subtitle && (
        <FadeInView delay={0.2}>
          <p
            className={cn(
              "text-subtitle text-muted-foreground mt-7 max-w-narrow leading-relaxed",
              centered && "text-center mx-auto"
            )}
          >
            {subtitle}
          </p>
        </FadeInView>
      )}
    </div>
  );
};

export default SectionHeader;
