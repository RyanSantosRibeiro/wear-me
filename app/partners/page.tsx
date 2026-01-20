"use client"
import { useEffect, useState } from "react"
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
  X,
  Linkedin,
  Instagram
} from "lucide-react"
import ScriptSection from "@/components/ui/script-section"
import { HeroSection } from "@/components/Hero"


export default function PartnersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAnnual, setIsAnnual] = useState(false)
  const [plans, setPlans] = useState([])

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
          <a href="/#demo" className="hover:text-primary transition-colors">Como Funciona</a>
          <a href="/#integration" className="hover:text-primary transition-colors">Instalação</a>
          <a href="/#pricing" className="hover:text-primary transition-colors">Planos</a>
          <a href="/#contact" className="hover:text-primary transition-colors">Contato</a>
          <a href="/partners" className="hover:text-primary transition-colors">Parceiros</a>

        </div>
        <div className="flex items-center gap-3 hidden lg:flex">
          <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
            Entrar
          </Link>
          <Link
            href="//signup"
            className="bg-primary hover:opacity-90 text-primary-foreground rounded-full px-6 py-2 text-xs lg:text-sm font-bold shadow-xl shadow-primary/10 flex items-center justify-center transition-all active:scale-95"
          >
            Começar Agora
          </Link>
        </div>
      </nav>

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
