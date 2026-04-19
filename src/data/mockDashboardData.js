export const dashboardData = {
  user: {
    name: "Ankit",
    role: "Builder",
    avatar: "AK"
  },
  tasks: [
    { id: "t1", title: "Ship auth flow for Cortex-AI", priority: "High", done: false, due: "Today" },
    { id: "t2", title: "Refactor dashboard components", priority: "Medium", done: false, due: "Today" },
    { id: "t3", title: "Push deployment checklist", priority: "High", done: true, due: "Tomorrow" },
    { id: "t4", title: "Write weekly founder update", priority: "Low", done: false, due: "Fri" }
  ],
  habits: [
    { id: "h1", name: "Coding", streak: 18, week: [1, 1, 0, 1, 1, 1, 0] },
    { id: "h2", name: "Workout", streak: 6, week: [1, 0, 1, 1, 0, 1, 1] },
    { id: "h3", name: "Reading", streak: 9, week: [1, 1, 1, 0, 1, 0, 1] }
  ],
  goals: [
    { id: "g1", title: "Become internship-ready full-stack dev", progress: 72, deadline: "Jun 30" },
    { id: "g2", title: "Complete 100 days of coding", progress: 41, deadline: "Aug 12" },
    { id: "g3", title: "Publish 5 portfolio projects", progress: 60, deadline: "Sep 02" }
  ],
  learning: [
    { id: "l1", topic: "System Design Basics", progress: 58, type: "Course", next: "Scalability patterns" },
    { id: "l2", topic: "Advanced React Patterns", progress: 76, type: "Documentation", next: "Compound components" },
    { id: "l3", topic: "DSA Revision Sprint", progress: 33, type: "YouTube", next: "Sliding window" }
  ],
  productivity: {
    score: 84,
    weeklyDelta: 15,
    weeklyTrend: [
      { day: "Mon", score: 68 },
      { day: "Tue", score: 74 },
      { day: "Wed", score: 72 },
      { day: "Thu", score: 79 },
      { day: "Fri", score: 81 },
      { day: "Sat", score: 84 },
      { day: "Sun", score: 84 }
    ]
  },
  deadlines: [
    { id: "d1", title: "Auth flow QA", date: "Apr 21", type: "Task", risk: "high" },
    { id: "d2", title: "System design revision", date: "Apr 22", type: "Learning", risk: "medium" },
    { id: "d3", title: "Portfolio Project #3", date: "Apr 24", type: "Goal", risk: "low" }
  ],
  ai: {
    suggestion: "You missed your coding habit yesterday. Do a focused 25-minute sprint before noon.",
    recommendation: "Focus on 2 high-priority tasks today: auth flow and deployment checklist.",
    weekly: "Your productivity increased by 15% this week. Keep task batching between 9:00-11:00 AM."
  }
};
