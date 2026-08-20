import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

interface HeroVideoProps {
  /** Shown immediately, and left as the only background on phones. */
  poster: string;
  /**
   * WebP variants of the poster. This still is the page's LCP element, and it
   * was being served at full desktop size to every phone on cellular — the
   * single largest download on the site's most important screen.
   */
  posterSrcSet?: string;
  posterAlt: string;
  /** Optional clip. Omit it and the hero is just the still. */
  src?: string;
}

/**
 * The hero still always carries the layout; the clip is an enhancement that
 * fades in only once it can actually play, so there is never a black flash.
 *
 * Phones never download the video at all — they keep the poster — and neither
 * does anyone who has asked for reduced motion. Both layers drift and scale
 * slightly slower than the page scrolls, which is most of what gives the
 * reference site's hero its sense of depth.
 */
const HeroVideo = ({ poster, posterSrcSet, posterAlt, src }: HeroVideoProps) => {
  const [showVideo, setShowVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 160]);
  const scale = useTransform(scrollY, [0, 1000], [1, 1.14]);

  useEffect(() => {
    const wideEnough = window.matchMedia("(min-width: 768px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => setShowVideo(wideEnough.matches && !reducedMotion.matches);
    sync();

    wideEnough.addEventListener("change", sync);
    reducedMotion.addEventListener("change", sync);
    return () => {
      wideEnough.removeEventListener("change", sync);
      reducedMotion.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        style={shouldReduceMotion ? undefined : { y, scale }}
        className="absolute inset-0 will-change-transform"
      >
        <img
          src={poster}
          srcSet={posterSrcSet}
          sizes="100vw"
          alt={posterAlt}
          width={1600}
          height={900}
          {...{ fetchpriority: "high" }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {src && showVideo && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            onCanPlay={() => setVideoReady(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
          >
            <source src={src} type="video/mp4" />
          </video>
        )}
      </motion.div>
    </div>
  );
};

export default HeroVideo;
