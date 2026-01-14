import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { companyId, planId } = await request.json()

    // Verify user has access to company
    const { data: company } = await supabase
      .from("companies")
      .select("*")
      .eq("id", companyId)
      .eq("owner_id", user.id)
      .single()

    if (!company) {
      return NextResponse.json({ error: "Empresa não encontrada ou sem permissão" }, { status: 403 })
    }

    // Get plan details
    const { data: plan } = await supabase.from("plans").select("*").eq("id", planId).single()

    if (!plan) {
      return NextResponse.json({ error: "Plano não encontrado" }, { status: 404 })
    }

    // In a real implementation, you would:
    // 1. Create a subscription in Mercado Pago
    // 2. Get the subscription ID from Mercado Pago
    // 3. Store it in your database

    // For this example, we'll create a mock subscription
    const mockMercadoPagoId = `MP-${Date.now()}`

    const currentPeriodStart = new Date()
    const currentPeriodEnd = new Date()

    // Calculate period end based on recurrence
    switch (plan.recurrence) {
      case "monthly":
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)
        break
      case "quarterly":
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 3)
        break
      case "yearly":
        currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1)
        break
    }

    // Create subscription in database
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .insert({
        company_id: companyId,
        plan_id: planId,
        status: "active",
        mercado_pago_subscription_id: mockMercadoPagoId,
        current_period_start: currentPeriodStart.toISOString(),
        current_period_end: currentPeriodEnd.toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating subscription:", error)
      return NextResponse.json({ error: "Erro ao criar assinatura" }, { status: 500 })
    }

    return NextResponse.json({ subscription })
  } catch (error: any) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
