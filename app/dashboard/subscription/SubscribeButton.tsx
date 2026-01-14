"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface SubscribeButtonProps {
    planId: string
    planName: string
    isPopular?: boolean
    className?: string
}

export function SubscribeButton({ planId, planName, isPopular, className }: SubscribeButtonProps) {
    const [loading, setLoading] = useState(false)

    const handleSubscribe = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/mercadopago/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ planId }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Erro ao iniciar checkout")
            }

            if (data.checkout_url) {
                window.location.href = data.checkout_url
            } else {
                throw new Error("URL de checkout não retornada")
            }

        } catch (error) {
            console.error(error)
            toast.error("Erro ao iniciar assinatura", {
                description: error instanceof Error ? error.message : "Tente novamente mais tarde"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            onClick={handleSubscribe}
            disabled={loading}
            className={className}
        >
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                </>
            ) : (
                `Assinar ${planName}`
            )}
        </Button>
    )
}
