import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PageHeader } from "@/components/PageHeader"
import { SizeChartManager } from "@/components/dashboard/size-chart-manager"

export default async function SizeChartsPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Fetch only private brands owned by user (custom tables)
    // Public brands (like Nike, Adidas) are generally not editable here, 
    // but if we want to allow viewing them, we could adjust the query.
    // For now, let's focus on "Tabelas Customizadas" (owner_id = user.id)
    const { data: brands, error } = await supabase
        .from("brands")
        .select("*, size_charts(*)")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching brands:", error)
    }

    return (
        <div className="space-y-10 p-8 max-w-7xl mx-auto">
            <PageHeader
                title="Tabela de Medidas"
                description="Crie e gerencie tabelas de medidas personalizadas para seus produtos."
            />

            <SizeChartManager initialBrands={brands || []} userId={user.id} />
        </div>
    )
}
