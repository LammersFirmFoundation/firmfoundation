import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check, Minus } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Half Day",
    price: "$349",
    period: "one-time",
    category: "one-time",
    cta: "Book Now",
    highlighted: false,
  },
  {
    name: "Project Day",
    price: "$599",
    period: "full day",
    category: "one-time",
    cta: "Book Now",
    highlighted: false,
  },
  {
    name: "Bronze",
    price: "$349",
    period: "/month",
    category: "monthly",
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Silver",
    price: "$599",
    period: "/month",
    category: "monthly",
    cta: "Get Started",
    highlighted: true,
  },
  {
    name: "Gold",
    price: "$999",
    period: "/month",
    category: "monthly",
    cta: "Get Started",
    highlighted: false,
  },
];

// Features ordered for clear scanning - key differentiator first
const features = [
  {
    name: "Full property assessment",
    halfDay: true,
    projectDay: true,
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    name: "Repairs & touch-ups",
    halfDay: true,
    projectDay: true,
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    name: "Preventative maintenance",
    halfDay: false,
    projectDay: false,
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    name: "Priority scheduling",
    halfDay: false,
    projectDay: false,
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    name: "Dedicated property manager",
    halfDay: false,
    projectDay: false,
    bronze: false,
    silver: false,
    gold: true,
  },
];


// Visit frequency as a separate highlighted row
const visitFrequency = {
  name: "Scheduled visits",
  halfDay: "As needed",
  projectDay: "As needed",
  bronze: "1x / month",
  silver: "2x / month",
  gold: "Weekly",
};

const coreServices = [
  "Pressure Washing",
  "Landscaping & Yard Care", 
  "Window Washing",
  "Gutter Cleaning",
  "General Repairs",
];

const PricingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-10 pb-6 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
              We Handle It, So You Don't Have To
            </h1>
            <p className="text-lg text-muted-foreground mb-5 max-w-xl mx-auto">
              Reliable property care with personal accountability — choose the plan that fits your lifestyle.
            </p>
            
            {/* Services included - more compact */}
            <div className="bg-muted/30 rounded-lg py-4 px-5 max-w-2xl mx-auto">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">All packages include:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {coreServices.map((service) => (
                  <span 
                    key={service}
                    className="bg-background px-2.5 py-1 rounded-full text-sm text-foreground border border-border"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Table */}
        <section className="pb-16">
          <div className="container mx-auto px-4 overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Category Header Row */}
              <div className="grid grid-cols-6 mb-1">
                <div className="p-3"></div>
                <div className="p-3 text-center col-span-2 bg-muted/50 rounded-t-lg">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">One-Time</span>
                </div>
                <div className="p-3 text-center col-span-3 bg-primary/15 rounded-t-lg border-x-2 border-t-2 border-primary/20">
                  <span className="text-sm font-semibold text-primary uppercase tracking-wide">Monthly Plans</span>
                </div>
              </div>

              {/* Plan Names & Prices Combined */}
              <div className="grid grid-cols-6 border-b-2 border-border">
                <div className="p-4 bg-muted/20 flex items-center">
                  <span className="font-medium text-foreground">Features</span>
                </div>
                {plans.map((plan, idx) => (
                  <div 
                    key={plan.name} 
                    className={`p-4 text-center ${
                      plan.category === 'monthly' 
                        ? 'bg-primary/10 border-x border-primary/20' 
                        : 'bg-muted/50'
                    } ${plan.highlighted ? 'bg-primary/20' : ''}`}
                  >
                    <div className={`font-bold text-lg ${plan.highlighted ? 'text-primary' : 'text-foreground'}`}>
                      {plan.name}
                    </div>
                    <div className={`text-2xl font-bold mt-1 ${plan.highlighted ? 'text-primary' : 'text-foreground'}`}>
                      {plan.price}
                    </div>
                    <div className="text-xs text-muted-foreground">{plan.period}</div>
                  </div>
                ))}
              </div>

              {/* Feature Rows */}
              {features.map((feature, index) => (
                <div 
                  key={feature.name} 
                  className={`grid grid-cols-6 border-b border-border/50 ${
                    index % 2 === 0 ? 'bg-background' : 'bg-muted/5'
                  }`}
                >
                  <div className="p-3 text-left text-foreground text-sm">
                    {feature.name}
                  </div>
                  <div className={`p-3 flex justify-center items-center ${index % 2 === 0 ? 'bg-muted/20' : 'bg-muted/30'}`}>
                    {feature.halfDay 
                      ? <Check className="h-5 w-5 text-green-600" strokeWidth={2.5} />
                      : <Minus className="h-4 w-4 text-muted-foreground/40" />
                    }
                  </div>
                  <div className={`p-3 flex justify-center items-center ${index % 2 === 0 ? 'bg-muted/20' : 'bg-muted/30'}`}>
                    {feature.projectDay 
                      ? <Check className="h-5 w-5 text-green-600" strokeWidth={2.5} />
                      : <Minus className="h-4 w-4 text-muted-foreground/40" />
                    }
                  </div>
                  <div className={`p-3 flex justify-center items-center border-x border-primary/20 ${index % 2 === 0 ? 'bg-primary/5' : 'bg-primary/10'}`}>
                    {feature.bronze 
                      ? <Check className="h-5 w-5 text-primary" strokeWidth={2.5} />
                      : <Minus className="h-4 w-4 text-muted-foreground/40" />
                    }
                  </div>
                  <div className={`p-3 flex justify-center items-center ${index % 2 === 0 ? 'bg-primary/5' : 'bg-primary/10'}`}>
                    {feature.silver 
                      ? <Check className="h-5 w-5 text-primary" strokeWidth={2.5} />
                      : <Minus className="h-4 w-4 text-muted-foreground/40" />
                    }
                  </div>
                  <div className={`p-3 flex justify-center items-center border-x border-primary/20 ${index % 2 === 0 ? 'bg-primary/5' : 'bg-primary/10'}`}>
                    {feature.gold 
                      ? <Check className="h-5 w-5 text-primary" strokeWidth={2.5} />
                      : <Minus className="h-4 w-4 text-muted-foreground/40" />
                    }
                  </div>
                </div>
              ))}

              {/* Visit Frequency Row - Highlighted */}
              <div className="grid grid-cols-6 border-b-2 border-border bg-muted/30">
                <div className="p-3 text-left font-medium text-foreground text-sm">
                  {visitFrequency.name}
                </div>
                <div className="p-3 text-center bg-muted/40">
                  <span className="text-sm text-muted-foreground">{visitFrequency.halfDay}</span>
                </div>
                <div className="p-3 text-center bg-muted/40">
                  <span className="text-sm text-muted-foreground">{visitFrequency.projectDay}</span>
                </div>
                <div className="p-3 text-center bg-primary/15 border-x border-primary/20">
                  <span className="text-sm font-semibold text-primary">{visitFrequency.bronze}</span>
                </div>
                <div className="p-3 text-center bg-primary/15">
                  <span className="text-sm font-semibold text-primary">{visitFrequency.silver}</span>
                </div>
                <div className="p-3 text-center bg-primary/15 border-x border-primary/20">
                  <span className="text-sm font-semibold text-primary">{visitFrequency.gold}</span>
                </div>
              </div>

              {/* CTA Row */}
              <div className="grid grid-cols-6 py-4">
                <div className="p-3"></div>
                {plans.map((plan) => (
                  <div 
                    key={plan.name} 
                    className="p-3 flex justify-center"
                  >
                    <Button 
                      asChild
                      size="sm"
                      variant={plan.highlighted ? "default" : "outline"}
                      className={plan.highlighted ? "shadow-md" : ""}
                    >
                      <Link to="/contact">{plan.cta}</Link>
                    </Button>
                  </div>
                ))}
              </div>

            </div>

            {/* What to Expect - Value Statement */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 mt-6 max-w-2xl mx-auto">
              <h3 className="font-semibold text-foreground text-sm mb-2">What to Expect with Monthly Plans</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every scheduled visit is tailored to your property's needs. We walk your grounds, address what matters most, 
                and keep you informed — so you never have to worry about the little things adding up. 
                Think of it as having a trusted partner who takes ownership of your home's upkeep.
              </p>
            </div>

            {/* Disclaimer */}
            <div className="text-center text-muted-foreground text-xs mt-4 space-y-0.5">
              <p>* Materials and supplies billed separately · Multi-day discounts available</p>
              <p className="italic">Visit frequency may vary based on project scope and seasonality</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
