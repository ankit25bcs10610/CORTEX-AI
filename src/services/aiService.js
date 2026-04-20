import axios from "axios";

// In development, this is empty/null, so we use the relative path
// In production, this should be your Railway URL (e.g., https://xxx.railway.app)
const VERCEL_API_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  // If we have a dedicated API URL, use it; otherwise fallback to relative /api
  baseURL: VERCEL_API_URL || "",
  headers: {
    "Content-Type": "application/json"
  }
});

export async function getCoachInsights(payload) {
  try {
    // Explicitly using /api prefix to match server/index.js routes
    // This works both locally (via proxy) and in production (via full URL)
    const { data } = await api.post("/api/coach", payload);
    return data;
  } catch (error) {
    console.error("Coach API Connection Failure:", error.response?.data || error.message);
    throw error;
  }
}

export async function askLifeAgent(payload) {
  try {
    const { data } = await api.post("/api/agent", payload);
    return data;
  } catch (error) {
    console.error("Agent API Connection Failure:", error.response?.data || error.message);
    throw error;
  }
}
