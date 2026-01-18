import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, Key, Code, AlertCircle, Lock, Zap } from "lucide-react"
import Link from "next/link"
import crypto from "crypto"
import { PageHeader } from "@/components/PageHeader"
import ScriptSection from "@/components/ui/script-section"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch WearMe Config
  let { data: config, error: configError } = await supabase
    .from("wearme_configs")
    .select("*, subscriptions(*, plans(*))")
    .eq("owner_id", user.id)
    .single()

  console.log({ config: config, configError })
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
    console.log({ newConfig })
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
  const isPro = config?.subscriptions?.status === 'active'
  const plan = config?.subscriptions?.plans
  const missingUrl = !!config?.site_url

  return (
    <div className="space-y-10 p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Visão Geral"
        description="Gerencie sua integração e acompanhe o uso do Provador Virtual."
      />

      {/* Non-Pro Banner */}
      {!isPro && (
        <div className="bg-gradient-to-br from-primary/5 via-white to-primary/10 border border-primary/20 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 p-8 opacity-[0.05] pointer-events-none rotate-12 transition-transform group-hover:scale-110">
            <Zap size={240} className="text-primary" />
          </div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary/10 text-primary shrink-0">
              <Lock size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900">Modo Gratuito Ativo</h3>
              <p className="text-gray-500 font-medium max-w-md mt-1">Você tem limites de requisição mensais. Faça o upgrade para remover todas as barreiras do seu e-commerce.</p>
            </div>
          </div>
          <Link href="/dashboard/subscription" className="relative z-10 w-full md:w-auto">
            <Button size="lg" className="font-bold w-full md:w-auto px-10 h-14 rounded-2xl shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Ver Planos Premium
            </Button>
          </Link>
        </div>
      )}
      {!missingUrl && (
        <div className="bg-gradient-to-br from-primary/5 via-white to-primary/10 border border-primary/20 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 p-8 opacity-[0.05] pointer-events-none rotate-12 transition-transform group-hover:scale-110">
            <Zap size={240} className="text-primary" />
          </div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary/10 text-primary shrink-0">
              <Lock size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900">URL do seu site não configurada</h3>
              <p className="text-gray-500 font-medium max-w-md mt-1">Configure a URL do seu site para que possamos proteger o seu widget.</p>
            </div>
          </div>
          <Link href="/dashboard/settings" className="relative z-10 w-full md:w-auto">
            <Button size="lg" className="font-bold w-full md:w-auto px-10 h-14 rounded-2xl shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Configurar URL
            </Button>
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Subscription Card */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-900">Plano Atual</h3>
            <Badge variant={isPro ? "default" : "secondary"} className="rounded-full px-4 py-1 font-black tracking-widest text-[10px]">
              {isPro ? plan?.name?.toUpperCase() || 'PREMIUM' : 'GRATUITO'}
            </Badge>
          </div>
          <div className="p-8 flex-1">
            <div className="mb-4">
              <span className="text-2xl font-black text-gray-900 leading-none">
                {isPro ? 'Assinatura Ativa' : 'Acesso Limitado'}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500 leading-relaxed mb-8">
              {isPro
                ? "Sua assinatura está ativa e operando normalmente com todos os recursos liberados."
                : "Seu plano atual possui limites de requisições. O upgrade libera uso ilimitado."}
            </p>
          </div>
          <div className="p-6 pt-0 mt-auto">
            <Link href="/dashboard/subscription" className="w-full">
              <Button variant={isPro ? "outline" : "primary"} className="w-full font-black rounded-2xl h-12" size="sm">
                {isPro ? 'Gerenciar Assinatura' : 'Fazer Upgrade Agora'}
              </Button>
            </Link>
          </div>
        </div>

        {/* Usage Card */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-900">Uso de API</h3>
            <Activity size={18} className="text-primary" />
          </div>
          <div className="p-8 flex-1">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-black text-gray-900 tracking-tighter">{config?.requests_count || 0}</span>
              <span className="text-sm font-black text-gray-400 uppercase tracking-widest">/ {config?.requests_limit || 0} reqs</span>
            </div>

            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden p-1">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${usagePercent > 80 ? 'bg-orange-400' : 'bg-primary'}`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                <span className="text-gray-400">{usagePercent}% utilizado</span>
                {usagePercent > 90 && (
                  <span className="text-orange-500 flex items-center gap-1">
                    <AlertCircle size={12} /> Limite próximo
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* API Key Card */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-900">Credenciais</h3>
            <Key size={18} className="text-primary" />
          </div>
          <div className="p-8 flex-1 space-y-4 text-center">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Sua API Key Exclusive</p>
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs font-mono break-all font-bold text-gray-600 hover:border-primary/30 transition-colors">
              <span className="truncate w-full select-all">{config?.api_key || "..."}</span>
            </div>
            <p className="text-[10px] font-bold text-gray-400 leading-tight">
              A chave secreta deve ser mantida em sigilo absoluto para a segurança da sua integração.
            </p>
          </div>
        </div>
      </div>

      {/* Integration Guide */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden shadow-primary/5">
        <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl text-white">
                <Code size={20} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Snippet de Instalação</h3>
            </div>
            <p className="text-gray-500 font-semibold mt-2">Copie e cole este código antes da tag &lt;/body&gt; da sua loja.</p>
          </div>
          <Badge variant="outline" className="w-fit h-fit rounded-full px-4 py-1.5 border-primary/20 text-primary font-black uppercase tracking-widest text-[10px]">
            Ready to deploy
          </Badge>
        </div>
        <div className="p-0">
          <ScriptSection />
        </div>
      </div>
    </div>
  )
}
