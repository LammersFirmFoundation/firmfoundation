import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
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

/** Field labels: plain Manrope, sentence case, never tracked capitals. */
const labelClass = "text-[0.9375rem] font-semibold";

const Optional = () => <span className="font-normal text-muted-foreground"> (optional)</span>;

/**
 * The tick box of a printed order form: a small square that fills with ink
 * when it is chosen. It is the one mark that says "selected" by shape as well
 * as by colour, so the job tiles never rely on colour alone.
 */
const TickBox = ({ on, invalid = false, inverse = false }: { on: boolean; invalid?: boolean; inverse?: boolean }) => (
  <span
    aria-hidden="true"
    className={cn(
      "flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] border transition-colors",
      on
        ? inverse
          ? "border-primary-foreground bg-primary-foreground text-primary"
          : "border-primary bg-primary text-primary-foreground"
        : invalid
          ? "border-destructive bg-background"
          : "border-input bg-background"
    )}
  >
    {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
  </span>
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
  <fieldset className="min-w-0">
    <legend className="mb-3 text-[0.9375rem] font-semibold text-foreground">{question.label}</legend>
    {question.hint && (
      <p className="-mt-1 mb-3.5 max-w-xl text-sm leading-relaxed text-muted-foreground">{question.hint}</p>
    )}
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
                "inline-flex min-h-[44px] cursor-pointer select-none items-center gap-2 rounded-[3px] border px-3.5 py-2 text-[0.9375rem] leading-snug transition-colors",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
                checked
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-card text-foreground hover:border-foreground"
              )}
            >
              {checked && <Check className="-ml-0.5 h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />}
              {option}
            </span>
          </label>
        );
      })}
    </div>
  </fieldset>
);

/**
 * A numbered step of the form: the numeral in the flyer's serif, the heading
 * in the condensed face, set the way a printed order form numbers its parts.
 */
