import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, Key, Code, AlertCircle, Lock, Zap, Ruler, ArrowRight, Lightbulb, Layers, ImageIcon, ExternalLink, User } from "lucide-react"
import Link from "next/link"
import crypto from "crypto"
import { PageHeader } from "@/components/PageHeader"
import ScriptSection from "@/components/ui/wearme-script-section"
import { RequestsChart } from "@/components/dashboard/RequestsChart"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

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

  // Fetch logs for the current user's configs (more for the chart)
  const { data: logs } = await supabase
    .from("wearme_logs")
    .select(`*`)
    .eq("config_id", config?.id)
    .order("created_at", { ascending: false })
    .limit(50)

  // Fetch size charts cowunt (brands created by user)
  const { count: sizeChartsCount } = await supabase
    .from("brands")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", user.id)

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
              <h3 className="text-2xl font-black text-gray-900">Você está no plano gratuito</h3>
              <p className="text-gray-500 font-medium max-w-md mt-1">Você tem limites de requisição. Faça o upgrade para remover todas as barreiras do seu e-commerce.</p>
            </div>
          </div>
          <Link href="/dashboard/subscription" className="relative z-10 w-full md:w-auto">
            <Button size="lg" className="font-bold w-full md:w-auto px-10 h-14 rounded-2xl shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Ver Planos Premium
            </Button>
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-8 lg:grid-cols-4">
        {/* Subscription Card */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">Plano</h3>
            <Badge variant={isPro ? "default" : "secondary"} className="rounded-full px-4 py-1 font-black tracking-widest text-[9px]">
              {isPro ? plan?.name?.toUpperCase() || 'PREMIUM' : 'GRATUITO'}
            </Badge>
          </div>
          <div className="p-8 flex-1">
            <div className="mb-2">
              <span className="text-2xl font-black text-gray-900 leading-none">
                {isPro ? 'Ativo' : 'Limitado'}
              </span>
            </div>
            <p className="text-[10px] font-bold text-gray-400 leading-tight uppercase tracking-wide">
              {isPro ? "Todos os recursos liberados" : "Limite de reqs ativo"}
            </p>
          </div>
          <div className="p-6 pt-0 mt-auto">
            <Link href="/dashboard/subscription" className="w-full">
              <Button variant="ghost" className="w-full font-black rounded-xl h-10 text-xs border border-gray-100" size="sm">
                Gerenciar
              </Button>
            </Link>
          </div>
        </div>

        {/* Usage Card */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">Uso de API</h3>
            <Activity size={14} className="text-primary" />
          </div>
          <div className="p-8 flex-1">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-black text-gray-900 tracking-tighter">{config?.requests_count || 0}</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">/ {config?.requests_limit || 0}</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${usagePercent > 80 ? 'bg-orange-400' : 'bg-primary'}`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Size Charts Card */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">Tabelas</h3>
            <Ruler size={14} className="text-primary" />
          </div>
          <div className="p-8 flex-1">
            <div className="mb-2">
              <span className="text-4xl font-black text-gray-900 tracking-tighter">{sizeChartsCount || 0}</span>
            </div>
            <p className="text-[10px] font-bold text-gray-400 leading-tight uppercase tracking-wide">
              Tabelas de medidas criadas
            </p>
          </div>
          <div className="p-6 pt-0 mt-auto">
            <Link href="/dashboard/tabela-de-medidas" className="w-full">
              <Button variant="ghost" className="w-full font-black rounded-xl h-10 text-xs border border-gray-100" size="sm">
                Ver Tabelas
              </Button>
            </Link>
          </div>
        </div>

        {/* API Key Card */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">Integração</h3>
            <Key size={14} className="text-primary" />
          </div>
          <div className="p-8 flex-1 space-y-4">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-[10px] font-mono break-all font-bold text-gray-500 text-center">
              {config?.api_key ? `••••${config.api_key.slice(-8)}` : "..."}
            </div>
            <p className="text-[9px] font-bold text-gray-400 leading-tight text-center uppercase tracking-tight">
              Chave de API protegida
            </p>
          </div>
          <div className="p-6 pt-0 mt-auto">
            <Link href="/dashboard/settings" className="w-full">
              <Button variant="ghost" className="w-full font-black rounded-xl h-10 text-xs border border-gray-100" size="sm">
                Configurações
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Timeline Chart */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-900">Histórico de Requisições</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Atividade dos últimos 7 dias</p>
            </div>
            <Badge variant="outline" className="rounded-full px-3 py-1 border-emerald-100 text-emerald-600 bg-emerald-50/50 font-black uppercase tracking-widest text-[9px]">
              Realtime Data
            </Badge>
          </div>
          <div className="p-8 pr-12">
            <RequestsChart logs={logs || []} />
          </div>
        </div>

        {/* Resumo e Direcionamento */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col bg-linear-to-b from-white to-gray-50/50">
          <div className="p-8 border-b border-gray-50 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Lightbulb size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Próximos Passos</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Insights estratégicos</p>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="group cursor-pointer">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">1</div>
                <div>
                  <h4 className="font-black text-gray-900 text-sm mb-1">Confere suas tabelas?</h4>
                  <p className="text-xs font-semibold text-gray-500 leading-relaxed">Você tem {sizeChartsCount || 0} tabelas criadas. Quanta mais precisão no cadastro, maior a conversão.</p>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">2</div>
                <div>
                  <h4 className="font-black text-gray-900 text-sm mb-1">Otimize suas Imagens</h4>
                  <p className="text-xs font-semibold text-gray-500 leading-relaxed">O Provador Virtual performa melhor com fotos em fundo neutro e boa iluminação.</p>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-black text-xs shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors">3</div>
                <div>
                  <h4 className="font-black text-gray-900 text-sm mb-1">Acompanhe seu Limite</h4>
                  <p className="text-xs font-semibold text-gray-500 leading-relaxed">Você está com {usagePercent}% de uso. Evite pausas no serviço antecipando sua renovação.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 mt-auto">
            <Link href="/dashboard/tabela-de-medidas">
              <Button className="w-full gap-2 font-black rounded-2xl h-12 shadow-xl shadow-primary/10">
                Criar Nova Tabela <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-gray-900">Logs de Requisições</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Atividade dos últimos 7 dias</p>
          </div>
          <Link href="/dashboard/logs">
            <Badge variant="outline" className="rounded-full px-3 py-1 border-emerald-100 text-emerald-600 bg-emerald-50/50 font-black uppercase tracking-widest text-[9px]">
              Ver todos
            </Badge>
          </Link>
        </div>
        <Table>
          <TableHeader className="bg-gray-50/30">
            <TableRow className="hover:bg-transparent border-gray-50">
              <TableHead className="w-[180px] font-bold text-gray-400 uppercase text-[10px] tracking-widest">Data / Hora</TableHead>
              <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Sessão</TableHead>
              <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Produto</TableHead>
              <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Resultado</TableHead>
              <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-widest text-right">Modo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs && logs.length > 0 ? (
              logs.slice(0, 5).map((log) => (
                <TableRow key={log.id} className="hover:bg-gray-50/50 transition-colors border-gray-50">
                  <TableCell className="font-medium text-gray-600 text-sm">
                    {format(new Date(log.created_at), "dd MMM, HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <User size={14} />
                      </div>
                      <span className="text-xs font-mono text-gray-400 truncate w-24">
                        {log.session_id || 'N/A'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0 shadow-sm relative group">
                        <img src={log.product_image_url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Product" />
                        <a
                          href={log.product_image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <ExternalLink size={14} className="text-white" />
                        </a>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Produto</span>
                        <span className="text-[10px] text-gray-400 font-mono truncate w-20">Ref: {log.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {log.result_image_url ? (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 rounded-lg overflow-hidden border border-emerald-100 bg-emerald-50 flex-shrink-0 shadow-sm relative group">
                          <img src={log.result_image_url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Result" />
                          <a
                            href={log.result_image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          >
                            <ExternalLink size={14} className="text-white" />
                          </a>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-emerald-600 uppercase tracking-tighter">Gerado</span>
                          <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200 h-4 text-[9px] w-fit px-1 shadow-none">IA Active</Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-300">
                        <ImageIcon size={16} />
                        <span className="italic text-xs font-medium">Pendente</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="bg-gray-100 text-gray-500 hover:bg-gray-200 border-none rounded-lg font-bold text-[10px] uppercase">
                      {log.mode || 'Front'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                    <Layers size={48} className="opacity-10" />
                    <p className="font-bold">Nenhum log encontrado</p>
                    <p className="text-xs">As atividades dos seus usuários aparecerão aqui.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
