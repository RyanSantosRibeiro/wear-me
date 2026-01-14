export async function createCheckoutLink({
  items,
  metadata = {},
  payer = {},
  back_urls = {
    success: `${process.env.APP_URL}/checkout/sucesso`,
    failure: `${process.env.APP_URL}/checkout/erro`,
    pending: `${process.env.APP_URL}/checkout/pendente`
  },
  auto_return = "approved"
}) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items,
      payer,
      metadata,
      back_urls,
      auto_return,
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error("Erro Mercado Pago: " + err);
  }

  return await response.json(); // contém init_point, id, etc.
}
