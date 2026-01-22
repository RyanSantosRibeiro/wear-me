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
  Ruler,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

/* =======================
   TIPOS
======================= */

interface MenuItem {
  name: string
  href: string
  icon: any
  flag?: string
}

interface MenuGroup {
  name: string
  href: string
  icon: any
  permission?: string
  children?: MenuItem[]
}

/* =======================
   HIERARQUIA DE ROLES
======================= */

// Role global do sistema
const ROLE_LEVEL = {
  owner: 2,
  admin: 1,
}

// Role dentro da empresa
const COMPANY_ROLE_LEVEL = {
  admin: 2,
  collaborator: 1,
}

/* =======================
   FUNÇÃO DE PERMISSÃO
======================= */

function hasPermission(
  required: string | undefined,
  role: string,
  companyRole: string,
) {
  if (!required) return true

  const roleLevel = ROLE_LEVEL[role as keyof typeof ROLE_LEVEL] ?? 0
  const companyRoleLevel =
    COMPANY_ROLE_LEVEL[companyRole as keyof typeof COMPANY_ROLE_LEVEL] ?? 0

  const requiredRoleLevel = ROLE_LEVEL[required as keyof typeof ROLE_LEVEL] ?? 0
  const requiredCompanyRoleLevel =
    COMPANY_ROLE_LEVEL[required as keyof typeof COMPANY_ROLE_LEVEL] ?? 0

  return roleLevel >= requiredRoleLevel || companyRoleLevel >= requiredCompanyRoleLevel
}

/* =======================
   COMPONENTE
======================= */

export function Sidebar({
  role,
  companyRole,
  menuOptions,
}: {
  role: string
  companyRole: string
  menuOptions?: any[]
}) {
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
    menuOptions?.map(({ label, total_contacts }: any) => ({
      name: label,
      href: `/dashboard/chats/${label}`,
      icon: MessageCircle,
      flag: `${total_contacts}`,
    })) || []

  const navigation: MenuGroup[] = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Tabela de Medidas", href: "/dashboard/tabela-de-medidas", icon: Ruler },
    { name: "Logs de Uso", href: "/dashboard/logs", icon: BrainCircuit },
    { name: "Configurações", href: "/dashboard/settings", icon: Settings },
    { name: "Assinatura", href: "/dashboard/subscription", icon: DollarSign },
    { name: "Parceiros", href: "/dashboard/partners", icon: Users },
    {
      name: "Parcerias (Owner/Admin)",
      href: "/dashboard/partners2",
      icon: Users,
      permission: "admin", // admin OU owner
    },
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
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Building2 className="h-6 w-6 shrink-0" />
          {isExpanded && <span>Wearme</span>}
        </Link>
      </div>

      {/* NAV */}
      <nav className="flex-1 py-4 w-64">
        {navigation.map((item) => {
          if (!hasPermission(item.permission, role, companyRole)) {
            return null
          }

          const Icon = item.icon
          const isActive =
            item.href === pathname ||
            item.children?.some((c) => c.href === pathname)

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
                  <Link href={item.href} className="flex items-center gap-4 flex-1">
                    <Icon className="h-5 w-5 shrink-0" />
                    {isExpanded && <span className="font-medium">{item.name}</span>}
                  </Link>

                  {isExpanded && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setOpenMenu(isOpen ? null : item.name)
                      }}
                      className="p-1 rounded hover:bg-white"
                    >
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>
                  )}
                </div>

                {isExpanded && isOpen && (
                  <div className="ml-12 mt-1 space-y-1">
                    {item.children.map((sub) => {
                      const subActive = pathname === sub.href
                      const SubIcon = sub.icon
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={cn(
                            "block px-3 py-2 rounded text-sm flex items-center gap-4 transition-colors",
                            subActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-accent",
                          )}
                        >
                          <SubIcon className="h-5 w-5 shrink-0" />
                          {sub.name}
                          {sub.flag && (
                            <span className="ml-auto bg-primary text-primary-foreground px-2 py-1 rounded text-[10px]">
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
