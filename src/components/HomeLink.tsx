import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { BUSINESS } from "@/data/business";

/**
 * The logo's link home. Already on the homepage, a link to "/" does nothing,
 * so a visitor halfway down who taps the logo to "go home" got nothing at all
 * (Josiah, 2026-10-27). There it goes back to the top instead.
 */
const HomeLink = ({
  children,
  className,
  hidden = false,
}: {
  children: ReactNode;
  className?: string;
  /** Out of sight for now (the homepage's own big logo is on screen), so out
   *  of the tab order and the accessibility tree too. */
  hidden?: boolean;
}) => {
  const { pathname } = useLocation();
  return (
    <Link
      to="/"
      className={className}
      aria-label={`${BUSINESS.name}, home`}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      onClick={(e) => {
        if (pathname !== "/") return;
        e.preventDefault();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
    >
      {children}
    </Link>
  );
};

export default HomeLink;
