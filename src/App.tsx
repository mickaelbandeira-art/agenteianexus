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
import ClaroPortal from "./pages/claro/ClaroPortal";
import InstructorList from "./pages/claro/instructors/InstructorList";
import InstructorForm from "./pages/claro/instructors/InstructorForm";
import SegmentList from "./pages/claro/segments/SegmentList";
import ClassList from "./pages/claro/classes/ClassList";
import ClassForm from "./pages/claro/classes/ClassForm";
import RoomList from "./pages/claro/rooms/RoomList";
import RoomForm from "./pages/claro/rooms/RoomForm";
import AccessRequestList from "./pages/claro/access-requests/AccessRequestList";
import AccessRequestForm from "./pages/claro/access-requests/AccessRequestForm";
import ManualList from "./pages/claro/manuals/ManualList";
import ManualForm from "./pages/claro/manuals/ManualForm";
import ManualHistory from "./pages/claro/manuals/ManualHistory";

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

            {/* Portal Claro - Rota específica ANTES da rota genérica */}
            <Route path="/clients/claro" element={<ProtectedRoute requiredRole="instrutor"><ClaroPortal /></ProtectedRoute>} />
            <Route path="/clients/claro/instructors" element={<ProtectedRoute requiredRole="admin"><InstructorList /></ProtectedRoute>} />
            <Route path="/clients/claro/instructors/:id" element={<ProtectedRoute requiredRole="admin"><InstructorForm /></ProtectedRoute>} />
            <Route path="/clients/claro/segments" element={<ProtectedRoute requiredRole="admin"><SegmentList /></ProtectedRoute>} />
            <Route path="/clients/claro/classes" element={<ProtectedRoute requiredRole="instrutor"><ClassList /></ProtectedRoute>} />
            <Route path="/clients/claro/classes/:id" element={<ProtectedRoute requiredRole="instrutor"><ClassForm /></ProtectedRoute>} />
            <Route path="/clients/claro/rooms" element={<ProtectedRoute requiredRole="admin"><RoomList /></ProtectedRoute>} />
            <Route path="/clients/claro/rooms/:id" element={<ProtectedRoute requiredRole="admin"><RoomForm /></ProtectedRoute>} />
            <Route path="/clients/claro/access-requests" element={<ProtectedRoute requiredRole="gestor"><AccessRequestList /></ProtectedRoute>} />
            <Route path="/clients/claro/access-requests/:id" element={<ProtectedRoute requiredRole="gestor"><AccessRequestForm /></ProtectedRoute>} />
            <Route path="/clients/claro/manuals" element={<ProtectedRoute requiredRole="instrutor"><ManualList /></ProtectedRoute>} />
            <Route path="/clients/claro/manuals/:id" element={<ProtectedRoute requiredRole="instrutor"><ManualForm /></ProtectedRoute>} />
            <Route path="/clients/claro/manuals/:id/history" element={<ProtectedRoute requiredRole="instrutor"><ManualHistory /></ProtectedRoute>} />

            {/* Subportais de Clientes - Rota genérica */}
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
