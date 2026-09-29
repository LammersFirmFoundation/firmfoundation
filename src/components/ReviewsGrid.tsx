import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import FadeInView from "@/components/animations/FadeInView";
import StarRating from "@/components/StarRating";
import GoogleIcon from "@/components/icons/GoogleIcon";
import { sizedPhoto } from "@/lib/reviewPhoto";
import type { Review } from "@/data/fallbackReviews";

/**
 * Words that say something about the work this business now leads with, or
 * about how Josiah works. Used only to choose which three reviews the homepage
 * shows first — the rating is still computed from every review, and every
 * review is still on /reviews.
 */
const RELEVANT = /clear|tree|stump|dirt|grad|drain|excavat|land|lot\b|property|professional|hard[- ]?work|efficient|detail|recommend|job|count on/gi;
/** Reviews for work the business no longer offers shouldn't lead a land-clearing homepage. */
const RETIRED = /pressure wash|power wash|window/i;

/**
 * Three reviews, most relevant first, instead of an auto-rotating carousel.
 *
 * The carousel showed one review at a time and moved on its own every six
 * seconds: most visitors saw one quote (often the one about pressure washing),
 * and anyone reading a long one had it pulled away mid-sentence. Three at once
 * is proof you can take in at a glance, which is the whole job of this block.
 */
function featuredReviews(reviews: Review[], count = 3): Review[] {
  return reviews
    .filter((r) => r.rating >= 4 && !RETIRED.test(r.review))
    .map((r, i) => ({ r, i, score: (r.review.match(RELEVANT)?.length ?? 0) + (r.review.length > 120 ? 1 : 0) }))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, count)
    .map(({ r }) => r);
}

const ReviewsGrid = ({
  reviews,
  rating,
  total,
}: {
  reviews: Review[];
  rating: number;
  total: number;
}) => {
  const shown = featuredReviews(reviews);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {shown.map((review, i) => (
          <FadeInView key={review.name} delay={i * 0.08} className="h-full">
            <figure className="flex h-full flex-col rounded-lg border border-border bg-card p-6 md:p-8">
              <StarRating rating={review.rating} size="h-4 w-4" className="text-primary" />
              <blockquote className="mt-5 flex-1 font-heading text-lg font-light leading-snug text-card-foreground md:text-xl">
                <p className="line-clamp-6">&ldquo;{review.review.trim()}&rdquo;</p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                {review.avatarUrl ? (
                  <img
                    src={sizedPhoto(review.avatarUrl, 80)}
                    alt=""
                    loading="lazy"
                    width={40}
                    height={40}
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-heading text-foreground">
                    {review.name.charAt(0)}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground">{review.name}</span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <GoogleIcon className="h-3 w-3" />
                    Google review{review.date ? ` · ${review.date}` : ""}
                  </span>
                </span>
              </figcaption>
            </figure>
          </FadeInView>
        ))}
      </div>

      <FadeInView delay={0.2}>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:gap-6">
          <span className="inline-flex items-center gap-2.5 text-sm text-muted-foreground">
            <StarRating rating={rating} size="h-4 w-4" className="text-primary" />
            <span>
              <span className="font-medium text-foreground">{rating.toFixed(1)}</span> average from {total} Google reviews
            </span>
          </span>
          <Link
            to="/reviews"
            className="group inline-flex items-center gap-2 eyebrow text-primary hover:text-foreground"
          >
            Read them all
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </FadeInView>
    </>
  );
};

export default ReviewsGrid;
