"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import type { Profile } from "@/lib/types"

interface ProfileSettingsProps {
  profile: Profile | null
  userEmail: string
}

export function ProfileSettings({ profile, userEmail }: ProfileSettingsProps) {
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const initials =
    fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"

  const handleSave = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      const { error } = await supabase.from("profiles").upsert({ id: user.id, full_name: fullName })

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Suas informações foram atualizadas",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar perfil",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile?.avatar_url || undefined} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <Button variant="outline" size="sm">
            Alterar Foto
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">JPG, GIF ou PNG. Máx 1MB.</p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Nome Completo</Label>
          <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={userEmail} disabled />
          <p className="text-xs text-muted-foreground">Seu email não pode ser alterado</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="role">Função</Label>
          <Input id="role" value={profile?.role || "member"} disabled />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar Alterações
        </Button>
      </div>
    </div>
  )
}
