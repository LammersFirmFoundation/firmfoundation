import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import FadeInView from "@/components/animations/FadeInView";
import ServiceImage from "@/components/ServiceImage";
import BeforeAfterPair from "@/components/BeforeAfterPair";
import { coreServices, moreServices, type Service } from "@/data/services";
import { cn } from "@/lib/utils";

/** The photo a card shows: its own `cardImage` if it has one, else the service photo. */
const cardPhoto = (s: Service) =>
  s.cardImage
    ? { src: s.cardImage, srcSet: s.cardImageSrcSet }
    : s.image
      ? { src: s.image, srcSet: s.imageSrcSet }
      : null;

/** Halve every width in a `sizes` string: each half of a pair is half the card. */
const halfSizes = (sizes: string) => sizes.replace(/(\d+)vw/g, (_, n) => `${Math.round(+n / 2)}vw`);

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Uncovers a picture bottom-up, once, as it scrolls in: the same curtain as
 * every other photo on the site. `eager` pictures are the first screen, so
 * they skip it and simply paint. That depends on a prop only; reduced motion
 * may zero the transition but never change the start state, or prerendered
 * markup stops matching (CLAUDE.md, "Reduced motion").
 */
const Curtain = ({ eager, delay, className, children }: { eager: boolean; delay: number; className?: string; children: ReactNode }) => {
  const reduce = useReducedMotion();
  if (eager) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={reduce ? { duration: 0 } : { duration: 1.1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
};

/**
 * A card's picture: the same-spot before and after where Josiah has one, his
 * photo where there is one, and the section drawing where there isn't.
 * Decorative in the last two cases: the caption under it names the service.
 */
const Picture = ({
  service,
  sizes,
  aspect,
  eager,
  delay,
}: {
  service: Service;
  sizes: string;
  aspect: string;
  eager: boolean;
  delay: number;
}) => {
  const photo = cardPhoto(service);
  const zoom = "transition-transform duration-700 ease-editorial group-hover:scale-[1.035]";

  if (service.beforeAfter) {
    return (
      <Curtain eager={eager} delay={delay} className={cn(aspect, "overflow-hidden rounded-[3px]")}>
        <BeforeAfterPair
          pair={service.beforeAfter}
          eager={eager}
          sizes={halfSizes(sizes)}
          className="h-full"
          imgClassName={zoom}
        />
      </Curtain>
    );
  }

  if (!photo) {
    return (
      <div className={aspect}>
        <ServiceImage service={service} preferPlate decorative compact fill className="h-full" />
      </div>
    );
  }

  return (
    <Curtain eager={eager} delay={delay} className={cn(aspect, "relative overflow-hidden rounded-[3px] bg-muted")}>
      <img
        src={photo.src}
        srcSet={photo.srcSet}
        sizes={sizes}
        alt=""
        width={1200}
        height={900}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={cn("absolute inset-0 h-full w-full object-cover", zoom)}
      />
    </Curtain>
  );
};

/**
 * One service as a printed plate: the picture, a hairline, and a caption set
 * under it. Nothing is laid over the photograph, and there is no index
 * numeral: the services are not a sequence, so "01 to 05" said nothing
 * (design review, 2026-10-17). `index` only staggers the reveal.
 */
const ServiceFigure = ({
  service,
  index,
  sizes,
  aspect,
  blurb,
  eager = false,
  large = false,
  className,
}: {
  service: Service;
  index: number;
  sizes: string;
  aspect: string;
  blurb: string;
  eager?: boolean;
  large?: boolean;
  className?: string;
}) => (
  <li className={cn("min-w-0", className)}>
    <Link
      to={`/services/${service.slug}`}
      className="group block rounded-[3px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <Picture service={service} sizes={sizes} aspect={aspect} eager={eager} delay={0.06 * index} />
      <FadeInView immediate={eager} delay={0.06 * index + 0.1}>
        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 border-t border-border pt-4 md:mt-5 md:pt-5">
          <h3
            className={cn(
              "font-heading leading-none text-foreground underline decoration-transparent decoration-1 underline-offset-[6px] transition-colors duration-300 group-hover:decoration-foreground/35",
              large ? "text-[1.75rem] md:text-[2.25rem]" : "text-2xl md:text-[1.75rem]",
            )}
          >
            {service.title}
          </h3>
          <ArrowRight
            className="h-5 w-5 self-center text-muted-foreground transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-foreground"
            aria-hidden="true"
          />
          <p
            className={cn(
              "col-span-2 mt-2.5 leading-relaxed text-muted-foreground",
              large ? "max-w-lg md:text-[1.0625rem]" : "text-[0.9375rem]",
            )}
          >
            {blurb}
          </p>
        </div>
      </FadeInView>
    </Link>
  </li>
);

/**
 * Every service on one sheet, for `/services`. (The homepage sets the same
 * list as type, in `ServicesIndex`, because its hero already carries the
 * photographs.)
 *
 * The five services on Josiah's own flyer and card lead, in his order
 * (2026-10-17). Landscaping and hardscapes, the two he has a same-spot before
 * and after for, take the first row at full size, because that pair is the
 * proof a homeowner trusts most. The three dirt-work services follow, three
 * across. The rest of the work he takes on is a ruled list under them,
 * present and linked, without competing for the lead.
 *
 * No boxes and no badges: a picture, a hairline, a caption. The first row is
 * the first screen, so it loads eagerly and does not animate.
 */
const ServicesBento = () => {
  const [first, second, ...rest] = coreServices;

  return (
    <>
      <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 sm:gap-y-14 lg:grid-cols-6 lg:gap-x-8 lg:gap-y-20">
        {[first, second].map((service, i) => (
          <ServiceFigure
            key={service.slug}
            service={service}
            index={i}
            eager
            large
            blurb={service.summary}
            sizes="(min-width: 1024px) 45vw, (min-width: 640px) 50vw, 100vw"
            aspect="aspect-[4/3] lg:aspect-[5/4]"
            className="lg:col-span-3"
          />
        ))}
        {rest.map((service, i) => {
          // The odd one out at two-up spans the row, so the grid never ends on
          // a hole; at three-up it falls back into line.
          const last = i === rest.length - 1 && rest.length % 2 === 1;
          return (
            <ServiceFigure
              key={service.slug}
              service={service}
              index={i + 2}
              blurb={service.navBlurb}
              sizes={last ? "(min-width: 1024px) 30vw, 100vw" : "(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"}
              aspect={cn("aspect-[16/10] lg:aspect-[4/3]", last ? "sm:aspect-[21/9]" : "sm:aspect-[4/3]")}
              className={cn("lg:col-span-2", last && "sm:col-span-2")}
            />
          );
        })}
      </ul>

      {/* The rest of the work: the same rule, set as a list beside a note. */}
      <div className="mt-20 grid grid-cols-1 gap-8 md:mt-28 lg:grid-cols-12 lg:gap-10">
        <FadeInView className="lg:col-span-4">
          <h3 className="font-heading text-[1.75rem] leading-none text-foreground md:text-[2.25rem]">
            Also from Firm Foundation
          </h3>
          <p className="mt-4 max-w-sm leading-relaxed text-muted-foreground">
            The jobs that come up around the ones above, and the one-offs that fit no list.
          </p>
        </FadeInView>
        <FadeInView delay={0.08} className="lg:col-span-8">
          <ul className="border-t border-border">
            {moreServices.map((service) => (
              <li key={service.slug} className="border-b border-border">
                <Link
                  to={`/services/${service.slug}`}
                  className="group grid min-h-[44px] grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_auto] md:gap-x-8 md:py-6"
                >
                  <span className="font-heading text-xl leading-tight text-foreground underline decoration-transparent decoration-1 underline-offset-[5px] transition-colors duration-300 group-hover:decoration-foreground/35 md:text-2xl">
                    {service.title}
                  </span>
                  <span className="col-start-1 row-start-2 mt-1.5 text-sm leading-relaxed text-muted-foreground md:col-start-2 md:row-start-1 md:mt-0 md:text-base">
                    {service.navBlurb}
                  </span>
                  <ArrowRight
                    className="col-start-2 row-start-1 h-5 w-5 self-center text-muted-foreground transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-foreground md:col-start-3"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </FadeInView>
      </div>
    </>
  );
};

export default ServicesBento;
