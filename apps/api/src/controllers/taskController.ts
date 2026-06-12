import TaskModel from "../models/task.js";
import { catchAsync, sendResponse } from "../utils/globalWrapper.js";
import { AuthenticatedRequest } from "../middlewares/requireAuth.js";
import { getTodayTasks, getNextTask } from "../services/taskService.js";
import { getTodaySummary } from "../utils/summary.js";
import { AppError } from "../utils/appError.js";
import { UpdateProgressSchema, CreateTaskSchema } from "@zenith/types";
import { z } from "zod";
import TaskLogModel from "../models/taskLog.js";

// -------------------- Create New Single Task --------------------
export const CreateTaskController = catchAsync(async (req: AuthenticatedRequest, res) => {
  const parsed = CreateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError("Invalid task schema", 400, true);
  }

  const { title, description, dueDate, planId, estimatedPomodoros } = parsed.data;
  const userId = req.user!.id;

  const task = await TaskModel.create({
    userId,
    planId,
    title,
    description,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    estimatedPomodoros
  });

  return sendResponse(res, 201, task, "Task created");
});

// -------------------- Get Today Tasks & Summary --------------------
export const GetTodayTasksController = catchAsync(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  
  // The summary needs all tasks (including completed ones that are due today)
  const allTodayTasks = await getTodayTasks(userId, true);
  const summary = getTodaySummary(allTodayTasks);

  // The main list only returns pending tasks
  const pendingTasks = allTodayTasks.filter(t => t.status !== 'completed');

  return sendResponse(res, 200, { tasks: pendingTasks, summary }, "Today tasks fetched");
});

// -------------------- Get Single Promoted Next Task --------------------
export const GetNextTaskController = catchAsync(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const task = await getNextTask(userId);
  return sendResponse(res, 200, { task }, "Next task fetched");
});

// -------------------- Patch Execution Progress --------------------
export const UpdateProgressController = catchAsync(async (req: AuthenticatedRequest, res) => {
  const parsed = UpdateProgressSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError("Invalid progress update schema", 400, true);
  }

  const { action, reflection } = parsed.data;
  const userId = req.user!.id;

  const task = await TaskModel.findOne({ _id: req.params.id, userId });
  if (!task) throw new AppError("Task not found", 404);

  const now = new Date();

  if (action === "complete_pomodoro") {
    task.completedPomodoros += 1;
    task.lastInteractedAt = now;
  } else if (action === "complete_task") {
    task.status = 'completed';
    task.lastInteractedAt = now;
    
    await TaskLogModel.create({
      taskId: task._id,
      action: 'completed',
      note: reflection?.reason,
    });
  } else if (action === "skip") {
    task.skipCount += 1;
    task.avoidanceScore += 1; // Increment avoidance score on skip
    task.lastInteractedAt = now;
    
    if (reflection) {
      await TaskLogModel.create({
        taskId: task._id,
        action: 'skipped',
        note: `Reason: ${reflection.reason} | Difficulty: ${reflection.difficulty}`
      });
    }
  }

  await task.save();
  return sendResponse(res, 200, task, "Task progress updated");
});

// -------------------- Optional explicit reflection --------------------
const ReflectionPayloadSchema = z.object({
  type: z.enum(["completed", "skipped"]),
  reason: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional()
});

export const AddReflectionController = catchAsync(async (req: AuthenticatedRequest, res) => {
  const parsed = ReflectionPayloadSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError("Invalid reflection schema", 400, true);
  
  const { type, reason, difficulty } = parsed.data;
  const userId = req.user!.id;

  const task = await TaskModel.findOne({ _id: req.params.id, userId });
  if (!task) throw new AppError("Task not found", 404);

  await TaskLogModel.create({
    taskId: task._id,
    action: type === 'completed' ? 'completed' : 'skipped',
    note: `Reason: ${reason} | Difficulty: ${difficulty}`
  });

  await task.save();
  return sendResponse(res, 200, task, "Reflection added");
});
