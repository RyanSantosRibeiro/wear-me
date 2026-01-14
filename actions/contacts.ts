"use server"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateContactStatus(contactId: string, status: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("contacts").update({ status }).eq("id", contactId)

    if (error) throw error

    revalidatePath("/dashboard/contacts")

    return { success: true }
  } catch (error) {
    console.error("Error updating contact status:", error)
    return { success: false, error: "Erro ao atualizar status do contato" }
  }
}

export async function getContacts(companyId?: string) {
  try {
    const supabase = await createClient()

    let query = supabase.from("contacts").select("*").order("created_at", { ascending: false })

    if (companyId) {
      query = query.eq("company_id", companyId)
    }

    const { data, error } = await query

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return { success: false, error: "Erro ao buscar contatos" }
  }
}
