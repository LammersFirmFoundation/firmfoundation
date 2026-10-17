import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        // Manrope for everything readable. Archivo for display type and for the
        // small tracked capitals (eyebrows, buttons): its width axis gives the
        // heavy condensed cut of the flyer's headline and the business card's
        // "SERVICES" from one variable file, and at full width the same family
        // sets the spaced capitals of "PROPERTY SERVICES" under the badge.
        'sans': ['Manrope', 'system-ui', 'sans-serif'],
        'heading': ['Archivo', 'Arial Narrow', 'system-ui', 'sans-serif'],
        'label': ['Archivo', 'system-ui', 'sans-serif'],
        // A Clarendon revival, the face the flyer sets its service names and
        // phone number in. Kept to quotes and numerals: one warm note, not a
        // third body face.
        'serif': ['Besley', 'Georgia', 'serif'],
      },
      fontSize: {
        // Fluid so the huge display sizes shrink gracefully instead of needing
        // a breakpoint override at every call site.
        // Three steps, largest first, and nothing on the site is set bigger
        // than the homepage H1 (the review of 2026-10-17 found it was the
        // smallest headline on the site, under its own closing CTA).
        // display: the homepage H1 only. hero: interior page H1s. title:
        // section headings and the closing CTA.
        'display': ['clamp(2.5rem, 5.8vw, 5.5rem)', { lineHeight: '0.9', letterSpacing: '-0.005em' }],
        'hero': ['clamp(2.25rem, 5vw, 4.5rem)', { lineHeight: '0.94', letterSpacing: '-0.008em' }],
        'title': ['clamp(2rem, 3.8vw, 3.5rem)', { lineHeight: '0.96', letterSpacing: '-0.012em' }],
        'subtitle': ['clamp(1.0625rem, 1.6vw, 1.375rem)', { lineHeight: '1.5', letterSpacing: '0' }],
      },
      letterSpacing: {
        'eyebrow': '0.22em',
      },
      spacing: {
        'section': '6.5rem',
        'section-sm': '4rem',
      },
      maxWidth: {
        'content': '1280px',
        'narrow': '760px',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        cream: {
          DEFAULT: "hsl(var(--cream))",
          foreground: "hsl(var(--cream-foreground))",
        },
        highlight: "hsl(var(--highlight))",
        paper: "hsl(var(--paper))",
        sand: "hsl(var(--sand))",
        forest: {
          DEFAULT: "hsl(var(--forest))",
          deep: "hsl(var(--forest-deep))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      transitionTimingFunction: {
        'editorial': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
