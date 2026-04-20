import { useState } from "react";
import { 
  BookOpen, 
  Plus, 
  Sparkles, 
  Trash2, 
  Target, 
  CalendarClock,
  TrendingUp,
  Flame,
  LayoutDashboard,
  CheckCircle2,
  PlugZap,
  DatabaseBackup
} from "lucide-react";
import { useLifeStore } from "../../app/store";

const resources = [
  { type: "Course", icon: BookOpen, color: "text-indigo-400 bg-indigo-500/10", glow: "indigo" },
  { type: "YouTube", icon: TrendingUp, color: "text-red-400 bg-red-500/10", glow: "red" },
  { type: "Article", icon: BookOpen, color: "text-blue-400 bg-blue-500/10", glow: "blue" },
  { type: "Documentation", icon: PlugZap, color: "text-emerald-400 bg-emerald-500/10", glow: "emerald" },
  { type: "Book", icon: BookOpen, color: "text-amber-400 bg-amber-500/10", glow: "amber" },
  { type: "GitHub repo", icon: DatabaseBackup, color: "text-slate-400 bg-slate-500/10", glow: "slate" }
];

export function LearningPage() {
  const { learning, goals, addLearning, updateLearning, removeLearning } = useLifeStore();
  const [form, setForm] = useState({ 
    title: "", 
    resourceType: "Course", 
    progress: 0, 
    status: "Not Started", 
    estimatedTime: "", 
    notes: "", 
    category: "Tech", 
    goalId: "" 
  });

  const getResourceIcon = (type) => {
    const res = resources.find(r => r.type === type) || resources[0];
    return res.icon;
  };

  const getResourceColor = (type) => {
    const res = resources.find(r => r.type === type) || resources[0];
    return res.color;
  };

  const getResourceGlow = (type) => {
    const res = resources.find(r => r.type === type) || resources[0];
    return res.glow;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Immersive Knowledge Analytics Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0d14] border border-emerald-500/20 p-8 md:p-12 shadow-[0_0_50px_-12px_rgba(16,185,129,0.1)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full -ml-32 -mb-32 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4">
              <LayoutDashboard size={12} className="animate-pulse" /> Knowledge Intelligence Hub
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">Learning <span className="text-emerald-400">Tracker</span></h1>
            <p className="text-slate-400 text-lg max-w-xl">Centralize your intellectual growth. Track curriculum mastery and strategic skill acquisition.</p>
          </div>
          <div className="flex gap-4">
             <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-2xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Tracks</p>
                <p className="text-3xl font-black text-white">{learning.length}</p>
             </div>
             <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-2xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Mastery Achieved</p>
                <p className="text-3xl font-black text-emerald-400">{learning.filter(l => l.status === "Completed").length}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Architect Sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit space-y-6">
          <div className="p-8 rounded-[2.2rem] bg-slate-900/40 border border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full -mr-12 -mt-12 pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-8">
               <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]"><Plus size={22} /></div>
               <h2 className="text-lg font-black uppercase tracking-tight text-white">New Curriculum</h2>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subject / Track Name</label>
                <input 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all placeholder:text-slate-700 font-medium" 
                  placeholder="e.g. Neural Architecture Design" 
                  value={form.title} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Source Type</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-slate-700"
                    value={form.resourceType} 
                    onChange={(e) => setForm({ ...form, resourceType: e.target.value })}
                  >
                    {resources.map((r)=><option key={r.type}>{r.type}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Estimate (hrs)</label>
                  <input 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none" 
                    placeholder="e.g. 40" 
                    value={form.estimatedTime} 
                    onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Alignment Goal</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none"
                  value={form.goalId} 
                  onChange={(e) => setForm({ ...form, goalId: e.target.value })}
                >
                  <option value="">Detached Track</option>
                  {goals.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
                </select>
              </div>

              <button 
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
                onClick={() => { 
                  if (!form.title.trim()) return; 
                  addLearning(form); 
                  setForm({ title: "", resourceType: "Course", progress: 0, status: "Not Started", estimatedTime: "", notes: "", category: "Tech", goalId: "" }); 
                }}
              >
                <Sparkles size={18} /> INITIALIZE HUB
              </button>
            </div>
          </div>
          
          <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
             <div className="flex items-center gap-3 mb-3 text-indigo-400">
                <Flame size={18} />
                <h4 className="text-xs font-black uppercase tracking-widest">Growth Momentum</h4>
             </div>
             <p className="text-xs text-slate-400 leading-relaxed">
                Connect your learning tracks to core vision goals to increase your strategic focus and evolution speed.
             </p>
          </div>
        </div>

        {/* Right: Knowledge Vault Grid */}
        <div className="lg:col-span-8 space-y-6">
          {learning.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 rounded-[2.5rem] border-2 border-dashed border-slate-800 bg-slate-900/10">
              <BookOpen size={48} className="text-slate-800 mb-6" />
              <p className="text-slate-500 font-black uppercase tracking-widest text-sm">No Curriculum Initialized</p>
              <p className="text-slate-700 text-[10px] mt-2 uppercase tracking-[0.3em]">Architect a track to begin tracking mastery</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {learning.map((item) => {
                const Icon = getResourceIcon(item.resourceType);
                const colorClass = getResourceColor(item.resourceType);
                const glowColor = getResourceGlow(item.resourceType);
                
                return (
                  <div key={item.id} className="group relative p-8 rounded-[2.2rem] bg-slate-900/60 border border-slate-800/80 shadow-2xl transition-all hover:border-emerald-500/40 overflow-hidden">
                    {/* Dynamic Atmosphere Glow */}
                    <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-${glowColor}-500/20`} />
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-8">
                        <div className={`p-3.5 rounded-2xl ${colorClass} shadow-inner`}>
                          <Icon size={24} />
                        </div>
                        <button className="p-2 text-slate-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100" onClick={() => removeLearning(item.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="mb-8">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{item.resourceType}</p>
                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors tracking-tight leading-tight">{item.title}</h3>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-[10px] font-black">
                          <span className="text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                             <CalendarClock size={12} /> {item.estimatedTime || "∞"} hrs total
                          </span>
                          <span className={item.status === 'Completed' ? 'text-emerald-400' : 'text-amber-400'}>
                            {item.progress}% Mastered
                          </span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800/50">
                           <div 
                            className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-cyan-500 transition-all duration-1000 shadow-[0_0_12px_-2px_rgba(16,185,129,0.5)]" 
                            style={{ width: `${item.progress}%` }} 
                           />
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={item.progress} 
                          className="w-full appearance-none bg-transparent cursor-pointer accent-emerald-500 h-1.5 opacity-30 group-hover:opacity-100 transition-opacity" 
                          onChange={(e) => updateLearning(item.id, { 
                            progress: Number(e.target.value), 
                            status: Number(e.target.value) === 100 ? "Completed" : "In Progress" 
                          })} 
                        />
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-800/50 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           {item.status === 'Completed' ? (
                             <CheckCircle2 size={14} className="text-emerald-400" />
                           ) : (
                             <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                           )}
                           <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'Completed' ? 'text-emerald-400' : 'text-slate-500'}`}>
                             {item.status}
                           </span>
                         </div>
                         {item.goalId && (
                           <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors cursor-help" title="Linked to Strategic Goal">
                             <Target size={14} />
                           </div>
                         )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
