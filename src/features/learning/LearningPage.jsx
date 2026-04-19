import { useState } from "react";
import { useLifeStore } from "../../app/store";
import { SectionCard } from "../../components/SectionCard";
import { PageIntro } from "../../components/dashboard/PageIntro";

const resources = ["YouTube", "Article", "Documentation", "Course", "Book", "GitHub repo"];

export function LearningPage() {
  const { learning, goals, addLearning, updateLearning, removeLearning } = useLifeStore();
  const [form, setForm] = useState({ title: "", resourceType: "Course", progress: 0, status: "Not Started", estimatedTime: "", notes: "", category: "Tech", goalId: "" });

  return (
    <div>
      <PageIntro title="Learning Tracker" subtitle="Track what you are studying and convert it into practical execution." chips={[`${learning.length} tracks`, `${learning.filter((l) => l.status === "Completed").length} completed`]} />
      <div className="grid lg:grid-cols-3 gap-4">
        <SectionCard title="Track Learning" subtitle="Courses, docs, books, and skills in one place">
          <input className="w-full panel-input rounded-lg px-3 py-2 mb-2" placeholder="Topic / Course" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <select className="w-full panel-input rounded-lg px-3 py-2 mb-2" value={form.resourceType} onChange={(e) => setForm({ ...form, resourceType: e.target.value })}>{resources.map((r)=><option key={r}>{r}</option>)}</select>
          <select className="w-full panel-input rounded-lg px-3 py-2 mb-2" value={form.goalId} onChange={(e) => setForm({ ...form, goalId: e.target.value })}>
            <option value="">Linked goal (optional)</option>
            {goals.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
          </select>
          <input className="w-full panel-input rounded-lg px-3 py-2 mb-2" placeholder="Estimated time (e.g. 8h)" value={form.estimatedTime} onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })} />
          <textarea rows={3} className="w-full panel-input rounded-lg px-3 py-2 mb-2" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <button className="w-full bg-[var(--accent)] rounded-lg py-2 text-black font-semibold" onClick={() => { if (!form.title.trim()) return; addLearning(form); setForm({ title: "", resourceType: "Course", progress: 0, status: "Not Started", estimatedTime: "", notes: "", category: "Tech", goalId: "" }); }}>Add Learning Item</button>
        </SectionCard>

        <div className="lg:col-span-2 space-y-3">
          {learning.map((item) => (
            <SectionCard key={item.id} title={item.title} subtitle={`${item.resourceType} • ${item.estimatedTime || "No estimate"}`} right={<span className="badge">{item.status}</span>}>
              <label className="text-sm text-slate-300">Progress {item.progress}%</label>
              <input type="range" min="0" max="100" value={item.progress} className="w-full accent-[var(--accent-hex)]" onChange={(e) => updateLearning(item.id, { progress: Number(e.target.value), status: Number(e.target.value) === 100 ? "Completed" : "In Progress" })} />
              {item.notes ? <p className="text-sm text-slate-300 mt-2">{item.notes}</p> : null}
              <button className="badge border-danger text-red-300 mt-3" onClick={() => removeLearning(item.id)}>Delete</button>
            </SectionCard>
          ))}
        </div>
      </div>
    </div>
  );
}
