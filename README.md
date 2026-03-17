<p align="center">
  <img src="public/favicon.png" alt="WearMe Logo" width="120" />
</p>

<h1 align="center">👗 WearMe — Provador Virtual com IA</h1>

<p align="center">
  <strong>Widget plug-and-play de Virtual Try-On para e-commerces</strong><br/>
  Aumente conversões, reduza devoluções e encante seus clientes.
</p>

<p align="center">
  <a href="https://vercel.com/ryan-dos-santos-ribeiros-projects/v0-saa-s-system-setup"><img src="https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel" alt="Deployed on Vercel" /></a>
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/TypeScript-Typed-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
</p>

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Produtos / Widgets](#-produtos--widgets)
- [Arquitetura](#️-arquitetura)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Começando](#-começando)
- [Configuração de Ambiente](#️-configuração-de-ambiente)
- [Banco de Dados](#️-banco-de-dados)
- [API Routes](#-api-routes)
- [Integração dos Widgets](#-integração-dos-widgets)
- [Planos e Assinaturas](#-planos-e-assinaturas)
- [Programa de Parceiros](#-programa-de-parceiros)
- [Roadmap](#-roadmap)

---

## 🎯 Visão Geral

**WearMe** é uma plataforma **SaaS B2B** que disponibiliza widgets de **provador virtual** e **recomendação de tamanho** para lojas online. O sistema permite que o consumidor final:

- 📸 **Envie uma foto** e veja como a roupa ficaria nele (Try-On com IA)
- 📏 **Descubra seu tamanho ideal** com base em altura, peso e preferências (FindMySize)
- 📊 **Consulte tabelas de medidas** interativas diretamente na PDP
- 👗 **Monte looks combinados** selecionando peças de diferentes páginas (Buy Together)

### Por que usar o WearMe?

| Problema | Solução WearMe |
|---|---|
| Alta taxa de devolução por tamanho errado | Recomendação inteligente de tamanho |
| Clientes inseguros no checkout | Provador Virtual mostra o resultado antes da compra |
| Baixa conversão na PDP | Widget interativo aumenta engajamento |
| Ticket médio baixo | "Monte seu Look" incentiva compra de múltiplos itens |

---

## 🧩 Produtos / Widgets

### 1. 🪄 Provador Virtual (`WearMe.js`)
Script JavaScript (Vanilla) que injeta um botão "Provador Virtual" na PDP da loja. Ao clicar, abre um modal onde o cliente envia sua foto e a IA gera uma imagem realista vestindo a roupa.

```html
<script src="https://wearme.vercel.app/WearMe.js"></script>
<script>
  Wearme.init({
    apiKey: 'sua_api_key',
    productImage: 'https://sua-loja.com/produto.jpg',
    buttonSelector: '#wearme-btn'
  });
</script>
<div id="wearme-btn"></div>
```

**Fluxo:**
1. Renderiza o botão na PDP
2. Cliente clica → abre o modal
3. Cliente faz upload de foto de corpo inteiro
4. IA processa e gera a imagem com a roupa
5. Cliente visualiza o resultado e pode baixar ou comprar

---

### 2. 📏 FindMySize (`WearMeFindMySize.js` / `findMySizeClothing.js`)
Motor de recomendação de tamanho **determinístico** (sem ML) que analisa dados corporais do cliente e cruza com dados da marca/produto para sugerir o tamanho ideal.

```html
<script src="https://wearme.vercel.app/WearMeFindMySize.js"></script>
<script>
  FindMySize.init({
    apiKey: 'sua_api_key',
    buttonSelector: '#find-my-size',
    targetBrandId: 1,
    productImage: 'https://...',
    productName: 'Ultraboost Light'
  });
</script>
```

**Motor de Score:**
- Estima comprimento do pé/corpo baseado em altura, peso, sexo e idade
- Normaliza pela fôrma da marca (pequena / normal / grande)
- Calcula score por tamanho considerando preferência de fit
- Aplica ajustes cross-brand baseado em histórico
- Score ≥ 0.85 → "Alta confiança" | 0.7–0.85 → "Boa opção"

Suporta **calçados** e **roupas** com scripts dedicados.

---

### 3. 📊 Tabela de Medidas (`WearMeSizeChart.js` / `sizeChartClothing.js`)
Widget que exibe tabelas de medidas interativas e arquivos PDF para impressão, diretamente na PDP.

```html
<script src="https://wearme.vercel.app/WearMeSizeChart.js"></script>
<script>
  WearmeSizeChart.init({
    apiKey: 'sua_api_key',
    tableId: '5',
    buttonSelector: '#size-chart'
  });
</script>
```

---

### 4. 👗 Monte seu Look (`WearMeBuyTogether.js`)
Widget que permite ao cliente selecionar peças de diferentes páginas e gerar um "look completo" com IA.

```html
<script src="https://wearme.vercel.app/WearMeBuyTogether.js"></script>
<script>
  window.WearmeBuy.init({
    apiKey: 'sua_api_key'
  });
</script>

<!-- Em cada produto: -->
<button class="wearme-add"
  data-wearme-id="sku-123"
  data-wearme-image="https://loja.com/produto.jpg"
  data-wearme-name="Camiseta Básica">
  Adicionar ao Look
</button>
```

**Funcionalidades:**
- Toggle de itens via `sessionStorage`
- Botão flutuante com badge e contagem
- Modal de seleção com preview
- Geração de look com IA
- Links para compra dos itens

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    E-COMMERCE (Loja)                     │
│                                                         │
│  ┌──────────┐ ┌───────────┐ ┌───────────┐ ┌──────────┐ │
│  │ WearMe.js│ │FindMySize │ │ SizeChart │ │BuyTogeth.│ │
│  │ (Try-On) │ │   .js     │ │   .js     │ │   .js    │ │
│  └────┬─────┘ └─────┬─────┘ └─────┬─────┘ └────┬─────┘ │
└───────┼─────────────┼─────────────┼─────────────┼───────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────┐
│              WearMe API (Next.js API Routes)            │
│                                                         │
│  /api/wearme/generate      → Try-On com IA              │
│  /api/wearme/generate-look → Look completo com IA       │
│  /api/wearme/recommend     → Recomendação de tamanho    │
│  /api/wearme/size-chart    → Tabelas de medidas         │
│  /api/wearme/status        → Status da API Key          │
│  /api/v1/mercado-pago      → Webhooks de pagamento      │
│  /api/v1/subscriptions     → Gestão de assinaturas      │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ Supabase │ │ Google   │ │  Gemini  │
  │   (DB)   │ │ Cloud    │ │   (IA)   │
  │          │ │ Storage  │ │          │
  └──────────┘ └──────────┘ └──────────┘
```

### Fluxo do Lojista (Admin)
1. **Cadastro:** Lojista cria conta na plataforma
2. **Onboarding:** Preenche dados da loja
3. **Assinatura:** Contrata um plano (Básico / Pro / Enterprise)
4. **API Key:** Recebe chave para integrar os widgets
5. **Dashboard:** Monitora uso, métricas e gerencia assinatura

### Fluxo do Widget (Client-Side)
1. Lojista importa o script JS no site
2. Widget renderiza UI na PDP
3. Cliente interage (upload foto / preenche dados)
4. Widget envia request autenticada com `apiKey`
5. Backend valida key, checa quota e processa
6. Resultado é exibido no modal do widget

---

## 🛠 Stack Tecnológico

| Camada | Tecnologia |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Linguagem** | TypeScript |
| **UI/Styling** | Tailwind CSS 4, Radix UI Primitives |
| **Componentes** | shadcn/ui (Button, Dialog, Select, Tabs, Toast, etc.) |
| **Backend** | Next.js API Routes (Serverless) |
| **Banco de Dados** | Supabase (PostgreSQL + Auth + Storage + RLS) |
| **IA / Generative** | Google Gemini (`@google/generative-ai`) |
| **Pagamentos** | MercadoPago (Webhooks) |
| **Charts** | Recharts |
| **Deploy** | Vercel |
| **Analytics** | Vercel Analytics |
| **Widgets (Embed)** | JavaScript Vanilla (leve e compatível) |
| **Validação** | Zod + React Hook Form |
| **Cache Client** | IndexedDB (para cache de gerações no widget) |

---

## 📁 Estrutura do Projeto

```
wear-me/
├── app/                        # Next.js App Router
│   ├── api/                    # API Routes
│   │   ├── wearme/             # APIs dos Widgets
│   │   │   ├── generate/       # Try-On (IA)
│   │   │   ├── generate-look/  # Look Completo (IA)
│   │   │   ├── recommend/      # Recomendação de Tamanho
│   │   │   ├── size-chart/     # Tabelas de Medidas
│   │   │   └── status/         # Status da API Key
│   │   ├── invite/             # Convites
│   │   ├── plans/              # Planos
│   │   ├── recovery-password/  # Recuperação de senha
│   │   └── v1/                 # APIs v1
│   │       ├── mercado-pago/   # Webhooks MercadoPago
│   │       └── subscriptions/  # Assinaturas
│   ├── auth/                   # Páginas de autenticação
│   ├── dashboard/              # Painel Administrativo
│   │   ├── company/            # Gestão de empresa
│   │   ├── logs/               # Logs de uso
│   │   ├── partners/           # Programa de parceiros
│   │   ├── settings/           # Configurações
│   │   ├── subscription/       # Assinatura
│   │   └── tabela-de-medidas/  # Gerenciador de tabelas
│   ├── login/                  # Página de login
│   ├── signup/                 # Página de cadastro
│   ├── onboarding/             # Fluxo de onboarding
│   ├── recovery/               # Recuperação de senha
│   ├── guia-de-tamanhos/       # Guia público de tamanhos
│   └── page.tsx                # Landing page principal
│
├── actions/                    # Server Actions (Next.js)
│   ├── auth.ts                 # Autenticação
│   ├── cms.ts                  # CMS (páginas/seções)
│   ├── contacts.ts             # Contatos
│   ├── notifications.ts        # Notificações
│   ├── projects.ts             # Projetos
│   ├── sections.ts             # Seções
│   ├── storage.ts              # Storage
│   └── subscription.ts         # Assinaturas
│
├── components/                 # Componentes React
│   ├── Hero.tsx                # Hero da landing page
│   ├── FindMySizeDemo.tsx      # Demo do FindMySize
│   ├── wearme-widget.tsx       # Widget Try-On (React)
│   ├── onboarding.tsx          # Fluxo de onboarding
│   ├── CodeSnippet.tsx         # Exibição de código
│   ├── dashboard/              # Componentes do dashboard
│   ├── auth/                   # Componentes de auth
│   ├── scripts/                # Snippets de integração
│   └── ui/                     # shadcn/ui + scripts sections
│       ├── wearme-script-section.tsx
│       ├── findmysize-script-section.tsx
│       └── buytogether-script-section.tsx
│
├── lib/                        # Bibliotecas e utilitários
│   ├── supabase/               # Client Supabase (server/client)
│   ├── mercadopago/            # Integração MercadoPago
│   ├── types.ts                # Tipos TypeScript
│   ├── utils.ts                # Utilitários (cn, etc.)
│   └── wearme-storage.ts       # Cache IndexedDB
│
├── public/                     # Assets estáticos + Widgets JS
│   ├── WearMe.js               # Widget Provador Virtual
│   ├── WearMeFindMySize.js     # Widget FindMySize (calçados)
│   ├── WearMeSizeChart.js      # Widget Tabela de Medidas
│   ├── WearMeBuyTogether.js    # Widget Monte seu Look
│   ├── findMySizeClothing.js   # FindMySize (roupas)
│   ├── sizeChartClothing.js    # Tabela de Medidas (roupas)
│   └── test-widget.html        # Página de teste dos widgets
│
├── scripts/                    # SQL Migrations
│   ├── 001_create_schema.sql   # Schema principal
│   ├── 002_create_triggers.sql # Triggers
│   ├── 003_seed_plans.sql      # Seed dos planos
│   └── 004_create_wearme_logs.sql
│
├── docs/                       # Documentação
│   ├── context.md              # Visão geral do projeto
│   ├── apps.md                 # Arquitetura MVP dos widgets
│   ├── buyTogether.md          # Spec do Buy Together
│   ├── calculoTamanho.md       # Cálculo de tamanho
│   ├── payments.md             # Sistema de pagamentos
│   ├── partner.md              # Programa de parcerias
│   ├── posts.md                # Sistema de posts
│   └── terms.md                # Termos de uso
│
├── features/                   # Specs de features
│   └── findMySize.md           # Motor de recomendação
│
├── template_email/             # Templates de email
│   ├── confirmation.html       # Confirmação de conta
│   └── invite.html             # Convite para empresa
│
└── utils/                      # Utilitários auxiliares
    ├── helpers.ts              # Helpers gerais
    ├── eazyzap/                # Integração WhatsApp
    ├── prompts/                # Prompts de IA
    └── supabase/               # Utils Supabase
```

---

## 🚀 Começando

### Pré-requisitos

- **Node.js** 18+
- **npm** ou **yarn** ou **pnpm**
- Conta no **Supabase** (banco de dados)
- Conta no **MercadoPago** (pagamentos)
- API Key do **Google Gemini** (IA generativa)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/RyanSantosRibeiro/wear-me.git
cd wear-me

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.local.example .env.local
# Edite .env.local com suas credenciais

# 4. Rode o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

---

## ⚙️ Configuração de Ambiente

Crie um arquivo `.env.local` na raiz com as seguintes variáveis:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key

# Google Gemini (IA)
GOOGLE_GENERATIVE_AI_KEY=sua_chave_gemini

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=seu_access_token
MERCADOPAGO_WEBHOOK_SECRET=seu_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🗄️ Banco de Dados

O projeto usa **Supabase (PostgreSQL)** com Row Level Security (RLS). Os scripts de migração estão em `/scripts/`:

### Tabelas Principais

| Tabela | Descrição |
|---|---|
| `profiles` | Perfis de usuários (nome, avatar, role) |
| `companies` | Empresas/Lojas cadastradas |
| `company_members` | Relação empresa ↔ usuários |
| `plans` | Planos de assinatura disponíveis |
| `subscriptions` | Assinaturas ativas das empresas |
| `payments` | Registros financeiros |
| `payment_logs` | Logs técnicos de webhooks |

### Executando as Migrations

```bash
# Rode os scripts na ordem no SQL Editor do Supabase
# 001_create_schema.sql   → Cria tabelas, RLS e policies
# 002_create_triggers.sql → Cria triggers automáticos
# 003_seed_plans.sql      → Insere planos padrão
# 004_create_wearme_logs.sql → Logs de uso dos widgets
```

---

## 🔌 API Routes

### Widget APIs

| Rota | Método | Descrição |
|---|---|---|
| `/api/wearme/generate` | `POST` | Gera imagem de try-on com IA |
| `/api/wearme/generate-look` | `POST` | Gera look completo com múltiplas peças |
| `/api/wearme/recommend` | `POST` | Recomendação de tamanho |
| `/api/wearme/size-chart` | `GET` | Retorna tabela de medidas |
| `/api/wearme/status` | `GET` | Verifica status da API Key |

### Payload — Try-On (`/api/wearme/generate`)

```http
POST /api/wearme/generate
Content-Type: multipart/form-data

apiKey: string        # API Key do lojista
productImage: string  # URL da imagem do produto
userImage: File       # Foto do cliente
mode: string          # 'front' | 'angles'
```

### Admin APIs

| Rota | Método | Descrição |
|---|---|---|
| `/api/v1/mercado-pago` | `POST` | Webhook de pagamentos |
| `/api/v1/subscriptions` | `*` | CRUD de assinaturas |
| `/api/plans` | `GET` | Lista de planos |
| `/api/invite` | `POST` | Envio de convites |

---

## 🧩 Integração dos Widgets

Os widgets são scripts **JavaScript Vanilla** (sem dependências) servidos como arquivos estáticos. A integração é feita em 3 passos:

### 1️⃣ Importar o SDK

```html
<script src="https://wearme.vercel.app/WearMe.js"></script>
```

### 2️⃣ Inicializar com sua API Key

```html
<script>
  Wearme.init({
    apiKey: 'pk_live_xxx',
    productImage: 'https://loja.com/produto.jpg',
    buttonSelector: '#wearme-btn',
    highlightColor: '#ff92b5'  // opcional
  });
</script>
```

### 3️⃣ Adicionar o elemento alvo no HTML

```html
<div id="wearme-btn"></div>
```

> ✅ Funciona em **qualquer plataforma**: Shopify, VTEX, WooCommerce, Nuvemshop, etc.

---

## 💰 Planos e Assinaturas

| Plano | Preço | Recursos |
|---|---|---|
| **Básico** | R$ 29,90/mês | Até 5 usuários, Dashboard, Relatórios básicos, Suporte por email |
| **Pro** | R$ 79,90/mês | Até 20 usuários, Relatórios avançados, Suporte prioritário, Acesso à API |
| **Enterprise** | R$ 199,90/mês | Usuários ilimitados, Integrações custom, Gerente dedicado, Suporte 24/7 |

**Pagamentos processados via MercadoPago** (Webhooks para ativação automática).

---

## 🤝 Programa de Parceiros

O WearMe possui um programa de parcerias com dois perfis:

### Agências de Marketing
- **Comissão:** 25% recorrente por 12 meses
- White-label light disponível
- Dashboard exclusivo de acompanhamento

### Indicadores / Influencers
- **Comissão:** 10% recorrente por 12 meses
- Sem envolvimento no suporte
- Link/código exclusivo de rastreamento

---

## 🗺 Roadmap

- [x] Widget Provador Virtual (Try-On)
- [x] Widget FindMySize (Calçados)  
- [x] Widget FindMySize (Roupas)
- [x] Widget Tabela de Medidas
- [x] Widget Buy Together (Monte seu Look)
- [x] Dashboard Administrativo
- [x] Sistema de Assinaturas (MercadoPago)
- [x] Programa de Parceiros
- [x] Cache client-side (IndexedDB)
- [x] Templates de email (Confirmação + Convite)
- [ ] ML para recomendação de tamanho
- [ ] Geração multi-ângulo (3 poses)
- [ ] Histórico de gerações no dashboard
- [ ] Marketplace de looks

---

## 📄 Licença

Projeto privado — Todos os direitos reservados © WearMe 2024-2026.

---

<p align="center">
  <sub>Feito com ❤️ e IA pelo time <strong>WearMe</strong></sub>
</p>
