# Simple Setup - Start Backend Server

Your frontend is running on port 3000 ✅

Now start the backend on port 8000 in a **NEW terminal window**.

---

## What You Have Now

```
✅ Frontend running on http://localhost:3000
❌ Backend NOT running on http://localhost:8000
```

## What You Need to Do

Start the backend in a **NEW terminal window** (keep the npm one running):

### **New Terminal - Backend Server**

```bash
cd "E:\GIAIC\Quarter 4\Hackathon\hackathon\website"
.venv\Scripts\activate
python -m uvicorn api_server:app --reload --host 0.0.0.0 --port 8000
```

**Wait for this message**:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

**Don't close this terminal - keep it running!**

---

## Then Test

1. Go back to your browser: `http://localhost:3000`
2. Click the **purple button** (bottom-right corner)
3. Type: `What is ROS2?`
4. Press Enter
5. **Should get an answer in 3-5 seconds** ✅

---

## Visual Setup

```
Your Screen Now:

┌─────────────────────────┬─────────────────────────┐
│                         │                         │
│  Terminal 1             │  Browser                │
│  (npm start)            │  http://localhost:3000  │
│                         │                         │
│  Already running ✅     │  Shows your book ✅     │
│  Don't close!           │  Purple button visible  │
│                         │                         │
└─────────────────────────┴─────────────────────────┘

What You Need to Do:

1. Open a NEW terminal (or split terminal)
2. Run the backend command (see below)
3. Wait for "Uvicorn running on :8000"
4. Keep both running
5. Go to browser and click purple button
6. Ask a question
7. Get answer! ✅
```

---

## Commands You Need

### **Terminal 1** (Already Running - Don't Touch)
```
npm start
Listening on http://localhost:3000
```

### **Terminal 2** (NEW - Start This)
```bash
cd "E:\GIAIC\Quarter 4\Hackathon\hackathon\website"
.venv\Scripts\activate
python -m uvicorn api_server:app --reload --host 0.0.0.0 --port 8000
```

---

## Step-by-Step

### Step 1: Copy the command
```
cd "E:\GIAIC\Quarter 4\Hackathon\hackathon\website" && .venv\Scripts\activate && python -m uvicorn api_server:app --reload --host 0.0.0.0 --port 8000
```

### Step 2: Open NEW Terminal
- Click VS Code terminal dropdown → "New Terminal"
- Or use: Ctrl + Shift + `

### Step 3: Paste & Run
Paste the command and press Enter

### Step 4: Wait for Message
```
Uvicorn running on http://0.0.0.0:8000 ✓
Application startup complete ✓
```

### Step 5: Test in Browser
- Go to http://localhost:3000
- Click purple button
- Ask: "What is ROS2?"
- Get answer! 🎉

---

## That's It!

Once both are running:
- Frontend: http://localhost:3000 ✅
- Backend: http://localhost:8000 ✅
- Chatbot works perfectly! 🎉

---

## Troubleshooting

### "ModuleNotFoundError"
Make sure virtual environment is activated:
```bash
.venv\Scripts\activate
```

### "Port 8000 already in use"
Use a different port:
```bash
python -m uvicorn api_server:app --reload --host 0.0.0.0 --port 8001
```
(Then update config to use port 8001)

### "Connection refused"
Make sure backend terminal is still showing:
```
Uvicorn running on http://0.0.0.0:8000
```

---

## Summary

You have: Frontend on 3000 ✅
You need: Backend on 8000
How: Run command in new terminal
Then: Chatbot works! 🎉

**Go open a new terminal and run the backend command!**
