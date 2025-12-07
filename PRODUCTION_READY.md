# ✅ Production Deployment Guide

Your chatbot frontend is deployed! Now you need to deploy the backend API.

## Current Status

| Component | Status | URL |
|-----------|--------|-----|
| **Frontend** | ✅ Deployed | https://physical-ai-humanoid-robotics-book-tan.vercel.app/ |
| **Backend API** | ⏳ Needs deployment | https://your-api-url |
| **Vector DB** | ✅ Active | Qdrant Cloud (configured) |
| **LLM** | ✅ Active | Cohere (configured) |

---

## What You Need to Do

### 1️⃣ Deploy Backend API (~5-10 minutes)

Choose a hosting provider:
- **Railway** (Recommended - easiest)
- **Render**
- **Heroku**
- **Your own server**

See `DEPLOY_BACKEND_API.md` for detailed instructions.

**After deployment**, you'll have a URL like:
```
https://production-xxxxx.up.railway.app
```

### 2️⃣ Update Configuration (~2 minutes)

Edit `src/config/chatbotConfig.js`:

**Find** (around line 28):
```javascript
apiEndpoint = 'https://your-api-server.com';
```

**Replace** with your actual API URL:
```javascript
apiEndpoint = 'https://production-xxxxx.up.railway.app';
```

### 3️⃣ Deploy Frontend (~2 minutes)

```bash
git add src/config/chatbotConfig.js
git commit -m "Add production API endpoint"
git push
```

Vercel auto-deploys from GitHub!

### 4️⃣ Test (~2 minutes)

1. Visit: https://physical-ai-humanoid-robotics-book-tan.vercel.app/
2. Click purple button
3. Ask: "What is ROS2?"
4. Should work! ✅

---

## Step-by-Step: Railway Deployment (Easiest)

### Step 1: Create Railway Account
- Go to https://railway.app
- Sign up with GitHub
- Authorize Railway to access your repos

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub"
3. Find and select your repository
4. Choose branch: `main`

### Step 3: Configure Build
1. In Railway dashboard, click "Variables"
2. Add these environment variables:
   ```
   COHERE_API_KEY=jme2PFlPqBNaBq7sxXX9Q6ubM2mjsdcoWwJ9EvUw
   QDRANT_URL=https://17b20767-4f6f-4658-9281-bb8da2c51092.us-east4-0.gcp.cloud.qdrant.io:6333
   QDRANT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.semax-0E_qLmg2bJpvmggx21gxOaveIFGvB38dpEU60
   ```

### Step 4: Create Procfile
Create a file named `Procfile` in your `website/` directory:
```
web: python -m uvicorn api_server:app --host 0.0.0.0 --port $PORT
```

### Step 5: Deploy
- Push to GitHub or trigger deployment in Railway
- Wait for build (~2-3 minutes)
- Check logs for errors

### Step 6: Get Your URL
- In Railway dashboard, look for the service URL
- Looks like: `https://production-xxxxx.up.railway.app`
- Copy this!

### Step 7: Update Configuration
Edit `src/config/chatbotConfig.js` line 28:
```javascript
apiEndpoint = 'https://production-xxxxx.up.railway.app';
```

### Step 8: Deploy Frontend
```bash
git add src/config/chatbotConfig.js
git commit -m "Configure Railway API"
git push
```

### Step 9: Test
Visit your Vercel URL and test the chatbot!

---

## File Changes Required

**Only ONE file needs editing**:

```
src/config/chatbotConfig.js
  Line 28: Update API endpoint URL
```

The code already detects:
- ✅ Your Vercel domain
- ✅ Localhost for development
- ✅ Environment-appropriate endpoint

---

## Environment Variables

Your backend needs these environment variables (set on your hosting platform):

```
COHERE_API_KEY=jme2PFlPqBNaBq7sxXX9Q6ubM2mjsdcoWwJ9EvUw
QDRANT_URL=https://17b20767-4f6f-4658-9281-bb8da2c51092.us-east4-0.gcp.cloud.qdrant.io:6333
QDRANT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.semax-0E_qLmg2bJpvmggx21gxOaveIFGvB38dpEU60
```

