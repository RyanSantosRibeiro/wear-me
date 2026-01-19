export async function createSubscriptionLink({
  planName,
  plan,
  userEmail,
  metadata = {},
  back_url = `${process.env.APP_URL}/checkout/sucesso`,
}: {
  planName: string;
  plan: any;
  userEmail: string;
  metadata?: any;
  back_url?: string;
}) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;

  const response = await fetch("https://api.mercadopago.com/preapproval", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reason: plan.name, // Nome que aparece na fatura
      payer_email: userEmail,
      auto_recurring: {
        frequency: 1,
        frequency_type: plan.recurrence, // Cobrança mensal
        // transaction_amount: 3,
        transaction_amount: plan.price,
        currency_id: plan.currency,
      },
      metadata,
      back_url: back_url,
      status: "pending", // Indica que aguarda o primeiro pagamento para ativar
      external_reference: JSON.stringify(metadata), // Útil para identificar no webhook
    }),
  });

  console.log("[MercadoPago] Resposta da API:", response);

  if (!response.ok) {
    const err = await response.text();
    console.error("Erro MP Detalhado:", err);
    throw new Error("Erro Mercado Pago Assinatura: " + err);
  }

  // O retorno contém o 'init_point' para o qual você deve redirecionar o usuário
  return await response.json();
}

export async function cancelSubscription(subscriptionId: string) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;

  const response = await fetch(`https://api.mercadopago.com/preapproval/${subscriptionId}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "cancelled",
    }),
  });

  console.log("[MercadoPago] Resposta do Cancelamento:", response);

  if (!response.ok) {
    const err = await response.text();
    console.error("Erro MP Detalhado:", err);
    throw new Error("Erro Mercado Pago Cancelamento: " + err);
  }

  return await response.json();
}


// Exemplo de retorno:
// {
//   "id": "2c938084726fca480172750000000000",
//   "version": 0,
//   "application_id": 1234567812345678,
//   "collector_id": 100200300,
//   "preapproval_plan_id": "2c938084726fca480172750000000000",
//   "reason": "Yoga classes.",
//   "external_reference": 23546246234,
//   "back_url": "https://www.mercadopago.com.ar",
//   "init_point": "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_id=2c938084726fca480172750000000000",
//   "auto_recurring": {
//     "frequency": 1,
//     "frequency_type": "months",
//     "start_date": "2020-06-02T13:07:14.260Z",
//     "end_date": "2022-07-20T15:59:52.581Z",
//     "currency_id": "ARS",
//     "transaction_amount": 10,
//     "free_trial": {
//       "frequency": 1,
//       "frequency_type": "months"
//     }
//   },
//   "payer_id": 123123123,
//   "card_id": 123123123,
//   "payment_method_id": 123123123,
//   "next_payment_date": "2022-01-01T11:12:25.892-04:00",
//   "date_created": "2022-01-01T11:12:25.892-04:00",
//   "last_modified": "2022-01-01T11:12:25.892-04:00",
//   "status": "pending"
// }