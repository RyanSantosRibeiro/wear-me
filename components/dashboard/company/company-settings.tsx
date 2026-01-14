"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Building2, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface CompanySettingsProps {
  company: {
    id: string
    name: string
    slug: string
  }
}

export function CompanySettings({ company }: CompanySettingsProps) {
  const [name, setName] = useState(company.name)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Erro",
        description: "O nome da empresa não pode estar vazio",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Usuário não autenticado")
      }

      const { error } = await supabase
        .from("companies")
        .update({
          name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", company.id)
        .eq("owner_id", user.id) // 🔐 segurança extra

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Informações da empresa atualizadas",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar empresa",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Building2 className="h-6 w-6 text-primary" />
        </div>

        <div>
          <CardTitle>{company.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{company.slug}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Nome da empresa</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Slug</label>
          <Input value={company.slug} disabled />
          <p className="text-xs text-muted-foreground">
            O slug não pode ser alterado
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar alterações
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
