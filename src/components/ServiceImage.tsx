import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Service } from "@/data/services";
import { BUSINESS } from "@/data/business";

interface ServiceImageProps {
  /** Override the default 4:3 frame. */
  aspect?: string;
  service: Service;
  className?: string;
  /** Loading hint — the first card on a page should not be lazy. */
  eager?: boolean;
}

/**
 * Renders a service's photo, or a branded panel when we don't have one yet.
 * A newly launched service line shouldn't leave a broken frame on the page, and
 * dropping the real photo in later is a one-line change in `services.ts`.
 */
const ServiceImage = ({
  service,
  className,
  eager = false,
  aspect = "aspect-[4/3]",
}: ServiceImageProps) => {
  const shouldReduceMotion = useReducedMotion();

  if (service.image) {
    return (
      <div className={cn(aspect, "rounded-lg overflow-hidden", className)}>
        <motion.img
          src={service.image}
          alt={service.alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          width={1200}
          height={900}
          initial={shouldReduceMotion ? undefined : { scale: 1.12 }}
          whileInView={shouldReduceMotion ? undefined : { scale: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full object-cover will-change-transform"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        aspect,
        "rounded-lg overflow-hidden relative flex items-center justify-center",
        "bg-gradient-to-br from-[hsl(220,20%,10%)] to-[hsl(210,50%,22%)]",
        className
      )}
      role="img"
      aria-label={`${service.title} — photo coming soon`}
    >
      {/* Contour lines — a quiet nod to grading work, drawn rather than photographed. */}
      <svg
        className="absolute inset-0 h-full w-full text-white/[0.07]"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path
            key={i}
            d={`M-20 ${70 + i * 38} C 80 ${30 + i * 38}, 160 ${110 + i * 38}, 260 ${60 + i * 38} S 380 ${20 + i * 38}, 420 ${75 + i * 38}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        ))}
      </svg>
      <div className="relative text-center px-6">
        <div className="text-xs uppercase tracking-[0.2em] text-white/50 mb-3">
          {BUSINESS.shortName}
        </div>
        <div className="text-2xl md:text-3xl font-bold text-white font-heading">
          {service.title}
        </div>
      </div>
    </div>
  );
};

export default ServiceImage;
