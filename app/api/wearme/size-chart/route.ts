
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const apiKey = searchParams.get("apiKey");
        const brandId = searchParams.get("brandId");

        if (!apiKey) {
            return NextResponse.json({ error: "API Key is required" }, { status: 400 });
        }
        if (!brandId) {
            return NextResponse.json({ error: "Brand ID is required" }, { status: 400 });
        }

        const supabase = await createAdminClient();

        // 1. Validate API Key and get User ID
        const { data: config, error: configError } = await supabase
            .from("wearme_configs")
            .select("*")
            .eq("api_key", apiKey)
            .single();

        if (configError || !config) {
            console.log("Invalid API Key", configError);
            return NextResponse.json({ error: "Invalid API Key" }, { status: 401 });
        }

        // 2. Fetch Brand and verify ownership
        const { data: brand, error: brandError } = await supabase
            .from("brands")
            .select("*")
            .eq("id", brandId)
            .single();

        if (brandError || !brand) {
            return NextResponse.json({ error: "Brand not found" }, { status: 404 });
        }

        if (brand.owner_id !== config.owner_id) {
            return NextResponse.json({ error: "Unauthorized access to this brand" }, { status: 403 });
        }

        // 3. Fetch Size Chart Data
        const { data: charts, error: chartsError } = await supabase
            .from("size_charts")
            .select("size_br, measure_cm")
            .eq("brand_id", brandId)
            .order("size_br", { ascending: true });

        if (chartsError) {
            return NextResponse.json({ error: "Error fetching charts" }, { status: 500 });
        }

        return NextResponse.json({
            brandName: brand.name,
            charts: charts
        });

    } catch (error) {
        console.error("Internal Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
