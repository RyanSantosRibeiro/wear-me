import { signUp } from "@/actions/auth"
import { RegisterForm } from "@/components/auth/RegisterForm"

export default function SignUpPage() {
  return <RegisterForm onRegister={signUp} loading={false} error={null}/>
}
