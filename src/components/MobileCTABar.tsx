import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageSquare, Phone } from "lucide-react";
import { ACCEPTS_SMS, BUSINESS, smsHref } from "@/data/business";

/**
 * Sticky bottom action bar, mobile only. Click-to-call is the highest-value
 * action on a phone, so Call, Text and Free Quote stay one thumb-tap away.
 * Hidden at md+ where the header already carries them.
 *
 * It slides in only once the page's own buttons have scrolled away — the
 * homepage hero's (`#hero-actions`), or the first 240px anywhere else — so the
 * first screen never shows the same three actions twice. Conversion Rate
 * Experts measured a sticky CTA that appears after scroll at +25%. While it is
 * off-screen it is `inert`, so keyboard and screen-reader users never land on
 * buttons nobody can see.
 */
const MobileCTABar = () => {
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const target = document.getElementById("hero-actions");
    if (target && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(([entry]) =>
        setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0)
      );
      io.observe(target);
      return () => io.disconnect();
    }
    const onScroll = () => setShow(window.scrollY > 240);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <div
      {...(!show ? { inert: "", "aria-hidden": true } : {})}
      className={`fixed bottom-0 inset-x-0 z-40 md:hidden grid ${
        ACCEPTS_SMS ? "grid-cols-3" : "grid-cols-2"
      } border-t border-border bg-background/95 backdrop-blur-md transition-transform duration-500 ease-editorial ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <a
        href={BUSINESS.phoneHref}
        data-analytics-where="mobile-bar"
        className="flex items-center justify-center gap-2 py-4 eyebrow text-foreground active:bg-muted transition-colors"
        aria-label={`Call Firm Foundation at ${BUSINESS.phone}`}
      >
        <Phone className="h-4 w-4" aria-hidden="true" />
        Call
      </a>
      {ACCEPTS_SMS && (
        <a
          href={smsHref}
          data-analytics-where="mobile-bar-text"
          className="flex items-center justify-center gap-2 py-4 eyebrow text-foreground active:bg-muted transition-colors border-l border-border"
          aria-label={`Text Firm Foundation at ${BUSINESS.phone}`}
        >
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
          Text
        </a>
      )}
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
