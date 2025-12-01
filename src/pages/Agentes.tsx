import { useState } from "react";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
=======
>>>>>>> b60fab566c50cbfadeb9ee28375dadcc4fd784cb
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Video, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Footer } from "@/components/Footer";
import { AgentCard } from "@/components/AgentCard";
<<<<<<< HEAD
import {
  GraduationCap,
  BookOpen,
  Code,
  TrendingUp,
  UserCog,
  Theater,
  Bot
=======
import { 
  GraduationCap, 
  BookOpen, 
  Code, 
  TrendingUp, 
  UserCog, 
  Theater,
  Bot 
>>>>>>> b60fab566c50cbfadeb9ee28375dadcc4fd784cb
} from "lucide-react";
import { Card } from "@/components/ui/card";

const Agentes = () => {
<<<<<<< HEAD
  const navigate = useNavigate();
=======
>>>>>>> b60fab566c50cbfadeb9ee28375dadcc4fd784cb
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [recordingModalOpen, setRecordingModalOpen] = useState(false);

<<<<<<< HEAD
  const handleAgentClick = (agentTitle: string) => {
    // Navegar para a página Index (chat) com o agente selecionado
    navigate('/', { state: { selectedAgent: agentTitle } });
  };

=======
>>>>>>> b60fab566c50cbfadeb9ee28375dadcc4fd784cb
  const handleUploadVideo = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "Backend necessário para processar e analisar vídeos com IA",
    });
    setRecordingModalOpen(false);
  };
  const agents = [
    {
      id: 1,
<<<<<<< HEAD
      title: "Orquestrador",
=======
      title: "Nexus Orquestrador",
>>>>>>> b60fab566c50cbfadeb9ee28375dadcc4fd784cb
      description: "Coordena todos os agentes e roteia suas solicitações",
      icon: Bot,
      color: "cobalto" as const,
      details: "Entende contexto, classifica usuários e unifica respostas"
    },
    {
      id: 2,
      title: "Agente Inicial",
      description: "Onboarding e formação de novatos",
      icon: GraduationCap,
      color: "folha" as const,
      details: "Regras de formação, processo seletivo, AA, faltas"
    },
    {
      id: 3,
      title: "Agente Continuado",
      description: "Formação continuada e reciclagens",
      icon: BookOpen,
      color: "ceu" as const,
      details: "Metas contratuais, reciclagens, demandas da Qualidade"
    },
    {
      id: 4,
      title: "Agente Técnico",
      description: "Suporte técnico especializado",
      icon: Code,
      color: "rubi" as const,
      details: "Troubleshooting, n8n, Lovable, Flutterflow, automação"
    },
    {
      id: 5,
      title: "Agente Diagnóstico",
      description: "Análise de performance e riscos",
      icon: TrendingUp,
      color: "sol" as const,
      details: "Reincidências, skills, CSAT, TMO, visão preditiva"
    },
    {
      id: 6,
      title: "Agente Personalizador",
      description: "Planos de desenvolvimento individualizados",
      icon: UserCog,
      color: "cobalto" as const,
      details: "Trilhas personalizadas, cursos da Universidade AeC"
    },
    {
      id: 7,
      title: "Agente Simulação",
      description: "Cenários práticos e role-playing",
      icon: Theater,
      color: "secondary" as const,
      details: "Simulações de atendimento, perfis difíceis, treinamento prático"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
<<<<<<< HEAD

=======
      
>>>>>>> b60fab566c50cbfadeb9ee28375dadcc4fd784cb
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Ecossistema de Multiagentes
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
<<<<<<< HEAD
              Sistema inteligente com 7 agentes especializados trabalhando em conjunto
=======
              Sistema inteligente com 7 agentes especializados trabalhando em conjunto 
>>>>>>> b60fab566c50cbfadeb9ee28375dadcc4fd784cb
              para oferecer suporte completo aos treinamentos da AeC
            </p>
          </div>

          {/* Seção especial para instrutores */}
          {hasRole('instrutor') && (
            <Card className="mb-8 border-primary/50 bg-gradient-to-r from-primary/5 to-accent/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Gravação de Aula para Avaliação</h3>
                  <p className="text-muted-foreground">
<<<<<<< HEAD
                    Grave suas aulas e receba feedback automatizado da IA sobre didática,
=======
                    Grave suas aulas e receba feedback automatizado da IA sobre didática, 
>>>>>>> b60fab566c50cbfadeb9ee28375dadcc4fd784cb
                    clareza e engajamento.
                  </p>
                </div>
                <Dialog open={recordingModalOpen} onOpenChange={setRecordingModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg">
                      <Video className="mr-2 h-5 w-5" />
                      Gravar Aula
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Gravar Aula para Avaliação IA</DialogTitle>
                      <DialogDescription>
                        Faça upload de um vídeo da sua aula para receber análise detalhada da IA
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-4">
                          Arraste um arquivo de vídeo ou clique para selecionar
                        </p>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          id="video-upload"
                        />
                        <Button asChild variant="outline">
                          <label htmlFor="video-upload" className="cursor-pointer">
                            Selecionar Vídeo
                          </label>
                        </Button>
                      </div>
                      <Button onClick={handleUploadVideo} className="w-full">
                        Enviar para Análise
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        A IA analisará: clareza, didática, engajamento, domínio do conteúdo e uso de exemplos
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {agents.map((agent, index) => (
<<<<<<< HEAD
              <div
                key={agent.id}
=======
              <div 
                key={agent.id} 
>>>>>>> b60fab566c50cbfadeb9ee28375dadcc4fd784cb
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AgentCard
                  title={agent.title}
                  description={agent.description}
                  icon={agent.icon}
                  color={agent.color}
<<<<<<< HEAD
                  onClick={() => handleAgentClick(agent.title)}
=======
>>>>>>> b60fab566c50cbfadeb9ee28375dadcc4fd784cb
                />
                <p className="mt-2 text-xs text-muted-foreground px-2">
                  {agent.details}
                </p>
              </div>
            ))}
          </div>

          <Card className="p-6 bg-gradient-primary text-white animate-fade-in">
            <h3 className="text-xl font-semibold mb-3">Como funciona?</h3>
            <ol className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="font-bold">1.</span>
                <span>Você faz uma pergunta ou solicita ajuda</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">2.</span>
<<<<<<< HEAD
                <span>O sistema identifica seu perfil e a natureza da solicitação</span>
=======
                <span>O Nexus identifica seu perfil e a natureza da solicitação</span>
>>>>>>> b60fab566c50cbfadeb9ee28375dadcc4fd784cb
              </li>
              <li className="flex gap-2">
                <span className="font-bold">3.</span>
                <span>A pergunta é roteada para o agente especialista correto</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">4.</span>
                <span>Você recebe uma resposta personalizada e precisa</span>
              </li>
            </ol>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Agentes;
