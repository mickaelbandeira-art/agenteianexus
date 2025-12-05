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
import { ArrowLeft, Save, FileText, X } from 'lucide-react';
import {
    getSegments,
    createManual,
    updateManual,
    uploadManualFile,
    getManualWithHistory,
    addManualHistory
} from '@/lib/claro';
import type {
    ManualInput,
    ManualType,
    ClaroSegment
} from '@/lib/claro';
import { useToast } from '@/hooks/use-toast';

const ManualForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [segments, setSegments] = useState<ClaroSegment[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [currentFileUrl, setCurrentFileUrl] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const [formData, setFormData] = useState<ManualInput>({
        title: '',
        manual_type: 'Operacional',
        version: '1.0',
        file_url: '',
        segment_id: undefined
    });

    useEffect(() => {
        loadSegments();
        if (id && id !== 'new') {
            loadManual();
        }
    }, [id]);

    const loadSegments = async () => {
        try {
            const data = await getSegments();
            setSegments(data);
        } catch (error) {
            console.error('Error loading segments:', error);
        }
    };

    const loadManual = async () => {
        if (!id || id === 'new') return;

        try {
            setLoading(true);
            const data = await getManualWithHistory(id);
            setFormData({
                title: data.title,
                manual_type: data.manual_type,
                version: data.version,
                file_url: data.file_url,
                segment_id: data.segment_id || undefined
            });
            setDescription(data.description || '');
            setCurrentFileUrl(data.file_url);
        } catch (error) {
            toast({
                title: 'Erro ao carregar manual',
                description: 'Não foi possível carregar os dados do manual.',
                variant: 'destructive',
            });
            navigate('/clients/claro/manuals');
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type (PDF, DOC, DOCX, etc.)
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            ];

            if (!allowedTypes.includes(file.type)) {
                toast({
                    title: 'Tipo de arquivo inválido',
                    description: 'Apenas arquivos PDF, DOC, DOCX, PPT e PPTX são permitidos.',
                    variant: 'destructive',
                });
                return;
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast({
                    title: 'Arquivo muito grande',
                    description: 'O arquivo deve ter no máximo 10MB.',
                    variant: 'destructive',
                });
                return;
            }

            setSelectedFile(file);
        }
    };

    const handleUploadFile = async () => {
        if (!selectedFile) return null;

        try {
            setUploading(true);
            const timestamp = Date.now();
            const fileName = `${timestamp}-${selectedFile.name}`;
            const filePath = `manuals/${fileName}`;

            const fileUrl = await uploadManualFile(selectedFile, filePath);

            toast({
                title: 'Upload concluído',
                description: 'O arquivo foi enviado com sucesso.',
            });

            return fileUrl;
        } catch (error: any) {
            toast({
                title: 'Erro no upload',
                description: error.message || 'Não foi possível fazer o upload do arquivo.',
                variant: 'destructive',
            });
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.manual_type) {
            toast({
                title: 'Campos obrigatórios',
                description: 'Preencha o título e o tipo do manual.',
                variant: 'destructive',
            });
            return;
        }

        try {
            setLoading(true);

            // Upload file if selected
            let fileUrl = formData.file_url;
            if (selectedFile) {
                const uploadedUrl = await handleUploadFile();
                if (uploadedUrl) {
                    fileUrl = uploadedUrl;
                }
            }

            const manualData: ManualInput = {
                ...formData,
                file_url: fileUrl,
                description: description
            };

            if (id && id !== 'new') {
                // Update existing manual
                await updateManual(id, manualData);

                // If file was updated, add to history
                if (selectedFile && fileUrl !== currentFileUrl) {
                    await addManualHistory({
                        manual_id: id,
                        version: formData.version,
                        file_url: fileUrl,
                        change_notes: 'Arquivo atualizado'
                    });
                }

                toast({
                    title: 'Manual atualizado',
                    description: 'Os dados do manual foram atualizados com sucesso.',
                });
            } else {
                // Create new manual
                await createManual(manualData);
                toast({
                    title: 'Manual criado',
                    description: 'O manual foi criado com sucesso.',
                });
            }

            navigate('/clients/claro/manuals');
        } catch (error: any) {
            toast({
                title: 'Erro ao salvar',
                description: error.message || 'Não foi possível salvar o manual.',
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
                        onClick={() => navigate('/clients/claro/manuals')}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {id && id !== 'new' ? 'Editar Manual' : 'Novo Manual'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gerencie os dados e arquivo do manual
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Dados do Manual</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="title">
                                        Título <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Ex: Manual de Operação do Sistema X"
                                        required
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="description">Descrição</Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Descreva o conteúdo do manual..."
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="manual_type">
                                        Tipo <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.manual_type}
                                        onValueChange={(value: ManualType) =>
                                            setFormData({ ...formData, manual_type: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Operacional">Operacional</SelectItem>
                                            <SelectItem value="Técnico">Técnico</SelectItem>
                                            <SelectItem value="Administrativo">Administrativo</SelectItem>
                                            <SelectItem value="Treinamento">Treinamento</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="version">Versão</Label>
                                    <Input
                                        id="version"
                                        value={formData.version}
                                        onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                                        placeholder="Ex: 1.0"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="segment">Segmento (Opcional)</Label>
                                    <Select
                                        value={formData.segment_id || 'none'}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, segment_id: value === 'none' ? undefined : value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Nenhum (Geral)</SelectItem>
                                            {segments.map((seg) => (
                                                <SelectItem key={seg.id} value={seg.id}>
                                                    {seg.segment_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* File Upload Section */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="text-lg font-medium">Arquivo do Manual</h3>

                                {currentFileUrl && !selectedFile && (
                                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-green-600" />
                                            <span className="text-sm">Arquivo atual disponível</span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(currentFileUrl, '_blank')}
                                        >
                                            Visualizar
                                        </Button>
                                    </div>
                                )}

                                {selectedFile && (
                                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                            <div>
                                                <div className="text-sm font-medium">{selectedFile.name}</div>
                                                <div className="text-xs text-gray-500">
                                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setSelectedFile(null)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}

                                <div>
                                    <Input
                                        type="file"
                                        onChange={handleFileSelect}
                                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                                        className="cursor-pointer"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Formatos aceitos: PDF, DOC, DOCX, PPT, PPTX (máx. 10MB)
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/clients/claro/manuals')}
                                    disabled={loading || uploading}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={loading || uploading}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {loading || uploading ? 'Salvando...' : 'Salvar'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ManualForm;
