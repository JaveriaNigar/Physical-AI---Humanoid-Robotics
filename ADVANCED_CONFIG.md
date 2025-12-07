# Advanced Configuration Guide

This guide covers advanced customization and deployment options for the RAG Chatbot.

## Table of Contents

1. [Model Configuration](#model-configuration)
2. [Retrieval Tuning](#retrieval-tuning)
3. [Performance Optimization](#performance-optimization)
4. [Production Deployment](#production-deployment)
5. [Monitoring & Analytics](#monitoring--analytics)
6. [Cost Management](#cost-management)
7. [Custom Prompts](#custom-prompts)

## Model Configuration

### Using Different Cohere Models

Edit `api_server.py` to change the LLM model:

```python
# Available models (as of Dec 2025):
# - command-r-plus-08-2024 (recommended, most capable)
# - command-r-08-2024 (faster, slightly less capable)
# - command-light (cheaper, basic tasks)

response = co.chat(
    model="command-r-plus-08-2024",  # Change this
    message=prompt,
    temperature=0.3
)
```

### Temperature Tuning

```python
# Temperature controls response creativity
# 0.0 = Deterministic (always same answer)
# 0.3 = Conservative (recommended for factual content)
# 0.5 = Balanced
# 1.0 = Very creative

temperature=0.3  # Best for textbook content
```

### Top-K Retrieval

```python
def retrieve_context(query: str, top_k: int = 5):
    # top_k = number of relevant chunks to retrieve
    # 3-5: Fast, focused answers
    # 5-10: Balanced
    # 10+: Comprehensive but slower

    results = qdrant.query_points(
        collection_name=COLLECTION_NAME,
        query=embedding,
        limit=top_k  # Adjust here
    )
```

## Retrieval Tuning

### Custom Retrieval Strategy

Add hybrid search combining vector similarity + keyword search:

```python
def retrieve_context_hybrid(query: str, top_k: int = 5):
    """Hybrid retrieval with vector + keyword search"""

    # 1. Vector search (semantic)
    embedding = co.embed(
        model="embed-english-v3.0",
        input_type="search_query",
        texts=[query]
    ).embeddings[0]

    vector_results = qdrant.query_points(
        collection_name=COLLECTION_NAME,
        query=embedding,
        limit=top_k * 2  # Get more for ranking
    )

    # 2. Keyword matching (lexical)
    keyword_results = qdrant.scroll(
        collection_name=COLLECTION_NAME,
        limit=top_k * 2,
        with_payload=True
    )

    # 3. Re-rank results by combining scores
    combined = combine_results(vector_results, keyword_results)
    return combined[:top_k]
```

### Filter by Source

```python
def retrieve_context_filtered(query: str, chapter: str = None):
    """Retrieve context with optional chapter filtering"""

    embedding = co.embed(
        model="embed-english-v3.0",
        input_type="search_query",
        texts=[query]
    ).embeddings[0]

    # Filter by chapter if specified
    filter_condition = None
    if chapter:
        filter_condition = models.Filter(
            must=[
                models.HasPayloadCondition(
                    key="chapter",
                    has_payload_condition=models.HasIdCondition(
                        has_id=[chapter]
                    )
                )
            ]
        )

    results = qdrant.query_points(
        collection_name=COLLECTION_NAME,
        query=embedding,
        query_filter=filter_condition,
        limit=5
    )

    return results
```

### Weighted Retrieval

```python
def retrieve_context_weighted(query: str, weights: dict = None):
    """Retrieve with custom weighting"""

    if weights is None:
        weights = {
            'relevance': 0.7,      # Vector similarity
            'recency': 0.2,        # Newer content preferred
            'popularity': 0.1      # Citation count
        }

    # Implement custom scoring combining multiple factors
    embedding = co.embed(
        model="embed-english-v3.0",
        input_type="search_query",
        texts=[query]
    ).embeddings[0]

    results = qdrant.query_points(
        collection_name=COLLECTION_NAME,
        query=embedding,
        limit=10  # Get more for custom ranking
    )

    # Re-rank with custom weights
    scored_results = []
    for point in results.points:
        score = (
            weights['relevance'] * point.score +
            weights['recency'] * recency_score(point.payload) +
            weights['popularity'] * popularity_score(point.payload)
        )
        scored_results.append((score, point))

    return sorted(scored_results, reverse=True)[:5]
```

## Performance Optimization

### 1. Response Caching

```python
from functools import lru_cache
from datetime import datetime, timedelta

class ResponseCache:
    def __init__(self, ttl_minutes: int = 60):
        self.cache = {}
        self.ttl = timedelta(minutes=ttl_minutes)

    def get(self, key: str):
        if key in self.cache:
            entry = self.cache[key]
            if datetime.now() - entry['timestamp'] < self.ttl:
                return entry['data']
            else:
                del self.cache[key]
        return None

    def set(self, key: str, value):
        self.cache[key] = {
            'data': value,
            'timestamp': datetime.now()
        }

# Use in endpoint
cache = ResponseCache(ttl_minutes=60)

@app.post("/ask")
async def ask_question(request: QueryRequest):
    cache_key = f"{request.query}:{request.selected_text}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    # ... existing code ...

    cache.set(cache_key, response)
    return response
```

### 2. Batch Processing

```python
from concurrent.futures import ThreadPoolExecutor

@app.post("/ask-batch")
async def ask_batch(requests: list[QueryRequest]):
    """Process multiple questions in parallel"""

    def process_query(req):
        return ask_question(req)

    with ThreadPoolExecutor(max_workers=5) as executor:
        results = list(executor.map(process_query, requests))

    return results
```

### 3. Streaming Responses

```python
from fastapi.responses import StreamingResponse

async def response_generator(answer: str):
    """Stream response word by word"""
    words = answer.split()
    for word in words:
        yield word + " "
        await asyncio.sleep(0.05)  # Delay for effect

@app.post("/ask-stream")
async def ask_question_stream(request: QueryRequest):
    # ... get answer ...
    return StreamingResponse(
        response_generator(answer),
        media_type="text/event-stream"
    )
```

### 4. Async Processing

```python
import asyncio

@app.post("/ask-async")
async def ask_question_async(request: QueryRequest):
    """Async implementation for better performance"""

    # Run blocking I/O in thread pool
    context = await asyncio.to_thread(
        retrieve_context,
        request.query,
        request.top_k
    )

    # Continue with response generation
    response = await asyncio.to_thread(
        generate_response,
        request.query,
        context
    )

    return response
```

## Production Deployment

### 1. Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY api_server.py .

# Expose port
EXPOSE 8000

# Start server with gunicorn
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "api_server:app"]
```

Build and run:

```bash
docker build -t rag-chatbot .
docker run -p 8000:8000 --env-file .env rag-chatbot
```

### 2. Kubernetes Deployment

Create `deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rag-chatbot
spec:
  replicas: 3
  selector:
    matchLabels:
      app: rag-chatbot
  template:
    metadata:
      labels:
        app: rag-chatbot
    spec:
      containers:
      - name: api
        image: rag-chatbot:latest
        ports:
        - containerPort: 8000
        env:
        - name: COHERE_API_KEY
          valueFrom:
            secretKeyRef:
              name: chatbot-secrets
              key: cohere-key
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: rag-chatbot-service
spec:
  selector:
    app: rag-chatbot
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: LoadBalancer
```

Deploy:

```bash
kubectl apply -f deployment.yaml
```

### 3. Environment Variables for Production

```env
# Security
ALLOWED_ORIGINS=https://yourdomain.com

# API Configuration
COHERE_API_KEY=your_production_key
QDRANT_URL=https://your-qdrant-instance.com:6333
QDRANT_API_KEY=your_qdrant_key

# Server
WORKERS=4
LOG_LEVEL=info

# Features
ENABLE_CACHING=true
CACHE_TTL=3600

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60
```

## Monitoring & Analytics

### 1. Logging

```python
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.post("/ask")
async def ask_question(request: QueryRequest):
    logger.info(f"Query: {request.query[:50]}...")

    try:
        # ... process query ...
        logger.info(f"Successfully answered query")
        return response
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        raise
```

### 2. Metrics

```python
from prometheus_client import Counter, Histogram
import time

# Define metrics
question_counter = Counter(
    'chatbot_questions_total',
    'Total questions asked'
)
response_time = Histogram(
    'chatbot_response_time_seconds',
    'Response time in seconds'
)

@app.post("/ask")
async def ask_question(request: QueryRequest):
    start_time = time.time()
    question_counter.inc()

    # ... process query ...

    duration = time.time() - start_time
    response_time.observe(duration)

    return response
```

### 3. Error Tracking

```python
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn="https://key@sentry.io/project",
    integrations=[FastApiIntegration()],
    traces_sample_rate=1.0
)
```

## Cost Management

### 1. Reduce API Calls

```python
# Cache frequently asked questions
COMMON_QUESTIONS = {
    "what is ros2": "ROS2 is...",
    "how do robots see": "Robots use cameras and..."
}

@app.post("/ask")
async def ask_question(request: QueryRequest):
    # Check common questions first
    normalized = request.query.lower().strip()
    for pattern, answer in COMMON_QUESTIONS.items():
        if pattern in normalized:
            return ChatResponse(answer=answer, sources=[])

    # ... proceed with API call ...
```

### 2. Cheaper Models

```python
# Use cheaper Cohere models for simple questions
def get_best_model(query: str) -> str:
    # Simple questions use light model
    if len(query) < 50 and not any(word in query.lower()
                                   for word in ['explain', 'how', 'why']):
        return "command-light"
    # Complex questions use full model
    return "command-r-plus-08-2024"

response = co.chat(
    model=get_best_model(request.query),
    message=prompt,
    temperature=0.3
)
```

### 3. Token Counting

```python
def count_tokens(text: str) -> int:
    """Approximate token count (rough estimate)"""
    return len(text.split()) * 1.3  # Cohere tokens are ~1.3 per word

# Monitor token usage
total_tokens = 0

@app.post("/ask")
async def ask_question(request: QueryRequest):
    global total_tokens

    prompt_tokens = count_tokens(prompt)
    total_tokens += prompt_tokens

    logger.info(f"Total tokens used: {total_tokens}")

    # Alert if approaching budget
    if total_tokens > 100000:  # Adjust threshold
        logger.warning("Approaching token budget!")
```

## Custom Prompts

### 1. Role-Based Prompts

```python
PROMPTS = {
    "tutor": """You are an expert tutor for the "Physical AI & Humanoid Robotics" book.
Answer the question using ONLY the provided context. Explain complex concepts simply.""",

    "technical": """You are a technical expert for robotics and AI.
Provide detailed, technical answers based on the book context.""",

    "concise": """You are a helpful assistant for the robotics book.
Provide brief, concise answers in 1-2 sentences.""",

    "detailed": """You are an educational expert.
Provide comprehensive, detailed explanations with examples.""",
}

@app.post("/ask")
async def ask_question(request: QueryRequest, style: str = "tutor"):
    prompt = PROMPTS.get(style, PROMPTS["tutor"])

    full_prompt = f"""{prompt}

Context:
{context}

Question: {request.query}

Answer:"""
```

### 2. Dynamic Prompts Based on Content

```python
def create_dynamic_prompt(query: str, context: str) -> str:
    """Create prompt based on query type"""

    if any(word in query.lower() for word in ['code', 'implement', 'example']):
        return f"""Provide code examples from the book context for: {query}

Context: {context}"""

    elif any(word in query.lower() for word in ['explain', 'understand', 'how']):
        return f"""Explain this concept: {query}

Context: {context}"""

    else:
        return f"""Answer this question: {query}

Context: {context}"""
```

### 3. Multi-Turn Conversations

```python
from typing import Optional

class ConversationHistory:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.messages = []

    def add_message(self, role: str, content: str):
        self.messages.append({"role": role, "content": content})

    def get_context(self, last_n: int = 5) -> str:
        """Get last N messages as context"""
        recent = self.messages[-last_n:]
        return "\n".join([f"{m['role']}: {m['content']}" for m in recent])

conversations = {}

@app.post("/ask-chat")
async def chat_conversation(request: QueryRequest, user_id: str):
    if user_id not in conversations:
        conversations[user_id] = ConversationHistory(user_id)

    conv = conversations[user_id]
    conv.add_message("user", request.query)

    # Include conversation history
    history_context = conv.get_context()

    prompt = f"""Continue this conversation about the robotics book:

{history_context}

Current question: {request.query}

Answer:"""

    # ... get response ...

    conv.add_message("assistant", response)
    return ChatResponse(answer=response, sources=sources)
```

## Performance Benchmarks

### Response Time Targets

```
Query → Embedding: 300-500ms
Embedding → Retrieval: 200-400ms
Retrieval → Generation: 2000-3000ms
Total: 2500-3900ms (goal: <4s)
```

### Throughput

```
Single instance: ~5-10 requests/minute
Scaled cluster: ~50-100 requests/minute
```

### Resource Usage

```
Memory: 256MB baseline + 50MB per concurrent request
CPU: 0.5 cores baseline + 0.25 cores per concurrent request
Network: ~100KB per request
```

---

For more help, refer to the main documentation or check the code comments!
