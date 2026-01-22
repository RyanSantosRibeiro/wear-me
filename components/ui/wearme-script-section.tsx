"use client"
import { wearmeSnippet } from "../scripts/wearmeSnippet"
import { useState } from "react"

const WearmeScriptSection = () => {
  // copy wearmeSnippet
  const [copied, setCopied] = useState(false)
  const copyCode = async () => {
    const raw = wearmeSnippet
      .filter((l: any) => l.type !== "spacer")
      .map((l: any) => l.raw || l.text || "")
      .join("\n")

    await navigator.clipboard.writeText(raw)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

    return (
        <div className="relative group text-white">
            <div className="absolute  rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur-lg" />
            <div className="bg-[#1e1e1e] rounded-xl p-6 font-mono text-sm shadow-2xl overflow-hidden border border-white/10 relative">
              <div className="flex gap-2 mb-6 justify-between">
                <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <button
                  onClick={copyCode}
                  className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                >
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
              <div className="space-y-2 opacity-90">
                <div className="text-gray-500">{"<!-- 1. Importe o SDK -->"}</div>
                <div>
                  <span className="text-purple-400">&lt;script</span> <span className="text-blue-400">src</span>=<span className="text-green-400">"https://wearme.vercel.app/widget.js"</span><span className="text-purple-400">&gt;&lt;/script&gt;</span>
                </div>

                <div className="text-gray-500 pt-4">{"<!-- 2. Configure -->"}</div>
                <div><span className="text-purple-400">&lt;script&gt;</span></div>
                <div className="pl-4">
                  <span className="text-yellow-400">Wearme</span>.<span className="text-blue-300">init</span>({'{'}
                </div>
                <div className="pl-8">
                  <span className="text-blue-400">apiKey</span>: <span className="text-green-400">'sua_chave_publica'</span>,
                </div>
                <div className="pl-8">
                  <span className="text-blue-400">productImage</span>: <span className="text-green-400">'[url_foto_principal]'</span>,
                </div>
                <div className="pl-8">
                  <span className="text-blue-400">buttonSelector</span>: <span className="text-green-400">'#wearme-btn'</span>
                </div>
                <div className="pl-4">{'}'});</div>
                <div><span className="text-purple-400">&lt;/script&gt;</span></div>

                <div className="text-gray-500 pt-4">{"<!-- 3. Elemento Alvo -->"}</div>
                <div>
                  <span className="text-purple-400">&lt;div</span> <span className="text-blue-400">id</span>=<span className="text-green-400">"wearme-btn"</span><span className="text-purple-400">&gt;&lt;/div&gt;</span>
                </div>
              </div>

            </div>
          </div>
    )
}

export default WearmeScriptSection