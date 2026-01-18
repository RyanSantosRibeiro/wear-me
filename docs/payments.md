Ótimo contexto — com esse schema dá pra criar uma **tabela `payments` bem sólida**, que sirva como **fonte única de verdade** para:

* ✅ pagamentos recorrentes (subscriptions)
* ✅ pagamentos avulsos (one-off)
* ✅ parceiros / cupons
* ✅ conciliação financeira
* ✅ auditoria

Vou te entregar **3 coisas**:

1. **Modelo mental (como pensar a tabela)**
2. **Campos recomendados e por quê**
3. **SQL pronto para Supabase**

---

## 1️⃣ Modelo mental correto (importante)

Hoje você já tem:

* `subscriptions` → estado do plano
* `payment_logs` → eventos (webhook, histórico técnico)

👉 O que está faltando é uma tabela **financeira canônica**, algo como:

> **“Cada linha representa um pagamento que gerou ou deveria gerar dinheiro.”**

Essa tabela:

* não substitui `payment_logs`
* não substitui `subscriptions`
* **consolida valores reais**

---

## 2️⃣ Tabela `payments` — conceito

### Ela deve responder perguntas como:

* Quanto faturamos este mês?
* Quanto veio de assinatura vs avulso?
* Quanto pagar de comissão para parceiros?
* Qual pagamento pertence a qual subscription?
* Qual falhou / foi estornado?

---

## 3️⃣ Estrutura recomendada da tabela `payments`

### Tipos de pagamento suportados

* `subscription` → recorrente
* `one_time` → avulso (ex: imagens extras)
* `setup` → onboarding, taxa inicial (opcional)
* `refund` → estorno

---

## 4️⃣ SQL — tabela `payments`

```sql
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),

  -- Relacionamentos
  user_id uuid NOT NULL,
  subscription_id uuid,
  plan_id uuid,
  partner_id uuid,
  coupon_id uuid,

  -- Tipo do pagamento
  payment_type text NOT NULL CHECK (
    payment_type IN ('subscription', 'one_time', 'setup', 'refund')
  ),

  -- Gateway
  provider text NOT NULL DEFAULT 'mercado_pago',
  provider_payment_id text,
  provider_subscription_id text,

  -- Valores
  amount_gross numeric NOT NULL, -- valor total cobrado
  amount_net numeric,            -- valor após taxas (opcional)
  currency text NOT NULL DEFAULT 'BRL',

  -- Comissão
  commission_pct numeric,
  commission_amount numeric,

  -- Status financeiro
  status text NOT NULL CHECK (
    status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')
  ),

  -- Datas
  paid_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  -- Metadados flexíveis
  metadata jsonb DEFAULT '{}'::jsonb,

  CONSTRAINT payments_pkey PRIMARY KEY (id),

  -- FKs
  CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT payments_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id),
  CONSTRAINT payments_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.plans(id),
  CONSTRAINT payments_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.partners(id),
  CONSTRAINT payments_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES public.coupons(id)
);
```

---

## 5️⃣ Como usar na prática (exemplos reais)

### 🔁 Pagamento mensal de subscription

```text
payment_type: subscription
subscription_id: X
plan_id: Y
amount_gross: 789
status: paid
paid_at: now()
```

---

### 📸 Compra avulsa de imagens

```text
payment_type: one_time
subscription_id: null
plan_id: null
amount_gross: 90
status: paid
metadata: { "images": 100 }
```

---

### 🤝 Pagamento com parceiro

```text
partner_id: Z
commission_pct: 0.30
commission_amount: 236.70
```

---

### 🔄 Estorno

```text
payment_type: refund
amount_gross: -789
status: refunded
```

---

## 6️⃣ Por que manter `payment_logs` separado?

Boa decisão manter os dois:

| payments               | payment_logs      |
| ---------------------- | ----------------- |
| financeiro             | técnico           |
| valor final            | payload webhook   |
| usado em relatórios    | usado para debug  |
| uma linha por cobrança | múltiplos eventos |

👉 **Nunca misture essas responsabilidades.**

---

## 7️⃣ Índices recomendados (performance)

```sql
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_subscription_id ON public.payments(subscription_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_created_at ON public.payments(created_at);
```

---

## 8️⃣ Próximo nível (opcional, mas poderoso)

Se quiser escalar bem, depois você pode adicionar:

* `payouts` → quando pagar parceiros
* `ledger_entries` → contabilidade dupla
* view `monthly_revenue`

---

### ✅ Conclusão

Essa `payments`:

* resolve subscription + avulso
* conversa com parceiros e cupons
* é compatível com SaaS sério
* não conflita com o que você já tem

Se quiser, no próximo passo posso:

* criar **view de MRR**
* criar **cálculo automático de comissão**
* sugerir **RLS segura**
* mapear **webhooks → payments**

Só me diga o próximo passo.
