# 🧪 Personal AI Shopper — MVP (3 Fluxos)

**Objetivo:** SDK leve que captura 3 eventos, constrói um perfil (persona) progressivo no localStorage e executa 3 ações automáticas.
**UI:** Círculo flutuante com gradient animado (sempre visível).
**Armazenamento:** `localStorage` apenas (Supabase vem depois).

---

## Conceito do MVP

```
Cada evento capturado → atualiza persona no localStorage
                               ↓
                     Persona acumula perfil:
                     • interesses (categorias, marcas)
                     • gênero inferido
                     • sensibilidade a preço
                     • produtos favoritos
                               ↓
                     Gatilhos checam persona
                               ↓
                     Ações executadas na interface
```

---

## O Widget Flutuante

Um **círculo fixo** no canto inferior direito, com um gradient animado. Ele é a "cara" do AI Shopper — está sempre presente, pulsa quando tem algo a dizer.

### Visual

```
                                       ┌──────┐
                                       │      │
  [ ... conteúdo da loja ... ]         │  🤖  │  ← círculo 56px
                                       │      │    gradient animado
                                       └──────┘
                                    canto inferior direito
```

### Estados do widget

| Estado | Visual | Quando |
|---|---|---|
| **Idle** | Gradient suave girando | Nenhuma ação pendente |
| **Ativo** | Gradient pulsa + badge | Tem sugestão ou ação para mostrar |
| **Mensagem** | Balão de texto sai do círculo | Exibindo mensagem proativa |

### Código do Widget

```typescript
function createWidget() {
  const widget = document.createElement("div");
  widget.id = "wearme-shopper";
  widget.innerHTML = `
    <div class="wearme-float" id="wearme-float-btn">
      <div class="wearme-float-gradient"></div>
      <span class="wearme-float-icon">✨</span>
      <div class="wearme-float-badge" id="wearme-badge" style="display:none">1</div>
    </div>
    <div class="wearme-bubble" id="wearme-bubble" style="display:none">
      <div class="wearme-bubble-content" id="wearme-bubble-text"></div>
      <button class="wearme-bubble-close" id="wearme-bubble-close">&times;</button>
    </div>
  `;
  document.body.appendChild(widget);

  // Fechar balão
  document.getElementById("wearme-bubble-close")
    ?.addEventListener("click", () => {
      const bubble = document.getElementById("wearme-bubble");
      if (bubble) bubble.style.display = "none";
    });

  // Clique no botão → toggle balão / abrir chat (futuro)
  document.getElementById("wearme-float-btn")
    ?.addEventListener("click", () => {
      const bubble = document.getElementById("wearme-bubble");
      if (bubble) {
        bubble.style.display = bubble.style.display === "none" ? "flex" : "none";
      }
    });
}
```

### CSS do Widget

```css
/* ===== BOTÃO FLUTUANTE ===== */
#wearme-shopper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 99999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.wearme-float {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.wearme-float:hover { transform: scale(1.1); }
.wearme-float:active { transform: scale(0.95); }

/* Gradient animado girando */
.wearme-float-gradient {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #ff6ec7, #7873f5, #4fc3f7, #ff6ec7);
  animation: wearme-spin 3s linear infinite;
}

/* Sombra glow */
.wearme-float::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #ff6ec7, #7873f5, #4fc3f7, #ff6ec7);
  filter: blur(12px);
  opacity: 0.4;
  z-index: -1;
  animation: wearme-spin 3s linear infinite;
}

@keyframes wearme-spin {
  to { rotate: 360deg; }
}

/* Ícone central */
.wearme-float-icon {
  position: relative;
  z-index: 2;
  font-size: 22px;
  background: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Badge de notificação */
.wearme-float-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  background: #ff4081;
  color: white;
  font-size: 11px;
  font-weight: 800;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  z-index: 3;
  animation: wearme-pop 0.3s ease;
}

@keyframes wearme-pop {
  0% { transform: scale(0); }
  70% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* Estado "pulsando" (quando tem ação) */
.wearme-float.wearme-active .wearme-float-gradient {
  animation: wearme-spin 1.5s linear infinite, wearme-pulse 1s ease infinite;
}

@keyframes wearme-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

/* ===== BALÃO DE MENSAGEM ===== */
.wearme-bubble {
  position: absolute;
  bottom: 68px;
  right: 0;
  background: white;
  border-radius: 16px;
  padding: 14px 18px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.15);
  max-width: 280px;
  min-width: 220px;
  display: flex;
  gap: 8px;
  align-items: flex-start;
  border: 1px solid #f0f0f0;
  animation: wearme-slideUp 0.3s ease;
}

.wearme-bubble-content {
  font-size: 13px;
  color: #333;
  line-height: 1.5;
}

.wearme-bubble-content strong {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
}

.wearme-bubble-close {
  background: none;
  border: none;
  font-size: 18px;
  color: #ccc;
  cursor: pointer;
  flex-shrink: 0;
  line-height: 1;
}

@keyframes wearme-slideUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## A Persona (localStorage)

Cada evento enriquece o perfil. A persona **vai se auto-construindo** à medida que o usuário navega.

### Estrutura

```typescript
interface ShopperPersona {
  // Quem é (inferido)
  gender: "male" | "female" | "unknown";
  genderScore: { male: number; female: number };  // quem tiver mais score ganha

