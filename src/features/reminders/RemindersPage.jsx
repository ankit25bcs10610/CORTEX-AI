import { useMemo, useState } from "react";
import { useLifeStore } from "../../app/store";
import { PageIntro } from "../../components/dashboard/PageIntro";
import { SectionCard } from "../../components/SectionCard";

export function RemindersPage() {
  const { tasks, habits } = useLifeStore();
  const [enabled, setEnabled] = useState(false);

  const risks = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const overdue = tasks.filter((t) => t.deadline && t.deadline < today && t.status !== "Completed" && t.status !== "Skipped");
    const weakHabits = habits.filter((h) => (h.streak || 0) < 2);
    return {
      overdue,
      weakHabits,
      messages: [
        ...overdue.slice(0, 3).map((t) => `Overdue task alert: ${t.title}`),
        ...weakHabits.slice(0, 3).map((h) => `Streak risk: ${h.title || h.name} is below 2 days`)
      ]
    };
  }, [tasks, habits]);

  const enableAlerts = async () => {
    if (!("Notification" in window)) return;
    const p = await Notification.requestPermission();
    if (p === "granted") setEnabled(true);
  };

  const triggerCheck = () => {
    if (!enabled || !("Notification" in window)) return;
    risks.messages.slice(0, 2).forEach((msg, i) => {
      setTimeout(() => {
        new Notification("Cortex-AI Reminder", { body: msg });
      }, i * 500);
    });
  };

  return (
    <div>
      <PageIntro title="Smart Reminders" subtitle="Get proactive alerts for missed streaks and overdue work." chips={["Risk alerts", "Browser notifications", "Recovery prompts"]} />
      <div className="grid xl:grid-cols-2 gap-4">
        <SectionCard title="Notification Control" subtitle="Enable browser reminders">
          <div className="flex gap-2">
            <button className="rounded-lg px-4 py-2 bg-[var(--accent)] text-black font-semibold" onClick={enableAlerts}>Enable Alerts</button>
            <button className="rounded-lg px-4 py-2 border border-[var(--accent-soft)] text-[var(--accent-text)]" onClick={triggerCheck}>Run Risk Check</button>
          </div>
          <p className="text-xs text-slate-400 mt-2">Status: {enabled ? "Enabled" : "Disabled"}</p>
        </SectionCard>

        <SectionCard title="Detected Risk Signals" subtitle="Auto-detected from current tasks and habits">
          <ul className="space-y-2 text-sm text-slate-200">
            {risks.messages.map((m, i) => <li key={i}>• {m}</li>)}
            {!risks.messages.length ? <li className="text-slate-500">No immediate risk signals detected.</li> : null}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
