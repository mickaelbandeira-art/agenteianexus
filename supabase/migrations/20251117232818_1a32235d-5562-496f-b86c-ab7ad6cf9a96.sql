-- Adicionar campo CPF à tabela profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS cpf TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_cpf ON profiles(cpf) WHERE cpf IS NOT NULL;