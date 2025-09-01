# AI RAG Chatbot

A modern, beautiful chatbot interface that allows you to upload PDF documents and chat with AI about their content using Retrieval-Augmented Generation (RAG).

## Features

- 🎨 **Beautiful Modern UI** - Clean, responsive design with gradient backgrounds and smooth animations
- 📄 **PDF Support** - Upload and process PDF documents with automatic text extraction
- 💬 **Smart Chat Interface** - Chat with AI about your document content
- 🔍 **Advanced RAG** - Uses vector embeddings and semantic search for accurate responses
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🚀 **Real-time Processing** - Instant file processing and chat responses

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **AI**: Google Gemini 2.5 Flash
- **Vector Store**: In-memory with cosine similarity search
- **File Processing**: PDF parsing with pdf-parse

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

Get your API key from [Google AI Studio](https://aistudio.google.com/)

### 3. Start the Backend

```bash
npm run dev
```

The backend will run on `http://localhost:4000`

### 4. Open the Frontend

Open `g.html` in your web browser or serve it with a local server.

## Usage

1. **Upload Document**: Drag and drop or click to upload a PDF file
2. **Wait for Processing**: The system will extract text and create embeddings
3. **Start Chatting**: Ask questions about your document content
4. **Get AI Responses**: Receive accurate answers based on your document

## File Support

- ✅ **PDF** - Full support with text extraction
- ✅ **TXT** - Plain text files
- ⏳ **DOCX** - Coming soon

## API Endpoints

- `POST /api/rag/upload` - Upload and process documents
- `POST /api/rag/chat` - Chat with AI about document content

## How It Works

1. **Document Upload**: Files are uploaded and processed
2. **Text Extraction**: PDF text is extracted using pdf-parse
3. **Chunking**: Text is split into manageable chunks (800 chars with 150 char overlap)
4. **Embedding Generation**: Each chunk gets converted to vector embeddings
5. **Semantic Search**: User questions are converted to embeddings and matched with relevant chunks
6. **AI Response**: Context is sent to Gemini AI for intelligent responses

## Troubleshooting

- **Backend not running**: Make sure to start the backend with `npm run dev`
- **PDF upload fails**: Check if the PDF is readable and not corrupted
- **API key error**: Verify your GEMINI_API_KEY in the .env file
- **No responses**: Ensure you've uploaded a document first

## Future Enhancements

- [ ] DOCX file support
- [ ] Persistent vector store (database)
- [ ] Multiple document management
- [ ] User authentication
- [ ] Chat history
- [ ] Export conversations

## License

MIT License - feel free to use and modify!
