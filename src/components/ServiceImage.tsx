import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Service } from "@/data/services";
import ServicePlate, { plateDescriptions } from "@/components/ServicePlate";

interface ServiceImageProps {
  /** Override the default 4:3 frame. Applies to photos; a plate keeps its own 8:5 drawing area. */
  aspect?: string;
  service: Service;
  className?: string;
  /** Loading hint — the first card on a page should not be lazy. */
  eager?: boolean;
  /**
   * How wide this image renders, so the browser can pick a variant. Defaults to
   * the two-column layout used on /services and each service page.
   */
  sizes?: string;
  /** Force the section drawing even when a photo exists. */
  preferPlate?: boolean;
  /** Passed to the plate: drop its callouts at card size. */
  compact?: boolean;
  /** Plate number for the title block. */
  number?: number;
  /** Hide the drawing from assistive tech when surrounding text already names the service. */
  decorative?: boolean;
  /** Plate only: stretch to the parent's height instead of keeping 8:5. */
  fill?: boolean;
}

/**
 * A service's photo, or its section drawing when there is no photo yet.
 *
 * Dropping a real photo in later is a one-line change in `services.ts` — the
 * drawing steps aside on its own. Until then no service shows an empty frame,
 * and none shows a stock photo of somebody else's work.
 */
const ServiceImage = ({
  service,
  className,
  eager = false,
  aspect = "aspect-[4/3]",
  sizes = "(min-width: 768px) 50vw, 100vw",
  preferPlate = false,
  compact = false,
  number,
  decorative = false,
  fill = false,
}: ServiceImageProps) => {
  const shouldReduceMotion = useReducedMotion();

  if (service.plate && (preferPlate || !service.image)) {
    return (
      <ServicePlate
        plate={service.plate}
        number={number}
        compact={compact}
        decorative={decorative}
        fill={fill}
        label={plateDescriptions[service.plate]}
        className={className}
      />
    );
  }

  if (!service.image) return null;

  // Below the fold, the photo is uncovered bottom-up as it arrives: a
  // curtain, once. Motion lives on imagery rather than text on purpose (NN/g:
  // animated text reads as waiting). Never above the fold — `eager` images are
  // the first screen, and they should simply be there.
  const reveal = !eager && !shouldReduceMotion;

  return (
    <motion.div
      className={cn(aspect, "rounded-lg overflow-hidden", className)}
      initial={reveal ? { clipPath: "inset(100% 0% 0% 0%)" } : false}
      whileInView={reveal ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.img
        src={service.image}
        // WebP variants at 640/1024/1600. `src` stays the original JPEG, so
        // anything that doesn't understand srcset still gets a photo.
        srcSet={service.imageSrcSet}
        sizes={sizes}
        alt={service.alt ?? ""}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        width={1200}
        height={900}
        initial={reveal ? { scale: 1.14 } : undefined}
        whileInView={reveal ? { scale: 1 } : undefined}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full object-cover will-change-transform"
      />
    </motion.div>
  );
};

export default ServiceImage;
