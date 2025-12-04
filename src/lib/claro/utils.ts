// Utility functions for Claro Portal

import type { TimelineEvent, ClassStatistics, ClaroTrainingClass, ClaroSegment } from './types';

/**
 * Calculate the end date of a training class based on start date and segment training days
 */
export const calculateEndDate = (startDate: string, trainingDays: number): string => {
    const start = new Date(startDate);
    const end = new Date(start);

    // Add training days (excluding weekends)
    let daysAdded = 0;
    while (daysAdded < trainingDays) {
        end.setDate(end.getDate() + 1);
        // Skip weekends (0 = Sunday, 6 = Saturday)
        if (end.getDay() !== 0 && end.getDay() !== 6) {
            daysAdded++;
        }
    }

    return end.toISOString().split('T')[0];
};

/**
 * Calculate the deadline date for access requests (3rd training day)
 */
export const calculateAccessDeadline = (startDate: string): string => {
    return calculateEndDate(startDate, 3);
};

/**
 * Calculate all important dates for a training class
 */
export const calculateTrainingDates = (startDate: string, trainingDays: number) => {
    const endDate = calculateEndDate(startDate, trainingDays);

    // Assisted service starts 1 day after training ends
    const assistedServiceDate = calculateEndDate(endDate, 1);

    // Medical exam should be scheduled 2 days before training starts
    const start = new Date(startDate);
    const medicalExam = new Date(start);
    let daysSubtracted = 0;
    while (daysSubtracted < 2) {
        medicalExam.setDate(medicalExam.getDate() - 1);
        // Skip weekends
        if (medicalExam.getDay() !== 0 && medicalExam.getDay() !== 6) {
            daysSubtracted++;
        }
    }
    const medicalExamDate = medicalExam.toISOString().split('T')[0];

    // Contract signature should be 1 day before training starts
    const contractSignature = new Date(start);
    let contractDaysSubtracted = 0;
    while (contractDaysSubtracted < 1) {
        contractSignature.setDate(contractSignature.getDate() - 1);
        // Skip weekends
        if (contractSignature.getDay() !== 0 && contractSignature.getDay() !== 6) {
            contractDaysSubtracted++;
        }
    }
    const contractSignatureDate = contractSignature.toISOString().split('T')[0];

    return {
        endDate,
        assistedServiceDate,
        medicalExamDate,
        contractSignatureDate
    };
};

/**
 * Generate timeline events for a training class
 */
