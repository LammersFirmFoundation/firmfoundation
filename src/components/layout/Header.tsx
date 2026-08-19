import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import logoMark from "@/assets/logo-mark.png";
import { Menu, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { BUSINESS } from "@/data/business";

interface HeaderProps {
  transparent?: boolean;
}

const navLinks = [
  { label: "Services", path: "/services" },
  { label: "Our Work", path: "/gallery" },
  { label: "About", path: "/about" },
  { label: "Reviews", path: "/reviews" },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        isTransparent
          ? "bg-transparent"
          : "bg-background/90 backdrop-blur-md border-b border-border/60"
      }`}
    >
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-10 py-4 sm:py-5">
        <div className="flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
            {/* Full-colour mark — no knock-out filter, the yellow is the brand. */}
            <img
              src={logoMark}
              alt={BUSINESS.name}
              width={51}
              height={40}
              className="h-8 sm:h-10 w-auto shrink-0 transition-transform duration-500 group-hover:scale-105"
            />
            <span className="leading-none min-w-0">
              <span className="block font-heading text-[0.9375rem] sm:text-lg font-light tracking-[0.08em] sm:tracking-[0.14em] text-foreground whitespace-nowrap">
                FIRM FOUNDATION
              </span>
              {/* Dropped below 380px so the lockup can't push the header wider
                  than the viewport on the smallest phones. */}
              <span className="mt-1.5 hidden min-[380px]:block eyebrow text-muted-foreground">
                Property Services
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative eyebrow text-foreground/75 hover:text-foreground transition-colors py-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={BUSINESS.phoneHref}
              data-analytics-where="header"
              className="hidden xl:inline-flex items-center gap-2 eyebrow text-foreground/75 hover:text-foreground transition-colors"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {BUSINESS.phone}
            </a>
            <Button asChild size="sm">
              <Link to="/contact">Get a Quote</Link>
            </Button>
          </nav>

          {/* Mobile: tap-to-call plus the menu */}
          <div className="flex items-center gap-1 md:hidden">
            <a
              href={BUSINESS.phoneHref}
              data-analytics-where="header-mobile"
              aria-label={`Call ${BUSINESS.phone}`}
              className="p-2"
            >
              <Phone className="h-5 w-5 text-foreground" />
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <button aria-label="Open menu" className="p-2">
                  <Menu className="h-6 w-6 text-foreground" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full max-w-sm bg-background border-border pt-20"
              >
                <SheetTitle className="sr-only">Site navigation</SheetTitle>
                <nav className="flex flex-col gap-7">
                  {navLinks.map((link) => (
                    <SheetClose key={link.path} asChild>
                      <Link
                        to={link.path}
                        className="font-heading text-3xl font-light tracking-tight text-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <Button asChild className="w-full mt-4" size="lg">
                      <Link to="/contact">Get a Quote</Link>
                    </Button>
                  </SheetClose>
                  <a
                    href={BUSINESS.phoneHref}
                    className="inline-flex items-center gap-2 eyebrow text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                    {BUSINESS.phone}
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
