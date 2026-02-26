export const MODERATE_PROMPT = [
    // [0] VTON MODEL SWAP (Default)
    // Mantém a roupa e o cenário da Referência 2, trocando apenas o modelo pelo usuário (Referência 1).
    `Task: Virtual Try-On - Model Swap.
OBJECTIVE: Replace the model in Reference 2 with the person from Reference 1.
1. SCENE & CLOTHING: Maintain the EXACT background, scenery, lighting, and clothing from Reference 2. Do not change the outfit, fabric, or environment.
2. IDENTITY SWAP: Transplant the unique identity, facial features, skin tone, and physical essence of the person in Reference 1 onto the subject in Reference 2.
3. ANATOMY: The new subject must naturally match the pose and body proportions of the original model in Reference 2.
4. RESULT: A photorealistic fashion image where the person from Reference 1 appears to be the one naturally wearing the clothes in the original location of Reference 2.`,

    // [1] TECHNICAL VTON PROTOCOL (High Precision)
    // Focado em consistência técnica. Evita interpretações artísticas da IA.
    `PROTOCOL: Virtual Fitting Room.
Input 1 (Person): Source of identity, facial geometry, and skin tone.
Input 2 (Fashion Item): Source of the exact garment/accessory, texture, and pose.
CRITICAL INSTRUCTIONS:
1. Preserve 100% of the clothing's details from Input 2 (patterns, buttons, folds).
2. Transplant the face and physical essence of Input 1 onto the model in Input 2.
3. Maintain the original camera angle and lighting of Input 2.
4. Output must be photorealistic with no artifacts at the neck or limb transitions.`,

    // [2] STUDIO CATALOG STYLE (Minimalist/Clean)
    // Focado em e-commerce clássico. Fundo limpo e foco total no produto.
    `Task: High-End E-commerce Catalog Generation.
- TARGET: Generate a clean studio shot of the person in Reference 1 wearing the product in Reference 2.
- LIGHTING: Soft studio lighting, neutral background.
- PRODUCT PRESERVATION: The garment from Reference 2 must remain identical. Do not add or remove elements.
- IDENTITY: The face must be clearly recognizable as the person from Reference 1.
- RESULT: A professional, clear, and focused fashion image suitable for a website gallery.`,

    // [3] IDENTITY-FIRST HYPERREALISM (Face/Body Swap Focus)
    // Focado em fazer o usuário se reconhecer. Detalhes de pele e traços faciais.
    `Task: Hyper-Realistic Virtual Try-on.
Focus heavily on the anatomical alignment between Reference 1 (the user) and Reference 2 (the outfit).
1. IDENTITY LANDMARKS: Replicate the eye shape, nose structure, smile, and jawline of Ref 1.
2. TEXTURE ALIGNMENT: Match skin texture and lighting between the head (Ref 1) and the body (Ref 2).
3. GARMENT INTEGRATION: Reference 2 is the ONLY source for the clothing. It must look naturally worn by the person from Ref 1.
4. QUALITY: 8k resolution, cinematic fashion photography, sharp focus.`
];
