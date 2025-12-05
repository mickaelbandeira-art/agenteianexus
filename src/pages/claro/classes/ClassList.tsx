import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { getClasses, deleteClass } from '@/lib/claro';
import type { ClaroTrainingClassWithRelations, ClassStatus } from '@/lib/claro';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const ClassList = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [classes, setClasses] = useState<ClaroTrainingClassWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<ClassStatus | 'all'>('all');

    useEffect(() => {
        loadClasses();
    }, []);

    const loadClasses = async () => {
        try {
            setLoading(true);
            const data = await getClasses();
            setClasses(data);
        } catch (error) {
            toast({
                title: 'Erro ao carregar turmas',
                description: 'Não foi possível carregar a lista de turmas.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta turma?')) return;

        try {
            await deleteClass(id);
            toast({
                title: 'Turma excluída',
                description: 'A turma foi excluída com sucesso.',
            });
            loadClasses();
        } catch (error) {
            toast({
                title: 'Erro ao excluir',
                description: 'Não foi possível excluir a turma.',
                variant: 'destructive',
            });
        }
    };

    const filteredClasses = classes.filter((cls) => {
        const matchesSearch =
            cls.class_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cls.segment?.segment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cls.instructor?.full_name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || cls.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: ClassStatus) => {
        switch (status) {
            case 'Planejada': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Em Andamento': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Concluída': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
            case 'Cancelada': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
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
                                Gestão de Turmas
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Gerencie as turmas de treinamento
                            </p>
                        </div>
                    </div>
                    <Button onClick={() => navigate('/clients/claro/classes/new')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Turma
                    </Button>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Buscar por código, segmento ou instrutor..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="w-full md:w-48">
                                <Select
                                    value={statusFilter}
                                    onValueChange={(value: ClassStatus | 'all') => setStatusFilter(value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos os Status</SelectItem>
                                        <SelectItem value="Planejada">Planejada</SelectItem>
                                        <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                                        <SelectItem value="Concluída">Concluída</SelectItem>
                                        <SelectItem value="Cancelada">Cancelada</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Turmas Cadastradas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Código</TableHead>
                                        <TableHead>Segmento</TableHead>
                                        <TableHead>Instrutor</TableHead>
                                        <TableHead>Período</TableHead>
                                        <TableHead>Datas</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8">
                                                Carregando...
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredClasses.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                Nenhuma turma encontrada.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredClasses.map((cls) => (
                                            <TableRow key={cls.id}>
                                                <TableCell className="font-medium">{cls.class_code}</TableCell>
                                                <TableCell>{cls.segment?.segment_name || '-'}</TableCell>
                                                <TableCell>{cls.instructor?.full_name || '-'}</TableCell>
                                                <TableCell>{cls.period}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col text-sm">
                                                        <span>Início: {format(new Date(cls.start_date), 'dd/MM/yyyy')}</span>
                                                        {cls.end_date && (
                                                            <span className="text-muted-foreground">
                                                                Fim: {format(new Date(cls.end_date), 'dd/MM/yyyy')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(cls.status)}>
                                                        {cls.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => navigate(`/clients/claro/classes/${cls.id}`)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:text-red-600"
                                                            onClick={() => handleDelete(cls.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ClassList;
