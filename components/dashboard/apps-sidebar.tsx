"use client"

import { useRef, useState } from "react"
import { cn } from "@/lib/utils"
import {
  BrainCircuit,
  Building2,
  DollarSign,
  Home,
  LogOut,
  MessageCircle,
  Settings,
  Users,
  ChevronDown,
  MessageCircleDashedIcon,
  Contact,
  BoxIcon,
  DollarSignIcon,
  CreditCardIcon,
  Mail,
  File,
  PaintRollerIcon,
  Palette,
  LayoutDashboard,
  Image,
  Menu,
  MenuSquare,
  Bell,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

interface MenuItem {
  name: string
  href: string
  isAdminRequired?: boolean
  icon: any
  flag?: string
  isSoon?: boolean
}

interface MenuGroup {
  name: string
  href: string
  isAdminRequired?: boolean
  icon: any
  flag?: string
  isSoon?: boolean
  children?: MenuItem[]
}

export function AppsSidebar({ role, slug }: { role: string; slug?: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const [collapsed, setCollapsed] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const isExpanded = !collapsed || hovered

  const handleMouseEnter = () => {
    // 🛑 Cancela fechamento pendente
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setHovered(true)
  }

  const handleMouseLeave = () => {
    // ⏳ Aguarda 600ms antes de fechar
    closeTimeoutRef.current = setTimeout(() => {
      setHovered(false)
    }, 600)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }


  const navigation: MenuGroup[] = [
    { name: "Dashboard", href: `/apps/${slug}`, icon: LayoutDashboard },
    { name: "Conteudo", href: `/apps/${slug}/cms`, icon: BoxIcon },
    { name: "Theme", href: `/apps/${slug}/theme`, icon: Palette },
    {
      name: "Menu", href: `/apps/${slug}/menu`, icon: Menu,
      children: [
        { name: "Menu Horizontal", href: `/apps/${slug}/menu-horizontal`, icon: Menu },
        { name: "Menu Lateral", href: `/apps/${slug}/menu-lateral`, icon: MenuSquare },
      ]
    },
    // Assets
    { name: "Assets", href: `/apps/${slug}/assets`, icon: Image },
    // Sections
    {
      name: "Seções",
      href: `/apps/${slug}/sections`,
      icon: BoxIcon,
    },
    {
      name: "Notificações",
      href: `/apps/${slug}/notifications`,
      icon: Bell,
    },

    // 👉 ITEM COM "EM BREVE"
    {
      name: "Monetização",
      href: `/apps/${slug}/monetization`,
      icon: DollarSignIcon,
      isSoon: true,
    },
    {
      name: "Email",
      href: `/apps/${slug}/email`,
      icon: Mail,
      isSoon: true,
    },
    {
      name: "Chat",
      href: `/apps/${slug}/chat`,
      icon: MessageCircle,
      isSoon: true,
    },
    {
      name: "Posts",
      href: `/apps/${slug}/posts`,
      icon: File,
      isSoon: true,
    },

  ]

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "flex h-full flex-col border-r bg-card transition-all duration-300 overflow-hidden",
        isExpanded ? "w-64" : "w-16",
      )}
    >
      {/* HEADER */}
      <div className="flex h-14 items-center border-b px-4 w-64">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Building2 className="h-6 w-6 shrink-0" />
          {isExpanded && <span>Wearme</span>}
        </Link>
      </div>

      {/* NAV */}
      <nav className="flex-1 py-4 w-64">
        {navigation.map((item) => {
          if (item.isAdminRequired && role !== "admin" && role !== "owner") return null

          const Icon = item.icon
          const isActive = item.href === pathname
          const isDisabled = item.isSoon
          const isOpen = openMenu === item.name

          const baseClasses = cn(
            "text-sm min-h-[48px] flex items-center gap-4 px-4 py-3 border-l-[3px] transition-all",
            isActive && !isDisabled
              ? "border-[#1ca0b5] bg-[#f0f2f5]"
              : "border-transparent",
            isDisabled
              ? ""
              : "hover:bg-[#f0f2f5]",
          )

          // 🔒 ITEM DESATIVADO
          if (isDisabled) {
            return (
              <Link href={item.href} key={item.href} className={baseClasses}>
                <Icon className="h-4 w-4 shrink-0" />
                {isExpanded && (
                  <>
                    <span className="font-medium">{item.name}</span>
                    <span className="ml-auto text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                      Em breve
                    </span>
                  </>
                )}
              </Link>
            )
          }

          // ITEM COM SUBMENU
          if (item.children) {
            return (
              <div key={item.name}>
                <div
                  className={cn(
                    "cursor-pointer min-h-[48px] flex items-center gap-4 px-4 py-3 border-l-[3px] transition-all hover:bg-[#f0f2f5]",
                    isActive ? "border-[#1ca0b5] bg-[#f0f2f5]" : "border-transparent",
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setOpenMenu(isOpen ? null : item.name)
                  }}
                >
                  {/* LINK PRINCIPAL */}
                  <p className="flex items-center gap-4 flex-1" >
                    <Icon className="h-4 w-4 shrink-0" />

                    {isExpanded && <span className="font-medium text-sm">{item.name}</span>}


                  </p>
                  {isExpanded && (
                    <button
                      type="button"

                      className="p-1 rounded hover:bg-white cursor-pointer"
                    >
                      <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                    </button>
                  )}
                  {/* BOTÃO DO DROPDOWN */}

                </div>

                {/* SUBMENU */}
                {isExpanded && isOpen && (
                  <div className="ml-12 mt-1 space-y-1">
                    {item.children.map((sub) => {
                      const subActive = pathname === sub.href
                      const Icon = sub.icon
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={cn(
                            "block px-3 py-2 rounded text-sm transition-colors flex items-center gap-4",
                            subActive ? "bg-primary/5 text-primary" : "text-[#54656f] hover:bg-[#f0f2f5]",
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {sub.name}
                          {sub?.flag && (
                            <span className="font-medium ml-auto bg-[#1ca0b5] text-white px-2 py-1 rounded">
                              {sub.flag}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          // 👉 ITEM NORMAL
          return (
            <Link key={item.href} href={item.href} className={baseClasses}>
              <Icon className="h-4 w-4 shrink-0" />
              {isExpanded && <span className="font-medium">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* FOOTER */}
      <div className="border-t p-2">
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="h-4 w-4 shrink-0" />
          {isExpanded && <span className="ml-3">Sair</span>}
        </Button>
      </div>
    </div>
  )
}
