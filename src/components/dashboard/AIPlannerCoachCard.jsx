import { useState } from "react";
import { Bot, Sparkles } from "lucide-react";
import { useLifeStore } from "../../app/store";
import { askLifeAgent, getCoachInsights } from "../../services/aiService";
import { CardShell } from "./CardShell";

export function AIPlannerCoachCard() {
  const { tasks, habits, goals, learning, addTask, getRelevantMemories } = useLifeStore();
  const [loadingCoach, setLoadingCoach] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [coachSummary, setCoachSummary] = useState("Generate a coaching summary to get high-impact focus recommendations.");
  const [plan, setPlan] = useState([]);

  const runCoach = async () => {
    setLoadingCoach(true);
    try {
      const data = await getCoachInsights({
        tasks,
        habits,
        goals,
        learningItems: learning,
        memory: getRelevantMemories?.("coach priorities", 5) || [],
        history: { weekCompletedTasks: tasks.filter((t) => t.status === "Completed").length }
      });
      setCoachSummary(data?.summary || "No summary generated.");
    } finally {
      setLoadingCoach(false);
    }
  };

  const runPlanner = async () => {
    setLoadingPlan(true);
    try {
      const data = await askLifeAgent({
        message: "Create 5 concise high-impact tasks for this week based on my goals and learning items. Return one item per line.",
        context: {
          tasks,
          habits,
          goals,
          learningItems: learning,
          memory: getRelevantMemories?.("weekly planning", 5) || []
        }
      });
      const lines = (data?.reply || "")
        .split("\n")
        .map((x) => x.replace(/^[-*\d.\s]+/, "").trim())
        .filter(Boolean)
        .slice(0, 6);
      setPlan(lines);
    } finally {
      setLoadingPlan(false);
    }
  };

  const addPlanToTasks = () => {
    plan.forEach((title) => {
      addTask({
        title,
        priority: "High",
        status: "Pending",
        deadline: "",
        goalId: "",
        category: "AI Planned",
        notes: "Generated from Dashboard AI Planner + Coach"
      });
    });
    setPlan([]);
  };

  return (
    <CardShell
      title="AI Planner + Coach"
      className="bg-gradient-to-br from-cyan-500/15 via-sky-500/10 to-slate-900/90 border-cyan-400/30"
      action={<span className="inline-flex items-center gap-1 text-xs text-cyan-100"><Sparkles size={14} /> Unified AI</span>}
    >
      <div className="grid lg:grid-cols-2 gap-3">
        <div className="rounded-xl border border-cyan-400/20 bg-slate-950/40 p-3">
          <p className="text-xs uppercase tracking-wider text-cyan-200/80 mb-2">Coach Insight</p>
          <p className="text-sm text-slate-100 min-h-20">{coachSummary}</p>
          <button className="mt-3 badge border-[var(--accent-soft)] text-[var(--accent-text)]" onClick={runCoach}>
            {loadingCoach ? "Analyzing..." : "Refresh Coach"}
          </button>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3">
          <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">Auto Planner</p>
          <div className="space-y-1 min-h-20">
            {plan.map((item, i) => (
              <p key={i} className="text-sm text-slate-200">• {item}</p>
            ))}
            {!plan.length ? <p className="text-sm text-slate-500">Generate an AI task plan for this week.</p> : null}
          </div>
          <div className="mt-3 flex gap-2 flex-wrap">
            <button className="badge border-[var(--accent-soft)] text-[var(--accent-text)] inline-flex items-center gap-1" onClick={runPlanner}>
              <Bot size={14} /> {loadingPlan ? "Planning..." : "Generate Plan"}
            </button>
            <button disabled={!plan.length} className="badge disabled:opacity-50" onClick={addPlanToTasks}>
              Add Plan To Tasks
            </button>
          </div>
        </div>
      </div>
    </CardShell>
  );
}
