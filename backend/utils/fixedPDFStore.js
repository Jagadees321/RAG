// utils/fixedPDFStore.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { chunkText } from "./chunker.js";
import fs from "fs";
import path from "path";

let store = []; // In-memory vector store for fixed PDF
let currentContent = ""; // Current PDF content
const FIXED_DOC_PATH = "./data/sample_document.txt"; // Path to your fixed document

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

// Initialize with fixed document content
export async function ingestFixedPDF() {
  try {
    // Check if fixed document exists, if not create a sample one
    if (!fs.existsSync(FIXED_DOC_PATH)) {
      await createSampleDocument();
    }

    // Read the fixed document content
    currentContent = fs.readFileSync(FIXED_DOC_PATH, "utf8");
    
    if (!currentContent || currentContent.trim().length === 0) {
      throw new Error("No text content found in the fixed document");
    }

    // Clear existing store
    store = [];

    // Clean and chunk the text
    const cleanText = currentContent.replace(/\s+/g, " ").trim();
    const chunks = chunkText(cleanText, 800, 150);
    
    console.log(`📄 Fixed Document: ${cleanText.length} characters, created ${chunks.length} chunks`);

    // Process each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await embedText(chunk);
      
      store.push({
        id: `fixed_doc_chunk_${i}`,
        text: chunk,
        embedding,
        source: "Fixed Document",
        chunkIndex: i,
        page: Math.floor(i / 3) + 1 // Approximate page numbers
      });
    }

    console.log(`✅ Successfully initialized fixed document with ${chunks.length} chunks`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to initialize fixed document:`, error);
    throw error;
  }
}

// Create a sample document if none exists
async function createSampleDocument() {
  const sampleContent = `Sample Document Content

This is a sample document that will be used for the RAG chat system. 
You can edit this content through the frontend interface.

Section 1: Introduction
This document contains various topics and information that users can ask questions about.

Section 2: Technology
The system uses advanced AI and vector embeddings to provide intelligent responses.

Section 3: Features
- PDF text extraction
- Vector embeddings
- Semantic search
- AI-powered responses
- Content editing capabilities

Section 4: Usage
Users can ask questions about this document and receive accurate answers based on the content.

Section 5: Benefits
- No need to upload files repeatedly
- Consistent document reference
- Easy content updates
- Efficient information retrieval

This document serves as a foundation for the RAG chat system and can be modified as needed.`;

  // Create data directory if it doesn't exist
  const dataDir = path.dirname(FIXED_DOC_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Save as text file
  fs.writeFileSync(FIXED_DOC_PATH, sampleContent);
  console.log("📝 Created sample document content");
}

// Get current document content
export async function getPDFContent() {
  return currentContent;
}

// Update document content
export async function updatePDFContent(newContent) {
  try {
    currentContent = newContent;
    
    if (!currentContent || currentContent.trim().length === 0) {
      throw new Error("Content cannot be empty");
    }

    // Clear existing store
    store = [];

    // Clean and chunk the new text
    const cleanText = currentContent.replace(/\s+/g, " ").trim();
    const chunks = chunkText(cleanText, 800, 150);
    
    console.log(`📝 Updated content: ${cleanText.length} characters, created ${chunks.length} chunks`);

    // Process each chunk with new content
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await embedText(chunk);
      
      store.push({
        id: `fixed_doc_chunk_${i}`,
        text: chunk,
        embedding,
        source: "Fixed Document",
        chunkIndex: i,
        page: Math.floor(i / 3) + 1
      });
    }

    // Save updated content to file
    const dataDir = path.dirname(FIXED_DOC_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(FIXED_DOC_PATH, currentContent);
    
    console.log(`✅ Successfully updated content with ${chunks.length} chunks`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to update content:`, error);
    throw error;
  }
}

// Generate embeddings
async function embedText(text) {
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
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

// Retrieve context for RAG
export async function retrieveContext(query) {
  const queryEmbedding = await embedText(query);
  const results = search(queryEmbedding, 5);
  
  if (results.length === 0) {
    return "No relevant context found. Please make sure the document has been initialized.";
  }
  
  // Format context with source information
  const contextParts = results.map((r, index) => {
    return `[Page ${r.page}, Section ${r.chunkIndex + 1}]\n${r.text}`;
  });
  
  return contextParts.join("\n\n");
}
