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
    date: doc.date ? doc.date.toISOString() : (doc.dueDate ? doc.dueDate.toISOString() : undefined),
    status: doc.status || 'pending',
    estimatedPomodoros: doc.estimatedPomodoros ?? 1,
    completedPomodoros: doc.completedPomodoros ?? 0,
    skipCount: doc.skipCount ?? 0,
    priority: doc.priority ?? 0,
    avoidanceScore: doc.avoidanceScore ?? 0,
    lastInteractedAt: doc.lastInteractedAt ? doc.lastInteractedAt.toISOString() : undefined,
    userId: doc.userId?.toString(),
    planId: doc.planId?.toString(),
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
