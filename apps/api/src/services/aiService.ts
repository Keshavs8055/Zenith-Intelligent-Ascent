import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { AIResponseSchema, AIResponse } from "@zenith/types";
import { AppError } from "../utils/appError.js";

// -------------------
// Initialize Genkit
// -------------------
const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_API_KEY || "",
    }),
  ],
});

// -------------------
// Fallback
// -------------------
const DEFAULT_FALLBACK: AIResponse = {
  planTitle: "Generated Plan (Fallback)",
  tasks: [],
};

// -------------------
// Service
// -------------------
export async function generatePlanWithAI(
  prompt: string,
  options?: { model?: string }
): Promise<AIResponse> {
  if (!prompt || prompt.trim().length === 0) {
    throw new AppError("Prompt cannot be empty", 400);
  }

  // Use the model provided in options, or default to "gemini-1.5-flash"
  const modelName = options?.model ?? "gemini-2.5-flash";

  try {
    const result = await ai.generate({
      // Use the model name from the options here
      model: googleAI.model(modelName),
      prompt: {
        text: `Generate a detailed plan for the following request:\n${prompt}`,
      },
      output: {
        schema: AIResponseSchema,
      },
      config: {
        // The model field is removed from the config object
        temperature: 0.2,
      },
    });

    if (!result.output) {
      throw new AppError("Model returned no structured output", 502);
    }

    // Defensive re-parse (to ensure safety even if Genkit misbehaves)
    const validated = AIResponseSchema.safeParse(result.output);
    if (!validated.success) {
      console.error("Schema validation error:", validated.error.format());
      throw new AppError("Invalid AI response format", 502);
    }

    return validated.data;
  } catch (err: any) {
    if (err instanceof AppError) {
      console.error("[AI Service Error]", err.message);
      throw err; // propagate known errors to controller
    }

    // Unexpected error, log full stack but return fallback
    console.error("[AI Service Fatal Error]", err);
    return DEFAULT_FALLBACK;
  }
}
