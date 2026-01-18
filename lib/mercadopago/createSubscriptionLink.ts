export async function createSubscriptionLink({
  planName,
  planPrice,
  userEmail,
  metadata = {},
  back_url = `${process.env.APP_URL}/checkout/sucesso`,
}: {
  planName: string;
  planPrice: number;
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
      reason: planName, // Nome que aparece na fatura
      payer_email: userEmail,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months", // Cobrança mensal
        transaction_amount: planPrice,
        currency_id: "BRL",
      },
      back_url: back_url,
      status: "pending", // Indica que aguarda o primeiro pagamento para ativar
      external_reference: metadata.userId || "", // Útil para identificar no webhook
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