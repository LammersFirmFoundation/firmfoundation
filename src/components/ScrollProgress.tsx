import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Hairline progress bar pinned under the header. It costs almost nothing and
 * gives long editorial pages a sense of position while you scroll.
 *
 * Hidden under reduced motion by CSS (`motion-reduce:hidden`), never by
 * returning null: `useReducedMotion()` is false while prerendering and true on
 * the visitor's first render, so a null here broke hydration on every page for
 * those visitors (see "Reduced motion" in CLAUDE.md).
 */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      aria-hidden="true"
      className="fixed left-0 right-0 top-0 z-[60] h-0.5 origin-left bg-primary motion-reduce:hidden"
    />
  );
};

export default ScrollProgress;
