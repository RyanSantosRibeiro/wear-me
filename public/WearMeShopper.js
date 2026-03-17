/**
 * WearMe Shopper SDK — Personal AI Shopper MVP
 * 
 * Widget flutuante com gradient animado que:
 * 1. Captura 3 eventos (hover, busca, add to cart)
 * 2. Constrói persona progressiva no localStorage
 * 3. Dispara 3 ações (highlight, sugestão, cupom)
 * 
 * Integração (VTEX padrão):
 *   <script src="https://wearme.vercel.app/WearMeShopper.js"></script>
 *   <script>
 *     WearMeShopper.init({ platform: "vtex" });
 *   </script>
 * 
 * Integração com selectors customizados:
 *   <script>
 *     WearMeShopper.init({
 *       platform: "vtex",
 *       selectors: {
 *         productCard: ".minha-classe-custom",
 *         addToCart: ".meu-botao-comprar"
 *       }
 *     });
 *   </script>
 * 
 * Integração genérica (sem plataforma):
 *   <script>
 *     WearMeShopper.init({
 *       platform: "custom",
 *       selectors: {
 *         productCard: "[data-product-id]",
 *         productName: ".product-name",
 *         productPrice: ".product-price",
 *         productBrand: ".product-brand",
 *         productImage: ".product-image img",
 *         productLink: "a",
 *         addToCart: "[data-add-to-cart]",
 *         searchForm: "form[action*='search']",
 *         searchInput: "input[type='text']"
 *       }
 *     });
 *   </script>
 */
