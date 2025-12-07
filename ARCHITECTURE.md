# RAG Chatbot Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                               │
│                    (http://localhost:3000)                          │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │           Docusaurus Book (React App)                      │    │
│  │  ┌──────────────────────────────────────────────────────┐  │    │
│  │  │        Book Content (Markdown/MDX)                   │  │    │
│  │  │  - Chapter 1: Introduction                           │  │    │
│  │  │  - Chapter 2: Humanoid Basics                        │  │    │
│  │  │  - Chapter 3: ROS2                                   │  │    │
│  │  │  - Chapter 4: Simulation                             │  │    │
│  │  │  - Chapter 5: VLA Systems                            │  │    │
│  │  │  - Chapter 6: Capstone                               │  │    │
│  │  └──────────────────────────────────────────────────────┘  │    │
│  │                                                              │    │
│  │  ┌──────────────────────────────────────────────────────┐  │    │
│  │  │  RAGChatbot Component (Floating Widget)              │  │    │
│  │  │  ┌────────────────────────────────────────────────┐  │  │    │
│  │  │  │  [Purple Button] ← Click to open             │  │  │    │
│  │  │  └────────────────────────────────────────────────┘  │  │    │
│  │  │  ┌────────────────────────────────────────────────┐  │  │    │
│  │  │  │  [Chat Window]                                 │  │  │    │
│  │  │  │  - Messages display                            │  │  │    │
│  │  │  │  - Source links                                │  │  │    │
│  │  │  │  - Input field                                 │  │  │    │
│  │  │  │  - [Send button]                               │  │  │    │
│  │  │  └────────────────────────────────────────────────┘  │  │    │
│  │  │  ┌────────────────────────────────────────────────┐  │  │    │
│  │  │  │  [Green "Ask AI" Button] ← Shows when text     │  │  │    │
│  │  │  │  is selected                                   │  │  │    │
│  │  │  └────────────────────────────────────────────────┘  │  │    │
│  │  └──────────────────────────────────────────────────────┘  │    │
│  │                                                              │    │
│  │  Component Tree:                                            │    │
│  │  Root.jsx                                                  │    │
│  │  ├── children (Docusaurus content)                         │    │
│  │  └── RAGChatbot.jsx ← Injected here                       │    │
│  └──────────────────────────────────────────────────────────┘  │    │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓ HTTP Request
                          (User clicks or types)
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    FASTAPI BACKEND SERVER                           │
│                  (http://localhost:8000)                            │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  API Endpoints                                               │  │
│  │                                                              │  │
│  │  GET  /health                                               │  │
│  │        → {"status": "ok"}                                   │  │
│  │                                                              │  │
│  │  POST /ask                                                  │  │
│  │        ← {"query": "What is ROS2?", "top_k": 5}            │  │
│  │        → {"answer": "...", "sources": [...]}               │  │
│  │                                                              │  │
│  │  POST /ask-selected-text                                    │  │
│  │        ← {"query": "Explain this",                          │  │
│  │           "selected_text": "The selected passage..."}       │  │
│  │        → {"answer": "...", "sources": [...]}               │  │
│  └──────────────────────────────────────────────────────────┘  │  │
│                          ↓        ↓       ↓                       │
│        ┌─────────────────┴────────┴───────┴──────────────┐       │
│        │  RAG Pipeline                                   │       │
│        │                                                 │       │
│        │  1. Retrieve Context:                           │       │
│        │     - Embed query using Cohere                  │       │
│        │     - Search Qdrant vector DB                   │       │
│        │     - Get top-5 relevant chunks                 │       │
│        │                                                 │       │
│        │  2. Generate Response:                          │       │
│        │     - Create prompt with context                │       │
│        │     - Call Cohere LLM                           │       │
│        │     - Stream/return response                    │       │
│        │                                                 │       │
│        │  3. Format Output:                              │       │
│        │     - Structure response JSON                   │       │
│        │     - Include source citations                  │       │
│        │     - Return to frontend                        │       │
│        └─────────────────┬────────┬───────┬──────────────┘       │
│                          ↓        ↓       ↓                       │
│      ┌───────────────────┴────────┴───────┴──────────────┐        │
│      │  External Services                                │        │
│      │  (via API)                                        │        │
│      └───────────────────┬────────┬───────┬──────────────┘        │
└─────────────────────────────────────────────────────────────────────┘
                          ↓        ↓       ↓
        ┌─────────────────┴──────────────────────────┐
        │                                             │
        ↓                      ↓                      ↓
    ┌───────────┐      ┌──────────────┐      ┌──────────────┐
    │  COHERE   │      │   QDRANT     │      │  BOOK SITE   │
    │  API      │      │   VECTOR DB  │      │  (Retrieval) │
    │           │      │              │      │              │
    │ Models:   │      │ Collection:  │      │ Crawls book  │
    │ - embed   │      │ humanoid_ai  │      │ content for  │
    │ - chat    │      │ _book        │      │ ingestion    │
    │           │      │              │      │              │
    │ Features: │      │ Stores:      │      │ Uses:        │
    │ - Text    │      │ - Vector     │      │ - Sitemap    │
    │   embeds  │      │   embeddings │      │ - HTML parse │
    │ - LLM     │      │ - Text chunks│      │ - Chunking   │
    │   chat    │      │ - Metadata   │      │ - Embedding  │
    └───────────┘      └──────────────┘      └──────────────┘
      (Cloud)            (Cloud)             (Standalone script)
```

## Data Flow

### Scenario 1: General Question

```
User Types Question: "What is ROS2?"
    ↓
Frontend sends: POST /ask {"query": "What is ROS2?"}
    ↓
[api_server.py]
    ↓
Step 1: Embed Question
    - co.embed(query) → embedding vector (1024-dim)
    ↓
Step 2: Retrieve Context
    - qdrant.query_points(embedding) → top-5 chunks
    - chunks = [chunk1, chunk2, chunk3, chunk4, chunk5]
    ↓
Step 3: Build Prompt
    prompt = """
    You are a tutor for the robotics book.
    Context: [chunk1][chunk2][chunk3][chunk4][chunk5]
    Question: What is ROS2?
    """
    ↓
Step 4: Generate Response
    - co.chat(model="command-r-plus-08-2024", message=prompt)
    - response = "ROS2 is Robot Operating System 2, which is..."
    ↓
Step 5: Return to Frontend
    {
      "answer": "ROS2 is...",
      "sources": [
        {"url": "...", "text": "..."},
        {"url": "...", "text": "..."},
        ...
      ]
    }
    ↓
Frontend displays message in chat window
    ↓
User sees answer + source links
```

### Scenario 2: Selected Text Query

```
User Selects Text: "The selected passage..."
    ↓
[RAGChatbot.jsx]
    - document.addEventListener('mouseup', detectSelection)
    - selectedText = "The selected passage..."
    - Shows green "Ask AI" button
    ↓
User Clicks "Ask AI" and Types: "Explain this"
    ↓
Frontend sends: POST /ask-selected-text {
    "query": "Explain this",
    "selected_text": "The selected passage..."
}
    ↓
[api_server.py] ask_about_selected_text()
    ↓
Step 1: Build Focused Prompt
    prompt = """
    Selected text: "The selected passage..."
    Question: Explain this
    """
    ↓
Step 2: Generate Response (No retrieval needed!)
    - co.chat(model, prompt)
    - Direct LLM focus on selected text
    ↓
Step 3: Return Response
    {
      "answer": "Based on the selected text...",
      "sources": [{"url": "selected_text", "text": "The selected..."}]
    }
    ↓
Frontend displays focused answer
```

## Component Hierarchy

```
Root.jsx
├── children (Docusaurus Content)
│   ├── Navbar
│   ├── Sidebar
│   └── MainContent
│       ├── MDX Pages
│       ├── Code Blocks
│       ├── Math Equations
│       └── Interactive Elements
│
└── RAGChatbot.jsx (NEW)
    ├── useEffect hooks
    │   ├── Text selection detection
    │   ├── API endpoint setup
    │   ├── Auto-scroll on messages
    │   └── Selected text notification
    │
    ├── State (useState)
    │   ├── isOpen: boolean
    │   ├── messages: Message[]
    │   ├── inputValue: string
    │   ├── selectedText: string
    │   ├── isLoading: boolean
    │   └── apiEndpoint: string
    │
    ├── Event Handlers
    │   ├── handleSendMessage()
    │   ├── handleKeyPress()
    │   └── handleAskAboutSelected()
    │
    ├── JSX Elements
    │   ├── buttonContainer
    │   │   ├── floatingButton
    │   │   └── selectedTextButton (conditional)
    │   │
    │   └── chatWindow (conditional)
    │       ├── header
    │       ├── messagesContainer
    │       │   └── message[] (user + assistant)
    │       │       └── messageContent
    │       │           ├── messageText
    │       │           ├── selectedTextContext (if present)
    │       │           └── sources (if present)
    │       │
    │       └── inputArea
    │           ├── selectedTextIndicator (if present)
    │           └── inputContainer
    │               ├── textarea
    │               └── sendButton
    │
    └── CSS Modules (RAGChatbot.module.css)
        ├── Layout styles
        ├── Button styles
        ├── Message styles
        ├── Animation keyframes
        ├── Dark mode styles
        └── Responsive media queries
```

## API Request/Response Flow

### Request: POST /ask

```javascript
// Frontend (RAGChatbot.jsx)
const response = await fetch('http://localhost:8000/ask', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: "What is ROS2?",
    selected_text: null,
    top_k: 5
  })
});
```

### Backend Processing (api_server.py)

```python
@app.post("/ask")
async def ask_question(request: QueryRequest):
    # 1. Validate input
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    # 2. Retrieve context from Qdrant
    embedding = co.embed(
        model="embed-english-v3.0",
        input_type="search_query",
        texts=[request.query]
    ).embeddings[0]  # 1024-dimensional vector

    results = qdrant.query_points(
        collection_name="humanoid_ai_book",
        query=embedding,
        limit=5
    )  # Returns top-5 relevant chunks

    # 3. Format context
    context = "\n\n".join([point.payload["text"] for point in results.points])
    sources = [{"url": point.payload["url"], "text": point.payload["text"][:200]}
               for point in results.points]

    # 4. Create prompt
    prompt = f"""You are an expert tutor for the "Physical AI & Humanoid Robotics" book.
Answer the question using ONLY the following context from the book.

Context:
{context}

Question: {request.query}

Answer clearly and concisely. If unsure, say "Not specified in the book."
"""

    # 5. Generate response
    response = co.chat(
        model="command-r-plus-08-2024",
        message=prompt,
        temperature=0.3  # Conservative (factual)
    )

    # 6. Return structured response
    return ChatResponse(
        answer=response.text,
        sources=sources
    )
