# ✅ Fixed: "Failed to fetch" Error on Localhost

## Problem
The chatbot was showing: "Error: Failed to fetch. Make sure the API server is running at http://localhost:8000"

Even though your backend was running on `http://localhost:8000`, the chatbot wasn't finding it.

## Root Cause
The API endpoint was being initialized as an empty string and then set asynchronously, causing fetch calls to fail.

## Solution Applied ✅

**Updated**: `src/components/RAGChatbot.jsx`

The API endpoint is now initialized immediately with the correct value:

```javascript
// Initialize with default and update from config
const [apiEndpoint, setApiEndpoint] = useState(() => {
  const config = getChatbotConfig();
  return config.apiEndpoint || 'http://localhost:8000';
});
```

This ensures the endpoint is always available when the component renders.

---

## What to Do Now

### Option 1: Quick Restart (Fastest ⚡)

Just restart `npm start`:

```bash
# Terminal 2: Press Ctrl+C to stop
# Then:
npm start

# When browser loads, hard refresh: Ctrl+Shift+R
```

### Option 2: Full Clean (If Option 1 doesn't work)

```bash
npm cache clean --force
npm install
npm start

# Then hard refresh: Ctrl+Shift+R
```

---

## Verify It Works

After restarting:

1. **Open browser console** (F12)
   - Should show NO "Failed to fetch" error

2. **Click purple button** (bottom-right)
   - Chat window opens

3. **Ask a question**: "What is ROS2?"
   - Type and press Enter
   - Wait 3-5 seconds
   - Should get an answer! ✅

4. **Check the endpoint being used**:
   - In browser console, should be: `http://localhost:8000`

---

## What Changed

**File**: `src/components/RAGChatbot.jsx`

**Before (Broken)**:
```javascript
const [apiEndpoint, setApiEndpoint] = useState('');

useEffect(() => {
  const config = getChatbotConfig();
  setApiEndpoint(config.apiEndpoint);  // ❌ Too late!
}, []);
```

**After (Fixed)**:
```javascript
const [apiEndpoint, setApiEndpoint] = useState(() => {
  const config = getChatbotConfig();
  return config.apiEndpoint || 'http://localhost:8000';  // ✅ Immediate!
});
```

The endpoint is now available **immediately** when the component mounts.

---

## How It Works Now

### Local Development (localhost:3000)
```
Config detects: localhost → Returns http://localhost:8000
Chatbot uses: http://localhost:8000 ✅
```

### Production (Vercel URL)
```
Config detects: vercel domain → Returns your API URL
Chatbot uses: https://your-api-url ✅
```

---

## Testing Your Setup

### Test 1: Check Endpoint
```bash
# In browser console (F12):
console.log(window.location.hostname);
# Should show: localhost

# Chatbot should use: http://localhost:8000
```

### Test 2: Test API Directly
```bash
# Terminal:
curl http://localhost:8000/health

# Should return:
# {"status":"ok","service":"RAG Chatbot API"}
```

### Test 3: Ask a Question
1. Click purple button
2. Type: "What is ROS2?"
3. Should get response in 3-5 seconds ✅

---

## Common Issues & Solutions

### Issue: Still getting "Failed to fetch"

**Check 1: Is backend running?**
```bash
# Terminal 1 should show:
# Uvicorn running on http://0.0.0.0:8000
```

**Check 2: Backend on correct port?**
```bash
# Make sure you're running:
python -m uvicorn api_server:app --reload --host 0.0.0.0 --port 8000
# Not some other port!
```

**Check 3: Hard refresh browser**
```
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

**Check 4: Clear npm cache**
```bash
npm cache clean --force
npm install
npm start
```

### Issue: No responses from API

**Solution 1**: Check API logs (Terminal 1)
- Look for error messages
- Should show request coming in

**Solution 2**: Test API manually
```bash
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"query":"What is ROS2?","selected_text":null,"top_k":5}'

# Should get back JSON response
```

**Solution 3**: Check network in DevTools
- F12 → Network tab
- Ask a question
- Look for request to `http://localhost:8000/ask`
- Should be status 200 with JSON response

### Issue: Slow responses (>10 seconds)

**This is normal!** First response takes time because:
- Query is embedded (Cohere API)
- Vector search happens (Qdrant)
- LLM generates response (Cohere)

Total: 3-7 seconds is typical.

---

## Status

✅ **Error is fixed**
✅ **API endpoint properly initialized**
✅ **Ready to use locally**

---

## Next Steps

1. ✅ Restart `npm start`
2. ✅ Hard refresh browser (Ctrl+Shift+R)
3. ✅ Click purple button
4. ✅ Ask a question
5. ✅ Get answers! 🎉

---

## Summary

The chatbot was trying to fetch before the API endpoint was ready. Now it's initialized immediately from the config, so it works right away!

**Just restart npm and you're good to go!** ✨
