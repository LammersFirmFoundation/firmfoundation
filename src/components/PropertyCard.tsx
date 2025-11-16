import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface PropertyCardProps {
  id: number;
  title: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  rent: number;
  available: string;
  imageUrl: string;
}

const PropertyCard = ({ id, title, neighborhood, bedrooms, bathrooms, sqft, rent, available, imageUrl }: PropertyCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-2 hover:border-primary">
      <div className="h-64 overflow-hidden relative">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="font-bold text-xl mb-2">{title}</h3>
        <p className="text-primary font-semibold mb-4">{neighborhood}</p>
        
        <div className="flex gap-4 mb-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{bedrooms} Bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{bathrooms} Bath</span>
          </div>
          <div className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            <span>{sqft} sqft</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-foreground">${rent.toLocaleString()}/mo</div>
            <div className="text-sm text-muted-foreground">Available {available}</div>
          </div>
        </div>

        <Button asChild className="w-full">
          <Link to={`/property/${id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
