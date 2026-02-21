import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import logo from "@/assets/logo-icon.png";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

interface HeaderProps {
  transparent?: boolean;
}

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Reviews", path: "/reviews" },
  { label: "Packages", path: "/pricing" },
  { label: "Contact", path: "/contact" },
];

const Header = ({ transparent = false }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!transparent) return;
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparent]);

  const isTransparent = transparent && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent"
          : "bg-background/95 backdrop-blur-md shadow-sm border-b border-border/50"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="Firm Foundation Property Management"
              className={`h-10 w-auto transition-all group-hover:scale-105 ${
                isTransparent ? "brightness-0 invert" : "brightness-0"
              }`}
            />
            <div className="hidden sm:block">
              <div
                className={`text-lg font-bold tracking-wide font-heading ${
                  isTransparent ? "text-white" : "text-foreground"
                }`}
              >
                FIRM FOUNDATION
              </div>
              <div
                className={`text-xs ${
                  isTransparent ? "text-white/70" : "text-muted-foreground"
                }`}
              >
                Property Management
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative font-medium transition-colors py-1 ${
                  isTransparent
                    ? "text-white/90 hover:text-white"
                    : "text-foreground/80 hover:text-foreground"
                } after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all hover:after:w-full`}
              >
                {link.label}
              </Link>
            ))}
            <Button
              asChild
              size="sm"
              className={
                isTransparent
                  ? "bg-white text-foreground hover:bg-white/90"
                  : ""
              }
            >
              <Link to="/contact">
                Get a Quote
              </Link>
            </Button>
          </nav>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden" aria-label="Open menu">
                <Menu
                  className={`h-6 w-6 ${
                    isTransparent ? "text-white" : "text-foreground"
                  }`}
                />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm pt-16">
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <SheetClose key={link.path} asChild>
                    <Link
                      to={link.path}
                      className="text-left text-xl font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Button asChild className="w-full mt-4" size="lg">
                    <Link to="/contact">
                      Get a Quote
                    </Link>
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
