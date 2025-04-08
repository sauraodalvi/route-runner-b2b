
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TripManagement from "./pages/TripManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/trip-management" element={<TripManagement />} />
          <Route path="/registration" element={<Index />} />
          <Route path="/registration-billing" element={<Index />} />
          <Route path="/patient-search" element={<Index />} />
          <Route path="/assign-cards" element={<Index />} />
          <Route path="/appointments" element={<Index />} />
          <Route path="/home-collection" element={<Index />} />
          <Route path="/b2b-collection" element={<Index />} />
          <Route path="/billing-history" element={<Index />} />
          <Route path="/consent-history" element={<Index />} />
          <Route path="/lab-form-values" element={<Index />} />
          <Route path="/financial-reports" element={<Index />} />
          <Route path="/archives" element={<Index />} />
          <Route path="/report-prints" element={<Index />} />
          <Route path="/collection-reports" element={<Index />} />
          <Route path="/tests-list" element={<Index />} />
          <Route path="/operational-status" element={<Index />} />
          <Route path="/advanced-search" element={<Index />} />
          <Route path="/updates" element={<Index />} />
          <Route path="/video-tutorial" element={<Index />} />
          <Route path="/support" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
