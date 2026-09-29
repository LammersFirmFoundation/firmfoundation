import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, Mail, MessageSquare, Phone, MapPin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import FadeInView from "@/components/animations/FadeInView";
import SEO from "@/components/SEO";
import { trackQuoteRequest } from "@/components/Analytics";
import { ACCEPTS_SMS, BUSINESS, serviceAreaNames, smsHref } from "@/data/business";
import { coreServices, findService, moreServices } from "@/data/services";
import { findYardProblem } from "@/data/yard-problems";
import { commonQuestions, questionsByService, type QuoteQuestion } from "@/data/quote-questions";
import { businessRef, breadcrumbSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
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

/** The "Something else" card, and what it can resolve to. */
const OTHER = "other";
const NOT_SURE = "Something else / not sure";

/** Visible required cue that matches the "(optional)" wording elsewhere. */
const RequiredMark = () => (
  <span className="text-primary" aria-hidden="true">
    *
  </span>
);

const Optional = () => (
  <span className="normal-case tracking-normal text-muted-foreground"> (optional)</span>
);

/**
 * Email is optional now. Josiah calls or texts back — that is how every one of
 * these jobs actually starts — so a required email field was a hurdle between
 * a homeowner and the one thing they came to do, guarding a reply channel
 * nobody uses first. Name and phone stay required because without them there
 * is no way to answer at all.
 */
const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  phone: z
    .string()
    .trim()
    .min(7, "A phone number lets Josiah call or text you back")
    .max(20, "Phone number is too long"),
  email: z
    .union([z.literal(""), z.string().trim().email("Enter a valid email address").max(255, "Email is too long")])
    .optional(),
  address: z.string().trim().max(200, "Address is too long").optional(),
  message: z.string().trim().max(1500, "Message is too long").optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

/** One question, as a row of chips. Radios or checkboxes, always native inputs. */
const ChipGroup = ({
  question,
  value,
  onChange,
}: {
  question: QuoteQuestion;
  value: string[];
  onChange: (next: string[]) => void;
}) => (
  <fieldset>
    <legend className="eyebrow text-foreground mb-3">{question.label}</legend>
    {question.hint && <p className="-mt-1.5 mb-3 text-xs text-muted-foreground">{question.hint}</p>}
    <div className="flex flex-wrap gap-2">
      {question.options.map((option) => {
        const checked = value.includes(option);
        return (
          <label key={option} className="relative">
            <input
              type={question.multi ? "checkbox" : "radio"}
              name={`q-${question.id}`}
              value={option}
              checked={checked}
              onChange={() => {
                if (question.multi) {
                  onChange(checked ? value.filter((v) => v !== option) : [...value, option]);
                } else {
                  onChange(checked ? [] : [option]);
                }
              }}
              className="peer sr-only"
            />
            <span
              className={cn(
                "inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-full border px-4 text-sm transition-colors",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-card",
                checked
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input text-foreground/85 hover:border-foreground/60"
              )}
            >
              {checked && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
              {option}
            </span>
          </label>
        );
      })}
    </div>
  </fieldset>
);

/** A numbered step heading inside the form card. */
const Step = ({ n, title, note }: { n: number; title: string; note?: string }) => (
  <div className="mb-6 flex items-baseline gap-4">
    <span className="eyebrow text-primary">{String(n).padStart(2, "0")}</span>
    <div>
      <h3 className="font-heading text-2xl font-extralight text-card-foreground">{title}</h3>
      {note && <p className="mt-1 text-sm text-muted-foreground">{note}</p>}
    </div>
  </div>
);

const ContactUs = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState<string | null>(null);

  // Arriving from a triage answer ("?problem=") or a service page's quote
  // button ("?service="). Both pass an id rather than copy, so the wording lives
  // in one file and a shared URL stays short.
  //
  // At prerender time there is no query string, so the built HTML carries the
  // empty form — the prefill is a client-side improvement on top, never
  // something a crawler sees half-filled.
  const [searchParams] = useSearchParams();
  const picked = findYardProblem(searchParams.get("problem"));
  const linkedService = findService(picked?.serviceSlug ?? searchParams.get("service"));

  const initialJob = linkedService ? (linkedService.tier === "core" ? linkedService.slug : OTHER) : "";
  const [job, setJob] = useState<string>(initialJob);
  const [otherPick, setOtherPick] = useState<string>(
    linkedService?.tier === "more" ? linkedService.title : ""
  );
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [contactBy, setContactBy] = useState<string[]>([]);
  const [jobError, setJobError] = useState(false);
  const jobRef = useRef<HTMLFieldSetElement>(null);

  const serviceTitle =
    job === OTHER ? otherPick || NOT_SURE : coreServices.find((s) => s.slug === job)?.title ?? "";
  const questions = useMemo(
    () => [...(job && job !== OTHER ? questionsByService[job] ?? [] : []), ...(job ? commonQuestions : [])],
    [job]
  );

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      // Deliberately an unfinished sentence: it gives them somewhere to start
      // and a cursor in the right place, rather than a paragraph they have to
      // read and decide whether to delete.
      message: picked?.note ?? "",
    },
  });

  const pickJob = (next: string) => {
    setJob(next);
    setJobError(false);
    // Answers belong to a job; switching jobs clears them rather than sending
    // "5+ acres" along with a drainage request.
    setAnswers({});
  };

  const onSubmit = async (data: ContactFormData) => {
    if (!serviceTitle) {
      setJobError(true);
      jobRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Everything the chips captured, as readable lines in Josiah's inbox, plus
    // a one-line summary that reads well in a phone notification.
    const details: Record<string, string> = {};
    for (const q of questions) {
      const v = answers[q.id];
      if (v?.length) details[q.label] = v.join(", ");
    }
    if (contactBy.length) details["Best way to reach you"] = contactBy.join(", ");
    const summary = [serviceTitle, ...Object.values(details)].join(" · ");

    setIsSubmitting(true);
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email || undefined,
          address: data.address || undefined,
          service: serviceTitle,
          summary,
          ...details,
          message: data.message || undefined,
          // Puts the job in the email subject so quotes can be triaged
          // straight from the inbox list.
          _subject: `Quote request — ${serviceTitle} — ${data.name}`,
        }),
      });

      if (!response.ok) throw new Error(`Form submission failed (${response.status})`);

      trackQuoteRequest(serviceTitle);
      setSent(data.name.split(" ")[0] || data.name);
      form.reset();
      setAnswers({});
      setContactBy([]);
      setJob("");
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  const contactOptions = ACCEPTS_SMS ? ["Text", "Call", "Email"] : ["Call", "Email"];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main" className="flex-1 pt-24">
        <SEO
          title="Free Quote | Firm Foundation, Mount Pleasant SC"
          description={`Get a free on-site quote for land clearing, tree and stump removal, grading, pool and pond digs, or drainage in Mount Pleasant and greater Charleston, SC. Call ${BUSINESS.phone}.`}
          canonical="/contact"
          keywords="land clearing quote Charleston SC, free estimate land clearing, excavation quote Mount Pleasant, stump removal quote, drainage quote"
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
        <section className="px-5 sm:px-6 md:px-10 pt-10 pb-10 md:py-20">
          <div className="mx-auto max-w-content">
            <FadeInView immediate>
              <p className="eyebrow text-primary mb-6">Free On-Site Quotes</p>
              <h1 className="text-hero font-heading max-w-4xl">
                Get a free quote
                <br />
                <span className="text-primary">in Mount Pleasant</span>
              </h1>
              <p className="text-subtitle text-muted-foreground mt-8 max-w-xl leading-relaxed">
                Tell us about the ground and what you want it to be. Josiah will
                come walk it and give you a straight number.
              </p>
            </FadeInView>
          </div>
        </section>

        <Section className="pt-0 md:pt-4">
          <div className="grid md:grid-cols-[1fr_1.45fr] gap-14 md:gap-16 lg:gap-20 [&>*]:min-w-0">
            {/* Contact details — alongside the form on desktop (left, sticky), but
                AFTER it on a phone: someone who tapped "Get a Free Quote" should
                land on the form, not scroll past an email address to find it. */}
            <div className="order-2 md:order-1 md:sticky md:top-28 md:self-start">
              <FadeInView immediate>
                <h2 className="eyebrow text-primary mb-8">Rather talk?</h2>

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
                    {ACCEPTS_SMS && (
                      <a
                        href={smsHref}
                        data-analytics-where="contact-page-text"
                        className="mt-3 flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                        Or text a photo of the job
                      </a>
                    )}
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
                      @firmfoundation_chs
                    </a>
                  </li>
                </ul>
              </FadeInView>
            </div>

            {/* The quote form */}
            <FadeInView immediate className="order-1 md:order-2">
              <div className="border border-border rounded-lg bg-card p-6 sm:p-8 md:p-10 min-w-0">
                {sent ? (
                  <div role="status" className="py-6 text-center">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h2 className="mt-7 font-heading text-3xl font-extralight text-card-foreground md:text-4xl">
                      Got it, {sent}.
                    </h2>
                    <p className="mx-auto mt-4 max-w-sm leading-relaxed text-muted-foreground">
                      Josiah will be in touch, usually the same day, to set up a time to walk it.
                    </p>
                    {ACCEPTS_SMS && (
                      <Button asChild size="lg" className="mt-8">
                        <a href={smsHref} data-analytics-where="contact-sent-text">
                          <MessageSquare aria-hidden="true" />
                          Text a few photos
                        </a>
                      </Button>
                    )}
                    <button
                      type="button"
                      onClick={() => setSent(null)}
                      className="mt-6 block w-full text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    >
                      Send another request
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-heading text-3xl md:text-4xl font-extralight text-card-foreground">
                      Request a quote
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground">
                      About a minute. Only your name, phone and the job are required.
                    </p>

                    {picked && (
                      <div className="mt-6 rounded-lg border border-border bg-background p-4">
                        <p className="eyebrow text-primary mb-1.5">Starting from</p>
                        <p className="text-sm text-foreground leading-relaxed">{picked.label}</p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          We&rsquo;ve picked the job and started the message. Change anything
                          that isn&rsquo;t right.
                        </p>
                      </div>
                    )}

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 space-y-12" noValidate>
                        {/* ── 01 The job ─────────────────────────────── */}
                        <fieldset ref={jobRef} aria-describedby={jobError ? "job-error" : undefined}>
                          <legend className="sr-only">What&rsquo;s the job? (required)</legend>
                          <Step n={1} title="What&rsquo;s the job?" />
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {[...coreServices.map((s) => ({ key: s.slug, title: s.title, blurb: s.navBlurb })), {
                              key: OTHER,
                              title: "Something else",
                              blurb: "A patio, beds, a build, or not sure",
                            }].map((option, i) => {
                              const checked = job === option.key;
                              return (
                                <label key={option.key} className="relative block">
                                  <input
                                    type="radio"
                                    name="job"
                                    value={option.key}
                                    checked={checked}
                                    onChange={() => pickJob(option.key)}
                                    className="peer sr-only"
                                  />
                                  <span
                                    className={cn(
                                      "flex h-full cursor-pointer items-start gap-3.5 rounded-lg border p-4 transition-colors",
                                      "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-card",
                                      checked
                                        ? "border-primary bg-primary/[0.08]"
                                        : "border-input hover:border-foreground/60"
                                    )}
                                  >
                                    <span
                                      aria-hidden="true"
                                      className={cn(
                                        "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.625rem] font-semibold",
                                        checked
                                          ? "border-primary bg-primary text-primary-foreground"
                                          : "border-input text-muted-foreground"
                                      )}
                                    >
                                      {checked ? <Check className="h-3.5 w-3.5" /> : String(i + 1).padStart(2, "0")}
                                    </span>
                                    <span className="min-w-0">
                                      <span className="block font-heading text-lg leading-tight text-card-foreground">
                                        {option.title}
                                      </span>
                                      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                                        {option.blurb}
                                      </span>
                                    </span>
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                          {jobError && (
                            <p id="job-error" role="alert" className="mt-3 text-sm font-medium text-destructive">
                              Pick the job that&rsquo;s closest. &ldquo;Something else&rdquo; is fine.
                            </p>
                          )}

                          {job === OTHER && (
                            <div className="mt-6">
                              <ChipGroup
                                question={{
                                  id: "other",
                                  label: "Closest to",
                                  options: [...moreServices.map((s) => s.title), "Not sure"],
                                }}
                                value={otherPick ? [otherPick === NOT_SURE ? "Not sure" : otherPick] : []}
                                onChange={(v) => setOtherPick(v[0] === "Not sure" ? NOT_SURE : v[0] ?? "")}
                              />
                            </div>
                          )}
                        </fieldset>

                        {/* ── 02 The details (only once a job is picked) ── */}
                        {job && (
                          <div>
                            <Step n={2} title="A few details" note="All optional. Tap whatever fits." />
                            <div className="space-y-8">
                              {questions.map((q) => (
                                <ChipGroup
                                  key={`${job}-${q.id}`}
                                  question={q}
                                  value={answers[q.id] ?? []}
                                  onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* ── 03 You ─────────────────────────────────── */}
                        <div>
                          <Step n={job ? 3 : 2} title="How to reach you" />
                          <div className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="eyebrow">
                                      Name <RequiredMark />
                                    </FormLabel>
                                    <FormControl>
                                      <Input placeholder="Your name" autoComplete="name" aria-required="true" className="h-12" {...field} />
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
                                    <FormLabel className="eyebrow">
                                      Phone <RequiredMark />
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="tel"
                                        autoComplete="tel"
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
                                  <FormLabel className="eyebrow">
                                    Email <Optional />
                                  </FormLabel>
                                  <FormControl>
                                    <Input type="email" autoComplete="email" placeholder="you@email.com" className="h-12" {...field} />
                                  </FormControl>
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
                                    Property address <Optional />
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      autoComplete="street-address"
                                      placeholder="Street or neighborhood"
                                      className="h-12"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Helps confirm we cover your area and plan the visit.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <ChipGroup
                              question={{ id: "contactBy", label: "Best way to reach you", options: contactOptions }}
                              value={contactBy}
                              onChange={setContactBy}
                            />

                            <FormField
                              control={form.control}
                              name="message"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="eyebrow">
                                    Anything else <Optional />
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="What's there now, what you want it to be, anything Josiah should know before he comes out."
                                      className="min-h-[130px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div>
                          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Sending…" : "Send for a Free Quote"}
                          </Button>
                          {ACCEPTS_SMS && (
                            <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
                              Photos help more than anything. After you send this, text a few to{" "}
                              <a href={smsHref} className="text-primary underline underline-offset-4">
                                {BUSINESS.phone}
                              </a>
                              .
                            </p>
                          )}
                        </div>
                      </form>
                    </Form>
                  </>
                )}
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
