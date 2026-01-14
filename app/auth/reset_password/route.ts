import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  console.log("Resetando password --------------------------------------")
  console.log({code})

  // Pegando a origem (domínio + protocolo)
  const origin = requestUrl.origin;

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    console.log("Erro ao resetar password --------------------------------------")
    console.log({error})
    if (error) {
      return NextResponse.redirect(`${origin}/login`);
    }
  }

  // Redireciona para atualizar senha
  return NextResponse.redirect(`${origin}/login/update_password`);
}
