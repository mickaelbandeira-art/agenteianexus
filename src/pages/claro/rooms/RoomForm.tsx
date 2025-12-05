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
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import {
    getRooms,
    createRoom,
    updateRoom,
} from '@/lib/claro';
import type { TrainingRoomInput, RoomStatus, ResourceItem } from '@/lib/claro';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Helper to fetch room by ID
const getRoomById = async (id: string) => {
    const { data, error } = await supabase
        .from('salas')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
};

const RoomForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<TrainingRoomInput>({
        room_name: '',
        capacity: 0,
        location: '',
        resources: [] as ResourceItem[],
        status: 'Disponível'
    });

    const [newResource, setNewResource] = useState<ResourceItem>({ name: '', quantity: 1 });

    useEffect(() => {
        if (id && id !== 'new') {
            loadRoom();
        }
    }, [id]);

    const loadRoom = async () => {
        if (!id || id === 'new') return;

        try {
            setLoading(true);
            const data = await getRoomById(id);
            setFormData({
                room_name: data.nome || '',
                capacity: data.capacidade || 0,
                location: data.localizacao || '',
                resources: [] as ResourceItem[],
                status: 'Disponível'
            });
        } catch (error) {
            toast({
                title: 'Erro ao carregar sala',
                description: 'Não foi possível carregar os dados da sala.',
                variant: 'destructive',
            });
            navigate('/clients/claro/rooms');
        } finally {
            setLoading(false);
        }
    };

    const handleAddResource = () => {
        if (!newResource.name) return;

        const currentResources = Array.isArray(formData.resources) ? formData.resources as ResourceItem[] : [];
        setFormData({
            ...formData,
            resources: [...currentResources, newResource]
        });
        setNewResource({ name: '', quantity: 1 });
    };

    const handleRemoveResource = (index: number) => {
        const currentResources = Array.isArray(formData.resources) ? formData.resources as ResourceItem[] : [];
        const newResources = [...currentResources];
        newResources.splice(index, 1);
        setFormData({
            ...formData,
            resources: newResources
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.room_name || !formData.capacity || !formData.location) {
            toast({
                title: 'Campos obrigatórios',
                description: 'Preencha todos os campos obrigatórios.',
                variant: 'destructive',
            });
            return;
        }

        try {
            setLoading(true);
            
            // Map to salas table format
            const salaData = {
                nome: formData.room_name,
                capacidade: formData.capacity,
                localizacao: formData.location,
            };

            if (id && id !== 'new') {
                await supabase.from('salas').update(salaData).eq('id', id);
                toast({
                    title: 'Sala atualizada',
                    description: 'Os dados da sala foram atualizados com sucesso.',
                });
            } else {
                await supabase.from('salas').insert(salaData);
                toast({
                    title: 'Sala criada',
                    description: 'A sala foi criada com sucesso.',
                });
            }
            navigate('/clients/claro/rooms');
        } catch (error: any) {
            toast({
                title: 'Erro ao salvar',
                description: error.message || 'Não foi possível salvar a sala.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const resources = Array.isArray(formData.resources) ? formData.resources as ResourceItem[] : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="container mx-auto max-w-3xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/clients/claro/rooms')}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {id && id !== 'new' ? 'Editar Sala' : 'Nova Sala'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gerencie os dados e recursos da sala
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Dados da Sala</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="room_name">
                                        Nome da Sala <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="room_name"
                                        value={formData.room_name}
                                        onChange={(e) => setFormData({ ...formData, room_name: e.target.value })}
                                        placeholder="Ex: Sala 01 - Térreo"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="capacity">
                                        Capacidade <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="capacity"
                                        type="number"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                                        placeholder="Ex: 30"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">
                                        Localização <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="location"
                                        value={formData.location || ''}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="Ex: Prédio A, 1º Andar"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">
                                        Status <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value: RoomStatus) =>
                                            setFormData({ ...formData, status: value })
                                        }
                                    >
                                        <SelectTrigger id="status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Disponível">Disponível</SelectItem>
                                            <SelectItem value="Ocupada">Ocupada</SelectItem>
                                            <SelectItem value="Manutenção">Manutenção</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Resources Section */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="text-lg font-medium">Recursos da Sala</h3>

                                <div className="flex items-end gap-4">
                                    <div className="flex-1 space-y-2">
                                        <Label>Recurso</Label>
                                        <Input
                                            value={newResource.name}
                                            onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                                            placeholder="Ex: Projetor"
                                        />
                                    </div>
                                    <div className="w-24 space-y-2">
                                        <Label>Qtd.</Label>
                                        <Input
                                            type="number"
                                            value={newResource.quantity}
                                            onChange={(e) => setNewResource({ ...newResource, quantity: parseInt(e.target.value) || 1 })}
                                            min={1}
                                        />
                                    </div>
                                    <Button type="button" onClick={handleAddResource} disabled={!newResource.name}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    {resources.map((resource, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-md border">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{resource.name}</span>
                                                <span className="text-sm text-gray-500">x{resource.quantity}</span>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-600 h-8 w-8"
                                                onClick={() => handleRemoveResource(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {resources.length === 0 && (
                                        <p className="text-sm text-gray-500 text-center py-4">
                                            Nenhum recurso adicionado.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/clients/claro/rooms')}
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

export default RoomForm;
