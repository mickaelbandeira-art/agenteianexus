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
import { getRooms, deleteRoom } from '@/lib/claro';
import type { TrainingRoom } from '@/lib/claro';
import { useToast } from '@/hooks/use-toast';

const RoomList = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [rooms, setRooms] = useState<TrainingRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        try {
            setLoading(true);
            const data = await getRooms();
            setRooms(data);
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
            await deleteRoom(id);
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
        room.room_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Disponível': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Ocupada': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'Manutenção': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const renderResources = (resources: any) => {
        if (!resources || !Array.isArray(resources)) return null;

        // Show icons for common resources
        const hasProjector = resources.some((r: any) => r.name.toLowerCase().includes('projetor'));
        const hasWifi = resources.some((r: any) => r.name.toLowerCase().includes('wifi') || r.name.toLowerCase().includes('internet'));
        const hasPC = resources.some((r: any) => r.name.toLowerCase().includes('computador') || r.name.toLowerCase().includes('pc'));

        return (
            <div className="flex gap-2">
                {hasProjector && <Monitor className="w-4 h-4 text-gray-500" title="Projetor" />}
                {hasWifi && <Wifi className="w-4 h-4 text-gray-500" title="Wi-Fi" />}
                {hasPC && <Users className="w-4 h-4 text-gray-500" title="Computadores" />}
                <span className="text-xs text-gray-500 ml-1">
                    {resources.length} itens
                </span>
            </div>
        );
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
                                        <TableHead>Recursos</TableHead>
                                        <TableHead>Status</TableHead>
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
                                    ) : filteredRooms.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                Nenhuma sala encontrada.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredRooms.map((room) => (
                                            <TableRow key={room.id}>
                                                <TableCell className="font-medium">{room.room_name}</TableCell>
                                                <TableCell>{room.capacity} pessoas</TableCell>
                                                <TableCell>{room.location}</TableCell>
                                                <TableCell>{renderResources(room.resources)}</TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(room.status)}>
                                                        {room.status}
                                                    </Badge>
                                                </TableCell>
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
