'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProjectTheme(projectId: string, theme: any) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('projects')
        .update({ theme })
        .eq('id', projectId)
        .select()
        .single()

    if (error) return { error: error.message }

    revalidatePath(`/apps/[slug]/theme`, 'page')
    return { data }
}

export async function updateProjectMenus(projectId: string, menus: any) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('projects')
        .update({ menus })
        .eq('id', projectId)
        .select()
        .single()

    if (error) return { error: error.message }

    revalidatePath(`/apps/[slug]/menu-horizontal`, 'page')
    revalidatePath(`/apps/[slug]/menu-lateral`, 'page')
    return { data }
}

export async function createProject(payload: { name: string; slug: string; company_id: string }) {
    const supabase = await createClient()

    // Default Theme Structure
    const defaultTheme = {
        colors: {
            base: "#ffffff",
            primary: "#1ca0b5",
            secondary: "#f0f2f5",
            accent: "#008f6f",
            neutral: "#54656f"
        },
        buttonStyle: {
            borderWidth: "1px",
            radius: "12px",
            scaleOnClick: 0.95,
            animationDuration: "200ms"
        },
        fontFamily: "Inter"
    }

    // Default Menus Structure
    const defaultMenus = {
        drawer: {
            items: [
                { href: "/categoria/casacos", label: "Casacos" },
                { href: "/categoria/blusas", label: "Blusas" },
                { href: "/colecao/inverno", label: "Coleção Inverno" }
            ]
        },
        horizontal: {
            items: [
                { href: "/", icon: "Home", label: "Home" },
                { href: "/categorias", icon: "ShoppingCart", label: "Categorias" },
                { href: "/carrinho", label: "Carrinho" },
                { href: "/pedidos", label: "Pedidos" },
                { href: "/perfil", label: "Perfil" }
            ]
        }
    }

    const { data, error } = await supabase
        .from('projects')
        .insert({
            ...payload,
            theme: defaultTheme,
            menus: defaultMenus,
            description: "",
            logo_url: ""
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating project:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard/apps')
    return { data }
}
