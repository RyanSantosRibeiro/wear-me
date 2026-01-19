import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Layers, ShieldCheck, User } from "lucide-react"
import { SubscribeButton } from "./SubscribeButton"
import { PageHeader } from "@/components/PageHeader"

import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { cancelSubscription } from "@/actions/subscription"
import SubscribeCancelButton from "./SubscribeCancelButton"

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
    const { data: subscriptions, error } = await supabase
        .from("subscriptions")
        .select("*, plans(*), payments(*)")
        .eq("user_id", user.id)

    const subscription = subscriptions?.[0]
    const payments = subscription?.payments || []

    console.log("[v0] Subscription:", subscription)
    console.log("[v0] Subscription error:", error)
    const hasActiveSubscription = !!subscription

    // 2. Fetch Available Plans (If no active sub)
    // Filter specifically for "wearme" plans
    let plans: any[] = []
    const { data: plansData, error: plansError } = await supabase
        .from("plans")
        .select("*")
        .eq("is_active", true)
        .eq("sass_slug", "wearme")
        .order("price", { ascending: true })
    plans = plansData || []
    console.log("[v0] Plans:", { plans: plansData, error: plansError })
    // If no plans found in DB, show a friendly message or empty state instructions
    // (Avoiding fallback mock data to respect the 'sass_slug' filter requirement strictly)

    return (
        <div className="space-y-10 p-8 max-w-7xl mx-auto">
            <PageHeader
                title="Assinatura & Planos"
                description="Escolha o plano ideal para aumentar a conversão da sua loja."
            />

            {hasActiveSubscription && (
                <div>
                    {/* Dados da assinatura */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Assinatura Ativa</CardTitle>
                            <CardDescription>Detalhes da sua assinatura atual.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex items-start justify-start flex-col">
                                    <span className="text-muted-foreground">Plano</span>
                                    <span className="font-bold">{subscription.plans.name}</span>
                                </div>
                                <div className="flex items-start justify-start flex-col">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className="font-bold">{subscription.status}</span>
                                </div>
                                <div className="flex items-start justify-start flex-col">
                                    <span className="text-muted-foreground">Periodo</span>
                                    <span className="font-bold">{subscription.period}</span>
                                </div>
                                <div className="flex items-start justify-start flex-col">
                                    <span className="text-muted-foreground">Próxima cobrança</span>
                                    <span className="font-bold">{subscription.next_payment_date}</span>
                                </div>
                                <div>
                                    <SubscribeCancelButton subscriptionId={subscription.id} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Faturas - payments */}
            <div className="overflow-x-auto">
                <h2 className="text-2xl font-bold mb-4">Faturas</h2>
                <Table>
                    <TableHeader className="bg-gray-50/30">
                        <TableRow className="hover:bg-transparent border-gray-50">
                            <TableHead className="w-[180px] font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                                Data / Hora
                            </TableHead>
                            <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                                Plano
                            </TableHead>
                            <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                                Descrição
                            </TableHead>
                            <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                                Período
                            </TableHead>
                            <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                                Status
                            </TableHead>
                            <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-widest text-right">
                                Modo Pagamento
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments && payments.length > 0 ? (
                            payments.map((payment: any) => (
                                <TableRow key={payment.id} className="hover:bg-gray-50/50 transition-colors border-gray-50">
                                    {/* Data / Hora */}
                                    <TableCell className="font-medium text-gray-600 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-gray-400 truncate w-36">
                                                {payment.paid_at ? new Date(payment.paid_at).toLocaleString() : "—"}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Sessão (Usuário ou Plano) */}
                                    <TableCell className="text-sm text-gray-600">
                                        {subscription?.plans?.name || "Plano desconhecido"}
                                    </TableCell>

                                    {/* Produto (Descrição do pagamento ou nome do plano) */}
                                    <TableCell className="text-sm text-gray-600 truncate max-w-xs">
                                        {payment.metadata?.description || "Sem descrição"}
                                    </TableCell>

                                    {/* Período */}
                                    <TableCell className="text-sm text-gray-600">
                                        {payment?.period || "Período desconhecido"}
                                    </TableCell>

                                    {/* Resultado (Status do pagamento) */}
                                    <TableCell className="text-sm font-bold uppercase">
                                        {payment.status === "paid" ? (
                                            <Badge variant="default">Pago</Badge>
                                        ) : (
                                            <Badge variant="destructive">{payment.status || "Desconhecido"}</Badge>
                                        )}
                                    </TableCell>

                                    {/* Modo (Forma de pagamento) */}
                                    <TableCell className="text-sm text-right capitalize">
                                        {payment.metadata?.payment_method_id || payment.payment_type || "N/A"}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                                        <Layers size={48} className="opacity-10" />
                                        <p className="font-bold">Nenhum log encontrado</p>
                                        <p className="text-xs">As atividades dos seus usuários aparecerão aqui.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                </Table>
            </div>

            {/* Ou melhore o plano ou assine */}
            <div className="flex items-center justify-center gap-4 py-10">
                <div className="flex-1 border-t border-border"></div>
                <div className="text-muted-foreground">{hasActiveSubscription ? "Evolua seu plano" : "Assine um plano"}</div>
                <div className="flex-1 border-t border-border"></div>
            </div>

            <div className="grid gap-8 md:grid-cols-3 lg:gap-8 items-stretch mb-20">
                {plans.map((plan) => {
                    const isLuxury = plan.slug?.includes('business');
                    const isFit = plan.slug?.includes('fit');
                    const sameSubscription = plan.id === subscription?.plan_id;
                    return (
                        <Card
                            key={plan.id}
                            className={`relative flex flex-col border-2 transition-all duration-300 hover:shadow-2xl ${isLuxury
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
                                    sameSubscription={sameSubscription}
                                    className={`w-full h-12 rounded-xl text-base font-bold transition-all ${isLuxury
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
        </div>
    )
}
