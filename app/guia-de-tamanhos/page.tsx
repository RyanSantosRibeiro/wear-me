"use client"
import { useState } from "react"
import Link from "next/link"
import logo from "@/assets/img/logo.png"
import {
    Ruler,
    CheckCircle2,
    Code,
    ArrowRight,
    Search,
    Type,
    Sparkles,
    ShoppingBag,
    Shield,
    Zap,
    BarChart3,
    Globe,
    Linkedin,
    Instagram
} from "lucide-react"
import { FindMySizeDemo } from "@/components/FindMySizeDemo"

export default function SizeFinderPage() {
    const [copied, setCopied] = useState(false)

    const installScript = `<!-- Wearme Size Finder & Chart -->
<div id="wearme-size-widget"></div>
<div id="wearme-chart-widget"></div>

<script src="https://wearme.vercel.app/WearMeFindMySize.js"></script>
<script src="https://wearme.vercel.app/WearMeSizeChart.js"></script>

<script>
  // Inicializa Recomendador
  FindMySize.init({
    apiKey: 'SUA_CHAVE_AQUI',
    buttonSelector: '#wearme-size-widget',
    targetBrandId: 1, // ID da sua marca
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

    const copyToClipboard = () => {
        navigator.clipboard.writeText(installScript)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="h-auto min-h-screen bg-[#fafafa] selection:bg-blue-600/20">
            {/* Navigation */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/">
                        <img src={logo.src} alt="WearMe" className="w-auto h-8" />
                    </Link>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
                    <a href="#como-funciona" className="hover:text-blue-600 transition-colors">Como Funciona</a>
                    <a href="#instalacao" className="hover:text-blue-600 transition-colors">Instalação</a>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
                        Entrar
                    </Link>
                    <Link
                        href="//signup"
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 text-sm font-bold shadow-xl shadow-blue-500/10 flex items-center justify-center transition-all active:scale-95"
                    >
                        Criar Conta
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="pt-32 pb-16 px-6 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[140px] -z-10 opacity-70" />
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-6 mb-16 px-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 text-blue-600 mb-2">
                            <Sparkles size={14} />
                            <span className="text-xs font-bold uppercase tracking-widest">Solução Inteligente</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[0.95] tracking-tight">
                            Guia de Tamanhos <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 italic pr-2">Ultra Preciso.</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
                            Reduza devoluções em até 40% com nossa recomendação de tamanho baseada em fôrma e marcas de referência.
                        </p>
                    </div>

                    <FindMySizeDemo />
                </div>
            </header>

            {/* Specific 3 Steps Section */}
            <section id="como-funciona" className="py-24 px-6 bg-white border-y border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-4 mb-20">
                        <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.3em]">O Algoritmo</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-gray-900">Como funciona o <br /> recomendador?</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative text-center">
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-gray-200 via-blue-200 to-gray-200" />

                        {[
                            {
                                step: "01",
                                icon: <Search size={32} />,
                                title: "Referência de Uso",
                                desc: "O cliente seleciona uma marca que ele já usa e confia no dia a dia.",
                                color: "text-blue-500",
                                bg: "bg-blue-50"
                            },
                            {
                                step: "02",
                                icon: <Type size={32} />,
                                title: "Tamanho Atual",
                                desc: "Ele informa qual tamanho costuma comprar nessa marca de referência.",
                                color: "text-cyan-500",
                                bg: "bg-cyan-50"
                            },
                            {
                                step: "03",
                                icon: <Zap size={32} />,
                                title: "Cálculo de Fôrma",
                                desc: "Cruzamos os dados com a fôrma da sua marca e entregamos o tamanho ideal.",
                                color: "text-indigo-500",
                                bg: "bg-indigo-50"
                            }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center group">
                                <div className={`w-24 h-24 ${item.bg} rounded-3xl flex items-center justify-center ${item.color} shadow-lg shadow-gray-100 relative z-10 group-hover:scale-110 transition-transform duration-500`}>
                                    {item.icon}
                                    <div className="absolute -top-3 -right-3 bg-white border border-gray-100 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm text-gray-900">
                                        {item.step}
                                    </div>
                                </div>
                                <div className="mt-8 space-y-3 px-4">
                                    <h4 className="text-xl font-bold text-gray-900">{item.title}</h4>
                                    <p className="text-gray-500 leading-relaxed font-medium">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Installation Section */}
            <section id="instalacao" className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[160px]" />
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 w-fit mx-auto lg:mx-0">
                            <Code size={14} className="text-blue-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Setup em 2 minutos</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black leading-tight">Implemente agora na <br /> sua loja virtual.</h2>
                        <ul className="space-y-4 py-4">
                            {[
                                "Basta colar no final do <body>",
                                "Altamente personalizável",
                                "Não afeta o tempo de carregamento",
                                "Compatível com Shopify, VTEX e WooCommerce"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center justify-center lg:justify-start gap-3">
                                    <CheckCircle2 size={20} className="text-blue-400" />
                                    <span className="font-bold text-gray-300">{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-center lg:justify-start">
                            <Link href="/signup" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95">
                                Gerar minha API Key
                            </Link>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-[#0d1117] rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
                            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#161b22]">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                                >
                                    {copied ? 'Copiado!' : 'Copiar'}
                                </button>
                            </div>
                            <pre className="p-6 text-sm text-blue-300 font-mono overflow-x-auto">
                                <code>{installScript}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer (Simplified) */}
            <footer className="py-12 px-6 border-t border-gray-100 bg-white" >
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <img src={logo.src} alt="WearMe" className="w-auto h-8" />
                    </div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">© 2026 Ryan Santos - WearMe Technology.</p>
                    <ul className="flex items-center gap-4">
                        <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" />
                        <Instagram className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" />
                    </ul>
                </div>
            </footer>
        </div>
    )
}
