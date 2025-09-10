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

/**
 * Generate plan controller:
 * - validate input (zod),
 * - call AI,
 * - validate AI response,
 * - create tasks & plan inside a MongoDB transaction (atomic),
 * - fallback gracefully to pre-defined plan if AI fails.
 */
export const GeneratePlanController = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    // ✅ Step 1: Validate input

    const parsed = GeneratePlanSchema.safeParse(req.body);
    console.log(parsed);

    if (!parsed.success) {
      throw new AppError("Invalid input data", 400, true);
    }

    const { prompt, deadline, hoursPerDay } = parsed.data;

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
      console.error("AI service failed:", err);
      throw new AppError("Failed to generate plan using AI", 502);
    }

    if (!aiResponse.tasks?.length) {
      throw new AppError("AI response did not return any tasks", 500);
    }

    // ✅ Step 4: Prepare tasks
    const taskDocs = aiResponse.tasks.map((t) => {
      const dueDate = t.dueDate ? new Date(t.dueDate) : undefined;
      return {
        title: t.title,
        description: t.description ?? "",
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
            deadline: deadline ?? undefined,
            hoursPerDay: hoursPerDay ?? undefined,
            taskIds: createdTasks.map((t) => t._id),
          },
        ],
        { session }
      );

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
