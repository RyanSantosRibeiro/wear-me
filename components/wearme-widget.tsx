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
    ImageIcon,
    Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { saveToCache, getFromCache } from "@/lib/wearme-storage"

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

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        onOpenChange?.(isOpen)
    }, [isOpen, onOpenChange])

    // Load from cache on mount
    useEffect(() => {
        const checkCache = async () => {
            const cached = await getFromCache(productImage)
            if (cached) {
                setResultImage(cached)
                setStatus('completed')
            }
        }
        checkCache()
    }, [productImage])

    const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload')
    const [userImages, setUserImages] = useState<File[]>([])
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

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).slice(0, 3 - userImages.length)
            if (newFiles.length > 0) {
                setUserImages([...userImages, ...newFiles])
                const newUrls = newFiles.map(file => URL.createObjectURL(file))
                setPreviewUrls([...previewUrls, ...newUrls])
            }
        }
    }

    const removeImage = (index: number) => {
        const newImages = [...userImages]
        const newUrls = [...previewUrls]
        newImages.splice(index, 1)
        newUrls.splice(index, 1)
        setUserImages(newImages)
        setPreviewUrls(newUrls)
    }

    const startProcessing = async () => {
        if (userImages.length === 0) return

        setStatus('processing')
        setProcessingStep(0)

        // 1. Visual Steps Animation (ux)
        for (let i = 0; i < steps.length; i++) {
            setProcessingStep(i)
            await new Promise(resolve => setTimeout(resolve, 800)) // Slightly faster steps
        }

        try {
            // 2. Real API Call
            const formData = new FormData()
            formData.append("productImage", productImage)
            formData.append("userImage", userImages[0])
            formData.append("mode", generationMode)

            const response = await fetch('/api/wearme/generate', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) throw new Error("Failed to generate")

            const data = await response.json()

            if (data.success && data.imageUrl) {
                setResultImage(data.imageUrl)
                setStatus('completed')
                // Save to client-side cache
                await saveToCache(productImage, data.imageUrl)
            } else {
                console.error("API Error", data.error)
                // Optional: Show error toast here
                setStatus('idle')
            }
        } catch (error) {
            console.error("Generation failed:", error)
            setStatus('idle')
        }
    }

    const reset = () => {
        setStatus('idle')
        setUserImages([])
        setPreviewUrls([])
        setResultImage(null)
        setProcessingStep(0)
    }

    const downloadImage = () => {
        if (!resultImage) return
        const link = document.createElement('a')
        link.href = resultImage
        link.download = `wearme-${productTitle.replace(/\s+/g, '-').toLowerCase()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
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
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold shadow-lg shadow-gray-200 hover:bg-black hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2 relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <Shirt size={18} />
                <span>Provador Virtual</span>
            </button>
            <p className="mt-2 text-[10px] text-gray-400 flex items-center justify-center md:justify-start gap-1">
                <Sparkles size={10} className="text-primary" />
                Experimente antes de comprar
            </p>

            {/* Modal Overlay via Portal */}
            {mounted && isOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/20 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">

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

                        {/* Content Area */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 relative">

                            {status === 'idle' && (
                                <div className="space-y-6">
                                    <div className="text-center space-y-2">
                                        <h4 className="text-xl font-black text-gray-900">Vamos vestir você!</h4>
                                        <p className="text-sm text-gray-500 max-w-xs mx-auto">
                                            Escolha como você quer ver o resultado final.
                                        </p>
                                    </div>

                                    {/* Image Selection Area */}
                                    <div className="flex gap-4">
                                        {/* Product Image (Static) */}
                                        <div className="flex-1 space-y-2">
                                            <p className="text-xs font-bold text-gray-500 text-center uppercase tracking-wide">Produto</p>
                                            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xs relative">
                                                <img src={productImage} alt="Product" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/5" />
                                            </div>
                                        </div>

                                        {/* User Image (Upload) */}
                                        <div className="flex-1 space-y-2">
                                            <p className="text-xs font-bold text-gray-500 text-center uppercase tracking-wide">Você</p>
                                            {previewUrls.length > 0 ? (
                                                <div className="aspect-[3/4] rounded-2xl overflow-hidden relative group border border-gray-200">
                                                    <img src={previewUrls[0]} alt="User" className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={() => removeImage(0)}
                                                        className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group bg-gray-50/50"
                                                >
                                                    <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center group-hover:scale-110 transition-transform text-gray-400 group-hover:text-primary">
                                                        <Camera size={24} />
                                                    </div>
                                                    <div className="text-center px-2">
                                                        <p className="text-xs font-bold text-gray-600 group-hover:text-primary">Adicionar Foto</p>
                                                        <p className="text-[10px] text-gray-400">Corpo inteiro</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        accept="image/*"
                                        className="hidden"
                                    />

                                    {/* Generation Mode Selector */}
                                    {/* <div className="bg-gray-50 p-1.5 rounded-xl grid grid-cols-2 gap-1">
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
                                    </div> */}

                                    {/* Instructions */}
                                    <div className="bg-blue-50/50 rounded-xl p-4 flex gap-3 items-start border border-blue-100/50">
                                        <div className="bg-blue-100 p-1.5 rounded-full text-blue-600 shrink-0 mt-0.5">
                                            <ImageIcon size={14} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-blue-700">Dica profissional</p>
                                            <p className="text-[11px] text-blue-600/80 leading-relaxed">
                                                Para o modo "3 Ângulos", nossa IA irá extrapolar a visualização baseada na sua foto de frente.
                                            </p>
                                        </div>
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
                                        <Button variant="outline" onClick={reset} className="w-full gap-2 transition-all hover:bg-gray-50 active:scale-95">
                                            <RotateCcw size={16} />
                                            Tentar De Novo
                                        </Button>
                                        <Button variant="outline" onClick={downloadImage} className="w-full gap-2 border-emerald-100 text-emerald-700 hover:bg-emerald-50 transition-all active:scale-95">
                                            <Download size={16} />
                                            Baixar Look
                                        </Button>
                                        <Button className="w-full gap-2 bg-gray-900 hover:bg-black text-white shadow-lg shadow-gray-200 col-span-2 mt-2 py-6 text-lg transition-all active:scale-[0.98]">
                                            <Shirt size={20} />
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
                                    disabled={userImages.length === 0}
                                    onClick={startProcessing}
                                    className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none"
                                >
                                    {userImages.length === 0 ? 'Selecione uma foto' : 'Gerar Provador Virtual'}
                                    <Sparkles size={18} className="ml-2" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}
