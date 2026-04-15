import { Star, Quote, ExternalLink } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import FadeInView from "@/components/animations/FadeInView";
import StaggerContainer, { StaggerItem } from "@/components/animations/StaggerContainer";
import SEO from "@/components/SEO";
import { useReviews } from "@/lib/useReviews";
import ReviewImages from "@/components/ReviewImages";

const GOOGLE_REVIEWS_URL =
  "https://search.google.com/local/reviews?placeid=ChIJ5eaJLR-TCSgRcovM30Gs8yw";

const Reviews = () => {
  const { reviews, aggregateRating, totalReviewCount } = useReviews();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-[72px]">
        <SEO
          title="Client Reviews – 5-Star Rated"
          description="Read reviews from satisfied homeowners in Mount Pleasant, Isle of Palms, and Sullivan's Island. 5.0 average rating for property services."
          canonical="/reviews"
          keywords="property services reviews, Mount Pleasant SC reviews, hardscapes reviews, landscaping reviews, 5-star rated"
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Firm Foundation Property Services",
            url: "https://firmfoundationsc.com",
            telephone: "(843) 998-5593",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Mount Pleasant",
              addressRegion: "SC",
              postalCode: "29464",
              addressCountry: "US",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: aggregateRating.toFixed(1),
              bestRating: "5",
              worstRating: "1",
              reviewCount: String(totalReviewCount),
            },
            review: reviews.map((r) => ({
              "@type": "Review",
              author: { "@type": "Person", name: r.name },
              datePublished: r.date,
              reviewBody: r.review,
              reviewRating: {
                "@type": "Rating",
                ratingValue: String(r.rating),
                bestRating: "5",
              },
            })),
          }}
        />

        {/* Page Header */}
        <section className="py-20 md:py-28 px-4">
          <div className="container mx-auto max-w-content text-center">
            <FadeInView>
              <h1 className="text-hero md:text-display font-bold text-foreground tracking-tight font-heading mb-4">
                Client Reviews
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
                See what our satisfied customers in Mount Pleasant have to say
              </p>
              <div className="flex items-center justify-center gap-2 mb-2" role="img" aria-label={`${aggregateRating.toFixed(1)} out of 5 stars`}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-7 w-7 fill-primary text-primary" aria-hidden="true" />
                ))}
              </div>
              <p className="text-2xl font-bold text-foreground font-heading">
                {aggregateRating.toFixed(1)} Average Rating
              </p>
              <p className="text-muted-foreground mt-1">
                Based on {totalReviewCount} verified reviews
              </p>
            </FadeInView>
          </div>
        </section>

        {/* Reviews Grid */}
        <Section variant="muted">
          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {reviews.map((review, index) => (
              <StaggerItem key={index}>
                <div className="bg-background rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  <div className="flex items-center gap-1 mb-4" role="img" aria-label={`${review.rating} out of 5 stars`}>
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 leading-relaxed italic">
                    &ldquo;{review.review}&rdquo;
                  </p>
                  {review.images && review.images.length > 0 && (
                    <ReviewImages
                      images={review.images}
                      alt={`Photo from ${review.name}'s review`}
                      variant="grid"
                      className="mb-6"
                    />
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                    <div className="flex items-center gap-3 min-w-0">
                      {review.avatarUrl && (
                        <img
                          src={review.avatarUrl}
                          alt=""
                          loading="lazy"
                          className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{review.name}</p>
                        {review.location && (
                          <p className="text-sm text-muted-foreground truncate">{review.location}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-medium text-primary">{review.service}</p>
                      <p className="text-sm text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                  <a
                    href={review.sourceUrl ?? GOOGLE_REVIEWS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    View on Google <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Section>

        {/* CTA Section */}
        <Section variant="dark" className="text-center bg-gradient-to-b from-[hsl(210,50%,22%)] to-[hsl(220,20%,10%)]">
          <FadeInView>
            <h2 className="text-hero md:text-display font-bold text-background mb-6 font-heading leading-tight">
              Ready to Experience Excellence?
            </h2>
            <p className="text-xl text-background/70 mb-10 leading-relaxed max-w-2xl mx-auto">
              Join our growing list of satisfied clients in Mount Pleasant
            </p>
            <a
              href="tel:8439985593"
              className="inline-flex items-center justify-center rounded-md font-medium bg-background text-foreground hover:bg-background/90 h-auto px-10 py-4 text-lg transition-colors"
            >
              Call (843) 998-5593
            </a>
          </FadeInView>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default Reviews;
