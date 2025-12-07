# RAG Chatbot Integration Setup Guide

This document explains how to set up, run, and deploy the integrated RAG Chatbot for the Physical AI & Humanoid Robotics textbook.

## Overview

The RAG (Retrieval-Augmented Generation) Chatbot is an AI-powered assistant embedded in the Docusaurus-powered textbook that:

- **Answers questions** about book content using OpenAI-compatible models via Cohere
- **Processes selected text** when users highlight passages and click "Ask AI"
- **Retrieves relevant context** from a vector database (Qdrant Cloud)
- **Provides source citations** linking to relevant sections

## Architecture

### Components

1. **Frontend (React Component)**: `src/components/RAGChatbot.jsx`
   - Floating chatbot widget
   - Text selection detection
   - Real-time message display

2. **Backend (FastAPI Server)**: `api_server.py`
   - RAG query endpoint (`/ask`)
   - Selected text query endpoint (`/ask-selected-text`)
   - Context retrieval from Qdrant

3. **Vector Database**: Qdrant Cloud (Free Tier)
   - Stores embeddings of book content
   - Collection: `humanoid_ai_book`
   - Vector size: 1024 (Cohere embed-english-v3.0)

4. **LLM Model**: Cohere (command-r-plus-08-2024)
   - Generates responses based on retrieved context
   - Uses low temperature (0.3) for consistency

## Prerequisites

- Node.js >= 18.0.0
- Python 3.10+
- Active internet connection
- Accounts/API Keys (provided in `.env`):
  - Cohere API key
  - Qdrant Cloud credentials

## Installation & Setup

### 1. Backend Setup

#### Install Python Dependencies

```bash
# Navigate to website directory
cd "E:\GIAIC\Quarter 4\Hackathon\hackathon\website"

# Create virtual environment (if not exists)
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install required packages
pip install fastapi uvicorn cohere qdrant-client python-dotenv
```

#### Environment Variables

The `.env` file already contains necessary configurations:

```env
COHERE_API_KEY=jme2PFlPqBNaBq7sxXX9Q6ubM2mjsdcoWwJ9EvUw
QDRANT_URL=https://17b20767-4f6f-4658-9281-bb8da2c51092.us-east4-0.gcp.cloud.qdrant.io:6333
QDRANT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.semax-0E_qLmg2bJpvmggx21gxOaveIFGvB38dpEU60
REACT_APP_API_ENDPOINT=http://localhost:8000
```

### 2. Frontend Setup

#### Install Node Dependencies

```bash
cd "E:\GIAIC\Quarter 4\Hackathon\hackathon\website"

npm install
```

## Running the Application

### Development Mode (Local Testing)

#### Terminal 1: Start FastAPI Backend

```bash
# Navigate to website directory
cd "E:\GIAIC\Quarter 4\Hackathon\hackathon\website"

# Activate Python virtual environment
.venv\Scripts\activate

# Start the FastAPI server
python -m uvicorn api_server:app --reload --host 0.0.0.0 --port 8000
```

Expected output:
```
Uvicorn running on http://0.0.0.0:8000
```

#### Terminal 2: Start Docusaurus Frontend

```bash
cd "E:\GIAIC\Quarter 4\Hackathon\hackathon\website"

npm start
```

Expected output:
```
[INFO] ⚡️ Ready in 5.34 s.
```

The website will open at `http://localhost:3000`

#### Test the Chatbot

1. Open the book in your browser
2. Click the purple circular button (bottom-right corner)
3. Try these interactions:
   - **Ask a question**: Type a question about robotics, AI, ROS2, etc.
   - **Select text**: Highlight any text in the book and click "Ask AI"
   - **View sources**: Click on source links to jump to relevant sections

## Deployment

### Option 1: Deploy to Vercel (Recommended for Frontend)

The frontend is already configured for Vercel deployment. Update the API endpoint:

```bash
# Set environment variable for production
REACT_APP_API_ENDPOINT=https://your-api-domain.com
```

### Option 2: Deploy Backend to Cloud

#### Deploy FastAPI to Railway, Render, or Heroku

**Using Railway (Simple)**:

1. Create a `Procfile` in website directory:
```
web: python -m uvicorn api_server:app --host 0.0.0.0 --port $PORT
```

2. Create `.railwayapp.json`:
```json
{
  "build": {
    "builder": "nixpacks",
    "buildCommand": "pip install -r requirements.txt"
  }
}
```

