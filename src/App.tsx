import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Hub from "./pages/Hub";
import ClientPortal from "./pages/ClientPortal";
import Trainings from "./pages/Trainings";
import ClientChat from "./pages/ClientChat";
import Leaderboard from "./pages/Leaderboard";
import Progress from "./pages/Progress";
import Agentes from "./pages/Agentes";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Gestor from "./pages/Gestor";
import Instrutor from "./pages/Instrutor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />

            {/* Hub Principal */}
            <Route path="/" element={<ProtectedRoute><Hub /></ProtectedRoute>} />

            {/* Subportais de Clientes */}
            <Route path="/clients/:clientSlug" element={<ProtectedRoute><ClientPortal /></ProtectedRoute>} />
            <Route path="/clients/:clientSlug/trainings" element={<ProtectedRoute><Trainings /></ProtectedRoute>} />
            <Route path="/clients/:clientSlug/chat" element={<ProtectedRoute><ClientChat /></ProtectedRoute>} />
            <Route path="/clients/:clientSlug/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/clients/:clientSlug/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />

            {/* Páginas de Agentes (preservadas) */}
            <Route path="/agentes" element={<ProtectedRoute><Agentes /></ProtectedRoute>} />

            {/* Admin/Gestor/Instrutor (preservadas) */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute>} />
            <Route path="/gestor" element={<ProtectedRoute requiredRole="gestor"><Gestor /></ProtectedRoute>} />
            <Route path="/instrutor" element={<ProtectedRoute requiredRole="instrutor"><Instrutor /></ProtectedRoute>} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
