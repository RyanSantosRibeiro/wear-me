Perfeito — isso **simplifica bastante** 👍
Vamos ajustar a arquitetura **exatamente** para esse cenário mínimo, sem inventar complexidade desnecessária.

Você terá **apenas 3 dados vindos do widget**:

* `apiKey`
* `productImage` (URL)
* `userImage` (upload)

Nada de `productId`, SKU, etc.

---

# 🧠 Visão ajustada do WearMe (MVP correto)

**WearMe = Provador Virtual plug-and-play**

* Widget simples para qualquer e-commerce
* Nenhuma dependência de catálogo
* Controle só por **API Key + uso**

---

# 1️⃣ Widget JavaScript (DressOn / WearMe)

### API pública final do widget

```html
<script src="https://api.wearme.com.br/wearme.js"></script>

<script>
  WearMe.init({
    apiKey: 'pk_live_xxx',
    productImage: 'https://loja.com/produto.jpg',
    createButton: {
      targetSelector: '#wearme-btn',
      label: 'Experimentar'
    }
  });
</script>

<div id="wearme-btn"></div>
```

---

## O que o widget faz (simples e robusto)

1. Renderiza o botão
2. Abre um modal
3. Usuário sobe uma foto
4. Envia para sua API
5. Mostra o resultado

📌 **Nenhuma lógica de negócio no widget**

---

# 2️⃣ Payload enviado para sua API

### `POST /api/widget/try-on`

```http
Content-Type: multipart/form-data
```

```ts
apiKey: string
productImage: string (URL)
userImage: File
sessionId: string (gerado no widget)
```

💡 `sessionId` serve **só** para persistência da imagem.

---

# 3️⃣ Backend (Next.js API Route)

### Fluxo real da rota `/try-on`

```text
1. Valida apiKey
2. Checa se loja está ativa
3. Verifica limite do plano
4. Processa try-on (IA)
5. Salva imagem final
6. Retorna URL
```

---

## Exemplo de pseudo-código

```ts
export async function POST(req: Request) {
  const formData = await req.formData();

  const apiKey = formData.get('apiKey');
  const productImage = formData.get('productImage');
  const userImage = formData.get('userImage');
  const sessionId = formData.get('sessionId');

  // 1. validar loja
  const store = await getStoreByApiKey(apiKey);
  if (!store || !store.active) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // 2. checar limite
  await checkPlanLimit(store.id);

  // 3. gerar imagem
  const finalImage = await generateTryOn(userImage, productImage);

  // 4. salvar no storage
  const imageUrl = await saveToGCS({
    storeId: store.id,
    sessionId,
    image: finalImage
  });

  // 5. contar request
  await incrementUsage(store.id);

  return Response.json({ imageUrl });
}
```

---

# 4️⃣ Persistência da imagem (quando o cliente volta)

Como você **não tem login do usuário final**, a melhor solução é:

### 🎯 `sessionId + localStorage`

No widget:

```js
let sessionId = localStorage.getItem('wearme_session');

if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem('wearme_session', sessionId);
}
```

Esse `sessionId`:

* Vai para sua API
* É usado como nome do arquivo
* Permite buscar a imagem depois

---

## Endpoint opcional

```http
GET /api/widget/session?apiKey=pk_xxx&sessionId=uuid
```

Retorna:

```json
{
  "imageUrl": "https://storage..."
}
```

Se existir, você já mostra no modal 🔥

---

# 5️⃣ Google Cloud Storage (estrutura mínima)

```text
wearme/
 └── stores/
     └── store_id/
         └── sessions/
             └── session_uuid.jpg
```

* Uma imagem por sessão (ou sobrescreve)
* Limpeza automática depois de X dias (lifecycle rule)

---

# 6️⃣ Controle de uso (core do SaaS)

Mesmo com poucos dados, **isso é obrigatório**.

### Banco (Supabase)

#### `stores`

```ts
id
name
api_key
active
plan_id
```

#### `usage`

```ts
store_id
month (YYYY-MM)
requests_count
```

---

## Regra simples

```ts
if (requests_count >= plan.monthly_limit) {
  return 402; // limite atingido
}
```

---

# 7️⃣ Segurança mínima (não pule isso)

✔️ API Key:

* Sempre validada no backend
* Rate limit por IP
* CORS restrito (opcional por domínio)

✔️ Imagens:

* Nunca confiar em URL externa sem validação
* Baixar e validar `productImage`

---

# 8️⃣ O que você NÃO precisa agora

❌ productId
❌ catálogo
❌ login do usuário final
❌ salvar histórico infinito

Isso pode vir depois, se fizer sentido.

---

# 9️⃣ Arquitetura final (enxuta)

```text
[E-commerce]
   ↓
[Widget JS]
   ↓
[Next.js API]
   ↓
[Try-On Engine]
   ↓
[Google Cloud Storage]
```

---

# 🚀 Próximo passo ideal

Agora que o escopo está claro, o próximo passo lógico é **codar o widget**.

Posso te entregar:

1. 🔹 Estrutura real do `wearme.js`
2. 🔹 Código do modal (HTML/CSS/JS)
3. 🔹 API `/try-on` pronta em Next.js
4. 🔹 Integração com Google Cloud Storage
5. 🔹 Sistema de limite por plano

👉 **Qual você quer implementar primeiro?**
