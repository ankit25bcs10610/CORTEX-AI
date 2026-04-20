import { useState } from "react";
import { Bot, Sparkles, Brain, Cpu, Terminal, Layers } from "lucide-react";
import { useLifeStore } from "../../app/store";
import { askLifeAgent, getCoachInsights } from "../../services/aiService";
import { CardShell } from "./CardShell";

export function AIPlannerCoachCard() {
  const { tasks, habits, goals, learning, addTask, getRelevantMemories } = useLifeStore();
  const [loadingCoach, setLoadingCoach] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [coachSummary, setCoachSummary] = useState("Awaiting neural synchronization for high-impact focus recommendations.");
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
      title="Intelligence Hub"
      className="bg-gradient-to-br from-cyan-600/10 via-blue-900/5 to-slate-900/90 border-cyan-500/20"
      action={<div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest"><Cpu size={12} /> Core 01 Synced</div>}
    >
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Coach Insight Terminal */}
        <div className="p-5 rounded-[2rem] bg-slate-950/60 border border-slate-900 relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
             <Brain size={48} />
          </div>
          <div className="flex items-center gap-2 mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
             <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest shadow-[0_0_10px_rgba(34,211,238,0.5)]">AI Insight Stream</p>
          </div>
          <p className="text-sm text-slate-100 font-medium leading-relaxed min-h-[100px] mb-6">{coachSummary}</p>
          <button 
             className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-3 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2" 
             onClick={runCoach}
             disabled={loadingCoach}
          >
            {loadingCoach ? <Terminal size={14} className="animate-pulse" /> : <Sparkles size={14} />}
            {loadingCoach ? "SYNCHRONIZING..." : "REFRESH INSIGHTS"}
          </button>
        </div>

        {/* Tactical Planner Module */}
        <div className="p-5 rounded-[2rem] bg-slate-950/60 border border-slate-900 relative group overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <Bot size={48} />
           </div>
          <div className="flex items-center gap-2 mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
             <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Tactical Sequence Generator</p>
          </div>
          
          <div className="space-y-2 min-h-[100px] mb-6">
            {plan.map((item, i) => (
              <div key={i} className="flex gap-3 items-start p-2 rounded-lg bg-white/5 border border-white/5 group/line hover:bg-white/10 transition-all">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                 <p className="text-xs font-bold text-slate-200 leading-tight">{item}</p>
              </div>
            ))}
            {!plan.length ? (
               <div className="flex flex-col items-center justify-center h-[100px] opacity-20 capitalize italic">
                  <p className="text-xs">Awaiting sequence generation...</p>
               </div>
            ) : null}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
               className="bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest" 
               onClick={runPlanner}
               disabled={loadingPlan}
            >
              {loadingPlan ? "PLANNING..." : "GENERATE PLAN"}
            </button>
            <button 
               disabled={!plan.length} 
               className="bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest" 
               onClick={addPlanToTasks}
            >
              <Layers size={14} /> COMMIT PLAN
            </button>
          </div>
        </div>
      </div>
    </CardShell>
  );
}
