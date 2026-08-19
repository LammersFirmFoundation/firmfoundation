import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { BUSINESS } from "@/data/business";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <SEO
        title="Page Not Found | Firm Foundation Property Services"
        description="That page doesn't exist. Head back to Firm Foundation for hardscapes, landscaping, excavation, tree services, and custom projects in Mount Pleasant, SC."
        noindex
      />

      <main id="main" className="flex-1 flex items-center px-5 sm:px-6 md:px-10 py-32">
        <div className="mx-auto max-w-content w-full">
          <p className="eyebrow text-primary mb-6">Error 404</p>
          <h1 className="text-hero md:text-display font-heading max-w-3xl">
            This page
            <br />
            <span className="text-primary">isn&rsquo;t here</span>
          </h1>
          <p className="text-subtitle text-muted-foreground mt-8 max-w-lg leading-relaxed">
            The link may be old or mistyped. Everything we do is still one click
            away.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link to="/">Back to Home</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/services">Our Services</Link>
            </Button>
          </div>
          <p className="mt-10 text-sm text-muted-foreground">
            Or just call us:{" "}
            <a href={BUSINESS.phoneHref} className="text-primary underline underline-offset-4">
              {BUSINESS.phone}
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
