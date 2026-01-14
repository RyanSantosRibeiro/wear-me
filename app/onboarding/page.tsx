import { sendNewPassword } from "@/actions/auth"
import { RecoveryForm } from "@/components/auth/RecoveryForm"
import Onboarding from "@/components/onboarding"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function OnboardingPage() {

    const supabase = await createClient()

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser()

    if (error || !user) {
        redirect("/login")
    }

    // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()
  const { data: company } = await supabase.from("companies").select("*").eq("owner_id", user?.id).single()
  console.log({profile, company})

  // if(company) {
  //   redirect("/dashboard")
  // }

    return <Onboarding profile={profile} />
}
