// utils/embeddings.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Works with Gemini’s current embeddings model.
// If this ever changes, swap the model name here.
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

export async function embedText(text) {
  const res = await embeddingModel.embedContent(text);
  // API returns { embedding: { values: number[] } }
  return res.embedding.values;
}
