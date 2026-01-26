"use client"
import { useState } from "react"
import { Check, Copy } from "lucide-react"

export default function WearmeBuyTogetherScriptSection() {
    const [copied, setCopied] = useState(false)
    const installScript = `<!-- Wearme Buy Together Widget -->
<script src="https://wearme.vercel.app/WearMeBuyTogether.js"></script>

<script>
  window.WearmeBuy.init({
    apiKey: 'SUA_CHAVE_AQUI',
    apiUrl: 'https://wearme.vercel.app/api/wearme/generate-look'
  });
</script>

<!-- Botões de exemplo: adicione a classe 'wearme-add' e os data attributes -->
<!-- <button class="wearme-add" data-wearme-id="ID_UNICO" data-wearme-image="URL_IMAGEM" data-wearme-name="NOME">Add ao Look</button> -->`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(installScript)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-pink-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-[#0d1117] rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#161b22]">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                    </div>
                    <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                    >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                </div>
                <div className="p-6 overflow-x-auto">
                    <pre className="text-sm font-mono leading-relaxed">
                        <code className="text-blue-300">
                            {`<!-- Wearme Buy Together Widget -->
<script src="https://wearme.vercel.app/WearMeBuyTogether.js"></script>

<script>`}
                        </code>
                        <code className="text-emerald-400">
                            {`
  window.WearmeBuy.init({
    apiKey: 'SUA_CHAVE_AQUI'
  });`}
                        </code>
                        <code className="text-blue-300">
                            {`
</script>`}
                        </code>
                    </pre>
                </div>
            </div>
        </div>
    )
}
