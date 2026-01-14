import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, ShieldCheck } from "lucide-react"
import { SubscribeButton } from "./SubscribeButton"

export default async function SubscriptionPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth/login")
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

    // If no plans found in DB, show a friendly message or empty state instructions
    // (Avoiding fallback mock data to respect the 'sass_slug' filter requirement strictly)

    return (
        <div className="space-y-10 p-8 max-w-7xl mx-auto">
            <div className="flex flex-col gap-2 border-b border-border/50 pb-8">
                <h1 className="text-4xl font-black tracking-tight text-foreground">Assinatura & Planos</h1>
                <p className="text-lg text-muted-foreground font-medium">Escolha o plano ideal para aumentar a conversão da sua loja.</p>
            </div>

            {hasActiveSubscription ? (
                <div className="max-w-3xl">
                    <Card className="border-2 border-primary/20 bg-primary/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ShieldCheck size={120} />
                        </div>
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <Badge className="text-sm px-3 py-1 font-bold" variant="default">ATIVO</Badge>
                                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                    {subscription.plans?.recurrence || 'Mensal'}
                                </span>
                            </div>
                            <CardTitle className="text-3xl font-black">{subscription.plans?.name || 'Plano Premium'}</CardTitle>
                            <CardDescription className="text-lg font-medium text-muted-foreground">
                                Sua assinatura renova em {subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : 'breve'}.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="p-4 bg-background/50 rounded-xl border border-border">
                                    <p className="text-xs font-bold text-muted-foreground uppercase">Valor</p>
                                    <p className="text-xl font-black">R$ {subscription.plans?.price || '0,00'} <span className="text-sm font-medium text-muted-foreground">/mês</span></p>
                                </div>
                                <div className="p-4 bg-background/50 rounded-xl border border-border">
                                    <p className="text-xs font-bold text-muted-foreground uppercase">Status</p>
                                    <p className="text-xl font-black capitalise text-green-600 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        {subscription.status}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-4 border-t border-border/10 pt-6">
                            <Button variant="outline" className="font-bold">Baixar Faturas</Button>
                            <Button variant="destructive" className="font-bold bg-destructive/10 text-destructive hover:bg-destructive/20 border-transparent">
                                Cancelar Assinatura
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
                    {plans.length > 0 ? (
                        plans.map((plan) => (
                            <Card
                                key={plan.id}
                                className={`relative flex flex-col border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${plan.metadata?.is_popular ? 'border-primary shadow-xl scale-105 z-10' : 'border-border'}`}
                            >
                                {plan.metadata?.is_popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-primary hover:bg-primary text-primary-foreground text-xs px-4 py-1.5 font-bold uppercase tracking-widest shadow-lg">
                                            Mais Escolhido
                                        </Badge>
                                    </div>
                                )}

                                <CardHeader className="text-center pb-2">
                                    <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                                    <div className="flex items-baseline justify-center gap-1 mt-4 mb-2">
                                        <span className="text-sm font-bold text-muted-foreground">R$</span>
                                        <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                                        <span className="text-sm font-bold text-muted-foreground">/mês</span>
                                    </div>
                                    <CardDescription className="text-sm font-medium leading-relaxed px-4">
                                        {plan.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1 mt-6">
                                    {plan.features ? (
                                        <ul className="space-y-3">
                                            {(plan.metadata?.features || plan.features || []).map((feature: string, i: number) => (
                                                <li key={i} className="flex items-start gap-3 text-sm font-medium text-muted-foreground text-left">
                                                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                                        <Check size={12} className="text-green-600 font-bold" />
                                                    </div>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">Confira os detalhes no site.</p>
                                    )}
                                </CardContent>

                                <CardFooter className="pt-6">
                                    <SubscribeButton
                                        planId={plan.id}
                                        planName={plan.name}
                                        isPopular={!!plan.metadata?.is_popular}
                                        className={`w-full h-12 rounded-xl text-base font-bold ${plan.metadata?.is_popular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                                    />
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-10">
                            <p className="text-muted-foreground font-medium">Nenhum plano disponível no momento.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
