Perfeito. ✅
O fluxo está **100% coerente**, tecnicamente sólido e fácil de adotar pelo lojista. Vamos **formalizar isso como especificação + pseudo-implementação**, pra você já sair praticamente com o widget desenhado.

---

# 🧩 Visão Geral do Funcionamento

### O lojista só precisa:

* Marcar botões com **data-attributes**
* Importar o script do Wearme

Todo o resto é **automático pelo widget**.

---

# 1️⃣ Botão “Adicionar à Combinação” (Controlado pelo Lojista)

O lojista marca qualquer botão/link do produto assim:

```html
<button
  class="wearme-add"
  data-wearme-id="sku-123"
  data-wearme-image="https://loja.com/produto.jpg"
  data-wearme-url="https://loja.com/produto"
>
  Adicionar ao Look
</button>
```

### Contrato mínimo:

* `data-wearme-id` → identificador único
* `data-wearme-image` → imagem do produto
* `data-wearme-url` → link do produto

✔ Pode ser botão, div, card, qualquer coisa
✔ Funciona em lista, PDP, vitrine, etc.

---

# 2️⃣ Comportamento do Widget (Toggle)

O widget:

* Escuta **click** em qualquer elemento com `.wearme-add`
* Faz toggle no `sessionStorage`

### Estrutura no sessionStorage

```json
wearme_items = [
  {
    "id": "sku-123",
    "image": "https://...",
    "url": "https://..."
  }
]
```

### Regras:

* Se já existe → remove
* Se não existe → adiciona
* Atualiza estado visual do botão (ativo/inativo)

---

# 3️⃣ Script – Lógica Central (Pseudo-Código)

```js
const STORAGE_KEY = 'wearme_items';

function getItems() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || [];
}

function toggleItem(item) {
  const items = getItems();
  const exists = items.find(i => i.id === item.id);

  const updated = exists
    ? items.filter(i => i.id !== item.id)
    : [...items, item];

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  updateFloatingButton(updated.length);
}
```

---

# 4️⃣ Botão Flutuante (Gerado Automaticamente)

O widget injeta um botão flutuante **apenas quando houver itens**.

### UI

* Canto inferior direito
* Badge com quantidade

```
👗 Criar Look (3)
```

### Comportamento

* Click → abre drawer/modal
* Sempre sincronizado com sessionStorage

---

# 5️⃣ Drawer / Modal – Seleção dos Itens

Ao abrir:

```
Monte seu Look ✨

[✔] Camiseta
[✔] Calça
[ ] Jaqueta
[✔] Tênis

[ Gerar Look com IA ]
```

### Funcionalidades:

* Checkbox por item
* Preview da imagem
* Validação:

  * mínimo 2 itens
  * máximo X (ex: 6)

---

# 6️⃣ Geração do Look (Request pra API)

### Payload enviado

```json
{
  "sessionId": "abc123",
  "items": [
    {
      "id": "sku-123",
      "image": "https://...",
      "url": "https://..."
    }
  ]
}
```

### Resposta esperada

```json
{
  "lookImage": "https://wearme.ai/look.png",
  "itemsUsed": ["sku-123", "sku-456"]
}
```

---

# 7️⃣ Exibição do Resultado

No mesmo modal:

```
✨ Look Gerado

[ IMAGEM DO LOOK ]

✔ Camiseta
✔ Calça
✔ Tênis

[ Ver Produto ]
[ Comprar Look ]
```

> “Comprar Look” = abrir links dos produtos usados
> (ou CTA configurável)

---

# 8️⃣ Estados Visuais Importantes

### Botão do produto:

* Normal → “Adicionar ao Look”
* Ativo → “Remover do Look”

### Botão flutuante:

* Escondido → 0 itens
* Visível → ≥ 1 item

---

# 9️⃣ Segurança & Limites (Essencial)

* Máx. itens no session: 10
* TTL: limpar após 30 min de inatividade
* Validar imagens (size, mime)
* Debounce de clique

---

# 🧠 Por que isso é MUITO bom

✔ Não depende de catálogo
✔ Funciona em qualquer plataforma
✔ UX moderno (Pinterest / Moda)
✔ IA recebe contexto real
✔ Diferencial forte de mercado

Você acabou de desenhar um **“Pinterest + Provador + IA” embutido no e-commerce**.

---

## Próximo passo (sugestão)

Posso te entregar:

* 🔧 **Código real do widget (vanilla JS)**
* 🎨 **Wireframe do modal/drawer**
* 🤖 **Pipeline de IA ideal pro MVP**
* 📄 **Documentação pro lojista**

👉 Qual você quer agora?
