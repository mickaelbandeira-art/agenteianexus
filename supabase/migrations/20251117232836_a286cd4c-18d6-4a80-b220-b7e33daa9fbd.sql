-- Criar tabela chat_history
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Dados da conversa
  mensagem_usuario TEXT NOT NULL,
  resposta_nexus TEXT NOT NULL,
  agente_utilizado TEXT,
  contexto JSONB,
  
  -- Metadata
  satisfacao_usuario INTEGER CHECK (satisfacao_usuario >= 1 AND satisfacao_usuario <= 5),
  tempo_resposta_ms INTEGER,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins veem todo histórico"
  ON chat_history FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Gestores veem todo histórico"
  ON chat_history FOR SELECT
  USING (has_role(auth.uid(), 'gestor'));

CREATE POLICY "Usuários veem próprio histórico"
  ON chat_history FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Usuários podem inserir histórico"
  ON chat_history FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX idx_chat_history_created_at ON chat_history(created_at DESC);