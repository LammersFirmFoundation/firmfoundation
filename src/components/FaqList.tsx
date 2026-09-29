import type { ReactNode } from "react";
import { Plus } from "lucide-react";

export type FaqEntry = { question: string; answer: ReactNode; footer?: ReactNode };

/**
 * Questions as native `<details>`: collapsed so a long list scans, but every
 * answer is in the prerendered HTML — crawlers read it, and it opens with no
 * JavaScript at all. These answers are some of the most search-valuable prose
 * on the site ("do I need a permit to take down a tree in Mount Pleasant"), so
 * hiding them behind a client-only toggle would throw that away.
 */
const FaqList = ({ items }: { items: FaqEntry[] }) => (
  <div className="mx-auto max-w-narrow divide-y divide-border border-y border-border">
    {items.map((item) => (
      <details key={item.question} className="group">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-start justify-between gap-6 py-6 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
          <h3 className="font-heading text-lg leading-snug text-foreground md:text-xl">
            {item.question}
          </h3>
          <Plus
            aria-hidden="true"
            className="mt-1 h-5 w-5 flex-none text-primary transition-transform duration-300 group-open:rotate-45"
          />
        </summary>
        <div className="-mt-1 pb-7 pr-10">
          <div className="leading-relaxed text-muted-foreground">{item.answer}</div>
          {item.footer && <div className="mt-4">{item.footer}</div>}
        </div>
      </details>
    ))}
  </div>
);

export default FaqList;
