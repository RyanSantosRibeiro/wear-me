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

-- Create logs table for usage tracking
CREATE TABLE IF NOT EXISTS public.wearme_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    config_id uuid NOT NULL,
    api_key text NOT NULL,
    session_id text, -- Added to identify the user session
    product_image_url text,
    result_image_url text,
    mode text,
    user_agent text,
    ip_address text,
    consent_data jsonb, -- Stores timestamp and acceptance flag for GDPR/LGPD
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    
    CONSTRAINT wearme_logs_pkey PRIMARY KEY (id),
    CONSTRAINT wearme_logs_config_id_fkey FOREIGN KEY (config_id) REFERENCES public.wearme_configs(id) ON DELETE CASCADE
);

-- Enable RLS for logs
ALTER TABLE public.wearme_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Owners can view logs linked to their configs
CREATE POLICY "Users can view logs of their configs" ON public.wearme_logs
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.wearme_configs
            WHERE wearme_configs.id = wearme_logs.config_id
            AND wearme_configs.owner_id = auth.uid()
        )
    );

-- Index for performance and Cache Lookup
CREATE INDEX IF NOT EXISTS idx_wearme_logs_config_id ON public.wearme_logs(config_id);
CREATE INDEX IF NOT EXISTS idx_wearme_logs_cache_lookup ON public.wearme_logs(api_key, product_image_url, session_id);

-- Create payment_logs table for tracking all payment events
CREATE TABLE IF NOT EXISTS public.payment_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    payment_id text NOT NULL, -- Mercado Pago payment ID
    payment_status text NOT NULL, -- approved, pending, rejected, etc
    amount numeric(10,2),
    currency text DEFAULT 'BRL',
    plan_id uuid REFERENCES public.plans(id),
    plan_name text,
    subscription_id uuid REFERENCES public.subscriptions(id),
    payment_method text,
    payer_email text,
    metadata jsonb, -- Full payment data from MP
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    
    CONSTRAINT payment_logs_pkey PRIMARY KEY (id)
);

-- Enable RLS for payment_logs
ALTER TABLE public.payment_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own payment logs
CREATE POLICY "Users can view their own payment logs" ON public.payment_logs
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_payment_logs_user_id ON public.payment_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_payment_id ON public.payment_logs(payment_id);
