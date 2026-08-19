import { useEffect } from "react";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { track } from "@vercel/analytics";

/**
 * Page views plus the two events that actually matter for this business:
 * tapping the phone number and submitting the quote form.
 *
 * Phone taps are caught with one delegated listener rather than an onClick on
 * every tel: link — there are eight of them across the header, footer, mobile
 * bar, contact page, and every CTA, and they'd drift apart.
 */
const Analytics = () => {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.("a");
      if (!link) return;

      const href = link.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) {
        // `where` tells us which CTA is actually earning the calls.
        track("phone_click", { where: link.dataset.analyticsWhere ?? "unknown" });
      } else if (href.startsWith("mailto:")) {
        track("email_click");
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Speed Insights is deliberately NOT mounted: it's a separately billed Vercel
  // product, and Will's instruction was no extra spend. Core Web Vitals are
  // measured locally with Lighthouse/Playwright instead, which costs nothing.
  return <VercelAnalytics />;
};

/** Fired from the contact form once Formspree accepts the submission. */
export const trackQuoteRequest = (service: string) =>
  track("quote_request", { service });

export default Analytics;
