import { Router } from "express";
import { 
  GeneratePlanController, 
  GetPlansController,
  GetPlanByIdController,
  GetPlanTasksController
} from "../controllers/planController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.use(requireAuth);

router.get("/", GetPlansController);
router.get("/:id", GetPlanByIdController);
router.get("/:id/tasks", GetPlanTasksController);
router.post("/generate", GeneratePlanController);

export default router;
