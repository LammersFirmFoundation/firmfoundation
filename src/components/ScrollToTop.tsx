import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * New page, top of the page — unless the link named a section (`/#reviews`), in
 * which case land on that section. Without the hash branch, a link into a
 * homepage section from another page dropped people at the hero instead.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // A frame for the new route to render before looking for the target.
      const id = requestAnimationFrame(() =>
        document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" })
      );
      return () => cancelAnimationFrame(id);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
