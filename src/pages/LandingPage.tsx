import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Home, Shield, Users, TrendingUp } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import belleHall1 from "@/assets/properties/belle-hall-1.jpg";
import carpentry from "@/assets/services/carpentry.jpg";
import pressureWashing from "@/assets/services/pressure-washing.jpg";
import landscaping from "@/assets/services/landscaping.jpg";
import windowWashing from "@/assets/services/window-washing.jpg";
import mountPleasantMap from "@/assets/maps/mount-pleasant-map.jpg";
import isleOfPalmsMap from "@/assets/maps/isle-of-palms-map.jpg";
import sullivansIslandMap from "@/assets/maps/sullivans-island-map.jpg";
import dunesWestMap from "@/assets/maps/dunes-west-map.jpg";
import parkWestMap from "@/assets/maps/park-west-map.jpg";

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
              Mount Pleasant's Premier
              <br />
              <span className="text-primary">Project Management Experts</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Professional pressure washing, landscaping, and window washing services for residential properties in Mount Pleasant, Isle of Palms, Sullivan's Island, Dunes West, and Park West
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-12 py-6 h-auto">
                <Link to="/contact">Get a Free Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-12 py-6 h-auto">
                <Link to="/services">Our Services</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-6">
              Our Maintenance Services
            </h2>
            <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
              Professional property maintenance for Mount Pleasant's finest homes
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl">
                <CardContent className="pt-8 pb-6">
                  <div className="h-48 mb-6 rounded-lg overflow-hidden">
                    <img 
                      src={pressureWashing} 
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
                      src={landscaping} 
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
                      src={windowWashing} 
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

              <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl">
                <CardContent className="pt-8 pb-6">
                  <div className="h-48 mb-6 rounded-lg overflow-hidden">
                    <img 
                      src={carpentry} 
                      alt="Carpentry service" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-2xl mb-4">Carpentry</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Skilled carpentry for deck repairs, fence fixes, and small woodworking projects. We keep your outdoor structures safe and looking great.
                  </p>
                  <ul className="text-muted-foreground text-sm space-y-2">
                    <li>• Deck repair & restoration</li>
                    <li>• Fence repair & replacement</li>
                    <li>• Railing & step fixes</li>
                    <li>• Custom outdoor builds</li>
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
                    Meticulous attention to detail and commitment to exceeding expectations
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-6">
              Areas We Serve
            </h2>
            <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
              Proudly serving the greater Mount Pleasant area and surrounding islands
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {[
                { name: "Mount Pleasant", image: mountPleasantMap },
                { name: "Isle of Palms", image: isleOfPalmsMap },
                { name: "Sullivan's Island", image: sullivansIslandMap },
                { name: "Dunes West", image: dunesWestMap },
                { name: "Park West", image: parkWestMap }
              ].map((neighborhood) => (
                <Card key={neighborhood.name} className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-2 hover:border-primary">
                  <div className="h-64 relative overflow-hidden">
                    <img 
                      src={neighborhood.image} 
                      alt={neighborhood.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-2xl md:text-3xl font-bold tracking-wide" style={{ color: '#0a1f3d', textShadow: '0 1px 3px rgba(255,255,255,0.3)' }}>
                        {neighborhood.name}
                      </h3>
                    </div>
                  </div>
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
                    "Firm Foundation transformed our home's exterior with their pressure washing service. It looks brand new again!"
                  </p>
                  <p className="font-bold text-foreground">- Sarah M.</p>
                  <p className="text-sm text-muted-foreground">Mount Pleasant Homeowner</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-xl transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <p className="text-muted-foreground italic mb-6 text-lg leading-relaxed">
                    "Outstanding landscaping service! Our yard has never looked better. The team is consistent and detail-oriented."
                  </p>
                  <p className="font-bold text-foreground">- John D.</p>
                  <p className="text-sm text-muted-foreground">Isle of Palms Homeowner</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-xl transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <p className="text-muted-foreground italic mb-6 text-lg leading-relaxed">
                    "Professional window washing service. They got our windows so clean I thought they were open! Highly recommend!"
                  </p>
                  <p className="font-bold text-foreground">- Emily R.</p>
                  <p className="text-sm text-muted-foreground">Sullivan's Island Homeowner</p>
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
              Ready to Transform Your Property?
            </h2>
            <p className="text-xl mb-12 opacity-95 leading-relaxed max-w-2xl mx-auto">
              Contact Josiah Lammers today for a free consultation and quote
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-12 py-6 h-auto shadow-xl hover:shadow-2xl transition-shadow">
                <a href="tel:4194198082">Call (419) 419-8082</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-12 py-6 h-auto border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <a href="mailto:ffirmfoundationsc@gmail.com">Email Us</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
