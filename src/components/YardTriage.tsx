import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/data/business";
import { homepageProblems } from "@/data/yard-problems";

/**
 * "What's your yard doing?" — the one part of this site that does work for the
 * visitor rather than describing work we do.
 *
 * Someone with a swampy side yard cannot name their own problem, so they put
 * off calling. This names it for them, says what the fix involves, and hands
 * them a form that already knows what they picked. Josiah stops receiving "how
 * much for drainage?" and starts receiving "standing water in the back corner,
 * Dunes West" — which is a better first phone call for both of them.
 *
 * Three things here are deliberate:
 *
 * **Every answer is in the DOM, collapsed rather than absent.** These are the
 * literal questions people type into Google ("why does water stand in my yard")
 * and the answers are the most search-valuable prose on the site — rendering
 * them only after a click would hide them from crawlers entirely. All of them
 * start closed — see the note on `openId`.
 *
 * **Six rows, no group headings.** It shows only the problems that route to
 * Excavation — the ones a homeowner genuinely cannot name for themselves. The
 * other four ("I want a patio", "a tree needs to come down") were a menu, not a
 * diagnosis, and they cost a screen of scrolling; they live on their service
 * pages instead. With six items the three group headings were structure the
 * list no longer needed.
 *
 * **It is an accordion, not a two-column picker.** The answer opens directly
 * under the thing you tapped, so there is no scrolling to find where the
 * content went and no separate mobile layout to keep in sync.
 *
 * **Hand-rolled rather than the Radix accordion.** Nothing else on the site
 * imports `@radix-ui/react-accordion`, so it currently tree-shakes out of the
 * bundle entirely; using it here would pull it back in for a disclosure widget
 * that is thirty lines of `aria-expanded`.
 */
const YardTriage = () => {
  // Everything starts CLOSED. With the first panel open the section ran 2.5
  // screens on a phone and pushed the reviews — the strongest trust signal on
  // the page — past the point most visitors ever scroll to. Closed, it reads
  // as a scannable list of the questions people actually arrive with, and
  // every answer is still in the DOM for crawlers either way.
  const [openId, setOpenId] = useState<string>("");

  return (
    <div className="mx-auto max-w-narrow">
      <ul className="divide-y divide-border border-y border-border">
        {homepageProblems.map((problem) => {
                const isOpen = openId === problem.id;
                const panelId = `yard-answer-${problem.id}`;
                const buttonId = `yard-symptom-${problem.id}`;

                return (
                  <li key={problem.id}>
                    <h3>
                      <button
                        type="button"
                        id={buttonId}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenId(isOpen ? "" : problem.id)}
                        className="flex w-full items-center justify-between gap-4 py-5 text-left min-h-[44px] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        <span className="font-heading text-lg md:text-xl leading-snug">
                          {problem.label}
                        </span>
                        <ChevronDown
                          aria-hidden="true"
                          className={`h-5 w-5 flex-none text-primary transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </h3>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      hidden={!isOpen}
                      className="pb-8"
                    >
                      <dl className="space-y-4">
                        <div>
                          <dt className="eyebrow text-primary mb-1.5">
                            What it usually is
                          </dt>
                          <dd className="text-muted-foreground leading-relaxed">
                            {problem.cause}
                          </dd>
                        </div>
                        <div>
                          <dt className="eyebrow text-primary mb-1.5">What the fix involves</dt>
                          <dd className="text-muted-foreground leading-relaxed">
                            {problem.fix}
                          </dd>
                        </div>
                        <div>
                          <dt className="eyebrow text-primary mb-1.5">
                            What Josiah looks at on the visit
                          </dt>
                          <dd className="text-muted-foreground leading-relaxed">
                            {problem.visit}
                          </dd>
                        </div>
                      </dl>

                      <div className="mt-7 flex flex-col sm:flex-row gap-3">
                        <Button asChild>
                          {/* The form reads `problem` and fills in the service and
                              a first line of the message, so the visitor starts
                              from something to edit rather than a blank box. */}
                          <Link to={`/contact?problem=${problem.id}`}>
                            Get a free quote for this
                          </Link>
                        </Button>
                        <Button asChild variant="outline">
                          <Link to={`/services/${problem.serviceSlug}`}>
                            More on {problem.service.toLowerCase()}
                          </Link>
                        </Button>
                      </div>

                      <p className="mt-4 text-sm text-muted-foreground">
                        Or call{" "}
                        <a
                          href={BUSINESS.phoneHref}
                          data-analytics-where="yard-triage"
                          /* Underlined, not just coloured: a link inside a block of text needs a
                             non-colour distinction to pass WCAG 1.4.1. */
                          className="text-primary underline underline-offset-4"
                        >
                          {BUSINESS.phone}
                        </a>{" "}
                        and describe it — quotes are free and on-site.
                      </p>
                    </div>
                  </li>
                );
        })}
      </ul>

      <p className="mt-6 text-sm text-muted-foreground">
        Something else &mdash; a tree, a patio, tired beds, or something you want
        built?{" "}
        <Link
          to="/services"
          className="text-primary underline underline-offset-4"
        >
          See everything we do
        </Link>
        .
      </p>
    </div>
  );
};

export default YardTriage;
