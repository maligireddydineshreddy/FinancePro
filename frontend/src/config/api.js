// API Configuration
// Uses environment variables in production, falls back to localhost in development

const API_CONFIG = {
  // Backend API URL (changed to port 3001 to avoid conflict with ML API on 8000)
  BACKEND_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',

  // ML API URL
  ML_API_URL: import.meta.env.VITE_ML_API_URL || 'http://localhost:8000',
};

/**
 * Warm up the ML API on app load.
 * Render free-tier services sleep after 15 min of inactivity.
 * This "wake-up" ping ensures the service starts spinning up
 * BEFORE the user navigates to stock pages.
 */
export const warmupMLAPI = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    await fetch(`${API_CONFIG.ML_API_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
      mode: 'cors',
    });
    clearTimeout(timeoutId);
    console.log('[Warm-up] ML API is awake');
  } catch {
    // Ignore errors — the service may not have /health yet
    // The important thing is we sent the request to wake it up
    console.log('[Warm-up] ML API pinged (may still be waking up)');
  }
};

export default API_CONFIG;
