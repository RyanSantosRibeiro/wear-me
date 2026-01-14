"use client"

import { useState } from "react"
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
}

interface MenuGroup {
  name: string
  href: string
  isAdminRequired?: boolean
  icon: any
  flag?: string
  children?: MenuItem[]
}

export function Sidebar({ role, menuOptions }: { role: string; menuOptions?: any[] }) {
  const pathname = usePathname()
  const router = useRouter()

  const [collapsed, setCollapsed] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const isExpanded = !collapsed || hovered

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const chatsMenuOptions =
    menuOptions?.map(({ label, total_contacts }: any) => {
      console.log({ total_contacts })
      return {
        name: label,
        href: `/dashboard/chats/${label}`,
        icon: MessageCircle,
        flag: `${total_contacts}`,
      }
    }) || []

  const navigation: MenuGroup[] = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Logs de Uso", href: "/dashboard/logs", icon: BrainCircuit },
    { name: "Configurações", href: "/dashboard/settings", icon: Settings },
    { name: "Assinatura", href: "/dashboard/subscription", icon: DollarSign },
  ]

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
          const isActive = item.href === pathname || item.children?.some((c) => c.href === pathname)

          const isOpen = openMenu === item.name

          // ITEM COM SUBMENU
          if (item.children) {
            return (
              <div key={item.name}>
                <div
                  className={cn(
                    "min-h-[48px] flex items-center gap-4 px-4 py-3 border-l-[3px] transition-all hover:bg-accent",
                    isActive ? "border-primary bg-accent" : "border-transparent",
                  )}
                >
                  {/* LINK PRINCIPAL */}
                  <Link href={item.href} className="flex items-center gap-4 flex-1">
                    <Icon className="h-5 w-5 shrink-0" />

                    {isExpanded && <span className="font-medium">{item.name}</span>}
                  </Link>

                  {/* BOTÃO DO DROPDOWN */}
                  {isExpanded && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setOpenMenu(isOpen ? null : item.name)
                      }}
                      className="p-1 rounded hover:bg-white cursor-pointer"
                    >
                      <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                    </button>
                  )}
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
                            subActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent",
                          )}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          {sub.name}
                          {sub?.flag && (
                            <span className="font-medium ml-auto bg-primary text-primary-foreground px-2 py-1 rounded text-[10px]">
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

          // ITEM SIMPLES
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "min-h-[48px] flex items-center gap-4 px-4 py-3 border-l-[3px] transition-all hover:bg-accent",
                isActive ? "border-primary bg-accent" : "border-transparent",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {isExpanded && <span className="font-medium">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* FOOTER */}
      <div className="border-t p-2">
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="h-5 w-5 shrink-0" />
          {isExpanded && <span className="ml-3">Sair</span>}
        </Button>
      </div>
    </div>
  )
}
