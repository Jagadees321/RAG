// routes/askrag.js
import express from "express";
import { askGeminiRag } from "../utils/ai_rag.js";

const router = express.Router();

router.post("/ask-rag", async (req, res) => {
  try {
    const { prompt, k } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const { answer, sources } = await askGeminiRag(prompt, { k: k ?? 4 });

    // Optional: strip markdown asterisks like your non-RAG route
    const clean = answer.replace(/\*\*/g, "").replace(/\*/g, "").trim();

    res.json({ answer: clean, sources });
  } catch (e) {
    console.error("RAG ask error:", e);
    res.status(500).json({ error: "RAG request failed" });
  }
});

export default router;
