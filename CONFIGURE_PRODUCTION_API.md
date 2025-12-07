# Configure Production API Endpoint

Your chatbot frontend is deployed at: `https://physical-ai-humanoid-robotics-book-tan.vercel.app/`

Now configure it to use your backend API.

## Step 1: Deploy Your Backend API

First, deploy your FastAPI backend. See `DEPLOY_BACKEND_API.md` for instructions.

**You'll get a URL like**:
- Railway: `https://production-xxxxx.up.railway.app`
- Render: `https://rag-chatbot-api.onrender.com`
- Heroku: `https://your-app-name.herokuapp.com`

**Save this URL!**

---

## Step 2: Update Configuration File

Edit `src/config/chatbotConfig.js` and replace the placeholder with your actual API URL.

### Before (Template):
```javascript
if (isProduction) {
  apiEndpoint = 'https://your-api-server.com'; // ← Change this!
} else if (isDevelopment) {
  apiEndpoint = 'http://localhost:8000';
}
```

### After (Example with Railway):
```javascript
if (isProduction) {
  apiEndpoint = 'https://production-xxxxx.up.railway.app'; // ← Your actual URL
} else if (isDevelopment) {
  apiEndpoint = 'http://localhost:8000';
}
```

---

## Step 3: Find Your Production Hostname

Your Vercel deployment hostname is:
```
physical-ai-humanoid-robotics-book-tan.vercel.app
```

This is **already configured** in the code, so when users visit your Vercel domain, it automatically uses your production API URL.

---

## Step 4: Deploy Changes

```bash
# Commit your changes
git add src/config/chatbotConfig.js
git commit -m "Add production API endpoint"
git push

# Vercel auto-deploys from GitHub, OR:
vercel --prod
```

---

## Step 5: Test It Works

1. Visit your Vercel URL: `https://physical-ai-humanoid-robotics-book-tan.vercel.app/`
2. Click the purple chat button
3. Ask: "What is ROS2?"
4. Should get an answer! ✅

---

## Verify Configuration

### Check Current Environment

In browser console (F12):
```javascript
// Type this in console:
console.log(window.location.hostname);

// Should show:
// physical-ai-humanoid-robotics-book-tan.vercel.app (production)
// or
// localhost (local development)
```

### Check API Endpoint

In browser console (F12):
```javascript
// Install our config
import getChatbotConfig from '/src/config/chatbotConfig.js';

// Or just check the Network tab when you ask a question
// Should see requests to your production API URL
```

---

## Configuration Map

| Scenario | Hostname | API Endpoint |
|----------|----------|-------------|
| **Local Development** | `localhost:3000` | `http://localhost:8000` |
| **Production (Vercel)** | `physical-ai-humanoid-robotics-book-tan.vercel.app` | `https://your-deployed-api-url` |

---

## Example: Using Railway

### 1. Deploy to Railway
- Get URL: `https://rag-chatbot-production-xxxxx.up.railway.app`

### 2. Update Configuration
Edit `src/config/chatbotConfig.js`:
```javascript
const isProduction = window.location.hostname === 'physical-ai-humanoid-robotics-book-tan.vercel.app';

if (isProduction) {
  apiEndpoint = 'https://rag-chatbot-production-xxxxx.up.railway.app';
}
```

### 3. Deploy
```bash
git add src/config/chatbotConfig.js
git commit -m "Configure Railway API endpoint"
git push
```

### 4. Test
Visit: `https://physical-ai-humanoid-robotics-book-tan.vercel.app/`

---

## Example: Using Render

### 1. Deploy to Render
- Get URL: `https://rag-chatbot-api.onrender.com`

### 2. Update Configuration
```javascript
if (isProduction) {
  apiEndpoint = 'https://rag-chatbot-api.onrender.com';
}
```

### 3. Deploy
```bash
git add src/config/chatbotConfig.js
git commit -m "Configure Render API endpoint"
git push
```

---

## Troubleshooting

### "Failed to fetch" on Production
**Problem**: API endpoint is wrong or API is down

**Solution**:
1. Check the URL in `src/config/chatbotConfig.js`
2. Test API directly: `curl https://your-api-url/health`
3. Check API logs on Railway/Render
4. Verify API is publicly accessible

### "CORS Error" on Production
**Problem**: Backend doesn't allow requests from Vercel

**Solution**:
1. Edit `api_server.py`
2. Update CORS:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://physical-ai-humanoid-robotics-book-tan.vercel.app",  # ← Add this
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
3. Redeploy backend

### "Mixed Content" Error
**Problem**: Frontend is HTTPS but API is HTTP

**Solution**: Make sure API URL is HTTPS
```javascript
// ✅ Correct
apiEndpoint = 'https://your-api.herokuapp.com';

// ❌ Wrong
apiEndpoint = 'http://your-api.herokuapp.com'; // Will fail on HTTPS site
```

---

## Configuration Checklist

- [ ] Backend API is deployed (Railway/Render/Heroku)
- [ ] You have the API URL
- [ ] Updated `src/config/chatbotConfig.js` with API URL
- [ ] Committed and pushed changes
- [ ] Frontend auto-deployed (or manually deployed)
- [ ] Tested on Vercel URL
- [ ] Chatbot responds to questions
- [ ] No "Failed to fetch" errors

---

## Environment Variables (Backend)

Make sure your backend has these environment variables set on your hosting platform:

```
COHERE_API_KEY=jme2PFlPqBNaBq7sxXX9Q6ubM2mjsdcoWwJ9EvUw
QDRANT_URL=https://17b20767-4f6f-4658-9281-bb8da2c51092.us-east4-0.gcp.cloud.qdrant.io:6333
QDRANT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.semax-0E_qLmg2bJpvmggx21gxOaveIFGvB38dpEU60
```

---

## Production Deployment Checklist

- [ ] Backend deployed and running
- [ ] Backend health check works: `GET /health` → 200
- [ ] Backend can reach Qdrant: Test API
- [ ] Backend can reach Cohere: Test API
- [ ] Frontend updated with API endpoint
- [ ] Frontend deployed
- [ ] CORS configured on backend
- [ ] Tested on production URL
- [ ] No console errors
- [ ] Responses work correctly

---

Done! Your production chatbot should now be fully functional. 🎉
