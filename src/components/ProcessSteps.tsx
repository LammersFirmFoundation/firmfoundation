import { motion, useReducedMotion } from "framer-motion";
import FadeInView from "@/components/animations/FadeInView";
import type { ServiceItem } from "@/data/services";

/**
 * How a job runs, as a numbered line.
 *
 * A clearing or grading job is a bigger, less familiar purchase than a mulch
 * refresh, and the anxiety is mostly "what actually happens, and when do I
 * find out what it costs". Four steps answer that before anyone has to ask.
 *
 * The rule across the top draws once when it scrolls into view and then stays
 * (no loop: WCAG 2.2.2), and is simply present under reduced motion.
 */
const ProcessSteps = ({ steps }: { steps: ServiceItem[] }) => {
  const reduce = useReducedMotion();

  return (
    <div className="relative">
      {/* The line joining the steps: horizontal on desktop, down the left on a phone. */}
      <div aria-hidden="true" className="absolute left-[1.375rem] top-2 bottom-2 w-px bg-border md:left-0 md:right-0 md:top-[1.375rem] md:bottom-auto md:h-px md:w-auto" />
      <motion.div
        aria-hidden="true"
        className="absolute left-[1.375rem] top-2 bottom-2 w-px origin-top bg-primary md:left-0 md:right-0 md:top-[1.375rem] md:bottom-auto md:h-px md:w-auto md:origin-left"
        initial={{ scaleX: 0, scaleY: 0 }}
        whileInView={{ scaleX: 1, scaleY: 1 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={reduce ? { duration: 0 } : { duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      />

      <ol className={`relative grid gap-9 md:gap-10 ${steps.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4"}`}>
        {steps.map((step, i) => (
          <li key={step.label} className="grid grid-cols-[2.75rem_1fr] gap-5 md:block">
            <FadeInView delay={0.15 * i} direction="none">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-primary bg-background font-heading text-sm text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
            </FadeInView>
            <FadeInView delay={0.15 * i + 0.05}>
              <h3 className="font-heading text-2xl font-extralight leading-tight text-foreground md:mt-7 md:text-[1.75rem]">
                {step.label}
              </h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">
                {step.detail}
              </p>
            </FadeInView>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ProcessSteps;
