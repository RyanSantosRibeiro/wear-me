import { sendNewPassword } from "@/actions/auth"
import { RecoveryForm } from "@/components/auth/RecoveryForm"

export default function RecoveryPage() {
  
  return <RecoveryForm sendNewPassword={sendNewPassword}  />
}
