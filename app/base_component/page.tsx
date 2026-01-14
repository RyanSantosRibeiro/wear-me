import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getCompany, getContacts, getProfile, getUser } from "@/utils/supabase/queries"

export default async function AppsPage() {
  const supabase = await createClient()

  const [user, profile, company] = await Promise.all([
    getUser(supabase),
    getProfile(supabase),
    getCompany(supabase),
  ]);

  
  
  if (!user) {
    redirect("/auth/login")
  }
  
  if(!profile || profile?.role !== "admin") {
    redirect("/dashboard")
  }
  
  if(!company) {
      redirect("/onboarding")
    }
  
  
  return (
   
  )
}
