import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { AIResponseSchema, AIResponse, AIAdjustmentResponse, AIAdjustmentResponseSchema } from "@zenith/types";
import { AppError } from "../utils/appError.js";

const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GOOGLE_API_KEY || "" })],
});

const DEFAULT_FALLBACK: AIResponse = {
  planTitle: "Generated Plan (Fallback)",
  tasks: [
    {
      title: "Watch 1 tutorial and read overview docs",
      description: "AI service offline. Defaulting to local generation.",
      dueDate: new Date().toISOString(),
      estimatedPomodoros: 2
    }
  ],
};

export async function generatePlanWithAI(prompt: string, options?: { model?: string }): Promise<AIResponse> {
  if (!prompt || prompt.trim().length === 0) {
    throw new AppError("Prompt cannot be empty", 400);
  }

  const modelName = options?.model ?? "gemini-2.5-flash";

  try {
    const result = await ai.generate({
      model: googleAI.model(modelName),
      prompt: {
        text: `Generate a detailed, execution-centric plan for the following request:\n${prompt}\n\nIMPORTANT LIMITATIONS:\n- Output MUST break things into specific, actionable instructions. Instead of "Learn React basics", say "Watch 1 React video + take 3 notes".\n- Assign estimatedPomodoros (1-10) for each task.`,
      },
      output: { schema: AIResponseSchema },
      config: { temperature: 0.2 },
    });

    if (!result.output) throw new AppError("Model returned no structured output", 502);

    const validated = AIResponseSchema.safeParse(result.output);
    if (!validated.success) {
      console.error("Schema validation error:", validated.error.format());
      throw new AppError("Invalid AI response format", 502);
    }
    return validated.data;
  } catch (err: any) {
    console.error("[AI Service Error]", err);
    return DEFAULT_FALLBACK;
  }
}

export async function adjustTasksBasedOnBehavior(
  tasks: any[],
  reflections: any[],
  patterns: { skipRate: number, avgDifficulty: string, completionRate: number },
  options?: { model?: string }
): Promise<AIAdjustmentResponse> {
  const modelName = options?.model ?? "gemini-2.5-flash";

  try {
    const result = await ai.generate({
      model: googleAI.model(modelName),
      prompt: {
        text: `User Behavior Analysis.\nTasks:\n${JSON.stringify(tasks)}\nReflections:\n${JSON.stringify(reflections)}\nPatterns:\n${JSON.stringify(patterns)}\n\nGoal: Identify which tasks the user is struggling with. Return structured updates reducing pomodoro strain, re-titling for clarity, or splitting tasks up.`,
      },
      output: { schema: AIAdjustmentResponseSchema },
      config: { temperature: 0.3 }
    });

    if (!result.output) return { updatedTasks: [] };
    const validated = AIAdjustmentResponseSchema.safeParse(result.output);
    return validated.success ? validated.data : { updatedTasks: [] };
  } catch (err) {
    console.error("[AI Adjustment Error]", err);
    return { updatedTasks: [] };
  }
}
