import { z } from "zod";

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export const CreateTaskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
});
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;

export const UpdateTaskSchema = CreateTaskSchema.extend({
  id: z.string(),
  completed: z.boolean().optional(),
});
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

export interface Reminder {
  id: string;
  taskId: string;
  remindAt: string;
  message?: string;
}
