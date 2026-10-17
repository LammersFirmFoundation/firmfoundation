import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import FadeInView from "@/components/animations/FadeInView";
import ServicePlate, { plateDescriptions } from "@/components/ServicePlate";
import { coreServices, moreServices, type Service } from "@/data/services";
import { cn } from "@/lib/utils";

const PREVIEW_W = 300;
const PREVIEW_H = 225;
const GAP = 32;
const EASE = [0.22, 1, 0.36, 1] as const;

/** The finished job where there is one, else the service's own photo. */
const previewPhoto = (s: Service) =>
  s.beforeAfter
    ? { src: s.beforeAfter.after, srcSet: s.beforeAfter.afterSrcSet }
    : s.image
      ? { src: s.cardImage ?? s.image, srcSet: s.cardImage ? s.cardImageSrcSet : s.imageSrcSet }
      : null;

/**
 * The services as a typeset list, the way Josiah's business card lists them:
 * big names, one per line, ruled. No cards, no thumbnails: the hero above
 * already carries the photographs, and a grid of image cards is what every
 * template does. Each row is the whole link, so the target is wide.
 *
 * On a desktop with a mouse, hovering a row brings up a photo of that work
 * beside the cursor (the drawing, for a service with no photo yet), the way
 * a printed index is read with the pictures to hand. It is enhancement only:
 * nothing of it is in the prerendered page, it is only turned on after mount
 * where the pointer can hover, and never under reduced motion, so a phone,
 * a keyboard or a crawler gets exactly the list. The pictures mount the first
 * time the pointer comes near, not with the page.
 *
 * No index numbers: the services are not a sequence, and "01 to 05" in front
 * of them carried no information (design review, 2026-10-17). The arrow is a
 * plain →, because every row goes somewhere on this site; ↗ means "leaves".
 */
const ServicesIndex = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [canPreview, setCanPreview] = useState(false);
  const [armed, setArmed] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  // Where the hovered name ends, so the picture never covers the very words
  // the pointer is on.
  const titleRight = useRef(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 28, mass: 0.6 });

  useEffect(() => {
    const mq = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setCanPreview(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const place = (clientX: number, clientY: number, snap: boolean) => {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box) return;
    const cx = clientX - box.left;
    // Beside the cursor and clear of the hovered name; on the cursor's left
    // only when the right runs out of room (over the arrow column).
    const right = Math.max(cx, titleRight.current) + GAP;
    const nx = right + PREVIEW_W <= box.width ? right : cx - GAP - PREVIEW_W;
    const ny = clientY - box.top - PREVIEW_H / 2;
    x.set(nx);
    y.set(ny);
    if (snap) {
      sx.jump(nx);
      sy.jump(ny);
    }
  };

  return (
    <FadeInView>
      <div
        ref={boxRef}
        className="relative"
        onPointerEnter={canPreview ? () => setArmed(true) : undefined}
        onPointerMove={canPreview ? (e) => place(e.clientX, e.clientY, active === null) : undefined}
      >
        <ul className="border-t border-border" onPointerLeave={() => setActive(null)}>
          {coreServices.map((service, i) => (
            <li
              key={service.slug}
              className="border-b border-border"
              onPointerEnter={
                canPreview
                  ? (e) => {
                      const name = e.currentTarget.querySelector("[data-name]");
                      const box = boxRef.current?.getBoundingClientRect();
                      if (name && box) titleRight.current = name.getBoundingClientRect().right - box.left;
                      setActive(i);
                    }
                  : undefined
              }
            >
              <Link
                to={`/services/${service.slug}`}
                className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 py-5 transition-colors md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto] md:gap-x-8 md:py-7"
              >
                <span data-name className="justify-self-start font-heading text-[clamp(1.75rem,4.2vw,3.25rem)] leading-[0.95] text-foreground transition-[color,transform] duration-500 ease-editorial group-hover:text-primary md:group-hover:translate-x-2">
                  {service.title}
                </span>
                <span className="col-start-1 row-start-2 mt-2 text-sm leading-relaxed text-muted-foreground md:col-start-2 md:row-start-1 md:mt-0 md:text-base">
                  {service.navBlurb}
                </span>
                <ArrowRight
                  className="col-start-2 row-start-1 h-5 w-5 self-center text-muted-foreground transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-primary md:col-start-3"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>

        {canPreview && armed && (
          <motion.div
            aria-hidden="true"
            style={{ x: sx, y: sy, width: PREVIEW_W, height: PREVIEW_H }}
            initial={false}
            animate={{ opacity: active === null ? 0 : 1, scale: active === null ? 0.94 : 1 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="pointer-events-none absolute left-0 top-0 z-20 overflow-hidden rounded-[3px] bg-muted shadow-[0_24px_48px_-24px_hsl(var(--foreground)/0.45)]"
          >
            {coreServices.map((s, i) => {
              const photo = previewPhoto(s);
              return (
                <div
                  key={s.slug}
                  className={cn(
                    "absolute inset-0 transition-[opacity,transform] duration-500 ease-editorial",
                    i === active ? "scale-100 opacity-100" : "scale-[1.06] opacity-0",
                  )}
                >
                  {photo ? (
                    <img
                      src={photo.src}
                      srcSet={photo.srcSet}
                      sizes={`${PREVIEW_W}px`}
                      alt=""
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  ) : s.plate ? (
                    <ServicePlate
                      plate={s.plate}
                      compact
                      decorative
                      label={plateDescriptions[s.plate]}
                      className="h-full w-full border-0"
                    />
                  ) : null}
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
      <p className="mt-7 leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">Also:</span>{" "}
        {moreServices.map((service, i) => (
          <span key={service.slug}>
            <Link
              to={`/services/${service.slug}`}
              className="text-foreground underline decoration-foreground/25 underline-offset-[5px] transition-colors hover:decoration-foreground"
            >
              {service.title.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
            </Link>
            {i < moreServices.length - 2 ? ", " : i === moreServices.length - 2 ? " and " : "."}
          </span>
        ))}
      </p>
    </FadeInView>
  );
};

export default ServicesIndex;
