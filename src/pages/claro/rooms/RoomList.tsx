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
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Search, Edit, Trash2, Monitor, Wifi, Users } from 'lucide-react';
import type { ClaroTrainingRoom } from '@/lib/claro';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Room type matching the salas table
interface Sala {
    id: string;
    nome: string;
    capacidade: number | null;
    localizacao: string | null;
    created_at: string | null;
}

const RoomList = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [rooms, setRooms] = useState<Sala[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('salas')
                .select('*')
                .order('nome');
            
            if (error) throw error;
            setRooms(data || []);
        } catch (error) {
            toast({
                title: 'Erro ao carregar salas',
                description: 'Não foi possível carregar a lista de salas.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta sala?')) return;

        try {
            const { error } = await supabase.from('salas').delete().eq('id', id);
            if (error) throw error;
            
            toast({
                title: 'Sala excluída',
                description: 'A sala foi excluída com sucesso.',
            });
            loadRooms();
        } catch (error) {
            toast({
                title: 'Erro ao excluir',
                description: 'Não foi possível excluir a sala.',
                variant: 'destructive',
            });
        }
    };

    const filteredRooms = rooms.filter((room) =>
        room.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.localizacao?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                                Gestão de Salas
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Gerencie as salas de treinamento e recursos
                            </p>
                        </div>
                    </div>
                    <Button onClick={() => navigate('/clients/claro/rooms/new')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Sala
                    </Button>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Buscar por nome ou localização..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Salas Cadastradas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Capacidade</TableHead>
                                        <TableHead>Localização</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8">
                                                Carregando...
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredRooms.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                Nenhuma sala encontrada.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredRooms.map((room) => (
                                            <TableRow key={room.id}>
                                                <TableCell className="font-medium">{room.nome}</TableCell>
                                                <TableCell>{room.capacidade || '-'} pessoas</TableCell>
                                                <TableCell>{room.localizacao || '-'}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => navigate(`/clients/claro/rooms/${room.id}`)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:text-red-600"
                                                            onClick={() => handleDelete(room.id)}
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

export default RoomList;
