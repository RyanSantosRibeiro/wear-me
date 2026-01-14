import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CreateCompanyDialog } from "@/components/dashboard/create-company-dialog"
import { CompanySettings } from "@/components/dashboard/company/company-settings"
import { PageHeader } from "@/components/PageHeader"

export default async function CompanyPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: company, error } = await supabase
    .from("companies")
    .select(`
      *,
      subscriptions:subscriptions(
        *,
        plan:plans(*)
      ),
      members:company_members(
       *,
        profile:profiles(
          id,
          full_name,
          avatar_url
        )
      )
    `)
    .eq("owner_id", user.id)
    .single()

  if (!company) {
    return (
      <div className="space-y-10 p-8 max-w-7xl mx-auto">
        <PageHeader
          title="Minha Empresa"
          description="Você ainda não possui uma empresa vinculada."
        />
        <CreateCompanyDialog />
      </div>
    )
  }

  return (
    <div className="space-y-10 p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Dados da Empresa"
        description="Configure as informações fundamentais e de faturamento da sua organização."
      />
      <CompanySettings company={company} />
    </div>
  )
}
