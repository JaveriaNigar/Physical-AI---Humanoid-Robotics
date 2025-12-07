// Chatbot Configuration
// This file handles API endpoint configuration for different environments

const getChatbotConfig = () => {
  // Check if running in browser
  if (typeof window === 'undefined') {
    return {
      apiEndpoint: process.env.CHATBOT_API_URL || 'http://localhost:8000',
    };
  }

  // Try to get from window object first (set by server or build)
  if (window.__CHATBOT_CONFIG__) {
    return window.__CHATBOT_CONFIG__;
  }

  // Determine environment based on hostname
  const isDevelopment = window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1';

  const isProduction = window.location.hostname === 'physical-ai-humanoid-robotics-book-tan.vercel.app';

  // Default configuration based on environment
  // Use port 8000 for the backend API by default (FastAPI / Uvicorn)
  let apiEndpoint = 'http://localhost:8000'; // Default for local dev

  if (isProduction) {
    // =========================================================================
    // IMPORTANT: FOR PRODUCTION, YOU MUST DEPLOY YOUR BACKEND SEPARATELY!
    // =========================================================================
    // The chatbot WILL NOT WORK on Vercel until you do this.
    // 1. Deploy your FastAPI backend to a service like Railway, Render, or Heroku.
    //    (See DEPLOY_BACKEND_API.md for instructions)
    // 2. Get your backend URL (e.g., https://my-chatbot-api.up.railway.app).
    // 3. Replace the placeholder below with your actual backend URL.
    //
    apiEndpoint = 'https://your-backend-api-goes-here.com'; // <-- REPLACE THIS
    // =========================================================================

  } else if (isDevelopment) {
    // Local development
    apiEndpoint = 'http://localhost:8000';
  }

  return {
    apiEndpoint: apiEndpoint,
  };
};

export default getChatbotConfig;
