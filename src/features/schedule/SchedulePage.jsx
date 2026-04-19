import { useMemo, useRef, useState } from "react";
import { askLifeAgent } from "../../services/aiService";
import { useLifeStore } from "../../app/store";
import { PageIntro } from "../../components/dashboard/PageIntro";
import { SectionCard } from "../../components/SectionCard";

const hours = Array.from({ length: 14 }).map((_, i) => `${(i + 8).toString().padStart(2, "0")}:00`);

export function SchedulePage() {
  const { tasks, habits, goals, learning, addTask } = useLifeStore();
  const [blocks, setBlocks] = useState([
    { id: crypto.randomUUID(), title: "Deep Work", start: "09:00", end: "10:30", color: "bg-cyan-400/20 border-cyan-400/40" },
    { id: crypto.randomUUID(), title: "Review Sprint", start: "18:00", end: "18:30", color: "bg-indigo-400/20 border-indigo-400/40" }
  ]);
  const [form, setForm] = useState({ title: "", start: "13:00", end: "14:00", color: "bg-emerald-400/20 border-emerald-400/40" });
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
    const blocks = text.split("BEGIN:VEVENT").slice(1);
    blocks.forEach((block) => {
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
    <div>
      <PageIntro title="Schedule Hub" subtitle="Calendar, reminders, and weekly review in one unified workspace." chips={["Time blocking", "Risk alerts", "Weekly review"]} />
      <div className="grid xl:grid-cols-3 gap-4">
        <SectionCard title="Time Blocks" subtitle="Plan your focused hours">
          <div className="space-y-2 mb-3">
            <input className="w-full panel-input rounded-lg px-3 py-2" placeholder="Block title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <select className="panel-input rounded-lg px-3 py-2" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })}>{hours.map((h) => <option key={h}>{h}</option>)}</select>
              <select className="panel-input rounded-lg px-3 py-2" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })}>{hours.map((h) => <option key={h}>{h}</option>)}</select>
            </div>
            <button onClick={addBlock} className="w-full rounded-lg py-2 bg-[var(--accent)] text-black font-semibold">Add Block</button>
          </div>
          <div className="space-y-2">
            {sorted.map((b) => <div key={b.id} className={`rounded-xl border p-2 ${b.color}`}><p className="text-sm text-slate-100">{b.title}</p><p className="text-xs text-slate-300">{b.start} - {b.end}</p></div>)}
          </div>
        </SectionCard>

        <SectionCard title="Reminders + Sync" subtitle="Alert on risk and sync calendar files">
          <div className="flex flex-wrap gap-2 mb-3">
            <button className="badge border-[var(--accent-soft)]" onClick={enableAlerts}>Enable Alerts</button>
            <button className="badge" onClick={runRiskCheck}>Run Risk Check</button>
            <button className="badge" onClick={exportIcs}>Export .ics</button>
            <button className="badge" onClick={() => fileRef.current?.click()}>Import .ics</button>
            <input ref={fileRef} type="file" accept=".ics,text/calendar" className="hidden" onChange={(e) => importIcs(e.target.files?.[0])} />
          </div>
          <p className="text-xs text-slate-400 mb-2">Alerts: {alertsEnabled ? "Enabled" : "Disabled"}</p>
          <ul className="space-y-1 text-sm text-slate-200">
            {risks.map((r, i) => <li key={i}>• {r}</li>)}
            {!risks.length ? <li className="text-slate-500">No immediate risk detected.</li> : null}
          </ul>
        </SectionCard>

        <SectionCard title="Weekly Review" subtitle="Reflect and generate your next-week plan">
          <textarea rows={6} className="w-full panel-input rounded-lg px-3 py-2 mb-2" value={reflection} onChange={(e) => setReflection(e.target.value)} placeholder="Write what worked and what slipped this week..." />
          <button className="rounded-lg px-4 py-2 bg-[var(--accent)] text-black font-semibold" onClick={generateReview}>{loadingReview ? "Generating..." : "Generate Review"}</button>
          <div className="mt-3 min-h-40 rounded-xl border border-[var(--panel-border)] bg-black/20 p-3 text-sm text-slate-200 whitespace-pre-wrap">
            {review || "Your review and next-week strategy will appear here."}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
