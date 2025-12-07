# ✅ Error Fixed: "process is not defined"

## Problem Description

You were seeing this error:
```
ReferenceError: process is not defined
at eval (webpack-internal:///./src/components/RAGChatbot.jsx:13:14)
```

## Root Cause

The chatbot component was trying to access `process.env` directly in browser JavaScript, but:
- `process` is a Node.js global object
- Docusaurus doesn't expose it in the browser
- Browser JavaScript doesn't have access to Node.js APIs

## Solution Applied ✅

Created a proper configuration system that works in the browser:

### New Files Created

1. **`src/config/chatbotConfig.js`** - Safe environment configuration
   - Detects if running on localhost (development)
   - Uses appropriate API endpoint for each environment
   - Safely handles browser environment

2. **Updated `src/components/RAGChatbot.jsx`**
   - Now imports the new config module
   - Uses `getChatbotConfig()` instead of `process.env`
   - Works properly in browser

### How It Works

**Smart Detection**:
```javascript
// Automatically detects environment
const isDevelopment = window.location.hostname === 'localhost' ||
                      window.location.hostname === '127.0.0.1';

// Uses correct endpoint for each environment
apiEndpoint: isDevelopment
  ? 'http://localhost:8000'           // Local development
  : 'https://api.your-domain.com'     // Production
```

**Three Configuration Methods** (in order of priority):
1. Window object: `window.__CHATBOT_CONFIG__` (for advanced deployment)
2. Automatic detection: Checks if on localhost
3. Config file: Editable in `src/config/chatbotConfig.js`

## How to Apply This Fix

### Quick Steps

```bash
# 1. Stop npm start (Ctrl+C in Terminal 2)

# 2. Clean cache and reinstall
npm cache clean --force
npm install

# 3. Start servers again
# Terminal 1: Backend
python -m uvicorn api_server:app --reload

# Terminal 2: Frontend
npm start

# 4. Hard refresh browser (Ctrl+Shift+R)
```

### Verification

After restarting, check:
1. ✅ No "process is not defined" error in console
2. ✅ Purple chat button appears (bottom-right)
3. ✅ Browser console is clean (F12 → Console)
4. ✅ Chatbot responds to questions

## Configuration for Different Environments

### Local Development (Default)
```javascript
// No changes needed!
// Automatically uses: http://localhost:8000
```

### Production Deployment
Edit `src/config/chatbotConfig.js`:

```javascript
return {
  apiEndpoint: isDevelopment
    ? 'http://localhost:8000'
    : 'https://your-production-api.com'  // ← Change this!
};
```

See `CONFIGURE_API_ENDPOINT.md` for detailed instructions.

## Files Modified

```
✅ src/components/RAGChatbot.jsx
   - Line 3: Added import of getChatbotConfig
   - Line 31-32: Changed from process.env to config function

✅ NEW: src/config/chatbotConfig.js
   - New configuration module
   - Safe browser-compatible environment detection
   - Automatic localhost detection
```

## Testing the Fix

### Browser Console Check
1. Press F12 to open DevTools
2. Click Console tab
3. You should see **no errors**
4. Previous "process is not defined" should be gone

### Chatbot Test
1. Click the purple button (bottom-right)
2. Type: "What is ROS2?"
3. You should get an answer
4. No errors in console

### API Test
```bash
python test_chatbot.py
```
All tests should pass!

## If Error Still Appears

Try these steps in order:

**Step 1**: Hard refresh browser
- Windows: Ctrl+Shift+R
- Mac: Cmd+Shift+R

**Step 2**: Clear browser cache
- Press F12
- Click the three dots menu
- Settings → Clear cache

**Step 3**: Reinstall everything
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm start
```

**Step 4**: Check for typos
- Make sure `src/config/chatbotConfig.js` exists
- Make sure `src/components/RAGChatbot.jsx` imports it correctly

**Step 5**: Check browser compatibility
- Use Chrome, Firefox, Safari, or Edge
- Make sure JavaScript is enabled

## Technical Details

### What Changed in RAGChatbot.jsx

**Before (Broken)**:
```javascript
const endpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
// ❌ process is undefined in browser!
```

**After (Fixed)**:
```javascript
import getChatbotConfig from '../config/chatbotConfig';

const config = getChatbotConfig();
const endpoint = config.apiEndpoint;
// ✅ Works in browser!
```

### Why This Approach

1. **Browser-safe**: No Node.js globals required
2. **Automatic detection**: Detects localhost vs production
3. **Flexible**: Supports multiple configuration methods
4. **Production-ready**: Easy to configure for deployment
5. **Simple**: Minimal code changes

## Related Documentation

- `IMMEDIATE_ACTION.md` - Step-by-step fix guide
- `CONFIGURE_API_ENDPOINT.md` - Configure for production
- `FIX_PROCESS_ERROR.md` - Technical explanation
- `RAG_CHATBOT_SETUP.md` - Complete setup guide

## Summary

✅ **Error is fixed**
✅ **Configuration system is improved**
✅ **Works in development and production**
✅ **Ready to use**

### Next Steps
1. Apply the fix (clean npm, reinstall, restart)
2. Hard refresh browser
3. Test the chatbot
4. Enjoy your AI-powered book!

---

**Status**: ✅ FIXED - Ready to use!

Any remaining issues? Check `IMMEDIATE_ACTION.md` for detailed step-by-step instructions.
