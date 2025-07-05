
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/auth/AuthGuard";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Documenti from "./pages/Documenti";
import DocumentoDettaglio from "./pages/DocumentoDettaglio";
import Preferiti from "./pages/Preferiti";
import Condivisi from "./pages/Condivisi";
import Cartelle from "./pages/Cartelle";
import TagPage from "./pages/TagPage";
import Trascrizioni from "./pages/Trascrizioni";
import AzioniIA from "./pages/AzioniIA";
import AzioniIAPersonalizzate from "./pages/AzioniIAPersonalizzate";
import WorkflowsAI from "./pages/WorkflowsAI";
import Impostazioni from "./pages/Impostazioni";
import Genera from "./pages/Genera";
import Team from "./pages/Team";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthGuard>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/documenti" element={<Documenti />} />
                <Route path="/documenti/:id" element={<DocumentoDettaglio />} />
                <Route path="/preferiti" element={<Preferiti />} />
                <Route path="/condivisi" element={<Condivisi />} />
                <Route path="/cartelle" element={<Cartelle />} />
                <Route path="/tag" element={<TagPage />} />
                <Route path="/trascrizioni" element={<Trascrizioni />} />
                <Route path="/azioni-ia" element={<AzioniIA />} />
                <Route path="/azioni-ia-personalizzate" element={<AzioniIAPersonalizzate />} />
                <Route path="/workflows-ai" element={<WorkflowsAI />} />
                <Route path="/team" element={<Team />} />
                <Route path="/impostazioni" element={<Impostazioni />} />
                <Route path="/genera" element={<Genera />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </AuthGuard>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