3. Push to Railway:
```bash
railway up
```

4. Update `.env` with Railway API URL:
```
REACT_APP_API_ENDPOINT=https://your-railway-app.railway.app
```

#### Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd "E:\GIAIC\Quarter 4\Hackathon\hackathon\website"
vercel
```

## File Structure

```
website/
├── src/
│   ├── components/
│   │   ├── RAGChatbot.jsx          # Main chatbot component
│   │   └── RAGChatbot.module.css   # Chatbot styling
│   └── theme/
│       └── Root.jsx                 # Root component (includes chatbot)
├── api_server.py                    # FastAPI backend server
├── agent.py                         # RAG agent (standalone)
├── retrieving.py                    # Document ingestion script
├── .env                             # Environment variables
├── docusaurus.config.js             # Docusaurus configuration
└── package.json                     # Node dependencies
```

## API Endpoints

### POST /ask
Ask a general question about the book content.

**Request**:
```json
{
  "query": "What is ROS2?",
  "selected_text": null,
  "top_k": 5
}
```

**Response**:
```json
{
  "answer": "ROS2 (Robot Operating System 2) is...",
  "sources": [
    {
      "url": "https://example.com/docs/ch3-ros2",
      "text": "ROS2 is a middleware..."
    }
  ]
}
```

### POST /ask-selected-text
Answer a question specifically about user-selected text.

**Request**:
```json
{
  "query": "Can you explain this?",
  "selected_text": "The selected text from the book...",
  "top_k": 5
}
```

**Response**:
```json
{
  "answer": "Based on the selected text...",
  "sources": [
    {
      "url": "selected_text",
      "text": "The selected text from the book..."
    }
  ]
}
```

### GET /health
Health check endpoint.

**Response**:
```json
{
  "status": "ok",
  "service": "RAG Chatbot API"
}
```

## Troubleshooting

### Issue: "Cannot connect to API"
- Ensure FastAPI server is running on port 8000
- Check if `REACT_APP_API_ENDPOINT` is correct
- Allow CORS in network firewall

### Issue: "No relevant information found"
- The book content may not be ingested in Qdrant yet
- Run `retrieving.py` to ingest content:
  ```bash
  python retrieving.py
  ```

### Issue: Slow responses
- Check API rate limits (Cohere free tier: 5 calls/min)
- Verify Qdrant connection speed
- Reduce `top_k` parameter in queries

## Ingesting Book Content

To add or update book content in Qdrant:

```bash
# Activate Python environment
.venv\Scripts\activate

# Run ingestion script
python retrieving.py
```

This script:
1. Fetches URLs from your book's sitemap
2. Extracts text from each page
3. Chunks content into semantic pieces
4. Generates embeddings using Cohere
5. Stores in Qdrant vector database

## Customization

### Change Chatbot Appearance

Edit `src/components/RAGChatbot.module.css`:
- Gradient colors (`.floatingButton`)
- Chatbot window size (`.chatWindow`)
- Message styling (`.messageContent`)

### Change LLM Model

Edit `api_server.py`:
```python
response = co.chat(
    model="command-r-08-2024",  # Change this
    message=prompt,
    temperature=0.3
)
```

### Change Retrieval Strategy

Modify `retrieve_context()` function in `api_server.py`:
- Adjust `top_k` parameter (more sources = slower but more thorough)
- Implement custom ranking/filtering
- Add keyword search pre-filtering

## Performance Optimization

1. **Cache responses**: Store common questions
2. **Batch requests**: Process multiple queries efficiently
3. **Optimize vectors**: Use smaller embedding models
4. **Rate limiting**: Add request throttling
5. **CDN**: Serve static assets from CDN

## Security Considerations

- API keys are stored in `.env` (don't commit to git)
- Backend validates all inputs
- CORS is enabled for all origins (restrict in production)
- Implement rate limiting for API endpoints
- Use HTTPS in production

## Support & Feedback

For issues or questions:
1. Check troubleshooting section above
2. Review FastAPI server logs
3. Check browser console for JavaScript errors
4. Test API endpoints directly using curl or Postman

## Next Steps

1. Test with actual users
2. Gather feedback on answer quality
3. Fine-tune retrieval parameters
4. Monitor API usage and costs
5. Implement caching for popular questions
6. Add conversation history/context

## License

This RAG Chatbot integration is part of the Physical AI & Humanoid Robotics textbook project, licensed under MIT License.
