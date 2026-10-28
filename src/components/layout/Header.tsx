import { Link } from "react-router-dom";
import HomeLink from "@/components/HomeLink";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import logoLockup from "@/assets/brand/logo-lockup.svg";
import { ArrowRight, ChevronDown, Menu, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { BUSINESS } from "@/data/business";
import { coreServices, moreServices } from "@/data/services";

interface HeaderProps {
  transparent?: boolean;
  /**
   * The page shows the logo large in its own hero (the homepage, marked with
   * `data-hero-brand`). The header's logo stays out of sight until that one
   * has scrolled up under the bar, then takes over, so the two are never on
   * screen together.
   */
  brandInHero?: boolean;
}

const navLinks = [
  { label: "Our Work", path: "/gallery" },
  { label: "About", path: "/about" },
  { label: "Reviews", path: "/reviews" },
  { label: "Contact", path: "/contact" },
];

const linkStyle =
  "relative whitespace-nowrap text-[0.9375rem] font-medium text-foreground/80 hover:text-foreground transition-colors py-1 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all after:duration-300 hover:after:w-full";

const Header = ({ transparent = false, brandInHero = false }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState("");
  // Starts true on the server and on first paint, so the prerendered homepage
  // never shows two logos.
  const [heroBrandInView, setHeroBrandInView] = useState(brandInHero);

  useEffect(() => {
    if (!brandInHero) return;
    const marks = document.querySelectorAll("[data-hero-brand]");
    if (!marks.length) {
      setHeroBrandInView(false);
      return;
    }
    // Phones and desktops each show their own copy (the other is display:none
    // and never intersects), so "in view" means any of them is.
    const seen = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target, e.isIntersecting);
        setHeroBrandInView([...seen.values()].some(Boolean));
      },
      // Counted as gone once it has slid up under the bar.
      { rootMargin: "-80px 0px 0px 0px" },
    );
    marks.forEach((m) => io.observe(m));
    return () => io.disconnect();
  }, [brandInHero]);

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
    // A page restored part-way down (back button, reload) is already scrolled.
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // An open menu needs a solid bar above it, or the panel hangs off nothing.
  const isTransparent = transparent && !scrolled && !menu;
  const logoHidden = brandInHero && heroBrandInView && !menu;

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
      <div
        className={`frame py-4 transition-[padding] duration-500 sm:py-5 ${scrolled ? "lg:py-3" : ""}`}
      >
        <div className="flex items-center justify-between gap-6">
          <HomeLink
            hidden={logoHidden}
            className={`shrink-0 transition-[opacity,transform] duration-500 ease-editorial motion-reduce:transition-none ${
              logoHidden ? "pointer-events-none -translate-y-1 opacity-0" : "opacity-100"
            }`}
          >
            {/* Josiah's own badge, recomposed side by side: the FF-and-excavator
                mark beside the script, the same artwork as the full badge in
                the footer. A stacked badge at header height would shrink the
                script past reading.

                As large as each width allows (Josiah, 2026-10-27: make the
                name stand out more). On a phone the call and menu buttons set
                the limit, and every step keeps at least ~24px between them. On
                a desktop it is largest at the top of the page and eases down
                once the bar turns solid, so it never crowds the reading. */}
            <img
              src={logoLockup}
              alt=""
              width={1443}
              height={255}
              className={`w-auto transition-[height] duration-500 ease-editorial h-[34px] min-[375px]:h-10 min-[390px]:h-[42px] min-[430px]:h-12 ${
                scrolled ? "lg:h-12" : "lg:h-14"
              }`}
            />
          </HomeLink>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-7 xl:gap-10">
            <NavigationMenu.Root value={menu} onValueChange={setMenu} delayDuration={60} aria-label="Main">
              <NavigationMenu.List className="flex items-center gap-7 xl:gap-10">
                <NavigationMenu.Item value="services" className="relative">
                  <NavigationMenu.Trigger className={`group inline-flex items-center gap-1.5 ${linkStyle} data-[state=open]:text-foreground`}>
                    Services
                    <ChevronDown
                      className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180"
                      aria-hidden="true"
                    />
                  </NavigationMenu.Trigger>
                  {/* A plain dropdown, not a mega menu: NN/g reserves those for
                      big sites, and five services fit in one short list. The
                      rest are one tap further, on /services and in the footer. */}
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
                                <span className="block font-heading text-lg text-foreground group-hover:text-primary">
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
                        <span className="text-xs text-muted-foreground">+ trees, drainage, mulching</span>
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
              className="hidden xl:inline-flex items-center gap-2 text-[0.9375rem] font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {BUSINESS.phone}
            </a>
            <Button asChild size="sm">
              <Link to="/contact">Get a free quote</Link>
            </Button>
          </div>

          {/* Mobile: tap-to-call plus the menu. The negative margin puts the
              menu icon itself on the frame's edge; its 44px tap target
              overhangs into the margin, which buys the logo ~10px. */}
          <div className="-mr-2.5 flex items-center gap-1 lg:hidden">
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
                className="w-full overflow-y-auto border-border bg-background pt-5 sm:max-w-sm"
              >
                <SheetTitle className="sr-only">Site navigation</SheetTitle>
                {/* The lockup top left, opposite the close button, so the sheet
                    is still plainly this business's. */}
                <img src={logoLockup} alt="" width={1443} height={255} className="h-9 w-auto" />
                <nav className="mt-8 flex flex-col">
                  {/* Services first and at the same size as the pages: they
                      are why most people open the menu. */}
                  <ul className="divide-y divide-border border-y border-border">
                    {[
                      ...coreServices.map((s) => ({ path: `/services/${s.slug}`, label: s.title })),
                      ...navLinks.map((l) => ({ path: l.path, label: l.label })),
                    ].map((item, i) => (
                      <li key={item.path} className={i === coreServices.length ? "border-t-2 border-t-foreground/15" : undefined}>
                        <SheetClose asChild>
                          <Link
                            to={item.path}
                            className="flex min-h-[48px] items-center justify-between gap-3 py-2.5 font-heading text-xl text-foreground hover:text-primary"
                          >
                            {item.label}
                            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Also:{" "}
                    {moreServices.map((service, i) => (
                      <span key={service.slug}>
                        <SheetClose asChild>
                          <Link
                            to={`/services/${service.slug}`}
                            className="text-foreground underline decoration-foreground/25 underline-offset-4"
                          >
                            {service.title}
                          </Link>
                        </SheetClose>
                        {i < moreServices.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                  {/* The two ways in, side by side and the same size: the
                      phone is the main conversion, not a footnote. */}
                  <div className="mt-8 grid grid-cols-1 gap-3 min-[380px]:grid-cols-2">
                    <SheetClose asChild>
                      <Button asChild size="lg">
                        <Link to="/contact">Get a free quote</Link>
                      </Button>
                    </SheetClose>
                    <Button asChild size="lg" variant="outline">
                      <a href={BUSINESS.phoneHref} data-analytics-where="menu">
                        <Phone aria-hidden="true" />
                        Call
                      </a>
                    </Button>
                  </div>
                  <p className="mt-3 text-center font-serif text-lg text-foreground">{BUSINESS.phone}</p>
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
