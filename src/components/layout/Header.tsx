import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="Firm Foundation Property Management" className="h-14 w-auto transition-transform group-hover:scale-105" />
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-foreground font-serif tracking-wide">FIRM FOUNDATION</div>
              <div className="text-sm text-muted-foreground font-sans">Property Management</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => handleNavClick("/")} className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </button>
            <button onClick={() => handleNavClick("/services")} className="text-foreground hover:text-primary transition-colors font-medium">
              Services
            </button>
            <button onClick={() => handleNavClick("/reviews")} className="text-foreground hover:text-primary transition-colors font-medium">
              Reviews
            </button>
            <button onClick={() => handleNavClick("/contact")} className="text-foreground hover:text-primary transition-colors font-medium">
              Contact
            </button>
            <Button size="lg" onClick={() => handleNavClick("/contact")}>
              Get a Quote
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
            <button onClick={() => handleNavClick("/")} className="text-foreground hover:text-primary transition-colors py-2 text-left">
              Home
            </button>
            <button onClick={() => handleNavClick("/services")} className="text-foreground hover:text-primary transition-colors py-2 text-left">
              Services
            </button>
            <button onClick={() => handleNavClick("/reviews")} className="text-foreground hover:text-primary transition-colors py-2 text-left">
              Reviews
            </button>
            <button onClick={() => handleNavClick("/contact")} className="text-foreground hover:text-primary transition-colors py-2 text-left">
              Contact
            </button>
            <Button className="w-full" onClick={() => handleNavClick("/contact")}>
              Get a Quote
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
