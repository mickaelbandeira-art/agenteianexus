// Types for Claro Portal
// All database entities and related types


// =====================================================
// ENUMS
// =====================================================
export type EmploymentType = 'CLT' | 'PJ' | 'Terceirizado';
export type InstructorStatus = 'Ativo' | 'Inativo';
export type OperationType = 'CRC' | 'Retenção' | 'Receptivo' | 'Outros';
export type ClassPeriod = 'Manhã' | 'Tarde' | 'Integral';
export type ClassType = 'Onboarding' | 'Reciclagem' | 'Multiplicação';
export type ClassStatus = 'Planejada' | 'Em Andamento' | 'Concluída' | 'Cancelada';
export type TraineeStatus = 'Ativo' | 'Desistente' | 'Aprovado' | 'Reprovado';
export type LocationType = 'AeC' | 'Externo';
export type RoomStatus = 'Disponível' | 'Em Uso' | 'Manutenção' | 'Ocupada';
export type AccessType = 'Claro' | 'Sistemas Internos' | 'VPN' | 'Outros' | 'Rede' | 'Email' | 'Sistema' | 'Crachá';
export type AccessStatus = 'Solicitado' | 'Em Andamento' | 'Concluído' | 'Atrasado' | 'Pendente' | 'Cancelado';
export type AccessRequestStatus = AccessStatus;
export type ManualType = 'Operacional' | 'Conduta' | 'Sistemas' | 'Outros' | 'Técnico' | 'Administrativo' | 'Treinamento';

// =====================================================
// DATABASE ENTITIES
// =====================================================

export interface ClaroInstructor {
    id: string;
    matricula: string;
    full_name: string;
    employment_type: EmploymentType;
    status: InstructorStatus;
    created_at: string;
    updated_at: string;
}

// Alias for backward compatibility
export type Instructor = ClaroInstructor;

export interface ClaroSegment {
    id: string;
    cr_code: string;
    segment_name: string;
    training_days: number;
    default_schedule: string;
    operation_type: OperationType;
    created_at: string;
    updated_at: string;
}

// Alias for backward compatibility
export type Segment = ClaroSegment;

export interface ClaroTrainingClass {
    id: string;
    class_code: string;
    instructor_id: string | null;
    segment_id: string | null;
    period: ClassPeriod;
    class_type: ClassType;
    has_snack: boolean;
    snack_value: number | null;
    assisted_service_date: string | null;
    medical_exam_date: string | null;
    contract_signature_date: string | null;
    start_date: string;
    end_date: string | null;
    status: ClassStatus;
    created_at: string;
    updated_at: string;
}

export interface ClaroTrainee {
    id: string;
    class_id: string;
    full_name: string;
    cpf: string;
    email: string | null;
    phone: string | null;
    status: TraineeStatus;
    created_at: string;
    updated_at: string;
}

// Alias for backward compatibility
export type Trainee = ClaroTrainee;

export interface ClaroMandatoryCourse {
    id: string;
    segment_id: string;
    course_name: string;
    course_duration: number; // em horas
    course_order: number;
    created_at: string;
}

export interface ClaroTraineeCourse {
    id: string;
    trainee_id: string;
    course_id: string;
    completed: boolean;
    completion_date: string | null;
    created_at: string;
}

export interface ClaroTrainingRoom {
    id: string;
    room_name: string;
    location_type: LocationType;
    location_description: string | null;
    location: string;
    capacity: number;
    resources: RoomResources | ResourceItem[];
    status: RoomStatus;
    created_at: string;
}

// Alias for backward compatibility
export type TrainingRoom = ClaroTrainingRoom;

export interface RoomResources {
    tv?: boolean;
    projector?: boolean;
    whiteboard?: boolean;
    computers?: number;
    [key: string]: boolean | number | undefined;
}

export interface ResourceItem {
    name: string;
    quantity: number;
}

export interface ClaroAccessRequest {
    id: string;
    class_id: string;
    trainee_id: string;
    access_type: AccessType;
    request_date: string;
    deadline_date: string;
    status: AccessStatus;
    notes: string | null;
    system_name?: string;
    protocol_number?: string;
    login_created?: string;
    initial_password?: string;
    observation?: string;
    created_at: string;
    updated_at: string;
}

