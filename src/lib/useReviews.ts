import { useQuery } from "@tanstack/react-query";
import { fallbackReviews, type Review } from "@/data/fallbackReviews";

export type ApiResponse = {
  reviews: Review[];
  aggregateRating: number | null;
  totalReviewCount: number | null;
};

export type UseReviewsResult = {
  reviews: Review[];
  aggregateRating: number;
  totalReviewCount: number;
  isLive: boolean;
  isLoading: boolean;
};

/**
 * `initialData` comes from the route loader (see App.tsx), which fetches
 * /api/reviews at SSG build time so real reviews — not the static fallback —
 * get baked into the prerendered HTML crawlers see. It's marked as already
 * stale (updatedAt 0) so a live browser still kicks off a background refetch
 * on mount, same as before.
 */
export function useReviews(initialData?: ApiResponse): UseReviewsResult {
  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await fetch("/api/reviews");
      if (!res.ok) throw new Error(`Reviews API returned ${res.status}`);
      return res.json();
    },
    staleTime: 1000 * 60 * 60, // 1h — edge cache is already 24h
    retry: 1,
    initialData,
    initialDataUpdatedAt: initialData ? 0 : undefined,
  });

  const live = data?.reviews?.length ? data.reviews : null;
  const reviews = live ?? fallbackReviews;

  // Derived from whatever reviews are actually on screen. The old default of a
  // flat 5.0 meant a failed API produced a headline rating that disagreed with
  // the reviews rendered right beneath it.
  const derivedRating = reviews.length
    ? Math.round(
        (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10
      ) / 10
    : 5;

  return {
    reviews,
    // Only trust the API's totals when the API is what supplied `reviews`.
    // A response with a rating but an empty review list would otherwise print
    // a headline describing a different set than the one rendered below it.
    aggregateRating: (live && data?.aggregateRating) || derivedRating,
    totalReviewCount: (live && data?.totalReviewCount) || reviews.length,
    isLive: Boolean(live),
    isLoading,
  };
}
