import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Exemplo de payload
// {
//   "action": "payment.updated",
//   "api_version": "v1",
//   "data": {
//     "id": "134917441163"
//   },
//   "date_created": "2021-11-01T02:02:02Z",
//   "id": "123456",
//   "live_mode": false,
//   "type": "payment",
//   "user_id": 362157879,
//   "metadata": {
//     "user_id": "7bd9dabe-73a7-479f-9137-4d38103e614d",
//     "plan_id": "19def836-e594-4ca0-9fac-9f98ac9145c5",
//     "sass_slug": "wearme"
//   }
// }


export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("[v0] Mercado Pago Webhook received:", JSON.stringify(body))

    const { type, data, action } = body

    if (type === "payment" && (action === "updated" || action === "created")) {
      await handlePaymentEvent(data.id)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function handlePaymentEvent(paymentId: string) {
  const supabase = await createAdminClient()

  console.log("[v0] Processing payment:", paymentId)

  // 1. Fetch payment details from Mercado Pago
  const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
    }
  })

  if (!paymentResponse.ok) {
    throw new Error(`Failed to fetch payment ${paymentId}`)
  }

  const paymentData = await paymentResponse.json()

  // 2. Verify Status
  if (paymentData.status !== "approved") {
    console.log(`[v0] Payment ${paymentId} status is ${paymentData.status}, skipping.`)
    return
  }

  // 3. Extract Metadata
  const { metadata } = paymentData
  // MP converts metadata keys to snake_case automatically usually, but let's be safe
  // const userId = "7bd9dabe-73a7-479f-9137-4d38103e614d" // Teste
  const userId = metadata.user_id
  const planId = metadata.plan_id || "19def836-e594-4ca0-9fac-9f98ac9145c5"
  const sassSlug = metadata.sass_slug || "wearme"

  if (!userId || !planId) {
    console.error("[v0] Missing metadata in payment:", paymentData)
    return
  }

  // 4. Verify Plan and Price
  const { data: plan, error: planError } = await supabase
    .from("plans")
    .select("*")
    .eq("id", planId)
    .single()

  if (planError || !plan) {
    console.error("[v0] Plan not found:", planId)
    return
  }

  // Optional: Check if amount paid matches plan price?
  // const paidAmount = paymentData.transaction_amount
  // if (paidAmount < plan.price) { console.warn("Paid amount mismatch"); }

  console.log(`[v0] Payment valid for user ${userId}, plan ${plan.name}`)

  // 5. Log Payment to payment_logs table
  const { error: logError } = await supabase.from("payment_logs").insert({
    user_id: userId,
    payment_id: paymentId,
    payment_status: paymentData.status,
    amount: paymentData.transaction_amount,
    currency: paymentData.currency_id || 'BRL',
    plan_id: planId,
    plan_name: plan.name,
    payment_method: paymentData.payment_method_id,
    payer_email: paymentData.payer?.email,
    metadata: paymentData // Store full payment data for audit
  })

  if (logError) {
    console.error("[v0] Error logging payment:", logError)
  } else {
    console.log("[v0] Payment logged successfully")
  }

  // 6. Create Subscription Record
  // We assume this is a monthly subscription from the checkout logic
  const now = new Date()
  const periodEnd = new Date()
  periodEnd.setMonth(periodEnd.getMonth() + 1) // +1 Month default

  // Upsert subscription
  // We search for existing active subscription to update or create new
  // Ideally we should have a constraints, but here we insert a new specific record for this payment cycle if simpler,
  // OR update the user's main subscription row. 
  // Let's create a new row or update existing if we track by user_id uniqueness.
  // The SQL schema implies user can have multiple, but logic implies one active.

  const { data: subscription, error: subError } = await supabase.from("subscriptions").insert({
    user_id: userId,
    plan_id: planId,
    status: "active",
    current_period_start: now.toISOString(),
    current_period_end: periodEnd.toISOString(),
    metadata: {
      payment_id: paymentId,
      sass_slug: sassSlug,
      plan_id: planId,
      plan_name: plan.name,
      plan_price: plan.price
    }
  }).select("*").single()

  console.log("[v0] Subscription created:", subscription)

  if (subError) {
    console.error("[v0] Error inserting subscription:", subError)
    throw subError
  }

  // 7. Activate WearMe Config and RESET requests_count
  if (sassSlug === "wearme") {
    const { error: configError } = await supabase
      .from("wearme_configs")
      .update({
        subscription_id: subscription.id,
        requests_count: 0, // RESET counter on new payment
        updated_at: now.toISOString()
      })
      .eq("owner_id", userId)

    if (configError) {
      console.error("Error activating wearme config:", configError)
    } else {
      console.log("[v0] WearMe config updated and requests_count reset to 0")
    }
  }

  console.log("[v0] Subscription created and service activated successfully.")
}
