(function () {
    const ICONS = {
        x: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
        ruler: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0l12.6 12.6z"/><line x1="13" y1="7" x2="14" y2="8"/><line x1="13" y1="7" x2="13" y2="7"/><line x1="9" y1="11" x2="10" y2="12"/><line x1="9" y1="11" x2="9" y2="11"/><line x1="5" y1="15" x2="6" y2="16"/><line x1="5" y1="15" x2="5" y2="15"/><line x1="17" y1="3" x2="18" y2="4"/><line x1="17" y1="3" x2="17" y2="3"/></svg>`,
        download: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`
    };

    const CSS = `
        :root {
            --wearme-sc-primary: #2563eb;
        }
        .wearme-sc-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.6);
            z-index: 99999; display: flex; align-items: center; justify-content: center;
            opacity: 0; visibility: hidden; transition: all 0.3s ease;
            font-family: 'Inter', sans-serif;
        }
        .wearme-sc-overlay.open { opacity: 1; visibility: visible; }
        
        .wearme-sc-modal {
            background: white; width: 900px; max-width: 95vw; height: 600px; max-height: 90vh;
            border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.05);
            display: grid; grid-template-columns: 2fr 3fr; overflow: hidden;
            transform: scale(0.95); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
        }
        .wearme-sc-overlay.open .wearme-sc-modal { transform: scale(1); }

        @media (max-width: 768px) {
            .wearme-sc-modal { grid-template-columns: 1fr; height: 100%; border-radius: 0; }
            .wearme-sc-left-panel { display: none; }
            .wearme-sc-logo { top: 15px; left: 15px; max-height: 30px; }
        }

        /* Left Panel */
        .wearme-sc-left-panel {
            background: #f3f4f6; position: relative; overflow: hidden; height: 100%;
        }
        .wearme-sc-product-img {
            width: 100%; height: 100%; object-fit: cover; opacity: 0.9;
        }
        .wearme-sc-left-content {
            position: absolute; bottom: 0; left: 0; right: 0; padding: 4rem 2rem 2rem;
            background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); color: white;
        }

        /* Right Panel */
        .wearme-sc-right-panel {
            display: flex; flex-direction: column; position: relative; height: 100%;
        }

        .wearme-sc-logo {
            position: absolute; top: 20px; left: 20px; z-index: 10;
            max-height: 40px; width: auto; object-fit: contain; pointer-events: none;
        }

        .wearme-sc-header {
            padding: 1.5rem 2.5rem; display: flex; justify-content: space-between; align-items: center;
            border-bottom: 1px solid #f3f4f6; flex-shrink: 0;
        }

        .wearme-sc-title { font-size: 1.5rem; font-weight: 800; color: #111827; margin: 0; }
        
        .wearme-sc-close {
            background: none; border: none; cursor: pointer; color: #9ca3af; padding: 0.5rem;
            border-radius: 50%; transition: color 0.2s;
        }
        .wearme-sc-close:hover { color: #ef4444; background: #fee2e2; }

        .wearme-sc-content { padding: 0 2.5rem 2.5rem 2.5rem; overflow-y: auto; flex: 1; }

        /* Trigger Button */
        .wearme-sc-trigger-btn {
            width: 100%; padding: 0.75rem 1rem; background: #f3f4f6;
            border: none; border-radius: 0.75rem; font-weight: 700; color: #1f2937;
            cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
            transition: background 0.2s;
        }
        .wearme-sc-trigger-btn:hover { background: #e5e7eb; }

        /* Table */
        .wearme-sc-table {
            width: 100%; border-collapse: collapse; text-align: center;
            font-size: 0.875rem;
        }
        .wearme-sc-table th {
            font-weight: 700; color: #374151; padding: 0.75rem;
            border-bottom: 2px solid #f3f4f6; background: #f9fafb;
        }
        .wearme-sc-table td {
            padding: 0.75rem; border-bottom: 1px solid #f3f4f6; color: #4b5563;
        }
        .wearme-sc-table tr:last-child td { border-bottom: none; }
        .wearme-sc-table tr:hover td { background: #f9fafb; }

        /* Loader */
        .wearme-sc-loader {
            border: 3px solid #e5e7eb; border-top: 3px solid var(--wearme-sc-primary); border-radius: 50%;
            width: 24px; height: 24px; animation: spin 1s linear infinite; margin: 2rem auto;
        }
        .wearme-sc-download-btn {
            display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.2);
            backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.3); color: white;
            font-weight: 600; font-size: 0.875rem; padding: 0.75rem 1rem; border-radius: 0.5rem;
            text-decoration: none; transition: all 0.2s; cursor: pointer; width: fit-content;
        }
        .wearme-sc-download-btn:hover { background: rgba(255,255,255,0.3); border-color: white; }
    `;

    const SizeChart = {
        config: {
            buttonSelector: '',
            apiKey: '',
            tableId: '', // Maps to brandId in API
            highlightColor: '#2563eb',
            logoUrl: ''
        },
        state: {
            loading: false,
            data: null,
            error: null
        },
        elements: {},

        init(config) {
            this.config = { ...this.config, ...config };
            this.injectStyles();
            this.setupTrigger();
            this.createModal();
        },

        injectStyles() {
            if (document.getElementById('wearme-sc-css')) {
                document.documentElement.style.setProperty('--wearme-sc-primary', this.config.highlightColor);
                return;
            }
            const style = document.createElement('style');
            style.id = 'wearme-sc-css';
            style.textContent = CSS;
            document.head.appendChild(style);
            document.documentElement.style.setProperty('--wearme-sc-primary', this.config.highlightColor);
        },

        setupTrigger() {
            const container = document.querySelector(this.config.buttonSelector);
            if (!container) return;

            container.innerHTML = `
                <button class="wearme-sc-trigger-btn" onclick="WearmeSizeChart.open()">
                    ${ICONS.ruler} Tabela de Medidas
                </button>
            `;
        },

        createModal() {
            const el = document.createElement('div');
            el.className = 'wearme-sc-overlay';
            el.innerHTML = `
                <div class="wearme-sc-modal" onclick="event.stopPropagation()">
                    ${this.config.logoUrl ? `<img src="${this.config.logoUrl}" class="wearme-sc-logo" />` : ''}
                    
                    <div class="wearme-sc-left-panel">
                        <img src="/fita.png" class="wearme-sc-product-img">
                        <div class="wearme-sc-left-content">
                            <p style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:rgba(255,255,255,0.8); margin:0">Guia Oficial</p>
                            <h3 style="font-size:1.5rem; font-weight:900; color:white; line-height:1.1; margin-top:0.25rem">
                                Tabela de Medidas
                            </h3>
                            <div style=" display: flex; flex-direction: column; gap: 1rem;">
                                <p style="font-size: 0.875rem; color: rgba(255,255,255,0.9); line-height: 1.5; margin: 0;">
                                    Para maior precisão, você pode imprimir nossa fita métrica ou medir seu pé do calcanhar ao dedão.
                                </p>
                                <a href="/fita-metrica.pdf" target="_blank" class="wearme-sc-download-btn">
                                    ${ICONS.download} Abrir Fita Métrica
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="wearme-sc-right-panel">
                        <div class="wearme-sc-header">
                            <h3 class="wearme-sc-title">Tabela de Medidas</h3>
                            <button class="wearme-sc-close" onclick="WearmeSizeChart.close()">${ICONS.x}</button>
                        </div>
                        <div id="wm-sc-content" class="wearme-sc-content"></div>
                    </div>
                </div>
            `;
            el.onclick = (e) => { if (e.target === el) this.close(); };
            document.body.appendChild(el);
            this.elements.overlay = el;
            this.elements.content = el.querySelector('#wm-sc-content');
        },

        open() {
            this.elements.overlay.classList.add('open');
            if (!this.state.data) {
                this.fetchData();
            } else {
                this.render();
            }
        },

        close() {
            this.elements.overlay.classList.remove('open');
        },

        async fetchData() {
            this.state.loading = true;
            this.render();

            try {
                const url = `/api/wearme/size-chart?apiKey=${this.config.apiKey}&brandId=${this.config.tableId}`;
                const res = await fetch(url);
                if (!res.ok) throw new Error('Failed to load');
                const data = await res.json();
                this.state.data = data;
            } catch (e) {
                console.error(e);
                this.state.error = "Erro ao carregar tabela.";
            } finally {
                this.state.loading = false;
                this.render();
            }
        },

        render() {
            const container = this.elements.content;
            if (this.state.loading) {
                container.innerHTML = `<div class="wearme-sc-loader"></div>`;
                return;
            }

            if (this.state.error) {
                container.innerHTML = `<p style="text-align:center; color:#ef4444">${this.state.error}</p>`;
                return;
            }

            if (this.state.data) {
                const { brandName, charts } = this.state.data;
                this.elements.overlay.querySelector('.wearme-sc-title').textContent = brandName || 'Tabela de Medidas';

                container.innerHTML = `
                    <table class="wearme-sc-table">
                        <thead>
                            <tr>
                                <th>Tamanho</th>
                                <th>Medida (cm)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${charts.map(row => `
                                <tr>
                                    <td>${row.size_br}</td>
                                    <td>${row.measure_cm} cm</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
        }
    };

    window.WearmeSizeChart = SizeChart;
})();
