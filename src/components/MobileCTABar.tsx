import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { BUSINESS } from "@/data/business";

/**
 * Sticky bottom action bar, mobile only. Click-to-call is the highest-value
 * action on a phone, so Call and Free Quote stay one thumb-tap away on every
 * screen. Hidden at md+ where the header already carries both.
 */
const MobileCTABar = () => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden grid grid-cols-2 border-t border-border bg-background/95 backdrop-blur-md">
      <a
        href={BUSINESS.phoneHref}
        data-analytics-where="mobile-bar"
        className="flex items-center justify-center gap-2 py-4 eyebrow text-foreground active:bg-muted transition-colors"
        aria-label={`Call Firm Foundation at ${BUSINESS.phone}`}
      >
        <Phone className="h-4 w-4" aria-hidden="true" />
        Call
      </a>
      <Link
        to="/contact"
        className="flex items-center justify-center py-4 eyebrow bg-primary text-primary-foreground active:opacity-90 transition-opacity"
      >
        Free Quote
      </Link>
    </div>
  );
};

export default MobileCTABar;
