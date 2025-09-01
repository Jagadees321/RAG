// utils/vectorStore.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";
import * as path from "path";
import pdf from "pdf-parse";
import { chunkText } from "./chunker.js";

let store = []; // In-memory vector store

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

export async function initStore() {
  store = []; // reset on server restart
  console.log("🗄️ Vector store initialized");
}

// Generate embeddings
async function embedText(text) {
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
}

// Extract text from different file types
async function extractText(filePath, fileType) {
  try {
    switch (fileType) {
      case '.pdf':
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdf(dataBuffer);
        return pdfData.text;
      
      case '.txt':
        return fs.readFileSync(filePath, "utf8");
      
      case '.docx':
        // For now, return a placeholder - you'd need docx-parser package
        throw new Error("DOCX support coming soon. Please use PDF or TXT files.");
      
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error(`Error extracting text from ${filePath}:`, error);
    throw error;
  }
}

// Save a file's text to store with chunking
export async function ingestFile(filePath, fileType) {
  try {
    const rawText = await extractText(filePath, fileType);
    
    if (!rawText || rawText.trim().length === 0) {
      throw new Error("No text content found in the file");
    }

    // Clean and chunk the text
    const cleanText = rawText.replace(/\s+/g, " ").trim();
    const chunks = chunkText(cleanText, 800, 150);
    
    console.log(`📄 Extracted ${cleanText.length} characters, created ${chunks.length} chunks`);

    // Process each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await embedText(chunk);
      
      store.push({
        id: `${path.basename(filePath)}_chunk_${i}`,
        text: chunk,
        embedding,
        source: path.basename(filePath),
        chunkIndex: i
      });
    }

    console.log(`✅ Successfully ingested ${path.basename(filePath)} with ${chunks.length} chunks`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to ingest ${filePath}:`, error);
    throw error;
  }
}

// Search nearest text
export function search(queryEmbedding, topK = 5) {
  function cosineSim(a, b) {
    const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
    const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
    return dot / (magA * magB);
  }

  return store
    .map((doc) => ({
      ...doc,
      score: cosineSim(queryEmbedding, doc.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

export async function retrieveContext(query) {
  const queryEmbedding = await embedText(query);
  const results = search(queryEmbedding, 5); // Increased to 5 chunks for better context
  
  if (results.length === 0) {
    return "No relevant context found. Please make sure you have uploaded a document.";
  }
  
  // Format context with source information
  const contextParts = results.map((r, index) => {
    return `[Source: ${r.source}, Chunk ${r.chunkIndex + 1}]\n${r.text}`;
  });
  
  return contextParts.join("\n\n");
}
