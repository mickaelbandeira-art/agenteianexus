-- Criar tabela de conquistas/gamificação
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Pontuação e nível
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  experience_points INTEGER DEFAULT 0,
  
  -- Conquistas desbloqueadas (array de IDs)
  achievements JSONB DEFAULT '[]',
  badges JSONB DEFAULT '[]',
  
  -- Ranking
  rank_position INTEGER,
  
  -- Estatísticas
  trainings_completed INTEGER DEFAULT 0,
  perfect_scores INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, client_id)
);

-- Índices
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_client_id ON user_achievements(client_id);
CREATE INDEX idx_user_achievements_rank ON user_achievements(rank_position);
CREATE INDEX idx_user_achievements_points ON user_achievements(total_points DESC);

-- Habilitar RLS
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Usuários veem próprias conquistas"
  ON user_achievements FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Usuários veem ranking do cliente"
  ON user_achievements FOR SELECT
  USING (
    client_id IN (
      SELECT client_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Sistema pode atualizar conquistas"
  ON user_achievements FOR ALL
  USING (true);

CREATE POLICY "Admins/Gestores veem todas conquistas"
  ON user_achievements FOR SELECT
  USING (
    has_role(auth.uid(), 'admin')
    OR has_role(auth.uid(), 'gestor')
  );

-- Trigger para updated_at
CREATE TRIGGER update_user_achievements_updated_at
  BEFORE UPDATE ON user_achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para atualizar ranking
CREATE OR REPLACE FUNCTION update_rankings()
RETURNS void AS $$
BEGIN
  -- Atualizar ranking por cliente
  WITH ranked_users AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (PARTITION BY client_id ORDER BY total_points DESC, level DESC) as new_rank
    FROM user_achievements
  )
  UPDATE user_achievements ua
  SET rank_position = ru.new_rank
  FROM ranked_users ru
  WHERE ua.id = ru.id;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar ranking quando pontos mudam
CREATE OR REPLACE FUNCTION trigger_update_rankings()
RETURNS TRIGGER AS $$
BEGIN
  -- Agendar atualização de ranking (pode ser otimizado com job assíncrono)
  PERFORM update_rankings();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rankings_on_points_change
  AFTER INSERT OR UPDATE OF total_points ON user_achievements
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_rankings();
