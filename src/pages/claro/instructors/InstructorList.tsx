import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { getInstructors, deleteInstructor } from '@/lib/claro';
import type { ClaroInstructor, InstructorStatus, EmploymentType } from '@/lib/claro';
import { getStatusColor } from '@/lib/claro';
import { useToast } from '@/hooks/use-toast';

const InstructorList = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [instructors, setInstructors] = useState<ClaroInstructor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<InstructorStatus | 'all'>('all');
    const [employmentFilter, setEmploymentFilter] = useState<EmploymentType | 'all'>('all');

    useEffect(() => {
        loadInstructors();
    }, [statusFilter, employmentFilter]);

    const loadInstructors = async () => {
        try {
            setLoading(true);
            const filters = {
                status: statusFilter !== 'all' ? statusFilter : undefined,
                employment_type: employmentFilter !== 'all' ? employmentFilter : undefined,
                search: searchTerm || undefined,
            };
            const data = await getInstructors(filters);
            setInstructors(data);
        } catch (error) {
            toast({
                title: 'Erro ao carregar instrutores',
                description: 'Não foi possível carregar a lista de instrutores.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja excluir o instrutor ${name}?`)) return;

        try {
            await deleteInstructor(id);
            toast({
                title: 'Instrutor excluído',
                description: 'O instrutor foi excluído com sucesso.',
            });
            loadInstructors();
        } catch (error) {
            toast({
                title: 'Erro ao excluir',
                description: 'Não foi possível excluir o instrutor.',
                variant: 'destructive',
            });
        }
    };

    const filteredInstructors = instructors.filter((instructor) =>
        instructor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.matricula.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate('/clients/claro')}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Instrutores
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Gestão de instrutores do Portal Claro
                            </p>
                        </div>
                    </div>
                    <Button onClick={() => navigate('/clients/claro/instructors/new')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Instrutor
                    </Button>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Buscar por nome ou matrícula..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select
                                value={statusFilter}
                                onValueChange={(value) => setStatusFilter(value as InstructorStatus | 'all')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os Status</SelectItem>
                                    <SelectItem value="Ativo">Ativo</SelectItem>
                                    <SelectItem value="Inativo">Inativo</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={employmentFilter}
                                onValueChange={(value) => setEmploymentFilter(value as EmploymentType | 'all')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Tipo de Vínculo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os Vínculos</SelectItem>
                                    <SelectItem value="CLT">CLT</SelectItem>
                                    <SelectItem value="PJ">PJ</SelectItem>
                                    <SelectItem value="Terceirizado">Terceirizado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {filteredInstructors.length} instrutor(es) encontrado(s)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
                            </div>
                        ) : filteredInstructors.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600 dark:text-gray-400">
                                    Nenhum instrutor encontrado
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Matrícula</TableHead>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Vínculo</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredInstructors.map((instructor) => (
                                        <TableRow key={instructor.id}>
                                            <TableCell className="font-medium">
                                                {instructor.matricula}
                                            </TableCell>
                                            <TableCell>{instructor.full_name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{instructor.employment_type}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(instructor.status)}>
                                                    {instructor.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => navigate(`/clients/claro/instructors/${instructor.id}`)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(instructor.id, instructor.full_name)}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default InstructorList;
