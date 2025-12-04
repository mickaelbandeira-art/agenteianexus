import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, UserPlus } from 'lucide-react';
import type { ClaroTrainee } from '@/lib/claro';

interface ClassTraineesProps {
  trainees: ClaroTrainee[];
  onAddTrainee: (trainee: Omit<ClaroTrainee, 'id' | 'created_at' | 'updated_at'>) => void;
  onRemoveTrainee: (id: string) => void;
  onUpdateStatus: (id: string, status: ClaroTrainee['status']) => void;
}

export const ClassTrainees = ({
  trainees,
  onAddTrainee,
  onRemoveTrainee,
  onUpdateStatus
}: ClassTraineesProps) => {
  const [newTrainee, setNewTrainee] = useState({
    full_name: '',
    cpf: '',
    email: '',
    phone: ''
  });

  const handleAdd = () => {
    if (!newTrainee.full_name || !newTrainee.cpf) return;

    onAddTrainee({
      ...newTrainee,
      class_id: '', // Will be set by parent
      status: 'Ativo'
    });

    setNewTrainee({ full_name: '', cpf: '', email: '', phone: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Nome Completo</label>
          <Input
            value={newTrainee.full_name}
            onChange={(e) => setNewTrainee({ ...newTrainee, full_name: e.target.value })}
            placeholder="Nome do treinando"
          />
        </div>
        <div className="w-40 space-y-2">
          <label className="text-sm font-medium">CPF</label>
          <Input
            value={newTrainee.cpf}
            onChange={(e) => setNewTrainee({ ...newTrainee, cpf: e.target.value })}
            placeholder="000.000.000-00"
          />
        </div>
        <Button onClick={handleAdd} disabled={!newTrainee.full_name || !newTrainee.cpf}>
          <UserPlus className="w-4 h-4 mr-2" />
          Adicionar
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Nenhum treinando adicionado.
                </TableCell>
              </TableRow>
            ) : (
              trainees.map((trainee, index) => (
                <TableRow key={trainee.id || index}>
                  <TableCell>{trainee.full_name}</TableCell>
                  <TableCell>{trainee.cpf}</TableCell>
                  <TableCell>
                    <Badge variant={trainee.status === 'Ativo' ? 'default' : 'secondary'}>
                      {trainee.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => trainee.id && onRemoveTrainee(trainee.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
