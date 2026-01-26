"use client"
import { ArrowRight, Dumbbell, Expand, Glasses, Shirt, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import imgAcessories from "@/assets/img/acessories.png"
import imgCasual from "@/assets/img/casual.png"
// import imgSport from "@/public/img/sport.png"


export const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<'sport' | 'casual' | 'accessories'>("sport")
  const [out, setOut] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const wearmeBtnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // @ts-ignore
    if (!window.Wearme || !wearmeBtnRef.current) return

    // 🔥 Limpa qualquer instância anterior
    wearmeBtnRef.current.innerHTML = ""

    // (Opcional) Se o SDK tiver destroy/reset
    // window.Wearme.destroy?.()

    // @ts-ignore
    window.Wearme.init({
      apiKey: "023ec83bdbf73177a680807fc144bfea",
      productImage: categoryImage[selectedCategory],
      buttonSelector: "#wearme-btn" //@ts-ignore
    }, {
      resultImage: null,
      status: "idle",
      userImage: null,
      previewUrl: null,
      processingStep: 0,
      generationMode: 'front',
      imageTest: selectedCategory === "sport" ? null : selectedCategory === "casual" ? imgCasual.src : imgAcessories.src,
      testMode: false
    })
  }, [selectedCategory])


  const handleCategoryChange = (category: 'sport' | 'casual' | 'accessories') => {
    if (out || selectedCategory === category) return
    setOut(true)
    setTimeout(() => {
      setSelectedCategory(category)
      setOut(false)
    }, 600)
  }

  // const startAutoRotate = () => {
  //   if (intervalRef.current) return;

  //   intervalRef.current = setInterval(() => {
  //     const newCategory =
  //       selectedCategory === "sport"
  //         ? "casual"
  //         : selectedCategory === "casual"
  //           ? "accessories"
  //           : "sport";

  //     handleCategoryChange(newCategory);
  //   }, 5000);
  // };

  // const stopAutoRotate = () => {
  //   if (intervalRef.current) {
  //     clearInterval(intervalRef.current);
  //     intervalRef.current = null;
  //   }
  // };

  // useEffect(() => {
  //   startAutoRotate();

  //   return () => {
  //     stopAutoRotate();
  //   };
  // }, [selectedCategory]);

  const categoryImage = {
    sport: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
    casual: "https://www.zenoficial.com.br/cdn/shop/files/11573_002_AnaPaula1.jpg?v=1760753084&width=823",
    accessories: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    out: ""
  }
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex items-center h-auto">
      {/* Background Decor */}
      <div className={`${!out ? `animate-particle-${selectedCategory}` : 'animate-particle-out'} absolute top-0 right-0 -z-10 w-[600px] h-[600px]  rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 mix-blend-multiply z-20 ${selectedCategory === "sport" ? "bg-green-400/20" : selectedCategory === "casual" ? "bg-rose-400/20" : "bg-amber-400/20"}`} />
      <div className={`${!out ? `animate-particle-${selectedCategory}` : 'animate-particle-out'} absolute bottom-0 left-0 -z-10 w-[400px] h-[400px]  rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 mix-blend-multiply z-20 ${selectedCategory === "sport" ? "bg-green-400/20" : selectedCategory === "casual" ? "bg-rose-400/20" : "bg-amber-400/20"}`} />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center h-auto">
        {/* Left Column: Text Content */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-start gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100 text-green-600 mb-2">
            <Sparkles size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Evolua a jornada do seu cliente</span>
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
              href="//signup"
              className="h-14 px-8 bg-foreground text-background hover:bg-foreground/90 text-lg font-bold rounded-2xl shadow-2xl shadow-foreground/10 group flex items-center justify-center transition-all active:scale-95 w-full sm:w-auto"
            >
              Criar Conta Grátis
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#pricing" className="h-14 px-8 border border-border text-foreground text-lg font-bold rounded-2xl bg-white hover:bg-secondary/50 transition-all active:scale-95 flex items-center justify-center w-full sm:w-auto">
              Nossos planos
            </a>
          </div>

          <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Trust Badges / Logos Placeholder */}
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">O futuro da moda online</p>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-8 opacity-60 transition-all duration-500">
            {/* button sport */}
            <Button onClick={() => handleCategoryChange("sport")} className={`relative overflow-hidden h-14 px-8 border-2 border-green-300 hover:border-green-500 !text-green-500 !bg-green-50 ${selectedCategory === "sport" ? "border-green-500 !bg-green-200 hero-active" : ""}`}>
              <Dumbbell size={20} /> <span className="font-bold">Sport</span> <div className="bar-progress absolute bottom-0 left-0 w-[0%] h-[3px] bg-green-500"></div>
            </Button>
            {/* button vestido */}
            <Button onClick={() => handleCategoryChange("casual")} className={`relative overflow-hidden h-14 px-8 border-2 border-rose-300 hover:border-rose-500 !text-rose-500 !bg-rose-50 ${selectedCategory === "casual" ? "border-rose-500 !bg-rose-200 hero-active" : ""}`}>
              <Shirt size={20} /> <span className="font-bold">Casual</span> <div className="bar-progress absolute bottom-0 left-0 w-[0%] h-[3px] bg-rose-500"></div>
            </Button>
            {/* button acessorios */}
            <Button onClick={() => handleCategoryChange("accessories")} className={`relative overflow-hidden h-14 px-8 border-2 border-amber-300 hover:border-amber-500 !text-amber-500 !bg-amber-50 ${selectedCategory === "accessories" ? "border-amber-500 !bg-amber-200 hero-active" : ""}`}>
              <Glasses size={20} /> <span className="font-bold">Acessorios</span> <div className="bar-progress absolute bottom-0 left-0 w-[0%] h-[3px] bg-amber-500"></div>
            </Button>
          </div>
        </div>

        {/* Right Column: PDP Simulation (The "Wearme" Interface) */}
        <div className={`relative w-full max-w-lg mx-auto lg:max-w-none h-auto ${!out ? `animate-${selectedCategory}` : 'animate-out'} hover:rotate-1 transition-transform duration-500`}>
          {/* 3D Floating Effect Container */}
          <div id="wearme-container" className="wearme-container relative bg-white border border-border rounded-[2.5rem] shadow-2xl shadow-primary/10 overflow-hidden min-h-[90vh] md:min-h-[40vh] flex items-center justify-center transform hover:rotate-y-1 transition-transform duration-500">

            {/* Background: Product Page Mockup */}
            <div id="wearme-background" className={`absolute inset-0 flex flex-col transition-all duration-500 h-fit ${isModalOpen ? 'opacity-30 scale-95 blur-sm' : 'opacity-100 scale-100'}`}>
              {/* Mockup Header */}
              <div className="h-14 border-b border-gray-50 flex items-center justify-between px-6">
                <div className="w-20 h-2 bg-gray-100 rounded-full" />
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-50" />
                  <div className="w-6 h-6 rounded-full bg-gray-50" />
                </div>
              </div>

              {/* Mockup Content */}
              <div className="flex-1 p-6 flex flex-col lg:flex-row gap-6 items-center lg:items-start overflow-hidden h-auto">
                {/* Product Image */}
                <div className="w-full lg:w-1/2 lg:aspect-[3/4] bg-gray-100 rounded-2xl relative overflow-hidden shadow-inner group min-h-[300px]">
                  {/* <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" alt="Model" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /> */}
                  <img src={categoryImage[selectedCategory]} alt="Model" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 min-h-[400px]" />
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
                    <div id="wearme-btn" ref={wearmeBtnRef}></div>

                    <Script src="/WearMe.js" strategy="afterInteractive" onLoad={() => {
                      // @ts-ignore
                      if (window.Wearme) {
                        // @ts-ignore
                        window.Wearme.init({
                          apiKey: '023ec83bdbf73177a680807fc144bfea',
                          highlightColor: '#ff92b5',
                          // productImage: 'https://www.zenoficial.com.br/cdn/shop/files/11573_002_AnaPaula1.jpg?v=1760753084&width=823',
                          productImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
                          buttonSelector: '#wearme-btn'
                        }, {
                          resultImage: null,
                          status: "idle",
                          userImage: null,
                          previewUrl: null,
                          processingStep: 0,
                          generationMode: 'front',
                          imageTest: selectedCategory === "sport" ? null : selectedCategory === "casual" ? imgCasual.src : imgAcessories.src,
                          testMode: false
                        });
                      }
                    }} />
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
          <div id="wearme-floating-1" className="wearme-floating absolute -top-12 -right-12 bg-white p-4 rounded-2xl shadow-xl shadow-black/5 animate-float delay-100 hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <ShoppingBag size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Mais</p>
                <p className="text-lg font-black text-gray-900">Conversões</p>
              </div>
            </div>
          </div>

          <div id="wearme-floating-2" className="wearme-floating absolute -bottom-8 -left-8 bg-white p-4 rounded-2xl shadow-xl shadow-black/5 animate-float delay-300 hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Expand size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Menos</p>
                <p className="text-lg font-black text-gray-900">Devoluções</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}