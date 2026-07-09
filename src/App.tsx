import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import type { RouteRecord } from "vite-react-ssg";
import type { ApiResponse } from "./lib/useReviews";
import ScrollToTop from "./components/ScrollToTop";
import MobileCTABar from "./components/MobileCTABar";
import LandingPage from "./pages/LandingPage";
import ServicesPage from "./pages/ServicesPage";
import Gallery from "./pages/Gallery";
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
    const url = import.meta.env.SSR
      ? "https://firmfoundationsc.com/api/reviews"
      : "/api/reviews";
    const res = await fetch(url);
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
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ScrollToTop />
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
      { path: "contact", element: <ContactUs /> },
      { path: "reviews", element: <Reviews />, loader: reviewsLoader },
      // Catch-all 404 — must remain last.
      { path: "*", element: <NotFound /> },
    ],
  },
];
