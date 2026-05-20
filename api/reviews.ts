// Minimal request/response types to avoid a @vercel/node dep.
// Vercel provides Node http IncomingMessage + a ServerResponse with json/status helpers.
type VercelRequest = { method?: string; query: Record<string, string | string[]> };
type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => VercelResponse;
  setHeader: (name: string, value: string) => VercelResponse;
};

type ApifyReview = {
  name?: string;
  reviewerName?: string;
  reviewerPhotoUrl?: string;
  reviewImageUrls?: string[];
  reviewUrl?: string;
  text?: string;
  textTranslated?: string | null;
  stars?: number;
  publishedAtDate?: string;
  publishAt?: string;
  // The flat reviews actor carries the place these belong to on each item,
  // which lets us reject reviews scraped for a different business.
  title?: string;
  url?: string;
};

type ApifyDatasetItem = {
  title?: string;
  url?: string;
  totalScore?: number;
  reviewsCount?: number;
  reviews?: ApifyReview[];
};

type Review = {
  name: string;
  location: string;
  rating: number;
  date: string;
  review: string;
  service: string;
  avatarUrl?: string;
  images?: string[];
  sourceUrl?: string;
};

type ApiResponse = {
  reviews: Review[];
  aggregateRating: number | null;
  totalReviewCount: number | null;
};

const formatDate = (iso?: string): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = process.env.APIFY_TOKEN;
  // Data source, in priority order:
  //   1. APIFY_RUN_ID  – an exact run, so we read precisely the scrape we want.
  //   2. APIFY_TASK_ID – a per-business task; its "runs/last" is scoped to that
  //      business only.
  //   3. actor "runs/last" – whatever ran most recently across the whole
  //      account/actor. This is the fragile default that once made this site
  //      show another business's reviews, so we only fall back to it.
  // Defaults to the "firm-foundation-reviews" task, whose every run scrapes
  // only Firm Foundation's place — so its latest run is always the right data.
  const runId = process.env.APIFY_RUN_ID;
  const taskId = process.env.APIFY_TASK_ID ?? "JKIP67d4omFdYH0Qp";
  const actorId = process.env.APIFY_ACTOR_ID ?? "compass~Google-Maps-Reviews-Scraper";
  // Safety net: only ever surface reviews for Firm Foundation's Google place,
  // so a run that scraped another business can never leak onto this site.
  const placeId = process.env.APIFY_PLACE_ID ?? "ChIJ5eaJLR-TCSgRcovM30Gs8yw";

  if (!token) {
    res.status(500).json({ error: "APIFY_TOKEN not configured" });
    return;
  }

  try {
    const base = runId
      ? `https://api.apify.com/v2/actor-runs/${runId}/dataset/items`
      : taskId
        ? `https://api.apify.com/v2/actor-tasks/${taskId}/runs/last/dataset/items`
        : `https://api.apify.com/v2/acts/${actorId}/runs/last/dataset/items`;
    // status=SUCCEEDED only applies to the "runs/last" endpoints; harmless on a
    // pinned run.
    const url = `${base}?token=${token}&status=SUCCEEDED&clean=true`;
    const apifyRes = await fetch(url);

    if (!apifyRes.ok) {
      res.status(502).json({ error: `Apify API returned ${apifyRes.status}` });
      return;
    }

    const items = (await apifyRes.json()) as (ApifyDatasetItem | ApifyReview)[];

    // Some reviews-only actors return a flat list of review objects;
    // the general places actor returns place items with a `reviews` array.
    // Normalize both.
    let rawReviews: ApifyReview[] = [];
    let aggregateRating: number | null = null;
    let totalReviewCount: number | null = null;

    const isOurPlace = (placeUrl?: string): boolean =>
      !placeId || (placeUrl ?? "").includes(placeId);

    if (items.length > 0 && "reviews" in items[0] && Array.isArray((items[0] as ApifyDatasetItem).reviews)) {
      // Place-shaped items: keep only the place matching our place_id.
      const places = (items as ApifyDatasetItem[]).filter((p) => isOurPlace(p.url));
      const place = places[0];
      rawReviews = place?.reviews ?? [];
      aggregateRating = typeof place?.totalScore === "number" ? place.totalScore : null;
      totalReviewCount = typeof place?.reviewsCount === "number" ? place.reviewsCount : null;
    } else {
      rawReviews = (items as ApifyReview[]).filter((r) => isOurPlace(r.url));
      totalReviewCount = rawReviews.length;
      if (rawReviews.length > 0) {
        const sum = rawReviews.reduce((acc, r) => acc + (r.stars ?? 0), 0);
        aggregateRating = Math.round((sum / rawReviews.length) * 10) / 10;
      }
    }

    const reviews: Review[] = rawReviews
      .filter((r) => typeof r.stars === "number" && r.stars >= 4 && (r.text ?? "").trim().length > 0)
      .sort((a, b) => {
        const ad = a.publishedAtDate ? new Date(a.publishedAtDate).getTime() : 0;
        const bd = b.publishedAtDate ? new Date(b.publishedAtDate).getTime() : 0;
        return bd - ad;
      })
      .slice(0, 20)
      .map((r) => ({
        name: r.reviewerName ?? r.name ?? "Google Reviewer",
        location: "",
        rating: r.stars ?? 5,
        date: formatDate(r.publishedAtDate) || r.publishAt || "",
        review: (r.textTranslated ?? r.text ?? "").trim(),
        service: "Google Review",
        avatarUrl: r.reviewerPhotoUrl,
        images: r.reviewImageUrls ?? [],
        sourceUrl: r.reviewUrl,
      }));

    const body: ApiResponse = { reviews, aggregateRating, totalReviewCount };

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=604800"
    );
    res.status(200).json(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
}
