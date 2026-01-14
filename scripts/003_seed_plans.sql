-- Insert default plans
INSERT INTO public.plans (name, description, price, currency, recurrence, metadata, is_active) VALUES
  (
    'Básico',
    'Plano ideal para pequenas equipes começando',
    29.90,
    'BRL',
    'monthly',
    '{"max_users": 5, "features": ["dashboard", "basic_reports", "email_support"]}',
    true
  ),
  (
    'Pro',
    'Plano profissional com recursos avançados',
    79.90,
    'BRL',
    'monthly',
    '{"max_users": 20, "features": ["dashboard", "advanced_reports", "priority_support", "api_access"]}',
    true
  ),
  (
    'Enterprise',
    'Plano empresarial com recursos ilimitados',
    199.90,
    'BRL',
    'monthly',
    '{"max_users": -1, "features": ["dashboard", "advanced_reports", "24_7_support", "api_access", "custom_integrations", "dedicated_manager"]}',
    true
  )
ON CONFLICT DO NOTHING;
