import { useMemo, useState } from "react";
import { PageIntro } from "../../components/dashboard/PageIntro";
import { SectionCard } from "../../components/SectionCard";

const hours = Array.from({ length: 14 }).map((_, i) => `${(i + 8).toString().padStart(2, "0")}:00`);

export function CalendarPage() {
  const [blocks, setBlocks] = useState([
    { id: crypto.randomUUID(), title: "Deep Work", start: "09:00", end: "10:30", color: "bg-cyan-400/20 border-cyan-400/40" },
    { id: crypto.randomUUID(), title: "DSA Practice", start: "11:00", end: "12:00", color: "bg-indigo-400/20 border-indigo-400/40" }
  ]);
  const [form, setForm] = useState({ title: "", start: "13:00", end: "14:00", color: "bg-emerald-400/20 border-emerald-400/40" });

  const sorted = useMemo(() => [...blocks].sort((a, b) => a.start.localeCompare(b.start)), [blocks]);

  const addBlock = () => {
    if (!form.title.trim()) return;
    setBlocks((prev) => [...prev, { ...form, id: crypto.randomUUID() }]);
    setForm({ ...form, title: "" });
  };

  return (
    <div>
      <PageIntro title="Calendar Time Blocking" subtitle="Design your day intentionally with focused time blocks." chips={["Daily plan", "Focus blocks", "Execution calendar"]} />
      <div className="grid xl:grid-cols-3 gap-4">
        <SectionCard title="Add Time Block" subtitle="Map deep work before reactive work">
          <div className="space-y-2">
            <input className="w-full panel-input rounded-lg px-3 py-2" placeholder="Block title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <select className="panel-input rounded-lg px-3 py-2" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })}>{hours.map((h) => <option key={h}>{h}</option>)}</select>
              <select className="panel-input rounded-lg px-3 py-2" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })}>{hours.map((h) => <option key={h}>{h}</option>)}</select>
            </div>
            <select className="w-full panel-input rounded-lg px-3 py-2" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}>
              <option value="bg-emerald-400/20 border-emerald-400/40">Green</option>
              <option value="bg-cyan-400/20 border-cyan-400/40">Cyan</option>
              <option value="bg-indigo-400/20 border-indigo-400/40">Indigo</option>
              <option value="bg-rose-400/20 border-rose-400/40">Rose</option>
            </select>
            <button onClick={addBlock} className="w-full rounded-lg py-2 bg-[var(--accent)] text-black font-semibold">Add Block</button>
          </div>
        </SectionCard>

        <div className="xl:col-span-2">
          <SectionCard title="Today Timeline" subtitle="Drag-and-drop ready layout (phase-2 interaction)">
            <div className="space-y-2">
              {sorted.map((b) => (
                <div key={b.id} className={`rounded-xl border p-3 ${b.color}`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-100">{b.title}</p>
                    <p className="text-xs text-slate-300">{b.start} - {b.end}</p>
                  </div>
                </div>
              ))}
              {!sorted.length ? <p className="text-sm text-slate-500">No blocks scheduled yet.</p> : null}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
