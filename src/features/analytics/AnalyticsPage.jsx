import { useMemo } from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts";
import { useLifeStore } from "../../app/store";
import { PageIntro } from "../../components/dashboard/PageIntro";
import { SectionCard } from "../../components/SectionCard";

export function AnalyticsPage() {
  const { tasks, habits, goals, learning } = useLifeStore();

  const trend = useMemo(() => {
    const base = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return base.map((d, i) => ({
      day: d,
      score: Math.min(100, 55 + i * 5 + Math.round((tasks.filter((t) => t.status === "Completed").length || 0) / 2))
    }));
  }, [tasks]);

  const distribution = useMemo(
    () => [
      { name: "Tasks", value: tasks.filter((t) => t.status === "Completed").length },
      { name: "Habits", value: habits.reduce((acc, h) => acc + (h.completions?.length || 0), 0) },
      { name: "Goals", value: goals.filter((g) => g.status === "Completed").length },
      { name: "Learning", value: learning.filter((l) => l.status === "Completed").length }
    ],
    [tasks, habits, goals, learning]
  );

  return (
    <div>
      <PageIntro title="Analytics" subtitle="Understand your productivity patterns and execution quality." chips={["Trend intelligence", "Weekly insights", "Execution mix"]} />
      <div className="grid xl:grid-cols-2 gap-4">
        <SectionCard title="Productivity Trend" subtitle="Last 7 days">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis domain={[40, 100]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="var(--accent-hex)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Execution Distribution" subtitle="Completed output by domain">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribution}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="var(--accent-hex)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
