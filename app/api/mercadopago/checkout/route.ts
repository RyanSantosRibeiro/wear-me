import { NextResponse } from "next/server";
import { createCheckoutLink } from "@/lib/mercadopago/checkout";
import { createClient } from "@/lib/supabase/server";

const SASS_SLUG = "wearme"

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

    // Fetch user profile name for the payer info
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    const body = await req.json();
    const planId = body?.planId;

    if (!planId) {
      return NextResponse.json(
        { error: true, message: "Plano não informado" },
        { status: 400 }
      );
    }

    // Fetch plan details from DB
    // Assuming 'slug' matches the string IDs used in frontend (starter, growth, enterprise)
    // OR 'id' if passing UUIDs. Let's try to match either.
    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .or(`id.eq.${planId},slug.eq.${planId}`)
      .eq("is_active", true)
      .single();

    if (planError || !plan) {
      console.error("Plan fetch error:", planError)
      return NextResponse.json(
        { error: true, message: "Plano não encontrado ou inativo" },
        { status: 404 }
      );
    }

    // Optional: Validate SaaS Slug if plans are shared
    // if (plan.metadata?.sass_slug !== SASS_SLUG) { ... }

    console.log(`[MercadoPago] Criando link para plano: ${plan.name} (${plan.price})`);

    // 🔥 cria a preferência via API pura
    const payload = {
      payer: {
        email: user.email,
        name: profile?.full_name || user.email?.split('@')[0] || "Cliente",
      },
      items: [
        {
          id: plan.id,
          title: `Assinatura Wearme: ${plan.name}`,
          description: plan.description || `Assinatura do plano ${plan.name}`,
          quantity: 1,
          unit_price: Number(plan.price),
          currency_id: "BRL",
          picture_url: "https://your-cdn.com/wearme-logo.png" // Would be good to have a real logo
        }
      ],
      metadata: {
        user_id: user.id,
        plan_id: plan.id,
        sass_slug: SASS_SLUG
      }
    }
    console.log("[MercadoPago] Payload:", payload);
    const mp = await createCheckoutLink(payload);

    const url = mp?.init_point || mp?.sandbox_init_point;

    if (!url) {
      return NextResponse.json(
        { error: true, message: "Mercado Pago não retornou URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      checkout_url: url,
    });

  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json(
      { error: true, message: "Erro interno no checkout" },
      { status: 500 }
    );
  }
}
