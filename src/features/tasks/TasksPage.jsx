import { useMemo, useState } from "react";
import { useLifeStore } from "../../app/store";
import { SectionCard } from "../../components/SectionCard";
import { PageIntro } from "../../components/dashboard/PageIntro";
import { isOverdue } from "../../utils/date";

const initial = {
  title: "",
  priority: "Medium",
  status: "Pending",
  deadline: "",
  goalId: "",
  category: "General",
  notes: "",
  recurring: false,
  frequency: "Daily",
  weekDay: 1,
  dayOfMonth: 1,
  intervalDays: 3
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function TasksPage() {
  const {
    tasks,
    goals,
    taskTemplates,
    addTask,
    completeTask,
    removeTask,
    addTaskTemplate,
    removeTaskTemplate,
    autoRescheduleOverdueRecurring,
    skipTaskInstance
  } = useLifeStore();
  const [form, setForm] = useState(initial);
  const [filter, setFilter] = useState("Today");

  const filtered = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    switch (filter) {
      case "Today": return tasks.filter((t) => t.deadline === today && t.status !== "Completed" && t.status !== "Skipped");
      case "Upcoming": return tasks.filter((t) => t.deadline && t.deadline > today && t.status !== "Completed" && t.status !== "Skipped");
      case "Completed": return tasks.filter((t) => t.status === "Completed");
      case "High Priority": return tasks.filter((t) => t.priority === "High" && t.status !== "Completed" && t.status !== "Skipped");
      case "Overdue": return tasks.filter((t) => isOverdue(t.deadline, t.status === "Completed"));
      default: return tasks;
    }
  }, [tasks, filter]);

  const submit = () => {
    if (!form.title.trim()) return;
    const payload = {
      title: form.title,
      priority: form.priority,
      status: form.status,
      deadline: form.deadline,
      goalId: form.goalId,
      category: form.category,
      notes: form.notes
    };

    addTask(payload);

    if (form.recurring) {
      addTaskTemplate({
        title: form.title,
        priority: form.priority,
        goalId: form.goalId,
        category: form.category,
        notes: form.notes,
        frequency: form.frequency,
        weekDay: Number(form.weekDay),
        dayOfMonth: Number(form.dayOfMonth),
        intervalDays: Number(form.intervalDays)
      });
    }

    setForm(initial);
  };

  return (
    <div>
      <PageIntro
        title="Task Command Center"
        subtitle="Capture, prioritize, execute, and automate recurring work."
        chips={[
          `${tasks.length} total`,
          `${tasks.filter((t) => t.status === "Completed").length} completed`,
          `${taskTemplates.length} recurring templates`
        ]}
      />
      <div className="grid lg:grid-cols-3 gap-4">
        <SectionCard title="Create Task" subtitle="Capture work with context" >
          <div className="space-y-2">
            <input className="w-full panel-input rounded-lg px-3 py-2" placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <select className="panel-input rounded-lg px-3 py-2" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>{["Low","Medium","High"].map((p)=><option key={p}>{p}</option>)}</select>
              <select className="panel-input rounded-lg px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{["Pending","In Progress","Completed"].map((s)=><option key={s}>{s}</option>)}</select>
            </div>
            <input type="date" className="w-full panel-input rounded-lg px-3 py-2" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            <input className="w-full panel-input rounded-lg px-3 py-2" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <select className="w-full panel-input rounded-lg px-3 py-2" value={form.goalId} onChange={(e) => setForm({ ...form, goalId: e.target.value })}>
              <option value="">Linked goal (optional)</option>
              {goals.map((g) => <option value={g.id} key={g.id}>{g.title}</option>)}
            </select>
            <textarea className="w-full panel-input rounded-lg px-3 py-2" rows={2} placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />

            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={form.recurring} onChange={(e) => setForm({ ...form, recurring: e.target.checked })} />
              Make this recurring
            </label>
            {form.recurring ? (
              <div className="space-y-2 rounded-xl border border-[var(--panel-border)] bg-black/20 p-2">
                <select className="panel-input rounded-lg px-3 py-2 w-full" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
                  {["Daily", "Weekly", "Monthly", "Custom"].map((f) => <option key={f}>{f}</option>)}
                </select>
                {form.frequency === "Weekly" ? (
                  <select className="panel-input rounded-lg px-3 py-2 w-full" value={form.weekDay} onChange={(e) => setForm({ ...form, weekDay: Number(e.target.value) })}>
                    {weekDays.map((d, i) => <option value={i} key={d}>{d}</option>)}
                  </select>
                ) : null}
                {form.frequency === "Monthly" ? (
                  <input type="number" min={1} max={28} className="panel-input rounded-lg px-3 py-2 w-full" value={form.dayOfMonth} onChange={(e) => setForm({ ...form, dayOfMonth: Number(e.target.value) })} placeholder="Day of month (1-28)" />
                ) : null}
                {form.frequency === "Custom" ? (
                  <input type="number" min={1} max={30} className="panel-input rounded-lg px-3 py-2 w-full" value={form.intervalDays} onChange={(e) => setForm({ ...form, intervalDays: Number(e.target.value) })} placeholder="Every N days" />
                ) : null}
              </div>
            ) : null}

            <button className="w-full bg-[var(--accent)] text-black font-semibold rounded-lg py-2" onClick={submit}>Add Task</button>
          </div>
        </SectionCard>

        <div className="lg:col-span-2 space-y-4">
          <SectionCard
            title="Task Views"
            right={
              <div className="flex gap-2 flex-wrap">
                {["Today","Upcoming","Completed","High Priority","Overdue"].map(v => <button key={v} className={`badge ${filter===v?"border-[var(--accent-soft)] text-white":""}`} onClick={() => setFilter(v)}>{v}</button>)}
                <button className="badge border-[var(--accent-soft)] text-[var(--accent-text)]" onClick={autoRescheduleOverdueRecurring}>AI Reschedule</button>
              </div>
            }
          >
            <div className="space-y-2">
              {filtered.map((task) => (
                <article key={task.id} className="rounded-xl border border-[var(--panel-border)] bg-black/20 p-3">
                  <div className="flex justify-between gap-2">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-xs text-slate-400">
                        {task.category} • {task.deadline || "No deadline"} • {task.priority}
                        {task.recurringTemplateId ? " • Recurring" : ""}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="badge" onClick={() => completeTask(task.id)}>{task.status === "Completed" ? "Reopen" : "Complete"}</button>
                      {task.recurringTemplateId ? <button className="badge" onClick={() => skipTaskInstance(task.id)}>Skip</button> : null}
                      <button className="badge border-danger text-red-300" onClick={() => removeTask(task.id)}>Delete</button>
                    </div>
                  </div>
                  {task.notes ? <p className="text-sm text-slate-300 mt-2 whitespace-pre-wrap">{task.notes}</p> : null}
                </article>
              ))}
              {!filtered.length ? <p className="text-sm text-slate-400">No tasks in this view.</p> : null}
            </div>
          </SectionCard>

          <SectionCard title="Recurring Templates" subtitle="Auto-generated into your daily queue">
            <div className="space-y-2">
              {taskTemplates.map((tpl) => (
                <div key={tpl.id} className="flex items-center justify-between rounded-xl border border-[var(--panel-border)] bg-black/20 p-3">
                  <div>
                    <p className="text-sm text-slate-100">{tpl.title}</p>
                    <p className="text-xs text-slate-400">
                      {tpl.frequency}
                      {tpl.frequency === "Weekly" ? ` • ${weekDays[tpl.weekDay]}` : ""}
                      {tpl.frequency === "Monthly" ? ` • Day ${tpl.dayOfMonth}` : ""}
                      {tpl.frequency === "Custom" ? ` • Every ${tpl.intervalDays} days` : ""}
                    </p>
                  </div>
                  <button className="badge border-danger text-red-300" onClick={() => removeTaskTemplate(tpl.id)}>Remove</button>
                </div>
              ))}
              {!taskTemplates.length ? <p className="text-sm text-slate-400">No recurring templates yet.</p> : null}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
