# Configure API Endpoint for Chatbot

The chatbot API endpoint can be configured for different environments. Follow this guide to set it up correctly.

## For Local Development (Default)

The chatbot is configured to use `http://localhost:8000` by default when running on:
- `http://localhost:3000`
- `http://127.0.0.1:3000`

**No additional configuration needed!** Just run:

```bash
# Terminal 1: Backend
python -m uvicorn api_server:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Frontend
npm start
```

---

## For Production Deployment

When deploying to production, you need to update the API endpoint.

### Option 1: Update Configuration File (Recommended)

Edit `src/config/chatbotConfig.js`:

```javascript
export const getChatbotConfig = () => {
  if (typeof window === 'undefined') {
    return { apiEndpoint: 'http://localhost:8000' };
  }

  if (window.__CHATBOT_CONFIG__) {
    return window.__CHATBOT_CONFIG__;
  }

  const isDevelopment = window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1';

  return {
    apiEndpoint: isDevelopment
      ? 'http://localhost:8000'
      : 'https://your-production-api.com',  // Change this!
  };
};
```

Change `'https://your-production-api.com'` to your actual API URL.

### Option 2: Set via HTML (For Advanced Users)

Add this before your Docusaurus app loads (in `docusaurus.config.js` or `static/index.html`):

```html
<script>
  window.__CHATBOT_CONFIG__ = {
    apiEndpoint: 'https://your-api-endpoint.com'
  };
</script>
```

### Option 3: Environment Variable (For Build-Time Configuration)

This method requires updating your build process. Not recommended for Docusaurus.

---

## How to Deploy Your Backend API

See `RAG_CHATBOT_SETUP.md` → "Deployment" section for:
- Railway deployment
- Render deployment
- Heroku deployment
- Docker deployment

Once deployed, update the endpoint above to match.

---

## Testing Your Configuration

1. Open browser DevTools (F12)
2. Go to Console tab
3. Type: `getChatbotConfig()`
4. You should see your endpoint logged
5. Try asking the chatbot a question
6. Check Network tab to see API requests going to the right URL

---

## Common Issues

### "Cannot reach API"
- Check endpoint URL is correct and public
- Verify CORS is enabled on backend
- Check backend is running and accessible from internet

### "API responds but answers are slow"
- This is normal (3-5 seconds)
- Check backend logs for errors
- Verify Qdrant and Cohere API are accessible

### "Chatbot shows on localhost but not production"
- Check if endpoint is accessible from production domain
- Verify CORS headers allow your production domain
- Add your domain to backend CORS whitelist

---

## Production Checklist

Before deploying to production:

- [ ] Update `src/config/chatbotConfig.js` with production API URL
- [ ] Verify backend is deployed and running
- [ ] Test API endpoint is accessible: `curl https://your-api/health`
- [ ] Add production domain to CORS whitelist in backend
- [ ] Build frontend: `npm run build`
- [ ] Deploy frontend to Vercel/hosting
- [ ] Test chatbot on production URL
- [ ] Monitor API usage and costs

---

## Quick Reference

**Local Development** (default):
- Frontend: `http://localhost:3000`
- API: `http://localhost:8000`
- No configuration needed!

**Production**:
- Update `src/config/chatbotConfig.js`
- Set `apiEndpoint` to your deployed backend URL
- Rebuild: `npm run build`
- Deploy frontend

---

For more help, see `RAG_CHATBOT_SETUP.md` → Deployment section.
