import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, ShieldCheck } from "lucide-react"
import { SubscribeButton } from "./SubscribeButton"
import { PageHeader } from "@/components/PageHeader"
import Link from "next/link"

export default async function SubscriptionPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // 1. Fetch Active Subscription
    console.log("[v0] Fetching subscription for user:", user.id)
    const { data: subscription, error } = await supabase
        .from("subscriptions")
        .select("*, plans(*)")
        .eq("user_id", user.id)
        .maybeSingle()

    console.log("[v0] Subscription:", subscription)
    console.log("[v0] Subscription error:", error)
    const hasActiveSubscription = !!subscription

    // 2. Fetch Available Plans (If no active sub)
    // Filter specifically for "wearme" plans
    let plans: any[] = []
    if (!hasActiveSubscription) {
        const { data: plansData } = await supabase
            .from("plans")
            .select("*")
            .eq("is_active", true)
            .eq("sass_slug", "wearme")
            .order("price", { ascending: true })
        plans = plansData || []
    }

    console.log("[v0] Plans:", plans)

    // If no plans found in DB, show a friendly message or empty state instructions
    // (Avoiding fallback mock data to respect the 'sass_slug' filter requirement strictly)

    return (
        <div className="space-y-10 p-8 max-w-7xl mx-auto">
            <PageHeader
                title="Assinatura & Planos"
                description="Escolha o plano ideal para aumentar a conversão da sua loja."
            />

            {hasActiveSubscription ? (
                // ... (mantenha o card de assinatura ativa igual)
                <div /> 
            ) : (
                <div className="grid gap-8 md:grid-cols-3 lg:gap-8 items-stretch">
                    {plans.map((plan) => {
                        const isLuxury = plan.slug?.includes('luxury');
                        const isFit = plan.slug?.includes('fit');

                        return (
                            <Card
                                key={plan.id}
                                className={`relative flex flex-col border-2 transition-all duration-300 hover:shadow-2xl ${
                                    isLuxury 
                                    ? 'border-primary shadow-xl scale-105 z-10 bg-gradient-to-b from-primary/5 to-background' 
                                    : 'border-border'
                                }`}
                            >
                                {isFit && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-4 py-1.5 font-bold uppercase tracking-widest shadow-lg border-none">
                                            Melhor Preço
                                        </Badge>
                                    </div>
                                )}

                                {isLuxury && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-full text-center">
                                        <Badge className="bg-primary text-primary-foreground text-xs px-4 py-1.5 font-bold uppercase tracking-widest shadow-lg">
                                            Alta Performance & Exclusivo
                                        </Badge>
                                    </div>
                                )}

                                <CardHeader className="text-center pb-2">
                                    <CardTitle className={`text-xl font-bold ${isLuxury ? 'text-primary' : ''}`}>
                                        {plan.name}
                                    </CardTitle>
                                    <div className="flex items-baseline justify-center gap-1 mt-4 mb-2">
                                        <span className="text-sm font-bold text-muted-foreground">R$</span>
                                        <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                                        <span className="text-sm font-bold text-muted-foreground">/mês</span>
                                    </div>
                                    <CardDescription className="text-sm font-medium leading-relaxed px-4 min-h-[40px]">
                                        {isLuxury ? "Qualidade máxima e escala para grandes operações." : plan.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1 mt-6">
                                    <ul className="space-y-3">
                                        {plan.metadata.features.map((feature: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-sm font-medium text-muted-foreground">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isLuxury ? 'bg-primary/20' : 'bg-green-500/20'}`}>
                                                    <Check size={12} className={`${isLuxury ? 'text-primary' : 'text-green-600'} font-bold`} />
                                                </div>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>

                                <CardFooter className="pt-6">
                                    <SubscribeButton
                                        planId={plan.id}
                                        planName={plan.name}
                                        className={`w-full h-12 rounded-xl text-base font-bold transition-all ${
                                            isLuxury 
                                            ? 'bg-primary hover:ring-2 ring-primary ring-offset-2' 
                                            : 'bg-secondary hover:bg-secondary/80'
                                        }`}
                                    />
                                </CardFooter>
                            </Card>
                        )
                    })}

                    {/* MOCK ENTERPRISE PLAN */}
                    <Card className="relative flex flex-col border-2 border-dashed border-muted-foreground/30 bg-muted/30">
                        <CardHeader className="text-center pb-2">
                            <CardTitle className="text-xl font-bold text-muted-foreground">Custom / Enterprise</CardTitle>
                            <div className="flex items-baseline justify-center gap-1 mt-4 mb-2">
                                <span className="text-3xl font-black tracking-tight text-muted-foreground">Sob Consulta</span>
                            </div>
                            <CardDescription className="text-sm font-medium leading-relaxed px-4">
                                Soluções personalizadas para grandes volumes e integração via API dedicada.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="flex-1 mt-6">
                            <ul className="space-y-3 opacity-70">
                                <li className="flex items-start gap-3 text-sm font-medium">
                                    <Check size={16} className="text-muted-foreground shrink-0" />
                                    Volume ilimitado de imagens
                                </li>
                                <li className="flex items-start gap-3 text-sm font-medium">
                                    <Check size={16} className="text-muted-foreground shrink-0" />
                                    Gerente de conta dedicado
                                </li>
                                <li className="flex items-start gap-3 text-sm font-medium">
                                    <Check size={16} className="text-muted-foreground shrink-0" />
                                    Treinamento de modelo exclusivo
                                </li>
                            </ul>
                        </CardContent>

                        <CardFooter className="pt-6">
                            <Button variant="outline" className="w-full h-12 rounded-xl border-2 font-bold hover:bg-background">
                                <Link href="https://wa.me/seunumeroaqui">
                                    Falar com Especialista
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </div>
    )
}
