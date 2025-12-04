-- Migration: Create Claro Portal Tables
-- Description: Creates all tables for the Claro Instructor/Client Portal
-- Date: 2025-12-04

-- =====================================================
-- 1. INSTRUCTORS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS claro_instructors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matricula TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    employment_type TEXT NOT NULL CHECK (employment_type IN ('CLT', 'PJ', 'Terceirizado')),
    status TEXT NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. SEGMENTS TABLE (CR - Centro de Resultado)
-- =====================================================
CREATE TABLE IF NOT EXISTS claro_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cr_code TEXT NOT NULL,
    segment_name TEXT NOT NULL,
    training_days INTEGER NOT NULL,
    default_schedule TEXT NOT NULL,
    operation_type TEXT NOT NULL CHECK (operation_type IN ('CRC', 'Retenção', 'Receptivo', 'Outros')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. TRAINING CLASSES TABLE (Turmas)
-- =====================================================
CREATE TABLE IF NOT EXISTS claro_training_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_code TEXT UNIQUE NOT NULL,
    instructor_id UUID REFERENCES claro_instructors(id) ON DELETE SET NULL,
    segment_id UUID REFERENCES claro_segments(id) ON DELETE SET NULL,
    period TEXT NOT NULL CHECK (period IN ('Manhã', 'Tarde', 'Integral')),
    class_type TEXT NOT NULL CHECK (class_type IN ('Onboarding', 'Reciclagem', 'Multiplicação')),
    has_snack BOOLEAN DEFAULT FALSE,
    snack_value DECIMAL(10, 2),
    assisted_service_date DATE,
    medical_exam_date DATE,
    contract_signature_date DATE,
    start_date DATE NOT NULL,
    end_date DATE,
    status TEXT NOT NULL DEFAULT 'Planejada' CHECK (status IN ('Planejada', 'Em Andamento', 'Concluída', 'Cancelada')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. TRAINEES TABLE (Nominal da Turma)
-- =====================================================
CREATE TABLE IF NOT EXISTS claro_trainees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES claro_training_classes(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    cpf TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    status TEXT NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Desistente', 'Aprovado', 'Reprovado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. MANDATORY COURSES TABLE (Cursos Obrigatórios)
-- =====================================================
CREATE TABLE IF NOT EXISTS claro_mandatory_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    segment_id UUID REFERENCES claro_segments(id) ON DELETE CASCADE,
    course_name TEXT NOT NULL,
    course_duration INTEGER NOT NULL, -- em horas
    course_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. TRAINEE COURSES TABLE (Controle de Conclusão)
-- =====================================================
CREATE TABLE IF NOT EXISTS claro_trainee_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainee_id UUID REFERENCES claro_trainees(id) ON DELETE CASCADE,
    course_id UUID REFERENCES claro_mandatory_courses(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    completion_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(trainee_id, course_id)
);

-- =====================================================
-- 7. TRAINING ROOMS TABLE (Salas de Treinamento)
-- =====================================================
CREATE TABLE IF NOT EXISTS claro_training_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_name TEXT NOT NULL,
    location_type TEXT NOT NULL CHECK (location_type IN ('AeC', 'Externo')),
    location_description TEXT,
    capacity INTEGER NOT NULL,
    resources JSONB DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'Disponível' CHECK (status IN ('Disponível', 'Em Uso', 'Manutenção')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. ACCESS REQUESTS TABLE (Solicitações de Acesso)
-- =====================================================
CREATE TABLE IF NOT EXISTS claro_access_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES claro_training_classes(id) ON DELETE CASCADE,
    trainee_id UUID REFERENCES claro_trainees(id) ON DELETE CASCADE,
    access_type TEXT NOT NULL CHECK (access_type IN ('Claro', 'Sistemas Internos', 'VPN', 'Outros')),
    request_date DATE NOT NULL DEFAULT CURRENT_DATE,
    deadline_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Solicitado' CHECK (status IN ('Solicitado', 'Em Andamento', 'Concluído', 'Atrasado')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. MANUALS TABLE (Manuais e Documentação)
-- =====================================================
CREATE TABLE IF NOT EXISTS claro_manuals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    manual_type TEXT NOT NULL CHECK (manual_type IN ('Operacional', 'Conduta', 'Sistemas', 'Outros')),
    segment_id UUID REFERENCES claro_segments(id) ON DELETE SET NULL,
    file_url TEXT NOT NULL,
    version TEXT NOT NULL,
    validity_date DATE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. MANUAL HISTORY TABLE (Histórico de Atualizações)
-- =====================================================
CREATE TABLE IF NOT EXISTS claro_manual_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    manual_id UUID REFERENCES claro_manuals(id) ON DELETE CASCADE,
    version TEXT NOT NULL,
    file_url TEXT NOT NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    change_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_instructors_matricula ON claro_instructors(matricula);
CREATE INDEX IF NOT EXISTS idx_instructors_status ON claro_instructors(status);
CREATE INDEX IF NOT EXISTS idx_classes_instructor ON claro_training_classes(instructor_id);
CREATE INDEX IF NOT EXISTS idx_classes_segment ON claro_training_classes(segment_id);
CREATE INDEX IF NOT EXISTS idx_classes_status ON claro_training_classes(status);
CREATE INDEX IF NOT EXISTS idx_trainees_class ON claro_trainees(class_id);
CREATE INDEX IF NOT EXISTS idx_trainees_cpf ON claro_trainees(cpf);
CREATE INDEX IF NOT EXISTS idx_courses_segment ON claro_mandatory_courses(segment_id);
CREATE INDEX IF NOT EXISTS idx_access_class ON claro_access_requests(class_id);
CREATE INDEX IF NOT EXISTS idx_access_status ON claro_access_requests(status);
CREATE INDEX IF NOT EXISTS idx_manuals_segment ON claro_manuals(segment_id);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_claro_instructors_updated_at
    BEFORE UPDATE ON claro_instructors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claro_segments_updated_at
    BEFORE UPDATE ON claro_segments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claro_training_classes_updated_at
    BEFORE UPDATE ON claro_training_classes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claro_trainees_updated_at
    BEFORE UPDATE ON claro_trainees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claro_access_requests_updated_at
    BEFORE UPDATE ON claro_access_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claro_manuals_updated_at
    BEFORE UPDATE ON claro_manuals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE claro_instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE claro_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE claro_training_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE claro_trainees ENABLE ROW LEVEL SECURITY;
ALTER TABLE claro_mandatory_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE claro_trainee_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE claro_training_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE claro_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE claro_manuals ENABLE ROW LEVEL SECURITY;
ALTER TABLE claro_manual_history ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Instructors: Admin can do everything, Instrutor can read
CREATE POLICY "Admin full access to instructors" ON claro_instructors
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Instrutor read access to instructors" ON claro_instructors
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('instrutor', 'gestor')
        )
    );

-- Segments: Admin can do everything, Instrutor can read
CREATE POLICY "Admin full access to segments" ON claro_segments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Instrutor read access to segments" ON claro_segments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('instrutor', 'gestor')
        )
    );

