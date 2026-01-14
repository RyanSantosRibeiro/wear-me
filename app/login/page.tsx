import { signIn, recoveryPassword } from "@/actions/auth"
import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
  return <LoginForm onLogin={signIn} onRecoveryPassword={recoveryPassword} loading={false} error={null} />
}
