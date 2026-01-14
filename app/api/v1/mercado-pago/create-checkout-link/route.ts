import { NextResponse } from "next/server";
import { createCheckoutLink } from "@/lib/mercadopago/checkout";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  console.log("[Checkout router] Iniciado rota com Mercado Pago API");

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: true, message: "Não autenticado" },
        { status: 401 }
      );
    }

    const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

    const body = await req.json();
    const planSlug = body?.plan || "plan_pro";

    console.log("[MercadoPago] Criando link de checkout...");

    const { data: plan } = await supabase
    .from("plans")
    .select("*")
    .eq("slug", planSlug)
    .single();

    if (!plan) {
      return NextResponse.json(
        { error: true, message: "Plano não encontrado" },
        { status: 404 }
      );
    }

    // 🔥 cria a preferência via API pura
    const mp = await createCheckoutLink({
      payer: {
        email: user.email,
        name: profile.name

      },
      items: [
        {
          title: `Assinatura: ${plan.name}`,
          quantity: 1,
          unit_price: plan.price,
          picture_url: "https://pm1.aminoapps.com/6928/96fb60d49d8a8377f94e5a57db18b522fe0c9215r1-966-543v2_hq.jpg"
        }
      ],
      metadata: {
        user_id: user.id,
        plan_slug: planSlug,
      },
    });

    console.log({mp})

    const url = mp?.init_point || mp?.sandbox_init_point;

    if (!url) {
      return NextResponse.json(
        { error: true, message: "Erro ao criar link de checkout" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      checkout_url: url,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: true, message: "Erro no checkout" },
      { status: 500 }
    );
  }
}
