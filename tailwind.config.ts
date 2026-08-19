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
        // Manrope for everything readable, Outfit for display type. Outfit is
        // the closest free stand-in for the reference site's Nohemi: geometric,
        // flat-terminalled, and usable all the way down to weight 200.
        'sans': ['Manrope', 'system-ui', 'sans-serif'],
        'heading': ['Outfit', 'Manrope', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Fluid so the huge display sizes shrink gracefully instead of needing
        // a breakpoint override at every call site.
        'display': ['clamp(3rem, 8.6vw, 8rem)', { lineHeight: '0.88', letterSpacing: '-0.035em' }],
        'hero': ['clamp(2.35rem, 6.4vw, 5.25rem)', { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        'title': ['clamp(1.875rem, 4.2vw, 3.5rem)', { lineHeight: '0.98', letterSpacing: '-0.025em' }],
        'subtitle': ['clamp(1.125rem, 1.8vw, 1.5rem)', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
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
        charcoal: {
          DEFAULT: "hsl(var(--charcoal))",
          deep: "hsl(var(--charcoal-deep))",
        },
        "brand-yellow": "hsl(var(--brand-yellow))",
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
