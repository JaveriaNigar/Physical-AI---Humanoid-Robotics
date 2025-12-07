# Fixed: "process is not defined" Error

## ✅ Issue Resolved!

The error `ReferenceError: process is not defined` has been fixed.

### What Was Wrong

The original chatbot component tried to access `process.env.REACT_APP_API_ENDPOINT` directly in the browser. However:
- Docusaurus doesn't expose the `process` object in browser code
- Browser environment doesn't have access to Node.js globals

### What Changed

**Created a new configuration system:**

1. **New File**: `src/config/chatbotConfig.js`
   - Handles API endpoint configuration safely
   - Automatically detects localhost vs production
   - Uses sensible defaults

2. **Updated**: `src/components/RAGChatbot.jsx`
   - Imports the new config module
   - Uses `getChatbotConfig()` instead of `process.env`
   - Works in browser environment

### How to Use

**For Local Development** (No action needed!):
```bash
npm start
# Automatically uses http://localhost:8000
```

**For Production**:
Edit `src/config/chatbotConfig.js` and change:
```javascript
: 'https://your-production-api.com'  // ← Update this
```

See `CONFIGURE_API_ENDPOINT.md` for detailed instructions.

### Test It

1. Refresh your browser
2. You should **NOT** see the "process is not defined" error
3. Open browser console (F12) - should be clean
4. The purple chat button should appear (bottom-right)
5. Click it and try asking a question

### Files Changed

```
✓ src/components/RAGChatbot.jsx (fixed to use new config)
✓ src/config/chatbotConfig.js (new file with proper config)
```

### What to Do Now

1. **Hard refresh browser** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Clear browser cache** if needed
3. **Verify error is gone** - check console (F12)
4. **Test the chatbot** - click purple button

### If Error Still Appears

Try these steps:

**Step 1: Clear everything**
```bash
# Stop npm start (Ctrl+C)
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm start
```

**Step 2: Hard refresh browser**
- Windows/Linux: Ctrl+Shift+R
- Mac: Cmd+Shift+R
- Or clear browser cache completely

**Step 3: Check console**
- Press F12 to open DevTools
- Check Console tab for errors
- Should be empty now!

### The Fix Explained

**Before (Broken)**:
```javascript
const endpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
// ❌ process is not defined in browser!
```

**After (Fixed)**:
```javascript
import getChatbotConfig from '../config/chatbotConfig';

const config = getChatbotConfig();
const endpoint = config.apiEndpoint;
// ✅ Works in browser!
```

### Configuration Reference

Edit `src/config/chatbotConfig.js` to customize:

```javascript
return {
  apiEndpoint: isDevelopment
    ? 'http://localhost:8000'           // Local API
    : 'https://your-production-api.com' // Production API (change this!)
};
```

### Next Steps

1. ✅ Error is fixed
2. ✅ Restart `npm start`
3. ✅ Test the chatbot
4. ✅ Configure production endpoint (if deploying)

See `CONFIGURE_API_ENDPOINT.md` for production setup.

---

**Status**: ✅ FIXED - Ready to use!
