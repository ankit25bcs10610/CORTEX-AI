import { useMemo, useState } from "react";
import { Mic, Square, Volume2 } from "lucide-react";
import { useLifeStore } from "../../app/store";
import { SectionCard } from "../../components/SectionCard";
import { PageIntro } from "../../components/dashboard/PageIntro";
import { askLifeAgent, getCoachInsights } from "../../services/aiService";

const quickChecks = [
  "Give me a 60-second motivational check-in for today.",
  "What is my single highest-impact task right now?",
  "I feel distracted. Give me a fast focus reset plan."
];

export function CoachPage() {
  const state = useLifeStore();
  const addMemory = useLifeStore((s) => s.addMemory);
  const getRelevantMemories = useLifeStore((s) => s.getRelevantMemories);
  const [result, setResult] = useState(null);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const speechSupported = useMemo(() => typeof window !== "undefined" && "speechSynthesis" in window, []);
  const recognitionSupported = useMemo(() => typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition), []);

  const speak = (text) => {
    if (!speechSupported || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
  };

  const voiceToInput = () => {
    if (!recognitionSupported) return;
    const R = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new R();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const transcript = e.results?.[0]?.[0]?.transcript || "";
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    rec.start();
  };

  const runCoach = async () => {
    setLoading(true);
    try {
      const data = await getCoachInsights({
        tasks: state.tasks,
        habits: state.habits,
        goals: state.goals,
        learningItems: state.learning,
        memory: getRelevantMemories("daily plan productivity habits goals", 6),
        history: { weekCompletedTasks: state.tasks.filter((t) => t.status === "Completed").length }
      });
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (forcedText = null) => {
    const text = (forcedText || input).trim();
    if (!text) return;
    if (!forcedText) setInput("");
    setChat((prev) => [...prev, { role: "user", text }]);
    setChatLoading(true);
    try {
      const data = await askLifeAgent({
        message: text,
        context: {
          tasks: state.tasks,
          habits: state.habits,
          goals: state.goals,
          learningItems: state.learning,
          memory: getRelevantMemories(text, 6)
        }
      });
      const reply = data.reply || "No response.";
      setChat((prev) => [...prev, { role: "assistant", text: reply }]);
      speak(reply);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div>
      <PageIntro title="AI Coach" subtitle="Your strategic advisor for daily execution and weekly optimization." chips={["Daily plan", "Risk alerts", "Priority guidance", "Voice coach"]} />
      <div className="space-y-4">
        <SectionCard title="Cortex-AI Intelligence" subtitle="Practical, specific and high-impact guidance" right={<button className="badge border-[var(--accent-soft)]" onClick={runCoach}>{loading ? "Analyzing..." : "Generate Insights"}</button>}>
          <p className="text-slate-300 text-sm mb-3">AI analyzes tasks, habits, goals, learning progress, and deadline risks to produce your daily plan and weekly improvement strategy.</p>
          <div className="flex flex-wrap gap-2">
            <button className="badge border-[var(--accent-soft)] text-[var(--accent-text)] inline-flex items-center gap-1" onClick={() => speak((result?.dailyPlan || []).join(". "))}>
              <Volume2 size={14} /> Speak Daily Plan
            </button>
            <button className="badge inline-flex items-center gap-1" onClick={stopSpeaking}><Square size={14} /> Stop Voice</button>
          </div>
        </SectionCard>

        {result ? (
          <div className="grid md:grid-cols-2 gap-4">
            {["dailyPlan", "priorityRecommendations", "habitInsights", "goalInsights", "learningSuggestions"].map((k) => (
              <SectionCard key={k} title={k.replace(/[A-Z]/g, (m) => ` ${m}`).replace(/^./, (c) => c.toUpperCase())}>
                <ul className="space-y-2 text-sm text-slate-200">{(result[k] || []).map((item, i) => <li key={i}>• {item}</li>)}</ul>
              </SectionCard>
            ))}
            <SectionCard title="Productivity Score"><p className="text-5xl font-bold text-[var(--accent)]">{result.productivityScore}</p></SectionCard>
            <SectionCard title="Summary"><p className="text-slate-200">{result.summary}</p></SectionCard>
          </div>
        ) : null}

        <SectionCard title="AI Voice Coach" subtitle="Speak daily plans and run quick motivational check-ins.">
          <div className="flex flex-wrap gap-2 mb-3">
            {quickChecks.map((q) => (
              <button key={q} className="badge border-[var(--accent-soft)]" onClick={() => sendMessage(q)}>{q}</button>
            ))}
          </div>
          {!speechSupported ? <p className="text-xs text-amber-200 mb-2">Speech synthesis is not supported in this browser.</p> : null}
          {!recognitionSupported ? <p className="text-xs text-amber-200 mb-2">Voice input is not supported in this browser.</p> : null}
        </SectionCard>

        <SectionCard title="Coach Memory (RAG Lite)" subtitle="Store insights and context the AI coach should remember.">
          <div className="flex gap-2">
            <input
              className="flex-1 panel-input rounded-lg px-3 py-2"
              placeholder="Example: I focus best from 9-11 AM and prefer coding before meetings."
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  addMemory(e.currentTarget.value.trim(), "coach");
                  e.currentTarget.value = "";
                }
              }}
            />
            <button
              className="badge border-[var(--accent-soft)] text-[var(--accent-text)]"
              onClick={() => addMemory("User requested stronger accountability and shorter daily plans.", "coach")}
            >
              Save Sample
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Ask Anything Agent" subtitle="Chat with your in-app AI assistant about productivity, planning, learning, or life strategy.">
          <div className="rounded-xl border border-[var(--panel-border)] bg-black/20 p-3 h-72 overflow-y-auto space-y-3 mb-3">
            {!chat.length ? <p className="text-sm text-slate-400">Try: "Plan my next 3 hours" or "How do I recover from missed habits this week?"</p> : null}
            {chat.map((item, idx) => (
              <div key={idx} className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${item.role === "user" ? "ml-auto bg-[var(--accent-bg)] border border-[var(--accent-soft)]" : "bg-[var(--panel)] border border-[var(--panel-border)]"}`}>
                {item.text}
              </div>
            ))}
            {chatLoading ? <p className="text-xs text-slate-400">Cortex-AI Agent is thinking...</p> : null}
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 panel-input rounded-lg px-3 py-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Ask anything..."
            />
            <button className="badge" onClick={voiceToInput}><Mic size={14} /></button>
            <button className="badge border-[var(--accent-soft)] text-white px-4" onClick={() => sendMessage()}>
              Send
            </button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
