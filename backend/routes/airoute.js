import express from "express";
import { askGemini } from "../utils/ai.js";

const router = express.Router();

// POST /api/ai
router.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const answer = await askGemini(prompt);
    answer = answer
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .trim();
    res.json({ answer });
  } catch (err) {
    console.error("AI Route Error:", err);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

export default router;
