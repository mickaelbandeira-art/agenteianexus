-- Habilitar extensão pgvector para embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Criar tabela de embeddings para RAG
CREATE TABLE documents_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Conteúdo
  document_name TEXT NOT NULL,
  document_type TEXT CHECK (document_type IN ('faq', 'manual', 'policy', 'training', 'guide', 'other')),
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER,
  
  -- Embedding (768 dimensões para Gemini text-embedding-004)
  embedding vector(768),
  
  -- Metadados
  metadata JSONB DEFAULT '{}',
  source_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para busca vetorial
CREATE INDEX idx_documents_embeddings_client_id ON documents_embeddings(client_id);
CREATE INDEX idx_documents_embeddings_type ON documents_embeddings(document_type);

-- Índice IVFFlat para busca vetorial eficiente
-- Nota: Este índice será criado após inserir dados suficientes (>1000 rows recomendado)
-- CREATE INDEX idx_documents_embeddings_vector ON documents_embeddings 
-- USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Por enquanto, usar índice simples
CREATE INDEX idx_documents_embeddings_vector ON documents_embeddings 
USING hnsw (embedding vector_cosine_ops);

-- Habilitar RLS
ALTER TABLE documents_embeddings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Usuários veem embeddings do seu cliente"
  ON documents_embeddings FOR SELECT
  USING (
    client_id IN (
      SELECT client_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins veem todos os embeddings"
  ON documents_embeddings FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins/Gestores podem gerenciar embeddings"
  ON documents_embeddings FOR ALL
  USING (
    has_role(auth.uid(), 'admin')
    OR has_role(auth.uid(), 'gestor')
  );

-- Função para busca de similaridade
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  filter_client_id uuid
)
RETURNS TABLE (
  id uuid,
  document_name text,
  chunk_text text,
  chunk_index integer,
  similarity float,
  metadata jsonb
)
LANGUAGE sql STABLE
AS $$
  SELECT
    id,
    document_name,
    chunk_text,
    chunk_index,
    1 - (embedding <=> query_embedding) as similarity,
    metadata
  FROM documents_embeddings
  WHERE client_id = filter_client_id
    AND 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Trigger para updated_at
CREATE TRIGGER update_documents_embeddings_updated_at
  BEFORE UPDATE ON documents_embeddings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
