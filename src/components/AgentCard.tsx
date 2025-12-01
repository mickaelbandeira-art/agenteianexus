import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface AgentCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: "folha" | "ceu" | "rubi" | "sol" | "cobalto" | "secondary";
  onClick?: () => void;
}

export const AgentCard = ({ title, description, icon: Icon, color, onClick }: AgentCardProps) => {
  const colorClasses = {
    folha: "bg-folha/10 border-folha/30 text-folha",
    ceu: "bg-ceu/10 border-ceu/30 text-ceu",
    rubi: "bg-rubi/10 border-rubi/30 text-rubi",
    sol: "bg-sol/10 border-sol/30 text-sol",
    cobalto: "bg-cobalto/10 border-cobalto/30 text-cobalto",
    secondary: "bg-secondary/10 border-secondary/30 text-secondary",
  };

  return (
    <Card
      className={`${colorClasses[color]} border-2 p-4 hover:scale-105 transition-transform duration-300 cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-background/50 rounded-lg">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-1 text-foreground">{title}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
};