export interface ClaroManual {
    id: string;
    title: string;
    manual_type: ManualType;
    segment_id: string | null;
    file_url: string;
    version: string;
    validity_date: string | null;
    created_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface ClaroManualHistory {
    id: string;
    manual_id: string;
    version: string;
    file_url: string;
    updated_by: string | null;
    change_notes: string | null;
    created_at: string;
}

// =====================================================
// EXTENDED TYPES (with relations)
// =====================================================

export interface ClaroTrainingClassWithRelations extends ClaroTrainingClass {
    instructor?: ClaroInstructor;
    segment?: ClaroSegment;
    trainees?: ClaroTrainee[];
    access_requests?: ClaroAccessRequest[];
}

// Alias for backward compatibility
export type TrainingClassWithRelations = ClaroTrainingClassWithRelations;

export interface ClaroTraineeWithRelations extends ClaroTrainee {
    class?: ClaroTrainingClass;
    courses?: ClaroTraineeCourseWithCourse[];
    access_requests?: ClaroAccessRequest[];
}

export interface ClaroTraineeCourseWithCourse extends ClaroTraineeCourse {
    course?: ClaroMandatoryCourse;
}

export interface ClaroSegmentWithCourses extends ClaroSegment {
    mandatory_courses?: ClaroMandatoryCourse[];
}

export interface ClaroManualWithHistory extends ClaroManual {
    history?: ClaroManualHistory[];
    creator?: {
        email: string;
        full_name?: string;
    };
    description?: string;
}

// =====================================================
// INPUT TYPES (for forms)
// =====================================================

export interface InstructorInput {
    matricula: string;
    full_name: string;
    employment_type: EmploymentType;
    status: InstructorStatus;
}

export interface SegmentInput {
    cr_code: string;
    segment_name: string;
    training_days: number;
    default_schedule: string;
    operation_type: OperationType;
}

export interface TrainingClassInput {
    class_code: string;
    instructor_id: string | null;
    segment_id: string | null;
    period: ClassPeriod;
    class_type: ClassType;
    has_snack: boolean;
    snack_value?: number | null;
    assisted_service_date?: string | null;
    medical_exam_date?: string | null;
    contract_signature_date?: string | null;
    start_date: string;
    end_date?: string | null;
    status: ClassStatus;
}

export interface TraineeInput {
    class_id: string;
    full_name: string;
    cpf: string;
    email?: string;
    phone?: string;
    status: TraineeStatus;
}

export interface MandatoryCourseInput {
    segment_id: string;
    course_name: string;
    course_duration: number;
    course_order: number;
}

export interface TrainingRoomInput {
    room_name: string;
    location_type?: LocationType;
    location_description?: string;
    location?: string;
    capacity: number;
    resources: RoomResources | ResourceItem[];
    status: RoomStatus;
}

export interface AccessRequestInput {
    class_id: string;
    trainee_id: string;
    access_type: AccessType;
    request_date: string;
    deadline_date: string;
    status: AccessStatus;
    notes?: string;
    system_name?: string;
    protocol_number?: string;
    login_created?: string;
    initial_password?: string;
    observation?: string;
}

export interface ManualInput {
    title: string;
    manual_type: ManualType;
    segment_id?: string;
    file_url: string;
    version: string;
    validity_date?: string;
    description?: string;
}

export interface ManualHistoryInput {
    manual_id: string;
    version: string;
    file_url: string;
    change_notes?: string;
    change_description?: string;
}

// =====================================================
// FILTER TYPES
// =====================================================

export interface InstructorFilters {
    status?: InstructorStatus;
    employment_type?: EmploymentType;
    search?: string;
}

export interface ClassFilters {
    instructor_id?: string;
    segment_id?: string;
    status?: ClassStatus;
    period?: ClassPeriod;
    class_type?: ClassType;
    start_date_from?: string;
    start_date_to?: string;
}

export interface AccessRequestFilters {
    class_id?: string;
    trainee_id?: string;
    status?: AccessStatus;
    access_type?: AccessType;
    overdue?: boolean;
}

export interface ManualFilters {
    manual_type?: ManualType;
    segment_id?: string;
    search?: string;
}

// =====================================================
// UTILITY TYPES
// =====================================================

export interface TimelineEvent {
    id: string;
    date: string;
    title: string;
    description?: string;
    type: 'milestone' | 'deadline' | 'event';
    completed: boolean;
}

export interface CourseProgress {
    course: ClaroMandatoryCourse;
    completed: boolean;
    completion_date?: string;
}

export interface ClassStatistics {
    total_trainees: number;
    active_trainees: number;
    approved_trainees: number;
    dropout_rate: number;
    course_completion_rate: number;
    pending_access_requests: number;
}
