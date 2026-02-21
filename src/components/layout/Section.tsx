import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "muted" | "dark" | "primary";
  id?: string;
}

const variantStyles = {
  default: "",
  muted: "bg-muted/50",
  dark: "bg-foreground text-background",
  primary: "bg-primary text-primary-foreground",
};

const Section = ({ children, className, variant = "default", id }: SectionProps) => {
  return (
    <section
      id={id}
      className={cn(
        "py-section-sm md:py-section px-4",
        variantStyles[variant],
        className
      )}
    >
      <div className="container mx-auto max-w-content">
        {children}
      </div>
    </section>
  );
};

export default Section;
