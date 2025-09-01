import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("⚠️ GEMINI_API_KEY missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use Gemini 2.5 Flash (latest + fastest)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Generate AI response from a given prompt
 * @param {string} prompt
 * @returns {Promise<string>} AI response
 */
export async function askGemini(prompt) {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("AI Error:", err);
    throw new Error("AI request failed");
  }
}
