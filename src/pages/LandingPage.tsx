import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Home, Shield, Users, TrendingUp } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-background py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Premier Property Management in Mount Pleasant
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover upscale rental homes in Belle Hall, Dunes West, Park West, and Shem Creek waterfront communities
            </p>
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/listings">Browse Available Homes</Link>
            </Button>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Why Choose Firm Foundation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Home className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Quality Homes</h3>
                  <p className="text-muted-foreground">
                    Single-family homes and townhouses in Mount Pleasant's finest neighborhoods
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Reliable Service</h3>
                  <p className="text-muted-foreground">
                    24/7 maintenance support and responsive management team
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Tenant Portal</h3>
                  <p className="text-muted-foreground">
                    Easy online rent payments, maintenance requests, and document access
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Owner Transparency</h3>
                  <p className="text-muted-foreground">
                    Detailed reporting, performance tracking, and seamless communication
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Neighborhoods */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Featured Neighborhoods
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {["Belle Hall", "Dunes West", "Park West", "Shem Creek"].map((neighborhood) => (
                <Card key={neighborhood} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Image</span>
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold text-lg">{neighborhood}</h3>
                    <p className="text-muted-foreground text-sm mt-2">
                      Discover beautiful homes in this premier Mount Pleasant community
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              What Our Clients Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground italic mb-4">
                    "Firm Foundation made finding our dream home in Belle Hall so easy. The tenant portal is incredibly convenient!"
                  </p>
                  <p className="font-semibold">- Sarah M.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground italic mb-4">
                    "As a property owner, I appreciate the transparent reporting and professional service. Highly recommend!"
                  </p>
                  <p className="font-semibold">- John D.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground italic mb-4">
                    "Responsive maintenance team and beautiful properties. We love our Shem Creek townhouse!"
                  </p>
                  <p className="font-semibold">- Emily R.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-primary text-primary-foreground">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Find Your Perfect Home?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Explore our available properties in Mount Pleasant's most desirable neighborhoods
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link to="/listings">View Available Homes</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
