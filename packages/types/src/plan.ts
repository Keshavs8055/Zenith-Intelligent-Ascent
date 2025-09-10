import { z } from "zod";

export const GeneratePlanSchema = z.object({
  prompt: z.string().min(5),
  deadline: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message:
        "Invalid date format, expected ISO string (YYYY-MM-DD or datetime)",
    })
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  hoursPerDay: z.number().min(1).default(1),
});

export type GeneratePlanInput = z.infer<typeof GeneratePlanSchema>;

export interface Plan {
  id: string;
  userId: string;
  title: string;
  prompt: string;
  taskIds: string[];
  deadline?: string;
  hoursPerDay?: number;
  status: "active" | "completed" | "archived";
  adaptive: boolean;
  createdAt: string;
  updatedAt: string;
}
