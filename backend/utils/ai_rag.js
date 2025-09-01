// utils/ai_rag.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { embedText } from "./embeddings.js";
import { topKByEmbedding } from "./vectorStore.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const genModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function askGeminiRag(query, { k = 4 } = {}) {
  // 1) Retrieve
  const qEmb = await embedText(query);
  const hits = topKByEmbedding(qEmb, k);

  // 2) Build grounded prompt
  const contextBlocks = hits.map((h, idx) =>
    `Source ${idx + 1} (id=${h.id}):\n${h.text}`
  ).join("\n\n");

  const prompt = `
You are a helpful assistant. Use ONLY the provided sources to answer.
If the answer isn't in the sources, say "I couldn't find that in the provided knowledge."

### SOURCES
${contextBlocks || "(no sources found)"}

### QUESTION
${query}

### INSTRUCTIONS
- Be concise and factual.
- Cite sources inline like [S1], [S2] using the numbering above when you use them.
`;

  // 3) Generate
  const res = await genModel.generateContent(prompt);
  const text = res.response.text();

  // 4) Return answer + sources metadata for UI
  const sources = hits.map((h, i) => ({
    label: `S${i + 1}`,
    id: h.id,
    score: Number(h.score.toFixed(4)),
    metadata: h.metadata || {},
    snippet: h.text.slice(0, 300) + (h.text.length > 300 ? "..." : ""),
  }));

  return { answer: text, sources };
}
