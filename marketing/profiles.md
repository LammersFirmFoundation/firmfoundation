# Profile kit: the same business everywhere

Copy for every listing and social profile, so Google, Bing, Apple, Yelp,
Nextdoor, Facebook and Instagram all describe one business the same way.
Search engines trust a business more when its name, phone and address match
across sites, and a mismatch (an old number, "Firm Foundation LLC" on one
site) splits it into what look like two businesses.

Written 2026-10-31. The working copy with copy buttons, the order to do
things in and the outreach drafts is Will's private setup page (see hq,
2026-10-31). If a fact here changes, change it in `src/data/business.ts` too.

## The facts (type them exactly like this)

| Field | Value |
|---|---|
| Business name | Firm Foundation Property Services |
| Phone | (843) 998-5593 |
| Website | https://firmfoundationsc.com |
| Email | josiahlammers1@gmail.com |
| Address | The same street address the Google profile uses, set to **hidden**. Mount Pleasant, SC 29466 shows publicly. Josiah works at the customer's property, so every platform should list it as a service-area business. |
| Service area | Mount Pleasant, Isle of Palms, Sullivan's Island, Daniel Island, Charleston, West Ashley, James Island, Johns Island, Folly Beach |
| Hours | Monday to Saturday, 6:00 AM to 7:00 PM. Closed Sunday. (Will, 2026-11-19; the website shows the same. Set Google first, then Yelp, Bing, Apple, Facebook and Nextdoor to match exactly.) |
| Owner | Josiah Lammers |
| Instagram | https://www.instagram.com/firmfoundation_sc (the old @firmfoundation_chs no longer exists) |
| Google reviews link | https://firmfoundationsc.com/review |

**Category:** search the platform's list for "Landscaper" or "Landscaping"
and make that the main one, the same as Google. If it allows more, add the
closest matches for excavation, tree service and hardscapes or paving. Pick
only categories the platform actually offers.

**Never add:** licensing, insurance or bonding claims; prices; "LLC" or any
other suffix the Google profile doesn't have.

## Descriptions, by length

**On the Google profile since 2026-11-19 (excavation first, 719 characters).** Use this on any platform that takes 750 characters, and trim the ones below to match its lead when you next edit them. Primary category on Google is now **Excavating contractor** (Josiah, 2026-11-19), with Landscaper, Paving contractor and Property maintenance as additional.

> Firm Foundation is a family-run excavation, landscaping and hardscape company in Mount Pleasant, SC, owned and run by Josiah Lammers. With our own Cat 305 CR mini excavator we do grading and site prep, pads and driveways, trenching, pool and pond digs, and land clearing. Then we build what goes on top: new beds, shrubs, trees and sod, paver patios, walkways and retaining walls. We also do tree and stump removal, drainage and forestry mulching, for homeowners, builders and pool companies. Josiah walks the job with you and gives you a straight price before anything starts. Serving Mount Pleasant, Charleston, Daniel Island, Isle of Palms, Sullivan's Island, West Ashley, James Island, Johns Island and Folly Beach.


Use the longest one each field allows.

**Up to 101 characters** (Facebook bio). 97 characters:

> Landscaping, hardscapes and excavation in Mount Pleasant and Charleston, SC. Free on-site quotes.

**Instagram name** (30 maximum, and it is searchable). 29 characters:

> Firm Foundation | Landscaping

**Instagram bio** (150 maximum). 133 characters:

> Landscaping, hardscapes and excavation
> Mount Pleasant and Charleston, SC
> Owner-operated by Josiah Lammers
> Free quotes: (843) 998-5593

**Up to 250 characters** (Apple, Nextdoor intro, short fields). 249 characters:

> Family-run landscaping, hardscape and excavation company in Mount Pleasant, SC. New landscapes, paver patios, walkways, retaining walls, grading, pool and pond prep, and land clearing. Owner Josiah Lammers walks every job and gives a straight price.

**Up to 750 characters** (Facebook About, Yelp, Bing, Nextdoor). The Google
profile's description, word for word, 707 characters:

> Firm Foundation is a family-run landscaping, hardscape and excavation company in Mount Pleasant, SC, owned and run by Josiah Lammers. We install new landscapes (beds, shrubs and trees, sod, mulch and pine straw), build paver patios, flagstone and gravel walkways and retaining walls, and do the dirt work under them: grading, site prep, pool and pond prep, and land clearing for backyards and lots. We also handle tree and stump removal, drainage and forestry mulching. Josiah comes out, walks the job with you and gives you a straight price before anything starts. Serving Mount Pleasant, Charleston, Daniel Island, Isle of Palms, Sullivan's Island, West Ashley, James Island, Johns Island and Folly Beach.

## Services list (where a platform asks for them)

Landscape installation, Sod installation, Mulch and pine straw, Shrub and tree
planting, Paver patios, Walkways, Retaining walls, Grading and site prep, Pool
and pond excavation, Land clearing, Tree and stump removal, Drainage and French
drains, Forestry mulching. These are the 13 on the Google profile.

## Pictures

- `social/profile-picture.png`: the badge on the flyer's deep green, 1080 square.
  Checked in a circle crop; nothing is cut off.
- `social/facebook-cover.jpg`: the Mount Pleasant front-bed job from the
  homepage, 16:9 with no text on it, so neither the phone nor the desktop crop
  cuts a word in half.
- For listing photo galleries, upload **Josiah's own photos only**, never the
  stock in `src/assets/stock/`: the landscaping and hardscapes before and
  after pairs, the walkway, the stump root ball, and the machine photos (those
  are his operating experience on another crew, so caption them as "Josiah
  operating", not as Firm Foundation jobs).

## When a profile goes live

Add its public URL to `sameAs` in `src/lib/schema.ts` (Facebook also gets a
link beside Instagram in the footer and on the contact page). That tells
Google the profiles are all the same business.
