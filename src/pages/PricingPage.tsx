import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import FadeInView from "@/components/animations/FadeInView";
import StaggerContainer, { StaggerItem } from "@/components/animations/StaggerContainer";
import { Button } from "@/components/ui/button";
import { Check, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Half Day",
    price: "$349",
    period: "one-time",
    cta: "Book Now",
    highlighted: false,
    features: {
      assessment: true,
      repairs: true,
      preventative: false,
      priority: false,
      dedicated: false,
    },
    visits: "As needed",
  },
  {
    name: "Project Day",
    price: "$599",
    period: "full day",
    cta: "Book Now",
    highlighted: false,
    features: {
      assessment: true,
      repairs: true,
      preventative: false,
      priority: false,
      dedicated: false,
    },
    visits: "As needed",
  },
  {
    name: "Bronze",
    price: "$349",
    period: "/month",
    cta: "Get Started",
    highlighted: false,
    features: {
      assessment: true,
      repairs: true,
      preventative: true,
      priority: false,
      dedicated: false,
    },
    visits: "1x / month",
  },
  {
    name: "Silver",
    price: "$599",
    period: "/month",
    cta: "Get Started",
    highlighted: true,
    features: {
      assessment: true,
      repairs: true,
      preventative: true,
      priority: true,
      dedicated: false,
    },
    visits: "2x / month",
  },
  {
    name: "Gold",
    price: "$999",
    period: "/month",
    cta: "Get Started",
    highlighted: false,
    features: {
      assessment: true,
      repairs: true,
      preventative: true,
      priority: true,
      dedicated: true,
    },
    visits: "Weekly",
  },
];

const featureLabels = [
  { key: "assessment", label: "Full property assessment" },
  { key: "repairs", label: "Repairs & touch-ups" },
  { key: "preventative", label: "Preventative maintenance" },
  { key: "priority", label: "Priority scheduling" },
  { key: "dedicated", label: "Dedicated property manager" },
];

const coreServices = [
  "Pressure Washing",
  "Landscaping & Yard Care",
  "Window Washing",
  "Gutter Cleaning",
  "General Repairs",
  "Carpentry & Deck/Fence Repair",
];

const PricingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-[72px]">
        <SEO
          title="Pricing & Packages"
          description="Affordable property maintenance plans starting at $349. One-time and monthly packages for pressure washing, landscaping, and more in Mount Pleasant, SC."
          canonical="/pricing"
          keywords="property maintenance pricing, Mount Pleasant SC, pressure washing cost, landscaping packages, affordable property care"
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Property Maintenance Packages",
            provider: {
              "@type": "LocalBusiness",
              name: "Firm Foundation Property Maintenance",
              telephone: "(419) 419-8082",
              url: "https://firmfoundationsc.com",
            },
            areaServed: {
              "@type": "City",
              name: "Mount Pleasant",
              addressRegion: "SC",
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Maintenance Plans",
              itemListElement: plans.map((plan) => ({
                "@type": "Offer",
                name: plan.name,
                price: plan.price.replace("$", ""),
                priceCurrency: "USD",
                description: `${plan.name} plan — ${plan.visits} visits, ${plan.period}`,
              })),
            },
          }}
        />

        {/* Page Header */}
        <section className="py-20 md:py-28 px-4">
          <div className="container mx-auto max-w-content text-center">
            <FadeInView>
              <h1 className="text-hero md:text-display font-bold text-foreground tracking-tight font-heading mb-2">
                Pricing & Packages
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-2">
                We Handle It, So You Don't Have To
              </p>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Reliable property care with personal accountability — choose the
                plan that fits your lifestyle.
              </p>
            </FadeInView>

            {/* Core services strip */}
            <FadeInView delay={0.2}>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {coreServices.map((service) => (
                  <span
                    key={service}
                    className="bg-muted px-3 py-1.5 rounded-full text-sm text-foreground border border-border"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </FadeInView>
          </div>
        </section>

        {/* Pricing Cards */}
        <Section>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {plans.map((plan) => (
              <StaggerItem key={plan.name}>
                <div
                  className={cn(
                    "rounded-xl border p-6 h-full flex flex-col transition-all",
                    plan.highlighted
                      ? "ring-2 ring-primary scale-[1.03] shadow-lg bg-background relative"
                      : "bg-background hover:shadow-md border-border"
                  )}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h2
                      className={cn(
                        "font-bold text-lg font-heading",
                        plan.highlighted ? "text-primary" : "text-foreground"
                      )}
                    >
                      {plan.name}
                    </h2>
                    <div className="text-3xl font-bold text-foreground mt-2">
                      {plan.price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {plan.period}
                    </div>
                  </div>

                  <div className="text-center text-sm font-medium text-primary mb-4 pb-4 border-b border-border">
                    {plan.visits}
                  </div>

                  <ul className="space-y-3 mb-6 flex-1">
                    {featureLabels.map((feature) => {
                      const has =
                        plan.features[
                          feature.key as keyof typeof plan.features
                        ];
                      return (
                        <li
                          key={feature.key}
                          className="flex items-center gap-2 text-sm"
                        >
                          {has ? (
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          ) : (
                            <Minus className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                          )}
                          <span
                            className={
                              has ? "text-foreground" : "text-muted-foreground/60"
                            }
                          >
                            {feature.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  <Button
                    asChild
                    variant={plan.highlighted ? "default" : "outline"}
                    className={cn("w-full", plan.highlighted && "shadow-md")}
                  >
                    <Link to="/contact">{plan.cta}</Link>
                  </Button>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Value statement */}
          <FadeInView delay={0.3}>
            <div className="border border-border rounded-lg p-6 mt-12 max-w-2xl mx-auto">
              <h3 className="font-semibold text-foreground text-sm mb-2 font-heading">
                What to Expect with Monthly Plans
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every scheduled visit is tailored to your property's needs. We
                walk your grounds, address what matters most, and keep you
                informed — so you never have to worry about the little things
                adding up.
              </p>
            </div>
          </FadeInView>

          <div className="text-center text-muted-foreground text-xs mt-6 space-y-0.5">
            <p>* Materials and supplies billed separately &middot; Multi-day discounts available</p>
            <p className="italic">
              Visit frequency may vary based on project scope and seasonality
            </p>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
