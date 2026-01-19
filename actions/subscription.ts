export async function cancelSubscription(subscriptionId: string) {
    const response = await fetch(`/api/mercadopago/subscription/${subscriptionId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const err = await response.text();
        console.error("Erro MP Detalhado:", err);
        throw new Error("Erro Mercado Pago Cancelamento: " + err);
    }

    return true;
}