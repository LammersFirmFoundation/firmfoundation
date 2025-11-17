import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import LandingPage from "./pages/LandingPage";
import ListingsPage from "./pages/ListingsPage";
import PropertyDetail from "./pages/PropertyDetail";
import ContactUs from "./pages/ContactUs";
import Auth from "./pages/Auth";
import AdminOnboarding from "./pages/AdminOnboarding";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/listings" element={<ListingsPage />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/onboard-client" element={<AdminOnboarding />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
