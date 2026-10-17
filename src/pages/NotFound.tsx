import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { BUSINESS } from "@/data/business";
import { coreServices } from "@/data/services";

/**
 * The 404. It says what happened in one line, then makes "everything we do is
 * still one click away" literally true: the services sit beside it as the same
 * ruled, numbered list the homepage uses, so a dead link still lands somewhere
 * useful. Above the fold, so no JS reveal; the headline rises in CSS only.
 */
const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <SEO
        title="Page Not Found | Firm Foundation Property Services"
        description="That page doesn't exist. Head back to Firm Foundation for landscaping, hardscapes, excavation, pool and pond prep, and land clearing in Mount Pleasant, SC."
        noindex
      />

      <main id="main" className="flex flex-1 items-center px-5 pb-20 pt-28 sm:px-6 md:px-10 md:pb-28 md:pt-36">
        <div className="mx-auto grid w-full max-w-content grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-0 [&>*]:min-w-0">
          <div className="lg:col-span-7 lg:pr-16 xl:pr-24">
            <p className="mark mb-5">Error 404</p>
            <h1 className="text-hero font-heading leading-[1] text-foreground md:text-[clamp(3.5rem,6vw,5.75rem)] md:leading-[0.98]">
              <span className="hero-line">
                <span style={{ animationDelay: "0ms" }}>This page</span>
              </span>{" "}
              <span className="hero-line">
                <span style={{ animationDelay: "60ms" }}>isn&rsquo;t here</span>
              </span>
            </h1>
            <p className="mt-7 max-w-lg text-subtitle leading-relaxed text-muted-foreground">
              The link may be old or mistyped. Everything we do is still one click
              away.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button asChild size="lg">
                <Link to="/">Back to home</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/services">Our services</Link>
              </Button>
            </div>
            <p className="mt-10 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-muted-foreground">
              Or just call us:{" "}
              <a
                href={BUSINESS.phoneHref}
                className="font-serif text-2xl font-semibold leading-none text-foreground underline decoration-foreground/25 decoration-1 underline-offset-[7px] transition-colors hover:decoration-foreground"
              >
                {BUSINESS.phone}
              </a>
            </p>
          </div>

          {/* The business card's vertical rule, then the services, ruled. */}
          <nav aria-label="Services" className="lg:col-span-5 lg:self-center lg:border-l lg:border-border lg:pl-12 xl:pl-16">
            <ol className="border-t border-border">
              {coreServices.map((service, i) => (
                <li key={service.slug} className="border-b border-border">
                  <Link
                    to={`/services/${service.slug}`}
                    className="group grid grid-cols-[2rem_minmax(0,1fr)_auto] items-baseline gap-x-3 py-4 md:py-5"
                  >
                    <span className="font-serif text-sm tabular-nums text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-heading text-[1.625rem] leading-none text-foreground transition-colors duration-300 group-hover:text-primary md:text-[1.875rem]">
                      {service.title}
                    </span>
                    <ArrowUpRight
                      className="h-5 w-5 self-center text-muted-foreground transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
