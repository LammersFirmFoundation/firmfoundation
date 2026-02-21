import { Star, Quote } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import FadeInView from "@/components/animations/FadeInView";
import StaggerContainer, { StaggerItem } from "@/components/animations/StaggerContainer";
import SEO from "@/components/SEO";

const reviews = [
  {
    name: "Sarah Johnson",
    location: "Mount Pleasant",
    rating: 5,
    date: "March 2024",
    review:
      "Firm Foundation has been maintaining our property for over a year now. Their pressure washing service transformed our driveway and house exterior - it looks brand new! The team is always professional, punctual, and thorough. Highly recommend!",
    service: "Pressure Washing",
  },
  {
    name: "Michael Chen",
    location: "Isle of Palms",
    rating: 5,
    date: "February 2024",
    review:
      "Outstanding landscaping service! Our yard has never looked better. They're consistent, detail-oriented, and really care about the quality of their work. The weekly maintenance keeps everything pristine, and their seasonal planting suggestions have been excellent.",
    service: "Landscaping",
  },
  {
    name: "Ben Thompson",
    location: "Park West",
    rating: 5,
    date: "January 2024",
    review:
      "The window washing service is exceptional. They got our windows so clean I thought they were open! Very reasonable pricing and the crew was respectful of our property. Will definitely use them again.",
    service: "Window Washing",
  },
  {
    name: "David Thompson",
    location: "Sullivan's Island",
    rating: 5,
    date: "March 2024",
    review:
      "We've tried several property maintenance companies in Mount Pleasant, and Firm Foundation is by far the best. They're reliable, fairly priced, and do excellent work. The difference in our curb appeal since hiring them has been remarkable.",
    service: "Full Service Package",
  },
  {
    name: "Lisa Anderson",
    location: "Mount Pleasant",
    rating: 5,
    date: "February 2024",
    review:
      "Professional and trustworthy team. They handle our landscaping and pressure washing needs, and we couldn't be happier. Great communication, always on time, and the results speak for themselves. Our HOA even complimented our property's appearance!",
    service: "Landscaping & Pressure Washing",
  },
  {
    name: "Robert Williams",
    location: "Park West",
    rating: 5,
    date: "January 2024",
    review:
      "I was impressed from the first quote to the completed job. Their attention to detail is outstanding. The pressure washing removed years of buildup from our pool deck and patio. Fair pricing and excellent customer service throughout.",
    service: "Pressure Washing",
  },
  {
    name: "Amanda Brown",
    location: "Dunes West",
    rating: 5,
    date: "March 2024",
    review:
      "Firm Foundation takes pride in their work, and it shows. Our lawn and garden beds look magazine-worthy every week. They've also been great about accommodating special requests and working around our schedule. Truly a five-star service!",
    service: "Landscaping",
  },
  {
    name: "James Mitchell",
    location: "Park West",
    rating: 5,
    date: "February 2024",
    review:
      "Best property maintenance decision we've made. From the initial consultation to ongoing service, everything has been smooth and professional. They understand the unique needs of coastal properties and deliver consistently excellent results.",
    service: "Full Service Package",
  },
];

const Reviews = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-[72px]">
        <SEO
          title="Client Reviews – 5-Star Rated"
          description="Read reviews from satisfied homeowners in Mount Pleasant, Isle of Palms, and Sullivan's Island. 5.0 average rating for property maintenance services."
          canonical="/reviews"
          keywords="property maintenance reviews, Mount Pleasant SC reviews, pressure washing reviews, landscaping reviews, 5-star rated"
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Firm Foundation Property Maintenance",
            url: "https://firmfoundationsc.com",
            telephone: "(419) 419-8082",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Mount Pleasant",
              addressRegion: "SC",
              postalCode: "29464",
              addressCountry: "US",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "5.0",
              bestRating: "5",
              worstRating: "1",
              reviewCount: String(reviews.length),
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
              <div className="flex items-center justify-center gap-2 mb-2" role="img" aria-label="5 out of 5 stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-7 w-7 fill-primary text-primary" aria-hidden="true" />
                ))}
              </div>
              <p className="text-2xl font-bold text-foreground font-heading">
                5.0 Average Rating
              </p>
              <p className="text-muted-foreground mt-1">
                Based on {reviews.length} verified reviews
              </p>
            </FadeInView>
          </div>
        </section>

        {/* Reviews Grid — ALL reviews shown */}
        <Section variant="muted">
          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {reviews.map((review, index) => (
              <StaggerItem key={index}>
                <div className="bg-background rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow h-full">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  <div className="flex items-center gap-1 mb-4" role="img" aria-label={`${review.rating} out of 5 stars`}>
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 leading-relaxed italic">
                    &ldquo;{review.review}&rdquo;
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="font-semibold text-foreground">{review.name}</p>
                      <p className="text-sm text-muted-foreground">{review.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">{review.service}</p>
                      <p className="text-sm text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
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
              href="tel:4194198082"
              className="inline-flex items-center justify-center rounded-md font-medium bg-background text-foreground hover:bg-background/90 h-auto px-10 py-4 text-lg transition-colors"
            >
              Call (419) 419-8082
            </a>
          </FadeInView>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default Reviews;
