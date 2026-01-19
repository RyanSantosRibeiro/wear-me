"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, CreditCard, Check } from "lucide-react"

interface SubscribeButtonProps {
    planId: string
    planName: string
    isPopular?: boolean
    className?: string
    sameSubscription?: boolean
}

export function SubscribeButton({ planId, planName, isPopular, className, sameSubscription }: SubscribeButtonProps) {
    const [loading, setLoading] = useState(false)

    const handleSubscribe = async () => {
        try {
            setLoading(true)
            
            // 🔥 Certifique-se que este caminho é o mesmo onde você salvou a Route Handler (POST)
            const response = await fetch("/api/mercadopago/subscription", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ planId }),
            })

            const data = await response.json()
            console.log("[Subscription Button Response]:", data)

            if (!response.ok) {
                throw new Error(data.message || "Erro ao iniciar processo de assinatura")
            }

            if (data.checkout_url) {
                // Redireciona para o Checkout Pro (Assinatura Recorrente)
                window.location.href = data.checkout_url
            } else {
                throw new Error("Não foi possível gerar o link de pagamento.")
            }

        } catch (error) {
            console.error("[Subscription Button Error]:", error)
            toast.error("Falha na Assinatura", {
                description: error instanceof Error ? error.message : "Tente novamente mais tarde."
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            onClick={handleSubscribe}
            disabled={loading || sameSubscription}
            className={`${className} ${sameSubscription ? 'opacity-50 !cursor-not-allowed' : ''}`}
        >
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Preparando Checkout...
                </>
            ) : sameSubscription ? (
                <>
                    <Check className="mr-2 h-4 w-4" />
                    Plano Atual
                </>
            ) : (
                <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Assinar {planName}
                </>
            )}
        </Button>
    )
}