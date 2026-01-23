(function () {
    const SVG_ICONS = {
        sparkles: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,
        x: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
        plus: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
        trash: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
        bag: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
        loader: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`
    };

    const STYLES = `
        :root {
            --wm-primary: #111827;
            --wm-accent: #3b82f6;
            --wm-bg: #ffffff;
            --wm-radius: 1.25rem;
            --wm-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .wm-buy-floating {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            z-index: 999998;
            background: var(--wm-primary);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 2rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            cursor: pointer;
            box-shadow: var(--wm-shadow);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateY(150%);
            border: none;
            font-family: inherit;
            font-weight: 700;
        }

        .wm-buy-floating.visible { transform: translateY(0); }

        .wm-buy-floating:hover { transform: scale(1.05); opacity: 0.8; }

        .wm-badge {
            background: var(--wm-accent);
            color: white;
            min-width: 20px;
            height: 20px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            padding: 0 6px;
        }

        .wm-drawer-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.3);
            backdrop-filter: blur(4px);
            z-index: 999999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .wm-drawer-overlay.open { opacity: 1; visibility: visible; }

        .wm-drawer {
            position: fixed;
            right: 0;
            top: 0;
            bottom: 0;
            width: 100%;
            max-width: 400px;
            background: white;
            z-index: 1000000;
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            box-shadow: -10px 0 30px rgba(0,0,0,0.1);
        }

        .wm-drawer-overlay.open .wm-drawer { transform: translateX(0); }

        .wm-drawer-header {
            padding: 1.5rem;
            border-bottom: 1px solid #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .wm-drawer-content {
            flex: 1;
            overflow-y: auto;
            padding: 1.5rem;
        }

        .wm-item-card {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: #f9fafb;
            border-radius: 1rem;
            margin-bottom: 0.75rem;
            border: 1px solid #f3f4f6;
        }

        .wm-item-img {
            width: 60px;
            height: 60px;
            border-radius: 0.5rem;
            object-fit: cover;
        }

        .wm-item-info { flex: 1; }
        .wm-item-name { font-size: 0.875rem; font-weight: 700; color: #111827; }

        .wm-remove-btn {
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            padding: 0.5rem;
            transition: color 0.2s;
        }

        .wm-remove-btn:hover { color: #ef4444; }

        .wm-generate-btn {
            width: 100%;
            padding: 1rem;
            background: var(--wm-primary);
            color: white;
            border-radius: 1rem;
            font-weight: 800;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            transition: all 0.2s;
        }

        .wm-generate-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .wm-result-container {
            margin-top: 1.5rem;
            border-radius: 1.5rem;
            overflow: hidden;
            background: #000;
            aspect-ratio: 3/4;
            position: relative;
        }

        .wm-result-img { width: 100%; height: 100%; object-fit: cover; }

        .wm-loading-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            gap: 1rem;
            text-align: center;
            padding: 2rem;
        }

        .animate-spin { animation: wm-spin 1s linear infinite; }
        @keyframes wm-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* Button Add Look State */
        .wearme-add.active {
            background: var(--wm-primary) !important;
            color: white !important;
        }
    `;

    const BuyTogetherWidget = {
        config: {
            apiKey: '',
            apiUrl: '/api/wearme/generate-look',
            highlightColor: '#ff92b5',
        },
        items: [],

        init(options) {
            this.config = { ...this.config, ...options };
            console.log('options WB', this.config);
            this.items = JSON.parse(sessionStorage.getItem('wearme_items')) || [];

            this.injectStyles();
            this.renderUI();
            this.setupListeners();
            this.updateState();
        },

        injectStyles() {
            const style = document.createElement('style');
            style.textContent = STYLES;
            document.head.appendChild(style);

            if (this.config.highlightColor) {
                console.log('highlightColor', this.config.highlightColor);
                document.body.style.setProperty('--wm-primary', this.config.highlightColor);
            }
        },

        renderUI() {
            // Floating Button
            this.floatingBtn = document.createElement('button');
            this.floatingBtn.className = 'wm-buy-floating';
            this.floatingBtn.innerHTML = `
                ${SVG_ICONS.sparkles}
                <span>Criar Look</span>
                <div class="wm-badge">0</div>
            `;
            document.body.appendChild(this.floatingBtn);

            // Drawer
            this.overlay = document.createElement('div');
            this.overlay.className = 'wm-drawer-overlay';
            this.overlay.innerHTML = `
                <div class="wm-drawer">
                    <div class="wm-drawer-header">
                        <h3 style="margin:0; font-weight:800;">Monte seu Look ✨</h3>
                        <button class="wm-close-drawer" style="background:none; border:none; cursor:pointer; color:#9ca3af;">${SVG_ICONS.x}</button>
                    </div>
                    <div class="wm-drawer-content">
                        <div id="wm-items-list"></div>
                        <div id="wm-result-area"></div>
                    </div>
                    <div style="padding:1.5rem; border-top:1px solid #f3f4f6;">
                        <button id="wm-generate-look" class="wm-generate-btn">
                            ${SVG_ICONS.sparkles} Gerar Look com IA
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(this.overlay);

            this.itemsList = document.getElementById('wm-items-list');
            this.resultArea = document.getElementById('wm-result-area');
            this.generateBtn = document.getElementById('wm-generate-look');
        },

        setupListeners() {
            // Click outside or close button
            this.floatingBtn.onclick = () => this.toggleDrawer(true);
            this.overlay.onclick = (e) => {
                if (e.target === this.overlay || e.target.closest('.wm-close-drawer')) {
                    this.toggleDrawer(false);
                }
            };

            // Listen for data-attributes clicks
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('.wearme-add');
                if (btn) {
                    const item = {
                        id: btn.dataset.wearmeId,
                        image: btn.dataset.wearmeImage,
                        name: btn.dataset.wearmeName || 'Produto'
                    };
                    this.toggleItem(item);
                }
            });

            this.generateBtn.onclick = () => this.generateLook();
        },

        toggleItem(item) {
            const index = this.items.findIndex(i => i.id === item.id);
            if (index > -1) {
                this.items.splice(index, 1);
            } else {
                if (this.items.length >= 6) return alert('Máximo de 6 itens para o look.');
                this.items.push(item);
            }
            this.updateState();
        },

        updateState() {
            sessionStorage.setItem('wearme_items', JSON.stringify(this.items));

            // Update floating button
            this.floatingBtn.classList.toggle('visible', this.items.length > 0);
            this.floatingBtn.querySelector('.wm-badge').textContent = this.items.length;

            // Update page buttons
            document.querySelectorAll('.wearme-add').forEach(btn => {
                const id = btn.dataset.wearmeId;
                const isActive = this.items.some(i => i.id === id);
                btn.classList.toggle('active', isActive);
                if (btn.tagName === 'BUTTON' || btn.tagName === 'A') {
                    btn.textContent = isActive ? 'Adicionado' : '+ Adicionar ao Look';
                }
            });

            this.renderItems();
            this.generateBtn.disabled = this.items.length < 2;
        },

        renderItems() {
            if (!this.itemsList) return;
            this.itemsList.innerHTML = this.items.map(item => `
                <div class="wm-item-card">
                    <img src="${item.image}" class="wm-item-img">
                    <div class="wm-item-info">
                        <div class="wm-item-name">${item.name}</div>
                    </div>
                    <button class="wm-remove-btn" onclick="window.WearmeBuy.toggleItem({id:'${item.id}'})">
                        ${SVG_ICONS.trash}
                    </button>
                </div>
            `).join('');
        },

        toggleDrawer(open) {
            this.overlay.classList.toggle('open', open);
        },

        async generateLook() {
            this.generateBtn.disabled = true;
            this.resultArea.innerHTML = `
                <div class="wm-result-container">
                    <div class="wm-loading-overlay">
                        ${SVG_ICONS.loader}
                        <p style="font-weight:700;">Criando uma composição perfeita para você...</p>
                    </div>
                </div>
            `;

            try {
                const response = await fetch(this.config.apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        apiKey: this.config.apiKey,
                        items: this.items,
                        sessionId: 'sess_' + Date.now()
                    })
                });

                const data = await response.json();
                if (data.success) {
                    this.resultArea.innerHTML = `
                        <div class="wm-result-container">
                            <img src="${data.lookImage}" class="wm-result-img">
                        </div>
                        <div style="margin-top:1rem; display:flex; gap:0.5rem;">
                             <button class="wm-generate-btn" style="background:#10b981;">${SVG_ICONS.bag} Comprar Look Completo</button>
                        </div>
                    `;
                } else {
                    throw new Error(data.error);
                }
            } catch (e) {
                alert('Erro ao gerar look: ' + e.message);
                this.resultArea.innerHTML = '';
            } finally {
                this.generateBtn.disabled = false;
            }
        }
    };

    window.WearmeBuy = BuyTogetherWidget;
})();
