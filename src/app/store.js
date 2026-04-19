import { create } from "zustand";
import { persist } from "zustand/middleware";
import { todayKey } from "../utils/date";

const uid = () => crypto.randomUUID();

function dateKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function addDays(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return dateKey(d);
}

function daysBetween(from, to) {
  const a = new Date(`${from}T00:00:00`).getTime();
  const b = new Date(`${to}T00:00:00`).getTime();
  return Math.floor((b - a) / (1000 * 60 * 60 * 24));
}

function levelFromXp(xp) {
  return Math.floor(xp / 100) + 1;
}

function scoreMemoryRelevance(memoryText, queryText) {
  const q = (queryText || "").toLowerCase();
  const m = (memoryText || "").toLowerCase();
  if (!q || !m) return 0;
  return q.split(/\s+/).filter(Boolean).reduce((acc, token) => acc + (m.includes(token) ? 1 : 0), 0);
}

const initialChallenges = [
  { id: "wc1", title: "Complete 8 tasks this week", type: "task_complete", target: 8, progress: 0, rewardXp: 60, completed: false },
  { id: "wc2", title: "Finish habits for 5 days", type: "habit_complete", target: 5, progress: 0, rewardXp: 50, completed: false }
];

const achievementsCatalog = [
  { id: "a1", title: "First Win", description: "Complete your first task.", check: (ctx) => ctx.completedTasks >= 1 },
  { id: "a2", title: "Task Finisher", description: "Complete 25 tasks.", check: (ctx) => ctx.completedTasks >= 25 },
  { id: "a3", title: "Streak Guardian", description: "Reach a 7-day habit streak.", check: (ctx) => ctx.bestHabitStreak >= 7 },
  { id: "a4", title: "Level 5", description: "Reach Level 5.", check: (ctx) => ctx.level >= 5 },
  { id: "a5", title: "XP 500", description: "Earn 500 XP.", check: (ctx) => ctx.xp >= 500 },
  { id: "a6", title: "Challenge Hunter", description: "Complete 2 weekly challenges.", check: (ctx) => ctx.completedChallenges >= 2 }
];

const initialAchievements = achievementsCatalog.map((a) => ({
  id: a.id,
  title: a.title,
  description: a.description,
  unlocked: false,
  unlockedAt: null
}));

function buildAchievementContext({ tasks, habits, gamification, weeklyChallenges }) {
  return {
    completedTasks: (tasks || []).filter((t) => t.status === "Completed").length,
    bestHabitStreak: Math.max(0, ...(habits || []).map((h) => h.bestStreak || 0)),
    level: gamification.level,
    xp: gamification.xp,
    completedChallenges: (weeklyChallenges || []).filter((c) => c.completed).length
  };
}

function unlockAchievements(gamification, context) {
  const now = new Date().toISOString();
  const nextAchievements = (gamification.achievements || initialAchievements).map((a) => ({ ...a }));
  const newRewardLabels = [];

  nextAchievements.forEach((entry) => {
    if (entry.unlocked) return;
    const rule = achievementsCatalog.find((a) => a.id === entry.id);
    if (!rule) return;
    if (rule.check(context)) {
      entry.unlocked = true;
      entry.unlockedAt = now;
      newRewardLabels.push(`Achievement unlocked: ${entry.title}`);
    }
  });

  return {
    achievements: nextAchievements,
    rewardLabels: newRewardLabels
  };
}

