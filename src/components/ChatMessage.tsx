import { Bot, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  agentType?: string;
}

export const ChatMessage = ({ role, content, agentType }: ChatMessageProps) => {
  const isUser = role === "user";

  const getAgentColor = () => {
    switch (agentType) {
      case "inicial": return "text-folha";
      case "continuado": return "text-ceu";
      case "tecnico": return "text-rubi";
      case "diagnostico": return "text-sol";
      case "personalizador": return "text-cobalto";
      case "simulacao": return "text-secondary";
      default: return "text-primary";
    }
  };

  return (
    <div className={cn(
      "flex gap-3 mb-4 animate-fade-in",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
          <Bot className="h-5 w-5 text-white" />
        </div>
      )}

      <Card className={cn(
        "max-w-[80%] p-4",
        isUser 
          ? "bg-primary text-primary-foreground" 
          : "bg-card border-border"
      )}>
        {!isUser && agentType && (
          <div className={cn("text-xs font-medium mb-2", getAgentColor())}>
            {agentType === "inicial" && "Agente Inicial"}
            {agentType === "continuado" && "Agente Continuado"}
            {agentType === "tecnico" && "Agente Técnico"}
            {agentType === "diagnostico" && "Agente Diagnóstico"}
            {agentType === "personalizador" && "Agente Personalizador"}
            {agentType === "simulacao" && "Agente Simulação"}
            {!agentType && "Nexus Orquestrador"}
          </div>
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
      </Card>

      {isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          <User className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};
