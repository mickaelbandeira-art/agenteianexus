import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, Calculator } from 'lucide-react';
import {
    getClassById,
    createClass,
    updateClass,
    getInstructors,
    getSegments,
    calculateTrainingDates,
    generateClassCode,
    createTrainee,
    updateTrainee,
    deleteTrainee
} from '@/lib/claro';
import type {
    TrainingClassInput,
    Instructor,
    Segment,
    ClassStatus,
    ClassPeriod,
    ClassType,
    Trainee,
    TraineeInput
} from '@/lib/claro';
import { useToast } from '@/hooks/use-toast';
import { ClassTimeline } from '@/components/claro/classes/ClassTimeline';
import { ClassTrainees } from '@/components/claro/classes/ClassTrainees';
import { ClassCourses } from '@/components/claro/classes/ClassCourses';
import { format } from 'date-fns';

const ClassForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [segments, setSegments] = useState<Segment[]>([]);

    // State for trainees management
    const [trainees, setTrainees] = useState<Trainee[]>([]);
    const [deletedTraineeIds, setDeletedTraineeIds] = useState<string[]>([]);

    const [formData, setFormData] = useState<TrainingClassInput>({
        class_code: '',
        instructor_id: '',
        segment_id: '',
        period: 'Manhã',
        class_type: 'Onboarding',
        start_date: format(new Date(), 'yyyy-MM-dd'),
        status: 'Planejada',
        has_snack: false
    });

    useEffect(() => {
        loadDependencies();
        if (id && id !== 'new') {
            loadClass();
        }
    }, [id]);

    const loadDependencies = async () => {
        try {
            const [instructorsData, segmentsData] = await Promise.all([
                getInstructors(),
                getSegments()
            ]);
            setInstructors(instructorsData);
            setSegments(segmentsData);
        } catch (error) {
            console.error('Error loading dependencies:', error);
        }
    };

    const loadClass = async () => {
        if (!id || id === 'new') return;

        try {
            setLoading(true);
            const data = await getClassById(id);
            setFormData({
                class_code: data.class_code,
                instructor_id: data.instructor_id || '',
                segment_id: data.segment_id || '',
                period: data.period,
                class_type: data.class_type,
                start_date: data.start_date,
                end_date: data.end_date,
                assisted_service_date: data.assisted_service_date,
                medical_exam_date: data.medical_exam_date,
                contract_signature_date: data.contract_signature_date,
                status: data.status,
                has_snack: data.has_snack,
                snack_value: data.snack_value
            });

            if (data.trainees) {
                setTrainees(data.trainees);
            }
        } catch (error) {
            toast({
                title: 'Erro ao carregar turma',
                description: 'Não foi possível carregar os dados da turma.',
                variant: 'destructive',
            });
            navigate('/clients/claro/classes');
        } finally {
            setLoading(false);
        }
    };

    const handleCalculateDates = () => {
        if (!formData.start_date || !formData.segment_id) {
            toast({
                title: 'Dados insuficientes',
                description: 'Selecione uma data de início e um segmento.',
                variant: 'destructive',
            });
            return;
        }

        const segment = segments.find(s => s.id === formData.segment_id);
        if (!segment) return;

        const dates = calculateTrainingDates(formData.start_date, segment.training_days);

        setFormData(prev => ({
            ...prev,
            end_date: dates.endDate,
            assisted_service_date: dates.assistedServiceDate,
            medical_exam_date: dates.medicalExamDate,
            contract_signature_date: dates.contractSignatureDate
        }));

        // Generate code if empty
        if (!formData.class_code) {
            const code = generateClassCode(segment.segment_name, formData.start_date);
            setFormData(prev => ({ ...prev, class_code: code }));
        }

        toast({
            title: 'Datas calculadas',
            description: 'O cronograma foi atualizado com base no segmento.',
        });
    };

    // Trainee Handlers
    const handleAddTrainee = (newTrainee: Omit<Trainee, 'id' | 'created_at' | 'updated_at'>) => {
        const tempId = `temp-${Date.now()}`;
        setTrainees([...trainees, { ...newTrainee, id: tempId } as Trainee]);
    };

    const handleRemoveTrainee = (id: string) => {
        if (!id.startsWith('temp-')) {
            setDeletedTraineeIds([...deletedTraineeIds, id]);
        }
        setTrainees(trainees.filter(t => t.id !== id));
    };

    const handleUpdateTraineeStatus = (id: string, status: Trainee['status']) => {
        setTrainees(trainees.map(t => t.id === id ? { ...t, status } : t));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.class_code || !formData.segment_id || !formData.start_date) {
            toast({
                title: 'Campos obrigatórios',
                description: 'Preencha todos os campos obrigatórios.',
                variant: 'destructive',
            });
            return;
        }

        try {
            setLoading(true);
            let classId = id;

            // 1. Save Class
            if (id && id !== 'new') {
                await updateClass(id, formData);
                toast({
                    title: 'Turma atualizada',
                    description: 'Os dados da turma foram atualizados.',
                });
            } else {
                const newClass = await createClass(formData);
                classId = newClass.id;
                toast({
                    title: 'Turma criada',
                    description: 'A turma foi criada com sucesso.',
                });
            }

            // 2. Save Trainees
            if (classId) {
                // Delete removed trainees
                if (deletedTraineeIds.length > 0) {
                    await Promise.all(deletedTraineeIds.map(id => deleteTrainee(id)));
                }

                // Create/Update trainees
                const traineePromises = trainees.map(trainee => {
                    const traineeInput: TraineeInput = {
                        class_id: classId!,
                        full_name: trainee.full_name,
                        cpf: trainee.cpf,
                        email: trainee.email,
                        phone: trainee.phone,
                        status: trainee.status,
                        registration_number: trainee.registration_number
                    };

                    if (trainee.id && !trainee.id.startsWith('temp-')) {
                        return updateTrainee(trainee.id, traineeInput);
                    } else {
                        return createTrainee(traineeInput);
                    }
                });

                await Promise.all(traineePromises);
            }

            navigate('/clients/claro/classes');
        } catch (error: any) {
            toast({
                title: 'Erro ao salvar',
                description: error.message || 'Não foi possível salvar a turma.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="container mx-auto max-w-5xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/clients/claro/classes')}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {id && id !== 'new' ? 'Editar Turma' : 'Nova Turma'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gerencie o cronograma e participantes
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="general" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="general">Informações Gerais</TabsTrigger>
                        <TabsTrigger value="timeline" disabled={!formData.start_date}>Cronograma</TabsTrigger>
                        <TabsTrigger value="trainees" disabled={!id || id === 'new'}>Nominal</TabsTrigger>
                        <TabsTrigger value="courses" disabled={!formData.segment_id}>Cursos</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general">
                        <Card>
                            <CardHeader>
                                <CardTitle>Dados da Turma</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="segment">Segmento <span className="text-red-500">*</span></Label>
                                            <Select
                                                value={formData.segment_id}
                                                onValueChange={(value) => setFormData({ ...formData, segment_id: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {segments.map((segment) => (
                                                        <SelectItem key={segment.id} value={segment.id}>
                                                            {segment.segment_name} ({segment.training_days} dias)
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="instructor">Instrutor</Label>
                                            <Select
                                                value={formData.instructor_id}
                                                onValueChange={(value) => setFormData({ ...formData, instructor_id: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {instructors.map((instructor) => (
                                                        <SelectItem key={instructor.id} value={instructor.id}>
                                                            {instructor.full_name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="start_date">Data de Início <span className="text-red-500">*</span></Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="date"
                                                    value={formData.start_date}
                                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                                    required
                                                />
                                                <Button type="button" variant="outline" size="icon" onClick={handleCalculateDates} title="Calcular Datas">
                                                    <Calculator className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="class_code">Código da Turma <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={formData.class_code}
                                                onChange={(e) => setFormData({ ...formData, class_code: e.target.value })}
                                                placeholder="Gerado automaticamente..."
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="period">Período</Label>
                                            <Select
                                                value={formData.period}
                                                onValueChange={(value: ClassPeriod) => setFormData({ ...formData, period: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Manhã">Manhã</SelectItem>
                                                    <SelectItem value="Tarde">Tarde</SelectItem>
                                                    <SelectItem value="Integral">Integral</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="status">Status</Label>
                                            <Select
                                                value={formData.status}
                                                onValueChange={(value: ClassStatus) => setFormData({ ...formData, status: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Planejada">Planejada</SelectItem>
                                                    <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                                                    <SelectItem value="Concluída">Concluída</SelectItem>
                                                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4 pt-6">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => navigate('/clients/claro/classes')}
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
                    </TabsContent>

                    <TabsContent value="timeline">
                        <ClassTimeline
                            startDate={new Date(formData.start_date)}
                            endDate={formData.end_date ? new Date(formData.end_date) : undefined}
                            assistedServiceDate={formData.assisted_service_date ? new Date(formData.assisted_service_date) : undefined}
                            medicalExamDate={formData.medical_exam_date ? new Date(formData.medical_exam_date) : undefined}
                            contractSignatureDate={formData.contract_signature_date ? new Date(formData.contract_signature_date) : undefined}
                            status={formData.status}
                        />
                    </TabsContent>

                    <TabsContent value="trainees">
                        <Card>
                            <CardHeader>
                                <CardTitle>Nominal da Turma</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ClassTrainees
                                    trainees={trainees}
                                    onAddTrainee={handleAddTrainee}
                                    onRemoveTrainee={handleRemoveTrainee}
                                    onUpdateStatus={handleUpdateTraineeStatus}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="courses">
                        <ClassCourses segmentId={formData.segment_id} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default ClassForm;