const Step = ({ n, title, note }: { n: number; title: string; note?: string }) => (
  <div className="mb-7 flex items-baseline gap-4">
    <span
      aria-hidden="true"
      className="w-5 shrink-0 font-serif text-[1.75rem] font-semibold leading-none text-highlight tabular-nums md:text-[2rem]"
    >
      {n}
    </span>
    <div className="min-w-0">
      <h3 className="font-heading text-[1.625rem] leading-[1.05] text-foreground md:text-[1.875rem]">{title}</h3>
      {note && <p className="mt-2 text-sm text-muted-foreground">{note}</p>}
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
  // The services under "Something else" have their own questions too: once a
  // visitor names one, its chips appear just as a core job's do.
  const questionKey = job === OTHER ? moreServices.find((s) => s.title === otherPick)?.slug : job;
  const questions = useMemo(
    () => [...(questionKey ? questionsByService[questionKey] ?? [] : []), ...(job ? commonQuestions : [])],
    [questionKey, job]
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

  /** The six tiles of step 1: the five core jobs, then the way out. */
  const jobOptions = [
    ...coreServices.map((s) => ({ key: s.slug, title: s.title, blurb: s.navBlurb })),
    { key: OTHER, title: "Something else", blurb: "Trees, drainage, mulching, a build, or not sure" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main" className="flex-1 pt-20 md:pt-24">
        <SEO
          title="Free Quote | Firm Foundation, Mount Pleasant SC"
          description={`Free on-site quotes for landscaping, patios and walkways, grading, pool prep and land clearing in Mount Pleasant and Charleston, SC. Call ${BUSINESS.phone}.`}
          canonical="/contact"
          keywords="landscaping quote Mount Pleasant SC, paver patio estimate Charleston, free estimate hardscapes, excavation quote Mount Pleasant, land clearing quote, drainage quote"
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

        {/* Page header. Above the fold, so no JS reveal: the headline rises
            out of its mask in CSS (.hero-line), the same gesture as the
            homepage, and the prerendered HTML is already the finished text. */}
        <section className="px-5 sm:px-6 md:px-10 pt-8 md:pt-14 lg:pt-16">
          <div className="mx-auto grid max-w-content gap-5 border-b border-border pb-10 md:pb-12 lg:grid-cols-12 lg:items-end lg:gap-10 lg:pb-14">
            <div className="lg:col-span-7">
              <p className="mark mb-5">Free on-site quotes</p>
              <h1 className="text-hero font-heading text-foreground">
                <span className="hero-line">
                  <span style={{ animationDelay: "0ms" }}>Get a free quote</span>
                </span>{" "}
                <span className="hero-line">
                  <span style={{ animationDelay: "60ms" }}>in Mount Pleasant</span>
                </span>
              </h1>
            </div>
            <p className="max-w-md text-subtitle leading-relaxed text-muted-foreground lg:col-span-5 lg:col-start-8 lg:pb-1">
              Tell us about the ground and what you want it to be. Josiah will
              come walk it and give you a straight number.
            </p>
          </div>
        </section>

        <Section className="pt-10 md:pt-12 lg:pt-0">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-0 [&>*]:min-w-0">
            {/* Contact details — beside the form on desktop (left, sticky), but
                AFTER it on a phone: someone who tapped "Get a free quote" should
                land on the form, not scroll past an email address to find it. */}
            <div className="order-2 border-t border-border pt-10 lg:order-1 lg:col-span-4 lg:sticky lg:top-14 lg:self-start lg:border-t-0 lg:pt-14 lg:pr-12 xl:pr-16">
              <h2 className="font-heading text-[1.75rem] leading-tight text-foreground md:text-[2rem]">
                Rather talk?
              </h2>

              {/* The number first and large, in the serif the flyer sets it
                  in, as in the closing CTA on every other page. */}
              <a
                href={BUSINESS.phoneHref}
                data-analytics-where="contact-page"
                className="mt-5 inline-block font-serif text-[2.125rem] font-semibold leading-none tracking-[-0.01em] text-foreground underline decoration-foreground/25 decoration-1 underline-offset-[9px] transition-colors hover:decoration-foreground xl:text-[2.5rem]"
              >
                {BUSINESS.phone}
              </a>
              {ACCEPTS_SMS && (
                <a
                  href={smsHref}
                  data-analytics-where="contact-page-text"
                  className="mt-6 flex w-fit items-center gap-2 text-[0.9375rem] font-semibold text-foreground underline decoration-foreground/25 underline-offset-[5px] transition-colors hover:decoration-foreground"
                >
                  <MessageSquare className="h-4 w-4 shrink-0" aria-hidden="true" />
                  Or text a photo of the job
                </a>
              )}

              {/* The rest, ruled like the back of the business card: a plain
                  label, then the value. */}
              <dl className="mt-10 divide-y divide-border border-y border-border text-[0.9375rem]">
                <div className="grid grid-cols-1 gap-1 py-5 min-[360px]:grid-cols-[5.5rem_minmax(0,1fr)] min-[360px]:gap-4">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="min-w-0">
                    <a
                      href={`mailto:${BUSINESS.email}`}
                      className="text-foreground underline decoration-foreground/25 underline-offset-[5px] transition-colors hover:decoration-foreground"
                    >
                      {/* If it has to wrap, wrap at the @, never mid-word. */}
                      {BUSINESS.email.split("@")[0]}@<wbr />
                      {BUSINESS.email.split("@")[1]}
                    </a>
                  </dd>
                </div>
                <div className="grid grid-cols-1 gap-1 py-5 min-[360px]:grid-cols-[5.5rem_minmax(0,1fr)] min-[360px]:gap-4">
                  <dt className="text-muted-foreground">Based in</dt>
                  <dd className="min-w-0">
                    <p className="text-foreground">
                      {BUSINESS.address.locality}, {BUSINESS.address.region}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Serving {serviceAreaNames.join(", ")}.
                    </p>
                  </dd>
                </div>
                <div className="grid grid-cols-1 gap-1 py-5 min-[360px]:grid-cols-[5.5rem_minmax(0,1fr)] min-[360px]:gap-4">
                  <dt className="text-muted-foreground">Instagram</dt>
                  <dd className="min-w-0">
                    <a
                      href={BUSINESS.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground underline decoration-foreground/25 underline-offset-[5px] transition-colors [overflow-wrap:anywhere] hover:decoration-foreground"
                    >
                      {BUSINESS.instagramHandle}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            {/* The quote form. No box around it: the vertical rule is the
                divider on Josiah's business card, and the page is the paper.
                On desktop it runs up to meet the header's rule, so the two
                read as one ruled sheet. */}
            <div className="order-1 lg:order-2 lg:col-span-8 lg:border-l lg:border-border lg:pl-12 lg:pt-14 xl:pl-16">
              {sent ? (
                <div role="status" className="lg:border-t-2 lg:border-foreground lg:pt-10">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 items-center justify-center rounded-[3px] bg-primary text-primary-foreground"
                  >
                    <Check className="h-5 w-5" strokeWidth={3} />
                  </span>
                  <h2 className="mt-6 font-heading text-[2.25rem] leading-[1] text-foreground md:text-5xl">
                    Got it, {sent}.
                  </h2>
                  <p className="mt-5 max-w-md leading-relaxed text-muted-foreground md:text-lg">
                    Josiah will be in touch, usually the same day, to set up a time to walk it.
                  </p>
                  <div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
                    {ACCEPTS_SMS && (
                      <Button asChild size="lg">
                        <a href={smsHref} data-analytics-where="contact-sent-text">
                          <MessageSquare aria-hidden="true" />
                          Text a few photos
                        </a>
                      </Button>
                    )}
                    <button
                      type="button"
                      onClick={() => setSent(null)}
                      className="w-fit text-[0.9375rem] font-semibold text-foreground underline decoration-foreground/25 underline-offset-[5px] transition-colors hover:decoration-foreground"
                    >
                      Send another request
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* The form's own title block, over a heavy rule, like the
                      head of a printed order form. */}
                  <div className="flex flex-col gap-2 border-b-2 border-foreground pb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
                    <h2 className="font-heading text-[2rem] leading-none text-foreground md:text-[2.5rem]">
                      Request a quote
                    </h2>
                    <p className="text-sm text-muted-foreground sm:max-w-[17rem] sm:pb-0.5 sm:text-right">
                      About a minute. Only your name, phone and the job are required.
                    </p>
                  </div>

                  {picked && (
                    <div className="mt-8 border-l-2 border-primary pl-5">
                      <p className="text-sm font-semibold text-foreground">Starting from</p>
                      <p className="mt-1.5 font-serif text-lg italic leading-snug text-foreground md:text-xl">
                        &ldquo;{picked.label}&rdquo;
                      </p>
                      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                        We&rsquo;ve picked the job and started the message. Change anything
                        that isn&rsquo;t right.
                      </p>
                    </div>
                  )}

                  <Form {...form}>
                    {/* The job check also runs when the name or phone is missing,
                        so every problem shows at once instead of in two rounds. */}
                    <form
                      onSubmit={form.handleSubmit(onSubmit, () => {
                        if (!serviceTitle) setJobError(true);
                      })}
                      className="mt-9"
                      noValidate
                    >
                      {/* ── 1 The job ──────────────────────────────── */}
                      <fieldset
                        ref={jobRef}
                        aria-describedby={jobError ? "job-error" : undefined}
                        className="min-w-0 scroll-mt-28"
                      >
                        <legend className="sr-only">What&rsquo;s the job? (required)</legend>
                        <Step n={1} title="What&rsquo;s the job?" />
                        {/* A ruled table of tick boxes rather than six floating
                            cards. The chosen one fills with ink and its box is
                            ticked, so the state never rests on colour alone. */}
                        <div className="grid grid-cols-1 border-l border-t border-border sm:grid-cols-2">
                          {jobOptions.map((option) => {
                            const checked = job === option.key;
                            return (
                              <label key={option.key} className="relative block border-b border-r border-border">
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
                                    "relative flex h-full cursor-pointer items-start gap-3.5 px-4 py-4 transition-colors sm:px-5 sm:py-5",
                                    "peer-focus-visible:z-10 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
                                    checked
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-card text-foreground hover:bg-background"
                                  )}
                                >
                                  <span className="mt-[0.2rem]">
                                    <TickBox on={checked} invalid={jobError} inverse />
                                  </span>
                                  <span className="min-w-0">
                                    <span className="block font-heading text-[1.3125rem] leading-[1.1]">
                                      {option.title}
                                    </span>
                                    <span
                                      className={cn(
                                        "mt-1.5 block text-sm leading-snug",
                                        checked ? "text-primary-foreground/80" : "text-muted-foreground"
                                      )}
                                    >
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
                          <div className="mt-7">
                            <ChipGroup
                              question={{
                                id: "other",
                                label: "Closest to",
                                options: [...moreServices.map((s) => s.title), "Not sure"],
                              }}
                              value={otherPick ? [otherPick === NOT_SURE ? "Not sure" : otherPick] : []}
                              onChange={(v) => {
                                setOtherPick(v[0] === "Not sure" ? NOT_SURE : v[0] ?? "");
                                setAnswers({});
                              }}
                            />
                          </div>
                        )}
                      </fieldset>

                      {/* ── 2 The details (only once a job is picked) ── */}
                      {job && (
                        <div className="mt-12 border-t border-border pt-10">
                          <Step n={2} title="A few details" note="All optional. Tap whatever fits." />
                          <div className="space-y-8">
                            {questions.map((q) => (
                              <ChipGroup
                                key={`${questionKey ?? job}-${q.id}`}
                                question={q}
                                value={answers[q.id] ?? []}
                                onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ── 3 You ──────────────────────────────────── */}
                      <div className="mt-12 border-t border-border pt-10">
                        <Step n={job ? 3 : 2} title="How to reach you" />
                        <div className="space-y-7">
                          <div className="grid gap-7 sm:grid-cols-2 sm:gap-5">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className={labelClass}>
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
                                  <FormLabel className={labelClass}>
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
                                <FormLabel className={labelClass}>
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
                                <FormLabel className={labelClass}>
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
                                <FormLabel className={labelClass}>
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

                      {/* The sign-off: the button, and the one thing that helps
                          more than any field above it. */}
                      <div className="mt-10 flex flex-col gap-4 border-t-2 border-foreground pt-6 sm:flex-row sm:items-center sm:gap-7">
                        <Button type="submit" size="lg" className="w-full shrink-0 sm:w-auto sm:min-w-[15rem]" disabled={isSubmitting}>
                          {isSubmitting ? "Sending…" : "Send for a free quote"}
                        </Button>
                        {ACCEPTS_SMS && (
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            Photos help more than anything. After you send this, text a few to{" "}
                            <a
                              href={smsHref}
                              className="whitespace-nowrap font-semibold text-foreground underline decoration-foreground/25 underline-offset-[4px] transition-colors hover:decoration-foreground"
                            >
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
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
