import { ExternalLink } from "lucide-react";
import { useLoaderData } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import FadeInView from "@/components/animations/FadeInView";
import StaggerContainer, { StaggerItem } from "@/components/animations/StaggerContainer";
import SEO from "@/components/SEO";
import CtaSection from "@/components/CtaSection";
import StarRating from "@/components/StarRating";
import GoogleIcon from "@/components/icons/GoogleIcon";
import ReviewImages from "@/components/ReviewImages";
import { useReviews, type ApiResponse } from "@/lib/useReviews";
import { BUSINESS } from "@/data/business";
import { businessRef, breadcrumbSchema } from "@/lib/schema";

const Reviews = () => {
  const loaderData = useLoaderData() as ApiResponse | undefined;
  const { reviews, aggregateRating, totalReviewCount } = useReviews(loaderData);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main" className="flex-1 pt-24">
        <SEO
          title="Client Reviews | Firm Foundation, Mount Pleasant"
          description={`Reviews from homeowners across Mount Pleasant and the greater Charleston area — ${aggregateRating.toFixed(
            1
          )} average from ${totalReviewCount} verified Google reviews.`}
          canonical="/reviews"
          keywords="property services reviews Mount Pleasant SC, landscaping reviews Charleston, hardscapes reviews"
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

        {/* Page header */}
        <section className="px-5 sm:px-6 md:px-10 py-24 md:py-36">
          <div className="mx-auto max-w-content">
            <FadeInView>
              <p className="eyebrow text-primary mb-6">Testimonials</p>
              <h1 className="text-hero md:text-display font-heading max-w-4xl">
                Client
                <br />
                <span className="text-primary">reviews</span>
              </h1>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <StarRating
                  rating={aggregateRating}
                  size="h-6 w-6"
                  className="gap-1 text-primary"
                />
                <p className="eyebrow text-muted-foreground inline-flex items-center gap-2">
                  <GoogleIcon className="h-3.5 w-3.5" />
                  {aggregateRating.toFixed(1)} average &middot; {totalReviewCount}{" "}
                  verified Google reviews
                </p>
              </div>
            </FadeInView>
          </div>
        </section>

        {/* Reviews grid */}
        <Section className="pt-0">
          <StaggerContainer className="grid md:grid-cols-2 gap-6 md:gap-8 [&>*]:min-w-0">
            {reviews.map((review, index) => (
              <StaggerItem key={index}>
                <article className="h-full min-w-0 flex flex-col border border-border rounded-lg p-6 sm:p-8 md:p-10 bg-card transition-colors duration-300 hover:border-primary/50">
                  <StarRating
                    rating={review.rating}
                    size="h-4 w-4"
                    className="mb-6 gap-1 text-primary"
                  />
                  <p className="text-lg font-heading font-light text-card-foreground leading-snug mb-8">
                    &ldquo;{review.review}&rdquo;
                  </p>

                  {review.images && review.images.length > 0 && (
                    <ReviewImages
                      images={review.images}
                      alt={`Photo from ${review.name}'s review`}
                      variant="grid"
                      className="mb-8"
                    />
                  )}

                  <div className="mt-auto pt-6 border-t border-border flex items-center justify-between gap-4 min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                      {review.avatarUrl && (
                        <img
                          src={review.avatarUrl}
                          alt=""
                          loading="lazy"
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="eyebrow text-foreground truncate">
                          {review.name}
                        </p>
                        {review.date && (
                          <p className="text-xs text-muted-foreground mt-1.5">
                            {review.date}
                          </p>
                        )}
                      </div>
                    </div>
                    <a
                      href={review.sourceUrl ?? BUSINESS.googleReviewsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      Google <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Section>

        <CtaSection
          title="Ready to"
          accent="get started?"
          blurb="Join the homeowners across Mount Pleasant who already have."
        />
      </main>

      <Footer />
    </div>
  );
};

export default Reviews;
