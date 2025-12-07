from http.server import BaseHTTPRequestHandler
import json
import os
import sys
from pathlib import Path

# Add parent directory to path to import modules
sys.path.insert(0, str(Path(__file__).parent.parent))

import cohere

# === CONFIG ===
COHERE_API_KEY = os.getenv("COHERE_API_KEY", "jme2PFlPqBNaBq7sxXX9Q6ubM2mjsdcoWwJ9EvUw")

# Initialize client
co = cohere.Client(COHERE_API_KEY)

def generate_answer_for_selected_text(query: str, selected_text: str) -> str:
    """Generate answer specifically about selected text"""
    try:
        response = co.generate(
            model="command-r-plus-08-2024",
            prompt=f"""You are an expert AI tutor for the Physical AI & Humanoid Robotics book.

Based on the following selected text from the book, answer the user's question accurately and helpfully.

Selected Text:
{selected_text}

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
            selected_text = data.get("selected_text", "").strip()

            if not query:
                self.send_response(400)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Query cannot be empty"}).encode())
                return

            if not selected_text:
                self.send_response(400)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "No text selected"}).encode())
                return

            # Generate answer focused on selected text
            answer = generate_answer_for_selected_text(query, selected_text)

            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()

            response = {
                "answer": answer,
                "sources": [{
                    "url": "selected_text",
                    "text": selected_text[:200] + "..." if len(selected_text) > 200 else selected_text
                }]
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
