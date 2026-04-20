import { useMemo, useState } from "react";
import { Mic, Square, Volume2, Sparkles, Bot } from "lucide-react";
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
    <div className="space-y-8 pb-12">
      {/* Immersive AI Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo-900/10 border border-indigo-500/20 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full -ml-32 -mb-32 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">
              <Sparkles size={12} /> Neural Engine Online
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">Cortex-AI <span className="text-indigo-400">Coach</span></h1>
            <p className="text-slate-400 text-lg max-w-xl">Accelerate your growth with tactical strategy and high-impact guidance powered by your unique workspace context.</p>
          </div>
          
          <button 
            onClick={runCoach}
            disabled={loading}
            className={`group relative flex items-center justify-center p-1 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95 transition-all duration-300"}`}
          >
            <div className="bg-[#0a0d14] rounded-full p-8 md:p-10 flex flex-col items-center gap-2">
              <Bot size={48} className={`text-white transition-all duration-500 ${loading ? "animate-pulse" : "group-hover:rotate-12"}`} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{loading ? "Synchronizing..." : "Initialize"}</span>
            </div>
            {/* Spinning ring when loading */}
            {loading && (
              <div className="absolute inset-0 border-2 border-dashed border-white/30 rounded-full animate-spin-slow" />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Intelligence Output */}
        <div className="lg:col-span-8 space-y-6">
          {!result && !loading && (
            <div className="flex flex-col items-center justify-center py-20 rounded-[2.2rem] border-2 border-dashed border-slate-800 bg-slate-900/10">
              <Sparkles size={48} className="text-slate-700 mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest">Awaiting Neural Activation</p>
              <p className="text-slate-600 text-xs mt-2 italic">Click initialize above to generate your daily strategy</p>
            </div>
          )}

        {result ? (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-[2.2rem] bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 shadow-xl">
                 <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400"><Volume2 size={20} /></div>
                   <h3 className="text-sm font-black uppercase tracking-widest text-slate-200">Daily Execution Plan</h3>
                 </div>
                 <ul className="space-y-4">
                   {(result.dailyPlan || []).map((item, i) => (
                     <li key={i} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
                       <span className="text-indigo-400 font-bold shrink-0">0{i+1}.</span> {item}
                     </li>
                   ))}
                 </ul>
                 <div className="mt-8 flex gap-3">
                   <button className="flex-1 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all" onClick={() => speak((result.dailyPlan || []).join(". "))}>
                     Play Voice
                   </button>
                   <button className="px-4 border border-slate-800 text-slate-500 hover:text-white py-3 rounded-2xl transition-colors" onClick={stopSpeaking}>
                     <Square size={16} />
                   </button>
                 </div>
              </div>

              <div className="p-6 rounded-[2.2rem] bg-slate-900/40 border border-slate-800 shadow-xl">
                 <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400"><Sparkles size={20} /></div>
                   <h3 className="text-sm font-black uppercase tracking-widest text-slate-200">Neural Insights</h3>
                 </div>
                 <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Priority Focus</p>
                      <p className="text-sm text-slate-300">{(result.priorityRecommendations || []).slice(0, 1)[0]}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Habit Momentum</p>
                      <p className="text-sm text-slate-300">{(result.habitInsights || []).slice(0, 1)[0]}</p>
                    </div>
                    <div className="pt-4 border-t border-slate-800">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Productivity Score</p>
                       <p className="text-4xl font-black text-white">{result.productivityScore}<span className="text-xs text-slate-500 ml-2 font-normal">SYNCED</span></p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        ) : null}
        </div>

        {/* Interaction Hub: Right Side Sidebar on Desktop */}
        <div className="lg:col-span-4 space-y-6">
           {/* Memory Module */}
           <div className="p-6 rounded-[2.2rem] bg-[#0a0d14] border border-slate-800/80 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-2xl rounded-full -mr-12 -mt-12 pointer-events-none" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Neural Memory</h3>
              <div className="space-y-4">
                <input
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                  placeholder="Context for AI to remember..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      addMemory(e.currentTarget.value.trim(), "coach");
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <p className="text-[10px] text-slate-600 italic px-1">Example: "I focus best in the morning."</p>
              </div>
           </div>

           {/* Ask Anything Agent */}
           <div className="p-6 rounded-[2.2rem] bg-slate-900/40 border border-slate-800 shadow-xl flex flex-col h-[500px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-200 flex items-center gap-2">
                  <Bot size={16} className="text-indigo-400" /> Agent Chat
                </h3>
                {chatLoading && <div className="flex gap-1"><div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" /><div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" /><div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" /></div>}
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
                {!chat.length && (
                  <div className="text-center py-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-6">Awaiting Input</p>
                    <div className="space-y-2">
                      {quickChecks.map((q) => (
                        <button key={q} className="w-full text-left p-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-slate-400 text-xs hover:bg-indigo-500/10 hover:text-indigo-200 transition-all" onClick={() => sendMessage(q)}>
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {chat.map((item, idx) => (
                  <div key={idx} className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${item.role === "user" ? "ml-auto bg-indigo-500/10 border border-indigo-500/20 text-indigo-100" : "bg-slate-950 border border-slate-800 text-slate-300"}`}>
                    {item.text}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-10 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-slate-600 transition-all"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                    placeholder="Message agent..."
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-indigo-400 transition-colors" onClick={voiceToInput}><Mic size={14} /></button>
                </div>
                <button 
                  className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl shadow-lg transition-all active:scale-95" 
                  onClick={() => sendMessage()}
                >
                  <Sparkles size={14} />
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
