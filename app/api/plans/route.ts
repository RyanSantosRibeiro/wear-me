import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
    const supabase = await createAdminClient();
    const { data: plans, error } = await supabase.from("plans").select("id, name, description, price, recurrence, metadata, monthly_fee, price_per_image, included_images, slug").eq("is_active", true)
        .eq("sass_slug", "wearme").order("price", { ascending: true });
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(plans);
}   

// {
//     "id": "699990aa-a3c2-43dd-90d0-cfc1ae8eb4ef",
//     "name": "Starter Fit",
//     "description": "Plano de entrada para ecommerces testarem geração de imagens com IA",
//     "price": 97,
//     "currency": "BRL",
//     "recurrence": "monthly",
//     "metadata": {
//         "features": [
//             "50 Simulações incluidas",
//             "R$0.90 por imagem extra",
//             "Token de Uso",
//             "Relatório de imagens geradas",
//             "Suporte por Email"
//         ]
//     },
//     "is_active": true,
//     "created_at": "2026-01-17T17:16:38.977618+00:00",
//     "updated_at": "2026-01-17T17:37:15.928834+00:00",
//     "slug": "starter-fit",
//     "sass_slug": "wearme",
//     "monthly_fee": 97,
//     "price_per_image": 0.9,
//     "included_images": 50,
//     "target_segment": "starter"
// }