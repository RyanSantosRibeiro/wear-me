(function () {
    const ICONS = {
        x: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
        ruler: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0l12.6 12.6z"/><line x1="13" y1="7" x2="14" y2="8"/><line x1="13" y1="7" x2="13" y2="7"/><line x1="9" y1="11" x2="10" y2="12"/><line x1="9" y1="11" x2="9" y2="11"/><line x1="5" y1="15" x2="6" y2="16"/><line x1="5" y1="15" x2="5" y2="15"/><line x1="17" y1="3" x2="18" y2="4"/><line x1="17" y1="3" x2="17" y2="3"/></svg>`,
        download: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
        chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`
    };

    const CSS = `
        :root {
            --wm-fms-clothing-primary: #2563eb;
        }
        .wearme-fms-clothing-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.6);
            z-index: 99999; display: flex; align-items: center; justify-content: center;
            opacity: 0; visibility: hidden; transition: all 0.3s ease;
            font-family: 'Inter', sans-serif;
        }
        .wearme-fms-clothing-overlay.open { opacity: 1; visibility: visible; }
        
        .wearme-fms-clothing-modal {
            background: white; width: 900px; max-width: 95vw; height: 600px; max-height: 90vh;
            border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.05);
            display: grid; grid-template-columns: 2fr 3fr; overflow: hidden;
            transform: scale(0.95); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
        }
        .wearme-fms-clothing-overlay.open .wearme-fms-clothing-modal { transform: scale(1); }

        .wearme-fms-clothing-logo {
            position: absolute; top: 20px; left: 20px; z-index: 10;
            max-height: 40px; width: auto; object-fit: contain; pointer-events: none;
        }

        @media (max-width: 768px) {
            .wearme-fms-clothing-modal { grid-template-columns: 1fr; height: 100%; border-radius: 0; }
            .wearme-fms-clothing-left-panel { display: none; }
            .wearme-fms-clothing-logo { top: 15px; left: 15px; max-height: 30px; }
        }

        /* Left Panel */
        .wearme-fms-clothing-left-panel {
            background: #f3f4f6; position: relative; overflow: hidden;height: 100%;
        }
        .wearme-fms-clothing-product-img {
            width: 100%; height: 100%; object-fit: cover; mix-blend-mode: multiply; opacity: 0.9;
        }
        .wearme-fms-clothing-left-content {
            position: absolute; bottom: 0; left: 0; right: 0; padding: 4rem 2rem 2rem;
            background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); color: white;
        }

        /* Right Panel */
        .wearme-fms-clothing-right-panel {
            padding: 2.5rem; display: flex; flex-direction: column; position: relative;max-height: 600px; overflow-y: auto;
        }
        
        .wearme-fms-clothing-header {
            display: flex; justify-content: space-between; align-items: center;
        }
        .wearme-fms-clothing-steps-indicator {
            font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--wm-fms-clothing-primary); letter-spacing: 0.05em;
        }
        .wearme-fms-clothing-close {
            background: none; border: none; cursor: pointer; color: #9ca3af; padding: 0.5rem;
            border-radius: 50%; transition: color 0.2s;
        }
        .wearme-fms-clothing-close:hover { color: #ef4444; background: #fee2e2; }

        .wearme-fms-clothing-content { flex: 1; overflow-y: auto; padding-right: 0.5rem; }
        
        /* Titles/Text */
        .wearme-fms-clothing-h2 { font-size: 1.5rem; font-weight: 800; color: #111827;  }
        .wearme-fms-clothing-p { color: #6b7280; margin-bottom: 1.5rem; }

        /* Grid Buttons */
        .wearme-fms-clothing-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .wearme-fms-clothing-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
        
        .wearme-fms-clothing-btn-tile {
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            padding: 1.5rem; border: 2px solid #f3f4f6; border-radius: 1rem;
            background: white; cursor: pointer; transition: all 0.2s; gap: 0.5rem;
            font-weight: 700; color: #374151;
        }
        .wearme-fms-clothing-btn-tile:hover { border-color: var(--wm-fms-clothing-primary); background: #eff6ff; color: var(--wm-fms-clothing-primary); }
        
        .wearme-fms-clothing-list-btn {
            width: 100%; display: flex; align-items: center; justify-content: space-between;
            padding: 1rem; border: 2px solid #f3f4f6; border-radius: 1rem;
            background: white; cursor: pointer; transition: all 0.2s;
            text-align: left; margin-bottom: 0.75rem;
        }
        .wearme-fms-clothing-list-btn:hover { border-color: var(--wm-fms-clothing-primary); background: #eff6ff; }
        .wearme-fms-clothing-list-label { font-weight: 700; color: #111827; display: block; }
        .wearme-fms-clothing-list-desc { font-size: 0.875rem; color: #9ca3af; }

        /* Trigger Button Styling */
        .wearme-fms-clothing-trigger-btn {
            width: 100%; padding: 0.75rem 1rem; background: #f3f4f6;
            border: none; border-radius: 0.75rem; font-weight: 700; color: #1f2937;
            cursor: pointer; display: flex; align-items: center; justify-content: space-between;
            transition: background 0.2s;
        }
        .wearme-fms-clothing-trigger-btn:hover { background: #e5e7eb; }

        /* Loader */
        .wearme-fms-clothing-loader {
            border: 3px solid #e5e7eb; border-top: 3px solid var(--wm-fms-clothing-primary); border-radius: 50%;
            width: 24px; height: 24px; animation: spin 1s linear infinite; margin: 2rem auto;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        /* Comparison List */
        .wearme-fms-clothing-comparison {
            margin-top: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            text-align: left;
        }
        .wearme-fms-clothing-comp-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem 1rem;
            border-radius: 12px;
            background: #f9fafb;
            border: 2px solid transparent;
            transition: all 0.2s;
        }
        .wearme-fms-clothing-comp-card.recommended {
            border-color: var(--wm-fms-clothing-primary);
            background: #eff6ff;
        }
        .wearme-fms-clothing-comp-size {
            font-size: 1.125rem;
            font-weight: 800;
            color: #111;
        }
        .wearme-fms-clothing-comp-info {
            text-align: right;
        }
        .wearme-fms-clothing-comp-status {
            font-size: 0.65rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .wearme-fms-clothing-status-tight { color: #ef4444; }
        .wearme-fms-clothing-status-recommended { color: var(--wm-fms-clothing-primary); }
        .wearme-fms-clothing-status-loose { color: #6b7280; }
        .wearme-fms-clothing-comp-cm { font-size: 0.75rem; color: #9ca3af; margin-top: 2px; }
    `;

    // Data Mock
    // Removed Brand Data


    const FITS = [
        { id: 1, label: "Slim Fit", desc: "Caimento justo ao corpo" },
        { id: 2, label: "Regular Fit", desc: "Caimento padrão" },
        { id: 3, label: "Oversized", desc: "Caimento largo e solto" }
    ];

    const FindMySizeClothing = {
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
            fitId: null,
            gender: 'male', // male | female
            height: '',
            weight: '',
            age: '',
            availableSizes: [], // Complete size data from API: [{size_br, chest_min_cm, chest_max_cm, length_cm}]
            result: null,
            loading: false
        },
        elements: {},

        init(config) {
            this.config = { ...this.config, ...config };
            this.injectStyles();
            this.setupTrigger();
            this.createModal();

            // Load from Session Storage (Clothing specific keys)
            const savedFit = sessionStorage.getItem('wearme_fms_cloth_fit_id');
            const savedGender = sessionStorage.getItem('wearme_fms_cloth_gender');
            const savedHeight = sessionStorage.getItem('wearme_fms_cloth_height');
            const savedWeight = sessionStorage.getItem('wearme_fms_cloth_weight');

            if (savedFit && savedHeight && savedWeight) {
                this.state.fitId = parseInt(savedFit);
                this.state.gender = savedGender || 'male';
                this.state.height = savedHeight;
                this.state.weight = savedWeight;
                // Optional: Trigger calculation immediately if all data is present? 
                // For now, let's just restore state and let user click 'Calculate'
            }
        },

        injectStyles() {
            if (document.getElementById('wearme-fms-clothing-css')) {
                document.documentElement.style.setProperty('--wm-fms-clothing-primary', this.config.highlightColor);
                return;
            }
            const style = document.createElement('style');
            style.id = 'wearme-fms-clothing-css';
            style.textContent = CSS;
            document.head.appendChild(style);
            document.documentElement.style.setProperty('--wm-fms-clothing-primary', this.config.highlightColor);
        },

        setupTrigger() {
            const container = document.querySelector(this.config.buttonSelector);
            if (!container) return;

            container.innerHTML = `
                <button class="wearme-fms-clothing-trigger-btn" onclick="FindMySizeClothing.open()">
                    <span style="display:flex; align-items:center; gap:8px">
                        ${ICONS.ruler} Descobrir meu tamanho
                    </span>
                    ${ICONS.chevronRight}
                </button>
            `;
        },

        createModal() {
            const el = document.createElement('div');
            el.className = 'wearme-fms-clothing-overlay';
            el.innerHTML = `
                <div class="wearme-fms-clothing-modal" onclick="event.stopPropagation()">
                    ${this.config.logoUrl ? `<img src="${this.config.logoUrl}" class="wearme-fms-clothing-logo" />` : ''}
                    <div class="wearme-fms-clothing-left-panel">
                        <img src="${this.config.productImage}" class="wearme-fms-clothing-product-img">
                        <div class="wearme-fms-clothing-left-content">
                            <p style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:rgba(255,255,255,0.8); margin:0">Guia Oficial</p>
                            <h3 style="font-size:1.5rem; font-weight:900; color:white; line-height:1.1; margin-top:0.25rem">
                                Caimento perfeito para seu estilo.
                            </h3>
                            <div style=" display: flex; flex-direction: column; gap: 1rem;">
                                <p style="font-size: 0.875rem; color: rgba(255,255,255,0.9); line-height: 1.5; margin: 0;">
                                    ${this.config.productName}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="wearme-fms-clothing-right-panel">
                        <div class="wearme-fms-clothing-header">
                            <span id="wm-fms-clothing-step-indicator" class="wearme-fms-clothing-steps-indicator">Passo 1 de 3</span>
                            <button class="wearme-fms-clothing-close" onclick="FindMySizeClothing.close()">${ICONS.x}</button>
                        </div>
                        <div id="wm-fms-clothing-content" class="wearme-fms-clothing-content"></div>
                    </div>
                </div>
            `;
            el.onclick = (e) => { if (e.target === el) this.close(); };
            document.body.appendChild(el);
            this.elements.overlay = el;
            this.elements.content = el.querySelector('#wm-fms-clothing-content');
            this.elements.indicator = el.querySelector('#wm-fms-clothing-step-indicator');
        },

        open() {
            if (this.state.result) {
                this.elements.overlay.classList.add('open');
                this.render();
            } else {
                if (!this.state.fitId) this.reset();
                this.elements.overlay.classList.add('open');
                this.render();
            }
        },

        close() {
            this.elements.overlay.classList.remove('open');
        },

        reset() {
            this.state = { step: 1, fitId: null, gender: 'male', height: '', weight: '', age: '', result: null, loading: false };
        },

        fullReset() {
            this.reset();
            sessionStorage.removeItem('wearme_fms_cloth_fit_id');
            sessionStorage.removeItem('wearme_fms_cloth_gender');
            sessionStorage.removeItem('wearme_fms_cloth_height');
            sessionStorage.removeItem('wearme_fms_cloth_weight');
            this.render();
        },

        async fetchSizes() {
            this.state.loading = true;
            this.render();

            try {
                // Fetch sizes from the target brand (clothing brand)
                const url = `/api/wearme/size-chart?apiKey=${this.config.apiKey}&brandId=${this.config.targetBrandId}`;
                const res = await fetch(url);
                if (!res.ok) throw new Error('Failed to load sizes');

                const data = await res.json();

                // Check if it's clothing category and has charts
                if (data.category === 'clothes' && data.charts && Array.isArray(data.charts)) {
                    // Store complete size data (not just size names)
                    this.state.availableSizes = data.charts;
                } else {
                    console.warn('No clothing sizes found or wrong category. Response:', data);
                    alert(`Esta marca não possui tamanhos de roupas cadastrados. Categoria encontrada: ${data.category || 'desconhecida'}`);
                    this.state.availableSizes = [];
                    this.state.step = 1; // Go back to fit selection
                    this.state.loading = false;
                    this.render();
                    return;
                }

                this.state.step = 2; // Move to body metrics step
            } catch (e) {
                console.error(e);
                alert("Não foi possível carregar os tamanhos para esta marca.");
                // Stay on step 1
            } finally {
                this.state.loading = false;
                this.render();
            }
        },

        async calculateSize() {
            const { height, weight, age, gender } = this.state;
            if (!height || !weight || !age) {
                alert("Por favor, preencha todos os campos.");
                return;
            }

            this.state.loading = true;
            this.render();

            sessionStorage.setItem('wearme_fms_cloth_height', height);
            sessionStorage.setItem('wearme_fms_cloth_weight', weight);
            sessionStorage.setItem('wearme_fms_cloth_gender', gender);

            // SIMULATE API/ALGORITHM
            setTimeout(() => {
                // Simple BMI/Height heuristic
                const h = parseInt(height);
                const w = parseInt(weight);
                let recommended = "M";

                // Very basic logic for demo purposes
                // Adjust base on gender
                if (gender === 'male') {
                    if (h < 170 && w < 65) recommended = "P";
                    else if (h < 175 && w < 75) recommended = "M";
                    else if (h < 185 && w < 90) recommended = "G";
                    else recommended = "GG";
                } else {
                    if (h < 160 && w < 55) recommended = "P";
                    else if (h < 170 && w < 65) recommended = "M";
                    else if (h < 175 && w < 75) recommended = "G";
                    else recommended = "GG";
                }

                // Adjust for Fit Preference
                // 1=Slim, 2=Regular, 3=Oversized
                // If Oversized preference, maybe suggest same size but explain it will be loose?
                // Or if user wants "Oversized" look, and the shirt IS oversized, we recommend their normal size?
                // Let's assume the user selects how they WANT it to fit.
                // If they want tight (Slim), and they measure M, maybe suggest P? 
                // Or just say "M (Slim Fit)".

                // Let's keep it simple: Map to standard sizes.

                // Use available sizes from API to build comparison
                const sizesList = this.state.availableSizes;

                // Find the index of recommended size
                const recIndex = sizesList.findIndex(s => s.size_br === recommended);

                // Build comparison with real data (show 2-3 sizes around the recommended)
                let comparison = [];
                if (recIndex !== -1) {
                    const startIdx = Math.max(0, recIndex - 1);
                    const endIdx = Math.min(sizesList.length - 1, recIndex + 2);

                    comparison = sizesList.slice(startIdx, endIdx + 1).map(sizeData => ({
                        size: sizeData.size_br,
                        chest_min_cm: sizeData.chest_min_cm,
                        chest_max_cm: sizeData.chest_max_cm,
                        length_cm: sizeData.length_cm,
                        is_recommended: sizeData.size_br === recommended,
                        status: sizeData.size_br === recommended ? 'ok' :
                            (sizesList.indexOf(sizeData) < recIndex ? 'tight' : 'loose')
                    }));
                } else {
                    // Fallback if recommended size not found in list
                    comparison = sizesList.slice(0, 4).map(sizeData => ({
                        size: sizeData.size_br,
                        chest_min_cm: sizeData.chest_min_cm,
                        chest_max_cm: sizeData.chest_max_cm,
                        length_cm: sizeData.length_cm,
                        is_recommended: sizeData.size_br === recommended,
                        status: 'ok'
                    }));
                }

                this.state.result = {
                    recommended_size: recommended,
                    confidence_level: "high",
                    reasoning: `Baseado em seu peso (${w}kg) e altura (${h}cm), o tamanho ${recommended} é o ideal para o caimento que você escolheu.`,
                    comparison: comparison
                };
                this.state.step = 3; // Result step
                this.state.loading = false;
                this.render();
            }, 1500);
        },

        render() {
            const { step, loading, result } = this.state;
            const container = this.elements.content;
            const indicator = this.elements.indicator;

            if (loading) {
                container.innerHTML = `
                    <div style="text-align:center; padding: 4rem 0;">
                        <div class="wearme-fms-clothing-loader"></div>
                        <p style="font-weight:700; color:var(--wm-fms-clothing-primary); text-transform:uppercase; font-size:0.875rem; letter-spacing:1px">Analisando Medidas...</p>
                    </div>
                `;
                return;
            }

            if (step === 1) {
                indicator.textContent = "Passo 1 de 2";
                container.innerHTML = `
                    <h2 class="wearme-fms-clothing-h2">Qual o caimento?</h2>
                    <p class="wearme-fms-clothing-p">Como você gosta que a peça fique no corpo?</p>
                    <div style="display:grid; grid-template-columns: 1fr; gap:0.5rem">
                        ${FITS.map(c => `
                            <button class="wearme-fms-clothing-list-btn" onclick="
                                FindMySizeClothing.state.fitId=${c.id}; 
                                sessionStorage.setItem('wearme_fms_cloth_fit_id', ${c.id});
                                FindMySizeClothing.fetchSizes()">
                                <div>
                                    <span class="wearme-fms-clothing-list-label">${c.label}</span>
                                    <span class="wearme-fms-clothing-list-desc">${c.desc}</span>
                                </div>
                                ${ICONS.chevronRight}
                            </button>
                        `).join('')}
                    </div>
                `;
            } else if (step === 2) {
                indicator.textContent = "Passo 2 de 2";
                const { gender, height, weight, age } = this.state;

                container.innerHTML = `
                    <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem">
                        <button onclick="FindMySizeClothing.state.step=1; FindMySizeClothing.render()" style="background:none; border:none; cursor:pointer; font-weight:700; color:#6b7280">< Voltar</button>
                    </div>
                    <h2 class="wearme-fms-clothing-h2">Suas Medidas</h2>
                    <p class="wearme-fms-clothing-p">Preencha os dados abaixo para calcularmos o melhor tamanho.</p>

                    <div style="margin-bottom: 1.5rem; display:flex; gap: 1rem; background:#f9fafb; padding:0.25rem; border-radius:1rem; width:fit-content">
                        <button 
                            onclick="FindMySizeClothing.state.gender='male'; FindMySizeClothing.render()"
                            style="padding:0.5rem 1.5rem; border-radius:0.75rem; border:none; cursor:pointer; font-weight:700; transition:all 0.2s; ${gender === 'male' ? 'background:white; shadow:sm; color:black' : 'background:transparent; color:#6b7280'}">
                            Masculino
                        </button>
                        <button 
                            onclick="FindMySizeClothing.state.gender='female'; FindMySizeClothing.render()"
                            style="padding:0.5rem 1.5rem; border-radius:0.75rem; border:none; cursor:pointer; font-weight:700; transition:all 0.2s; ${gender === 'female' ? 'background:white; shadow:sm; color:black' : 'background:transparent; color:#6b7280'}">
                            Feminino
                        </button>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem; margin-bottom:1.5rem">
                         <div>
                            <label style="display:block; font-size:0.75rem; font-weight:700; text-transform:uppercase; margin-bottom:0.5rem; color:#374151">Altura (cm)</label>
                            <input type="number" placeholder="ex: 175" value="${height}" 
                                oninput="FindMySizeClothing.state.height=this.value"
                                style="width:100%; padding:0.75rem; border:2px solid #e5e7eb; border-radius:0.75rem; font-weight:600; font-size:1rem; outline:none;"
                            />
                        </div>
                        <div>
                            <label style="display:block; font-size:0.75rem; font-weight:700; text-transform:uppercase; margin-bottom:0.5rem; color:#374151">Peso (kg)</label>
                            <input type="number" placeholder="ex: 70" value="${weight}" 
                                oninput="FindMySizeClothing.state.weight=this.value"
                                style="width:100%; padding:0.75rem; border:2px solid #e5e7eb; border-radius:0.75rem; font-weight:600; font-size:1rem; outline:none;"
                            />
                        </div>
                         <div>
                            <label style="display:block; font-size:0.75rem; font-weight:700; text-transform:uppercase; margin-bottom:0.5rem; color:#374151">Idade</label>
                            <input type="number" placeholder="ex: 25" value="${age}" 
                                oninput="FindMySizeClothing.state.age=this.value"
                                style="width:100%; padding:0.75rem; border:2px solid #e5e7eb; border-radius:0.75rem; font-weight:600; font-size:1rem; outline:none;"
                            />
                        </div>
                    </div>

                    <button onclick="FindMySizeClothing.calculateSize()" 
                        style="width:100%; padding:1rem; background:var(--wm-fms-clothing-primary); color:white; border:none; border-radius:1rem; font-weight:700; cursor:pointer; font-size:1.125rem; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2)">
                        Calcular Tamanho
                    </button>
                `;
            } else if (step === 3 && result) {
                indicator.textContent = "Resultado";
                const refCm = 50; // Mock base cm

                container.innerHTML = `
                    <div style="text-align:center; padding:1rem 0; animation: fadeIn 0.5s; overflow-y: auto">
                        <p style="font-size:0.875rem; font-weight:700; text-transform:uppercase; color:#9ca3af; letter-spacing:1px; margin-bottom:0.5rem">Seu Tamanho Recomendado</p>
                        <h3 style="font-size:3.5rem; font-weight:900; color:#111; line-height:1; margin-bottom:1rem">${result.recommended_size}</h3>
                        
                        <div style="background:#f9fafb; padding:1rem; border-radius:1rem; margin-bottom:1.5rem">
                             <div style="display:flex; align-items:center; justify-content:center; gap:0.5rem; margin-bottom:0.25rem">
                                <div style="width:8px; height:8px; border-radius:50%; background:${result.confidence_level === 'high' ? '#22c55e' : '#eab308'}"></div>
                                <span style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:#4b5563">Confiança ${result.confidence_level === 'high' ? 'Alta' : 'Média'}</span>
                             </div>
                             <p style="color:#4b5563; font-weight:500; font-size:0.875rem; margin:0">"${result.reasoning}"</p>
                         </div>

                        <div class="wearme-fms-clothing-comparison">
                            <p style="font-size:0.75rem; font-weight:700; color:#9ca3af; text-transform:uppercase; margin-bottom:0.25rem">Comparativo</p>
                            ${result.comparison ? result.comparison.map(item => {
                    let statusLabel = "Normal";
                    let statusClass = "loose";
                    if (item.is_recommended) {
                        statusLabel = "Recomendado";
                        statusClass = "recommended";
                    } else if (item.status === 'tight') {
                        statusLabel = "Apertado";
                        statusClass = "tight";
                    } else {
                        statusLabel = "Fogado";
                        statusClass = "loose";
                    }

                    return `
                                    <div class="wearme-fms-clothing-comp-card ${item.is_recommended ? 'recommended' : ''}">
                                        <div class="wearme-fms-clothing-comp-size">
                                            ${item.size}
                                            ${item.is_recommended ? `<span style="font-size:0.6rem; background:var(--wm-fms-clothing-primary); color:white; padding:2px 6px; border-radius:4px; vertical-align:middle; margin-left:4px">IDEAL</span>` : ''}
                                        </div>
                                        <div class="wearme-fms-clothing-comp-info">
                                            <div class="wearme-fms-clothing-comp-status wearme-fms-clothing-status-${statusClass}">${statusLabel}</div>
                                        </div>
                                    </div>
                                `;
                }).join('') : ''}
                        </div>

                        <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;">
                            <button onclick="FindMySizeClothing.close()" style="width:100%; padding:1rem; background:#111827; color:white; border:none; border-radius:1rem; font-weight:700; cursor:pointer; font-size:1.125rem">
                                Perfeito, Comprar Agora
                            </button>
                            <button onclick="FindMySizeClothing.fullReset()" style="background:none; border:none; color:#6b7280; font-weight:600; cursor:pointer; padding:0.5rem">Refazer teste</button>
                        </div>
                    </div>
                `;
            }
        }
    };

    window.FindMySizeClothing = FindMySizeClothing;
})();
