import { useState } from "react"

const RAW_SCRIPT = `<!-- Wearme Size Finder & Chart -->
<div id="wearme-size-widget"></div>
<div id="wearme-chart-widget"></div>

<script src="https://wearme.com.br/findMySize.js"></script>
<script src="https://wearme.com.br/sizeChart.js"></script>

<script>
  // Inicializa Recomendador
  FindMySize.init({
    apiKey: 'SUA_CHAVE_AQUI',
    buttonSelector: '#wearme-size-widget',
    targetBrandId: 1,
    productImage: 'URL_DA_IMAGEM',
    productName: 'NOME_DO_PRODUTO'
  });

  // Inicializa Tabela de Medidas
  WearmeSizeChart.init({
    apiKey: 'SUA_CHAVE_AQUI',
    tableId: 'ID_DA_TABELA',
    buttonSelector: '#wearme-chart-widget'
  });
</script>`

const WearmeSizeFinderScriptSection = () => {
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    await navigator.clipboard.writeText(RAW_SCRIPT)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="relative group text-white">
      <div className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur-lg bg-gradient-to-br from-purple-500/30 to-blue-500/30" />

      <div className="bg-[#1e1e1e] rounded-xl p-6 font-mono text-sm shadow-2xl overflow-hidden border border-white/10 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>

          <button
            onClick={copyCode}
            className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
          >
            {copied ? "Copiado!" : "Copiar"}
          </button>
        </div>

        {/* Code */}
        <div className="space-y-2 opacity-90">
          <div className="text-gray-500">
            {"<!-- Wearme Size Finder & Chart -->"}
          </div>

          <div>
            <span className="text-purple-400">&lt;div</span>{" "}
            <span className="text-blue-400">id</span>=
            <span className="text-green-400">"wearme-size-widget"</span>
            <span className="text-purple-400">&gt;&lt;/div&gt;</span>
          </div>

          <div>
            <span className="text-purple-400">&lt;div</span>{" "}
            <span className="text-blue-400">id</span>=
            <span className="text-green-400">"wearme-chart-widget"</span>
            <span className="text-purple-400">&gt;&lt;/div&gt;</span>
          </div>

          <div className="pt-4">
            <span className="text-purple-400">&lt;script</span>{" "}
            <span className="text-blue-400">src</span>=
            <span className="text-green-400">
              "https://wearme.com.br/findMySize.js"
            </span>
            <span className="text-purple-400">&gt;&lt;/script&gt;</span>
          </div>

          <div>
            <span className="text-purple-400">&lt;script</span>{" "}
            <span className="text-blue-400">src</span>=
            <span className="text-green-400">
              "https://wearme.com.br/sizeChart.js"
            </span>
            <span className="text-purple-400">&gt;&lt;/script&gt;</span>
          </div>

          <div className="pt-4">
            <span className="text-purple-400">&lt;script&gt;</span>
          </div>

          <div className="pl-4 text-gray-500">
            {"// Inicializa Recomendador"}
          </div>

          <div className="pl-4">
            <span className="text-yellow-400">FindMySize</span>.
            <span className="text-blue-300">init</span>({"{"})
          </div>

          <div className="pl-8">
            <span className="text-blue-400">apiKey</span>:{" "}
            <span className="text-green-400">'SUA_CHAVE_AQUI'</span>,
          </div>
          <div className="pl-8">
            <span className="text-blue-400">buttonSelector</span>:{" "}
            <span className="text-green-400">'#wearme-size-widget'</span>,
          </div>
          <div className="pl-8">
            <span className="text-blue-400">targetBrandId</span>:{" "}
            <span className="text-orange-400">1</span>,
          </div>
          <div className="pl-8">
            <span className="text-blue-400">productImage</span>:{" "}
            <span className="text-green-400">'URL_DA_IMAGEM'</span>,
          </div>
          <div className="pl-8">
            <span className="text-blue-400">productName</span>:{" "}
            <span className="text-green-400">'NOME_DO_PRODUTO'</span>
          </div>

          <div className="pl-4">{"});"}</div>

          <div className="pl-4 pt-2 text-gray-500">
            {"// Inicializa Tabela de Medidas"}
          </div>

          <div className="pl-4">
            <span className="text-yellow-400">WearmeSizeChart</span>.
            <span className="text-blue-300">init</span>({"{"})
          </div>

          <div className="pl-8">
            <span className="text-blue-400">apiKey</span>:{" "}
            <span className="text-green-400">'SUA_CHAVE_AQUI'</span>,
          </div>
          <div className="pl-8">
            <span className="text-blue-400">tableId</span>:{" "}
            <span className="text-green-400">'ID_DA_TABELA'</span>,
          </div>
          <div className="pl-8">
            <span className="text-blue-400">buttonSelector</span>:{" "}
            <span className="text-green-400">'#wearme-chart-widget'</span>
          </div>

          <div className="pl-4">{"});"}</div>

          <div>
            <span className="text-purple-400">&lt;/script&gt;</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WearmeSizeFinderScriptSection
