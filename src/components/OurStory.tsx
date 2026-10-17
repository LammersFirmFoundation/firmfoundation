import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import FadeInView from "@/components/animations/FadeInView";
import { cn } from "@/lib/utils";

import josiahAndDonnie from "@/assets/story/josiah-and-uncle-donnie.jpg";
import josiahAndDonnieSet from "@/assets/story/josiah-and-uncle-donnie.jpg?w=380;640;900&format=webp&quality=68&as=srcset";
import josiahToyTractor from "@/assets/story/josiah-toy-tractor.jpg";
import josiahToyTractorSet from "@/assets/story/josiah-toy-tractor.jpg?w=200;320;480&format=webp&quality=68&as=srcset";

/**
 * `srcSet` carries WebP variants; `src` stays the original JPEG as the
 * fallback. The two photos render at very different sizes (the lead fills a
 * five-column spread, the second is a small inset in the text column), so they
 * get different width ladders rather than a shared default.
 */
type StoryPhoto = {
  src: string;
  srcSet: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
};

/** Family photos. The layout also handles one photo, or none. */
const photos: StoryPhoto[] = [
  {
    src: josiahAndDonnie,
    srcSet: josiahAndDonnieSet,
    alt: "Josiah as a small child sitting in an excavator cab on his Uncle Donnie's lap",
    caption: "Josiah and Uncle Donnie",
    width: 915,
    height: 1128,
  },
  {
    src: josiahToyTractor,
    srcSet: josiahToyTractorSet,
    alt: "Josiah as a young boy driving a toy tractor in the front yard",
    caption: "An early start",
    width: 1100,
    height: 828,
  },
];

interface OurStoryProps {
  /** Render the heading as an h1, for a page where the story is the title. */
  asPageHeading?: boolean;
  className?: string;
  /** Link out to /about. Off when the component is already on /about. */
  showLink?: boolean;
  /**
   * The homepage version: one photo and two lines. The full spread is for
   * /about, where the story is the point; on the homepage it was the
   * second-tallest block on a page whose job is to get someone to call.
   */
  compact?: boolean;
}

/** A family photo, captioned underneath like everything else on the site. */
const StoryFigure = ({
  photo,
  sizes,
  className,
  captionClassName,
}: {
  photo: StoryPhoto;
  sizes: string;
  className?: string;
  captionClassName?: string;
}) => (
  <figure className={className}>
    <img
      src={photo.src}
      srcSet={photo.srcSet}
      sizes={sizes}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      loading="lazy"
      decoding="async"
      className="h-auto w-full rounded-[3px] bg-muted object-cover"
    />
    {photo.caption && (
      <figcaption className={cn("mt-3 text-sm text-muted-foreground", captionClassName)}>
        {photo.caption}
      </figcaption>
    )}
  </figure>
);

const MoreLink = ({ className }: { className?: string }) => (
  <Link
    to="/about"
    className={cn(
      "group inline-flex items-center gap-2 text-sm font-semibold text-foreground underline decoration-foreground/25 underline-offset-[5px] transition-colors hover:decoration-foreground",
      className
    )}
  >
    More about Firm Foundation
    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
  </Link>
);

/**
 * The Uncle Donnie story, set like a short magazine feature: the photograph
 * carries one side, the story the other, and its last line comes out as a
 * pull line across the full measure. Photos sit square-on with their captions
 * underneath; the tilted polaroids this replaced were the scrapbook cliché
 * every "our story" template reaches for.
 */
const OurStory = ({
  asPageHeading = false,
  className,
  showLink = false,
  compact = false,
}: OurStoryProps) => {
  const Heading = asPageHeading ? "h1" : "h2";
  const [lead, inset] = photos;

  // The homepage strip: the photo at a size where a face reads (it was a
  // 190px thumbnail), and the link right under the paragraph it continues,
  // at every width. It used to float at the far right edge on a desktop,
  // 450px from the sentence it belonged to. No mark: the heading opens it.
  if (compact && lead) {
    return (
      <div
        className={cn(
          "grid grid-cols-[6.5rem_minmax(0,1fr)] items-start gap-6 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-10 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-end lg:gap-14",
          className
        )}
      >
        <FadeInView direction="none">
          <StoryFigure photo={lead} sizes="(min-width: 1024px) 272px, (min-width: 640px) 176px, 104px" captionClassName="text-xs" />
        </FadeInView>
        <div className="min-w-0 lg:pb-8">
          <Heading className="font-heading text-3xl leading-[0.98] text-foreground text-balance md:text-[2.75rem]">
            It started in the cab.
          </Heading>
          <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground md:text-lg">
            Josiah grew up in his Uncle Donnie&rsquo;s excavator, learning that a job isn&rsquo;t
            finished until it&rsquo;s finished right. He runs Firm Foundation the same way.
          </p>
          {showLink && <MoreLink className="mt-5 md:mt-6" />}
        </div>
      </div>
    );
  }

  // No mark: on /about the one mark is on the section that explains the name.
  const heading = <Heading className="text-title font-heading text-foreground">It started in the cab</Heading>;

  const body = (
    <div className="mt-8 max-w-[34rem] space-y-5 text-lg leading-relaxed text-muted-foreground md:text-xl md:leading-relaxed">
      <p>
        Josiah was barely old enough to walk the first time his Uncle Donnie
        sat him in an excavator.
      </p>
      <p>
        He grew up around that work, moving dirt and learning grade from a man
        who believed a job wasn&rsquo;t finished until it was finished right.
      </p>
    </div>
  );

  // The story's last line, pulled out across the full width: the one sentence
  // the whole page hangs on. Set at the section-heading size, never above the
  // page's H1 (at 84px it was bigger than the title of the page it sat on).
  const pullLine = (
    <p className="mt-14 border-t border-border pt-8 text-title font-heading text-foreground text-balance md:mt-20 md:pt-10">
      He runs Firm Foundation the same way.
    </p>
  );

  // Without photos the story reads best as one narrow column. It looks
  // deliberate, rather than a two-column layout missing its left half.
  if (!lead) {
    return (
      <div className={cn("max-w-narrow", className)}>
        {heading}
        {body}
        {pullLine}
        {showLink && <MoreLink className="mt-10" />}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <FadeInView className="lg:col-span-5">
          <StoryFigure photo={lead} sizes="(min-width: 1024px) 34vw, (min-width: 640px) 28rem, 90vw" className="max-w-md lg:max-w-none" />
        </FadeInView>

        <div className="lg:col-span-6 lg:col-start-7 lg:pt-2">
          {heading}
          {body}
          {inset && (
            <FadeInView delay={0.1}>
              <StoryFigure
                photo={inset}
                sizes="(min-width: 1024px) 15rem, 55vw"
                className="mt-10 w-[62%] max-w-[16rem] md:mt-12"
              />
            </FadeInView>
          )}
        </div>
      </div>

      {pullLine}
      {showLink && <MoreLink className="mt-10" />}
    </div>
  );
};

export default OurStory;
