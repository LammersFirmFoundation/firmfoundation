import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";
import { BUSINESS, serviceAreaNames } from "@/data/business";
import { services } from "@/data/services";
import logoLockup from "@/assets/logo-lockup.png";

const companyLinks = [
  { label: "About", path: "/about" },
  { label: "Our Work", path: "/gallery" },
  { label: "Reviews", path: "/reviews" },
  { label: "Contact", path: "/contact" },
];

const Footer = () => {
  return (
    <footer className="mt-auto bg-charcoal-deep text-foreground border-t border-border">
      <div className="mx-auto max-w-content px-5 sm:px-6 md:px-10 pt-24 pb-12 md:pt-32">
        {/* The full logo lockup signs the page off. It carries white type, so
            it only ever appears on the dark footer. */}
        <img
          src={logoLockup}
          alt={BUSINESS.name}
          width={340}
          height={249}
          loading="lazy"
          className="w-[220px] md:w-[300px] h-auto mb-16 md:mb-24"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-12">
          <div className="min-w-0">
            <h2 className="eyebrow text-muted-foreground mb-5">Services</h2>
            <ul className="space-y-2.5 text-sm text-foreground/70">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    to="/services"
                    className="hover:text-primary transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h2 className="eyebrow text-muted-foreground mb-5">Company</h2>
            <ul className="space-y-2.5 text-sm text-foreground/70">
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

          <div className="min-w-0">
            <h2 className="eyebrow text-muted-foreground mb-5">Service Areas</h2>
            <ul className="space-y-2.5 text-sm text-foreground/70">
              {serviceAreaNames.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h2 className="eyebrow text-muted-foreground mb-5">Get in Touch</h2>
            <ul className="space-y-4 text-sm text-foreground/70 min-w-0">
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
                  className="hover:text-primary transition-colors break-all"
                >
                  {BUSINESS.email}
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
                  className="hover:text-primary transition-colors break-all"
                >
                  @firmfoundationsc
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
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
