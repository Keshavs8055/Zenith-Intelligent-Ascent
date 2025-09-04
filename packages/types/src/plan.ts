import { Task } from "./task";

export interface Milestone {
  id: string;
  planId: string;
  name: string;
  order: number; // order in climb
  targetPercent: number; // where the flag sits on mountain (0–100)
  dueDate?: string;
}

export interface Plan {
  id: string;
  title: string;
  description?: string;
  targetDate: string; // summit date
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
  milestones?: Milestone[];
}

export interface DailyGoal {
  id: string;
  planId: string;
  date: string; // specific day
  tasks: Task[];
  generatedByAI: boolean;
}

export interface ProgressSnapshot {
  planId: string;
  completionPercent: number;
  completedTasks: number;
  totalTasks: number;
  reachedMilestones: string[]; // milestone ids
}
