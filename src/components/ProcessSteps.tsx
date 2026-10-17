import FadeInView from "@/components/animations/FadeInView";
import type { ServiceItem } from "@/data/services";

/**
 * How a job runs, as three ruled columns: a numeral, a line, a sentence or
 * two. The vertical rules are the divider on Josiah's business card. It used
 * to be numbered circles joined by an animated line, which every template has.
 */
const ProcessSteps = ({ steps }: { steps: ServiceItem[] }) => (
  <ol
    className={`grid grid-cols-1 border-t border-border md:border-t-0 ${
      steps.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4"
    } md:divide-x md:divide-border`}
  >
    {steps.map((step, i) => (
      <li key={step.label} className="border-b border-border py-8 md:border-b-0 md:px-8 md:py-2 md:first:pl-0 md:last:pr-0 lg:px-10">
        <FadeInView delay={0.1 * i}>
          <span className="block font-serif text-5xl leading-none text-highlight md:text-6xl">{i + 1}</span>
          <h3 className="mt-6 font-heading text-2xl leading-tight text-foreground md:text-[1.75rem]">{step.label}</h3>
          <p className="mt-3 max-w-xs leading-relaxed text-muted-foreground">{step.detail}</p>
        </FadeInView>
      </li>
    ))}
  </ol>
);

export default ProcessSteps;
