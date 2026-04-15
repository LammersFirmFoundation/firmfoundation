import { useQuery } from "@tanstack/react-query";
import { fallbackReviews, type Review } from "@/data/fallbackReviews";

type ApiResponse = {
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

export function useReviews(): UseReviewsResult {
  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await fetch("/api/reviews");
      if (!res.ok) throw new Error(`Reviews API returned ${res.status}`);
      return res.json();
    },
    staleTime: 1000 * 60 * 60, // 1h — edge cache is already 24h
    retry: 1,
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
