// routes/rag.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { ingestFile, retrieveContext } from "../utils/vectorStore.js";
import { askGemini } from "../utils/ai.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Upload + Ingest
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();

    // Check file type
    if (!['.pdf', '.txt', '.docx'].includes(ext)) {
      return res.status(400).json({ error: "Only PDF, TXT, and DOCX files are supported" });
    }

    await ingestFile(filePath, ext);
    res.json({ success: true, message: "File uploaded and processed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "File processing failed: " + err.message });
  }
});

// RAG Chat
router.post("/chat", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question required" });

    const context = await retrieveContext(question);
    
    const prompt = `You are a helpful AI assistant that answers questions based on the provided document context. 

IMPORTANT INSTRUCTIONS:
- Only use the information provided in the context below to answer the question
- If the context doesn't contain enough information to answer the question, say so clearly
- Be concise but thorough in your responses
- If you're unsure about something, acknowledge the limitation
- Always cite which parts of the document you're referencing when possible

CONTEXT FROM DOCUMENT:
${context}

USER QUESTION: ${question}

Please provide a helpful answer based on the context above:`;

    const answer = await askGemini(prompt);
   let aiResponse = answer.replace(/Chunk \d+;?/gi, "");

// Remove file hash IDs (optional)
aiResponse = aiResponse.replace(/[a-f0-9]{32}/gi, "");
    res.json({ answer: aiResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat failed: " + err.message });
  }
});

export default router;
