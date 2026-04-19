import { useState, useMemo } from "react";
import { useLifeStore } from "../../app/store";
import { SectionCard } from "../../components/SectionCard";
import { PageIntro } from "../../components/dashboard/PageIntro";
import { weekKeys } from "../../utils/date";
import { Flame, Target, Plus, Trash2, CheckCircle2, TrendingUp, Sparkles, Trophy } from "lucide-react";

export function GrowthPage() {
  const [activeTab, setActiveTab] = useState("habits");
  const { 
    habits, addHabit, removeHabit, completeHabitToday,
    goals, addGoal, updateGoal, removeGoal 
  } = useLifeStore();

  const [habitForm, setHabitForm] = useState({ title: "", category: "Health", frequency: "Daily" });
  const [goalForm, setGoalForm] = useState({ title: "", type: "Short-term", targetDate: "", category: "Career", milestones: [] });
  
  const days = weekKeys();

  // Calculate Growth Intelligence
  const stats = useMemo(() => {
    const totalHabits = habits.length;
    const avgStreak = totalHabits > 0 ? habits.reduce((acc, h) => acc + (h.streak || 0), 0) / totalHabits : 0;
    const completedGoals = goals.filter(g => g.status === "Completed").length;
    const avgGoalProgress = goals.length > 0 ? goals.reduce((acc, g) => acc + (g.progress || 0), 0) / goals.length : 0;
    
    return {
      growthVelocity: Math.round((avgStreak * 2) + (avgGoalProgress / 2)),
      activeFocus: totalHabits + goals.filter(g => g.status === "Active").length,
      achievements: completedGoals
    };
  }, [habits, goals]);

  return (
    <div className="space-y-8 pb-12">
      <PageIntro 
        title="Growth Lab" 
        subtitle="The engine room for your personal evolution and long-term vision."
        chips={[
          `${habits.length} Active Habits`,
          `${goals.length} Strategic Goals`
        ]}
      />

      {/* Intelligence Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/5 border border-indigo-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400">
              <TrendingUp size={22} />
            </div>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Growth Velocity</h3>
          </div>
          <p className="text-4xl font-black text-white mb-1">{stats.growthVelocity}<span className="text-indigo-400 text-lg ml-1">v/s</span></p>
          <p className="text-xs text-slate-500 font-medium italic">Based on streak consistency and goal progress</p>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/5 border border-cyan-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400">
              <Sparkles size={22} />
            </div>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Active Focus</h3>
          </div>
          <p className="text-4xl font-black text-white mb-1">{stats.activeFocus}</p>
          <p className="text-xs text-slate-500 font-medium italic">Parallel growth tracks currently in motion</p>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/5 border border-emerald-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
              <Trophy size={22} />
            </div>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Milestones Hit</h3>
          </div>
          <p className="text-4xl font-black text-white mb-1">{stats.achievements}</p>
          <p className="text-xs text-slate-500 font-medium italic">Completed strategic objectives this season</p>
        </div>
      </div>

      {/* Control Center */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Interactive Tabs and List */}
        <div className="flex-1 space-y-6">
          <div className="flex gap-2 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 w-fit backdrop-blur-md">
            {[
              { id: "habits", label: "Atomic Habits", icon: Flame, color: "text-orange-400" },
              { id: "goals", label: "Vision Goals", icon: Target, color: "text-cyan-400" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === tab.id 
                    ? "bg-slate-800 text-white shadow-xl ring-1 ring-slate-700" 
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? tab.color : ""} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-5">
            {activeTab === "habits" ? (
              <div className="grid gap-4">
                {habits.map((habit) => (
                  <div key={habit.id} className="group p-5 rounded-3xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors uppercase tracking-tight">{habit.title}</h4>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{habit.category} • {habit.frequency}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl text-[10px] font-black uppercase tracking-tighter">
                          Streak {habit.streak || 0}d
                        </div>
                        <button 
                          className="p-2 text-slate-600 hover:text-red-400 transition-colors hover:bg-red-400/5 rounded-lg"
                          onClick={() => removeHabit(habit.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex gap-2.5 flex-wrap mb-5">
                      {days.map((d) => (
                        <div 
                          key={d} 
                          className={`w-11 h-11 flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-500 ${
                            habit.completions?.includes(d) 
                              ? "bg-orange-500/20 border-orange-500/40 text-orange-300 shadow-[0_0_20px_-10px_rgba(249,115,22,0.5)] scale-105" 
                              : "bg-slate-900/60 border-slate-800 text-slate-600 opacity-60"
                          }`}
                        >
                          <span className="text-[10px] uppercase font-black tracking-tighter">{d.slice(5)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <button 
                      className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-orange-500/10 to-orange-600/5 border border-orange-500/30 py-3 text-sm font-bold text-orange-400 hover:from-orange-500/20 hover:to-orange-600/10 transition-all"
                      onClick={() => completeHabitToday(habit.id)}
                    >
                      <CheckCircle2 size={18} />
                      Commit for Today
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="group p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all duration-300">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h4 className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight">{goal.title}</h4>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{goal.type} • {goal.category}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 shadow-lg ${
                          goal.status === "Completed" 
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" 
                            : goal.status === "Paused"
                            ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                            : "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
                        }`}>
                          {goal.status}
                        </span>
                        <button 
                          className="p-2 text-slate-600 hover:text-red-400 transition-colors hover:bg-red-400/5 rounded-lg"
                          onClick={() => removeGoal(goal.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-end justify-between">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Momentum: <span className="text-white ml-1">{goal.progress || 0}%</span></p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Target: <span className="text-slate-300 ml-1">{goal.targetDate || "UNSET"}</span></p>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-slate-950/80 p-0.5 border border-slate-800 overflow-hidden shadow-inner">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-cyan-400 to-emerald-400 shadow-[0_0_15px_-2px_rgba(34,211,238,0.4)] transition-all duration-1000 ease-in-out" 
                          style={{ width: `${goal.progress || 0}%` }} 
                        />
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={goal.progress || 0} 
                        className="w-full h-1 bg-transparent appearance-none cursor-pointer accent-cyan-500 opacity-50 hover:opacity-100 transition-opacity" 
                        onChange={(e) => updateGoal(goal.id, { progress: Number(e.target.value) })} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Modern Creation Engine */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="sticky top-8 space-y-6">
            <div className="p-6 rounded-[32px] bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 blur-2xl bg-indigo-500 rounded-full -mr-10 -mt-10 pointer-events-none" />
              
              <h3 className="text-xl font-black text-white mb-1 uppercase tracking-tight flex items-center gap-2.5">
                {activeTab === "habits" ? <Flame className="text-orange-500" /> : <Target className="text-cyan-400" />}
                New Growth Track
              </h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-8">Define your next evolution</p>

              <div className="space-y-5">
                {activeTab === "habits" ? (
                  <>
                    <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Identity Action</label>
                    <input 
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all placeholder:text-slate-600" 
                      placeholder="e.g. Master React Patterns" 
                      value={habitForm.title} 
                      onChange={(e) => setHabitForm({ ...habitForm, title: e.target.value })} 
                    />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Category</label>
                        <input className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-4 py-3 text-sm" value={habitForm.category} onChange={(e) => setHabitForm({ ...habitForm, category: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Tempo</label>
                        <select className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-4 py-3 text-sm" value={habitForm.frequency} onChange={(e) => setHabitForm({ ...habitForm, frequency: e.target.value })}>
                          {["Daily","Weekly","Custom"].map((f)=><option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>
                    </div>
                    <button 
                      className="w-full bg-gradient-to-br from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95"
                      onClick={() => { if (!habitForm.title.trim()) return; addHabit(habitForm); setHabitForm({ title: "", category: "Health", frequency: "Daily" }); }}
                    >
                      <Plus size={20} />
                      SPAWN HABIT
                    </button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Strategic Objective</label>
                    <input 
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all" 
                      placeholder="e.g. Land Google Internship" 
                      value={goalForm.title} 
                      onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })} 
                    />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Deadline</label>
                        <input type="date" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-4 py-3 text-sm" value={goalForm.targetDate} onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Horizon</label>
                        <select className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-4 py-3 text-sm" value={goalForm.type} onChange={(e) => setGoalForm({ ...goalForm, type: e.target.value })}>
                          {["Short-term","Long-term"].map((v)=><option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                    </div>
                    <button 
                      className="w-full bg-gradient-to-br from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95"
                      onClick={() => { if (!goalForm.title.trim()) return; addGoal(goalForm); setGoalForm({ title: "", type: "Short-term", targetDate: "", category: "Career", milestones: [] }); }}
                    >
                      <Plus size={20} />
                      ACTIVATE GOAL
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="p-6 rounded-[32px] bg-slate-900/40 border border-slate-800/50">
              <h4 className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                <Sparkles size={14} className="text-yellow-500" />
                Growth Tip
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed italic">
                {activeTab === "habits" 
                  ? "Atomic habits compound over time. Focus on showing up every day rather than master performance."
                  : "Vision goals provide direction. Break them down into small, actionable milestones to maintain momentum."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
