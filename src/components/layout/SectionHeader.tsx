import FadeInView from "@/components/animations/FadeInView";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  /** First line of the display heading. */
  title: string;
  /**
   * Second line, set in the bronze accent. The reference design breaks almost
   * every section heading over two lines this way ("Recent / Work",
   * "Client / Reviews") — it's what makes the huge type feel composed rather
   * than merely large.
   */
  accent?: string;
  /** Small uppercase label above the heading. */
  eyebrow?: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
  /** Render as h1 — for page headers where this is the document title. */
  as?: "h1" | "h2";
}

const SectionHeader = ({
  title,
  accent,
  eyebrow,
  subtitle,
  align = "center",
  className,
  as: Heading = "h2",
}: SectionHeaderProps) => {
  const centered = align === "center";

  return (
    <FadeInView className={cn("mb-10 md:mb-14", className)}>
      {eyebrow && (
        <p
          className={cn(
            "eyebrow text-primary mb-4",
            centered && "text-center"
          )}
        >
          {eyebrow}
        </p>
      )}
      <Heading
        className={cn(
          "text-hero md:text-display font-heading",
          centered && "text-center"
        )}
      >
        {title}
        {accent && (
          <>
            <br />
            <span className="text-primary">{accent}</span>
          </>
        )}
      </Heading>
      {subtitle && (
        <p
          className={cn(
            "text-subtitle text-muted-foreground mt-7 max-w-narrow leading-relaxed",
            centered && "text-center mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </FadeInView>
  );
};

export default SectionHeader;
