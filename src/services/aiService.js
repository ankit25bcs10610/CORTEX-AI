import axios from "axios";

// In development, Vite proxies '/api' to localhost:8787
// In production, users must set VITE_API_BASE_URL to their deployed backend
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export async function getCoachInsights(payload) {
  try {
    const { data } = await api.post("/coach", payload);
    return data;
  } catch (error) {
    console.error("Coach API Connection Failure:", error.response?.data || error.message);
    throw error;
  }
}

export async function askLifeAgent(payload) {
  try {
    const { data } = await api.post("/agent", payload);
    return data;
  } catch (error) {
    console.error("Agent API Connection Failure:", error.response?.data || error.message);
    throw error;
  }
}
