import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const apiKey = searchParams.get("apiKey");

    if (!apiKey) {
        return NextResponse.json({ error: "API Key is required" }, { status: 400 });
    }
    const brandId = searchParams.get("brand_id");
    const size = searchParams.get("size");
    const targetBrandId = searchParams.get("target_brand_id");
    const widthScoreParam = searchParams.get("source_width_score"); // Optional override

    if (!brandId || !size || !targetBrandId) {
        return NextResponse.json(
            { error: "Missing required parameters: brand_id, size, target_brand_id" },
            { status: 400 }
        );
    }

    const supabase = await createClient();

    // 1. Fetch Source Brand Info
    const { data: sourceBrand, error: sourceBrandError } = await supabase
        .from("brands")
        .select("width_score, name")
        .eq("id", brandId)
        .single();

    if (sourceBrandError || !sourceBrand) {
        console.error("Source brand not found:", sourceBrandError);
        return NextResponse.json({ error: "Source brand not found" }, { status: 404 });
    }

    // 2. Fetch Target Brand Info
    const { data: targetBrand, error: targetBrandError } = await supabase
        .from("brands")
        .select("width_score, name")
        .eq("id", targetBrandId)
        .single();

    if (targetBrandError || !targetBrand) {
        console.error("Target brand not found:", targetBrandError);
        return NextResponse.json({ error: "Target brand not found" }, { status: 404 });
    }

    // 3. Fetch Source Size Measure
    const { data: sourceSize, error: sourceSizeError } = await supabase
        .from("size_charts")
        .select("measure_cm")
        .eq("brand_id", brandId)
        .eq("size_br", size)
        .single();

    if (sourceSizeError || !sourceSize) {
        return NextResponse.json(
            { error: `Size ${size} not found for brand ${sourceBrand.name}` },
            { status: 404 }
        );
    }

    // 4. Calculate Virtual Foot (P_virtual)
    // P_virtual = CM_ref + (Score_Source - Score_Target) * K
    const sourceScore = widthScoreParam ? parseInt(widthScoreParam) : sourceBrand.width_score;
    const K = 0.35;
    const deltaScore = sourceScore - targetBrand.width_score;
    const cmRef = sourceSize.measure_cm;
    const cmVirtual = cmRef + (deltaScore * K);

    console.log("--- FMS CALCULATION START ---");
    console.log(`Reference: Brand ${sourceBrand.name}, Size ${size}, Measure ${cmRef}cm`);
    console.log(`Source Score: ${sourceScore}, Target Score (${targetBrand.name}): ${targetBrand.width_score}`);
    console.log(`Delta Score: ${deltaScore}, K Constant: ${K}`);
    console.log(`Calculation: ${cmRef} + (${deltaScore} * ${K}) = ${cmVirtual.toFixed(2)}cm (Virtual Foot)`);

    // 5. Find Match in Target Brand
    const { data: targetSizes, error: targetSizesError } = await supabase
        .from("size_charts")
        .select("size_br, measure_cm")
        .eq("brand_id", targetBrandId)
        .order("measure_cm", { ascending: true }); // Get ordered list by measure

    if (targetSizesError || !targetSizes || targetSizes.length === 0) {
        return NextResponse.json(
            { error: `No size charts found for target brand ${targetBrand.name}` },
            { status: 404 }
        );
    }

    // Find closest size logic
    let bestMatch = targetSizes[0];
    let minDiff = Math.abs(targetSizes[0].measure_cm - cmVirtual);

    for (const item of targetSizes) {
        const diff = Math.abs(item.measure_cm - cmVirtual);

        // Check if we found a closer match
        if (diff < minDiff) {
            bestMatch = item;
            minDiff = diff;
        }
        // Tie-breaker: If difference is equal, choose the LARGER size (as per spec)
        else if (diff === minDiff) {
            if (Number(item.size_br) > Number(bestMatch.size_br)) {
                bestMatch = item;
            }
        }
    }

    console.log(`Best Match Found: Size ${bestMatch.size_br} with ${bestMatch.measure_cm}cm (Diff: ${minDiff.toFixed(2)}cm)`);
    console.log("--- FMS CALCULATION END ---");

    // Find index of best match to get neighbors
    const bestMatchIndex = targetSizes.findIndex(s => s.size_br === bestMatch.size_br);

    // Get a range of sizes (2 below, 1 above if possible)
    const startIdx = Math.max(0, bestMatchIndex - 2);
    const endIdx = Math.min(targetSizes.length - 1, bestMatchIndex + 1);

    const comparison = targetSizes.slice(startIdx, endIdx + 1).map(s => ({
        size: s.size_br,
        measure_cm: s.measure_cm,
        is_recommended: s.size_br === bestMatch.size_br,
        status: s.measure_cm < cmRef ? "tight" : (s.size_br === bestMatch.size_br ? "recommended" : "loose")
    })).reverse(); // Reverse to show larger sizes first if desired, or keep as is. Let's keep descending order for sizes usually.

    return NextResponse.json({
        recommended_size: bestMatch.size_br,
        confidence_level: minDiff < 0.5 ? "high" : "medium",
        reasoning: `Baseado no seu ${sourceBrand.name} ${size} e ajustando para a fôrma da ${targetBrand.name}.`,
        comparison: comparison,
        debug: {
            source_brand: sourceBrand.name,
            target_brand: targetBrand.name,
            source_user_cm: cmRef,
            virtual_foot_cm: cmVirtual,
            closest_match_cm: bestMatch.measure_cm,
            delta_score: deltaScore,
            used_source_score: sourceScore
        }
    });
}
