import { useMemo } from "react";
import { Zap, Layout, Target, TrendingUp } from "lucide-react";
import { dashboardData } from "../../data/mockDashboardData";
import { TaskCard } from "./TaskCard";
import { GrowthCard } from "./GrowthCard";
import { LearningCard } from "./LearningCard";
import { ProductivityCard } from "./ProductivityCard";
import { FocusTimerCard } from "./FocusTimerCard";
import { DeadlinesCard } from "./DeadlinesCard";
import { WeeklyTrendCard } from "./WeeklyTrendCard";
import { GamificationCard } from "./GamificationCard";
import { AchievementsCard } from "./AchievementsCard";
import { AIPlannerCoachCard } from "./AIPlannerCoachCard";

export function Dashboard({ view = "daily" }) {
  const scoped = useMemo(() => {
    if (view === "weekly") {
      return {
        ...dashboardData,
        productivity: {
          ...dashboardData.productivity,
          score: Math.max(1, dashboardData.productivity.score - 4)
        },
        ai: {
          ...dashboardData.ai,
          recommendation: "Weekly mode: prioritize goal-linked tasks and keep at least 5/7 habit consistency."
        }
      };
    }
    return dashboardData;
  }, [view]);

  return (
    <div className="space-y-10 pb-16">
      {/* Neural Command Console Header */}
      <header className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0d14] border border-blue-500/20 p-8 md:p-14 shadow-[0_0_80px_-20px_rgba(59,130,246,0.2)]">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full -ml-32 -mb-32 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <Zap size={14} className="animate-pulse" /> Neural Core 01 Active
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white mb-4 tracking-tighter uppercase leading-[0.85]">Neural <span className="text-blue-500">Command</span></h1>
            <p className="text-slate-400 text-lg max-w-2xl font-medium leading-relaxed italic opacity-80 decoration-blue-500/30">Targeting precision. Visualizing momentum. Synchronizing objectives.</p>
          </div>
        </div>
      </header>

      {/* Symmetric Command Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sector Alpha: Tactical Command */}
        <div className="lg:col-span-12 xl:col-span-6 h-full">
          <TaskCard tasks={scoped.tasks} />
        </div>
        <div className="lg:col-span-6 xl:col-span-3 h-full">
          <ProductivityCard productivity={scoped.productivity} />
        </div>
        <div className="lg:col-span-6 xl:col-span-3 h-full">
          <FocusTimerCard />
        </div>

        {/* Sector Bravo: Growth & Strategy */}
        <div className="lg:col-span-12 xl:col-span-5 h-full flex flex-col gap-8">
          <div className="flex-1"><GrowthCard habits={scoped.habits} goals={scoped.goals} /></div>
          <div className="h-[250px]"><DeadlinesCard deadlines={scoped.deadlines} /></div>
        </div>
        <div className="lg:col-span-12 xl:col-span-7 h-full">
          <LearningCard learning={scoped.learning} />
        </div>
        
        {/* Sector Charlie: Intelligence Analytics */}
        <div className="lg:col-span-12 xl:col-span-8 h-full">
          <WeeklyTrendCard trend={scoped.productivity.weeklyTrend} />
        </div>
        <div className="lg:col-span-12 xl:col-span-4 h-full">
          <GamificationCard />
        </div>

        {/* Sector Delta: Legacy & Automation */}
        <div className="lg:col-span-12 xl:col-span-4 h-full">
          <AchievementsCard />
        </div>
        <div className="lg:col-span-12 xl:col-span-8 h-full">
          <AIPlannerCoachCard />
        </div>
      </div>
    </div>
  );
}
