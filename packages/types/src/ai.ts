import { z } from "zod";

export interface AIRecommendation {
  id: string;
  planId: string;
  suggestions: string[];
  requiresMoreTime: boolean;
}

export const GenerateDailyGoalsSchema = z.object({
  planId: z.string(),
  targetDate: z.string().datetime(),
});
export type GenerateDailyGoalsInput = z.infer<typeof GenerateDailyGoalsSchema>;