-- Training Classes: Instrutor and Admin can manage
CREATE POLICY "Instrutor full access to classes" ON claro_training_classes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'instrutor', 'gestor')
        )
    );

-- Trainees: Instrutor and Admin can manage
CREATE POLICY "Instrutor full access to trainees" ON claro_trainees
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'instrutor', 'gestor')
        )
    );

-- Mandatory Courses: Admin can manage, Instrutor can read
CREATE POLICY "Admin full access to mandatory courses" ON claro_mandatory_courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Instrutor read access to mandatory courses" ON claro_mandatory_courses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('instrutor', 'gestor')
        )
    );

-- Trainee Courses: Instrutor and Admin can manage
CREATE POLICY "Instrutor full access to trainee courses" ON claro_trainee_courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'instrutor', 'gestor')
        )
    );

-- Training Rooms: Admin can manage, Instrutor can read
CREATE POLICY "Admin full access to rooms" ON claro_training_rooms
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Instrutor read access to rooms" ON claro_training_rooms
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('instrutor', 'gestor')
        )
    );

-- Access Requests: Instrutor and Admin can manage
CREATE POLICY "Instrutor full access to access requests" ON claro_access_requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'instrutor', 'gestor')
        )
    );

-- Manuals: Instrutor and Admin can manage
CREATE POLICY "Instrutor full access to manuals" ON claro_manuals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'instrutor', 'gestor')
        )
    );

-- Manual History: Read access for Instrutor and Admin
CREATE POLICY "Instrutor read access to manual history" ON claro_manual_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'instrutor', 'gestor')
        )
    );

CREATE POLICY "Instrutor insert access to manual history" ON claro_manual_history
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'instrutor', 'gestor')
        )
    );
