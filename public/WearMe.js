(function () {
    const SVG_ICONS = {
        sparkles: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,
        shirt: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>`,
        x: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
        camera: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
        rotateCcw: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
        checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
        loader2: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`,
        imageIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
        download: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`
    };

    const DB_NAME = 'WearMeCache';
    const STORE_NAME = 'generations';
    const WearMeDB = {
        async open() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME, 1);
                request.onupgradeneeded = () => {
                    const db = request.result;
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        db.createObjectStore(STORE_NAME, { keyPath: 'productUrl' });
                    }
                };
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        },
        async save(productUrl, resultUrl) {
            try {
                const db = await this.open();
                const transaction = db.transaction(STORE_NAME, 'readwrite');
                transaction.objectStore(STORE_NAME).put({ productUrl, resultUrl, timestamp: Date.now() });
            } catch (e) { console.warn('WearMe: DB save error', e); }
        },
        async delete(productUrl) {
            try {
                const db = await this.open();
                const transaction = db.transaction(STORE_NAME, 'readwrite');
                transaction.objectStore(STORE_NAME).delete(productUrl);
            } catch (e) { }
        },
        async get(productUrl) {
            try {
                const db = await this.open();
                return new Promise((resolve) => {
                    const transaction = db.transaction(STORE_NAME, 'readonly');
                    const request = transaction.objectStore(STORE_NAME).get(productUrl);
                    request.onsuccess = () => resolve(request.result?.resultUrl || null);
                    request.onerror = () => resolve(null);
                });
            } catch (e) { return null; }
        }
    };

    function downloadBase64AsPng(base64, fileName = "image.png") {
        // Garante que o base64 esteja limpo
        const base64Data = base64.startsWith("data:image")
            ? base64.split(",")[1]
            : base64

        const byteCharacters = atob(base64Data)
        const byteNumbers = new Array(byteCharacters.length)

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
        }

        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: "image/png" })

        const url = URL.createObjectURL(blob)

        const a = document.createElement("a")
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()

        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const STYLES = `
        body {
            --wearme-primary: #111827;
            --wearme-secondary: #6b7280;
            --wearme-accent: #3b82f6;
            --wearme-emerald: #10b981;
            --wearme-bg: #ffffff;
            --wearme-radius: 1rem;
            --wearme-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .wearme-modal-logo {
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 10;
            max-height: 40px;
            width: auto;
            object-fit: contain;
            pointer-events: none;
        }

        @media screen and (max-width: 480px) {
            .wearme-modal-logo {
                top: 15px;
                left: 15px;
                max-height: 30px;
            }
        }

        .wearme-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.4);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .wearme-modal-overlay.open {
            opacity: 1;
            visibility: visible;
        }

        .wearme-modal {
            background: var(--wearme-bg);
            width: 100%;
            max-width: 500px;
            max-height: 90vh;
            border-radius: 1.5rem;
            box-shadow: var(--wearme-shadow);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transform: scale(0.95);
            transition: transform 0.3s ease;
            position: relative;
        }

        .wearme-modal-overlay.open .wearme-modal {
            transform: scale(1);
        }

        .wearme-header {
            padding: 1rem 1.5rem;
            border-bottom: 1px solid #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .wearme-logo-group {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .wearme-logo-icon {
            width: 2rem;
            height: 2rem;
            border-radius: 0.5rem;
            background: rgba(0,0,0,0.05);
            color: var(--wearme-primary);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .wearme-header h3 {
            margin: 0;
            font-size: 1.125rem;
            font-weight: 800;
        }

        .wearme-header p {
            margin: 0;
            font-size: 0.75rem;
            color: var(--wearme-secondary);
        }

        .wearme-close {
            background: transparent;
            border: none;
            padding: 0.5rem;
            cursor: pointer;
            color: #9ca3af;
            border-radius: 999px;
            transition: all 0.2s;
        }

        .wearme-close:hover {
            color: #4b5563;
            background: #f3f4f6;
        }

        .wearme-content {
            padding: 1.5rem;
            overflow-y: auto;
            flex: 1;
        }

        .wearme-footer {
            padding: 1.5rem;
            border-top: 1px solid #f3f4f6;
            background: #f9fafb;
        }

        /* Trigger Button Styles (Host side) */
        .wearme-trigger-btn {
            appearance: none;
            width: 100%;
            padding: 0.875rem 1.5rem;
            background: var(--wearme-primary);
            color: white;
            border: none;
            border-radius: 0.75rem;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            transition: all 0.2s;
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .wearme-trigger-btn:hover {
            opacity: 0.8;
            transform: translateY(-1px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .wearme-trigger-btn:active {
            transform: scale(0.98);
        }

        .wearme-trigger-shine {
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            animation: wearme-shine 3s infinite;
        }

        @keyframes wearme-shine {
            0% { left: -100%; }
            20% { left: 100%; }
            100% { left: 100%; }
        }

        /* States */
        .wearme-state-idle .wearme-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .wearme-card {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
        }

        .wearme-card-label {
            font-size: 0.75rem;
            font-weight: 800;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .wearme-consent-box {
            margin-top: 1rem;
            padding: 1rem;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 1rem;
            display: flex;
            gap: 0.75rem;
            align-items: flex-start;
            cursor: pointer;
            transition: all 0.2s;
        }

        .wearme-consent-box:hover {
            background: #f3f4f6;
        }

        .wearme-consent-box.active {
            border-color: var(--wearme-primary);
            background: #f3f4f6;
        }

        .wearme-consent-box input {
            margin-top: 0.25rem;
            width: 1.125rem;
            height: 1.125rem;
            cursor: pointer;
        }

        .wearme-consent-text {
            font-size: 0.7rem;
            line-height: 1.4;
            color: #4b5563;
        }

        .wearme-consent-text strong {
            color: #111827;
            font-weight: 700;
        }

        .wearme-image-container {
            aspect-ratio: 3/4;
            border-radius: 1rem;
            overflow: hidden;
            background: #f3f4f6;
            border: 1px solid #e5e7eb;
            position: relative;
        }

        .wearme-image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .wearme-upload-zone {
            aspect-ratio: 3/4;
            border-radius: 1rem;
            border: 2px dashed #e5e7eb;
            background: #f9fafb;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            cursor: pointer;
            transition: all 0.2s;
        }

        .wearme-upload-zone:hover {
            border-color: var(--wearme-primary);
            background: #f3f4f6;
        }

        .wearme-upload-icon {
            width: 3rem;
            height: 3rem;
            border-radius: 999px;
            background: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #9ca3af;
            transition: transform 0.2s;
        }

        .wearme-upload-zone:hover .wearme-upload-icon {
            transform: scale(1.1);
            color: var(--wearme-primary);
        }

        .wearme-btn-primary {
            width: 100%;
            padding: 0.875rem;
            border-radius: 0.75rem;
            background: var(--wearme-primary);
            color: white;
            border: none;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            transition: 0.2s;
        }

        .wearme-btn-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .wearme-mode-selector {
            background: #f3f4f6;
            padding: 0.25rem;
            border-radius: 0.75rem;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.25rem;
            margin: 1.5rem 0;
        }

        .wearme-mode-btn {
            padding: 0.625rem;
            border-radius: 0.5rem;
            border: none;
            background: transparent;
            font-size: 0.75rem;
            font-weight: 700;
            color: #6b7280;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            transition: all 0.2s;
        }

        .wearme-mode-btn.active {
            background: white;
            color: var(--wearme-primary);
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .wearme-tip-box {
            background: #eff6ff;
            border: 1px solid #dbeafe;
            padding: 1rem;
            border-radius: 0.75rem;
            display: flex;
            gap: 0.75rem;
            align-items: flex-start;
        }

        .wearme-tip-icon {
            background: #dbeafe;
            padding: 0.25rem;
            border-radius: 999px;
            color: #3b82f6;
            display: flex;
        }
        
        .wearme-tip-text h4 { margin: 0; font-size: 0.75rem; color: #1e40af; }
        .wearme-tip-text p { margin: 0; font-size: 0.68rem; color: #3b82f6; }

        /* Processing State */
        .wearme-processing {
            padding: 2rem 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 2rem;
        }

        .wearme-loader-container {
            position: relative;
            width: 6rem;
            height: 6rem;
        }

        .wearme-spinner-outer {
            position: absolute;
            inset: 0;
            border: 4px solid #f3f4f6;
            border-top-color: var(--wearme-accent);
            border-radius: 999px;
            animation: wearme-spin 1s linear infinite;
        }

        .wearme-spinner-inner {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--wearme-accent);
        }

        @keyframes wearme-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .wearme-steps {
            width: 100%;
            max-width: 280px;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .wearme-step {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            transition: 0.3s;
        }

        .wearme-step-icon {
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 999px;
            border: 1px solid #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.65rem;
            font-weight: 700;
            background: white;
            color: #d1d5db;
        }

        .wearme-step.completed .wearme-step-icon {
            background: var(--wearme-emerald);
            border-color: var(--wearme-emerald);
            color: white;
        }

        .wearme-step.active .wearme-step-icon {
            background: var(--wearme-accent);
            border-color: var(--wearme-accent);
            color: white;
            animation: pulse 2s infinite;
        }
        
        .wearme-step-text {
            font-size: 0.875rem;
            font-weight: 500;
            color: #d1d5db;
        }

        .wearme-step.active .wearme-step-text,
        .wearme-step.completed .wearme-step-text {
            color: #374151;
        }

        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
            100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }

        /* Completed State */
        .wearme-completed {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .wearme-result-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
        }

        .wearme-result-main {
            grid-column: span 2;
            aspect-ratio: 3/4;
            border-radius: 1rem;
            overflow: hidden;
            position: relative;
        }

        .wearme-result-main img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .wearme-result-item {
            aspect-ratio: 3/4;
            border-radius: 0.75rem;
            overflow: hidden;
            position: relative;
        }

        .wearme-result-badge {
            position: absolute;
            top: 0.5rem;
            left: 0.5rem;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(4px);
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.625rem;
            font-weight: 600;
        }

        .wearme-completed-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .wearme-btn-outline {
            background: white;
            border: 1px solid #e5e7eb;
            color: #374151;
            padding: 0.875rem;
            border-radius: 0.75rem;
            font-weight: 700;
            font-size: 0.875rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            transition: 0.2s;
        }

        .wearme-btn-outline:hover {
            background: #f9fafb;
        }

        .wearme-btn-success {
            background: var(--wearme-primary);
            color: white;
            border: none;
            padding: 0.875rem;
            border-radius: 0.75rem;
            font-weight: 700;
            font-size: 0.875rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
        }

        .wearme-hidden { display: none !important; }

        .wearme-error-toast {
            position: fixed;
            top: 2rem;
            left: 50%;
            transform: translateX(-50%) translateY(-100px);
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 1rem;
            box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
            z-index: 9999999;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 700;
            font-size: 0.875rem;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: 90%;
        }

        .wearme-error-toast.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }

        .wearme-error-icon {
            width: 1.25rem;
            height: 1.25rem;
            flex-shrink: 0;
        }

        @media (max-width: 480px) {
            .wearme-modal {
                max-height: 100vh;
                border-radius: 0;
                margin: 0;
            }
            .wearme-modal-overlay {
                padding: 0;
            }
        }
    `;

    const Wearme = {
        config: {
            apiKey: '',
            productImage: '',
            buttonSelector: '',
            apiUrl: 'https://wearme.vercel.app/api/wearme/generate', // Fallback to production URL
            brandName: 'Wearme AI v2.0',
            highlightColor: '#111827',
            logoUrl: ''
        },
        state: {
            isOpen: false,
            status: 'idle',
            userImage: null,
            previewUrl: null,
            resultImage: null,
            processingStep: 0,
            generationMode: 'front',
            hasConsent: false
        },
        elements: {},

        async init(options, customState = null) {
            console.log("Wearme init", options);
            this.config = { ...this.config, ...options };
            console.log("Wearme state", this.state);
            console.log("Wearme customState", customState);
            if (customState) {
                this.state = { ...this.state, ...customState };
            }

            // Handle Session ID from storage if it exists
            this.sessionId = localStorage.getItem('wearme_session_id');

            // Handle Consent Persistence
            if (sessionStorage.getItem('wearme_consent_accepted') === 'true') {
                this.state.hasConsent = true;
            }

            // --- CLIENT-SIDE CACHE CHECK ---
            const cacheKey = this.config.productImage;
            const cachedResult = await WearMeDB.get(cacheKey);
            console.log("Init - Cached result:", cachedResult);

            if (cachedResult) {
                console.log("Found cached result in IndexedDB for this product.");
                this.state.resultImage = cachedResult;
                this.state.status = 'completed';
            }
            // -------------------------------

            // Detect if running locally
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                this.config.apiUrl = '/api/wearme/generate';
                // For status check url locally
                this.config.statusUrl = '/api/wearme/status';
            } else {
                this.config.statusUrl = 'https://wearme.vercel.app/api/wearme/status';
            }

            // Check API Status before rendering anything
            const canRun = await this.checkStatus();

            if (canRun) {
                this.injectStyles();
                this.createModal();
                this.setupTrigger();
            } else {
                console.warn('Wearme: Verification failed or quota exceeded.');
            }
        },

        showError(message) {
            const toast = document.createElement('div');
            toast.className = 'wearme-error-toast';
            toast.innerHTML = `
                <svg class="wearme-error-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>${message}</span>
            `;
            document.body.appendChild(toast);

            setTimeout(() => toast.classList.add('show'), 10);

            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 4000);
        },

        async checkStatus() {
            try {
                const res = await fetch(`${this.config.statusUrl}?apiKey=${this.config.apiKey}`);
                if (!res.ok) return false;

                const data = await res.json();
                console.log("WearMe Status:", data);

                return data.active && data.canGenerate;
            } catch (e) {
                console.error("WearMe: Failed to check status", e);
                return false;
            }
        },

        injectStyles() {
            const style = document.createElement('style');
            style.textContent = STYLES;
            document.head.appendChild(style);

            if (this.config.highlightColor) {
                document.body.style.setProperty('--wearme-primary', this.config.highlightColor);
            }
        },

        setupTrigger() {
            const container = document.querySelector(this.config.buttonSelector);
            if (!container) return;

            const btn = document.createElement('button');
            btn.className = 'wearme-trigger-btn';
            btn.innerHTML = `
                <div class="wearme-trigger-shine"></div>
                ${SVG_ICONS.sparkles.replace('width="24" height="24"', 'width="18" height="18"')} 
                <span>Experimentar</span>
            `;

            const subtext = document.createElement('p');
            subtext.style.cssText = 'margin-top: 0.5rem; font-size: 10px; color: #9ca3af; display: flex; align-items: center; gap: 4px; justify-content: center;';
            subtext.innerHTML = `
                ${SVG_ICONS.sparkles.replace('width="24" height="24"', 'width="10" height="10"')}
                Experimente antes de comprar
            `;

            btn.onclick = () => {
                console.log("WearMe image: ", this.config.productImage);
                this.open()
            };

            container.innerHTML = '';
            container.appendChild(btn);
            container.appendChild(subtext);
        },

        createModal() {
            const overlay = document.createElement('div');
            overlay.className = 'wearme-modal-overlay';
            overlay.onclick = (e) => {
                if (e.target === overlay) this.close();
            };

            console.log("Create Modal - Cached result:", this.state.resultImage);
            overlay.innerHTML = `
                <div class="wearme-modal" onclick="event.stopPropagation()">
                    ${this.config.logoUrl ? `<img src="${this.config.logoUrl}" class="wearme-modal-logo" />` : ''}
                    <div class="wearme-header">
                        <div class="wearme-logo-group">
                            <div class="wearme-logo-icon">${SVG_ICONS.sparkles.replace('width="24" height="24"', 'width="16" height="16"')}</div>
                            <div>
                                <h3>Provador Virtual</h3>
                                <p>${this.config.brandName}</p>
                            </div>
                        </div>
                        <button class="wearme-close">${SVG_ICONS.x.replace('width="24" height="24"', 'width="20" height="20"')}</button>
                    </div>
                    <div class="wearme-content"></div>
                    <div class="wearme-footer"></div>
                </div>
            `;

            document.body.appendChild(overlay);
            this.elements.overlay = overlay;
            this.elements.content = overlay.querySelector('.wearme-content');
            this.elements.footer = overlay.querySelector('.wearme-footer');
            this.elements.close = overlay.querySelector('.wearme-close');
            this.elements.close.onclick = () => this.close();
            this.render();
        },

        // We can keep this for extra safety or remove it to rely only on sessionStorage
        async checkPreviousSession() {
            // Logic moved to init for immediate sessionStorage check
        },

        open() {
            this.state.isOpen = true;
            this.elements.overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            this.render();
        },

        close() {
            this.state.isOpen = false;
            this.elements.overlay.classList.remove('open');
            document.body.style.overflow = '';
        },

        setState(newState) {
            this.state = { ...this.state, ...newState };
            this.render();
        },

        render() {
            const { status } = this.state;

            if (status === 'idle') {
                this.renderIdle();
            } else if (status === 'processing') {
                this.renderProcessing();
            } else if (status === 'completed') {
                this.renderCompleted();
            }
        },

        renderIdle() {
            this.elements.content.innerHTML = `
                <div class="wearme-state-idle">
                    <div style="text-align: center; margin-bottom: 2rem;">
                        <h4 style="font-size: 1.25rem; font-weight: 900; margin: 0 0 0.5rem 0;">Vamos vestir você!</h4>
                        <p style="font-size: 0.875rem; color: #6b7280; margin: 0;">Escolha como você quer ver o resultado final.</p>
                    </div>

                    <div class="wearme-grid">
                        <div class="wearme-card">
                            <span class="wearme-card-label">Produto</span>
                            <div class="wearme-image-container">
                                <img src="${this.config.productImage}" alt="Product">
                            </div>
                        </div>
                        <div class="wearme-card">
                            <span class="wearme-card-label">Você</span>
                            ${this.state.previewUrl ? `
                                <div class="wearme-image-container">
                                    <img src="${this.state.previewUrl}" alt="Preview">
                                    <button id="wearme-remove-img" style="position: absolute; top: 0.5rem; right: 0.5rem; background: rgba(255,255,255,0.9); border: none; padding: 4px; border-radius: 999px; cursor: pointer; color: #ef4444;">${SVG_ICONS.x.replace('width="24" height="24"', 'width="14" height="14"')}</button>
                                </div>
                            ` : `
                                <div class="wearme-upload-zone" id="wearme-upload-trigger">
                                    <div class="wearme-upload-icon">${SVG_ICONS.camera}</div>
                                    <div style="text-align: center;">
                                        <p style="font-size: 0.75rem; font-weight: 700; margin: 0;">Adicionar Foto</p>
                                        <p style="font-size: 0.6rem; color: #9ca3af; margin: 0;">Corpo inteiro</p>
                                    </div>
                                </div>
                            `}
                        </div>
                    </div>

                    <input type="file" id="wearme-file-input" accept="image/*" class="wearme-hidden">

                    <!--<div class="wearme-mode-selector">
                        <button class="wearme-mode-btn ${this.state.generationMode === 'front' ? 'active' : ''}" data-mode="front">
                            ${SVG_ICONS.shirt.replace('width="24" height="24"', 'width="14" height="14"')} Vista Frente
                        </button>
                        <button class="wearme-mode-btn ${this.state.generationMode === 'angles' ? 'active' : ''}" data-mode="angles">
                            ${SVG_ICONS.sparkles.replace('width="24" height="24"', 'width="14" height="14"')} 3 Ângulos
                        </button>
                    </div>-->

                    <!--<div class="wearme-tip-box">
                        <div class="wearme-tip-icon">${SVG_ICONS.imageIcon.replace('width="24" height="24"', 'width="14" height="14"')}</div>
                        <div class="wearme-tip-text">
                            <h4>Dica profissional</h4>
                            <p>Para o modo "3 Ângulos", nossa IA irá extrapolar a visualização baseada na sua foto de frente.</p>
                        </div>
                    </div>-->
                    ${!this.state.hasConsent ? `
                        <div class="wearme-consent-box ${this.state.hasConsent ? 'active' : ''}" id="wearme-consent-trigger">
                            <input type="checkbox" id="wearme-consent-checkbox" ${this.state.hasConsent ? 'checked' : ''}>
                            <div class="wearme-consent-text">
                                Eu concordo com o <strong>processamento de dados e armazenamento da minha foto</strong> para fins de provador virtual, em conformidade com a <strong>LGPD</strong>.
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;

            this.elements.footer.innerHTML = `
                <button id="wearme-start-btn" class="wearme-btn-primary" ${(!this.state.userImage || !this.state.hasConsent) ? 'disabled' : ''}>
                    ${!this.state.userImage ? 'Selecione uma foto' : !this.state.hasConsent ? 'Aceite os termos' : 'Experimentar'}
                    ${SVG_ICONS.sparkles.replace('width="24" height="24"', 'width="18" height="18"')}
                </button>
            `;

            // Listeners
            const uploadTrigger = this.elements.content.querySelector('#wearme-upload-trigger');
            const fileInput = this.elements.content.querySelector('#wearme-file-input');
            const removeBtn = this.elements.content.querySelector('#wearme-remove-img');
            const modeBtns = this.elements.content.querySelectorAll('.wearme-mode-btn');
            const startBtn = this.elements.footer.querySelector('#wearme-start-btn');

            if (uploadTrigger) uploadTrigger.onclick = () => fileInput.click();
            if (removeBtn) removeBtn.onclick = () => this.setState({ userImage: null, previewUrl: null });

            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (re) => {
                        this.setState({ userImage: file, previewUrl: re.target.result });
                    };
                    reader.readAsDataURL(file);
                }
            };

            modeBtns.forEach(btn => {
                btn.onclick = () => this.setState({ generationMode: btn.dataset.mode });
            });

            const consentTrigger = this.elements.content.querySelector('#wearme-consent-trigger');
            const consentCheckbox = this.elements.content.querySelector('#wearme-consent-checkbox');

            if (consentTrigger) {
                consentTrigger.onclick = (e) => {
                    if (e.target !== consentCheckbox) {
                        consentCheckbox.checked = !consentCheckbox.checked;
                    }
                    this.setState({ hasConsent: consentCheckbox.checked });

                    // Save persistence to sessionStorage
                    if (consentCheckbox.checked) {
                        sessionStorage.setItem('wearme_consent_accepted', 'true');
                    } else {
                        sessionStorage.removeItem('wearme_consent_accepted');
                    }
                };
            }

            startBtn.onclick = () => {
                if (this.state.testMode) {
                    console.log("testMode", this.state);
                    this.setState({ status: 'processing', processingStep: 0 });
                    setTimeout(() => {
                        this.setState({ status: 'completed', resultImage: this.state.imageTest });
                    }, 3000);
                    return;
                }
                if (this.state.hasConsent) {
                    console.log("startProcessing", this.state);
                    this.startProcessing();
                }
            };
        },

        renderProcessing() {
            const steps = [
                "Analisando formato do corpo",
                "Ajustando iluminação e sombras",
                "Gerando caimento realista",
                "Finalizando detalhes"
            ];

            this.elements.content.innerHTML = `
                <div class="wearme-processing">
                    <div class="wearme-loader-container">
                        <div class="wearme-spinner-outer"></div>
                        <div class="wearme-spinner-inner">
                            ${SVG_ICONS.sparkles.replace('width="24" height="24"', 'width="24" height="24"')}
                        </div>
                    </div>

                    <div class="wearme-steps">
                        ${steps.map((step, i) => `
                            <div class="wearme-step ${i < this.state.processingStep ? 'completed' : i === this.state.processingStep ? 'active' : ''}">
                                <div class="wearme-step-icon">${i < this.state.processingStep ? SVG_ICONS.checkCircle.replace('width="24" height="24"', 'width="12" height="12"') : i + 1}</div>
                                <span class="wearme-step-text">${step}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            this.elements.footer.innerHTML = '';
        },

        renderCompleted() {
            const isAngles = this.state.generationMode === 'angles';

            this.elements.content.innerHTML = `
                <div class="wearme-completed">
                    ${isAngles ? `
                        <div class="wearme-result-grid">
                            <div class="wearme-result-main">
                                <img src="${this.state.resultImage}" alt="Front">
                                <div class="wearme-result-badge">Frente</div>
                            </div>
                            <div class="wearme-result-item" style="filter: grayscale(0.8); opacity: 0.8;">
                                <img src="${this.state.resultImage}" alt="Side" style="transform: scaleX(-1);">
                                <div class="wearme-result-badge">Lado</div>
                            </div>
                            <div class="wearme-result-item" style="filter: grayscale(0.8); opacity: 0.8;">
                                <img src="${this.state.resultImage}" alt="Back" style="transform: scale(1.1);">
                                <div class="wearme-result-badge">Costas</div>
                            </div>
                        </div>
                    ` : `
                        <div class="wearme-result-main">
                            <img src="${this.state.resultImage}" alt="Result">
                            <div style="position: absolute; bottom: 1rem; left: 1rem; right: 1rem; background: rgba(255,255,255,0.9); padding: 0.75rem; border-radius: 0.75rem; text-align: center; font-size: 0.75rem; font-weight: 700;">
                                ✨ Look gerado com IA
                            </div>
                        </div>
                    `}

                    <div class="wearme-completed-actions">
                        <button id="wearme-reset-btn" class="wearme-btn-outline" style="grid-column: span 1;">
                            ${SVG_ICONS.rotateCcw.replace('width="24" height="24"', 'width="16" height="16"')}
                            Tentar De Novo
                        </button>
                        <button id="wearme-download-btn" class="wearme-btn-outline" style="grid-column: span 1; border-color: #10b981; color: #10b981;">
                            ${SVG_ICONS.download.replace('width="24" height="24"', 'width="16" height="16"')}
                            Baixar Look
                        </button>
                        <button id="wearme-buy-btn" class="wearme-btn-success" style="grid-column: span 2; margin-top: 0.5rem; padding: 1.25rem;">
                            ${SVG_ICONS.shirt.replace('width="24" height="24"', 'width="20" height="20"')}
                            Comprar Agora
                        </button>
                    </div>
                </div>
            `;

            this.elements.footer.innerHTML = '';

            this.elements.content.querySelector('#wearme-reset-btn').onclick = () => {
                // Remove cached result so it doesn't auto-load next time
                WearMeDB.delete(this.config.productImage);

                this.setState({
                    status: 'idle',
                    userImage: null,
                    previewUrl: null,
                    resultImage: null,
                    processingStep: 0
                });
            };

            this.elements.content.querySelector('#wearme-download-btn').onclick = () => {
                downloadBase64AsPng(this.state.resultImage, `look-wearme-${Date.now()}.png`);
            };
        },

        async startProcessing() {
            // Clear the old cache as we are starting a new generation
            sessionStorage.removeItem(`wearme_res_${this.config.productImage}`);

            this.setState({ status: 'processing', processingStep: 0 });

            // Fake steps animation
            for (let i = 0; i <= 3; i++) {
                this.setState({ processingStep: i });
                await new Promise(r => setTimeout(r, 800));
            }

            try {
                const formData = new FormData();
                formData.append('productImage', this.config.productImage);
                formData.append('userImage', this.state.userImage);
                formData.append('mode', this.state.generationMode);
                formData.append('apiKey', this.config.apiKey);
                formData.append('sessionId', this.sessionId);

                // Add Consent Data to the request (LGPD Compliance)
                if (this.state.hasConsent) {
                    formData.append('consentData', JSON.stringify({
                        accepted: true,
                        timestamp: new Date().toISOString(),
                        userAgent: navigator.userAgent,
                        compliance: 'LGPD/GPDR',
                        ip_preference: 'anonymized'
                    }));
                }

                console.log("enviando", { formData });
                const response = await fetch(this.config.apiUrl, {
                    method: 'POST',
                    body: formData
                });

                console.log("response", { response });

                if (!response.ok) throw new Error('API Error');

                const data = await response.json();

                if (data.success && data.imageUrl) {
                    // Update the local cache with IndexedDB
                    WearMeDB.save(this.config.productImage, data.imageUrl);

                    this.setState({ status: 'completed', resultImage: data.imageUrl });
                } else {
                    this.showError('Erro ao processar imagem. Tente novamente.');
                    this.setState({ status: 'idle' });
                }
            } catch (err) {
                console.error(err);
                this.showError('Ocorreu um erro técnico. Tente novamente mais tarde.');
                this.setState({ status: 'idle' });
            }
        }
    };

    window.Wearme = Wearme;
})();
