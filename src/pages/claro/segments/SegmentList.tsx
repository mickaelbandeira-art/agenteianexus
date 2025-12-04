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
import { Plus, Search, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { getSegments, deleteSegment } from '@/lib/claro';
import type { ClaroSegment } from '@/lib/claro';
import { useToast } from '@/hooks/use-toast';

const SegmentList = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [segments, setSegments] = useState<ClaroSegment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadSegments();
    }, []);

    const loadSegments = async () => {
        try {
            setLoading(true);
            const data = await getSegments();
            setSegments(data);
        } catch (error) {
            toast({
                title: 'Erro ao carregar segmentos',
                description: 'Não foi possível carregar a lista de segmentos.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja excluir o segmento ${name}?`)) return;

        try {
            await deleteSegment(id);
            toast({
                title: 'Segmento excluído',
                description: 'O segmento foi excluído com sucesso.',
            });
            loadSegments();
        } catch (error) {
            toast({
                title: 'Erro ao excluir',
                description: 'Não foi possível excluir o segmento.',
                variant: 'destructive',
            });
        }
    };

    const filteredSegments = segments.filter((segment) =>
        segment.segment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        segment.cr_code.toLowerCase().includes(searchTerm.toLowerCase())
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
                            onClick={() => navigate('/claro')}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Segmentos
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Centros de Resultado e Operações
                            </p>
                        </div>
                    </div>
                    <Button onClick={() => navigate('/claro/segments/new')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Segmento
                    </Button>
                </div>

                {/* Search */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Buscar por nome ou código CR..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {filteredSegments.length} segmento(s) encontrado(s)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
                            </div>
                        ) : filteredSegments.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600 dark:text-gray-400">
                                    Nenhum segmento encontrado
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Código CR</TableHead>
                                        <TableHead>Nome do Segmento</TableHead>
                                        <TableHead>Tipo de Operação</TableHead>
                                        <TableHead>Dias de Treinamento</TableHead>
                                        <TableHead>Jornada</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSegments.map((segment) => (
                                        <TableRow key={segment.id}>
                                            <TableCell className="font-medium">
                                                {segment.cr_code}
                                            </TableCell>
                                            <TableCell>{segment.segment_name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{segment.operation_type}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-blue-500">
                                                    {segment.training_days} dias
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-600">
                                                {segment.default_schedule}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => navigate(`/claro/segments/${segment.id}`)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(segment.id, segment.segment_name)}
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

export default SegmentList;
