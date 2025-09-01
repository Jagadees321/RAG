import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { askGemini } from "./utils/ai.js";
import airoute from "./routes/airoute.js";
import { initStore } from "./utils/vectorStore.js";
import ragRoute from "./routes/rag.js";
import ragchatRoute from "./routes/ragchat.js";

dotenv.config();

async function startServer() {
  const app = express();
  
  // Initialize vector store
  await initStore();
  
  app.use(cors());
  app.use(express.json());

  // Root
  app.get("/", (req, res) => {
    res.send("🚀 Backend running successfully!");
  });

  // AI route
  app.post("/ask", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) return res.status(400).json({ error: "Prompt is required" });

      let answer = await askGemini(prompt);
      answer = answer
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace("*", "")
        .replace("**", "")
        .replace("***", " ")
        .trim();
      res.json({ answer });
    } catch (err) {
      res.status(500).json({ error: "AI request failed" });
    }
  });
  
  app.use("/api", airoute);
  app.use("/api/rag", ragRoute);
  app.use("/api/ragchat", ragchatRoute);
  
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`✅ Server listening on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
