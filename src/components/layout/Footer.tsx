import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img src={logo} alt="Firm Foundation" className="h-16 w-auto mb-4" />
            <p className="text-muted-foreground">
              Professional property maintenance in Mount Pleasant, South Carolina. Specializing in pressure washing, landscaping, and window washing for residential properties.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="/#services" className="hover:text-primary transition-colors">Our Services</a></li>
              <li><a href="/tenant-portal" className="hover:text-primary transition-colors">Client Portal</a></li>
              <li><a href="/owner-portal" className="hover:text-primary transition-colors">Owner Portal</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(419) 419-8082</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@firmfoundationpm.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Mount Pleasant, SC 29464</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Firm Foundation Property Management. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
