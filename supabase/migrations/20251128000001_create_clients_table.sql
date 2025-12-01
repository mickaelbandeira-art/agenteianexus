-- Criar tabela de clientes (multi-tenancy)
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  
  -- Configuração visual
  theme_config JSONB DEFAULT '{
    "primaryColor": "#000000",
    "secondaryColor": "#ffffff",
    "accentColor": "#0066ff"
  }',
  
  -- Configuração IA
  ai_config JSONB DEFAULT '{
    "model": "gemini-1.5-pro",
    "temperature": 0.7,
    "contextWindow": 32000
  }',
  
  -- Metadados
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Policies para clients
CREATE POLICY "Todos podem ver clientes ativos"
  ON clients FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins podem gerenciar clientes"
  ON clients FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Trigger para updated_at
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Inserir clientes iniciais
INSERT INTO clients (name, slug, logo_url, theme_config) VALUES
  (
    'Claro',
    'claro',
    '/logos/claro.svg',
    '{
      "primaryColor": "#E30613",
      "secondaryColor": "#000000",
      "accentColor": "#FF4444",
      "gradientFrom": "#E30613",
      "gradientTo": "#8B0000"
    }'
  ),
  (
    'iFood',
    'ifood',
    '/logos/ifood.svg',
    '{
      "primaryColor": "#EA1D2C",
      "secondaryColor": "#FFE500",
      "accentColor": "#FF3344",
      "gradientFrom": "#EA1D2C",
      "gradientTo": "#FFE500"
    }'
  ),
  (
    'iFood Pago',
    'ifood-pago',
    '/logos/ifood-pago.svg',
    '{
      "primaryColor": "#7C3AED",
      "secondaryColor": "#EA1D2C",
      "accentColor": "#A855F7",
      "gradientFrom": "#7C3AED",
      "gradientTo": "#EA1D2C"
    }'
  ),
  (
    'TON',
    'ton',
    '/logos/ton.svg',
    '{
      "primaryColor": "#00D959",
      "secondaryColor": "#000000",
      "accentColor": "#00FF6E",
      "gradientFrom": "#00D959",
      "gradientTo": "#00A847"
    }'
  ),
  (
    'Inter',
    'inter',
    '/logos/inter.svg',
    '{
      "primaryColor": "#FF7A00",
      "secondaryColor": "#000000",
      "accentColor": "#FF9933",
      "gradientFrom": "#FF7A00",
      "gradientTo": "#CC6200"
    }'
  );
