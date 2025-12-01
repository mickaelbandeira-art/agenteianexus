-- Criar tabela avaliacoes_instrutor
CREATE TABLE avaliacoes_instrutor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instrutor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Dados da aula
  titulo_aula TEXT NOT NULL,
  aula_video_url TEXT,
  aula_duracao_segundos INTEGER,
  transcricao TEXT,
  
  -- Avaliação da IA
  avaliacao_ia JSONB,
  pontuacao_geral NUMERIC(3,1) CHECK (pontuacao_geral >= 0 AND pontuacao_geral <= 10),
  pontuacao_clareza NUMERIC(3,1),
  pontuacao_didatica NUMERIC(3,1),
  pontuacao_engajamento NUMERIC(3,1),
  pontuacao_dominio NUMERIC(3,1),
  
  -- Feedback
  feedback_positivo TEXT,
  feedback_melhorias TEXT,
  recomendacoes TEXT,
  
  -- Metadata
  status TEXT DEFAULT 'processando',
  erro_mensagem TEXT,
  
  -- Timestamps
  data_gravacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE avaliacoes_instrutor ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins veem todas avaliações"
  ON avaliacoes_instrutor FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Gestores veem todas avaliações"
  ON avaliacoes_instrutor FOR SELECT
  USING (has_role(auth.uid(), 'gestor'));

CREATE POLICY "Instrutores veem próprias avaliações"
  ON avaliacoes_instrutor FOR SELECT
  USING (instrutor_id = auth.uid());

CREATE POLICY "Instrutores podem inserir avaliações"
  ON avaliacoes_instrutor FOR INSERT
  WITH CHECK (instrutor_id = auth.uid());

CREATE TRIGGER update_avaliacoes_updated_at
  BEFORE UPDATE ON avaliacoes_instrutor
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();