
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const RESTORATION_PROMPT = `
Act as a world-class digital photo restoration expert and AI artist. Your task is to transform this old image into a modern, vibrant, and high-quality photograph.

CRITICAL INSTRUCTIONS:
1. PRESERVE IDENTITY (MAX PRIORITY): Do NOT alter facial features, eye shape, nose structure, or expressions. The person must remain perfectly recognizable. Clean and enhance, do not remodel. Maintain natural skin texture.
2. DAMAGE REMOVAL: Digitally remove all scratches, folds, dust, mold, and stains. Fix discoloration and yellowish tints.
3. REALISTIC COLORIZATION: Apply natural, authentic colors. Skin tones, clothing, and environment must look modern and believable. Avoid oversaturation or "flat" colors.
4. MODERN ENHANCEMENT: Improve contrast, brightness, and sharpness. Reduce noise and grain while keeping fine detail.
5. COMPOSITION: Straighten the image if tilted and crop slightly if it improves the focus on the subject.

Output ONLY the restored image.
`;

export async function restorePhoto(base64Image: string): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image.split(',')[1] || base64Image,
    },
  };

  const textPart = {
    text: RESTORATION_PROMPT
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [imagePart, textPart] },
    });

    let restoredBase64 = '';
    
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          restoredBase64 = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!restoredBase64) {
      throw new Error("No image was returned by the AI.");
    }

    return restoredBase64;
  } catch (error) {
    console.error("Restoration failed:", error);
    throw error;
  }
}
