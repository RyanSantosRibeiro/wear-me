import { createClient } from "@/lib/supabase/client"

export const createPartner = async (partner: any) => {
  const supabase = await createClient()

  const user = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("partners")
    .insert({
      ...partner,
      user_id: user.data.user?.id 
    })
    .select()
    .single()

  console.log({ data, error })

  return { data, error }
}
