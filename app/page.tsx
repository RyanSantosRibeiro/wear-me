"use client"
import { useState } from "react"
import { WearmeWidget } from "@/components/wearme-widget"
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
  X
} from "lucide-react"


export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAnnual, setIsAnnual] = useState(false)
  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-primary/20">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo.src} alt="WearMe" className="w-auto h-8" />
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
          <a href="#demo" className="hover:text-primary transition-colors">Como Funciona</a>
          <a href="#integration" className="hover:text-primary transition-colors">Instalação</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Planos</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
            Entrar
          </Link>
          <Link
            href="/auth/signup"
            className="bg-primary hover:opacity-90 text-primary-foreground rounded-full px-6 py-2 text-sm font-bold shadow-xl shadow-primary/10 flex items-center justify-center transition-all active:scale-95"
          >
            Começar Agora
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex items-center">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 mix-blend-multiply" />
        <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-secondary/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 mix-blend-multiply" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column: Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-primary/10 shadow-sm animate-bounce-subtle mx-auto lg:mx-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tecnologia IA v2.0 Live</span>
            </div>

            <h1 className="text-5xl md:text-4xl lg:text-6xl font-black tracking-tight text-foreground leading-[0.95]">
              Provador Virtual <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-400 italic pr-2">que converte.</span>
            </h1>

            <p className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-muted-foreground font-medium leading-relaxed">
              Permita que seus clientes experimentem roupas digitalmente com apenas uma foto. Aumente as vendas e reduza devoluções com o **Wearme Widget**.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/auth/signup"
                className="h-14 px-8 bg-foreground text-background hover:bg-foreground/90 text-lg font-bold rounded-2xl shadow-2xl shadow-foreground/10 group flex items-center justify-center transition-all active:scale-95 w-full sm:w-auto"
              >
                Criar Conta Grátis
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#demo" className="h-14 px-8 border border-border text-foreground text-lg font-bold rounded-2xl bg-white hover:bg-secondary/50 transition-all active:scale-95 flex items-center justify-center w-full sm:w-auto">
                Ver Demonstração
              </a>
            </div>

            <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Trust Badges / Logos Placeholder */}
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Trusted by leading brands</p>
            </div>
          </div>

          {/* Right Column: PDP Simulation (The "Wearme" Interface) */}
          <div className="relative w-full max-w-lg mx-auto lg:max-w-none h-auto">
            {/* 3D Floating Effect Container */}
            <div className="relative bg-white border border-border rounded-[2.5rem] shadow-2xl shadow-primary/10 overflow-hidden min-h-[60vh] flex items-center justify-center transform hover:rotate-y-1 transition-transform duration-500">

              {/* Background: Product Page Mockup */}
              <div className={`absolute inset-0 flex flex-col transition-all duration-500 ${isModalOpen ? 'opacity-30 scale-95 blur-sm' : 'opacity-100 scale-100'}`}>
                {/* Mockup Header */}
                <div className="h-14 border-b border-gray-50 flex items-center justify-between px-6">
                  <div className="w-20 h-2 bg-gray-100 rounded-full" />
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-50" />
                    <div className="w-6 h-6 rounded-full bg-gray-50" />
                  </div>
                </div>

                {/* Mockup Content */}
                <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 items-center md:items-start overflow-hidden">
                  {/* Product Image */}
                  <div className="w-full md:w-1/2 aspect-[3/4] bg-gray-100 rounded-2xl relative overflow-hidden shadow-inner group">
                    <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" alt="Model" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                    {/* Floating Tag */}
                    <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-bold shadow-sm">
                      Nova Coleção
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 w-full space-y-4 text-center md:text-left">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 leading-tight">Conjunto <br /> Seamless Pro</h3>
                      <p className="text-sm text-gray-400 font-medium">Ref: 83921</p>
                    </div>

                    <div className="flex items-center justify-center md:justify-start gap-3">
                      <span className="text-2xl font-bold text-emerald-600">R$ 189,00</span>
                      <span className="text-sm text-gray-300 line-through">R$ 259,00</span>
                    </div>

                    {/* The "Try On" Button - Standalone JS Widget */}
                    <div className="pt-2">
                      <div id="wearme-btn"></div>
                      <Script
                        src="/widget.js"
                        onLoad={() => {
                          // @ts-ignore
                          if (window.Wearme) {
                            // @ts-ignore
                            window.Wearme.init({
                              apiKey: '023ec83bdbf73177a680807fc144bfea',
                              productImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
                              buttonSelector: '#wearme-btn'
                            });
                          }
                        }}
                      />
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="h-2 w-full bg-gray-50 rounded-full" />
                      <div className="h-2 w-3/4 bg-gray-50 rounded-full" />
                      <div className="h-2 w-5/6 bg-gray-50 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Floating Elements for Decoration */}
            <div className="absolute -top-12 -right-12 bg-white p-4 rounded-2xl shadow-xl shadow-black/5 animate-float delay-100 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Conversão</p>
                  <p className="text-lg font-black text-gray-900">+45%</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-2xl shadow-xl shadow-black/5 animate-float delay-300 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Expand size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Devoluções</p>
                  <p className="text-lg font-black text-gray-900">-30%</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

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
            <ul className="space-y-4 pt-4">
              {[
                "Compatível com qualquer CMS",
                "Carregamento assíncrono (não pesa o site)",
                "Personalizável via CSS"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-primary" />
                  <span className="font-bold">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary to-purple-500 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur-lg" />
            <div className="bg-[#1e1e1e] rounded-xl p-6 font-mono text-sm shadow-2xl overflow-hidden border border-white/10 relative">
              <div className="flex gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
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

              <div className="absolute top-6 right-6 text-xs font-bold text-white/20 uppercase tracking-widest">code snippet</div>
            </div>
          </div>
        </div>
      </section >

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
          <div className="flex items-center justify-center gap-4 mb-12">
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
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            {/* Basic Plan */}
            <div className="bg-white rounded-3xl border-2 border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-gray-900">Básico</h3>
                <div className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                  Para Começar
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-gray-90">
                    R$ {isAnnual ? '175,12' : '199,00'}
                  </span>
                  <span className="text-gray-500 font-semibold">/mês</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Leve essa experiência para seus clientes</p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  '100 gerações por mês',
                  'Widget personalizável',
                  'Suporte por email',
                  'Integração básica'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/signup"
                className="block w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl text-center transition-colors"
              >
                Começar Grátis
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-gradient-to-r from-primary to-pink-400 rounded-3xl p-8 shadow-2xl shadow-rose-500/30 relative overflow-hidden transform hover:scale-105 transition-all">
              {/* Shine Effect */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black text-white">Profissional</h3>
                  <div className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                    Mais Popular
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white">
                      R$ {isAnnual ? '219,12' : '249,00'}
                    </span>
                    <span className="text-white/80 font-semibold">/mês</span>
                  </div>
                  {isAnnual && (
                    <p className="text-sm text-white/80 mt-2">
                      R$ 2.199 cobrado anualmente
                    </p>
                  )}
                  <p className="text-sm text-white/90 mt-2 font-semibold">Ideal para lojas em crescimento</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {[
                    '1.000 gerações por mês',
                    'Widget totalmente personalizável',
                    'Suporte prioritário',
                    'Analytics avançado',
                    'API completa',
                    'Sem marca d\'água'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 size={20} className="text-white shrink-0" />
                      <span className="text-white font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/signup"
                  className="block w-full py-4 bg-white text-rose-600 font-bold rounded-xl text-center hover:bg-rose-50 transition-colors shadow-xl"
                >
                  Começar Agora
                </Link>
              </div>
            </div>
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
                { icon: <BarChart3 size={24} />, label: 'ROI Comprovado', desc: '+45% conversão' },
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
                href="/auth/signup"
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
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">© 2026 Wearme Technologies.</p>
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
