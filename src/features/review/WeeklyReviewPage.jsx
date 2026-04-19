import { useState } from "react";
import { useLifeStore } from "../../app/store";
import { PageIntro } from "../../components/dashboard/PageIntro";
import { SectionCard } from "../../components/SectionCard";
import { askLifeAgent } from "../../services/aiService";

export function WeeklyReviewPage() {
  const state = useLifeStore();
  const [reflection, setReflection] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const prompt = `Generate a weekly review and next-week action plan. Reflection: ${reflection || "No extra notes"}.`;
      const data = await askLifeAgent({
        message: prompt,
        context: {
          tasks: state.tasks,
          habits: state.habits,
          goals: state.goals,
          learningItems: state.learning
        }
      });
      setResult(data.reply || "No review generated.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageIntro title="Weekly Review" subtitle="Reflect, analyze, and generate a high-impact next-week plan." chips={["Reflection", "AI review", "Action plan"]} />
      <div className="grid xl:grid-cols-2 gap-4">
        <SectionCard title="Reflection Input" subtitle="What went well, what slipped, and what to improve">
          <textarea
            rows={10}
            className="w-full panel-input rounded-xl px-3 py-2"
            placeholder="Example: I delayed deep work on Tue/Wed but improved habit streak by weekend..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
          />
          <button className="mt-3 rounded-lg px-4 py-2 bg-[var(--accent)] text-black font-semibold" onClick={generate}>
            {loading ? "Generating..." : "Generate Weekly Review"}
          </button>
        </SectionCard>

        <SectionCard title="AI Weekly Review" subtitle="Personalized summary + next-week strategy">
          <div className="min-h-56 whitespace-pre-wrap text-sm text-slate-200 bg-black/20 rounded-xl border border-[var(--panel-border)] p-3">
            {result || "Your AI weekly review will appear here."}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
