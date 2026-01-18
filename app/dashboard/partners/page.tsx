import { createClient } from "@/lib/supabase/server"
import { InviteMemberDialog } from "@/components/dashboard/invite-member-dialog"
import { redirect } from "next/navigation"
import { TeamMembersTable } from "@/components/dashboard/team-members-list"
import { PageHeader } from "@/components/PageHeader"
import { Users } from "lucide-react"
import { PartnerRegisterForm } from "./PartnerRegisterForm"
import { ReferralsTable } from "./ReferralsTable"
import { Button } from "@/components/ui/button"
import { ReferralCopy } from "./referralCopy"

export default async function TeamPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: partner } = await supabase.from("partners").select("*, referrals(*)").eq("user_id", user.id).single()
  console.log({ partner })

  return (
      <div className="space-y-10 p-8 max-w-7xl mx-auto flex flex-col items-start justify-start">
        <PageHeader title="Seja parceiro WearMe" description="Agências e creators que querem crescer junto com a gente." />

        <div className="w-full">
          <h2 className="text-xl font-bold text-[#3b4a54] mb-4">Informações</h2>
          <PartnerRegisterForm partnerData={partner} />
        </div>

        {partner.active === null ? (
          <div className="w-full">
            <h2 className="text-xl font-bold text-[#3b4a54] mb-4">Seu cadastro está pendende!</h2>
            <p>Nossa equipe vai analisar e entraremos em contato em breve.</p>
          </div>
        ) : partner.active === true ? (
          <div className="w-full">
            <h2 className="text-xl font-bold text-[#3b4a54] mb-4">Seus links de indicação</h2>
            <div className="flex items-center gap-2">
              <ReferralCopy referralCode={partner?.referral_code} />
            </div>
          </div>
        ) : (
          <div className="w-full">
            <h2 className="text-xl font-bold text-[#3b4a54] mb-4">Seu cadastro foi reprovado!</h2>
            <p>Entre em contato com nossa equipe para mais informações.</p>
          </div>
        )}

        {partner && partner.referrals.length > 0 ? (
          <div className="w-full">
            <h2 className="text-xl font-bold text-[#3b4a54] mb-4">Seus Indicados</h2>
            <ReferralsTable referrals={partner.referrals} />
          </div>
        ) : (
          <div className="w-full">
            <h2 className="text-xl font-bold text-[#3b4a54] mb-4">Seus Indicados</h2>
            <p>Você ainda não tem nenhum indicado.</p>
          </div>
        ) }
      </div>
    )
}
