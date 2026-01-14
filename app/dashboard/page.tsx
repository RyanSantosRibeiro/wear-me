import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, Key, Code, AlertCircle, Lock } from "lucide-react"
import Link from "next/link"
import crypto from "crypto"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch WearMe Config
  let { data: config } = await supabase
    .from("wearme_configs")
    .select("*")
    .eq("owner_id", user.id)
    .single()

  // Auto-create from Dashboard (Application Layer)
  if (!config) {
    // Generate a secure 64-char hex key explicitly
    const newApiKey = crypto.randomBytes(32).toString('hex')

    const { data: newConfig, error } = await supabase
      .from("wearme_configs")
      .insert([
        {
          owner_id: user.id,
          api_key: newApiKey // Explicitly setting the key
        }
      ])
      .select()
      .single()

    if (newConfig) {
      config = newConfig
    } else if (error) {
      console.error("Error creating config:", error)
      // Fallback: If insert failed (maybe race condition), try fetching again
      const { data: retryConfig } = await supabase
        .from("wearme_configs")
        .select("*")
        .eq("owner_id", user.id)
        .single()
      config = retryConfig
    }
  }

  const usagePercent = config ? Math.min(100, Math.round((config.requests_count / config.requests_limit) * 100)) : 0
  const isPro = config?.subscription_status === 'active'

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-foreground">Visão Geral</h1>
        <p className="text-muted-foreground font-medium">Gerencie sua integração e acompanhe o uso do Provador Virtual.</p>
      </div>

      {/* Non-Pro Banner */}
      {!isPro && (
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <Lock size={140} />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-primary/20 rounded-xl text-primary shrink-0">
              <Lock size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground">Modo Gratuito Ativo</h3>
              <p className="text-sm text-muted-foreground font-medium">Você tem limites de requisição. Faça o upgrade para escalar sua operação.</p>
            </div>
          </div>
          <Link href="/dashboard/subscription" className="relative z-10 w-full md:w-auto">
            <Button size="lg" className="font-bold w-full md:w-auto shadow-lg shadow-primary/20">
              Ver Planos Premium
            </Button>
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Subscription Card */}
        <Card className={`relative overflow-hidden border-2 ${isPro ? 'border-primary/50 bg-primary/5' : 'border-dashed border-muted-foreground/20'}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              Plano Atual
              <Badge variant={isPro ? "default" : "secondary"} className="font-bold">
                {isPro ? 'PREMIUM' : 'GRATUITO'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <span className="text-2xl font-black">
                {isPro ? 'Assinatura Ativa' : 'Trial / Inativo'}
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-2">
              {isPro
                ? "Sua assinatura está ativa e operando normalmente."
                : "Faça o upgrade para remover limites de requisição."}
            </p>
          </CardContent>
          {!isPro && (
            <CardFooter>
              <Link href="/dashboard/subscription" className="w-full">
                <Button className="w-full font-bold" size="sm">
                  Fazer Upgrade Agora
                </Button>
              </Link>
            </CardFooter>
          )}
        </Card>

        {/* Usage Card */}
        <Card className="border-2 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Activity size={16} />
              Consumo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-black text-foreground">{config?.requests_count || 0}</span>
              <span className="text-sm font-bold text-muted-foreground/60 mb-1">/ {config?.requests_limit || 0} reqs</span>
            </div>

            {/* Custom Progress Bar */}
            <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${usagePercent}%` }}
              />
            </div>

            <div className="flex justify-between items-center mt-2">
              <p className="text-xs font-bold text-muted-foreground">
                {usagePercent}% utilizado
              </p>
              {usagePercent > 90 && (
                <span className="text-xs font-bold text-destructive flex items-center gap-1">
                  <AlertCircle size={10} /> Quase cheio
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* API Key Card */}
        <Card className="border-2 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Key size={16} />
              Credenciais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground">SUA API KEY</label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-xl border border-border text-xs font-mono break-all group relative hover:border-primary/50 transition-colors">
                <span className="truncate w-full select-all">{config?.api_key || "..."}</span>
              </div>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground leading-tight">
              Nunca compartilhe sua chave publica em locais inseguros.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Integration Guide */}
      <Card className="border-2 border-border/50 bg-card overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <Code className="w-5 h-5 text-primary" />
                Instalação Rápida
              </CardTitle>
              <CardDescription className="font-medium mt-1">
                Adicione o snippet abaixo no código da sua loja para ativar o provador.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-[#0f172a] text-blue-100 p-6 overflow-x-auto font-mono text-sm leading-relaxed">
            <pre>
              <code className="block">
                {`<!-- 1. Importe o SDK do Wearme -->
<script src="https://api.wearme.com/v1/widget.js"></script>

<!-- 2. Inicialize o Provador -->
<script>
  Wearme.init({
    // Sua chave de autenticação
    apiKey: '${config?.api_key || "SUA_CHAVE_AQUI"}',

    // Seletor da imagem do produto na página
    productImage: 'img.product-image',

    // Onde renderizar o botão
    createButton: {
      targetSelector: '.buy-button-container',
      label: 'Provador Virtual'
    }
  });
</script>`}
              </code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
