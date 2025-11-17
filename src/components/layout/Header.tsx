import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

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
            <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <a href="/#services" className="text-foreground hover:text-primary transition-colors font-medium">
              Services
            </a>
            <Link to="/tenant-portal" className="text-foreground hover:text-primary transition-colors font-medium">
              Client Portal
            </Link>
            {isAdmin && (
              <>
                <Link to="/admin/dashboard" className="text-foreground hover:text-primary transition-colors font-medium">
                  Dashboard
                </Link>
                <Link to="/admin/onboard-client" className="text-foreground hover:text-primary transition-colors font-medium">
                  Onboard Client
                </Link>
              </>
            )}
            {user ? (
              <Button variant="outline" onClick={signOut} className="ml-4">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" className="ml-4">
                  <Link to="/auth">Admin Login</Link>
                </Button>
                <Button asChild size="lg">
                  <a href="tel:4194198082">Get a Quote</a>
                </Button>
              </>
            )}
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
            <a href="/#services" className="text-foreground hover:text-primary transition-colors py-2">
              Services
            </a>
            <Link to="/tenant-portal" className="text-foreground hover:text-primary transition-colors py-2">
              Client Portal
            </Link>
            {isAdmin && (
              <>
                <Link to="/admin/dashboard" className="text-foreground hover:text-primary transition-colors py-2">
                  Dashboard
                </Link>
                <Link to="/admin/onboard-client" className="text-foreground hover:text-primary transition-colors py-2">
                  Onboard Client
                </Link>
              </>
            )}
            {user ? (
              <Button variant="outline" onClick={signOut} className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full mb-2">
                  <Link to="/auth">Admin Login</Link>
                </Button>
                <Button asChild className="w-full">
                  <a href="tel:4194198082">Get a Quote</a>
                </Button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
