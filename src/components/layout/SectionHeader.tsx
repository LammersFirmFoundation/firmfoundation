import FadeInView from "@/components/animations/FadeInView";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
  dark?: boolean;
}

const SectionHeader = ({
  title,
  subtitle,
  align = "center",
  className,
  dark = false,
}: SectionHeaderProps) => {
  return (
    <FadeInView className={cn("mb-12 md:mb-16", className)}>
      <h2
        className={cn(
          "text-hero md:text-display font-bold tracking-tight",
          align === "center" && "text-center",
          dark ? "text-background" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "text-lg md:text-xl mt-4 max-w-2xl leading-relaxed",
            align === "center" && "text-center mx-auto",
            dark ? "text-background/70" : "text-muted-foreground"
          )}
        >
          {subtitle}
        </p>
      )}
    </FadeInView>
  );
};

export default SectionHeader;
