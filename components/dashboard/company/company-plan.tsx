"use client"

import { CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function CompanyPlan({ company }: { company: any }) {
  const subscription = company.subscriptions?.[0]
  const plan = subscription?.plan

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Plano</CardTitle>
        {subscription && (
          <Badge>{subscription.status === "active" ? "Ativo" : subscription.status}</Badge>
        )}
      </CardHeader>

      <CardContent className="flex items-center justify-between">
        <div>
          <p className="font-medium">
            {plan
              ? `${plan.name} — R$ ${plan.price}/${plan.recurrence === "monthly" ? "mês" : "ano"}`
              : "Sem plano ativo"}
          </p>
          {subscription?.current_period_end && (
            <p className="text-sm text-muted-foreground">
              Renova em {new Date(subscription.current_period_end).toLocaleDateString()}
            </p>
          )}
        </div>

        {!subscription && (
          <Button>
            <Link href="/dashboard/billing">
              <CreditCard className="mr-2 h-4 w-4" />
              Assinar plano
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
