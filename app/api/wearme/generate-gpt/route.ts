import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { MODERATE_PROMPT } from "@/utils/prompts/moderate";
import OpenAI, { toFile } from "openai";

function withCORS(req: NextRequest, res: NextResponse) {
    const origin = req.headers.get("origin") ?? "null";

    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type");
    res.headers.set("Vary", "Origin");

    return res;
}

export async function OPTIONS(req: NextRequest) {
    return withCORS(req, new NextResponse(null, { status: 200 }));
}

export async function POST(req: NextRequest) {
    console.log("--- VTON Generation (GPT) Started ---");
    try {
        const formData = await req.formData();
        const productImage = formData.get("productImage") as string;
        const userImageRaw = formData.get("userImage");
        const userImage = (userImageRaw instanceof File && userImageRaw.size > 0) ? userImageRaw : null;
        const mode = formData.get("mode-old") as string;
        const clientApiKey = formData.get("apiKey") as string;

        console.log("Request Data:", {
            mode,
            apiKey: clientApiKey ? `${clientApiKey.substring(0, 5)}...` : "missing",
            productImage: productImage ? `${productImage.substring(0, 50)}...` : "missing",
            userImage: userImage ? { name: userImage.name, size: userImage.size, type: userImage.type } : "missing"
        });

        if (!productImage || !userImage) {
            console.warn("Validation Failed: Product or User image missing");
            return withCORS(req, NextResponse.json({ error: "Product and User images are required" }, { status: 400 }));
        }

        // 1. Validate API Key
        console.log("Validating API Key...");
        const supabase = await createAdminClient();
        const { data: config, error: configError } = await supabase
            .from("wearme_configs")
            .select("*")
            .eq("api_key", clientApiKey)
            .single();

        if (configError || !config) {
            console.error("API Key Validation Error:", configError || "Key not found");
            return withCORS(req, NextResponse.json({ error: "Invalid API Key" }, { status: 401 }));
        }
        console.log("Config Found:", { id: config.id, owner_id: config.owner_id, site_url: config.site_url });

        if (!config.site_url) {
            console.warn("Config Error: Site URL not configured");
            return withCORS(req, NextResponse.json({ error: "Site URL not configured" }, { status: 401 }));
        }

        // Security Check: Site URL verification
        const origin = req.headers.get("origin") || req.headers.get("referer");
        console.log("Security Check:", { origin, expected: config.site_url });
        if (origin !== "http://localhost:3000" && !origin?.includes("myvtex") && !origin?.includes("wearme") && (!origin || !origin.includes(config.site_url))) {
            console.warn(`Blocked request from unauthorized origin: ${origin} (Expected: ${config.site_url})`);
            return withCORS(req, NextResponse.json({ error: "Unauthorized Domain" }, { status: 403 }));
        }

        // 2. Check limits
        console.log("Checking limits:", { count: config.requests_count, limit: config.requests_limit });
        if ((config.requests_count || 0) >= (config.requests_limit || 0)) {
            console.warn("Limit Reached");
            return withCORS(req, NextResponse.json({ error: "Request limit reached" }, { status: 402 }));
        }

        const gptApiKey = process.env.GPT_API_KEY;
        if (!gptApiKey) {
            console.warn("Using Mock Response (No GPT_API_KEY)");
            return withCORS(req, NextResponse.json({
                success: true,
                imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
                analysis: "Simulated analysis: Fit looks perfect."
            }));
        }

        const openai = new OpenAI({ apiKey: gptApiKey });

        // Prepare user image as File for the API
        console.log("Preparing User Image...");
        const userImageBuffer = Buffer.from(await userImage.arrayBuffer());
        const userImageFile = await toFile(userImageBuffer, userImage.name || "user.png", {
            type: userImage.type || "image/png",
        });

        // Fetch product image and convert to File
        console.log("Fetching Product Image...");
        const imageFiles = [userImageFile];
        try {
            const productRes = await fetch(productImage);
            if (productRes.ok) {
                const productBuffer = Buffer.from(await productRes.arrayBuffer());
                const contentType = productRes.headers.get("content-type") || "image/jpeg";
                const ext = contentType.includes("png") ? "png" : "jpg";
                const productImageFile = await toFile(productBuffer, `product.${ext}`, {
                    type: contentType,
                });
                imageFiles.push(productImageFile);
                console.log("Product Image fetched successfully", { type: contentType, size: productBuffer.byteLength });
            } else {
                console.warn(`Failed to fetch product image: ${productRes.status} ${productRes.statusText}`);
            }
        } catch (e) {
            console.error("Error fetching product image:", e);
        }

        // Build prompt
        let prompt = MODERATE_PROMPT[0];
        if (mode === 'angles') {
            prompt += " Generate a collage showing the person from front, side, and back views.";
        }
        console.log("Final Prompt:", prompt);

        console.log("Calling OpenAI Images API (gpt-image-1)...");
        const startTime = Date.now();

        const response = await openai.images.edit({
            model: "gpt-image-1",
            image: imageFiles,
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            quality: "high",
        });

        console.log(`OpenAI API Response Received in ${Date.now() - startTime}ms`);

        // Extract generated image
        let resultImageUrl: string | null = null;

        if (response.data && response.data.length > 0) {
            const imageData = response.data[0];
            if (imageData.b64_json) {
                resultImageUrl = `data:image/png;base64,${imageData.b64_json}`;
                console.log("Image generated successfully (base64)");
            } else if (imageData.url) {
                resultImageUrl = imageData.url;
                console.log("Image generated successfully (url)");
            }
        }

        // Fail if no image was generated
        if (!resultImageUrl) {
            console.warn("No result image generated by GPT.");
            return withCORS(req, NextResponse.json({
                success: false,
                error: "Não foi possível processar essa combinação de imagens no momento."
            }, { status: 422 }));
        }

        console.log("--- VTON Generation (GPT) Completed Successfully ---");
        return withCORS(req, NextResponse.json({
            success: true,
            imageUrl: resultImageUrl,
            analysis: ""
        }));

    } catch (error: any) {
        console.error("--- VTON Generation (GPT) ERROR ---");
        console.error("Error Details:", {
            message: error.message,
            status: error.status,
            stack: error.stack
        });

        if (error.status === 429 || error.message?.includes('429')) {
            console.warn("Quota limit reached (429)");
            return withCORS(req, NextResponse.json({
                success: true,
                imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
                analysis: "O limite de uso diário foi atingido. Mostrando o produto original como referência."
            }));
        }

        return withCORS(req, NextResponse.json(
            { error: "Failed to process try-on" },
            { status: 500 }
        ));
    }
}
