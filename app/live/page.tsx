"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCcw, Upload, X, Loader2, Image as ImageIcon, Check } from 'lucide-react';

const CATEGORIES = [
  { id: 'vestido', name: 'Vestido' },
  { id: 'casual', name: 'Casual' },
  { id: 'fitness', name: 'Fitness' },
  { id: 'terno', name: 'Ternos' },
  { id: 'elegante', name: 'Elegante' },
];

const PRODUCTS = {
  vestido: [
    { id: 'v1', name: 'Vestido Vermelho', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800', category: 'vestido' },
    { id: 'v2', name: 'Vestido Floral', image: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?q=80&w=696&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'vestido' },
    { id: 'v3', name: 'Vestido Preto', image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=800', category: 'vestido' },
  ],
  casual: [
    { id: 'c1', name: 'Jaqueta Jeans', image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=800', category: 'casual' },
    { id: 'c2', name: 'Camiseta Básica', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800', category: 'casual' },
    { id: 'c3', name: 'Moletom Cinza', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800', category: 'casual' },
  ],
  fitness: [
    { id: 'f1', name: 'Top Esportivo Preto', image: 'https://http2.mlstatic.com/D_NQ_NP_2X_958555-MLB104790840823_012026-F.webp', category: 'fitness' },
    { id: 'f2', name: 'Legging Azul', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&q=80&w=800', category: 'fitness' },
    { id: 'f3', name: 'Conjunto Fitness', image: 'https://adaptive-images.uooucdn.com.br/ik-seo/tr:w-1100,h-1594,c-at_max,pr-true,q-90/a22432-ogxytnpxyz0/pv/58/bb/b5/5642253e690f5bf1298f905d0d/conjunto-feminino-fitness-legging-e-top-marrom-large-1.jpg', category: 'fitness' },
  ],
  terno: [
    { id: 't1', name: 'Terno Slim Fit Preto', image: 'https://http2.mlstatic.com/D_NQ_NP_2X_845152-MLB92646676507_092025-F-ternos-italiano-slim-promoco-imperdivel-todas-as-cores.webp', category: 'terno' },
    { id: 't2', name: 'Blazer Azul Marinho', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800', category: 'terno' },
  ],
  elegante: [
    { id: 'e1', name: 'Camisa Social Branca', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8X-VL-GuqrFWDDrCjNvcKn18FOicj19ckow&s', category: 'elegante' },
    { id: 'e2', name: 'Calça Alfaiataria', image: 'https://lojaviego.com.br/cdn/shop/files/Calca-Alfaiataria-Masculino-Social-Preto-Viego_4_1340x.jpg?v=1742737830', category: 'elegante' },
  ],
};

function dataURLtoFile(dataurl: string, filename: string) {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)?.[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export default function LiveTryOnPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hasCameraAccess, setHasCameraAccess] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('vestido');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [showConsent, setShowConsent] = useState<boolean>(true);

  const startCamera = async (mode = facingMode) => {
  try {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: mode }
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play(); // 🔥 importante
    }

    setHasCameraAccess(true);
  } catch (err: any) {
    console.error("ERRO REAL:", err);

    alert(
      "Erro: " + err?.name + "\n" +
      "Mensagem: " + err?.message
    );
  }
};

  useEffect(() => {
    const consent = localStorage.getItem('wearme_live_consent');
    if (consent) {
      setShowConsent(false);
      startCamera();
    }
  return () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };
}, []);

  const handleConsent = () => {
    localStorage.setItem('wearme_live_consent', 'true');
    setShowConsent(false);
    startCamera();
  };

  const toggleCamera = () => {
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);
    startCamera(newMode);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Handle mirroring if using front camera
        if (facingMode === "user") {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (re) => {
        setCapturedImage(re.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateLook = async () => {
    if (!capturedImage) return;
    if (!selectedProduct) return alert('Selecione um produto primeiro!');

    setIsGenerating(true);
    try {
      const file = dataURLtoFile(capturedImage, 'user-photo.jpg');
      const formData = new FormData();
      formData.append('apiKey', '023ec83bdbf73177a680807fc144bfea'); // mock
      formData.append('sessionId', 'live_' + Date.now());
      formData.append('items', JSON.stringify([selectedProduct]));
      formData.append('userImage', file);

      const response = await fetch('/api/wearme/generate-look', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setResultImage(data.lookImage || data.url); // Ajuste de acordo com a resposta real da API
      } else {
        throw new Error(data.error || "Erro ao gerar look");
      }
    } catch (e: any) {
      console.error(e);
      alert("Erro ao tentar gerar o look: " + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetFlow = () => {
    setCapturedImage(null);
    setResultImage(null);
    startCamera();
  };

  // Render Result view
  if (resultImage) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col">
        <img src={resultImage} alt="Resultado" className="w-full h-full object-cover" />
        <div className="absolute top-8 right-8">
          <button onClick={resetFlow} className="p-4 bg-black/50 backdrop-blur text-white rounded-full hover:bg-black/80 transition-all">
            <X size={24} />
          </button>
        </div>
        <div className="absolute bottom-8 inset-x-0 flex justify-center px-6">
          <button onClick={resetFlow} className="w-full max-w-sm py-4 bg-white text-black font-bold uppercase tracking-widest rounded-full shadow-2xl">
            Tentar Novo Look
          </button>
        </div>
      </div>
    );
  }

  // Render Generating view
  if (isGenerating) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white z-50">
        <Loader2 size={48} className="animate-spin text-white mb-6" />
        <h2 className="text-2xl font-black mb-2 text-center">Vestindo com IA...</h2>
        <p className="text-white/60 text-center max-w-xs">Aguarde enquanto a nossa Inteligência Artificial ajusta a peça perfeitamente em você.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden font-sans">
      {showConsent && (
        <div className="absolute inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] max-w-sm w-full backdrop-blur-xl">
                <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Camera size={36} className="text-pink-400" />
                </div>
                <h2 className="text-2xl font-black text-white mb-4">Uso de Imagem</h2>
                <p className="text-white/70 mb-8 text-sm leading-relaxed">
                    Para usar o provador virtual, precisamos acessar a sua câmera ou galeria. <br/><br/>
                    Fique tranquilo: <strong>suas fotos e imagens geradas não são guardadas</strong> em nossos servidores e serão descartadas após o uso.
                </p>
                <button 
                   onClick={handleConsent}
                   className="w-full py-4 bg-gradient-to-r from-pink-500 to-primary text-white font-black uppercase tracking-wider rounded-2xl shadow-xl shadow-pink-500/20 active:scale-95 transition-all"
                >
                   Eu concordo
                </button>
            </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
      <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileUpload} />

      {/* Video / Captured Image Background */}
      <div className="absolute inset-0">
        {capturedImage ? (
          <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
          />
        )}
        {/* Dark Overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* Top Header Actions */}
      <div className="absolute top-6 inset-x-0 px-6 flex justify-between items-center z-10">
        <h1 className="text-white font-black text-2xl drop-shadow-md italic">Wear<span className="text-pink-400">Me</span></h1>

        <div className="flex gap-4">
          
          {capturedImage && (
            <button onClick={resetFlow} className="p-3 bg-white/20 backdrop-blur text-white rounded-full">
              <X size={20} />
            </button>
          )}
          
        </div>
      </div>

      {/* Bottom UI Wrapper */}
      <div className="absolute bottom-0 inset-x-0 pb-8 pt-20 flex flex-col gap-6 z-10">

        {/* Product Slider (If a category is selected) */}
        <div className="w-full overflow-x-auto px-6 pb-2 snap-x snap-mandatory hide-scrollbars no-scrollbar">
          <div className="flex gap-4" style={{ width: 'max-content' }}>
            {(PRODUCTS as any)[selectedCategory]?.map((product: any) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`relative snap-center w-28 h-36 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${selectedProduct?.id === product.id ? 'border-pink-500 scale-105 shadow-[0_0_20px_rgba(236,72,153,0.5)]' : 'border-white/20 opacity-80 hover:opacity-100'}`}
              >
                <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs p-2">
                  <p className="text-white text-[10px] font-bold truncate">{product.name}</p>
                </div>
                {selectedProduct?.id === product.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="w-full overflow-x-auto px-6 hide-scrollbars no-scrollbar">
          <div className="flex gap-3 bg-black/40 backdrop-blur-md p-2 rounded-full" style={{ width: 'max-content' }}>
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSelectedProduct(null); // reset product when changing category
                }}
                className={`px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${selectedCategory === category.id ? 'bg-white text-black' : 'text-white/70 hover:text-white'}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Action Button (Shoot / Generate) */}
        <div className="px-6 flex justify-between items-center mt-2">
          <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-white/20 backdrop-blur text-white rounded-full h-auto">
            <Upload size={20} />
          </button>
          {!capturedImage ? (
            <button
              onClick={capturePhoto}
              className="w-20 h-20 rounded-full bg-white/20 backdrop-blur border-4 border-white flex items-center justify-center relative hover:bg-white/30 transition-all active:scale-95 group"
            >
              <div className="w-14 h-14 bg-white rounded-full group-hover:scale-90 transition-all shadow-[0_0_30px_rgba(255,255,255,0.6)]" />
            </button>
          ) : (
            <button
              onClick={generateLook}
              disabled={!selectedProduct}
              className={`w-full max-w-md py-5 rounded-full font-black text-lg uppercase tracking-widest shadow-2xl transition-all ${!selectedProduct ? 'bg-white/20 text-white/50 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-primary text-white hover:opacity-90 active:scale-95 shadow-pink-500/30'}`}
            >
              {!selectedProduct ? 'Selecione uma peça' : 'Provar Roupa com IA'}
            </button>
          )}
          {!capturedImage && (
            <button onClick={toggleCamera} className="p-3 bg-white/20 backdrop-blur text-white rounded-full">
              <RefreshCcw size={20} />
            </button>
          )}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
