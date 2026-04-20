import { useMemo, useState } from "react";
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Target, 
  Zap, 
  Clock, 
  RefreshCw, 
  Layers, 
  Calendar,
  MoreHorizontal,
  ArrowRight
} from "lucide-react";
import { useLifeStore } from "../../app/store";
import { isOverdue } from "../../utils/date";

const initial = {
  title: "",
  priority: "Medium",
  status: "Pending",
  deadline: "",
  goalId: "",
  category: "General",
  notes: "",
  recurring: false,
  frequency: "Daily",
  weekDay: 1,
  dayOfMonth: 1,
  intervalDays: 3
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function TasksPage() {
  const {
    tasks,
    goals,
    taskTemplates,
    addTask,
    completeTask,
    removeTask,
    addTaskTemplate,
    removeTaskTemplate,
    autoRescheduleOverdueRecurring,
    skipTaskInstance
  } = useLifeStore();
  const [form, setForm] = useState(initial);
  const [filter, setFilter] = useState("Today");

  const filtered = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    switch (filter) {
      case "Today": return tasks.filter((t) => t.deadline === today && t.status !== "Completed" && t.status !== "Skipped");
      case "Upcoming": return tasks.filter((t) => t.deadline && t.deadline > today && t.status !== "Completed" && t.status !== "Skipped");
      case "Completed": return tasks.filter((t) => t.status === "Completed");
      case "High Priority": return tasks.filter((t) => t.priority === "High" && t.status !== "Completed" && t.status !== "Skipped");
      case "Overdue": return tasks.filter((t) => isOverdue(t.deadline, t.status === "Completed"));
      default: return tasks;
    }
  }, [tasks, filter]);

  const submit = () => {
    if (!form.title.trim()) return;
    const payload = {
      title: form.title,
      priority: form.priority,
      status: form.status,
      deadline: form.deadline,
      goalId: form.goalId,
      category: form.category,
      notes: form.notes
    };

    addTask(payload);

    if (form.recurring) {
      addTaskTemplate({
        title: form.title,
        priority: form.priority,
        goalId: form.goalId,
        category: form.category,
        notes: form.notes,
        frequency: form.frequency,
        weekDay: Number(form.weekDay),
        dayOfMonth: Number(form.dayOfMonth),
        intervalDays: Number(form.intervalDays)
      });
    }

    setForm(initial);
  };

  const getPriorityStyles = (p) => {
    switch(p) {
      case "High": return "border-red-500/30 bg-red-500/5 text-red-200 shadow-[0_0_20px_-8px_rgba(239,68,68,0.3)]";
      case "Medium": return "border-cyan-500/30 bg-cyan-500/5 text-cyan-200 shadow-[0_0_20px_-8px_rgba(34,211,238,0.3)]";
      default: return "border-slate-700/50 bg-slate-900/40 text-slate-300";
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Immersive Tactical Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0d14] border border-blue-500/20 p-8 md:p-12 shadow-[0_0_50px_-12px_rgba(59,130,246,0.1)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full -ml-32 -mb-32 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
              <Zap size={12} className="animate-pulse" /> Mission Control Active
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight uppercase">Tactical <span className="text-blue-400">Command</span></h1>
            <p className="text-slate-400 text-lg max-w-xl font-medium leading-relaxed">Precision execution for your active objectives. Automate the mundane, dominate the mission.</p>
          </div>
          <div className="flex gap-4">
             <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-2xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Open Objectives</p>
                <p className="text-3xl font-black text-white">{tasks.length}</p>
             </div>
             <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-2xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Completed</p>
                <p className="text-3xl font-black text-emerald-400">{tasks.filter(t => t.status === "Completed").length}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Architect Sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit space-y-6">
          <div className="p-8 rounded-[2.2rem] bg-slate-900/40 border border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full -mr-12 -mt-12 pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-8">
               <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]"><Plus size={22} /></div>
               <h2 className="text-lg font-black uppercase tracking-tight text-white">Draft Objective</h2>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Objective Title</label>
                <input 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all placeholder:text-slate-700 font-medium" 
                  placeholder="What needs to be done?" 
                  value={form.title} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Priority</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-slate-700"
                    value={form.priority} 
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  >
                    {["Low","Medium","High"].map((p)=><option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tactical Status</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-slate-700" 
                    value={form.status} 
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    {["Pending","In Progress","Completed"].map((s)=><option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Deadline</label>
                  <input 
                    type="date"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none" 
                    value={form.deadline} 
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                  <input 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none" 
                    placeholder="General"
                    value={form.category} 
                    onChange={(e) => setForm({ ...form, category: e.target.value })} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Vision Alignment</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none"
                  value={form.goalId} 
                  onChange={(e) => setForm({ ...form, goalId: e.target.value })}
                >
                  <option value="">Detached Objective</option>
                  {goals.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 mb-2">
                <input 
                  type="checkbox" 
                  id="recurring-toggle"
                  className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-blue-500 focus:ring-blue-500/40"
                  checked={form.recurring} 
                  onChange={(e) => setForm({ ...form, recurring: e.target.checked })} 
                />
                <label htmlFor="recurring-toggle" className="text-xs font-bold text-slate-300 uppercase tracking-widest cursor-pointer select-none">Establish Automation Loop</label>
              </div>

              {form.recurring && (
                <div className="space-y-4 p-5 rounded-2xl bg-blue-900/10 border border-blue-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 gap-3">
                    <select className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white w-full" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
                      {["Daily", "Weekly", "Monthly", "Custom"].map((f) => <option key={f}>{f}</option>)}
                    </select>
                    {form.frequency === "Weekly" && (
                      <select className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white w-full" value={form.weekDay} onChange={(e) => setForm({ ...form, weekDay: Number(e.target.value) })}>
                        {weekDays.map((d, i) => <option value={i} key={d}>{d}</option>)}
                      </select>
                    )}
                    {form.frequency === "Monthly" && (
                      <input type="number" min={1} max={28} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white w-full" value={form.dayOfMonth} onChange={(e) => setForm({ ...form, dayOfMonth: Number(e.target.value) })} placeholder="Day (1-28)" />
                    )}
                    {form.frequency === "Custom" && (
                      <input type="number" min={1} max={30} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white w-full" value={form.intervalDays} onChange={(e) => setForm({ ...form, intervalDays: Number(e.target.value) })} placeholder="Every N days" />
                    )}
                  </div>
                </div>
              )}

              <button 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
                onClick={submit}
              >
                <CheckSquare size={18} /> INITIALIZE OBJECTIVE
              </button>
            </div>
          </div>
          
          <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
             <div className="flex items-center gap-3 mb-3 text-emerald-400">
                <Sparkles size={18} />
                <h4 className="text-xs font-black uppercase tracking-widest">Tactical Tip</h4>
             </div>
             <p className="text-xs text-slate-400 leading-relaxed italic">
                Strategic objectives aligned with Core Vision goals yield 40% higher execution velocity.
             </p>
          </div>
        </div>

        {/* Right: Operations Control Hub */}
        <div className="lg:col-span-8 h-fit space-y-8">
          {/* Active Operations Card */}
          <div className="p-8 rounded-[2.2rem] bg-slate-900/40 border border-slate-800 shadow-2xl relative">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-3">
                 <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400"><Layers size={22} /></div>
                 <h2 className="text-lg font-black uppercase tracking-tight text-white">Active Operations</h2>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {["Today","Upcoming","Completed","High Priority","Overdue"].map(v => (
                  <button 
                    key={v} 
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                      filter === v 
                        ? "bg-blue-600 text-white shadow-lg ring-1 ring-blue-500" 
                        : "bg-slate-800/50 text-slate-500 hover:text-slate-300 border border-slate-800"
                    }`}
                    onClick={() => setFilter(v)}
                  >
                    {v}
                  </button>
                ))}
                <button 
                  className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center gap-2" 
                  onClick={autoRescheduleOverdueRecurring}
                >
                  <RefreshCw size={12} className="shrink-0" /> AI Reschedule
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                  <CheckSquare size={48} className="mb-4" />
                  <p className="text-xs font-bold uppercase tracking-[0.3em]">No objectives in current perimeter</p>
                </div>
              )}
              
              {filtered.map((task) => (
                <article key={task.id} className={`group relative p-6 rounded-[1.8rem] border transition-all duration-500 hover:scale-[1.01] ${getPriorityStyles(task.priority)}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                         <h3 className="text-lg font-bold tracking-tight">{task.title}</h3>
                         {task.recurringTemplateId && <RefreshCw size={14} className="text-blue-400/60" title="Recurring Loop" />}
                      </div>
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                         <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest opacity-60">
                            <Target size={12} /> {task.category}
                         </div>
                         <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest opacity-60">
                            <Calendar size={12} /> {task.deadline || "No Deadline"}
                         </div>
                         <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em]">
                            {task.priority}
                         </div>
                         <div className={`px-2 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-[0.2em] ${task.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'}`}>
                            {task.status}
                         </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap shadow-lg ${
                          task.status === "Completed" 
                            ? "bg-slate-800 text-slate-400 hover:text-white" 
                            : "bg-blue-600 hover:bg-blue-500 text-white"
                        }`}
                        onClick={() => completeTask(task.id)}
                      >
                        {task.status === "Completed" ? "Reopen Mission" : "Execute Mission"}
                      </button>
                      
                      {task.recurringTemplateId && (
                        <button className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-amber-400 transition-colors" onClick={() => skipTaskInstance(task.id)} title="Skip Instance">
                          <RefreshCw size={16} />
                        </button>
                      )}
                      
                      <button className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-red-400 transition-colors" onClick={() => removeTask(task.id)} title="Abort Mission">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  {task.notes && (
                    <div className="mt-5 pt-5 border-t border-slate-700/30">
                       <p className="text-xs text-slate-300 leading-relaxed italic opacity-80">{task.notes}</p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>

          {/* Automation Loops Card */}
          {taskTemplates.length > 0 && (
            <div className="p-8 rounded-[2.2rem] bg-slate-900/40 border border-slate-800 shadow-2xl relative">
               <div className="flex items-center gap-3 mb-10">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400"><RefreshCw size={22} className="animate-spin-slow" /></div>
                  <h2 className="text-lg font-black uppercase tracking-tight text-white">Automation Laboratory</h2>
               </div>
               
               <div className="grid md:grid-cols-2 gap-4">
                  {taskTemplates.map((tpl) => (
                    <div key={tpl.id} className="p-5 rounded-2xl bg-slate-950/40 border border-slate-800/60 flex items-center justify-between group hover:border-emerald-500/30 transition-all leading-tight">
                      <div>
                        <p className="text-sm font-bold text-white mb-1">{tpl.title}</p>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                           <Clock size={10} /> {tpl.frequency}
                           <ArrowRight size={10} className="text-slate-700" />
                           {tpl.frequency === "Weekly" ? weekDays[tpl.weekDay] : tpl.frequency === "Monthly" ? `Day ${tpl.dayOfMonth}` : tpl.frequency === "Custom" ? `Every ${tpl.intervalDays}d` : "Immediate"}
                        </div>
                      </div>
                      <button className="p-2 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100" onClick={() => removeTaskTemplate(tpl.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
