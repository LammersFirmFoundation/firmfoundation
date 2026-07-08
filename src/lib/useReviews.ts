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

  return {
    reviews,
    aggregateRating: data?.aggregateRating ?? 5.0,
    totalReviewCount: data?.totalReviewCount ?? reviews.length,
    isLive: Boolean(live),
    isLoading,
  };
}
