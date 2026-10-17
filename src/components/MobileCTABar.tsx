import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageSquare, Phone } from "lucide-react";
import { ACCEPTS_SMS, BUSINESS, smsHref } from "@/data/business";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Call and Text: plain sentence-case labels, square, a full 48px tall. */
const quiet =
  "flex h-12 items-center justify-center gap-2 rounded-[3px] text-[0.9375rem] font-semibold text-foreground transition-colors active:bg-foreground/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

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
    // A labelled landmark, so the bar is never content floating outside one.
    <nav
      aria-label="Call, text or get a quote"
      {...(!show ? { inert: "", "aria-hidden": true } : {})}
      className={`fixed bottom-0 inset-x-0 z-40 md:hidden border-t border-border bg-background/95 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-500 ease-editorial ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* One solid action and two quiet ones, the same weighting as the
          header: the phone is a plain label, the quote is the button. */}
      <div className={`grid items-center ${ACCEPTS_SMS ? "grid-cols-[1fr_1fr_1.3fr]" : "grid-cols-[1fr_1.3fr]"}`}>
        <a
          href={BUSINESS.phoneHref}
          data-analytics-where="mobile-bar"
          className={quiet}
          aria-label={`Call Firm Foundation at ${BUSINESS.phone}`}
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call
        </a>
        {ACCEPTS_SMS && (
          <a
            href={smsHref}
            data-analytics-where="mobile-bar-text"
            className={cn(quiet, "border-l border-border")}
            aria-label={`Text Firm Foundation at ${BUSINESS.phone}`}
          >
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
            Text
          </a>
        )}
        <Link to="/contact" className={cn(buttonVariants(), "ml-2 h-12 px-3")}>
          Free quote
        </Link>
      </div>
    </nav>
  );
};

export default MobileCTABar;
