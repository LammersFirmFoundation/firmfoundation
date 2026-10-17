import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Square-cornered, sentence case, set in the body face at a firm weight: the
 * button reads like a printed label on Josiah's card rather than a pill from a
 * template. Colours come from the semantic tokens, so a button inside an
 * `.on-forest` band turns cream on green without per-call-site overrides.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-[3px] font-sans text-[0.9375rem] font-semibold tracking-[0.005em] ring-offset-background transition-[background-color,border-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-foreground/30 bg-transparent text-foreground hover:border-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        ghost: "hover:bg-foreground/[0.06]",
        link: "rounded-none text-primary underline decoration-primary/40 underline-offset-[5px] hover:decoration-primary",
        /** Solid light button, for use on photography or a dark ground. */
        contrast: "bg-cream text-cream-foreground hover:bg-cream/85",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-sm",
        lg: "h-[3.25rem] px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
