# Review card — how to get these printed

`review-card-print.pdf` is print-ready. Upload it as-is; don't resize it.

## What to order

- **Format:** 4 × 6 in postcard / rack card, **double-sided**
- **Stock:** 16pt or heavier
- **Finish: MATTE or uncoated — not gloss.** Glare off a gloss laminate is one of
  the most common reasons a QR code fails to scan in direct sun, and this card
  will get used outdoors.
- **First run: 100 cards.** Don't order a big batch to catch up on past
  customers — see "Pacing" below.

VistaPrint, Staples, or any local print shop can do this. The PDF already
includes the 0.125in bleed printers ask for, so if a form asks "does your file
include bleed?", the answer is yes.

## How Josiah uses it

Hand it over **at the end of the job**, after the walkthrough, while saying
goodbye. Something like:

> "If you've got a minute sometime, we'd really appreciate a review on Google —
> here's a card with the link."

Then leave it there. Don't stand and wait for them to pull out their phone —
Google's policy specifically prohibits pressuring someone to review while
you're still on site. The handoff is fine; the hovering isn't.

**Give one to every finished job, no exceptions** — not just the customers who
seemed happy. Selectively asking only happy customers ("review gating") is
against Google's policy, and it's the fastest way to get reviews stripped.

## Pacing

The profile has ~5 reviews today. A sudden burst of new ones looks unnatural to
Google's spam filtering, and reviews that arrive in a spike are far more likely
to be deleted. One card per completed job, at whatever pace jobs finish, keeps
this safe by construction. Resist the urge to text the whole customer list.

## Things that will get the profile penalised

- Offering **anything** in exchange for a review — discount, free add-on, gift
  card, raffle entry. No exceptions, even framed as a thank-you.
- Asking for a **specific rating** ("leave us 5 stars") or **specific content**
  ("mention the drainage work", "mention Josiah"). Google banned content
  scripting outright.
- Asking only the customers who seemed pleased.
- Asking family or employees to review without disclosing the relationship —
  that one is an FTC rule, not a Google one, and it applies to a family business.

The card copy is deliberately written to stay clear of all of the above. If you
reword it, keep it sentiment-neutral — "good, bad, or in between" is doing real
work in that sentence.

## The link

The QR encodes **`https://firmfoundationsc.com/review`**, which redirects to the
Google review dialog. It deliberately does *not* encode Google's own
`g.page/r/...` link directly — both produce an identical-size QR code, but
routing through our own domain means if Google ever changes that URL, we update
one line in `vercel.json` and **every printed card keeps working**. A card with
Google's raw link baked in would become landfill.

The redirect lives in `vercel.json`. Don't remove it — printed cards depend on it.

## Files

| File | What it is |
|---|---|
| `review-card-print.pdf` | Send this to the printer. 2 pages, front and back, bleed included. |
| `review-qr-phone.png` | For showing customers on the spot. Save to the camera roll. |
| `review-qr.svg` | The QR on its own, vector. For a truck decal, yard sign, or invoice footer. |

## Showing it on the spot (no card needed)

`review-qr-phone.png` is the phone version. **Save it to Josiah's camera roll and
favourite it** — then he opens Photos, holds the phone out, and the customer
scans it right there.

**How he gets it onto his phone:** open **firmfoundationsc.com/review-qr.png**
in the phone browser, press and hold the image, "Add to Photos". No AirDrop or
texting needed, and he can get it back the same way on a new phone.

Save it to Photos rather than bookmarking a web page: job sites have bad
reception, and a saved image works with no signal. Only the *customer's* phone
needs a connection to follow the link.

Two practical notes:
- **Turn screen brightness all the way up** before holding it out. That is the
  single biggest factor in whether it scans outdoors.
- This one is mostly **white**, not charcoal like the printed card. That is
  deliberate: a phone screen is emissive, so a white ground makes it far brighter
  and easier to scan in sunlight. Same brand, different medium.

Verified to still decode when captured at 300px wide, under simulated screen
glare, and on a dimmed screen.

If you reuse the QR anywhere else: keep it **dark on light** (never yellow on
charcoal — inverted codes fail on a lot of phone cameras), keep the pale margin
around it clear, and don't print it smaller than about 1 inch.
