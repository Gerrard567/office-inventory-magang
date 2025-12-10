import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const parseInventoryInput = async (text) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
      Analyze the following text to extract inventory item details.
      
      If the text is conversational, random (e.g., "halo", "apa kabar"), or does not clearly describe an inventory item/transaction, return the JSON value: null.

      Otherwise, return a JSON ARRAY of objects (even if only one item) with these fields: 
      - name (string, required)
      - category (string, try to match one of: ATK, Pantry, Elektronik, Aset, Lainnya. Default to Lainnya if unsure)
      - quantity (number, required. IMPORTANT: Make this NEGATIVE if the text implies removing, taking, or using items. Example: "ambil 5" -> -5, "barang keluar 2" -> -2)
      - unit (string, e.g., Pcs, Rim, Unit, Box)
      - minStock (number, default to 5 if not specified)
      
      Text: "${text}"
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        // Clean up markdown code blocks if present
        const jsonStr = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedData = JSON.parse(jsonStr);

        if (parsedData === null) {
            throw new Error("Invalid input format");
        }

        if (!Array.isArray(parsedData) || parsedData.length === 0 || !parsedData[0].name) {
            throw new Error("Invalid input format");
        }

        return parsedData;
    } catch (error) {
        console.error("Error parsing with Gemini:", error);
        throw error;
    }
};
