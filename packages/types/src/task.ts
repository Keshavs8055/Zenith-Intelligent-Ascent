import { z } from "zod";

export const CreateTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  routineId: z.string().optional(),
  estimatedHours: z.number().min(0.5).max(24).optional(),
  scheduledTime: z.string().datetime().optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;

export const UpdateTaskSchema = CreateTaskSchema.partial();
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualTimeSpent?: number;
  scheduledTime?: string;
  completed: boolean;
  progress: number;
  routineId?: string;
  createdAt: string;
  updatedAt: string;
}
