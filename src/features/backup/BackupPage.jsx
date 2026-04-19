import { useRef, useState } from "react";
import { useLifeStore } from "../../app/store";
import { PageIntro } from "../../components/dashboard/PageIntro";
import { SectionCard } from "../../components/SectionCard";

export function BackupPage() {
  const exportSnapshot = useLifeStore((s) => s.exportSnapshot);
  const importSnapshot = useLifeStore((s) => s.importSnapshot);
  const fileRef = useRef(null);
  const [status, setStatus] = useState("No backup action yet.");

  const onExport = () => {
    const snapshot = exportSnapshot();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cortex-ai-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setStatus("Backup exported successfully.");
  };

  const onImport = async (file) => {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      importSnapshot(parsed);
      setStatus("Backup imported successfully.");
    } catch {
      setStatus("Import failed. Invalid backup file.");
    }
  };

  return (
    <div>
      <PageIntro title="Backup & Restore" subtitle="Protect your Cortex-AI data with local JSON exports and restores." chips={["Manual backup", "Restore", "Disaster recovery"]} />
      <div className="grid xl:grid-cols-2 gap-4">
        <SectionCard title="Export Backup" subtitle="Download your full workspace snapshot">
          <button className="rounded-lg px-4 py-2 bg-[var(--accent)] text-black font-semibold" onClick={onExport}>Export JSON Backup</button>
        </SectionCard>

        <SectionCard title="Import Backup" subtitle="Restore tasks, habits, goals, learning, memory, and rewards">
          <button className="rounded-lg px-4 py-2 border border-[var(--accent-soft)] text-[var(--accent-text)]" onClick={() => fileRef.current?.click()}>Import JSON Backup</button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => onImport(e.target.files?.[0])} />
        </SectionCard>
      </div>
      <p className="text-sm text-slate-300 mt-4">Status: {status}</p>
    </div>
  );
}
