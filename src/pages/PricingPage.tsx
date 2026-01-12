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

const features = [
  {
    name: "Seasonal cleanup or focused reset",
    oneTimeRefresh: true,
    projectDay: true,
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    name: "Full on-site workday (up to 8 hours)",
    oneTimeRefresh: false,
    projectDay: true,
    bronze: false,
    silver: false,
    gold: false,
  },
  {
    name: "Materials billed separately",
    oneTimeRefresh: false,
    projectDay: true,
    bronze: false,
    silver: false,
    gold: false,
  },
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
    name: "3-4 visits per month",
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
    name: "Comprehensive property care",
    oneTimeRefresh: false,
    projectDay: false,
    bronze: false,
    silver: false,
    gold: true,
  },
  {
    name: "Preferred day pricing available",
    oneTimeRefresh: false,
    projectDay: true,
    bronze: false,
    silver: false,
    gold: false,
  },
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
            <p className="text-muted-foreground text-lg">
              Premium home maintenance for the Lowcountry
            </p>
          </div>
        </section>

        {/* Pricing Table */}
        <section className="pb-20">
          <div className="container mx-auto px-4 overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Table Header */}
              <div className="grid grid-cols-6 border-b border-border">
                <div className="p-4 text-left font-medium text-foreground">
                  What's included
                </div>
                <div className="p-4 text-center col-span-2">
                  <span className="text-muted-foreground text-sm">One-Time Services</span>
                </div>
                <div className="p-4 text-center col-span-3">
                  <span className="text-primary font-medium">Monthly Maintenance</span>
                </div>
              </div>

              {/* Plan Names Row */}
              <div className="grid grid-cols-6 border-b border-border bg-muted/30">
                <div className="p-4"></div>
                {plans.map((plan) => (
                  <div 
                    key={plan.name} 
                    className={`p-4 text-center font-semibold ${
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
                    index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                  }`}
                >
                  <div className="p-4 text-left text-foreground">
                    {feature.name}
                  </div>
                  <div className="p-4 flex justify-center items-center">
                    {feature.oneTimeRefresh && <Check className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="p-4 flex justify-center items-center">
                    {feature.projectDay && <Check className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="p-4 flex justify-center items-center">
                    {feature.bronze && <Check className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="p-4 flex justify-center items-center">
                    {feature.silver && <Check className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="p-4 flex justify-center items-center">
                    {feature.gold && <Check className="h-5 w-5 text-primary" />}
                  </div>
                </div>
              ))}

              {/* Pricing Row */}
              <div className="grid grid-cols-6 border-b border-border bg-muted/30">
                <div className="p-6 text-left font-medium text-foreground">
                  Pricing
                </div>
                {plans.map((plan) => (
                  <div key={plan.name} className="p-6 text-center">
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
                {plans.map((plan) => (
                  <div key={plan.name} className="p-4 flex justify-center">
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
