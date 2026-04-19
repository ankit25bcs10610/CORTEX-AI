import { useMemo } from "react";
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
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 auto-rows-auto">
      {/* Top Priority Row */}
      <div className="xl:col-span-8 lg:col-span-7">
        <TaskCard tasks={scoped.tasks} />
      </div>
      <div className="xl:col-span-4 lg:col-span-5">
        <ProductivityCard productivity={scoped.productivity} />
      </div>

      {/* Growth and Focus Row */}
      <div className="xl:col-span-5 lg:col-span-6 row-span-2">
        <GrowthCard habits={scoped.habits} goals={scoped.goals} />
      </div>
      <div className="xl:col-span-7 lg:col-span-6">
        <LearningCard learning={scoped.learning} />
      </div>
      
      {/* Utility and Tracking Row */}
      <div className="xl:col-span-4 lg:col-span-4">
        <FocusTimerCard />
      </div>
      <div className="xl:col-span-3 lg:col-span-4">
        <DeadlinesCard deadlines={scoped.deadlines} />
      </div>
      
      {/* Lower Priority Analysis */}
      <div className="xl:col-span-5 lg:col-span-4">
        <WeeklyTrendCard trend={scoped.productivity.weeklyTrend} />
      </div>
      
      <div className="xl:col-span-6 lg:col-span-12">
        <GamificationCard />
      </div>
      <div className="xl:col-span-6 lg:col-span-12">
        <AchievementsCard />
      </div>
      <div className="xl:col-span-12">
        <AIPlannerCoachCard />
      </div>
    </div>
  );
}
