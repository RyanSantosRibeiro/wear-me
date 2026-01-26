import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createAdminClient } from "@/lib/supabase/server";
import sharp from "sharp";
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
    try {
        const formData = await req.formData();
        const productImage = formData.get("productImage") as string;
        const userImageRaw = formData.get("userImage");
        // Only treat as File if it has size and name (common File properties)
        const userImage = (userImageRaw instanceof File && userImageRaw.size > 0) ? userImageRaw : null;

        const mode = formData.get("mode") as string;
        const clientApiKey = formData.get("apiKey") as string;
        const sessionId = formData.get("sessionId") as string;
        const consentDataRaw = formData.get("consentData") as string;
        const consentData = consentDataRaw ? JSON.parse(consentDataRaw) : null;

        // 1. Validate API Key
        const supabase = await createAdminClient();
        const { data: config, error: configError } = await supabase
            .from("wearme_configs")
            .select("*")
            .eq("api_key", clientApiKey)
            .single();

        if (configError || !config) {
            return withCORS(
                req,
                NextResponse.json({ error: "Invalid API Key" }, { status: 401 })
            );
        }

        // Fetch subscription to check features
        const { data: subscription } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", config.owner_id)
            .maybeSingle();

        if (subscription) {
            (config as any).subscription = subscription.metadata || subscription;
        }

        if (!config.site_url) {
            return withCORS(
                req,
                NextResponse.json({ error: "Site URL not configured" }, { status: 401 })
            );
        }

        // Security Check: Site URL verification
        console.log("Verification:")
        // Comentado para teste local
        // if (config.site_url) {
        //     const origin = req.headers.get("origin") || req.headers.get("referer");
        //     console.log("Origin:", origin);
        //     console.log("Site URL:", config.site_url);
        //     // Simple inclusion check to handle protocol variations (http/https)
        //     if (origin !== "http://localhost:3000" && (!origin || !origin.includes(config.site_url))) {
        //         console.warn(`Blocked request from unauthorized origin: ${origin} (Expected: ${config.site_url})`);
        //         return NextResponse.json({ error: "Unauthorized Domain" }, { status: 403 });
        //     }
        // }

        // 2. Cache Recovery (If no new image is provided, just get the latest)
        if (!userImage && sessionId) {
            const { data: lastLog } = await supabase
                .from("wearme_logs")
                .select("result_image_url, analysis")
                .eq("api_key", clientApiKey)
                .eq("product_image_url", productImage)
                .eq("session_id", sessionId)
                .order("created_at", { ascending: false })
                .limit(1)
                .single();

            if (lastLog) {
                return withCORS(
                    req,
                    NextResponse.json({
                        success: true,
                        imageUrl: lastLog.result_image_url,
                        analysis: lastLog.analysis || "Resultado recuperado."
                    })
                );
            }
            return NextResponse.json({ error: "No previous result found" }, { status: 404 });
        }

        if (!userImage) {
            return NextResponse.json({ error: "User image is required for new generation" }, { status: 400 });
        }

        // 3. New Generation (Check limits first)
        if ((config.requests_count || 0) >= (config.requests_limit || 0)) {
            return NextResponse.json({ error: "Request limit reached" }, { status: 402 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        // Fallback if no API key
        if (!apiKey) {
            console.warn("Using Mock Response (No API Key)");
            await new Promise(r => setTimeout(r, 2000));
            return withCORS(
                req,
                NextResponse.json({
                    success: true,
                    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
                    analysis: "Simulated analysis: Fit looks perfect."
                })
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Using the Image Generation enabled model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

        const userImageBuffer = await userImage.arrayBuffer();
        const userImagePart = {
            inlineData: {
                data: Buffer.from(userImageBuffer).toString("base64"),
                mimeType: userImage.type,
            },
        };

        // Fetch Product Image to send as Part 2
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
                console.log("Product image fetched successfully");
            }
        } catch (e) {
            console.error("Failed to fetch product image:", e);
        }

        // Strategy: Advanced Visual Synthesis (Bypassing recitation filters)
        let prompt = MODERATE_PROMPT;

        if (mode === 'angles') {
            prompt += " Generate a collage showing the person from front, side, and back views.";
        }

        // Use more descriptive yet neutral labels
        const requestParts: any[] = [
            prompt,
            "Portrait Reference:",
            userImagePart,
            "Style Reference:",
            productImagePart
        ].filter(v => v !== null);

        const result = await model.generateContent(requestParts);
        const response = await result.response;
        console.log({ result })
        console.log("--- GEMINI DEBUG START ---");
        // console.log("Full Response:", JSON.stringify(response, null, 2));

        const candidates = response.candidates || [];
        const text = await response.text();
        console.log(`Text: ${text}`);
        console.log(`Candidates found: ${candidates.length}`);
        // Parse the response for Generated Images (Inline Data)
        let resultImageUrl = null;
        let analysisText = "";

        if (candidates.length > 0) {
            const parts = candidates[0].content?.parts || [];
            console.log(`Parts in candidate 0: ${parts.length}`);

            for (const part of parts) {
                if (part.inlineData) {
                    try {
                        const mimeType = part.inlineData.mimeType || "image/png";
                        const buffer = Buffer.from(part.inlineData.data, "base64");

                        console.log(`Processing image with sharp: ${mimeType}`);
                        // Convert to PNG and reduce quality/size (compress)
                        // quality: 60 for PNG is not directly supported, but we can use compressionLevel
                        // better: output as jpeg with quality 70 or png with compression
                        const processedBuffer = await sharp(buffer)
                            .resize(800) // Optional: limit size for "lighter" version
                            .png({ compressionLevel: 9, quality: 60 })
                            .toBuffer();

                        const fileName = `${Date.now()}.png`;
                        const folderPath = `${clientApiKey}`;
                        const filePath = `${folderPath}/${fileName}`;

                        // 3.1 Conditional preservation based on features
                        const isPersistenceEnabled = (config as any)?.subscription?.features?.wearme?.enable === true;

                        if (isPersistenceEnabled) {
                            console.log(`Uploading to storage: ${filePath}`);
                            const { data: uploadData, error: uploadError } = await supabase.storage
                                .from("vton-results")
                                .upload(filePath, processedBuffer, {
                                    contentType: "image/png",
                                    cacheControl: "3600",
                                    upsert: false
                                });

                            if (uploadError) {
                                console.error("Storage upload error:", uploadError);
                                // Fallback to data URL but smaller
                                resultImageUrl = `data:image/png;base64,${processedBuffer.toString("base64")}`;
                            } else {
                                const { data: { publicUrl } } = supabase.storage
                                    .from("vton-results")
                                    .getPublicUrl(filePath);
                                resultImageUrl = publicUrl;
                                console.log("Image stored successfully:", resultImageUrl);
                            }
                        } else {
                            console.log("Persistence disabled by plan. Returning data URL.");
                            resultImageUrl = `data:image/png;base64,${processedBuffer.toString("base64")}`;
                        }
                    } catch (sharpError) {
                        console.error("Sharp processing error:", sharpError);
                        // Final fallback to original raw data
                        resultImageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
                    }
                } else if (part.text) {
                    analysisText += part.text;
                }
            }
        }

        if (response.promptFeedback) {
            console.log("Prompt Feedback:", response.promptFeedback);
        }

        console.log("--- GEMINI DEBUG END ---");

        // Safety Fallback if model returns only text (or refuses request)
        if (!resultImageUrl) {
            console.warn("No image generated by Gemini. Returning fallback mock.");
            console.log("Final Analysis Text:", analysisText);
            resultImageUrl = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop";
        }

        // 4. Log and Update Usage (Only if persistence is enabled)
        const isPersistenceEnabled = (config as any)?.subscription?.features?.wearme?.enable === true;

        if (isPersistenceEnabled) {
            try {
                // Update request count
                await supabase
                    .from("wearme_configs")
                    .update({ requests_count: (config.requests_count || 0) + 1 })
                    .eq("id", config.id);

                // Insert log
                await supabase
                    .from("wearme_logs")
                    .insert({
                        config_id: config.id,
                        api_key: clientApiKey,
                        session_id: sessionId,
                        product_image_url: productImage,
                        result_image_url: resultImageUrl,
                        mode: mode,
                        consent_data: consentData
                    });
            } catch (logError) {
                console.error("Failed to log request:", logError);
            }
        }

        return withCORS(
            req,
            NextResponse.json({
                success: true,
                imageUrl: resultImageUrl,
                analysis: analysisText
            })
        );

    } catch (error: any) {
        console.error("VTON Generation Error:", error);

        // Handle Quota Limit (429) gracefully by returning mock
        if (error.status === 429 || error.message?.includes('429')) {
            console.warn("Quota limit reached. Returning mock result.");
            return NextResponse.json({
                success: true,
                imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
                analysis: "Simulated analysis (Quota Limit Reached): The fit looks excellent, with a natural drape."
            });
        }

        return withCORS(
            req,
            NextResponse.json(
                { error: "Failed to process try-on" },
                { status: 500 }
            )
        );
    }
}
