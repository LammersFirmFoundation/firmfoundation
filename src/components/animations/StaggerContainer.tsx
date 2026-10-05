import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

// Reduced motion gets `shown`: the end state, no stagger, no transition. The
// start state is `hidden` for everyone, because reduced motion is unknown while
// prerendering and markup that depended on it broke hydration (CLAUDE.md,
// "Reduced motion").
const containerVariants = (staggerDelay: number) => ({
  hidden: {},
  shown: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
    },
  },
});

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 30 },
  shown: { opacity: 1, y: 0, transition: { duration: 0 } },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const StaggerContainer = ({
  children,
  className,
  staggerDelay = 0.1,
}: StaggerContainerProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={containerVariants(staggerDelay)}
      initial="hidden"
      whileInView={shouldReduceMotion ? "shown" : "visible"}
      viewport={{ once: true, margin: "-80px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  );
};

export default StaggerContainer;
