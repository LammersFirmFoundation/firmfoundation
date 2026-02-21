import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Star, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import FadeInView from "@/components/animations/FadeInView";
import ServiceAreaMap from "@/components/ServiceAreaMap";

import pressureWashing from "@/assets/services/pressure-washing.jpg";
import landscaping from "@/assets/services/landscaping.jpg";
import windowWashing from "@/assets/services/window-washing.jpg";
import carpentry from "@/assets/services/carpentry.jpg";

const stats = [
  { label: "5.0 Rating", value: "5.0" },
  { label: "100+ Properties", value: "100+" },
  { label: "4 Core Services", value: "4" },
  { label: "Lowcountry's Best", value: "#1" },
];

const services = [
  {
    title: "Pressure Washing",
    description:
      "Transform your property's exterior with professional pressure washing. We safely remove years of dirt, grime, and mildew from driveways, siding, decks, and patios using state-of-the-art equipment.",
    image: pressureWashing,
    alt: "Professional pressure washing service",
  },
  {
    title: "Landscaping",
    description:
      "Maintain a pristine outdoor environment year-round. From weekly lawn care to seasonal plantings, we create and preserve beautiful outdoor spaces tailored to the Lowcountry climate.",
    image: landscaping,
    alt: "Professional landscaping service",
  },
  {
    title: "Window Washing",
    description:
      "Experience crystal-clear views with our professional window washing. We clean interior and exterior surfaces, frames, and screens — delivering streak-free, spotless results every time.",
    image: windowWashing,
    alt: "Professional window washing service",
  },
  {
    title: "Carpentry",
    description:
      "Keep outdoor structures safe and beautiful with skilled carpentry. We handle deck repairs, fence fixes, railing restoration, and custom outdoor builds with lasting craftsmanship.",
    image: carpentry,
    alt: "Professional carpentry service",
  },
];

const testimonials = [
  {
    quote:
      "Firm Foundation transformed our home's exterior with their pressure washing service. It looks brand new again! The team is always professional, punctual, and thorough.",
    name: "Sarah M.",
    location: "Mount Pleasant Homeowner",
  },
  {
    quote:
      "Outstanding landscaping service! Our yard has never looked better. They're consistent, detail-oriented, and really care about the quality of their work.",
    name: "John D.",
    location: "Isle of Palms Homeowner",
  },
  {
    quote:
      "Professional window washing service. They got our windows so clean I thought they were open! Very reasonable pricing and the crew was respectful of our property.",
    name: "Emily R.",
    location: "Sullivan's Island Homeowner",
  },
];

