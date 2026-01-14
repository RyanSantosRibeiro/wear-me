"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

// --- SUBSCRIPTION ---
interface SubscriptionProps {
    subscription: any | null;
    processing: boolean;
    plans: any[];
}

export const SubscriptionPanel: React.FC<SubscriptionProps> = ({ subscription, processing, plans = [] }) => {
    const router = useRouter()
    const [processingCheckout, setProcessingCheckout] = useState(false)
    const getCheckoutLink = async (plan: string) => {
        setProcessingCheckout(true)
        const url = "/api/v1/mercado-pago/create-checkout-link"
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ plan }),
        })
        const data = await response.json()
        if (data.error) {
            console.error(data.message)
            return null
        }
        router.push(data.checkout_url)
    }


    return (
        <div className="bg-card rounded shadow-sm border border-[#e9edef] overflow-hidden p-6 relative">
            <div className="flex justify-between items-center mb-4 border-b border-[#e9edef] pb-2">
                <h2 className="text-lg font-bold text-[#111b21]">Subscription & Limits</h2>
                {subscription?.status === 'active' && <span className="text-xs bg-primary/5 text-[#008069] font-bold px-2 py-1 rounded uppercase">Active</span>}
                {subscription?.status === 'past_due' && <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-1 rounded uppercase">Past Due</span>}
                {subscription?.status === 'canceled' && <span className="text-xs bg-gray-100 text-gray-500 font-bold px-2 py-1 rounded uppercase">Canceled</span>}
            </div>

            {subscription ? (
                <div className="space-y-6">
                    {/* Plan Info */}
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                            <div className="text-2xl font-bold text-[#111b21]">{subscription.plan_name}</div>
                            <div className="text-sm text-[#667781] mt-1">
                                {subscription.cancel_at_period_end
                                    ? `Access ends on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                                    : `Renews on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                                }
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            {subscription.status === 'past_due' && (
                                <button
                                    type="button"
                                    onClick={() => { }}
                                    disabled={processing}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium shadow-sm transition-colors text-sm flex items-center justify-center gap-2"
                                >
                                    {processing ? 'Generating Link...' : 'Pay Overdue Invoice'}
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </button>
                            )}
                            {subscription.status === 'active' && !subscription.cancel_at_period_end && (
                                <button
                                    type="button"
                                    onClick={() => { }}
                                    disabled={processing}
                                    className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded font-medium transition-colors text-sm"
                                >
                                    {processing ? 'Processing...' : 'Cancel Subscription'}
                                </button>
                            )}
                            {subscription.cancel_at_period_end && (
                                <div className="text-sm text-red-500 font-medium">Cancellation Scheduled</div>
                            )}
                        </div>
                    </div>

                    {/* Limits / Usage */}
                    <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-[#f0f2f5]">
                        {/* Members Limit */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-[#3b4a54]">Team Members</span>
                                <span className="text-[#667781]">{subscription.member_count} / {subscription.member_limit}</span>
                            </div>
                            <div className="w-full bg-[#f0f2f5] rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min((subscription.member_count / subscription.member_limit) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <div className="text-xs text-[#8696a0] mt-1">Users allowed in your workspace</div>
                        </div>

                        {/* Message Tokens Limit */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-[#3b4a54]">Message Tokens</span>
                                <span className="text-[#667781]">{subscription.message_token_usage} / {subscription.message_token_limit}</span>
                            </div>
                            <div className="w-full bg-[#f0f2f5] rounded-full h-2.5 overflow-hidden">
                                <div
                                    className={`h-2.5 rounded-full transition-all duration-500 ${subscription.message_token_usage > subscription.message_token_limit * 0.9 ? 'bg-red-500' : 'bg-[#1ca0b5]'
                                        }`}
                                    style={{ width: `${Math.min((subscription.message_token_usage / subscription.message_token_limit) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <div className="text-xs text-[#8696a0] mt-1">Monthly AI message processing limit</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="py-2">
                    <div className="text-center mb-6">
                        <h3 className="text-lg font-bold text-[#111b21]">Nenhum plano ativo</h3>
                        <p className="text-[#54656f] text-sm">Escolha um plano para liberar todos os recursos da plataforma.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`rounded-xl p-4 flex flex-col border transition-all ${plan.recommended
                                    ? 'border-[#1ca0b5] bg-primary/5/30 shadow-md scale-105 z-10'
                                    : 'border-[#e9edef] bg-white hover:shadow-sm'
                                    }`}
                            >
                                {plan.recommended && (
                                    <div className="text-xs font-bold text-[#1ca0b5] uppercase tracking-wide mb-2 text-center bg-primary/5 py-1 rounded-full w-fit px-3 mx-auto">
                                        Mais Popular
                                    </div>
                                )}
                                <h4 className="text-lg font-bold text-[#111b21] text-center">{plan.name}</h4>
                                <div className="text-center my-3">
                                    <span className="text-2xl font-bold text-[#111b21]">{plan.price}</span>
                                    <span className="text-[#54656f] text-sm">{plan.recurrence == "monthly" ? "/mês" : "/ano"}</span>
                                </div>
                                <div className="text-center my-3">
                                    <span className="text-sm font-bold text-[#111b21]">{plan.description}</span>
                                </div>

                                <ul className="flex-1 space-y-2 mb-6">
                                    {plan?.metadata?.features?.map((feature: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-[#3b4a54]">
                                            <svg className="w-4 h-4 text-[#1ca0b5] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            <span className="leading-tight">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    onClick={() => getCheckoutLink(plan.slug)}
                                    disabled={processingCheckout}
                                    className={`w-full py-2 rounded-lg font-bold text-sm transition-colors`}
                                >
                                    Assinar Agora
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
