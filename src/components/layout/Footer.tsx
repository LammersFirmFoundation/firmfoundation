import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold font-heading mb-3">
              Firm Foundation
            </h3>
            <p className="text-background/60 leading-relaxed text-sm">
              Professional property maintenance for Charleston's Lowcountry.
              Trusted by homeowners and property managers throughout Mount
              Pleasant.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-background/90">Services</h4>
            <ul className="space-y-2 text-background/60 text-sm">
              <li>
                <Link
                  to="/services"
                  className="hover:text-background transition-colors"
                >
                  Pressure Washing
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-background transition-colors"
                >
                  Landscaping
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-background transition-colors"
                >
                  Window Washing
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-background transition-colors"
                >
                  Carpentry
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-background/90">Company</h4>
            <ul className="space-y-2 text-background/60 text-sm">
              <li>
                <Link
                  to="/reviews"
                  className="hover:text-background transition-colors"
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="hover:text-background transition-colors"
                >
                  Packages
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-background transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Areas & Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-background/90">
              Service Areas
            </h4>
            <ul className="space-y-1 text-background/60 text-sm mb-6">
              <li>Mount Pleasant</li>
              <li>Isle of Palms</li>
              <li>Sullivan's Island</li>
              <li>Dunes West</li>
              <li>Park West</li>
            </ul>
            <ul className="space-y-2 text-background/60 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a
                  href="tel:4194198082"
                  className="hover:text-background transition-colors"
                >
                  (419) 419-8082
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a
                  href="mailto:ffirmfoundationsc@gmail.com"
                  className="hover:text-background transition-colors"
                >
                  ffirmfoundationsc@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Mount Pleasant, SC 29464</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-background/40 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Firm Foundation Property
            Management. All rights reserved.
          </p>
          <a
            href="https://instagram.com/firmfoundation_sc"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-background/60 transition-colors"
          >
            <Instagram className="h-5 w-5" />
            <span>Follow us on Instagram</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
