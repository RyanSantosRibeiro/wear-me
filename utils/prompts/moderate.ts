export const MODERATE_PROMPT = `
Generate a photorealistic virtual fitting room result.

INPUTS:
Image 1 = CLOTHING REFERENCE (outfit only)
Image 2 = PERSON INPUT (identity only, not final result)

CRITICAL RULES:

IDENTITY:
Use ONLY the person from Image 2.
Preserve face, skin tone and hair from Image 2.
Body shape may be adapted to match the target pose.

IMPORTANT:
Image 2 is NOT a composition reference.
Ignore body pose, clothing, camera angle and framing from Image 2.

CLOTHING:
Replace the clothing completely.
Apply ONLY the yellow outfit from Image 1.
Exact same hoodie, joggers and shoes.
No variation.

POSE & COMPOSITION:
Neutral catalog pose.
Standing upright, arms relaxed at sides.
Body and face facing forward.

BACKGROUND & LIGHT:
Pure white background (#ffffff).
Soft, even studio lighting.

PRIORITY ORDER (ALWAYS):
1. Identity (face + skin + hair) from Image 2
2. Clothing from Image 1
3. Pose and background from this prompt
`



// export const MODERATE_PROMPT = `
// TASK:
// Replace the person in Reference 2 with the person from Reference 1.

// PRIMARY OBJECTIVE:
// - The fashion item shown in Reference 2 must remain unchanged.

// NON-NEGOTIABLE CONSTRAINTS:
// - Do NOT change the fashion item’s design, color, texture, or proportions.
// - Do NOT alter the product’s shape or scale.
// - Do NOT invent new garments or accessories.
// - Keep the product’s position relative to the body consistent with Reference 2.

// PERSON HANDLING:
// - Use the facial features and body structure from Reference 1.
// - Adapt the person naturally to the pose required by the product.

// ITEM TYPE RULES:
// - If Reference 2 is a garment, dress the person wearing the same garment.
// - If Reference 2 is an accessory, place the same accessory in the same body location.

// COMPOSITION:
// - Keep framing and camera angle consistent with Reference 2.
// - Use a neutral background.
// - Use simple studio lighting.

// FORBIDDEN:
// - No background changes that distract from the product.
// - No artistic reinterpretation.
// - No stylization.

// OUTPUT:
// - Generate a single realistic product image.

// `;