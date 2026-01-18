"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface TeamMembersTableProps {
  members: any[]
  currentUserId: string
  isAdmin: boolean
}

export function TeamMembersTable({
  members,
  currentUserId,
  isAdmin,
}: TeamMembersTableProps) {
  const router = useRouter()
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set())
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const deleteMember = async (member: any) => {
    if (!isAdmin || member.user_id === currentUserId) return

    setDeletingId(member.id)

    const supabase = createClient()

    const { error } = await supabase
      .from("company_members")
      .delete()
      .eq("id", member.id)

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover membro",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Membro removido",
        description: "O membro foi removido da empresa",
      })
      router.refresh()
    }

    setDeletingId(null)
  }



  const toggleStatus = async (member: any) => {
    if (!isAdmin || member.user_id === currentUserId) return

    setUpdatingIds((prev) => new Set(prev).add(member.id))

    const supabase = createClient()
    const newStatus = member.status === "active" ? "inactive" : "active"

    const { error } = await supabase
      .from("company_members")
      .update({ status: newStatus })
      .eq("id", member.id)


    console.log({ error, id: member.id })
    const { data, error: selectError } = await supabase
      .from("company_members")
      .select()
      .eq("id", member.id)
    console.log({ data, selectError })
    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status do membro",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Sucesso",
        description:
          newStatus === "active"
            ? "Membro ativado"
            : "Membro inativado",
      })
      router.refresh()
    }

    setUpdatingIds((prev) => {
      const copy = new Set(prev)
      copy.delete(member.id)
      return copy
    })
  }

  if (members.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Nenhum membro na equipe.
      </div>
    )
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-muted">
          <tr>
            <th className="px-6 py-3 text-sm font-medium">Nome</th>
            <th className="px-6 py-3 text-sm font-medium">Função</th>
            <th className="px-6 py-3 text-sm font-medium">Status</th>
            <th className="px-6 py-3 text-sm font-medium">Criado em</th>
            <th className="px-6 py-3 text-sm font-medium text-right">Ações</th>

          </tr>
        </thead>

        <tbody className="divide-y">
          {members.map((member) => {
            const profile = member.profile
            const isSelf = member.user_id === currentUserId
            const isUpdating = updatingIds.has(member.id)

            const initials =
              profile?.full_name
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase() || "U"

            return (
              <tr key={member.id} className="hover:bg-muted/50">
                {/* NAME */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {profile?.full_name || "Usuário"}
                        {isSelf && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (Você)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </td>

                {/* ROLE */}
                <td className="px-6 py-4">
                  <Badge
                    variant={member.role === "admin" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {member.role}
                  </Badge>
                </td>

                {/* STATUS / TOGGLE */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleStatus(member)}
                      disabled={!isAdmin || isSelf || isUpdating}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                        ${member.status === "active"
                          ? "bg-primary"
                          : "bg-muted"
                        }
                        ${!isAdmin || isSelf
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                        }
                      `}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform
                          ${member.status === "active"
                            ? "translate-x-6"
                            : "translate-x-1"
                          }
                        `}
                      />
                    </button>

                    <span className="text-xs text-muted-foreground">
                      {isUpdating
                        ? "Atualizando..."
                        : member.status === "active"
                          ? "Ativo"
                          : "Inativo"}
                    </span>
                  </div>
                </td>

                {/* CREATED */}
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(member.created_at).toLocaleDateString()}
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4 text-right">
                  {!isSelf && isAdmin && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          disabled={deletingId === member.id}
                          className="text-sm text-destructive hover:underline disabled:opacity-50"
                        >
                          {deletingId === member.id ? "Excluindo..." : "Excluir"}
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Remover membro</DialogTitle>
                          <DialogDescription>
                            Tem certeza que deseja remover{" "}
                            <strong>{profile?.full_name || "este usuário"}</strong> da empresa?
                            <br />
                            Essa ação não pode ser desfeita.
                          </DialogDescription>
                        </DialogHeader>

                        <DialogFooter>
                          <Button variant="outline">Cancelar</Button>
                          <Button
                            variant="destructive"
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={() => deleteMember(member)}
                          >
                            Confirmar exclusão
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </td>

              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
