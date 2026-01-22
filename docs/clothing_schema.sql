-- Tabela original de calçados (Referência)
-- CREATE TABLE size_charts (
--     id SERIAL PRIMARY KEY,
--     brand_id INTEGER NOT NULL,
--     size_br INTEGER NOT NULL, -- Ex: 39, 40, 41
--     measure_cm DECIMAL(5,2) NOT NULL -- Ex: 26.5
-- );

-- Nova Tabela para Roupas (Camisetas/Tops)
CREATE TABLE size_charts_clothes (
    id SERIAL PRIMARY KEY,
    brand_id INTEGER NOT NULL,
    
    -- Tamanho Brasileiro (Letras ou Números)
    -- Ex: 'P', 'M', 'G', 'GG' ou '38', '40'
    size_br VARCHAR(10) NOT NULL, 
    
    -- Medidas corporais (Ranges são comuns para roupas)
    chest_min_cm DECIMAL(5,2), -- Tórax Mínimo
    chest_max_cm DECIMAL(5,2), -- Tórax Máximo
    
    length_cm DECIMAL(5,2),    -- Comprimento da peça
    
    -- Metadados opcionais para fit
    fit_type VARCHAR(20) DEFAULT 'regular', -- 'slim', 'regular', 'oversized'
    gender VARCHAR(20) DEFAULT 'unisex',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exemplo de Insert para Nike (Mock)
-- INSERT INTO size_charts_clothes (brand_id, size_br, chest_min_cm, chest_max_cm, length_cm)
-- VALUES 
-- (2, 'P', 88.0, 95.0, 70.0),
-- (2, 'M', 96.0, 103.0, 72.0),
-- (2, 'G', 104.0, 111.0, 74.0);
