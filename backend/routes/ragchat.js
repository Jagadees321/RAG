// routes/ragchat.js
import express from "express";
import { ingestFixedPDF, retrieveContext, updatePDFContent, getPDFContent } from "../utils/fixedPDFStore.js";
import { askGemini } from "../utils/ai.js";

const router = express.Router();

// Initialize fixed PDF content
router.post("/init", async (req, res) => {
  try {
    await ingestFixedPDF();
    res.json({ success: true, message: "Fixed PDF initialized successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to initialize PDF: " + err.message });
  }
});

// Get current PDF content
router.get("/content", async (req, res) => {
  try {
    const content = await getPDFContent();
    res.json({ success: true, content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get PDF content: " + err.message });
  }
});

// Update PDF content
router.post("/update", async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required" });

    await updatePDFContent(content);
    res.json({ success: true, message: "PDF content updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update PDF content: " + err.message });
  }
});

// RAG Chat with fixed PDF
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
- Provide page numbers or section references if available

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
