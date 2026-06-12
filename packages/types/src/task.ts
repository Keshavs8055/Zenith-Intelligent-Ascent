import { z } from "zod";

// Replaced by TaskLog
// export const ReflectionSchema = z.object({
//   type: z.enum(["completed", "skipped"]),
//   reason: z.string(),
//   difficulty: z.enum(["easy", "medium", "hard"]).optional(),
//   createdAt: z.string().datetime().optional()
// });

// export type Reflection = z.infer<typeof ReflectionSchema>;

export const CreateTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  planId: z.string().optional(),
  estimatedPomodoros: z.number().min(1).default(1),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;

// Not partial because these are execution patches
export const UpdateProgressSchema = z.object({
  action: z.enum(["complete_pomodoro", "complete_task", "skip"]),
  reflection: z.object({
    reason: z.string(),
    difficulty: z.enum(["easy", "medium", "hard"]).optional()
  }).optional()
});

export type UpdateProgressInput = z.infer<typeof UpdateProgressSchema>;

export interface Task {
  id: string; // mapped via DTO
  userId: string;
  planId?: string;

  title: string;
  description?: string;
  dueDate?: string;
  date?: string; // alias/addition for assigned day
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';

  // Execution tracking
  estimatedPomodoros: number;
  completedPomodoros: number;
  skipCount: number;
  priority: number;
  avoidanceScore: number;
  lastInteractedAt?: string;

  createdAt: string;
  updatedAt: string;
}

export const TaskLogSchema = z.object({
  taskId: z.string(),
  action: z.enum(["completed", "skipped", "edited"]),
  note: z.string().optional(),
});

export type CreateTaskLogInput = z.infer<typeof TaskLogSchema>;

export interface TaskLog {
  id: string;
  taskId: string;
  action: 'completed' | 'skipped' | 'edited';
  note?: string;
  createdAt: string;
}
