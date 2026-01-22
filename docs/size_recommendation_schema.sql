-- Create brands table
CREATE TABLE IF NOT EXISTS public.brands (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    width_score INTEGER NOT NULL CHECK (width_score BETWEEN 1 AND 5),
    observation TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- For private brands (optional)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for brands
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Allow read access to all for brands (needed for the widget)
CREATE POLICY "Allow public read access for brands" ON public.brands
    FOR SELECT USING (true);

-- Allow owners to manage their own brands
CREATE POLICY "Owners can manage their own brands" ON public.brands
    FOR ALL USING (auth.uid() = owner_id);

-- Create size_charts table
CREATE TABLE IF NOT EXISTS public.size_charts (
    id SERIAL PRIMARY KEY,
    brand_id INTEGER NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    size_br NUMERIC NOT NULL,
    measure_cm NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(brand_id, size_br) -- Prevent duplicate sizes for same brand
);

-- RLS for size_charts
ALTER TABLE public.size_charts ENABLE ROW LEVEL SECURITY;

-- Allow read access to all for size_charts
CREATE POLICY "Allow public read access for size_charts" ON public.size_charts
    FOR SELECT USING (true);

-- Allow owners to manage their own size_charts (via brand ownership)
CREATE POLICY "Owners can manage size_charts of their brands" ON public.size_charts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.brands
            WHERE brands.id = size_charts.brand_id
            AND brands.owner_id = auth.uid()
        )
    );

-- Seed some initial data (Optional but helpful)
-- Nike (Score 2), Adidas (3), Vans (4), All Star (5)
INSERT INTO public.brands (name, width_score, observation) VALUES
('Nike', 2, 'Fôrma estreita/performance'),
('Adidas', 3, 'Fôrma padrão/regular'),
('Vans', 4, 'Fôrma larga/conforto'),
('All Star', 5, 'Fôrma muito larga')
ON CONFLICT DO NOTHING;

-- Seed size charts (Example data from doc)
-- Nike
INSERT INTO public.size_charts (brand_id, size_br, measure_cm) VALUES
((SELECT id FROM public.brands WHERE name = 'Nike'), 35.5, 21.6),
((SELECT id FROM public.brands WHERE name = 'Nike'), 36, 22.0),
((SELECT id FROM public.brands WHERE name = 'Nike'), 36.5, 22.4),
((SELECT id FROM public.brands WHERE name = 'Nike'), 37.5, 22.9),
((SELECT id FROM public.brands WHERE name = 'Nike'), 38, 23.3),
((SELECT id FROM public.brands WHERE name = 'Nike'), 38.5, 23.7),
((SELECT id FROM public.brands WHERE name = 'Nike'), 39, 24.1),
((SELECT id FROM public.brands WHERE name = 'Nike'), 40, 24.5),
((SELECT id FROM public.brands WHERE name = 'Nike'), 40.5, 25.0),
((SELECT id FROM public.brands WHERE name = 'Nike'), 41, 25.4),
((SELECT id FROM public.brands WHERE name = 'Nike'), 42, 25.8),
((SELECT id FROM public.brands WHERE name = 'Nike'), 42.5, 26.2),
((SELECT id FROM public.brands WHERE name = 'Nike'), 43, 26.7),
((SELECT id FROM public.brands WHERE name = 'Nike'), 44, 27.1),
((SELECT id FROM public.brands WHERE name = 'Nike'), 44.5, 27.5),
((SELECT id FROM public.brands WHERE name = 'Nike'), 45, 27.9),
((SELECT id FROM public.brands WHERE name = 'Nike'), 45.5, 28.3),
((SELECT id FROM public.brands WHERE name = 'Nike'), 46, 28.8),
((SELECT id FROM public.brands WHERE name = 'Nike'), 47, 29.2),
((SELECT id FROM public.brands WHERE name = 'Nike'), 47.5, 29.6),
((SELECT id FROM public.brands WHERE name = 'Nike'), 48, 30.0),
((SELECT id FROM public.brands WHERE name = 'Nike'), 48.5, 30.5),
((SELECT id FROM public.brands WHERE name = 'Nike'), 49, 30.9),
((SELECT id FROM public.brands WHERE name = 'Nike'), 49.5, 31.3),
((SELECT id FROM public.brands WHERE name = 'Nike'), 50, 31.7),
((SELECT id FROM public.brands WHERE name = 'Nike'), 50.5, 32.2),
((SELECT id FROM public.brands WHERE name = 'Nike'), 51, 32.6),
((SELECT id FROM public.brands WHERE name = 'Nike'), 51.5, 33.0),
((SELECT id FROM public.brands WHERE name = 'Nike'), 52, 33.4),
((SELECT id FROM public.brands WHERE name = 'Nike'), 52.5, 33.9),
((SELECT id FROM public.brands WHERE name = 'Nike'), 53, 34.3),
((SELECT id FROM public.brands WHERE name = 'Nike'), 53.5, 34.7),
((SELECT id FROM public.brands WHERE name = 'Nike'), 54, 35.1),
((SELECT id FROM public.brands WHERE name = 'Nike'), 54.5, 35.5),
((SELECT id FROM public.brands WHERE name = 'Nike'), 55, 36.0),
((SELECT id FROM public.brands WHERE name = 'Nike'), 55.5, 36.4),
((SELECT id FROM public.brands WHERE name = 'Nike'), 56, 36.8),
((SELECT id FROM public.brands WHERE name = 'Nike'), 56.5, 37.2)
ON CONFLICT DO NOTHING;

