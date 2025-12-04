import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import {
    getInstructorById,
    createInstructor,
    updateInstructor
} from '@/lib/claro';
import type { InstructorInput, EmploymentType, InstructorStatus } from '@/lib/claro';
import { useToast } from '@/hooks/use-toast';

const InstructorForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<InstructorInput>({
        matricula: '',
        full_name: '',
        employment_type: 'CLT',
        status: 'Ativo',
    });

    useEffect(() => {
        if (id && id !== 'new') {
            loadInstructor();
        }
    }, [id]);

    const loadInstructor = async () => {
        if (!id || id === 'new') return;

        try {
            setLoading(true);
            const instructor = await getInstructorById(id);
            setFormData({
                matricula: instructor.matricula,
                full_name: instructor.full_name,
                employment_type: instructor.employment_type,
                status: instructor.status,
            });
        } catch (error) {
            toast({
                title: 'Erro ao carregar instrutor',
                description: 'Não foi possível carregar os dados do instrutor.',
                variant: 'destructive',
            });
            navigate('/clients/claro/instructors');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.matricula || !formData.full_name) {
            toast({
                title: 'Campos obrigatórios',
                description: 'Preencha todos os campos obrigatórios.',
                variant: 'destructive',
            });
            return;
        }

        try {
            setLoading(true);
            if (id && id !== 'new') {
                await updateInstructor(id, formData);
                toast({
                    title: 'Instrutor atualizado',
                    description: 'Os dados do instrutor foram atualizados com sucesso.',
                });
            } else {
                await createInstructor(formData);
                toast({
                    title: 'Instrutor criado',
                    description: 'O instrutor foi criado com sucesso.',
                });
            }
            navigate('/clients/claro/instructors');
        } catch (error: any) {
            toast({
                title: 'Erro ao salvar',
                description: error.message || 'Não foi possível salvar o instrutor.',
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
                        onClick={() => navigate('/clients/claro/instructors')}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {id && id !== 'new' ? 'Editar Instrutor' : 'Novo Instrutor'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Preencha os dados do instrutor
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Dados do Instrutor</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="matricula">
                                        Matrícula <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="matricula"
                                        value={formData.matricula}
                                        onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                                        placeholder="Ex: 123456"
                                        required
                                        disabled={id !== 'new'}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="full_name">
                                        Nome Completo <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="full_name"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        placeholder="Ex: João da Silva"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="employment_type">
                                        Tipo de Vínculo <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.employment_type}
                                        onValueChange={(value: EmploymentType) =>
                                            setFormData({ ...formData, employment_type: value })
                                        }
                                    >
                                        <SelectTrigger id="employment_type">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CLT">CLT</SelectItem>
                                            <SelectItem value="PJ">PJ</SelectItem>
                                            <SelectItem value="Terceirizado">Terceirizado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">
                                        Status <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value: InstructorStatus) =>
                                            setFormData({ ...formData, status: value })
                                        }
                                    >
                                        <SelectTrigger id="status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Ativo">Ativo</SelectItem>
                                            <SelectItem value="Inativo">Inativo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/clients/claro/instructors')}
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

export default InstructorForm;
