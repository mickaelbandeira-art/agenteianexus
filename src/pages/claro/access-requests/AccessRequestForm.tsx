import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import {
  getClasses,
  getTraineesByClass,
  createAccessRequest,
  updateAccessRequest,
} from '@/lib/claro';
import type {
  AccessRequestInput,
  AccessStatus,
  AccessType,
  ClaroTrainingClassWithRelations,
  ClaroTrainee
} from '@/lib/claro';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { addDays, format } from 'date-fns';

// Helper to fetch request by ID
const getAccessRequestById = async (id: string) => {
  const { data, error } = await supabase
    .from('claro_access_requests' as any)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as any;
};

const AccessRequestForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [classes, setClasses] = useState<ClaroTrainingClassWithRelations[]>([]);
  const [trainees, setTrainees] = useState<ClaroTrainee[]>([]);

  const [formData, setFormData] = useState<AccessRequestInput>({
    class_id: '',
    trainee_id: '',
    access_type: 'Rede',
    system_name: '',
    status: 'Pendente',
    request_date: format(new Date(), 'yyyy-MM-dd'),
    deadline_date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    observation: ''
  });

  useEffect(() => {
    loadClasses();
    if (id && id !== 'new') {
      loadRequest();
    }
  }, [id]);

  // Load trainees when class changes
  useEffect(() => {
    if (formData.class_id) {
      loadTrainees(formData.class_id);
    } else {
      setTrainees([]);
    }
  }, [formData.class_id]);

  const loadClasses = async () => {
    try {
      const data = await getClasses({ status: 'Em Andamento' });
      setClasses(data);
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  const loadTrainees = async (classId: string) => {
    try {
      const data = await getTraineesByClass(classId);
      setTrainees(data);
    } catch (error) {
      console.error('Error loading trainees:', error);
    }
  };

  const loadRequest = async () => {
    if (!id || id === 'new') return;

    try {
      setLoading(true);
      const data = await getAccessRequestById(id);
      setFormData({
        class_id: data.class_id || '',
        trainee_id: data.trainee_id || '',
        access_type: data.access_type || 'Rede',
        system_name: data.system_name || '',
        protocol_number: data.protocol_number || '',
        login_created: data.login_created || '',
        initial_password: data.initial_password || '',
        status: data.status || 'Pendente',
        request_date: data.request_date || '',
        deadline_date: data.deadline_date || '',
        observation: data.observation || ''
      });

      if (data.class_id) {
        loadTrainees(data.class_id);
      }
    } catch (error) {
      toast({
        title: 'Erro ao carregar solicitação',
        description: 'Não foi possível carregar os dados.',
        variant: 'destructive',
      });
      navigate('/clients/claro/access-requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.class_id || !formData.trainee_id || !formData.system_name) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha Turma, Treinando e Nome do Sistema.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      if (id && id !== 'new') {
        await updateAccessRequest(id, formData);
        toast({
          title: 'Solicitação atualizada',
          description: 'Os dados foram atualizados com sucesso.',
        });
      } else {
        await createAccessRequest(formData);
        toast({
          title: 'Solicitação criada',
          description: 'A solicitação foi criada com sucesso.',
        });
      }
      navigate('/clients/claro/access-requests');
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error.message || 'Não foi possível salvar a solicitação.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/clients/claro/access-requests')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {id && id !== 'new' ? 'Editar Solicitação' : 'Nova Solicitação'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie o pedido de acesso
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Dados da Solicitação</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="class">Turma <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.class_id}
                    onValueChange={(value) => setFormData({ ...formData, class_id: value, trainee_id: '' })}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a turma..." />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.class_code} - {cls.segment?.segment_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trainee">Treinando <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.trainee_id}
                    onValueChange={(value) => setFormData({ ...formData, trainee_id: value })}
                    disabled={!formData.class_id || loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o treinando..." />
                    </SelectTrigger>
                    <SelectContent>
                      {trainees.map((trainee) => (
                        <SelectItem key={trainee.id} value={trainee.id}>
                          {trainee.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="access_type">Tipo de Acesso <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.access_type}
                    onValueChange={(value: AccessType) => setFormData({ ...formData, access_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rede">Rede</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="Sistema">Sistema</SelectItem>
                      <SelectItem value="Crachá">Crachá</SelectItem>
                      <SelectItem value="Claro">Claro</SelectItem>
                      <SelectItem value="VPN">VPN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="system_name">Nome do Sistema <span className="text-red-500">*</span></Label>
                  <Input
                    value={formData.system_name || ''}
                    onChange={(e) => setFormData({ ...formData, system_name: e.target.value })}
                    placeholder="Ex: Citrix, SAP, AD..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="request_date">Data da Solicitação</Label>
                  <Input
                    type="date"
                    value={formData.request_date}
                    onChange={(e) => setFormData({ ...formData, request_date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline_date">Prazo Limite</Label>
                  <Input
                    type="date"
                    value={formData.deadline_date}
                    onChange={(e) => setFormData({ ...formData, deadline_date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: AccessStatus) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                      <SelectItem value="Concluído">Concluído</SelectItem>
                      <SelectItem value="Cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="protocol_number">Protocolo</Label>
                  <Input
                    value={formData.protocol_number || ''}
                    onChange={(e) => setFormData({ ...formData, protocol_number: e.target.value })}
                    placeholder="Nº do chamado..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login_created">Login Criado</Label>
                  <Input
                    value={formData.login_created || ''}
                    onChange={(e) => setFormData({ ...formData, login_created: e.target.value })}
                    placeholder="Usuário criado..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initial_password">Senha Inicial</Label>
                  <Input
                    value={formData.initial_password || ''}
                    onChange={(e) => setFormData({ ...formData, initial_password: e.target.value })}
                    placeholder="Senha provisória..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observation">Observações</Label>
                <Textarea
                  value={formData.observation || ''}
                  onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                  placeholder="Detalhes adicionais..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/clients/claro/access-requests')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccessRequestForm;
