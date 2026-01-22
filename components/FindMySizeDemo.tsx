"use client"
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, Ruler, Info, Sparkles } from "lucide-react";
import logo from "../assets/img/logo.png"

export const FindMySizeDemo = () => {
    return (
        <section className="pb-24 px-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Configuration & Context */}
                    <div className="space-y-8 order-2 lg:order-1 flex flex-col justify-center">
                        <div className="max-w-7xl mx-auto mb-16">
                            <div className="text-start space-y-4">
                                <div className="inline-flex items-start gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 text-blue-600 mb-2">
                                    <Sparkles size={14} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Lançamento</span>
                                </div>
                                <h2 className="text-4xl md:text-4xl font-black text-gray-900 leading-tight">
                                    Evite devoluções e reembolsos <br />
                                    <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500 italic pr-2">com a WearMe Fit.</span>
                                </h2>
                                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                    Integramos duas novas ferramentas para garantir que seu cliente compre o tamanho certo na primeira tentativa.
                                </p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-3xl font-bold text-gray-900">
                                Experimente a precisão <br /> do nosso algoritmo.
                            </h3>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Nossa nova tecnologia analisa a fôrma de diferentes marcas para recomendar o tamanho perfeito. Além disso, você pode disponibilizar tabelas de medidas interativas e arquivos para impressão.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <Link href="//signup" className="h-14 px-8 bg-gray-900 text-white hover:bg-black text-lg font-bold rounded-2xl shadow-xl flex items-center justify-center transition-all active:scale-95 w-full">
                                Começar Agora
                                <ArrowRight size={20} className="ml-2" />
                            </Link>
                        </div>
                    </div>

                    {/* Right: Interactive Mockup */}
                    <div className="relative order-1 lg:order-2">
                        <div className="relative bg-white border border-gray-200 rounded-[2.5rem] shadow-2xl overflow-hidden max-w-md mx-auto transform hover:rotate-1 transition-transform duration-500">

                            {/* Mockup Header */}
                            <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white z-10 relative">
                                <div className="w-24 h-4 bg-gray-100 rounded-full" />
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-50" />
                                </div>
                            </div>

                            {/* Product Image Stage */}
                            <div className="relative aspect-square bg-gray-100 group">
                                <img
                                    src="https://imgcentauro-a.akamaihd.net/660x660/99052912A3.jpg"
                                    alt="Sneaker"
                                    className="w-full h-full object-cover mix-blend-multiply"
                                />
                                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-xs font-bold">
                                    ADIDAS
                                </div>
                            </div>

                            {/* Product Details & Widget */}
                            <div className="p-8 space-y-6 bg-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900">Ultraboost Light</h3>
                                        <p className="text-gray-500 font-medium">Performance Running</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xl font-bold text-blue-600">R$ 999</span>
                                        <p className="text-xs text-green-600 font-bold">Em estoque</p>
                                    </div>
                                </div>

                                {/* WIDGET CONTAINER */}
                                <div id="find-my-size-container"></div>
                                <div id="size-chart-container" className="pt-2"></div>

                                <button className="w-full h-14 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
                                    Adicionar ao Carrinho
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Script
                src="/findMySize.js"
                strategy="afterInteractive"
                onLoad={() => {
                    // @ts-ignore
                    window.FindMySize.init({
                        buttonSelector: "#find-my-size-container",
                        apiKey: "023ec83bdbf73177a680807fc144bfea",
                        targetBrandId: 2, // Adidas
                        productImage: "https://imgcentauro-a.akamaihd.net/660x660/99052912A3.jpg",
                        productName: "Adidas Ultraboost",
                        highlightColor: "#ff92b5",
                        logoUrl: logo.src,
                    });
                }}
            />
            <Script
                src="/sizeChart.js"
                strategy="afterInteractive"
                onLoad={() => {
                    // @ts-ignore
                    if (window.WearmeSizeChart) {
                        // @ts-ignore
                        window.WearmeSizeChart.init({
                            buttonSelector: "#size-chart-container",
                            apiKey: "023ec83bdbf73177a680807fc144bfea",
                            tableId: "5",
                            highlightColor: "#ff92b5",
                            logoUrl: logo.src,
                        });
                    }
                }}
            />
        </section>
    )
}
