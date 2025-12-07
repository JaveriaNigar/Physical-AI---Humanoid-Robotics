"""FastAPI server for RAG chatbot integration"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cohere
from qdrant_client import QdrantClient
import os
from dotenv import load_dotenv

load_dotenv()

# === CONFIG ===
COHERE_API_KEY = os.getenv("COHERE_API_KEY", "jme2PFlPqBNaBq7sxXX9Q6ubM2mjsdcoWwJ9EvUw")
QDRANT_URL = os.getenv("QDRANT_URL", "https://17b20767-4f6f-4658-9281-bb8da2c51092.us-east4-0.gcp.cloud.qdrant.io:6333")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.semax-0E_qLmg2bJpvmggx21gxOaveIFGvB38dpEU60")
COLLECTION_NAME = "humanoid_ai_book"

# Initialize clients
co = cohere.Client(COHERE_API_KEY)
qdrant = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

# Create FastAPI app
app = FastAPI(title="RAG Chatbot API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === REQUEST/RESPONSE MODELS ===
class QueryRequest(BaseModel):
    query: str
    selected_text: str | None = None
    top_k: int = 5


class ChatResponse(BaseModel):
    answer: str
    sources: list[dict] = []


# === HELPER FUNCTIONS ===
def retrieve_context(query: str, top_k: int = 5) -> tuple[str, list[dict]]:
    """Retrieve relevant chunks from Qdrant"""
    try:
        embedding = co.embed(
            model="embed-english-v3.0",
            input_type="search_query",
            texts=[query]
        ).embeddings[0]

        results = qdrant.query_points(
            collection_name=COLLECTION_NAME,
            query=embedding,
            limit=top_k
        )

        sources = []
        context_parts = []

        for point in results.points:
            text = point.payload.get("text", "")
            url = point.payload.get("url", "")
            context_parts.append(text)
            sources.append({
                "url": url,
                "text": text[:200] + "..." if len(text) > 200 else text
            })

        context = "\n\n".join(context_parts)
        return context if context else "No relevant information found.", sources

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retrieval error: {str(e)}")


import agent

# === API ENDPOINTS ===
@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "ok", "service": "RAG Chatbot API"}


@app.post("/ask", response_model=ChatResponse)
async def ask_question(request: QueryRequest):
    """Ask a question about the book content"""
    try:
        if not request.query or not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")

        # If selected_text is provided we prefer the agent's selected-text path
        if request.selected_text:
            # Use agent helper to answer focused on selected text
            answer = agent.ask_about_selected_text(request.query, request.selected_text)
            sources = [{"url": "selected_text", "text": request.selected_text[:200]}]
            return ChatResponse(answer=answer, sources=sources)

        # Otherwise use the agent's retrieval+answer function
        answer = agent.ask_question(request.query)

        # Try to retrieve sources via the server-side retrieval for metadata
        try:
            context, sources = retrieve_context(request.query, request.top_k)
        except Exception:
            sources = []

        return ChatResponse(answer=answer, sources=sources)

    except cohere.errors.NotFoundError:
        raise HTTPException(status_code=500, detail="Model not available")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")


@app.post("/ask-selected-text", response_model=ChatResponse)
async def ask_about_selected_text(request: QueryRequest):
    """Ask a question specifically about selected text from the book"""
    try:
        if not request.selected_text or not request.selected_text.strip():
            raise HTTPException(status_code=400, detail="No text selected")

        if not request.query or not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")

        # Delegate to the agent helper which uses selected text as sole context
        answer = agent.ask_about_selected_text(request.query, request.selected_text)

        return ChatResponse(
            answer=answer,
            sources=[{
                "url": "selected_text",
                "text": request.selected_text[:200] + "..." if len(request.selected_text) > 200 else request.selected_text
            }]
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing selected text: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
