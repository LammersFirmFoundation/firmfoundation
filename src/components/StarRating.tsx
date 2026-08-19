import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  /** Rating out of 5, e.g. 4.8 */
  rating: number;
  /** Fixed-size Tailwind classes for each star. Must set both h- and w-. */
  size?: string;
  /** Wrapper classes — set the star color here (e.g. "text-primary"). */
  className?: string;
}

/**
 * Draws the actual rating instead of five solid stars, so the graphic never
 * claims more than the number printed beside it. A 4.8 renders four full stars
 * and a fifth filled 80% of the way across.
 */
const StarRating = ({
  rating,
  size = "h-4 w-4",
  className,
}: StarRatingProps) => {
  const clamped = Math.max(0, Math.min(5, rating));

  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${clamped.toFixed(1)} out of 5 stars`}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, clamped - i));
        return (
          <span key={i} className={cn("relative block shrink-0", size)}>
            <Star
              className={cn(size, "absolute inset-0 fill-current opacity-30")}
              aria-hidden="true"
            />
            {fill > 0 && (
              <span
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
                aria-hidden="true"
              >
                <Star className={cn(size, "fill-current")} aria-hidden="true" />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
};

export default StarRating;
