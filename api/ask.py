from http.server import BaseHTTPRequestHandler
import json
import os
import sys
from pathlib import Path

# Add parent directory to path to import modules
sys.path.insert(0, str(Path(__file__).parent.parent))

import cohere
from qdrant_client import QdrantClient

# === CONFIG ===
COHERE_API_KEY = os.getenv("COHERE_API_KEY", "jme2PFlPqBNaBq7sxXX9Q6ubM2mjsdcoWwJ9EvUw")
QDRANT_URL = os.getenv("QDRANT_URL", "https://17b20767-4f6f-4658-9281-bb8da2c51092.us-east4-0.gcp.cloud.qdrant.io:6333")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.semax-0E_qLmg2bJpvmggx21gxOaveIFGvB38dpEU60")
COLLECTION_NAME = "humanoid_ai_book"

# Initialize clients
co = cohere.Client(COHERE_API_KEY)
qdrant = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

def retrieve_context(query: str, top_k: int = 5):
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
        raise Exception(f"Retrieval error: {str(e)}")

def generate_answer(query: str, context: str) -> str:
    """Generate answer using Cohere"""
    try:
        response = co.generate(
            model="command-r-plus-08-2024",
            prompt=f"""You are an expert AI tutor for the Physical AI & Humanoid Robotics book.

Based on the following book content, answer the user's question accurately and helpfully.

Book Content:
{context}

User Question: {query}

Answer:""",
            max_tokens=500,
            temperature=0.7,
        )
        return response.generations[0].text.strip()
    except Exception as e:
        return f"Error generating answer: {str(e)}"

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode()
            data = json.loads(body)

            query = data.get("query", "").strip()
            if not query:
                self.send_response(400)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Query cannot be empty"}).encode())
                return

            # Retrieve context
            context, sources = retrieve_context(query, data.get("top_k", 5))

            # Generate answer
            answer = generate_answer(query, context)

            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()

            response = {
                "answer": answer,
                "sources": sources
            }
            self.wfile.write(json.dumps(response).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
