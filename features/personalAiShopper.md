# 🤖 Personal AI Shopper — Feature Spec

**Status:** Planejamento
**Prioridade:** Próxima feature principal
**Módulo:** Personal Shopper Copilot (módulo separado no Next.js + Supabase)

---

## 📋 Índice

1. [Visão Geral](#1-visão-geral)
2. [Proposta de Valor](#2-proposta-de-valor)
3. [Arquitetura do Sistema](#3-arquitetura-do-sistema)
4. [Funcionalidades](#4-funcionalidades)
5. [SDK por Plataforma](#5-sdk-por-plataforma)
6. [Sistema de Eventos](#6-sistema-de-eventos)
7. [Shopper Persona Engine](#7-shopper-persona-engine)
8. [Motor de Intenção](#8-motor-de-intenção)
9. [Decision Engine (IA + Regras)](#9-decision-engine-ia--regras)
10. [Sistema de Gatilhos](#10-sistema-de-gatilhos)
11. [Widget Copilot (UI)](#11-widget-copilot-ui)
12. [Suporte a Voz](#12-suporte-a-voz)
13. [Dashboard / Analytics para o Lojista](#13-dashboard--analytics-para-o-lojista)
14. [Banco de Dados (Supabase)](#14-banco-de-dados-supabase)
15. [Estrutura de Pastas](#15-estrutura-de-pastas)
16. [API Routes](#16-api-routes)
17. [Evolução Pós-MVP](#17-evolução-pós-mvp)

---

## 1. Visão Geral

O **Personal AI Shopper** é um assistente de compras inteligente que roda como widget dentro do e-commerce do lojista. Ele observa o comportamento do consumidor em tempo real, constrói um perfil dinâmico (persona) e toma ações na interface da loja — como destacar produtos, exibir mensagens proativas, sugerir itens e trocar banners.

> **Conceito-chave:** não é apenas um chatbot. É um **AI Shopping Orchestrator** — a IA orquestra toda a experiência da loja, decidindo o que destacar, quando falar e quando ficar silenciosa.

### Três pilares do MVP

| # | Pilar | Descrição |
|---|---|---|
| 1 | **Capturar comportamento** | SDK no browser coleta eventos de navegação |
| 2 | **Inferir intenção** | Motor de regras + IA analisa contexto e persona |
| 3 | **Executar ações na interface** | SDK aplica mudanças visuais decididas pela IA |

---

## 2. Proposta de Valor

### Para o consumidor final
- Assistente pessoal que ajuda a encontrar o produto certo
- Recomendações personalizadas baseadas em comportamento real
- Chat com IA e suporte por voz
- Experiência de compra mais fluida e confiante

### Para o lojista
- **Personal Shopper AI** → aumenta conversão
- **Behavior Analytics** → insights sobre o público (categorias populares, marcas preferidas, tamanhos mais comuns)
- **Dois produtos em um** → assistente de compra + analytics comportamental

---

## 3. Arquitetura do Sistema

### Fluxo Completo

```
Usuário entra na loja
        ↓
SDK captura eventos (hover, clique, busca, tempo na página)
        ↓
Persona Builder (atualiza perfil local no navegador)
        ↓
Envia eventos para /api/events
        ↓
Supabase (persiste sessão + eventos + persona)
        ↓
Intent Detection (detecta se precisa acionar IA)
        ↓
Context Builder (monta contexto da sessão)
        ↓
Decision Engine (IA decide ações)
        ↓
Retorna ações abstratas
        ↓
SDK executa ações na interface (highlight, mensagem, banner)
```

### Diagrama de Componentes

```
┌─────────────────────────────────────────────┐
│            BROWSER (Loja do cliente)         │
│                                             │
│  ┌──────────────┐    ┌──────────────────┐   │
│  │  Shopper SDK  │    │  Copilot Widget  │   │
│  │ (eventos +    │    │  (chat + voz +   │   │
│  │  ações)       │    │   sugestões)     │   │
│  └──────┬───────┘    └────────┬─────────┘   │
│         │   Persona Builder   │             │
│         │   (localStorage)    │             │
└─────────┼─────────────────────┼─────────────┘
          │                     │
          ▼                     ▼
┌─────────────────────────────────────────────┐
│          BACKEND (Next.js API Routes)       │
│                                             │
│  /api/events    → Recebe e salva eventos    │
│  /api/ai        → Chat com IA              │
│  /api/persona   → Atualiza persona          │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │          Decision Engine             │   │
│  │  ┌─────────────┐ ┌───────────────┐   │   │
│  │  │Intent Detect.│ │Context Builder│   │   │
│  │  └─────────────┘ └───────────────┘   │   │
│  │  ┌─────────────┐ ┌───────────────┐   │   │
│  │  │  Triggers   │ │  AI Agent     │   │   │
│  │  │ (regras)    │ │ (Gemini/GPT)  │   │   │
│  │  └─────────────┘ └───────────────┘   │   │
│  └──────────────────────────────────────┘   │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
            ┌──────────────┐
            │   Supabase   │
            │  sessions    │
            │  events      │
            │  personas    │
            │  ai_actions  │
            └──────────────┘
```

---

## 4. Funcionalidades

### 4.1 Funcionalidades do MVP

| Funcionalidade | Descrição |
|---|---|
| **Chat com IA** | Consumidor pode conversar com o assistente para tirar dúvidas |
| **Assistente proativo** | IA inicia conversa quando detecta hesitação ou interesse forte |
| **Highlight de produtos** | Destaca visualmente produtos relevantes para o usuário |
| **Sugestões personalizadas** | Recomenda produtos com base na persona |
| **Coleta de comportamento** | Rastreia eventos de navegação (hover, clique, busca, tempo) |
| **Personalização de interface** | Troca de banners, reorganização de destaques |
| **Oferta de cupom inteligente** | Identifica hesitação e oferece desconto no momento certo |

### 4.2 Ações que a IA pode executar

```typescript
type AIAction =
  | "highlight_product"    // Destaca um produto na página
  | "suggest_product"      // Sugere um produto no chat
  | "show_message"         // Exibe mensagem proativa
  | "change_banner"        // Troca banner da página
  | "offer_coupon"         // Oferece cupom de desconto
```

### 4.3 Exemplo de resposta da IA

```json
{
  "actions": [
    {
      "type": "highlight_product",
      "productId": "nike_pegasus_42"
    },
    {
      "type": "show_message",
      "message": "Esse modelo é ótimo para corrida longa. Quer que eu mostre opções similares?"
    }
  ]
}
```

---

## 5. SDK por Plataforma

O SDK é **específico por plataforma de e-commerce**, pois cada uma tem sua estrutura DOM e dados.

### Estratégia: começar com uma plataforma, depois expandir

| Plataforma | SDK | Status |
|---|---|---|
| VTEX | `sdk-vtex.js` | 🎯 Prioridade |
| Shopify | `sdk-shopify.js` | Futuro |
| VNDA | `sdk-vnda.js` | Futuro |
| Wake | `sdk-wake.js` | Futuro |

### O que cada SDK sabe sobre a plataforma

- Onde ficam os cards de produto no DOM
- Como detectar a categoria atual
- Como pegar SKU, tamanho, preço
- Como identificar banners e vitrines
- Seletores específicos para aplicar ações visuais

### Responsabilidades do SDK

1. **Capturar eventos** — ouve interações do usuário e envia para a API
2. **Detectar elementos** — identifica cards de produto, categorias, botões
3. **Aplicar ações** — executa as ações retornadas pela IA (highlight, mensagem, etc.)

### Exemplo: Captura de hover em cards de produto

```typescript
document.querySelectorAll("[data-product-card]").forEach(card => {
  card.addEventListener("mouseenter", () => {
    trackEvent("product_hover", {
      productId: card.dataset.productId
    });
  });
});
```

### Exemplo: Aplicação de ação

```typescript
function applyAction(action) {
  switch (action.type) {
    case "highlight_product":
      highlightProduct(action.productId);
      break;
    case "change_banner":
      changeBanner(action.bannerId);
      break;
    case "show_message":
      showChatMessage(action.message);
      break;
    case "offer_coupon":
      showCouponOffer(action.couponCode);
      break;
  }
}
```

---

## 6. Sistema de Eventos

### Tipos de eventos capturados (MVP)

| Evento | Descrição | Peso |
|---|---|---|
| `page_view` | Página visualizada | 1 |
| `product_hover` | Mouse sobre card de produto | 1 |
| `product_view` | Abriu página do produto (PDP) | 3 |
| `product_click` | Clicou em um produto | 3 |
| `search_query` | Realizou uma busca | 2 |
| `category_hover` | Mouse sobre categoria no menu | 1 |
| `add_to_cart` | Adicionou ao carrinho | 5 |
| `cart_click` | Clicou no carrinho (sem comprar) | 2 |
| `time_on_product` | Tempo gasto em uma PDP | variável |

### Payload de evento

```json
{
  "event": "product_hover",
  "productId": "nike_pegasus_42",
  "category": "running",
  "timestamp": "2026-03-13T12:10:00Z"
}
```

### Envio para API

```typescript
function trackEvent(event: string, payload: object) {
  fetch("/api/events", {
    method: "POST",
    body: JSON.stringify({ event, ...payload, sessionId })
  });
}
```

---

## 7. Shopper Persona Engine

A Persona Engine constrói um **perfil comportamental progressivo** do consumidor em tempo real. Cada evento atualiza o perfil.

### Estrutura completa da Persona

```typescript
interface ShopperPersona {
  // Identificação
  userId: string;
  storeId: string;
  sessionId?: string;
  createdAt: string;
  updatedAt: string;

  // Perfil demográfico (inferido)
  demographic: {
    gender?: "male" | "female" | "other" | null;
    ageRange?: "18-25" | "26-35" | "36-45" | "46+" | null;
    location?: string;
  };

  // Preferências de produto (scoring dinâmico)
  preferences: {
    categories: Record<string, number>;    // ex: { "running": 8, "casual": 4 }
    brands: Record<string, number>;        // ex: { "nike": 6, "asics": 3 }
    styles: Record<string, number>;        // ex: { "sporty": 7, "casual": 3 }
    priceSensitivity: "low" | "medium" | "high";
    sizes: Record<string, number>;         // ex: { "42": 5, "43": 2 }
    colors: Record<string, number>;
    materials: Record<string, number>;
    favoriteProducts: string[];
  };

  // Comportamento acumulado
  behavior: {
    eventsCount: number;
    pageViews: Record<string, number>;
    productHover: Record<string, number>;
    productClicks: Record<string, number>;
    searches: Record<string, number>;
    cartInteractions: {
      added: Record<string, number>;
      removed: Record<string, number>;
    };
    dwellTimePerCategory: Record<string, number>;
  };

  // Intenção detectada
  intent: {
    currentIntent?: string;          // ex: "buy_running_shoes"
    confidence?: number;             // 0 a 1
    recentIntents: Array<{
      intent: string;
      confidence: number;
      timestamp: string;
    }>;
  };

  // Insights agregados (para lojista)
  insights: {
    topCategories: string[];
    topBrands: string[];
    priceSegment: "budget" | "mid" | "premium";
    styleProfile: string[];
    preferredSize?: string;
  };

  // Histórico de ações da IA
  aiHistory: Array<{
    timestamp: string;
    actions: Array<{
      type: string;
      target?: string;
      message?: string;
    }>;
  }>;
}
```

### Onde a persona é armazenada

| Local | Propósito |
|---|---|
| **localStorage** | Persona local para personalização imediata (sem latência) |
| **Supabase** | Persistência, analytics e histórico para o lojista |

### Critérios de inferência automática

| Campo | Como é inferido |
|---|---|
| Sensibilidade a preço | Cliques frequentes em produtos baratos → `high` |
| Estilo | Hover em roupas sociais → `formal`; roupas esportivas → `sporty` |
| Gênero provável | Baseado nas categorias mais visitadas |
| Tamanho preferido | Tamanho mais selecionado ou buscado |

### Atualização da persona via eventos

```typescript
function updatePersona(event) {
  if (event.category) {
    persona.preferences.categories[event.category] =
      (persona.preferences.categories[event.category] || 0) + eventWeight;
  }

  if (event.brand) {
    persona.preferences.brands[event.brand] =
      (persona.preferences.brands[event.brand] || 0) + eventWeight;
  }

  localStorage.setItem("shopper_persona", JSON.stringify(persona));
}
```

---

## 8. Motor de Intenção

O motor de intenção **filtra quando a IA deve ser chamada**, evitando chamadas desnecessárias e reduzindo custo em até 95%.

### Regra: nem todo evento aciona a IA

```typescript
function detectIntent(event): { shouldCallAI: boolean } {
  // Busca sempre aciona IA (alta intenção)
  if (event.event === "search_query") {
    return { shouldCallAI: true };
  }

  // Hover simples não aciona IA
  if (event.event === "product_hover") {
    return { shouldCallAI: false };
  }

  // Tempo longo na página → possível hesitação
  if (event.event === "time_on_product" && event.duration > 20) {
    return { shouldCallAI: true };
  }

  // Cliques repetidos no carrinho sem comprar
  if (event.event === "cart_click" && event.count >= 4) {
    return { shouldCallAI: true };
  }

  return { shouldCallAI: false };
}
```

### Context Builder

Quando a IA é acionada, o **Context Builder** monta o contexto da sessão:

```typescript
async function buildContext(sessionId: string) {
  const events = await supabase
    .from("events")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(20);

  const persona = await supabase
    .from("shopper_personas")
    .select("*")
    .eq("session_id", sessionId)
    .single();

  return {
    recentEvents: events,
    persona: persona,
    currentPage: events[0]?.page || "unknown"
  };
}
```

---

## 9. Decision Engine (IA + Regras)

O sistema combina **regras determinísticas** (rápidas e baratas) com **IA generativa** (para casos complexos).

### Prompt base para a IA

```typescript
const prompt = `
You are a personal shopping assistant for an online store.

User persona:
${JSON.stringify(context.persona)}

Recent events:
${JSON.stringify(context.recentEvents)}

Current page: ${context.currentPage}

Decide which actions to take to help this user.

Allowed actions:
- highlight_product (productId)
- suggest_product (productId, reason)
- show_message (text)
- change_banner (bannerId)
- offer_coupon (couponCode)

Respond with a JSON array of actions.
`;
```

### Resposta esperada da IA

```json
{
  "actions": [
    {
      "type": "highlight_product",
      "productId": "nike_pegasus_42"
    },
    {
      "type": "show_message",
      "message": "Vi que você está olhando tênis de corrida. Esse Pegasus é ótimo para treinos longos!"
    }
  ]
}
```

---

## 10. Sistema de Gatilhos

O sistema de gatilhos é **modular e extensível** — adicionar novos gatilhos é apenas definir uma condição e uma ação.

### Estrutura de um gatilho

```typescript
interface Trigger {
  name: string;
  condition: (persona: ShopperPersona) => boolean;
  action: (persona: ShopperPersona) => AIAction;
}
```

### Exemplos de gatilhos prontos

```typescript
const triggers: Trigger[] = [
  {
    name: "offerCouponOnCartHesitation",
    condition: (persona) => {
      const totalClicks = Object.values(persona.behavior.cartInteractions.added)
        .reduce((a, b) => a + b, 0);
      return totalClicks >= 4 && !persona.flags?.offeredCoupon;
    },
    action: () => ({
      type: "offer_coupon",
      message: "Ei! Parece que você está interessado. Que tal 10% de desconto?",
      couponCode: "CUPOM10"
    })
  },

  {
    name: "highlightFavoriteCategory",
    condition: (persona) =>
      (persona.preferences.categories["running"] || 0) > 5,
    action: () => ({
      type: "highlight_category",
      category: "running"
    })
  },

  {
    name: "proactiveHelpOnDwell",
    condition: (persona) =>
      persona.behavior.dwellTimePerCategory["running"] > 30,
    action: () => ({
      type: "show_message",
      message: "Posso ajudar a escolher o tênis ideal para você?"
    })
  },

  {
    name: "suggestCrossSell",
    condition: (persona) =>
      persona.behavior.productClicks["nike_pegasus_42"] >= 2,
    action: () => ({
      type: "suggest_product",
      productId: "nike_socks_42",
      reason: "Combina com o Pegasus que você está vendo!"
    })
  }
];
```

### Executor de gatilhos

```typescript
function runTriggers(persona: ShopperPersona): AIAction[] {
  const actions: AIAction[] = [];

  triggers.forEach(trigger => {
    if (trigger.condition(persona)) {
      actions.push(trigger.action(persona));
    }
  });

  return actions;
}
```

> 💡 **Regras rápidas** (gatilhos) resolvem 90% dos casos sem chamar IA. A IA é acionada apenas para recomendações complexas ou conversas, reduzindo custo drasticamente.

---

## 11. Widget Copilot (UI)

### Componentes visuais

| Componente | Função |
|---|---|
| **Ícone flutuante** | Botão no canto inferior direito para abrir o copilot |
| **Chat Panel** | Interface de conversa com a IA |
| **Sugestões rápidas** | Cards de produtos sugeridos |
| **Notificação proativa** | Balão com mensagem da IA |

### Acionamento do copilot

A IA pode ser acionada em 3 situações:

1. **Usuário pergunta** → abre chat (texto ou voz)
2. **Sistema detecta intenção** → ex: hover repetido no mesmo produto
3. **Abandono de decisão** → ex: 20+ segundos olhando produtos sem interagir

### Exemplo de Widget

```tsx
function ShopperWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center"
      >
        <Sparkles size={24} />
      </button>

      {open && <ChatPanel />}
    </div>
  );
}
```

---

## 12. Suporte a Voz

### Tecnologias

| Direção | Tecnologia |
|---|---|
| **Voz → Texto (STT)** | Web Speech API (nativa do browser) |
| **Texto → Voz (TTS)** | ElevenLabs (voz natural e realista) |

### Fluxo

```
Voz do usuário
      ↓
Speech-to-Text (Web Speech API)
      ↓
Texto enviado para IA
      ↓
IA responde com texto
      ↓
Text-to-Speech (ElevenLabs)
      ↓
Voz sintetizada reproduzida
```

---

## 13. Dashboard / Analytics para o Lojista

A persona acumulada de todos os usuários gera **insights comerciais** no dashboard do lojista.

### Métricas disponíveis

| Métrica | Exemplo |
|---|---|
| **Categorias mais populares** | Running (42%), Casual (31%), Training (19%) |
| **Marcas favoritas** | Nike, Adidas, Asics |
| **Tamanhos mais comuns** | 41, 42, 40 |
| **Segmento de preço** | Budget (20%), Mid (55%), Premium (25%) |
| **Estilo dominante** | Sporty, Casual |
| **Intents mais comuns** | "buy_running_shoes", "compare_brands" |
| **Eficácia dos gatilhos** | Cupom oferecido → 35% de conversão |

### Insights de sequência de navegação

A sequência de navegação revela **intenção real de compra**:

```
home → categoria running → nike → asics → produto premium
```

Padrão = comparando marcas antes de comprar item premium.

---

## 14. Banco de Dados (Supabase)

### Tabela: `sessions`

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  store_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela: `events`

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  event_type TEXT NOT NULL,
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela: `shopper_personas`

```sql
CREATE TABLE shopper_personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  store_id TEXT NOT NULL,
  preferred_categories JSONB DEFAULT '{}',
  favorite_brands JSONB DEFAULT '{}',
  price_sensitivity TEXT DEFAULT 'medium',
  style_tags TEXT[] DEFAULT '{}',
  sizes JSONB DEFAULT '{}',
  behavior JSONB DEFAULT '{}',
  intent JSONB DEFAULT '{}',
  insights JSONB DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela: `ai_actions`

```sql
CREATE TABLE ai_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  action JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 15. Estrutura de Pastas

```
/app
  /api
    /ai/route.ts                    # Chat com IA
    /events/route.ts                # Recebe eventos do SDK
    /persona/update/route.ts        # Atualiza persona no Supabase

/lib
  /ai
    decisionEngine.ts               # Decide ações (IA + regras)
    intentDetection.ts              # Detecta se precisa acionar IA
    triggers.ts                     # Gatilhos determinísticos
  /context
    buildContext.ts                 # Monta contexto da sessão
  /actions
    actionTypes.ts                  # Tipos de ações

/sdk
  shopper-sdk.ts                   # SDK genérico
  platforms/
    vtex.ts                        # Adaptador VTEX
    shopify.ts                     # Adaptador Shopify (futuro)

/components
  ShopperWidget.tsx                # Widget flutuante
  ChatPanel.tsx                    # Painel de chat

/hooks
  useShopper.ts                    # Hook React para o widget

/types
  events.ts                        # Tipos de eventos
  actions.ts                       # Tipos de ações
  persona.ts                       # Interface ShopperPersona
```

---

## 16. API Routes

| Rota | Método | Descrição |
|---|---|---|
| `/api/events` | `POST` | Recebe eventos do SDK, salva no Supabase, detecta intenção |
| `/api/ai` | `POST` | Chat direto com a IA (pergunta do usuário) |
| `/api/persona/update` | `POST` | Atualiza persona do usuário no Supabase |

### Fluxo do endpoint `/api/events`

```typescript
export async function POST(req: Request) {
  const body = await req.json();

  // 1. Salva evento no Supabase
  await supabase.from("events").insert(body);

  // 2. Roda gatilhos determinísticos (sem IA)
  const triggerActions = runTriggers(persona);
  if (triggerActions.length > 0) {
    return Response.json({ actions: triggerActions });
  }

  // 3. Detecta se precisa chamar IA
  const intent = detectIntent(body);
  if (intent.shouldCallAI) {
    const context = await buildContext(body.sessionId);
    const decision = await runAIDecision(context);
    return Response.json(decision);
  }

  // 4. Nenhuma ação necessária
  return Response.json({ actions: [] });
}
```

---

## 17. Evolução Pós-MVP

### Fase 2 — Inteligência avançada

- [ ] Personas probabilísticas com ML (aprender com poucos eventos)
- [ ] Clusters de estilo (agrupar personas similares)
- [ ] Cross-sell automático baseado em favoritos da persona
- [ ] Histórico temporal (eventos recentes pesam mais)
- [ ] Modelo de dados universal para catálogo de produtos

### Fase 3 — Escala

- [ ] SDKs para Shopify, VNDA, Wake
- [ ] Sistema de recomendação sem IA (resolve 90% dos casos)
- [ ] Prompt otimizado para personal shopper real
- [ ] White-label para agências
- [ ] A/B testing de gatilhos

### Fase 4 — Premium

- [ ] Voz natural com ElevenLabs
- [ ] Integração com WhatsApp (pós-compra)
- [ ] Dashboard avançado com funil comportamental
- [ ] Payouts automáticos de parceiros

---

> 💡 **Decisão mais importante:** começar com SDK para **uma plataforma** (VTEX). Isso resolve o maior problema de startups de AI commerce: **integração com dados da loja**.