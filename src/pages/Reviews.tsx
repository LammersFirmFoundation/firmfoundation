import { ExternalLink } from "lucide-react";
import { useLoaderData } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import CtaSection from "@/components/CtaSection";
import StarRating from "@/components/StarRating";
import GoogleIcon from "@/components/icons/GoogleIcon";
import ReviewImages from "@/components/ReviewImages";
import { useReviews, type ApiResponse } from "@/lib/useReviews";
import { BUSINESS } from "@/data/business";
import { businessRef, breadcrumbSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import type { Review } from "@/data/fallbackReviews";

/**
 * Who said it, and when, with the way back to the original on Google.
 *
 * Every reviewer gets the Besley monogram, even when Google supplies an
 * avatar. Most of those are Google's own letter tiles in teal, pink and
 * purple, the only saturated colour on a two-colour page, and the few real
 * photos are 40px thumbnails nobody can recognise anyway. The name beside it
 * and the link to the original on Google are what make a review checkable.
 */
const Byline = ({ review, className }: { review: Review; className?: string }) => (
  <figcaption className={cn("flex items-center gap-3", className)}>
    <span
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted font-serif text-foreground"
    >
      {review.name.charAt(0)}
    </span>
    <span className="min-w-0">
      <span className="block truncate font-semibold text-foreground">{review.name}</span>
      <span className="mt-1 block text-sm text-muted-foreground">
        {review.date ? `${review.date} · ` : ""}
        <a
          href={review.sourceUrl ?? BUSINESS.googleReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline decoration-foreground/25 underline-offset-[4px] transition-colors hover:text-foreground hover:decoration-foreground"
        >
          Google <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </span>
    </span>
  </figcaption>
);

/** "Nine", not "9", at the head of a sentence; past twenty a numeral reads fine. */
const NUMBER_WORDS = [
  "No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
  "Eighteen", "Nineteen", "Twenty",
];
const countWord = (n: number) => NUMBER_WORDS[n] ?? String(n);

const Reviews = () => {
  const loaderData = useLoaderData() as ApiResponse | undefined;
  const { reviews, aggregateRating, totalReviewCount } = useReviews(loaderData);
  // The title counts the reviews on THIS page, because "word for word" is a
  // promise about them. Google's total can be higher: the API leaves out
  // reviews under four stars and ratings with no text, so that number stays
  // with the average beside it, which does cover every one.
  const shown = reviews.length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main" className="flex-1 pt-24">
        <SEO
          title="Client Reviews | Firm Foundation, Mount Pleasant"
          description={`Reviews from homeowners across Mount Pleasant and the greater Charleston area: a ${aggregateRating.toFixed(
            1
          )} average from ${totalReviewCount} Google reviews.`}
          canonical="/reviews"
          keywords="landscaping reviews Mount Pleasant SC, hardscape contractor reviews Charleston, excavation contractor reviews Mount Pleasant, Firm Foundation reviews"
          jsonLd={[
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: `Client Reviews — ${BUSINESS.name}`,
              url: `${BUSINESS.url}/reviews`,
              about: businessRef,
            },
            breadcrumbSchema("Reviews", "/reviews"),
          ]}
        />

        {/* ── Page header ─────────────────────────────────────────────────
            The title on the left, saying what is on the page and how; the true
            average beside it, set large in the serif like the phone number in
            the closing band, with the ask under it. No mark: "Testimonials"
            over "Client reviews" said one thing twice. Pure CSS entrance:
            this is all above the fold. */}
        <section className="pb-12 pt-10 md:pb-16 md:pt-16">
          <div className="frame grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <h1 className="text-hero font-heading text-foreground text-balance lg:col-span-7">
              <span className="hero-line">
                <span style={{ animationDelay: "40ms" }}>
                  {countWord(shown)} Google {shown === 1 ? "review" : "reviews"}, word for word
                </span>
              </span>
            </h1>

            <div className="hero-rise min-w-0 lg:col-span-5 lg:pb-1" style={{ animationDelay: "160ms" }}>
              <div className="flex items-end gap-5">
                <span className="font-serif text-[4rem] font-semibold leading-[0.8] tracking-[-0.02em] text-foreground md:text-[5rem]">
                  {aggregateRating.toFixed(1)}
                </span>
                <span className="min-w-0 pb-0.5">
                  <StarRating rating={aggregateRating} size="h-5 w-5" className="text-primary" />
                  <span className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <GoogleIcon className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {/* The title already gives the count when it is the
                          same one; say it again only when Google's differs. */}
                      {totalReviewCount === shown
                        ? "average on Google"
                        : `average across ${totalReviewCount} Google reviews`}
                    </span>
                  </span>
                </span>
              </div>

              {/* Worked with us? The same /review redirect the printed QR card
                  points at, so the ask is identical in print and on the web.
                  Deliberately neutral wording — Google prohibits soliciting
                  positive reviews specifically or asking for a star count.
                  Full width on the narrowest phones: at 320px its fixed
                  padding left it a pixel wider than the column. */}
              <Button asChild size="lg" variant="outline" className="mt-7 w-full min-[360px]:w-auto">
                <a href="/review">Leave a review on Google</a>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Every review ────────────────────────────────────────────────
            Ruled, not boxed, and in the serif italic the homepage sets them
            in: it is someone else's voice. The byline sits in the margin on a
            desktop, like a printed letters page, and under the quote on a
            phone. No scroll reveal: this is reading, and the first quotes are
            above the fold. */}
        <Section className="pt-0 md:pt-0">
          <ol className="border-b border-border">
            {reviews.map((review, index) => (
              <li key={index} className="border-t border-border py-9 md:py-12">
                <figure className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
                  <div className="min-w-0 lg:col-span-8 lg:col-start-5">
                    <StarRating rating={review.rating} size="h-4 w-4" className="text-primary" />
                    <blockquote className="mt-5 max-w-[42rem] font-serif text-[1.1875rem] italic leading-[1.55] text-foreground md:text-[1.375rem]">
                      <p>&ldquo;{review.review.trim()}&rdquo;</p>
                    </blockquote>
                    {review.images && review.images.length > 0 && (
                      <ReviewImages
                        images={review.images}
                        alt={`Photo from ${review.name}'s review`}
                        variant="grid"
                        className="mt-7 max-w-md grid-cols-4"
                      />
                    )}
                  </div>
                  <Byline review={review} className="min-w-0 self-start lg:col-span-3 lg:col-start-1 lg:row-start-1" />
                </figure>
              </li>
            ))}
          </ol>
        </Section>

        {/* Josiah's own line, off his flyer. */}
        <CtaSection
          title="Dirt work done right."
          blurb="Call or text. Josiah comes out, walks the job with you, and you have a price before anything starts."
        />
      </main>

      <Footer />
    </div>
  );
};

export default Reviews;
