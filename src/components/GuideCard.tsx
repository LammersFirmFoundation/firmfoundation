import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Guide } from "@/data/guides";
import { cn } from "@/lib/utils";

/**
 * A guide as one ruled line of a contents page: its question, and optionally
 * its short answer. Not a card: the parent list draws the rules, and the whole
 * row is the link so the target is wide. Used on /guides (with the answers)
 * and under each guide (questions only).
 *
 * No index numeral: the guides are not read in order, so "01 to 05" in front
 * of them was decoration (design review, 2026-10-17). The arrow is a plain →
 * that nudges on hover, because every row stays on this site.
 */
const GuideCard = ({ guide, showAnswer = false }: { guide: Guide; showAnswer?: boolean }) => (
  <Link
    to={`/guides/${guide.slug}`}
    className={cn(
      "group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4",
      showAnswer
        ? "py-7 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_auto] md:gap-x-8 md:py-9"
        : "py-5 md:py-6"
    )}
  >
    <span
      className={cn(
        "font-heading text-foreground text-balance transition-colors duration-300 group-hover:text-primary",
        // Size and leading together, in this order: tailwind-merge drops a
        // leading class that comes before a font-size class.
        showAnswer ? "text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.02]" : "text-xl leading-tight md:text-[1.375rem]"
      )}
    >
      {guide.question}
    </span>
    {showAnswer && (
      <span className="col-span-2 col-start-1 row-start-2 mt-3 block text-[0.9375rem] leading-relaxed text-muted-foreground md:col-span-1 md:col-start-2 md:row-start-1 md:mt-1 md:text-[1rem]">
        {guide.answer}
      </span>
    )}
    <ArrowRight
      className={cn(
        "col-start-2 row-start-1 mt-1 h-5 w-5 self-start text-muted-foreground transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-primary",
        showAnswer && "md:col-start-3"
      )}
      aria-hidden="true"
    />
  </Link>
);

export default GuideCard;
