import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import pressureWashing from "@/assets/services/pressure-washing.jpg";
import landscaping from "@/assets/services/landscaping.jpg";
import windowWashing from "@/assets/services/window-washing.jpg";

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
          <div className="container mx-auto max-w-6xl">
            <div className="space-y-16">
              {/* Pressure Washing */}
              <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="h-64 md:h-auto">
                    <img 
                      src={pressureWashing} 
                      alt="Professional pressure washing service on residential driveway" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="pt-8 pb-8 px-8">
                    <h3 className="font-bold text-3xl mb-4 text-primary">Pressure Washing</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Transform your property's appearance with our professional pressure washing services. Using state-of-the-art equipment and eco-friendly cleaning solutions, we safely remove years of dirt, grime, mold, and mildew from all exterior surfaces. Our technicians are trained to adjust pressure levels based on surface type, ensuring effective cleaning without damage to your property.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Whether it's your driveway showing oil stains, siding covered in algae, or a deck that's lost its luster, our pressure washing service restores surfaces to their original beauty. We understand the unique challenges of coastal properties in Mount Pleasant and use techniques specifically designed to combat salt air, humidity, and the growth it causes.
                    </p>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg text-foreground">What We Clean:</h4>
                      <ul className="text-muted-foreground space-y-2">
                        <li>• <span className="font-medium text-foreground">Driveways & Walkways:</span> Remove oil stains, tire marks, and embedded dirt</li>
                        <li>• <span className="font-medium text-foreground">House Washing & Siding:</span> Gentle soft-washing for vinyl, brick, stucco, and wood</li>
                        <li>• <span className="font-medium text-foreground">Decks & Patios:</span> Restore wood and composite materials to like-new condition</li>
                        <li>• <span className="font-medium text-foreground">Fences:</span> Brighten and preserve wood, vinyl, and metal fencing</li>
                        <li>• <span className="font-medium text-foreground">Pool Areas:</span> Clean concrete, pavers, and surrounding surfaces</li>
                        <li>• <span className="font-medium text-foreground">Gutters & Downspouts:</span> Remove exterior buildup and staining</li>
                      </ul>
                    </div>
                  </CardContent>
                </div>
              </Card>

              {/* Landscaping */}
              <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="h-64 md:h-auto md:order-2">
                    <img 
                      src={landscaping} 
                      alt="Professional landscaping and lawn maintenance service" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="pt-8 pb-8 px-8 md:order-1">
                    <h3 className="font-bold text-3xl mb-4 text-primary">Landscaping</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Maintain a pristine outdoor environment year-round with our comprehensive landscaping services. We go beyond basic lawn care to create and preserve beautiful outdoor spaces that enhance your property's value and curb appeal. Our team understands the unique growing conditions of the Lowcountry and selects plants and maintenance schedules optimized for our climate.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      From weekly maintenance to seasonal transformations, we handle all aspects of landscape care. Our services are customizable to meet your specific needs and budget, whether you need basic lawn maintenance or a complete landscape management solution. We pride ourselves on attention to detail and consistent, reliable service.
                    </p>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg text-foreground">Services Include:</h4>
                      <ul className="text-muted-foreground space-y-2">
                        <li>• <span className="font-medium text-foreground">Weekly Lawn Maintenance:</span> Mowing, edging, trimming, and blowing</li>
                        <li>• <span className="font-medium text-foreground">Mulching & Bed Maintenance:</span> Fresh mulch installation, bed edging, and weed control</li>
                        <li>• <span className="font-medium text-foreground">Seasonal Planting:</span> Color rotation, annual installation, and design consultation</li>
                        <li>• <span className="font-medium text-foreground">Irrigation Management:</span> System checks, adjustments, and minor repairs</li>
                        <li>• <span className="font-medium text-foreground">Shrub & Tree Care:</span> Pruning, shaping, and health monitoring</li>
                        <li>• <span className="font-medium text-foreground">Debris Removal:</span> Leaf cleanup, branch removal, and storm cleanup</li>
                      </ul>
                    </div>
                  </CardContent>
                </div>
              </Card>

              {/* Window Washing */}
              <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="h-64 md:h-auto">
                    <img 
                      src={windowWashing} 
                      alt="Professional window cleaning service on residential property" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="pt-8 pb-8 px-8">
                    <h3 className="font-bold text-3xl mb-4 text-primary">Window Washing</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Experience crystal-clear views with our professional window washing services. Clean windows do more than just look good—they allow more natural light into your home and can extend the life of your windows by preventing buildup of corrosive materials. We use professional-grade equipment and solutions to deliver streak-free, spotless results every time.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Our window cleaning process is thorough and efficient. We clean both interior and exterior surfaces, pay special attention to frames and sills, and ensure screens are cleaned or replaced as needed. Whether you have standard windows or hard-to-reach specialty windows, our trained technicians have the tools and expertise to safely access and clean every window in your home.
                    </p>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg text-foreground">Comprehensive Service:</h4>
                      <ul className="text-muted-foreground space-y-2">
                        <li>• <span className="font-medium text-foreground">Interior & Exterior Cleaning:</span> Both sides cleaned to perfection</li>
                        <li>• <span className="font-medium text-foreground">Screen Cleaning & Repair:</span> Screens cleaned, repaired, or replaced</li>
                        <li>• <span className="font-medium text-foreground">Track & Sill Detailing:</span> Remove buildup from frames and tracks</li>
                        <li>• <span className="font-medium text-foreground">High Window Access:</span> Safe cleaning of second and third-story windows</li>
                        <li>• <span className="font-medium text-foreground">Hard Water Stain Removal:</span> Treatment for mineral deposits and staining</li>
                        <li>• <span className="font-medium text-foreground">Sliding Door Cleaning:</span> Complete cleaning of glass doors and tracks</li>
                      </ul>
                    </div>
                  </CardContent>
                </div>
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
