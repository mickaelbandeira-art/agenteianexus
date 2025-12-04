import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, FileText, Clock } from 'lucide-react';
import { getManualWithHistory } from '@/lib/claro';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ManualHistory = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();
    const [manual, setManual] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadManual();
        }
    }, [id]);

    const loadManual = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const data = await getManualWithHistory(id);
            setManual(data);
        } catch (error) {
            toast({
                title: 'Erro ao carregar histórico',
                description: 'Não foi possível carregar o histórico do manual.',
                variant: 'destructive',
            });
            navigate('/clients/claro/manuals');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center py-8">Carregando...</div>
                </div>
            </div>
        );
    }

    if (!manual) {
        return null;
    }

    const allVersions = [
        {
            version: manual.version,
            file_url: manual.file_url,
            updated_at: manual.updated_at,
            change_description: 'Versão atual',
            is_current: true
        },
        ...(manual.history || []).map((h: any) => ({
            ...h,
            is_current: false
        }))
    ].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="container mx-auto max-w-5xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/clients/claro/manuals')}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Histórico de Versões
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {manual.title}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => navigate(`/clients/claro/manuals/${id}`)}
                    >
                        Editar Manual
                    </Button>
                </div>

                {/* Manual Info */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Informações do Manual</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <div className="text-sm text-gray-500">Tipo</div>
                                <div className="font-medium">{manual.manual_type}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Segmento</div>
                                <div className="font-medium">{manual.segment?.segment_name || 'Geral'}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Versão Atual</div>
                                <div className="font-medium">{manual.version}</div>
                            </div>
                        </div>
                        {manual.description && (
                            <div className="mt-4">
                                <div className="text-sm text-gray-500">Descrição</div>
                                <div className="text-sm mt-1">{manual.description}</div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Version History */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Histórico de Alterações
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Versão</TableHead>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Alterações</TableHead>
                                        <TableHead>Autor</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allVersions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                Nenhuma versão anterior encontrada.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        allVersions.map((version, index) => (
                                            <TableRow key={index} className={version.is_current ? 'bg-blue-50 dark:bg-blue-900/10' : ''}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono font-medium">{version.version}</span>
                                                        {version.is_current && (
                                                            <Badge variant="default" className="text-xs">Atual</Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {format(new Date(version.updated_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-md">
                                                        {version.change_description || '-'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {version.updated_by || manual.created_by || '-'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {version.file_url && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => window.open(version.file_url, '_blank')}
                                                            title="Download"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </Button>
                                                    )}
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

export default ManualHistory;
