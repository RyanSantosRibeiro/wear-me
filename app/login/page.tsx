import { Suspense } from 'react'
import { signIn, recoveryPassword } from "@/actions/auth"
import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
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