```

### Response: ChatResponse

```json
{
  "answer": "ROS2 (Robot Operating System 2) is a middleware framework that provides tools and libraries for building robot applications. It enables communication between different software modules through a publish-subscribe messaging system...",
  "sources": [
    {
      "url": "https://example.com/docs/ch3-ros2",
      "text": "ROS2 is a middleware framework that provides the fundamental software infrastructure..."
    },
    {
      "url": "https://example.com/docs/ch1-intro",
      "text": "One of the key technologies used in humanoid robotics is ROS2..."
    }
  ]
}
```

## Environment & Configuration

```
Project Root
│
├── .env
│   ├── REACT_APP_API_ENDPOINT=http://localhost:8000
│   ├── COHERE_API_KEY=...
│   ├── QDRANT_URL=...
│   └── QDRANT_API_KEY=...
│
├── Frontend (.docusaurus)
│   ├── src/theme/Root.jsx (includes RAGChatbot)
│   ├── src/components/RAGChatbot.jsx
│   ├── src/components/RAGChatbot.module.css
│   ├── docs/chapters/*.mdx (book content)
│   ├── docusaurus.config.js
│   └── package.json
│
├── Backend
│   ├── api_server.py (FastAPI)
│   ├── agent.py (standalone RAG agent)
│   ├── retrieving.py (data ingestion)
│   └── requirements.txt (Python deps)
│
└── Documentation
    ├── START_HERE.md
    ├── QUICK_START.md
    ├── RAG_CHATBOT_SETUP.md
    ├── INTEGRATION_SUMMARY.md
    ├── ADVANCED_CONFIG.md
    ├── ARCHITECTURE.md (you are here)
    └── test_chatbot.py
```

## Technology Stack

### Frontend Layer
- **React 18**: Component framework
- **CSS Modules**: Scoped styling
- **JavaScript ES6+**: Modern syntax
- **Docusaurus 3**: Static site generator

### Backend Layer
- **FastAPI**: Python web framework (async)
- **Pydantic**: Data validation
- **Uvicorn**: ASGI server

### AI/ML Layer
- **Cohere API**: LLM and embeddings
  - `embed-english-v3.0`: Generate embeddings
  - `command-r-plus-08-2024`: Generate responses
- **Qdrant**: Vector database for semantic search

### Infrastructure
- **Docker** (optional): Containerization
- **Vercel**: Frontend hosting
- **Railway/Render**: Backend hosting

## Deployment Architecture (Production)

```
                          ┌─────────────────┐
                          │   Vercel CDN    │
                          │  (Frontend SPA) │
                          │ docusaurus.build│
                          └────────┬────────┘
                                   │
                        ┌──────────┴──────────┐
                        │ CORS Requests       │
                        └──────────┬──────────┘
                                   │
                          ┌────────▼────────┐
                          │  Railway/Render │
                          │   FastAPI App   │
                          │ (Backend API)   │
                          └────────┬────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
              ┌─────▼──┐     ┌─────▼──┐    ┌────▼────┐
              │ Cohere │     │ Qdrant │    │  Book   │
              │  API   │     │ Cloud  │    │  CDN    │
              │(LLM)   │     │(Vector │    │(Docs)   │
              │        │     │  DB)   │    │         │
              └────────┘     └────────┘    └─────────┘
```

---

This architecture provides:
- ✅ Scalable frontend (CDN)
- ✅ Scalable backend (containerized)
- ✅ Real-time retrieval (vector DB)
- ✅ Advanced AI capabilities (Cohere LLM)
- ✅ Responsive UX (React)
- ✅ Production-ready (Docker, monitoring)
