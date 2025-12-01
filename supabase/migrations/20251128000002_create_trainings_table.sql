-- Criar tabela de treinamentos
CREATE TABLE trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Conteúdo
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'video', 'quiz', 'pdf', 'interactive')),
  
  -- Recursos
  video_url TEXT,
  pdf_url TEXT,
  quiz_data JSONB,
  
  -- Metadados
  duration_minutes INTEGER,
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  
  -- Tags e categorias
  tags TEXT[] DEFAULT '{}',
  category TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_trainings_client_id ON trainings(client_id);
CREATE INDEX idx_trainings_published ON trainings(is_published);
CREATE INDEX idx_trainings_category ON trainings(category);

-- Habilitar RLS
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Usuários veem treinamentos publicados do seu cliente"
  ON trainings FOR SELECT
  USING (
    is_published = true 
    AND client_id IN (
      SELECT client_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins veem todos os treinamentos"
  ON trainings FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins/Gestores/Instrutores podem gerenciar treinamentos"
  ON trainings FOR ALL
  USING (
    has_role(auth.uid(), 'admin') 
    OR has_role(auth.uid(), 'gestor')
    OR has_role(auth.uid(), 'instrutor')
  );

-- Trigger para updated_at
CREATE TRIGGER update_trainings_updated_at
  BEFORE UPDATE ON trainings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
