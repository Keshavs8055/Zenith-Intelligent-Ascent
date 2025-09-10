import { Router } from "express";
import {
  CreateTaskController,
  GetTasksController,
  GetTaskController,
  UpdateTaskController,
  DeleteTaskController,
} from "../controllers/taskController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.use(requireAuth); // all routes require auth

router.post("/", CreateTaskController);
router.get("/", GetTasksController);
router.get("/:id", GetTaskController);
router.put("/:id", UpdateTaskController);
router.delete("/:id", DeleteTaskController);

export default router;
