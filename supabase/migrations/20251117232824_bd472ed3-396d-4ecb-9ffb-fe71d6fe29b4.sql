-- Criar tabela desempenho_usuarios
CREATE TABLE desempenho_usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Métricas operacionais
  csat_score NUMERIC(3,2) CHECK (csat_score >= 0 AND csat_score <= 5),
  tmo_medio NUMERIC(5,2),
  taxa_reincidencia NUMERIC(5,2) CHECK (taxa_reincidencia >= 0 AND taxa_reincidencia <= 100),
  
  -- Skills
  skill_digitacao INTEGER CHECK (skill_digitacao >= 0 AND skill_digitacao <= 100),
  skill_portugues INTEGER CHECK (skill_portugues >= 0 AND skill_portugues <= 100),
  perfil_comportamental TEXT,
  
  -- Frequência
  total_faltas INTEGER DEFAULT 0,
  horas_treinamento NUMERIC(5,2) DEFAULT 0,
  
  -- Status
  status_formacao TEXT DEFAULT 'em_formacao',
  data_inicio_formacao TIMESTAMP WITH TIME ZONE,
  data_conclusao_formacao TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

ALTER TABLE desempenho_usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins veem todo desempenho"
  ON desempenho_usuarios FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Gestores veem todo desempenho"
  ON desempenho_usuarios FOR SELECT
  USING (has_role(auth.uid(), 'gestor'));

CREATE POLICY "Usuários veem próprio desempenho"
  ON desempenho_usuarios FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admin/Gestor podem atualizar desempenho"
  ON desempenho_usuarios FOR UPDATE
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'gestor'));

CREATE POLICY "Sistema pode inserir desempenho"
  ON desempenho_usuarios FOR INSERT
  WITH CHECK (true);

CREATE TRIGGER update_desempenho_updated_at
  BEFORE UPDATE ON desempenho_usuarios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Criar trigger para criar desempenho_usuarios automaticamente
CREATE OR REPLACE FUNCTION create_user_performance()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO desempenho_usuarios (user_id, status_formacao, data_inicio_formacao)
  VALUES (NEW.id, 'em_formacao', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_user_performance();