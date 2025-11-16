import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Firm Foundation Property Management" className="h-12 w-auto" />
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-foreground">FIRM FOUNDATION</div>
              <div className="text-sm text-muted-foreground">Property Management</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/listings" className="text-foreground hover:text-primary transition-colors">
              Available Homes
            </Link>
            <Link to="/tenant-portal" className="text-foreground hover:text-primary transition-colors">
              Tenant Portal
            </Link>
            <Link to="/owner-portal" className="text-foreground hover:text-primary transition-colors">
              Owner Portal
            </Link>
            <Button asChild>
              <Link to="/listings">Browse Homes</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3">
            <Link to="/" className="text-foreground hover:text-primary transition-colors py-2">
              Home
            </Link>
            <Link to="/listings" className="text-foreground hover:text-primary transition-colors py-2">
              Available Homes
            </Link>
            <Link to="/tenant-portal" className="text-foreground hover:text-primary transition-colors py-2">
              Tenant Portal
            </Link>
            <Link to="/owner-portal" className="text-foreground hover:text-primary transition-colors py-2">
              Owner Portal
            </Link>
            <Button asChild className="w-full">
              <Link to="/listings">Browse Homes</Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
