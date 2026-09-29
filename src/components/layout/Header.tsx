import { Link } from "react-router-dom";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import logoMark from "@/assets/logo-mark.png";
import { ArrowRight, ChevronDown, Menu, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { BUSINESS } from "@/data/business";
import { coreServices } from "@/data/services";

interface HeaderProps {
  transparent?: boolean;
}

const navLinks = [
  { label: "Our Work", path: "/gallery" },
  { label: "About", path: "/about" },
  { label: "Reviews", path: "/reviews" },
  { label: "Contact", path: "/contact" },
];

const linkStyle =
  "relative whitespace-nowrap eyebrow text-foreground/75 hover:text-foreground transition-colors py-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full";

/**
 * The tagline under the wordmark reads "Land Clearing & Excavation", not the
 * legal name's "Property Services": it is the headline of Josiah's Instagram
 * ad, and the header is on every page. The full legal name still carries NAP
 * everywhere it counts — the footer, the schema, the contact page.
 */
const Header = ({ transparent = false }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState("");

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      // Phones only: the header slides away while reading down and comes back
      // on the first scroll up. The sticky Call/Text/Quote bar already holds
      // the actions at the bottom, and two fixed bars on a 390px screen is
      // the pattern NN/g singles out. Desktop keeps a fixed header.
      if (window.innerWidth < 768 && Math.abs(y - last) > 6) {
        setHidden(y > last && y > 120);
        last = y;
      } else if (window.innerWidth >= 768) {
        setHidden(false);
        last = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // An open menu needs a solid bar above it, or the panel hangs off nothing.
  const isTransparent = transparent && !scrolled && !menu;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,transform] duration-500 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
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
              {/* Dropped below `sm` so the lockup can't push the header wider
                  than the viewport on a phone; the hero says it anyway. */}
              <span className="mt-1.5 hidden sm:block eyebrow text-muted-foreground whitespace-nowrap">
                Land Clearing &amp; Excavation
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-7 lg:gap-10">
            <NavigationMenu.Root value={menu} onValueChange={setMenu} delayDuration={60} aria-label="Main">
              <NavigationMenu.List className="flex items-center gap-7 lg:gap-10">
                <NavigationMenu.Item value="services" className="relative">
                  <NavigationMenu.Trigger className={`group inline-flex items-center gap-1.5 ${linkStyle} data-[state=open]:text-foreground`}>
                    Services
                    <ChevronDown
                      className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180"
                      aria-hidden="true"
                    />
                  </NavigationMenu.Trigger>
                  {/* A plain dropdown, not a mega menu: NN/g reserves those for
                      big sites, and five services fit in one short list. */}
                  <NavigationMenu.Content className="absolute left-0 top-full mt-4 w-[21rem] data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=from-]:slide-in-from-top-1 data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out">
                    <div className="overflow-hidden rounded-lg border border-border bg-background shadow-2xl">
                      <ul className="py-2">
                        {coreServices.map((service) => (
                          <li key={service.slug}>
                            <NavigationMenu.Link asChild>
                              <Link
                                to={`/services/${service.slug}`}
                                className="group block px-5 py-3 transition-colors hover:bg-card focus:bg-card focus:outline-none"
                              >
                                <span className="block font-heading text-lg font-light text-foreground group-hover:text-primary">
                                  {service.title}
                                </span>
                                <span className="mt-0.5 block text-xs text-muted-foreground">{service.navBlurb}</span>
                              </Link>
                            </NavigationMenu.Link>
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center justify-between gap-4 border-t border-border px-5 py-3.5">
                        <NavigationMenu.Link asChild>
                          <Link to="/services" className="group inline-flex items-center gap-2 eyebrow text-primary hover:text-foreground">
                            All services
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                          </Link>
                        </NavigationMenu.Link>
                        <span className="text-xs text-muted-foreground">+ patios, beds, builds</span>
                      </div>
                    </div>
                  </NavigationMenu.Content>
                </NavigationMenu.Item>

                {navLinks.map((link) => (
                  <NavigationMenu.Item key={link.path}>
                    <NavigationMenu.Link asChild>
                      <Link to={link.path} className={linkStyle}>
                        {link.label}
                      </Link>
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                ))}
              </NavigationMenu.List>

            </NavigationMenu.Root>

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
          </div>

          {/* Mobile: tap-to-call plus the menu */}
          <div className="flex items-center gap-1 md:hidden">
            <a
              href={BUSINESS.phoneHref}
              data-analytics-where="header-mobile"
              aria-label={`Call ${BUSINESS.phone}`}
              className="p-3"
            >
              <Phone className="h-5 w-5 text-foreground" />
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <button aria-label="Open menu" className="p-2.5">
                  <Menu className="h-6 w-6 text-foreground" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full max-w-sm overflow-y-auto bg-background border-border pt-16"
              >
                <SheetTitle className="sr-only">Site navigation</SheetTitle>
                <nav className="flex flex-col">
                  <p className="eyebrow text-primary mb-3">Services</p>
                  <ul className="mb-8 divide-y divide-border border-y border-border">
                    {coreServices.map((service) => (
                      <li key={service.slug}>
                        <SheetClose asChild>
                          <Link
                            to={`/services/${service.slug}`}
                            className="flex min-h-[48px] items-center justify-between gap-3 py-2.5 font-heading text-xl font-light text-foreground hover:text-primary"
                          >
                            {service.title}
                            <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col gap-5">
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
                  </div>
                  <SheetClose asChild>
                    <Button asChild className="w-full mt-9" size="lg">
                      <Link to="/contact">Get a Free Quote</Link>
                    </Button>
                  </SheetClose>
                  <a
                    href={BUSINESS.phoneHref}
                    className="mt-6 inline-flex items-center gap-2 eyebrow text-muted-foreground hover:text-foreground transition-colors"
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
