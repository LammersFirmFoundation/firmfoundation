import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import FadeInView from "@/components/animations/FadeInView";
import ServiceImage from "@/components/ServiceImage";
import { coreServices, moreServices } from "@/data/services";

/**
 * The five core services as one composed grid rather than five equal cards.
 *
 * Land clearing gets the big tile because it is the lead service and the
 * headline of Josiah's ad. All five carry their section drawings, so the grid
 * reads as one numbered drawing set. The sixth cell is the "smaller jobs" tier: present, linked,
 * and visibly secondary, which is exactly what Josiah asked for.
 *
 * On a phone the drawings drop away and the four become compact rows — a
 * drawing at 340px wide is a thumbnail nobody can read, and five stacked image
 * cards was the single biggest block on the old homepage.
 */
const ServicesBento = () => {
  const [lead, ...rest] = coreServices;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
      <FadeInView className="sm:col-span-2 lg:row-span-2">
        <Link
          to={`/services/${lead.slug}`}
          className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors duration-500 hover:border-primary/60"
        >
          {/* The lead tile is drawing 01 at full size, callouts and all, rather
              than the photograph: the hero sits one screen above carrying that
              exact photo, and the same picture twice in one scroll reads as a
              site that only has one. Five drawings read as one drawing set. */}
          <ServiceImage
            service={lead}
            preferPlate
            decorative
            number={1}
            className="rounded-none border-0 border-b lg:flex-1"
            fill
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

      {rest.map((service, i) => (
        <FadeInView key={service.slug} delay={0.06 * (i + 1)}>
          <Link
            to={`/services/${service.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors duration-500 hover:border-primary/60"
          >
            <div className="hidden sm:block">
              <ServiceImage
                service={service}
                compact
                decorative
                number={i + 2}
                className="rounded-none border-0 border-b"
              />
            </div>
            <div className="flex flex-1 items-start justify-between gap-4 p-5 md:p-6">
              <div className="min-w-0">
                <span className="eyebrow text-primary sm:hidden">
                  {String(i + 2).padStart(2, "0")}
                </span>
                <h3 className="mt-1.5 font-heading text-xl font-extralight leading-tight text-card-foreground sm:mt-0 md:text-2xl">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
      ))}

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
