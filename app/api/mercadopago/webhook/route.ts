import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("[MP] Webhook recebido:", JSON.stringify(body))

    const { type, action, data } = body

    if (type === "subscription_preapproval") {
      await handlePreapprovalEvent(data.id)
    }

    if (type === "payment" && action === "payment.created") {
      await handlePaymentEvent(data.id)
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error("[MP] Webhook error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function handlePreapprovalEvent(preapprovalId: string) {
  const supabase = await createAdminClient()

  const res = await fetch(
    `https://api.mercadopago.com/preapproval/${preapprovalId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
    }
  )
  if (!res.ok) throw new Error("Failed to fetch preapproval")

  const preapproval = await res.json()
  console.log("[MP] Resposta da API:", preapproval)
  //     [MP] Resposta da API: {
  //   id: '191ad176b84c4c3b854f1c669c487ebe',
  //   payer_id: 2606265660,
  //   payer_email: '',
  //   back_url: 'https://wearme.vercel.app/dashboard',
  //   collector_id: 362157879,
  //   application_id: 2698395190285954,
  //   status: 'pending',
  //   reason: 'Luxury Fit',
  //   external_reference: '7bd9dabe-73a7-479f-9137-4d38103e614d',
  //   date_created: '2026-01-18T12:06:20.094-04:00',
  //   last_modified: '2026-01-18T12:06:20.278-04:00',
  //   init_point: 'https://www.mercadopago.com.br/subscriptions/checkout?preapproval_id=191ad176b84c4c3b854f1c669c487ebe',
  //   auto_recurring: {
  //     frequency: 1,
  //     frequency_type: 'months',
  //     transaction_amount: 3,
  //     currency_id: 'BRL',
  //     free_trial: null
  //   },
  //   summarized: {
  //     quotas: null,
  //     charged_quantity: null,
  //     pending_charge_quantity: null,
  //     charged_amount: null,
  //     pending_charge_amount: null,
  //     semaphore: null,
  //     last_charged_date: null,
  //     last_charged_amount: null
  //   },
  //   next_payment_date: '2026-01-18T12:06:20.000-04:00',
  //   payment_method_id: null,
  //   payment_method_id_secondary: null,
  //   first_invoice_offset: null,
  //   subscription_id: '191ad176b84c4c3b854f1c669c487ebe',
  //   owner: null,
  //   rollout_unification_api_public: false
  // }

  const statusMap: Record<string, string> = {
    authorized: "active",
    paused: "pending",
    cancelled: "cancelled",
    pending: "pending",
  }

  const status = statusMap[preapproval.status] ?? "pending"


  // Caso nao seja json , apenas uma string
  const metadata = preapproval.external_reference.includes("{") ? JSON.parse(preapproval.external_reference) : { userId: preapproval.external_reference }

  // if (!metadata ) {
  //   console.error("[MP] Preapproval sem metadata:", preapprovalId)
  //   return
  // }

  // Verifica se já existe
  const { data: existing, error: existingError } = await supabase
    .from("subscriptions")
    .select("id, plan_id")
    .eq("mercado_pago_subscription_id", preapprovalId)
    .single()

  console.log("[MP] Existing subscription:", existing)
  console.log("[MP] Existing subscription error:", existingError)

  const payload = {
    user_id: metadata.userId,
    plan_id: metadata.planId || existing?.plan_id,
    mercado_pago_subscription_id: preapprovalId,
    status,
    next_payment_date: preapproval.next_payment_date,
    current_period_start: preapproval.auto_recurring?.start_date,
    current_period_end: preapproval.auto_recurring?.end_date,
    cancelled_at: preapproval.status === "cancelled" ? new Date().toISOString() : null,
    metadata: preapproval,
    updated_at: new Date().toISOString(),
  }

  if (existing) {
    await supabase
      .from("subscriptions")
      .update(payload)
      .eq("id", existing.id)

    console.log("[MP] Subscription atualizada:", existing.id)
  } else {
    await supabase.from("subscriptions").insert(payload)
    console.log("[MP] Subscription criada:", preapprovalId)
  }
}
async function handlePaymentEvent(paymentId: string) {
  const supabase = await createAdminClient()

  const res = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
    }
  )
  if (!res.ok) throw new Error("Failed to fetch payment")

  const payment = await res.json()
  console.log("[MP] Resposta da API Payment:", payment)

  const subscriptionId = payment.point_of_interaction.transaction_data.subscription_id
  const invoicePeriod = payment.point_of_interaction.transaction_data.invoice_period
  console.log("[MP] Invoice Period:", invoicePeriod)
  const status = payment.status

  const metadata = payment.external_reference.includes("{") ? JSON.parse(payment.external_reference) : { userId: payment.external_reference }

  // Busca subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("mercado_pago_subscription_id", subscriptionId)
    .single()

  // Pode ser um pagamento avulso
  // if (!subscription) {
  //   console.error("[MP] Subscription não encontrada:", preapprovalId)
  //   return
  // }

  const isPaid = status === "approved"
  const hasPayment = await supabase
    .from("payments")
    .select("*")
    .eq("provider_payment_id", paymentId)
    .single()

  if (hasPayment) {
    console.log("[MP] Pagamento já registrado:", paymentId)
    return
  }


  // 🔹 payment_logs (log bruto)
  const { error: logError } = await supabase.from("payment_logs").insert({
    user_id: metadata.userId,
    payment_id: paymentId,
    payment_status: status,
    amount: payment.transaction_amount,
    currency: payment.currency_id,
    plan_id: metadata.planId || null,
    plan_name: payment.description,
    subscription_id: subscription?.id || null,
    payment_method: payment.payment_method_id,
    payer_email: payment.payer?.email,
    metadata: payment,
  })

  if (logError) {
    console.error("[MP] Erro ao inserir log de pagamento:", logError)
  }

  // 🔹 payments (registro financeiro oficial)
  const { error: paymentError } = await supabase.from("payments").insert({
    user_id: metadata.userId,
    payment_type: subscription ? "subscription" : "one_time",
    currency: payment.currency_id,
    plan_id: metadata.planId || null,
    subscription_id: subscription?.id || null,
    partner_id: metadata.partnerId || null,
    coupon_id: metadata.couponId || null,
    period: invoicePeriod.period,
    metadata: payment,
    provider: "mercado_pago",
    provider_payment_id: paymentId,
    provider_subscription_id: subscriptionId,
    amount_gross: payment.transaction_amount,
    amount_net: payment.transaction_details?.net_received_amount,
    status: isPaid ? "paid" : "failed",
    paid_at: isPaid ? payment.date_approved : null,
  })

  if (paymentError) {
    console.error("[MP] Erro ao inserir pagamento:", paymentError)
  }

  //   [MP] Resposta da API Payment: {
  //   accounts_info: null,
  //   acquirer_reconciliation: [],
  //   additional_info: {
  //     tracking_id: 'platform:v1-blacklabel,so:ALL,type:N/A,security:none'
  //   },
  //   authorization_code: null,
  //   binary_mode: true,
  //   brand_id: null,
  //   build_version: '3.138.0-rc-9',
  //   call_for_authorize_id: null,
  //   captured: true,
  //   card: {},
  //   charges_details: [
  //     {
  //       accounts: [Object],
  //       amounts: [Object],
  //       client_id: 0,
  //       date_created: '2026-01-18T11:08:34.000-04:00',
  //       external_charge_id: '01KF8TD677YPYN40AV5ZJAVXTK',
  //       id: '142539576668-001',
  //       last_updated: '2026-01-18T11:08:34.000-04:00',
  //       metadata: [Object],
  //       name: 'mercadopago_fee',
  //       refund_charges: [],
  //       reserve_id: null,
  //       type: 'fee',
  //       update_charges: []
  //     }
  //   ],
  //   charges_execution_info: {
  //     internal_execution: {
  //       date: '2026-01-18T11:08:34.931-04:00',
  //       execution_id: '01KF8TD66EAGW8FQXN85A7S4DE'
  //     }
  //   },
  //   collector_id: 362157879,
  //   corporation_id: null,
  //   counter_currency: null,
  //   coupon_amount: 0,
  //   currency_id: 'BRL',
  //   date_approved: '2026-01-18T11:08:35.000-04:00',
  //   date_created: '2026-01-18T11:08:34.000-04:00',
  //   date_last_updated: '2026-01-18T11:08:39.000-04:00',
  //   date_of_expiration: null,
  //   deduction_schema: null,
  //   description: 'Luxury Fit',
  //   differential_pricing_id: null,
  //   external_reference: 'b0bf1c88-c547-48a9-8592-493af73afd81',
  //   fee_details: [ { amount: 0.15, fee_payer: 'collector', type: 'mercadopago_fee' } ],
  //   financing_group: null,
  //   id: 142539576668,
  //   installments: 1,
  //   integrator_id: null,
  //   issuer_id: '2007',
  //   live_mode: true,
  //   marketplace_owner: null,
  //   merchant_account_id: null,
  //   merchant_number: null,
  //   metadata: {},
  //   money_release_date: '2026-01-18T11:08:35.000-04:00',
  //   money_release_schema: null,
  //   money_release_status: 'released',
  //   notification_url: null,
  //   operation_type: 'recurring_payment',
  //   order: {},
  //   payer: {
  //     email: 'andreyrso711@gmail.com',
  //     entity_type: null,
  //     first_name: null,
  //     id: '2606265660',
  //     identification: { number: '20449926710', type: 'CPF' },
  //     last_name: null,
  //     operator_id: null,
  //     phone: { number: null, extension: null, area_code: null },
  //     type: null
  //   },
  //   payment_method: { id: 'account_money', issuer_id: '2007', type: 'account_money' },
  //   payment_method_id: 'account_money',
  //   payment_type_id: 'account_money',
  //   platform_id: null,
  //   point_of_interaction: {
  //     application_data: { name: null, operating_system: null, version: null },
  //     business_info: {
  //       branch: 'Merchant Services',
  //       sub_unit: 'recurring',
  //       unit: 'online_payments'
  //     },
  //     location: { source: 'payer', state_id: 'BR-RJ' },
  //     references: [ [Object] ],
  //     transaction_data: {
  //       billing_date: '2026-01-17',
  //       first_time_use: true,
  //       invoice_id: null,
  //       invoice_period: [Object],
  //       payment_reference: null,
  //       plan_id: null,
  //       processor: null,
  //       subscription_id: 'f2ae3100f1ef43b09fc54830ae374646',
  //       subscription_sequence: [Object],
  //       user_present: true
  //     },
  //     type: 'SUBSCRIPTIONS'
  //   },
  //   pos_id: null,
  //   processing_mode: 'aggregator',
  //   refunds: [],
  //   release_info: null,
  //   shipping_amount: 0,
  //   sponsor_id: null,
  //   statement_descriptor: null,
  //   status: 'approved',
  //   status_detail: 'accredited',
  //   store_id: null,
  //   tags: null,
  //   taxes_amount: 0,
  //   transaction_amount: 3,
  //   transaction_amount_refunded: 0,
  //   transaction_details: {
  //     acquirer_reference: null,
  //     external_resource_url: null,
  //     financial_institution: null,
  //     installment_amount: 0,
  //     net_received_amount: 2.85,
  //     overpaid_amount: 0,
  //     payable_deferral_period: null,
  //     payment_method_reference_id: null,
  //     total_paid_amount: 3
  //   }
  // }

  // 🔹 Atualiza período da assinatura somente se pago
  if (isPaid && payment.point_of_interaction.transaction_data.billing_date && subscription) {
    const start = new Date(payment.point_of_interaction.transaction_data.billing_date)
    const end = new Date(start)
    end.setMonth(end.getMonth() + 1)

    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        current_period_start: start.toISOString(),
        current_period_end: end.toISOString(),
        status: "active",
        current_period: invoicePeriod.period,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription.id)

    if (updateError) {
      console.error("[MP] Erro ao atualizar assinatura:", updateError)
    }
  }

  console.log("[MP] Pagamento processado:", paymentId)
}
