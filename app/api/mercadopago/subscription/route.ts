import { NextResponse } from "next/server";
import { createSubscriptionLink } from "@/lib/mercadopago/createSubscriptionLink";
import { createClient } from "@/lib/supabase/server";

const SASS_SLUG = "wearme";

export async function POST(req: Request) {
  console.log("[Checkout router] Iniciando rota de Assinatura Mercado Pago");

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

    // Busca o perfil para ter o nome do pagador
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

    // Busca detalhes do plano no banco
    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .or(`id.eq.${planId},slug.eq.${planId}`)
      .eq("is_active", true)
      .single();

    if (planError || !plan) {
      console.error("Plan fetch error:", planError);
      return NextResponse.json(
        { error: true, message: "Plano não encontrado ou inativo" },
        { status: 404 }
      );
    }

    console.log(`[MercadoPago] Criando Assinatura: ${plan.name} (R$ ${plan.price})`);

    /**
     * 🔥 Payload adaptado para Assinatura (PreApproval)
     * Diferente do Checkout Pro comum, assinaturas usam 'reason' e 'auto_recurring'
     */
    const subscriptionPayload = {
      planName: `Assinatura ${SASS_SLUG}: ${plan.name}`,
      planPrice: Number(plan.price),
      userEmail: user.email!,
      // O external_reference é crucial para o Webhook saber quem pagou
      metadata: {
        userId: user.id,
        planId: plan.id,
        sass_slug: SASS_SLUG,
        customerName: profile?.full_name || user.email?.split('@')[0]
      },
      // URL para onde o usuário volta após assinar
      back_url: `${process.env.PRODUCTION_URL}/dashboard`
    };

    console.log("[MercadoPago] Payload de Assinatura:", subscriptionPayload);
    
    // Agora chama a função de assinatura que criamos anteriormente
    const mp = await createSubscriptionLink(subscriptionPayload);

    // No /preapproval, o campo é init_point
    const url = mp?.init_point;

    if (!url) {
      console.error("[MercadoPago] Erro na resposta:", mp);
      return NextResponse.json(
        { error: true, message: "Mercado Pago não retornou URL de assinatura" },
        { status: 500 }
      );
    }

    // Salva o link de pré-aprovação no banco para o webhook usar depois
    const { error: dbError } = await supabase
      .from("subscriptions")
      .insert({
        user_id: user.id,
        plan_id: plan.id,
        mercado_pago_subscription_id: mp.id, // O ID da assinatura no MP
        status: "pending"
      });

    if (dbError) {
      console.error("DB Insert Error:", dbError);
      // Não bloqueia o usuário, mas loga o erro
    }

    return NextResponse.json({
      success: true,
      checkout_url: url,
    });

  } catch (error) {
    console.error("Subscription Checkout Error:", error);
    return NextResponse.json(
      { error: true, message: "Erro interno ao processar assinatura", errorData: error },
      { status: 500 }
    );
  }
}


