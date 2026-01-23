import { Suspense } from 'react'
import { signIn, recoveryPassword } from "@/actions/auth"
import { LoginForm } from "@/components/auth/LoginForm"
import { createClient } from "@/lib/supabase/server"
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <Suspense fallback={null}>
      <LoginForm
        onLogin={signIn}
        onRecoveryPassword={recoveryPassword}
        loading={false}
      />
    </Suspense>
  )
}