export const generateClassTimeline = (
    trainingClass: ClaroTrainingClass,
    segment?: ClaroSegment
): TimelineEvent[] => {
    const events: TimelineEvent[] = [];
    const today = new Date().toISOString().split('T')[0];

    // Start date
    events.push({
        id: 'start',
        date: trainingClass.start_date,
        title: 'Início do Treinamento',
        description: `Turma ${trainingClass.class_code} - ${trainingClass.period}`,
        type: 'milestone',
        completed: trainingClass.start_date <= today,
    });

    // Access deadline (3rd day)
    const accessDeadline = calculateAccessDeadline(trainingClass.start_date);
    events.push({
        id: 'access',
        date: accessDeadline,
        title: 'Prazo de Solicitação de Acessos',
        description: 'Todos os acessos devem estar solicitados até este dia',
        type: 'deadline',
        completed: accessDeadline <= today,
    });

    // Medical exam
    if (trainingClass.medical_exam_date) {
        events.push({
            id: 'medical',
            date: trainingClass.medical_exam_date,
            title: 'Exame Admissional',
            type: 'event',
            completed: trainingClass.medical_exam_date <= today,
        });
    }

    // Contract signature
    if (trainingClass.contract_signature_date) {
        events.push({
            id: 'contract',
            date: trainingClass.contract_signature_date,
            title: 'Assinatura de Contrato',
            type: 'event',
            completed: trainingClass.contract_signature_date <= today,
        });
    }

    // Assisted service
    if (trainingClass.assisted_service_date) {
        events.push({
            id: 'assisted',
            date: trainingClass.assisted_service_date,
            title: 'Atendimento Assistido',
            description: 'Início do atendimento assistido',
            type: 'milestone',
            completed: trainingClass.assisted_service_date <= today,
        });
    }

    // End date
    if (trainingClass.end_date) {
        events.push({
            id: 'end',
            date: trainingClass.end_date,
            title: 'Conclusão do Treinamento',
            type: 'milestone',
            completed: trainingClass.end_date <= today,
        });
    } else if (segment) {
        // Calculate end date based on segment training days
        const calculatedEndDate = calculateEndDate(trainingClass.start_date, segment.training_days);
        events.push({
            id: 'end',
            date: calculatedEndDate,
            title: 'Conclusão do Treinamento (Prevista)',
            description: `${segment.training_days} dias de treinamento`,
            type: 'milestone',
            completed: calculatedEndDate <= today,
        });
    }

    // Sort by date
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Check if an access request is overdue
 */
export const isAccessRequestOverdue = (deadlineDate: string, status: string): boolean => {
    if (status === 'Concluído') return false;
    const today = new Date().toISOString().split('T')[0];
    return deadlineDate < today;
};

/**
 * Format CPF (Brazilian document)
 */
export const formatCPF = (cpf: string): string => {
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return cpf;
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Format phone number (Brazilian)
 */
export const formatPhone = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
};

/**
 * Calculate class statistics
 */
export const calculateClassStatistics = (
    trainees: any[],
    courses: any[],
    accessRequests: any[]
): ClassStatistics => {
    const totalTrainees = trainees.length;
    const activeTrainees = trainees.filter(t => t.status === 'Ativo').length;
    const approvedTrainees = trainees.filter(t => t.status === 'Aprovado').length;

    const dropoutRate = totalTrainees > 0
        ? ((trainees.filter(t => t.status === 'Desistente').length / totalTrainees) * 100)
        : 0;

    // Calculate course completion rate
    const totalCourseAssignments = trainees.length * courses.length;
    const completedCourses = courses.reduce((acc, course) => {
        return acc + trainees.filter(t => {
            const progress = t.courses?.find((c: any) => c.course_id === course.id);
            return progress?.completed;
        }).length;
    }, 0);

    const courseCompletionRate = totalCourseAssignments > 0
        ? (completedCourses / totalCourseAssignments) * 100
        : 0;

    const pendingAccessRequests = accessRequests.filter(
        r => r.status !== 'Concluído'
    ).length;

    return {
        total_trainees: totalTrainees,
        active_trainees: activeTrainees,
        approved_trainees: approvedTrainees,
        dropout_rate: Math.round(dropoutRate * 10) / 10,
        course_completion_rate: Math.round(courseCompletionRate * 10) / 10,
        pending_access_requests: pendingAccessRequests,
    };
};

/**
 * Get status color for badges
 */
export const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
        // Instructor/Trainee status
        'Ativo': 'bg-green-500',
        'Inativo': 'bg-gray-500',
        'Desistente': 'bg-red-500',
        'Aprovado': 'bg-blue-500',
        'Reprovado': 'bg-orange-500',

        // Class status
        'Planejada': 'bg-purple-500',
        'Em Andamento': 'bg-yellow-500',
        'Concluída': 'bg-green-500',
        'Cancelada': 'bg-red-500',

        // Access request status
        'Solicitado': 'bg-blue-500',
        'Atrasado': 'bg-red-500',
        'Concluído': 'bg-green-500',

        // Room status
        'Disponível': 'bg-green-500',
        'Em Uso': 'bg-yellow-500',
        'Manutenção': 'bg-orange-500',
    };

    return statusColors[status] || 'bg-gray-500';
};

/**
 * Generate unique class code
 */
export const generateClassCode = (
    segmentCode: string,
    period: string,
    date: Date = new Date()
): string => {
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const periodCode = period === 'Manhã' ? 'M' : period === 'Tarde' ? 'T' : 'I';
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');

    return `${segmentCode}-${year}${month}${periodCode}-${random}`;
};

/**
 * Validate CPF (Brazilian document)
 */
export const validateCPF = (cpf: string): boolean => {
    const cleaned = cpf.replace(/\D/g, '');

    if (cleaned.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleaned)) return false; // All digits the same

    // Validate check digits
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleaned.charAt(i)) * (10 - i);
    }
    let checkDigit = 11 - (sum % 11);
    if (checkDigit >= 10) checkDigit = 0;
    if (checkDigit !== parseInt(cleaned.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleaned.charAt(i)) * (11 - i);
    }
    checkDigit = 11 - (sum % 11);
    if (checkDigit >= 10) checkDigit = 0;
    if (checkDigit !== parseInt(cleaned.charAt(10))) return false;

    return true;
};

/**
 * Format date to Brazilian format (DD/MM/YYYY)
 */
export const formatDateBR = (date: string): string => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

/**
 * Get days until date
 */
export const getDaysUntil = (date: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
