-- Criar tabela de progresso do usuário
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  training_id UUID REFERENCES trainings(id) ON DELETE CASCADE,
  
  -- Status e progresso
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'failed')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  
  -- Quiz/Avaliação
  quiz_score INTEGER CHECK (quiz_score >= 0 AND quiz_score <= 100),
  quiz_attempts INTEGER DEFAULT 0,
  quiz_answers JSONB,
  
  -- Tempo gasto
  time_spent_minutes INTEGER DEFAULT 0,
  
  -- Timestamps
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, training_id)
);

-- Índices
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_training_id ON user_progress(training_id);
CREATE INDEX idx_user_progress_status ON user_progress(status);

-- Habilitar RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Usuários veem próprio progresso"
  ON user_progress FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Usuários atualizam próprio progresso"
  ON user_progress FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Usuários modificam próprio progresso"
  ON user_progress FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins/Gestores/Instrutores veem todo progresso"
  ON user_progress FOR SELECT
  USING (
    has_role(auth.uid(), 'admin')
    OR has_role(auth.uid(), 'gestor')
    OR has_role(auth.uid(), 'instrutor')
  );

-- Trigger para updated_at
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar last_accessed_at
CREATE OR REPLACE FUNCTION update_last_accessed()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_accessed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_progress_last_accessed
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_last_accessed();
