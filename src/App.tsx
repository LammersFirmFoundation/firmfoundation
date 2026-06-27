import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import type { RouteRecord } from "vite-react-ssg";
import ScrollToTop from "./components/ScrollToTop";
import LandingPage from "./pages/LandingPage";
import ServicesPage from "./pages/ServicesPage";
import ContactUs from "./pages/ContactUs";
import Reviews from "./pages/Reviews";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "services", element: <ServicesPage /> },
      { path: "contact", element: <ContactUs /> },
      { path: "reviews", element: <Reviews /> },
      // Catch-all 404 — must remain last.
      { path: "*", element: <NotFound /> },
    ],
  },
];
