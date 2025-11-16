import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const mockUsers = [
  {
    id: 1,
    nome: "João Silva",
    matricula: "12345",
    perfil: "veterano",
    csat: 4.5,
    tmo: 7.2,
    reincidencia: 8,
    digitacao: 85,
    portugues: 92,
    faltas: 0,
    status: "ativo"
  },
  {
    id: 2,
    nome: "Maria Santos",
    matricula: "12346",
    perfil: "veterano",
    csat: 4.8,
    tmo: 6.5,
    reincidencia: 5,
    digitacao: 95,
    portugues: 88,
    faltas: 1,
    status: "ativo"
  },
  {
    id: 3,
    nome: "Pedro Oliveira",
    cpf: "123.456.789-00",
    perfil: "novato",
    csat: 3.9,
    tmo: 9.8,
    reincidencia: 15,
    digitacao: 70,
    portugues: 75,
    faltas: 2,
    status: "atenção"
  },
];

export const PerformanceTable = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo": return "default";
      case "atenção": return "secondary";
      case "crítico": return "destructive";
      default: return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desempenho Individual</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>CSAT</TableHead>
              <TableHead>TMO</TableHead>
              <TableHead>Reincid.</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Faltas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.nome}</TableCell>
                <TableCell>{user.matricula || user.cpf}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.perfil}</Badge>
                </TableCell>
                <TableCell>{user.csat}</TableCell>
                <TableCell>{user.tmo}min</TableCell>
                <TableCell>{user.reincidencia}%</TableCell>
                <TableCell>
                  <div className="text-xs">
                    Dig: {user.digitacao}% | PT: {user.portugues}%
                  </div>
                </TableCell>
                <TableCell>{user.faltas}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(user.status)}>{user.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