-- Vans
INSERT INTO public.size_charts (brand_id, size_br, measure_cm) VALUES
((SELECT id FROM public.brands WHERE name = 'Vans'), 34, 21.5),
((SELECT id FROM public.brands WHERE name = 'Vans'), 35, 22.0),
((SELECT id FROM public.brands WHERE name = 'Vans'), 36, 22.5),
((SELECT id FROM public.brands WHERE name = 'Vans'), 37, 23.5),
((SELECT id FROM public.brands WHERE name = 'Vans'), 38, 24.5),
((SELECT id FROM public.brands WHERE name = 'Vans'), 39, 25.5),
((SELECT id FROM public.brands WHERE name = 'Vans'), 40, 26.0),
((SELECT id FROM public.brands WHERE name = 'Vans'), 41, 27.0),
((SELECT id FROM public.brands WHERE name = 'Vans'), 42, 28.0),
((SELECT id FROM public.brands WHERE name = 'Vans'), 43, 29.0)
ON CONFLICT DO NOTHING;

INSERT INTO public.size_charts (brand_id, size_br, measure_cm) VALUES
((SELECT id FROM public.brands WHERE name = 'Adidas'), 33, 21.6),
((SELECT id FROM public.brands WHERE name = 'Adidas'), 34, 22.5),
((SELECT id FROM public.brands WHERE name = 'Adidas'), 35, 22.9),
((SELECT id FROM public.brands WHERE name = 'Adidas'), 36, 23.8),
((SELECT id FROM public.brands WHERE name = 'Adidas'), 37, 24.2),
((SELECT id FROM public.brands WHERE name = 'Adidas'), 38, 24.6),
((SELECT id FROM public.brands WHERE name = 'Adidas'), 39, 25.0),
((SELECT id FROM public.brands WHERE name = 'Adidas'), 40, 25.9),
((SELECT id FROM public.brands WHERE name = 'Adidas'), 41, 26.7),
((SELECT id FROM public.brands WHERE name = 'Adidas'), 42, 27.1),
((SELECT id FROM public.brands WHERE name = 'Adidas'), 43, 28.0),
((SELECT id FROM public.brands WHERE name = 'Adidas'), 44, 28.8),
((SELECT id FROM public.brands WHERE name = 'Adidas'), 45, 29.3),
((SELECT id FROM public.brands WHERE name = 'Adidas'), 46, 30.1),
((SELECT id FROM public.brands WHERE name = 'Adidas'), 47, 31.0),
((SELECT id FROM public.brands WHERE name = 'Adidas'), 48, 32.3)
ON CONFLICT DO NOTHING;


INSERT INTO public.size_charts (brand_id, size_br, measure_cm) VALUES
((SELECT id FROM public.brands WHERE name = 'All Star'), 35, 24.5),
((SELECT id FROM public.brands WHERE name = 'All Star'), 36, 25.0),
((SELECT id FROM public.brands WHERE name = 'All Star'), 37, 26.0),
((SELECT id FROM public.brands WHERE name = 'All Star'), 38, 27.0),
((SELECT id FROM public.brands WHERE name = 'All Star'), 39, 27.5),
((SELECT id FROM public.brands WHERE name = 'All Star'), 40, 28.0),
((SELECT id FROM public.brands WHERE name = 'All Star'), 41, 29.0),
((SELECT id FROM public.brands WHERE name = 'All Star'), 42, 29.5),
((SELECT id FROM public.brands WHERE name = 'All Star'), 43, 30.0),
((SELECT id FROM public.brands WHERE name = 'All Star'), 44, 30.5)
ON CONFLICT DO NOTHING;
