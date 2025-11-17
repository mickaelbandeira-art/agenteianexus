import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "./ChatMessage";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
  agentType?: string;
}

interface ChatInterfaceProps {
  profile: string;
}

export const ChatInterface = ({ profile }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Olá! Sou o NEXUS Treinamento, seu assistente inteligente da AeC. 

Identifiquei que você é um ${profile}. Estou aqui para ajudar com:

${profile === "novato" ? "• Regras da Formação Inicial\n• Processo Seletivo\n• Faltas e Atendimento Assistido" : ""}
${profile === "veterano" ? "• Metas contratuais\n• Reciclagens\n• Demandas da Qualidade" : ""}
${profile === "instrutor" ? "• Dashboard e análises\n• Simulações de cenários\n• Avaliação 360°" : ""}
${profile === "gestor" ? "• Análises de performance\n• Gestão de equipes\n• Relatórios estratégicos" : ""}

Como posso ajudar você hoje?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateResponse = (userMessage: string): { content: string; agentType?: string } => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Roteamento simulado baseado em palavras-chave
    if (lowerMessage.includes("falta") || lowerMessage.includes("eliminatório") || lowerMessage.includes("aa")) {
      return {
        content: `[Agente Inicial respondendo]

Sobre faltas na formação inicial:
• Máximo de 2 faltas permitidas
• Treinamento é eliminatório (exceto Tom)
• AA (Atendimento Assistido) dura 2-3 dias na operação

Precisa de mais detalhes sobre algum destes pontos?`,
        agentType: "inicial",
      };
    }
    
    if (lowerMessage.includes("reciclar") || lowerMessage.includes("meta") || lowerMessage.includes("ifood") || lowerMessage.includes("claro")) {
      return {
        content: `[Agente Continuado respondendo]

Sobre reciclagens:
• iFood: 4h de treinamento/mês obrigatório
• Claro: Meta de 2% em pausas
• Reciclagens ocorrem por meta/qualidade
• Reprovações são monitoradas

Posso detalhar algum projeto específico?`,
        agentType: "continuado",
      };
    }
    
    if (lowerMessage.includes("n8n") || lowerMessage.includes("técnico") || lowerMessage.includes("automação")) {
      return {
        content: `[Agente Técnico respondendo]

Suporte técnico disponível para:
• Troubleshooting técnico
• n8n / Lovable / Flutterflow
• Guias de automação
• Documentação vetorizada

Qual é sua dúvida técnica?`,
        agentType: "tecnico",
      };
    }
    
    if (lowerMessage.includes("erro") || lowerMessage.includes("reincidência") || lowerMessage.includes("performance")) {
      return {
        content: `[Agente Diagnóstico respondendo]

Analisando seu histórico:
• Reincidências detectadas
• Skills avaliadas (digitação, português, perfil)
• Análise de risco
• CSAT e TMO

Vou preparar um diagnóstico detalhado para você.`,
        agentType: "diagnostico",
      };
    }
    
    if (lowerMessage.includes("plano") || lowerMessage.includes("desenvolver") || lowerMessage.includes("trilha")) {
      return {
        content: `[Agente Personalizador respondendo]

Vou criar um plano personalizado para você:
• Análise do seu perfil
• Trilha de desenvolvimento
• Cursos da Universidade AeC
• Metas personalizadas

Baseado em qual competência você quer focar?`,
        agentType: "personalizador",
      };
    }
    
    if (lowerMessage.includes("simula") || lowerMessage.includes("prática") || lowerMessage.includes("cenário")) {
      return {
        content: `[Agente Simulação respondendo]

Simulações disponíveis:
• Atendimento ao cliente
• Role-playing
• Cenários difíceis
• Perfis específicos por produto

Qual tipo de simulação você gostaria de praticar?`,
        agentType: "simulacao",
      };
    }
    
    // Resposta padrão do Nexus
    return {
      content: `[Nexus Orquestrador]

Entendi sua pergunta. Para te ajudar melhor, preciso de mais contexto.

Você está buscando informações sobre:
1. Regras e processos de formação?
2. Reciclagens e metas?
3. Suporte técnico?
4. Análise de performance?
5. Plano de desenvolvimento?
6. Simulações práticas?

Por favor, seja mais específico para que eu possa direcionar ao agente especialista correto.`,
    };
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-nexus', {
        body: { message: currentInput },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.resposta,
        agentType: data.agente,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      toast.success("Resposta processada");
    } catch (error) {
      console.error('Erro:', error);
      const { content, agentType } = simulateResponse(currentInput);
      const assistantMessage: Message = {
        role: "assistant",
        content,
        agentType,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      toast.error("Usando modo offline");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto">
      {/* Badge de perfil */}
      <Card className="mb-4 p-3 bg-gradient-primary animate-fade-in">
        <div className="flex items-center gap-2 text-white">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">
            Modo: {profile.charAt(0).toUpperCase() + profile.slice(1)}
          </span>
        </div>
      </Card>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-2">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            role={message.role}
            content={message.content}
            agentType={message.agentType}
          />
        ))}
        {isLoading && (
          <div className="flex gap-3 mb-4 animate-pulse">
            <div className="h-8 w-8 rounded-full bg-gradient-primary" />
            <Card className="max-w-[80%] p-4 bg-card">
              <div className="flex gap-2">
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" />
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <Card className="p-4 bg-card border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua pergunta..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
