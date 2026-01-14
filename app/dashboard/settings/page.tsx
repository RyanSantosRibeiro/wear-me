import { createClient } from "@/lib/supabase/server"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "@/components/dashboard/profile-settings"
import { SecuritySettings } from "@/components/dashboard/security-settings"
import { redirect } from "next/navigation"
import { SubscriptionPanel } from "@/components/dashboard/settings/subscription"
import { PageHeader } from "@/components/PageHeader"
import { User, Shield, Zap, Settings } from "lucide-react"
import CopyButton from "./copyButton"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: subscription } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).single()

  // Fetch WearMe Config
  const { data: wearmeConfig } = await supabase
    .from("wearme_configs")
    .select("*")
    .eq("owner_id", user.id)
    .single()

  const plans = [];

  if (!subscription || subscription === null) {
    const { data: plansData } = await supabase.from("plans").select("*")
    if (plansData) {
      plans.push(...plansData)
    }
  }

  return (
    <div className="space-y-10 p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Configurações Pessoais"
        description="Gerencie seu perfil, preferências de segurança e faturamento."
      />

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100 h-auto gap-2">
          <TabsTrigger
            value="profile"
            className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary font-bold transition-all flex items-center gap-2"
          >
            <User size={16} />
            Meu Perfil
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary font-bold transition-all flex items-center gap-2"
          >
            <Shield size={16} />
            Segurança
          </TabsTrigger>
          <TabsTrigger
            value="wearme"
            className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary font-bold transition-all flex items-center gap-2"
          >
            <Settings size={16} />
            Integração WearMe
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900">Informações Pessoais</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Atualize como você é visto na plataforma</p>
            </div>
            <div className="p-8">
              <ProfileSettings profile={profile} userEmail={user.email || ""} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900">Segurança da Conta</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Gerencie sua senha e métodos de autenticação</p>
            </div>
            <div className="p-8">
              <SecuritySettings />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="wearme" className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900">Configurações da Integração</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Configure a URL do seu site e gerencie sua API Key</p>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">URL do Site</label>
                <input
                  type="url"
                  name="site_url"
                  defaultValue={wearmeConfig?.site_url || ""}
                  placeholder="https://minhaloja.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
                <p className="text-xs text-gray-500 mt-2">Esta URL será usada para validar requisições e evitar uso não autorizado da sua API Key.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">API Key</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={wearmeConfig?.api_key || "Carregando..."}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 font-mono text-sm"
                  />
                  <CopyButton
                    text={wearmeConfig?.api_key || ""}
                  />
                </div>
                <p className="text-xs text-amber-600 mt-2 font-semibold">⚠️ Não compartilhe sua API Key publicamente. Ela dá acesso total à sua integração.</p>
              </div>

              <div className="pt-4">
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                  Salvar Configurações
                </button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="pt-4 border-t border-gray-100">
      </div>
    </div>
  )
}
