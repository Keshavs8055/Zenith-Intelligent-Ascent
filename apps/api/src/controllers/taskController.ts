import TaskModel from "../models/task.js";
import { catchAsync, sendResponse } from "../utils/globalWrapper.js";
import { AuthenticatedRequest } from "../middlewares/requireAuth.js";
import { CreateTaskSchema, UpdateTaskSchema, Task } from "@zenith/types";
import { toTaskDTO } from "utils/mapper.js";

// -------------------- Create Task --------------------
export const CreateTaskController = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const parsed = CreateTaskSchema.parse(req.body);

    const taskDoc = await TaskModel.create({
      ...parsed,
      userId: req.user!.id,
    });

    // Convert mongoose doc → plain object
    const task: Task = toTaskDTO(taskDoc);

    return sendResponse<Task>(res, 201, task, "Task created successfully");
  }
);

// -------------------- Get All Tasks --------------------
export const GetTasksController = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const tasks = await TaskModel.find({ userId: req.user!.id }).lean();

    // tasks is `any` → cast to Task[]
    return sendResponse<Task[]>(
      res,
      200,
      tasks.map(toTaskDTO),
      "Tasks fetched successfully"
    );
  }
);

// -------------------- Get Single Task --------------------
export const GetTaskController = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const task = await TaskModel.findOne({
      _id: req.params.id,
      userId: req.user!.id,
    }).lean();

    if (!task) return sendResponse(res, 404, undefined, "Task not found");

    return sendResponse<Task>(
      res,
      200,
      toTaskDTO(task),
      "Task fetched successfully"
    );
  }
);

// -------------------- Update Task --------------------
export const UpdateTaskController = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const parsed = UpdateTaskSchema.parse(req.body);

    const updated = await TaskModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.id },
      parsed,
      { new: true, lean: true }
    );

    if (!updated) return sendResponse(res, 404, undefined, "Task not found");

    return sendResponse<Task>(
      res,
      200,
      toTaskDTO(updated),
      "Task updated successfully"
    );
  }
);

// -------------------- Delete Task --------------------
export const DeleteTaskController = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const deleted = await TaskModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!.id,
    }).lean();

    if (!deleted) return sendResponse(res, 404, undefined, "Task not found");

    return sendResponse<Task>(
      res,
      200,
      toTaskDTO(deleted),
      "Task deleted successfully"
    );
  }
);
