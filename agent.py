# agent.py — Fixed for Dec 2025 Cohere Models
import cohere
from qdrant_client import QdrantClient
import os
from dotenv import load_dotenv

load_dotenv()

# === CONFIG ===
# Prefer environment variables for keys and endpoints — fall back to previous defaults
COHERE_API_KEY = os.getenv("COHERE_API_KEY", "lMfsXuLN4JfcXRLZJX1qE5TTDv29XjxGYxRkSoMy")
QDRANT_URL = os.getenv("QDRANT_URL", "https://17b20767-4f6f-4658-9281-bb8da2c51092.us-east4-0.gcp.cloud.qdrant.io:6333")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.semax-0E_qLmg2bJpvmggx21gxOaveIFGvB38dpEU60")
COLLECTION_NAME = "humanoid_ai_book"

# Initialize clients
co = cohere.Client(COHERE_API_KEY)
qdrant = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)


def retrieve_context(query: str, top_k: int = 5) -> str:
    """Retrieve relevant chunks from Qdrant"""
    embedding = co.embed(
        model="embed-english-v3.0",
        input_type="search_query",      # Correct for queries
        texts=[query]
    ).embeddings[0]

    results = qdrant.query_points(
        collection_name=COLLECTION_NAME,
        query=embedding,
        limit=top_k
    )

    context = "\n\n".join([point.payload["text"] for point in results.points])
    return context if context else "No relevant information found."


def ask_question(question: str) -> str:
    """Simple RAG: retrieve + ask Cohere to answer using context"""
    print(f"Question: {question}\n")
    
    context = retrieve_context(question)
    
    if "No relevant" in context:
        return "I don't have information about that in the book."

    prompt = f"""
You are an expert tutor for the "Physical AI & Humanoid Robotics" book.
Answer the question using ONLY the following context from the book.

Context:
{context}

Question: {question}

Answer clearly and concisely. If unsure, say "Not specified in the book."
"""

    try:
        # UPDATED: Use the current live model (replacement for deprecated command-r-plus)
        response = co.chat(
            model="command-r-plus-08-2024",   # ← FIXED: Live as of Dec 2025
            message=prompt,
            temperature=0.3
        )
        return response.text
    except cohere.errors.NotFoundError:
        # Fallback if even this is deprecated (unlikely, but future-proof)
        print("Fallback model activated...")
        response = co.chat(
            model="command-r-08-2024",
            message=prompt,
            temperature=0.3
        )
        return response.text
    except Exception as e:
        return f"Error generating response: {e}"


def ask_about_selected_text(question: str, selected_text: str) -> str:
    """Answer a question focused on user-selected text (no retrieval).

    This uses the selected text as the only context so the model
    answers strictly from the user's highlighted passage.
    """
    if not selected_text or not selected_text.strip():
        return "No selected text provided."

    prompt = f"""
You are an expert tutor for the \"Physical AI & Humanoid Robotics\" book.
The user has selected a specific portion of text and asked a question about it.

Selected Text:
{selected_text}

Question about the selected text: {question}

Answer the question directly based on the selected text. Be concise and helpful. If the question cannot be answered from the selected text, explain what the selected text covers and ask for clarification.
"""

    try:
        response = co.chat(
            model="command-r-plus-08-2024",
            message=prompt,
            temperature=0.3,
        )
        return response.text
    except Exception as e:
        return f"Error generating response from selected text: {e}"


# === INTERACTIVE LOOP ===
if __name__ == "__main__":
    print("Physical AI & Humanoid Robotics Tutor Ready! (Updated for Dec 2025)\n")
    
    while True:
        q = input("Ask a question (or type 'quit'): ").strip()
        if q.lower() in ["quit", "exit", "bye"]:
            print("Goodbye!")
            break
        if not q:
            continue
            
        answer = ask_question(q)
        print(f"\nAnswer: {answer}\n")
        print("-" * 80)