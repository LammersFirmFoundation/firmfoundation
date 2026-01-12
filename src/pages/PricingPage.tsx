import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "One-Time Refresh",
    price: "$499",
    period: "one-time",
    category: "one-time",
    cta: "Book Now",
    highlighted: false,
  },
  {
    name: "Project Day",
    price: "$600",
    period: "per day",
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

// Features ordered to show progression - basic at top, premium at bottom
const features = [
  // Base service - included in all
  {
    name: "Seasonal cleanup or focused reset",
    oneTimeRefresh: true,
    projectDay: true,
    bronze: true,
    silver: true,
    gold: true,
  },
  // One-time specific features
  {
    name: "Full on-site workday (up to 8 hours)",
    oneTimeRefresh: false,
    projectDay: true,
    bronze: false,
    silver: false,
    gold: false,
    oneTimeOnly: true,
  },
  {
    name: "Materials billed separately",
    oneTimeRefresh: false,
    projectDay: true,
    bronze: false,
    silver: false,
    gold: false,
    oneTimeOnly: true,
  },
  {
    name: "Preferred day pricing available",
    oneTimeRefresh: false,
    projectDay: true,
    bronze: false,
    silver: false,
    gold: false,
    oneTimeOnly: true,
  },
  // Monthly maintenance features - stacking up
  {
    name: "Repairs & punch-list items",
    oneTimeRefresh: false,
    projectDay: true,
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    name: "Preventative maintenance",
    oneTimeRefresh: false,
    projectDay: false,
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    name: "1 visit per month",
    oneTimeRefresh: false,
    projectDay: false,
    bronze: true,
    silver: false,
    gold: false,
  },
  {
    name: "2 visits per month",
    oneTimeRefresh: false,
    projectDay: false,
    bronze: false,
    silver: true,
    gold: false,
  },
  {
    name: "3–4 visits per month",
    oneTimeRefresh: false,
    projectDay: false,
    bronze: false,
    silver: false,
    gold: true,
  },
  {
    name: "Priority scheduling",
    oneTimeRefresh: false,
    projectDay: false,
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    name: "Dedicated property manager",
    oneTimeRefresh: false,
    projectDay: false,
    bronze: false,
    silver: false,
    gold: true,
  },
];

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
        <section className="py-16 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Firm Foundation
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
              Choose the plan that fits your needs.
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Premium home maintenance for the Lowcountry
            </p>
            
            {/* Services included */}
            <div className="bg-muted/30 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-sm font-medium text-foreground mb-3">All packages include these core services:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {coreServices.map((service) => (
                  <span 
                    key={service}
                    className="bg-background px-3 py-1.5 rounded-full text-sm text-muted-foreground border border-border"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Table */}
        <section className="pb-20">
          <div className="container mx-auto px-4 overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Table Header */}
              <div className="grid grid-cols-6 border-b-2 border-border">
                <div className="p-4 text-left font-medium text-foreground">
                  What's included
                </div>
                <div className="p-4 text-center col-span-2 bg-muted/40">
                  <span className="text-muted-foreground font-medium">One-Time Services</span>
                </div>
                <div className="p-4 text-center col-span-3 bg-primary/10 border-l-2 border-primary/30">
                  <span className="text-primary font-semibold">Monthly Maintenance</span>
                </div>
              </div>

              {/* Plan Names Row */}
              <div className="grid grid-cols-6 border-b border-border">
                <div className="p-4 bg-muted/20"></div>
                {plans.map((plan, idx) => (
                  <div 
                    key={plan.name} 
                    className={`p-4 text-center font-semibold ${
                      plan.category === 'monthly' ? 'bg-primary/5' : 'bg-muted/40'
                    } ${idx === 2 ? 'border-l-2 border-primary/30' : ''} ${
                      plan.highlighted ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {plan.name}
                  </div>
                ))}
              </div>

              {/* Feature Rows */}
              {features.map((feature, index) => (
                <div 
                  key={feature.name} 
                  className={`grid grid-cols-6 border-b border-border ${
                    index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                  }`}
                >
                  <div className="p-4 text-left text-foreground">
                    {feature.name}
                  </div>
                  <div className={`p-4 flex justify-center items-center ${index % 2 === 0 ? 'bg-muted/20' : 'bg-muted/30'}`}>
                    {feature.oneTimeRefresh && <Check className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  <div className={`p-4 flex justify-center items-center ${index % 2 === 0 ? 'bg-muted/20' : 'bg-muted/30'}`}>
                    {feature.projectDay && <Check className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  <div className={`p-4 flex justify-center items-center border-l-2 border-primary/30 ${index % 2 === 0 ? 'bg-primary/5' : 'bg-primary/10'}`}>
                    {feature.bronze && <Check className="h-5 w-5 text-primary" />}
                  </div>
                  <div className={`p-4 flex justify-center items-center ${index % 2 === 0 ? 'bg-primary/5' : 'bg-primary/10'}`}>
                    {feature.silver && <Check className="h-5 w-5 text-primary" />}
                  </div>
                  <div className={`p-4 flex justify-center items-center ${index % 2 === 0 ? 'bg-primary/5' : 'bg-primary/10'}`}>
                    {feature.gold && <Check className="h-5 w-5 text-primary" />}
                  </div>
                </div>
              ))}

              {/* Pricing Row */}
              <div className="grid grid-cols-6 border-b-2 border-border">
                <div className="p-6 text-left font-medium text-foreground bg-muted/20">
                  Pricing
                </div>
                {plans.map((plan, idx) => (
                  <div 
                    key={plan.name} 
                    className={`p-6 text-center ${
                      plan.category === 'monthly' ? 'bg-primary/10' : 'bg-muted/40'
                    } ${idx === 2 ? 'border-l-2 border-primary/30' : ''}`}
                  >
                    <span className={`text-2xl font-bold ${plan.highlighted ? 'text-primary' : 'text-foreground'}`}>
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground text-sm block">
                      {plan.period}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Row */}
              <div className="grid grid-cols-6 py-6">
                <div className="p-4"></div>
                {plans.map((plan, idx) => (
                  <div 
                    key={plan.name} 
                    className={`p-4 flex justify-center ${idx === 2 ? 'border-l-2 border-primary/30' : ''}`}
                  >
                    <Button 
                      asChild
                      variant={plan.highlighted ? "default" : "outline"}
                      className={plan.highlighted ? "" : "border-foreground"}
                    >
                      <Link to="/contact">{plan.cta}</Link>
                    </Button>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <p className="text-center text-muted-foreground text-sm italic mt-6">
                Visit frequency is a general guideline and may vary based on project scope, seasonality, and scheduling needs.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
