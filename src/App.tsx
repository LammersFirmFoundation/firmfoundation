import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ClientOnly, type RouteRecord } from "vite-react-ssg";
import type { ApiResponse } from "./lib/useReviews";
import ScrollToTop from "./components/ScrollToTop";
import MobileCTABar from "./components/MobileCTABar";
import ScrollProgress from "./components/ScrollProgress";
import Analytics from "./components/Analytics";
import LandingPage from "./pages/LandingPage";
import ServicesPage from "./pages/ServicesPage";
import Gallery from "./pages/Gallery";
import AboutPage from "./pages/AboutPage";
import ContactUs from "./pages/ContactUs";
import Reviews from "./pages/Reviews";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/**
 * Runs at SSG build time (Node) and again on client-side navigation, hitting
 * our own public /api/reviews endpoint — never Apify directly, so no secret
 * ever touches the build or the client bundle. This is what lets real,
 * current Google reviews (not the static fallback) land in the prerendered
 * HTML that Google, AI crawlers, and social scrapers read.
 */
async function reviewsLoader(): Promise<ApiResponse | undefined> {
  try {
    // At build time the endpoint's own `stale-while-revalidate=604800` would
    // happily hand the prerender a copy up to a week old — which would bake
    // stale reviews and a stale rating into the exact HTML crawlers read, and
    // it did: a build ran while the CDN still held 5 reviews at 4.8 after the
    // real profile had moved to 7 at 4.9. A cache-buster on the SSR fetch only
    // (never the browser, which should keep using the shared cached copy)
    // guarantees the baked-in numbers are current as of the build.
    const url = import.meta.env.SSR
      ? `https://firmfoundationsc.com/api/reviews?build=${Date.now()}`
      : "/api/reviews";
    const res = await fetch(url, import.meta.env.SSR ? { cache: "no-store" } : undefined);
    if (!res.ok) return undefined;
    return (await res.json()) as ApiResponse;
  } catch {
    return undefined;
  }
}

// Shared layout: wraps every route with app-wide providers. vite-react-ssg
// supplies the router (and the Helmet head provider used by <Head>), so we no
// longer mount BrowserRouter or HelmetProvider here.
const RootLayout = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <TooltipProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-6 focus:py-3 focus:text-xs focus:font-semibold focus:uppercase focus:tracking-[0.14em] focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <Toaster />
        <Sonner />
        <ScrollToTop />
        <ScrollProgress />
        <ClientOnly>{() => <Analytics />}</ClientOnly>
        <Outlet />
        {/* Spacer so the fixed mobile bar never covers footer content */}
        <div className="h-14 md:hidden" aria-hidden="true" />
        <MobileCTABar />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage />, loader: reviewsLoader },
      { path: "services", element: <ServicesPage /> },
      { path: "gallery", element: <Gallery /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactUs /> },
      { path: "reviews", element: <Reviews />, loader: reviewsLoader },
      // Catch-all 404 — must remain last.
      { path: "*", element: <NotFound /> },
    ],
  },
];
