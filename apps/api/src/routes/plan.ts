import { Router } from "express";
import { GeneratePlanController } from "../controllers/planController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.post("/generate", requireAuth, GeneratePlanController);

export default router;
