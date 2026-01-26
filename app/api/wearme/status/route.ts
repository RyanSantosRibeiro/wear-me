import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
    try {
        const apiKey = req.nextUrl.searchParams.get("apiKey");

        if (!apiKey) {
            return NextResponse.json({ error: "API Key is required" }, { status: 400 });
        }
        console.log("WearMe API Key:", apiKey);
        const supabase = await createAdminClient();
        const { data: config, error } = await supabase
            .from("wearme_configs")
            .select("*")
            .eq("api_key", apiKey)
            .single();


        console.log("WearMe Status:", config);
        console.log("WearMe Error:", error);
        if (error || !config) {
            return NextResponse.json({ error: "Invalid API Key" }, { status: 401 });
        }

        // Check if limits are reached
        const isLimitReached = (config.requests_count || 0) >= (config.requests_limit || 0);
        const canGenerate = !isLimitReached;
        console.log("Can Generate:", canGenerate);
        return NextResponse.json({
            active: true, // Key exists and is valid
            canGenerate: canGenerate,
            remaining: Math.max(0, (config.requests_limit || 0) - (config.requests_count || 0)),
            plan: config.subscription_status
        }, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });

    } catch (error) {
        console.error("Error checking status:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}