;(function (root) {
  "use strict";

  // ╔══════════════════════════════════════════════╗
  // ║            PLATFORM CONFIGS                  ║
  // ╚══════════════════════════════════════════════╝

  var PLATFORMS = {

    // ───── VTEX IO / Store Framework ─────
    vtex: {
      name: "VTEX",
      selectors: {
        // Cards de produto (shelf / search results / vitrine)
        productCard: [
          ".vtex-product-summary-2-x-container",
          ".vtex-product-summary-2-x-element",
          ".vtex-search-result-3-x-galleryItem",
          ".vtex-slider-layout-0-x-slide"
        ].join(", "),

        // Nome do produto dentro do card
        productName: [
          ".vtex-product-summary-2-x-productBrand",
          ".vtex-product-summary-2-x-brandName",
          ".vtex-store-components-3-x-productBrand"
        ].join(", "),

        // Preço selling price
        productPrice: [
          ".vtex-product-price-1-x-sellingPriceValue",
          ".vtex-product-price-1-x-sellingPrice",
          ".vtex-store-components-3-x-sellingPriceValue",
          ".vtex-product-summary-2-x-price"
        ].join(", "),

        // Marca
        productBrand: [
          ".vtex-product-summary-2-x-productBrandName",
          ".vtex-store-components-3-x-productBrandName"
        ].join(", "),

        // Imagem do produto
        productImage: [
          ".vtex-product-summary-2-x-image",
          ".vtex-product-summary-2-x-imageNormal",
          ".vtex-store-components-3-x-productImageTag"
        ].join(", "),

        // Link do produto (para extrair ID/slug)
        productLink: [
          ".vtex-product-summary-2-x-clearLink",
          ".vtex-product-summary-2-x-container a[href*='/p']"
        ].join(", "),

        // Botão add to cart
        addToCart: [
          ".vtex-add-to-cart-button-0-x-buttonText",
          ".vtex-button[class*='buy']",
          "button[class*='add-to-cart']",
          "[class*='buyButton']"
        ].join(", "),

        // Busca
        searchForm: [
          ".vtex-store-components-3-x-searchBarContainer form",
          "form[action*='/search']",
          "form[action*='busca']"
        ].join(", "),

        searchInput: [
          ".vtex-store-components-3-x-searchBarContainer input",
          "input[class*='search']",
          "input[name='q']"
        ].join(", ")
      },

      // Como extrair dados de um card VTEX
      extractors: {
        productId: function (card) {
          // 1) Tenta pegar do link href (ex: /produto-xyz/p?skuId=123)
          var link = card.querySelector("a[href*='/p']");
          if (link) {
            var href = link.getAttribute("href") || "";
            var slug = href.split("/p")[0].split("/").pop();
            if (slug) return slug;
          }
          // 2) Tenta data-attribute
          return card.getAttribute("data-product-id") || card.id || null;
        },

        category: function (card) {
          // Na VTEX, categoria fica no breadcrumb ou na URL, não no card
          // Tenta pegar da URL da página
          var path = window.location.pathname.toLowerCase();
          var segments = path.split("/").filter(Boolean);
          // Ignora segments como 'p', 's', etc
          var cats = segments.filter(function (s) { return s.length > 2 && s !== "search"; });
          return cats.join(" ");
        },

        brand: function (card, selectors) {
          var el = card.querySelector(selectors.productBrand);
          return el ? el.textContent.trim() : "";
        },

        price: function (card, selectors) {
          var el = card.querySelector(selectors.productPrice);
          if (!el) return 0;
          var text = el.textContent.replace(/[^\d,\.]/g, "").replace(",", ".");
          return parseFloat(text) || 0;
        },

        name: function (card, selectors) {
          var el = card.querySelector(selectors.productName);
          return el ? el.textContent.trim() : "";
        }
      }
    },

    // ───── SHOPIFY (futuro) ─────
    shopify: {
      name: "Shopify",
      selectors: {
        productCard: ".product-card, .grid__item",
        productName: ".product-card__title, .card__heading",
        productPrice: ".price-item--regular, .price__regular .price-item",
        productBrand: ".product-card__vendor",
        productImage: ".product-card__image, .card__media img",
        productLink: "a.product-card__link, a.card__link",
        addToCart: "button[name='add'], .product-form__submit, [data-add-to-cart]",
        searchForm: "form[action='/search']",
        searchInput: "input[name='q']"
      },
      extractors: {
        productId: function (card) {
          var link = card.querySelector("a[href*='/products/']");
          if (link) {
            var parts = (link.getAttribute("href") || "").split("/products/");
            return parts[1] ? parts[1].split("?")[0].split("#")[0] : null;
          }
          return card.getAttribute("data-product-id") || null;
        },
        category: function () {
          var path = window.location.pathname;
          if (path.indexOf("/collections/") !== -1) {
            return path.split("/collections/")[1].split("/")[0].replace(/-/g, " ");
          }
          return "";
        },
        brand: function (card, selectors) {
          var el = card.querySelector(selectors.productBrand);
          return el ? el.textContent.trim() : "";
        },
        price: function (card, selectors) {
          var el = card.querySelector(selectors.productPrice);
          if (!el) return 0;
          var text = el.textContent.replace(/[^\d,\.]/g, "").replace(",", ".");
          return parseFloat(text) || 0;
        },
        name: function (card, selectors) {
          var el = card.querySelector(selectors.productName);
          return el ? el.textContent.trim() : "";
        }
      }
    },

    // ───── Custom / data-attributes (teste, genérico) ─────
    custom: {
      name: "Custom",
      selectors: {
        productCard: "[data-product-id]",
        productName: ".product-name, [data-product-name]",
        productPrice: ".product-price, [data-price]",
        productBrand: ".product-brand, [data-brand]",
        productImage: "img",
        productLink: "a",
        addToCart: "[data-add-to-cart], .add-to-cart, button[class*='buy']",
        searchForm: "[data-search-form], form[action*='search'], form[action*='busca']",
        searchInput: "input[type='search'], input[type='text'], input[name='q']"
      },
      extractors: {
        productId: function (card) {
          return card.getAttribute("data-product-id") || card.id || null;
        },
        category: function (card) {
          return card.getAttribute("data-category") || "";
        },
        brand: function (card) {
          return card.getAttribute("data-brand") || "";
        },
        price: function (card) {
          var p = card.getAttribute("data-price");
          return p ? parseFloat(p) : 0;
        },
        name: function (card, selectors) {
          var el = card.querySelector(selectors.productName);
          return el ? el.textContent.trim() : "";
        }
      }
    }
  };

  // ╔══════════════════════════════════════════════╗
  // ║              CONSTANTES                      ║
  // ╚══════════════════════════════════════════════╝

  var PERSONA_KEY = "wearme_persona";
  var CATEGORY_CLICK_THRESHOLD = 5; // cliques em produtos da mesma categoria para sugerir
  var HESITATION_MS = 30000;
  var SUGGESTION_COOLDOWN_MS = 60000;
  var BUBBLE_AUTO_CLOSE_MS = 8000;
  var WIDGET_PULSE_MS = 5000;

  // Config ativa (preenchida no init)
  var _config = null;
  var _selectors = null;
  var _extractors = null;

  // ╔══════════════════════════════════════════════╗
  // ║                 PERSONA                      ║
  // ╚══════════════════════════════════════════════╝

  function getPersona() {
    try {
      var raw = localStorage.getItem(PERSONA_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }

    return {
      gender: "unknown",
      genderScore: { male: 0, female: 0 },
      categories: {},       // categoria → score acumulado
      categoryClicks: {},   // categoria → nº de produtos clicados (PDP visitadas)
      brands: {},
      priceRange: { total: 0, count: 0, avg: 0, sensitivity: "medium" },
      viewedProducts: [],   // lista de productIds visitados (cliques em PDPs)
      searches: [],
      cartAdds: [],
      flags: {
        currentHighlight: null,
        suggestedCategories: [],  // categorias que já geraram sugestão (evita repetir)
        couponOffered: false,
        lastSuggestionAt: 0
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      totalEvents: 0
    };
  }

  function savePersona(p) {
    p.updatedAt = Date.now();
    p.totalEvents++;
    try {
      localStorage.setItem(PERSONA_KEY, JSON.stringify(p));
    } catch (e) { /* quota exceeded */ }
  }

  // Listas para inferência de gênero
  var MALE_KEYWORDS = ["masculino", "masculina", "men", "man", "homme", "bermuda", "barba", "male", "hombre"];
  var FEMALE_KEYWORDS = ["feminino", "feminina", "women", "woman", "femme", "vestido", "saia", "batom", "female", "mujer"];

  function enrichPersona(persona, data) {
    // Categorias
    if (data.category) {
      var cats = data.category.split(/[\s,\/]+/);
      for (var i = 0; i < cats.length; i++) {
        var cat = cats[i].toLowerCase().trim();
        if (cat) {
          persona.categories[cat] = (persona.categories[cat] || 0) + data.weight;
        }
      }
    }

    // Marcas
    if (data.brand) {
      var brandKey = data.brand.toLowerCase().trim();
      if (brandKey) {
        persona.brands[brandKey] = (persona.brands[brandKey] || 0) + data.weight;
      }
    }

    // Gênero inferido
    if (data.category) {
      var catLower = data.category.toLowerCase();
      for (var m = 0; m < MALE_KEYWORDS.length; m++) {
        if (catLower.indexOf(MALE_KEYWORDS[m]) !== -1) {
          persona.genderScore.male += data.weight;
          break;
        }
      }
      for (var f = 0; f < FEMALE_KEYWORDS.length; f++) {
        if (catLower.indexOf(FEMALE_KEYWORDS[f]) !== -1) {
          persona.genderScore.female += data.weight;
          break;
        }
      }

      if (persona.genderScore.male > persona.genderScore.female) {
        persona.gender = "male";
      } else if (persona.genderScore.female > persona.genderScore.male) {
        persona.gender = "female";
      } else {
        persona.gender = "unknown";
      }
    }

    // Preço
    if (data.price && data.price > 0) {
      persona.priceRange.total += data.price;
      persona.priceRange.count++;
      persona.priceRange.avg = Math.round(persona.priceRange.total / persona.priceRange.count);

      if (persona.priceRange.avg < 100) persona.priceRange.sensitivity = "high";
      else if (persona.priceRange.avg < 300) persona.priceRange.sensitivity = "medium";
      else persona.priceRange.sensitivity = "low";
    }

    savePersona(persona);
  }

  // ╔══════════════════════════════════════════════╗
  // ║           EXTRAÇÃO DE DADOS                  ║
  // ╚══════════════════════════════════════════════╝

  /**
   * Extrai dados de um card de produto usando os extractors da plataforma
   */
  function extractProductData(card) {
    return {
      productId: _extractors.productId(card, _selectors),
      category: _extractors.category(card, _selectors),
      brand: _extractors.brand(card, _selectors),
      price: _extractors.price(card, _selectors),
      name: _extractors.name(card, _selectors)
    };
  }

  /**
   * Encontra todos os cards de produto na página
   */
  function findProductCards() { 
    console.log("[Wearme] findProductCards", _selectors.productCard);
    return document.querySelectorAll(_selectors.productCard);
  }

  /**
   * Encontra o formulário de busca
   */
  function findSearchForm() {
    var selectorList = _selectors.searchForm.split(", ");
    for (var i = 0; i < selectorList.length; i++) {
      var form = document.querySelector(selectorList[i].trim());
      if (form) return form;
    }
    return null;
  }

  /**
   * Encontra o input de busca dentro do formulário
   */
  function findSearchInput(form) {
    var selectorList = _selectors.searchInput.split(", ");
    for (var i = 0; i < selectorList.length; i++) {
      var input = form.querySelector(selectorList[i].trim());
      if (input) return input;
    }
    // Fallback
    return form.querySelector("input[type='text']") || form.querySelector("input");
  }

  // ╔══════════════════════════════════════════════╗
  // ║              WIDGET FLUTUANTE                ║
  // ╚══════════════════════════════════════════════╝

  function createWidget() {
    var root = document.createElement("div");
    root.id = "wearme-shopper-root";
    root.innerHTML =
      '<div class="wearme-float" id="wearme-float-btn">' +
        '<div class="wearme-float-gradient"></div>' +
        '<span class="wearme-float-icon">✨</span>' +
        '<div class="wearme-float-badge" id="wearme-badge">1</div>' +
      '</div>' +
      '<div class="wearme-bubble" id="wearme-bubble">' +
        '<div class="wearme-bubble-content" id="wearme-bubble-text"></div>' +
        '<button class="wearme-bubble-close" id="wearme-bubble-close">&times;</button>' +
      '</div>';

    document.body.appendChild(root);

    document.getElementById("wearme-float-btn").addEventListener("click", function () {
      var bubble = document.getElementById("wearme-bubble");
      if (bubble.style.display === "flex") {
        bubble.style.display = "none";
      } else {
        var persona = getPersona();
        var summary = buildPersonaSummary(persona);
        showBubble(summary);
      }
    });

    document.getElementById("wearme-bubble-close").addEventListener("click", function (e) {
      e.stopPropagation();
      document.getElementById("wearme-bubble").style.display = "none";
    });
  }

  function buildPersonaSummary(persona) {
    if (persona.totalEvents === 0) {
      return "<strong>Olá! 👋</strong>Sou seu assistente de compras. Navega aí que eu vou aprendendo seus gostos!";
    }

    var parts = ["<strong>Seu perfil ✨</strong>"];

    if (persona.gender !== "unknown") {
      parts.push(persona.gender === "female" ? "👩 Feminino" : "👨 Masculino");
    }

    var topCats = getTopKeys(persona.categories, 2);
    if (topCats.length > 0) {
      parts.push("❤️ Interesses: " + topCats.join(", "));
    }

    var topBrands = getTopKeys(persona.brands, 2);
    if (topBrands.length > 0) {
      parts.push("🏷️ Marcas: " + topBrands.join(", "));
    }

    if (persona.priceRange.count > 0) {
      parts.push("💰 Faixa: R$ " + persona.priceRange.avg + " (média)");
    }

    parts.push("<br><small style='color:#999'>📊 " + persona.totalEvents + " interações · " + _config.name + "</small>");

    return parts.join("<br>");
  }

  function getTopKeys(obj, n) {
    var entries = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        entries.push({ key: key, value: obj[key] });
      }
    }
    entries.sort(function (a, b) { return b.value - a.value; });
    var result = [];
    for (var i = 0; i < Math.min(n, entries.length); i++) {
      result.push(entries[i].key);
    }
    return result;
  }

  // ╔══════════════════════════════════════════════╗
  // ║              AÇÕES DO WIDGET                 ║
  // ╚══════════════════════════════════════════════╝

  var bubbleTimer = null;

  function showBubble(html) {
    var bubble = document.getElementById("wearme-bubble");
    var text = document.getElementById("wearme-bubble-text");
    if (!bubble || !text) return;

    text.innerHTML = html;
    bubble.style.display = "flex";

    if (bubbleTimer) clearTimeout(bubbleTimer);

    bubbleTimer = setTimeout(function () {
      bubble.style.display = "none";
    }, BUBBLE_AUTO_CLOSE_MS);
  }

  function activateWidget() {
    var floatBtn = document.querySelector(".wearme-float");
    var badge = document.getElementById("wearme-badge");
    if (!floatBtn) return;

    floatBtn.classList.add("wearme-active");
    if (badge) badge.style.display = "flex";

    setTimeout(function () {
      floatBtn.classList.remove("wearme-active");
      if (badge) badge.style.display = "none";
    }, WIDGET_PULSE_MS);
  }

  function clearHighlights() {
    var highlighted = document.querySelectorAll(".wearme-highlighted");
    for (var i = 0; i < highlighted.length; i++) {
      highlighted[i].classList.remove("wearme-highlighted");
    }

    var badges = document.querySelectorAll(".wearme-product-badge");
    for (var j = 0; j < badges.length; j++) {
      badges[j].remove();
    }
  }

  function highlightProduct(card) {
    if (!card) return;

    // Limpa highlight anterior
    clearHighlights();

    card.classList.add("wearme-highlighted");
    card.style.position = "relative";

    var badge = document.createElement("div");
    badge.className = "wearme-product-badge";
    badge.textContent = "✨ Pra você";
    card.appendChild(badge);

    var data = extractProductData(card);
    console.log("[WearMe] highlight atualizado → " + (data.name || data.productId));
  }

  function showCouponModal(code, persona) {
    var existing = document.getElementById("wearme-coupon-container");
    if (existing) existing.remove();

    var greeting = persona.gender === "female"
      ? "Ei, tudo bem? 💅"
      : persona.gender === "male"
        ? "Ei, beleza? 👊"
        : "Ei! 👋";

    var topCat = getTopKeys(persona.categories, 1)[0];
    var contextMsg = topCat
      ? "Vi que você curte <strong>" + topCat + "</strong>. "
      : "";

    var container = document.createElement("div");
    container.id = "wearme-coupon-container";
    container.innerHTML =
      '<div class="wearme-coupon-overlay" id="wearme-coupon-overlay"></div>' +
      '<div class="wearme-coupon-card">' +
        '<button class="wearme-coupon-close-btn" id="wearme-coupon-close">&times;</button>' +
        '<div style="font-size:48px; margin-bottom:12px">🎁</div>' +
        '<h3>' + greeting + '</h3>' +
        '<p>' + contextMsg + 'Que tal <strong>10% OFF</strong> pra fechar agora?</p>' +
        '<div class="wearme-coupon-code-box">' +
          '<span class="wearme-coupon-code-text">' + code + '</span>' +
          '<button class="wearme-coupon-copy-btn" id="wearme-coupon-copy">Copiar</button>' +
        '</div>' +
        '<span class="wearme-coupon-timer">Válido pelos próximos 15 minutos ⏰</span>' +
      '</div>';

    document.body.appendChild(container);

    var closeFn = function () { container.remove(); };
    document.getElementById("wearme-coupon-overlay").addEventListener("click", closeFn);
    document.getElementById("wearme-coupon-close").addEventListener("click", closeFn);

    document.getElementById("wearme-coupon-copy").addEventListener("click", function () {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code);
      } else {
        var ta = document.createElement("textarea");
        ta.value = code;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      this.textContent = "Copiado! ✓";
    });
  }

  // ╔══════════════════════════════════════════════╗
  // ║   FLUXO 1: CLIQUE EM PRODUTO → LISTA →INDICA ║
  // ╚══════════════════════════════════════════════╝

  /**
   * Escuta cliques nos cards de produto.
   * Cada clique = produto visualizado (PDP).
   * Acumula categoryClicks por categoria.
   * Com 5+ cliques na mesma categoria → indica cards daquela categoria.
   */
  function setupClickTracking() {
    var cards = findProductCards();

    for (var i = 0; i < cards.length; i++) {
      attachClickTracking(cards[i]);
    }

    console.log("[WearMe] Click tracking: " + cards.length + " cards encontrados (" + _config.name + ")");
  }

  function attachClickTracking(card) {
    if (card.hasAttribute("data-wearme-click")) return;
    card.setAttribute("data-wearme-click", "true");

    card.addEventListener("click", function (e) {
      // Ignora cliques em botões add-to-cart (tratados no fluxo 3)
      if (e.target.closest(_selectors.addToCart)) return;

      var data = extractProductData(card);
      if (!data.productId) return;

      onProductClick(card, data);
    });
  }

  /**
   * Registra visita a um produto e verifica se já acumulou
   * interesse suficiente em alguma categoria para indicar.
   */
  function onProductClick(card, data) {
    var persona = getPersona();

    // Garante campos no caso de persona antiga no storage
    if (!persona.viewedProducts) persona.viewedProducts = [];
    if (!persona.categoryClicks) persona.categoryClicks = {};
    if (!persona.flags.suggestedCategories) persona.flags.suggestedCategories = [];

    // Registra produto visitado (sem duplicar)
    if (persona.viewedProducts.indexOf(data.productId) === -1) {
      persona.viewedProducts.push(data.productId);
    }

    // Acumula cliques por categoria
    // data.category pode ser "calcas feminino" → splits em tokens
    var cats = data.category ? data.category.split(/[\s,\/]+/) : [];
    for (var i = 0; i < cats.length; i++) {
      var cat = cats[i].toLowerCase().trim();
      if (!cat || cat.length < 3) continue;
      persona.categoryClicks[cat] = (persona.categoryClicks[cat] || 0) + 1;
    }

    // Enriquece persona (peso 3 — clique é ação forte)
    enrichPersona(persona, {
      event: "product_click",
      category: data.category,
      brand: data.brand,
      price: data.price,
      weight: 3
    });

    console.log("[WearMe] produto clicado: " + (data.name || data.productId));
    console.log("[WearMe] categoryClicks:", persona.categoryClicks);

    // Verifica gatilho: alguma categoria atingiu 5 cliques?
    checkCategoryThreshold(persona);
  }

  /**
   * Verifica se alguma categoria atingiu o threshold.
   * Se sim, re-escaneia os cards visíveis e destaca os dessa categoria.
   */
  function checkCategoryThreshold(persona) {
    for (var cat in persona.categoryClicks) {
      if (!persona.categoryClicks.hasOwnProperty(cat)) continue;

      var count = persona.categoryClicks[cat];
      var alreadySuggested = persona.flags.suggestedCategories.indexOf(cat) !== -1;

      if (count >= CATEGORY_CLICK_THRESHOLD && !alreadySuggested) {
        console.log("[WearMe] interesse confirmado em categoria: " + cat + " (" + count + " cliques)");

        // Marca para não repetir a sugestão nessa categoria
        persona.flags.suggestedCategories.push(cat);
        savePersona(persona);

        // Destaca cards da categoria na página atual
        highlightCategoryCards(cat, persona);
        break;
      }
    }
  }

  /**
   * Varre todos os cards visíveis e destaca aqueles que pertencem
   * à categoria de interesse. Exibe mensagem contextual.
   */
  function highlightCategoryCards(category, persona) {
    var cards = findProductCards();
    var matched = [];

    for (var i = 0; i < cards.length; i++) {
      var data = extractProductData(cards[i]);
      var cardCats = data.category ? data.category.toLowerCase() : "";

      if (cardCats.indexOf(category) !== -1) {
        matched.push({ card: cards[i], data: data });
      }
    }

    if (matched.length === 0) return;

    // Destaca o primeiro card da categoria
    var best = matched[0];
    highlightProduct(best.card);
    persona.flags.currentHighlight = best.data.productId;
    savePersona(persona);

    // Mensagem contextualizada
    var catLabel = category.charAt(0).toUpperCase() + category.slice(1);
    showBubble(
      "<strong>Você curte " + catLabel + "! 🎯</strong>" +
      "Baseado no que você viu, separei " +
      (matched.length > 1 ? matched.length + " opções" : "uma opção") +
      " pra você!"
    );
    activateWidget();
  }

  /**
   * Chamada quando novos cards aparecem no DOM (SPA/VTEX).
   * Checa imediatamente se algum card da página bate com categoria de interesse.
   */
  function checkNewCardsAgainstInterests() {
    var persona = getPersona();
    if (!persona.categoryClicks) return;

    for (var cat in persona.categoryClicks) {
      if (!persona.categoryClicks.hasOwnProperty(cat)) continue;
      if (persona.categoryClicks[cat] >= CATEGORY_CLICK_THRESHOLD) {
        highlightCategoryCards(cat, persona);
        break; // destaca apenas a categoria mais relevante por vez
      }
    }
  }

  // ╔══════════════════════════════════════════════╗
  // ║        FLUXO 2: BUSCA → SUGESTÃO             ║
  // ╚══════════════════════════════════════════════╝

  function setupSearchTracking() {
    var form = findSearchForm();

    if (!form) {
      console.log("[WearMe] Search tracking: formulário de busca não encontrado");
      return;
    }

    form.addEventListener("submit", function () {
      var input = findSearchInput(form);
      if (!input) return;

      var query = input.value.trim();
      if (!query) return;

      var persona = getPersona();

      persona.searches.push(query);
      if (persona.searches.length > 10) persona.searches.shift();

      enrichPersona(persona, {
        event: "search_query",
        category: query,
        brand: "",
        price: 0,
        weight: 2
      });

      console.log("[WearMe] busca: '" + query + "'");

      var now = Date.now();
      if (now - persona.flags.lastSuggestionAt > SUGGESTION_COOLDOWN_MS) {
        setTimeout(function () {
          showBubble(
            "<strong>Posso ajudar! 🔍</strong>" +
            "Vi que você buscou \"<em>" + query + "</em>\". " +
            "Quer que eu filtre as melhores opções?"
          );
          activateWidget();
        }, 800);

        persona.flags.lastSuggestionAt = now;
        savePersona(persona);
      }
    });

    console.log("[WearMe] Search tracking: ativo");
  }

  // ╔══════════════════════════════════════════════╗
  // ║      FLUXO 3: CART + HESITAÇÃO → CUPOM       ║
  // ╚══════════════════════════════════════════════╝

  function setupCartTracking() {
    document.addEventListener("click", function (e) {
      var target = e.target;

      // Procura botão add to cart usando os selectors da plataforma
      var btn = null;
      var addSelectors = _selectors.addToCart.split(", ");
      for (var s = 0; s < addSelectors.length; s++) {
        btn = target.closest(addSelectors[s].trim());
        if (btn) break;
      }

      if (!btn) return;

      // Encontra o card pai
      var card = null;
      var cardSelectors = _selectors.productCard.split(", ");
      for (var c = 0; c < cardSelectors.length; c++) {
        card = btn.closest(cardSelectors[c].trim());
        if (card) break;
      }

      var data = card ? extractProductData(card) : { productId: "unknown", category: "", brand: "", price: 0 };

      var persona = getPersona();

      persona.cartAdds.push({ productId: data.productId, at: Date.now() });

      enrichPersona(persona, {
        event: "add_to_cart",
        category: data.category,
        brand: data.brand,
        price: data.price,
        weight: 5
      });

      console.log("[WearMe] add to cart: " + (data.name || data.productId));

      if (!persona.flags.couponOffered) {
        setTimeout(function () {
          if (document.visibilityState !== "visible") return;

          var url = window.location.href.toLowerCase();
          if (url.indexOf("checkout") !== -1 || url.indexOf("carrinho") !== -1 || url.indexOf("cart") !== -1) return;

          var freshPersona = getPersona();
          if (freshPersona.flags.couponOffered) return;

          showCouponModal("WEARME10", freshPersona);

          freshPersona.flags.couponOffered = true;
          savePersona(freshPersona);

          console.log("[WearMe] Cupom exibido!");
        }, HESITATION_MS);
      }
    });

    console.log("[WearMe] Cart tracking: ativo");
  }

  // ╔══════════════════════════════════════════════╗
  // ║             OBSERVADOR DE DOM                ║
  // ╚══════════════════════════════════════════════╝

  /**
   * Observa novas renderizações para re-trackear cards
   * (VTEX e SPAs carregam conteúdo dinâmico)
   */
  function setupMutationObserver() {
    if (!window.MutationObserver) return;

    var debounceTimer = null;

    var observer = new MutationObserver(function () {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        var cards = findProductCards();
        // Re-aplica click tracking em cards novos
        for (var i = 0; i < cards.length; i++) {
          attachClickTracking(cards[i]);
        }
        // Checa se algum card novo bate com categoria já confirmada
        checkNewCardsAgainstInterests();
      }, 500);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    console.log("[WearMe] MutationObserver: monitorando DOM dinâmico");
  }

  // ╔══════════════════════════════════════════════╗
  // ║                   INIT                       ║
  // ╚══════════════════════════════════════════════╝

  function init(options) {
    options = options || {};

    // Evita double init
    if (document.getElementById("wearme-shopper-root")) return;

    // Resolve plataforma
    var platformKey = (options.platform || "custom").toLowerCase();
    var platform = PLATFORMS[platformKey] || PLATFORMS.custom;

    // Monta config final (platform defaults + overrides do usuário)
    _config = {
      name: platform.name,
      platform: platformKey
    };

    // Monta selectors: defaults da plataforma + overrides
    _selectors = {};
    for (var key in platform.selectors) {
      if (platform.selectors.hasOwnProperty(key)) {
        _selectors[key] = platform.selectors[key];
      }
    }

    // Override de selectors via init
    if (options.selectors) {
      for (var sKey in options.selectors) {
        if (options.selectors.hasOwnProperty(sKey)) {
          _selectors[sKey] = options.selectors[sKey];
        }
      }
    }

    // Monta extractors: defaults da plataforma + overrides
    _extractors = {};
    for (var eKey in platform.extractors) {
      if (platform.extractors.hasOwnProperty(eKey)) {
        _extractors[eKey] = platform.extractors[eKey];
      }
    }

    if (options.extractors) {
      for (var exKey in options.extractors) {
        if (options.extractors.hasOwnProperty(exKey)) {
          _extractors[exKey] = options.extractors[exKey];
        }
      }
    }

    // 2. Widget flutuante
    createWidget();

    // 3. Fluxos
    console.log("[WearMe Shopper] Inicializando fluxos...");
    setupClickTracking();
    setupSearchTracking();
    setupCartTracking();

    // 4. Observer para conteúdo dinâmico (SPA / VTEX)
    setupMutationObserver();

    // Log
    var persona = getPersona();
    var cards = findProductCards();
    console.log("[WearMe Shopper] ✅ SDK carregado");
    console.log("[WearMe Shopper] Plataforma: " + _config.name);
    console.log("[WearMe Shopper] Cards encontrados: " + cards.length);
    console.log("[WearMe Shopper] Selectors:", _selectors);
    console.log("[WearMe Shopper] Persona:", persona);
  }

  // Expõe API pública
  root.WearMeShopper = {
    init: function (options) {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () { init(options); });
      } else {
        init(options);
      }
    },
    getPersona: getPersona,
    resetPersona: function () {
      localStorage.removeItem(PERSONA_KEY);
      clearHighlights();
      console.log("[WearMe] Persona resetada");
    },
    getPlatforms: function () { return Object.keys(PLATFORMS); }
  };

})(typeof window !== "undefined" ? window : this);
