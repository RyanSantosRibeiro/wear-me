"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Loader2, Copy } from "lucide-react"

interface IntegrationSettingsProps {
    initialConfig: {
        site_url: string | null
        api_key: string | null
        owner_id: string
    }
}

export function IntegrationSettings({ initialConfig }: IntegrationSettingsProps) {
    const [siteUrl, setSiteUrl] = useState(initialConfig.site_url || "")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSave = async () => {
        setIsLoading(true)
        const supabase = createClient()

        try {
            const { error } = await supabase
                .from("wearme_configs")
                .update({ site_url: siteUrl })
                .eq("owner_id", initialConfig.owner_id)

            if (error) throw error

            toast({
                title: "Sucesso",
                description: "Configurações de integração salvas com sucesso!",
            })

            router.refresh()
        } catch (error: any) {
            console.error(error)
            toast({
                title: "Erro",
                description: error.message || "Erro ao salvar configurações",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast({
            title: "Copiado!",
            description: "API Key copiada para a área de transferência.",
        })
    }

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">URL do Site</label>
                <input
                    type="url"
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
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
                        value={initialConfig.api_key || "Carregando..."}
                        readOnly
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 font-mono text-sm text-gray-500"
                    />
                    <button
                        onClick={() => copyToClipboard(initialConfig.api_key || "")}
                        className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
                    >
                        <Copy size={16} />
                        Copiar
                    </button>
                </div>
                <p className="text-xs text-amber-600 mt-2 font-semibold">⚠️ Não compartilhe sua API Key publicamente. Ela dá acesso total à sua integração.</p>
            </div>

            <div className="pt-4">
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-70"
                >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Salvar Configurações
                </button>
            </div>
        </div>
    )
}