  // O que gosta (scoring por interação)
  categories: Record<string, number>;   // "corrida": 5, "casual": 2
  brands: Record<string, number>;       // "nike": 4, "adidas": 1
  priceRange: {
    avgViewed: number;                  // média dos preços visualizados
    sensitivity: "low" | "medium" | "high";
  };

  // Comportamento bruto (contadores)
  hovers: Record<string, number>;       // productId → #hovers
  searches: string[];                   // últimas buscas
  cartAdds: Array<{ productId: string; at: number }>;

  // Controle de ações (não repetir)
  flags: {
    highlightedProducts: string[];
    couponOffered: boolean;
    lastSuggestionAt: number;
  };

  // Metadata
  createdAt: number;
  updatedAt: number;
  totalEvents: number;
}
```

### Inicialização

```typescript
const PERSONA_KEY = "wearme_persona";

function getPersona(): ShopperPersona {
  const raw = localStorage.getItem(PERSONA_KEY);
  if (raw) return JSON.parse(raw);

  return {
    gender: "unknown",
    genderScore: { male: 0, female: 0 },
    categories: {},
    brands: {},
    priceRange: { avgViewed: 0, sensitivity: "medium" },
    hovers: {},
    searches: [],
    cartAdds: [],
    flags: {
      highlightedProducts: [],
      couponOffered: false,
      lastSuggestionAt: 0,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    totalEvents: 0,
  };
}

function savePersona(p: ShopperPersona) {
  p.updatedAt = Date.now();
  p.totalEvents++;
  localStorage.setItem(PERSONA_KEY, JSON.stringify(p));
}
```

### Como a persona se enriquece a cada evento

```typescript
function enrichPersona(persona: ShopperPersona, data: EventData) {
  // ---- Categorias ----
  if (data.category) {
    persona.categories[data.category] = (persona.categories[data.category] || 0) + data.weight;
  }

  // ---- Marcas ----
  if (data.brand) {
    persona.brands[data.brand] = (persona.brands[data.brand] || 0) + data.weight;
  }

  // ---- Gênero inferido ----
  // Categorias tipicamente masculinas / femininas ajustam o score
  if (data.category) {
    const maleCategories = ["masculino", "men", "homme", "bermuda", "barba"];
    const femaleCategories = ["feminino", "women", "femme", "vestido", "saia", "batom"];

    const catLower = data.category.toLowerCase();

    if (maleCategories.some(c => catLower.includes(c))) {
      persona.genderScore.male += data.weight;
    }
    if (femaleCategories.some(c => catLower.includes(c))) {
      persona.genderScore.female += data.weight;
    }

    // Quem tem mais score define o gênero
    if (persona.genderScore.male > persona.genderScore.female) {
      persona.gender = "male";
    } else if (persona.genderScore.female > persona.genderScore.male) {
      persona.gender = "female";
    } else {
      persona.gender = "unknown";
    }
  }

  // ---- Sensibilidade a preço ----
  if (data.price && data.price > 0) {
    const viewed = Object.values(persona.categories).reduce((a, b) => a + b, 0) || 1;
    persona.priceRange.avgViewed =
      (persona.priceRange.avgViewed * (viewed - 1) + data.price) / viewed;

    // Heurística simples
    if (persona.priceRange.avgViewed < 100) persona.priceRange.sensitivity = "high";
    else if (persona.priceRange.avgViewed < 300) persona.priceRange.sensitivity = "medium";
    else persona.priceRange.sensitivity = "low";
  }

  savePersona(persona);
}
```

### Dados que o SDK extrai do DOM

```typescript
interface EventData {
  event: "product_hover" | "search_query" | "add_to_cart";
  productId?: string;
  category?: string;      // extraído do card/página
  brand?: string;         // extraído do card/página
  price?: number;         // extraído do card/página
  searchTerm?: string;
  weight: number;         // hover=1, busca=2, cart=5
}
```

---

## Os 3 Fluxos

### Resumo

| # | Evento | Peso | Enriquece persona com | Gatilho → Ação |
|---|---|---|---|---|
| 1 | `product_hover` | 1 | categoria, marca, preço, gênero | Hover 3x → `highlight_product` |
| 2 | `search_query` | 2 | busca, categoria inferida | Qualquer busca → `show_suggestion` |
| 3 | `add_to_cart` | 5 | produto, marca, preço | Add + 30s sem checkout → `offer_coupon` |

> 💡 **Cada evento sempre faz 2 coisas:** enriquece a persona + checa se dispara gatilho.

---

### Fluxo 1: Hover → Enriquece persona + Destaca produto

```
Mouse sobre card [Nike Pegasus - Running - R$499]
      ↓
persona.categories["running"] += 1
persona.brands["nike"] += 1
persona.priceRange.avgViewed recalcula
persona.genderScore.male += 1 (se cat. masculina)
persona.hovers["nike_pegasus"] += 1
      ↓
hovers["nike_pegasus"] >= 3 ?
      ↓ SIM
Widget pulsa (gradient) + Badge no card do produto
```

```typescript
function setupHoverTracking() {
  document.querySelectorAll("[data-product-id]").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const productId = card.getAttribute("data-product-id") || "";
      const category = card.getAttribute("data-category") || "";
      const brand = card.getAttribute("data-brand") || "";
      const price = parseFloat(card.getAttribute("data-price") || "0");

      const persona = getPersona();

      // Enriquece persona
      persona.hovers[productId] = (persona.hovers[productId] || 0) + 1;
      enrichPersona(persona, {
        event: "product_hover",
        productId, category, brand, price,
        weight: 1,
      });

      // Checa gatilho: 3+ hovers?
      if (persona.hovers[productId] >= 3
        && !persona.flags.highlightedProducts.includes(productId)) {

        highlightProduct(productId);
        showBubble(`Notei que você gostou desse produto! 😉`);

        persona.flags.highlightedProducts.push(productId);
        savePersona(persona);
      }
    });
  });
}
```

**Ação: `highlight_product`**

```typescript
function highlightProduct(productId: string) {
  const card = document.querySelector(`[data-product-id="${productId}"]`) as HTMLElement;
  if (!card || card.querySelector(".wearme-badge")) return;

  card.style.boxShadow = "0 0 0 2px #ff92b5, 0 4px 20px rgba(255,146,181,0.3)";
  card.style.borderRadius = "12px";
  card.style.transition = "box-shadow 0.3s ease";
  card.style.position = "relative";

  const badge = document.createElement("div");
  badge.className = "wearme-badge";
  badge.textContent = "✨ Pra você";
  badge.style.cssText = `
    position:absolute; top:8px; right:8px; background:#ff92b5; color:white;
    font-size:11px; font-weight:700; padding:4px 10px; border-radius:20px; z-index:10;
  `;
  card.appendChild(badge);

  // Widget pulsa
  activateWidget();
}
```

---

### Fluxo 2: Busca → Enriquece persona + Sugestão proativa

```
Usuário busca "vestido verão"
      ↓
