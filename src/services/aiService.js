import axios from "axios";

export async function getCoachInsights(payload) {
  const { data } = await axios.post("/api/coach", payload);
  return data;
}

export async function askLifeAgent(payload) {
  const { data } = await axios.post("/api/agent", payload);
  return data;
}
