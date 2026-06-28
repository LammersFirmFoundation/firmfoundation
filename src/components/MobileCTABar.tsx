import { Link } from "react-router-dom";
import { Phone } from "lucide-react";

/**
 * Sticky bottom action bar shown on mobile only. Click-to-call is the
 * highest-value action on a mobile service-business page, so we keep Call and
 * Free Quote one thumb-tap away on every screen. Hidden on md+ where the
 * header already exposes the phone number and quote button.
 */
const MobileCTABar = () => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden grid grid-cols-2 border-t border-border shadow-[0_-2px_12px_rgba(0,0,0,0.10)]">
      <a
        href="tel:8439985593"
        className="flex items-center justify-center gap-2 bg-background text-foreground font-semibold py-4 text-base active:bg-muted transition-colors"
        aria-label="Call Firm Foundation at (843) 998-5593"
      >
        <Phone className="h-5 w-5" aria-hidden="true" />
        Call
      </a>
      <Link
        to="/contact"
        className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-4 text-base active:opacity-90 transition-opacity"
      >
        Free Quote
      </Link>
    </div>
  );
};

export default MobileCTABar;