persona.searches.push("vestido verão")
persona.categories["vestido"] += 2
persona.genderScore.female += 2 (vestido = feminino)
      ↓
Widget pulsa + Balão: "Vi que você buscou 'vestido verão'..."
```

```typescript
function setupSearchTracking() {
  const form = document.querySelector("form[action*='search'], form[action*='busca'], [data-search-form]");
  if (!form) return;

  form.addEventListener("submit", () => {
    const input = form.querySelector("input[type='text'], input[type='search']") as HTMLInputElement;
    if (!input?.value.trim()) return;

    const query = input.value.trim();
    const persona = getPersona();

    // Enriquece persona
    persona.searches.push(query);
    if (persona.searches.length > 10) persona.searches.shift();

    enrichPersona(persona, {
      event: "search_query",
      searchTerm: query,
      category: query, // a busca em si vira "categoria" para scoring
      weight: 2,
    });

    // Ação: sugestão (máx 1 por minuto)
    const now = Date.now();
    if (now - persona.flags.lastSuggestionAt > 60000) {
      showBubble(`
        <strong>Posso ajudar! 🔍</strong>
        Vi que você buscou "<em>${query}</em>". Quer que eu filtre as melhores opções?
      `);
      persona.flags.lastSuggestionAt = now;
      savePersona(persona);
      activateWidget();
    }
  });
}
```

---

### Fluxo 3: Add to cart + hesitação → Enriquece persona + Cupom

```
Clicou "Adicionar ao Carrinho" [Adidas Ultraboost - R$999]
      ↓
