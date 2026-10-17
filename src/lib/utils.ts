import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge has to be told about the custom font sizes in
 * tailwind.config.ts. Without this it reads `text-title` as a colour, and
 * `cn("text-title text-foreground")` silently drops the size, which is how
 * every section heading once rendered at body size.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display", "hero", "title", "subtitle"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
