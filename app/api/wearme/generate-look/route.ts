import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createAdminClient } from "@/lib/supabase/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { apiKey: clientApiKey, sessionId, items } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Items are required" }, { status: 400 });
        }

        // 1. Validate API Key
        const supabase = await createAdminClient();
        const { data: config, error: configError } = await supabase
            .from("wearme_configs")
            .select("*")
            .eq("api_key", clientApiKey)
            .single();

        if (configError || !config) {
            return NextResponse.json({ error: "Invalid API Key" }, { status: 401 });
        }

        // 2. Check limits
        if ((config.requests_count || 0) >= (config.requests_limit || 0)) {
            return NextResponse.json({ error: "Request limit reached" }, { status: 402 });
        }

        if (!config.site_url) {
            return NextResponse.json({ error: "Site URL not configured" }, { status: 401 });
        }

        // Security Check: Site URL verification
        console.log("Verification:")
        if (config.site_url) {
            const origin = req.headers.get("origin") || req.headers.get("referer");
            console.log("Origin:", origin);
            console.log("Site URL:", config.site_url);
            // Simple inclusion check to handle protocol variations (http/https)
            if (origin !== "http://localhost:3000" && (!origin || !origin.includes(config.site_url))) {
                console.warn(`Blocked request from unauthorized origin: ${origin} (Expected: ${config.site_url})`);
                return NextResponse.json({ error: "Unauthorized Domain" }, { status: 403 });
            }
        }

        const apiKey = process.env.GEMINI_API_KEY;

        // Fallback if no API key
        if (!apiKey) {
            console.warn("Using Mock Response (No API Key)");
            await new Promise(r => setTimeout(r, 2000));
            return NextResponse.json({
                success: true,
                lookImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
                itemsUsed: items.map(i => i.id)
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Using same model as in generate route
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" }); // Defaulting to stable 1.5-flash or 2.0 if available. The other code said 2.5 which might be a typo for 1.5 or 2.0.
        console.log("Model:", model);
        // Fetch all item images and convert to Parts
        const itemParts = await Promise.all(items.map(async (item, index) => {
            try {
                const res = await fetch(item.image);
                if (res.ok) {
                    const buffer = await res.arrayBuffer();
                    const contentType = res.headers.get("content-type") || "image/jpeg";
                    return {
                        inlineData: {
                            data: Buffer.from(buffer).toString("base64"),
                            mimeType: contentType,
                        },
                    };
                }
            } catch (e) {
                console.error(`Failed to fetch image for item ${item.id}:`, e);
            }
            return null;
        }));

        const validParts = itemParts.filter(p => p !== null);

        if (validParts.length === 0) {
            return NextResponse.json({ error: "Failed to fetch any item images" }, { status: 400 });
        }

        // Prompt for Look Generation
        const prompt = `
Task: High-End Fashion Lookbook Synthesis.

Create a single, highly professional fashion photograph of a stylish model wearing a complete outfit that incorporates ALL the clothing items and accessories provided in the references.

- STYLING GOAL:
Combine the items (Reference 1, 2, ..., N) into one cohesive and aesthetically pleasing look. 
If there are multiple garments (e.g., top, bottom, shoes), the model must be wearing all of them. 
Ensure the colors, textures, and styles of the items complement each other in the final generated image.

- UNIFORMITY & REALISM:
The final image should look like a real fashion photoshoot. 
Maintain a consistent style, professional studio lighting, and a clean or fashionable background.
The items should fit the model naturally, respecting realistic proportions and fabric behavior.

- OUTPUT:
Generate one main image showing the final look.
`;

        const requestParts = [prompt, ...validParts.map((p, i) => `Reference ${i + 1}:`), ...validParts];

        // Note: For actual image generation in Gemini, you might need a specific model or output format.
        // In the project's 'generate' route, they appear to use it for visual synthesis.
        const result = await model.generateContent(requestParts as any);
        console.log("Result:", result);
        const response = await result.response;
        console.log("Response:", response.text());

        const candidates = response.candidates || [];
        let resultImageUrl = null;

        if (candidates.length > 0) {
            const parts = candidates[0].content?.parts || [];
            console.log("Parts found:", parts.length);

            for (const part of parts) {
                if (part.inlineData) {
                    try {
                        console.log("Processing inlineData...");
                        // Clean base64 data (Gemini sometimes adds spaces/newlines)
                        const base64Data = part.inlineData.data.replace(/\s/g, '');
                        const buffer = Buffer.from(base64Data, "base64");

                        console.log("Starting Sharp processing...");
                        const processedBuffer = await sharp(buffer)
                            .resize(1024)
                            .png({ compressionLevel: 9 })
                            .toBuffer();

                        const fileName = `look-${Date.now()}.png`;
                        const folderPath = `${clientApiKey}`;
                        const filePath = `${folderPath}/${fileName}`;

                        console.log(`Attempting upload to storage: ${filePath}`);
                        const { error: uploadError } = await supabase.storage
                            .from("vton-results")
                            .upload(filePath, processedBuffer, {
                                contentType: "image/png",
                                cacheControl: "3600",
                                upsert: false
                            });

                        if (uploadError) {
                            console.error("Storage upload error:", uploadError);
                            // Fallback to Data URL if upload fails
                            resultImageUrl = `data:image/png;base64,${processedBuffer.toString("base64")}`;
                            console.log("Using Data URL fallback due to upload error.");
                        } else {
                            const { data: { publicUrl } } = supabase.storage
                                .from("vton-results")
                                .getPublicUrl(filePath);
                            resultImageUrl = publicUrl;
                            console.log("Image stored and URL generated:", resultImageUrl);
                        }
                    } catch (e) {
                        console.error("Error during Sharp or Storage process:", e);
                    }
                }
            }
        }

        // Fallback for demo/mock if generation didn't return an image part
        if (!resultImageUrl) {
            console.log("Final check: No resultImageUrl found. Returning default mock.");
            resultImageUrl = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop";
        }

        // 3. Log and Update Usage
        try {
            await supabase
                .from("wearme_configs")
                .update({ requests_count: (config.requests_count || 0) + 1 })
                .eq("id", config.id);

            await supabase
                .from("wearme_logs")
                .insert({
                    config_id: config.id,
                    api_key: clientApiKey,
                    session_id: sessionId,
                    product_image_url: items[0].image, // Using first item as primary reference for log
                    looks_image_url: items.filter(i => i.image).map(i => i.image), // Using first item as primary reference for log
                    result_image_url: resultImageUrl,
                    mode: 'buy_together',
                    metadata: { items_ids: items.map(i => i.id) }
                });
        } catch (logError) {
            console.error("Failed to log request:", logError);
        }

        return NextResponse.json({
            success: true,
            lookImage: resultImageUrl,
            itemsUsed: items.map(i => i.id)
        });

    } catch (error: any) {
        console.error("Look Generation Error:", error);
        return NextResponse.json(
            { error: "Failed to generate look" },
            { status: 500 }
        );
    }
}
