# Deploy Backend API for Production

Your Vercel frontend is deployed at: `https://physical-ai-humanoid-robotics-book-tan.vercel.app/`

Now you need to deploy your FastAPI backend and configure it.

## Step 1: Choose Your Hosting Provider

Pick ONE of these options:

### Option A: Railway (Recommended - Easiest) ⭐
- Free tier available
- Simple deployment
- Built-in environment variables
- Best for this project

### Option B: Render
- Free tier available
- Easy setup
- Good performance

### Option C: Heroku
- Paid only now (was free)
- Well-documented
- Industry standard

### Option D: Your Own Server
- Full control
- Requires server knowledge
- Docker recommended

---

## Option A: Deploy to Railway (Recommended)

### Step 1.1: Create Railway Account
1. Go to https://railway.app/
2. Sign up with GitHub
3. Connect your GitHub account

### Step 1.2: Create New Project
1. Click "New Project"
2. Choose "Deploy from GitHub"
3. Select your repository
4. Select the `website` directory (or where your `api_server.py` is)

### Step 1.3: Add Environment Variables
In Railway dashboard:
1. Go to "Variables"
2. Add these variables:
   ```
   COHERE_API_KEY=jme2PFlPqBNaBq7sxXX9Q6ubM2mjsdcoWwJ9EvUw
   QDRANT_URL=https://17b20767-4f6f-4658-9281-bb8da2c51092.us-east4-0.gcp.cloud.qdrant.io:6333
   QDRANT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.semax-0E_qLmg2bJpvmggx21gxOaveIFGvB38dpEU60
   ```

### Step 1.4: Create Procfile
Create a file named `Procfile` in the website directory:
```
web: python -m uvicorn api_server:app --host 0.0.0.0 --port $PORT
```

### Step 1.5: Create requirements.txt (if not exists)
Already done! Use existing `requirements.txt`

### Step 1.6: Deploy
1. Push to GitHub or trigger deployment in Railway
2. Wait for build to complete
3. Copy the URL from Railway dashboard
4. Should look like: `https://your-app-name.up.railway.app`

---

## Option B: Deploy to Render

### Step 2.1: Create Account
1. Go to https://render.com/
2. Sign up
3. Connect GitHub

### Step 2.2: Create New Service
1. Click "New Web Service"
2. Connect repository
3. Fill in details:
   - **Name**: `rag-chatbot-api`
   - **Runtime**: `python-3.11`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python -m uvicorn api_server:app --host 0.0.0.0 --port $PORT`

### Step 2.3: Add Environment Variables
In Settings → Environment:
```
COHERE_API_KEY=jme2PFlPqBNaBq7sxXX9Q6ubM2mjsdcoWwJ9EvUw
QDRANT_URL=https://17b20767-4f6f-4658-9281-bb8da2c51092.us-east4-0.gcp.cloud.qdrant.io:6333
QDRANT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.semax-0E_qLmg2bJpvmggx21gxOaveIFGvB38dpEU60
```

### Step 2.4: Deploy
- Click "Deploy"
- Wait for build and deployment
- Copy the service URL

---

## Step 2: Get Your API URL

After deployment, you'll have a URL like:
- Railway: `https://production-xxxxx.up.railway.app`
- Render: `https://rag-chatbot-api.onrender.com`
- Heroku: `https://your-app-name.herokuapp.com`

**Copy this URL!**

---

## Step 3: Update Chatbot Configuration

Now update the chatbot to use your deployed API.

Edit `src/config/chatbotConfig.js`:

```javascript
const isProduction = window.location.hostname === 'physical-ai-humanoid-robotics-book-tan.vercel.app';

// Production: use your API server URL (CHANGE THIS!)
apiEndpoint = 'https://your-deployed-api-url.com'; // ← REPLACE WITH YOUR URL
```

Replace `https://your-deployed-api-url.com` with your actual API URL from Step 2.

**Example**:
```javascript
if (isProduction) {
  // Using Railway as example
  apiEndpoint = 'https://production-xxxxx.up.railway.app';
}
```

---

## Step 4: Test Your API

Before deploying frontend, test your API:

```bash
# Test health endpoint
curl https://your-deployed-api-url.com/health

# Should return:
# {"status":"ok","service":"RAG Chatbot API"}
```

---

## Step 5: Deploy Frontend with Updated Config

1. Commit and push your changes:
```bash
git add src/config/chatbotConfig.js
git commit -m "Update API endpoint for production"
git push
```

2. Frontend should auto-deploy on Vercel

3. Or manually deploy:
```bash
vercel --prod
```

---

## Step 6: Test Production

1. Visit: `https://physical-ai-humanoid-robotics-book-tan.vercel.app/`
2. Click purple button
3. Ask a question
4. Should work! ✅

---

## Configuration Summary

| Environment | Frontend URL | API Endpoint |
|-------------|--------------|-------------|
| **Local Dev** | `http://localhost:3000` | `http://localhost:8000` |
| **Production** | `https://physical-ai-humanoid-robotics-book-tan.vercel.app/` | YOUR_DEPLOYED_API_URL |

---

## Troubleshooting Production

### "Failed to fetch" Error
- Check API endpoint URL is correct in config
- Verify API is deployed and running
- Check CORS is enabled on backend
- Test: `curl https://your-api-url/health`

### "Cannot reach API from Vercel"
- API URL must be publicly accessible
- Check firewall/network settings
- Add Vercel domain to CORS whitelist

### API Returns 503 Error
- Backend might be cold-starting (Railway/Render)
- Wait 30-60 seconds and try again
- Check backend logs on hosting platform

### Mixed Content Error
- Make sure both frontend and API use HTTPS
- Vercel is HTTPS, so API must be too

---

## Monitor Your API

After deployment:

1. **Check Logs**:
   - Railway: Dashboard → Logs
   - Render: Dashboard → Logs
   - Look for errors

2. **Test Endpoints**:
   - Health: `GET /health`
   - Ask: `POST /ask` with JSON body

3. **Monitor Usage**:
   - Check API calls count
   - Watch for errors

---

## Next Steps

1. ✅ Choose hosting provider (Railway recommended)
2. ✅ Deploy `api_server.py`
3. ✅ Get your API URL
4. ✅ Update `src/config/chatbotConfig.js`
5. ✅ Deploy frontend
6. ✅ Test on production

---

## Quick Reference

**Railway Deployment**:
1. Go to railway.app
2. "New Project" → "Deploy from GitHub"
3. Add environment variables
4. Add Procfile
5. Deploy
6. Copy URL

**Update Config**:
```javascript
apiEndpoint = 'https://your-railway-app.up.railway.app';
```

**Test API**:
```bash
curl https://your-api-url/health
```

---

For more details on each platform, see their official documentation links:
- Railway: https://docs.railway.app/
- Render: https://render.com/docs
- Heroku: https://devcenter.heroku.com/
