/*
  # Criar tabela de registros de associados

  1. Nova Tabela
    - `registrations`
      - `id` (uuid, primary key)
      - `cpf` (text, único, não nulo) - CPF do associado
      - `name` (text) - Nome completo
      - `email` (text) - Email
      - `phone` (text) - Telefone
      - `created_at` (timestamptz) - Data de criação
      - `updated_at` (timestamptz) - Data de atualização

  2. Segurança
    - Habilitar RLS na tabela `registrations`
    - Políticas apenas para leitura pública (verificação de CPF duplicado)

  3. Índices
    - Índice único no CPF para buscas rápidas e garantir unicidade
*/

CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cpf text UNIQUE NOT NULL,
  name text,
  email text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar índice para buscas rápidas por CPF
CREATE INDEX IF NOT EXISTS idx_registrations_cpf ON registrations(cpf);

-- Habilitar RLS
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Política para permitir SELECT público (para verificação de CPF duplicado)
CREATE POLICY "Permitir verificação pública de CPF"
  ON registrations
  FOR SELECT
  USING (true);

-- Política para permitir INSERT público (para registro de novos associados)
CREATE POLICY "Permitir registro público"
  ON registrations
  FOR INSERT
  WITH CHECK (true);