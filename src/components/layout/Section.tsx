import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  /**
   * `default` and `muted` sit on the dark charcoal ground; `cream` is the light
   * relief tone. `cream` re-maps the semantic colour tokens for its whole
   * subtree, so nested buttons, borders, and muted text follow without
   * per-call-site overrides.
   */
  variant?: "default" | "muted" | "cream";
  id?: string;
  /** Drop the container so children can run edge to edge. */
  bleed?: boolean;
  /**
   * A decorative layer painted behind the content, edge to edge. The section
   * becomes a positioning context and clips it, and the content is lifted
   * above it — so a caller only has to hand over an absolutely positioned node.
   */
  backdrop?: ReactNode;
}

const variantStyles: Record<NonNullable<SectionProps["variant"]>, string> = {
  default: "bg-background text-foreground",
  muted: "bg-muted text-foreground",
  cream: "on-cream bg-cream text-cream-foreground",
};

const Section = ({
  children,
  className,
  variant = "default",
  id,
  bleed = false,
  backdrop,
}: SectionProps) => {
  return (
    <section
      id={id}
      className={cn(
        "py-section-sm md:py-section",
        !bleed && "px-5 sm:px-6 md:px-10",
        backdrop && "relative overflow-hidden",
        variantStyles[variant],
        className
      )}
    >
      {backdrop}
      {bleed ? (
        children
      ) : (
        <div className={cn("container mx-auto max-w-content px-0", backdrop && "relative")}>
          {children}
        </div>
      )}
    </section>
  );
};

export default Section;
