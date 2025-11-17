import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import belleHall1 from "@/assets/properties/belle-hall-1.jpg";
import belleHall2 from "@/assets/properties/belle-hall-2.jpg";
import parkWest1 from "@/assets/properties/park-west-1.jpg";
import { Shield, Users, TrendingUp } from "lucide-react";

const ServicesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-background py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAzNmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTE4LTE4YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSJyZ2JhKDI5LCA3OCwgMjE2LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-40"></div>
          <div className="container mx-auto text-center max-w-4xl relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              Our <span className="text-primary">Maintenance Services</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Professional property maintenance for Mount Pleasant's finest homes
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl">
                <CardContent className="pt-8 pb-6">
                  <div className="h-48 mb-6 rounded-lg overflow-hidden">
                    <img 
                      src={belleHall1} 
                      alt="Pressure washing service" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-2xl mb-4">Pressure Washing</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Professional pressure washing for driveways, sidewalks, siding, decks, and patios. We restore your property's curb appeal with safe, effective cleaning techniques.
                  </p>
                  <ul className="text-muted-foreground text-sm space-y-2">
                    <li>• Driveway & walkway cleaning</li>
                    <li>• House washing & siding</li>
                    <li>• Deck & patio restoration</li>
                    <li>• Fence cleaning</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl">
                <CardContent className="pt-8 pb-6">
                  <div className="h-48 mb-6 rounded-lg overflow-hidden">
                    <img 
                      src={parkWest1} 
                      alt="Landscaping service" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-2xl mb-4">Landscaping</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Complete landscaping services to keep your property looking pristine year-round. From routine maintenance to seasonal enhancements.
                  </p>
                  <ul className="text-muted-foreground text-sm space-y-2">
                    <li>• Weekly lawn maintenance</li>
                    <li>• Mulching & edging</li>
                    <li>• Seasonal planting</li>
                    <li>• Irrigation management</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl">
                <CardContent className="pt-8 pb-6">
                  <div className="h-48 mb-6 rounded-lg overflow-hidden">
                    <img 
                      src={belleHall2} 
                      alt="Window washing service" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-2xl mb-4">Window Washing</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Crystal-clear windows inside and out. We provide streak-free cleaning for all your residential windows, including hard-to-reach areas.
                  </p>
                  <ul className="text-muted-foreground text-sm space-y-2">
                    <li>• Interior & exterior cleaning</li>
                    <li>• Screen cleaning & repair</li>
                    <li>• Track & sill detailing</li>
                    <li>• High window access</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 px-4 bg-muted/20">
          <div className="container mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-6">
              Why Choose Firm Foundation
            </h2>
            <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
              Trusted by homeowners and property managers throughout Mount Pleasant
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="border-2 hover:border-primary transition-all duration-300">
                <CardContent className="pt-8 pb-6 text-center">
                  <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
                  <h3 className="font-bold text-xl mb-3">Professional & Reliable</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Licensed, insured, and committed to delivering exceptional service on every project
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-all duration-300">
                <CardContent className="pt-8 pb-6 text-center">
                  <Users className="h-16 w-16 text-primary mx-auto mb-6" />
                  <h3 className="font-bold text-xl mb-3">Local Expertise</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Deep knowledge of Mount Pleasant properties and coastal maintenance needs
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-all duration-300">
                <CardContent className="pt-8 pb-6 text-center">
                  <TrendingUp className="h-16 w-16 text-primary mx-auto mb-6" />
                  <h3 className="font-bold text-xl mb-3">Quality Results</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We take pride in our work and guarantee satisfaction with every service
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 bg-primary/5">
          <div className="container mx-auto text-center max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Contact us today for a free quote on any of our services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-12 py-6 h-auto">
                <a href="tel:4194198082">Call (419) 419-8082</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-12 py-6 h-auto">
                <a href="/contact">Contact Us</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ServicesPage;
