import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

type Props = {
  images: string[];
  alt: string;
  variant?: "grid" | "row";
  max?: number;
  className?: string;
  onOpenChange?: (open: boolean) => void;
};

const ReviewImages = ({ images, alt, variant = "grid", max = 4, className, onOpenChange }: Props) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (!images?.length) return null;

  const shown = images.slice(0, max);
  const current = openIndex != null ? images[openIndex] : null;

  const prev = () => setOpenIndex((i) => (i == null ? i : (i - 1 + images.length) % images.length));
  const next = () => setOpenIndex((i) => (i == null ? i : (i + 1) % images.length));

  const containerClass =
    variant === "row"
      ? "flex gap-2 justify-center"
      : "grid grid-cols-2 gap-2";
  const itemClass =
    variant === "row"
      ? "h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0"
      : "aspect-square w-full";

  return (
    <>
      <div className={`${containerClass} ${className ?? ""}`}>
        {shown.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIndex(i)}
            className={`${itemClass} overflow-hidden rounded-md bg-muted group relative cursor-pointer ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`}
            aria-label={`Open photo ${i + 1} of ${images.length}`}
          >
            <img
              src={src}
              alt={`${alt} — photo ${i + 1}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-colors pointer-events-none">
              <Expand className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
            </div>
            {i === max - 1 && images.length > max && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold pointer-events-none">
                +{images.length - max}
              </div>
            )}
          </button>
        ))}
      </div>

      <Dialog
        open={openIndex != null}
        onOpenChange={(o) => {
          if (!o) setOpenIndex(null);
          onOpenChange?.(o);
        }}
      >
        <DialogContent
          className="max-w-[95vw] sm:max-w-4xl p-0 bg-transparent border-0 shadow-none [&>button]:hidden"
          onClick={() => setOpenIndex(null)}
        >
          {current && (
            <div className="relative flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img
                src={current}
                alt={alt}
                referrerPolicy="no-referrer"
                className="max-h-[85vh] w-auto rounded-md"
              />
              <button
                type="button"
                onClick={() => setOpenIndex(null)}
                aria-label="Close"
                className="absolute top-2 right-2 h-10 w-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/90 text-sm bg-black/60 rounded-full px-3 py-1">
                    {openIndex! + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewImages;
