import type { Service } from "@/data/services";
import { cn } from "@/lib/utils";

type Pair = NonNullable<Service["beforeAfter"]>;

/**
 * Two photographs of the same spot, before and after, side by side with real
 * labels. Side by side and never a slider or an overlay: they were taken
 * minutes or weeks apart from roughly the same place, not on a tripod, so
 * anything implying the same frame would show the seams.
 *
 * One `role="img"` with one label, so a screen reader hears the pair once
 * instead of two unlabelled pictures.
 */
const BeforeAfterPair = ({
  pair,
  sizes,
  className,
  imgClassName,
  eager = false,
}: {
  pair: Pair;
  /** Above the fold: load now, and never animate. */
  eager?: boolean;
  /** `sizes` for ONE half. */
  sizes: string;
  className?: string;
  imgClassName?: string;
}) => (
  <div role="img" aria-label={pair.alt} className={cn("grid grid-cols-2 gap-px bg-border", className)}>
    {(
      [
        ["Before", pair.before, pair.beforeSrcSet],
        ["After", pair.after, pair.afterSrcSet],
      ] as const
    ).map(([label, src, srcSet]) => (
      <div key={label} className="relative overflow-hidden bg-muted">
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt=""
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          style={{ objectPosition: pair.position ?? "50% 50%" }}
          className={cn("absolute inset-0 h-full w-full object-cover", imgClassName)}
        />
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 eyebrow text-[0.5625rem] sm:left-3 sm:top-3 sm:text-[0.625rem]",
            label === "After" ? "bg-primary text-primary-foreground" : "bg-background/90 text-foreground",
          )}
        >
          {label}
        </span>
      </div>
    ))}
  </div>
);

export default BeforeAfterPair;
