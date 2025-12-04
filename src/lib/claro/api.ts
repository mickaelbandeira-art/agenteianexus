// API functions for Claro Portal
// All database operations using Supabase

import { supabase } from '@/integrations/supabase/client';
import type {
  ClaroInstructor,
  ClaroSegment,
  ClaroTrainingClass,
  ClaroTrainee,
  ClaroMandatoryCourse,
  ClaroTraineeCourse,
  ClaroTrainingRoom,
  ClaroAccessRequest,
  ClaroManual,
  ClaroManualHistory,
  InstructorInput,
  SegmentInput,
  TrainingClassInput,
  TraineeInput,
  MandatoryCourseInput,
  TrainingRoomInput,
  AccessRequestInput,
  ManualInput,
  ManualHistoryInput,
  InstructorFilters,
  ClassFilters,
  AccessRequestFilters,
  ManualFilters,
  ClaroTrainingClassWithRelations,
  ClaroSegmentWithCourses,
  ClaroManualWithHistory,
} from './types';

// =====================================================
// INSTRUCTORS
// =====================================================

export const getInstructors = async (filters?: InstructorFilters) => {
  let query = supabase
    .from('claro_instructors')
    .select('*')
    .order('full_name', { ascending: true });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.employment_type) {
    query = query.eq('employment_type', filters.employment_type);
  }

  if (filters?.search) {
    query = query.or(`full_name.ilike.%${filters.search}%,matricula.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as unknown as ClaroInstructor[];
};

export const getInstructorById = async (id: string) => {
  const { data, error } = await supabase
    .from('claro_instructors')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as unknown as ClaroInstructor;
};

export const createInstructor = async (input: InstructorInput) => {
  const { data, error } = await supabase
    .from('claro_instructors')
    .insert(input as any)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as ClaroInstructor;
};

export const updateInstructor = async (id: string, input: Partial<InstructorInput>) => {
  const { data, error } = await supabase
    .from('claro_instructors')
    .update(input as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as ClaroInstructor;
};

export const deleteInstructor = async (id: string) => {
  const { error } = await supabase
    .from('claro_instructors')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// =====================================================
// SEGMENTS
// =====================================================

export const getSegments = async () => {
  const { data, error } = await supabase
    .from('claro_segments')
    .select('*')
    .order('segment_name', { ascending: true });

  if (error) throw error;
  return (data || []) as unknown as ClaroSegment[];
};

export const getSegmentWithCourses = async (id: string) => {
  const { data, error } = await supabase
    .from('claro_segments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as unknown as ClaroSegmentWithCourses;
};

export const createSegment = async (input: SegmentInput) => {
  const { data, error } = await supabase
    .from('claro_segments')
    .insert(input as any)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as ClaroSegment;
};

export const updateSegment = async (id: string, input: Partial<SegmentInput>) => {
  const { data, error } = await supabase
    .from('claro_segments')
    .update(input as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as ClaroSegment;
};

export const deleteSegment = async (id: string) => {
  const { error } = await supabase
    .from('claro_segments')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// =====================================================
// TRAINING CLASSES
// =====================================================

export const getClasses = async (filters?: ClassFilters) => {
  let query = supabase
    .from('claro_training_classes')
    .select('*')
    .order('start_date', { ascending: false });

  if (filters?.instructor_id) {
    query = query.eq('instructor_id', filters.instructor_id);
  }

  if (filters?.segment_id) {
    query = query.eq('segment_id', filters.segment_id);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.period) {
    query = query.eq('period', filters.period);
  }

  if (filters?.class_type) {
    query = query.eq('class_type', filters.class_type);
  }

  if (filters?.start_date_from) {
    query = query.gte('start_date', filters.start_date_from);
  }

  if (filters?.start_date_to) {
    query = query.lte('start_date', filters.start_date_to);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as unknown as ClaroTrainingClassWithRelations[];
};

export const getClassById = async (id: string) => {
  const { data, error } = await supabase
    .from('claro_training_classes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as unknown as ClaroTrainingClassWithRelations;
};

export const createClass = async (input: TrainingClassInput) => {
  const { data, error } = await supabase
    .from('claro_training_classes')
    .insert(input as any)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as ClaroTrainingClass;
};

export const updateClass = async (id: string, input: Partial<TrainingClassInput>) => {
  const { data, error } = await supabase
    .from('claro_training_classes')
    .update(input as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as ClaroTrainingClass;
};

export const deleteClass = async (id: string) => {
  const { error } = await supabase
    .from('claro_training_classes')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// =====================================================
// TRAINEES
// =====================================================

export const getTraineesByClass = async (classId: string) => {
  const { data, error } = await supabase
    .from('claro_trainees' as any)
    .select('*')
    .eq('class_id', classId)
    .order('full_name', { ascending: true });

  if (error) throw error;
  return (data || []) as unknown as ClaroTrainee[];
};

export const createTrainee = async (input: TraineeInput) => {
  const { data, error } = await supabase
    .from('claro_trainees' as any)
    .insert(input as any)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as ClaroTrainee;
};

export const updateTrainee = async (id: string, input: Partial<TraineeInput>) => {
  const { data, error } = await supabase
    .from('claro_trainees' as any)
    .update(input as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as ClaroTrainee;
};

export const deleteTrainee = async (id: string) => {
  const { error } = await supabase
    .from('claro_trainees' as any)
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// =====================================================
// MANDATORY COURSES
// =====================================================

export const getCoursesBySegment = async (segmentId: string) => {
  const { data, error } = await supabase
    .from('claro_mandatory_courses' as any)
    .select('*')
    .eq('segment_id', segmentId)
    .order('course_order', { ascending: true });

  if (error) throw error;
  return (data || []) as unknown as ClaroMandatoryCourse[];
};

export const createMandatoryCourse = async (input: MandatoryCourseInput) => {
  const { data, error } = await supabase
    .from('claro_mandatory_courses' as any)
    .insert(input as any)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as ClaroMandatoryCourse;
};

export const updateMandatoryCourse = async (id: string, input: Partial<MandatoryCourseInput>) => {
  const { data, error } = await supabase
    .from('claro_mandatory_courses' as any)
    .update(input as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as ClaroMandatoryCourse;
};

export const deleteMandatoryCourse = async (id: string) => {
  const { error } = await supabase
    .from('claro_mandatory_courses' as any)
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// =====================================================
// TRAINEE COURSES (Progress)
// =====================================================

export const getTraineeCourseProgress = async (traineeId: string) => {
  const { data, error } = await supabase
    .from('claro_trainee_courses' as any)
    .select('*')
    .eq('trainee_id', traineeId);

  if (error) throw error;
  return data;
};

export const updateCourseCompletion = async (
  traineeId: string,
  courseId: string,
  completed: boolean,
  completionDate?: string
) => {
  const { data, error } = await supabase
    .from('claro_trainee_courses' as any)
    .upsert({
      trainee_id: traineeId,
      course_id: courseId,
      completed,
      completion_date: completionDate || null,
    } as any)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as ClaroTraineeCourse;
};

// =====================================================
// TRAINING ROOMS
// =====================================================

export const getRooms = async () => {
  const { data, error } = await supabase
    .from('claro_training_rooms' as any)
    .select('*')
    .order('room_name', { ascending: true });

  if (error) throw error;
  return (data || []) as unknown as ClaroTrainingRoom[];
};

export const createRoom = async (input: TrainingRoomInput) => {
  const { data, error } = await supabase
    .from('claro_training_rooms' as any)
    .insert(input as any)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as ClaroTrainingRoom;
};

export const updateRoom = async (id: string, input: Partial<TrainingRoomInput>) => {
  const { data, error } = await supabase
    .from('claro_training_rooms' as any)
    .update(input as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as ClaroTrainingRoom;
};

export const deleteRoom = async (id: string) => {
  const { error } = await supabase
    .from('claro_training_rooms' as any)
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// =====================================================
// ACCESS REQUESTS
// =====================================================

export const getAccessRequests = async (filters?: AccessRequestFilters) => {
  let query = supabase
    .from('claro_access_requests' as any)
    .select('*')
    .order('request_date', { ascending: false });

  if (filters?.class_id) {
    query = query.eq('class_id', filters.class_id);
  }

  if (filters?.trainee_id) {
    query = query.eq('trainee_id', filters.trainee_id);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.access_type) {
    query = query.eq('access_type', filters.access_type);
  }

  if (filters?.overdue) {
    const today = new Date().toISOString().split('T')[0];
    query = query.lt('deadline_date', today).neq('status', 'Concluído');
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createAccessRequest = async (input: AccessRequestInput) => {
  const { data, error } = await supabase
    .from('claro_access_requests' as any)
    .insert(input as any)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as ClaroAccessRequest;
};

export const updateAccessRequest = async (id: string, input: Partial<AccessRequestInput>) => {
  const { data, error } = await supabase
    .from('claro_access_requests' as any)
    .update(input as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as ClaroAccessRequest;
};

export const deleteAccessRequest = async (id: string) => {
  const { error } = await supabase
    .from('claro_access_requests' as any)
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// =====================================================
// MANUALS
// =====================================================

export const getManuals = async (filters?: ManualFilters) => {
  let query = supabase
    .from('claro_manuals' as any)
    .select('*')
    .order('updated_at', { ascending: false });

  if (filters?.manual_type) {
    query = query.eq('manual_type', filters.manual_type);
  }

  if (filters?.segment_id) {
    query = query.eq('segment_id', filters.segment_id);
  }

  if (filters?.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as unknown as ClaroManual[];
};

export const getManualById = async (id: string) => {
  const { data, error } = await supabase
    .from('claro_manuals' as any)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as unknown as ClaroManualWithHistory;
};

export const createManual = async (input: ManualInput) => {
  const { data, error } = await supabase
    .from('claro_manuals' as any)
    .insert(input as any)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as ClaroManual;
};

export const updateManual = async (id: string, input: Partial<ManualInput>) => {
  const { data, error } = await supabase
    .from('claro_manuals' as any)
    .update(input as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as ClaroManual;
};

export const deleteManual = async (id: string) => {
  const { error } = await supabase
    .from('claro_manuals' as any)
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// =====================================================
// MANUAL HISTORY
// =====================================================

export const getManualHistory = async (manualId: string) => {
  const { data, error } = await supabase
    .from('claro_manual_history' as any)
    .select('*')
    .eq('manual_id', manualId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as unknown as ClaroManualHistory[];
};

export const createManualHistory = async (input: ManualHistoryInput) => {
  const { data, error } = await supabase
    .from('claro_manual_history' as any)
    .insert(input as any)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as ClaroManualHistory;
};

// Alias for createManualHistory to match import in ManualForm
export const addManualHistory = createManualHistory;

/**
 * Get manual with its complete history
 */
export const getManualWithHistory = async (id: string) => {
  const manual = await getManualById(id);
  const history = await getManualHistory(id);

  return {
    ...manual,
    history
  } as ClaroManualWithHistory;
};

/**
 * Upload manual file to Supabase Storage
 */
export const uploadManualFile = async (file: File, filePath: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from('claro-manuals')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('claro-manuals')
    .getPublicUrl(filePath);

  return publicUrl;
};

// =====================================================
// DASHBOARD STATISTICS
// =====================================================

export const getDashboardStats = async () => {
  const [instructorsRes, classesRes, segmentsRes] = await Promise.all([
    supabase.from('claro_instructors').select('id, status'),
    supabase.from('claro_training_classes').select('id, status'),
    supabase.from('claro_segments').select('id'),
  ]);

  const instructors = instructorsRes.data || [];
  const classes = classesRes.data || [];
  const segments = segmentsRes.data || [];

  return {
    totalInstructors: instructors.length,
    activeInstructors: instructors.filter((i: any) => i.status === 'Ativo').length,
    totalClasses: classes.length,
    activeClasses: classes.filter((c: any) => c.status === 'Em Andamento').length,
    totalSegments: segments.length,
  };
};
