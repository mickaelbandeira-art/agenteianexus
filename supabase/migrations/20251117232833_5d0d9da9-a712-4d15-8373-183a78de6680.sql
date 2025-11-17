-- Criar tabela reciclagens
CREATE TABLE reciclagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Dados da reciclagem
  tipo_reciclagem TEXT NOT NULL,
  motivo TEXT NOT NULL,
  descricao TEXT,
  
  -- Status
  status TEXT DEFAULT 'pendente',
  prioridade TEXT DEFAULT 'media',
  
  -- Datas
  data_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_prevista_conclusao TIMESTAMP WITH TIME ZONE,
  data_conclusao TIMESTAMP WITH TIME ZONE,
  
  -- Resultado
  aprovado BOOLEAN,
  nota_final NUMERIC(3,1),
  observacoes TEXT,
  
  -- Metadata
  instrutor_responsavel UUID REFERENCES profiles(id),
  gestor_responsavel UUID REFERENCES profiles(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE reciclagens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins veem todas reciclagens"
  ON reciclagens FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Gestores veem todas reciclagens"
  ON reciclagens FOR SELECT
  USING (has_role(auth.uid(), 'gestor'));

CREATE POLICY "Instrutores veem reciclagens de alunos"
  ON reciclagens FOR SELECT
  USING (has_role(auth.uid(), 'instrutor'));

CREATE POLICY "Usuários veem próprias reciclagens"
  ON reciclagens FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Gestor/Instrutor podem criar reciclagens"
  ON reciclagens FOR INSERT
  WITH CHECK (
    has_role(auth.uid(), 'admin') OR 
    has_role(auth.uid(), 'gestor') OR 
    has_role(auth.uid(), 'instrutor')
  );

CREATE POLICY "Gestor/Instrutor podem atualizar reciclagens"
  ON reciclagens FOR UPDATE
  USING (
    has_role(auth.uid(), 'admin') OR 
    has_role(auth.uid(), 'gestor') OR 
    has_role(auth.uid(), 'instrutor')
  );

CREATE TRIGGER update_reciclagens_updated_at
  BEFORE UPDATE ON reciclagens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();