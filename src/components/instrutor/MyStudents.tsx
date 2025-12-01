import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockStudents = [
  { id: 1, nome: "Ana Costa", perfil: "novato", status: "ativo", progresso: 75 },
  { id: 2, nome: "Carlos Mendes", perfil: "novato", status: "ativo", progresso: 82 },
  { id: 3, nome: "Beatriz Lima", perfil: "novato", status: "atenção", progresso: 45 },
  { id: 4, nome: "Daniel Rocha", perfil: "veterano", status: "ativo", progresso: 90 },
  { id: 5, nome: "Fernanda Alves", perfil: "novato", status: "ativo", progresso: 68 },
];

export const MyStudents = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Alunos</CardTitle>
        <CardDescription>Treinandos sob sua supervisão</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockStudents.map((student) => (
            <div key={student.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">{student.nome}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{student.perfil}</Badge>
                  <span className="text-xs text-muted-foreground">Progresso: {student.progresso}%</span>
                </div>
              </div>
              <Badge variant={student.status === "ativo" ? "default" : "secondary"}>
                {student.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
