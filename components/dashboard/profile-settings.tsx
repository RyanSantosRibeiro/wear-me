"use client"

import { useState, useRef, useEffect } from "react"
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
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    console.log("Profile prop changed:", profile)
    if (profile) {
      setFullName(profile.full_name || "")
      setAvatarUrl(profile.avatar_url || "")
    }
  }, [profile])

  const initials = (fullName?.trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()) || (userEmail?.[0]?.toUpperCase()) || "U"

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 1MB",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    const supabase = createClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName)

      console.log("Checking if profile exists for user:", user.id)
      const { data: existingProfile, error: selectError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single()

      if (selectError && selectError.code !== 'PGRST116') { // PGRST116 is "no rows found"
        console.error("DEBUG - Select Error:", selectError)
        throw selectError
      }

      let dbResult;
      if (existingProfile) {
        console.log("Profile exists, updating...")
        dbResult = await supabase
          .from("profiles")
          .update({ avatar_url: publicUrl })
          .eq("id", user.id)
          .select()
      } else {
        console.log("Profile does not exist, inserting...")
        dbResult = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            avatar_url: publicUrl,
            full_name: fullName
          })
          .select()
      }

      if (dbResult.error) {
        console.error("DEBUG - DB Operation Error:", dbResult.error)
        throw dbResult.error
      }
      console.log("DEBUG - DB Operation Success:", dbResult.data)

      setAvatarUrl(publicUrl)
      toast({
        title: "Sucesso",
        description: "Sua foto de perfil foi atualizada",
      })
      router.refresh()
    } catch (error: any) {
      console.error("Upload error:", error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao fazer upload da foto",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

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
          <AvatarImage src={avatarUrl || undefined} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            accept="image/png, image/jpeg"
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handlePhotoClick}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Alterar Foto"
            )}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">PNG, JPG ou JPEG. Máx 1MB.</p>
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
