import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createAdminClient } from "@/lib/supabase/server";
import { MODERATE_PROMPT } from "@/utils/prompts/moderate";

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
    console.log("--- VTON Generation Started ---");
    try {
        const formData = await req.formData();
        const productImage = formData.get("productImage") as string;
        const userImageRaw = formData.get("userImage");
        const userImage = (userImageRaw instanceof File && userImageRaw.size > 0) ? userImageRaw : null;
        const mode = formData.get("mode") as string;
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
        if (origin !== "http://localhost:3000" && (!origin || !origin.includes(config.site_url))) {
            console.warn(`Blocked request from unauthorized origin: ${origin} (Expected: ${config.site_url})`);
            return withCORS(req, NextResponse.json({ error: "Unauthorized Domain" }, { status: 403 }));
        }

        // 2. Generation (Check limits)
        console.log("Checking limits:", { count: config.requests_count, limit: config.requests_limit });
        if ((config.requests_count || 0) >= (config.requests_limit || 0)) {
            console.warn("Limit Reached");
            return withCORS(req, NextResponse.json({ error: "Request limit reached" }, { status: 402 }));
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("Using Mock Response (No GEMINI_API_KEY)");
            return withCORS(req, NextResponse.json({
                success: true,
                imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
                analysis: "Simulated analysis: Fit looks perfect."
            }));
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const modelName = "gemini-3-pro-image-preview";
        console.log(`Using model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });

        console.log("Preparing User Image Part...");
        const userImageBuffer = await userImage.arrayBuffer();
        const userImagePart = {
            inlineData: {
                data: Buffer.from(userImageBuffer).toString("base64"),
                mimeType: userImage.type,
            },
        };

        console.log("Fetching Product Image Part...");
        let productImagePart = null;
        try {
            const productRes = await fetch(productImage);
            if (productRes.ok) {
                const productBuffer = await productRes.arrayBuffer();
                const contentType = productRes.headers.get("content-type") || "image/jpeg";
                productImagePart = {
                    inlineData: {
                        data: Buffer.from(productBuffer).toString("base64"),
                        mimeType: contentType,
                    },
                };
                console.log("Product Image fetched successfully", { type: contentType, size: productBuffer.byteLength });
            } else {
                console.warn(`Failed to fetch product image: ${productRes.status} ${productRes.statusText}`);
            }
        } catch (e) {
            console.error("Error fetching product image:", e);
        }

        let prompt = MODERATE_PROMPT[0];
        if (mode === 'angles') {
            prompt += " Generate a collage showing the person from front, side, and back views.";
        }
        console.log("Final Prompt:", prompt);

        const requestParts: any[] = [
            prompt,
            "Reference 1 (Person):",
            userImagePart,
            "Reference 2 (Product):",
            productImagePart
        ].filter(v => v !== null);

        console.log("Calling Gemini API...");
        const startTime = Date.now();
        const result = await model.generateContent(requestParts);
        const response = await result.response;
        console.log(`Gemini API Response Received in ${Date.now() - startTime}ms`);

        const candidates = response.candidates || [];
        console.log(`Candidates: ${candidates.length}`);

        if (candidates.length > 0) {
            console.log("Candidate 0 Status:", {
                finishReason: candidates[0].finishReason,
                safetyRatings: candidates[0].safetyRatings
            });
        }

        if (response.promptFeedback) {
            console.log("Prompt Feedback:", response.promptFeedback);
        }

        let resultImageUrl = null;
        let analysisText = "";

        if (candidates.length > 0) {
            const parts = candidates[0].content?.parts || [];
            console.log(`Parts in candidate 0: ${parts.length}`);
            for (const part of parts) {
                if (part.inlineData) {
                    console.log("Image found in part. Content length:", part.inlineData.data.length);
                    resultImageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
                } else if (part.text) {
                    console.log("Text found in part:", part.text.substring(0, 100) + "...");
                    analysisText += part.text;
                }
            }
        }

        // Fail if no image was generated
        if (!resultImageUrl) {
            console.warn("No result image generated by Gemini.");
            const blockReason = response.promptFeedback?.blockReason;
            const finishReason = candidates.length > 0 ? candidates[0].finishReason : null;

            let errorMessage = "Não foi possível processar essa combinação de imagens no momento.";
            if (blockReason) {
                errorMessage = `Restrição de conteúdo detectada (${blockReason}).`;
            } else if (finishReason && finishReason !== "STOP") {
                errorMessage = `A geração foi interrompida (${finishReason}).`;
            }

            return withCORS(req, NextResponse.json({
                success: false,
                error: errorMessage
            }, { status: 422 })); // Unprocessable Entity
        }

        console.log("--- VTON Generation Completed Successfully ---");
        return withCORS(req, NextResponse.json({
            success: true,
            imageUrl: resultImageUrl,
            analysis: analysisText
        }));

    } catch (error: any) {
        console.error("--- VTON Generation ERROR ---");
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


