import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const promptTemplate = `You are Cortex-AI Intelligence, a practical and motivational productivity assistant.
Analyze the user's life data and return helpful, specific, actionable insights.
Return the response in strict JSON format:
{
  "dailyPlan": ["string"],
  "priorityRecommendations": ["string"],
  "habitInsights": ["string"],
  "goalInsights": ["string"],
  "learningSuggestions": ["string"],
  "productivityScore": number,
  "summary": "string"
}
Rules:
- Be specific and mention actual items from user data.
- Do not give generic advice.
- Keep recommendations realistic for today.
- Be concise and motivational.
- Focus on high-impact actions.`;

const groqModel = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const openaiModel = process.env.OPENAI_MODEL || "gpt-4.1-mini";

function getClientAndModel() {
  const provider = (process.env.LLM_PROVIDER || "mock").toLowerCase();
  if (provider === "groq" && process.env.GROQ_API_KEY) {
    return {
      client: new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1"
      }),
      model: groqModel
    };
  }

  if (provider === "openai" && process.env.OPENAI_API_KEY) {
    return {
      client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
      model: openaiModel
    };
  }

  return null;
}

function mockInsights(data) {
  const overdue = data.tasks.filter((t) => t.status !== "Completed" && t.deadline && t.deadline < new Date().toISOString().slice(0, 10));
  const high = data.tasks.filter((t) => t.priority === "High" && t.status !== "Completed");
  const weakHabit = data.habits.find((h) => (h.streak || 0) < 2);
  const slowLearning = data.learningItems.find((i) => (i.progress || 0) < 40 && i.status !== "Completed");

  return {
    dailyPlan: [
      high[0] ? `Start with: ${high[0].title}` : "Start with your most strategic open task.",
      overdue[0] ? `Clear overdue item: ${overdue[0].title}` : "No overdue tasks; protect momentum with deep work.",
      "Block 2 focused sessions of 45 minutes each."
    ],
    priorityRecommendations: [
      high.length ? `${high.length} high-priority tasks are open; finish one before low-priority admin.` : "Priorities are balanced today.",
      "Do not schedule more than 3 major tasks for today."
    ],
    habitInsights: [
      weakHabit ? `Your ${weakHabit.title} habit streak is fragile. Complete a short version today.` : "Habit consistency is strong this week.",
      "Attach habit completion to an existing trigger time to reduce misses."
    ],
    goalInsights: [
      data.goals[0] ? `Advance '${data.goals[0].title}' with one measurable milestone today.` : "Create one clear short-term goal to improve direction.",
      "Tie at least one daily task to your top goal."
    ],
    learningSuggestions: [
      slowLearning ? `Progress is slow on '${slowLearning.title}'. Schedule a 45-minute focused learning block tomorrow.` : "Learning velocity is healthy; maintain consistency.",
      "Convert one learning item into a practical output this week."
    ],
    productivityScore: Math.max(25, Math.min(95, 60 + data.history.weekCompletedTasks * 3 - overdue.length * 4)),
    summary: "Focus on one high-impact task, protect habits, and reduce deadline risk to compound progress this week."
  };
}

app.post("/api/coach", async (req, res) => {
  const payload = req.body;
  const runtime = getClientAndModel();
  if (!runtime) {
    return res.json(mockInsights(payload));
  }

  try {
    const response = await runtime.client.chat.completions.create({
      model: runtime.model,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: promptTemplate },
        { role: "user", content: JSON.stringify(payload) }
      ]
    });

    const parsed = JSON.parse(response.choices[0].message.content || "{}");
    return res.json(parsed);
  } catch (error) {
    return res.status(500).json({ error: "AI coach failed", details: error.message });
  }
});

app.post("/api/agent", async (req, res) => {
  const { message, context } = req.body || {};
  if (!message || !String(message).trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  const runtime = getClientAndModel();
  if (!runtime) {
    const focusHint = context?.tasks?.length
      ? ` You currently have ${context.tasks.length} tasks in Cortex-AI.`
      : "";
    return res.json({
      reply: `Cortex-AI Agent (mock): ${String(message).trim()}${focusHint} I can help you plan tasks, habits, goals, learning, and daily focus.`
    });
  }

  try {
    const response = await runtime.client.chat.completions.create({
      model: runtime.model,
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content:
            "You are Cortex-AI Agent, a practical assistant for productivity, planning, learning, and personal execution. Give specific, concise, actionable responses."
        },
        {
          role: "user",
          content: JSON.stringify({ message, context })
        }
      ]
    });

    return res.json({ reply: response.choices[0]?.message?.content || "No response generated." });
  } catch (error) {
    return res.status(500).json({ error: "Agent failed", details: error.message });
  }
});

const port = Number(process.env.PORT || 8787);

app.get("/", (req, res) => {
  res.send("Cortex-AI API Online");
});

app.listen(port, () => {
  console.log(`Cortex-AI API running on http://localhost:${port}`);
});
