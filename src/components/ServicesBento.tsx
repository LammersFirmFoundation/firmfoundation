import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import FadeInView from "@/components/animations/FadeInView";
import ServiceImage from "@/components/ServiceImage";
import { coreServices, moreServices, type Service } from "@/data/services";
import { cn } from "@/lib/utils";

/** The photo a card shows: its own `cardImage` if it has one, else the service photo. */
const cardPhoto = (s: Service) =>
  s.cardImage
    ? { src: s.cardImage, srcSet: s.cardImageSrcSet, alt: s.cardAlt ?? "" }
    : s.image
      ? { src: s.image, srcSet: s.imageSrcSet, alt: s.alt ?? "" }
      : null;

/**
 * A card's picture. A photo when there is one, uncovered once as it scrolls
 * in; the section drawing when there isn't. Decorative either way: the card's
 * link text already names the service.
 */
const CardVisual = ({
  service,
  number,
  sizes,
  className,
  lead = false,
}: {
  service: Service;
  number: number;
  sizes: string;
  className?: string;
  lead?: boolean;
}) => {
  const reduce = useReducedMotion();
  const photo = cardPhoto(service);

  if (!photo) {
    return (
      <ServiceImage
        service={service}
        preferPlate
        decorative
        compact={!lead}
        number={number}
        fill={lead}
        className={cn("rounded-none border-0 border-b", className)}
      />
    );
  }

  return (
    <motion.div
      className={cn("relative overflow-hidden bg-muted", className)}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={reduce ? { duration: 0 } : { duration: 1.1, delay: 0.05 * number, ease: [0.22, 1, 0.36, 1] }}
    >
      <img
        src={photo.src}
        srcSet={photo.srcSet}
        sizes={sizes}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.04]"
      />
      <span className="absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-1 eyebrow text-[0.625rem] text-primary backdrop-blur-sm">
        {String(number).padStart(2, "0")}
      </span>
    </motion.div>
  );
};

/**
 * The five core services as one composed grid, plus the "smaller jobs" tile.
 *
 * Land clearing gets the big tile: it is the lead service and the headline of
 * Josiah's ad. The sixth cell is the smaller tier — present, linked, visibly
 * secondary, which is what Josiah asked for.
 *
 * On a phone the four smaller cards become compact rows with a thumbnail:
 * five stacked image cards was once the biggest block on the homepage.
 */
const ServicesBento = () => {
  const [lead, ...rest] = coreServices;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
      <FadeInView className="sm:col-span-2 lg:row-span-2">
        <Link
          to={`/services/${lead.slug}`}
          className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-[border-color,transform] duration-500 hover:-translate-y-0.5 hover:border-primary/60"
        >
          <CardVisual
            service={lead}
            number={1}
            lead
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:min-h-[22rem] lg:flex-1"
          />
          <div className="flex items-end justify-between gap-6 border-t border-border p-6 md:p-8">
            <div className="min-w-0">
              <span className="eyebrow text-primary">Lead service</span>
              <h3 className="mt-3 font-heading text-3xl font-extralight leading-none text-card-foreground md:text-[2.75rem]">
                {lead.title}
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {lead.summary}
              </p>
            </div>
            <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border text-primary transition-colors duration-500 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground sm:flex">
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>
        </Link>
      </FadeInView>

      {rest.map((service, i) => {
        const photo = cardPhoto(service);
        return (
          <FadeInView key={service.slug} delay={0.06 * (i + 1)}>
            <Link
              to={`/services/${service.slug}`}
              className="group flex h-full items-center gap-4 overflow-hidden rounded-lg border border-border bg-card p-3 transition-[border-color,transform] duration-500 hover:-translate-y-0.5 hover:border-primary/60 sm:flex-col sm:items-stretch sm:gap-0 sm:p-0"
            >
              {/* Phone: a small square thumbnail beside the text. */}
              {photo && (
                <img
                  src={photo.src}
                  srcSet={photo.srcSet}
                  sizes="80px"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-md object-cover sm:hidden"
                />
              )}
              {/* Wider: the full card picture on top. */}
              <div className="hidden sm:block">
                <CardVisual
                  service={service}
                  number={i + 2}
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="aspect-[16/10]"
                />
              </div>
              <div className="flex flex-1 items-start justify-between gap-4 sm:p-6">
                <div className="min-w-0">
                  <h3 className="font-heading text-xl font-extralight leading-tight text-card-foreground md:text-2xl">
                    {service.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground sm:mt-2">
                    {service.navBlurb}
                  </p>
                </div>
                <ArrowUpRight
                  className="mt-1 h-5 w-5 shrink-0 text-primary transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </div>
            </Link>
          </FadeInView>
        );
      })}

      <FadeInView delay={0.3}>
        <div className="flex h-full flex-col justify-between rounded-lg border border-dashed border-border p-5 md:p-6">
          <div>
            <p className="eyebrow text-muted-foreground">Smaller jobs, still on request</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Patios, beds and one-off builds, usually as the finish on bigger ground work.
            </p>
          </div>
          <ul className="mt-5 divide-y divide-border border-y border-border">
            {moreServices.map((service) => (
              <li key={service.slug}>
                <Link
                  to={`/services/${service.slug}`}
                  className="group flex min-h-[44px] items-center justify-between gap-3 py-2.5 text-sm text-foreground/80 transition-colors hover:text-primary"
                >
                  {service.title}
                  <ArrowUpRight className="h-4 w-4 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </FadeInView>
    </div>
  );
};

export default ServicesBento;
