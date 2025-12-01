-- Adicionar campos de multi-tenancy às tabelas existentes

-- Atualizar tabela profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id),
ADD COLUMN IF NOT EXISTS empresa TEXT;

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_profiles_client_id ON profiles(client_id);

-- Atualizar tabela chat_history
ALTER TABLE chat_history
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id),
ADD COLUMN IF NOT EXISTS rag_sources JSONB DEFAULT '[]';

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_chat_history_client_id ON chat_history(client_id);

-- Atualizar RLS policies do chat_history para considerar cliente
DROP POLICY IF EXISTS "Usuários veem próprio histórico" ON chat_history;
CREATE POLICY "Usuários veem próprio histórico"
  ON chat_history FOR SELECT
  USING (user_id = auth.uid());

-- Função para inicializar gamificação ao criar perfil
CREATE OR REPLACE FUNCTION initialize_user_gamification()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o usuário tem client_id, criar registro de gamificação
  IF NEW.client_id IS NOT NULL THEN
    INSERT INTO user_achievements (user_id, client_id)
    VALUES (NEW.id, NEW.client_id)
    ON CONFLICT (user_id, client_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para inicializar gamificação
DROP TRIGGER IF EXISTS on_profile_client_assigned ON profiles;
CREATE TRIGGER on_profile_client_assigned
  AFTER INSERT OR UPDATE OF client_id ON profiles
  FOR EACH ROW
  WHEN (NEW.client_id IS NOT NULL)
  EXECUTE FUNCTION initialize_user_gamification();

-- Comentários para documentação
COMMENT ON COLUMN profiles.client_id IS 'Cliente ao qual o usuário está associado';
COMMENT ON COLUMN profiles.empresa IS 'Nome da empresa do usuário';
COMMENT ON COLUMN chat_history.client_id IS 'Cliente relacionado à conversa';
COMMENT ON COLUMN chat_history.rag_sources IS 'Documentos usados como fonte pelo RAG';
