-- Adicionar novos valores ao enum app_role
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'gestor';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'instrutor';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'veterano';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'novato';