import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FaqEntry = { question: string; answer: ReactNode; footer?: ReactNode };

/**
 * Questions as native `<details>`: collapsed so a long list scans, but every
 * answer is in the prerendered HTML — crawlers read it, and it opens with no
 * JavaScript at all. These answers are some of the most search-valuable prose
 * on the site ("do I need a permit to take down a tree in Mount Pleasant"), so
 * hiding them behind a client-only toggle would throw that away.
 *
 * Set as a ruled list across the page, the way `ServicesIndex` sets the
 * services: the question in the display face, a hairline under each, and the
 * answer held to a reading measure. The marker is drawn, not an icon: two
 * hairlines that become one when the answer is open, so it reads as part of
 * the rule rather than a button laid on top of it.
 *
 * No scroll reveal: this is reading, and motion on this site goes on the
 * pictures. The section heading above it already rises in.
 */
const FaqList = ({ items, className }: { items: FaqEntry[]; className?: string }) => (
  <div className={cn("border-t border-border", className)}>
    {items.map((item) => (
      <details key={item.question} className="group border-b border-border">
        <summary className="grid min-h-[44px] cursor-pointer list-none grid-cols-[minmax(0,1fr)_0.875rem] items-start gap-6 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:gap-10 md:py-7 [&::-webkit-details-marker]:hidden">
          <h3 className="max-w-3xl font-heading text-[1.3125rem] leading-[1.15] text-foreground underline decoration-transparent decoration-1 underline-offset-[6px] transition-colors duration-300 group-hover:decoration-foreground/30 md:text-[1.625rem]">
            {item.question}
          </h3>
          <span aria-hidden="true" className="relative mt-[0.35rem] h-3.5 w-3.5 text-foreground md:mt-[0.55rem]">
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-300 ease-editorial group-open:scale-y-0" />
          </span>
        </summary>
        <div className="max-w-2xl pb-8 md:pb-10">
          <div className="leading-relaxed text-muted-foreground md:text-[1.0625rem]">{item.answer}</div>
          {item.footer && <div className="mt-5">{item.footer}</div>}
        </div>
      </details>
    ))}
  </div>
);

export default FaqList;
