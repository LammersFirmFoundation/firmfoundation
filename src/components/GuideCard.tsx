import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Guide } from "@/data/guides";

/** A guide as a link card: its question, and optionally its short answer. Used on /guides and under each guide. */
const GuideCard = ({ guide, showAnswer = false }: { guide: Guide; showAnswer?: boolean }) => (
  <Link
    to={`/guides/${guide.slug}`}
    className="group flex h-full items-start justify-between gap-4 rounded-lg border border-border p-5 transition-colors hover:border-primary/60"
  >
    <span>
      <span className="block font-heading text-lg leading-snug text-foreground transition-colors group-hover:text-primary">
        {guide.question}
      </span>
      {showAnswer && (
        <span className="mt-3 block text-sm leading-relaxed text-muted-foreground">{guide.answer}</span>
      )}
    </span>
    <ArrowUpRight
      className="mt-1 h-4 w-4 flex-none text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      aria-hidden="true"
    />
  </Link>
);

export default GuideCard;
