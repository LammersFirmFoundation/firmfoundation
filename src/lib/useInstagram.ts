import { useQuery } from "@tanstack/react-query";

/** Mirrors the shape `api/instagram.ts` returns (kept separate, like the reviews types). */
export type InstagramPost = {
  id: string;
  permalink: string;
  timestamp: string;
  kind: "image" | "video" | "carousel";
  caption: string;
  alt: string;
  src: string;
  srcSet: string;
};

export type InstagramFeed = { username: string | null; posts: InstagramPost[] };

/**
 * Josiah's latest Instagram posts. `initialData` comes from the homepage
 * loader at build time; a live browser still refetches in the background,
 * like the reviews. No posts (feed not connected, or the API down) is a
 * normal state: the strip simply doesn't render.
 */
export function useInstagram(initialData?: InstagramFeed): InstagramPost[] {
  const { data } = useQuery<InstagramFeed>({
    queryKey: ["instagram"],
    queryFn: async () => {
      const res = await fetch("/api/instagram");
      if (!res.ok) throw new Error(`Instagram API returned ${res.status}`);
      return res.json();
    },
    staleTime: 1000 * 60 * 60,
    retry: 1,
    initialData,
    initialDataUpdatedAt: initialData ? 0 : undefined,
  });
  return data?.posts ?? [];
}
