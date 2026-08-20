import { Link } from "react-router-dom";
import FadeInView from "@/components/animations/FadeInView";
import { cn } from "@/lib/utils";

import josiahAndDonnie from "@/assets/story/josiah-and-uncle-donnie.jpg";
import josiahAndDonnieSet from "@/assets/story/josiah-and-uncle-donnie.jpg?w=380;640;900&format=webp&quality=68&as=srcset";
import josiahToyTractor from "@/assets/story/josiah-toy-tractor.jpg";
import josiahToyTractorSet from "@/assets/story/josiah-toy-tractor.jpg?w=200;320;480&format=webp&quality=68&as=srcset";

/**
 * `srcSet` carries WebP variants; `src` stays the original JPEG as the
 * fallback. The two prints render at very different sizes — the big one fills
 * a ~380px column, the tucked one is 44% of it — so they get different width
 * ladders rather than a shared default.
 */
type StoryPhoto = { src: string; srcSet: string; alt: string; caption?: string };

/** Family photos. The layout also handles one photo, or none. */
const photos: StoryPhoto[] = [
  {
    src: josiahAndDonnie,
    srcSet: josiahAndDonnieSet,
    alt: "Josiah as a small child sitting in an excavator cab on his Uncle Donnie's lap",
    caption: "Josiah and Uncle Donnie",
  },
  {
    src: josiahToyTractor,
    srcSet: josiahToyTractorSet,
    alt: "Josiah as a young boy driving a toy tractor in the front yard",
    caption: "An early start",
  },
];

interface OurStoryProps {
  /** Render the heading as an h1 — for the About page, where it's the title. */
  asPageHeading?: boolean;
  className?: string;
  /** Link out to /about. Off when the component is already on /about. */
  showLink?: boolean;
}

/**
 * Sits in a light `cream` section, so it uses the semantic tokens and picks up
 * the light palette that `.on-cream` remaps for its subtree.
 */
const OurStory = ({
  asPageHeading = false,
  className,
  showLink = false,
}: OurStoryProps) => {
  const Heading = asPageHeading ? "h1" : "h2";
  const hasPhotos = photos.length > 0;

  const story = (
    <>
      <p className="eyebrow text-primary mb-6">Our Story</p>
      <Heading className="text-hero font-heading text-foreground mb-10">
        It started
        <br />
        in the cab
      </Heading>
      <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
        <p>
          Josiah was barely old enough to walk the first time his Uncle Donnie
          sat him in an excavator.
        </p>
        <p>
          He grew up around that work &mdash; moving dirt, learning grade,
          learning from a man who believed a job wasn&rsquo;t finished until it
          was finished right.
        </p>
        <p className="text-foreground text-2xl md:text-3xl font-heading">
          He runs Firm Foundation the same way.
        </p>
      </div>
      {showLink && (
        <Link
          to="/about"
          className="inline-block mt-10 eyebrow text-primary hover:text-foreground border-b border-primary/40 hover:border-foreground pb-1 transition-colors"
        >
          More about Firm Foundation
        </Link>
      )}
    </>
  );

  // Without photos the story reads best as one narrow column — it looks
  // deliberate, rather than a two-column layout missing its left half.
  if (!hasPhotos) {
    return (
      <div className={cn("max-w-narrow mx-auto", className)}>
        <FadeInView>{story}</FadeInView>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center",
        className
      )}
    >
      <FadeInView direction="left">
        {/* White mats and a drop shadow so the photos read as prints laid on a table. */}
        <div className="relative mx-auto max-w-md pb-20 md:pb-24 pr-4 sm:pr-10">
          <figure className="rotate-[-2deg] bg-white p-3 pb-4 shadow-2xl ring-1 ring-black/5">
            <img
              src={photos[0].src}
              srcSet={photos[0].srcSet}
              sizes="(min-width: 768px) 380px, 90vw"
              alt={photos[0].alt}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover"
            />
            {photos[0].caption && (
              <figcaption className="mt-3 pl-1 text-left text-sm text-neutral-600 italic">
                {photos[0].caption}
              </figcaption>
            )}
          </figure>

          {photos[1] && (
            <figure className="absolute -bottom-10 -right-3 sm:-right-8 w-[44%] rotate-[4deg] bg-white p-2 pb-3 shadow-2xl ring-1 ring-black/5">
              <img
                src={photos[1].src}
                srcSet={photos[1].srcSet}
                sizes="(min-width: 768px) 170px, 40vw"
                alt={photos[1].alt}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover"
              />
              {photos[1].caption && (
                <figcaption className="mt-2 text-center text-xs text-neutral-600 italic">
                  {photos[1].caption}
                </figcaption>
              )}
            </figure>
          )}
        </div>
      </FadeInView>

      <FadeInView direction="right" delay={0.15}>
        {story}
      </FadeInView>
    </div>
  );
};

export default OurStory;
