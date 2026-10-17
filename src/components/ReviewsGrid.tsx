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
const RELEVANT = /landscap|mulch|bed|plant|sod|patio|walk|paver|stone|yard|clear|tree|stump|dirt|grad|drain|excavat|land|lot\b|property|professional|hard[- ]?work|efficient|detail|recommend|job|count on/gi;
/** Reviews for work the business no longer offers shouldn't lead the homepage. */
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

/** Who said it, and where. Shared by the featured quote and the two beside it. */
const Byline = ({ review }: { review: Review }) => (
  <figcaption className="mt-5 flex items-center gap-3">
    {review.avatarUrl ? (
      <img
        src={sizedPhoto(review.avatarUrl, 80)}
        alt=""
        loading="lazy"
        width={36}
        height={36}
        referrerPolicy="no-referrer"
        className="h-9 w-9 rounded-full object-cover"
      />
    ) : (
      <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted font-serif text-foreground">
        {review.name.charAt(0)}
      </span>
    )}
    <span className="min-w-0">
      <span className="block truncate text-sm font-semibold text-foreground">{review.name}</span>
      <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
        <GoogleIcon className="h-3 w-3" />
        Google review{review.date ? ` · ${review.date}` : ""}
      </span>
    </span>
  </figcaption>
);

/**
 * One review set large as a pull quote, two more beside it, ruled rather
 * than boxed. The quotes are in the serif: it is someone else's voice, and
 * setting it apart from the site's own type says so.
 */
const ReviewsGrid = ({
  reviews,
  rating,
  total,
}: {
  reviews: Review[];
  rating: number;
  total: number;
}) => {
  const [lead, ...rest] = featuredReviews(reviews);

  return (
    <>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        {lead && (
          <FadeInView className="lg:col-span-7">
            <figure>
              <StarRating rating={lead.rating} size="h-4 w-4" className="text-primary" />
              <blockquote className="mt-5 font-serif text-[1.375rem] italic leading-[1.45] text-foreground md:text-[1.75rem]">
                <p className="line-clamp-[9]">&ldquo;{lead.review.trim()}&rdquo;</p>
              </blockquote>
              <Byline review={lead} />
            </figure>
          </FadeInView>
        )}
        <div className="divide-y divide-border border-y border-border lg:col-span-5">
          {rest.map((review, i) => (
            <FadeInView key={review.name} delay={0.08 * (i + 1)}>
              <figure className="py-7">
                <blockquote className="font-serif text-[1.0625rem] italic leading-relaxed text-foreground">
                  <p className="line-clamp-5">&ldquo;{review.review.trim()}&rdquo;</p>
                </blockquote>
                <Byline review={review} />
              </figure>
            </FadeInView>
          ))}
        </div>
      </div>

      <FadeInView delay={0.2}>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <span className="inline-flex items-center gap-2.5 text-sm text-muted-foreground">
            <StarRating rating={rating} size="h-4 w-4" className="text-primary" />
            <span>
              <span className="font-semibold text-foreground">{rating.toFixed(1)}</span> average from {total} Google reviews
            </span>
          </span>
          <Link
            to="/reviews"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground underline decoration-foreground/25 underline-offset-[5px] hover:decoration-foreground"
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
