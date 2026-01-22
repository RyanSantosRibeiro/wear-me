(function () {
    const ICONS = {
        x: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
        ruler: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0l12.6 12.6z"/><line x1="13" y1="7" x2="14" y2="8"/><line x1="13" y1="7" x2="13" y2="7"/><line x1="9" y1="11" x2="10" y2="12"/><line x1="9" y1="11" x2="9" y2="11"/><line x1="5" y1="15" x2="6" y2="16"/><line x1="5" y1="15" x2="5" y2="15"/><line x1="17" y1="3" x2="18" y2="4"/><line x1="17" y1="3" x2="17" y2="3"/></svg>`,
        download: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
        chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`
    };

    const CSS = `
        :root {
            --wm-fms-primary: #2563eb;
        }
        .wearme-fms-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.6);
            z-index: 99999; display: flex; align-items: center; justify-content: center;
            opacity: 0; visibility: hidden; transition: all 0.3s ease;
            font-family: 'Inter', sans-serif;
        }
        .wearme-fms-overlay.open { opacity: 1; visibility: visible; }
        
        .wearme-fms-modal {
            background: white; width: 900px; max-width: 95vw; height: 600px; max-height: 90vh;
            border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.05);
            display: grid; grid-template-columns: 2fr 3fr; overflow: hidden;
            transform: scale(0.95); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
        }
        .wearme-fms-overlay.open .wearme-fms-modal { transform: scale(1); }

        .wearme-fms-logo {
            position: absolute; top: 20px; left: 20px; z-index: 10;
            max-height: 40px; width: auto; object-fit: contain; pointer-events: none;
        }

        @media (max-width: 768px) {
            .wearme-fms-modal { grid-template-columns: 1fr; height: 100%; border-radius: 0; }
            .wearme-fms-left-panel { display: none; }
            .wearme-fms-logo { top: 15px; left: 15px; max-height: 30px; }
        }

        /* Left Panel */
        .wearme-fms-left-panel {
            background: #f3f4f6; position: relative; overflow: hidden;height: 100%;
        }
        .wearme-fms-product-img {
            width: 100%; height: 100%; object-fit: cover; mix-blend-mode: multiply; opacity: 0.9;
        }
        .wearme-fms-badge {
            position: absolute; top: 1.5rem; left: 1.5rem;
            background: black; color: white; padding: 0.5rem 1rem;
            border-radius: 999px; font-size: 0.75rem; font-weight: 700;
            text-transform: uppercase; letter-spacing: 0.05em;
        }
        .wearme-fms-left-content {
            position: absolute; bottom: 0; left: 0; right: 0; padding: 4rem 2rem 2rem;
            background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); color: white;
        }

        /* Right Panel */
        .wearme-fms-right-panel {
            padding: 2.5rem; display: flex; flex-direction: column; position: relative;
        }
        
        .wearme-fms-header {
            display: flex; justify-content: space-between; align-items: center;
        }
        .wearme-fms-steps-indicator {
            font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--wm-fms-primary); letter-spacing: 0.05em;
        }
        .wearme-fms-close {
            background: none; border: none; cursor: pointer; color: #9ca3af; padding: 0.5rem;
            border-radius: 50%; transition: color 0.2s;
        }
        .wearme-fms-close:hover { color: #ef4444; background: #fee2e2; }

        .wearme-fms-content { flex: 1; overflow-y: auto; padding-right: 0.5rem; }
        
        /* Titles/Text */
        .wearme-fms-h2 { font-size: 1.5rem; font-weight: 800; color: #111827;  }
        .wearme-fms-p { color: #6b7280; margin-bottom: 1.5rem; }

        /* Grid Buttons */
        .wearme-fms-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .wearme-fms-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
        
        .wearme-fms-btn-tile {
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            padding: 1.5rem; border: 2px solid #f3f4f6; border-radius: 1rem;
            background: white; cursor: pointer; transition: all 0.2s; gap: 0.5rem;
            font-weight: 700; color: #374151;
        }
        .wearme-fms-btn-tile:hover { border-color: var(--wm-fms-primary); background: #eff6ff; color: var(--wm-fms-primary); }
        
        .wearme-fms-list-btn {
            width: 100%; display: flex; align-items: center; justify-content: space-between;
            padding: 1rem; border: 2px solid #f3f4f6; border-radius: 1rem;
            background: white; cursor: pointer; transition: all 0.2s;
            text-align: left; margin-bottom: 0.75rem;
        }
        .wearme-fms-list-btn:hover { border-color: var(--wm-fms-primary); background: #eff6ff; }
        .wearme-fms-list-label { font-weight: 700; color: #111827; display: block; }
        .wearme-fms-list-desc { font-size: 0.875rem; color: #9ca3af; }

        /* Trigger Button Styling */
        .wearme-fms-trigger-btn {
            width: 100%; padding: 0.75rem 1rem; background: #f3f4f6;
            border: none; border-radius: 0.75rem; font-weight: 700; color: #1f2937;
            cursor: pointer; display: flex; align-items: center; justify-content: space-between;
            transition: background 0.2s;
        }
        .wearme-fms-trigger-btn:hover { background: #e5e7eb; }

        /* Loader */
        .wearme-fms-loader {
            border: 3px solid #e5e7eb; border-top: 3px solid var(--wm-fms-primary); border-radius: 50%;
            width: 24px; height: 24px; animation: spin 1s linear infinite; margin: 2rem auto;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        /* Comparison List */
        .wearme-fms-comparison {
            margin-top: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            text-align: left;
        }
        .wearme-fms-comp-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem 1rem;
            border-radius: 12px;
            background: #f9fafb;
            border: 2px solid transparent;
            transition: all 0.2s;
        }
        .wearme-fms-comp-card.recommended {
            border-color: var(--wm-fms-primary);
            background: #eff6ff;
        }
        .wearme-fms-comp-size {
            font-size: 1.125rem;
            font-weight: 800;
            color: #111;
        }
        .wearme-fms-comp-info {
            text-align: right;
        }
        .wearme-fms-comp-status {
            font-size: 0.65rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .wearme-fms-status-tight { color: #ef4444; }
        .wearme-fms-status-recommended { color: var(--wm-fms-primary); }
        .wearme-fms-status-loose { color: #6b7280; }
        .wearme-fms-comp-cm { font-size: 0.75rem; color: #9ca3af; margin-top: 2px; }
    `;

    // Data corresponding to DB
    const BRANDS = [
        { id: 1, name: "Nike" },
        { id: 2, name: "Adidas" },
        { id: 3, name: "Vans" },
        { id: 4, name: "All Star" }
    ];

    const CATEGORIES = [
        { id: 1, label: "Chuteira / Performance", score: 1, desc: "Forma bem justa" },
        { id: 2, label: "Corrida / Esportivo", score: 2, desc: "Forma padrão/justa" },
        { id: 3, label: "Casual / Dia a dia", score: 3, desc: "Forma padrão" },
        { id: 4, label: "Skate / Conforto", score: 4, desc: "Forma mais larga" },
        { id: 5, label: "Bota / Hiking", score: 5, desc: "Forma muito larga" }
    ];

    const FindMySize = {
        config: {
            buttonSelector: '',
            targetBrandId: 2, // Default Adidas
            productImage: '',
            productName: '',
            highlightColor: '#2563eb',
            logoUrl: '',
            apiKey: '',
        },
        state: {
            step: 1,
            brandId: null,
            categoryScore: null,
            size: null,
            result: null,
            loading: false
        },
        elements: {},

        init(config) {
            this.config = { ...this.config, ...config };
            this.injectStyles();
            this.setupTrigger();
            this.createModal();

            // Load from Session Storage
            const savedBrand = sessionStorage.getItem('wearme_fms_brand_id');
            const savedCat = sessionStorage.getItem('wearme_fms_category_score');
            const savedSize = sessionStorage.getItem('wearme_fms_size');

            if (savedBrand && savedCat && savedSize) {
                console.log("FMS: Found saved session data", { savedBrand, savedCat, savedSize });
                this.state.brandId = parseInt(savedBrand);
                this.state.categoryScore = parseInt(savedCat);
                const size = parseFloat(savedSize);
                this.state.size = size;
            }
        },

        injectStyles() {
            if (document.getElementById('wearme-fms-css-v3')) {
                // Update variable if already injected
                document.documentElement.style.setProperty('--wm-fms-primary', this.config.highlightColor);
                return;
            }
            const style = document.createElement('style');
            style.id = 'wearme-fms-css-v3';
            style.textContent = CSS;
            document.head.appendChild(style);
            document.documentElement.style.setProperty('--wm-fms-primary', this.config.highlightColor);
        },

        setupTrigger() {
            const container = document.querySelector(this.config.buttonSelector);
            if (!container) return;

            container.innerHTML = `
                <button class="wearme-fms-trigger-btn" onclick="FindMySize.open()">
                    <span style="display:flex; align-items:center; gap:8px">
                        ${ICONS.ruler} Descobrir meu tamanho
                    </span>
                    ${ICONS.chevronRight}
                </button>
            `;
        },

        createModal() {
            const el = document.createElement('div');
            el.className = 'wearme-fms-overlay';
            el.innerHTML = `
                <div class="wearme-fms-modal" onclick="event.stopPropagation()">
                    ${this.config.logoUrl ? `<img src="${this.config.logoUrl}" class="wearme-fms-logo" />` : ''}
                    <div class="wearme-fms-left-panel">
                        <img src="${this.config.productImage}" class="wearme-fms-product-img">
                        <div class="wearme-fms-left-content">
                            <p style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:rgba(255,255,255,0.8); margin:0">Guia Oficial</p>
                            <h3 style="font-size:1.5rem; font-weight:900; color:white; line-height:1.1; margin-top:0.25rem">
                                Descubra seu tamanho ideal em segundos.
                            </h3>
                            <div style=" display: flex; flex-direction: column; gap: 1rem;">
                                <p style="font-size: 0.875rem; color: rgba(255,255,255,0.9); line-height: 1.5; margin: 0;">
                                    ${this.config.productName}
                                </p>
                                <a href="/fita-metrica.pdf" target="_blank" class="wearme-sc-download-btn">
                                    ${ICONS.download} Abrir Fita Métrica
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="wearme-fms-right-panel">
                        <div class="wearme-fms-header">
                            <span id="wm-fms-step-indicator" class="wearme-fms-steps-indicator">Passo 1 de 3</span>
                            <button class="wearme-fms-close" onclick="FindMySize.close()">${ICONS.x}</button>
                        </div>
                        <div id="wm-fms-content" class="wearme-fms-content"></div>
                    </div>
                </div>
            `;
            el.onclick = (e) => { if (e.target === el) this.close(); };
            document.body.appendChild(el);
            this.elements.overlay = el;
            this.elements.content = el.querySelector('#wm-fms-content');
            this.elements.indicator = el.querySelector('#wm-fms-step-indicator');
        },

        open() {
            // Check if we have valid state to auto-run
            if (this.state.brandId && this.state.categoryScore && this.state.size && !this.state.result) {
                this.elements.overlay.classList.add('open');
                this.fetchRecommendation(this.state.size);
            } else if (!this.state.result) {
                if (!this.state.brandId) this.reset();
                this.elements.overlay.classList.add('open');
                this.render();
            } else {
                this.elements.overlay.classList.add('open');
                this.render(); // Show existing result
            }
        },

        close() {
            this.elements.overlay.classList.remove('open');
        },

        reset() {
            this.state = { step: 1, brandId: null, categoryScore: null, size: null, result: null, loading: false };
        },

        fullReset() {
            this.reset();
            sessionStorage.removeItem('wearme_fms_brand_id');
            sessionStorage.removeItem('wearme_fms_category_score');
            sessionStorage.removeItem('wearme_fms_size');
            this.render();
        },

        async fetchRecommendation(size) {
            this.state.loading = true;
            this.state.size = size;

            // SAVE TO SESSION
            sessionStorage.setItem('wearme_fms_size', size);

            this.render();

            try {
                const params = new URLSearchParams({
                    apiKey: this.config.apiKey,
                    brand_id: this.state.brandId,
                    size: size,
                    target_brand_id: this.config.targetBrandId,
                    source_width_score: this.state.categoryScore
                });

                const res = await fetch(`/api/wearme/recommend?${params.toString()}`);
                const data = await res.json();
                this.state.result = data;
                this.state.step = 4;
            } catch (e) {
                console.error(e);
                alert("Erro ao calcular. Tente novamente.");
                this.state.step = 3;
            } finally {
                this.state.loading = false;
                this.render();
            }
        },

        render() {
            const { step, loading, result } = this.state;
            const container = this.elements.content;
            const indicator = this.elements.indicator;

            if (loading) {
                container.innerHTML = `
                    <div style="text-align:center; padding: 4rem 0;">
                        <div class="wearme-fms-loader"></div>
                        <p style="font-weight:700; color:var(--wm-fms-primary); text-transform:uppercase; font-size:0.875rem; letter-spacing:1px">Calculando...</p>
                    </div>
                `;
                return;
            }

            if (step === 1) {
                indicator.textContent = "Passo 1 de 3";
                container.innerHTML = `
                    <h2 class="wearme-fms-h2">Qual marca você usa?</h2>
                    <p class="wearme-fms-p">Selecione uma marca de referência.</p>
                    <div class="wearme-fms-grid-2">
                        ${BRANDS.map(b => `
                            <button class="wearme-fms-btn-tile" onclick="
                                FindMySize.state.brandId=${b.id}; 
                                sessionStorage.setItem('wearme_fms_brand_id', ${b.id});
                                FindMySize.state.step=2; 
                                FindMySize.render()">
                                ${b.name}
                            </button>
                        `).join('')}
                    </div>
                `;
            } else if (step === 2) {
                indicator.textContent = "Passo 2 de 3";
                container.innerHTML = `
                    <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem">
                        <button onclick="FindMySize.state.step=1; FindMySize.render()" style="background:none; border:none; cursor:pointer; font-weight:700; color:#6b7280">< Voltar</button>
                    </div>
                    <h2 class="wearme-fms-h2">Qual o modelo?</h2>
                    <p class="wearme-fms-p">Para entendermos a forma do calçado.</p>
                    <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:0.5rem">
                        ${CATEGORIES.map(c => `
                            <button class="wearme-fms-list-btn" onclick="
                                FindMySize.state.categoryScore=${c.score}; 
                                sessionStorage.setItem('wearme_fms_category_score', ${c.score});
                                FindMySize.state.step=3; 
                                FindMySize.render()">
                                <div>
                                    <span class="wearme-fms-list-label">${c.label}</span>
                                    <span class="wearme-fms-list-desc">${c.desc}</span>
                                </div>
                                ${ICONS.chevronRight}
                            </button>
                        `).join('')}
                    </div>
                `;
            } else if (step === 3) {
                indicator.textContent = "Passo 3 de 3";
                container.innerHTML = `
                    <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem">
                        <button onclick="FindMySize.state.step=2; FindMySize.render()" style="background:none; border:none; cursor:pointer; font-weight:700; color:#6b7280">< Voltar</button>
                    </div>
                    <h2 class="wearme-fms-h2">Qual tamanho?</h2>
                    <p class="wearme-fms-p">Selecione o tamanho que fica confortável.</p>
                    <div class="wearme-fms-grid-4">
                        ${Array.from({ length: 13 }, (_, i) => 34 + i).map(s => `
                            <button class="wearme-fms-btn-tile" onclick="FindMySize.fetchRecommendation(${s})">
                                ${s}
                            </button>
                        `).join('')}
                    </div>
                `;
            } else if (step === 4 && result) {
                indicator.textContent = "Resultado";
                const refCm = result.debug?.source_user_cm || 0;

                container.innerHTML = `
                    <div style="text-align:center; padding:1rem 0; animation: fadeIn 0.5s">
                        <p style="font-size:0.875rem; font-weight:700; text-transform:uppercase; color:#9ca3af; letter-spacing:1px; margin-bottom:0.5rem">Seu Tamanho Recomendado</p>
                        <h3 style="font-size:3.5rem; font-weight:900; color:#111; line-height:1; margin-bottom:1rem">${result.recommended_size}</h3>
                        
                        <div style="background:#f9fafb; padding:1rem; border-radius:1rem; margin-bottom:1.5rem">
                             <div style="display:flex; align-items:center; justify-content:center; gap:0.5rem; margin-bottom:0.25rem">
                                <div style="width:8px; height:8px; border-radius:50%; background:${result.confidence_level === 'high' ? '#22c55e' : '#eab308'}"></div>
                                <span style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:#4b5563">Confiança ${result.confidence_level === 'high' ? 'Alta' : 'Média'}</span>
                             </div>
                             <p style="color:#4b5563; font-weight:500; font-size:0.875rem; margin:0">"${result.reasoning}"</p>
                        </div>

                        <div class="wearme-fms-comparison">
                            <p style="font-size:0.75rem; font-weight:700; color:#9ca3af; text-transform:uppercase; margin-bottom:0.25rem">Comparativo de Tamanhos</p>
                            ${result.comparison ? result.comparison.map(item => {
                    let statusLabel = "Normal";
                    let statusClass = "loose";
                    if (item.is_recommended) {
                        statusLabel = "Recomendado";
                        statusClass = "recommended";
                    } else if (item.status === 'tight') {
                        statusLabel = "Apertado";
                        statusClass = "tight";
                    } else if (item.measure_cm > refCm + 0.5) {
                        statusLabel = "Fogado";
                        statusClass = "loose";
                    }

                    return `
                                    <div class="wearme-fms-comp-card ${item.is_recommended ? 'recommended' : ''}">
                                        <div class="wearme-fms-comp-size">
                                            ${item.size}
                                            ${item.is_recommended ? `<span style="font-size:0.6rem; background:var(--wm-fms-primary); color:white; padding:2px 6px; border-radius:4px; vertical-align:middle; margin-left:4px">IDEAL</span>` : ''}
                                        </div>
                                        <div class="wearme-fms-comp-info">
                                            <div class="wearme-fms-comp-status wearme-fms-status-${statusClass}">${statusLabel}</div>
                                            <div class="wearme-fms-comp-cm">${item.measure_cm.toFixed(1)} cm</div>
                                        </div>
                                    </div>
                                `;
                }).join('') : ''}
                        </div>

                        <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;">
                            <button onclick="FindMySize.close()" style="width:100%; padding:1rem; background:#111827; color:white; border:none; border-radius:1rem; font-weight:700; cursor:pointer; font-size:1.125rem">
                                Perfeito, Comprar Agora
                            </button>
                            <button onclick="FindMySize.fullReset()" style="background:none; border:none; color:#6b7280; font-weight:600; cursor:pointer; padding:0.5rem">Refazer teste</button>
                        </div>
                    </div>
                `;
            }
        }
    };

    window.FindMySize = FindMySize;
})();
