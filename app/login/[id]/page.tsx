import { sendNewPassword } from '@/actions/auth';
import { RecoveryForm } from '@/components/auth/RecoveryForm';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function SignIn({
  params,
}: {
  params: { id: string };
}) {

  let viewProp = await params;
  console.log("--------------------------------------")
  console.log({viewProp})

  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (user && viewProp.id !== 'update_password') {
    return redirect('/dashboard12');
  } else if(viewProp.id === 'update_password') {
    return <RecoveryForm sendNewPassword={sendNewPassword}/>
  }

  return (
    <></>
  );
}
