export const MODERATE_PROMPT = [
    // [0] VTON MODEL SWAP (Default)
    // Mantém a roupa e cena da Referência 2, mas respeita 100% o corpo do usuário (Referência 1).
    `Task: Virtual Try-On.
OBJECTIVE: Dress the person from Reference 1 in the clothing from Reference 2.
1. SCENE & CLOTHING: Maintain the background and clothing from Reference 2. If Reference 2 ONLY contains the product (no model/ghost mannequin/flat lay), DO NOT use the original background; instead, generate a new clean studio-style image of the user in Reference 1 wearing the item.
2. IDENTITY & BODY PRESERVATION: Preserve the exact identity, facial features, body shape, and size of the user in Reference 1.
3. ANATOMY & FIT: The clothing MUST adapt, stretch, and reshape to naturally fit the specific body type of Reference 1 (e.g., if the user is plus-size, the garment must adjust to their body). DO NOT force the user to fit the original model's shape from Reference 2.
4. RESULT: A photorealistic fashion image where the person from Reference 1 naturally wears the clothes while maintaining their true physical body contours.`,

    // [1] TECHNICAL VTON PROTOCOL (High Precision)
    // Focado na adaptação técnica da roupa ao corpo real do usuário.
    `PROTOCOL: Virtual Fitting Room.
Input 1 (Person): Source of identity, facial geometry, body shape, and skin tone.
Input 2 (Fashion Item): Source of the exact garment/accessory, texture, and scene.
CRITICAL INSTRUCTIONS:
1. Preserve 100% of the clothing's details from Input 2 (patterns, buttons, folds).
2. If Input 2 is just the garment without a model, generate a brand new studio-style photograph of Input 1 wearing the garment.
3. STRICT ANATOMY RULE: Maintain the exact body dimensions, weight, and shape of Input 1. The garment MUST scale and drape to fit Input 1's true body. Do not morph Input 1 to fit the model's body in Input 2.
4. Output must be photorealistic with no artifacts at the neck or limb transitions.`,

    // [2] STUDIO CATALOG STYLE (Minimalist/Clean)
    // Focado em catálogo clássico com total respeito à anatomia do usuário.
    `Task: High-End E-commerce Catalog Generation.
- TARGET: Generate a clean studio shot of the person in Reference 1 wearing the product in Reference 2.
- GHOST MANNEQUIN/FLATLAY: If Reference 2 has no model, completely ignore its background and generate a new soft studio-style image of Reference 1 wearing the product.
- BODY TYPE ADAPTATION: The identity, body shape, and size of Reference 1 MUST be strictly preserved. The clothing must physically adapt to fit their exact body type seamlessly.
- PRODUCT PRESERVATION: The garment from Reference 2 must remain identical in texture and pattern.
- LIGHTING: Soft studio lighting, neutral background.
- RESULT: A professional fashion image suitable for a website gallery.`,

    // [3] IDENTITY-FIRST HYPERREALISM (Face/Body Swap Focus)
    // Focado em manter a fidelidade perfeita ao rosto e formato corporal do usuário.
    `Task: Hyper-Realistic Virtual Try-on.
Focus heavily on the anatomical preservation of Reference 1 (the user) while applying the outfit from Reference 2.
1. IDENTITY & BODY: Replicate the facial features, exact body shape, and size of Ref 1 precisely.
2. GARMENT INTEGRATION: Reference 2 is the ONLY source for the clothing. If Reference 2 has no model, generate a completely new high-end studio scenario featuring Ref 1 wearing the item.
3. FIT & DRAPE: The outfit MUST stretch, drape, or reshape to naturally fit Ref 1's real body shape. Do not restrict Ref 1 to the body dimensions of any model in Ref 2.
4. QUALITY: 8k resolution, cinematic fashion photography, sharp focus.`
];
