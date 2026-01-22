-- Adicionar coluna de categoria na tabela de marcas
-- Default 'shoes' para manter compatibilidade com dados existentes

ALTER TABLE brands 
ADD COLUMN category VARCHAR(20) DEFAULT 'shoes';

-- Comentário:
-- category pode ser 'shoes' ou 'clothes'
