"use client"

import { useState, useRef, useEffect } from "react"
import {
    Camera,
    Sparkles,
    Shirt,
    X,
    Upload,
    CheckCircle2,
    Loader2,
    RotateCcw,
    ChevronRight,
    ChevronLeft,
    ImageIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import imgCasual from "@/assets/img/casual.png"
import imgWoman from "@/assets/img/woman.png"
import { createPortal } from "react-dom"

interface WearmeWidgetProps {
    productImage: string
    productTitle?: string
    onOpenChange?: (isOpen: boolean) => void
}

type ProcessingStep = {
    label: string
    status: 'pending' | 'active' | 'completed'
}

export function WearmeWidget({ productImage, productTitle = "Este Produto", onOpenChange }: WearmeWidgetProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [step, setStep] = useState(0)


    useEffect(() => {
        setMounted(true)

        const interval = setInterval(() => {
            setStep(prev => {
                console.log("Atualizando step:", prev)
                if (prev === 1) {
                    setIsOpen(true)
                }

                if (step === 6) {
                    setPreviewUrls([imgWoman.src])
                    setStatus('processing')
                    setProcessingStep(0)
                }

                if (step === 7) {
                    setResultImage(imgCasual.src)
                    setStatus('completed')
                }

                return prev >= 9 ? 0 : prev + 1
            })
        }, 1800)

        return () => clearInterval(interval)
    }, [])


    useEffect(() => {
        onOpenChange?.(isOpen)
    }, [isOpen, onOpenChange])

    const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload')
    const [userImages, setUserImages] = useState("")
    const [previewUrls, setPreviewUrls] = useState<string[]>([])

    // States: idle -> processing -> completed
    const [status, setStatus] = useState<'idle' | 'processing' | 'completed'>('idle')
    const [processingStep, setProcessingStep] = useState(0)
    const [resultImage, setResultImage] = useState<string | null>(null)
    const [generationMode, setGenerationMode] = useState<'front' | 'angles'>('front')

    const fileInputRef = useRef<HTMLInputElement>(null)

    const steps: ProcessingStep[] = [
        { label: "Analisando formato do corpo", status: 'pending' },
        { label: "Ajustando iluminação e sombras", status: 'pending' },
        { label: "Gerando caimento realista", status: 'pending' },
        { label: "Finalizando detalhes", status: 'pending' }
    ]



    const reset = () => {
        setStatus('idle')
        setUserImages([])
        setPreviewUrls([])
        setResultImage(null)
        setProcessingStep(0)
    }

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [isOpen])

    return (
        <div className={`flex flex-col widget-animate animate-${step}`}>
            {
                !isOpen && (
                    <div className="flex flex-col">
                        {/* Trigger Button */}
                        < button
                            onClick={() => setIsOpen(true)}
                            id="wearme-widget-trigger"
                            className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold px-10 shadow-lg shadow-gray-200 hover:bg-black hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <Shirt size={18} />
                            <span>Provador Virtual</span>
                        </button >
                        <p className="mt-2 text-[10px] text-gray-400 flex items-center justify-center md:justify-start gap-1">
                            <Sparkles size={10} className="text-primary" />
                            Experimente antes de comprar
                        </p>
                    </div>
                )
            }
            {
                isOpen && (
                    <div id="wearme-widget-modal" className="relative w-full max-w-[350px] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[70vh]">

                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-sm z-10 sticky top-0">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <Sparkles size={16} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Provador Virtual</h3>
                                    <p className="text-[10px] text-muted-foreground font-medium">Wearme AI v2.0</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* {status} */}

                        {/* Content Area */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 relative">

                            {status === 'idle' && (
                                <div className="space-y-6">
                                    <div className="text-center space-y-2">
                                        <h4 className="text-xl font-black text-gray-900">Vamos vestir você!</h4>
                                    </div>

                                    {/* Image Selection Area */}
                                    <div className="flex gap-4 overflow-hidden">
                                        {/* Product Image (Static) */}
                                        <div id="wearme-widget-product-image" className="flex-1 space-y-2">
                                            <p className="text-xs font-bold text-gray-500 text-center uppercase tracking-wide">Produto</p>
                                            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xs relative">
                                                <img src={productImage} alt="Product" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/5" />
                                            </div>
                                        </div>

                                        {/* User Image (Upload) */}
                                        <div id="wearme-widget-user-image" className="flex-1 space-y-2">
                                            <p className="text-xs font-bold text-gray-500 text-center uppercase tracking-wide">Você</p>
                                            <div className="aspect-[3/4] rounded-2xl overflow-hidden relative group border border-gray-200">
                                                <img src={imgWoman.src} alt="User" className="w-full h-full object-cover" />
                                                <button
                                                    className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        accept="image/*"
                                        className="hidden"
                                    /> */}

                                    {/* Generation Mode Selector */}
                                    <div className="bg-gray-50 p-1.5 rounded-xl grid grid-cols-2 gap-1">
                                        <button
                                            onClick={() => setGenerationMode('front')}
                                            className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${generationMode === 'front'
                                                ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
                                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                                                }`}
                                        >
                                            <Shirt size={14} />
                                            Vista Frente
                                        </button>
                                        <button
                                            onClick={() => setGenerationMode('angles')}
                                            className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${generationMode === 'angles'
                                                ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
                                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                                                }`}
                                        >
                                            <Sparkles size={14} />
                                            3 Ângulos
                                        </button>
                                    </div>


                                </div>
                            )}

                            {status === 'processing' && (
                                <div className="py-8 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full border-4 border-gray-100 flex items-center justify-center">
                                            <Loader2 size={40} className="text-primary animate-spin" />
                                        </div>
                                        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin duration-1000" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Sparkles size={20} className="text-primary animate-pulse" />
                                        </div>
                                    </div>

                                    <div className="space-y-4 w-full max-w-xs">
                                        {steps.map((step, idx) => (
                                            <div key={idx} className="flex items-center gap-3 transition-all duration-300">
                                                <div className={`
                                        w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors duration-300
                                        ${idx < processingStep ? 'bg-green-500 border-green-500 text-white' :
                                                        idx === processingStep ? 'bg-primary border-primary text-white animate-pulse' :
                                                            'bg-white border-gray-200 text-gray-300'}
                                     `}>
                                                    {idx < processingStep ? <CheckCircle2 size={12} /> : idx + 1}
                                                </div>
                                                <span className={`text-sm font-medium transition-colors duration-300 ${idx <= processingStep ? 'text-gray-800' : 'text-gray-300'}`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {status === 'completed' && resultImage && (
                                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                                    {generationMode === 'angles' ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="col-span-2 aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-inner group relative">
                                                <img src={resultImage} alt="Result Front" className="w-full h-full object-cover" />
                                                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white font-medium">Frente</div>
                                            </div>
                                            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 shadow-sm relative grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all">
                                                <img src={resultImage} alt="Result Side" className="w-full h-full object-cover transform scale-x-[-1]" />
                                                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white font-medium">Lado</div>
                                            </div>
                                            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 shadow-sm relative grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all">
                                                <img src={resultImage} alt="Result Back" className="w-full h-full object-cover transform scale-110" />
                                                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white font-medium">Costas</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-gray-100 shadow-inner group">
                                            <img src={resultImage} alt="Result" className="w-full h-full object-cover" />

                                            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                                                <p className="text-xs font-bold text-center text-gray-800">
                                                    ✨ Look gerado com IA
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-3">
                                        <Button variant="outline" onClick={reset} className="w-full gap-2">
                                            <RotateCcw size={16} />
                                            Tentar De Novo
                                        </Button>
                                        <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20">
                                            <Shirt size={16} />
                                            Comprar Agora
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions (Only for uploading state) */}
                        {status === 'idle' && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                                <Button
                                    id="wearme-widget-button"
                                    disabled={userImages.length === 0}
                                    className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none"
                                >
                                    {userImages.length === 0 ? 'Selecione uma foto' : 'Gerar Provador Virtual'}
                                    <Sparkles size={18} className="ml-2" />
                                </Button>
                            </div>
                        )}
                    </div>
                )
            }
        </div>
    )
}
