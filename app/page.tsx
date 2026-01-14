"use client"
import { useState } from "react"
import { WearmeWidget } from "@/components/wearme-widget"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Script from "next/script"
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
  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-primary/20">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <Shirt size={18} className="text-primary-foreground fill-current" />
          </div>
          <span className="font-black text-xl tracking-tighter text-foreground">Wearme.</span>
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
                              apiKey: 'pk_test_wearme_123',
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
      < section id="integration" className="py-32 px-6 bg-foreground text-background relative overflow-hidden" >
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
                  <span className="text-purple-400">&lt;script</span> <span className="text-blue-400">src</span>=<span className="text-green-400">"https://wear-me-opal.vercel.app/widget.js"</span><span className="text-purple-400">&gt;&lt;/script&gt;</span>
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

      {/* Pricing Teaser */}
      < section id="pricing" className="py-32 px-6 bg-[#f8f9fb]" >
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-4xl font-black text-foreground">Planos para todos os tamanhos</h2>
          <p className="text-muted-foreground text-lg">Comece a testar gratuitamente hoje mesmo. Sem cartão de crédito.</p>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            {/* Simplified Pricing Cards for Home - detailed on dashboard */}
            {[
              { name: 'Starter', price: '99', fit: 'Pequenas Lojas' },
              { name: 'Growth', price: '299', fit: 'E-commerces em Expansão', featured: true },
              { name: 'Enterprise', price: 'Consultar', fit: 'Grandes Varejistas' },
            ].map((plan, i) => (
              <div key={i} className={`bg-white p-8 rounded-3xl border shadow-sm ${plan.featured ? 'border-primary shadow-xl shadow-primary/10 relative overflow-hidden' : 'border-border'}`}>
                {plan.featured && <div className="absolute top-0 inset-x-0 h-1 bg-primary" />}
                <h4 className="text-lg font-bold">{plan.name}</h4>
                <div className="my-4">
                  <span className="text-3xl font-black">R$ {plan.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{plan.fit}</p>
                <Link href="/auth/signup" className={`block text-center py-3 rounded-xl font-bold text-sm ${plan.featured ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                  Começar
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section >

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
            <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center text-background">
              <Shirt size={14} />
            </div>
            <span className="font-bold text-lg tracking-tight">Wearme.</span>
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