**Where to set**:
- Railway: Dashboard → Variables
- Render: Dashboard → Environment
- Heroku: Config Vars in Settings

---

## How Auto-Configuration Works

Your `src/config/chatbotConfig.js` automatically detects the environment:

```javascript
// Local development
if (hostname === 'localhost')
  → Use http://localhost:8000

// Production (Vercel)
if (hostname === 'physical-ai-humanoid-robotics-book-tan.vercel.app')
  → Use your configured production API
```

No need to change anything else!

---

## Testing Your API

Before configuring frontend, test your backend:

```bash
# Test health endpoint
curl https://your-api-url/health

# Expected response:
# {"status":"ok","service":"RAG Chatbot API"}

# Test with a question
curl -X POST https://your-api-url/ask \
  -H "Content-Type: application/json" \
  -d '{"query":"What is ROS2?","selected_text":null,"top_k":5}'
```

---

## Troubleshooting

### "Failed to fetch" Error

**Check 1: Is API URL correct?**
```javascript
// In src/config/chatbotConfig.js, verify line 28 has your API URL
apiEndpoint = 'https://your-actual-api-url';
```

**Check 2: Is API actually deployed?**
```bash
curl https://your-api-url/health
```

**Check 3: CORS enabled?**
Your API needs to allow requests from your Vercel domain:
```python
# In api_server.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://physical-ai-humanoid-robotics-book-tan.vercel.app",
    ],
)
```

### "CORS Error"

Add this to `api_server.py` before starting the app:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://physical-ai-humanoid-robotics-book-tan.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Then redeploy your backend!

### "Mixed Content Error"

Make sure API URL uses HTTPS (not HTTP):
```javascript
// ✅ Correct
apiEndpoint = 'https://your-api.herokuapp.com';

// ❌ Wrong
apiEndpoint = 'http://your-api.herokuapp.com';
```

---

## Complete Checklist

Before going live:

**Backend Deployment**:
- [ ] Choose hosting provider (Railway/Render/etc)
- [ ] Deploy `api_server.py`
- [ ] Add environment variables
- [ ] Test with `curl /health`
- [ ] Get API URL

**Configuration**:
- [ ] Update `src/config/chatbotConfig.js` with API URL
- [ ] Commit changes
- [ ] Push to GitHub

**Frontend Deployment**:
- [ ] Vercel auto-deploys (or manual `vercel --prod`)
- [ ] Wait for build complete
- [ ] Visit Vercel URL

**Testing**:
- [ ] Purple button appears
- [ ] Can open chat
- [ ] Can ask questions
- [ ] Responses appear (3-5 seconds)
- [ ] No errors in console (F12)
- [ ] Sources are included

---

## Monitoring Production

After deployment:

### Check Logs
- **Railway**: Dashboard → Logs
- **Render**: Dashboard → Logs
- Look for errors or issues

### Monitor Usage
- Track API calls
- Watch error rates
- Monitor costs

### Performance
- Measure response times
- Check for bottlenecks
- Optimize if needed

---

## Documentation Reference

| Document | Purpose |
|----------|---------|
| `DEPLOY_BACKEND_API.md` | Detailed deployment guide |
| `CONFIGURE_PRODUCTION_API.md` | Configuration details |
| `PRODUCTION_SETUP_STEPS.txt` | Quick reference |

---

## Summary

✅ Frontend deployed (Vercel)
⏳ Backend needs deployment
⏳ Configuration needs update
⏳ Testing needed

### Quick Timeline
1. Deploy backend: ~5-10 min
2. Update config: ~2 min
3. Deploy frontend: ~2 min
4. Test: ~2 min

**Total: ~15-20 minutes to go live!**

---

## Next Action

👉 **Go to `DEPLOY_BACKEND_API.md` and pick your hosting provider!**

Choose Railway for easiest deployment. You'll have a live chatbot in minutes! 🚀

---

**Questions?** Check the documentation files or your hosting provider's docs.

**Ready?** Let's deploy! 🎉
