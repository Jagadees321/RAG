# Fixed Document RAG Chat System

A powerful RAG (Retrieval-Augmented Generation) chat system that uses a fixed document with editing capabilities. No need to upload files repeatedly - just edit your document content and chat with AI about it!

## 🚀 **Key Features**

### 📄 **Fixed Document System**
- **No File Uploads**: Document content is stored and managed within the system
- **Persistent Storage**: Changes are automatically saved to disk
- **Sample Content**: Comes with pre-loaded sample document to get started

### ✏️ **Content Editing**
- **Inline Editing**: Click "Edit Mode" to modify document content directly
- **Real-time Updates**: Changes are processed immediately for AI responses
- **Version Control**: Reset to original content if needed
- **Rich Text Support**: Monospace font for better content readability

### 🤖 **AI Chat Interface**
- **Context-Aware**: AI uses your document content for accurate responses
- **Smart Chunking**: Text is intelligently split for optimal RAG performance
- **Page References**: AI provides section and page references in responses
- **Instant Processing**: No waiting for file uploads or processing

## 🛠️ **Setup Instructions**

### 1. **Backend Setup**
```bash
cd backend
npm install
```

### 2. **Environment Variables**
Create `.env` file in backend directory:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 3. **Start Backend**
```bash
npm run dev
```

### 4. **Open Frontend**
Open `ragchat.html` in your browser

## 📱 **How to Use**

### **Step 1: Initialize Document**
- Click the "🚀 Initialize" button
- System loads the sample document content
- Document is processed into AI-ready chunks

### **Step 2: Edit Content (Optional)**
- Click "✏️ Edit Mode" to enable editing
- Modify the document content directly in the interface
- Click "💾 Save Changes" to process updates
- AI immediately uses new content for responses

### **Step 3: Start Chatting**
- Ask questions about your document content
- AI provides context-aware answers
- References specific sections and pages

### **Step 4: Manage Content**
- Use "🔄 Reset" to restore original content
- Toggle between edit and view modes
- All changes are automatically saved

## 🔧 **API Endpoints**

- `POST /api/ragchat/init` - Initialize the fixed document
- `GET /api/ragchat/content` - Get current document content
- `POST /api/ragchat/update` - Update document content
- `POST /api/ragchat/chat` - Chat with AI about document

## 💡 **Use Cases**

### **Perfect For:**
- **Knowledge Bases**: Maintain company policies, procedures, or guides
- **Educational Content**: Course materials, textbooks, or study guides
- **Documentation**: Technical docs, user manuals, or specifications
- **Research Papers**: Academic content with AI-powered Q&A
- **Business Documents**: Reports, policies, or training materials

### **Benefits:**
- **Consistency**: Same document reference across all conversations
- **Efficiency**: No repeated file uploads
- **Collaboration**: Easy content updates and modifications
- **Accessibility**: Content always available for AI queries
- **Versioning**: Track changes and revert when needed

## 🎯 **Technical Details**

- **Text Processing**: Intelligent chunking (800 chars with 150 char overlap)
- **Vector Store**: In-memory embeddings with cosine similarity search
- **AI Model**: Google Gemini 2.5 Flash for intelligent responses
- **Storage**: Local file system with automatic persistence
- **Performance**: Real-time processing and instant responses

## 🔄 **Workflow**

1. **Initialize** → Load document content
2. **Edit** → Modify content as needed
3. **Save** → Process changes into AI-ready format
4. **Chat** → Ask questions about updated content
5. **Iterate** → Continue editing and chatting

## 🚨 **Troubleshooting**

- **Backend not running**: Ensure `npm run dev` is started
- **API key error**: Check GEMINI_API_KEY in .env file
- **Content not loading**: Click Initialize button first
- **Edit mode not working**: Make sure document is initialized
- **AI not responding**: Check if content was saved after editing

## 🌟 **Advanced Features**

- **Smart Chunking**: Optimal text segmentation for context
- **Semantic Search**: AI-powered content retrieval
- **Context Preservation**: Maintains conversation context
- **Real-time Updates**: Instant content processing
- **Mobile Responsive**: Works on all devices

## 📈 **Future Enhancements**

- [ ] Multiple document support
- [ ] Rich text formatting
- [ ] Collaborative editing
- [ ] Version history
- [ ] Export functionality
- [ ] Advanced search filters

---

**Ready to get started?** Open `ragchat.html` and click "Initialize" to begin your AI-powered document chat experience!
