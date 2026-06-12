import { z } from "zod";

export const GeneratePlanSchema = z.object({
  prompt: z.string().min(5)
});

export type GeneratePlanInput = z.infer<typeof GeneratePlanSchema>;

export interface Plan {
  id: string; // mapper
  userId: string;
  
  title: string;
  prompt: string;

  taskIds: string[];

  createdAt: string;
  updatedAt: string;
}
