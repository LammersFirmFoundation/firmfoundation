import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * Hairline progress bar pinned under the header. It costs almost nothing and
 * gives long editorial pages a sense of position while you scroll.
 */
const ScrollProgress = () => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      style={{ scaleX }}
      aria-hidden="true"
      className="fixed left-0 right-0 top-0 z-[60] h-0.5 origin-left bg-primary"
    />
  );
};

export default ScrollProgress;
