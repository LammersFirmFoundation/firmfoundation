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
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-background py-32 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAzNmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTE4LTE4YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSJyZ2JhKDI5LCA3OCwgMjE2LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-40"></div>
          <div className="container mx-auto text-center max-w-5xl relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 leading-tight tracking-tight">
              Charleston's Premier
              <br />
              <span className="text-primary">Property Management</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover upscale rental homes in Belle Hall, Dunes West, Park West, and Shem Creek waterfront communities
            </p>
            <Button asChild size="lg" className="text-lg px-12 py-6 h-auto">
              <Link to="/listings">Browse Available Homes</Link>
            </Button>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-6">
              Why Choose Firm Foundation
            </h2>
            <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
              Excellence in residential property management and maintenance
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl">
                <CardContent className="pt-8 pb-6 text-center">
                  <Home className="h-16 w-16 text-primary mx-auto mb-6" />
                  <h3 className="font-bold text-xl mb-3">Quality Homes</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Single-family homes and townhouses in Mount Pleasant's finest neighborhoods
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl">
                <CardContent className="pt-8 pb-6 text-center">
                  <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
                  <h3 className="font-bold text-xl mb-3">Reliable Service</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    24/7 maintenance support and responsive management team
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl">
                <CardContent className="pt-8 pb-6 text-center">
                  <Users className="h-16 w-16 text-primary mx-auto mb-6" />
                  <h3 className="font-bold text-xl mb-3">Tenant Portal</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Easy online rent payments, maintenance requests, and document access
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl">
                <CardContent className="pt-8 pb-6 text-center">
                  <TrendingUp className="h-16 w-16 text-primary mx-auto mb-6" />
                  <h3 className="font-bold text-xl mb-3">Owner Transparency</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Detailed reporting, performance tracking, and seamless communication
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Neighborhoods */}
        <section className="py-24 px-4 bg-muted/20">
          <div className="container mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-6">
              Featured Neighborhoods
            </h2>
            <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
              Explore Mount Pleasant's most sought-after communities
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {["Belle Hall", "Dunes West", "Park West", "Shem Creek"].map((neighborhood) => (
                <Card key={neighborhood} className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-2 hover:border-primary">
                  <div className="h-64 bg-gradient-to-br from-primary/10 to-muted flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                    <span className="text-muted-foreground relative z-10">Image</span>
                  </div>
                  <CardContent className="pt-6 pb-8">
                    <h3 className="font-bold text-2xl mb-3">{neighborhood}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Discover beautiful homes in this premier Mount Pleasant community
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-6">
              What Our Clients Say
            </h2>
            <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
              Trusted by homeowners and renters throughout Mount Pleasant
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="border-2 hover:shadow-xl transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <p className="text-muted-foreground italic mb-6 text-lg leading-relaxed">
                    "Firm Foundation made finding our dream home in Belle Hall so easy. The tenant portal is incredibly convenient!"
                  </p>
                  <p className="font-bold text-foreground">- Sarah M.</p>
                  <p className="text-sm text-muted-foreground">Tenant</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-xl transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <p className="text-muted-foreground italic mb-6 text-lg leading-relaxed">
                    "As a property owner, I appreciate the transparent reporting and professional service. Highly recommend!"
                  </p>
                  <p className="font-bold text-foreground">- John D.</p>
                  <p className="text-sm text-muted-foreground">Property Owner</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-xl transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <p className="text-muted-foreground italic mb-6 text-lg leading-relaxed">
                    "Responsive maintenance team and beautiful properties. We love our Shem Creek townhouse!"
                  </p>
                  <p className="font-bold text-foreground">- Emily R.</p>
                  <p className="text-sm text-muted-foreground">Tenant</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAzNmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTE4LTE4YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
          <div className="container mx-auto text-center max-w-4xl relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Ready to Find Your Perfect Home?
            </h2>
            <p className="text-xl mb-12 opacity-95 leading-relaxed max-w-2xl mx-auto">
              Explore our available properties in Mount Pleasant's most desirable neighborhoods
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg px-12 py-6 h-auto shadow-xl hover:shadow-2xl transition-shadow">
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
