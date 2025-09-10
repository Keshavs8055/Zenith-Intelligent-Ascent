import { z } from "zod";

export const UserPreferencesSchema = z.object({
  dailyStudyHours: z.number().min(1).max(24).default(2),
  preferredStudyTimes: z.array(z.string()).optional(),
  notificationChannel: z.enum(["email", "push", "sms", "none"]).default("push"),
});

export interface UserPreferences
  extends z.infer<typeof UserPreferencesSchema> {}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  timezone: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}
