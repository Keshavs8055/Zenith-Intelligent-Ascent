// apps/api/utils/env.ts
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.string().optional(),
  MONGO_URI: z.string(),
  GOOGLE_API_KEY: z.string().optional(), // optional but recommended
});

export const env = EnvSchema.parse(process.env);
