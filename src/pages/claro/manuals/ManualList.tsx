import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Search, Edit, Trash2, FileText, Download, History } from 'lucide-react';
import { getManuals, deleteManual, getSegments } from '@/lib/claro';
import type { ManualType, ClaroSegment } from '@/lib/claro';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const ManualList = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [manuals, setManuals] = useState<any[]>([]);
    const [segments, setSegments] = useState<ClaroSegment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [segmentFilter, setSegmentFilter] = useState<string>('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [manualsData, segmentsData] = await Promise.all([
                getManuals(),
                getSegments()
            ]);
            setManuals(manualsData || []);
            setSegments(segmentsData);
        } catch (error) {
            toast({
                title: 'Erro ao carregar manuais',
                description: 'Não foi possível carregar a lista de manuais.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este manual?')) return;

        try {
            await deleteManual(id);
            toast({
                title: 'Manual excluído',
                description: 'O manual foi excluído com sucesso.',
            });
            loadData();
        } catch (error) {
            toast({
                title: 'Erro ao excluir',
                description: 'Não foi possível excluir o manual.',
                variant: 'destructive',
            });
        }
    };

    const filteredManuals = manuals.filter((manual) => {
        const matchesSearch =
            manual.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            manual.description?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = typeFilter === 'all' || manual.manual_type === typeFilter;
        const matchesSegment = segmentFilter === 'all' || manual.segment_id === segmentFilter;

        return matchesSearch && matchesType && matchesSegment;
    });

    const getTypeBadge = (type: ManualType) => {
        const colors = {
            'Operacional': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            'Técnico': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
            'Administrativo': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            'Treinamento': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
        };
        return <Badge className={colors[type] || 'bg-gray-100 text-gray-800'}>{type}</Badge>;
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
                                Gestão de Manuais
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Gerencie os manuais e documentos de treinamento
                            </p>
                        </div>
                    </div>
                    <Button onClick={() => navigate('/clients/claro/manuals/new')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Manual
                    </Button>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Buscar por título ou descrição..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="w-full md:w-48">
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos os Tipos</SelectItem>
                                        <SelectItem value="Operacional">Operacional</SelectItem>
                                        <SelectItem value="Técnico">Técnico</SelectItem>
                                        <SelectItem value="Administrativo">Administrativo</SelectItem>
                                        <SelectItem value="Treinamento">Treinamento</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-full md:w-48">
                                <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Segmento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos os Segmentos</SelectItem>
                                        {segments.map((seg) => (
                                            <SelectItem key={seg.id} value={seg.id}>
                                                {seg.segment_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Manuais Cadastrados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Título</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Segmento</TableHead>
                                        <TableHead>Versão</TableHead>
                                        <TableHead>Atualizado em</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8">
                                                Carregando...
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredManuals.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                Nenhum manual encontrado.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredManuals.map((manual) => (
                                            <TableRow key={manual.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-gray-500" />
                                                        <div>
                                                            <div className="font-medium">{manual.title}</div>
                                                            {manual.description && (
                                                                <div className="text-xs text-gray-500 line-clamp-1">
                                                                    {manual.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getTypeBadge(manual.manual_type)}</TableCell>
                                                <TableCell>{manual.segment?.segment_name || 'Geral'}</TableCell>
                                                <TableCell className="font-mono text-sm">{manual.version}</TableCell>
                                                <TableCell>
                                                    {format(new Date(manual.updated_at), 'dd/MM/yyyy')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {manual.file_url && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => window.open(manual.file_url, '_blank')}
                                                                title="Download"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => navigate(`/clients/claro/manuals/${manual.id}/history`)}
                                                            title="Histórico"
                                                        >
                                                            <History className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => navigate(`/clients/claro/manuals/${manual.id}`)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:text-red-600"
                                                            onClick={() => handleDelete(manual.id)}
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

export default ManualList;
