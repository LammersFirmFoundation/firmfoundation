import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import FadeInView from "@/components/animations/FadeInView";
import { coreServices, moreServices } from "@/data/services";

/**
 * The services as a typeset list, the way Josiah's business card lists them:
 * big names, one per line, ruled. No cards, no thumbnails: the hero above
 * already carries the photographs, and a grid of image cards is what every
 * template does. Each row is the whole link, so the target is wide.
 *
 * No index numbers: the services are not a sequence, and "01 to 05" in front
 * of them carried no information (design review, 2026-10-17). The arrow is a
 * plain →, because every row goes somewhere on this site; ↗ means "leaves".
 */
const ServicesIndex = () => (
  <FadeInView>
    <ul className="border-t border-border">
      {coreServices.map((service) => (
        <li key={service.slug} className="border-b border-border">
          <Link
            to={`/services/${service.slug}`}
            className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 py-5 transition-colors md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto] md:gap-x-8 md:py-7"
          >
            <span className="font-heading text-[clamp(1.75rem,4.2vw,3.25rem)] leading-[0.95] text-foreground transition-colors duration-300 group-hover:text-primary">
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

export default ServicesIndex;
