import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Guide } from "@/data/guides";
import { cn } from "@/lib/utils";

/**
 * A guide as one ruled line of a contents page: its number, its question, and
 * optionally its short answer. Not a card: the parent list draws the rules,
 * and the whole row is the link so the target is wide. Used on /guides (with
 * the answers, set like the services index on the homepage) and under each
 * guide (questions only).
 */
const GuideCard = ({
  guide,
  index,
  showAnswer = false,
}: {
  guide: Guide;
  /** Position in the list, printed as a serif numeral. Omitted, no numeral. */
  index?: number;
  showAnswer?: boolean;
}) => {
  const numbered = index !== undefined;

  return (
    <Link
      to={`/guides/${guide.slug}`}
      className={cn(
        "group grid items-baseline gap-x-3",
        numbered ? "grid-cols-[2rem_minmax(0,1fr)_auto] sm:grid-cols-[3rem_minmax(0,1fr)_auto]" : "grid-cols-[minmax(0,1fr)_auto]",
        showAnswer && "py-7 md:gap-x-8 md:py-9",
        showAnswer &&
          (numbered
            ? "md:grid-cols-[4rem_minmax(0,1.15fr)_minmax(0,1fr)_auto]"
            : "md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_auto]"),
        !showAnswer && "py-5 md:py-6"
      )}
    >
      {numbered && (
        <span className="font-serif text-sm tabular-nums text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
      )}
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
        <span
          className={cn(
            "mt-3 block text-[0.9375rem] leading-relaxed text-muted-foreground md:row-start-1 md:mt-1 md:text-[1rem]",
            numbered
              ? "col-span-2 col-start-2 row-start-2 md:col-span-1 md:col-start-3"
              : "col-span-2 col-start-1 row-start-2 md:col-span-1 md:col-start-2"
          )}
        >
          {guide.answer}
        </span>
      )}
      <ArrowUpRight
        className={cn(
          "h-5 w-5 self-start text-muted-foreground transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary",
          numbered ? "col-start-3 row-start-1" : "col-start-2 row-start-1",
          showAnswer && (numbered ? "md:col-start-4" : "md:col-start-3"),
          "mt-1"
        )}
        aria-hidden="true"
      />
    </Link>
  );
};

export default GuideCard;
