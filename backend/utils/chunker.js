// utils/chunker.js
export function chunkText(text, chunkSize = 800, overlap = 150) {
    const clean = text.replace(/\s+/g, " ").trim();
    const chunks = [];
    let start = 0;
    while (start < clean.length) {
      const end = Math.min(start + chunkSize, clean.length);
      const part = clean.slice(start, end);
      chunks.push(part);
      if (end === clean.length) break;
      start = end - overlap;
      if (start < 0) start = 0;
    }
    return chunks;
  }
  