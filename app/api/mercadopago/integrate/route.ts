import { NextResponse } from "next/server";

// Esse endpoint gera a URL de OAuth do Mercado Pago
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const server_id = searchParams.get("server_id");
    if (!server_id) {
      return NextResponse.json({ error: "server_id é obrigatório" }, { status: 400 });
    }

    // Gera um state único para segurança (pode salvar no Supabase se quiser validar depois)
    const state = `${server_id}-${Date.now()}`;

    // URL de redirecionamento do seu backend (callback)
    const redirect_uri = encodeURIComponent(
      process.env.MP_REDIRECT_URI || "https://seu-dominio.com/api/mercadopago/callback"
    );

    // URL de autorização do Mercado Pago
    const mpAuthUrl = `https://auth.mercadopago.com.br/authorization?client_id=${process.env.MP_CLIENT_ID}&response_type=code&platform_id=mp&state=${state}&redirect_uri=${redirect_uri}`;

    return NextResponse.json({ url: mpAuthUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// async function handleIntegrateMP(serverId: string) {
//   const res = await fetch(`/api/mercadopago/integrate?server_id=${serverId}`);
//   const data = await res.json();
//   if (data.url) {
//     window.location.href = data.url; // redireciona o dono para autorizar
//   } else {
//     console.error(data.error);
//   }
// }