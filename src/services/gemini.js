import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const parseInventoryInput = async (text) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
      Extract inventory item details from the following text. 
      Return ONLY a JSON object with these fields: 
      - name (string)
      - category (string, try to match one of: ATK, Pantry, Elektronik, Aset, Lainnya. Default to Lainnya if unsure)
      - quantity (number. IMPORTANT: Make this NEGATIVE if the text implies removing, taking, or using items. Example: "ambil 5" -> -5, "barang keluar 2" -> -2)
      - unit (string, e.g., Pcs, Rim, Unit, Box)
      - minStock (number, default to 5 if not specified)
      
      Text: "${text}"
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        // Clean up markdown code blocks if present
        const jsonStr = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error parsing with Gemini:", error);
        throw error;
    }
};
