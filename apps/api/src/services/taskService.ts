import TaskModel from "../models/task.js";
import { ITask } from "../models/task.js";

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function isOverdue(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

export async function getTodayTasks(userId: string, includeCompleted = false) {
  const query: any = { userId };
  if (!includeCompleted) {
    query.status = { $ne: 'completed' };
  }

  const tasks = await TaskModel.find(query).lean();

  const filteredTasks = tasks.filter((t) => {
    // Check both date and dueDate
    const targetDate = t.date || t.dueDate;
    if (!targetDate) return true;
    const due = new Date(targetDate);
    return isToday(due) || isOverdue(due);
  });

  filteredTasks.sort((a, b) => {
    // 1. Priority DESC
    if ((b.priority || 0) !== (a.priority || 0)) {
      return (b.priority || 0) - (a.priority || 0);
    }

    // 2. Oldest first (createdAt ASC)
    const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return aCreated - bCreated;
  });

  return filteredTasks;
}

export async function getNextTask(userId: string) {
  const tasks = await getTodayTasks(userId, false);
  return tasks.length > 0 ? tasks[0] : null;
}


