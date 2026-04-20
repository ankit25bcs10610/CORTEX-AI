import { useMemo, useRef, useState } from "react";
import { Clock, Calendar, AlertCircle, FileUp, FileDown, ShieldCheck, Plus, Sparkles, Wand2, CalendarDays } from "lucide-react";
import { askLifeAgent } from "../../services/aiService";
import { useLifeStore } from "../../app/store";

const hours = Array.from({ length: 14 }).map((_, i) => `${(i + 8).toString().padStart(2, "0")}:00`);

export function SchedulePage() {
  const { tasks, habits, goals, learning, addTask } = useLifeStore();
  const [blocks, setBlocks] = useState([
    { id: crypto.randomUUID(), title: "Deep Work", start: "09:00", end: "10:30", color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30" },
    { id: crypto.randomUUID(), title: "Review Sprint", start: "18:00", end: "18:30", color: "from-indigo-500/20 to-purple-500/10 border-indigo-500/30" }
  ]);
  const [form, setForm] = useState({ title: "", start: "13:00", end: "14:00", color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30" });
  const [reflection, setReflection] = useState("");
  const [review, setReview] = useState("");
  const [loadingReview, setLoadingReview] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const fileRef = useRef(null);

  const sorted = useMemo(() => [...blocks].sort((a, b) => a.start.localeCompare(b.start)), [blocks]);

  const risks = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const overdue = tasks.filter((t) => t.deadline && t.deadline < today && t.status !== "Completed" && t.status !== "Skipped");
    const weakHabits = habits.filter((h) => (h.streak || 0) < 2);
    return [
      ...overdue.slice(0, 3).map((t) => `Overdue task: ${t.title}`),
      ...weakHabits.slice(0, 3).map((h) => `Habit streak risk: ${h.title || h.name}`)
    ];
  }, [tasks, habits]);

  const addBlock = () => {
    if (!form.title.trim()) return;
    setBlocks((prev) => [...prev, { ...form, id: crypto.randomUUID() }]);
    setForm({ ...form, title: "" });
  };

  const exportIcs = () => {
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Cortex-AI//Schedule Export//EN"];
    tasks.filter((t) => t.deadline).forEach((t) => {
      const date = String(t.deadline).replace(/-/g, "");
      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${t.id}@cortex-ai`);
      lines.push(`DTSTART;VALUE=DATE:${date}`);
      lines.push(`SUMMARY:${(t.title || "Task").replace(/[\n\r]/g, " ")}`);
      lines.push("END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    const blob = new Blob([lines.join("\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cortex-ai-schedule-${new Date().toISOString().slice(0, 10)}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const importIcs = async (file) => {
    if (!file) return;
    const text = await file.text();
    const blocksText = text.split("BEGIN:VEVENT").slice(1);
    blocksText.forEach((block) => {
      const summary = (block.match(/SUMMARY:(.*)/) || [])[1]?.trim();
      const dt = (block.match(/DTSTART;VALUE=DATE:(\d{8})/) || [])[1];
      if (!summary || !dt) return;
      addTask({ title: summary, priority: "Medium", status: "Pending", deadline: `${dt.slice(0,4)}-${dt.slice(4,6)}-${dt.slice(6,8)}`, category: "Schedule Import", notes: "Imported from ICS" });
    });
  };

  const enableAlerts = async () => {
    if (!("Notification" in window)) return;
    const p = await Notification.requestPermission();
    if (p === "granted") setAlertsEnabled(true);
  };

  const runRiskCheck = () => {
    if (!alertsEnabled || !("Notification" in window)) return;
    risks.slice(0, 2).forEach((msg, i) => setTimeout(() => new Notification("Cortex-AI Schedule Alert", { body: msg }), i * 450));
  };

  const generateReview = async () => {
    setLoadingReview(true);
    try {
      const data = await askLifeAgent({
        message: `Create weekly review + next-week plan. Reflection: ${reflection || "No extra notes"}`,
        context: { tasks, habits, goals, learningItems: learning }
      });
      setReview(data.reply || "No review generated.");
    } finally {
      setLoadingReview(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Immersive Temporal Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo-900/10 border border-indigo-500/20 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full -ml-32 -mb-32 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-4">
              <Clock size={12} className="animate-pulse" /> Temporal Sync Engine
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">Schedule <span className="text-cyan-400">Hub</span></h1>
            <p className="text-slate-400 text-lg max-w-xl">Optimize your lifecycle with unified time-blocking, risk mitigation, and strategic review.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Time Blocked</p>
                <p className="text-3xl font-black text-white">{sorted.length * 1.5} <span className="text-sm font-normal text-slate-500">Hours</span></p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Planning Column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-8 rounded-[2.2rem] bg-slate-900/40 border border-slate-800 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
               <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400"><Plus size={22} /></div>
               <h2 className="text-lg font-black uppercase tracking-tight text-white">Create Block</h2>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Objective</label>
                <input 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all placeholder:text-slate-700" 
                  placeholder="e.g. Deep Work: AI Patterns" 
                  value={form.title} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Start</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })}>{hours.map((h) => <option key={h}>{h}</option>)}</select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">End</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })}>{hours.map((h) => <option key={h}>{h}</option>)}</select>
                </div>
              </div>
              <button 
                onClick={addBlock} 
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Clock size={18} /> ACTIVATE BLOCK
              </button>
            </div>
          </div>

          <div className="p-8 rounded-[2.2rem] bg-indigo-900/10 border border-indigo-500/20 shadow-2xl">
             <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400"><CalendarDays size={22} /></div>
                <h2 className="text-lg font-black uppercase tracking-tight text-white">Active Timeline</h2>
             </div>
             <div className="space-y-4">
                {sorted.length === 0 && <p className="text-center py-10 text-slate-600 text-sm italic">No active blocks synchronized</p>}
                {sorted.map((b) => (
                  <div key={b.id} className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-r p-4 transition-all hover:scale-[1.02] ${b.color}`}>
                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Clock size={14} className="text-white/40" />
                    </div>
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">{b.start} — {b.end}</p>
                    <p className="text-sm font-bold text-white tracking-tight">{b.title}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right: Insights & Review Column */}
        <div className="lg:col-span-7 space-y-8">
           {/* Security & Sync Center */}
           <div className="p-8 rounded-[2.2rem] bg-slate-900/40 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400"><ShieldCheck size={22} /></div>
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-tight text-white">Security & Sync</h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Alerts: {alertsEnabled ? "Operational" : "Offline"}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                   <button className="badge border-emerald-500/30 text-emerald-400 px-3 py-2 hover:bg-emerald-500/10 transition-colors" onClick={enableAlerts}>Enable Shield</button>
                   <button className="badge border-slate-700 text-slate-400 px-3 py-2 hover:bg-slate-800 transition-colors" onClick={runRiskCheck}>Risk Audit</button>
                   <button className="badge border-slate-700 text-slate-400 px-3 py-2 hover:bg-slate-800 transition-colors" onClick={exportIcs}><FileDown size={14} className="inline mr-1" /> Export</button>
                   <button className="badge border-slate-700 text-slate-400 px-3 py-2 hover:bg-slate-800 transition-colors" onClick={() => fileRef.current?.click()}><FileUp size={14} className="inline mr-1" /> Import</button>
                   <input ref={fileRef} type="file" accept=".ics,text/calendar" className="hidden" onChange={(e) => importIcs(e.target.files?.[0])} />
                </div>
              </div>

              <div className="space-y-3">
                {risks.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-200 text-xs">
                    <AlertCircle size={14} className="shrink-0" /> {r}
                  </div>
                ))}
                {!risks.length && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-200 text-xs text-center justify-center">
                    <ShieldCheck size={14} /> Neural perimeter secure. No risks detected.
                  </div>
                )}
              </div>
           </div>

           {/* Reflection Laboratory */}
           <div className="p-8 rounded-[2.2rem] bg-[#0a0d14] border border-slate-800 shadow-2xl relative">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400"><Wand2 size={22} /></div>
                   <h2 className="text-lg font-black uppercase tracking-tight text-white">Reflection Laboratory</h2>
                </div>
                <button 
                  className={`px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center gap-2 ${loadingReview ? "opacity-50" : ""}`}
                  onClick={generateReview}
                  disabled={loadingReview}
                >
                  <Sparkles size={14} /> {loadingReview ? "Processing..." : "Generate report"}
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Weekly Reflection</label>
                  <textarea 
                    rows={4} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/40 transition-all placeholder:text-slate-700 resize-none" 
                    value={reflection} 
                    onChange={(e) => setReflection(e.target.value)} 
                    placeholder="Capture your tactical wins and strategic bottlenecks..." 
                  />
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                  <div className="relative min-h-[250px] rounded-[1.8rem] border border-slate-800 bg-slate-950/80 p-6 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed shadow-inner">
                    {review ? (
                      <div className="animate-in fade-in duration-700">
                        <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">
                          <ShieldCheck size={12} /> Intelligence Report Validated
                        </div>
                        {review}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 opacity-30">
                        <Wand2 size={32} className="mb-3" />
                        <p className="text-xs font-bold uppercase tracking-widest">Awaiting Analysis</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
