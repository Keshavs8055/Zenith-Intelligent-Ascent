import { Router } from "express";
import {
  EditProfileController,
  ForgotPasswordController,
  LogoutController,
  RefreshTokenController,
  ResetPasswordController,
  UserLoginController,
  UserSignUpController,
} from "../controllers/authController.js";
import { authLimiter } from "../middlewares/rateLimit.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.post("/signup", authLimiter, UserSignUpController);
router.post("/login", authLimiter, UserLoginController);
router.post("/forgot-password", ForgotPasswordController);
router.post("/reset-password", ResetPasswordController);
router.post("/refresh", RefreshTokenController);
router.post("/logout", requireAuth, LogoutController);
router.put("/profile", requireAuth, EditProfileController);

export default router;
