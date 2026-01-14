import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import type { Profile } from "@/lib/types"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const session = await supabase.auth.getSession();
const accessToken = session?.data.session?.access_token;

console.log("Token do usuário:", accessToken);

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*, company_members(*)").eq("id", user.id).single()

  const { data: company } = await supabase.from("companies").select("*, bot_configs(*), contacts(*)").eq("owner_id", user.id).single()
  
  if(!company || company === null) {
    console.log("Nenhuma empresa encontrada")
    redirect(`/onboarding`)
  }

  // @ts-ignore
  const menuOptions = company?.bot_configs?.menu_options instanceof Array ? company?.bot_configs?.menu_options?.map((m:any) => {
    // Quantos contacts tem com o target_agent_id
    const contacts = company?.contacts.filter((c:any) => c.assigned_member_id
 === m.target_agent_id)
    return {
      id: m.id,
      label: m.label,
      target_agent_id: m.target_agent_id,
      total_contacts: contacts?.length || 0,
    }
  }) : [];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={profile?.company_members?.role} menuOptions={menuOptions}/>
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* <Header profile={profile as Profile | null} /> */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