persona.cartAdds.push({ productId, at: now })
persona.categories["running"] += 5
persona.brands["adidas"] += 5
persona.priceRange recalcula
      ↓
... 30 segundos ...
(usuário não foi pro checkout)
      ↓
Modal: "🎁 Que tal 10% OFF pra fechar agora?"
```

```typescript
function setupCartTracking() {
  document.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest("[data-add-to-cart], .add-to-cart");
    if (!btn) return;

    const card = btn.closest("[data-product-id]");
    const productId = card?.getAttribute("data-product-id") || "unknown";
    const category = card?.getAttribute("data-category") || "";
    const brand = card?.getAttribute("data-brand") || "";
    const price = parseFloat(card?.getAttribute("data-price") || "0");

    const persona = getPersona();

    // Enriquece persona (peso alto: add to cart = forte intenção)
    persona.cartAdds.push({ productId, at: Date.now() });
    enrichPersona(persona, {
      event: "add_to_cart",
      productId, category, brand, price,
      weight: 5,
    });

    // Timer de hesitação → cupom
    if (!persona.flags.couponOffered) {
      setTimeout(() => {
        if (document.visibilityState !== "visible") return;
        if (window.location.href.includes("checkout")) return;

        offerCoupon("WEARME10");
        persona.flags.couponOffered = true;
        savePersona(persona);
      }, 30000);
    }
  });
}
```

**Ação: `offer_coupon`** (modal completo)

```typescript
function offerCoupon(code: string) {
  const persona = getPersona();

  // Mensagem contextualizada pela persona!
  const genderGreeting = persona.gender === "female"
    ? "Ei, tudo bem? 💅"
    : persona.gender === "male"
      ? "Ei, beleza? 👊"
      : "Ei! 👋";

  const topCategory = Object.entries(persona.categories)
    .sort(([,a], [,b]) => b - a)[0]?.[0];

  const contextMsg = topCategory
    ? `Vi que você curte ${topCategory}. `
    : "";

  const modal = document.createElement("div");
  modal.id = "wearme-coupon-modal";
  modal.innerHTML = `
    <div class="wearme-coupon-overlay"></div>
    <div class="wearme-coupon-card">
      <button class="wearme-coupon-close">&times;</button>
      <div style="font-size:48px; margin-bottom:12px">🎁</div>
      <h3>${genderGreeting}</h3>
      <p>${contextMsg}Que tal <strong>10% OFF</strong> pra fechar agora?</p>
      <div class="wearme-coupon-code">
        <span>${code}</span>
        <button class="wearme-coupon-copy">Copiar</button>
      </div>
      <p style="font-size:12px; color:#999; margin-top:8px">Válido por 15 minutos ⏰</p>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector(".wearme-coupon-close")
    ?.addEventListener("click", () => modal.remove());
  modal.querySelector(".wearme-coupon-overlay")
    ?.addEventListener("click", () => modal.remove());
  modal.querySelector(".wearme-coupon-copy")
    ?.addEventListener("click", () => {
      navigator.clipboard.writeText(code);
      const btn = modal.querySelector(".wearme-coupon-copy") as HTMLElement;
      if (btn) btn.textContent = "Copiado! ✓";
    });
}
```

---

## Funções auxiliares do Widget

```typescript
// Mostra balão de mensagem saindo do widget flutuante
function showBubble(html: string) {
  const bubble = document.getElementById("wearme-bubble");
  const text = document.getElementById("wearme-bubble-text");
  if (bubble && text) {
    text.innerHTML = html;
    bubble.style.display = "flex";

    // Auto-fecha em 8 segundos
    setTimeout(() => { bubble.style.display = "none"; }, 8000);
  }
}

// Widget pulsa para chamar atenção
function activateWidget() {
  const floatBtn = document.querySelector(".wearme-float");
  floatBtn?.classList.add("wearme-active");

  // Badge
  const badge = document.getElementById("wearme-badge");
  if (badge) badge.style.display = "flex";

  // Para de pulsar após 5s
  setTimeout(() => {
    floatBtn?.classList.remove("wearme-active");
    if (badge) badge.style.display = "none";
  }, 5000);
}
```

---

## Init completo (SDK)

```typescript
(function WearMeShopper() {
  "use strict";

  // 1. Injeta CSS
  const style = document.createElement("style");
  style.textContent = `/* todos os CSS do widget + coupon modal */`;
  document.head.appendChild(style);

  // 2. Cria widget flutuante
  createWidget();

  // 3. Ativa os 3 fluxos
  setupHoverTracking();   // hover → enriquece + highlight
  setupSearchTracking();  // busca → enriquece + sugestão
  setupCartTracking();    // cart  → enriquece + cupom

  console.log("[WearMe Shopper] ✅ SDK carregado");
  console.log("[WearMe Shopper] Persona atual:", getPersona());
})();
```

### Na loja

```html
<script src="https://wearme.vercel.app/WearMeShopper.js"></script>
```

---

## Como a persona fica após uma sessão real

Exemplo: mulher navegando tênis de corrida feminino

```json
{
  "gender": "female",
  "genderScore": { "male": 0, "female": 9 },
  "categories": {
    "feminino": 5,
    "corrida": 8,
    "tênis": 3
  },
  "brands": {
    "nike": 6,
    "asics": 3
  },
  "priceRange": {
    "avgViewed": 450,
    "sensitivity": "low"
  },
  "hovers": {
    "nike_pegasus_w": 4,
    "asics_nimbus_w": 2
  },
  "searches": ["tênis corrida feminino", "nike pegasus"],
  "cartAdds": [
    { "productId": "nike_pegasus_w", "at": 1710349200000 }
  ],
  "flags": {
    "highlightedProducts": ["nike_pegasus_w"],
    "couponOffered": true,
    "lastSuggestionAt": 1710349150000
  },
  "totalEvents": 14,
  "createdAt": 1710349000000,
  "updatedAt": 1710349200000
}
```

---

## Requisitos do HTML da loja

Para o SDK funcionar, os cards de produto precisam de `data-attributes`:

```html
<div class="product-card"
  data-product-id="nike_pegasus_w"
  data-category="corrida feminino"
  data-brand="nike"
  data-price="499.90"
>
  <img src="..." />
  <h3>Nike Pegasus</h3>
  <span>R$ 499,90</span>
  <button data-add-to-cart>Adicionar ao Carrinho</button>
</div>
```

> 💡 **No SDK específico por plataforma** (fase 2), o SDK saberá extrair esses dados automaticamente do DOM do VTEX/Shopify, sem precisar dos data-attributes.

---

## Resumo Visual

```
                    PERSONA (localStorage)
                    ┌──────────────────────┐
                    │ gender: female       │
                    │ categories: corrida…  │
                    │ brands: nike, asics   │
                    │ price: medium        │
                    │ hovers: {nike: 4}    │
                    │ searches: [...]      │
                    │ cartAdds: [...]      │
                    └──────────────────────┘
                          ▲         │
                          │         │ gatilhos checam
           cada evento    │         ▼
           enriquece      │    ┌─────────────┐
                          │    │  Ações:     │
┌──────────┐              │    │             │
│ HOVER 3x │──────────────┘    │ highlight   │
│ BUSCA    │───────────────    │ suggestion  │
│ CART     │───────────────    │ coupon      │
└──────────┘                   └─────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   Widget     │
                              │  flutuante   │
                              │  (gradient)  │
                              │     ✨        │
                              └──────────────┘
```

---

## Próximos passos

1. **Codar o SDK** → `public/WearMeShopper.js` (vanilla JS)
2. **Testar em `test-widget.html`** → HTML com cards fake + data-attributes
3. **Ver persona se construindo** → abrir DevTools > Application > localStorage
4. **Depois:** integrar Supabase para persistir persona + analytics
