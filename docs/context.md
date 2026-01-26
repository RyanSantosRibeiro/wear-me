# � Wearme - Plataforma de Provador Virtual

**Status:** Fase Inicial (Planejamento)
**Objetivo:** Plataforma SaaS B2B que disponibiliza um widget de "Provador Virtual" para e-commerces. O sistema permite que o usuário final envie sua foto e veja como o produto (roupa) ficaria nele, aumentando a conversão de vendas.

---

## 🏗️ Arquitetura e Fluxo do Sistema

O projeto é dividido em duas partes principais: o **Painel Administrativo (SaaS)** e o **Widget de Integração (Embed)**.

### 1. Fluxo do Lojista (Admin)
O foco principal da plataforma é o gerenciamento de acesso e assinaturas.
1.  **Onboarding:** Lojista cria conta na plataforma Wearme.
2.  **Assinatura:** Lojista contrata um plano.
    *   *Mecanismo:* Integração via Webhook de pagamento.
    *   *Ação:* Ao receber confirmação de pagamento, o sistema atualiza o status do lojista para `ATIVO`.
3.  **Geração de Chave (API Key):** Com a conta ativa, o sistema gera uma `API Key` única para ser usada nas requisições da loja.
4.  **Dashboard:**
    *   Visualização de métricas (requisições consumidas).
    *   Gerenciamento da Assinatura.
    *   Visualização/Regeração da API Key.

### 2. O Widget (Client-Side)
O "produto" entregue é um script JS que a loja instala. Ele é responsável por toda a UI/UX de captura de foto e exibição do resultado no site da loja, sem que o lojista precise codar o backend.

**Script de Exemplo (Integração):**

```html
<!-- 1. Adicione o script do Wearme no seu site -->
<script src="https://api.wearme.com/WearMe.js"></script>

<!-- 2. Configure o provador virtual -->
<script>
  Wearme.init({
    // Chave de API (gerada no painel admin)
    apiKey: 'sua_api_key_aqui',

    // URL da imagem do produto atual (na loja)
    productImage: 'https://sua-loja.com/produto.jpg',

    // Configuração do Botão
    createButton: {
      targetSelector: '#wearme-btn', // ID do elemento onde o botão será injetado
      label: 'Experimentar Virtualmente' // Opcional
    }
  });
</script>

<!-- 3. Elemento Alvo no Template da Loja -->
<div id="wearme-btn"></div>
```

### 3. API de Processamento (Backend)
O núcleo inteligente da plataforma.
*   **Endpoint:** Recebe a requisição do Widget.
*   **Payload Esperado:**
    *   `apiKey`: Para autenticação e rate-limit.
    *   `productImageUrl`: A roupa que será provada.
    *   `userImage`: A foto enviada pelo cliente no momento.
*   **Processamento:**
    1.  Valida se a loja está ativa e tem quota.
    2.  Realiza o processamento de imagem (IA/Generative Model) substituindo a roupa.
    3.  Retorna a URL da imagem gerada.

---

## 🛠️ Stack Tecnológico (Definição)

*   **Frontend (Admin):** React, TailwindCSS (Design Premium/Moderno).
*   **Widget (Embed):** JavaScript Vanilla (leve e compatível).
*   **Backend:** Node.js / Serverless Functions.
*   **Banco de Dados:** Controle de usuários, lojas, keys e histórico de uso.
*   **Pagamentos:** Webhooks (Stripe/Gateway local) para ativação automática.

---

## 📝 Notas de Implementação
*   A plataforma atua primariamente como um **Gateway de Gerenciamento** (SaaS) e **API Provider**.
*   A lógica pesada de front-end fica no Widget (isolado).
*   A lógica pesada de back-end fica no processamento de imagem.
*   O Admin deve ser simples, focado em conversão e gestão de conta.
