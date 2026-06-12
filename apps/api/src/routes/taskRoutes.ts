import { Router } from "express";
import {
  GetTodayTasksController,
  GetNextTaskController,
  UpdateProgressController,
  AddReflectionController,
  CreateTaskController
} from "../controllers/taskController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.use(requireAuth); // all routes require auth

router.get("/today", GetTodayTasksController);
router.get("/next", GetNextTaskController);
router.post("/", CreateTaskController);
router.patch("/:id/progress", UpdateProgressController);
router.post("/:id/reflection", AddReflectionController);

export default router;
