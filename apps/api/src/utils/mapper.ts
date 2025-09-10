import { Task } from "@zenith/types";
import { ITask } from "../models/task.js";
import { Plan } from "@zenith/types";

export function toTaskDTO(
  doc: ITask | (ITask & { _id: any; createdAt: any; updatedAt: any })
): Task {
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description ?? undefined,
    dueDate: doc.dueDate ? doc.dueDate.toISOString() : undefined,
    estimatedHours: doc.estimatedHours ?? undefined,
    actualTimeSpent: doc.actualTimeSpent ?? undefined,
    scheduledTime: doc.scheduledTime
      ? doc.scheduledTime.toISOString()
      : undefined,
    completed: doc.completed,
    progress: doc.progress ?? 0,
    routineId: doc.routineId ? doc.routineId.toString() : undefined,
    createdAt:
      "createdAt" in doc && doc.createdAt
        ? doc.createdAt.toISOString()
        : new Date().toISOString(),
    updatedAt:
      "updatedAt" in doc && doc.updatedAt
        ? doc.updatedAt.toISOString()
        : new Date().toISOString(),
  };
}
// apps/api/utils/mapper.ts
export function toPlanDTO(plan: any): Plan | null {
  if (!plan) return null;

  return {
    id: plan._id?.toString?.() ?? plan.id,
    userId: plan.userId?.toString?.() ?? plan.userId,
    title: plan.title,
    prompt: plan.prompt,
    taskIds: (plan.taskIds || []).map((i: any) =>
      i?.toString ? i.toString() : i
    ),
    deadline: plan.deadline
      ? (plan.deadline.toISOString?.() ?? plan.deadline)
      : undefined,
    hoursPerDay: plan.hoursPerDay ?? undefined,
    status: plan.status ?? "active",
    adaptive: plan.adaptive ?? false,
    createdAt: plan.createdAt?.toISOString?.() ?? plan.createdAt,
    updatedAt: plan.updatedAt?.toISOString?.() ?? plan.updatedAt,
  };
}
