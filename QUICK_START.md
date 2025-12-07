# Quick Start Guide - RAG Chatbot

Get the RAG Chatbot running in 5 minutes!

## Prerequisites
- Python 3.10+
- Node.js 18+
- Git

## Step 1: Install Dependencies

### Python Backend
```bash
cd "E:\GIAIC\Quarter 4\Hackathon\hackathon\website"

# Create virtual environment
python -m venv .venv

# Activate it
.venv\Scripts\activate  # Windows
# or
source .venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

### Frontend
```bash
npm install
```

## Step 2: Start the Services

### Terminal 1: FastAPI Backend
```bash
cd "E:\GIAIC\Quarter 4\Hackathon\hackathon\website"
.venv\Scripts\activate

python -m uvicorn api_server:app --reload --host 0.0.0.0 --port 8000
```

Wait for:
```
Uvicorn running on http://0.0.0.0:8000
```

### Terminal 2: Docusaurus Frontend
```bash
cd "E:\GIAIC\Quarter 4\Hackathon\hackathon\website"

npm start
```

Wait for browser to open at `http://localhost:3000`

## Step 3: Test the Chatbot

### Option A: In the Browser
1. Open `http://localhost:3000`
2. Click the purple chat button (bottom-right)
3. Try asking: "What is ROS2?"

### Option B: Run Test Script
```bash
python test_chatbot.py
```

## Features to Try

### Feature 1: Ask General Questions
- "What are humanoid robots?"
- "Explain ROS2"
- "How do robots perceive their environment?"

### Feature 2: Select Text and Ask AI
1. Highlight any text in the book
2. Click the green "Ask AI" button
3. Type your question
4. Get instant AI-powered explanation

### Feature 3: View Sources
- Click source links in chatbot responses
- Jump directly to relevant book sections

## Key Features

✅ **Text Selection**: Highlight book content and ask questions about it
✅ **RAG-Powered**: Answers based only on book content
✅ **Source Citations**: View which sections the AI used
✅ **Real-time**: Instant responses with streaming support
✅ **Mobile-Friendly**: Works on phones and tablets
✅ **Dark Mode**: Supports system dark mode preference

## Troubleshooting

### "Cannot connect to API"
```bash
# Check if backend is running
curl http://localhost:8000/health

# Should return:
# {"status":"ok","service":"RAG Chatbot API"}
```

### "No relevant information found"
The book content might need to be ingested:
```bash
python retrieving.py
```

### Slow responses
- Cohere free tier has rate limits
- Wait a few seconds between questions
- Check internet connection

## Environment Variables

All required keys are in `.env`:
```
REACT_APP_API_ENDPOINT=http://localhost:8000
COHERE_API_KEY=...
QDRANT_URL=...
QDRANT_API_KEY=...
```

For production, change `REACT_APP_API_ENDPOINT` to your deployed API URL.

## Project Structure

```
website/
├── api_server.py                # FastAPI backend ← Start this
├── src/
│   ├── components/
│   │   ├── RAGChatbot.jsx       # Chat UI
│   │   └── RAGChatbot.module.css # Styling
│   └── theme/
│       └── Root.jsx             # Includes chatbot
├── retrieving.py                # Ingest book content
├── test_chatbot.py             # Test the API
├── requirements.txt            # Python dependencies
└── .env                        # API keys & config
```

## Common Commands

```bash
# Start development
npm start                          # Frontend (Terminal 2)
python -m uvicorn api_server:app --reload  # Backend (Terminal 1)

# Run tests
python test_chatbot.py

# Ingest book content
python retrieving.py

# Build for production
npm run build

# Check API health
curl http://localhost:8000/health
```

## Next Steps

1. ✅ Get it running locally
2. ✅ Test with different questions
3. 📚 Ingest your book content (if not done)
4. 🚀 Deploy to production (see RAG_CHATBOT_SETUP.md)
5. 📊 Monitor usage and gather feedback

## Performance Tips

- Responses take ~3-5 seconds (normal)
- Best results with clear, specific questions
- Selected text queries are faster
- Reload page if chat seems stuck

## Support

For detailed setup:
- See `RAG_CHATBOT_SETUP.md` for production deployment
- See `test_chatbot.py` for API endpoint testing
- Check `.env` for configuration

## What's Next?

### Deploy to Production
```bash
# Frontend: Deploy to Vercel
vercel

# Backend: Deploy to Railway/Render
# See RAG_CHATBOT_SETUP.md for instructions
```

### Improve Quality
- Ingest more book content
- Fine-tune Cohere temperature (0.1-0.5)
- Adjust top_k parameter for more/fewer sources
- Add conversation history

### Monitor Performance
- Track API usage
- Measure response times
- Collect user feedback
- Monitor costs

Happy coding! 🚀
