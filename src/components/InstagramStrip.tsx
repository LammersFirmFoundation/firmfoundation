import { Instagram, Play, Layers } from "lucide-react";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import FadeInView from "@/components/animations/FadeInView";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/data/business";
import type { InstagramPost } from "@/lib/useInstagram";

/** Fixed to Charleston time so the prerendered date and the browser's agree. */
const postDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/New_York" });
};

/**
 * Josiah's six latest Instagram posts, set in the site's own type and grid
 * rather than an embedded widget: no iframe, no Instagram chrome, no third-
 * party script. Each picture links to the post on Instagram.
 *
 * Renders nothing at all when there are no posts (the feed isn't connected,
 * or the API is down), so the page never shows an empty frame.
 */
const InstagramStrip = ({ posts }: { posts: InstagramPost[] }) => {
  if (!posts.length) return null;

  return (
    <Section>
      <SectionHeader
        eyebrow="On Instagram"
        title="Lately, on the job"
        subtitle={`The latest from ${BUSINESS.instagramHandle}, straight from the job site.`}
      />
      <FadeInView>
        <ul className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6 lg:gap-4">
          {posts.map((post) => (
            <li key={post.id} className="min-w-0">
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                <span className="relative block aspect-square overflow-hidden rounded-[3px] bg-muted">
                  <img
                    src={post.src}
                    srcSet={post.srcSet}
                    sizes="(min-width: 1024px) 200px, 33vw"
                    alt={post.alt}
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={400}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.04]"
                  />
                  {post.kind !== "image" && (
                    // Instagram's own convention: a small mark says it's a
                    // video or a set of photos before anyone taps.
                    <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-[3px] bg-background/90 text-foreground sm:right-2 sm:top-2">
                      {post.kind === "video" ? (
                        <Play className="h-3 w-3 fill-current" aria-hidden="true" />
                      ) : (
                        <Layers className="h-3 w-3" aria-hidden="true" />
                      )}
                      <span className="sr-only">{post.kind === "video" ? "Video" : "Several photos"}</span>
                    </span>
                  )}
                </span>
                <span className="mt-2 hidden items-baseline justify-between gap-2 text-xs text-muted-foreground lg:flex">
                  <time dateTime={post.timestamp}>{postDate(post.timestamp)}</time>
                  <span className="transition-colors group-hover:text-foreground">View post</span>
                </span>
                <span className="sr-only">, opens on Instagram</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button asChild variant="outline">
            <a href={BUSINESS.instagram} target="_blank" rel="noopener noreferrer">
              <Instagram aria-hidden="true" />
              Follow {BUSINESS.instagramHandle}
            </a>
          </Button>
        </div>
      </FadeInView>
    </Section>
  );
};

export default InstagramStrip;
