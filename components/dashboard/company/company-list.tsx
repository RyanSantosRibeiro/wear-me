"use client"

import { Building2, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CompanyListProps {
  companies: any[]
  plans: any[]
}

export function CompanyList({ companies, plans }: CompanyListProps) {
  if (companies.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhuma empresa cadastrada ainda.</p>
  }

  return (
    <div className="space-y-4">
      {companies.map((company) => {
        const subscription = company.subscriptions?.[0]
        const plan = subscription?.plan

        return (
          <div key={company.id} className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{company.name}</p>
                  {subscription && (
                    <Badge variant={subscription.status === "active" ? "default" : "secondary"}>
                      {subscription.status === "active" ? "Ativo" : subscription.status}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {plan
                    ? `Plano ${plan.name} - R$ ${plan.price}/${plan.recurrence === "monthly" ? "mês" : "ano"}`
                    : "Sem assinatura"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {!subscription && (
                <Button variant="outline" size="sm">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Assinar
                </Button>
              )}
              <Button variant="outline" size="sm">
                Gerenciar
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
