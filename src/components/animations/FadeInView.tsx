import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInViewProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  className?: string;
  /**
   * Render visible immediately, with no reveal. Required for anything above
   * the fold: `whileInView` starts at opacity:0, and vite-react-ssg bakes that
   * start state into the prerendered HTML — so the hero headline and its call
   * CTA shipped invisible and only painted once framer-motion hydrated. On a
   * throttled phone that is a blank hero for the whole of that wait, on the one
   * page whose entire job is getting someone to call.
   */
  immediate?: boolean;
}

const directionOffset = {
  up: { y: 56 },
  down: { y: -56 },
  left: { x: 56 },
  right: { x: -56 },
  none: {},
};

/**
 * Scroll reveal. The long duration and expo-out curve are what make the
 * reference site's scrolling feel unhurried — a short linear-ish fade reads
 * cheap by comparison. Elements also start very slightly small so they settle
 * into place rather than just sliding.
 */
const EDITORIAL_EASE = [0.22, 1, 0.36, 1] as const;

const FadeInView = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.95,
  className,
  immediate = false,
}: FadeInViewProps) => {
  const shouldReduceMotion = useReducedMotion();

  if (immediate || shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.985, ...directionOffset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration, delay, ease: EDITORIAL_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeInView;
