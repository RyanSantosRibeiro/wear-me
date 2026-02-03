"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Script from "next/script"
import logo from "@/assets/img/logo.png"
import {
  Camera,
  Scissors,
  Zap,
  Shield,
  BarChart3,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Code,
  Globe,
  CheckCircle2,
  Expand,
  Shirt,
  X,
  Linkedin,
  Instagram,
  Search,
  Type,
  Plus
} from "lucide-react"

declare global {
  interface Window {
    WearmeBuy: any;
  }
}
import ScriptSection from "@/components/ui/wearme-script-section"
import { HeroSection } from "@/components/Hero"
import { FindMySizeDemo } from "@/components/FindMySizeDemo"
import WearmeScriptSection from "@/components/ui/wearme-script-section"
import WearmeSizeFinderScriptSection from "@/components/ui/findmysize-script-section"
import WearmeBuyTogetherScriptSection from "@/components/ui/buytogether-script-section"

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAnnual, setIsAnnual] = useState(false)
  const [plans, setPlans] = useState([])
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

  useEffect(() => {
    const fechtPlans = async () => {
      const response = await fetch("/api/plans");
      const data = await response.json();
      console.log(data);
      setPlans(data)
    };
    fechtPlans();
  }, []);

  return (
    <div className="h-auto min-h-screen bg-[#fafafa] selection:bg-primary/20">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo.src} alt="WearMe" className="w-auto h-8" />
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
          <a href="#demo" className="hover:text-primary transition-colors">WearMe</a>
          <a href="#new-feature-demo" className="hover:text-primary transition-colors">FindMySize</a>
          <a href="#looks-creator" className="hover:text-primary transition-colors">Looks Creator</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Planos</a>
          <a href="#contact" className="hover:text-primary transition-colors">Contato</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
            Entrar
          </Link>
          <Link
            href="/signup"
            className="bg-primary hover:opacity-90 text-primary-foreground rounded-full px-6 py-2 text-sm font-bold shadow-xl shadow-primary/10 flex items-center justify-center transition-all active:scale-95"
          >
            Começar Agora
          </Link>
        </div>
      </nav>

      <HeroSection />



      {/* How it Works - 3 Steps */}
      <section id="demo" className="py-24 px-6 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em]">Passo a Passo</h2>
            <h3 className="text-4xl md:text-5xl font-black text-foreground">Simples e rápido. <br />Como funciona?</h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Três passos simples para revolucionar a experiência de compra na sua loja.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-linear-to-r from-gray-200 via-primary/20 to-gray-200" />

            {[
              {
                step: "01",
                icon: <Shirt size={32} />,
                color: "text-blue-500",
                bg: "bg-blue-50",
                title: "Escolha sua roupa",
                desc: "O cliente navega pelo catálogo e seleciona a peça que deseja experimentar virtualmente."
              },
              {
                step: "02",
                icon: <Camera size={32} />,
                color: "text-primary",
                bg: "bg-primary/10",
                title: "Envie Sua foto",
                desc: "Em segundos, o cliente faz o upload da foto diretamente no widget da página do produto."
              },
              {
                step: "03",
                icon: <CheckCircle2 size={32} />,
                color: "text-emerald-500",
                bg: "bg-emerald-50",
                title: "Compre com certeza",
                desc: "De como vai ficar. A visualização realista elimina dúvidas e garante a satisfação na compra."
              }
            ].map((item, i) => (
              <div key={i} className="relative flex flex-col items-center text-center group">
                <div className={`w-24 h-24 ${item.bg} rounded-3xl flex items-center justify-center ${item.color} shadow-lg shadow-gray-100 relative z-10 group-hover:scale-110 transition-transform duration-500`}>
                  {item.icon}
                  <div className="absolute -top-3 -right-3 bg-white border border-gray-100 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                    {item.step}
                  </div>
                </div>
                <div className="mt-8 space-y-3 px-4">
                  <h4 className="text-xl font-bold text-foreground">{item.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Code Section */}
      < section id="integration" className="py-32 px-6 bg-gradient-to-r from-primary to-pink-400 text-background relative overflow-hidden" >
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px]" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 w-fit">
              <Code size={12} className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Developer Friendly</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black leading-tight">Instalação em <br />menos de 2 minutos.</h3>
            <p className="text-lg text-white/60 font-medium leading-relaxed max-w-lg">
              Não é necessário conhecimento avançado de programação. Basta copiar e colar nosso script no cabeçalho da sua loja (Shopify, WooCommerce, VTEX, etc).
            </p>
            <ul className="space-y-4 py-4">
              {[
                "Carregamento assíncrono (não pesa o site)",
                "Personalizável via CSS",
                "Compatível com qualquer CMS",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-white" />
                  <span className="font-bold">{item}</span>
                </li>
              ))}

            </ul>
            <ul className="flex items-center gap-8 flex-row flex-wrap">
              {[
                "https://cdn.shopify.com/b/shopify-brochure2-assets/d9340911ca8c679b148dd4a205ad2ffa.svg",
                "https://vtex.com/_next/static/media/vtex-logo.80485bcf.svg",
                "https://woocommerce.com/wp-content/themes/woo/images/woo-logo.svg",
                "https://wake.tech/wp-content/themes/wakecommerce/assets/images/wake-logo-white.png"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <img src={item} alt="" className="w-auto h-8 filter brightness-0 invert" />
                </li>
              ))}
            </ul>
          </div>

          <WearmeScriptSection />
        </div>
      </section >








      {/* New Feature: Find My Size & Size Chart */}
      <section className="bg-[#fcfdff] pt-24 border-t border-gray-100 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[140px] -z-10 opacity-70" />

        <div id="new-feature-demo">
          <FindMySizeDemo />
        </div>
      </section>

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

      {/* Installation Section - Fit */}
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
            <ul className="flex items-center gap-8 flex-row flex-wrap">
              {[
                "https://cdn.shopify.com/b/shopify-brochure2-assets/d9340911ca8c679b148dd4a205ad2ffa.svg",
                "https://vtex.com/_next/static/media/vtex-logo.80485bcf.svg",
                "https://woocommerce.com/wp-content/themes/woo/images/woo-logo.svg",
                "https://wake.tech/wp-content/themes/wakecommerce/assets/images/wake-logo-white.png"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <img src={item} alt="" className="w-auto h-8 filter brightness-0 invert" />
                </li>
              ))}
            </ul>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            {/* <div className="relative bg-[#0d1117] rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
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
            </div> */}
            <WearmeSizeFinderScriptSection />
          </div>
        </div>
      </section>













      {/* Buy Together Demo Section */}
      <section id="looks-creator" className="py-24 px-6 bg-white border-t border-gray-100 overflow-hidden relative">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
              <Sparkles size={14} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Novo Recurso</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight italic pr-2">Compre o Look Completo</h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Monte combinações personalizadas e veja como elas ficam juntas em um único modelo usando IA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: "prod-001",
                name: "Jaqueta Bomber",
                price: "R$ 349,00",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTWIp57UgNH6oKnYK8izUKD7BDBs960RggQA&s"
              },
              {
                id: "prod-002",
                name: "Calça Leg Black",
                price: "R$ 199,00",
                image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop"
              },
              {
                id: "prod-003",
                name: "Sneaker Urban",
                price: "R$ 289,00",
                image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop"
              }
            ].map((product) => (
              <div key={product.id} className="group w-full relative bg-white border border-gray-200 rounded-[2.5rem] shadow-2xl overflow-hidden mx-auto transform transition-transform duration-500 hover:-translate-y-2">
                {/* Mockup Header (Fixed for both) */}
                <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white z-10 relative">
                  <div className="w-24 h-4 bg-gray-100 rounded-full" />
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-50" />
                  </div>
                </div>
                {/* Product Image Stage */}
                <div className="relative aspect-square bg-gray-100 group">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover mix-blend-multiply"
                  />
                </div>

                {/* Product Details & Widget */}
                <div className="p-8 space-y-6 bg-white">

                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">{product.name}</h3>
                      {/* <p className="text-gray-500 font-medium">{product.price}</p> */}
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-blue-600">{product.price}</span>
                      <p className="text-xs text-green-600 font-bold">Em estoque</p>
                    </div>
                  </div>

                  <button
                    className="wearme-add w-full py-4 bg-gray-50 hover:bg-primary hover:text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2"
                    data-wearme-id={product.id}
                    data-wearme-name={product.name}
                    data-wearme-image={product.image}
                  >
                    <Plus size={16} />
                    Adicionar ao Look
                  </button>

                  <button className="w-full h-14 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            ))}
          </div>


          <div className="mt-16 p-8 bg-linear-to-br from-gray-50 to-white rounded-[2.5rem] border border-gray-100 text-center">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Como testar?</p>
            <h4 className="text-xl font-black text-gray-900">Selecione pelo menos 2 produtos acima para ver a mágica acontecer! ✨</h4>
          </div>
        </div>

        <Script src="/WearMeBuyTogether.js" strategy="afterInteractive" onLoad={() => {
          if (window.WearmeBuy) {
            window.WearmeBuy.init({
              apiKey: '023ec83bdbf73177a680807fc144bfea', // Use mock key for demo
              highLightColor: '#000',

            });
          }
        }} />
      </section>

      {/* Installation Section - Buy Together */}
      <section id="instalacao-buytogether" className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pink-500/10 rounded-full blur-[160px]" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 w-fit mx-auto lg:mx-0">
              <Code size={14} className="text-pink-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Setup em 2 minutos</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight">Implemente o Buy Together <br /> na sua vitrine.</h2>
            <ul className="space-y-4 py-4">
              {[
                "Ative com uma única tag script",
                "Gerencie múltiplos itens no look",
                "Integrado com Gemini 2.5 Image",
                "Aumente o ticket médio da sua loja"
              ].map((item, i) => (
                <li key={i} className="flex items-center justify-center lg:justify-start gap-3">
                  <CheckCircle2 size={20} className="text-pink-400" />
                  <span className="font-bold text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative group">
            <WearmeBuyTogetherScriptSection />
          </div>
        </div>
      </section>

      {/* Pricing Section - Premium */}
      <section id="pricing" className="py-32 px-6 bg-gradient-to-b from-white to-rose-50/30 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-rose-100 rounded-full blur-[200px] opacity-30 -z-10" />

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-rose-200 shadow-sm">
              <Sparkles size={14} className="text-rose-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-600">Planos Transparentes</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
              Escolha o plano ideal <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-400 italic pr-2">para o seu negócio</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Comece gratuitamente e escale conforme sua loja cresce. Sem taxas ocultas, sem surpresas.
            </p>
          </div>



          {/* Billing Toggle */}
          {/* <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-bold transition-colors ${!isAnnual ? 'text-gray-900' : 'text-gray-400'}`}>
              Mensal
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-16 h-8 bg-gray-200 rounded-full transition-colors hover:bg-gray-300"
            >
              <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${isAnnual ? 'translate-x-8' : ''}`} />
            </button>
            <span className={`text-sm font-bold transition-colors ${isAnnual ? 'text-gray-900' : 'text-gray-400'}`}>
              Anual
            </span>
            <span className="ml-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
              Economize 8%
            </span>
          </div> */}

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            {/* Basic Plan */}
            {
              plans?.map((plan: any) => {
                if (!plan?.id) return null;
                const highlight = plan.slug === 'wearme-business';

                return (
                  <div key={plan.id} className={`${highlight ? 'bg-gradient-to-r from-primary to-pink-400' : 'bg-white'} rounded-3xl border-2 border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all ${highlight ? 'border-emerald-200' : ''}`}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className={`text-2xl font-black ${highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                      <div className={`${highlight ? 'bg-white' : 'bg-gray-100'} px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full`}>
                        Para Começar
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className={`text-5xl font-black ${highlight ? 'text-white' : 'text-gray-90'}`}>
                          R$ {plan.price}
                        </span>
                        <span className={`text-gray-500 font-semibold ${highlight ? 'text-white' : 'text-gray-90'}`}>/mês</span>
                      </div>
                      <p className={`text-sm ${highlight ? 'text-white' : 'text-gray-500'} mt-2`}>Leve essa experiência para seus clientes</p>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.metadata.features.map((feature: string, i: number) => (
                        <li key={i} className={`flex items-center gap-3 ${highlight ? 'text-white' : 'text-gray-700'}`}>
                          <CheckCircle2 size={20} className={`text-emerald-500 shrink-0 ${highlight ? 'text-white' : 'text-gray-700'}`} />
                          <span className={`text-md font-medium ${highlight ? 'text-white' : 'text-gray-700'}`}>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/signup"
                      className={`block w-full py-4 ${highlight ? 'bg-white' : 'bg-gray-100'} hover:bg-gray-200 text-gray-900 font-bold rounded-xl text-center transition-colors`}
                    >
                      Começar Grátis
                    </Link>
                  </div>
                )
              })
            }
          </div>

          {/* Coupon Section */}
          <div className="max-w-md mx-auto bg-white rounded-2xl border-2 border-dashed border-rose-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                <Sparkles size={20} className="text-rose-500" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Tem um cupom de desconto?</h4>
                <p className="text-xs text-gray-500">Insira o código para validar</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="CODIGO-DESCONTO"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 font-mono text-sm uppercase"
                onChange={(e) => {
                  if (e.target.value) {
                    localStorage.setItem('wearme_coupon', e.target.value.toUpperCase())
                  } else {
                    localStorage.removeItem('wearme_coupon')
                  }
                }}
              />
              <button className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-colors">
                Aplicar
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 pt-12 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { icon: <Shield size={24} />, label: 'Pagamento Seguro', desc: 'SSL Certificado' },
                { icon: <Zap size={24} />, label: 'Setup Rápido', desc: 'Em 5 minutos' },
                { icon: <BarChart3 size={24} />, label: 'Melhor Experiência', desc: 'Mais conversões' },
                { icon: <Globe size={24} />, label: 'Suporte BR', desc: 'Em português' }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mx-auto">
                    {item.icon}
                  </div>
                  <h5 className="font-bold text-gray-900 text-sm">{item.label}</h5>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Info */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                  <Sparkles size={14} className="text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Fale Conosco</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
                  Tem dúvidas? <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-400 italic">Estamos aqui para ajudar.</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Nossa equipe está pronta para responder suas perguntas e te ajudar a implementar o WearMe na sua loja.
                </p>
              </div>

              {/* WhatsApp Button */}
              <a
                href="https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o WearMe"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold rounded-2xl shadow-xl shadow-green-500/20 transition-all active:scale-95 group"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span>Falar no WhatsApp</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <div className="pt-8 space-y-4 border-t border-gray-100">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Email</p>
                    <p className="text-sm">contato@wearme.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Horário</p>
                    <p className="text-sm">Seg-Sex: 9h às 18h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-100 shadow-xl">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nome completo</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mensagem</label>
                  <textarea
                    rows={4}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                    placeholder="Como podemos te ajudar?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-primary to-pink-400 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95"
                >
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      < section className="py-24 px-6" >
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-primary to-pink-500 rounded-[3rem] p-12 md:p-20 text-center space-y-10 relative overflow-hidden shadow-2xl shadow-primary/30">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

          <div className="relative z-10 space-y-8">
            <h3 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Pronto para revolucionar <br /> a experiência da sua loja?
            </h3>
            <p className="text-white/90 text-lg font-medium max-w-xl mx-auto">
              Junte-se a centenas de lojistas que estão aumentando a conversão com o poder da IA.
            </p>
            <div className="flex justify-center">
              <Link
                href="//signup"
                className="h-16 px-10 bg-white text-primary hover:bg-gray-100 text-xl font-black rounded-full shadow-xl flex items-center justify-center transition-all active:scale-95 hover:shadow-2xl"
              >
                Quero experimentar
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section >

      {/* Footer */}
      < footer className="py-12 px-6 border-t border-border bg-white" >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src={logo.src} alt="WearMe" className="w-auto h-8" />
          </div>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">© 2026 Ryan Santos - 61.595.042/0001-07.</p>
          <ul className="flex items-center gap-2">
            {/* linkdin */}
            <a href="https://www.linkedin.com/in/ryan-santos-ribeiro/" target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-6 h-6" />
            </a>
            {/* instagram */}
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              <Instagram className="w-6 h-6" />
            </a>
          </ul>
        </div>
      </footer >

      <style jsx>{`
        @keyframes bounce-subtle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
            animation: bounce-subtle 3s ease-in-out infinite;
        }
        nav a::after {
            content: '';
            display: block;
            width: 0;
            height: 2px;
            background: currentColor;
            transition: width 0.3s;
            opacity: 0.5;
        }
        nav a:hover::after {
            width: 100%;
        }
    `}</style>
    </div >
  )
}
