import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
const Reviews = () => {
  const reviews = [{
    name: "Sarah Johnson",
    location: "Belle Hall",
    rating: 5,
    date: "March 2024",
    review: "Firm Foundation has been maintaining our property for over a year now. Their pressure washing service transformed our driveway and house exterior - it looks brand new! The team is always professional, punctual, and thorough. Highly recommend!",
    service: "Pressure Washing"
  }, {
    name: "Michael Chen",
    location: "Dunes West",
    rating: 5,
    date: "February 2024",
    review: "Outstanding landscaping service! Our yard has never looked better. They're consistent, detail-oriented, and really care about the quality of their work. The weekly maintenance keeps everything pristine, and their seasonal planting suggestions have been excellent.",
    service: "Landscaping"
  }, {
    name: "Jennifer Martinez",
    location: "Park West",
    rating: 5,
    date: "January 2024",
    review: "The window washing service is exceptional. They got our windows so clean I thought they were open! Very reasonable pricing and the crew was respectful of our property. Will definitely use them again.",
    service: "Window Washing"
  }, {
    name: "David Thompson",
    location: "Rivertowne",
    rating: 5,
    date: "March 2024",
    review: "We've tried several property maintenance companies in Mount Pleasant, and Firm Foundation is by far the best. They're reliable, fairly priced, and do excellent work. The difference in our curb appeal since hiring them has been remarkable.",
    service: "Full Service Package"
  }, {
    name: "Lisa Anderson",
    location: "Belle Hall",
    rating: 5,
    date: "February 2024",
    review: "Professional and trustworthy team. They handle our landscaping and pressure washing needs, and we couldn't be happier. Great communication, always on time, and the results speak for themselves. Our HOA even complimented our property's appearance!",
    service: "Landscaping & Pressure Washing"
  }, {
    name: "Robert Williams",
    location: "Park West",
    rating: 5,
    date: "January 2024",
    review: "I was impressed from the first quote to the completed job. Their attention to detail is outstanding. The pressure washing removed years of buildup from our pool deck and patio. Fair pricing and excellent customer service throughout.",
    service: "Pressure Washing"
  }, {
    name: "Amanda Brown",
    location: "Dunes West",
    rating: 5,
    date: "March 2024",
    review: "Firm Foundation takes pride in their work, and it shows. Our lawn and garden beds look magazine-worthy every week. They've also been great about accommodating special requests and working around our schedule. Truly a five-star service!",
    service: "Landscaping"
  }, {
    name: "James Mitchell",
    location: "Rivertowne",
    rating: 5,
    date: "February 2024",
    review: "Best property maintenance decision we've made. From the initial consultation to ongoing service, everything has been smooth and professional. They understand the unique needs of coastal properties and deliver consistently excellent results.",
    service: "Full Service Package"
  }];
  return <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-background py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAzNmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTE4LTE4YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSJyZ2JhKDI5LCA3OCwgMjE2LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-40"></div>
          <div className="container mx-auto text-center max-w-4xl relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              Client <span className="text-primary">Reviews</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              See what our satisfied customers in Mount Pleasant have to say
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-8 w-8 fill-primary text-primary" />)}
            </div>
            <p className="text-2xl font-semibold text-foreground">5.0 Average Rating</p>
            <p className="text-muted-foreground mt-2">Based on {reviews.length} verified reviews</p>
          </div>
        </section>

        {/* Reviews Grid */}
        <section className="py-24 px-4 bg-muted/20">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8">
              {reviews.slice(0, 4).map((review, index) => (
                <Card key={index} className="bg-card hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-foreground mb-6 leading-relaxed italic">"{review.review}"</p>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 bg-primary/5">
          <div className="container mx-auto text-center max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Experience Excellence?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Join our growing list of satisfied clients in Mount Pleasant
            </p>
            <a href="tel:4194198082" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 text-lg py-6">
              Call (419) 419-8082
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default Reviews;