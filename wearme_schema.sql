-- Create weame_configs table if not exists with long key default
CREATE TABLE IF NOT EXISTS public.wearme_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    api_key TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'), -- 64 chars long
    requests_count INTEGER DEFAULT 0,
    requests_limit INTEGER DEFAULT 50, -- Free tier limit
    subscription_status TEXT CHECK (subscription_status IN ('active', 'inactive', 'pending')) DEFAULT 'inactive',
    site_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(owner_id)
);

-- Enable RLS
ALTER TABLE public.wearme_configs ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wearme_configs' AND policyname = 'Users can view their own config') THEN
        CREATE POLICY "Users can view their own config" ON public.wearme_configs
            FOR SELECT TO authenticated USING (auth.uid() = owner_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wearme_configs' AND policyname = 'Users can update their own config') THEN
        CREATE POLICY "Users can update their own config" ON public.wearme_configs
            FOR UPDATE TO authenticated USING (auth.uid() = owner_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wearme_configs' AND policyname = 'Users can insert their own config') THEN
        CREATE POLICY "Users can insert their own config" ON public.wearme_configs
            FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
    END IF;
END $$;
