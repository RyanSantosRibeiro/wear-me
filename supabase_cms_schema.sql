
-- Create pages table
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(project_id, slug)
);

-- Create page_versions table
CREATE TABLE IF NOT EXISTS public.page_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')) DEFAULT 'DRAFT',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create section_definitions table
-- These are the "types" of sections available (e.g., 'Hero', 'Features', 'Testimonials')
CREATE TABLE IF NOT EXISTS public.section_definitions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE, -- Optional: if NULL, it's a global section type
    name TEXT NOT NULL,
    description TEXT,
    schema JSONB NOT NULL DEFAULT '{}'::jsonb, -- dynamic form schema
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create page_sections table
-- Instances of sections on a specific page version
CREATE TABLE IF NOT EXISTS public.page_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    version_id UUID NOT NULL REFERENCES public.page_versions(id) ON DELETE CASCADE,
    section_definition_id UUID NOT NULL REFERENCES public.section_definitions(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL DEFAULT 0,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

-- Create policies (Simplistic policies - adjust based on your actual auth needs)
-- Assuming authenticated users can read everything, and project owners/members can edit.
-- For now, allowing all authenticated access to simplify dev (users are filtered by app logic usually)

-- PAGES
CREATE POLICY "Allow authenticated read pages" ON public.pages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert pages" ON public.pages FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update pages" ON public.pages FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete pages" ON public.pages FOR DELETE TO authenticated USING (true);

-- PAGE VERSIONS
CREATE POLICY "Allow authenticated read page_versions" ON public.page_versions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert page_versions" ON public.page_versions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update page_versions" ON public.page_versions FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete page_versions" ON public.page_versions FOR DELETE TO authenticated USING (true);

-- SECTION DEFINITIONS
CREATE POLICY "Allow authenticated read section_definitions" ON public.section_definitions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert section_definitions" ON public.section_definitions FOR INSERT TO authenticated WITH CHECK (true);

-- PAGE SECTIONS
CREATE POLICY "Allow authenticated read page_sections" ON public.page_sections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert page_sections" ON public.page_sections FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update page_sections" ON public.page_sections FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete page_sections" ON public.page_sections FOR DELETE TO authenticated USING (true);

-- Insert some default Section Definitions to get started
INSERT INTO public.section_definitions (name, description, schema) VALUES 
(
    'Hero Section', 
    'A big banner with title, subtitle, and CTA',
    '{
        "type": "object",
        "required": ["title", "subtitle"],
        "properties": {
            "title": { "type": "string", "description": "Main Headline" },
            "subtitle": { "type": "string", "description": "Supporting text" },
            "ctaText": { "type": "string", "description": "Button Label" },
            "ctaLink": { "type": "string", "description": "Button URL" },
            "backgroundImage": { "type": "string", "description": "Image URL" }
        }
    }'::jsonb
),
(
    'Features Grid', 
    'List of key features with icons',
    '{
        "type": "object",
        "properties": {
            "headline": { "type": "string", "description": "Section Title" },
            "features": { 
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "title": { "type": "string" },
                        "description": { "type": "string" },
                        "icon": { "type": "string", "description": "Icon name (e.g. Star, User)" }
                    }
                }
            }
        }
    }'::jsonb
),
(
    'Rich Text', 
    'Simple text block',
    '{
        "type": "object",
        "properties": {
            "content": { "type": "string", "description": "Markdown or HTML content" }
        }
    }'::jsonb
);
