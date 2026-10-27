import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";
import { BUSINESS } from "@/data/business";
import { coreServices, moreServices } from "@/data/services";
import logoBadge from "@/assets/brand/logo-badge.svg";
import HomeLink from "@/components/HomeLink";

const companyLinks = [
  { label: "About", path: "/about" },
  { label: "Our Work", path: "/gallery" },
  { label: "Reviews", path: "/reviews" },
  { label: "Guides", path: "/guides" },
  { label: "Contact", path: "/contact" },
];

const Footer = () => {
  return (
    <footer className="on-forest mt-auto bg-forest-deep text-foreground border-t border-border">
      <div className="frame pt-14 pb-10 md:pt-16">
        {/* The full badge signs the page off, on the forest ground it was
            drawn to sit on. */}
        <HomeLink className="mb-10 inline-block md:mb-12">
          <img
            src={logoBadge}
            alt=""
            width={780}
            height={543}
            loading="lazy"
            className="h-auto w-[180px] md:w-[220px]"
          />
        </HomeLink>

        {/* No service-areas column: the closing CTA directly above lists the
            towns on every page, and the footer repeating them was about 300px
            of the same nine names on a phone. */}
        <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_1.2fr] gap-x-6 sm:gap-x-8 gap-y-10">
          <div className="min-w-0">
            <h2 className="eyebrow text-muted-foreground mb-4">Services</h2>
            <ul className="space-y-2 text-sm text-foreground/70">
              {coreServices.map((service) => (
                <li key={service.slug}>
                  {/* Each goes to its own page — never all to /services, which
                      is a wasted internal link on every page of the site. */}
                  <Link
                    to={`/services/${service.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="eyebrow text-muted-foreground mt-7 mb-3">Also</h3>
            <ul className="space-y-2 text-sm text-foreground/70">
              {moreServices.map((service) => (
                <li key={service.slug}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h2 className="eyebrow text-muted-foreground mb-4">Company</h2>
            <ul className="space-y-2 text-sm text-foreground/70">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 min-w-0 md:col-span-1">
            <h2 className="eyebrow text-muted-foreground mb-4">Get in touch</h2>
            <ul className="space-y-3 text-sm text-foreground/70 min-w-0">
              <li className="flex items-start gap-3 min-w-0 break-words">
                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                <a
                  href={BUSINESS.phoneHref}
                  className="hover:text-primary transition-colors"
                >
                  {BUSINESS.phone}
                </a>
              </li>
              <li className="flex items-start gap-3 min-w-0 break-words">
                <Mail className="h-4 w-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="hover:text-primary transition-colors"
                >
                  {/* If it has to wrap, wrap at the @, never mid-word. */}
                  {BUSINESS.email.split("@")[0]}@<wbr />
                  {BUSINESS.email.split("@")[1]}
                </a>
              </li>
              <li className="flex items-start gap-3 min-w-0 break-words">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  {BUSINESS.address.locality}, {BUSINESS.address.region}{" "}
                  {BUSINESS.address.postalCode}
                </span>
              </li>
              <li className="flex items-start gap-3 min-w-0 break-words">
                <Instagram className="h-4 w-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                <a
                  href={BUSINESS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {BUSINESS.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="eyebrow text-muted-foreground text-center sm:text-left">
            &copy; {new Date().getFullYear()} {BUSINESS.name}
          </p>
          <p className="eyebrow text-muted-foreground">
            Mount Pleasant, South Carolina
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
