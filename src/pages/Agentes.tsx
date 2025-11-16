import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AgentCard } from "@/components/AgentCard";
import { 
  GraduationCap, 
  BookOpen, 
  Code, 
  TrendingUp, 
  UserCog, 
  Theater,
  Bot 
} from "lucide-react";
import { Card } from "@/components/ui/card";

const Agentes = () => {
  const agents = [
    {
      id: 1,
      title: "Nexus Orquestrador",
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
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Ecossistema de Multiagentes
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sistema inteligente com 7 agentes especializados trabalhando em conjunto 
              para oferecer suporte completo aos treinamentos da AeC
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {agents.map((agent, index) => (
              <div 
                key={agent.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AgentCard
                  title={agent.title}
                  description={agent.description}
                  icon={agent.icon}
                  color={agent.color}
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
                <span>O Nexus identifica seu perfil e a natureza da solicitação</span>
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
