export function getTodaySummary(tasks: any[]) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const remaining = total - completed;

  const totalPomodoros = tasks.reduce(
    (sum, t) => sum + (t.estimatedPomodoros || 1),
    0
  );
  const completedPomodoros = tasks.reduce(
    (sum, t) => sum + (t.completedPomodoros || 0),
    0
  );

  return { total, completed, remaining, totalPomodoros, completedPomodoros };
}
