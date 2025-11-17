import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import belleHall1 from "@/assets/properties/belle-hall-1.jpg";
import belleHall2 from "@/assets/properties/belle-hall-2.jpg";
import dunesWest1 from "@/assets/properties/dunes-west-1.jpg";
import parkWest1 from "@/assets/properties/park-west-1.jpg";
import parkWest2 from "@/assets/properties/park-west-2.jpg";
import rivertowne1 from "@/assets/properties/rivertowne-1.jpg";

const PROPERTIES = [
  {
    id: 1,
    title: "Modern Belle Hall Townhouse",
    neighborhood: "Belle Hall",
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 1850,
    rent: 2400,
    available: "Now",
    imageUrl: belleHall2,
  },
  {
    id: 2,
    title: "Dunes West Family Home",
    neighborhood: "Dunes West",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2600,
    rent: 3200,
    available: "Dec 1",
    imageUrl: dunesWest1,
  },
  {
    id: 3,
    title: "Waterfront Rivertowne Gem",
    neighborhood: "Rivertowne",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1950,
    rent: 3800,
    available: "Now",
    imageUrl: rivertowne1,
  },
  {
    id: 4,
    title: "Park West Single Family",
    neighborhood: "Park West",
    bedrooms: 4,
    bathrooms: 2.5,
    sqft: 2200,
    rent: 2700,
    available: "Jan 15",
    imageUrl: parkWest1,
  },
  {
    id: 5,
    title: "Belle Hall Executive Home",
    neighborhood: "Belle Hall",
    bedrooms: 5,
    bathrooms: 4,
    sqft: 3200,
    rent: 4200,
    available: "Now",
    imageUrl: belleHall1,
  },
  {
    id: 6,
    title: "Charming Park West Townhouse",
    neighborhood: "Park West",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1400,
    rent: 1900,
    available: "Dec 15",
    imageUrl: parkWest2,
  },
];

const ListingsPage = () => {
  const [neighborhood, setNeighborhood] = useState<string>("all");
  const [bedrooms, setBedrooms] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number[]>([1000, 5000]);

  const filteredProperties = PROPERTIES.filter((property) => {
    const matchesNeighborhood = neighborhood === "all" || property.neighborhood === neighborhood;
    const matchesBedrooms = bedrooms === "all" || property.bedrooms.toString() === bedrooms;
    const matchesPrice = property.rent >= priceRange[0] && property.rent <= priceRange[1];
    return matchesNeighborhood && matchesBedrooms && matchesPrice;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-muted/30 py-12 px-4">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Available Homes
            </h1>
            <p className="text-xl text-muted-foreground">
              Find your perfect rental in Mount Pleasant's finest neighborhoods
            </p>
          </div>
        </section>

        {/* Filters and Listings */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filter Sidebar */}
              <aside className="lg:col-span-1">
                <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                  <h2 className="font-bold text-xl mb-6">Filter Properties</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="neighborhood">Neighborhood</Label>
                      <Select value={neighborhood} onValueChange={setNeighborhood}>
                        <SelectTrigger id="neighborhood" className="mt-2">
                          <SelectValue placeholder="All Neighborhoods" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Neighborhoods</SelectItem>
                          <SelectItem value="Belle Hall">Belle Hall</SelectItem>
                          <SelectItem value="Dunes West">Dunes West</SelectItem>
                          <SelectItem value="Park West">Park West</SelectItem>
                          <SelectItem value="Rivertowne">Rivertowne</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Select value={bedrooms} onValueChange={setBedrooms}>
                        <SelectTrigger id="bedrooms" className="mt-2">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any</SelectItem>
                          <SelectItem value="2">2+</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                          <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Price Range</Label>
                      <div className="mt-4 mb-2">
                        <Slider
                          min={1000}
                          max={5000}
                          step={100}
                          value={priceRange}
                          onValueChange={setPriceRange}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Property Grid */}
              <div className="lg:col-span-3">
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    Showing {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} {...property} />
                  ))}
                </div>

                {filteredProperties.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      No properties match your filters. Try adjusting your search criteria.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ListingsPage;
