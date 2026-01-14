"use client"

import { Building2, CreditCard, Settings, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface CompanyDetailsProps {
  company: any
}

export function CompanyDetails({ company }: CompanyDetailsProps) {
  const subscription = company.subscriptions?.[0]
  const plan = subscription?.plan

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>{company.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {company.slug}
            </p>
          </div>
        </div>

        {subscription && (
          <Badge variant={subscription.status === "active" ? "default" : "secondary"}>
            {subscription.status === "active" ? "Plano ativo" : subscription.status}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Plano */}
        <div>
          <p className="text-sm text-muted-foreground">Plano atual</p>
          <p className="font-medium">
            {plan
              ? `${plan.name} — R$ ${plan.price}/${plan.recurrence === "monthly" ? "mês" : "ano"}`
              : "Sem assinatura"}
          </p>
        </div>

        {/* Ações */}
        <div className="flex flex-wrap gap-2">
          {!subscription && (
            <Button>
              <CreditCard className="mr-2 h-4 w-4" />
              Assinar plano
            </Button>
          )}

          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" />
            Membros
          </Button>

          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