const LandingPage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header transparent />

      <SEO
        title="Firm Foundation Property Maintenance | Mount Pleasant, SC"
        description="Professional pressure washing, landscaping, window washing, and carpentry in Mount Pleasant, Isle of Palms, Sullivan's Island, Dunes West, and Park West."
        canonical="/"
        keywords="property maintenance Mount Pleasant SC, pressure washing, landscaping, window washing, carpentry, Lowcountry"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Firm Foundation Property Maintenance",
          description:
            "Professional property maintenance in Mount Pleasant, SC. Expert pressure washing, landscaping, window washing, and carpentry for residential properties.",
          image: "https://firmfoundationsc.com/og-image.jpg",
          telephone: "(419) 419-8082",
          email: "ffirmfoundationsc@gmail.com",
          url: "https://firmfoundationsc.com",
          priceRange: "$$",
          sameAs: ["https://instagram.com/firmfoundation_sc"],
          areaServed: [
            {
              "@type": "City",
              name: "Mount Pleasant",
              addressRegion: "SC",
            },
            {
              "@type": "City",
              name: "Isle of Palms",
              addressRegion: "SC",
            },
            {
              "@type": "City",
              name: "Sullivan's Island",
              addressRegion: "SC",
            },
            {
              "@type": "City",
              name: "Dunes West",
              addressRegion: "SC",
            },
            {
              "@type": "City",
              name: "Park West",
              addressRegion: "SC",
            },
          ],
          address: {
            "@type": "PostalAddress",
            addressLocality: "Mount Pleasant",
            addressRegion: "SC",
            postalCode: "29464",
            addressCountry: "US",
          },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Property Maintenance Services",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Pressure Washing",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Landscaping",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Window Washing",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Carpentry",
                },
              },
            ],
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "5.0",
            reviewCount: "8",
          },
        }}
      />

      <main className="flex-1">
        {/* Full-Screen Video Hero */}
        <section className="relative h-[70vh] md:h-screen min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
          {/* Video / Poster Background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={pressureWashing}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

          <div className="relative z-10 container mx-auto px-4 pt-20 md:pt-0 text-center max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-display font-bold text-white mb-6 leading-tight tracking-tight font-heading drop-shadow-lg"
            >
              Mount Pleasant's Premier
              <br />
              Property Maintenance
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md"
            >
              Professional pressure washing, landscaping, window washing, and
              carpentry for the Lowcountry's finest homes
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-foreground hover:bg-white/90 text-lg px-10 py-6 h-auto"
              >
                <Link to="/contact">Get a Free Quote</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-6 h-auto"
              >
                <Link to="/services">Our Services</Link>
              </Button>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="h-8 w-8 text-white/60" />
          </motion.div>
        </section>

        {/* Value Proposition Strip */}
        <section className="border-b border-border bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {stats.map((stat) => (
                <FadeInView key={stat.label}>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-foreground font-heading">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {stat.label}
                    </div>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>

        {/* Services Overview — Alternating Layout */}
        <Section>
          <SectionHeader
            title="Our Services"
            subtitle="Professional property maintenance for Mount Pleasant's finest homes"
          />

          <div className="space-y-24">
            {services.map((service, index) => {
              const imageLeft = index % 2 === 0;
              return (
                <div
                  key={service.title}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
                >
                  <FadeInView
                    direction={imageLeft ? "left" : "right"}
                    className={imageLeft ? "" : "md:order-2"}
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.alt}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </FadeInView>
                  <FadeInView
                    direction={imageLeft ? "right" : "left"}
                    delay={0.15}
                    className={imageLeft ? "" : "md:order-1"}
                  >
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading">
                      {service.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                      {service.description}
                    </p>
                    <Link
                      to="/services"
                      className="text-primary font-medium hover:underline"
                    >
                      Learn more &rarr;
                    </Link>
                  </FadeInView>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Testimonials */}
        <Section variant="muted">
          <SectionHeader
            title="What Our Clients Say"
            subtitle="Trusted by homeowners throughout Mount Pleasant"
          />

          <div className="max-w-3xl mx-auto text-center min-h-[220px] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-6xl text-primary/20 font-heading leading-none mb-4">
                  &ldquo;
                </div>
                <p className="text-xl md:text-2xl text-foreground leading-relaxed italic mb-8">
                  {testimonials[activeTestimonial].quote}
                </p>
                <p className="font-bold text-foreground">
                  {testimonials[activeTestimonial].name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonials[activeTestimonial].location}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === activeTestimonial
                      ? "bg-primary"
                      : "bg-border hover:bg-muted-foreground/40"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Trust indicators */}
          <FadeInView delay={0.2}>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 pt-8 border-t border-border">
              <div className="flex items-center gap-1" role="img" aria-label="5 out of 5 stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-primary text-primary"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="text-muted-foreground text-sm">
                5.0 average from 8 verified reviews
              </span>
            </div>
          </FadeInView>
        </Section>

        {/* Service Areas */}
        <Section variant="dark" className="bg-gradient-to-b from-[hsl(220,20%,10%)] to-[hsl(210,50%,22%)]">
          <SectionHeader
            title="Areas We Serve"
            subtitle="Proudly serving the greater Mount Pleasant area and surrounding islands"
            dark
          />

          <FadeInView>
            <ServiceAreaMap />
          </FadeInView>
        </Section>

        {/* CTA Section */}
        <Section variant="dark" className="text-center bg-gradient-to-b from-[hsl(210,50%,22%)] to-[hsl(220,20%,10%)]">
          <FadeInView>
            <h2 className="text-hero md:text-display font-bold text-background mb-6 font-heading leading-tight">
              Ready to Transform
              <br />
              Your Property?
            </h2>
            <p className="text-xl text-background/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              Contact Josiah Lammers today for a free consultation and quote
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 text-lg px-10 py-6 h-auto"
              >
                <a href="tel:4194198082">Call (419) 419-8082</a>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-transparent border-2 border-background/40 text-background hover:bg-background/10 text-lg px-10 py-6 h-auto"
              >
                <Link to="/contact">Send a Message</Link>
              </Button>
            </div>
          </FadeInView>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
