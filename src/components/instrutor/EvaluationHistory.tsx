import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockEvaluations = [
  { id: 1, data: "15/11/2025", pontuacao: 8.7, feedback: "Excelente didática e clareza" },
  { id: 2, data: "08/11/2025", pontuacao: 9.2, feedback: "Muito bom engajamento com alunos" },
  { id: 3, data: "01/11/2025", pontuacao: 8.3, feedback: "Bom uso de exemplos práticos" },
];

export const EvaluationHistory = () => {
  const { toast } = useToast();

  const handleRecordClass = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "Backend necessário para gravar e analisar aulas com IA",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaliações de Aulas</CardTitle>
        <CardDescription>Feedback da IA sobre suas aulas</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleRecordClass} className="w-full mb-4">
          <Video className="mr-2 h-4 w-4" />
          Gravar Nova Aula
        </Button>

        <div className="space-y-3">
          {mockEvaluations.map((evaluation) => (
            <div key={evaluation.id} className="p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{evaluation.data}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-bold">{evaluation.pontuacao}</span>
                </div>
              </div>
              <p className="text-sm">{evaluation.feedback}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
