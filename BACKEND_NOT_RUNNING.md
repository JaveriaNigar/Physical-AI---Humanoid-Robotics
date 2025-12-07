# ⚠️ Backend API is NOT Running!

## Real Issue Found

The error "Failed to fetch" is happening because **the backend FastAPI server is not running on port 8000**.

When I tested:
```bash
curl http://localhost:8000/health
# Result: Connection refused
```

Your backend server is **NOT running**.

---

## What You Need to Do

You need **TWO terminal windows** running simultaneously:

### **Terminal 1: Backend API Server**
```bash
cd "E:\GIAIC\Quarter 4\Hackathon\hackathon\website"

# Activate Python environment
.venv\Scripts\activate

# Start the FastAPI server
python -m uvicorn api_server:app --reload --host 0.0.0.0 --port 8000
```

**You should see**:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

**IMPORTANT**: Keep this terminal open and running!

### **Terminal 2: Frontend Docusaurus**
```bash
cd "E:\GIAIC\Quarter 4\Hackathon\hackathon\website"

# Start Docusaurus
npm start
```

**You should see**:
```
[INFO] ⚡️ Ready in 5.34 s.
Listening on http://localhost:3000
```

---

## Step-by-Step Setup

### **Step 1: Open Terminal 1**
```bash
cd "E:\GIAIC\Quarter 4\Hackathon\hackathon\website"
.venv\Scripts\activate
python -m uvicorn api_server:app --reload --host 0.0.0.0 --port 8000
```

**Wait for it to say**: `Uvicorn running on http://0.0.0.0:8000`

### **Step 2: Open NEW Terminal 2** (or new VS Code terminal)
```bash
cd "E:\GIAIC\Quarter 4\Hackathon\hackathon\website"
npm start
```

**Wait for it to open browser at**: `http://localhost:3000`

### **Step 3: Test in Browser**
1. Click purple button (bottom-right)
2. Ask: "What is ROS2?"
3. Should work now! ✅

---

## Verify Backend is Running

### Test 1: From Command Line
```bash
# In a NEW terminal (not the ones running the servers):
curl http://localhost:8000/health

# Should return:
# {"status":"ok","service":"RAG Chatbot API"}
```

### Test 2: In Browser
```
Visit: http://localhost:8000/docs
Should show Swagger API documentation
```

### Test 3: In Chatbot
```
Click purple button
Ask a question
Should get response in 3-5 seconds
```

---

## Common Mistakes

### ❌ Mistake 1: Not Activating Virtual Environment
```bash
# WRONG:
python -m uvicorn api_server:app --reload

# CORRECT:
.venv\Scripts\activate
python -m uvicorn api_server:app --reload
```

### ❌ Mistake 2: Only Running One Terminal
```
You NEED BOTH:
  Terminal 1: Backend API (port 8000)
  Terminal 2: Frontend Docusaurus (port 3000)
```

### ❌ Mistake 3: Running Backend on Wrong Port
```
# WRONG:
python -m uvicorn api_server:app --port 3000

# CORRECT:
python -m uvicorn api_server:app --port 8000
```

### ❌ Mistake 4: Running from Wrong Directory
```
# WRONG:
cd E:\GIAIC\Quarter 4\Hackathon\hackathon
python -m uvicorn api_server:app --reload

# CORRECT:
cd "E:\GIAIC\Quarter 4\Hackathon\hackathon\website"
python -m uvicorn api_server:app --reload
```

---

## Full Setup Checklist

- [ ] Open Terminal 1
- [ ] Navigate to: `E:\GIAIC\Quarter 4\Hackathon\hackathon\website`
- [ ] Activate venv: `.venv\Scripts\activate`
- [ ] Start backend: `python -m uvicorn api_server:app --reload --host 0.0.0.0 --port 8000`
- [ ] See: "Uvicorn running on http://0.0.0.0:8000"
- [ ] Open Terminal 2
- [ ] Navigate to: `E:\GIAIC\Quarter 4\Hackathon\hackathon\website`
- [ ] Start frontend: `npm start`
- [ ] Browser opens at `http://localhost:3000`
- [ ] Click purple button
- [ ] Ask question
- [ ] Get response ✅

---

## Terminal Window Layout (Recommended)

```
Your Screen:

┌─────────────────────────┬─────────────────────────┐
│                         │                         │
│  Terminal 1             │  Terminal 2             │
│  (Backend API)          │  (Frontend)             │
│                         │                         │
│  uvicorn running...     │  npm start...           │
│  Ready on :8000         │  Ready on :3000         │
│                         │  Browser opens          │
│  Keep running!          │  Keep running!          │
│                         │                         │
└─────────────────────────┴─────────────────────────┘
              ↓
     Both MUST be running!
```

---

## Troubleshooting Backend Start

### Problem: "ModuleNotFoundError"
```
Solution:
  1. Make sure venv is activated: .venv\Scripts\activate
  2. Install dependencies: pip install -r requirements.txt
  3. Try again: python -m uvicorn api_server:app --reload
```

### Problem: "Port 8000 already in use"
```
Solution:
  1. Find what's using port 8000: netstat -ano | findstr :8000
  2. Kill it: taskkill /PID <PID> /F
  3. Or use different port: --port 8001
```

### Problem: "api_server.py: No such file"
```
Solution:
  Make sure you're in: E:\GIAIC\Quarter 4\Hackathon\hackathon\website
  Check file exists: ls api_server.py
```

### Problem: CORS Error in Browser
```
Solution:
  Make sure backend is running on 0.0.0.0:8000
  Check CORS is enabled in api_server.py
  Should be:
    --host 0.0.0.0 --port 8000
```

---

## Quick Reference

| What | Command | Port |
|-----|---------|------|
| **Backend** | `python -m uvicorn api_server:app --reload --host 0.0.0.0 --port 8000` | 8000 |
| **Frontend** | `npm start` | 3000 |
| **Test API** | `curl http://localhost:8000/health` | 8000 |
| **Browser** | Visit `http://localhost:3000` | 3000 |

---

## Summary

Your **frontend is running on port 3000** ✅
Your **backend is NOT running on port 8000** ❌

**Fix**: Start the backend server in Terminal 1:
```bash
.venv\Scripts\activate
python -m uvicorn api_server:app --reload --host 0.0.0.0 --port 8000
```

Then **both** frontend and backend will work together! 🎉

---

Do this now and your chatbot will work perfectly!
