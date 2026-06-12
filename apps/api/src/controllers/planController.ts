// apps/api/controllers/generatePlanController.ts
import { GeneratePlanSchema, Plan as PlanType } from "@zenith/types";
import PlanModel from "../models/plan.js";
import TaskModel from "../models/task.js";
import { catchAsync, sendResponse } from "../utils/globalWrapper.js";
import { AuthenticatedRequest } from "../middlewares/requireAuth.js";
import { toPlanDTO } from "../utils/mapper.js";
import { generatePlanWithAI } from "../services/aiService.js";
import mongoose from "mongoose";
import { AppError } from "../utils/appError.js";

export const GetPlansController = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const plans = await PlanModel.find({ userId: req.user!.id }).lean();
    
    return sendResponse<any[]>(
      res,
      200,
      plans.map(p => toPlanDTO(p)),
      "Plans fetched successfully"
    );
  }
);

export const GetPlanByIdController = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const plan = await PlanModel.findOne({ _id: req.params.id, userId: req.user!.id });
    if (!plan) throw new AppError("Plan not found", 404);
    
    return sendResponse<PlanType>(res, 200, toPlanDTO(plan as any), "Plan fetched successfully");
  }
);

export const GetPlanTasksController = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const tasks = await TaskModel.find({ planId: req.params.id, userId: req.user!.id }).lean();
    
    // Quick mapper (frontend wants DTO tasks format)
    const taskDTOs = tasks.map(t => ({
      id: t._id.toString(),
      userId: t.userId,
      planId: t.planId?.toString(),
      title: t.title,
      description: t.description,
      dueDate: t.dueDate?.toISOString(),
      date: t.date?.toISOString(),
      status: t.status,
      estimatedPomodoros: t.estimatedPomodoros,
      completedPomodoros: t.completedPomodoros,
      skipCount: t.skipCount,
      priority: t.priority,
      avoidanceScore: t.avoidanceScore,
      lastInteractedAt: t.lastInteractedAt?.toISOString(),
      createdAt: t.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: t.updatedAt?.toISOString() ?? new Date().toISOString(),
    }));

    return sendResponse<any[]>(res, 200, taskDTOs, "Tasks fetched successfully");
  }
);

export const GeneratePlanController = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    // ✅ Step 1: Validate input

    const parsed = GeneratePlanSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError("Invalid input data", 400, true);
    }

    const { prompt } = parsed.data;

    // ✅ Step 2: Ensure user
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    // ✅ Step 3: Call AI service
    let aiResponse;
    try {
      aiResponse = await generatePlanWithAI(prompt);
    } catch (err) {
      console.error("AI service failed in catch block:", err);
      aiResponse = {
        planTitle: "Offline Local Override",
        tasks: [
          {
            title: "Diagnose local environment",
            description: "No structural AI models are available. Deploying fallback tasks.",
            dueDate: new Date().toISOString(),
            estimatedPomodoros: 1
          }
        ]
      };
    }

    if (!aiResponse.tasks?.length) {
      throw new AppError("AI response did not return any tasks globally", 500);
    }

    // ✅ Step 4: Prepare tasks
    const taskDocs = aiResponse.tasks.map((t) => {
      const dueDate = t.dueDate ? new Date(t.dueDate) : undefined;
      return {
        title: t.title,
        description: t.description ?? "",
        estimatedPomodoros: t.estimatedPomodoros ?? 1,
        dueDate:
          dueDate instanceof Date && !isNaN(dueDate.getTime())
            ? dueDate
            : undefined,
        userId,
      };
    });

    // ✅ Step 5: Mongo Transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const createdTasks = await TaskModel.insertMany(taskDocs, { session });

      const [planDoc] = await PlanModel.create(
        [
          {
            userId,
            title: aiResponse.planTitle ?? "Generated Plan",
            prompt,
            taskIds: createdTasks.map((t) => t._id),
          },
        ],
        { session }
      );

      // Link tasks back to Plan.
      const planId = planDoc._id;
      const tIds = createdTasks.map(t => t._id);
      await TaskModel.updateMany({ _id: { $in: tIds } }, { planId }, { session });

      await session.commitTransaction();
      session.endSession();

      // ✅ Step 6: Map to DTO
      const planDTO = toPlanDTO(planDoc);
      if (!planDTO) {
        throw new AppError("Failed to map plan data", 500);
      }

      return sendResponse<PlanType>(
        res,
        201,
        planDTO,
        "Plan created successfully"
      );
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error("DB transaction failed while creating plan:", err);
      throw new AppError("Failed to create plan", 500);
    }
  }
);
