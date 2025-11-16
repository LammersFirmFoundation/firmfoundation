import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bed, Bath, Home, MapPin, Calendar, CheckCircle } from "lucide-react";

const PROPERTY_DETAILS = {
  1: {
    title: "Modern Belle Hall Townhouse",
    neighborhood: "Belle Hall",
    address: "123 Belle Hall Pkwy, Mount Pleasant, SC 29464",
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 1850,
    rent: 2400,
    available: "Now",
    description: "Beautiful modern townhouse in the heart of Belle Hall. This spacious home features an open floor plan, updated kitchen with stainless appliances, hardwood floors throughout, and a private patio. Located close to shopping, dining, and parks.",
    amenities: [
      "Granite countertops",
      "Stainless steel appliances",
      "Hardwood floors",
      "2-car garage",
      "Private patio",
      "Walk-in closets",
      "Community pool access",
      "Pet-friendly"
    ],
    virtualTour: "https://example.com/virtual-tour",
  },
  2: {
    title: "Dunes West Family Home",
    neighborhood: "Dunes West",
    address: "456 Dunes West Blvd, Mount Pleasant, SC 29466",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2600,
    rent: 3200,
    available: "Dec 1",
    description: "Stunning single-family home in prestigious Dunes West. Featuring a spacious layout with a gourmet kitchen, formal dining room, large master suite, and a beautifully landscaped backyard. Close to golf courses and top-rated schools.",
    amenities: [
      "Gourmet kitchen",
      "Formal dining room",
      "Master suite with soaking tub",
      "2-car garage",
      "Fenced backyard",
      "Fireplace",
      "Golf course access",
      "Excellent schools"
    ],
    virtualTour: "https://example.com/virtual-tour",
  },
  3: {
    title: "Waterfront Shem Creek Gem",
    neighborhood: "Shem Creek",
    address: "789 Shem Creek Dr, Mount Pleasant, SC 29464",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1950,
    rent: 3800,
    available: "Now",
    description: "Rare waterfront property on Shem Creek with stunning views and access to kayaking, paddleboarding, and world-class seafood restaurants. This charming home features a large deck, open concept living, and coastal finishes throughout.",
    amenities: [
      "Waterfront location",
      "Large deck with creek views",
      "Open floor plan",
      "Updated kitchen",
      "Private dock access",
      "Walk to restaurants",
      "1-car garage",
      "Coastal living at its best"
    ],
    virtualTour: "https://example.com/virtual-tour",
  },
};

const PropertyDetail = () => {
  const { id } = useParams();
  const propertyId = id ? parseInt(id) : null;
  const property = propertyId ? PROPERTY_DETAILS[propertyId as keyof typeof PROPERTY_DETAILS] : null;

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
            <Button asChild>
              <Link to="/listings">Back to Listings</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Image Gallery */}
        <section className="bg-muted">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-96 bg-muted-foreground/10 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Main Image</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-44 bg-muted-foreground/10 rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">Image {i}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Property Details */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{property.title}</h1>
                  <p className="text-xl text-primary font-semibold mb-4">{property.neighborhood}</p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{property.address}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{property.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{property.sqft} sqft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Available {property.available}</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Amenities & Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Location</h2>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Map of {property.address}</span>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <div className="text-3xl font-bold text-primary mb-2">
                        ${property.rent.toLocaleString()}/mo
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Available {property.available}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button className="w-full" size="lg">
                        Apply Now
                      </Button>
                      <Button variant="outline" className="w-full" size="lg">
                        Schedule Tour
                      </Button>
                      {property.virtualTour && (
                        <Button variant="outline" className="w-full" size="lg">
                          Virtual Tour
                        </Button>
                      )}
                    </div>

                    <div className="border-t border-border pt-6">
                      <h3 className="font-semibold mb-3">Contact Agent</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Phone: (843) 555-0123
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Email: info@firmfoundationpm.com
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