export const useLifeStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      taskTemplates: [],
      habits: [],
      goals: [],
      learning: [],
      memories: [],
      gamification: {
        xp: 0,
        level: 1,
        weeklyStreak: 0,
        rewards: [],
        weeklyChallenges: initialChallenges,
        achievements: initialAchievements
      },

      awardXp: (amount, reason, type = null) =>
        set((s) => {
          const prev = s.gamification;
          let nextChallenges = [...(prev.weeklyChallenges || initialChallenges)].map((c) =>
            type && c.type === type && !c.completed ? { ...c, progress: c.progress + 1 } : c
          );

          let bonus = 0;
          nextChallenges = nextChallenges.map((c) => {
            if (!c.completed && c.progress >= c.target) {
              bonus += c.rewardXp;
              return { ...c, completed: true, progress: c.target };
            }
            return c;
          });

          const xp = (prev.xp || 0) + amount + bonus;
          const level = levelFromXp(xp);
          const candidate = {
            ...prev,
            xp,
            level,
            weeklyChallenges: nextChallenges
          };

          const unlocked = unlockAchievements(
            candidate,
            buildAchievementContext({ tasks: s.tasks, habits: s.habits, gamification: candidate, weeklyChallenges: nextChallenges })
          );

          return {
            gamification: {
              ...candidate,
              achievements: unlocked.achievements,
              rewards: [
                { id: uid(), at: new Date().toISOString(), label: `${reason} (+${amount} XP)` },
                ...(bonus > 0 ? [{ id: uid(), at: new Date().toISOString(), label: `Challenge bonus (+${bonus} XP)` }] : []),
                ...unlocked.rewardLabels.map((label) => ({ id: uid(), at: new Date().toISOString(), label })),
                ...(prev.rewards || [])
              ].slice(0, 30)
            }
          };
        }),

      addTask: (payload) =>
        set((s) => ({ tasks: [{ id: uid(), status: "Pending", ...payload }, ...s.tasks] })),
      updateTask: (id, payload) =>
        set((s) => ({ tasks: s.tasks.map((item) => (item.id === id ? { ...item, ...payload } : item)) })),
      completeTask: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;
        if (task.status !== "Completed") {
          get().awardXp(task.priority === "High" ? 20 : 12, "Task completed", "task_complete");
        }
        set((s) => ({
          tasks: s.tasks.map((item) => (item.id === id ? { ...item, status: item.status === "Completed" ? "Pending" : "Completed" } : item))
        }));
      },
      skipTaskInstance: (id) =>
        set((s) => ({ tasks: s.tasks.map((item) => (item.id === id ? { ...item, status: "Skipped" } : item)) })),
      removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((item) => item.id !== id) })),

      addTaskTemplate: (payload) =>
        set((s) => ({
          taskTemplates: [
            {
              id: uid(),
              frequency: "Daily",
              weekDay: 1,
              dayOfMonth: new Date().getDate(),
              intervalDays: 3,
              lastGeneratedOn: null,
              ...payload
            },
            ...s.taskTemplates
          ]
        })),
      removeTaskTemplate: (id) =>
        set((s) => ({ taskTemplates: s.taskTemplates.filter((tpl) => tpl.id !== id) })),
      generateRecurringTasksToday: () => {
        const t = todayKey();
        const now = new Date();
        const weekday = now.getDay();
        const monthDay = now.getDate();
        const state = get();

        const toGenerate = state.taskTemplates.filter((tpl) => {
          if (tpl.lastGeneratedOn === t) return false;
          if (tpl.frequency === "Daily") return true;
          if (tpl.frequency === "Weekly") return Number(tpl.weekDay) === weekday;
          if (tpl.frequency === "Monthly") return Number(tpl.dayOfMonth) === monthDay;
          if (tpl.frequency === "Custom") {
            if (!tpl.lastGeneratedOn) return true;
            return daysBetween(tpl.lastGeneratedOn, t) >= Number(tpl.intervalDays || 1);
          }
          return false;
        });

        if (!toGenerate.length) return;

        set((s) => ({
          tasks: [
            ...toGenerate.map((tpl) => ({
              id: uid(),
              title: tpl.title,
              priority: tpl.priority || "Medium",
              status: "Pending",
              deadline: t,
              goalId: tpl.goalId || "",
              category: tpl.category || "General",
              notes: tpl.notes || "",
              recurringTemplateId: tpl.id
            })),
            ...s.tasks
          ],
          taskTemplates: s.taskTemplates.map((tpl) =>
            toGenerate.some((x) => x.id === tpl.id) ? { ...tpl, lastGeneratedOn: t } : tpl
          )
        }));
      },
      autoRescheduleOverdueRecurring: () => {
        const t = todayKey();
        set((s) => ({
          tasks: s.tasks.map((task) => {
            if (!task.recurringTemplateId) return task;
            if (task.status === "Completed" || task.status === "Skipped") return task;
            if (!task.deadline || task.deadline >= t) return task;
            return {
              ...task,
              deadline: addDays(t, 1),
              notes: task.notes
                ? `${task.notes}\n[AI] Auto-rescheduled due to overdue recurring instance.`
                : "[AI] Auto-rescheduled due to overdue recurring instance."
            };
          })
        }));
      },

      addHabit: (payload) =>
        set((s) => ({ habits: [{ id: uid(), streak: 0, bestStreak: 0, completions: [], ...payload }, ...s.habits] })),
      updateHabit: (id, payload) =>
        set((s) => ({ habits: s.habits.map((item) => (item.id === id ? { ...item, ...payload } : item)) })),
      removeHabit: (id) => set((s) => ({ habits: s.habits.filter((item) => item.id !== id) })),
      completeHabitToday: (id) => {
        const tk = todayKey();
        const habit = get().habits.find((h) => h.id === id);
        if (!habit || (habit.completions || []).includes(tk)) return;

        set((s) => ({
          habits: s.habits.map((h) => {
            if (h.id !== id) return h;
            const streak = (h.streak || 0) + 1;
            return {
              ...h,
              completions: [...h.completions, tk],
              streak,
              bestStreak: Math.max(streak, h.bestStreak || 0)
            };
          })
        }));

        get().awardXp(10, "Habit completed", "habit_complete");
      },

      addGoal: (payload) =>
        set((s) => ({ goals: [{ id: uid(), progress: 0, status: "Active", milestones: [], ...payload }, ...s.goals] })),
      updateGoal: (id, payload) =>
        set((s) => ({ goals: s.goals.map((item) => (item.id === id ? { ...item, ...payload } : item)) })),
      removeGoal: (id) => set((s) => ({ goals: s.goals.filter((item) => item.id !== id) })),

      addLearning: (payload) =>
        set((s) => ({ learning: [{ id: uid(), progress: 0, status: "Not Started", ...payload }, ...s.learning] })),
      updateLearning: (id, payload) =>
        set((s) => ({ learning: s.learning.map((item) => (item.id === id ? { ...item, ...payload } : item)) })),
      removeLearning: (id) => set((s) => ({ learning: s.learning.filter((item) => item.id !== id) })),

      addMemory: (text, tag = "general") =>
        set((s) => ({
          memories: [
            { id: uid(), text: String(text || "").trim(), tag, createdAt: new Date().toISOString() },
            ...s.memories
          ].filter((m) => m.text).slice(0, 400)
        })),
      removeMemory: (id) => set((s) => ({ memories: s.memories.filter((m) => m.id !== id) })),
      getRelevantMemories: (query, limit = 5) => {
        const items = get().memories || [];
        return [...items]
          .map((m) => ({ ...m, score: scoreMemoryRelevance(m.text, query) }))
          .sort((a, b) => b.score - a.score || new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, limit)
          .map(({ score, ...rest }) => rest);
      },

      exportSnapshot: () => {
        const s = get();
        return {
          tasks: s.tasks,
          taskTemplates: s.taskTemplates,
          habits: s.habits,
          goals: s.goals,
          learning: s.learning,
          memories: s.memories,
          gamification: s.gamification
        };
      },
      importSnapshot: (snapshot) =>
        set((s) => ({
          tasks: Array.isArray(snapshot?.tasks) ? snapshot.tasks : s.tasks,
          taskTemplates: Array.isArray(snapshot?.taskTemplates) ? snapshot.taskTemplates : s.taskTemplates,
          habits: Array.isArray(snapshot?.habits) ? snapshot.habits : s.habits,
          goals: Array.isArray(snapshot?.goals) ? snapshot.goals : s.goals,
          learning: Array.isArray(snapshot?.learning) ? snapshot.learning : s.learning,
          memories: Array.isArray(snapshot?.memories) ? snapshot.memories : s.memories,
          gamification: snapshot?.gamification ? { ...s.gamification, ...snapshot.gamification } : s.gamification
        }))
    }),
    { name: "cortex-ai-store-v1" }
  )
);
