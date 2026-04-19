import { useRef, useState } from "react";
import { useLifeStore } from "../../app/store";
import { PageIntro } from "../../components/dashboard/PageIntro";
import { SectionCard } from "../../components/SectionCard";

function tasksToIcs(tasks) {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Cortex-AI//Calendar Export//EN"];

  tasks
    .filter((t) => t.deadline)
    .forEach((t) => {
      const date = String(t.deadline || "").replace(/-/g, "");
      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${t.id}@cortex-ai`);
      lines.push(`DTSTAMP:${date}T090000Z`);
      lines.push(`DTSTART;VALUE=DATE:${date}`);
      lines.push(`SUMMARY:${(t.title || "Task").replace(/[\n\r]/g, " ")}`);
      lines.push(`DESCRIPTION:${(t.notes || "Cortex-AI task export").replace(/[\n\r]/g, " ")}`);
      lines.push("END:VEVENT");
    });

  lines.push("END:VCALENDAR");
  return lines.join("\n");
}

export function IntegrationsPage() {
  const tasks = useLifeStore((s) => s.tasks);
  const addTask = useLifeStore((s) => s.addTask);
  const [googleStatus, setGoogleStatus] = useState("Not connected");
  const [lastImportCount, setLastImportCount] = useState(0);
  const fileRef = useRef(null);

  const exportIcs = () => {
    const content = tasksToIcs(tasks);
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cortex-ai-tasks-${new Date().toISOString().slice(0, 10)}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const importIcs = async (file) => {
    if (!file) return;
    const text = await file.text();
    const blocks = text.split("BEGIN:VEVENT").slice(1);
    let count = 0;

    blocks.forEach((block) => {
      const summary = (block.match(/SUMMARY:(.*)/) || [])[1]?.trim();
      const dt = (block.match(/DTSTART;VALUE=DATE:(\d{8})/) || [])[1];
      if (!summary || !dt) return;
      const deadline = `${dt.slice(0, 4)}-${dt.slice(4, 6)}-${dt.slice(6, 8)}`;
      addTask({ title: summary, priority: "Medium", status: "Pending", deadline, category: "Calendar Import", notes: "Imported from ICS" });
      count += 1;
    });

    setLastImportCount(count);
  };

  return (
    <div>
      <PageIntro title="Integrations" subtitle="Connect calendars and keep Cortex-AI in sync with external tools." chips={["Calendar sync", "ICS import/export", "Google-ready"]} />
      <div className="grid xl:grid-cols-2 gap-4">
        <SectionCard title="Google Calendar (Foundation)" subtitle="OAuth-ready integration surface">
          <p className="text-sm text-slate-300 mb-3">Status: {googleStatus}</p>
          <div className="flex gap-2">
            <button className="rounded-lg px-4 py-2 bg-[var(--accent)] text-black font-semibold" onClick={() => setGoogleStatus("Connected (Mock)")}>Connect Google</button>
            <button className="rounded-lg px-4 py-2 border border-[var(--panel-border)] text-slate-200" onClick={() => setGoogleStatus("Not connected")}>Disconnect</button>
          </div>
          <p className="text-xs text-slate-500 mt-3">Next step: wire OAuth token exchange + Google Calendar API for true 2-way sync.</p>
        </SectionCard>

        <SectionCard title="ICS Sync" subtitle="Export tasks to calendar or import events into tasks">
          <div className="flex flex-wrap gap-2 mb-3">
            <button className="rounded-lg px-4 py-2 bg-[var(--accent)] text-black font-semibold" onClick={exportIcs}>Export .ics</button>
            <button className="rounded-lg px-4 py-2 border border-[var(--accent-soft)] text-[var(--accent-text)]" onClick={() => fileRef.current?.click()}>Import .ics</button>
            <input ref={fileRef} type="file" accept=".ics,text/calendar" className="hidden" onChange={(e) => importIcs(e.target.files?.[0])} />
          </div>
          <p className="text-xs text-slate-400">Last import: {lastImportCount} events</p>
        </SectionCard>
      </div>
    </div>
  );
}
