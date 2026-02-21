import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import FadeInView from "@/components/animations/FadeInView";
import SEO from "@/components/SEO";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .max(20, "Phone must be less than 20 characters")
    .optional(),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(1000, "Message must be less than 1000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactUs = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/xlgwpbnn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Form submission failed");

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });

      form.reset();
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-[72px]">
        <SEO
          title="Contact Us – Free Quote"
          description="Contact Firm Foundation for a free property maintenance quote in Mount Pleasant, SC. Call (419) 419-8082 or send us a message."
          canonical="/contact"
          keywords="contact property maintenance, free quote Mount Pleasant SC, pressure washing quote, landscaping estimate"
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Firm Foundation Property Maintenance",
            url: "https://firmfoundationsc.com/contact",
            mainEntity: {
              "@type": "LocalBusiness",
              name: "Firm Foundation Property Maintenance",
              telephone: "(419) 419-8082",
              email: "ffirmfoundationsc@gmail.com",
              url: "https://firmfoundationsc.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Mount Pleasant",
                addressRegion: "SC",
                postalCode: "29464",
                addressCountry: "US",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "(419) 419-8082",
                contactType: "customer service",
                email: "ffirmfoundationsc@gmail.com",
                areaServed: "Mount Pleasant, SC",
                availableLanguage: "English",
              },
            },
          }}
        />

        {/* Page Header */}
        <section className="py-20 md:py-28 px-4">
          <div className="container mx-auto max-w-content text-center">
            <FadeInView>
              <h1 className="text-hero md:text-display font-bold text-foreground tracking-tight font-heading mb-4">
                Contact Us
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Have questions? We'd love to hear from you. Send us a message
                and we'll respond as soon as possible.
              </p>
            </FadeInView>
          </div>
        </section>

        <Section>
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 max-w-5xl mx-auto">
            {/* Contact Information */}
            <FadeInView direction="left">
              <h2 className="text-3xl font-bold mb-6 text-foreground font-heading">
                Get in Touch
              </h2>
              <p className="text-muted-foreground mb-10 leading-relaxed">
                Whether you're looking for property maintenance services or have
                questions about our offerings, we're here to help.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Email
                    </h3>
                    <a
                      href="mailto:ffirmfoundationsc@gmail.com"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      ffirmfoundationsc@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Phone
                    </h3>
                    <a
                      href="tel:4194198082"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      (419) 419-8082
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Office
                    </h3>
                    <p className="text-muted-foreground">
                      Charleston, SC
                      <br />
                      Mount Pleasant Area
                    </p>
                  </div>
                </div>
              </div>
            </FadeInView>

            {/* Contact Form */}
            <FadeInView direction="right" delay={0.15}>
              <div className="bg-card p-8 md:p-10 rounded-xl border border-border shadow-sm">
                <h2 className="text-2xl font-bold mb-8 text-card-foreground font-heading">
                  Send us a Message
                </h2>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your name"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="(419) 419-8082"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="How can we help you?"
                              className="min-h-[160px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full h-12"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </div>
            </FadeInView>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
