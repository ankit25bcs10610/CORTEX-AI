import { isOverdue, todayKey, weekKeys } from "./date";

export function computeDashboard(tasks, habits, goals, learning) {
  const today = todayKey();
  const completedTasks = tasks.filter((t) => t.status === "Completed");
  const overdue = tasks.filter((t) => isOverdue(t.deadline, t.status === "Completed"));
  const todayTasks = tasks.filter((t) => t.deadline === today && t.status !== "Completed");
  const highPriority = tasks.filter((t) => t.priority === "High" && t.status !== "Completed");

  const habitProgress = habits.map((habit) => {
    const week = weekKeys();
    const completed = week.filter((day) => habit.completions?.includes(day)).length;
    return { ...habit, weeklyRate: Math.round((completed / 7) * 100) };
  });

  const goalProgress = goals.length
    ? Math.round(goals.reduce((acc, goal) => acc + (goal.progress || 0), 0) / goals.length)
    : 0;

  const learningProgress = learning.length
    ? Math.round(learning.reduce((acc, item) => acc + (item.progress || 0), 0) / learning.length)
    : 0;

  const taskMomentum = tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  const habitMomentum = habitProgress.length
    ? Math.round(habitProgress.reduce((acc, h) => acc + h.weeklyRate, 0) / habitProgress.length)
    : 0;

  const productivityScore = Math.round(taskMomentum * 0.45 + habitMomentum * 0.35 + goalProgress * 0.2);

  return {
    todayTasks,
    highPriority,
    overdue,
    habitProgress,
    goalProgress,
    learningProgress,
    productivityScore
  };
}
