import { Card } from "@/components/ui/card";
import { GraduationCap, Users, BookOpen, BarChart3 } from "lucide-react";

interface ProfileSelectorProps {
  onSelectProfile: (profile: string) => void;
}

export const ProfileSelector = ({ onSelectProfile }: ProfileSelectorProps) => {
  const profiles = [
    {
      id: "novato",
      title: "Novato",
      description: "Iniciando na formação",
      icon: GraduationCap,
      color: "folha",
      bgClass: "bg-folha/10 hover:bg-folha/20",
      iconClass: "text-folha",
    },
    {
      id: "veterano",
      title: "Veterano",
      description: "Em formação continuada",
      icon: BookOpen,
      color: "ceu",
      bgClass: "bg-ceu/10 hover:bg-ceu/20",
      iconClass: "text-ceu",
    },
    {
      id: "instrutor",
      title: "Instrutor",
      description: "Facilitador de aprendizado",
      icon: Users,
      color: "sol",
      bgClass: "bg-sol/10 hover:bg-sol/20",
      iconClass: "text-sol",
    },
    {
      id: "gestor",
      title: "Gestor",
      description: "Liderança e estratégia",
      icon: BarChart3,
      color: "cobalto",
      bgClass: "bg-cobalto/10 hover:bg-cobalto/20",
      iconClass: "text-cobalto",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8 animate-fade-in">
        <h2 className="text-3xl font-bold mb-2 text-foreground">
          Bem-vindo ao NEXUS Treinamento
        </h2>
        <p className="text-muted-foreground">
          Selecione seu perfil para começar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((profile, index) => {
          const Icon = profile.icon;
          return (
            <Card
              key={profile.id}
              className={`${profile.bgClass} border-2 border-transparent hover:border-${profile.color} cursor-pointer transition-all duration-300 p-6 animate-fade-in hover:scale-105`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onSelectProfile(profile.id)}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg bg-background/50`}>
                  <Icon className={`h-6 w-6 ${profile.iconClass}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1 text-foreground">
                    {profile.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {profile.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
