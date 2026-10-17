// Minimal request/response types to avoid a @vercel/node dep (same as reviews.ts).
type VercelRequest = { method?: string; query: Record<string, string | string[]> };
type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => VercelResponse;
  setHeader: (name: string, value: string) => VercelResponse;
};

/**
 * Josiah's latest Instagram posts, for the strip on the homepage.
 *
 * The source is a Behold JSON feed (behold.so). Behold holds the Instagram
 * login and refreshes its token, which Instagram expires every 60 days, and it
 * re-hosts each picture on its own CDN at fixed sizes. Instagram's own image
 * URLs are signed and expire, so they can't be hotlinked from a static page.
 *
 * Behold's free plan counts every request that reaches its servers and pauses
 * the feed at 1,200 a month. Browsers never call Behold directly: they call
 * this endpoint, and the Cache-Control below lets Vercel's CDN answer almost
 * every request without reaching Behold at all. The free plan only refreshes
 * once a day anyway, so a six-hour cache loses nothing.
 *
 * Not configured (no BEHOLD_FEED_ID) is a normal state: it returns no posts,
 * and the strip doesn't render.
 */

type BeholdSize = { mediaUrl: string; width: number; height: number };
type BeholdPost = {
  id: string;
  timestamp: string;
  permalink: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  isReel?: boolean;
  caption?: string;
  prunedCaption?: string;
  altText?: string;
  sizes?: { small?: BeholdSize; medium?: BeholdSize; large?: BeholdSize; full?: BeholdSize };
  children?: { sizes?: BeholdPost["sizes"] }[];
};
type BeholdFeed = { username?: string; posts?: BeholdPost[] };

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

/** Only Behold's own CDN is trusted for pictures, so a bad feed can't point the page anywhere else. */
const isBeholdImage = (url?: string) => {
  try {
    return Boolean(url) && /(^|\.)behold\.pictures$/.test(new URL(url as string).hostname);
  } catch {
    return false;
  }
};

const firstLine = (text: string, max: number) => {
  const line = text.split(/\n+/)[0].trim();
  return line.length > max ? `${line.slice(0, max - 1).trimEnd()}…` : line;
};

const normalize = (post: BeholdPost): InstagramPost | null => {
  // A video or carousel carries its picture on the first frame or child.
  const sizes = post.sizes ?? post.children?.[0]?.sizes;
  const pick = [sizes?.small, sizes?.medium, sizes?.large].filter(
    (s): s is BeholdSize => Boolean(s && isBeholdImage(s.mediaUrl)),
  );
  if (!pick.length || !/^https:\/\/(www\.)?instagram\.com\//.test(post.permalink)) return null;

  const caption = (post.prunedCaption ?? post.caption ?? "").trim();
  return {
    id: post.id,
    permalink: post.permalink,
    timestamp: post.timestamp,
    kind: post.mediaType === "VIDEO" ? "video" : post.mediaType === "CAROUSEL_ALBUM" ? "carousel" : "image",
    caption: firstLine(caption, 140),
    alt: (post.altText ?? "").trim() || (caption ? `Instagram post: ${firstLine(caption, 120)}` : "Instagram post from Firm Foundation"),
    src: (sizes?.medium ?? pick[0]).mediaUrl,
    srcSet: pick.map((s) => `${s.mediaUrl} ${s.width}w`).join(", "),
  };
};

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const feedId = process.env.BEHOLD_FEED_ID;

  if (!feedId || !/^[A-Za-z0-9_-]+$/.test(feedId)) {
    // Short cache, so the strip appears soon after the feed is connected.
    res.setHeader("Cache-Control", "public, s-maxage=300");
    res.status(200).json({ username: null, posts: [] } satisfies InstagramFeed);
    return;
  }

  try {
    const upstream = await fetch(`https://feeds.behold.so/${feedId}`);
    if (!upstream.ok) {
      res.setHeader("Cache-Control", "public, s-maxage=300");
      res.status(502).json({ error: `Behold returned ${upstream.status}` });
      return;
    }
    const feed = (await upstream.json()) as BeholdFeed;
    const posts = (feed.posts ?? [])
      .map(normalize)
      .filter((p): p is InstagramPost => p !== null)
      .slice(0, 6);

    res.setHeader("Cache-Control", "public, s-maxage=21600, stale-while-revalidate=86400");
    res.status(200).json({ username: feed.username ?? null, posts } satisfies InstagramFeed);
  } catch (err) {
    res.setHeader("Cache-Control", "public, s-maxage=300");
    res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
}
