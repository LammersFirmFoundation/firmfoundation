import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import FadeInView from "@/components/animations/FadeInView";
import SEO from "@/components/SEO";
import { trackQuoteRequest } from "@/components/Analytics";
import { BUSINESS, serviceAreaNames } from "@/data/business";
import { serviceNames } from "@/data/services";
import { businessRef, breadcrumbSchema } from "@/lib/schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xlgwpbnn";

const SERVICE_OPTIONS = [...serviceNames, "Something else / not sure"];

/** Visible required cue that matches the "(optional)" wording on the address. */
const RequiredMark = () => (
  <span className="text-primary" aria-hidden="true">
    *
  </span>
);

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(255, "Email is too long"),
  phone: z
    .string()
    .trim()
    .min(7, "A phone number helps us call you back")
    .max(20, "Phone number is too long"),
  service: z.string().min(1, "Pick the service you need"),
  address: z.string().trim().max(200, "Address is too long").optional(),
  message: z
    .string()
    .trim()
    .min(1, "Tell us a little about the job")
    .max(1000, "Message is too long"),
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
      service: "",
      address: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...data,
          // Puts the service in the email subject so quotes can be triaged
          // straight from the inbox list.
          _subject: `Quote request — ${data.service} — ${data.name}`,
        }),
      });

      if (!response.ok) throw new Error(`Form submission failed (${response.status})`);

      trackQuoteRequest(data.service);
      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as we can — usually the same day.",
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "That didn't go through",
        description: `Please try again, or call us at ${BUSINESS.phone}.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main" className="flex-1 pt-24">
        <SEO
          title="Contact Firm Foundation | Mount Pleasant, SC"
          description={`Get a free on-site quote for excavation, grading, drainage, landscaping, or tree work in Mount Pleasant and greater Charleston, SC. Call ${BUSINESS.phone}.`}
          canonical="/contact"
          keywords="free quote Mount Pleasant SC, contact landscaping Charleston, excavation quote Mount Pleasant"
          jsonLd={[
            {
              "@context": "https://schema.org",
              "@type": "ContactPage",
              name: `Contact ${BUSINESS.name}`,
              url: `${BUSINESS.url}/contact`,
              mainEntity: businessRef,
            },
            breadcrumbSchema("Contact", "/contact"),
          ]}
        />

        {/* Page header */}
        <section className="px-5 sm:px-6 md:px-10 py-24 md:py-36">
          <div className="mx-auto max-w-content">
            <FadeInView>
              <p className="eyebrow text-primary mb-6">Free On-Site Quotes</p>
              <h1 className="text-hero md:text-display font-heading max-w-4xl">
                Get a free quote
                <br />
                <span className="text-primary">in Mount Pleasant</span>
              </h1>
              <p className="text-subtitle text-muted-foreground mt-8 max-w-xl leading-relaxed">
                Tell us what you&rsquo;re dealing with. We&rsquo;ll come walk the
                property and give you a straight number.
              </p>
            </FadeInView>
          </div>
        </section>

        <Section className="pt-0">
          <div className="grid md:grid-cols-[1fr_1.25fr] gap-14 md:gap-20 [&>*]:min-w-0">
            {/* Contact details */}
            <FadeInView direction="left">
              <h2 className="eyebrow text-primary mb-8">Get in Touch</h2>

              <ul className="divide-y divide-border border-y border-border min-w-0">
                <li className="py-6">
                  <span className="eyebrow text-muted-foreground flex items-center gap-2.5 mb-2.5">
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" /> Phone
                  </span>
                  <a
                    href={BUSINESS.phoneHref}
                    data-analytics-where="contact-page"
                    className="font-heading text-2xl md:text-3xl text-foreground hover:text-primary transition-colors"
                  >
                    {BUSINESS.phone}
                  </a>
                </li>
                <li className="py-6">
                  <span className="eyebrow text-muted-foreground flex items-center gap-2.5 mb-2.5">
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" /> Email
                  </span>
                  <a
                    href={`mailto:${BUSINESS.email}`}
                    className="text-foreground hover:text-primary transition-colors break-all"
                  >
                    {BUSINESS.email}
                  </a>
                </li>
                <li className="py-6">
                  <span className="eyebrow text-muted-foreground flex items-center gap-2.5 mb-2.5">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> Based In
                  </span>
                  <p className="text-foreground">
                    {BUSINESS.address.locality}, {BUSINESS.address.region}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    Serving {serviceAreaNames.join(", ")}.
                  </p>
                </li>
                <li className="py-6">
                  <span className="eyebrow text-muted-foreground flex items-center gap-2.5 mb-2.5">
                    <Instagram className="h-3.5 w-3.5" aria-hidden="true" /> Instagram
                  </span>
                  <a
                    href={BUSINESS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    @firmfoundationsc
                  </a>
                </li>
              </ul>
            </FadeInView>

            {/* Quote form */}
            <FadeInView direction="right" delay={0.15}>
              <div className="border border-border rounded-lg bg-card p-6 sm:p-8 md:p-10 min-w-0">
                <h2 className="font-heading text-2xl md:text-3xl text-card-foreground mb-8">
                  Request a quote
                </h2>

                <p className="text-xs text-muted-foreground mb-6">
                  Fields marked <span className="text-primary">*</span> are required.
                </p>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="eyebrow">Name <RequiredMark /></FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" autoComplete="name" required aria-required="true" className="h-12" {...field} />
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
                            <FormLabel className="eyebrow">Phone <RequiredMark /></FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                autoComplete="tel"
                                required
                                aria-required="true"
                                placeholder="(843) 555-0123"
                                className="h-12"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="eyebrow">Email <RequiredMark /></FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              autoComplete="email"
                              required
                              aria-required="true"
                              placeholder="you@email.com"
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
                      name="service"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="eyebrow">What do you need? <RequiredMark /></FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12" aria-required="true">
                                <SelectValue placeholder="Choose a service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SERVICE_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="eyebrow">
                            Property address <span className="normal-case tracking-normal text-muted-foreground">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              autoComplete="street-address"
                              placeholder="Street or neighborhood, Mount Pleasant"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Helps us confirm we cover your area and plan the visit.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="eyebrow">Details <RequiredMark /></FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What are you trying to get done?"
                              required
                              aria-required="true"
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending…" : "Request My Free Quote"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center leading-relaxed">
                      Prefer to talk it through?{" "}
                      <a
                        href={BUSINESS.phoneHref}
                        className="text-primary underline underline-offset-4"
                      >
                        Call {BUSINESS.phone}
                      </a>
                    </p>
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
